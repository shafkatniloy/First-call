# Vesper Ritual — Digital Cigarette Ritual

An atmospheric, tactile, first-person web application designed to support smoking reduction by recreating the sensory hand-to-mouth ritual in a private digital space.

![Vesper Ritual Icon](public/assets/brand-icon.jpg)

---

## Overview

Smoking is as much a behavioural and sensory ritual as a chemical habit: the physical pause, the hand-to-mouth motion, the glowing ember, and the rhythmic inhalation. **Vesper Ritual** offers adult smokers a controlled digital replacement for this tactile ritual.

### Key Highlights
- **First-Person Immersive Scene**: Realistic foreground composition featuring hand, unlit/lit cigarette, dynamic glowing ember, and procedural canvas particle smoke physics.
- **Configurable Cigarette Brands**: Choose between Navy, Marise, Marlboro, Gold Leaf, or Aura Pure with original non-affiliated stylized pack cards and tailored draw profiles.
- **Six or Seven Discrete Draws**: Manually controlled interactive draws simulating the duration of a real cigarette pause.
- **Zero-Dependency Web Audio Engine**: Procedural sound synthesis for lighter flick, air draw, tobacco crackle, ambient soundscapes (rainy window, clear balcony, foggy terrace), and meditative completion chimes.
- **Private, Anonymous Progress Tracking**: Self-reported baseline management, real vs. digital cigarette comparison, estimated cigarettes avoided, and local data export without external accounts.

---

## Features

### 1. Landing & Initiation
- Original branding configured in a single config file (`src/config/app.config.ts`).
- Sound and reduced-motion quick toggles.
- Transparent, ethical harm-reduction statement (not a medical device or cessation drug).

### 2. Brand & Atmospheric Selection
- Config-driven virtual brands with custom ember profiles and filter bands.
- Keyboard navigation (arrow keys to cycle, Enter to start).
- Choice between **6 draws** (brisk pause) or **7 draws** (classic duration).
- 3 atmospheric background settings: **Rainy Window**, **Clear Balcony**, **Foggy Terrace**.

### 3. Tactile First-Person Scene & State Machine
- Predictable finite state machine: `idle` → `lighting` → `ready` → `inhaling` → `recovering` → `completed` / `paused`.
- Perspective scale shift and dynamic hand movement during draw.
- Dynamic radial ember bloom that casts heat light across the surrounding knuckles and environment.
- Tab auto-pause using HTML5 Page Visibility API.
- Rejection of double-click and rapid input spam during active animations.

### 4. Progress & Harm Reduction Dashboard
- Daily baseline editor (cigarettes/day & pack price).
- One-click logging for real cigarettes smoked.
- 7-day visual comparison bar chart.
- Calculation of estimated cigarettes avoided and financial savings.
- Local JSON export and permanent data wipe tools.

---

## Screenshots

| First-Person Ritual Scene | Brand Selection |
| :---: | :---: |
| ![Ritual Scene](public/assets/foreground/hand-lit.jpg) | ![Rainy Atmosphere](public/assets/backgrounds/rainy-window.jpg) |

| Clear Balcony | Foggy Terrace |
| :---: | :---: |
| ![Clear Balcony](public/assets/backgrounds/clear-evening.jpg) | ![Foggy Terrace](public/assets/backgrounds/foggy-night.jpg) |

---

## Prerequisites
- **Node.js**: v18.17.0+ (Tested on v22.x)
- **npm**: v9.0.0+ (or pnpm / yarn)

---

## Quickstart

### 1. Clone & Install
```bash
git clone <repository-url>
cd "virtual cigs"
npm install
```

### 2. Run Locally in Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 3. Run Automated Tests
```bash
npm run test
```

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## Environment Variables
The application runs 100% locally in MVP mode with zero mandatory secrets. See `.env.example`:
```bash
# Optional for custom deployments
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Free-Tier Deployment (Vercel)

This application is optimized for zero-cost hosting on Vercel:
1. Push repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) with GitHub.
3. Import the project repository.
4. Leave build settings as default (`next build`).
5. Deploy.

No external databases, paid cloud functions, or API subscriptions are required.

---

## Known Limitations & Design Decisions
- **Web Audio Gesture Restriction**: Modern browsers require a user interaction (tap/click/key press) before playing audio. The app automatically resumes the AudioContext upon the first button press.
- **Harm Reduction Positioning**: The app is strictly a mindfulness and tactile reduction tool; it should never be marketed as a substitute for professional clinical cessation programs.

---

## Documentation Index
- [`GEMINI.md`](GEMINI.md): Agent system instructions and coding invariants.
- [`docs/PRD.md`](docs/PRD.md): Product Requirements Document.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): Component and state architecture.
- [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md): Completed milestone phases.
- [`docs/ASSET_GUIDE.md`](docs/ASSET_GUIDE.md): Asset specs, optimization, and replacement.
- [`docs/ASSET_MANIFEST.md`](docs/ASSET_MANIFEST.md): Inventory of assets and licensing.
- [`docs/IMAGE_GENERATION_PROMPTS.md`](docs/IMAGE_GENERATION_PROMPTS.md): Exact AI image prompts.
- [`docs/TESTING.md`](docs/TESTING.md): Testing matrix and verification checklist.
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md): Production hosting guide.
- [`docs/DECISIONS.md`](docs/DECISIONS.md): Architectural Decision Records (ADRs).
