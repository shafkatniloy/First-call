# Product Requirements Document (PRD): Vesper Ritual

## 1. Executive Summary
**Vesper Ritual** is a digital first-person sensory experience designed to support adult smokers who wish to reduce real cigarette consumption. By digitally recreating the tactile, visual, and auditory pacing of a smoking pause (lighting, rhythmic draws, ember glow, curling smoke, meditative stillness), users satisfy the habitual hand-to-mouth motor impulse without inhaling toxic combustion products.

---

## 2. Problem Statement
Smoking cessation is notoriously difficult partly because nicotine dependence is intertwined with deep behavioral and physical habits:
- The sensory hand-to-mouth motion performed dozens of times daily.
- The visual cues of the burning ember, rising smoke, and ash.
- The auditory cues of the lighter spark, air draw, and ambient quiet.
- The dedicated 3-to-5 minute mental pause in a busy day.

Most cessation apps focus purely on cold-turkey countdown timers and guilt-inducing streak trackers. Vesper Ritual focuses on **harm reduction through ritual replacement**.

---

## 3. Target User Personas

### Persona A: The Mindful Reducer (Mark, 34)
- **Profile**: Smokes 15 cigarettes daily. Wants to cut down to under 5 or quit gradually.
- **Pain Point**: Finds chewing gum or nicotine lozenges unsatisfying because they don't provide the sensory pause or hand action.
- **Need**: A private, aesthetic digital experience he can open on his phone during smoke breaks.

### Persona B: The Stress-Break Smoker (Elena, 28)
- **Profile**: Smokes during intense work blocks primarily to step away and breathe.
- **Pain Point**: Feels anxious without the habitual pause, leading to relapse.
- **Need**: An atmospheric, nonjudgmental space that delivers the same 2-to-3 minute breathing cadence.

---

## 4. User Stories
1. **As an adult smoker**, I want to pick a virtual brand aesthetic that feels familiar, so that the simulation resonates with my personal habits.
2. **As a user in a craving moment**, I want to manually trigger discrete draws (6 or 7) with realistic ember and smoke reactions, so that I experience a structured, tactile pause.
3. **As a user concerned about privacy**, I want all my reduction logs to remain on my local device without creating an account or leaking health data.
4. **As a user interrupted during a session**, I want the simulation to pause automatically if I switch tabs, so that I don't lose my place or feel penalized.
5. **As an accessibility-conscious user**, I want full keyboard controls and a reduced-motion mode that avoids motion sickness.

---

## 5. Scope & Non-Goals

### In Scope (MVP)
- Cinematic landing page with harm-reduction statement.
- Config-driven virtual brands: Navy, Marise, Marlboro, Gold Leaf, Aura Pure.
- Full-screen first-person scene with hand, lit/unlit states, ember bloom, and canvas particle smoke.
- 6 or 7 discrete draw configuration.
- Procedural Web Audio API sound generator (lighter, draw, crackle, exhale, ambient, chime).
- Predictable finite state machine (`idle` → `lighting` → `ready` → `inhaling` → `recovering` → `completed`).
- LocalStorage progress dashboard with daily real cigarette logging, avoided cigarette estimation, and 7-day visual chart.
- JSON data export and permanent reset.

### Non-Goals (Out of Scope for MVP)
- **No Medical Claims**: Never advertise as a clinically approved medical therapy or cessation device.
- **No Gamification / Streaks**: No badges, leveling up, or punishment for leaving early.
- **No Mandatory Accounts**: No external login, email harvesting, or mandatory backend.
- **No Third-Party Analytics**: Zero behavioral telemetry or ad tracking.

---

## 6. Acceptance Criteria
- [x] Application compiles cleanly with TypeScript in strict mode.
- [x] All 5 configured brands selectable with distinct palettes and pack designs.
- [x] Inhale interaction produces synchronized visual ember flare, smoke burst, and audio crackle.
- [x] State machine prevents double-counting or desync during draw animations.
- [x] Auto-pauses on visibility change.
- [x] Progress dashboard calculates avoided cigarettes based on user-defined baseline.
- [x] 100% functional offline without paid third-party APIs.
