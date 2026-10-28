# Asset Sources & Licensing: Retro Dhaka 3D Environment

## 1. Asset Origins & Attribution

All 3D geometric meshes, vehicle structures, and textures in the Dhaka 3D environment are **100% original procedural creations** developed directly inside this project using Three.js and HTML5 Canvas drawing contexts.

- **Zero External Proprietary 3D Models**: No commercial or pirated models from Rockstar Games, GTA, Sketchfab, or TurboSquid are used.
- **Zero Third-Party Image Downloads**: All Bengali signboards, road markings, corrugated metal, and rickshaw folk art are programmatically painted in memory at runtime via `src/components/immersive-scene/ProceduralTextures.ts`.
- **Zero Network Latency / Offline Resilience**: Because all geometry and textures are generated client-side, the 3D scene functions with 100% reliability offline without external CDN dependencies or missing 3D file risks.

---

## 2. Licensing Matrix

| Asset Component | Implementation Source | License |
| :--- | :--- | :--- |
| `src/components/immersive-scene/DhakaProps.ts` | Original procedural 3D code | MIT / Unrestricted |
| `src/components/immersive-scene/SceneWorld.ts` | Original procedural 3D code | MIT / Unrestricted |
| `src/components/immersive-scene/FirstPersonHand3D.ts` | Original procedural 3D code | MIT / Unrestricted |
| `src/components/immersive-scene/SmokeParticles3D.ts` | Original procedural particle code | MIT / Unrestricted |
| `src/components/immersive-scene/ProceduralTextures.ts` | Original procedural Canvas textures | MIT / Unrestricted |
| `src/config/dhakaScene.config.ts` | Original configuration parameters | MIT / Unrestricted |

---

## 3. Guide for Importing External GLTF/GLB Models in Future
If you wish to import external 3D models (e.g. from Blender or free Creative Commons 3D repositories):
1. Place the `.glb` or `.gltf` file inside `public/assets/models/`.
2. Use Three.js `GLTFLoader`:
   ```typescript
   import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
   const loader = new GLTFLoader();
   loader.load("/assets/models/my_custom_rickshaw.glb", (gltf) => {
     scene.add(gltf.scene);
   });
   ```
3. Document the source URL, author, and CC license in this document.
