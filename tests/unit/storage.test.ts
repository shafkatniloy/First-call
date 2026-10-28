import { describe, it, expect, beforeEach } from "vitest";
import { StorageManager, getDefaultStorageData, getTodayDateKey } from "@/lib/storage/localStorage";

describe("Storage Manager & Local Data", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loads valid default data on initial empty storage", () => {
    const data = StorageManager.load();
    expect(data.version).toBe(1);
    expect(data.baseline.dailyCigarettes).toBeGreaterThan(0);
    expect(data.preferences.preferredDrawCount).toBe(7);
  });

  it("updates preferences safely and persists changes", () => {
    StorageManager.updatePreferences({
      preferredDrawCount: 6,
      soundEnabled: false,
      lastSelectedBrand: "navy",
    });

    const reloaded = StorageManager.load();
    expect(reloaded.preferences.preferredDrawCount).toBe(6);
    expect(reloaded.preferences.soundEnabled).toBe(false);
    expect(reloaded.preferences.lastSelectedBrand).toBe("navy");
  });

  it("records virtual session and updates today's log entry", () => {
    const today = getTodayDateKey();
    StorageManager.recordVirtualSession(7, today);

    const reloaded = StorageManager.load();
    const entry = reloaded.entries[today];
    expect(entry).toBeDefined();
    expect(entry.virtualSessions).toBe(1);
    expect(entry.drawsCompleted).toBe(7);

    // Record a second session
    StorageManager.recordVirtualSession(6, today);
    const updated = StorageManager.load().entries[today];
    expect(updated.virtualSessions).toBe(2);
    expect(updated.drawsCompleted).toBe(13);
  });

  it("updates real cigarettes count without allowing negative numbers", () => {
    const today = getTodayDateKey();
    StorageManager.updateRealCigarettes(4, today);
    expect(StorageManager.load().entries[today].realCigarettes).toBe(4);

    StorageManager.updateRealCigarettes(-5, today);
    expect(StorageManager.load().entries[today].realCigarettes).toBe(0);
  });

  it("gracefully recovers and repairs malformed or corrupted localStorage data", () => {
    localStorage.setItem("vesper_ritual_storage_v1", "{ malformed json: not valid");
    const safeData = StorageManager.load();
    expect(safeData.version).toBe(1);
    expect(safeData.baseline.dailyCigarettes).toBeDefined();
  });

  it("exports valid JSON and imports backup data", () => {
    const today = getTodayDateKey();
    StorageManager.recordVirtualSession(7, today);
    StorageManager.updateRealCigarettes(3, today);

    const exportedJson = StorageManager.exportJson();
    expect(typeof exportedJson).toBe("string");

    // Clear and restore
    localStorage.clear();
    const result = StorageManager.importJson(exportedJson);
    expect(result.success).toBe(true);

    const reloaded = StorageManager.load();
    expect(reloaded.entries[today].realCigarettes).toBe(3);
    expect(reloaded.entries[today].virtualSessions).toBe(1);
  });
});
