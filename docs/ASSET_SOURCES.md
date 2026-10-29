# Asset sources and licensing: retro Dhaka 3D environment

This document details the provenance, creation methods, and licensing terms for
all 3D meshes, procedural textures, audio synthesizers, and packaging artwork
used in Vesper Ritual.

## Asset origins and attribution

All 3D geometric meshes, vehicle models, street props, and textures in the
Dhaka 3D environment are 100% original procedural creations developed
specifically for this project using Three.js and HTML5 2D Canvas contexts.

- **Zero proprietary 3D models**: No commercial models from external games or
  pirated archives are used.
- **Zero external texture downloads**: All Bengali signboards, road markings,
  tin textures, and rickshaw folk art are drawn dynamically in memory at runtime
  via `src/components/immersive-scene/ProceduralTextures.ts`.
- **Zero network latency and full offline resilience**: Because geometry and
  textures are generated client-side, the 3D scene functions reliably offline
  without external CDN dependencies.

---

## Licensing matrix

The procedural code components are licensed under the project's open terms:

| Asset component | Implementation source | License |
| :--- | :--- | :--- |
| `src/components/immersive-scene/DhakaProps.ts` | Original procedural 3D code | MIT / Permissive |
| `src/components/immersive-scene/SceneWorld.ts` | Original procedural 3D code | MIT / Permissive |
| `src/components/immersive-scene/FirstPersonHand3D.ts` | Original procedural 3D code | MIT / Permissive |
| `src/components/immersive-scene/SmokeParticles3D.ts` | Original procedural particle code | MIT / Permissive |
| `src/components/immersive-scene/ProceduralTextures.ts` | Original procedural canvas textures | MIT / Permissive |
| `src/config/dhakaScene.config.ts` | Original configuration parameters | MIT / Permissive |

---

## Brand artwork cutouts and digital humidor

The application includes nine high-resolution transparent PNG pack cutouts
located in `public/assets/brands/`:

- Benson & Hedges (`benson_hedges.png`)
- Marlboro Red (`marlboro_red.png`)
- Marlboro Gold (`marlboro_gold.png`)
- Navy (`navy.png`)
- Star (`star.png`)
- Sheikh (`sheikh.png`)
- Lucky Strike (`lucky_strike.png`)
- Camel Connect (`camel_connect.png`)
- Dunhill (`dunhill.png`)

These assets are used strictly as non-commercial visual references within the
digital humidor to provide a familiar behavioral substitute for adult smokers
seeking harm reduction.

---

## Guidelines for importing external 3D models

If you wish to import external 3D models (for example, from Blender or Creative
Commons repositories):

1. Save the `.glb` or `.gltf` file inside `public/assets/models/`.
2. Load the model using Three.js `GLTFLoader`:
   ```typescript
   import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

   const loader = new GLTFLoader();
   loader.load("/assets/models/my_custom_prop.glb", (gltf) => {
     scene.add(gltf.scene);
   });
   ```
3. Document the source URL, original author, and Creative Commons license in
   this document.
