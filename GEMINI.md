# Developer and agent instructions

These instructions define the technical conventions, architecture patterns,
and coding rules for developing the Vesper Ritual project.

## Project identity and purpose

Vesper Ritual is an immersive, sensory, first-person web application designed
to support adult smokers in reducing real cigarette consumption. It recreates
the familiar hand-to-mouth tactile and visual ritual in a private, atmospheric
digital space without smoke, carbon monoxide, or combustion.

<!-- prettier-ignore -->
> [!IMPORTANT]
> **Harm reduction disclaimer**:
> Vesper Ritual is a sensory simulation designed for behavioral mindfulness.
> It does not provide medical claims, clinical smoking cessation therapy,
> or diagnostic evaluation.

---

## Tech stack

- **Framework**: Next.js 14+ (App Router, Server and Client Components)
- **Language**: TypeScript with strict type checking
- **3D graphics engine**: Three.js (WebGL) with dynamic procedural canvas textures
- **Styling**: Tailwind CSS with custom glassmorphism, charcoal, and ember tokens
- **Motion and dynamics**: Framer Motion for UI transitions; custom Three.js
  particle systems for smoke and rain
- **Audio**: Web Audio API procedural synthesis engine (lighter, inhale, tobacco
  crackle, ambient soundscapes, harmonic chimes) with zero external media
  dependencies
- **Validation**: Zod for storage schemas, preferences, and progress logs
- **Testing**: Vitest with jsdom environment

---

## Directory conventions

```
/src
  /app                     # Next.js App Router pages (/, /session, /progress)
  /components
    /brand-selection       # PackIllustration and brand selector cards
    /immersive-scene       # DhakaSceneCanvas, SceneWorld, FirstPersonHand3D,
                           # SmokeParticles3D, ProceduralTextures, DhakaProps
    /session-controls      # GlassRitualControls, SessionHUD, SessionCompletion
    /ui                    # Buttons, sliders, badges, glass containers
  /config                  # app.config.ts, brands.config.ts,
                           # environments.config.ts, dhakaScene.config.ts
  /features
    /session               # sessionStateMachine.ts (finite state machine reducer)
    /audio                 # audioManager.ts (Web Audio procedural synthesis)
    /reduction             # Metrics and avoidance calculation utilities
  /lib
    /storage               # localStorage.ts (versioned storage manager)
    /validation            # schemas.ts (Zod validation schemas)
  /types                   # session.ts, brand.ts, progress.ts, environment.ts
/public
  /assets
    /brands                # Authentic brand pack PNG cutouts (9 brands)
    /models                # 3D assets (cigarette.glb, low_poly_hand.glb)
    /backgrounds           # Atmospheric scene backdrops
    /foreground            # Legacy 2D first-person hand assets
/tests
  /unit                    # Vitest unit tests (state machine, storage, audio)
/docs                      # Architecture, PRD, testing, deployment, and ADRs
```

---

## Coding rules and invariants

1. **Deterministic state transitions**:
   The session state machine must be the single source of truth for all ritual
   interactions (`idle` → `lighting` → `ready` → `inhaling` → `recovering` →
   `completed` / `paused`). Never bypass the reducer.
2. **Double-click and spam prevention**:
   The reducer strictly ignores `INHALE` actions when the state is not `ready`.
   Do not allow animation desync or double counting.
3. **Client-side WebGL boundary**:
   Always wrap Three.js canvas components in `next/dynamic` with `{ ssr: false }`
   in client pages to prevent server-side Node.js rendering collisions with the
   WebGL and DOM canvas context.
4. **Always-visible unlocked cursor**:
   The viewport must maintain standard cursor visibility (`cursor-default`) at
   all times. Do not capture or lock the pointer. Let users freely interact
   with overlay controls and drag to look around.
5. **Reactive scene updates without context destruction**:
   When updating active brands or weather, pass updates through ref methods
   (such as `updateBrand` and `setRainVisible`) rather than unmounting and
   re-instantiating the WebGL renderer.
6. **Audio autoplay and offline resilience**:
   Create and resume the `AudioContext` lazily on user gesture. All audio
   effects must support procedural synthesis fallbacks so missing external
   audio files never crash the app.
7. **Data sovereignty and privacy**:
   Store all progress data in `localStorage` with versioned schemas
   (`vesper_ritual_storage_v1`) validated through Zod. Never transmit tracking
   data to third-party analytics services without user consent.
8. **Reduced motion compliance**:
   Respect `prefers-reduced-motion` and user preference settings by pausing
   particle simulations and camera breathing sway.

---

## Running and testing

### Development server

```bash
npm run dev
# Open http://localhost:3000
```

### Run automated unit tests

```bash
npm run test
```

### Production build

```bash
npm run build
```

---

## Architecture change protocol

Whenever modifying state machine transitions, storage schemas, or audio
synthesizers:

1. Update corresponding type definitions in `src/types/`.
2. Update unit test cases in `tests/unit/`.
3. Update `docs/ARCHITECTURE.md` and document decisions in `docs/DECISIONS.md`.
