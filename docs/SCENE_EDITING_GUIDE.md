# Scene Editing Guide: Retro Dhaka 3D Environment

All positions, rotations, colors, lighting temperatures, and camera parameters are centralized in a single configuration file:
**[`src/config/dhakaScene.config.ts`](file:///home/safkatniloy/Documents/pilot/virtual%20cigs/src/config/dhakaScene.config.ts)**

You do not need Blender or 3D software to tweak the scene. Simply edit the numeric values in `dhakaScene.config.ts`.

---

## 1. Adjusting Camera & First-Person View

To change where the user stands or how far they can look around:

```typescript
export const DHAKA_SCENE_CONFIG = {
  camera: {
    eyeHeight: 1.62,           // Height of user's eyes from the sidewalk in meters
    initialPosition: [0.8, 1.62, 3.2], // [X, Y, Z] starting location on sidewalk
    initialTarget: [-0.2, 1.62, -4.5], // [X, Y, Z] initial look direction down street
    fov: 62,                   // Field of View in degrees
    yawLimit: 0.65,            // Horizontal turn limit (~37 degrees left/right)
    pitchLimit: 0.35,          // Vertical turn limit (~20 degrees up/down)
    mouseSensitivity: 0.0022,  // Sensitivity for mouse drag
    touchSensitivity: 0.0032,  // Sensitivity for mobile swipe
    idleSwayAmount: 0.012,     // Intensity of organic breathing sway
  },
  // ...
};
```

---

## 2. Adjusting Lighting & Colors

To change the mood, fog, or streetlamp brightness:

```typescript
lighting: {
  fogColor: "#080c14",        // Midnight sky/fog hex color
  fogDensity: 0.024,          // Higher = thicker fog; Lower = clearer view
  ambientColor: "#141c2c",    // Ambient fill light color
  ambientIntensity: 0.7,      // Ambient light brightness
  streetLampColor: "#ff9933", // Sodium vapor amber streetlamp hex
  streetLampIntensity: 2.8,   // Streetlamp power
  teaStallLightColor: "#ffaa33", // Warm tea stall incandescent bulb
  teaStallLightIntensity: 3.5,
  neonCyanColor: "#00e5ff",   // Electronics store neon color
  neonPinkColor: "#ff007f",   // Pharmacy / store accent color
}
```

---

## 3. Repositioning Vehicles & Street Props

To move the tea stall, rickshaw, or CNG:

```typescript
props: {
  // [X, Y, Z] coordinates in meters
  teaStallPosition: [-2.4, 0, -1.8], // Left sidewalk corner
  teaStallRotation: 0.35,            // Angle in radians
  rickshawPosition: [1.9, 0, -0.8],  // Right curb
  rickshawRotation: -0.28,
  cngPosition: [-1.4, 0, -7.5],      // Further down the road
  cngRotation: 0.15,
  utilityPoles: [
    [-2.6, 0, 1.5],
    [-2.6, 0, -6.0],
    [2.6, 0, 0.5],
    [2.6, 0, -8.0],
  ],
}
```

---

## 4. Adjusting the First-Person Hand & Cigarette

To change where the 3D hand rests on screen or how close it draws during inhalation:

```typescript
firstPersonHand: {
  basePosition: [0.22, -0.19, -0.42],  // Resting position in camera coordinates
  baseRotation: [-0.05, -0.18, 0.08],
  inhalePositionOffset: [-0.07, 0.08, 0.1], // Movement vector toward mouth during inhale
  emberBaseIntensity: 1.4,            // Normal idle ember glow
  emberInhaleIntensity: 4.8,          // White-hot flare during inhale
}
```

---

## 5. Adjusting Rain Weather

```typescript
weather: {
  rainEnabled: true,       // Set false for a dry evening
  rainParticleCount: 750,  // Number of falling raindrops
  rainSpeed: 15,           // Fall velocity
}
```

