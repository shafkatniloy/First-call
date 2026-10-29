# Graphics performance and optimization: retro Dhaka 3D environment

This document outlines the performance benchmarks, polygon budgets, shader
optimizations, and device pixel ratio safeguards implemented in the real-time
Dhaka 3D engine.

## Performance goals and hardware targets

The 3D environment is engineered to maintain a steady 60 frames per second
across mid-range laptops, integrated graphics chips (such as Intel Iris Xe and
Apple M-series), and mobile browsers (iOS Safari, Android Chrome).

The engine prioritizes battery longevity and thermal efficiency during daily
mindful sessions.

---

## Optimization techniques applied

Multiple rendering optimizations keep memory consumption under 80MB and GPU
load negligible.

### Low-to-medium polygon budget

Geometry is optimized to balance retro styling with minimal draw calls:

- Total street scene geometry: **< 3,500 triangles**.
- First-person cigarette viewmodel: **< 250 triangles**.
- Roadway, sidewalks, and curbs: **< 30 triangles**.

This low overhead enables smooth frame pacing even on low-power mobile GPUs
without dropped frames.

### Procedural canvas textures (zero download overhead)

All storefront signboards, rickshaw folk art, and wet asphalt textures are
drawn programmatically onto small HTML5 canvases (128x256 to 512x512) and
uploaded as `THREE.CanvasTexture` instances during startup.

This eliminates over 15MB of image downloads and prevents network texture pop-in.

### Restrained shadow casting

Shadow computations are restricted to key focal points:

- Only the directional moonlight, the tea stall interior bulb, and adjacent
  utility poles cast dynamic shadows.
- Shadow map resolution is clamped to `1024x1024` with `THREE.PCFSoftShadowMap`
  filtering for soft contact shadows without GPU strain.

### Hardware device pixel ratio clamping

High-DPI retina screens on modern phones can report device pixel ratios of 3 or
4, which would force the browser to compute nine to sixteen times more pixels.
The engine clamps the ratio:

```typescript
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
```

This prevents excessive battery drain and avoids mobile thermal throttling.

### Single-draw buffer geometry particle simulations

Both 3D rising smoke and falling rain utilize `THREE.Points` and
`THREE.LineSegments` backed by single `Float32Array` buffer attributes,
executing in a single GPU draw call each.

---

## Reduced motion and battery saver mode

When reduced motion is enabled (via system preferences or in-app settings), the
engine adapts:

- Camera breathing sway and Lissajous idle motion are disabled.
- Rain particle simulation is paused.
- Inhale transitions use gentle crossfades rather than rapid spatial transforms.
