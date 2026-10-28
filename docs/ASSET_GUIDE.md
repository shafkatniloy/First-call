# Asset Guide: Vesper Ritual

## 1. Asset Directory Organization
All static visual and audio assets live under `/public/assets/`:

```
public/assets/
├── backgrounds/
│   ├── rainy-window.jpg       # 16:9 1920x1080 (Moody rain-streaked window overlooking night city)
│   ├── clear-evening.jpg      # 16:9 1920x1080 (Twilight balcony skyline view at dusk)
│   └── foggy-night.jpg        # 16:9 1920x1080 (Midnight terrace shrouded in dense atmospheric mist)
├── foreground/
│   ├── hand-lit.jpg           # 4:3 1440x1080 (First-person hand holding lit cigarette with glowing ember)
│   └── hand-unlit.jpg         # 4:3 1440x1080 (Matching first-person hand holding unlit cigarette)
├── brand-icon.jpg             # 1:1 1024x1024 (Luxury emblem icon with ember spark and gold foil trim)
└── audio/                     # Optional local audio overrides (procedural synthesis is default)
```

---

## 2. Technical Specifications & Compositing Rules

### Foreground Hand Composition
- **Coordinates**: The ember tip is geometrically aligned at `X: 27.3%`, `Y: 37.2%` relative to the foreground container box.
- **Blending**: Assets were shot against studio black, allowing clean rendering over dark atmospheric backgrounds using CSS `mix-blend-mode: screen` and drop shadows (`drop-shadow-cinematic`).
- **Aspect Ratio**: 4:3 aspect ratio ensures natural positioning on both mobile portrait screens and desktop viewports without clipping fingers or cigarette tip.

### Background Environments
- **Format**: High-quality WebP or JPEG compressed to ~600KB–900KB.
- **Aspect Ratio**: 16:9 wide perspective.
- **Filtering**: Rendered with subtle CSS brightness (`0.72`) and contrast (`1.12`) to ensure HUD readability while preserving depth.

---

## 3. How to Replace or Regenerate Assets

### Regenerating Foreground Hands
If replacing the hand assets, ensure the lit and unlit states are generated from the identical perspective:
1. Generate the unlit reference first with consistent finger grip and camera angle.
2. Generate the lit version using the unlit image as reference or using matching spatial prompt keywords.
3. Verify that the ember coordinates match `x: 27.3%`, `y: 37.2%`. If different, update `emberPosition` in `src/components/immersive-scene/ImmersiveScene.tsx` and `src/components/immersive-scene/EmberGlow.tsx`.

### Adding a New Environment
1. Place a 16:9 image in `public/assets/backgrounds/<new-id>.jpg`.
2. Add an entry to `src/config/environments.config.ts`:
   ```typescript
   {
     id: "new-id",
     name: "Moonlit Shore",
     tagline: "Quiet midnight waves under cold moonlight",
     lightingTone: "cool-blue",
     ambientSound: "night-breeze",
     hazeDensity: 0.4,
     previewGradient: "from-blue-950 via-slate-900 to-black",
   }
   ```
3. Rebuild or test locally.
