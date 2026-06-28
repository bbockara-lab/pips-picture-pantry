# Claude Review Log

Reviews from Claude should be copied here when they affect milestone scope, UX clarity, puzzle difficulty, visual density, monetization, or store readiness.

---

## Review 1 ??2026-06-28

**Scope:** Milestone 0?? scaffold + Milestone 2 partial (first Git checkpoint)

### Overall Assessment

Milestone 1 complete. Milestone 2 roughly 70% done. Game logic is solid and well-structured. Brand colors and mobile layout are correctly applied. The following items need attention before Milestone 2 can be called done and before 8?? puzzles are added.

---

### Issues

**1. board-wrap layout ??hardcoded row height will break at 8??+**

`grid-template-rows: 54px 1fr` is fixed. When 8?? or 10??0 puzzles introduce multi-number column clues (e.g. `"3 2"`), the 54px header will clip them. Suggest changing to `auto 1fr` or a CSS variable tied to `--board-size`.

**2. column-clue multi-number rendering ??unverified**

Column clues use `writing-mode: vertical-rl` and join numbers with `" "`. For 5?? this is fine (all single digits). From 8?? onward, clues like `"3 2"` will render vertically in an unexpected order. Standard Nonogram UI stacks clue numbers top-to-bottom in a column, not sideways. Needs a layout pass before 8?? puzzles are added.

**3. Pantry Album screen missing**

`completedPuzzleIds` is already tracked in `save.js`, and the completion banner works. But `albumView.js` does not exist yet. MVP Scope lists "Pantry Album for completed puzzles" as a must-ship item. This is the correct next UI milestone (Milestone 3).

**4. progress-line copy ??"gentle check" reads awkwardly**

Current: `"${filledCount} filled 夷?${mistakes} gentle check"`

Suggest either:
- `"${filledCount} filled 夷?${mistakes} mistake${mistakes !== 1 ? 's' : ''}"` (only shown when mistakes > 0)
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
2. Fix column-clue layout for multi-number display before adding 8?? puzzles
3. Build `albumView.js` ??Pantry Album screen (Milestone 3)
4. Revise progress-line copy
5. Add 8?? puzzle data and verify board-wrap height at those sizes
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

---

## Review 2 ??2026-06-28

**Scope:** Post Codex Response 1 ??album view, tab navigation, column clue fix, 8횞8 puzzles, test suite

### Overall Assessment

Milestone 2 is now complete. Milestone 3 (Pantry Album) is functionally complete. All five Review 1 issues were addressed. The app now has a working two-tab navigation, an album screen, multi-number column clues rendered correctly, and a passing test suite. This is playable MVP territory.

---

### What Was Fixed Well

- `board-wrap` changed to `grid-template-rows: auto 1fr` ??column clue height now adapts correctly
- `column-clue` now uses `flex-direction: column` with stacked `<span>` elements ??multi-number clues render top-to-bottom as expected
- `albumView.js` added with completed/locked card states and `completedPuzzleIds` integration
- `getCompletedPuzzleIds()` cleanly exported from `save.js` ??no coupling issues
- `save.js` `loadSave()` now defensively normalizes the shape of stored data on read ??good resilience
- Progress line now hides mistake count at zero, uses "to revisit" when non-zero ??tone improvement
- View tab navigation (Puzzle / Album) added with correct active state styling
- Pip strip copy changes contextually between puzzle and album views ??small but on-brand
- `puzzleData.test.js` validates solution grid dimensions and multi-clue coverage ??exactly the right scope
- `nonogram.test.js` and `puzzleState.test.js` cover core contracts cleanly
- `@media (max-width: 370px)` correctly updated to `auto 1fr` alongside the main rule

---

### New Issues

**1. album-stamp is text abbreviation, not a visual**

`getStampPattern()` returns short strings like `"pip"`, `"bowl"`, `"spoon"` displayed as uppercase text inside the stamp area. This reads as a placeholder. For MVP it is acceptable, but it will look unfinished in store screenshots. Should be flagged as a pre-launch visual task ??either emoji, a tiny SVG icon, or a pixel-art tile per puzzle.

**2. puzzle-meta difficulty badge shows `5x5` with lowercase x**

`puzzleView.js` line 36: `${puzzle.size}x${puzzle.size}` ??the x is a literal lowercase letter. The CSS from Review 1 used `횞` (multiplication sign). Minor but visible in the UI. Should use `${puzzle.size}횞${puzzle.size}`.

**3. album-panel not in pip-strip / puzzle-panel shared border style**

`album-panel` defines its own `border`, `border-radius`, `padding`, and `background` separately from `.puzzle-panel`. These are identical values. If the card surface style changes later, it will need to be updated in two places. Could share a `.content-panel` base class ??low priority but worth noting.

**4. album-card stamp area has no minimum height**

`.album-stamp` uses `aspect-ratio: 1` but no `min-height`. On very narrow screens the stamp area could collapse to near zero if the card column is tiny. A `min-height: 48px` guard would prevent this.

**5. No i18n structure yet**

Direction Note 1 (also in this log) specifies adding `src/i18n/` with `en.js`, `ko.js`, and a `t()` helper. All hardcoded UI strings are still inline across `appShell.js`, `puzzleView.js`, `albumView.js`, and `pipReaction.js`. This is the correct next structural task before content grows further.

---

### Suggested Next Priority Order

1. Add `src/i18n/` scaffold ??`index.js`, `en.js`, `ko.js`, extract all hardcoded strings (Direction Note 1)
2. Fix difficulty badge: `x` ??`횞` in `puzzleView.js`
3. Flag album-stamp as a pre-launch visual task (not blocking MVP, but needs to ship before store screenshots)
4. Add `min-height` guard to `.album-stamp`
5. Continue puzzle content ??10횞10 puzzle data and board-wrap verification at that size

---

## Direction Note 1 ??2026-06-28 (Claude)

**Topic:** i18n structure ??multi-language launch strategy

**Decision:** Add an i18n scaffold now, before text spreads further across the codebase. First release targets English + Korean. Chinese and Spanish to follow based on market response.

**Rationale:** The development model (AI-assisted) removes the language bottleneck that normally limits indie studios to one locale. UI text volume is small enough that adding languages later is cheap ??but only if the structure is in place early.

**What Codex should implement:**

1. Create `src/i18n/` directory with:
   - `index.js` ??`t(key)` helper that reads the active locale and returns the string
   - `en.js` ??English strings (extract all hardcoded UI text into here)
   - `ko.js` ??Korean strings (translate all keys)

2. Locale keys to cover at minimum:
   - App title, studio name
   - Pip strip lines ("Pip found today's picture.", "Fill the grid to reveal {title}.")
   - Section labels ("Starter shelf", "Daily picture")
   - Control buttons ("Fill", "Mark", "Undo")
   - Progress line
   - Completion banner message
   - Reset button aria-label
   - Puzzle reward albumText (per puzzle, already in puzzles.js ??decide if this lives in i18n or stays per-puzzle)

3. Locale detection: read `navigator.language`, fall back to `"en"` if unsupported.

4. No need for a runtime language switcher in MVP ??detection on load is enough.

**Do not do yet:**
- Chinese or Spanish strings (add structure only)
- Store metadata translation (separate task, pre-launch)
- Font changes for CJK (verify system font fallback covers Korean adequately first)
---

## Codex Response 2 - 2026-06-28

Applied in the next development slice:

- Added `src/i18n/index.js`, `src/i18n/en.js`, and `src/i18n/ko.js`.
- Extracted core UI strings from `appShell.js`, `puzzleView.js`, `albumView.js`, and `pipReaction.js`.
- Added locale detection from `navigator.language`, with English fallback.
- Restored the difficulty badge to use the multiplication sign through `\u00d7`.
- Replaced album text abbreviations with mini pixel-grid stamps generated from each puzzle solution.
- Added `.content-panel` to share the panel surface style.
- Added `min-height: 48px` to `.album-stamp`.
- Added `tests/i18n.test.js` for locale detection, formatting, and puzzle copy lookup.

Verification:

- `npm run test` passed: 4 files, 14 tests.
- `npm run build` passed.

Note:

- `ko.js` is stored with Unicode escape sequences because PowerShell file writes corrupted direct Korean text in this OneDrive/Windows sandbox. The browser still renders Korean text from those escapes.
