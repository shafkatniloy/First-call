export interface EnvironmentConfig {
  id: string;
  name: string;
  tagline: string;
  lightingTone: string; // e.g. 'warm-amber', 'rainy-blue', 'deep-dusk'
  ambientSound: "night-breeze" | "rain-window" | "fog-terrace";
  hazeDensity: number; // 0 to 1
  previewGradient: string;
}
