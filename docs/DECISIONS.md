# Architectural decision records (ADRs): Vesper Ritual

This document records the architectural and design decisions made throughout the
evolution of Vesper Ritual, detailing context, alternatives, and rationales.

## ADR 1: Client-side procedural audio synthesis versus remote audio files

We evaluated whether to load external audio recordings or generate audio
procedurally in the browser.

- **Status**: Accepted
- **Context**: The ritual requires synchronized audio cues for lighter flicks,
  inhale draws, tobacco leaf crackle, ambient soundscapes, and completion
  chimes.
- **Alternatives considered**:
  1. *Host external MP3 or WAV files on an S3 bucket or CDN*: Risk of HTTP 404
     errors, CORS restrictions, bandwidth costs, and network latency causing
     audio desynchronization with visual ember flares.
  2. *Synthesize all sounds procedurally using the Web Audio API*: Zero external
     asset dependencies, zero network latency, zero hosting cost, and infinite
     seamless looping for weather ambience.
- **Decision**: Implemented `AudioManager` using procedural Web Audio synthesis
  with biquad filters, pink and white noise buffers, and oscillators.

---

## ADR 2: 2D layered compositing versus 3D WebGL engine (initial phase)

During early prototyping, we evaluated whether to construct a 2D composited
layering system or an immediate 3D environment.

- **Status**: Superseded by ADR 6
- **Context**: The MVP required a responsive first-person viewpoint depicting a
  hand, cigarette, burning ember, and rising smoke.
- **Alternatives considered**:
  1. *Full 3D WebGL engine*: High initial setup cost and rigging complexity.
  2. *2.5D layered compositing with 2D canvas particle simulation*: High-res
     photographic cutouts with CSS transforms and 2D canvas smoke.
- **Decision**: Initially adopted 2.5D layered compositing for rapid MVP
  deployment. Later superseded by ADR 6 to deliver true spatial immersion.

---

## ADR 3: Pure reducer finite state machine versus ad-hoc boolean states

We evaluated how to manage ritual step progression, draw counters, and UI
transitions safely.

- **Status**: Accepted
- **Context**: Cigarette rituals follow strict sequential timing (`idle` →
  `lighting` → `ready` → `inhaling` → `recovering` → `completed` / `paused`).
  Rapid user interactions could corrupt state if managed through disconnected
  component states.
- **Alternatives considered**:
  1. *Component-level `useState` variables*: Prone to race conditions and
     inconsistent timer updates across subcomponents.
  2. *Pure reducer finite state machine*: Centralized state transitions with
     immutable dispatching and strict transition guard conditions.
- **Decision**: Implemented a pure, deterministic `sessionReducer` in
  `src/features/session/sessionStateMachine.ts` that enforces state validity and
  rejects rapid double-clicks.

---

## ADR 4: Versioned local storage with Zod validation versus cloud database

We evaluated whether to mandate a cloud database backend or use browser
storage.

- **Status**: Accepted
- **Context**: Target users value privacy and nonjudgmental reduction tracking
  without submitting sensitive habit data to remote servers.
- **Alternatives considered**:
  1. *Remote database with user authentication (Supabase or Firebase)*: Mandates
     login friction, creates database maintenance overhead, and exposes
     personal usage data.
  2. *Versioned `localStorage` with Zod schema validation*: Guarantees total
     data privacy, zero cloud costs, and 100% offline functionality.
- **Decision**: Stored all user preferences and daily progress logs in
  `localStorage` under `vesper_ritual_storage_v1` validated through Zod
  schemas.

---

## ADR 5: Stylized vector pack cards versus authentic brand cutouts (initial phase)

During the initial concept phase, we evaluated using stylized original vectors
for brand selection.

- **Status**: Superseded by ADR 8
- **Context**: The application required visual representations for cigarette
  brand selection.
- **Alternatives considered**:
  1. *Stylized vector cards*: Generic geometric motifs.
  2. *Authentic brand imagery*: Recognizable pack art familiar to adult
     smokers.
- **Decision**: Initially implemented stylized vector cards. Later superseded
  by ADR 8 based on user requests for an authentic digital humidor.

---

## ADR 6: Adoption of real-time 3D WebGL and Three.js retro Dhaka scene

We evaluated upgrading the core visual environment from static 2D imagery to a
real-time 3D world.

- **Status**: Accepted (Supersedes ADR 2)
- **Context**: Users desired deeper spatial immersion, atmospheric lighting,
  and dynamic look-around capabilities set in a nighttime Dhaka alley.
- **Alternatives considered**:
  1. *Continue with 2.5D static photography*: Limited to fixed camera angles
     without dynamic lighting or environmental depth.
  2. *Build a real-time Three.js 3D scene*: Full 3D camera look-around, dynamic
     point lights for streetlamps and ember bloom, catenary utility wires,
     procedural textures, and realistic particle systems.
- **Decision**: Built a custom Three.js WebGL engine in `DhakaSceneCanvas.tsx`
  featuring roadside tea stalls ("চায়ের টং"), cycle rickshaws, green CNGs, and
  procedural night rain.

---

## ADR 7: Single-screen starting page layout with refractive glass UI theme

We evaluated the layout architecture for the landing and session initiation
experience.

- **Status**: Accepted
- **Context**: Navigating multiple pages (`/` → `/select` → `/session`) added
  unnecessary friction for users seeking an immediate mindful pause.
- **Alternatives considered**:
  1. *Multi-page funnel*: A long marketing landing page with scrolling and
     separate selection screens.
  2. *Single-screen full-viewport starting page with zero scrolling*: The 3D
     scene loads immediately at `/`, overlaid with a semi-transparent Refractive
     Glass UI panel housing brand selection, weather toggles, cadence, and
     ignition.
- **Decision**: Adopted a single-screen layout constrained to 100% dynamic
  viewport height (`100dvh`) with `GlassRitualControls`.

---

## ADR 8: Authentic pack artwork integration with nine-brand digital humidor

We evaluated incorporating authentic cigarette brand packaging assets into the
application.

- **Status**: Accepted (Supersedes ADR 5)
- **Context**: Smokers strongly identify with their specific brand's tactile and
  visual packaging. Providing authentic artwork creates a more effective
  psychological ritual substitute.
- **Alternatives considered**:
  1. *Generic unbranded cylinders*: Lacks personal resonance.
  2. *Nine authentic high-resolution pack PNG cutouts*: Includes Benson &
     Hedges, Marlboro Red, Marlboro Gold, Navy, Star, Sheikh, Lucky Strike,
     Camel Connect, and Dunhill integrated into semi-transparent buttons.
- **Decision**: Integrated all nine authentic pack PNG cutouts into
  `public/assets/brands/` with customized filter wraps, burning rates, and draw
  acoustics.

---

## ADR 9: First-person stationary viewmodel and natural unlocked cursor

We evaluated camera ergonomics, pointer locking, and viewmodel positioning.

- **Status**: Accepted
- **Context**: Pointer locking and required modifier keys (such as `Ctrl`)
  created confusing UX, while low-poly hand meshes distracted from the mindful
  focus.
- **Alternatives considered**:
  1. *Pointer lock mode with robotic hand meshes*: Captures the cursor, hides the
     mouse pointer, and requires complex escape controls.
  2. *Centered stationary cigarette viewmodel with unlocked cursor*: The mouse
     cursor remains visible (`cursor-default`) at all times. Users can click any
     UI button directly or drag anywhere to look around smoothly.
- **Decision**: Centered the 3D cigarette viewmodel (`Y ≈ 50%–55%`,
  `X ≈ 50%–52%`), hid hand meshes, and implemented natural unlocked cursor
  controls.

---

## ADR 10: Randomized draw audio playback and tactile brand selection acoustics

We evaluated audio playback strategies for post-draw feedback and brand selection
interactions.

- **Status**: Accepted
- **Context**: Users requested authentic randomized audio playback after every
  cigarette draw, as well as distinct physical feedback when choosing brands.
- **Alternatives considered**:
  1. *Pure procedural generation*: Zero external media, but cannot reproduce
     specific user-recorded audio variations.
  2. *Single repeated static audio file*: Causes acoustic fatigue.
  3. *Hybrid buffer caching with fallback and procedural micro-synthesis*:
     Preloads and normalizes all six randomized draw audio clips in both MP3 and
     OGG formats. Simultaneously synthesizes an ultra-low-latency mechanical
     click for brand selections using Web Audio API oscillators and bandpass
     noise bursts.
- **Decision**: Implemented `playRandomDrawSound()` with non-repeating random
  selection across six normalized clips, paired with `playBrandClick()` for
  tactile mechanical feedback during brand selection.

---

## ADR 11: Persistent unique user database and top 1000 smokers leaderboard

We evaluated storage and retrieval architectures for mandatory unique user
identification and global cigarette consumption rankings.

- **Status**: Accepted
- **Context**: The application requires each participant to register a unique
  identifier conforming to strict syntax rules (alphabets, numbers, and the `@`,
  `#`, and `$` symbols without whitespace). Completed cigarette rituals must be
  recorded against this identifier, and a public leaderboard must rank the top
  1,000 smokers by total burnt cigarettes.
- **Alternatives considered**:
  1. *Heavy external SQL or NoSQL database (PostgreSQL or MongoDB)*: Introduces
     external network dependencies and hosting costs for a lightweight local
     application.
  2. *Pure client-side browser localStorage*: Data cannot be shared across
     different devices or browsers to form a real communal leaderboard.
  3. *Atomic file-backed database with in-memory caching and Next.js route
     handlers*: Uses Node.js file system primitives (`data/database.json`) with
     atomic write-and-rename mechanics. Serves instant responses from memory,
     persists state across server restarts, and requires zero external database
     dependencies.
- **Decision**: Implemented `src/lib/db/database.ts` with Next.js route handlers
  at `/api/users`, `/api/burns`, and `/api/leaderboard`. Paired with a client
  registration modal (`UserNameModal.tsx`) and an authentic retro Dhaka
  leaderboard interface (`/leaderboard`).

---

## ADR 12: Incandescent charcoal ember simulation with organic ash fissure mapping

We evaluated visual rendering techniques for the cigarette combustion tip to replace
unrealistic flat LED lighting.

- **Status**: Accepted
- **Context**: The lit cigarette ember previously appeared like an artificial,
  solid glowing LED light bulb rather than porous, smoldering tobacco ash with
  incandescent coal veins.
- **Alternatives considered**:
  1. *High-intensity emissive solid color shader*: Fast to render, but creates a
     synthetic neon look devoid of combustion realism.
  2. *Static photographic tip texture*: Does not interact dynamically with camera
     lighting or distance.
  3. *Multi-layer procedural ash core with hot fissure emissive mapping*: Generates
     a dedicated 256x256 ash-and-charcoal texture with dark porous crusts, jagged
     incandescent fissure veins, restrained emissive intensity (0.8), and a
     physically scaled ember cone with a soft warm point light.
- **Decision**: Implemented `ProceduralTextures.createEmberTexture()` combining
  deep charcoal basalt tones, white flake ash borders, and glowing red-orange
  sub-surface fissures for physical combustion authenticity.

---

## ADR 13: Procedural brand-accurate cigarette livery and tipping textures

We evaluated how to render authentic real-world brand typography, insignias, and
tipping papers on the 3D cigarette model.

- **Status**: Accepted
- **Context**: Users requested that each selected cigarette brand display its
  authentic real-world counterpart directly on the cigarette cylinder (e.g. Marlboro
  Red chevron, Benson & Hedges royal coat of arms, Sheikh emerald laurel and star,
  Navy maritime anchor, Star ruby red star, Lucky Strike bullseye, Camel dromedary,
  Dunhill crest) and authentic tipping papers (cork speckles, matte linen white,
  charcoal, and polished metallic foil separator bands).
- **Alternatives considered**:
  1. *Generic unbranded GLTF model override*: Renders a static unbranded texture
     that hides brand identity and cannot change reactively.
  2. *Procedural dynamic canvas texturing with 360-degree cylindrical UV mapping*:
     Generates 1024x512 high-resolution laid paper textures with authentic typography,
     dual-circumference stampings, and brand-specific separator foil bands. Automatically
     maintains undistorted brand stamps during burn-down via reciprocal UV repeat mapping.
- **Decision**: Implemented `ProceduralTextures.createBrandFilterTexture()` and
  `ProceduralTextures.createBrandPaperTexture()`, connected dynamically via
  `FirstPersonHand3D.updateBrand(brand)` and updated reactively without WebGL
  context destruction.

---

## ADR 14: Dynamic street ambient NPCs (Roadside tea maker and curbside brawl)

We evaluated how to populate the retro Dhaka street scene with authentic ambient
characters and life.

- **Status**: Accepted
- **Context**: The tea stall previously lacked human presence, and users requested
  an authentic desi tea vendor ("চায়ের মামা") actively making tea behind the stall counter,
  along with 3 animated NPCs engaged in a street brawl right beside the tea stall.
- **Alternatives considered**:
  1. *Static photographic cutout billboards*: Lacks 3D depth and cannot animate.
  2. *Heavy external rigged humanoid GLTF meshes*: Bloats network payloads, introduces
     external licensing/loading dependencies, and slows initial scene startup.
  3. *Hierarchical procedural Three.js humanoid rigs with articulated joint animation*:
     Constructs low-poly stylized figures dressed in authentic Bangladeshi clothing
     (plaid lungi, red checkered gamcha, ribbed vest, casual checked shirt, and white panjabi)
     with canvas face textures, articulated shoulder/elbow/neck pivot groups, and
     lightweight 60fps render-loop animation.
- **Decision**: Implemented `StreetNPCs.ts` featuring:
  - `TeaVendorNPC`: Positioned behind the wooden tea stall counter, performing a
    classic high-pour tea pulling motion with stainless steel pot, glass, golden milk
    tea stream, and rising steam particles.
  - `StreetFightNPCs`: 3 NPCs positioned curbside beside the tea stall bench under
    the streetlamp, animating rapid jabs, lunges, defensive ducking/dodging, and a
    frantic third bystander in white panjabi desperately trying to break up the scuffle.
  - Unified scene update loop driven via `world.update(delta, time)`.
