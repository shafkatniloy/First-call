import * as THREE from "three";

export class ProceduralTextures {
  private static cache: Map<string, THREE.CanvasTexture> = new Map();

  /**
   * Helper to create and cache a Three.js CanvasTexture from an HTML5 Canvas drawing callback
   */
  private static getOrCreate(
    key: string,
    width: number,
    height: number,
    drawFn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
  ): THREE.CanvasTexture {
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    if (typeof document === "undefined") {
      // Fallback for SSR
      const dummyCanvas = {} as HTMLCanvasElement;
      return new THREE.CanvasTexture(dummyCanvas);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      drawFn(ctx, width, height);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.cache.set(key, texture);
    return texture;
  }

  /**
   * Authentic Bengali storefront signboard
   */
  public static createBengaliSign(
    mainText: string,
    subText: string,
    tagline: string,
    bgColor: string = "#0f172a",
    textColor: string = "#f8fafc",
    accentColor: string = "#f59e0b",
    isNeon: boolean = false
  ): THREE.CanvasTexture {
    const key = `sign_${mainText}_${bgColor}_${isNeon}`;
    return this.getOrCreate(key, 512, 160, (ctx, w, h) => {
      // Background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);

      // Border frame
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 6;
      ctx.strokeRect(6, 6, w - 12, h - 12);
      ctx.lineWidth = 1.5;
      ctx.strokeRect(12, 12, w - 24, h - 24);

      // Top corner decorations
      ctx.fillStyle = accentColor;
      ctx.fillRect(14, 14, 8, 8);
      ctx.fillRect(w - 22, 14, 8, 8);
      ctx.fillRect(14, h - 22, 8, 8);
      ctx.fillRect(w - 22, h - 22, 8, 8);

      // Subtitle / Bismillah or location
      ctx.font = "bold 13px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = accentColor;
      ctx.fillText(tagline, w / 2, 30);

      // Main Bengali text
      ctx.font = "bold 44px 'Segoe UI', Arial, sans-serif";
      if (isNeon) {
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 18;
      }
      ctx.fillStyle = textColor;
      ctx.fillText(mainText, w / 2, 88);

      // Reset shadow
      ctx.shadowBlur = 0;

      // Bottom sub-text (Phone / Category)
      ctx.font = "600 15px monospace, sans-serif";
      ctx.fillStyle = accentColor;
      ctx.fillText(subText, w / 2, 128);

      // Subtle grime overlay
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      for (let i = 0; i < 400; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    });
  }

  /**
   * Wet asphalt road texture with yellow dashed line and tire wear
   */
  public static createWetRoad(): THREE.CanvasTexture {
    return this.getOrCreate("wet_road_dhaka", 512, 512, (ctx, w, h) => {
      // Base asphalt
      ctx.fillStyle = "#11141a";
      ctx.fillRect(0, 0, w, h);

      // Asphalt noise/grain
      for (let i = 0; i < 18000; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const val = Math.floor(18 + Math.random() * 24);
        ctx.fillStyle = `rgb(${val},${val + 2},${val + 4})`;
        ctx.fillRect(x, y, 2, 2);
      }

      // Yellow centerline (dashed)
      ctx.fillStyle = "#eab308";
      ctx.shadowColor = "#eab308";
      ctx.shadowBlur = 4;
      const lineWidth = 16;
      const centerX = w / 2 - lineWidth / 2;
      for (let y = 0; y < h; y += 120) {
        ctx.fillRect(centerX, y + 20, lineWidth, 70);
      }
      ctx.shadowBlur = 0;

      // Wet puddle patches (darker specularity)
      ctx.fillStyle = "rgba(4, 6, 10, 0.45)";
      ctx.beginPath();
      ctx.ellipse(140, 260, 90, 45, 0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(360, 140, 80, 35, -0.3, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /**
   * Concrete building facade texture with windows and air con units
   */
  public static createConcreteFacade(tint: string = "#3a404d"): THREE.CanvasTexture {
    return this.getOrCreate(`concrete_facade_${tint}`, 512, 512, (ctx, w, h) => {
      // Concrete background
      ctx.fillStyle = tint;
      ctx.fillRect(0, 0, w, h);

      // Concrete grit
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      for (let i = 0; i < 9000; i++) {
        ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
      }

      // Seam grid lines
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = 3;
      for (let y = 0; y <= h; y += 128) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      for (let x = 0; x <= w; x += 128) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Grime / rain drip stains
      ctx.fillStyle = "rgba(10, 14, 20, 0.25)";
      for (let x = 40; x < w; x += 110) {
        ctx.fillRect(x, 0, 12, 80 + Math.random() * 90);
      }
    });
  }

  /**
   * Metal roll-down shop shutter texture
   */
  public static createMetalShutter(shutterColor: string = "#263238"): THREE.CanvasTexture {
    return this.getOrCreate(`shutter_${shutterColor}`, 256, 256, (ctx, w, h) => {
      ctx.fillStyle = shutterColor;
      ctx.fillRect(0, 0, w, h);

      // Horizontal slats
      const slatHeight = 12;
      for (let y = 0; y < h; y += slatHeight) {
        // Highlight top of slat
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.fillRect(0, y, w, 2);

        // Shadow bottom of slat
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(0, y + slatHeight - 3, w, 3);
      }

      // Center lock latch
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(w / 2 - 12, h - 36, 24, 28);
      ctx.fillStyle = "#94a3b8";
      ctx.fillRect(w / 2 - 4, h - 22, 8, 8);
    });
  }

  /**
   * Corrugated tin roof texture
   */
  public static createCorrugatedTin(): THREE.CanvasTexture {
    return this.getOrCreate("corrugated_tin", 128, 256, (ctx, w, h) => {
      ctx.fillStyle = "#475569";
      ctx.fillRect(0, 0, w, h);

      // Vertical corrugated ribs
      const ribWidth = 14;
      for (let x = 0; x < w; x += ribWidth) {
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fillRect(x, 0, 3, h);
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.fillRect(x + ribWidth - 3, 0, 3, h);
      }

      // Rust patches
      ctx.fillStyle = "rgba(168, 75, 30, 0.35)";
      ctx.fillRect(10, 40, 30, 70);
      ctx.fillRect(70, 130, 45, 90);
    });
  }

  /**
   * Dhaka Cycle Rickshaw Folk Art Hood Texture
   */
  public static createRickshawArt(): THREE.CanvasTexture {
    return this.getOrCreate("rickshaw_art_dhaka", 256, 256, (ctx, w, h) => {
      // Bright yellow/gold background
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(0, 0, w, h);

      // Red decorative borders
      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 10;
      ctx.strokeRect(5, 5, w - 10, h - 10);

      // Green & blue peacock / lotus folk-art motifs
      ctx.fillStyle = "#059669";
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2, 55, 35, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#2563eb";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 24, 0, Math.PI * 2);
      ctx.fill();

      // White floral petals
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const px = w / 2 + Math.cos(angle) * 38;
        const py = h / 2 + Math.sin(angle) * 38;
        ctx.beginPath();
        ctx.arc(px, py, 7, 0, Math.PI * 2);
        ctx.fill();
      }

      // Center red ruby dot
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 10, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}
