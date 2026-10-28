export interface DhakaSceneConfig {
  camera: {
    eyeHeight: number;
    initialPosition: [number, number, number];
    initialTarget: [number, number, number];
    fov: number;
    near: number;
    far: number;
    yawLimit: number; // Max horizontal look angle in radians
    pitchLimit: number; // Max vertical look angle in radians
    mouseSensitivity: number;
    touchSensitivity: number;
    idleSwaySpeed: number;
    idleSwayAmount: number;
  };
  lighting: {
    fogColor: string;
    fogDensity: number;
    ambientColor: string;
    ambientIntensity: number;
    moonColor: string;
    moonIntensity: number;
    moonPosition: [number, number, number];
    streetLampColor: string;
    streetLampIntensity: number;
    streetLampDistance: number;
    teaStallLightColor: string;
    teaStallLightIntensity: number;
    neonCyanColor: string;
    neonPinkColor: string;
  };
  firstPersonHand: {
    basePosition: [number, number, number];
    baseRotation: [number, number, number];
    inhalePositionOffset: [number, number, number];
    inhaleRotationOffset: [number, number, number];
    emberBaseColor: string;
    emberInhaleColor: string;
    emberBaseIntensity: number;
    emberInhaleIntensity: number;
  };
  props: {
    teaStallPosition: [number, number, number];
    teaStallRotation: number;
    rickshawPosition: [number, number, number];
    rickshawRotation: number;
    cngPosition: [number, number, number];
    cngRotation: number;
    utilityPoles: [number, number, number][];
  };
  weather: {
    rainEnabled: boolean;
    rainParticleCount: number;
    rainSpeed: number;
  };
  devDebug: boolean;
}

export const DHAKA_SCENE_CONFIG: DhakaSceneConfig = {
  camera: {
    eyeHeight: 1.62,
    initialPosition: [0.8, 1.62, 3.2],
    initialTarget: [-0.2, 1.62, -4.5],
    fov: 62,
    near: 0.05,
    far: 80,
    yawLimit: 0.65, // ~37 degrees left/right
    pitchLimit: 0.35, // ~20 degrees up/down
    mouseSensitivity: 0.0022,
    touchSensitivity: 0.0032,
    idleSwaySpeed: 1.1,
    idleSwayAmount: 0.012,
  },
  lighting: {
    fogColor: "#080c14",
    fogDensity: 0.024,
    ambientColor: "#141c2c",
    ambientIntensity: 0.7,
    moonColor: "#5878b0",
    moonIntensity: 0.4,
    moonPosition: [-15, 30, -10],
    streetLampColor: "#ff9933",
    streetLampIntensity: 2.8,
    streetLampDistance: 16,
    teaStallLightColor: "#ffaa33",
    teaStallLightIntensity: 3.5,
    neonCyanColor: "#00e5ff",
    neonPinkColor: "#ff007f",
  },
  firstPersonHand: {
    basePosition: [0.22, -0.19, -0.42],
    baseRotation: [-0.05, -0.18, 0.08],
    inhalePositionOffset: [-0.07, 0.08, 0.1],
    inhaleRotationOffset: [0.06, 0.04, -0.08],
    emberBaseColor: "#ff4d00",
    emberInhaleColor: "#ffffff",
    emberBaseIntensity: 1.4,
    emberInhaleIntensity: 4.8,
  },
  props: {
    teaStallPosition: [-2.4, 0, -1.8],
    teaStallRotation: 0.35,
    rickshawPosition: [1.9, 0, -0.8],
    rickshawRotation: -0.28,
    cngPosition: [-1.4, 0, -7.5],
    cngRotation: 0.15,
    utilityPoles: [
      [-2.6, 0, 1.5],
      [-2.6, 0, -6.0],
      [2.6, 0, 0.5],
      [2.6, 0, -8.0],
    ],
  },
  weather: {
    rainEnabled: true,
    rainParticleCount: 750,
    rainSpeed: 15,
  },
  devDebug: false,
};
