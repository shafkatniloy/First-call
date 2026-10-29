# Asset inventory: retro Dhaka 3D environment

This inventory tracks every 3D model, procedural mesh, canvas texture, and
particle system used to construct the real-time Dhaka first-person environment
and digital humidor.

## 3D scene and environment meshes

The following table details each 3D prop and environmental structure in the
street scene:

| Asset name | Category | Implementation type | Polygons / complexity | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Tea stall ("চায়ের টং")** | Street prop | Procedural Three.js compound mesh | ~380 triangles (Timber posts, tin roof, kettle, jars) | Completed and live |
| **Cycle rickshaw** | Vehicle prop | Procedural Three.js compound mesh | ~520 triangles (3 spoke wheels, frame, hood, cushion) | Completed and live |
| **CNG auto-rickshaw** | Vehicle prop | Procedural Three.js compound mesh | ~440 triangles (Chassis, yellow roof, 3 wheels, grilles) | Completed and live |
| **Utility poles (x4)** | Infrastructure | Procedural Three.js geometry | ~160 triangles each (Octagonal post, crossbars, lamp) | Completed and live |
| **Overhead cables (x4)** | Infrastructure | Quadratic Bezier curve lines | Catenary math curves (24 vertices per wire) | Completed and live |
| **Modular concrete buildings** | Architecture | Procedural Three.js extrusions | ~650 triangles (Multi-story blocks, balconies, tanks) | Completed and live |
| **First-person cigarette** | Viewmodel | Camera-attached 3D compound mesh | ~220 triangles (Centered viewmodel, filter, paper wrap) | Completed and live |
| **Dynamic ember flare** | Viewmodel / VFX | Point light + emissive mesh | 1 dynamic point light + cylinder tip | Completed and live |
| **3D smoke particles** | VFX / Particles | `THREE.Points` with radial alpha | Up to 120 dynamic billow particles | Completed and live |
| **Falling night rain** | VFX / Weather | `THREE.LineSegments` | 750 vertical raindrop streaks | Completed and live |
| **Bengali signboards** | Texture | In-memory HTML5 canvas textures | 512x160 px procedural canvas | Completed and live |
| **Wet asphalt road** | Texture | In-memory HTML5 canvas textures | 512x512 px procedural canvas | Completed and live |
| **Rickshaw folk art** | Texture | In-memory HTML5 canvas textures | 256x256 px procedural canvas | Completed and live |
| **Corrugated tin roof** | Texture | In-memory HTML5 canvas textures | 128x256 px procedural canvas | Completed and live |
| **Metal shutter texture** | Texture | In-memory HTML5 canvas textures | 256x256 px procedural canvas | Completed and live |

---

## Brand pack cutouts and 3D files

The following table details the brand artwork cutouts and standalone 3D model
files:

| Item name | File path | Asset type | Role |
| :--- | :--- | :--- | :--- |
| **Benson & Hedges pack** | `public/assets/brands/benson_hedges.png` | Transparent PNG | Humidor button artwork |
| **Marlboro Red pack** | `public/assets/brands/marlboro_red.png` | Transparent PNG | Humidor button artwork |
| **Marlboro Gold pack** | `public/assets/brands/marlboro_gold.png` | Transparent PNG | Humidor button artwork |
| **Navy pack** | `public/assets/brands/navy.png` | Transparent PNG | Humidor button artwork |
| **Star pack** | `public/assets/brands/star.png` | Transparent PNG | Humidor button artwork |
| **Sheikh pack** | `public/assets/brands/sheikh.png` | Transparent PNG | Humidor button artwork |
| **Lucky Strike pack** | `public/assets/brands/lucky_strike.png` | Transparent PNG | Humidor button artwork |
| **Camel Connect pack** | `public/assets/brands/camel_connect.png` | Transparent PNG | Humidor button artwork |
| **Dunhill pack** | `public/assets/brands/dunhill.png` | Transparent PNG | Humidor button artwork |
| **Cigarette 3D model** | `public/assets/models/cigarette.glb` | 3D model (GLB) | Standalone reference model |
| **Hand 3D model** | `public/assets/models/hand.glb` | 3D model (GLB) | Standalone reference model |
