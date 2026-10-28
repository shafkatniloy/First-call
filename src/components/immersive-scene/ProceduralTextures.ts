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
   * Organic Human Skin Texture with knuckle creases and natural skin pores
   */
  public static createOrganicSkinTexture(): THREE.CanvasTexture {
    return this.getOrCreate("organic_skin_texture", 512, 512, (ctx, w, h) => {
      // Base natural skin gradient (palm warmth to outer skin tone)
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#d19275"); // Warm peach-tan
      grad.addColorStop(0.5, "#c68567");
      grad.addColorStop(1, "#b57255");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Micro skin pores & grain
      for (let i = 0; i < 15000; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const val = Math.random() > 0.5 ? 255 : 0;
        ctx.fillStyle = val === 255 ? "rgba(255, 230, 220, 0.05)" : "rgba(80, 30, 15, 0.04)";
        ctx.fillRect(x, y, 1.5, 1.5);
      }

      // Knuckle creases & joint lines
      ctx.strokeStyle = "rgba(110, 45, 25, 0.35)";
      ctx.lineWidth = 2;
      for (let y = 80; y < h; y += 110) {
        ctx.beginPath();
        ctx.moveTo(30, y);
        ctx.bezierCurveTo(w * 0.3, y - 6, w * 0.7, y + 6, w - 30, y);
        ctx.stroke();

        ctx.strokeStyle = "rgba(110, 45, 25, 0.2)";
        ctx.beginPath();
        ctx.moveTo(40, y + 6);
        ctx.bezierCurveTo(w * 0.3, y + 2, w * 0.7, y + 10, w - 40, y + 6);
        ctx.stroke();
      }

      // Fingertip pad capillary flush
      const padGrad = ctx.createRadialGradient(w / 2, h - 60, 10, w / 2, h - 60, 80);
      padGrad.addColorStop(0, "rgba(215, 95, 80, 0.3)");
      padGrad.addColorStop(1, "rgba(215, 95, 80, 0)");
      ctx.fillStyle = padGrad;
      ctx.fillRect(0, h - 140, w, 140);
    });
  }

  /**
   * Ultra-Realistic Cigarette Paper & Filter Texture
   */
  public static createCigaretteTexture(filterTone: "cork" | "white" | "gold-band" | "charcoal" = "cork"): THREE.CanvasTexture {
    return this.getOrCreate(`cig_paper_${filterTone}`, 512, 256, (ctx, w, h) => {
      // 1. Filter Section (Left 35% of texture)
      const filterWidth = Math.floor(w * 0.35);

      if (filterTone === "cork" || filterTone === "gold-band") {
        // Cork background
        ctx.fillStyle = "#c27d42";
        ctx.fillRect(0, 0, filterWidth, h);

        // Cork speckled pores
        for (let i = 0; i < 2400; i++) {
          const px = Math.random() * filterWidth;
          const py = Math.random() * h;
          ctx.fillStyle = Math.random() > 0.4 ? "rgba(90, 45, 15, 0.45)" : "rgba(240, 180, 120, 0.35)";
          ctx.fillRect(px, py, Math.random() * 2 + 1, Math.random() * 3 + 1);
        }
      } else if (filterTone === "white") {
        ctx.fillStyle = "#f1f5f9";
        ctx.fillRect(0, 0, filterWidth, h);
      } else {
        // Charcoal filter
        ctx.fillStyle = "#27272a";
        ctx.fillRect(0, 0, filterWidth, h);
      }

      // Gold divider ring between filter and paper
      ctx.fillStyle = "#eab308";
      ctx.fillRect(filterWidth - 6, 0, 6, h);
      ctx.fillStyle = "#fef08a";
      ctx.fillRect(filterWidth - 4, 0, 2, h);

      // 2. White Paper Body Section (Right 65% of texture)
      ctx.fillStyle = "#fafaf9";
      ctx.fillRect(filterWidth, 0, w - filterWidth, h);

      // Faint horizontal rolling paper watermarks (rib lines)
      ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
      ctx.lineWidth = 1;
      for (let x = filterWidth + 10; x < w - 20; x += 12) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // 3. Charred burning edge at the far right
      const burnGrad = ctx.createLinearGradient(w - 25, 0, w, 0);
      burnGrad.addColorStop(0, "rgba(250, 250, 249, 0)");
      burnGrad.addColorStop(0.4, "rgba(95, 45, 15, 0.6)");
      burnGrad.addColorStop(0.7, "rgba(40, 20, 10, 0.9)");
      burnGrad.addColorStop(1, "rgba(15, 15, 15, 1)");
      ctx.fillStyle = burnGrad;
      ctx.fillRect(w - 25, 0, 25, h);
    });
  }

  /**
   * Realistic Burning Ember & Ash Texture (Charcoal & glowing fire core)
   */
  public static createEmberTexture(): THREE.CanvasTexture {
    return this.getOrCreate("cig_ember_ash_texture", 256, 256, (ctx, w, h) => {
      // Base glowing hot core
      const fireGrad = ctx.createRadialGradient(w / 2, h / 2, 8, w / 2, h / 2, 120);
      fireGrad.addColorStop(0, "#ffffff"); // White-hot center
      fireGrad.addColorStop(0.2, "#ffdd44");
      fireGrad.addColorStop(0.5, "#ff4d00"); // Red-orange fire
      fireGrad.addColorStop(0.8, "#851e00");
      fireGrad.addColorStop(1, "#18181b");
      ctx.fillStyle = fireGrad;
      ctx.fillRect(0, 0, w, h);

      // Gray and black ash patches covering portions of the ember
      for (let i = 0; i < 40; i++) {
        const ax = Math.random() * w;
        const ay = Math.random() * h;
        const aRad = 10 + Math.random() * 25;
        const ashGrad = ctx.createRadialGradient(ax, ay, 2, ax, ay, aRad);
        ashGrad.addColorStop(0, "rgba(180, 185, 195, 0.95)"); // Pale ash
        ashGrad.addColorStop(0.6, "rgba(80, 85, 95, 0.85)");
        ashGrad.addColorStop(1, "rgba(30, 30, 35, 0)");
        ctx.fillStyle = ashGrad;
        ctx.beginPath();
        ctx.arc(ax, ay, aRad, 0, Math.PI * 2);
        ctx.fill();
      }

      // Crack lines through the ash where glowing coal peeks through
      ctx.strokeStyle = "rgba(255, 180, 50, 0.9)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(w / 2 + (Math.random() - 0.5) * 30, h / 2 + (Math.random() - 0.5) * 30);
        ctx.lineTo(w / 2 + (Math.random() - 0.5) * 100, h / 2 + (Math.random() - 0.5) * 100);
        ctx.stroke();
      }
    });
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
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 6;
      ctx.strokeRect(6, 6, w - 12, h - 12);
      ctx.lineWidth = 1.5;
      ctx.strokeRect(12, 12, w - 24, h - 24);

      ctx.fillStyle = accentColor;
      ctx.fillRect(14, 14, 8, 8);
      ctx.fillRect(w - 22, 14, 8, 8);
      ctx.fillRect(14, h - 22, 8, 8);
      ctx.fillRect(w - 22, h - 22, 8, 8);

      ctx.font = "bold 13px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = accentColor;
      ctx.fillText(tagline, w / 2, 30);

      ctx.font = "bold 44px 'Segoe UI', Arial, sans-serif";
      if (isNeon) {
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 18;
      }
      ctx.fillStyle = textColor;
      ctx.fillText(mainText, w / 2, 88);
      ctx.shadowBlur = 0;

      ctx.font = "600 15px monospace, sans-serif";
      ctx.fillStyle = accentColor;
      ctx.fillText(subText, w / 2, 128);

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
      ctx.fillStyle = "#11141a";
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 18000; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const val = Math.floor(18 + Math.random() * 24);
        ctx.fillStyle = `rgb(${val},${val + 2},${val + 4})`;
        ctx.fillRect(x, y, 2, 2);
      }

      ctx.fillStyle = "#eab308";
      ctx.shadowColor = "#eab308";
      ctx.shadowBlur = 4;
      const lineWidth = 16;
      const centerX = w / 2 - lineWidth / 2;
      for (let y = 0; y < h; y += 120) {
        ctx.fillRect(centerX, y + 20, lineWidth, 70);
      }
      ctx.shadowBlur = 0;

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
   * Concrete building facade texture
   */
  public static createConcreteFacade(tint: string = "#3a404d"): THREE.CanvasTexture {
    return this.getOrCreate(`concrete_facade_${tint}`, 512, 512, (ctx, w, h) => {
      ctx.fillStyle = tint;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "rgba(0,0,0,0.12)";
      for (let i = 0; i < 9000; i++) {
        ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
      }

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

      const slatHeight = 12;
      for (let y = 0; y < h; y += slatHeight) {
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.fillRect(0, y, w, 2);
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(0, y + slatHeight - 3, w, 3);
      }

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

      const ribWidth = 14;
      for (let x = 0; x < w; x += ribWidth) {
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fillRect(x, 0, 3, h);
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.fillRect(x + ribWidth - 3, 0, 3, h);
      }

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
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 10;
      ctx.strokeRect(5, 5, w - 10, h - 10);

      ctx.fillStyle = "#059669";
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2, 55, 35, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#2563eb";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const px = w / 2 + Math.cos(angle) * 38;
        const py = h / 2 + Math.sin(angle) * 38;
        ctx.beginPath();
        ctx.arc(px, py, 7, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 10, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}
