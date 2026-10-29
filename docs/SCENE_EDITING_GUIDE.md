# Scene editing guide: retro Dhaka 3D environment

This guide explains how to customize camera parameters, lighting temperatures,
street prop locations, weather effects, and cigarette viewmodel ergonomics in
the 3D scene without using external 3D modeling software.

All environment parameters are centralized in configuration files:
- Scene and camera settings: `src/config/dhakaScene.config.ts`
- Cigarette brand humidor settings: `src/config/brands.config.ts`
- Environment weather presets: `src/config/environments.config.ts`

---

## 1. Adjusting camera and first-person view

You can adjust the user viewpoint height, horizontal yaw rotation boundaries,
vertical pitch limits, and mouse look sensitivity directly in
`src/config/dhakaScene.config.ts`.

```typescript
export const DHAKA_SCENE_CONFIG = {
  camera: {
    eyeHeight: 1.62,           // Height of user's eyes from sidewalk in meters
    initialPosition: [0.8, 1.62, 3.2], // [X, Y, Z] starting location on sidewalk
    initialTarget: [-0.2, 1.62, -4.5], // [X, Y, Z] look direction down street
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

## 2. Adjusting lighting and colors

The scene lighting hierarchy mimics sodium-vapor street lighting, cool midnight
sky radiance, and intimate warm tungsten bulbs under tin roofs.

```typescript
lighting: {
  fogColor: "#080c14",        // Midnight sky and fog hex color
  fogDensity: 0.024,          // Higher = thicker fog; Lower = clearer view
  ambientColor: "#141c2c",    // Ambient fill light color
  ambientIntensity: 0.7,      // Ambient light brightness
  streetLampColor: "#ff9933", // Sodium vapor amber streetlamp hex
  streetLampIntensity: 2.8,   // Streetlamp illumination power
  teaStallLightColor: "#ffaa33", // Warm tea stall incandescent bulb
  teaStallLightIntensity: 3.5,
  neonCyanColor: "#00e5ff",   // Electronics storefront neon color
  neonPinkColor: "#ff007f",   // Pharmacy and store accent color
}
```

---

## 3. Repositioning vehicles and street props

Every major architectural and vehicle asset uses meter-based spatial
coordinates. You can relocate props to reframe the composition.

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

## 4. Adjusting the first-person cigarette viewmodel

The 3D cigarette viewmodel is positioned at center screen (`Y ≈ 50%–55%`,
`X ≈ 50%–52%`) to ensure an unobtrusive, mindful first-person perspective. The
underlying robotic hand meshes are hidden.

```typescript
firstPersonHand: {
  // Centered resting coordinates in camera space
  basePosition: [0.02, -0.05, -0.38],
  baseRotation: [-0.08, 0.02, 0.04],
  inhalePositionOffset: [0.0, 0.04, 0.06], // Micro translation toward mouth
  emberBaseIntensity: 1.4,                 // Normal idle ember glow
  emberInhaleIntensity: 4.8,               // White-hot flare during inhale
}
```

To modify filter colors or paper wraps, update the brand definitions in
`src/config/brands.config.ts`.

---

## 5. Adjusting rain and weather

Rain particle density and velocity can be customized in the weather
configuration block.

```typescript
weather: {
  rainEnabled: true,       // Set to false for a clear evening
  rainParticleCount: 750,  // Number of falling raindrop streaks
  rainSpeed: 15,           // Fall velocity in meters per second
}
```

Atmospheric weather presets (Rain, Clear, Fog) can also be toggled live by the
user through the Refractive Glass UI on the starting page.

---

## 6. Configuring brands and humidor options

To add or modify brands in the humidor, edit `src/config/brands.config.ts`. Each
brand specifies its filter tone, paper color, ember heat, and pack image path:

```typescript
{
  id: "marlboro-red",
  name: "Marlboro Red",
  tagline: "Bold, rich flavor with a classic dense draw",
  filterTone: "cork",
  accentColor: "#dc2626",
  emberColor: "#ff4d00",
  filterColor: "#d97706",
  paperColor: "#fafafa",
  crackleFrequency: 0.85,
  drawResistance: "dense",
  burnRateMultiplier: 1.0,
  image: "/assets/brands/marlboro_red.png",
}
```
