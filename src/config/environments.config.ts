import { EnvironmentConfig } from "@/types/environment";

export const ENVIRONMENTS: EnvironmentConfig[] = [
  {
    id: "rainy-window",
    name: "Rainy Window",
    tagline: "Soft raindrops against cool night glass overlooking city lights",
    lightingTone: "rainy-blue",
    ambientSound: "rain-window",
    hazeDensity: 0.65,
    previewGradient: "from-slate-900 via-sky-950 to-neutral-950",
  },
  {
    id: "clear-evening",
    name: "Clear Balcony",
    tagline: "Quiet twilight air, warm distant streetlamps and gentle evening breeze",
    lightingTone: "warm-amber",
    ambientSound: "night-breeze",
    hazeDensity: 0.35,
    previewGradient: "from-amber-950/70 via-stone-900 to-black",
  },
  {
    id: "foggy-night",
    name: "Foggy Terrace",
    tagline: "Thick midnight mist diffusing lantern glow in deep solitude",
    lightingTone: "deep-dusk",
    ambientSound: "fog-terrace",
    hazeDensity: 0.85,
    previewGradient: "from-zinc-900 via-neutral-950 to-black",
  },
];

export const getEnvironmentById = (id: string): EnvironmentConfig => {
  return ENVIRONMENTS.find((e) => e.id === id) || ENVIRONMENTS[0];
};
