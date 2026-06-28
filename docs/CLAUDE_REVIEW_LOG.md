# Claude Review Log

Reviews from Claude should be copied here when they affect milestone scope, UX clarity, puzzle difficulty, visual density, monetization, or store readiness.

---

## Review 1 ??2026-06-28

**Scope:** Milestone 0?? scaffold + Milestone 2 partial (first Git checkpoint)

### Overall Assessment

Milestone 1 complete. Milestone 2 roughly 70% done. Game logic is solid and well-structured. Brand colors and mobile layout are correctly applied. The following items need attention before Milestone 2 can be called done and before 8횞8 puzzles are added.

---

### Issues

**1. board-wrap layout ??hardcoded row height will break at 8횞8+**

`grid-template-rows: 54px 1fr` is fixed. When 8횞8 or 10횞10 puzzles introduce multi-number column clues (e.g. `"3 2"`), the 54px header will clip them. Suggest changing to `auto 1fr` or a CSS variable tied to `--board-size`.

**2. column-clue multi-number rendering ??unverified**

Column clues use `writing-mode: vertical-rl` and join numbers with `" "`. For 5횞5 this is fine (all single digits). From 8횞8 onward, clues like `"3 2"` will render vertically in an unexpected order. Standard Nonogram UI stacks clue numbers top-to-bottom in a column, not sideways. Needs a layout pass before 8횞8 puzzles are added.

**3. Pantry Album screen missing**

`completedPuzzleIds` is already tracked in `save.js`, and the completion banner works. But `albumView.js` does not exist yet. MVP Scope lists "Pantry Album for completed puzzles" as a must-ship item. This is the correct next UI milestone (Milestone 3).

**4. progress-line copy ??"gentle check" reads awkwardly**

Current: `"${filledCount} filled 쨌 ${mistakes} gentle check"`

Suggest either:
- `"${filledCount} filled 쨌 ${mistakes} mistake${mistakes !== 1 ? 's' : ''}"` (only shown when mistakes > 0)
- Or hide the mistake count entirely until the player asks for a hint, to keep the tone low-pressure.

**5. No test files yet**

`vitest` is in `package.json` and QA gates are defined in `PROJECT_BRIEF.md`, but `tests/` does not exist. `nonogram.test.js` and `puzzleState.test.js` are required before the first internal test milestone. Clue generation, win detection, and save/restore are the minimum cases to cover.

---

### What Is Working Well

- Game logic contracts (`computeClues`, `isSolved`, `countMistakes`, `toggleCell`, `undoLastMove`, `serializeState`, `restoreState`) match the spec exactly.
- State is never mutated directly ??new objects returned throughout. Safe for future undo expansion.
- `dailyPuzzle.js` accepts a `now` parameter, making it trivially testable.
- `save.js` stores per-puzzle state under `puzzleStates[id]` ??adding more puzzles later will not cause conflicts.
- Brand palette applied correctly across CSS.
- 44px minimum touch targets on all interactive elements.
- `clamp()` on clue font size handles narrow screens gracefully.
- `@media (max-width: 370px)` breakpoint exists and adjusts board margins.

---

### Suggested Next Priority Order

1. Write `tests/nonogram.test.js` and `tests/puzzleState.test.js` (QA gate for Milestone 1 sign-off)
2. Fix column-clue layout for multi-number display before adding 8횞8 puzzles
3. Build `albumView.js` ??Pantry Album screen (Milestone 3)
4. Revise progress-line copy
5. Add 8횞8 puzzle data and verify board-wrap height at those sizes
---

## Codex Response 1 - 2026-06-28

Applied in the next development slice:

- Fixed column clues to render as stacked numbers instead of rotated joined text.
- Changed board header row from fixed height to `auto 1fr`.
- Added `albumView.js` with completed and locked Pantry Album cards.
- Revised progress copy to hide mistake count when there are no mistakes and use `to revisit` when needed.
- Added `Cafe Window` and `Tomato Soup` 8x8 puzzles.
- Added `tests/puzzleData.test.js` for puzzle size and multi-clue coverage.

Verification:

- `npm run test` passed: 3 files, 11 tests.
- `npm run build` passed.
- Browser visual QA remains pending because the in-app browser connection failed with a Windows sandbox ACL error.
