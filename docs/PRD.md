# Product requirements document: Vesper Ritual

This document defines the product vision, user personas, functional scope,
technical requirements, and acceptance criteria for Vesper Ritual.

## Executive summary

Vesper Ritual is an immersive, first-person digital sensory experience designed
to support adult smokers who wish to reduce real cigarette consumption. By
digitally recreating the tactile, visual, and auditory pacing of a smoking
pause (lighting, rhythmic draws, ember glow, curling smoke, and meditative
stillness), users satisfy the habitual hand-to-mouth motor impulse without
inhaling toxic combustion products.

The application loads directly into an interactive 3D retro Dhaka street scene
with a single-screen Refractive Glass UI, authentic brand packs, and natural
mouse look-around controls.

---

## Problem statement

Smoking cessation is notoriously difficult partly because nicotine dependence is
tightly intertwined with deeply conditioned behavioral rituals:

- The sensory hand-to-mouth motion performed dozens of times every day.
- The visual cues of the burning ember, rising smoke, and ash line.
- The auditory cues of the lighter spark, air draw, and ambient calm.
- The dedicated three-to-five minute mental pause in a stressful workday.

Most cessation applications focus exclusively on cold-turkey countdown timers
and guilt-inducing relapse trackers. Vesper Ritual focuses on harm reduction
through behavioral substitution and ritual mindfulness.

---

## Target user personas

Understanding the varied motivations of reducing smokers shapes our UX
decisions.

### Persona A: The Mindful Reducer (Mark, 34)

- **Profile**: Smokes 15 cigarettes daily. Wants to cut down to under 5 or quit
  gradually.
- **Pain point**: Finds chewing gum and nicotine lozenges unsatisfying because
  they lack the physical hand-to-mouth gesture and the visual pause.
- **Need**: A private, aesthetic digital experience he can open on his phone or
  laptop during smoke breaks.

### Persona B: The Stress-Break Smoker (Elena, 28)

- **Profile**: Smokes during intense work blocks primarily to step away and
  breathe.
- **Pain point**: Feels anxious without the habitual pause, leading to rapid
  relapse.
- **Need**: An atmospheric, nonjudgmental space that delivers a structured
  two-to-three minute breathing cadence.

---

## User stories

The core user experience is structured around the following journeys:

1. **As an adult smoker**, I want to pick an authentic brand aesthetic from a
   digital humidor so that the simulation resonates with my personal habits.
2. **As a user in a craving moment**, I want to manually trigger discrete draws
   with realistic ember flare and smoke billows so that I experience a
   structured, tactile pause.
3. **As a user exploring the app**, I want to land directly on an interactive
   scene with a single-screen layout and zero scrolling so that I can begin my
   ritual immediately without friction.
4. **As a user concerned about privacy**, I want all my reduction logs to remain
   on my local device without creating an account or leaking personal data.
5. **As an interrupted user**, I want the simulation to pause automatically if I
   switch tabs so that I do not lose my place or feel penalized.
6. **As an accessibility-conscious user**, I want full keyboard controls, an
   unlocked mouse cursor, and reduced-motion modes that prevent motion sickness.

---

## Scope and non-goals

Setting clear product boundaries ensures project focus and privacy integrity.

### In scope

- Real-time 3D retro Dhaka street scene loaded directly on the starting page.
- Single-screen layout constrained to 100% viewport height with zero scrolling.
- Refractive Glass UI control panel featuring semi-transparent frosted buttons.
- Nine authentic brand packs with transparent cutout artwork: Benson & Hedges,
  Marlboro Red, Marlboro Gold, Navy, Star, Sheikh, Lucky Strike, Camel Connect,
  and Dunhill.
- Centered first-person cigarette viewmodel with live ember bloom and dynamic
  burn progression.
- Natural unlocked mouse look-around without pointer lock interruptions.
- Atmospheric weather controls (Rain, Clear, Fog) with procedural soundscapes.
- Six or seven discrete draw cadences.
- Procedural Web Audio API sound generator (lighter, draw, crackle, exhale,
  ambient, and chime).
- Predictable finite state machine (`idle` → `lighting` → `ready` → `inhaling`
  → `recovering` → `completed` / `paused`).
- LocalStorage progress dashboard with daily real cigarette logging, avoided
  cigarette calculations, and a seven-day visual chart.
- Offline local JSON data export, import, and permanent reset tools.

### Non-goals (out of scope)

- **No medical claims**: Never advertise as a clinically approved medical
  therapy or cessation device.
- **No gamification or streaks**: No badges, leveling up, or punishment for
  leaving early.
- **No mandatory accounts**: No external login, email harvesting, or mandatory
  cloud databases.
- **No third-party analytics**: Zero behavioral telemetry or ad tracking.

---

## Acceptance criteria

The application must satisfy the following measurable criteria:

- [x] Application compiles cleanly with TypeScript in strict mode.
- [x] All nine configured brands are selectable with distinct filter palettes
      and pack artwork cutouts.
- [x] Inhale interaction produces synchronized visual ember flare, smoke
      billows, and audio crackle.
- [x] Finite state machine prevents double-counting or desync during draw
      animations.
- [x] Auto-pauses on visibility change when switching tabs.
- [x] Mouse pointer remains visible and uncaptured across the 3D viewport.
- [x] Progress dashboard calculates avoided cigarettes based on user-defined
      baseline.
- [x] Functions 100% offline without external network dependencies.
