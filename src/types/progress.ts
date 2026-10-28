export interface DailyLogEntry {
  id: string;
  date: string; // ISO date 'YYYY-MM-DD'
  realCigarettes: number;
  virtualSessions: number;
  drawsCompleted: number;
  cravingsManaged: number;
  notes?: string;
  updatedAt: string;
}

export interface UserBaseline {
  dailyCigarettes: number;
  targetReductionPercent: number; // e.g. 50%
  startDate: string; // 'YYYY-MM-DD'
  packPrice?: number;
  currencySymbol?: string;
}

export interface UserPreferences {
  soundEnabled: boolean;
  masterVolume: number; // 0.0 to 1.0
  ambientSoundEnabled: boolean;
  ambientVolume: number; // 0.0 to 1.0
  preferredDrawCount: 6 | 7;
  lastSelectedBrand: string;
  lastSelectedEnvironment: string;
  reducedMotion: boolean;
}

export interface StorageDataV1 {
  version: 1;
  baseline: UserBaseline;
  entries: Record<string, DailyLogEntry>; // keyed by 'YYYY-MM-DD'
  preferences: UserPreferences;
}
