import { EnvironmentConfig } from "@/types/environment";

export const ENVIRONMENTS: EnvironmentConfig[] = [
  {
    id: "day-clear",
    name: "Daytime",
    tagline: "Bright daylight over bustling Dhaka streets with warm sunshine and open blue skies",
    lightingTone: "daylight",
    ambientSound: "night-breeze",
    hazeDensity: 0.15,
    previewGradient: "from-sky-400 via-sky-600 to-blue-900",
  },
  {
    id: "clear-evening",
    name: "Night",
    tagline: "Quiet twilight air, warm distant streetlamps and gentle evening breeze",
    lightingTone: "warm-amber",
    ambientSound: "night-breeze",
    hazeDensity: 0.35,
    previewGradient: "from-amber-950/70 via-stone-900 to-black",
  },
  {
    id: "rainy-window",
    name: "Rainy Night",
    tagline: "Soft raindrops against cool night glass overlooking city lights",
    lightingTone: "rainy-blue",
    ambientSound: "rain-window",
    hazeDensity: 0.65,
    previewGradient: "from-slate-900 via-sky-950 to-neutral-950",
  },
  {
    id: "foggy-night",
    name: "Foggy Night",
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
