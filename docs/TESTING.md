# Testing and quality assurance documentation: Vesper Ritual

This document defines the testing strategy, test coverage matrix, automated
test execution instructions, and end-to-end manual verification scripts for
Vesper Ritual.

## 1. Test strategy and coverage matrix

The testing approach combines automated unit tests with structured manual
verification flows to ensure deterministic state transitions, reliable local
storage persistence, audio safety, and smooth WebGL rendering across devices.

| Test category | Target module | Scope | Automation status |
| :--- | :--- | :--- | :--- |
| **Unit** | `sessionStateMachine.ts` | All state transitions, duplicate-click locking, draw progression, pause and resume | Automated (Vitest) — 7 tests |
| **Unit** | `localStorage.ts` | Schema validation, corrupted JSON repair, baseline updates, session logging | Automated (Vitest) — 6 tests |
| **Unit** | `audioManager.ts` | Singleton safety, volume clamping, error-free execution in headless mode | Automated (Vitest) — 3 tests |
| **3D rendering** | `DhakaSceneCanvas.tsx` | WebGL canvas mount, dynamic brand/weather reactivity, unlocked cursor look-around | Manual / Visual |
| **Glass UI** | `GlassRitualControls.tsx` | Semi-transparent brand buttons, 9-pack gallery, atmosphere switches, cadence toggle | Manual / Visual |
| **Accessibility** | All views | Keyboard navigation, focus outlines, ARIA progressbar, reduced motion compliance | Manual / System |
| **Responsive** | Mobile and desktop | Portrait (375px–430px), Tablet (768px), Desktop (1440px+) | Manual / System |
| **Build integrity**| Next.js App Router | Static prerendering, TypeScript compilation, asset bundling | Automated (`next build`) |

---

## 2. Running automated tests

Run the complete automated unit test suite with Vitest:

```bash
npm run test
```

### Verified test suite results

```
 ✓ tests/unit/sessionStateMachine.test.ts (7 tests)
   ✓ initializes with idle state and 0 draws
   ✓ transitions from idle -> lighting -> ready on valid triggers
   ✓ handles a single inhale-recover draw cycle and increments draw count
   ✓ strictly prevents duplicate clicks while inhaling or recovering
   ✓ completes session exactly when the total draws count is reached
   ✓ handles pause and resume properly preserving state context
   ✓ allows early finishing anytime

 ✓ tests/unit/storage.test.ts (6 tests)
   ✓ loads valid default data on initial empty storage
   ✓ updates preferences safely and persists changes
   ✓ records virtual session and updates today's log entry
   ✓ updates real cigarettes count without allowing negative numbers
   ✓ gracefully recovers and repairs malformed or corrupted localStorage data
   ✓ exports valid JSON and imports backup data

 ✓ tests/unit/audioManager.test.ts (3 tests)
   ✓ maintains a singleton instance
   ✓ safely handles mute state and volume clamping
   ✓ does not crash on sound trigger methods in non-browser environments

Test Files  3 passed (3)
     Tests  16 passed (16)
```

---

## 3. Manual verification checklist

Follow these scripts to verify UX interactions and visual components.

### Flow 1: 3D starting page and glass ritual controls

1. Open `http://localhost:3000/`.
2. Confirm that the 3D retro Dhaka street scene loads immediately in full-screen
   view with zero scrolling.
3. Confirm that the mouse cursor remains visible (`cursor-default`) across the
   entire viewport.
4. Drag the mouse across the street scene to confirm smooth camera look-around
   clamped to safe horizontal and vertical boundaries.
5. In the Refractive Glass UI panel at the bottom:
   - Click each of the nine brand pack buttons. Verify that the pack artwork,
     active selection glow, and cigarette filter wrap update immediately.
   - Click the Rain, Clear, and Fog atmosphere buttons. Verify that rain streaks
     and ambient fog density adjust in real time.
   - Click the 7 Draws and 6 Draws buttons to toggle cadence.
6. Click the glowing **LIGHT CIGARETTE** button to ignite the session.

### Flow 2: Ritual session lifecycle and inhalation

1. Once lit, press `[Space]` or click **INHALE DRAW**.
2. Verify visual and auditory synchronization:
   - Cigarette ember flares white-hot with expanding radial light.
   - Procedural tobacco crackle and air intake sounds play smoothly.
   - 3D smoke particles billow upward from the ember tip upon exhale.
   - Draw counter updates smoothly (for example, `1/7`, `2/7`).
   - Duplicate clicks during active draws are ignored.
3. Complete all draws to verify smooth transition to the completion modal.

### Flow 3: Tab interruption and page visibility

1. Start an inhale cycle.
2. Switch to an alternate browser tab immediately.
3. Return to the tab and verify that the session entered paused state to
   prevent animation desynchronization.
4. Click **Resume Ritual** to continue seamlessly.

### Flow 4: Progress dashboard and reduction logging

1. Open `/progress`.
2. Edit the daily smoking baseline from 12 to 15 cigarettes.
3. Log two real cigarettes smoked today.
4. Verify that avoided cigarettes calculates accurately (`15 - 2 = 13 avoided`).
5. Export the JSON backup file and inspect the schema.
6. Click **Erase All Data** and verify complete local storage reset.
