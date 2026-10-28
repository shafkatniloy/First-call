# Implementation Plan & Milestone Checklist: Vesper Ritual

## Phase 1 — Foundation & Project Setup
- [x] Inspect workspace and initialize Git repository.
- [x] Configure Next.js App Router, TypeScript (strict), Tailwind CSS, Framer Motion, Lucide React, and Zod.
- [x] Establish design system tokens (`charcoal`, `ember`, `cinematic-shadows`).
- [x] Set up Vitest test environment with jsdom.
- [x] Draft initial technical specification and obtain approval.

## Phase 2 — Core State Machine & Storage
- [x] Implement deterministic Finite State Machine (`src/features/session/sessionStateMachine.ts`).
- [x] Implement states: `idle`, `lighting`, `ready`, `inhaling`, `recovering`, `completed`, `paused`.
- [x] Write comprehensive unit tests for state transitions and duplicate-click rejection (`tests/unit/sessionStateMachine.test.ts`).
- [x] Implement Zod validation schemas for baseline, daily logs, and preferences (`src/lib/validation/schemas.ts`).
- [x] Build versioned `StorageManager` with automatic schema repair and JSON export/import (`src/lib/storage/localStorage.ts`).
- [x] Write unit tests for storage resilience and data recovery (`tests/unit/storage.test.ts`).

## Phase 3 — Procedural Audio Engine
- [x] Design `AudioManager` singleton using the Web Audio API (`src/features/audio/audioManager.ts`).
- [x] Synthesize lighter click and flame ignition whoosh.
- [x] Synthesize rhythmic inhale draw with stochastic tobacco leaf crackle.
- [x] Synthesize gentle exhale breath dissipation.
- [x] Synthesize continuous ambient soundscapes (rain on window, night breeze, foggy terrace).
- [x] Synthesize meditative completion chord chime.
- [x] Write unit tests for audio manager lifecycle and volume clamping (`tests/unit/audioManager.test.ts`).

## Phase 4 — Visual Assets & First-Person Scene
- [x] Generate cinematic high-resolution background assets (`rainy-window.jpg`, `clear-evening.jpg`, `foggy-night.jpg`).
- [x] Generate matching first-person hand assets (`hand-lit.jpg`, `hand-unlit.jpg`).
- [x] Generate luxury emblem brand icon (`brand-icon.jpg`).
- [x] Build 2D HTML5 Canvas particle smoke simulation with fluid turbulence (`src/components/immersive-scene/SmokeCanvas.tsx`).
- [x] Build dynamic `EmberGlow` with heat bloom and ignition flare.
- [x] Assemble `ImmersiveScene` with perspective hand translation, background breathing motion, and reduced-motion fallbacks.

## Phase 5 — User Interface & Pages
- [x] Create original stylized brand pack illustrations (`src/components/brand-selection/PackIllustration.tsx`).
- [x] Build Brand & Ritual Selection page with keyboard navigation and 6 vs 7 draw selector (`src/app/select/page.tsx`).
- [x] Build Session HUD with tactile controls, spacebar shortcuts, and pause overlay (`src/components/session-controls/SessionHUD.tsx`).
- [x] Build Session Completion modal with duration stats and consumption logger (`src/components/session-controls/SessionCompletion.tsx`).
- [x] Build interactive session controller container (`src/app/session/page.tsx`).
- [x] Build Smoking-Reduction Progress Dashboard with daily tracking and 7-day SVG chart (`src/app/progress/page.tsx`).
- [x] Build cinematic Landing Page with harm-reduction statement (`src/app/page.tsx`).

## Phase 6 — Quality Assurance & Documentation
- [x] Run Vitest unit tests (all 16 tests passing).
- [x] Verify Next.js production build (`npm run build` succeeds).
- [x] Write `GEMINI.md` agent rules.
- [x] Write `README.md` user guide.
- [x] Write `docs/PRD.md`.
- [x] Write `docs/ARCHITECTURE.md`.
- [x] Write `docs/ASSET_GUIDE.md`.
- [x] Write `docs/ASSET_MANIFEST.md`.
- [x] Write `docs/IMAGE_GENERATION_PROMPTS.md`.
- [x] Write `docs/TESTING.md`.
- [x] Write `docs/DEPLOYMENT.md`.
- [x] Write `docs/DECISIONS.md`.
- [x] Maintain clean `.env.example` and `.gitignore`.
