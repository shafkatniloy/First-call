export class AudioManager {
  private static instance: AudioManager | null = null;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientNode: AudioNode | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.85;
  private ambientVolume: number = 0.45;
  private activeAmbientType: string | null = null;

  private constructor() {
    // Lazy AudioContext initialization
  }

  public static getInstance(): AudioManager {
    if (!this.instance) {
      this.instance = new AudioManager();
    }
    return this.instance;
  }

  public unlock(): void {
    if (typeof window === "undefined") return;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
          this.masterGain.connect(this.ctx.destination);

          this.ambientGain = this.ctx.createGain();
          this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : this.ambientVolume, this.ctx.currentTime);
          this.ambientGain.connect(this.masterGain);
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    } catch (e) {
      console.warn("Could not initialize AudioContext:", e);
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const target = muted ? 0 : this.masterVolume;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
  }

  public setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (!this.isMuted && this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.05);
    }
  }

  public setAmbientVolume(volume: number): void {
    this.ambientVolume = Math.max(0, Math.min(1, volume));
    if (!this.isMuted && this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(this.ambientVolume, this.ctx.currentTime, 0.05);
    }
  }

  /**
   * Procedural lighter ignition sound
   */
  public playLighter(): void {
    if (this.isMuted) return;
    this.unlock();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Flint click (sharp metallic pop)
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = "square";
      clickOsc.frequency.setValueAtTime(2400, now);
      clickOsc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
      clickGain.gain.setValueAtTime(0.35, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      clickOsc.connect(clickGain);
      clickGain.connect(this.masterGain);
      clickOsc.start(now);
      clickOsc.stop(now + 0.05);

      // 2. Flame whoosh (filtered low-mid noise)
      const bufferSize = this.ctx.sampleRate * 0.45;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(450, now + 0.03);
      filter.frequency.exponentialRampToValueAtTime(220, now + 0.4);
      filter.Q.setValueAtTime(1.8, now);

      const flameGain = this.ctx.createGain();
      flameGain.gain.setValueAtTime(0.001, now + 0.02);
      flameGain.gain.linearRampToValueAtTime(0.4, now + 0.08);
      flameGain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      noiseSource.connect(filter);
      filter.connect(flameGain);
      flameGain.connect(this.masterGain);
      noiseSource.start(now + 0.02);
      noiseSource.stop(now + 0.45);
    } catch (e) {
      console.warn("Error playing lighter sound", e);
    }
  }

  /**
   * Procedural Inhale Draw & Tobacco Crackle Sound
   */
  public playInhale(durationSec: number = 2.2): void {
    if (this.isMuted) return;
    this.unlock();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * durationSec);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);

      // Mix gentle pink-ish air flow with occasional crackle impulses
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        let pink = (b0 + b1 + b2 + white * 0.5362) * 0.12;

        // Occasional crackle spike simulating dry leaf combustion
        if (Math.random() < 0.0025 && i > bufferSize * 0.15 && i < bufferSize * 0.85) {
          pink += (Math.random() * 2 - 1) * 0.65;
        }
        data[i] = pink;
      }

      const source = this.ctx.createBufferSource();
      source.buffer = noiseBuffer;

      // Filter sweeps from soft intake up to warm ember sizzle
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.linearRampToValueAtTime(750, now + durationSec * 0.6);
      filter.frequency.exponentialRampToValueAtTime(420, now + durationSec);
      filter.Q.setValueAtTime(2.2, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.48, now + durationSec * 0.35);
      gain.gain.setValueAtTime(0.45, now + durationSec * 0.75);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      source.start(now);
      source.stop(now + durationSec);
    } catch (e) {
      console.warn("Error playing inhale sound", e);
    }
  }

  /**
   * Procedural Exhale / Recovery sound
   */
  public playExhale(durationSec: number = 1.6): void {
    if (this.isMuted) return;
    this.unlock();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * durationSec);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.15;
      }

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(500, now);
      filter.frequency.exponentialRampToValueAtTime(150, now + durationSec);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      source.start(now);
      source.stop(now + durationSec);
    } catch (e) {
      console.warn("Error playing exhale sound", e);
    }
  }

  /**
   * Ambient soundscape loop
   */
  public startAmbient(type: "rain-window" | "night-breeze" | "fog-terrace"): void {
    if (typeof window === "undefined") return;
    if (this.activeAmbientType === type && this.ambientNode) return;
    this.stopAmbient();
    this.unlock();
    if (!this.ctx || !this.ambientGain) return;

    try {
      this.activeAmbientType = type;
      const sampleRate = this.ctx.sampleRate;
      const loopDuration = 6.0; // 6-second seamless noise buffer
      const bufferSize = Math.floor(sampleRate * loopDuration);
      const buffer = this.ctx.createBuffer(2, bufferSize, sampleRate);

      const left = buffer.getChannelData(0);
      const right = buffer.getChannelData(1);

      for (let i = 0; i < bufferSize; i++) {
        const whiteL = Math.random() * 2 - 1;
        const whiteR = Math.random() * 2 - 1;

        if (type === "rain-window") {
          // Rain drops hitting glass
          const isDrop = Math.random() < 0.0008;
          left[i] = whiteL * 0.08 + (isDrop ? Math.random() * 0.3 : 0);
          right[i] = whiteR * 0.08 + (isDrop ? Math.random() * 0.3 : 0);
        } else if (type === "night-breeze") {
          // Slow night breeze
          const mod = Math.sin((i / bufferSize) * Math.PI * 4) * 0.3 + 0.7;
          left[i] = whiteL * 0.05 * mod;
          right[i] = whiteR * 0.05 * mod;
        } else {
          // Fog terrace night air
          left[i] = whiteL * 0.04;
          right[i] = whiteR * 0.04;
        }
      }

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = this.ctx.createBiquadFilter();
      if (type === "rain-window") {
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      } else {
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(450, this.ctx.currentTime);
      }

      source.connect(filter);
      filter.connect(this.ambientGain);
      source.start();
      this.ambientNode = source;
    } catch (e) {
      console.warn("Error starting ambient sound", e);
    }
  }

  public stopAmbient(): void {
    if (this.ambientNode) {
      try {
        (this.ambientNode as any).stop();
        this.ambientNode.disconnect();
      } catch (e) {
        // Ignored
      }
      this.ambientNode = null;
    }
    this.activeAmbientType = null;
  }

  /**
   * Session completion harmonic chime
   */
  public playCompletion(): void {
    if (this.isMuted) return;
    this.unlock();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      // Frequencies for a calming meditative chord: A4 (440), C#5 (554.37), E5 (659.25)
      const freqs = [440, 554.37, 659.25];

      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18 / (idx + 1), now + idx * 0.08 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + idx * 0.08);
        osc.stop(now + 3.0);
      });
    } catch (e) {
      console.warn("Error playing completion chime", e);
    }
  }
}

export const audioManager = AudioManager.getInstance();
