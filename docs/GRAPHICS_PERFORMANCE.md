# Graphics Performance & Optimization: Retro Dhaka 3D Environment

## 1. Performance Goals & Hardware Targets
The 3D environment is engineered to run at a consistent **60 FPS** across mid-range laptops, integrated graphics (Intel Iris / Apple M-series), and mobile browsers (iOS Safari, Android Chrome).

---

## 2. Optimization Techniques Applied

### A. Low-to-Medium Polygon Budget
- Total scene geometry: **< 3,500 triangles**.
- Hand & Cigarette viewmodel: **< 300 triangles**.
- Road & sidewalk: **< 20 triangles**.
- Allows smooth rendering even on low-power mobile GPUs without frame dropping.

### B. Procedural Canvas Textures (Zero Download Overhead)
- All signboards, road markings, and textures are painted to small HTML5 canvases (128x256 to 512x512) and uploaded as `THREE.CanvasTexture` during initialization.
- Saves over 15MB of image downloads and eliminates texture network lag.

### C. Restrained Shadow Casting
- `castShadow` is strictly limited to key focal objects (the directional moonlight, the tea stall interior light, and immediate utility poles).
- Shadow map resolution is clamped to `1024x1024` with `THREE.PCFSoftShadowMap` filtering for soft, realistic contact shadows without GPU strain.

### D. Hardware Device Pixel Ratio Clamping
- `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` prevents mobile retina screens (which can report DPR 3 or 4) from rendering 9x superfluous pixels, protecting battery life and preventing thermal throttling.

### E. Single-Draw Point Cloud Particle Simulation
- Both 3D smoke and rain use `THREE.Points` and `THREE.LineSegments` backed by single Float32Array buffer attributes (`BufferGeometry`), executing in a single GPU draw call each.

---

## 3. Reduced Motion & Battery Saver Mode
When `reducedMotion` is enabled (either via system preferences or in the app's settings):
- Camera look-around sway is frozen.
- Rain particle simulation is paused.
- Hand movement shifts from spring interpolation to gentle crossfades.
