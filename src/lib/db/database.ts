import fs from "fs";
import path from "path";
import { validateUsername } from "../validation/username";

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

// In-memory cache for ultra-fast queries
let cachedDb: DatabaseSchema | null = null;

function generateSeedUsers(): Record<string, UserRecord> {
  const seedNames = [
    { name: "HabibBhai$", total: 245, fav: "benson" },
    { name: "OldDhaka#King", total: 198, fav: "sheikh" },
    { name: "Dhanmondi@7", total: 176, fav: "marlboro" },
    { name: "BensonLover$", total: 154, fav: "benson" },
    { name: "ChaiCigarette#", total: 139, fav: "gold-leaf" },
    { name: "TongiSmoker@", total: 122, fav: "derby" },
    { name: "Rony$Boss", total: 110, fav: "sheikh" },
    { name: "Mamun#Dhaka", total: 95, fav: "marpolo" },
    { name: "Shanto@Adda", total: 84, fav: "benson" },
    { name: "Gulshan#Night", total: 72, fav: "marlboro" },
    { name: "PuranaPaltan$", total: 63, fav: "gold-leaf" },
    { name: "BabuBazar@", total: 58, fav: "sheikh" },
    { name: "Mirpur10#Chai", total: 47, fav: "derby" },
    { name: "Azimpur$", total: 39, fav: "benson" },
    { name: "Farmgate@Adda", total: 31, fav: "marpolo" },
    { name: "Mohakhali#King", total: 25, fav: "sheikh" },
    { name: "Banani$Vibe", total: 18, fav: "marlboro" },
    { name: "Uttara@Sector4", total: 12, fav: "gold-leaf" },
    { name: "Rampura#Tea", total: 8, fav: "benson" },
    { name: "Shahbag$", total: 5, fav: "sheikh" },
  ];

  const users: Record<string, UserRecord> = {};
  const now = new Date().toISOString();

  seedNames.forEach((s, idx) => {
    const normalized = s.name.toLowerCase();
    users[normalized] = {
      id: `seed_${idx + 1}`,
      name: s.name,
      normalizedName: normalized,
      createdAt: now,
      totalBurnt: s.total,
      brandStats: {
        [s.fav]: Math.floor(s.total * 0.7),
        benson: Math.floor(s.total * 0.3),
      },
      lastActive: now,
    };
  });

  return users;
}

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
      // Check if bundled initial database exists in repository
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
    console.error("Error reading database, creating fresh seed database:", err);
  }

  // Create initial seed database
  const initialDb: DatabaseSchema = {
    version: 1,
    users: generateSeedUsers(),
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
    // Atomic write
    fs.writeFileSync(DB_TMP_FILE, data, "utf-8");
    fs.renameSync(DB_TMP_FILE, DB_FILE);
  } catch (err) {
    console.error("Failed to write database file:", err);
  }
}

/**
 * Checks if a username already exists in the database.
 */
export function findUser(name: string): UserRecord | null {
  const db = loadDatabase();
  const normalized = name.trim().toLowerCase();
  return db.users[normalized] || null;
}

/**
 * Registers a unique username.
 * Returns error if the name already exists or fails validation.
 */
export function createUser(name: string): { success: boolean; user?: UserRecord; error?: string } {
  const validation = validateUsername(name);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const db = loadDatabase();
  const trimmed = name.trim();
  const normalized = trimmed.toLowerCase();

  if (db.users[normalized]) {
    return {
      success: false,
      error: "এই নামটি অলরেডি নেওয়া আছে! অন্য ইউনিক নাম বাছুন।",
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

  return { success: true, user: newUser };
}

/**
 * Records a completed burnt cigarette against the specified username.
 */
export function recordBurn(params: {
  name: string;
  brandId: string;
  brandName: string;
  draws: number;
  durationSeconds: number;
}): { success: boolean; totalBurnt: number; rank: number; error?: string } {
  const db = loadDatabase();
  const normalized = params.name.trim().toLowerCase();
  let user = db.users[normalized];

  const now = new Date().toISOString();

  // If user doesn't exist yet, automatically create
  if (!user) {
    user = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: params.name.trim(),
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

  // Compute rank
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
export function getLeaderboard(
  limit: number = 1000,
  requestingUserName?: string
): {
  topUsers: LeaderboardEntry[];
  currentUser?: LeaderboardEntry;
  totalUsers: number;
} {
  const db = loadDatabase();
  const allUsers = Object.values(db.users).sort((a, b) => b.totalBurnt - a.totalBurnt);

  const reqNorm = requestingUserName?.trim().toLowerCase();

  let currentUserEntry: LeaderboardEntry | undefined;

  const topUsers: LeaderboardEntry[] = allUsers.slice(0, limit).map((u, idx) => {
    // Find favorite brand
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

  // If current user is outside top 1000, still find their rank
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

