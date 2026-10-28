# Testing & Quality Assurance Documentation: Vesper Ritual

## 1. Test Strategy & Coverage Matrix

The testing strategy combines automated unit tests with structured manual verification scripts to ensure deterministic state transitions, reliable local persistence, and audio safety across devices.

| Test Category | Target Module | Scope | Automation Status |
| :--- | :--- | :--- | :--- |
| **Unit** | `sessionStateMachine.ts` | All state transitions, duplicate-click locking, draw progression, pause/resume | Automated (Vitest) — 7 tests |
| **Unit** | `localStorage.ts` | Schema validation, corrupted JSON repair, baseline updates, session logging | Automated (Vitest) — 6 tests |
| **Unit** | `audioManager.ts` | Singleton safety, volume clamping, error-free execution in headless mode | Automated (Vitest) — 3 tests |
| **Component** | `PackIllustration.tsx` | Visual rendering of chevron, stripes, crest, botanical, and minimal patterns | Manual / Visual |
| **Accessibility** | All views | Keyboard navigation, focus indicators, ARIA progressbar, reduced motion | Manual / System |
| **Responsive** | Mobile & Desktop | Portrait (375px–430px), Tablet (768px), Desktop (1440px+) | Manual / System |
| **Build Integrity**| Next.js App Router | Static prerendering, TypeScript compilation, asset bundling | Automated (`next build`) |

---

## 2. Running Automated Tests

Run the full test suite via Vitest:
```bash
npm run test
```

### Verified Test Results
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

## 3. Manual Verification Checklist

### Flow 1: Core Session Lifecycle
1. Open `http://localhost:3000/select`.
2. Cycle brands with `[ArrowLeft]` and `[ArrowRight]`. Verify that selection highlights and theme tones update smoothly.
3. Select 6 draws, choose "Clear Balcony", press `[Enter]` or click "Begin First-Person Ritual".
4. Press `[Space]` or click "Light Cigarette". Verify lighter sound plays and ember ignites.
5. Inhale repeatedly. Verify:
   - Ember flares white-hot with expanding radial heat bloom.
   - Hand translates upward toward mouth with perspective scale increase.
   - Fluid smoke particles dissipate on exhale.
   - Puffs increment accurately (`1/6`, `2/6`, ... `6/6`).
   - Duplicate clicks while inhaling are rejected.
6. On the 6th draw recovery, verify transition to the completion modal.

### Flow 2: Interruption & Page Visibility
1. Start an inhale.
2. Switch to another browser tab immediately.
3. Verify that the session auto-pauses to prevent desynchronization.
4. Return to the tab and click "Resume Ritual".

### Flow 3: Progress & Harm Reduction
1. Open `/progress`.
2. Edit baseline from 12 to 15 cigarettes.
3. Log 2 real cigarettes smoked today.
4. Verify avoided cigarettes calculates to `15 - 2 = 13 avoided`.
5. Export JSON backup. Inspect structure.
6. Click "Erase All Data" and verify clean state reset.
