import fs from "fs";
import path from "path";
import { validateUsername } from "../validation/username";
import { getSupabase, isSupabaseConfigured } from "./supabase";

export interface UserRecord {
  id: string;
  name: string;
  normalizedName: string;
  createdAt: string;
  totalBurnt: number;
  brandStats: Record<string, number>;
  lastActive: string;
}

export interface BurnRecord {
  id: string;
  userName: string;
  brandId: string;
  brandName: string;
  draws: number;
  durationSeconds: number;
  timestamp: string;
}

export interface DatabaseSchema {
  version: 1;
  users: Record<string, UserRecord>; // keyed by normalizedName
  burns: BurnRecord[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  totalBurnt: number;
  favoriteBrand: string;
  brandStats: Record<string, number>;
  lastActive: string;
  isCurrentUser?: boolean;
}

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY);
const DB_DIR = isServerless ? path.join("/tmp", "vesper_data") : path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "database.json");
const DB_TMP_FILE = path.join(DB_DIR, "database.tmp.json");

// In-memory cache for ultra-fast local queries
let cachedDb: DatabaseSchema | null = null;

export function loadDatabase(): DatabaseSchema {
  if (cachedDb) return cachedDb;

  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 1 && parsed.users) {
        cachedDb = parsed;
        return parsed;
      }
    } else if (isServerless) {
      const bundledDb = path.join(process.cwd(), "data", "database.json");
      if (fs.existsSync(bundledDb)) {
        const raw = fs.readFileSync(bundledDb, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === 1 && parsed.users) {
          saveDatabase(parsed);
          return parsed;
        }
      }
    }
  } catch (err) {
    console.error("Error reading database, creating clean empty database:", err);
  }

  const initialDb: DatabaseSchema = {
    version: 1,
    users: {},
    burns: [],
  };

  saveDatabase(initialDb);
  cachedDb = initialDb;
  return initialDb;
}

export function saveDatabase(db: DatabaseSchema): void {
  cachedDb = db;
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    const data = JSON.stringify(db, null, 2);
    fs.writeFileSync(DB_TMP_FILE, data, "utf-8");
    fs.renameSync(DB_TMP_FILE, DB_FILE);
  } catch (err) {
    console.error("Failed to write database file:", err);
  }
}

/**
 * Checks if a username already exists in the database.
 */
export async function findUser(name: string): Promise<UserRecord | null> {
  const trimmed = name.trim();
  const normalized = trimmed.toLowerCase();

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("normalized_name", normalized)
        .maybeSingle();

      if (error) {
        console.error("Supabase findUser error:", error);
      } else if (data) {
        return {
          id: data.id,
          name: data.name,
          normalizedName: data.normalized_name,
          createdAt: data.created_at,
          totalBurnt: Number(data.total_burnt) || 0,
          brandStats: data.brand_stats || {},
          lastActive: data.last_active,
        };
      }
      return null;
    } catch (err) {
      console.error("Supabase findUser exception, falling back to local:", err);
    }
  }

  const db = loadDatabase();
  return db.users[normalized] || null;
}

/**
 * Registers a new username or logs in an existing user.
 * If the username already exists in the database, recognizes them as returning (Welcome Back)
 * and continues registering next cigarettes against their existing account.
 */
export async function createUser(name: string): Promise<{
  success: boolean;
  user?: UserRecord;
  isReturning?: boolean;
  message?: string;
  error?: string;
}> {
  const validation = validateUsername(name);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const trimmed = name.trim();
  const normalized = trimmed.toLowerCase();

  const supabase = getSupabase();
  if (supabase) {
    try {
      const existing = await findUser(trimmed);
      if (existing) {
        return {
          success: true,
          user: existing,
          isReturning: true,
          message: `Welcome back @${existing.name}!`,
        };
      }

      const now = new Date().toISOString();
      const newId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const { data, error } = await supabase
        .from("users")
        .insert({
          id: newId,
          name: trimmed,
          normalized_name: normalized,
          total_burnt: 0,
          brand_stats: {},
          created_at: now,
          last_active: now,
        })
        .select()
        .single();

      if (error) {
        // If conflict occurs concurrently, fetch existing
        if (error.code === "23505") {
          const conflictUser = await findUser(trimmed);
          if (conflictUser) {
            return {
              success: true,
              user: conflictUser,
              isReturning: true,
              message: `Welcome back @${conflictUser.name}!`,
            };
          }
        }
        console.error("Supabase createUser error:", error);
        return { success: false, error: "Failed to create user in database" };
      }

      const createdUser: UserRecord = {
        id: data.id,
        name: data.name,
        normalizedName: data.normalized_name,
        createdAt: data.created_at,
        totalBurnt: Number(data.total_burnt) || 0,
        brandStats: data.brand_stats || {},
        lastActive: data.last_active,
      };

      return {
        success: true,
        user: createdUser,
        isReturning: false,
        message: `Welcome @${createdUser.name}!`,
      };
    } catch (err) {
      console.error("Supabase createUser exception, falling back to local:", err);
    }
  }

  // Local JSON Fallback
  const db = loadDatabase();
  if (db.users[normalized]) {
    const existingUser = db.users[normalized];
    return {
      success: true,
      user: existingUser,
      isReturning: true,
      message: `Welcome back @${existingUser.name}!`,
    };
  }

  const now = new Date().toISOString();
  const newUser: UserRecord = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: trimmed,
    normalizedName: normalized,
    createdAt: now,
    totalBurnt: 0,
    brandStats: {},
    lastActive: now,
  };

  db.users[normalized] = newUser;
  saveDatabase(db);

  return {
    success: true,
    user: newUser,
    isReturning: false,
    message: `Welcome @${newUser.name}!`,
  };
}

/**
 * Records a completed burnt cigarette against the specified username.
 */
export async function recordBurn(params: {
  name: string;
  brandId: string;
  brandName: string;
  draws: number;
  durationSeconds: number;
}): Promise<{ success: boolean; totalBurnt: number; rank: number; error?: string }> {
  const trimmed = params.name.trim();
  const normalized = trimmed.toLowerCase();

  const supabase = getSupabase();
  if (supabase) {
    try {
      let user = await findUser(trimmed);
      const now = new Date().toISOString();

      if (!user) {
        const createRes = await createUser(trimmed);
        if (!createRes.success || !createRes.user) {
          return { success: false, totalBurnt: 0, rank: 0, error: createRes.error };
        }
        user = createRes.user;
      }

      const newTotal = user.totalBurnt + 1;
      const newBrandStats = {
        ...user.brandStats,
        [params.brandId]: (user.brandStats[params.brandId] || 0) + 1,
      };

      // 1. Insert burn log
      await supabase.from("burns").insert({
        id: `burn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        user_name: user.name,
        brand_id: params.brandId,
        brand_name: params.brandName,
        draws: params.draws,
        duration_seconds: params.durationSeconds,
        timestamp: now,
      });

      // 2. Update user totals
      await supabase
        .from("users")
        .update({
          total_burnt: newTotal,
          brand_stats: newBrandStats,
          last_active: now,
        })
        .eq("normalized_name", normalized);

      // 3. Compute rank (number of users with total_burnt > newTotal + 1)
      const { count } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .gt("total_burnt", newTotal);

      const rank = (count ?? 0) + 1;
      return {
        success: true,
        totalBurnt: newTotal,
        rank,
      };
    } catch (err) {
      console.error("Supabase recordBurn exception, falling back to local:", err);
    }
  }

  // Local JSON Fallback
  const db = loadDatabase();
  let user = db.users[normalized];
  const now = new Date().toISOString();

  if (!user) {
    user = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: trimmed,
      normalizedName: normalized,
      createdAt: now,
      totalBurnt: 0,
      brandStats: {},
      lastActive: now,
    };
    db.users[normalized] = user;
  }

  user.totalBurnt += 1;
  user.lastActive = now;
  user.brandStats[params.brandId] = (user.brandStats[params.brandId] || 0) + 1;

  const burnEvent: BurnRecord = {
    id: `burn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userName: user.name,
    brandId: params.brandId,
    brandName: params.brandName,
    draws: params.draws,
    durationSeconds: params.durationSeconds,
    timestamp: now,
  };

  db.burns.push(burnEvent);
  saveDatabase(db);

  const allUsers = Object.values(db.users).sort((a, b) => b.totalBurnt - a.totalBurnt);
  const rank = allUsers.findIndex((u) => u.normalizedName === normalized) + 1;

  return {
    success: true,
    totalBurnt: user.totalBurnt,
    rank: rank > 0 ? rank : allUsers.length,
  };
}

/**
 * Returns the top users (up to limit, e.g. 1000) sorted by totalBurnt descending.
 */
export async function getLeaderboard(
  limit: number = 1000,
  requestingUserName?: string
): Promise<{
  topUsers: LeaderboardEntry[];
  currentUser?: LeaderboardEntry;
  totalUsers: number;
}> {
  const reqNorm = requestingUserName?.trim().toLowerCase();

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, count, error } = await supabase
        .from("users")
        .select("*", { count: "exact" })
        .order("total_burnt", { ascending: false })
        .order("last_active", { ascending: true })
        .limit(limit);

      if (!error && data) {
        let currentUserEntry: LeaderboardEntry | undefined;

        const topUsers: LeaderboardEntry[] = data.map((u, idx) => {
          let favBrand = "benson";
          let maxCount = -1;
          const stats = (u.brand_stats as Record<string, number>) || {};
          for (const [brand, bCount] of Object.entries(stats)) {
            if (Number(bCount) > maxCount) {
              maxCount = Number(bCount);
              favBrand = brand;
            }
          }

          const isCurrent = reqNorm ? u.normalized_name === reqNorm : false;
          const entry: LeaderboardEntry = {
            rank: idx + 1,
            name: u.name,
            totalBurnt: Number(u.total_burnt) || 0,
            favoriteBrand: favBrand,
            brandStats: stats,
            lastActive: u.last_active,
            isCurrentUser: isCurrent,
          };

          if (isCurrent) {
            currentUserEntry = entry;
          }

          return entry;
        });

        // If current user is requested but not in the top slice, find their specific rank
        if (reqNorm && !currentUserEntry) {
          const user = await findUser(requestingUserName!);
          if (user) {
            const { count: higherCount } = await supabase
              .from("users")
              .select("*", { count: "exact", head: true })
              .gt("total_burnt", user.totalBurnt);

            let favBrand = "benson";
            let maxCount = -1;
            for (const [brand, bCount] of Object.entries(user.brandStats)) {
              if (bCount > maxCount) {
                maxCount = bCount;
                favBrand = brand;
              }
            }

            currentUserEntry = {
              rank: (higherCount ?? 0) + 1,
              name: user.name,
              totalBurnt: user.totalBurnt,
              favoriteBrand: favBrand,
              brandStats: user.brandStats,
              lastActive: user.lastActive,
              isCurrentUser: true,
            };
          }
        }

        return {
          topUsers,
          currentUser: currentUserEntry,
          totalUsers: count || topUsers.length,
        };
      }
    } catch (err) {
      console.error("Supabase getLeaderboard exception, falling back to local:", err);
    }
  }

  // Local JSON Fallback
  const db = loadDatabase();
  const allUsers = Object.values(db.users).sort((a, b) => b.totalBurnt - a.totalBurnt);

  let currentUserEntry: LeaderboardEntry | undefined;

  const topUsers: LeaderboardEntry[] = allUsers.slice(0, limit).map((u, idx) => {
    let favBrand = "benson";
    let maxCount = -1;
    for (const [brand, count] of Object.entries(u.brandStats)) {
      if (count > maxCount) {
        maxCount = count;
        favBrand = brand;
      }
    }

    const isCurrent = reqNorm ? u.normalizedName === reqNorm : false;
    const entry: LeaderboardEntry = {
      rank: idx + 1,
      name: u.name,
      totalBurnt: u.totalBurnt,
      favoriteBrand: favBrand,
      brandStats: u.brandStats,
      lastActive: u.lastActive,
      isCurrentUser: isCurrent,
    };

    if (isCurrent) {
      currentUserEntry = entry;
    }

    return entry;
  });

  if (reqNorm && !currentUserEntry) {
    const userIndex = allUsers.findIndex((u) => u.normalizedName === reqNorm);
    if (userIndex !== -1) {
      const u = allUsers[userIndex];
      let favBrand = "benson";
      let maxCount = -1;
      for (const [brand, count] of Object.entries(u.brandStats)) {
        if (count > maxCount) {
          maxCount = count;
          favBrand = brand;
        }
      }
      currentUserEntry = {
        rank: userIndex + 1,
        name: u.name,
        totalBurnt: u.totalBurnt,
        favoriteBrand: favBrand,
        brandStats: u.brandStats,
        lastActive: u.lastActive,
        isCurrentUser: true,
      };
    }
  }

  return {
    topUsers,
    currentUser: currentUserEntry,
    totalUsers: allUsers.length,
  };
}
