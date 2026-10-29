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
  /**
   * Authentic Brand Filter Tipping Texture (Cork, White, Gold Band, Charcoal with Metallic Separator Ring)
   */
  public static createBrandFilterTexture(
    brandId: string,
    filterTone: "cork" | "white" | "gold-band" | "charcoal" = "cork",
    accentColor: string = "#f59e0b"
  ): THREE.CanvasTexture {
    return this.getOrCreate(`filter_tipping_v2_${brandId}_${filterTone}`, 512, 256, (ctx, w, h) => {
      // 1. Base Tipping Background
      if (filterTone === "cork") {
        // Natural rich cork
        const corkGrad = ctx.createLinearGradient(0, 0, 0, h);
        corkGrad.addColorStop(0, "#c27d42");
        corkGrad.addColorStop(0.5, "#ba7339");
        corkGrad.addColorStop(1, "#ab6831");
        ctx.fillStyle = corkGrad;
        ctx.fillRect(0, 0, w, h);

        // Natural cork pores & flecks
        for (let i = 0; i < 3000; i++) {
          const px = Math.random() * w;
          const py = Math.random() * h;
          const isDark = Math.random() > 0.4;
          ctx.fillStyle = isDark ? "rgba(85, 40, 15, 0.45)" : "rgba(245, 185, 125, 0.35)";
          ctx.fillRect(px, py, Math.random() * 2.5 + 1, Math.random() * 2 + 1);
        }
      } else if (filterTone === "white") {
        // Crisp matte white tipping paper
        const whiteGrad = ctx.createLinearGradient(0, 0, 0, h);
        whiteGrad.addColorStop(0, "#f8fafc");
        whiteGrad.addColorStop(1, "#f1f5f9");
        ctx.fillStyle = whiteGrad;
        ctx.fillRect(0, 0, w, h);

        // Faint paper texture
        ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
        for (let i = 0; i < 1500; i++) {
          ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
        }
      } else if (filterTone === "charcoal") {
        // Recessed charcoal matte slate
        ctx.fillStyle = "#27272a";
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
        for (let i = 0; i < 2000; i++) {
          ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
        }
      } else {
        // Gold-band / ivory
        ctx.fillStyle = "#faf6ed";
        ctx.fillRect(0, 0, w, h);
      }

      // 2. Authentic Brand Separator Foil Band at TOP edge (meeting white paper at v = 1.0, y = 0)
      const bandHeight = 24;
      const bandY = 0;

      if (brandId === "sheikh") {
        // Emerald green & gold double band
        ctx.fillStyle = "#059669";
        ctx.fillRect(0, bandY, w, 10);
        ctx.fillStyle = "#eab308";
        ctx.fillRect(0, bandY + 10, w, 12);
        ctx.fillStyle = "#fef08a";
        ctx.fillRect(0, bandY + 12, w, 3);
      } else if (brandId === "navy") {
        // Silver & oceanic blue dual band
        ctx.fillStyle = "#0284c7";
        ctx.fillRect(0, bandY, w, 8);
        ctx.fillStyle = "#e2e8f0";
        ctx.fillRect(0, bandY + 8, w, 14);
      } else if (brandId === "star") {
        // Ruby red & gold ring
        ctx.fillStyle = "#e11d48";
        ctx.fillRect(0, bandY, w, 10);
        ctx.fillStyle = "#eab308";
        ctx.fillRect(0, bandY + 10, w, 12);
      } else if (brandId === "dunhill") {
        // Imperial purple & polished silver ring
        ctx.fillStyle = "#7c3aed";
        ctx.fillRect(0, bandY, w, 8);
        ctx.fillStyle = "#e2e8f0";
        ctx.fillRect(0, bandY + 8, w, 14);
      } else if (brandId === "lucky-strike") {
        // Fine crimson band
        ctx.fillStyle = "#dc2626";
        ctx.fillRect(0, bandY + 6, w, 16);
      } else {
        // Classic polished gold foil ring (Benson, Marlboro Red/Gold, Camel)
        const gold = ctx.createLinearGradient(0, bandY, 0, h);
        gold.addColorStop(0, "#ca8a04");
        gold.addColorStop(0.3, "#fde047");
        gold.addColorStop(0.7, "#eab308");
        gold.addColorStop(1, "#a16207");
        ctx.fillStyle = gold;
        ctx.fillRect(0, bandY, w, bandHeight);

        // Highlight stripe
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.fillRect(0, bandY + 4, w, 3);
      }
    });
  }

  /**
   * Authentic Brand Cigarette Paper Texture with Real-Life Typography, Crest, and Brand Coloring
   */
  public static createBrandPaperTexture(brand: {
    id: string;
    name: string;
    accentColor: string;
    packStyle?: any;
  }): THREE.CanvasTexture {
    return this.getOrCreate(`cig_paper_branded_v2_${brand.id}`, 1024, 512, (ctx, w, h) => {
      // 1. Pristine Linen/Flax Cigarette Paper Base
      ctx.fillStyle = "#fbfbfa";
      ctx.fillRect(0, 0, w, h);

      // Fine horizontal paper laid lines (watermarks / verge lines across rolling paper)
      ctx.strokeStyle = "rgba(0, 0, 0, 0.038)";
      ctx.lineWidth = 1;
      for (let y = 8; y < h; y += 14) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 2. Stamped Brand Name & Crest right above the filter junction
      // Repeated at 2 locations across circumference (x = 256 and x = 768) for 360° visibility
      const stampCenters = [w * 0.25, w * 0.75];

      stampCenters.forEach((cx) => {
        ctx.save();

        if (brand.id === "marlboro") {
          // Iconic Marlboro Red Chevron Crest
          ctx.fillStyle = "#dc2626";
          ctx.beginPath();
          ctx.moveTo(cx - 28, 375);
          ctx.lineTo(cx, 402);
          ctx.lineTo(cx + 28, 375);
          ctx.lineTo(cx + 28, 357);
          ctx.lineTo(cx - 28, 357);
          ctx.closePath();
          ctx.fill();

          // Authentic Marlboro Serif Wordmark
          ctx.fillStyle = "#111111";
          ctx.font = "900 32px 'Playfair Display', Georgia, serif";
          ctx.textAlign = "center";
          ctx.fillText("Marlboro", cx, 442);

          // Red accent underline & descriptor
          ctx.fillStyle = "#dc2626";
          ctx.fillRect(cx - 32, 450, 64, 2.5);
          ctx.font = "bold 11px sans-serif";
          ctx.fillText("FILTER CIGARETTES", cx, 466);
        } else if (brand.id === "benson-hedges") {
          // Benson & Hedges Royal Gold Coat of Arms Crest
          ctx.strokeStyle = "#b45309";
          ctx.lineWidth = 2.5;
          ctx.strokeRect(cx - 20, 358, 40, 32);
          ctx.fillStyle = "#d97706";
          ctx.font = "bold 15px 'Cinzel', serif";
          ctx.textAlign = "center";
          ctx.fillText("B&H", cx, 380);

          // Royal Gold Wordmark with Navy Subtext
          ctx.fillStyle = "#92400e";
          ctx.font = "bold 24px 'Cinzel', 'Playfair Display', Georgia, serif";
          ctx.textAlign = "center";
          ctx.fillText("BENSON & HEDGES", cx, 435);

          ctx.fillStyle = "#1e1b4b";
          ctx.font = "bold 12px sans-serif";
          ctx.fillText("SPECIAL FILTER", cx, 462);
        } else if (brand.id === "marlboro-gold") {
          // Marlboro Gold Chevron
          ctx.fillStyle = "#f59e0b";
          ctx.beginPath();
          ctx.moveTo(cx - 28, 375);
          ctx.lineTo(cx, 402);
          ctx.lineTo(cx + 28, 375);
          ctx.lineTo(cx + 28, 357);
          ctx.lineTo(cx - 28, 357);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "#b45309";
          ctx.font = "900 32px 'Playfair Display', Georgia, serif";
          ctx.textAlign = "center";
          ctx.fillText("Marlboro", cx, 442);

          ctx.fillStyle = "#f59e0b";
          ctx.font = "bold 12px sans-serif";
          ctx.fillText("GOLD", cx, 464);
        } else if (brand.id === "sheikh") {
          // Historic Bangladeshi Sheikh Laurel & Star Emblem
          ctx.fillStyle = "#059669";
          ctx.beginPath();
          ctx.arc(cx, 375, 18, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#fef08a";
          ctx.font = "bold 16px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("★", cx, 381);

          // Traditional Emerald Green Typography
          ctx.fillStyle = "#047857";
          ctx.font = "900 34px 'Ekush', 'Arial Black', sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("SHEIKH", cx, 435);

          ctx.fillStyle = "#d97706";
          ctx.font = "bold 12px sans-serif";
          ctx.fillText("HERITAGE BLEND", cx, 462);
        } else if (brand.id === "star") {
          // Star Emblem in Ruby Red
          ctx.fillStyle = "#e11d48";
          ctx.font = "38px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("★", cx, 380);

          ctx.font = "900 34px 'Ekush', 'Arial Black', sans-serif";
          ctx.fillText("STAR", cx, 435);

          ctx.fillStyle = "#be123c";
          ctx.font = "bold 11px sans-serif";
          ctx.fillText("FILTER CIGARETTES", cx, 462);
        } else if (brand.id === "navy") {
          // Maritime Anchor Crest & Deep Navy Typography
          ctx.strokeStyle = "#0284c7";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(cx, 365, 10, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(cx, 375);
          ctx.lineTo(cx, 395);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(cx, 385, 14, 0, Math.PI);
          ctx.stroke();

          ctx.fillStyle = "#0369a1";
          ctx.font = "900 30px 'Arial Black', sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("NAVY", cx, 438);

          ctx.fillStyle = "#0284c7";
          ctx.font = "bold 11px sans-serif";
          ctx.fillText("NAVY CUT", cx, 464);
        } else if (brand.id === "lucky-strike") {
          // Iconic Bullseye Crest
          ctx.fillStyle = "#dc2626";
          ctx.beginPath();
          ctx.arc(cx, 375, 26, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = "#fef08a";
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 10px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("LUCKY", cx, 371);
          ctx.fillText("STRIKE", cx, 384);

          ctx.fillStyle = "#1c1917";
          ctx.font = "bold 24px Georgia, serif";
          ctx.fillText("LUCKY STRIKE", cx, 438);

          ctx.fillStyle = "#dc2626";
          ctx.font = "bold 11px sans-serif";
          ctx.fillText("IT'S TOASTED", cx, 464);
        } else if (brand.id === "camel-connect") {
          // Camel Silhouette & Desert Typography
          ctx.fillStyle = "#b45309";
          ctx.font = "900 34px Georgia, serif";
          ctx.textAlign = "center";
          ctx.fillText("CAMEL", cx, 432);

          ctx.fillStyle = "#78350f";
          ctx.font = "bold 12px sans-serif";
          ctx.fillText("TURKISH & DOMESTIC", cx, 460);
        } else if (brand.id === "dunhill") {
          // Dunhill British Luxury Crest & Typography
          ctx.strokeStyle = "#7c3aed";
          ctx.lineWidth = 3;
          ctx.strokeRect(cx - 20, 358, 40, 32);

          ctx.fillStyle = "#581c87";
          ctx.font = "bold 28px 'Cinzel', Georgia, serif";
          ctx.textAlign = "center";
          ctx.fillText("DUNHILL", cx, 435);

          ctx.fillStyle = "#7c3aed";
          ctx.font = "bold 11px sans-serif";
          ctx.fillText("INTERNATIONAL", cx, 462);
        } else {
          // Clean dynamic fallback with brand name & accent color
          ctx.fillStyle = brand.accentColor || "#d97706";
          ctx.font = "900 30px 'Cinzel', Georgia, serif";
          ctx.textAlign = "center";
          ctx.fillText(brand.name.toUpperCase(), cx, 435);

          ctx.strokeStyle = brand.accentColor || "#d97706";
          ctx.lineWidth = 2;
          ctx.strokeRect(cx - 35, 450, 70, 2);
        }

        ctx.restore();
      });
    });
  }

  public static createCigaretteTexture(filterTone: "cork" | "white" | "gold-band" | "charcoal" = "cork"): THREE.CanvasTexture {
    return this.createBrandFilterTexture("classic", filterTone);
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
   * Authentic Bengali storefront signboard — High-Resolution & Razor-Sharp Visibility
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
    const key = `sign_v3_${mainText}_${bgColor}_${isNeon}`;
    return this.getOrCreate(key, 1024, 320, (ctx, w, h) => {
      // 1. Solid High-Contrast Background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);

      // Subtle metallic/gloss gradient overlay
      const gloss = ctx.createLinearGradient(0, 0, 0, h);
      gloss.addColorStop(0, "rgba(255,255,255,0.08)");
      gloss.addColorStop(0.5, "rgba(255,255,255,0.0)");
      gloss.addColorStop(1, "rgba(0,0,0,0.35)");
      ctx.fillStyle = gloss;
      ctx.fillRect(0, 0, w, h);

      // 2. Bold Double Border Frame
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 10;
      ctx.strokeRect(10, 10, w - 20, h - 20);

      ctx.lineWidth = 2.5;
      ctx.strokeRect(20, 20, w - 40, h - 40);

      // Decorative corner squares
      const cornerSize = 14;
      ctx.fillStyle = accentColor;
      ctx.fillRect(24, 24, cornerSize, cornerSize);
      ctx.fillRect(w - 24 - cornerSize, 24, cornerSize, cornerSize);
      ctx.fillRect(24, h - 24 - cornerSize, cornerSize, cornerSize);
      ctx.fillRect(w - 24 - cornerSize, h - 24 - cornerSize, cornerSize, cornerSize);

      ctx.textAlign = "center";

      // 3. Top Tagline (e.g. "বিসমিল্লাহির রাহমানির রাহীম")
      ctx.font = "bold 24px 'Ekush', 'Helal Hafiz', 'Noto Sans Bengali', 'SolaimanLipi', 'Kalpurush', 'Segoe UI', Arial, sans-serif";
      ctx.fillStyle = accentColor;
      ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 2;
      ctx.fillText(tagline, w / 2, 54);

      // 4. Main Title (e.g. "হাবিব ভাই এর চা এর দোকান")
      // Dynamically fit font size so long titles never clip
      let fontSize = 72;
      ctx.font = `900 ${fontSize}px 'Ekush', 'Helal Hafiz', 'Noto Sans Bengali', 'SolaimanLipi', 'Kalpurush', 'Segoe UI', Arial, sans-serif`;
      let textMetrics = ctx.measureText(mainText);
      while (textMetrics.width > w - 120 && fontSize > 38) {
        fontSize -= 3;
        ctx.font = `900 ${fontSize}px 'Ekush', 'Helal Hafiz', 'Noto Sans Bengali', 'SolaimanLipi', 'Kalpurush', 'Segoe UI', Arial, sans-serif`;
        textMetrics = ctx.measureText(mainText);
      }

      // Deep dark outline behind text for maximum legibility
      ctx.strokeStyle = "rgba(0, 0, 0, 0.95)";
      ctx.lineWidth = 10;
      ctx.lineJoin = "round";
      ctx.shadowColor = isNeon ? accentColor : "rgba(0, 0, 0, 0.8)";
      ctx.shadowBlur = isNeon ? 12 : 6;
      ctx.strokeText(mainText, w / 2, 175);

      // Bright fill text
      ctx.fillStyle = textColor;
      ctx.fillText(mainText, w / 2, 175);
      ctx.shadowBlur = 0;

      // 5. Divider Accent Line
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(w * 0.15, 215);
      ctx.lineTo(w * 0.85, 215);
      ctx.stroke();

      // Small diamond in center of divider
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(w / 2, 215, 5, 0, Math.PI * 2);
      ctx.fill();

      // 6. Subtext (e.g. "স্পেশাল মালাই চা ও বিস্কুট")
      let subFontSize = 34;
      ctx.font = `700 ${subFontSize}px 'Ekush', 'Helal Hafiz', 'Noto Sans Bengali', 'SolaimanLipi', 'Kalpurush', 'Segoe UI', Arial, sans-serif`;
      let subMetrics = ctx.measureText(subText);
      while (subMetrics.width > w - 140 && subFontSize > 22) {
        subFontSize -= 2;
        ctx.font = `700 ${subFontSize}px 'Ekush', 'Helal Hafiz', 'Noto Sans Bengali', 'SolaimanLipi', 'Kalpurush', 'Segoe UI', Arial, sans-serif`;
        textMetrics = ctx.measureText(subText);
      }

      ctx.strokeStyle = "rgba(0, 0, 0, 0.9)";
      ctx.lineWidth = 6;
      ctx.lineJoin = "round";
      ctx.strokeText(subText, w / 2, 270);

      ctx.fillStyle = accentColor;
      ctx.fillText(subText, w / 2, 270);
    });
  }

  /**
   * Authentic Weathered Street Wall Poster (To-Let, Cinema, Event flyers)
   */
  public static createStreetPoster(
    header: string,
    mainText: string,
    subText: string,
    footer: string,
    paperColor: string = "#fef08a",
    textColor: string = "#991b1b",
    accentColor: string = "#1e1b4b"
  ): THREE.CanvasTexture {
    const key = `poster_${header}_${mainText}_${paperColor}`;
    return this.getOrCreate(key, 512, 720, (ctx, w, h) => {
      // Paper background
      ctx.fillStyle = paperColor;
      ctx.fillRect(0, 0, w, h);

      // Weathering & grime edges
      ctx.fillStyle = "rgba(60, 40, 20, 0.12)";
      for (let i = 0; i < 4000; i++) {
        ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
      }

      // Torn / weathered corners
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, 8, h);
      ctx.fillRect(w - 8, 0, 8, h);
      ctx.fillRect(0, 0, w, 8);
      ctx.fillRect(0, h - 8, w, 8);

      // Outer border
      ctx.strokeStyle = textColor;
      ctx.lineWidth = 8;
      ctx.strokeRect(16, 16, w - 32, h - 32);
      ctx.lineWidth = 2;
      ctx.strokeRect(24, 24, w - 48, h - 48);

      ctx.textAlign = "center";

      // Header Banner Box
      ctx.fillStyle = textColor;
      ctx.fillRect(32, 38, w - 64, 75);

      ctx.font = "900 38px 'Ekush', 'Helal Hafiz', 'Noto Sans Bengali', 'SolaimanLipi', system-ui, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(header, w / 2, 90);

      // Main Large Text
      ctx.font = "900 52px 'Ekush', 'Helal Hafiz', 'Noto Sans Bengali', 'SolaimanLipi', system-ui, sans-serif";
      ctx.fillStyle = textColor;
      ctx.fillText(mainText, w / 2, 220);

      // Divider
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(40, 270);
      ctx.lineTo(w - 40, 270);
      ctx.stroke();

      // Subtext lines
      ctx.font = "700 28px 'Ekush', 'Helal Hafiz', 'Noto Sans Bengali', 'SolaimanLipi', system-ui, sans-serif";
      ctx.fillStyle = accentColor;
      const subLines = subText.split("\n");
      subLines.forEach((line, idx) => {
        ctx.fillText(line.trim(), w / 2, 330 + idx * 48);
      });

      // Footer contact / authority box
      const footerY = h - 140;
      ctx.fillStyle = accentColor;
      ctx.fillRect(36, footerY, w - 72, 85);

      ctx.font = "bold 26px 'Ekush', 'Helal Hafiz', 'Noto Sans Bengali', monospace, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(footer, w / 2, footerY + 52);
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

  /**
   * Traditional Bangladeshi Lungi Checked Plaid Texture
   */
  public static createLungiTexture(baseColor: string = "#1e3a8a", checkColor: string = "#0284c7"): THREE.CanvasTexture {
    return this.getOrCreate(`lungi_pattern_${baseColor}_${checkColor}`, 256, 256, (ctx, w, h) => {
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, w, h);

      // Plaid Grid Lines
      ctx.fillStyle = checkColor;
      for (let x = 0; x < w; x += 32) {
        ctx.fillRect(x, 0, 10, h);
      }
      for (let y = 0; y < h; y += 32) {
        ctx.fillRect(0, y, w, 10);
      }

      // Thin White / Yellow Accent Stripes
      ctx.strokeStyle = "rgba(254, 240, 138, 0.65)";
      ctx.lineWidth = 1.5;
      for (let x = 16; x < w; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 16; y < h; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    });
  }

  /**
   * Traditional Bangladeshi Cotton Gamcha (Red/White checkered)
   */
  public static createGamchaTexture(): THREE.CanvasTexture {
    return this.getOrCreate("gamcha_pattern_dhaka", 256, 256, (ctx, w, h) => {
      ctx.fillStyle = "#dc2626";
      ctx.fillRect(0, 0, w, h);

      // White Checkers
      ctx.fillStyle = "#ffffff";
      for (let x = 0; x < w; x += 24) {
        for (let y = 0; y < h; y += 24) {
          if ((x / 24 + y / 24) % 2 === 0) {
            ctx.fillRect(x, y, 12, 12);
          }
        }
      }

      // Yellow border stripes
      ctx.fillStyle = "#facc15";
      ctx.fillRect(0, 0, w, 6);
      ctx.fillRect(0, h - 6, w, 6);
    });
  }

  /**
   * Casual Desi Street Shirt Plaid Texture
   */
  public static createShirtTexture(baseColor: string = "#991b1b", gridColor: string = "#1f2937"): THREE.CanvasTexture {
    return this.getOrCreate(`street_shirt_${baseColor}_${gridColor}`, 256, 256, (ctx, w, h) => {
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = gridColor;
      for (let x = 0; x < w; x += 40) {
        ctx.fillRect(x, 0, 8, h);
      }
      for (let y = 0; y < h; y += 40) {
        ctx.fillRect(0, y, w, 8);
      }

      // Subtle fabric weave texture
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      for (let i = 0; i < 2000; i++) {
        ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
      }
    });
  }

  /**
   * Stylized Desi Face Texture with features and thick authentic moustache
   */
  public static createDesiFaceTexture(skinTone: string = "#a86b4a", hasMoustache: boolean = true): THREE.CanvasTexture {
    return this.getOrCreate(`desi_face_${skinTone}_${hasMoustache}`, 256, 256, (ctx, w, h) => {
      ctx.fillStyle = skinTone;
      ctx.fillRect(0, 0, w, h);

      // Eyes
      ctx.fillStyle = "#1e1b18";
      ctx.beginPath();
      ctx.ellipse(w * 0.35, h * 0.38, 12, 7, 0, 0, Math.PI * 2);
      ctx.ellipse(w * 0.65, h * 0.38, 12, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eyebrows
      ctx.strokeStyle = "#0f0e0c";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(w * 0.25, h * 0.32);
      ctx.quadraticCurveTo(w * 0.35, h * 0.28, w * 0.45, h * 0.33);
      ctx.moveTo(w * 0.55, h * 0.33);
      ctx.quadraticCurveTo(w * 0.65, h * 0.28, w * 0.75, h * 0.32);
      ctx.stroke();

      // Nose shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.42);
      ctx.lineTo(w * 0.46, h * 0.56);
      ctx.lineTo(w * 0.54, h * 0.56);
      ctx.closePath();
      ctx.fill();

      // Authentic Desi Moustache
      if (hasMoustache) {
        ctx.fillStyle = "#171412";
        ctx.beginPath();
        ctx.moveTo(w * 0.26, h * 0.68);
        ctx.quadraticCurveTo(w * 0.5, h * 0.58, w * 0.74, h * 0.68);
        ctx.quadraticCurveTo(w * 0.5, h * 0.76, w * 0.26, h * 0.68);
        ctx.fill();
      }

      // Mouth
      ctx.strokeStyle = "#5a2519";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(w * 0.4, h * 0.78);
      ctx.lineTo(w * 0.6, h * 0.78);
      ctx.stroke();
    });
  }

  /**
   * Distressed Roadside Red Clay Brick Wall Texture (Dhaka Street style)
   */
  public static createBrickWallTexture(): THREE.CanvasTexture {
    return this.getOrCreate("dhaka_brick_wall_texture", 512, 512, (ctx, w, h) => {
      // Cement Mortar Base
      ctx.fillStyle = "#9ca3af";
      ctx.fillRect(0, 0, w, h);

      const brickH = 26;
      const brickW = 64;
      const mortar = 4;

      let row = 0;
      for (let y = 0; y < h; y += brickH + mortar) {
        const xOffset = (row % 2 === 0) ? 0 : -brickW / 2;
        row++;

        for (let x = xOffset; x < w + brickW; x += brickW + mortar) {
          // Brick color variations
          const tones = ["#852b1b", "#943321", "#782415", "#9e3825", "#8c2c1c", "#a33e28"];
          const tone = tones[Math.floor(Math.random() * tones.length)];
          ctx.fillStyle = tone;
          ctx.fillRect(x, y, brickW, brickH);

          // Brick surface texture
          ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
          for (let i = 0; i < 20; i++) {
            ctx.fillRect(x + Math.random() * brickW, y + Math.random() * brickH, 2, 2);
          }
        }
      }

      // Rain grime and damp staining near the base
      const grimeGrad = ctx.createLinearGradient(0, h * 0.4, 0, h);
      grimeGrad.addColorStop(0, "rgba(20, 25, 30, 0)");
      grimeGrad.addColorStop(0.7, "rgba(15, 20, 25, 0.35)");
      grimeGrad.addColorStop(1, "rgba(10, 15, 20, 0.65)");
      ctx.fillStyle = grimeGrad;
      ctx.fillRect(0, 0, w, h);

      // Damp moss patches
      ctx.fillStyle = "rgba(20, 83, 45, 0.25)";
      for (let i = 0; i < 8; i++) {
        const mx = Math.random() * w;
        const my = h - Math.random() * 90;
        ctx.beginPath();
        ctx.ellipse(mx, my, 25 + Math.random() * 20, 12 + Math.random() * 10, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
}
