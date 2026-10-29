# Implementation plan and milestone checklist: Vesper Ritual

This document records the completed milestone phases, technical accomplishments,
and progressive feature delivery across the lifecycle of Vesper Ritual.

## Phase 1 — Foundation and project setup

Phase 1 established the core development environment, toolchain, and styling
tokens:

- [x] Configure Next.js App Router, TypeScript (strict mode), Tailwind CSS,
      Framer Motion, Lucide React, and Zod.
- [x] Establish design system tokens (`charcoal`, `ember`, `cinematic-shadows`).
- [x] Set up Vitest test environment with jsdom support.
- [x] Draft initial technical specification and architectural roadmap.

---

## Phase 2 — Core state machine and storage

Phase 2 implemented deterministic state management and resilient client-side
persistence:

- [x] Implement deterministic finite state machine
      (`src/features/session/sessionStateMachine.ts`).
- [x] Implement states: `idle`, `lighting`, `ready`, `inhaling`, `recovering`,
      `completed`, and `paused`.
- [x] Write comprehensive unit tests for state transitions and duplicate-click
      rejection (`tests/unit/sessionStateMachine.test.ts`).
- [x] Implement Zod validation schemas for baseline, daily logs, and preferences
      (`src/lib/validation/schemas.ts`).
- [x] Build versioned `StorageManager` with automatic schema repair and JSON
      backup tools (`src/lib/storage/localStorage.ts`).
- [x] Write unit tests for storage resilience and data recovery
      (`tests/unit/storage.test.ts`).

---

## Phase 3 — Procedural audio engine

Phase 3 built zero-dependency audio synthesis using the Web Audio API:

- [x] Design `AudioManager` singleton (`src/features/audio/audioManager.ts`).
- [x] Synthesize lighter flick and flame ignition whoosh.
- [x] Synthesize rhythmic inhale draw with stochastic tobacco leaf crackle.
- [x] Synthesize gentle exhale breath dissipation.
- [x] Synthesize continuous ambient soundscapes (rain on tin, breeze, and fog).
- [x] Synthesize meditative completion chord chime.
- [x] Write unit tests for audio manager lifecycle and volume clamping
      (`tests/unit/audioManager.test.ts`).

---

## Phase 4 — Visual assets and 2D scene foundation

Phase 4 assembled the initial visual layering and canvas particle system:

- [x] Generate high-resolution reference backgrounds (`rainy-window.jpg`,
      `clear-evening.jpg`, `foggy-night.jpg`).
- [x] Generate first-person hand reference assets (`hand-lit.jpg`,
      `hand-unlit.jpg`).
- [x] Generate luxury emblem brand icon (`brand-icon.jpg`).
- [x] Build 2D HTML5 Canvas particle smoke simulation.
- [x] Build dynamic `EmberGlow` with heat bloom and ignition flare.

---

## Phase 5 — User interface and pages

Phase 5 developed the multi-screen navigation flows and reduction tracking:

- [x] Build Brand and Ritual Selection page with keyboard navigation
      (`src/app/select/page.tsx`).
- [x] Build Session HUD with tactical controls and pause overlay
      (`src/components/session-controls/SessionHUD.tsx`).
- [x] Build Session Completion modal with duration stats
      (`src/components/session-controls/SessionCompletion.tsx`).
- [x] Build interactive session controller container (`src/app/session/page.tsx`).
- [x] Build Smoking-Reduction Progress Dashboard with daily tracking and seven-day
      chart (`src/app/progress/page.tsx`).

---

## Phase 6 — Quality assurance and verification

Phase 6 executed regression testing and performance benchmarking:

- [x] Execute Vitest unit test suite (16 passing tests).
- [x] Verify Next.js production build (`npm run build` succeeds).
- [x] Verify offline resilience with zero external network calls.
- [x] Author comprehensive project documentation and ADRs.

---

## Phase 7 — Real-time 3D Dhaka environment and glass UI transformation

Phase 7 evolved the application into a real-time 3D experience with a modern
refractive glass interface:

- [x] Implement real-time Three.js WebGL engine in `DhakaSceneCanvas.tsx`.
- [x] Build procedural retro Dhaka street props: tea stall ("চায়ের টং"), cycle
      rickshaw, green CNG auto-rickshaw, utility poles, and hanging cables.
- [x] Generate in-memory procedural canvas textures for signboards, wet asphalt,
      and tin roofs without external downloads.
- [x] Integrate 3D smoke particles (`THREE.Points`) and falling rain streaks
      (`THREE.LineSegments`).
- [x] Transition the starting page (`/`) to the 3D scene with a single-screen,
      zero-scroll layout (`100dvh`).
- [x] Create `GlassRitualControls.tsx` with frosted semi-transparent buttons.
- [x] Integrate all nine authentic brand packs with transparent PNG artwork.
- [x] Center the first-person cigarette viewmodel (`Y ≈ 50%–55%`, `X ≈ 50%–52%`)
      and hide robotic hand meshes.
- [x] Implement permanent unlocked cursor (`cursor-default`) look-around without
      pointer locking or modifier keys.
- [x] Remove middle floating `DRAW` pill from `SessionHUD.tsx`.
