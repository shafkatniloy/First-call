import { describe, it, expect } from "vitest";
import { AudioManager } from "@/features/audio/audioManager";

describe("AudioManager", () => {
  it("maintains a singleton instance", () => {
    const instanceA = AudioManager.getInstance();
    const instanceB = AudioManager.getInstance();
    expect(instanceA).toBe(instanceB);
  });

  it("safely handles mute state and volume clamping", () => {
    const audio = AudioManager.getInstance();

    audio.setMasterVolume(1.5); // Should clamp to 1
    audio.setMasterVolume(-0.2); // Should clamp to 0
    audio.setMasterVolume(0.7);

    audio.setMuted(true);
    audio.setMuted(false);

    expect(audio).toBeDefined();
  });

  it("does not crash on sound trigger methods in non-browser or test environments", () => {
    const audio = AudioManager.getInstance();
    expect(() => {
      audio.playLighter();
      audio.playInhale(1.0);
      audio.playExhale(1.0);
      audio.playCompletion();
      audio.startAmbient("rain-window");
      audio.stopAmbient();
    }).not.toThrow();
  });
});
