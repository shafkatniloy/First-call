# Asset manifest: Vesper Ritual

This manifest catalogs all static visual assets, 3D models, procedural shaders,
and brand graphics used in Vesper Ritual, along with their format, purpose, and
licensing classification.

## Visual and 3D asset catalog

The following table lists every visual and geometric asset deployed across the
application:

| Asset path | Format | Dimensions / Complexity | Purpose | Classification | License / attribution |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/public/assets/brands/*.webp` (9 files) | WebP | 1080p (Lossless alpha, Q=92) | Optimized production pack artwork (~970 KB total) | Brand Asset | Digital Humidor Production |
| `/public/assets/brands/*.png` (9 files) | PNG | Master cutouts | High-res source pack artwork (~29 MB total) | Master Source | Digital Humidor Archive |
| `/public/assets/models/cigarette.glb` | GLTF Binary | ~450 triangles | Standalone 3D cigarette model | 3D Asset | CC0 / Permissive 3D Model |
| `/public/assets/models/hand.glb` | GLTF Binary | ~1,200 triangles | Standalone 3D hand model (archived) | 3D Asset | CC0 / Permissive 3D Model |
| `/public/assets/backgrounds/rainy-window.jpg` | JPEG | 1920x1080 (16:9) | Atmospheric backdrop reference | Generated Asset | Original AI Generation (CC0) |
| `/public/assets/backgrounds/clear-evening.jpg` | JPEG | 1920x1080 (16:9) | Twilight city view reference | Generated Asset | Original AI Generation (CC0) |
| `/public/assets/backgrounds/foggy-night.jpg` | JPEG | 1920x1080 (16:9) | Midnight terrace mist reference | Generated Asset | Original AI Generation (CC0) |
| `/public/assets/foreground/hand-lit.jpg` | JPEG | 1440x1080 (4:3) | Legacy 2D foreground hand (lit) | Generated Asset | Original AI Generation (CC0) |
| `/public/assets/foreground/hand-unlit.jpg` | JPEG | 1440x1080 (4:3) | Legacy 2D foreground hand (unlit) | Generated Asset | Original AI Generation (CC0) |
| `/public/assets/brand-icon.jpg` | JPEG | 1024x1024 (1:1) | Primary circular FIRST CALL emblem, app logo & favicon | Brand Asset | User Provided Artwork |
| `/public/favicon.ico` | ICO | 16x16, 32x32, 48x48, 64x64 | Multi-resolution browser tab icon | Brand Asset | User Provided Artwork |
| `/public/fonts/Ekush.ttf` | TrueType Font | Codepotro Ekush Regular | Modern elegant Bengali typography | Typography Asset | User Provided Font (SIL OFL) |
| `/public/fonts/HelalHafiz.ttf` | TrueType Font | Bold Bangla Display | Primary traditional Bengali typography | Typography Asset | User Provided Font |
| `src/components/immersive-scene/ProceduralTextures.ts` | In-Memory Canvas | 128x256 to 512x512 | Procedural signboards, asphalt, and tin | Programmatic | Custom Original Code (MIT) |
| `src/features/audio/audioManager.ts` | Web Audio API | Procedural | Synthesized lighter, draw, rain, and chime | Programmatic | Custom Original Code (MIT) |
