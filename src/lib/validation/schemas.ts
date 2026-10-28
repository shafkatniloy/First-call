import { z } from "zod";

export const DailyLogEntrySchema = z.object({
  id: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  realCigarettes: z.number().int().min(0).max(100),
  virtualSessions: z.number().int().min(0).max(100),
  drawsCompleted: z.number().int().min(0).max(1000),
  cravingsManaged: z.number().int().min(0).max(100),
  notes: z.string().max(500).optional(),
  updatedAt: z.string(),
});

export const UserBaselineSchema = z.object({
  dailyCigarettes: z.number().int().min(0).max(100).default(12),
  targetReductionPercent: z.number().int().min(0).max(100).default(50),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  packPrice: z.number().min(0).max(100).optional().default(14),
  currencySymbol: z.string().max(5).default("$"),
});

export const UserPreferencesSchema = z.object({
  soundEnabled: z.boolean().default(true),
  masterVolume: z.number().min(0).max(1).default(0.85),
  ambientSoundEnabled: z.boolean().default(true),
  ambientVolume: z.number().min(0).max(1).default(0.45),
  preferredDrawCount: z.union([z.literal(6), z.literal(7)]).default(7),
  lastSelectedBrand: z.string().default("marlboro"),
  lastSelectedEnvironment: z.string().default("rainy-window"),
  reducedMotion: z.boolean().default(false),
});

export const StorageDataV1Schema = z.object({
  version: z.literal(1),
  baseline: UserBaselineSchema,
  entries: z.record(DailyLogEntrySchema),
  preferences: UserPreferencesSchema,
});

export type ValidatedStorageData = z.infer<typeof StorageDataV1Schema>;
