# Architectural Decision Records (ADRs): Vesper Ritual

## ADR 1: Client-Side Procedural Audio Synthesis vs. Remote Audio Files
- **Status**: Accepted
- **Context**: The application requires synchronized audio cues for lighter clicks, inhale draws, tobacco leaf crackle, ambient soundscapes, and completion chimes.
- **Alternatives Considered**:
  1. *Host external MP3/WAV files on S3/CDN*: Risk of HTTP 404s, CORS restrictions, bandwidth costs, and network latency causing audio desynchronization with visual ember animations.
  2. *Synthesize all sound procedurally using the Web Audio API*: Zero external asset dependencies, zero network latency, zero hosting cost, and infinite seamless looping for rain and wind.
- **Decision**: Implemented `AudioManager` with procedural synthesizers using biquad filters, pink/white noise generators, and oscillators. Local audio files remain an optional enhancement.

---

## ADR 2: 2D Fluid Canvas Smoke & Layered Compositing vs. 3D WebGL / Three.js
- **Status**: Accepted
- **Context**: The first-person scene must recreate a realistic hand, cigarette, burning ember, and rising smoke with believable depth.
- **Alternatives Considered**:
  1. *Full 3D Engine (Three.js / React Three Fiber)*: High bundle size (+600KB), complex 3D hand rigging, high GPU and battery drain on mobile phones, and cartoonish look without expensive photorealistic shaders.
  2. *2.5D Layered Compositing with Canvas Particle Simulation*: Combines photographic high-resolution hand textures, CSS perspective transforms, and an HTML5 2D particle canvas for fluid smoke.
- **Decision**: Adopted 2.5D layered compositing. Delivers superior photographic realism, lightweight bundle size, 60fps performance on mobile, and battery-friendly execution.

---

## ADR 3: Pure Reducer Finite State Machine vs. Ad-Hoc Boolean States
- **Status**: Accepted
- **Context**: Cigarette rituals involve strict sequential timing (`idle` → `lighting` → `ready` → `inhaling` → `recovering` → `completed` / `paused`). Rapid user clicks could corrupt state if managed through disconnected `useState` booleans.
- **Decision**: Implemented a pure, deterministic `sessionReducer` in `src/features/session/sessionStateMachine.ts` with explicit guard conditions that reject invalid transitions.

---

## ADR 4: Versioned LocalStorage with Zod Validation vs. Cloud Backend for MVP
- **Status**: Accepted
- **Context**: Target users want private, nonjudgmental tracking without submitting sensitive habits to a remote server.
- **Decision**: Stored all user preferences and daily progress logs in `localStorage` under `vesper_ritual_storage_v1` validated through Zod schemas. Avoids server costs, ensures 100% offline functionality, and guarantees absolute user privacy. Cloud sync remains a documented option for future iterations.

---

## ADR 5: Original Stylized Brand Art vs. Trademarked Imagery
- **Status**: Accepted
- **Context**: User requested recognizable brand labels: Navy, Marise, Marlboro, Gold Leaf.
- **Decision**: Kept brand names as user-facing selection labels, but implemented 100% original, stylized geometric vector pack cards (chevrons, maritime stripes, European crests, gilded leaf botanical motifs) to prevent trademark infringement and avoid misrepresenting tobacco manufacturer endorsement.
