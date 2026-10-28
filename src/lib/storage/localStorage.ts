import { APP_CONFIG } from "@/config/app.config";
import { StorageDataV1, DailyLogEntry, UserBaseline, UserPreferences } from "@/types/progress";
import { StorageDataV1Schema, ValidatedStorageData } from "@/lib/validation/schemas";

const STORAGE_KEY = "vesper_ritual_storage_v1";

export const getTodayDateKey = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getDefaultStorageData = (): StorageDataV1 => {
  const today = getTodayDateKey();
  return {
    version: 1,
    baseline: {
      dailyCigarettes: APP_CONFIG.defaults.dailyBaseline,
      targetReductionPercent: 50,
      startDate: today,
      packPrice: 14,
      currencySymbol: "$",
    },
    entries: {},
    preferences: {
      soundEnabled: APP_CONFIG.defaults.soundEnabled,
      masterVolume: APP_CONFIG.defaults.masterVolume,
      ambientSoundEnabled: true,
      ambientVolume: APP_CONFIG.defaults.ambientVolume,
      preferredDrawCount: APP_CONFIG.defaults.totalDraws,
      lastSelectedBrand: APP_CONFIG.defaults.brandId,
      lastSelectedEnvironment: APP_CONFIG.defaults.environmentId,
      reducedMotion: false,
    },
  };
};

export class StorageManager {
  private static cachedData: StorageDataV1 | null = null;

  public static load(): StorageDataV1 {
    if (typeof window === "undefined") {
      return getDefaultStorageData();
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const defaultData = getDefaultStorageData();
        this.save(defaultData);
        return defaultData;
      }

      const parsed = JSON.parse(raw);
      const validation = StorageDataV1Schema.safeParse(parsed);

      if (validation.success) {
        this.cachedData = validation.data as StorageDataV1;
        return this.cachedData;
      } else {
        console.warn("Storage validation failed; repairing with defaults", validation.error);
        const fallback = getDefaultStorageData();
        // Merge valid partials if possible
        if (parsed && typeof parsed === "object") {
          if (parsed.baseline) fallback.baseline = { ...fallback.baseline, ...parsed.baseline };
          if (parsed.preferences) fallback.preferences = { ...fallback.preferences, ...parsed.preferences };
          if (parsed.entries && typeof parsed.entries === "object") fallback.entries = parsed.entries;
        }
        this.save(fallback);
        return fallback;
      }
    } catch (err) {
      console.error("Error reading localStorage, using safe fallback:", err);
      return getDefaultStorageData();
    }
  }

  public static save(data: StorageDataV1): boolean {
    if (typeof window === "undefined") return false;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.cachedData = data;
      // Trigger a window custom event for reactive tabs
      window.dispatchEvent(new Event("vesper-storage-update"));
      return true;
    } catch (err) {
      console.error("Error writing to localStorage:", err);
      return false;
    }
  }

  public static updatePreferences(partial: Partial<UserPreferences>): UserPreferences {
    const data = this.load();
    data.preferences = { ...data.preferences, ...partial };
    this.save(data);
    return data.preferences;
  }

  public static updateBaseline(partial: Partial<UserBaseline>): UserBaseline {
    const data = this.load();
    data.baseline = { ...data.baseline, ...partial };
    this.save(data);
    return data.baseline;
  }

  public static getOrCreateTodayEntry(date: string = getTodayDateKey()): DailyLogEntry {
    const data = this.load();
    if (!data.entries[date]) {
      data.entries[date] = {
        id: `entry_${date}`,
        date,
        realCigarettes: 0,
        virtualSessions: 0,
        drawsCompleted: 0,
        cravingsManaged: 0,
        updatedAt: new Date().toISOString(),
      };
      this.save(data);
    }
    return data.entries[date];
  }

  public static recordVirtualSession(draws: number, date: string = getTodayDateKey()): DailyLogEntry {
    const data = this.load();
    const entry = this.getOrCreateTodayEntry(date);
    entry.virtualSessions += 1;
    entry.drawsCompleted += draws;
    entry.cravingsManaged += 1;
    entry.updatedAt = new Date().toISOString();
    data.entries[date] = entry;
    this.save(data);
    return entry;
  }

  public static updateRealCigarettes(count: number, date: string = getTodayDateKey()): DailyLogEntry {
    const data = this.load();
    const entry = this.getOrCreateTodayEntry(date);
    entry.realCigarettes = Math.max(0, count);
    entry.updatedAt = new Date().toISOString();
    data.entries[date] = entry;
    this.save(data);
    return entry;
  }

  public static deleteEntry(date: string): boolean {
    const data = this.load();
    if (data.entries[date]) {
      delete data.entries[date];
      this.save(data);
      return true;
    }
    return false;
  }

  public static clearAll(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      this.cachedData = null;
      window.dispatchEvent(new Event("vesper-storage-update"));
    }
  }

  public static exportJson(): string {
    const data = this.load();
    return JSON.stringify(data, null, 2);
  }

  public static importJson(jsonStr: string): { success: boolean; error?: string } {
    try {
      const parsed = JSON.parse(jsonStr);
      const validation = StorageDataV1Schema.safeParse(parsed);
      if (!validation.success) {
        return { success: false, error: "Invalid backup file structure." };
      }
      this.save(validation.data as StorageDataV1);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "Invalid JSON." };
    }
  }
}
