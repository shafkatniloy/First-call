# Asset guide: Vesper Ritual

This guide outlines directory structures, specifications, aspect ratios, and
procedures for adding or updating brand cutouts, 3D models, textures, and
backgrounds in Vesper Ritual.

## 1. Asset directory organization

All static visual and 3D assets are organized within `/public/assets/`:

```
public/assets/
├── brands/                    # Authentic brand pack PNG cutouts (9 brands)
│   ├── benson_hedges.png
│   ├── marlboro_red.png
│   ├── marlboro_gold.png
│   ├── navy.png
│   ├── star.png
│   ├── sheikh.png
│   ├── lucky_strike.png
│   ├── camel_connect.png
│   └── dunhill.png
├── models/                    # Standalone 3D models (cigarette.glb, hand.glb)
├── backgrounds/               # Atmospheric scene backdrops (16:9 1920x1080)
│   ├── rainy-window.jpg
│   ├── clear-evening.jpg
│   └── foggy-night.jpg
├── foreground/                # Legacy 2D first-person hand assets
│   ├── hand-lit.jpg
│   └── hand-unlit.jpg
└── brand-icon.jpg             # 1:1 luxury wordmark emblem icon
```

---

## 2. Technical specifications and formats

Maintaining consistent asset dimensions ensures crisp rendering and responsive
scaling across desktop and mobile devices.

### Brand pack artwork cutouts

- **Format**: 32-bit PNG with transparent background.
- **Resolution**: 600x900 pixels (2:3 aspect ratio).
- **Optimization**: Compressed using pngquant or oxipng to remain under 300KB
  per pack image.
- **Rendering**: Rendered inside frosted semi-transparent pill buttons with
  subtle scale animations on hover and selection.

### 3D models and procedural textures

- **3D format**: Binary glTF (`.glb`) with embedded Draco or meshopt compression
  when using external files.
- **Polygon budget**: Under 1,000 triangles per standalone prop.
- **Procedural textures**: Canvas dimensions range from 128x256 to 512x512 pixels,
  generated programmatically in memory at startup.

### Background and foreground references

- **Format**: Progressive WebP or high-quality JPEG.
- **Background resolution**: 1920x1080 (16:9 aspect ratio), compressed to
  under 900KB.
- **Filtering**: Rendered with subtle CSS brightness (`0.72`) and contrast
  (`1.12`) to preserve depth behind UI overlays.

---

## 3. How to add or replace assets

Follow these steps when expanding the digital humidor or updating the scene.

### Adding a new brand to the humidor

1. Place a transparent pack cutout in `public/assets/brands/<brand_id>.png`.
2. Add a new configuration entry to `src/config/brands.config.ts`:
   ```typescript
   {
     id: "new-brand",
     name: "New Brand Name",
     tagline: "Description of flavor profile and draw resistance",
     filterTone: "cork",
     accentColor: "#f59e0b",
     emberColor: "#ff4d00",
     filterColor: "#d97706",
     paperColor: "#ffffff",
     crackleFrequency: 0.8,
     drawResistance: "dense",
     burnRateMultiplier: 1.0,
     image: "/assets/brands/new_brand.png",
   }
   ```
3. The brand will immediately appear in the Refractive Glass UI starting page.

### Customizing 3D scene parameters

To alter the 3D street layout, tea stall placement, lighting colors, or camera
look sensitivity, edit numeric values directly in
`src/config/dhakaScene.config.ts`. No 3D software or rebuilding of mesh binaries
is required.
