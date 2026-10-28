# GEMINI.md — Agent & Developer Persistent Instruction Guide

## Project Identity & Purpose
**Vesper Ritual** is an immersive, sensory, first-person web application designed to support adult smokers in reducing real cigarette consumption. It recreates the familiar hand-to-mouth tactile and visual ritual in a private, atmospheric digital space without smoke, carbon monoxide, or combustion.

> [!IMPORTANT]
> **Harm Reduction Disclaimer**:
> Vesper Ritual is a sensory simulation designed for behavioral mindfulness. It does not provide medical claims, clinical smoking cessation therapy, or diagnostic evaluation.

---

## Tech Stack
- **Framework**: Next.js 14+ (App Router, Server & Client Components)
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS with custom charcoal, ember, and cinematic atmospheric design tokens
- **Motion & Dynamics**: Framer Motion for scene transitions; HTML5 2D Canvas for fluid smoke particle physics
- **Audio**: Web Audio API procedural synthesis engine (lighter, inhale, tobacco crackle, ambient soundscapes, harmonic chimes) with zero external media dependencies
- **Validation**: Zod for storage schemas, preferences, and progress logs
- **Testing**: Vitest with jsdom environment

---

## Directory Conventions
```
/src
  /app                     # Next.js App Router pages (/, /select, /session, /progress)
  /components
    /brand-selection       # PackIllustration & brand selector grid
    /immersive-scene       # ImmersiveScene, SmokeCanvas, EmberGlow
    /session-controls      # SessionHUD, SessionCompletion modal
    /ui                    # Buttons, sliders, badges
  /config                  # app.config.ts, brands.config.ts, environments.config.ts
  /features
    /session               # sessionStateMachine.ts (Finite State Machine reducer)
    /audio                 # audioManager.ts (Web Audio synthesis)
    /reduction             # Metrics & avoidance calculations
  /lib
    /storage               # localStorage.ts (Versioned storage manager)
    /validation            # schemas.ts (Zod schemas)
  /types                   # session.ts, brand.ts, progress.ts, environment.ts
/public
  /assets
    /backgrounds           # Atmospheric scene backdrops (rainy-window, clear-evening, foggy-night)
    /foreground            # First-person hand assets (hand-lit, hand-unlit)
    /brands                # Brand iconography
/tests
  /unit                    # Vitest unit tests (state machine, storage, audio)
/docs                      # PRD, Architecture, Asset Guide, Testing, Deployment, ADRs
```

---

## Coding Rules & Invariants
1. **Deterministic State Transitions**:
   The session state machine must be the single source of truth for all ritual interactions (`idle` -> `lighting` -> `ready` -> `inhaling` -> `recovering` -> `completed` / `paused`). Never bypass the reducer.
2. **Double-Click & Spam Prevention**:
   The reducer strictly ignores `INHALE` actions when the state is not `ready`. Do not allow animation desync or double counting.
3. **Audio Autoplay & Offline Resilience**:
   AudioContext is lazily created and resumed on user gesture. All audio effects must support procedural synthesis fallbacks so missing external audio files never crash the app.
4. **Data Sovereignty & Privacy**:
   All progress data is stored in `localStorage` with versioned schemas (`vesper_ritual_storage_v1`) validated via Zod. Never send tracking data to third-party analytics without user consent.
5. **Reduced Motion Compliance**:
   Respect `prefers-reduced-motion` and user preference settings by disabling particle animations and extreme camera translations.

---

## Running & Testing

### Development Server
```bash
npm run dev
# Open http://localhost:3000
```

### Run Automated Unit Tests
```bash
npm run test
```

### Production Build
```bash
npm run build
```

---

## Architecture Change Protocol
Whenever modifying state machine transitions, storage schemas, or audio synthesizers:
1. Update corresponding type definitions in `src/types/`.
2. Update unit test cases in `tests/unit/`.
3. Update `docs/ARCHITECTURE.md` and document decisions in `docs/DECISIONS.md`.
