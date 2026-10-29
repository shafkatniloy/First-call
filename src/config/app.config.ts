export const APP_CONFIG = {
  name: "FIRST CALL",
  shortName: "First Call",
  version: "1.0.0",
  tagline: "An atmospheric, digital first-person ritual designed for smoking reduction.",
  subtext: "Recreate the familiar hand-to-mouth tactile pauses in a private digital space — without the smoke or ash.",
  disclaimer: "FIRST CALL is an independent digital sensory simulation designed to assist behavioral reduction of cigarette consumption. It is not a medical device, smoking cessation medication, or professional clinical treatment.",
  defaults: {
    brandId: "marlboro",
    totalDraws: 7 as 6 | 7,
    environmentId: "rainy-window",
    soundEnabled: true,
    masterVolume: 0.85,
    ambientVolume: 0.45,
    dailyBaseline: 12,
  },
  drawDurations: {
    lightingMs: 1400,
    inhaleMs: 2400,
    recoverMs: 1600,
  },
};
