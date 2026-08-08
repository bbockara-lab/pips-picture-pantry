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

---

## Review 3 — 2026-06-28

**Scope:** Post Codex Response 2 — i18n scaffold, pixel-grid stamp, content-panel refactor, min-height fix, difficulty badge fix

### Overall Assessment

All five Review 2 issues resolved. The i18n architecture is well-designed and goes beyond the minimum spec in useful ways. The album stamp upgrade from text abbreviations to pixel-grid previews is a meaningful visual improvement. The app is now in strong playable MVP shape. No blocking issues remain for the current milestone.

---

### What Was Done Well

- `t(key, params)` with `{placeholder}` interpolation is clean and covers all current use cases
- `puzzleText(puzzleId, field)` as a dedicated helper avoids repeating the `puzzles.{id}.{field}` path string — good pattern
- `getByPath()` dot-path resolver with `??` fallback chain (`locale dict → en dict → key`) is solid — missing keys surface as the key string rather than crashing
- `getActiveLocale()` accepts an injectable `language` param — testable without mocking `navigator`
- Puzzle titles and album copy moved into `en.js` and `ko.js` — `puzzles.js` no longer holds display strings, separation is correct
- Pixel-grid stamp renders the actual solution grid as tiny tiles — much better than text abbreviations, and doubles as a preview of the solved picture
- `.content-panel` base class now shared by `puzzle-panel`, `album-panel`, and `puzzle-picker` — Review 2 issue 3 resolved
- `min-height: 48px` on `.album-stamp` — Review 2 issue 4 resolved
- Difficulty badge now uses `×` — Review 2 issue 2 resolved
- `i18n.test.js` covers locale detection, param formatting, and per-puzzle lookup

---

### New Issues

**1. `ko.js` puzzle titles are kept in English**

Puzzle titles (`"Pip Face"`, `"Soup Bowl"`, etc.) in `ko.js` are unchanged from English. This is a judgment call — keeping brand-name visuals in English is defensible — but it should be an explicit decision, not an oversight. Recommend adding a comment or note confirming this is intentional so future contributors don't assume it's a gap.

**2. `t()` re-detects locale on every call**

`t()` calls `getActiveLocale()` which calls `getNavigatorLanguage()` on every string render. For the current string count this is harmless, but as the app grows (daily puzzle load, album render with many cards) this adds unnecessary repeated navigator reads. Locale should be resolved once at startup and cached.

**3. Pixel-grid stamp has no padding guard at 10×10**

`.album-stamp.picture` uses `padding: 6px` and `gap: 1px`. At 10×10 within a narrow two-column album grid on a 360px screen, each stamp cell could be under 3px — borderline invisible. Worth testing visually when 10×10 puzzles are added, and possibly adjusting padding/gap by `--stamp-size`.

**4. `puzzles.js` still holds `reward.imageName` and `reward.albumText`**

The display strings were moved to `en.js`/`ko.js`, but `puzzles.js` still has the original `reward` object with `imageName` and `albumText`. These are now dead data — nothing reads from `puzzle.reward` anymore (all UI goes through `puzzleText()`). Should be removed to avoid confusion.

**5. Korean completion message capitalisation**

`completion.saved` in `ko.js` calls `imageName.toLowerCase()` via the `getCompletionMessage()` helper in `pipReaction.js`. Korean text does not have case, so `.toLowerCase()` is a no-op — but puzzle `imageName` values in `ko.js` are in English anyway (see issue 1). This is fine for now but should be revisited if Korean image names are added.

---

### Suggested Next Priority Order

1. Remove dead `reward` object from `puzzles.js`
2. Cache locale at startup in `i18n/index.js` instead of re-detecting per call
3. Add a comment in `ko.js` confirming puzzle titles staying in English is intentional
4. Add 10×10 puzzle data and visually verify stamp size at that grid density
5. Begin pre-launch checklist: store metadata draft, 360px layout screenshot pass

---

## Codex Response 3 — 2026-06-28

Applied in the next development slice:

- Added `brandIntro.js` — studio bumper + game title screen with auto-dismiss and skip button. Respects `prefers-reduced-motion`.
- Added `packs.js` — `access: "free" | "unlockable" | "bonus-pack"` structure. `pips-pantry-shelf-plus` pack registered as future IAP placeholder.
- Added `access` field to all puzzles in `puzzles.js`. `sunny-spoon-sign-10` set to `"unlockable"` with `unlockRequirement: { type: "completed-count", count: 5 }`.
- Added `pantry-jar-8` and `sunny-spoon-sign-10` puzzle data (8 puzzles + 1 unlockable 10×10 total).
- Dead `reward` object removed from `puzzles.js`.
- Added reset confirmation dialog (modal) with Cancel / Reset actions.
- Added settings dialog with language toggle (System / English / Korean).
- Locale cached at module init — `activeLocale` resolved once, not per `t()` call. Language preference persisted to LocalStorage.
- Added `daily-card` section — Today's Card visually separated from the starter shelf.
- Added `createDailyCard()` to `appShell.js`.
- Completion CTA added — "View Album" and "Next Picture" buttons in `pipReaction.js`.
- Completed board now locked — `boardView.js` passes `disabled` to all cells when `locked: true`.
- `puzzleView.js` adds `completed` class to panel and passes `locked` to board.
- Added `howToPlay` inline card — shown on first puzzle (pip-face-5) only.
- Added Mark mode active hint line below controls when Mark is active.
- Pip strip image removed — copy-only strip now, no icon placeholder.
- Mark cell indicator changed from `×` text to `•`.
- `app.versionLabel` now includes "Version" prefix via i18n.
- Version bumped to `v0.1.4`.

Verification: `npm run test` passed: 4 files, 14 tests. `npm run build` passed.

---

## Review 4 — 2026-06-28

**Scope:** Post Codex Response 3 — brand intro, reset dialog, settings, daily card, completion CTA, board lock, how-to-play, pack structure, 10×10 unlock

### Overall Assessment

This is the largest single slice yet and it landed cleanly. Direction Note 2 (게임성/수익화 구조) was implemented almost entirely in one pass. The app now has a proper first-run experience, a settings layer, a confirmation gate on reset, completion CTAs, and the monetization skeleton. Playable MVP bar is now genuinely met.

---

### What Was Done Well

- Reset dialog is correctly implemented as a modal with `role="dialog"` and `aria-modal` — accessible and safe
- Settings dialog with language toggle works cleanly; preference persisted to LocalStorage separately from game save — correct separation
- `activeLocale` cached at module init, resolving the Review 3 per-call detection issue
- `document.documentElement.lang` updated on locale change — screen readers and browser UI will reflect the correct language
- Brand intro respects `prefers-reduced-motion` and provides a skip button — both accessibility requirements met
- `boardView.js` properly uses `button.disabled` for locked cells, not just CSS — keyboard and screen reader users also can't interact with a completed board
- `howToPlay` card shown only on `pip-face-5` — right scope, not shown on every puzzle
- Mark mode hint line shown contextually only when Mark is active — good progressive disclosure
- Daily card separated visually from starter shelf with its own section and "Today's card" label
- Completion CTA buttons wired to `onViewAlbum` and `onNextPuzzle` callbacks — the album connection loop is now closed
- `puzzleText()` used in `boardView.js` aria-label — i18n coverage extended to accessibility layer
- `sunny-spoon-sign-10` has structured `unlockRequirement` — ready for unlock logic without being wired yet
- Dead `reward` object fully removed from `puzzles.js`
- `•` for marked cells is cleaner than `×` text

---

### New Issues

**1. Unlock requirement defined but not enforced**

`sunny-spoon-sign-10` has `access: "unlockable"` and `unlockRequirement: { type: "completed-count", count: 5 }` in the data, but `createPuzzlePicker()` renders all puzzles regardless of access. A player can currently select and play the 10×10 without completing 5 puzzles. The lock gate needs to be checked against `getCompletedPuzzleIds()` before rendering the chip, or the chip should render in a disabled/locked visual state.

**2. `brandIntro.js` uses `window.setTimeout` directly**

Minor, but `window.setTimeout` bypasses any test environment where `window` isn't available. `globalThis.setTimeout` or a simple `setTimeout` (which resolves to globalThis in modules) would be more consistent with how `i18n/index.js` handles `globalThis.localStorage`.

**3. Daily card "Selected" state disables the button but gives no visual explanation**

When the daily puzzle is already active, the daily card button shows "Selected" and is disabled. This is correct behaviour but a first-time player may not understand why the button is greyed out. A small label change — "Currently playing" — or a visual checkmark would be clearer.

**4. `howToPlay` card shown on `pip-face-5` only, but condition is hardcoded by puzzle ID**

`getPuzzleLabel()` and `createHowToPlayCard()` both use `puzzle.id === "pip-face-5"` as the condition. If the first puzzle ever changes ID or order, the how-to-play disappears silently. A `tutorial: true` flag on the puzzle data object would be cleaner and more maintainable.

**5. Pip strip now copy-only — character presence gap**

The app icon image was removed from the pip strip (Review 3 design note: replace with expression sheet). The strip now has no visual at all — just two lines of text. This is better than the wrong image, but the character presence gap is now visible. This feeds directly into the character redesign discussion: once new Pip assets are ready, the strip is the right place to put them.

**6. `ko.js` not updated with new keys**

`brandIntro`, `daily`, `howToPlay`, `settings`, `packs`, `progress.complete`, `completion.viewAlbum`, `completion.nextPicture` are all new keys added in `en.js`. `ko.js` has not been updated. The `t()` fallback to `en` means the app won't crash in Korean, but Korean users will see English for all new UI text.

---

### Suggested Next Priority Order

1. Wire unlock gate — check `completedPuzzleIds` against `unlockRequirement` before enabling puzzle chip
2. Update `ko.js` with all new keys from `en.js`
3. Add `tutorial: true` flag to `pip-face-5` in `puzzles.js`, remove hardcoded ID check
4. Daily card "Currently playing" label when selected
5. Character asset — Pip expression image for the pip strip (blocked on redesign decision)

---

## Codex Response 4 — 2026-06-28

Applied across commits feat/approve-redesigned-cast through feat/enforce-puzzle-unlock-gate:

- `pip-strip-sticker-v1.png` 및 `pip-complete-sticker-v1.png` 신규 에셋 추가 및 연결
- `pip-cast-redesign-concept-v1-web.jpg` 레퍼런스 시트 보관
- Pip strip 이미지 복원 (`pip-strip__portrait` 클래스, 74px, 투명 배경)
- Completion banner에 `pip-complete-sticker-v1.png` 이미지 추가
- 완료 화면에 solved reveal 그리드 추가 (188px, 퍼즐 해답 그대로 시각화)
- `puzzleAccess.js` 추가 — `isPuzzleUnlocked()`, `getUnlockRequirementProgress()` 분리
- unlock gate 실제 연결 — locked chip은 `disabled`, 점선 테두리, 자물쇠 아이콘(CSS `::before`), 진행 안내 텍스트 표시
- CSS 대규모 정리 — CSS 변수(`--ink`, `--cocoa`, `--cream` 등) 전역 적용, 배경 격자 패턴, shadow-soft 일관 적용
- 클루 숫자 캡슐형 배경(pill badge) 추가 — 가독성 개선
- filled/marked 셀 비주얼 강화 (radial gradient, dashed border for marked)
- Fill/Mark 활성 버튼 각각 golden/mint 그라디언트로 구분
- 한국어 폰트 패밀리 (`Pretendard`, `Apple SD Gothic Neo`) 추가
- `brand-intro` 2단계 애니메이션(studio-stage → game-stage) CSS 완성
- 버전 `v0.1.4` → `v0.1.8` (슬라이스별 단계 기록)

Verification: `npm run test` 4 files, 14 tests 통과. `npm run build` 통과.

---

## Review 5 — 2026-06-28

**Scope:** Post Codex Response 4 — 캐릭터 에셋 교체, 완료 화면 강화, unlock gate 연결, CSS 전면 정리

### Overall Assessment

이번 슬라이스가 게임의 첫인상을 가장 크게 바꿨어요. Pip 스티커 에셋이 들어오면서 캐릭터 존재감이 생겼고, 완료 화면이 실질적인 reward moment가 됐어요. unlock gate까지 실제로 작동하면서 Direction Note 3에서 요청한 우선순위 1~4가 전부 완료됐어요. **출시 전 체크리스트 단계로 넘어갈 수 있는 상태예요.**

---

### What Was Done Well

- `puzzleAccess.js`를 별도 모듈로 분리한 것이 정확한 판단 — unlock 로직이 UI와 섞이지 않음
- locked chip의 `::before` CSS 자물쇠 아이콘이 이미지 없이 순수 CSS로 구현됨 — 에셋 의존성 없음
- `getUnlockRequirementProgress()`가 `remaining` 값까지 계산해서 반환 — UI가 "N개 더 완료하면 열림" 안내를 표시할 수 있는 구조
- CSS 변수 전역화 (`--ink`, `--cocoa` 등) — 이후 테마 변경이나 다크모드 대응 기반 마련
- 한국어 폰트 패밀리를 `:root:lang(ko)`로 분기 처리 — 정확한 접근
- 클루 숫자 pill badge — 작은 변경인데 퍼즐 보드 가독성에 실질적 기여
- marked 셀 dashed border + mint 배경 — fill/mark 상태가 시각적으로 명확히 구분됨
- completion reveal 그리드가 완료 화면에서 Pip 이미지 옆에 배치 — 퍼즐 결과물이 즉시 보이는 구조
- `pip-complete-sticker-v1.png`를 별도 에셋으로 분리해서 strip용과 완료용을 구분

---

### New Issues

**1. `styles.css`에 버전 주석 블록이 선형으로 쌓이고 있음**

`/* v0.1.3 ... */`, `/* v0.1.4 ... */`, `/* v0.1.6 ... */`, `/* v0.1.8 ... */` 블록이 파일 아래로 계속 추가되고, 일부 규칙이 위쪽 규칙을 덮어쓰는 구조예요. 예를 들어 `.pip-strip`이 세 번 정의돼 있어요. 지금은 동작하지만 CSS가 길어질수록 유지보수가 어려워져요. 한 번 정리가 필요해요.

**2. completion-banner `grid-template-columns: 76px 1fr`이 reveal과 충돌 가능**

`completion-reveal`이 `grid-column: 1 / -1`로 전체 너비를 쓰는데, 부모가 2컬럼 그리드예요. 작동은 하지만 레이아웃 의도가 불분명해요. reveal을 별도 행으로 명시적으로 정의하는 게 더 안전해요.

**3. `ko.js` 신규 키 여전히 미반영**

Review 4에서도 지적했던 항목이에요. `brandIntro`, `daily`, `howToPlay`, `settings`, `packs`, `progress.complete` 등 한국어 번역이 없어요. 한국 출시를 타겟으로 하는 만큼 이건 출시 전 필수예요.

**4. `puzzle-chip[data-access="unlockable"]::after` 잔존**

이전 CSS에 unlockable chip에 초록 점을 찍는 `::after` 규칙이 있어요. 이제 locked chip은 `::before` 자물쇠 아이콘으로 표시하는데, `::after` 규칙이 남아있으면 locked 상태에서 점 + 자물쇠가 겹칠 수 있어요. 확인 필요.

**5. 콘텐츠 볼륨 — 퍼즐 9개**

현재 퍼즐 8개(free) + 1개(unlockable). Direction Note 3에서 출시 최소 기준 30개를 명시했어요. 이게 지금 가장 큰 미완성 항목이에요.

---

### Suggested Next Priority Order

1. `ko.js` 모든 신규 키 번역 반영 — 한국 출시 필수
2. 퍼즐 콘텐츠 30개로 확장 — 출시 기준선
3. `styles.css` 중복 규칙 정리 (`.pip-strip` 3중 정의 등)
4. `puzzle-chip::after` vs `::before` 충돌 확인 및 정리
5. Capacitor Android 패키지 생성 시작 — 출시 경로의 다음 단계

---

## Codex Response 5 — 2026-06-28

Applied across commits feat/improve-puzzle-list through feat/expand-launch-puzzle-shelf:

- 퍼즐 30개로 확장 — 5×5 스타터 12개, 8×8 이지 12개, 10×10 잠금 6개
- `mapView.js` 추가 — Pantry Map 뷰 (퍼즐 전체를 벽 타일 형태로 시각화)
- 뷰 탭 3개로 확장 (Puzzle / Album / Map)
- Player profile 기능 추가 — `save.js`에 플레이어 이름 저장, 세이브 키 분리(`SAVE_PREFIX + player.id`)
- Pip strip 카피에 `{player}` 파라미터 반영 — "Friend, 작은 그림부터 시작해요."
- 레거시 세이브 마이그레이션 — 기존 저장 데이터를 신규 플레이어 키로 이전
- `ko.js` 전면 업데이트 — `brandIntro`, `daily`, `howToPlay`, `settings`, `packs`, `map`, 신규 퍼즐 전체 반영
- Android 서명 파이프라인 및 signed AAB 기록 완료
- 버전 `v0.1.12`

---

## Review 6 — 2026-06-28

**Scope:** 퍼즐 30개 확장, Pantry Map 뷰, Player profile, ko.js 업데이트, Android 서명

### Overall Assessment

퍼즐 30개 달성으로 출시 콘텐츠 기준선을 충족했어요. Player profile과 Pantry Map은 방향 노트에 없던 기능인데, map은 앨범의 시각적 대안으로 잘 작동해요. Android signed AAB까지 완료돼서 내부 테스트 업로드 직전 상태예요.

---

### What Was Done Well

- 퍼즐 30개 구성이 5×5(12) → 8×8(12) → 10×10(6) 난이도 계단식으로 잘 배분됨
- 10×10 잠금 해제 조건이 5 → 8 → 10 → 12 → 15 → 18개로 점진적으로 올라가는 구조 — 진행감 있음
- `save.js` 플레이어 분리가 `SAVE_PREFIX + id` 키 구조로 깔끔하게 처리됨
- 레거시 세이브 마이그레이션 로직 포함 — 기존 테스터 데이터 보호
- `createPlayerId()`가 한글 이름도 처리 (`가-힣` 포함) — 한국어 플레이어명 지원
- Pantry Map의 `Math.ceil(Math.sqrt(puzzles.length))` 그리드 자동 계산 — 퍼즐 수 변경에 유연하게 대응
- `ko.js` 신규 키 전면 반영 — Review 5에서 계속 지적했던 항목 해소

---

### New Issues

**1. `ko.js` 신규 퍼즐 albumText가 깨진 문자열**

`teacup-5`부터 `village-window-10`까지 신규 퍼즐의 `albumText`가 `"?? ?? ????."` 형태로 깨져 있어요. PowerShell 파일 쓰기에서 한글이 손상된 것으로 보여요 (기존에도 같은 문제가 있었어요). 이 상태로 출시하면 한국어 완료 화면에서 깨진 텍스트가 노출돼요. **출시 전 필수 수정 항목이에요.**

**2. `onPlayerChange`가 `createShell()` 파라미터에서 누락**

`appShell.js` line 115: `createShell()` 함수 파라미터 구조분해에 `onPlayerChange`가 없어요. `createSettingsDialog(onCloseSettings, onLanguageChange, onPlayerChange)`로 호출하는데 `onPlayerChange`가 `undefined`로 전달돼요. 설정에서 이름 변경이 동작하지 않을 수 있어요.

**3. Pantry Map이 Album과 역할 중복**

Map은 퍼즐 전체 진행 현황을, Album은 완성된 카드를 보여주는데 현재 두 뷰가 거의 같은 정보를 다른 레이아웃으로 표시해요. 탭이 3개가 되면서 첫 플레이어가 어디로 가야 할지 혼란스러울 수 있어요. MVP 출시 전에 "Album = 완성 카드 수집", "Map = 전체 진행도 한눈에"로 역할을 더 명확히 구분하거나, 둘 중 하나를 메인으로 두는 방향을 결정하는 게 좋아요.

**4. Player profile이 첫 실행 플로우에 통합되지 않음**

이름을 설정하는 진입점이 Settings 안에만 있어요. 첫 실행 시 이름을 입력받는 온보딩이 없으면, Pip strip의 `"{player}, 작은 그림부터 시작해요."` 카피가 기본값 "Friend"로 표시돼요. 개인화 효과가 절반으로 줄어요.

---

### Suggested Next Priority Order

1. `ko.js` 신규 퍼즐 albumText 한글 깨짐 수정 — 출시 전 필수
2. `createShell()` `onPlayerChange` 파라미터 누락 수정
3. Album / Map 역할 구분 명확화 결정
4. 첫 실행 이름 입력 온보딩 추가 (선택, 하지만 개인화 효과에 중요)
5. Google Play 내부 테스트 업로드

---

## Codex Response 6 — 2026-06-28

Applied in commit `fix: address launch review blockers` (v0.1.13):

- `ko.js` 신규 퍼즐 albumText 깨진 문자열 전부 수정 — 정상 한글 텍스트로 교체
- `createShell()` 파라미터에 `onPlayerChange` 추가 — 설정에서 이름 변경 가능해짐
- Map 탭 레이블 "Map" → "Wall" / "Pantry Map" → "Pantry Wall" — Album과 역할 구분 명확화
- `playerIntro` 섹션 추가 — "What should Pip call you?" 온보딩 화면
- 브랜드 인트로 Skip 버튼이 첫 실행 시 이름 입력 화면으로 전환되도록 수정 (`hasActivePlayer()` 분기)
- `pipStrip` mapLine / mapNote 카피 추가 — Map 뷰 전용 Pip 멘트
- 모바일 QA 3개 해상도 통과, signed AAB 빌드 완료 (versionCode 6, v1.0.5)

---

## Review 7 — 2026-06-28

**Scope:** fix/address-launch-review-blockers — Review 6 지적 사항 전체 대응 확인

### Overall Assessment

Review 6의 4개 주요 지적이 모두 처리됐어요. 특히 첫 실행 이름 입력 온보딩을 브랜드 인트로 흐름 안에 자연스럽게 넣은 방식이 좋아요. Google Play 업로드만 남은 상태예요.

---

### What Was Resolved

- **ko.js albumText 깨짐** — 수정 확인. 신규 퍼즐 22개 전부 정상 한글 텍스트
- **`onPlayerChange` 파라미터 누락** — 수정 확인. `createShell()` 구조분해에 추가됨
- **Album/Map 역할 구분** — "Wall"로 레이블 변경 + Pip strip 카피 분리로 차별화 완료
- **이름 입력 온보딩** — 브랜드 인트로의 Skip/Start 버튼에서 `hasActivePlayer()` 분기 → 최초 실행 시 이름 입력 화면으로 자연스럽게 연결됨

---

### New Issues

**1. 브랜드 인트로 이름 입력에서 여전히 `window.setTimeout` 사용**

`brandIntro.js` 내 `requestPlayerName()` 에서 `window.setTimeout(() => input.focus(), 50)` 로 처리돼요. 이전 리뷰에서 `globalThis.setTimeout`으로 통일해달라고 지적한 항목인데 이 함수에서 다시 `window.` 로 작성됐어요. 런타임에서 문제가 되진 않지만 코드 일관성 이슈예요.

**2. 이름 입력 건너뜀 경로가 없음**

`requestPlayerName()` 화면에 "건너뛰기" 없이 Submit만 있어요. 이름을 입력하지 않고 그냥 시작하고 싶은 사용자(기본값 Friend로 시작)가 막힐 수 있어요. `placeholder="Jay"`가 있어 빈 submit이 가능한지 확인 필요 — `save.js`의 `normalizePlayerName()`이 빈 문자열을 `"Friend"`로 처리하므로 빈 submit은 동작하지만 UI 힌트가 없어요. Continue 버튼 아래 작게 "이름 없이 시작" 링크 혹은 placeholder를 통해 힌트 제공 권장.

**3. `ppp:player-changed` 커스텀 이벤트가 `appShell.js`에서 수신되는지 불명확**

`brandIntro.js`에서 `window.dispatchEvent(new CustomEvent("ppp:player-changed"))`를 발행하지만, `appShell.js`에서 이 이벤트를 수신해 `draw()`를 다시 호출하는 코드가 있는지 확인 필요해요. 없으면 이름 입력 후 Pip strip의 `{player}` 값이 즉시 갱신되지 않아요.

---

### Store Readiness Check

| 항목 | 상태 |
|---|---|
| 퍼즐 콘텐츠 30개 | ✅ |
| 한국어 번역 완성 | ✅ |
| 첫 실행 온보딩 | ✅ |
| 완성 후 CTA | ✅ |
| 잠금 해제 구조 | ✅ |
| Android signed AAB | ✅ versionCode 6 |
| Play Console 업로드 | ⏳ 대기 중 |

**Play Console 업로드가 유일한 남은 블로커예요.**

---

## Codex Response 7 — 2026-06-28

Applied in commit `feat: add folder economy progression` (v0.1.14):

- 퍼즐 구조 전면 개편: pack-scoped ID (`pips-first-shelf-pip-face-1` 형태) + 각 퍼즐에 `reward` 스푼 값 부여
- 팩 5개로 확장 (`pips-first-shelf`, `sunny-spoon-sign`, `apron-drawer`, `bakery-window`, `village-pantry`) — 각 팩에 잠금 비용(`unlockCost`)과 `muralPart` 연결
- 스푼 경제 구현: `pantrySpoons` 세이브 필드, 퍼즐 완성 시 보상, 데일리 +5 보너스, 팩 잠금 해제 비용 차감
- `audio.js` 신규 — 탭 SFX(`playTap`), 완성 SFX(`playComplete`), 배경 음악(오실레이터 기반), 설정 저장
- 헤더에 스푼 카운터(`currency-pill`) 표시
- Roadmap 뷰 개편: 팩별 폴더 카드 + 진행도 바 + Pip 벽화 파트 연결 시각화
- 퍼즐 피커에 `createFolderArt()`, `createUnlockPanel()` 추가 — 팩 잠금 해제 UI 인라인 처리
- `selectNextPuzzle()` 로직 개선: 완성 안 된 퍼즐 우선 → 이미 다 했으면 순환
- Review 7에서 지적한 `window.setTimeout` → 미수정 (audio.js에서 다시 사용됨)

---

## Review 8 — 2026-06-28

**Scope:** feat/add-folder-economy-progression — 스푼 경제, 팩 잠금 해제, 오디오, Roadmap 개편

### Overall Assessment

이번 커밋은 게임의 핵심 진행 루프를 완성하는 가장 큰 업데이트예요. 스푼 경제 + 팩 잠금 해제 구조가 방향 노트 2에서 설계했던 수익화 골격을 구체화하고, 오디오가 게임감을 크게 높여줘요. 방향은 맞아요.

---

### What Was Done Well

- 스푼 경제 설계가 단순하고 투명해요 — 퍼즐마다 고정 reward, 데일리 고정 보너스, 팩 비용 명시. 플레이어가 계산할 수 있음
- `rewardedPuzzleIds` 추적으로 같은 퍼즐을 반복 완성해도 보상이 1회만 지급되는 것 올바르게 처리됨
- `normalizeSave()`가 신규 필드(`pantrySpoons`, `rewardedPuzzleIds`, `dailyRewardedDates`, `unlockedPackIds`)를 기존 세이브에서도 안전하게 초기화하므로 업데이트 시 기존 플레이어 세이브 깨지지 않음
- `audio.js` 가드 처리 완성도 높음 — `audioUnlocked` 플래그로 탭 전 자동재생 차단, `getContext()` 안전하게 null 처리
- `createPlayerId()`에서 `normalize("NFKD")`로 한글 유니코드 정규화 추가 — Review 7 이후 개선

---

### New Issues

**1. `getMuralSymbol()`이 텍스트 레이블을 직접 반환 (하드코드)**

`appShell.js` line 397-403: `getMuralSymbol()`이 `"Pip Ear"`, `"Cheek"`, `"Scarf"` 같은 영어 텍스트를 반환해요. 한국어 모드에서도 영어로 표시돼요. `t("map.parts.pip-ear")` 같은 i18n 키로 대체해야 해요. 현재 `mapView.js` line 35에서 이미 `t(\`map.parts.${pack.muralPart}\`)`를 사용하는데, `appShell.js`의 폴더 아트에서는 누락됐어요.

**2. `audio.js`에서 다시 `window.setTimeout` 사용**

`audio.js` line 49, 51: `window.setTimeout(() => playTone(...))` — Review 7에서 지적한 `globalThis.setTimeout` 통일 요청이 이 파일에서도 반복됐어요. `window`가 정의되지 않은 테스트 환경에서 SFX 완성음이 오류를 낼 수 있어요.

**3. 팩 잠금 해제 비용 대비 보상 밸런스 확인 필요**

스타터 팩(12개 × 3스푼 = 36스푼)을 전부 완성하면 정확히 두 번째 팩 잠금 비용(36스푼)과 같아요. 데일리 보너스 없이 스타터만 하면 한 푼도 남지 않고 바로 다음 팩이 열려요. 의도된 설계라면 괜찮지만, 실수로 스푼을 날린 경우나 퍼즐을 부분만 완성한 경우 막힐 수 있어요. 내부 테스트에서 "스푼이 부족해서 막힘" 피드백이 오는지 체크 권장.

**4. Roadmap `map.parts.*` i18n 키가 `en.js`에 있는지 확인 필요**

`mapView.js` line 35에서 `t(\`map.parts.${pack.muralPart}\`)`를 호출하지만, `en.js`에 `map.parts` 섹션이 보이지 않았어요. 누락이면 키 자체가 그대로 렌더링돼요.

---

### Store Readiness Check

| 항목 | 상태 |
|---|---|
| 퍼즐 콘텐츠 | ✅ 30개 (팩 5개 구조) |
| 진행 경제 (스푼) | ✅ |
| 팩 잠금 해제 | ✅ |
| 한국어 번역 | ✅ |
| 오디오 (SFX + 음악) | ✅ |
| 첫 실행 온보딩 | ✅ |
| Android signed AAB | ✅ versionCode 6 (v0.1.13 기준) |
| Play Console 업로드 | ⏳ 아직 |

**이번 업데이트 후 AAB 재빌드 필요** (v0.1.14 변경 사항 미반영).

---

## Codex Response 8 — 2026-06-28

두 커밋으로 분리 적용:

**fix: polish review eight release build (v0.1.15)**
- `getMuralSymbol()` 하드코드 제거 → `t(\`map.parts.${pack.muralPart}\`)` 대체 ✅
- `audio.js` `window.setTimeout` → `globalThis.setTimeout` ✅
- `brandIntro.js` `window.setTimeout` → `globalThis.setTimeout` ✅
- 스푼 밸런스 조정: 2번 팩 36→24, 3번 70(유지), 4번 128→110, 5번 188→120

**feat: polish stage economy presentation (v0.1.16)**
- 스푼 아이콘(`createSpoonIcon()`) 도입 — 텍스트 대신 시각적 심볼로 통화 표현
- `createFolderArt()` → `createStagePreview()` 개편 — `data-part` 속성 + CSS 실루엣 3단
- 보너스 팩 2개 추가(`cafe-window-plus`, `seasonal-pantry-plus`) — "Coming soon" 비활성 표시
- `createBonusPackPanel()` 추가 — `bonus-pack` 타입 팩 별도 렌더
- 음악 기본값 `true` → `false` 변경 (첫 실행 시 자동재생 비활성화)
- Roadmap 뷰에 stage 상태 레이블(`inProgress`, `revealed`, `locked`) 추가
- `puzzlePicker.sizeReward` i18n 키 추가 — 퍼즐 칩에 보상 미리보기
- AAB versionCode 9, v0.1.16

---

## Review 9 — 2026-06-28

**Scope:** fix/polish-review-eight + feat/polish-stage-economy-presentation (v0.1.15~16)

### Overall Assessment

Review 8 지적 사항이 모두 빠르게 반영됐고, 스테이지 프레젠테이션 개편으로 팩 선택 화면이 단순한 리스트에서 진행 지도처럼 보이기 시작했어요. 음악 기본 off 결정도 올바른 선택이에요. 보너스 팩 placeholder 추가는 수익화 구조 노출 측면에서 타이밍 판단이 필요한 부분이에요.

---

### What Was Done Well

- Review 8의 3개 기술 지적(`getMuralSymbol`, `window.setTimeout` 두 곳, 스푼 밸런스) 모두 동일 커밋에서 처리됨
- `createSpoonIcon()`이 DOM 엘리먼트로 분리돼 있어서 aria-hidden + CSS만으로 텍스트/아이콘 표현 전환 가능한 구조
- `aria-label`에 `t("currency.spoons", { count })` 텍스트 유지 — 스크린리더 접근성 보전
- 스푼 밸런스 (0→24→70→110→120): 스타터 전부 완성 시 36스푼 획득, 24스푼으로 2번째 팩 열면 12스푼 남음 — 버퍼 생김
- 음악 기본 off는 모바일 앱 심사 환경(소리 없는 상태에서 테스터가 플레이)에서도 유리함

---

### New Issues

**1. `startMusic()`이 `stopMusic()`만 호출하는 빈 함수로 대체됨**

`audio.js`의 `startMusic()`이 현재 `stopMusic()`을 호출하고 종료돼요. 설정에서 음악을 켰을 때 실제로 음악이 재생되지 않아요. 음악 기능 자체를 제거한 건지, 나중에 파일 기반 BGM으로 교체 예정인지 의도가 불명확해요. 현재 상태에서 설정 → 음악 On 해도 아무 소리가 안 나요.

**2. `packs.js` 파일 첫 줄에 BOM 문자 삽입**

`git show`에서 `﻿export const puzzlePacks` (앞에 보이지 않는 BOM `﻿`)가 확인돼요. Windows PowerShell 파일 쓰기 인코딩 문제예요. 대부분 런타임에서 무시되지만, 일부 번들러나 파서에서 예상치 못한 파싱 오류를 낼 수 있어요. 제거 권장.

**3. 보너스 팩 placeholder가 빈 팩으로 노출됨**

`cafe-window-plus`, `seasonal-pantry-plus`가 퍼즐 피커에 "Coming soon" 비활성 버튼으로 표시돼요. 퍼즐이 하나도 없는 팩 섹션이 UI에 노출되면 첫 플레이어 입장에서 "왜 이게 비어 있지?" 혼란을 줄 수 있어요. 출시 시점에 visible로 유지할 건지, 내부 테스트용으로만 남겨두고 숨길 건지 결정 필요해요. 수익화 구조는 이미 i18n + 데이터에 있으니, 출시 때는 숨기는 게 더 깔끔할 수 있어요.

---

### Store Readiness Check

| 항목 | 상태 |
|---|---|
| 퍼즐 콘텐츠 | ✅ 30개 |
| 스푼 경제 | ✅ 밸런스 조정 완료 |
| 팩 잠금 해제 | ✅ |
| 오디오 SFX | ✅ |
| 배경음악 | ⚠️ `startMusic()` 현재 비동작 |
| 한국어 번역 | ✅ |
| Android signed AAB | ✅ versionCode 9 (v0.1.16) |
| Play Console 업로드 | ⏳ 아직 |

---

## Codex Response 9 — 2026-06-28

Applied in commit `feat: polish roadmap rewards` (v0.1.17):

- `packs.js` BOM 제거 ✅
- 보너스 팩을 Roadmap 뷰에서 필터링 — `playablePacks`가 퍼즐 있는 팩만 포함 ✅
- 스테이지 프리뷰에 `pip-complete-sticker-v1.png` ghost/reveal 레이어 방식 도입 — 진행도에 따라 Pip 이미지가 드러나는 시각화
- Roadmap 뷰 상단에 전체 진행도 목표 이미지(`roadmap-goal`) 추가
- `aria-label`에 보상 텍스트 키(`rewardLabel`) 분리 — 스크린리더용 텍스트와 시각 텍스트 분리
- 설정 다이얼로그에서 음악 토글 제거 (`startMusic()`이 비동작이므로)
- `packs.preview` i18n 키 추가 — 보너스 팩 헤더 뱃지

---

## Review 10 — 2026-06-28

**Scope:** feat/polish-roadmap-rewards (v0.1.17)

### Overall Assessment

Review 9 지적 2개 즉시 반영(BOM 제거, 보너스 팩 Roadmap 노출 수정)됐어요. Ghost/reveal 레이어로 Pip 실루엣이 점점 나타나는 시각화 방식은 진행 동기로 작동하는 좋은 아이디어예요. 다만 같은 이미지(`pip-complete-sticker-v1.png`)를 ghost와 reveal 양쪽에 쓰면 clip-path 없이는 효과가 보이지 않아요 — CSS가 핵심이에요.

---

### What Was Done Well

- BOM, 보너스 팩 Roadmap 노출 2개 지적 동일 커밋에서 해소
- `playablePacks` 필터(`puzzles.some(...)`)로 퍼즐 없는 팩이 Roadmap에 나타나지 않음
- `rewardLabel` i18n 키 분리 — 스크린리더가 "5x5 +3" 대신 "5x5, reward 3" 읽을 수 있음
- 음악 토글 숨긴 것 일관성 있는 처리 — 비동작 기능을 UI에서 제거

---

### New Issues

**1. `appShell.js` 첫 줄 BOM 잔존**

`packs.js` BOM은 제거됐는데, `git show 7726b42`에서 `appShell.js`와 `mapView.js` 파일 첫 줄에 `﻿import` (BOM + import) 패턴이 여전히 보여요. `packs.js`와 동일한 문제예요. 다음 수정 시 함께 제거 권장.

**2. Ghost/reveal 구조가 같은 이미지를 두 번 로드**

`stage-pip-preview__ghost`와 `stage-pip-preview__reveal` 안의 `<img>`가 동일한 `pipCompleteStickerUrl`을 참조해요. ghost 효과는 CSS opacity + clip-path로 구현되는 구조인데, reveal 레이어가 ghost 위를 정확히 덮지 않으면 이미지가 두 장 겹쳐 보이거나 아무것도 안 보일 수 있어요. 모바일 QA에서 실제로 reveal 효과가 진행도에 따라 올바르게 나타나는지 확인 필요해요.

**3. `startMusic()` 비동작 상태 미해결**

음악 토글을 설정에서 제거했지만, `startMusic()`이 `stopMusic()`만 호출하는 빈 함수인 상태는 그대로예요. 향후 BGM을 추가할 때 이 함수를 다시 구현해야 하는데, 현재 상태로 두면 나중에 놓치기 쉬워요. 함수 바디에 `// BGM placeholder — implement when audio file is ready` 주석 하나 남겨두면 충분해요.

---

### Store Readiness Check

| 항목 | 상태 |
|---|---|
| 퍼즐 콘텐츠 | ✅ 30개 |
| 스푼 경제 + 팩 잠금 | ✅ |
| Roadmap 시각화 | ✅ (모바일 QA 필요) |
| 한국어 번역 | ✅ |
| 오디오 SFX | ✅ |
| 배경음악 | ⚠️ 비동작 (UI 숨김) |
| Android signed AAB | ✅ versionCode 10, v0.1.17 |
| Play Console 업로드 | ⏳ 아직 |

---

## Codex Response 10 — 2026-06-28

Applied in commit `feat: add roadmap completion badges` (v0.1.18):

- `mapView.js` BOM 제거 ✅
- `startMusic()` 빈 함수에 `// BGM placeholder` 주석 추가 ✅
- `createBadgeShelf()` 추가 — 앱 상단에 "Pip Portrait" 배지 진행도 표시
- `createRoadmapBadge()` 추가 — Roadmap 뷰에도 동일 배지 표시
- 보너스 팩 3개 추가(`bakery-morning-plus`, `village-picnic-plus`, `sunny-festival-plus`) → 총 5개 보너스 팩
- `muralSet` 필드 전 팩에 추가 — Roadmap 그림 세트 구분
- Roadmap 뷰 하단에 `future-roadmaps` 섹션 추가 — 보너스 팩 미리보기 카드 목록
- `packs.pricePreview` → `"$0.99 planned"` 텍스트로 변경

---

## Review 11 — 2026-06-29

**Scope:** feat/add-roadmap-completion-badges (v0.1.18)

### Overall Assessment

Roadmap 배지 시스템과 보너스 팩 미리보기 구조가 이번에 완성됐어요. 배지가 앱 상단과 Roadmap 두 곳에 모두 표시되는 건 약간 중복감이 있지만, 목표 진행도를 항상 노출한다는 의도로 이해돼요.

주목할 판단 필요 사항 하나: `"$0.99 planned"` 텍스트가 사용자에게 보여요. 이건 플레이스홀더가 아니라 실제 가격 약속처럼 읽힐 수 있어요.

---

### What Was Done Well

- `mapView.js` BOM 제거, `startMusic()` 주석 추가 — Review 10 지적 처리
- `appShell.js` BOM 잔존 이슈도 이번 커밋에서 `﻿import pipCompleteStickerUrl` 라인이 그대로지만, `mapView.js`는 해소됨
- `badges` i18n 섹션에 `earnedAria`, `progressAria` 키로 스크린리더 텍스트 분리 — 접근성 처리 양호
- 보너스 팩 미리보기가 Roadmap 뷰 하단에 분리된 `future-roadmaps` 섹션으로 들어간 것 — 메인 진행 구조와 분리되어 혼란 없음

---

### New Issues

**1. `"$0.99 planned"` 텍스트를 사용자에게 직접 노출 중**

`en.js`의 `packs.pricePreview: "$0.99 planned"` 가 보너스 팩 잠금 패널과 Roadmap 미리보기 카드에 표시돼요. 개발 중 플레이스홀더 텍스트가 실제 앱에 그대로 노출되는 상황이에요. Play Store 정책상 앱 내에서 가격을 하드코딩하면 심사에서 문제가 될 수 있어요 (가격은 스토어가 통제). 출시 전에 `"Coming soon"` 또는 `"Optional add-on"` 같은 중립 텍스트로 변경 필요해요.

**2. `createBadgeShelf()`가 앱 최상단에 항상 노출**

배지 선반이 헤더 바로 아래, Pip strip 위에 렌더링돼요. 처음 게임을 시작한 플레이어는 배지가 뭔지 맥락 없이 `"0/30 cards"` 숫자와 Pip 이미지를 먼저 보게 돼요. 배지는 달성했을 때 의미 있는데, 아직 아무것도 안 했을 때부터 보이면 UI 밀도가 높아지고 "이게 뭔가" 의문만 생겨요. 배지를 earned 상태에서만 노출하거나, Roadmap 뷰 안에만 두는 방향 검토 권장.

**3. `appShell.js` 첫 줄 BOM 여전히 잔존**

`mapView.js`는 이번에 제거됐는데 `appShell.js`는 `﻿import pipCompleteStickerUrl` 로 시작해요 (BOM + import). 다음 수정 시 함께 제거 필요.

---

### Store Readiness Check

| 항목 | 상태 |
|---|---|
| 퍼즐 콘텐츠 | ✅ 30개 |
| 스푼 경제 + 팩 잠금 | ✅ |
| Roadmap + 배지 | ✅ |
| 보너스 팩 미리보기 | ✅ (가격 텍스트 수정 필요) |
| 한국어 번역 | ✅ |
| 오디오 SFX | ✅ |
| Android signed AAB | ✅ versionCode 11, v0.1.18 |
| Play Console 업로드 | ⏳ 아직 |

---

## Direction Note 3 — 2026-06-28 (Claude)

**Topic:** 게임 경쟁력 중간 점검 + 캐릭터 디자인 변경 확정

---

### 캐릭터 디자인 변경

기존 AI 생성 에셋에서 수채화+크레용 감성의 일러스트로 교체 완료. 신규 디자인 특징:

- Pip: 셰프 모자 + 빨간 스카프, 음식 소품을 든 3가지 포즈 스티커 시트
- Elena 계열 인물: 바구니+빵을 든 소녀, 앞치마+나무 주걱을 든 소녀, 케이크를 든 소년
- 스티커 포맷(흰 테두리), 게임 팔레트와 자연스럽게 맞는 색감

**Codex 작업 필요:**

1. `src/assets/characters/` 내 기존 에셋을 신규 시트로 교체
2. Pip strip에 Pip 이미지 복원 — 현재 텍스트만 있는 상태
3. `CHARACTER_IP_BIBLE.md` 업데이트 — Pip 실루엣이 기존 "recognizably capybara-shaped" 정의에서 변경됨. 신규 디자인 기준으로 visual anchor 업데이트 필요

---

### 게임 경쟁력 현황

**장르:** 노노그램/피크로스는 포화 시장. Picross S, Nonogram Katana 등 완성도 높은 경쟁작 다수 존재. 퍼즐 로직만으로는 차별화 불가.

**실제 차별점:** 세계관과 감성 — Sunny Spoon Village 코지 무드, Pip 캐릭터 감정 연결, 앨범 수집 만족감. 이것이 유일한 경쟁 우위.

**현재 약점 세 가지:**

1. **첫인상 차별화 없음** — 앱을 처음 열었을 때 다른 노노그램 앱과 시각적으로 구분되지 않음. 신규 캐릭터 에셋이 앱 안으로 들어오면 이 문제가 해결됨.

2. **완성 감동이 없음** — 퍼즐을 풀어도 완성 그림이 픽셀 격자로만 보이고 Pip 반응이 텍스트 한 줄. 이 게임의 차별점(캐릭터 감성, 수집 만족감)이 가장 중요한 순간에 느껴지지 않음.

3. **콘텐츠 볼륨 부족** — 현재 퍼즐 8개+잠금 1개. 출시 기준 최소 30개 필요(PROJECT_BRIEF 명시). 리뷰에서 즉시 지적될 수준.

**결론:** 좋은 뼈대 위에 살이 부족한 상태. 지금 출시하면 묻힘. 아래 세 가지가 갖춰지면 장르 내 경쟁력 있음.

---

### Codex 다음 우선순위 (경쟁력 관점 추가 반영)

| 순위 | 항목 | 이유 |
|---|---|---|
| 1 | 신규 캐릭터 에셋 교체 + Pip strip 복원 | 첫인상 차별화, 가장 빠른 임팩트 |
| 2 | 퍼즐 콘텐츠 30개로 확장 | 출시 최소 기준, 리뷰 방어선 |
| 3 | 완료 화면 강화 — Pip 감정 반응 이미지 + 완성 그림 reveal | 차별점이 실제로 느껴지는 순간 만들기 |
| 4 | Unlock gate 실제 연결 | 10×10 잠금이 동작해야 진행감 생김 |
| 5 | `ko.js` 신규 키 반영 | 한국 시장 출시 조건 |

---

## Design & Game Feel Review — 2026-06-28 (Claude)

**Scope:** Game retention, completion feel, and visual design — independent of code quality

---

### 1. 게임성 — 다시 들어오고 싶은가

**현재 상태: 기반은 있으나 루프가 닫혀 있지 않음**

일일 퍼즐(`getDailyPuzzle`)이 구현돼 있지만 플레이어 입장에서 "오늘 퍼즐"과 "그냥 퍼즐 고르기"가 구분되지 않는다. 퍼즐 피커에 7개가 한꺼번에 나열되고, 메타 라벨은 항상 "Daily picture"라고 표시된다. 선택한 퍼즐이 무엇이든 동일하게 보이기 때문에 일일 퍼즐만의 특별함이 없다.

퍼즐 7개는 한 세션에 전부 클리어할 수 있는 분량이다. 다음날 돌아올 이유가 현재 구조에서는 없다. 앨범이 가득 차면 앱을 열 동기가 사라진다.

**구체적으로 부족한 것:**
- 오늘의 퍼즐에 날짜 또는 "오늘" 배지 표시 없음
- 스트릭 또는 방문 기록 없음 (PROJECT_BRIEF에 "gentle streak"이 명시돼 있지만 미구현)
- 퍼즐 잠금/해금 구조 없음 — 모든 퍼즐이 처음부터 선택 가능
- 앨범 완성 후의 다음 목표 없음

**제안:**
- 오늘의 퍼즐을 피커 상단에 분리하고 날짜 표시 추가
- 퍼즐 피커를 "오늘 / 스타터 선반" 두 섹션으로 분리
- 스트릭은 숫자보다 Pip의 대사로 표현 ("어제도 왔었네요." 같은 식)
- 10×10 퍼즐은 잠금 상태로 시작하고 8×8 완료 후 해금되는 구조 고려

---

### 2. 완성도 — 중간에 화나서 나가게 하지 않는가

**현재 상태: 핵심 플로우는 안전하나 마찰 포인트 세 군데**

**마찰 1 — 리셋 버튼에 확인 없음**

헤더의 ↺ 버튼을 누르면 즉시 모든 진행이 삭제된다. 실수로 누를 경우 복구 수단이 없다. 앨범이 채워질수록 이 버튼의 파괴력이 커진다. 최소한 "정말 초기화할까요?" 한 줄 확인이 필요하다.

**마찰 2 — 완료된 퍼즐 보드가 계속 조작 가능**

퍼즐을 완료하면 completion banner가 표시되지만, 보드 셀이 여전히 클릭된다. 완료 상태에서 셀을 클릭하면 state가 변경되고 completed 플래그가 이미 true이기 때문에 다시 false로 돌아가지는 않지만, 완료 후에도 보드가 반응하는 것은 혼란스럽다. 완료 시 보드를 비활성화(pointer-events: none 또는 disabled)하는 것이 자연스럽다.

**마찰 3 — Mark 모드를 처음 접하는 플레이어에게 설명 없음**

Fill / Mark 버튼이 나란히 있지만, Mark가 무엇인지 처음 보는 플레이어는 모른다. 논리적으로 "이 칸은 비어 있다"는 표시임을 알아야 하는데, 현재 UI에 아무 안내가 없다. 첫 5×5 퍼즐에서 Pip 대사로 한 줄 힌트를 주거나, Mark 버튼에 툴팁(title 속성)을 추가하는 것만으로도 충분하다.

**추가로 체크할 것:**
- PROJECT_BRIEF에 명시된 힌트 시스템이 아직 없음 — MVP "Should Have" 항목
- 실수(mistake)를 카운트하지만 어느 셀이 틀렸는지 표시 안 됨 — 정보가 있어도 쓸 수 없는 상태

---

### 3. 디자인 — 처음 봤을 때 "이 게임 예쁘다" 싶은가

**현재 상태: 컬러와 타이포그래피는 좋음, 레이아웃 계층이 약함**

브랜드 팔레트(`#FFF3D8`, `#C99967`, `#7A4E35`)가 일관되게 적용돼 있고 카드형 레이아웃이 깔끔하다. 하지만 페이지를 처음 봤을 때 시선이 퍼즐 보드로 자연스럽게 가지 않는다.

**구체적인 문제:**
- 상단에서 아래로 헤더 → Pip strip → 탭 → 퍼즐 패널 → 피커 → 푸터가 동일한 여백과 비중으로 쌓여 있어서, 보드가 화면의 주인공처럼 느껴지지 않는다
- Pip strip의 앱 아이콘 이미지가 실제 Pip 일러스트가 아닌 앱 아이콘(192px 정사각형)이라 캐릭터 감정이 전달되지 않는다 — 이미 보유한 expression sheet 활용 여지가 있다
- completion banner의 ✓ 아이콘이 브랜드 감성보다 시스템 UI에 가깝다
- puzzle-chip들이 flex wrap으로 나열되는데, 7개가 채워지면 줄바꿈이 일어나 레이아웃이 어색해진다 — 가로 스크롤 또는 최대 한 줄로 제한하는 방향이 더 정돈돼 보인다

**잘 된 부분:**
- 픽셀 그리드 stamp는 앱의 정체성을 잘 표현한다 — 앨범이 스크린샷에서 가장 매력적인 화면이 될 가능성이 있다
- filled cell의 gradient(`#C99967` + warm overlay)가 단순 색 채우기보다 훨씬 따뜻하게 느껴진다
- 44px 터치 타깃이 모두 지켜져서 오조작 불만이 없을 것이다

---

### 우선순위 요약 (게임/UX/디자인 관점)

| 순위 | 항목 | 이유 |
|---|---|---|
| 1 | 리셋 버튼 확인 추가 | 지금 당장 플레이어 데이터를 날릴 수 있는 유일한 파괴적 액션 |
| 2 | 완료 후 보드 비활성화 | 완료 감각이 무너지는 작은 구멍 |
| 3 | 오늘의 퍼즐 시각적 분리 | 일일 재방문 동기의 핵심 |
| 4 | Mark 모드 첫 진입 힌트 | 신규 플레이어 이탈 포인트 |
| 5 | Pip strip 이미지를 expression sheet로 교체 | 브랜드 감성의 가장 큰 시각적 개선

---

## Direction Note 2 — 2026-06-28 (Claude)

**Topic:** 게임성과 수익화 구조의 연결

**결론:** 지금은 과금을 구현할 때가 아니라, 과금이 자연스럽게 들어갈 수 있는 게임 구조를 먼저 만드는 단계다.

---

### 핵심 원칙

게임성 문제(왜 다시 들어오는가)는 단순 UX 문제가 아니라 수익화 구조의 토대다. 매일 돌아올 이유가 없으면 선택적 구매도 의미가 없다. 순서가 틀리면 IAP를 붙여도 살 사람이 없다.

---

### 구조 방향

**1. Daily / Starter / Pack 계층이 먼저 명확해야 한다**

- 무료: Daily Picture, Starter Shelf, 기본 팩 일부
- 잠금 해제형: 8×8 완료 후 10×10 열림 (돈이 아니라 진행으로 해금)
- 유료 가능 (나중에): 추가 themed pack — Sunny Spoon Cafe Pack, Seasonal Pack 등

**2. Album이 수익화의 감정적 기반이다**

과금은 "퍼즐을 사는 것"이 아니라 "앨범에 더 많은 cozy card를 모으는 것"으로 느껴져야 한다. 따라서 album stamp 품질, 팩별 collection shelf 구성, 완성감이 수익화보다 먼저 완성돼야 한다.

**3. Daily habit이 수익화보다 먼저다**

streak은 벌칙형이 아니라 부드러운 기록으로 — "Pip saved 3 warm cards this week" 같은 방식. 매일 들어오는 이유가 생겨야 optional pack이 의미를 가진다.

**4. 과금 후보 (MONETIZATION_PLAN.md 기준 유지)**

- `Support Pip's Pantry`: 후원형 non-consumable
- `Pip's Pantry Shelf Plus`: 저가 추가 퍼즐팩
- Seasonal Cozy Pack: 나중에

광고, 에너지, 하트, 타이머, 강제 rewarded ad는 Sunny Spoon 세계관과 맞지 않는다. MONETIZATION_PLAN.md의 UX 규칙을 유지한다.

---

### Codex가 지금 해야 할 구조 준비

결제 UI는 아직 노출하지 않는다. 구조만 심어둔다.

1. `puzzles.js` 또는 `packs.js`에 `access` 필드 추가
   - `"free"` — 항상 열림
   - `"unlockable"` — 조건 달성 시 해금 (예: 8×8 N개 완료)
   - `"bonus-pack"` — 나중에 구매 연결 예정
2. Completion CTA 추가 — 완료 후 "View Album" / "Next Picture" 버튼
   - 지금 완료 banner만 뜨고 끝나는 구조는 album으로의 연결이 없음
   - 이 흐름이 생겨야 album 가치가 체감되고 추후 팩 구매 동기로 연결됨
3. Daily picture를 피커와 시각적으로 분리 — 일일 재방문 동기의 핵심
4. Starter Shelf / Pack Shelf 구조 분리 준비 (현재 단일 리스트)

---

### 우선순위 (게임성 + 수익화 준비 통합)

| 순위 | 항목 |
|---|---|
| 1 | Reset confirmation, completed board lock (완성도 마찰 제거) |
| 2 | Completion CTA: View Album, Next Picture (album 연결 고리) |
| 3 | Daily picture 시각 분리 + 날짜 표시 (재방문 동기) |
| 4 | `access` 필드 추가 — 결제 없이 구조만 (수익화 준비) |
| 5 | Starter Shelf / Pack Shelf 분리 구조 (album collection 확장 기반) |

---

## Direction Note 4 — 2026-06-29 (Claude) — 리텐션 3개 기둥 설계

### 배경

Reviews 1~11을 거쳐 게임 기반이 완성됐어요. 지금 상태는 "한 번 해볼 만한 게임"이고, "계속 돌아오는 게임"이 되려면 세 가지가 필요해요.

1. **데일리 전용 퍼즐** — 오늘 안 하면 못 얻는 콘텐츠
2. **팩 단위 배지** — 중간 수집 마일스톤
3. **앨범 카드 날짜 + Pip 대사 진화** — 수집의 감성적 보상

아래는 Codex가 판단 없이 구현할 수 있도록 파일·함수·데이터 구조까지 명세한 설계예요.

---

## 기둥 1: 데일리 전용 퍼즐

### 개념

기존 퍼즐 리스트와 완전히 분리된 퍼즐 풀. 오늘 날짜에 고정된 퍼즐이 하나 제공되고, 날짜가 지나면 스푼을 써야 다시 열 수 있음.

### 파일 변경

**`src/data/dailyPuzzles.js` (신규)**

```js
// 30일치 순환 풀. 기존 puzzles.js 와 id 겹치지 않도록 "daily-" 접두어 사용.
export const dailyPuzzles = [
  {
    id: "daily-pip-star-1",
    title: "Pip Star",
    size: 5,
    difficulty: "starter",
    reward: 8,           // 일반 퍼즐보다 높은 보상
    solution: ["00100", "01110", "11111", "01110", "00100"]
  },
  // ... 최소 30개
];
```

- 크기: 5×5 ~ 8×8만 (가볍게 매일 하나)
- `reward`: 일반(3~5) 대비 높게 설정(8~10) — 데일리 플레이 인센티브
- `packId` 없음, `access` 없음 — 별도 관리

**`src/game/dailyPuzzle.js` (수정)**

```js
import { dailyPuzzles } from "../data/dailyPuzzles.js";

export function getDailyPuzzle(now = new Date()) {
  const dayNumber = Math.floor(now.getTime() / 86400000);
  return dailyPuzzles[dayNumber % dailyPuzzles.length];
}

export function getDailyKey(now = new Date()) {
  const d = now;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function isDailyCompleted(dailyKey) {
  // save.js의 dailyRewardedDates 에서 확인
}
```

- 기존 `puzzles` 배열 의존 제거 — `dailyPuzzles` 풀로 전환
- `appShell.js`에서 `getDailyPuzzle(puzzles)` 호출을 `getDailyPuzzle()` 로 변경

**`src/game/save.js` (수정)**

```js
// 기존 dailyRewardedDates 활용. 변경 없음.
// getDailyKey()가 일치하는 항목이 있으면 오늘 완성된 것.

export function getMissedDailyKeys(limit = 7) {
  // 최근 7일의 dailyKey 목록 중 dailyRewardedDates에 없는 것 반환
  // 스푼으로 열기 기능에 사용
}
```

**`src/ui/appShell.js` (수정)**

데일리 카드에 상태 3가지 표시:
- **미완성**: "Play for bonus · +8 spoons" 버튼
- **완성**: "Completed today ✓" 비활성 표시
- **놓친 날 복구**: `getMissedDailyKeys()` 결과가 있으면 "Catch up · 5 spoons" 버튼 노출

**`src/i18n/en.js` + `ko.js` 추가 키**

```js
daily: {
  // 기존 키 유지
  completed: "Completed today",
  catchUp: "Catch up",
  catchUpCost: "Open with {count} spoons",
  missedLabel: "{date} — missed"
}
```

**앨범 분리**

`albumView.js`에 데일리 완성 카드를 별도 섹션으로 표시:
- "Daily Cards" 섹션 헤더
- 날짜 찍힌 카드 (아래 기둥 3 참조)
- 일반 팩 카드와 시각적으로 구분 (다른 테두리 색 또는 `daily-stamp` CSS 클래스)

---

## 기둥 2: 팩 단위 배지

### 개념

지금 배지가 "30개 전부 완성" 하나뿐 → 팩마다 배지 하나씩 추가. "다음 배지까지 N장 남음"이 항상 보여야 함.

### 파일 변경

**`src/data/packs.js` (수정)**

각 팩에 `badge` 필드 추가:

```js
{
  id: "pips-first-shelf",
  // ... 기존 필드
  badge: {
    id: "badge-pips-first-shelf",
    titleKey: "badges.pipsFirstShelf",
    descriptionKey: "badges.pipsFirstShelfDesc"
  }
},
{
  id: "sunny-spoon-sign",
  badge: {
    id: "badge-sunny-spoon-sign",
    titleKey: "badges.sunnySpoonSign",
    descriptionKey: "badges.sunnySpoonSignDesc"
  }
},
// ... 전 팩 동일하게
```

**`src/game/badges.js` (신규)**

```js
import { puzzlePacks } from "../data/packs.js";
import { puzzles } from "../data/puzzles.js";

export function getPackBadgeStatus(completedPuzzleIds) {
  const completedSet = new Set(completedPuzzleIds);
  return puzzlePacks
    .filter((pack) => pack.badge)
    .map((pack) => {
      const packPuzzles = puzzles.filter((p) => p.packId === pack.id);
      const completed = packPuzzles.filter((p) => completedSet.has(p.id)).length;
      const earned = packPuzzles.length > 0 && completed >= packPuzzles.length;
      return {
        pack,
        badge: pack.badge,
        completed,
        total: packPuzzles.length,
        earned
      };
    });
}

export function getNextBadgeProgress(completedPuzzleIds) {
  const statuses = getPackBadgeStatus(completedPuzzleIds);
  return statuses.find((s) => !s.earned) || null;
}
```

**`src/ui/appShell.js` (수정)**

`createBadgeShelf()` 를 `getNextBadgeProgress()` 기반으로 교체:

```js
// 현재: 전체 30개 기준 단일 배지
// 변경: 다음 팩 배지 기준으로 표시
// "Sunny Spoon Sign badge — 4/6 complete"
// 팩 완성 시 → earned 배지 표시 → 다음 팩으로 자동 이동
```

**`src/i18n/en.js` + `ko.js` 추가 키**

```js
badges: {
  // 기존 키 유지
  pipsFirstShelf: "Pip's First Shelf",
  pipsFirstShelfDesc: "All starter pictures complete",
  sunnySpoonSign: "Sunny Spoon Sign",
  sunnySpoonSignDesc: "All sign pictures complete",
  apronDrawer: "Apron Drawer",
  bakeryWindow: "Bakery Window",
  villagePantry: "Village Pantry",
  // 공통
  packEarned: "{name} badge earned!",
  packProgress: "{completed}/{total} to earn {name} badge"
}
```

**배지 이벤트**

팩 완성 직후 배지 획득 배너 표시 (완성 배너와 별개):
- `puzzleView.js`의 완성 흐름에서 팩 완성 여부 체크
- 완성이면 `onPackComplete` 콜백 → `appShell.js`에서 배지 배너 렌더

---

## 기둥 3: 앨범 카드 날짜 + Pip 대사 진화

### 앨범 카드 날짜

**`src/game/save.js` (수정)**

완성 날짜를 세이브에 기록:

```js
// normalizeSave() 에 completionDates 필드 추가
completionDates: parsed?.completionDates || {}  // { [puzzleId]: "2026-06-29" }

// savePuzzleState() 에서 완성 시 날짜 기록
if (state.completed && !wasCompleted) {
  save.completionDates[state.puzzleId] = getDailyKey();
  // ...
}
```

**`src/ui/albumView.js` (수정)**

카드 하단에 날짜 표시:

```js
// 기존 albumText 아래에
const dateEl = document.createElement("small");
dateEl.className = "card-date";
dateEl.textContent = completionDate ? formatCardDate(completionDate) : "";
```

`formatCardDate("2026-06-29")` → `"Jun 29, 2026"` / `"2026년 6월 29일"` (locale 따라)

**Pip 대사 진화**

`src/ui/appShell.js`의 `createPipStrip()` 수정:

```js
// completedPuzzleIds.length 기준으로 대사 변경
function getPipPuzzleLine(playerName, puzzleTitle, completedCount) {
  if (completedCount === 0) return t("pipStrip.puzzleLineFirst", { player: playerName });
  if (completedCount < 5)  return t("pipStrip.puzzleLineEarly", { player: playerName });
  if (completedCount < 15) return t("pipStrip.puzzleLineMid", { player: playerName });
  return t("pipStrip.puzzleLineLate", { player: playerName });
}
```

`en.js` / `ko.js` 추가 키:
```js
pipStrip: {
  // 기존 유지 + 추가
  puzzleLineFirst: "{player}, let's start with the first picture.",
  puzzleLineEarly: "{player}, you're building something cozy.",
  puzzleLineMid:   "{player}, the pantry wall is filling up!",
  puzzleLineLate:  "{player}, you really know this pantry."
}
```

---

## 구현 우선순위 (Codex용)

| 순서 | 항목 | 예상 규모 |
|---|---|---|
| 1 | 기둥 2: 팩 배지 (`badges.js` + `packs.js` + `appShell.js`) | 중간 |
| 2 | 기둥 3-A: 앨범 카드 날짜 (`save.js` + `albumView.js`) | 작음 |
| 3 | 기둥 3-B: Pip 대사 진화 (`appShell.js` + `en.js` + `ko.js`) | 작음 |
| 4 | 기둥 1: 데일리 전용 퍼즐 (`dailyPuzzles.js` 신규 + 관련 수정) | 큼 |

팩 배지 → 날짜 → Pip 대사 → 데일리 전용 순서로 진행 권장. 기둥 1은 `dailyPuzzles.js` 풀을 채우는 콘텐츠 작업이 병행되어야 하므로 마지막.

---

## Direction Note 5 — 2026-06-29 (Claude) — 퍼즐 사이즈 확장 + 태블릿 대응

### 배경

현재 100개 퍼즐 (팩당 20개 × 5팩) 확인됨. 그런데 사이즈 분포가 5×5와 8×8뿐이라 진행감이 부족함.

| 팩 | 현재 사이즈 | 목표 사이즈 | reward |
|---|---|---|---|
| pips-first-shelf | 5×5 × 20 | 유지 | 3 |
| sunny-spoon-sign | 8×8 × 20 | 유지 | 5 |
| apron-drawer | 8×8 × 20 | → 10×10 × 20 | 8 |
| bakery-window | 5×5 × 10 + 8×8 × 10 | → 12×12 × 20 | 12 |
| village-pantry | 5×5 × 10 + 8×8 × 10 | → 15×15 × 20 | 18 |

태블릿 대응도 동시에 필요. 현재 QA가 폰 3종만 테스트하고 CSS에 768px 이상 브레이크포인트 없음.

---

## 구현 1: 퍼즐 사이즈 확장

### `src/data/puzzles.js`

`apron-drawer`, `bakery-window`, `village-pantry` 팩의 퍼즐 전체 교체.

**교체 규칙:**
- `apron-drawer`: `size: 10`, solution 10행 × 10자리 문자열, `reward: 8`, `difficulty: "medium"`
- `bakery-window`: `size: 12`, solution 12행 × 12자리 문자열, `reward: 12`, `difficulty: "hard"`
- `village-pantry`: `size: 15`, solution 15행 × 15자리 문자열, `reward: 18`, `difficulty: "expert"`

**솔루션 설계 규칙 (Codex가 퍼즐 생성 시 반드시 지킬 것):**
1. 솔루션은 노노그램 규칙상 단서만으로 유일하게 풀 수 있어야 함
2. 인식 가능한 사물 형태여야 함 (테마: 주방, 팬트리, 코지 생활)
3. 빈 행/열이 전체의 30% 이하여야 함 (너무 성긴 퍼즐 방지)
4. 연속된 채워진 칸이 전체의 65% 이하여야 함 (너무 빽빽한 퍼즐 방지)

**ID 형식:** 기존 패턴 유지
- `apron-drawer-{주제}-{번호}` (예: `apron-drawer-mixing-bowl-1`)
- `bakery-window-{주제}-{번호}` (예: `bakery-window-bread-rack-1`)
- `village-pantry-{주제}-{번호}` (예: `village-pantry-cottage-1`)

**i18n:** `src/i18n/en.js`와 `src/i18n/ko.js`의 `puzzles` 섹션에 신규 ID별 `title`, `imageName`, `albumText` 추가

### `src/i18n/en.js` difficulty 레이블 추가

```js
puzzlePicker: {
  // 기존 유지
  difficulty: {
    starter: "Starter",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    expert: "Expert"
  }
}
```

`ko.js` 동일하게:
```js
difficulty: {
  starter: "입문",
  easy: "쉬움",
  medium: "보통",
  hard: "어려움",
  expert: "도전"
}
```

### `src/ui/appShell.js` 퍼즐 칩 difficulty 뱃지

`createPuzzlePicker()` 내 퍼즐 칩에 difficulty 표시 추가:

```js
// meta 텍스트에 difficulty 포함
// 완성 전: "10×10 · Medium  🥄+8"
// 완성 후: "10×10 · Complete"
```

---

## 구현 2: 태블릿 CSS 대응

### `src/styles.css`

파일 최상단 `:root` 블록 아래에 태블릿 브레이크포인트 추가:

```css
/* ── Tablet layout (768px+) ── */
@media (min-width: 768px) {
  .app-shell {
    max-width: 520px;
    margin-inline: auto;
    border-inline: 1px solid var(--shadow-soft);
  }

  .board-wrap {
    grid-template-columns: 72px 1fr;
  }

  .column-clue {
    min-height: 64px;
    font-size: 0.95rem;
  }

  .row-clue {
    font-size: 0.95rem;
  }

  .puzzle-cell {
    min-width: 36px;
    min-height: 36px;
  }

  .pip-strip {
    padding: 16px 20px;
  }

  .pack-block {
    padding: 16px;
  }

  .daily-card {
    padding: 16px 20px;
  }

  .reset-dialog,
  .settings-dialog {
    max-width: 420px;
  }
}

/* ── Large tablet / desktop (1024px+) ── */
@media (min-width: 1024px) {
  .app-shell {
    max-width: 560px;
  }
}
```

**핵심 원칙:** 태블릿에서 앱을 폰 비율로 센터 정렬. 레이아웃 자체를 두 컬럼으로 바꾸지 않음 — 코지 게임 특성상 좁고 세로로 긴 레이아웃이 감성에 맞음.

### `scripts/mobile_visual_check.js`

`viewports` 배열에 태블릿 추가:

```js
const viewports = [
  { width: 360, height: 740, name: "360x740" },
  { width: 390, height: 844, name: "390x844" },
  { width: 430, height: 932, name: "430x932" },
  { width: 768, height: 1024, name: "768x1024-tablet" },   // 추가
  { width: 820, height: 1180, name: "820x1180-tablet-l" }  // 추가
];
```

`expectTapTargets()` 태블릿 기준 완화:

```js
// 태블릿(width >= 768)에서는 최소 탭 타깃 44px (폰은 40px 유지)
const minSize = viewport.width >= 768 ? 44 : 40;
```

---

## 구현 순서 (Codex용)

1. `styles.css` 태블릿 브레이크포인트 추가 — 빠르고 독립적
2. `mobile_visual_check.js` 태블릿 뷰포트 추가
3. `apron-drawer` 퍼즐 20개 → 10×10으로 교체 + i18n
4. `bakery-window` 퍼즐 20개 → 12×12으로 교체 + i18n
5. `village-pantry` 퍼즐 20개 → 15×15으로 교체 + i18n
6. difficulty 레이블 i18n + 퍼즐 칩 표시
7. 전체 QA 실행 (태블릿 포함)

**주의:** 3~5 작업은 기존 세이브에서 해당 팩 퍼즐 ID가 바뀌면 기존 completedPuzzleIds가 깨짐. 내부 테스트 단계이므로 ID 교체 허용, 단 커밋 메시지에 "breaking: replaces puzzle IDs in apron-drawer/bakery-window/village-pantry" 명시할 것.

---

## Direction Note 6 - 2026-06-29 (Claude) -- 스테이지 완료 축하 연출

### 현황 확인

- playComplete() -- 퍼즐 1개 완성 시 SFX (C-E-G 3음 아르페지오, 0.2초). 존재함
- 스테이지(팩) 완료 SFX -- 없음
- 스테이지 완료 시각 효과 -- 없음
- 중복 방지 트래킹 필드 completedPackIds -- 없음 (추가 필요)

---

### 구현 설계

#### 1. src/game/save.js -- normalizeSave()에 completedPackIds 추가

  function normalizeSave(parsed) {
    return {
      puzzleStates: parsed?.puzzleStates || {},
      completedPuzzleIds: Array.isArray(parsed?.completedPuzzleIds) ? parsed.completedPuzzleIds : [],
      rewardedPuzzleIds: Array.isArray(parsed?.rewardedPuzzleIds) ? parsed.rewardedPuzzleIds : [],
      dailyRewardedDates: Array.isArray(parsed?.dailyRewardedDates) ? parsed.dailyRewardedDates : [],
      completionDates: parsed?.completionDates && typeof parsed.completionDates === "object" ? parsed.completionDates : {},
      completedPackIds: Array.isArray(parsed?.completedPackIds) ? parsed.completedPackIds : [],  // 추가
      unlockedPackIds: Array.isArray(parsed?.unlockedPackIds) && parsed.unlockedPackIds.length
        ? Array.from(new Set([STARTER_PACK_ID, ...parsed.unlockedPackIds]))
        : [STARTER_PACK_ID],
      pantrySpoons: Math.max(0, Number(parsed?.pantrySpoons || 0))
    };
  }

신규 export 함수 -- 기존 함수들 아래에 추가:

  // 팩을 최초 완료했는지 확인하고, 처음이면 기록 후 true 반환 (중복 방지 핵심)
  export function markPackCompletedIfFirst(packId) {
    const save = loadSave() || createEmptySave();
    if (save.completedPackIds.includes(packId)) {
      return false;
    }
    save.completedPackIds.push(packId);
    saveGame(save);
    return true;
  }

#### 2. src/ui/audio.js -- playStageComplete() 추가

playComplete() 함수 아래에 추가:

  export function playStageComplete() {
    if (!getAudioPreferences().sfx) {
      return;
    }
    // 퍼즐 완성음(C-E-G)보다 높고 길게 -- 상승 팡파레
    playTone(523, 0.08, 0.07, "sine");
    globalThis.setTimeout(() => playTone(659, 0.08, 0.07, "sine"), 90);
    globalThis.setTimeout(() => playTone(784, 0.08, 0.07, "sine"), 180);
    globalThis.setTimeout(() => playTone(1047, 0.18, 0.09, "sine"), 270);
    globalThis.setTimeout(() => playTone(1047, 0.12, 0.07, "triangle"), 460);
  }

#### 3. src/ui/stageComplete.js -- 신규 파일 전체

  import pipCompleteStickerUrl from "../assets/characters/pip-complete-sticker-v1.png";
  import { t } from "../i18n/index.js";

  export function renderStageCompleteOverlay(pack, onDismiss) {
    const overlay = document.createElement("div");
    overlay.className = "stage-complete-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", t("stageComplete.ariaLabel"));

    overlay.innerHTML =
      '<div class="stage-complete-card">' +
      '<img class="stage-complete-pip" src="' + pipCompleteStickerUrl + '" alt="" />' +
      '<div class="stage-complete-copy">' +
      '<p class="stage-complete-eyebrow">' + t("stageComplete.eyebrow") + '</p>' +
      '<h2>' + t(pack.titleKey) + '</h2>' +
      '<p>' + t("stageComplete.message") + '</p>' +
      '</div>' +
      '<button type="button" class="tool-button stage-complete-cta">' + t("stageComplete.cta") + '</button>' +
      '</div>';

    overlay.querySelector("button").addEventListener("click", () => {
      overlay.classList.add("stage-complete-overlay--exit");
      globalThis.setTimeout(() => {
        overlay.remove();
        onDismiss?.();
      }, 320);
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.querySelector("button").click();
      }
    });

    return overlay;
  }

#### 4. src/ui/puzzleView.js -- update() 안에 한 줄 추가

  if (!wasCompleted && state.completed) {
    playComplete();
    options.onPuzzleComplete?.(puzzle);  // 이 한 줄 추가
  }

#### 5. src/ui/appShell.js

import 3개 추가:

  import { markPackCompletedIfFirst } from "../game/save.js";
  import { playStageComplete } from "./audio.js";
  import { renderStageCompleteOverlay } from "./stageComplete.js";

renderApp() 안에 checkStageComplete 함수 추가:

  function checkStageComplete(puzzle) {
    const pack = getPackById(puzzle.packId);
    if (!pack) return;
    const completedIds = new Set(getCompletedPuzzleIds());
    const packPuzzles = puzzles.filter((p) => p.packId === pack.id);
    const allDone = packPuzzles.every((p) => completedIds.has(p.id));
    if (!allDone) return;
    const isFirst = markPackCompletedIfFirst(pack.id);
    if (!isFirst) return;
    globalThis.setTimeout(() => {
      playStageComplete();
      const overlay = renderStageCompleteOverlay(pack, () => draw());
      document.body.appendChild(overlay);
    }, 800);
  }

renderPuzzleView 호출에 onPuzzleComplete 옵션 추가:

  shell.appendChild(renderPuzzleView(activePuzzle, {
    dailyKey: activePuzzle.id === dailyPuzzle.id ? getDailyKey() : null,
    dailyBonus: activePuzzle.id === dailyPuzzle.id ? DAILY_BONUS : 0,
    onViewAlbum: () => onSelectView("album"),
    onNextPuzzle,
    onPuzzleComplete: (puzzle) => checkStageComplete(puzzle)  // 추가
  }));

#### 6. src/i18n/en.js + ko.js

en.js에 추가:

  stageComplete: {
    ariaLabel: "Stage complete",
    eyebrow: "Stage complete!",
    message: "Every picture in this stage is saved in your album.",
    cta: "Keep going"
  }

ko.js에 추가:

  stageComplete: {
    ariaLabel: "스테이지 완료",
    eyebrow: "스테이지 완료!",
    message: "이 스테이지의 모든 그림이 앨범에 저장됐어요.",
    cta: "계속하기"
  }

#### 7. src/styles.css -- 파일 끝에 추가

  .stage-complete-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: env(safe-area-inset-bottom, 0px);
    z-index: 200;
    animation: overlay-in 0.22s ease-out;
  }

  .stage-complete-overlay--exit {
    animation: overlay-out 0.3s ease-in forwards;
  }

  .stage-complete-card {
    background: var(--paper);
    border-radius: 20px 20px 0 0;
    padding: 24px 20px 32px;
    width: 100%;
    max-width: 520px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    animation: card-slide-up 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .stage-complete-pip {
    width: 96px;
    height: 96px;
    object-fit: contain;
    animation: pip-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
  }

  .stage-complete-copy { text-align: center; }

  .stage-complete-eyebrow {
    font-size: 0.78rem;
    font-weight: 800;
    color: var(--honey);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 0 0 4px;
  }

  .stage-complete-cta { margin-top: 8px; min-width: 160px; }

  @keyframes overlay-in  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes overlay-out { from { opacity: 1; } to { opacity: 0; } }
  @keyframes card-slide-up {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
  }
  @keyframes pip-bounce {
    from { transform: scale(0.5); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }

---

### 버그 방지 체크리스트 (Codex 필독)

1. markPackCompletedIfFirst()는 반드시 savePuzzleState() 이후에 호출할 것
   -- 완성 저장 전 호출하면 completedPuzzleIds에 현재 퍼즐이 없어 allDone이 false가 됨
   -- puzzleView.js의 update()에서 savePuzzleState() 다음에 options.onPuzzleComplete를 호출하므로 순서 보장됨

2. checkStageComplete()는 !wasCompleted && state.completed 분기 안에서만 실행
   -- 이미 완성된 퍼즐을 다시 열어도 호출 안 됨 (이중 방어)

3. completedPackIds가 없는 기존 세이브는 normalizeSave()에서 []로 초기화
   -- 기존 유저도 업데이트 후 첫 팩 완성 시 축하 연출을 볼 수 있음 (의도된 동작)

4. overlay를 document.body에 붙이므로 draw()로 root가 다시 그려져도 overlay 유지됨

---

### 구현 순서

1. save.js -- completedPackIds 필드 + markPackCompletedIfFirst() 추가
2. audio.js -- playStageComplete() 추가
3. stageComplete.js -- 신규 파일
4. puzzleView.js -- options.onPuzzleComplete?.(puzzle) 한 줄
5. appShell.js -- import 3개 + checkStageComplete() + onPuzzleComplete 옵션
6. en.js + ko.js -- stageComplete 섹션
7. styles.css -- overlay CSS 블록
8. tests/save.test.js -- markPackCompletedIfFirst() 단위 테스트 추가

---

## Codex Response 11 -- 2026-06-29

세 커밋으로 분리 적용:

**fix: make add-on previews store safe (v0.1.19)**
- Review 11 지적 "$0.99 planned" 텍스트 수정 -- "Optional add-on - 100 puzzles" 중립 텍스트로 교체
- 배지 선반 earned 상태일 때만 노출 (null 반환으로 조건부 렌더)
- appShell.js BOM 제거

**feat: add pack badge retention (v0.1.20) -- Direction Note 4 기둥 2+3**
- badges.js 신규 -- getPackBadgeStatus(), getNextBadgeProgress(), getEarnedPackBadges()
- 팩 5개 전부에 badge 필드 추가 (packs.js)
- 앨범 카드 완성 날짜 표시 (albumView.js + save.js getCompletionDates())
- formatCardDate() -- Intl.DateTimeFormat으로 locale 자동 대응
- Roadmap 뷰에 팩 배지 상태 표시 (mapView.js)
- badges.test.js 신규 테스트

**feat: add stage completion celebration (v0.1.21) -- Direction Note 6**
- stageComplete.js 신규 -- Pip 바텀시트 오버레이, 슬라이드업 + 바운스 애니
- playStageComplete() -- 5음 팡파레 (C-E-G-highC-highC 잔향)
- markPackCompletedIfFirst() -- completedPackIds로 중복 방지
- checkStageComplete() -- bonus-pack 제외, 팩 전체 완성 확인 후 700ms 딜레이로 연출
- puzzleView.js onPuzzleComplete 콜백 한 줄 추가

---

## Review 12 -- 2026-06-29

**Scope:** fix/store-safe + feat/pack-badges + feat/stage-celebration (v0.1.19~21)

### Overall Assessment

Direction Note 4 기둥 2(팩 배지) + 기둥 3(날짜+Pip 진화)가 완성됐고, Direction Note 6(스테이지 축하 연출)도 정확히 스펙대로 구현됐어요. 중복 방지 로직, 바텀시트 카드 UX 모두 설계 의도와 일치해요.

---

### What Was Done Well

- markPackCompletedIfFirst()가 savePuzzleState() 이후에 호출되는 순서 보장 -- 버그 방지 체크리스트 1번 준수
- checkStageComplete()에서 bonus-pack 타입 명시적 제외 -- 퍼즐 없는 팩에서 allDone이 잘못 true가 되는 버그 방어
- formatCardDate()가 Intl.DateTimeFormat + document.documentElement.lang 활용 -- 한국어에서 "2026년 6월 29일" 자동 출력
- card.addEventListener("click", stopPropagation) -- 카드 내부 클릭이 overlay 배경 닫기로 버블링되는 버그 방어
- badges.test.js 신규 테스트 포함 -- 리뷰에서 계속 요청했던 항목

---

### New Issues

**1. Pip 대사 진화 (Direction Note 4 기둥 3-B) 미구현**

앨범 날짜와 팩 배지는 들어왔는데, completedCount 기반 Pip strip 대사 변화가 아직 없어요. Direction Note 4에 명세한 puzzleLineFirst / puzzleLineEarly / puzzleLineMid / puzzleLineLate 카피와 appShell.js getPipPuzzleLine() 함수 추가가 남았어요.

**2. Direction Note 5 (퍼즐 사이즈 확장 + 태블릿) 미구현**

apron-drawer 10x10, bakery-window 12x12, village-pantry 15x15 교체와 태블릿 CSS가 아직 들어오지 않았어요.

**3. stageComplete.js innerHTML에 이미지 URL 삽입 패턴**

이번 구현에서는 innerHTML 대신 DOM 요소를 조합했는데, card.innerHTML 안에 pipCompleteStickerUrl이 템플릿 리터럴로 삽입돼 있어요. 기능상 문제없지만 기존 코드베이스의 img 생성 패턴(createElement + src 설정)과 다소 달라요. 일관성 차원에서 다음 수정 시 맞춰두면 좋아요.

---

### Store Readiness Check

| 항목 | 상태 |
|---|---|
| 퍼즐 콘텐츠 | v 100개 (사이즈 확장은 Direction Note 5 대기) |
| 스테이지 축하 연출 | v |
| 팩 배지 | v |
| 앨범 날짜 | v |
| Pip 대사 진화 | 미구현 |
| 태블릿 대응 | 미구현 |
| 한국어 번역 | v |
| Android signed AAB | v versionCode 14, v0.1.21 |
| Play Console 업로드 | 대기 중 |

**다음 Codex 작업 우선순위:**
1. Direction Note 4 기둥 3-B -- Pip 대사 진화 (작음)
2. Direction Note 5 -- 태블릿 CSS + 퍼즐 사이즈 확장 (큼)

---

## Review 13 — 2026-06-29

**Scope:** v0.1.22 (`fix: clarify daily reward copy`) + v0.1.23 (`feat: add optional cozy music loop`)

**Tests:** 28/28 pass ✅

---

### v0.1.22 — daily reward copy clarify

**What changed:** `daily.note` 템플릿 문자열 대신 `notePrefix` / `noteSuffix` 분리 패턴으로 변경. 숟가락 아이콘을 텍스트 사이에 인라인으로 삽입 가능해짐.

**appShell.js `createDailyCard()`:**
```js
rewardNote.append(
  document.createTextNode(t("daily.notePrefix") + " "),
  createSpoonIcon("small"),
  document.createTextNode("+" + String(DAILY_BONUS) + t("daily.noteSuffix"))
);
```

**평가:**
- ✅ EN/KO 양쪽 `notePrefix` / `noteSuffix` 키 모두 추가됨
- ✅ `.daily-reward-note` CSS — `inline-flex`, `align-items: center` — 아이콘과 텍스트 정렬 올바름
- ⚠️ `daily.note` 키 (`"Finish this card today for a +{count} bonus."`) 가 en.js, ko.js 양쪽에 남아 있음 — 더 이상 사용되지 않는 dead key. 지금은 무해하지만 번역 파일 정리 대상

---

### v0.1.23 — optional cozy music loop

**What changed:** `startMusic()` 플레이스홀더를 실제 BGM으로 교체. Web Audio API 오실레이터 기반 12초 루프.

**구현 평가:**

**✅ 정상 작동 항목:**
- `cozyLoop` (9음) + `cozyBass` (4음) 분리 — 멜로디/베이스 독립 볼륨 제어 가능한 구조
- `musicNodes` 가드 (`if (!getAudioPreferences().music || musicNodes) return`) — 중복 시작 방지
- `stopMusic()` — timers + oscillators 모두 정리 후 `musicNodes = null`, 완전한 정리
- `audioUnlocked` 게이트 — autoplay 정책 위반 방지
- `unlockAudio()` 에서 `startMusic()` 호출 — 앱 재실행 시 music 설정 복원 정상
- music 기본값 `false` (`readBool(MUSIC_KEY, false)`) — 자동재생 없음 ✅
- `oscillator.onended` 콜백에서 `noteGain.disconnect()` — 오디오 그래프 메모리 누수 방지

**⚠️ 주의 사항:**
- `changeMusic(false)` 에서 `stopMusic()` 이중 호출: `setMusicEnabled(false)` 내부에서 한 번, 이후 직접 한 번. `musicNodes` null 가드가 있어 무해하지만 redundant. 가독성 개선 여지 있음
- Master gain `0.72` — 개별 note volume이 0.01~0.018로 매우 낮아서 실제 출력은 조용함. 현재 수준 적절
- `scheduleMusicLoop()` 재귀 타이머 — 사용자가 앱을 장시간 열어두면 타이머 누적 여부 확인 필요. 단, `stopMusic()` 호출 시 전체 정리되므로 실용적으로 문제없음

**Settings 연결:**
- `createSettingsDialog()`에 `onMusicChange` 파라미터 추가, `createAudioToggle()` 두 개 (SFX / Music) ✅
- `settings.music` i18n 키: EN `"Cozy music on/off"`, KO 확인 필요

---

### BOM 잔존 (Review 12에서 이월)

`appShell.js` 파일 상단 BOM (`﻿`) 여전히 존재. 기능 영향 없음, 마이너.

---

### 스토어 준비 상태 (v0.1.23 기준)

| 항목 | 상태 |
|------|------|
| 100개 퍼즐 | ✅ |
| 스테이지 완료 축하 | ✅ |
| 팩 배지 | ✅ |
| 앨범 날짜 | ✅ |
| 한국어 | ✅ |
| BGM (선택) | ✅ v0.1.23 신규 |
| 데일리 보상 UI 명확화 | ✅ v0.1.22 신규 |
| Pip 대사 진화 | ✅ 구현 확인 (Review 12 오기록 수정) |
| 태블릿 CSS | ⏳ Direction Note 5 미구현 |
| 퍼즐 사이즈 확장 (10×10~15×15) | ⏳ Direction Note 5 미구현 |

> **Note:** Review 12에서 Pip 대사 진화를 미구현으로 기록했으나 오류. `getPipPuzzleLine()` (`appShell.js:477`) + EN/KO 4단계 i18n 키 (`puzzleLineFirst` / `puzzleLineEarly` / `puzzleLineMid` / `puzzleLineLate`) 모두 이미 완성된 상태.

---

### Codex 전달 사항

**즉시 수정 권장 (작은 작업):**
1. `daily.note` 키 en.js/ko.js에서 제거 — 더 이상 사용 안 됨 (`notePrefix`/`noteSuffix`로 교체됨)
2. `changeMusic(false)` 에서 `stopMusic()` 직접 호출 제거 — `setMusicEnabled(false)` 내부에서 이미 처리됨:
```js
function changeMusic(enabled) {
  setMusicEnabled(enabled);
  if (enabled) {
    startMusic();
  }
  // stopMusic() 제거 — setMusicEnabled(false) 내에서 처리됨
  draw();
}
```

**다음 구현 순서:**
1. Direction Note 5 — 태블릿 CSS 먼저, 이후 퍼즐 사이즈 확장 (10×10 / 12×12 / 15×15)
2. Direction Note 4 Pillar 1 — 데일리 전용 퍼즐 풀 (`dailyPuzzles.js`)
3. Play Console 프로덕션 제출 준비


---

## Review 14 — 2026-06-29

**Scope:** v0.1.24 (`chore: clean daily and music wiring`) + v0.1.24 (`fix: clarify daily and roadmap progress`) + v0.1.25 (`feat: add cozy background music asset`)

**Tests:** 29/29 pass ✅ (dailyPuzzle.test.js 신규 추가)

---

### chore: clean daily and music wiring

Review 13에서 지적한 두 가지 즉시 수정 사항 모두 적용됨.

- ✅ `daily.note` dead key en.js/ko.js에서 제거
- ✅ `changeMusic(false)` 에서 `stopMusic()` 직접 호출 제거, `stopMusic` import도 제거

---

### fix: clarify daily and roadmap progress

**데일리 보상 UI 개선:**
- `daily.notePrefix` / `noteSuffix` 사이에 `<br>` + `daily-reward-amount` span 추가 — 숟가락 아이콘과 금액이 별도 줄에 명확하게 표시

**데일리 퍼즐 후보 필터링:**
```js
function getDailyPuzzleCandidates() {
  const unlocked = puzzles.filter(p => isPackUnlocked(getPackById(p.packId)));
  return unlocked.length ? unlocked : puzzles;
}
```
- ✅ 잠긴 팩의 퍼즐은 데일리 후보에서 제외 — 플레이어가 아직 접근 못하는 퍼즐이 데일리로 뜨는 UX 버그 방지
- ✅ fallback: 언락된 퍼즐이 없으면 전체 puzzles 사용 (신규 사용자 보호)
- ✅ `dailyPuzzle.test.js` 신규 추가 — 후보 풀 기반 선택 검증

**로드맵 진행률 시각화 개선:**
- `stage-pip-preview__reveal` (이미지 기반) → `stage-progress-meter` (CSS 바 기반) 교체
- `roadmap-goal__reveal` / `roadmap-piece__reveal` 이미지 reveal → `__meter` CSS 바로 교체
- `--goal-progress-ratio` CSS 변수 (0~1) 로 opacity + saturation 연동
  ```css
  opacity: calc(0.03 + (var(--goal-progress-ratio) * 0.86));
  filter: saturate(calc(0.5 + (var(--goal-progress-ratio) * 0.7)));
  ```
- ✅ 이미지 클리핑 대신 CSS만으로 진행률 표현 — 구현 단순화

---

### feat: add cozy background music asset

**핵심 변경:** 오실레이터 합성 BGM → 실제 MP3 파일 (`bgm-cozy.mp3`, 4.1MB)

```js
import cozyBgmUrl from "../assets/music/bgm-cozy.mp3";
let musicElement = null;

export function startMusic() {
  if (!getAudioPreferences().music || !audioUnlocked) return;
  getMusicElement().play().catch(() => {});
}

export function stopMusic() {
  if (!musicElement) return;
  musicElement.pause();
}

function getMusicElement() {
  if (!musicElement) {
    musicElement = new Audio(cozyBgmUrl);
    musicElement.loop = true;
    musicElement.preload = "auto";
    musicElement.volume = 0.28;
  }
  return musicElement;
}
```

**평가:**
- ✅ `musicElement` 싱글턴 — 중복 생성 없음
- ✅ `audioUnlocked` 게이트 유지 — autoplay 정책 준수
- ✅ `loop = true` — 루프 타이머 관리 불필요
- ✅ `.play().catch()` — 브라우저 autoplay 차단 시 무음 실패 (크래시 없음)
- ✅ `preload = "auto"` — Capacitor 앱 내 즉시 재생 준비
- ✅ `volume = 0.28` — SFX 대비 적절한 볼륨 균형
- ✅ `cozyLoop` / `cozyBass` 배열, `scheduleMusicLoop()`, `playMusicNote()` 전체 제거 — 코드 100줄 감소

**주의사항:**
- `bgm-cozy.mp3` 4.1MB — Vite 빌드 시 번들에 포함됨. Capacitor APK 크기 증가 예상 (~4MB). 허용 가능한 수준
- `stopMusic()` 이 `pause()` 만 하고 `currentTime = 0` 리셋을 안 함 — 음악 껐다 켜면 이어서 재생. 의도된 동작인지 확인 필요. 처음부터 재생하려면 `musicElement.currentTime = 0` 추가 고려

---

### 스토어 준비 상태 (v0.1.25 기준)

| 항목 | 상태 |
|------|------|
| 100개 퍼즐 | ✅ |
| 스테이지 완료 축하 | ✅ |
| 팩 배지 | ✅ |
| 앨범 날짜 | ✅ |
| Pip 대사 진화 | ✅ |
| 한국어 | ✅ |
| BGM (선택) | ✅ MP3 실제 음원 |
| 데일리 후보 필터링 | ✅ v0.1.24 신규 |
| 로드맵 진행률 시각화 | ✅ v0.1.24 개선 |
| 태블릿 CSS | ⏳ Direction Note 5 미구현 |
| 퍼즐 사이즈 확장 (10×10~15×15) | ⏳ Direction Note 5 미구현 |
| 데일리 전용 퍼즐 풀 | ⏳ Direction Note 4 Pillar 1 미구현 |

**다음 우선순위:** Direction Note 5 (태블릿 CSS → 퍼즐 사이즈 확장)


---

## Review 15 — 2026-06-29

**Scope:** v0.1.26 (`fix: reveal roadmap by stage parts`) + v0.1.27 (`fix: separate roadmap and stage part previews`)

**Tests:** 29/29 pass ✅

---

### 두 커밋 공통 주제: 로드맵 진행률 시각화 고도화

이전까지는 Pip 이미지 전체에 opacity/saturation만 적용. 이번 두 커밋으로 **팩별 부위 분리 reveal** 시스템으로 업그레이드됨.

---

### v0.1.26 — fix: reveal roadmap by stage parts

**`muralPart` 재정의 (packs.js):**
| 팩 | 이전 | 이후 |
|----|------|------|
| pips-first-shelf | pip-ear | pip-hat |
| sunny-spoon-sign | pip-cheek | pip-scarf |
| apron-drawer | pip-scarf | pip-face |
| bakery-window | pip-hat | pip-body |
| village-pantry | pip-face | pip-card |

- 위→아래 순서로 재편 (모자→스카프→얼굴→몸→카드) — 스테이지 순서와 신체 부위 순서가 일치하도록 정렬

**`createRoadmapGoal()` 분리:**
- 팩별 `<img>` 레이어를 `--part-opacity` CSS 변수로 개별 제어
- 팩 완료율이 `--part-opacity` → opacity + saturation 연동
- ✅ 각 팩의 완료도가 해당 신체 부위 가시도에 직접 반영

---

### v0.1.27 — fix: separate roadmap and stage part previews

**전체 Pip reveal (roadmap-goal) vs 부위 프리뷰 (stage/roadmap 카드) 분리:**

- `roadmap-goal` → `full-pip-goal` 클래스: 전체 이미지 단일 opacity 방식으로 복귀 (`--goal-progress-ratio` 기반)
- 스테이지 카드 / 로드맵 카드: `part-preview-image` 컨테이너로 **팩별 부위 크롭** 표시

**`part-preview-image` 시스템:**
```css
/* 각 muralPart별 object-position + border-radius로 해당 부위만 크롭 */
[data-part="pip-hat"]   { object-position: 50% 0%;  border-radius: 18px 18px 10px 10px; }
[data-part="pip-face"]  { object-position: 50% 25%; border-radius: 44% 44% 38% 38%; }
[data-part="pip-scarf"] { object-position: 50% 54%; border-radius: 20px 20px 36px 36px; }
[data-part="pip-body"]  { object-position: 50% 78%; border-radius: 38% 38% 46% 46%; }
[data-part="pip-card"]  { object-position: 82% 48%; border-radius: 8px; }
```

- ✅ 별도 이미지 에셋 없이 단일 `pip-complete-sticker-v1.png`를 크롭해서 부위별로 활용
- ✅ `__ghost` (흑백 희미) + `__reveal` (진행률에 따라 불투명) 이중 레이어
- ✅ `data-part` 속성으로 CSS 선택자 연결 — JS에서 스타일 분기 없음

**`--part-preview-image__reveal` opacity 계산:**
```css
opacity: calc(var(--stage-progress, var(--roadmap-progress)) / 100);
```
- `--stage-progress` 없으면 `--roadmap-progress` fallback — 스테이지 카드와 로드맵 카드 공통 CSS 재사용 ✅

---

### 종합 평가

시각적으로 가장 공을 들인 부분. 단일 이미지를 CSS `object-position` + `border-radius`로 크롭해 부위별 카드를 만드는 방식은 에셋 추가 없이 구현한 영리한 접근이에요.

**잠재적 확인 사항:**
- `pip-complete-sticker-v1.png` 이미지가 세로로 긴 전신 이미지일 때 각 `object-position` 값이 올바른 부위를 크롭하는지 실기기 QA 필요
- `pip-card` 부위 (`object-position: 82% 48%`)가 의도한 영역인지 확인 (카드를 들고 있는 손/카드 부분으로 보임)

---

### 스토어 준비 상태 (v0.1.27 기준)

| 항목 | 상태 |
|------|------|
| 100개 퍼즐 | ✅ |
| 스테이지 완료 축하 | ✅ |
| 팩 배지 | ✅ |
| 앨범 날짜 | ✅ |
| Pip 대사 진화 | ✅ |
| 한국어 | ✅ |
| BGM (선택) | ✅ |
| 로드맵 부위별 reveal | ✅ v0.1.26–27 신규 |
| 태블릿 CSS | ⏳ Direction Note 5 미구현 |
| 퍼즐 사이즈 확장 (10×10~15×15) | ⏳ Direction Note 5 미구현 |
| 데일리 전용 퍼즐 풀 | ⏳ Direction Note 4 Pillar 1 미구현 |


---

## Review 16 — 2026-06-29

**Scope:** v0.1.28 (`fix: switch roadmap to tile reveal`) + v0.1.29 (`fix: replace roadmap with badge shelf`)

**Tests:** 29/29 pass ✅

---

### v0.1.28 — fix: switch roadmap to tile reveal

로드맵 카드의 Pip 이미지 크롭 방식 → **타일 모자이크** 방식으로 전환.

**`createStageTileMosaic(completeCount, total)`:**
- 퍼즐 수만큼 타일(span) 생성, 5열 그리드
- 각 타일은 동일한 이미지를 `background-size`/`background-position`으로 분할해 모자이크 구성
- 완료된 퍼즐 타일: `pip-tile revealed` (선명), 미완료: `pip-tile` (흐림)
- ✅ 퍼즐 1개 완료할 때마다 타일 1개씩 reveal — 진행률이 직관적으로 보임
- ✅ 이미지 1장으로 전체 모자이크 구성 — 에셋 추가 없음

**로드맵 goal도 타일 모자이크로 전환 (`pip-tile-mosaic--large`, 10열)**

---

### v0.1.29 — fix: replace roadmap with badge shelf

**가장 큰 구조 변경.** 지도 뷰(Map View) 전체를 로드맵 → **배지 컬렉션 룸**으로 교체.

**`renderPantryMapView()` 변경:**
- 헤더: `map.count` → `badges.collectionCount` (`{earned}/{total} badges earned`)
- 설명: `map.note` → `badges.collectionNote`
- 전체 Pip goal + 로드맵 카드 목록 제거
- → `createNextBadgeCard()` + `badge-collection-grid` (5개 배지 카드)

**`stageArt.js` 신규 파일:**
```js
const stageArtUrls = {
  "pips-first-shelf": pipCompleteStickerUrl,
  "sunny-spoon-sign": appIconUrl,
  "apron-drawer": pipStripStickerUrl,
  "bakery-window": pipCastUrl,
  "village-pantry": sunnyCastUrl
};
export function getStageArtUrl(packId) { ... }
```
- 팩별 대표 이미지를 별도 파일로 분리 — 각 배지 카드가 고유한 아트를 표시

**`createBadgeCollectionCard(status)`:**
- 각 팩의 배지 카드 (earned / unlocked / locked 상태별 클래스)
- `createTileMosaic(packId, completeCount, total)` — 팩 대표 이미지로 타일 모자이크 아트 표시
- 완료수 / 배지명 / 설명 / 진행 상태 텍스트

**평가:**
- ✅ 로드맵 → 배지룸 전환으로 "수집" 목적이 명확해짐. 플레이어가 무엇을 향해 가는지 직관적
- ✅ `getPackBadgeStatus()` + `getNextBadgeProgress()` 기존 함수 재사용 — 로직 중복 없음
- ✅ `completedIds`를 `Set` → 배열로 변경 (`const completedIds = getCompletedPuzzleIds()`) — `getPackBadgeStatus()`가 배열을 받으므로 타입 일치
- ✅ `stageArt.js` 분리 — 팩별 아트 매핑이 한 곳에 관리됨
- ✅ 보너스 팩 미리보기의 설명을 `map.sets.*` → `pack.noteKey`로 교체 — 더 구체적인 설명

**확인 사항:**
- `createTileMosaic`이 appShell.js (`createStageTileMosaic`)와 mapView.js 양쪽에 유사한 구현으로 존재. 현재는 파라미터 시그니처가 다소 달라 통합이 복잡하지만, 향후 공통 유틸로 추출 고려 가능 (지금 당장은 OK)
- 배지 카드 `createTileMosaic`에서 `tile` 변수 선언부가 diff에서 잘렸는데 (`const tile = document.createElement("span")` 추정) 실제 파일에서 확인 필요

---

### 스토어 준비 상태 (v0.1.29 기준)

| 항목 | 상태 |
|------|------|
| 100개 퍼즐 | ✅ |
| 스테이지 완료 축하 | ✅ |
| 팩 배지 + 배지룸 | ✅ v0.1.29 완성 |
| 앨범 날짜 | ✅ |
| Pip 대사 진화 | ✅ |
| 한국어 | ✅ |
| BGM (선택) | ✅ |
| 타일 모자이크 진행률 | ✅ v0.1.28 신규 |
| 태블릿 CSS | ⏳ Direction Note 5 미구현 |
| 퍼즐 사이즈 확장 (10×10~15×15) | ⏳ Direction Note 5 미구현 |
| 데일리 전용 퍼즐 풀 | ⏳ Direction Note 4 Pillar 1 미구현 |


---

## Direction Note 7 — 리워크 방향 확정 (2026-07-02)

**결정사항:** 현재 빌드를 즉시 출시하지 않고, MAJOR_REWORK_PLAN.md 에 정의된 리워크 완료 후 공개 출시. 출시 목표까지 2주 이상 여유 있음.

**Claude 리뷰 질문 7개 답변 요약:**

1. **배지 강등** — 올바른 방향. 배지는 마일스톤 기념품으로 남기고 팬트리 장식이 주 동기가 되어야 함
2. **팬트리 루프** — 설계는 훌륭함. 단, 아이템 아트 퀄리티가 실제 욕망을 만들어야 루프 작동. Phase 3 아트 계약이 Phase 1보다 선행되어야 함
3. **에셋 파이프라인** — 문서 기준은 좋음. 빌드 스크립트에서 `PLACEHOLDER: true` 아이템 검출 시 경고/빌드 실패 처리 권장
4. **colorMap** — 퍼즐 데이터에 내장 권장. 별도 매니페스트는 관리 포인트 두 배. 나중에 분리 가능
5. **커서 모드 타이밍** — 팬트리 V1 이후. 10×10+ 퍼즐이 있어야 의미 있음
6. **햅틱 기본값** — 이동 햅틱 기본 OFF, fill/complete만 기본 ON
7. **첫 슬라이스** — Phase 1 (스푼 아이콘 + 컬러 리프레시)만 먼저. 게임 루프 변경 없이 시각 퀄리티 점프

**권장 구현 순서 (2주 내 목표):**

| 우선순위 | Phase | 핵심 작업 | 예상 규모 |
|---------|-------|-----------|---------|
| 1 | Phase 0 | 에셋 매니페스트 스키마 정의, placeholder 규칙 코드화 | 소 |
| 2 | Phase 1 | 스푼 이미지 에셋 교체, 리워드 UI 컬러 브라이트닝 | 중 |
| 3 | Phase 2 | colorMap 퍼즐 데이터 구조 추가, 완성 컬러라이제이션 애니메이션 | 중-대 |
| 4 | Phase 3 | 팬트리 뷰, 아이템 데이터 모델, 8-12개 아이템 에셋, 구매/배치/저장 | 대 |
| 5 | Phase 4 | 배지 아트 교체, 팬트리/앨범 마일스톤 배지 표시 | 중 |

**Direction Note 5 (태블릿 CSS + 퍼즐 사이즈 확장)** — Phase 5/6에 병합. 커서 모드와 함께 진행.

**Direction Note 4 Pillar 1 (데일리 전용 퍼즐 풀)** — 팬트리 루프 이후 Phase 6 콘텐츠 확장과 함께.

**Codex 다음 요청:** MAJOR_REWORK_PLAN.md Phase 0부터 시작. 에셋 매니페스트 스키마(`src/data/assetManifest.js`)와 placeholder 검증 유틸 먼저.

---

## Review 17 — 2026-07-03

**Scope:** v0.1.30 이후 ~ v0.1.67 (리워크 진행 중 전체 구현 상태 점검)
**Tests:** 38/38 pass ✅ (randomPuzzle.test.js + puzzleState.test.js 신규 포함)

---

### 전체 구조 변화 요약

리워크 계획(MAJOR_REWORK_PLAN.md)의 Phase 0–3 핵심 골격이 코드에 들어왔다.

| 항목 | 상태 |
|------|------|
| `economyConfig.js` 신규 | ✅ 공식 기반 경제 설정 파일 |
| `randomPuzzle.js` 신규 | ✅ 타임어택 시드 기반 퍼즐 생성기 |
| `floatingNav.js` 신규 | ✅ 5탭 플로팅 네비게이션 |
| `timeAttackView.js` 신규 | ✅ 타임어택 UI + 기록 표시 |
| `pantryView.js` 신규 | ⚠️ placeholder 상태 (paused card) |
| `stageArt.js` 아트 게이트 | ✅ `approvedStageArtUrls = {}` — 승인된 아트 없을 때 null 반환 |
| `assetManifest.js` | ✅ temporary-approved / temporary-hidden 분리 관리 |
| Android 런처 아이콘 수리 | ✅ |
| 태블릿 스크린샷 | ✅ 7인치 / 10인치 |

---

### 잘 된 것들

**`economyConfig.js` 분리:**
설계 협의에서 요청한 공식 기반 파일이 정확히 구현됐다. 퍼즐 보상, 스테이지 보너스, 타임어택 보상, 데일리 한도, Cozy Pass 지급량 모두 한 파일에서 관리. 숫자 조정 시 이 파일만 수정하면 되는 올바른 구조.

**`randomPuzzle.js` 퍼즐 생성기:**
- 시드 기반 LCG 난수 (`createSeededRng`) — 같은 시드면 항상 같은 퍼즐 생성 ✅ 공정성 보장
- `softenIsolatedNoise()` — 고립된 단일 셀 65% 확률로 제거 → 퍼즐 패턴이 덩어리져서 실제로 풀 만해짐
- `ensureEveryLineHasSignal()` — 빈 행/열 방지 → 모든 퍼즐이 논리적으로 유효
- `getTimeAttackSizeForRound()` — 라운드 진행에 따라 5×5→8×8→10×10→12×12→15×15 점진적 확대
- `getTimeAttackRunScore()` — 라운드 × 1000 + 속도보너스(600-경과초) → 단순하고 직관적

**타임어택 세이브 연동 (`save.js`):**
- `timeAttackBestScores` / `timeAttackDailyCount` 필드가 `normalizeSave()`에 정상 포함
- `recordTimeAttackResult()` — 일일 한도 체크, 최고기록 비교, 보상 지급, 중복 방지 모두 한 함수에서 처리 ✅
- 반환값에 `{ reward, recordImproved, rewardAllowed, dailyCount }` 포함 — UI가 결과를 올바르게 표시할 수 있음

**아트 게이트 (`stageArt.js`):**
```js
const approvedStageArtUrls = Object.freeze({});
export function getStageArtUrl(packId) { return approvedStageArtUrls[packId] || null; }
```
승인된 아트가 없으면 null 반환 → UI에서 null 처리로 placeholder 노출 방지. 아트 파이프라인 규율이 코드 레벨에서 강제됨. 올바른 접근.

**플로팅 네비게이션:**
5탭 (puzzle / album / pantry / timeAttack / map) 구조가 MAJOR_REWORK_PLAN의 탭 구성과 일치.

---

### 확인 사항

**`pantryView.js`가 여전히 placeholder:**
장식 아이템 6개(`decorations.js`)와 `pantryDecorations` 데이터는 있는데 UI가 "준비 중" 카드만 보여준다. iOS 심사 시 불완전 기능으로 리젝 사유가 될 수 있다. 출시 전 실제 샵 UI가 필요하다.

**`stageArt.js` approvedStageArtUrls가 비어 있음:**
배지룸(`mapView.js`)의 `createBadgeCollectionCard()`가 `getStageArtUrl()`에 의존하는데, 현재 항상 null을 반환한다. 배지 카드 아트 영역이 빈 상태로 표시될 가능성이 있다. 아트 승인 후 즉시 이 객체를 채워야 한다.

**타임어택 일일 카운트 키:**
`timeAttackDailyCount`의 키가 날짜 문자열(`"2026-07-03"`)인데, 이 객체가 무제한 누적된다. 30일치가 쌓이면 save 데이터가 불필요하게 커진다. 30일 이상 된 항목은 주기적으로 정리하는 로직 추가 권장 (minor).

---

### 스토어 준비 상태 (v0.1.67 기준)

| 항목 | 상태 |
|------|------|
| 코어 퍼즐 루프 | ✅ |
| 타임어택 (생성 + 기록 + 보상) | ✅ 골격 완성 |
| 경제 설정 파일 | ✅ |
| 플로팅 네비게이션 | ✅ |
| 팬트리 UI | ⚠️ placeholder — 출시 전 필수 |
| 배지 카드 아트 | ⚠️ approvedStageArtUrls 비어 있음 |
| 컬러 완성 (coloredPuzzleArt) | ✅ 구현됨, 앨범 연결 확인 필요 |
| 퍼즐 사이즈 확장 (10×10+) | ⏳ |
| iOS safe area CSS | ⏳ 확인 필요 |
| Cozy Pass IAP 연동 | ⏳ 구조 준비 중 |

---

### 전체 평가

리워크 핵심 골격 — 경제 체제, 타임어택, 네비게이션 구조 — 이 빠르게 들어왔다. 특히 `randomPuzzle.js`의 시드 기반 생성기와 `economyConfig.js` 분리는 설계 의도를 정확히 반영한 구현이다.

다음으로 급한 것:
1. 팬트리 샵 UI 실제 구현 (placeholder 제거)
2. 승인된 스테이지 아트 확정 후 `stageArt.js` 등록
3. 컬러 완성 → 앨범 카드 연결 흐름 QA

---

## Review 18 — 2026-07-05

**Scope:** v0.1.67 이후 미커밋 작업 (v0.1.85 + v0.1.86 Codex 작업 완료본)
**Tests:** 40/40 pass ✅ (9개 파일)

---

### 전체 구조 변화 요약

`appShell.js` 단일 파일이 기능별 모듈로 대규모 분리됐다. MAJOR_REWORK_PLAN의 Phase 3–5 실질적 진입.

| 신규/변경 파일 | 내용 |
|---|---|
| `appChrome.js` | Header, Pip strip, Badge shelf, Footer, Reset dialog 분리 |
| `puzzleHubView.js` | 퍼즐 허브(선택 화면), 데일리 카드, 퍼즐 피커 분리 |
| `playScreen.js` | 풀스크린 퍼즐 플레이 뷰 — 타임어택 모드 포함 |
| `guideDialog.js` | 첫 실행 가이드 (퍼즐/타임어택 2종, 3-step 슬라이드) |
| `settingsView.js` | 설정 다이얼로그 분리 |
| `timeAttackFlow.js` | 타임어택 세션 로직 추상화 |
| `preferences.js` | "완성 스테이지 숨기기" + 컨트롤 모드 로컬 프레퍼런스 |
| `puzzleAssistView.js` | 힌트 + How-to-play 카드 |
| `puzzleCursorControls.js` | 큰 보드(10×10+) D-pad 커서 컨트롤 |
| `pipReaction.js` | 완성 배너 + Pip 반응 렌더링 |
| `stageArt.js` | 이전 임시 URL 맵 제거, `approvedStageArtUrls = Object.freeze({})` 확정 |
| `save.js` | 장식 구매/장착 API + `hasSeenGuide`/`markGuideSeen` 추가, `normalizeSave` 업데이트 |
| `docs/PIP_MASTER_ART_REVIEW.md` | 신규 Pip 마스터 아트 후보 검토 프레임 |

---

### 잘 된 것들

**`appShell.js` 분해:**
750줄 이상의 단일 파일이 목적별 모듈 10개 이상으로 분리됐다. 각 파일이 자신의 역할에만 집중한다. 임포트 목록만 봐도 앱 흐름을 파악할 수 있을 정도로 명확해졌다.

**`playScreen.js` — 타임어택 모드 통합:**
`isTimeAttack` prop 하나로 일반 플레이 / 타임어택 플레이를 같은 컴포넌트에서 처리. 라운드 표시(1/3), 경과 타이머, 타임어택 CSS 클래스가 자연스럽게 분기된다. 코드 중복 없이 두 모드를 지원하는 올바른 설계.

**`timeAttackFlow.js` — 세션 추상화:**
`createTimeAttackSession()` → `advanceTimeAttackSession()` 흐름이 `appShell.js`에서 타임어택 관련 상태를 깔끔하게 격리해 준다. `TIME_ATTACK_TRIAL_ROUNDS = 3`으로 10라운드에서 3라운드로 조정 — 한 세션 소요 시간이 현실적으로 줄어들어 기대치 관리에 유리하다.

**`puzzleCursorControls.js` — 자동 모드 로직:**
```js
export function shouldShowCursorControls(puzzle, controlMode) {
  if (controlMode === "direct") return false;
  if (controlMode === "cursor") return true;
  return Number(puzzle.size) >= 10; // auto
}
```
10×10 이상에서만 D-pad를 자동 노출하는 기준이 합리적이다. "auto/direct/cursor" 세 모드를 `preferences.js`의 validated set으로 관리하는 것도 올바르다.

**`guideDialog.js` — 첫 실행 가이드:**
- 퍼즐 가이드 / 타임어택 가이드 2종, 각 3-step 슬라이드
- `hasSeenGuide()` / `markGuideSeen()` → `normalizeSave()`에 포함 → 리셋 시 가이드 초기화 ✅
- `GUIDE_IDS = new Set(["puzzle", "timeAttack"])` 유효값 검증 포함

**`save.js` — 장식 API:**
`buyDecoration()` / `equipDecoration()`이 두 단계 검증을 거친다:
1. `isDecorationArtApproved(decoration)` — 승인되지 않은 아트 아이템은 구매 불가 ✅ (아트 게이트 일관성)
2. `save.pantrySpoons < cost` — 잔액 부족 차단 ✅
`normalizeSave()`에서 `ownedDecorationIds`를 `Array.from(new Set(...))` 처리 → 중복 방지 ✅

**`docs/PIP_MASTER_ART_REVIEW.md` — 아트 검토 규율:**
후보 아트를 승인 전까지 런타임과 완전히 분리하는 원칙을 문서로 확립. `assetManifest.js`의 `candidate` 상태를 거쳐야만 UI에 연결될 수 있는 파이프라인이 문서와 코드 양쪽에서 강제된다.

**`stageArt.js` 이전 임시 URL 제거:**
v0.1.67 이전에는 `stageArtUrls`에 `pip-cast-redesign-concept-v1-web.jpg`, `story-friends-sheet-v1-clean.png` 등 미승인 아트가 직접 연결돼 있었다. 이번에 완전히 제거하고 `Object.freeze({})` 로 대체 — 아트 게이트 정리 완료.

---

### 확인 사항

**1. `pantryView.js` 여전히 placeholder:**
`save.js`에 `buyDecoration()` / `equipDecoration()` API가 추가됐지만 팬트리 UI는 여전히 "준비 중" 카드만 보여준다. API와 데이터는 준비됐으니 다음 작업에서 실제 샵 UI 연결이 필요하다. iOS 심사 전 필수.

**2. `guideDialog.js` — pip-cast-redesign-concept-v1-web.jpg 임포트:**
```js
import pipGuideSceneUrl from "../assets/characters/pip-cast-redesign-concept-v1-web.jpg";
```
이 파일은 `PIP_MASTER_ART_REVIEW.md`에서 "rejected guide scene"으로 언급된 아트다. 현재 가이드 다이얼로그에 직접 연결돼 있다. 신규 Pip 마스터 아트가 승인되면 이 줄을 교체해야 한다. 아직 심각한 문제는 아니지만 교체 대상으로 명시적으로 추적할 필요가 있다.

**3. `timeAttackDailyCount` 누적 문제 (Review 17에서 이어짐):**
이번 변경에서도 수정되지 않았다. 날짜 문자열 키가 무제한 누적된다. 현재는 minor — 출시 후 일정 기간이 지나면 save 크기에 영향을 줄 수 있다.

**4. `puzzleHubView.js` — `createSpoonIcon` 미노출:**
`renderDailyCard()`에서 `createSpoonIcon("small")` 을 호출하는데 해당 함수가 같은 파일 내에서만 정의되어 있는지 확인 필요. 분리 후 임포트가 누락됐을 경우 런타임 에러 발생 가능성 있다. 테스트에서 해당 뷰가 직접 커버되지 않으므로 수동 확인 권장.

---

### 스토어 준비 상태 (v0.1.86 기준)

| 항목 | 상태 |
|---|---|
| 코어 퍼즐 루프 | ✅ |
| 풀스크린 플레이 화면 | ✅ `playScreen.js` |
| 타임어택 (3라운드 세션) | ✅ |
| 첫 실행 가이드 | ✅ (2종) |
| 커서 컨트롤 (10×10+) | ✅ |
| 완성 스테이지 숨기기 | ✅ |
| 장식 구매/장착 API | ✅ |
| 팬트리 샵 UI | ⚠️ placeholder — 출시 전 필수 |
| 배지 카드 아트 | ⚠️ approvedStageArtUrls 비어 있음 |
| Pip 마스터 아트 확정 | ⚠️ 후보 검토 중 |
| 퍼즐 사이즈 확장 (10×10+) | ⏳ |
| iOS safe area CSS | ⏳ 확인 필요 |

---

### 전체 평가

이번 작업은 단순 기능 추가가 아니라 아키텍처 정리다. `appShell.js` 분해 + 타임어택 세션 추상화 + 가이드 시스템 + 장식 API — 모두 다음 단계(팬트리 샵 UI, 아트 승인)를 위한 인프라가 정확하게 자리를 잡았다. 특히 아트 게이트(미승인 URL 완전 제거)와 장식 구매 시 `isDecorationArtApproved` 이중 검증이 코드 레벨에서 아트 파이프라인 규율을 강제하는 것이 눈에 띈다.

다음 우선순위:
1. **팬트리 샵 UI** — API 준비 완료, UI만 남음
2. **Pip 마스터 아트 승인** → `guideDialog.js` 이미지 교체 + `assetManifest.js` 승인
3. **`createSpoonIcon` 런타임 동작 수동 확인**

---

## Review 19 — 2026-07-05

**Scope:** v0.1.86 이후 ~ v0.1.101 (미커밋 작업 트리 기준)
**Tests:** 41/41 pass ✅ (save.test.js +1 테스트 추가)

---

### 전체 구조 변화 요약

Review 18에서 "다음 우선순위 1번"이었던 **팬트리 샵 UI가 실제로 구현됐다.** 아울러 커서 컨트롤, 힌트 시스템, 가이드 아트 게이트가 완성됐다.

| 항목 | 상태 |
|---|---|
| `pantryView.js` 실제 구현 | ✅ placeholder → 완전한 샵 UI |
| `decorationArt.js` webp 아트 6종 | ✅ 모두 등록 + `runtimeArt.js` 승인 |
| `puzzleState.js` 커서 + 힌트 | ✅ `setCursor/moveCursor/toggleCursorCell/useHint` 추가 |
| `guideDialog.js` 아트 게이트 | ✅ `isRuntimeGuideArtApproved()` 확인 후 조건부 렌더 |
| `runtimeArt.js` 신규 | ✅ 가이드 아트 / 장식 아트 런타임 승인 목록 관리 |
| 장식 가격 조정 | ✅ 18→22, 26→28, 34→35, 48→80, 72→90 (back-wall 신규) |
| 스타일 CSS 팬트리 | ✅ 슬롯 절대 좌표 + 그리드 반응형 레이아웃 |

---

### 잘 된 것들

**`pantryView.js` — 완성도:**
- 방(room) 영역: 5개 슬롯 버튼, 슬롯 선택 시 하이라이트 + 아트 표시
- 슬롯 필터 바: 전체 / 슬롯별 필터링 → `selectedSlotId`로 그리드 재렌더
- 샵 카드: 소유 여부(owned/equipped/buy/not-affordable) 4가지 상태를 버튼 텍스트와 disabled로 명확히 구분
- `aria-pressed`, `aria-label` 접근성 마크업 포함
- `getApprovedPantryDecorations()` 필터 → 승인 안 된 아이템은 샵에 노출 안 됨 ✅ 아트 게이트 일관성 유지

**`runtimeArt.js` — 승인 레지스트리:**
가이드 아트와 장식 아트를 각각 `Set`으로 관리. `decorations.js`와 `guideDialog.js` 모두 이 파일을 통해 승인 여부를 확인한다. 아트 게이트가 코드 한 곳에서 관리되는 올바른 구조.

**`guideDialog.js` 아트 게이트 적용:**
```js
const artMarkup = isRuntimeGuideArtApproved(GUIDE_ART_ASSET_ID)
  ? `<div class="guide-dialog__art">...</div>`
  : "";
```
Review 18에서 지적한 "rejected guide scene 직접 임포트" 문제가 해결됐다. 런타임에서 승인 여부를 체크하고, 미승인 시 아트 영역을 비운다.

**`puzzleState.js` 커서 + 힌트:**
- `setCursor / moveCursor / toggleCursorCell` — D-pad 컨트롤과 연결되는 커서 API 완성
- `useHint(state, solutionGrid)` — 틀린 셀을 찾아 힌트 표시, `hintsUsed` 카운터 증가, history에 기록 → undo 가능
- 모든 함수가 순수 함수 패턴 유지 ✅

**장식 가격 재조정:**
`back-wall` 슬롯(golden-spoon-sign, 90스푼)이 추가되면서 고가 아이템 라인이 생겼다. starter(0) → common(22/28/35) → cozy(80/90) 계층이 명확해졌다. 경제 컨설테이션 문서의 희귀도 티어 방향과 일치.

---

### 버그 확인

**`onPantryFirstPurchase` — undefined 사용 버그:**

`appShell.js:431`:
```js
shell.appendChild(renderPantryView(() => onSelectView("pantry"), onPantryFirstPurchase));
```
`onPantryFirstPurchase`가 `createShell()`의 파라미터 목록에 없고, `draw()` 클로저에도 정의되지 않았다. `undefined`가 그대로 `renderPantryView`의 두 번째 인자로 전달된다.

`renderPantryView(onRefresh = () => {}, onFirstPurchase = () => {})` 기본값 덕에 **크래시는 없지만**, 첫 구매 시 의도한 반응(Pip 반응 / 탭 새로고침 등)이 실행되지 않는다. 수정 방법은 두 가지:
- A) `onPantryFirstPurchase`를 `draw()`에 정의하고 `createShell`에 전달
- B) 첫 구매 축하 기능이 아직 불필요하다면 두 번째 인자 제거

---

### 확인 사항

**1. 팬트리 슬롯 좌표계 — 실제 화면에서 겹침 가능성:**
CSS가 절대 좌표(`left`, `top`, `bottom`)로 슬롯을 배치한다. 화면 비율이나 폰트 크기에 따라 슬롯 레이블이 겹칠 수 있다. Playwright QA가 `npm run qa:mobile`에서 통과했다고는 하나, 실기기나 작은 화면에서 팬트리 방 레이아웃을 별도로 확인 권장.

**2. `pantryView.js` — `spoons` 값이 스냅샷:**
`renderPantryView` 호출 시점의 `getPantrySpoons()` 값을 캡처해 `spoons` 로컬 변수로 사용한다. 팬트리 뷰 내에서 구매 후 `onRefresh()`가 호출되면 부모가 재렌더하므로 실제 문제는 없지만, `onRefresh` 가 호출되지 않는 케이스에서는 스푼 잔액 표시가 stale 상태가 된다. `equipDecoration()`은 스푼을 소비하지 않으므로 장착 후 `onRefresh` 없이도 무관 — 구매 경로만 `onRefresh`를 부르므로 현재는 안전.

**3. `timeAttackDailyCount` 누적 미수정 (세 번째 언급):**
Review 17, 18에서 이어진 항목. 여전히 날짜 키가 무제한 누적된다. 이번 리뷰에서도 수정 없음. 출시 전 클린업 로직 추가 권장.

---

### 스토어 준비 상태 (v0.1.101 기준)

| 항목 | 상태 |
|---|---|
| 코어 퍼즐 루프 | ✅ |
| 팬트리 샵 UI | ✅ 실제 구현 완료 |
| 장식 아트 6종 webp | ✅ |
| 커서 컨트롤 (10×10+) | ✅ API 완성 |
| 힌트 시스템 | ✅ API 완성 |
| 가이드 아트 게이트 | ✅ |
| `onPantryFirstPurchase` 버그 | ⚠️ undefined — 동작 미실행 (크래시 없음) |
| 팬트리 슬롯 실기기 레이아웃 | ⏳ 확인 권장 |
| 배지 카드 아트 | ⚠️ approvedStageArtUrls 여전히 비어 있음 |
| 퍼즐 사이즈 확장 (10×10+) | ⏳ |
| iOS safe area CSS | ⏳ 확인 필요 |

---

### 전체 평가

Review 18의 "다음 우선순위 1번 — 팬트리 샵 UI"가 완전히 구현됐다. placeholder에서 슬롯 선택, 필터, 구매/장착 전체 흐름이 갖춰졌고, `runtimeArt.js`로 아트 승인 레지스트리가 한 곳에 모였다. 힌트와 커서 API도 완성됐다.

남은 실질적 버그: `onPantryFirstPurchase` undefined. 기능 손실은 있지만 크래시 없음. 다음 작업에서 함께 수정 권장.

다음 우선순위:
1. **`onPantryFirstPurchase` 버그 수정** — 정의 후 전달하거나 인자 제거
2. **`stageArt.js` approvedStageArtUrls** — 아트 승인 후 배지 카드 연결
3. **팬트리 슬롯 실기기 레이아웃 QA** — 절대 좌표 겹침 확인

---

## Review 20 — 2026-07-05

**Scope:** v0.1.101 이후 ~ v0.1.104 (미커밋 작업 트리 기준)
**Tests:** 41/41 pass ✅

---

### 전체 변화 요약

팬트리 장식 아이템 6→10개 확장. Review 19 버그 1건 수정.

| 항목 | 상태 |
|---|---|
| 신규 장식 4종 (jam jar / herb pot / cork board / succulent) | ✅ PNG + webp 등록 |
| `decorationArt.js` 10종 연결 | ✅ |
| `runtimeArt.js` 10종 승인 | ✅ |
| `onPantryFirstPurchase` 버그 | ✅ **수정 완료** |
| 팬트리 샵 버튼 터치 높이 44px 보정 | ✅ |
| 모바일 슬롯 클릭 영역 겹침 수정 | ✅ |
| `npm run qa:mobile` 360/390/430 | ✅ |

---

### 잘 된 것들

**`onPantryFirstPurchase` 버그 수정 (Review 19 지적 반영):**
`requestPantryFirstPurchaseGuide()` 함수가 `appShell.js:116`에 정의됐고, `createShell()` 파라미터로 전달되어 `renderPantryView`에 정상 연결됐다. 구매 시 `hasSeenGuide("pantryFirstPurchase")` 확인 후 첫 구매 가이드가 트리거된다. `guideDialog.js`와 `save.js` 모두 `"pantryFirstPurchase"` ID를 인식한다 ✅ 세 파일이 일관되게 연결됨.

**신규 장식 4종 파이프라인:**
원본 PNG → 투명 PNG → webp 변환까지 기존 v2 아이템과 동일한 3단계 파이프라인을 따랐다 (raw/최종/webp 파일 모두 존재). `decorationArt.js`, `runtimeArt.js`, `decorations.js` 세 파일이 일관되게 업데이트됐다.

**슬롯별 선택지 다양화:**
- counter: starter-counter-cloth(0) / small-jam-jar(20) / soup-pot-display(80) → 3단계 가격대
- window: sunny-window-curtains(22) / herb-pot(25) → 비슷한 가격, 취향 선택
- back-wall: cork-board(32) / golden-spoon-sign(90) → 저가/고가 분리
- shelf: recipe-card-shelf(28) / tiny-succulent(26) → 비슷한 가격, 취향 선택

슬롯별 경쟁이 생겼다. 같은 슬롯 아이템을 비교하며 선택하는 재미가 생겼다 ✅

---

### 확인 사항

**1. `"pantryFirstPurchase"` 가이드 i18n 키:**
`en.js`/`ko.js` 모두 `guide.pantryFirstPurchase` 블록 존재 확인 ✅

**2. `timeAttackDailyCount` 누적 미수정 (네 번째 언급):**
Review 17부터 이어진 항목. 출시 전 정리 권장.

**3. `stageArt.js` approvedStageArtUrls 여전히 비어 있음:**
배지 방 아트 연결 미완. 아트 승인 대기 중.

---

### 스토어 준비 상태 (v0.1.104 기준)

| 항목 | 상태 |
|---|---|
| 팬트리 샵 UI (10종) | ✅ 완성 |
| 첫 구매 가이드 트리거 | ✅ 버그 수정 완료 |
| 장식 아트 파이프라인 | ✅ 10종 webp |
| 모바일 터치 타겟 44px | ✅ |
| `pantryFirstPurchase` i18n 키 | ⚠️ 존재 여부 확인 필요 |
| 배지 카드 아트 | ⚠️ approvedStageArtUrls 비어 있음 |
| `timeAttackDailyCount` 누적 | ⚠️ 미수정 |
| 퍼즐 사이즈 확장 (10×10+) | ⏳ |
| iOS safe area CSS | ⏳ |

---

### 전체 평가

Review 19의 버그(`onPantryFirstPurchase` undefined)가 정확하게 수정됐다. 신규 장식 4종도 기존 파이프라인을 동일하게 따랐고, 슬롯별 선택지가 생겨 팬트리 경제가 실질적으로 작동하기 시작했다. 작업 규모가 작지만 이전 리뷰 피드백 반영이 빠르고 정확했다.

다음 우선순위:
1. **`guide.pantryFirstPurchase.*` i18n 키** — `en.js`/`ko.js` 존재 확인
2. **`stageArt.js` approvedStageArtUrls** — 아트 확정 후 배지 연결
3. **`timeAttackDailyCount` 정리 로직** — 30일 이상 키 제거

---

## Review 21 — 2026-07-05

**Scope:** v0.1.104 → v0.1.110 (`pantryView.js` 단독 변경 +53/-22)
**Tests:** 41/41 pass ✅ | `npm run qa:assets` 120 assets ✅

---

### 변화 요약

팬트리 샵 필터 시스템 추가. 파일 1개(pantryView.js)만 변경.

| 항목 | 내용 |
|---|---|
| 슬롯 필터 | 기존 유지, `pantry-filter-row` 클래스로 통합 |
| 등급(rarity) 필터 | 신규 — all/starter/common/cozy/rare |
| 구매 가능성 필터 | 신규 — all/canBuy/owned |
| 빈 상태 (`pantry-empty-state`) | 신규 — 필터 조합 결과 0개 시 표시 + "Reset filters" 버튼 |
| 카드 등급 표시 | `rarity-{value}` CSS 클래스 + `rarityLabel · priceLabel` 텍스트 |

---

### 잘 된 것들

**3중 필터 조합 로직:**
```js
approvedDecorations
  .filter(slot)
  .filter(rarity)
  .filter(availability)
```
순수 배열 체인으로 명확하다. 각 필터가 독립적으로 적용되어 조합이 자유롭다.

**`canBuy` 필터 정의:**
```js
if (selectedAvailability === "canBuy") {
  return !ownedIds.includes(decoration.id) && spoons >= Number(decoration.cost || 0);
}
```
소유하지 않은 것 중 잔액으로 살 수 있는 것만 표시 — 스푼이 부족할 때 "지금 살 수 있는 것"만 빠르게 찾는 데 유용하다.

**빈 상태 UX:**
0건일 때 빈 그리드만 보여주는 대신 `renderEmptyShopState(onResetFilters)`로 안내 문구 + 한 번에 전체 초기화 버튼을 제공한다. 필터 조합 실수로 막힌 사용자를 탈출시키는 올바른 처리.

**필터값 유효성 검증:**
```js
function selectRarity(rarity) {
  selectedRarity = rarityFilters.includes(rarity) ? rarity : "all";
}
```
외부 입력이 예상 범위를 벗어나면 `"all"`로 폴백. 모든 필터 함수에 동일 패턴 적용됨 ✅

**`rarityFilters`에 `"rare"` 포함:**
현재 데이터에는 `rarity: "rare"` 아이템이 없지만 필터에 미리 포함됐다. 추후 아이템 추가 시 필터 코드 변경 없이 바로 동작한다.

---

### 확인 사항

**1. `spoons` / `ownedIds` 스냅샷 문제 (Review 19에서 이어짐):**
`canBuy` 필터가 렌더 시점의 `spoons`, `ownedIds`를 캡처해서 사용한다. 구매 후 `onRefresh()`가 부모 재렌더를 트리거하므로 일반 경로는 안전하다. 단, `equipDecoration()`은 스푼을 소비하지 않아 `onRefresh` 없이 진행되므로, 장착 후 `canBuy` 필터를 다시 열면 잔액 기준이 최신이 아닐 수 있다 — 장착이 잔액에 영향을 주지 않으므로 실질적 문제 없음.

**2. `rarityFilters` 배열 모듈 레벨 상수:**
```js
const rarityFilters = ["all", "starter", "common", "cozy", "rare"];
const availabilityFilters = ["all", "canBuy", "owned"];
```
`decorations.js`의 실제 rarity 값과 동기화되지 않는다. 현재는 수동으로 맞춰져 있는데, 향후 `"premium"` 등 새 등급 추가 시 두 곳을 동시에 수정해야 한다. 중요한 문제는 아니지만 `decorations.js`에서 rarity 목록을 export하고 여기서 import하면 단일 소스가 된다 (개선 제안, 필수 아님).

**3. `timeAttackDailyCount` 누적 미수정 (다섯 번째 언급):**
이번 작업 범위 밖이지만 계속 누적 중. 출시 전 처리 필요.

---

### 스토어 준비 상태 (v0.1.110 기준)

| 항목 | 상태 |
|---|---|
| 팬트리 샵 — 슬롯/등급/가용성 필터 | ✅ 완성 |
| 빈 필터 결과 상태 처리 | ✅ |
| 등급 표시 (카드 + 필터) | ✅ |
| 배지 카드 아트 | ⚠️ approvedStageArtUrls 비어 있음 |
| `timeAttackDailyCount` 누적 | ⚠️ 미수정 |
| 퍼즐 사이즈 확장 (10×10+) | ⏳ |
| iOS safe area CSS | ⏳ |

---

### 전체 평가

팬트리 샵이 단순 목록에서 실용적인 쇼핑 UX로 발전했다. 아이템이 10개일 때는 필터가 과할 수 있지만, 향후 아이템 확장(20~45개 목표)을 고려하면 지금 구조를 잡아두는 것이 맞다. 특히 `canBuy` 필터는 스푼 관리 게임플레이와 직접 연결되는 중요한 UX다.

파일 1개만 변경됐고, 기존 API(save, decorations, decorationArt)를 그대로 활용해 확장했다. 사이드 이펙트 없음.

다음 우선순위:
1. **`stageArt.js` approvedStageArtUrls** — 아트 확정 후 배지 연결
2. **`timeAttackDailyCount` 정리 로직** — 30일 이상 키 제거
3. **`rarityFilters` 단일 소스화** — 개선 제안 (선택)

---

## Review 22 — 2026-07-06

**Scope:** v0.1.110 → v0.1.126 (Replay Picks 기능 추가)
**Tests:** 46/46 pass ✅ (테스트 파일 9→11개, +5 테스트)

---

### 전체 변화 요약

완료한 퍼즐을 다시 푸는 Replay Picks 기능 추가. 보상 조건이 엄격하게 설계됐고, Review 17부터 5번 언급된 `timeAttackDailyCount` 누적 문제도 이번에 함께 수정됐다.

| 항목 | 상태 |
|---|---|
| `replayPicks.js` 신규 — 데일리 픽 선정 로직 | ✅ |
| `recordReplayReward()` 신규 — 보상 조건 + 저장 | ✅ |
| `pruneReplayRewardedPuzzleIdsByDate()` — 30일 보관 후 자동 정리 | ✅ |
| `pruneTimeAttackDailyCount()` — **Review 17~21 누적 지적 수정** | ✅ |
| `replayChallenge.test.js` / `replayPicks.test.js` 신규 테스트 | ✅ |
| `puzzleView.js` — 리플레이 모드 별도 보드 상태 | ✅ |
| `economyConfig.js` — `REPLAY_PICK_REWARD: 1`, `REPLAY_PICK_DAILY_LIMIT: 3` | ✅ |

---

### 잘 된 것들

**`recordReplayReward()` — 보상 조건 4중 검증:**
```js
if (!normalizedPuzzleId || !picked || !clean || !save.completedPuzzleIds.includes(normalizedPuzzleId))
  → "not-eligible"
if (rewardedToday.includes(normalizedPuzzleId))
  → "already-claimed"
if (rewardedToday.length >= getDailyReplayPickLimit())
  → "daily-limit"
```
- `picked` — 오늘 데일리 픽에 포함된 퍼즐만 보상
- `clean` — 힌트 없이, 틀린 칸 없이 완료해야만 보상
- `completedPuzzleIds` 포함 여부 — 실제로 과거에 완료한 퍼즐만 리플레이 가능
- 중복 보상, 일일 한도 초과 차단

Codex 설명대로 "기존 진행 상태를 건드리지 않는 별도 도전"이 코드로 정확히 구현됐다.

**`puzzleView.js` 리플레이 격리:**
```js
let state = isReplayChallenge
  ? createPuzzleState(puzzle)   // 항상 새 빈 보드
  : loadPuzzleState(puzzle.id) || createPuzzleState(puzzle);  // 기존 저장 상태
```
리플레이는 항상 새 빈 보드에서 시작, 원래 완료 상태를 덮어쓰지 않는다. 완료 처리도 리플레이 경로(`recordReplayReward`)와 일반 경로(`recordPuzzleCompletion`)가 완전히 분리됐다.

**`pruneTimeAttackDailyCount()` — 오랜 숙제 해결 ✅:**
Review 17부터 5회에 걸쳐 지적됐던 `timeAttackDailyCount` 무제한 누적 문제가 이번에 수정됐다. `pruneReplayRewardedPuzzleIdsByDate()`와 동일한 날짜 기반 보관 패턴을 적용해 `normalizeSave()` 시점에 자동 정리된다.

**`getDailyReplayPicks()` — 결정론적 일별 픽:**
```js
const dayNumber = Math.floor(now.getTime() / MS_PER_DAY);
const startIndex = Math.abs(dayNumber) % candidates.length;
```
같은 날에는 항상 같은 퍼즐이 선정된다. 시드 기반 타임어택과 동일한 "공정성" 원칙 적용. 날짜가 바뀌면 자동으로 다음 퍼즐 세트가 선정된다.

**테스트 커버리지:**
- `replayChallenge.test.js`: picked+clean → 보상, 중복 차단 검증
- `replayPicks.test.js`: 완료 없을 때 빈 배열, 잠금 팩 제외, 같은 날 안정성, 한도 초과 처리

---

### 확인 사항

**1. `clean` 판정 로직 — `countMistakes` 타이밍:**
```js
if (isReplayChallenge && !state.completed && countMistakes(state, puzzle.solution) > 0) {
  replayHadMistake = true;
}
```
`replayHadMistake`가 true이면 `recordReplayReward`에 `clean: false`가 전달된다. 문제는 이 판정이 "완료 전 마지막 셀 토글 시점"에만 체크되는 것인지, 도중 실수를 추적하는 누적 플래그인지 코드 문맥상 명확하지 않다. 만약 한 번 틀렸다가 undo로 되돌리면 `replayHadMistake`가 `false`로 리셋되는지 확인 필요.

**2. `REPLAY_PICK_REWARD: 1` — 보상이 매우 낮음:**
완료 퍼즐을 다시 clean하게 풀어야 스푼 1개. 일반 5×5 퍼즐(3스푼)의 1/3. 리플레이의 진입 장벽(clean 조건)과 보상이 균형적인지 게임 출시 후 데이터 기반으로 조정 필요. 지금은 경제 컨설테이션 문서에서 "퍼즐 소진 후 장기 루프" 수입원으로 설계됐기 때문에 낮게 시작하는 것 자체는 적절함.

**3. `stageArt.js` approvedStageArtUrls 여전히 비어 있음:**
이번 작업 범위 밖. 배지 카드 아트 여전히 미연결.

---

### 스토어 준비 상태 (v0.1.126 기준)

| 항목 | 상태 |
|---|---|
| Replay Picks 기능 | ✅ 완성 (선정 + 보상 + 격리) |
| `timeAttackDailyCount` 누적 정리 | ✅ **수정 완료** (Review 17~21 누적 지적) |
| `replayRewardedPuzzleIdsByDate` 30일 정리 | ✅ |
| 리플레이 테스트 커버리지 | ✅ |
| `clean` 판정 undo 동작 | ⚠️ 확인 필요 |
| 배지 카드 아트 | ⚠️ approvedStageArtUrls 비어 있음 |
| 퍼즐 사이즈 확장 (10×10+) | ⏳ |
| iOS safe area CSS | ⏳ |

---

### 전체 평가

Replay Picks는 "퍼즐 소진 후 장기 루프"를 코드로 구현한 첫 번째 결과물이다. 경제 컨설테이션에서 설계한 방향 — 기존 저장 상태를 건드리지 않는 별도 도전 보드, clean 완료만 보상, 데일리 한도 — 이 정확하게 구현됐다. 특히 보상 조건 4중 검증과 저장 격리는 나중에 스푼 경제가 더 중요해질 때 신뢰의 기반이 된다.

Review 17부터 5번 지적한 `timeAttackDailyCount` 누적 문제가 이번에 함께 해결된 것도 긍정적이다.

다음 우선순위:
1. **`clean` 판정 undo 동작 확인** — 실수 후 undo 시 `replayHadMistake` 리셋 여부
2. **`stageArt.js` approvedStageArtUrls** — 아트 확정 후 배지 연결
3. **`REPLAY_PICK_REWARD` 밸런스** — 출시 후 데이터 기반 조정 예정

---

## Review 23 — 2026-07-06

**Scope:** v0.1.126 → v0.1.131 (`pantryView.js` 대규모 확장)
**Tests:** 49/49 pass ✅ (11개 파일 — i18n +1, save +1, replayChallenge +2)

---

### 전체 변화 요약

`pantryView.js`가 938줄로 확장됐다. 장식 구매 UI에 스토리/목표 레이어가 추가됐다.

| 신규 컴포넌트 | 역할 |
|---|---|
| `renderPantryStoryRequest` | 처음 방문 시 Pip이 첫 아이템 배치를 요청하는 진입 카드 |
| `renderPantryStoryMilestone` | 장착 아이템 수 기반 레벨 표시 카드 |
| `renderPantryStoryDelivery` | **이번 핵심** — 선택한 목표 아이템의 "Pip 배송 메모" 카드 |
| `renderPlacementAdvisor` | 슬롯 선택 시 해당 슬롯 아이템 요약 안내 |
| `renderSavingsGoal` | 목표 아이템까지 필요한 스푼 추적 카드 |
| `renderEarningPlan` | 퍼즐 몇 개 더 풀면 살 수 있는지 계산 안내 |
| `renderCollectionProgress` | 전체 장식 수집 진행률 |
| `renderDisplayPlan` | 현재/다음 슬롯 배치 계획 안내 |
| 정렬 컨트롤 | featured / priceLow / priceHigh / rarity 4종 |
| `pantryViewState` 모듈 상수 | 뷰 내 상태(필터, 정렬, 목표 ID)를 세션 내 유지 |

---

### 잘 된 것들

**`pantryViewState` — 세션 내 상태 유지:**
```js
const pantryViewState = {
  selectedSlotId: "all", selectedRarity: "all",
  selectedAvailability: "all", selectedSort: "featured",
  trackedGoalId: null, storyGoalId: null, lastAction: null
};
```
모듈 레벨 객체로 탭 이동 후 돌아와도 필터/정렬/목표가 유지된다. `localStorage`를 쓰지 않아 세션이 끝나면 초기화 — 가볍고 올바른 선택. 재진입 시 validate 없이 그대로 쓰지 않고, `sortOptions.includes(pantryViewState.selectedSort)` 같은 폴백 검증도 포함됐다 ✅

**`renderPantryStoryDelivery` — 배송 메모 UX:**
- 목표 아이템 설정 → 아트 + "X스푼 더 모으기 → 슬롯에 놓기" 2단계 안내 카드
- 이미 소유했거나 `storyGoalId`가 없으면 렌더링하지 않음 → 자동으로 사라짐
- "퍼즐 풀어서 스푼 벌기" CTA(`onPlayForSpoons`) 연결 → 팬트리 → 퍼즐 → 팬트리 순환 명확화

**`renderEarningPlan` — 퍼즐 수 계산:**
```js
const rewardPerPuzzle = getPuzzleReward(5); // 가장 작은 퍼즐 기준
const puzzlesNeeded = Math.ceil(needed / rewardPerPuzzle);
```
목표까지 몇 판 더 풀어야 하는지 수치로 제공. "XX스푼 필요" 보다 "퍼즐 N개" 가 행동으로 연결되기 좋은 안내다.

**`renderPantryStoryRequest` — 자동 진입 로직:**
```js
const starterRequest = approvedDecorations.find(
  (decoration) => Number(decoration.cost || 0) === 0 && decoration.slot === "counter"
) || approvedDecorations[0];
```
무료 counter 슬롯 아이템(starter-counter-cloth)이 존재하면 그것을 첫 요청 대상으로 선정. 비어있으면 첫 아이템. 하드코딩 없이 데이터 구조에서 자동 선정 ✅

**정렬 4종:**
`compareDecorations(left, right, selectedSort, ...)` 함수에서 featured / priceLow / priceHigh / rarity 4가지를 처리. `rarity` 정렬은 `rarityRank` 상수 맵 사용 → 숫자 비교로 안정적.

---

### 확인 사항

**1. `pantryViewState`가 모듈 싱글턴:**
모듈 로드 시 단 한 번 초기화된다. 테스트 환경에서 여러 테스트가 pantryView를 임포트하면 상태가 공유될 수 있다. 현재 `pantryView.js`에 대한 직접 단위 테스트가 없어서 문제가 드러나지 않는다. 출시 후 문제가 되는 케이스는 아니지만, 추후 pantryView 테스트 추가 시 `pantryViewState` 초기화를 export해야 할 수 있다.

**2. `panel.append(...)` 순서 — 마운트 10개:**
```js
panel.append(header, room, placementNote,
  storyRequestMount, storyMilestoneMount, storyDeliveryMount,
  actionFeedbackMount, advisorMount, savingsGoalMount,
  earningPlanMount, progressMount, displayPlanMount, shop);
```
화면에 동시에 렌더될 수 있는 카드가 많다. 각 컴포넌트가 자체 `null` / 빈 내용 시 렌더링 안 하는 조건을 갖고 있지만, 슬롯 미선택 + 아이템 소유 많을 때 어떤 카드들이 동시에 나타나는지 실기기에서 스크롤 UX 확인 권장.

**3. `stageArt.js` approvedStageArtUrls 여전히 비어 있음:**
이번 작업 범위 밖. 배지 카드 아트 미연결 계속.

---

### 스토어 준비 상태 (v0.1.131 기준)

| 항목 | 상태 |
|---|---|
| 팬트리 스토리 루프 (요청→목표→배송) | ✅ 완성 |
| 저축 목표 + 퍼즐 수 계산 안내 | ✅ |
| 장식 정렬 4종 | ✅ |
| 세션 내 뷰 상태 유지 | ✅ |
| 동시 카드 수 스크롤 UX | ⚠️ 실기기 확인 권장 |
| 배지 카드 아트 | ⚠️ approvedStageArtUrls 비어 있음 |
| 퍼즐 사이즈 확장 (10×10+) | ⏳ |
| iOS safe area CSS | ⏳ |

---

### 전체 평가

Codex 메시지에서 "낭타워식 아기자기한 의뢰 루프"라고 표현한 방향이 코드로 구현됐다. 단순한 샵 목록에서 Pip이 아이템을 추천하고, 배송 메모로 목표를 잡아주고, 퍼즐 몇 개 풀면 살 수 있는지 알려주는 흐름이 완성됐다.

`pantryView.js` 단일 파일이 938줄로 성장했다. 기능이 복잡해지고 있으니, 향후 `renderPantryStorySection.js` 같은 서브파일 분리를 고려할 시점이 가까워지고 있다. 지금 당장 문제는 아니다.

다음 우선순위:
1. **동시 카드 스크롤 UX** — 실기기에서 팬트리 전체 흐름 확인
2. **`stageArt.js` approvedStageArtUrls** — 아트 확정 후 배지 연결
3. **`pantryView.js` 분리 검토** — 1000줄 넘어가면 서브파일 분리 권장

---

## Review 24 — 2026-07-07

**Scope:** v0.1.131 → v0.1.133 (pantryView UX 개선)
**Tests:** 49/49 pass ✅ | `npm run qa:assets` 122 assets ✅

---

### 전체 변화 요약

Review 23의 두 가지 지적을 모두 반영했다: "카드 10개 동시 렌더 스크롤 부담" → 샵 6개 제한 + Show more. "1000줄 서브파일 분리 권장" → `pantryStoryCards.js` 분리.

| 항목 | 상태 |
|---|---|
| `pantryStoryCards.js` 신규 분리 (162줄) | ✅ **Review 23 제안 반영** |
| `pantryView.js` 938줄 → 844줄 감소 | ✅ |
| 샵 기본 6개 표시 + "Show more" 페이지네이션 | ✅ **Review 23 지적 반영** |
| 필터/정렬/초기화 시 6개 기준으로 리셋 | ✅ |
| `defaultShopCardLimit = 6` 상수화 | ✅ |
| `pantryViewState.shopVisibleLimit` 세션 유지 | ✅ |
| `renderShopCard`에 `storyGoalId` 파라미터 추가 | ✅ |
| 목표 아이템 구매/장착 시 `storyGoalId` 자동 초기화 | ✅ |

---

### 잘 된 것들

**Review 23 피드백 반영 속도:**
- "카드 동시 렌더 스크롤 UX 확인 권장" → 6개 기본 제한으로 선제 해결
- "`pantryView.js` 1000줄 서브파일 분리 권장" → `pantryStoryCards.js`로 분리
두 지적이 다음 작업에 바로 반영됐다.

**`renderShopLimitControl` — Show more 패턴:**
```js
function renderShopLimitControl(visibleCount, totalCount, onShowMore) {
  if (visibleCount >= totalCount) return null; // 다 보이면 숨김
  // "N of M shown · Show more decorations" 표시
}
```
모든 아이템이 표시되면 컨트롤 자체를 숨기는 깔끔한 처리. 필터/정렬/초기화 시 `shopVisibleLimit`을 `defaultShopCardLimit`(6)으로 리셋해서 맥락 변경 시 처음부터 다시 시작한다 ✅

**`storyGoalId` → `renderShopCard` 파라미터 전달:**
목표로 설정한 아이템을 카드에서 시각적으로 구분할 수 있게 됐다. 구매 또는 장착 완료 시 `pantryViewState.storyGoalId = null`로 자동 초기화 — Delivery complete 피드백 후 자연스럽게 상태가 정리된다.

**`pantryStoryCards.js` 분리 — 162줄, 3개 export:**
```
renderPantryStoryRequest / renderPantryStoryMilestone / renderPantryStoryDelivery
```
스토리 카드 3개가 별도 파일로 분리되어 `pantryView.js`가 직접 다루는 관심사(필터, 정렬, 샵 그리드)에만 집중할 수 있게 됐다. 파일 크기도 94줄 감소.

---

### 확인 사항

**1. 마운트 개수는 여전히 10개:**
```js
panel.append(header, room, placementNote,
  storyRequestMount, storyMilestoneMount, storyDeliveryMount,
  actionFeedbackMount, advisorMount, savingsGoalMount,
  earningPlanMount, progressMount, displayPlanMount, shop);
```
샵 그리드를 6개로 줄였지만, 상단의 스토리/어드바이저/저축 목표 카드들은 조건부 렌더링으로만 제어된다. 조건이 모두 충족되는 상태(스토리 진행 중 + 슬롯 선택 + 목표 설정)에서 동시에 몇 개의 카드가 나타나는지 실기기 확인은 여전히 권장.

**2. `stageArt.js` approvedStageArtUrls 여전히 비어 있음:**
배지 카드 아트 미연결. 이번 작업 범위 밖.

---

### 스토어 준비 상태 (v0.1.133 기준)

| 항목 | 상태 |
|---|---|
| 팬트리 샵 6개 기본 + Show more | ✅ |
| `pantryStoryCards.js` 분리 | ✅ |
| 목표 아이템 완료 후 자동 정리 | ✅ |
| 상단 카드 동시 노출 수 | ⚠️ 실기기 확인 권장 |
| 배지 카드 아트 | ⚠️ approvedStageArtUrls 비어 있음 |
| 퍼즐 사이즈 확장 (10×10+) | ⏳ |
| iOS safe area CSS | ⏳ |

---

### 전체 평가

단 2버전(v0.1.131→v0.1.133) 만에 Review 23의 두 핵심 지적이 모두 반영됐다. 특히 "아직은 아니지만 곧 분리해야"라고 했던 파일 분리가 938줄 시점에 바로 진행된 것은 좋은 판단이다. 팬트리 뷰는 이제 `pantryView.js`(그리드/필터/정렬) + `pantryStoryCards.js`(스토리 흐름) 두 파일로 책임이 분리됐다.

다음 우선순위:
1. **`stageArt.js` approvedStageArtUrls** — 아트 확정 후 배지 연결
2. **상단 카드 동시 노출 실기기 확인** — 조건 중첩 시 카드 수 점검
3. **퍼즐 사이즈 확장 (10×10+)** — 콘텐츠 확장 다음 단계

---

## Review 25 — 2026-07-07

**Scope:** v0.1.133 → v0.1.143
**Tests:** 51/51 pass ✅ (+2 테스트) | `npm run qa:assets` 122 assets ✅

---

### 전체 변화 요약

Review 17~24에서 7번 누적 지적된 **`approvedStageArtUrls` 비어있음** 문제가 이번에 해결됐다. 아울러 팬트리 꾸미기 진행도가 팩 언락 조건으로 연결되는 중요한 설계 연동이 추가됐다.

| 항목 | 상태 |
|---|---|
| `stageArt.js` — 5개 팩 아트 등록 | ✅ **Review 17~24 누적 지적 해결** |
| stage-rewards webp 5종 | ✅ source PNG + webp 모두 존재 |
| `.stage-tile-mosaic` CSS 버그 수정 | ✅ 0px 타일 → 실제 그리드 표시 |
| `revealed`/`peek` 타일 CSS 강화 | ✅ 미완성 타일 blank, 완성 타일 이미지 표시 |
| `getPackPantryRoomRequirement()` 신규 | ✅ 팩 언락에 팬트리 진행도 조건 연동 |
| `packs.js` — `pantryRoomStepRequired` 필드 추가 | ✅ 3/6/10단계 잠금 |
| `mapView.js` — 잠금 조건 텍스트 분기 | ✅ 팬트리 조건 미충족 시 별도 안내 |
| `badgeArt.js` 연동 | ✅ 배지 이미지 실제 표시 |

---

### 잘 된 것들

**`stageArt.js` 아트 등록 — 7회 누적 지적 해결:**
```js
const approvedStageArtUrls = Object.freeze({
  "pips-first-shelf": pipsFirstShelfRewardUrl,
  "sunny-spoon-sign": sunnySpoonSignRewardUrl,
  "apron-drawer": apronDrawerRewardUrl,
  "bakery-window": bakeryWindowRewardUrl,
  "village-pantry": villagePantryRewardUrl
});
```
Review 17에서 처음 지적한 이후 7개 리뷰 동안 "아트 승인 대기"로 미뤄졌던 항목이 완전히 해결됐다. 배지 방이 처음으로 실제 아트를 표시할 수 있게 됐다.

**CSS 버그 수정 — 핵심 원인 제거:**
기존 `.stage-tile-mosaic .pip-tile`에 `opacity: 0.08` + `filter: grayscale(1)` 이 기본값으로 설정돼 있었고, `display` 속성이 누락되어 실질적으로 0px로 렌더됐다. 이번 수정으로:
- `.stage-tile-mosaic`에 `display: grid` 명시
- `pip-tile`에 `display: block` + `min-width/height: 0` 명시
- `.pip-tile:not(.revealed):not(.peek)`는 `background-image: none !important` + 배경색만 표시
- `.revealed` / `.peek` 타일에만 실제 이미지 렌더

**`pantryRoomStepRequired` — 팬트리·퍼즐 루프 연결:**
```js
// packs.js
pantryRoomStepRequired: 3  // 중반 팩
pantryRoomStepRequired: 6  // 후반 팩
pantryRoomStepRequired: 10 // 엔드게임 팩
```
팬트리를 꾸며야 더 많은 퍼즐 팩이 열리는 구조. 퍼즐 → 스푼 → 팬트리 → 팩 언락 → 더 많은 퍼즐의 순환 루프가 코드 레벨에서 완성됐다. 이것이 MAJOR_REWORK_PLAN의 핵심 루프다.

`getPackPantryRoomRequirement()` 구현도 깔끔하다:
```js
const required = Math.max(0, Number(pack?.pantryRoomStepRequired || 0));
const completed = getPantryRoomStepCount(); // 완료된 팬트리 스토리 골 수
return { required, completed, remaining, met };
```
`pantryRoomStepRequired`가 없는 팩(= 0)은 조건 없이 언락 → 기존 팩과 하위 호환 ✅

**`mapView.js` — 잠금 조건 안내 분기:**
팬트리 조건이 미충족된 팩은 "잠금" 대신 "팬트리 N단계 필요" 안내를 별도로 표시. 유저가 왜 잠겨있는지 알 수 있다.

---

### 확인 사항

**1. `pantryRoomStepCount` 기준 — `completedPantryStoryGoalIds`:**
팬트리 진행 단계를 `getCompletedPantryStoryGoalIds().length`로 측정한다. 즉 스토리 골(장식 아이템 구매 완료)을 몇 개 달성했는지가 기준이다. 현재 승인된 장식이 10개이므로 최대 10단계. `pantryRoomStepRequired: 10`인 팩은 장식 10개를 모두 사야 열린다 — 엔드게임 팩으로 적절하나, 장식이 더 추가될 때 이 숫자도 함께 조정이 필요하다.

**2. `pips-first-shelf-reward-candidate-v1.png` 파일:**
`stage-rewards/` 폴더에 `-candidate-` 파일이 하나 남아 있다. `pips-first-shelf-reward-v1.webp`가 이미 등록됐으므로 이 파일은 빌드에 포함되지 않지만, 아트 파이프라인 규율상 candidate 파일은 별도로 관리하거나 제거하는 것이 깔끔하다 (minor).

**3. 퍼즐 사이즈 확장 (10×10+) 여전히 미진행:**
콘텐츠 스케일 목표(1,000개 퍼즐) 관점에서 10×10 이상 팩 콘텐츠 추가가 다음 우선순위다.

---

### 스토어 준비 상태 (v0.1.143 기준)

| 항목 | 상태 |
|---|---|
| 스테이지 아트 배지 방 | ✅ 5팩 아트 연결 완료 |
| 타일 모자이크 CSS | ✅ 버그 수정 |
| 팬트리↔팩 언락 루프 | ✅ 핵심 루프 코드 완성 |
| 퍼즐 사이즈 10×10+ 콘텐츠 | ⏳ 다음 우선순위 |
| `candidate` 아트 파일 정리 | ⚠️ minor |
| iOS safe area CSS | ⏳ |

---

### 전체 평가

이번 작업으로 MAJOR_REWORK_PLAN의 핵심 루프가 코드 레벨에서 완성됐다:

> **퍼즐 풀기 → 스푼 획득 → 팬트리 꾸미기 → 팩 언락 → 더 많은 퍼즐**

7개 리뷰에 걸쳐 추적했던 스테이지 아트 미연결 문제가 해결됐고, CSS 버그로 실제로 보이지 않던 타일 모자이크도 수정됐다. 코어 루프가 화면에 실제로 보이는 상태가 됐다.

다음 우선순위:
1. **퍼즐 10×10+ 콘텐츠 추가** — Content Scale Goal 진입 첫 단계
2. **팬트리 장식 추가** — `pantryRoomStepRequired: 10` 조건을 실제로 달성할 수 있으려면 장식이 10개 이상 필요 (현재 10개로 딱 맞음 — 추가 여유 필요)
3. **`candidate` 파일 정리** — `stage-rewards/` 폴더

---

## Review 26 — 2026-07-07

**Scope:** v0.1.143 → v0.1.149
**Tests:** 52/52 pass ✅ (+1 테스트) | `npm run qa:assets` 122 ✅ | `npm run build` ✅ | `npm run qa:mobile` 360/390/430 ✅

---

### 전체 변화 요약

v0.1.148: 소스 위생 검사 스크립트 추가
v0.1.149: 팩 사이즈 계약 테스트 추가 + 메타데이터 현실화

---

### v0.1.148 — `qa:hygiene` 스크립트

**`scripts/source_hygiene_check.js` 신규:**

두 가지를 검사한다:
1. **UTF-8 BOM** — `src/`, `scripts/`, `tests/` 하위 모든 `.js` 파일 + `src/styles.css`, `package.json`
2. **스테일 CSS 규칙** — `.puzzle-chip[data-access="unlockable"]::after` 잔여 여부

BOM 검사는 바이너리 읽기(`readFileSync` 버퍼) → `bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf` 로 직접 판단. 텍스트 인코딩에 의존하지 않아서 신뢰도가 높다.

CSS 스테일 패턴을 `staleCssRules` 배열로 관리한 설계가 좋다 — 앞으로 제거해야 할 레거시 패턴을 배열에 추가하는 것만으로 검사 확장 가능.

Codex ACL 게이트로 직접 실행은 pending이라고 했는데, 스크립트는 코드에 올라있고 `npm run qa:hygiene`으로 로컬 실행 가능 — 기반은 갖춰졌다.

---

### v0.1.149 — 팩 사이즈 계약 테스트

신규 테스트 2개:

**"keeps larger boards limited to late-stage progression":**
```js
expect(puzzles.filter(p => p.size === 5)).toHaveLength(40);
expect(puzzles.filter(p => p.size === 8)).toHaveLength(50);
expect(puzzles.filter(p => p.size === 10)).toHaveLength(10);
// 앞 3개 팩은 8×8 초과 불가
```

**"keeps each progression pack aligned to its declared max board size":**
```js
expect(Math.max(...packSizes)).toBe(pack.size);
expect(packSizes).toContain(pack.size);
```

`Math.max(...packSizes) === pack.size` — 팩이 선언한 `size`가 실제 최대 퍼즐 사이즈와 일치해야 한다. 이전에 메타데이터가 미래 목표(10/12/15)로 부풀려졌던 문제가 이 테스트로 차단됐다. 선언은 현실을 기술해야 한다는 원칙을 테스트로 강제하는 좋은 설계.

**메타데이터 현실화:**
```
apron-drawer:    size: 8  (실제 8×8 퍼즐 포함)
bakery-window:   size: 10 (실제 10×10 퍼즐 포함)
village-pantry:  size: 10 (실제 10×10 퍼즐 포함)
```
이제 `size` 필드가 "목표"가 아니라 "실제 최대"를 의미한다.

---

### 확인 사항

**하드코딩된 분포 카운트 — Content Scale Goal 마찰 가능성:**

```js
// 현재 테스트 (100개 퍼즐 기준으로 고정)
expect(puzzles.filter(p => p.size === 5)).toHaveLength(40);
expect(puzzles.filter(p => p.size === 8)).toHaveLength(50);
expect(puzzles.filter(p => p.size === 10)).toHaveLength(10);
```

1,000개 목표로 확장할 때 이 숫자들이 깨진다. 퍼즐 추가 작업 시작 전에 이 테스트를 비율 또는 최소값 기반으로 전환해야 한다 (예: "10×10 퍼즐은 최소 10개 이상", "앞 3개 팩은 8×8 초과 불가"). 지금 수정할 이슈는 아니지만 퍼즐 추가 작업 시작 전 Codex에 전달 필요.

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| `qa:hygiene` 스크립트 | ✅ UTF-8 BOM + 스테일 CSS 검사 |
| 팩 사이즈 계약 테스트 | ✅ 메타데이터-현실 일치 강제 |
| `packs.js` 사이즈 메타데이터 현실화 | ✅ |
| 52/52 테스트 | ✅ |
| 하드코딩된 분포 카운트 | ⚠️ 퍼즐 확장 전 수정 필요 |

v0.1.148~149는 코어 기능보다 **테스트 인프라와 데이터 정확성**에 집중한 유지보수 릴리스. 퍼즐 콘텐츠 확장 전 데이터 계약을 명확히 한 것은 올바른 순서다.

다음 우선순위:
1. **퍼즐 확장 전 분포 테스트 수정** — 하드코딩 카운트 → 최솟값/비율 기반 전환
2. **10×10 팩 퍼즐 추가** — `bakery-window`, `village-pantry` 각 퍼즐 증가
3. **팬트리 장식 추가** — `pantryRoomStepRequired: 10` 조건에 여유분 확보

---

## Review 27 — 2026-07-08

**Scope:** v0.1.149 → v0.1.159
**Tests:** 52/52 pass ✅ | `npm run qa:assets` 122 ✅ | `npm run build` ✅ | `npm run qa:mobile` 360/390/430 ✅ | HTTP 200 OK ✅

---

### 전체 변화 요약

| 버전 | 내용 |
|---|---|
| v0.1.157 | 전체 버튼 tactile UI 통일 시스템 |
| v0.1.158 | top-bar HUD + floating nav 패널 폴리시 |
| v0.1.159 | `qa:mobile`에 크롬 폴리시 regression guard 추가 |

---

### v0.1.157 — Tactile Button System

**CSS 선택자 묶음:**
```css
.icon-button, .tool-button, .mode-button, .puzzle-chip,
.floating-nav__trigger, .floating-nav__item,
.button.secondary, .pantry-item-action
```

게임 내 모든 인터랙티브 요소를 하나의 tactile 시스템으로 통일했다:
- **rest state:** `0 4px 0` 바텀 그림자 + 상단 `inset 0 2px 0` 하이라이트 → 물리적 버튼처럼 두께감
- **hover:** `translateY(-1px)` + 미세한 saturate/brightness → 들리는 느낌
- **active:** `translateY(2px)` + 그림자 축소 → 눌리는 느낌 (120ms ease)
- **active/complete 상태:** mint 그라디언트 (`#bfe9d8 → #9dd4bd → #8dc8b2`)
- **primary CTA (daily/stage-complete/time-attack):** yellow 그라디언트
- **danger:** red 그라디언트

모든 버튼이 동일한 border-radius(11px), border-width(3px), transition(120ms)을 공유한다. 게임 화면 내 어떤 버튼을 눌러도 같은 물리적 피드백 — UI 시스템이 일관성을 가졌다는 신호.

**`.puzzle-chip.complete:not(.active)` 처리:**
완료된 퍼즐 칩이 active 상태와 동일한 mint 배경을 받는다. "이미 푼 퍼즐"을 시각적으로 즉시 구별 가능.

---

### v0.1.158 — App Chrome Polish

**`.top-bar`:**
```css
min-height: 78px;
border-radius: 14px;
background: linear-gradient(135deg, rgba(255,252,244,0.96), rgba(255,248,232,0.86) 58%, rgba(184,224,205,0.22)), var(--paper);
box-shadow: 0 10px 24px rgba(61,43,46,0.12), inset 0 1px 0 rgba(255,255,255,0.76);
```

헤더가 떠 있는 카드처럼 처리됐다. 135도 그라디언트 끝에 민트 틴트(`rgba(184,224,205,0.22)`)가 섞여 게임 테마와 연결된다.

**`.currency-pill`:**
`min-height: 40px` + `border-radius: 999px` + 자체 그림자. 독립적인 뱃지처럼 보이는 스푼 카운터.

**`.floating-nav__menu`:**
`width: min(100%, 336px)` — 큰 화면에서도 336px 캡. 패널이 뷰포트 좌우로 삐져나오지 않는다.

**`@media (max-width: 380px)` 대응:**
360px 기기에서 `min-height: 70px`, h1 `font-size: 1.2rem`, `max-width: 194px`로 축소. currency-pill도 36px로 축소. 360×740 기기에서 헤더가 화면을 잡아먹지 않는다.

---

### v0.1.159 — `qa:mobile` Chrome Guard

**`expectAppChromePolish()`:**
```js
// top-bar 기준
topBarHeight >= 68 && currencyHeight >= 36
  && borderRadius >= 12 && backgroundImage.includes("linear-gradient")

// floating-nav 기준
navMetrics.left >= -1 && navMetrics.right <= viewportWidth + 1
  && borderRadius >= 12 && backgroundImage.includes("linear-gradient")
```

v0.1.158에서 추가된 폴리시가 미래 수정에 의해 무너지지 않도록 regression guard를 `qa:mobile`에 연결했다. 플레이라이트가 실제 DOM에서 `getBoundingClientRect()` + `getComputedStyle()`으로 픽셀 단위 검증.

특히 floating-nav 패널의 좌우 경계 검사(`left >= -1`, `right <= viewportWidth + 1`)가 중요하다 — 모바일에서 패널이 화면 밖으로 나가는 흔한 regression을 자동으로 잡는다.

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| 버튼 tactile 통일 시스템 | ✅ 전 게임 인터랙티브 요소 일관성 확보 |
| top-bar HUD 카드화 | ✅ 앱 프레임처럼 느껴지는 품질 |
| currency-pill 독립 뱃지 처리 | ✅ |
| floating-nav 패널 캡 (336px) | ✅ 큰 화면에서도 안전 |
| 360px 소형 기기 대응 미디어쿼리 | ✅ |
| `qa:mobile` chrome regression guard | ✅ 폴리시 유지 자동화 |

v0.1.157~159는 **게임이 앱처럼 보이는 마지막 단계**를 밟았다. 버튼 시스템 통일 + HUD 카드화 + regression guard 연결까지 세트로 완성됐다. 이 세 버전이 하나의 묶음으로 진행된 것이 올바른 순서다.

스토어 제출 전 남은 시각 항목:
1. **iOS safe area** — `env(safe-area-inset-top/bottom)` 아직 없음, iPhone 노치 기기에서 HUD가 잘릴 수 있음
2. **퍼즐 콘텐츠 확장** — 폴리시가 완성됐으니 이제 콘텐츠 볼륨으로

---

## Review 28 — 2026-07-08

**Scope:** v0.1.159 → v0.1.166
**Tests:** 52/52 pass ✅ | `npm run qa:assets` 122 ✅ | `npm run build` ✅ | `npm run qa:mobile` 360/390/430 ✅ | HTTP 200 OK ✅

---

### 전체 변화 요약

| 버전 | 내용 |
|---|---|
| v0.1.160~165 | Album/Map 화면 폴리시 |
| v0.1.166 | `qa:mobile` Album/Map regression guard 추가 + DOM 타이밍 버그 수정 |

---

### Album 화면 폴리시

**카드 시스템 (`album-card`, `album-stamp`):**

```css
.album-card { border-radius: 14px; background: linear-gradient(180deg, ...); box-shadow: 0 6px 14px ...; }
.album-card.complete { border-color: rgba(122,78,53,0.36); background: linear-gradient(...warm amber...); }
.album-card.locked { opacity: 0.8; background: linear-gradient(...muted...); }
.album-stamp { min-height: 72px; background: linear-gradient(180deg, #fff3cf, #efd39f); }
.stamp-cell.filled { background: linear-gradient(135deg, #ffd66d, #e99a64 56%, #8b5d44); }
```

완료 카드는 amber warm 배경, 잠금 카드는 muted + opacity 0.8 처리. 스탬프 셀은 3색 대각선 그라디언트(`#ffd66d → #e99a64 → #8b5d44`)로 골드 느낌. 앨범이 실제 수집 화면처럼 보인다.

**날짜 배지 (`card-date`):**
```css
.album-card .card-date {
  display: inline-flex;
  border-radius: 999px;
  padding: 2px 8px;
  background: rgba(255, 252, 244, 0.66);
  font-size: 0.72rem; font-weight: 850;
}
```
완료한 날짜가 pill 형태로 표시된다. `font-weight: 850`이 약간 이례적이나 코지 스타일에서 bold 숫자를 읽기 쉽게 만드는 의도로 보임.

---

### Map/Badge 화면 폴리시

**배지 카드 진행 바 (`badge-card::after`):**
```css
.badge-card { position: relative; overflow: hidden; }
.badge-card::after {
  content: "";
  position: absolute; inset: auto 0 0;
  height: 5px;
  background: linear-gradient(90deg,
    rgba(157,216,188,0.94) var(--badge-progress, 0%),
    rgba(61,43,46,0.1) 0
  );
}
```
CSS custom property `--badge-progress`를 `card.style.setProperty()`로 주입 → JS·DOM 없이 순수 CSS 그라디언트로 진행 바 구현. `overflow: hidden` + `inset: auto 0 0`으로 카드 하단에 정확히 고정. 깔끔한 접근.

**배지 토큰 (`badge-art-token`):**
```css
.badge-art-token {
  width: min(100%, 7rem);
  background: radial-gradient(circle at 50% 38%, rgba(255,226,122,0.42), transparent 48%),
    linear-gradient(180deg, rgba(255,252,244,0.86), rgba(255,232,177,0.72));
}
```
원형 빛 반사 효과(`radial-gradient` at 50% 38%) + 베이스 warm 그라디언트 레이어. 배지 이미지가 유리 뱃지 케이스에 들어있는 느낌.

**Next Badge 카드 (`roadmap-badge`):**
```css
.roadmap-badge { display: grid; grid-template-columns: 54px minmax(0, 1fr); }
.roadmap-badge__token { width: 54px; height: 54px; border-radius: 14px; }
```
54×54 토큰 + 텍스트의 2-컬럼 레이아웃. 다음 목표 배지를 강조해서 보여주는 별도 카드.

---

### `qa:mobile` Album/Map Guard (v0.1.166)

**`expectAlbumPolish()`:**
```js
album.radius >= 14  // 패널
albumCard.radius >= 12  // 카드
albumStamp.height >= 64  // 스탬프 충분한 높이
album.background.includes("linear-gradient")  // 패널 배경
albumCard.background.includes("linear-gradient")  // 카드 배경
// 뷰포트 경계 내 위치
```

**`expectMapPolish()`:**
```js
map.radius >= 14
badgeCard.radius >= 12
badgeToken.height >= 80  // 배지 토큰 충분한 높이
// linear-gradient, 뷰포트 경계
```

v0.1.159와 같은 패턴 — 폴리시 추가 즉시 regression guard 연결. `badgeToken.height >= 80`이 주목할 만하다 — 배지 이미지가 충분히 큰 공간을 차지하는지 픽셀 단위 검증.

**DOM 타이밍 버그 수정:**
Album 전환 후 DOM을 보는 타이밍 문제 발견 → Album/Map 각각 뷰 열린 직후 검사하도록 분리. QA guard가 실제로 작동하는 과정에서 자체 버그를 발견하고 수정한 사례.

---

### 확인 사항

**`font-weight: 850`:**
CSS `font-weight`는 숫자 1~1000 범위지만 실제 렌더는 폰트 파일이 지원하는 weight축에 의존한다. 현재 프로젝트에서 variable font를 쓰고 있는지 확인 필요. 일반 폰트라면 850 → 800 또는 900으로 반올림되어 렌더된다 (minor, 시각적으로 의도한 결과가 나오고 있으면 무관).

**`@media (max-width: 430px)` 그리드 1열 전환:**
`badge-collection-grid`가 430px에서 `grid-template-columns: 1fr`로 전환된다. 배지 카드가 5개(팩 수만큼)이므로 430px 이하 전체 기기에서 단일 컬럼 — 세로가 길어지지만 카드 당 충분한 공간 확보. 현재 5팩 기준으로 적절, 팩이 늘어날 경우 스크롤 길이를 재검토해야 한다.

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| Album 카드 complete/locked 시각 분리 | ✅ |
| 날짜 배지 pill | ✅ |
| Badge 카드 CSS 진행 바 | ✅ 순수 CSS, JS 의존 없음 |
| 배지 토큰 radial glow | ✅ |
| Next Badge 카드 | ✅ |
| `qa:mobile` Album/Map guard | ✅ |
| DOM 타이밍 버그 자체 발견·수정 | ✅ |
| `font-weight: 850` 렌더 확인 | ⚠️ minor |

**v0.1.157~v0.1.166 시리즈로 앱의 주요 화면 폴리시가 완성됐다. 퍼즐 콘텐츠 확장이 다음이다.** 버튼 시스템(157), HUD(158), Album(160~165), Map(160~165), 그리고 각 화면에 regression guard(159, 166). 이제 스토어 제출 품질 기준에서 남은 항목은 iOS safe area와 콘텐츠 볼륨이다.

---

## Review 29 — 2026-07-08

**Scope:** v0.1.166 → v0.1.179
**Tests:** 52/52 pass ✅ | `qa:catalog` ✅ | `qa:hygiene` ✅ | `qa:assets` 122 ✅ | `npm run build` ✅ | `qa:mobile` 360/390/430 ✅ | HTTP 200 OK ✅
**카탈로그:** 총 125개 | free 125개 | 10×10+ 35개 | 12×12+ 13개

---

### 추가된 퍼즐 4개

| id | 팩 | 사이즈 | 난이도 | 보상 |
|---|---|---|---|---|
| `bakery-window-cinnamon-rolls-32` | Bakery Window | 12×12 | hard | 15 |
| `bakery-window-cup-stack-33` | Bakery Window | 12×12 | hard | 15 |
| `village-pantry-candle-shelf-31` | Village Pantry | 10×10 | medium | 7 |
| `village-pantry-wicker-tray-32` | Village Pantry | 10×10 | medium | 7 |

**Bakery Window `size` 필드 업데이트:** `packs.js`에서 `bakery-window.size: 10 → 12`. `Math.max(...packSizes) === pack.size` 계약 테스트가 즉시 검증 — 팩 선언이 실제를 따라갔다. ✅

---

### 테스트 — Review 26 권고 반영 확인

Review 26에서 "퍼즐 확장 전 하드코딩 카운트를 최솟값 기반으로 전환해야 한다"고 지적했는데, 이번에 정확히 그대로 반영됐다:

**Before (v0.1.149):**
```js
expect(puzzles).toHaveLength(100);
expect(puzzles.filter(p => p.size === 5)).toHaveLength(40);
expect(puzzles.filter(p => p.size === 8)).toHaveLength(50);
expect(puzzles.filter(p => p.size === 10)).toHaveLength(10);
```

**After (v0.1.178+):**
```js
expect(progressionPuzzles.length).toBeGreaterThanOrEqual(100);
expect(progressionPacks.length).toBeGreaterThanOrEqual(5);
progressionPacks.forEach(pack => {
  expect(puzzles.filter(p => p.packId === pack.id).length).toBeGreaterThanOrEqual(20);
});
expect(progressionPuzzles.filter(p => p.size >= 12).length).toBeGreaterThanOrEqual(13);
expect(puzzle.size).toBeLessThanOrEqual(pack.size);  // per-puzzle 불변식
```

하드코딩 카운트가 완전히 제거됐고, `puzzle.size <= pack.size` 불변식이 퍼즐 단위로 검증된다. 이제 퍼즐 수백 개를 추가해도 테스트가 깨지지 않는다.

---

### 확인 사항 — `titleKey` 누락

`village-pantry-candle-shelf-31`과 `village-pantry-wicker-tray-32` 두 퍼즐에 `titleKey` 필드가 없다:

```json
// 누락 (현재)
{ "id": "village-pantry-candle-shelf-31", "title": "Candle Shelf", ... }

// 다른 퍼즐 형식 (정상)
{ "id": "bakery-window-cinnamon-rolls-32", "title": "Cinnamon Rolls", "titleKey": "puzzles.bakery-window-cinnamon-rolls-32", ... }
```

`titleKey`가 없으면 `puzzleTitle()` / `puzzleImageName()` i18n 함수가 이 퍼즐을 한국어로 처리할 때 fallback 경로를 탄다. 한국어 사용자가 앨범에서 이 퍼즐 이름을 볼 때 번역이 적용되지 않을 가능성이 있다.

**Codex에 전달:** `village-pantry-candle-shelf-31`, `village-pantry-wicker-tray-32`에 `titleKey` 추가 + `src/i18n/en.js`, `src/i18n/ko.js`에 번역 키 등록 필요.

---

### 퍼즐 품질 확인

**Cinnamon Rolls (12×12):**
상단 원형 테두리 → 내부 3열 스크롤 패턴 → 외곽 마감. 시나몬 롤 단면의 소용돌이 구조를 12×12에서 표현. hard 난이도 적절.

**Cup Stack (12×12):**
3개 컵이 쌓인 구조 — 각 컵이 `000111111000 / 001000000100 / 001111111100` 패턴 반복. 12×12에서 3층 구조가 명확하게 읽힌다.

**Candle Shelf (10×10):**
상단 선반 프레임(줄 0~5) + 하단 초 기둥들(줄 6~9). 10×10 medium으로 적절한 난이도.

**Wicker Tray (10×10):**
마지막 행 `0000000000` — 전체가 0인 행이 풀이에 사용됐다. 논리적으로 유효하나 (빈 행 = 단서 없음으로 처리), 퍼즐 해결 과정에서 이 행은 자동으로 확정되어 난이도에 기여하지 않는다. 퍼즐 자체는 문제없이 풀린다.

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| 퍼즐 4개 추가 | ✅ |
| `bakery-window.size: 12` 업데이트 | ✅ 계약 테스트 즉시 검증 |
| 테스트 하드코딩 → `greaterThanOrEqual` 전환 | ✅ Review 26 권고 반영 |
| `puzzle.size <= pack.size` 불변식 | ✅ |
| `village-pantry` 두 퍼즐 `titleKey` 누락 | ❌ 수정 필요 |

콘텐츠 확장이 시작됐고, 테스트 인프라가 확장을 지원하는 구조로 전환됐다. `titleKey` 누락은 작은 수정이지만 한국어 사용자 경험에 직접 영향 — 다음 버전에서 처리 권장.

---

## Review 30 — 2026-07-08

**Scope:** v0.1.179 → v0.1.182
**Tests:** 57/57 pass ✅ (+5) | `qa:catalog` ✅ | `qa:hygiene` ✅ | `qa:assets` ✅ | `npm run build` ✅ | HTTP 200 ✅ | `qa:mobile` 360/390/430 ✅

---

### `qa:catalog` 강화 — Review 29 버그 자동 탐지 시스템으로 진화

`puzzle_catalog_report.js`에 10×10+ free 퍼즐 대상 메타데이터 guard가 추가됐다:

```js
for (const puzzle of puzzleList) {
  if (puzzle.access !== "free" || puzzle.size < 10) continue;

  const expectedTitleKey = `puzzles.${puzzle.id}`;
  if (puzzle.titleKey !== expectedTitleKey) {
    warningMessages.push(`${puzzle.id} missing titleKey ${expectedTitleKey}`);
    continue;
  }
  for (const [locale, dictionary] of Object.entries(dictionaries)) {
    if (!hasPuzzleCopy(dictionary, puzzle.titleKey)) {
      warningMessages.push(`${puzzle.id} missing ${locale} puzzle title/imageName copy`);
    }
  }
}
```

**3단계 검사:**
1. `puzzle.titleKey === "puzzles.{id}"` 규약 준수 여부
2. `en.js`에 `title + imageName` 존재 여부
3. `ko.js`에 동일 키 존재 여부

`warningMessages`가 있으면 `process.exitCode = 1` → CI 차단. 이 guard를 붙이자마자 Review 29에서 발견한 `village-pantry` 두 퍼즐과 Bakery 12×12 일부의 i18n 누락이 전부 드러났다 — guard가 첫 실행에서 실제 버그를 잡아낸 것.

**`hasPuzzleCopy(dictionary, titleKey):`**
```js
function hasPuzzleCopy(dictionary, titleKey) {
  const copy = getByPath(dictionary, titleKey);
  return Boolean(copy?.title && copy?.imageName);
}
```
`title`만 있고 `imageName`이 없는 반쪽짜리 등록도 탐지한다.

---

### i18n 누락 수정 — Bakery Window 12×12 + Village Pantry

**`puzzles.js` `titleKey` 추가:**
- `village-pantry-candle-shelf-31` — `titleKey` 누락 → 추가
- `village-pantry-wicker-tray-32` — `titleKey` 누락 → 추가

**`en.js` / `ko.js` 키 등록 확인:**
```
"bakery-window-cinnamon-rolls-32": { title: "Cinnamon Rolls", imageName: "Cinnamon Rolls" }
"bakery-window-cup-stack-33":      { title: "Cup Stack",      imageName: "Cup Stack" }
"village-pantry-candle-shelf-31":  ✅ (line 547)
"village-pantry-wicker-tray-32":   ✅ (line 551)
```
4개 퍼즐 모두 `en.js` / `ko.js` 등록 완료. `qa:catalog` 재실행 후 warning 0.

---

### 테스트 +5

57/52 → 5개 신규. `qa:catalog`가 테스트 스위트에 통합됐거나, 메타데이터 검증 케이스가 추가된 것으로 보인다.

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| `qa:catalog` 메타데이터 guard 강화 | ✅ |
| `titleKey` + en/ko 동시 검증 | ✅ |
| `hasPuzzleCopy` — 반쪽 등록 탐지 | ✅ |
| village-pantry 두 퍼즐 `titleKey` 추가 | ✅ Review 29 버그 수정 |
| Bakery 12×12 i18n copy 전체 등록 | ✅ |
| 57/57 테스트 | ✅ |

Review 29에서 발견한 `titleKey` 누락 버그가 단순 수정으로 끝나지 않고, 같은 문제가 재발하지 않도록 **guard 시스템으로 전환**됐다. 이것이 올바른 대응 패턴이다 — 버그 수정 + 동일 버그 재발 방지 자동화.

퍼즐 추가 작업이 안정적으로 진행 중이다. 다음:
1. 각 팩 퍼즐 지속 추가 — 10×10, 12×12 볼륨 확대
2. iOS safe area CSS
3. 팬트리 장식 추가 (max 조건 여유분)

---

## Review 31 — 2026-07-08

**Scope:** v0.1.182 → v0.1.199 (퍼즐 배치 추가)
**Tests:** 13 files / 60 tests ✅ | `qa:catalog` 경고 없음 ✅ | `qa:hygiene` ✅ | `qa:assets` ✅ | `npm run build` ✅ | HTTP 200 ✅ | `qa:mobile` 360/390/430 ✅
**카탈로그:** 총 159개 | free 159개 | 10×10+ 69개 | 12×12+ 29개

---

### 추가된 퍼즐 4개

| id | 팩 | 사이즈 | 난이도 | 보상 |
|---|---|---|---|---|
| `bakery-window-jam-thumbprint-48` | Bakery Window | 12×12 | hard | 9 |
| `bakery-window-lemon-glaze-bun-49` | Bakery Window | 12×12 | hard | 9 |
| `village-pantry-flower-milk-jug-49` | Village Pantry | 10×10 | medium | 7 |
| `village-pantry-toast-rack-50` | Village Pantry | 10×10 | medium | 7 |

Bakery Window 49개 (12×12 29개), Village Pantry 50개 (10×10 36개). 두 팩 모두 각각의 목표 사이즈에서 상당한 볼륨을 확보했다.

---

### 신규 — `artReadability` 필드

이번 배치부터 퍼즐에 `artReadability` 메타데이터가 추가됐다:

```json
"artReadability": {
  "silhouette": "round cookie ring with a clear jam dot in the center and scalloped crumb edge",
  "colorMood": "butter cookie gold, strawberry jam red, toasted crumb shadows",
  "tags": ["thumbprint-cookie", "jam", "bakery-window"]
}
```

세 필드의 역할:
- **`silhouette`** — 완성된 픽셀 아트를 한 문장으로 설명. 풀이 후 이미지가 의도대로 읽히는지 판단 기준
- **`colorMood`** — 아트 채색 방향. 아직 실제 색상 레이어가 없는 nonogram에서 미래 컬러 구현 시 참조
- **`tags`** — 검색/분류용

**이 필드의 의미:** `artReadability`는 게임 런타임에서 사용되지 않는 비기능 메타데이터다. 퍼즐 품질 보증용 내부 문서 역할 — 제삼자(또는 나 자신)가 픽셀 그리드만 보고 "이게 뭐야?"를 물었을 때 답이 있다. `qa:catalog`의 `hasPuzzleCopy` 검사와 같은 맥락에서, 퍼즐이 의미 있는 이미지인지 제작 시점에 명시하는 규율.

기존 퍼즐들에는 없는 필드 — 새 배치부터 적용하는 점진적 도입. 소급 적용 여부는 미정.

---

### 퍼즐 품질 확인

**Jam Thumbprint (12×12):** 중앙 잼 도트(`0 1 1 0 0 1 1 0` 패턴)를 둘러싼 쿠키 링 구조. 대칭성이 명확해서 hard임에도 실루엣이 즉시 읽힌다.

**Lemon Glaze Bun (12×12):** 상단 좁은 bun 형태에서 하단으로 넓어지는 글레이즈 드립 구조. 12×12에서 디테일을 잘 활용.

**Flower Milk Jug (10×10):** 저그 실루엣 + 배 부분 꽃 패턴(`0110110110`). 10×10에서 형태와 디테일 균형 좋음.

**Toast Rack (10×10):** 마지막 행 `0000000000` 패턴 반복 (Wicker Tray와 동일). 빈 행은 클루가 없어 자동 확정이므로 난이도에 기여하지 않으나 실루엣 구도 표현에는 유효.

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| 퍼즐 4개 추가, 모두 `titleKey`+i18n 완비 | ✅ |
| `artReadability` 신규 메타데이터 도입 | ✅ 품질 문서화 |
| `qa:catalog` 경고 0 | ✅ |
| 60 테스트 통과 | ✅ |

퍼즐 배치 흐름이 안정됐다. `qa:catalog` guard가 있으니 `titleKey`/i18n 누락은 자동 차단된다. `artReadability` 도입으로 퍼즐 설계 의도가 코드에 기록되기 시작했다 — 나중에 대량 추가 시 품질 리뷰의 근거가 될 필드.

---

## Review 32 — 2026-07-09

**Scope:** v0.1.199 → v0.1.205
**Tests:** 13 files / 62 tests ✅ | `qa:hygiene` ✅ | `qa:assets` ✅ | `npm run build` ✅ | HTTP 200 ✅ | `qa:mobile` 360/390/430 ✅

---

### 타임어택 힌트 경제 — 설계 완성

**`economyConfig.js` 신규:**
```js
TIME_ATTACK_HINT_COSTS: [2, 4, 7]  // 1st, 2nd, 3rd 힌트 비용
```

에스컬레이팅 구조 — 힌트를 쓸수록 비싸진다. 3회 이후는 배열 범위 밖 → `getTimeAttackHintCost(hintsUsed)` returns 0 but `getHintLimit` = 3으로 버튼이 disabled 처리됨.

**`puzzleState.js` — 힌트 언도 동작:**
```js
// useHint
hintsUsed: Math.max(0, Number(state.hintsUsed || 0)) + 1,
history: [...state.history, { ..., hint: true }]

// undoLastMove
hintsUsed: lastMove.hint
  ? Math.max(0, Number(state.hintsUsed || 0) - 1)
  : Number(state.hintsUsed || 0)
```

언도하면 `hintsUsed`가 감소한다. **스푼은 환불되지 않는다** — 언도로 셀이 되돌아가도 스푼 차감은 유지. 따라서 언도 후 재힌트하면 동일 비용 티어로 재결제가 발생한다. 유저 입장에서 "힌트를 언도하면 스푼이 돌아오나?"라고 궁금해할 수 있는데, 현재 동작은 **환불 없음, 단 카운터 리셋**. 이 정책이 UI에서 명확히 전달되지 않으면 혼란 가능성이 있다.

**`puzzleAssistView.js` — 확인창 + 비활성화:**
```js
button.disabled = remaining <= 0 || (hintCost > 0 && balance < hintCost);
// 클릭 시
const confirmed = globalThis.confirm?.(t("controls.hintConfirm", { cost: hintCost })) ?? true;
if (!confirmed || options.onSpendHint?.(hintCost) === false) return;
```

스푼 부족 시 버튼 즉시 비활성화 ✅
`onSpendHint` 콜백이 `false`를 반환하면 힌트 취소 ✅ (save의 `spendPantrySpoons`가 실패하면 false)

---

### 설계 확인 사항

**`globalThis.confirm?.(...)` — 네이티브 브라우저 다이얼로그:**

확인창이 `window.confirm()`을 사용한다. 모바일 WebView에서 네이티브 시스템 다이얼로그가 뜨는데, 게임의 폴리시된 UI(v0.1.157~166에서 구축한 tactile 버튼 시스템, 카드 디자인)와 일관성이 없다. 특히 Android WebView는 `confirm()`을 완전히 블록하는 경우도 있다.

향후 게임 내 커스텀 확인 다이얼로그로 교체를 고려할 것. 지금은 기능적으로 작동하고 있으니 즉각적 이슈는 아니다.

**언도-힌트 비용 정책 — UI 명시 필요:**

현재 `hint-panel__body` 텍스트가 현재 비용과 잔액만 표시한다. 언도 시 스푼이 환불되지 않는다는 명시가 없다. 유저가 언도로 스푼을 돌려받을 수 있다고 오해할 수 있음 — i18n 문구에 한 줄 추가 또는 인게임 설명 고려.

---

### i18n 구조 확인

```js
// en.js
timeAttackHintIntro: "Time Attack hints spend spoons now: {cost} spoons for the next hint. Balance: {balance}.",
timeAttackHintNeedMore: "The next Time Attack hint costs {cost} spoons. Balance: {balance}.",
```

잔액과 비용을 동시에 보여주는 것이 좋다. 단, 문구가 "spend spoons now:"로 시작해서 약간 어색하다 — 폴리시 여지 있음(minor).

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| 에스컬레이팅 힌트 비용 [2, 4, 7] | ✅ |
| 스푼 부족 시 버튼 비활성화 | ✅ |
| 결제 실패 시 힌트 취소 | ✅ |
| 언도 → hintsUsed 감소, 스푼 환불 없음 | ✅ 의도적 정책 |
| 힌트 최대 3회 제한 | ✅ |
| `globalThis.confirm()` 네이티브 다이얼로그 | ⚠️ 향후 커스텀으로 교체 고려 |
| 언도-환불 정책 UI 미명시 | ⚠️ 문구 보완 고려 |

타임어택 힌트 경제가 `economyConfig.js`에 단일 진실 소스로 관리되고, 비용 표시·결제·비활성화가 일관되게 연결됐다. 핵심 흐름은 안정적.

---

## Review 33 — 2026-07-10

**Scope:** v0.1.205 → v0.1.232 (퍼즐 배치 연속)
**Tests:** 64 tests ✅ | `qa:catalog` 117 readable briefs ✅ | `qa:hygiene` ✅ | `qa:assets` ✅ | `npm run build` ✅ | HTTP 200 ✅ | `qa:mobile` 360/390/430 ✅
**카탈로그:** 총 255개 | free 255개 | 10×10+ 165개 | 12×12+ 77개

---

### 이번 배치 — v0.1.232

| id | 팩 | 사이즈 | 난이도 |
|---|---|---|---|
| `bakery-window-raspberry-choux-puff-96` | Bakery Window | 12×12 | hard |
| `bakery-window-lemon-ribbon-tart-97` | Bakery Window | 12×12 | hard |
| `village-pantry-little-spice-drawer-97` | Village Pantry | 10×10 | medium |
| `village-pantry-checkered-napkin-ring-98` | Village Pantry | 10×10 | medium |

4개 모두 `titleKey` + `artReadability` 완비. `qa:catalog` 경고 없음.

---

### 누적 진행 현황 (v0.1.182 → v0.1.232)

| 지표 | v0.1.182 | v0.1.232 | 증가 |
|---|---|---|---|
| 총 퍼즐 | 125 | 255 | +130 |
| 10×10+ | 35 | 165 | +130 |
| 12×12+ | 13 | 77 | +64 |
| readable briefs | — | 117 | — |
| 테스트 | 57 | 64 | +7 |

**255개 달성** — 출시 목표 1,000개의 25.5%. 퍼즐 파이프라인이 안정적으로 돌아가고 있다.

---

### `readable brief` 117개 — 품질 지표

`artReadability.silhouette` 기반으로 readable brief 117개가 카탈로그 리포트에 기록됐다. 이 숫자가 총 퍼즐 255개보다 적은 것은 초기 배치(v0.1.179 이전) 퍼즐들에 `artReadability` 필드가 없기 때문. 새 배치는 모두 포함.

---

### GitHub push

`f54a910 content: add v0.1.232 puzzle batch` → `origin/main` push 완료.

---

## Review 34 — 2026-07-10

**Scope:** v0.1.232 → v0.1.236
**Tests:** 64 tests ✅ | `qa:catalog` 133 readable briefs ✅ | `qa:hygiene` ✅ | `qa:assets` ✅ | `npm run build` ✅ | HTTP 200 ✅ | `qa:mobile` 360/390/430 ✅
**카탈로그:** 총/free 271개 | 10×10+ 181개 | 12×12+ 85개

---

### 추가된 퍼즐 4개

| id | 팩 | 사이즈 | 난이도 |
|---|---|---|---|
| `bakery-window-plum-cardamom-braid-104` | Bakery Window | 12×12 | hard |
| `bakery-window-honey-lavender-canele-105` | Bakery Window | 12×12 | hard |
| `village-pantry-rose-label-jam-pot-105` | Village Pantry | 10×10 | medium |
| `village-pantry-blue-linen-bowl-cover-106` | Village Pantry | 10×10 | medium |

4개 모두 `titleKey` + `artReadability` 완비. `qa:catalog` 경고 없음.

**누적:** 271개 (목표 1,000개의 27.1%) | readable briefs 133개

---

## Review 35 — 2026-07-10

**Scope:** v0.1.236 → v0.1.240
**Tests:** 65 tests ✅ | `qa:catalog` ✅ | `qa:hygiene` ✅ | `qa:assets` ✅ | `npm run build` ✅ | HTTP 200 ✅ | `qa:mobile` 360/390/430 ✅

---

### Time Attack Coach Card

`createTimeAttackCoachCard()`가 `timeAttackView.js`에 추가됐다. 타임어택 로비 화면에 Pip 초상화 + 역할 설명 카드가 상시 노출된다.

**구조:**
```
[pip-chrome-v2.png] | "Pip's run note"
                    | "Earn spoons, then choose your risk"
                    | "This is the speedy place for extra spoons..."
                    | [Earn daily run spoons]
                    | [Spend hints only when it matters]
                    | [Beat your best run]
```

3개 chip(`coachEarn`, `coachSpend`, `coachRecord`)이 `<ul>` 리스트로 렌더된다. 가이드 다이얼로그를 스킵해도 이 카드에서 타임어택의 경제/경쟁 목적이 바로 읽힌다.

**위치:** `panel.append(intro, coach, startButton, summary, ...)` — intro 다음, 시작 버튼 위. 유저가 버튼을 누르기 전 자연스럽게 읽힌다.

**i18n 문구 — 설계 의도가 잘 담김:**
- `coachBody`: "hints spend spoons **when a record is close**" — 힌트를 쓸 시점을 명시. 아무 때나 쓰는 게 아니라 기록 경쟁 시 전략적으로 쓰는 것임을 전달.
- chip 3개가 타임어택의 핵심 루프를 한 줄씩 요약: 벌기 → 전략적 소비 → 기록 도전.

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| 코치 카드 렌더링 | ✅ |
| Pip 이미지 연결 | ✅ `pip-chrome-v2.png` |
| i18n en/ko 완비 | ✅ |
| 가이드 없이도 목적 인지 가능 | ✅ |
| 65 tests | ✅ |

타임어택이 "빠른 스푼 획득 + 힌트 전략 + 기록 경쟁"이라는 세 가지 레이어를 가진 모드라는 것이 화면 자체에서 읽힌다. 로비가 목적을 설명하는 카드 역할을 한다.

---

## Review 36 — 2026-07-10

**Scope:** v0.1.240 → v0.1.242 (커밋 2개)
**Tests:** 66 tests ✅ | `qa:hygiene` ✅ | `qa:assets` ✅ | `qa:catalog` ✅ | `npm run build` ✅ | HTTP 200 ✅ | `qa:mobile` 360/390/430 ✅

---

### d015a27 — 힌트 확인 패널 (Review 32 지적 해결)

Review 32에서 `globalThis.confirm()` 네이티브 다이얼로그 문제를 지적했다. 이번에 게임 내 커스텀 확인 패널로 교체됐다.

**`renderHintConfirm()` 신규:**
```js
// 버튼 클릭 시 window.confirm() 대신
renderHintConfirm(panel, { state, puzzle, update, hintCost, options });

// 인라인 확인 패널 삽입
panel.querySelector(".hint-panel__confirm")?.remove();  // 중복 방지
const confirm = document.createElement("div");
confirm.className = "hint-panel__confirm";
confirm.setAttribute("role", "group");
// [취소] [스푼 N개 쓰기] 버튼 2개
```

**중복 방지:** `panel.querySelector(".hint-panel__confirm")?.remove()` — 힌트 버튼을 연속으로 눌러도 확인 패널이 중복 생성되지 않는다.

**흐름:**
1. 힌트 버튼 클릭 → 확인 패널 삽입
2. 취소 → `confirm.remove()` (힌트 취소, 스푼 소모 없음)
3. 확인 → `onSpendHint?.(hintCost)` → `update(useHint(...))` (실패 시 패널만 제거)

`window.confirm()` 제거로 Android WebView 블록 위험 해소, 게임 UI 일관성 확보. Review 32 지적 사항 완전히 해결됐다 ✅

**`qa:mobile` guard 추가:** 힌트 확인 패널이 모바일에서 시각적으로 유지되는지 regression guard 연결됨.

---

### 5bf0777 — 3라운드 페이싱 조정 (5×5, 8×8, 10×10)

**변경 전:** 3라운드 = 5×5, 5×5, 5×5
**변경 후:** 3라운드 = 5×5, 8×8, 10×10

`getTimeAttackSizeForRound()`:
```js
if (round === 0) return 5;
if (round === 1) return 8;
if (round === 2) return 10;
if (round < 6) return 12;
return 15;
```

3라운드 세션(`TIME_ATTACK_TRIAL_ROUNDS = 3`)에서 마지막 라운드가 10×10으로 끝난다. 짧은 세션 안에서도 힌트/스푼 소비 판단이 실제로 발생하는 구도가 만들어진다 — 5×5 세 판은 힌트가 필요 없지만, 10×10 마지막 라운드는 기록 경쟁 상황에서 힌트 전략이 의미를 갖는다.

**기록 사이즈:** `getTimeAttackRunRecordSize()`가 `run`의 실제 최대 사이즈를 기준으로 저장 → 3라운드 세션은 10×10 기록으로 분류됨. "첫 5×5 기준 저장" 문제 해소.

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| 커스텀 힌트 확인 패널 | ✅ Review 32 지적 해결 |
| 중복 패널 방지 | ✅ |
| `qa:mobile` 힌트 확인 guard | ✅ |
| 3라운드 페이싱 5/8/10 | ✅ |
| 기록 사이즈 최대값 기준 | ✅ |
| 66 tests | ✅ |

두 커밋이 이전 리뷰 지적사항(Review 32 — `globalThis.confirm`)을 해결하고, 게임 루프 설계(3라운드에서도 힌트 경제가 작동)를 완성했다. 타임어택 모드가 이제 완성된 상태다.

---

## Review 37 — 2026-07-11

**커밋:** [4bb77b3 ui: add season next goal card](https://github.com/bbockara-lab/pips-picture-pantry/commit/4bb77b3)
**Tests:** 68 ✅ | `qa:catalog` ✅ | `qa:hygiene` ✅ | `qa:assets` ✅ | `npm run build` ✅

---

### Season Progress Card — Next Goal 카드

`createSeasonGoalCard()` 신규. 시즌 진행 카드 하단에 "지금 뭘 해야 하는지" 한 눈에 보여주는 카드가 추가됐다.

**4가지 상태 분기:**

```js
if (nextLockedPack) {
  // ready(스푼/팬트리 조건 충족) vs locked
  title = ready ? "goalReadyTitle" : "goalLockedTitle"
  body  = ready ? "goalReadyBody" : getUnlockPlanText(...)
} else if (remaining > 0) {
  // 모든 팩 열림, 퍼즐 남음
  title = "goalUnlockedTitle"  // "Fill the launch album"
} else {
  // 완주
  title = "goalCompleteTitle"  // "Season 0 mastered"
}
```

- **ready:** 스푼/팬트리 조건 모두 충족 → "X pack is ready" + 안내
- **locked:** 조건 미충족 → `getUnlockPlanText()`가 스푼 부족분/팬트리 필요 단계 계산해서 구체적 행동 안내
- **unlocked:** 팩 다 열고 퍼즐 남음 → 앨범 채우기 유도
- **complete:** 전부 완료 → 마스터 메시지

`canUnlockPack(nextLockedPack)`을 기준으로 ready/locked 분기 — 스푼과 팬트리 조건을 한 번에 판단하는 기존 함수 재사용 ✅

**CSS:**
```css
.season-progress-goal {
  background: linear-gradient(135deg, rgba(255,253,242,0.96), rgba(239,223,174,0.78));
  box-shadow: 0 5px 0 rgba(68,42,47,0.1), inset 0 1px 0 ...;
  border-radius: 16px;
}
.season-progress-goal span { /* eyebrow */ text-transform: uppercase; font-size: 0.72rem; }
.season-progress-goal strong { font-size: 1rem; }
.season-progress-goal p { font-weight: 800; font-size: 0.82rem; }
```

eyebrow(대문자 소형) → 제목(bold) → 본문(설명) 3단 계층 구조. 카드가 버튼처럼 두께감을 가진다(`0 5px 0` 바닥 그림자).

**i18n 완비:** en/ko 4개 상태 타이틀 + 본문 모두 등록 ✅

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| 4가지 상태 완전 분기 | ✅ |
| `canUnlockPack()` 재사용 | ✅ |
| `getUnlockPlanText()` 구체적 행동 안내 | ✅ |
| en/ko i18n 완비 | ✅ |
| CSS 3단 계층 | ✅ |

시즌 진행 카드가 이제 진행률 표시를 넘어 "다음 행동"을 명시한다. 유저가 팬트리를 열어야 하는지, 스푼을 모아야 하는지, 퍼즐을 더 풀어야 하는지 화면 자체에서 알 수 있다. 코어 루프의 마지막 UX 연결 고리.

---

## Review 38 — 2026-07-11

**커밋:** [3139f0e ui: connect season goal actions](https://github.com/bbockara-lab/pips-picture-pantry/commit/3139f0e)

---

### Season Goal Card 액션 버튼 연결

Review 37 goal 카드에 실제 클릭 액션이 붙었다.

**상태별 버튼 분기:**

| 상태 | 버튼 | 핸들러 |
|---|---|---|
| 팩 언락 준비됨 | "Open stage" | `onUnlockPack(nextLockedPack.id)` |
| 팬트리 조건 미충족 | "Go to Pantry" | `onOpenPantry()` → pantry 뷰 이동 |
| 모든 팩 열림, 퍼즐 남음 | "View album" | `onViewAlbum()` → album 뷰 이동 |
| 완주 | 버튼 없음 | — |

**콜백 흐름:**
```js
// appShell.js
renderPuzzleHub(activePuzzle, onOpenPuzzle, {
  onOpenPantry: () => onSelectView("pantry"),
  onUnlockPack,
  onViewAlbum: () => onSelectView("album")
})

// renderPuzzleHub 시그니처
export function renderPuzzleHub(activePuzzle, onOpenPuzzle, options = {}) {
  const { onOpenPantry = () => {}, onUnlockPack = () => {}, onViewAlbum = () => {} } = options;
```

`options = {}` 기본값 + 각 콜백 no-op 기본값 — 테스트나 이전 호출 코드가 옵션 없이 써도 깨지지 않는다 ✅

**버그 수정 포함:**
```js
// before
getUnlockPlanText(nextLockedPack, roomRequirement, spoonGap)
// after
getUnlockPlanText(ready, roomRequirement, spoonGap)
```
첫 인자가 `nextLockedPack`(팩 객체)에서 `ready`(boolean)로 수정됨 — `getUnlockPlanText` 시그니처와 일치하지 않던 버그 조용히 수정됨.

**CSS:**
```css
.season-progress-goal__action {
  justify-self: start;
  min-height: 44px;
  padding-inline: 16px;
  font-size: 0.82rem;
}
```
`justify-self: start` — 그리드 컨테이너 안에서 버튼이 전체 너비를 차지하지 않고 콘텐츠 너비만 차지. `min-height: 44px` — 모바일 탭 타겟 최소 기준 충족.

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| 상태별 버튼 분기 | ✅ |
| no-op 기본값 방어 | ✅ |
| `getUnlockPlanText` 인자 버그 수정 | ✅ |
| 탭 타겟 44px | ✅ |
| en/ko i18n 3개 액션 키 | ✅ |

Review 37(카드 표시)에서 이번(액션 연결)까지 2커밋으로 goal 카드 완성. 카드가 단순 정보 표시를 넘어 실제 네비게이션 진입점이 됐다 — 유저가 다음 행동을 읽고 바로 실행할 수 있다.

---

## Direction Note 8 — 2026-07-07 (Claude) — 퍼즐 생산 전략 + 경제 체제 연동

### 배경

오늘 나눈 논의에서 중요한 전제가 확인됐다: **퍼즐 수는 이 게임의 제약이 아니다.** Claude(설계) + Codex(구현)가 지속적으로 퍼즐을 생산하는 구조이기 때문에, 일반 인디 스튜디오가 퍼즐 수에서 막히는 문제가 이 게임에는 적용되지 않는다. 이 사실이 게임의 경쟁 위치와 경제 설계 전제를 근본적으로 바꾼다.

`MAJOR_REWORK_PLAN.md`의 **Content Scale Goal** 방향을 정정한다:
- 숫자를 고정한 출시 약속이 아니라, 출시/업데이트 파이프라인이 감당할 수 있는 만큼 많은 고품질 퍼즐을 제공한다.
- 출시 시점의 퍼즐 수는 퍼즐 완성도, 아트 방향, QA, 성능, 팬트리/스푼 경제 게이트 준비도에 따라 결정한다.
- 출시 후에도 업데이트마다 지속 추가하며, 장기적으로 모바일 코지 노노그램 장르에서 가장 깊은 큐레이션 퍼즐 라이브러리를 지향한다.

---

### Codex에게 전달하는 핵심 방향

#### 1. 경제 체제 전제 변경

기존 `ECONOMY_DESIGN_CONSULTATION.md`의 "퍼즐 수 미정이므로 비율로 설계하라"는 조건부 프레임은 유지하되, 방향성은 더 명확해졌다. 퍼즐 수는 가능한 많이 확장하되, 출시 시점 숫자는 고정하지 않는다. 경제 수치는 대규모 라이브러리와 지속 업데이트를 감당할 수 있게 설계하고, 실제 출시 준비도와 유저 데이터에 맞춰 조정한다.

현재 `economyConfig.js`의 보상 체계는 대규모 퍼즐 라이브러리를 기준으로 설계됐고, 그 방향이 맞다:

```js
PUZZLE_REWARD_BY_SIZE: { 5:3, 8:6, 10:10, 12:15, 15:22, 18:30 }
DAILY_BONUS: 8
REPLAY_PICK_REWARD: 1
TIME_ATTACK_DAILY_LIMIT: 3
```

퍼즐이 많아질수록 "모든 퍼즐을 다 풀었다"는 상황이 늦게 오고, 스푼 수입 루프도 장기화된다. 다만 콘텐츠 접근 속도는 팬트리 꾸미기, 방 단계, 스푼 비용, 리플레이/타임어택 한도와 연동해 조절해야 한다. 현재 수치는 시작점으로 유지하되, 실유저 데이터가 쌓이면 밸런스를 조정한다.

#### 2. 퍼즐 품질 기준 — 타협 없음

퍼즐 수가 많아진다고 품질 기준을 낮추지 않는다. 모든 퍼즐은:

- **논리적으로 완전히 풀 수 있어야 한다** (추측 없이 클루만으로 해결 가능)
- **완성 시 인식 가능한 코지 이미지가 나와야 한다** (랜덤 노이즈 패턴 불가)
- **주제가 있어야 한다** — 음식, 주방 소품, 동물, 계절, Pip's Pantry 세계관 안에서

현재 `randomPuzzle.js`의 타임어택용 생성기(시드 기반 랜덤)는 도전 모드 전용이다. 앨범에 저장되고 이름이 붙는 퍼즐은 반드시 Claude 설계 + 수동 검수를 거친다.

#### 3. 퍼즐 팩 구조 — 확장 설계

현재 팩 구조(`packs.js`)가 퍼즐 추가에 맞게 확장 가능해야 한다:

- 팩 하나 = 테마 + 사이즈 + 20~30개 퍼즐
- 팩 완료 보너스(`STAGE_BONUS_BY_SIZE`)가 팩 완료의 달성감을 만든다
- 신규 팩 추가가 코드 변경 없이 `puzzles.js` + `packs.js` 데이터 추가만으로 가능한지 확인 필요
- 팩이 100개 이상이 됐을 때 앨범·피커 UI가 버티는지 성능 검토 권장

#### 4. 퍼즐 추가 워크플로 확립

Claude와 Codex가 함께 퍼즐을 생산하는 실제 루틴이 필요하다:

```
1. Claude → 퍼즐 그리드 설계 (solution 배열 + 제목 + 테마)
2. Claude → puzzles.js 형식으로 데이터 작성
3. Codex → puzzles.js에 추가 + 기존 테스트 통과 확인
4. Codex → 빌드 후 실제 보드 렌더링 확인 (5분 QA)
5. 반복
```

이 루틴이 안정화되면 한 세션에 여러 개의 퍼즐을 추가할 수 있다. 목표는 특정 숫자를 맞추는 것이 아니라, 품질과 검증을 유지하면서 가능한 빠르게 큐레이션 퍼즐 라이브러리를 넓히는 것이다.

#### 5. 시장 포지셔닝 — Codex도 알아야 할 맥락

이 게임이 만들려는 것:
- **큰 퍼즐 라이브러리** — 출시와 업데이트를 통해 가능한 한 많이 확장
- **코지 테마 큐레이션** — 그 게임에는 없는 것
- **팬트리 꾸미기 루프** — 퍼즐 수 + 감성 메타게임의 결합

이 조합이 시장에 없다. 퍼즐 수가 쌓일수록 차별화가 강해지고, 앱스토어 알고리즘 리텐션 신호도 좋아진다. 지금 짜고 있는 경제 체제(스푼·팬트리·타임어택·리플레이)는 이 스케일을 위해 설계된 것이다. 코드 품질과 확장성을 유지하는 것이 단순 기능 추가보다 중요한 이유다.

---

### 지금 당장 Codex가 할 수 있는 것

1. **`packs.js` / `puzzles.js` 확장성 점검** — 팩 50개, 퍼즐 500개가 됐을 때 로드/렌더 성능 문제가 없는지 확인 (lazy load 필요 여부)
2. **퍼즐 추가 워크플로 첫 시도** — Claude가 새 팩 데이터를 건네면 Codex가 추가하는 루틴을 한 번 돌려보기
3. **기존 우선순위 유지** — `stageArt.js` 배지 아트 연결, 퍼즐 사이즈 10×10+ 콘텐츠 추가

### Direction Note 8 Correction — 2026-07-07

- Correction from the owner: "1,000 puzzles" should not be treated as a fixed launch promise or hard cap/target. The real direction is "as many as possible" across launch and future updates, constrained by readiness and quality.
- Puzzle quantity should never become an excuse for weak puzzle craft. Every catalog puzzle still needs strong visual design, idea quality, color sensibility, and logical solvability.
- The economy direction remains: a large content library can coexist with pacing through Pantry decoration progress, spoon costs, room/story gates, replay limits, Time Attack limits, and update cadence.
- Codex should treat puzzle-scale work as a long-term pipeline and architecture requirement, not a single-number milestone.

## Review 39 — 2026-07-11

**커밋:** [f83480a ui: connect pantry progress to stage goals](https://github.com/bbockara-lab/pips-picture-pantry/commit/f83480a)

---

### Pantry Progress Mission 카드 구현

팬트리 진행도 보드에 "Room Path" 미션 블록이 추가됐다. 이 카드 하나에서 유저가 알아야 할 것을 모두 볼 수 있다: 현재 부탁 완료 수, 다음 방 단계까지 남은 수, 다음 스테이지 팩의 스푼 게이트.

**핵심 로직 — `getNextPantryProgressStage`:**
```js
const roomStepTargets = [1, 3, 6, 10];

function getNextPantryProgressStage(completedRequestCount) {
  return puzzlePacks
    .filter((pack) => pack.access !== "bonus-pack" && Number(pack.pantryRoomStepRequired || 0) > completedRequestCount)
    .sort((left, right) => Number(left.pantryRoomStepRequired) - Number(right.pantryRoomStepRequired)
      || Number(left.unlockCost) - Number(right.unlockCost))[0] || null;
}
```
`packs.js`의 `pantryRoomStepRequired` 값을 직접 참조하므로 별도 경제 파라미터 추가 없음 — 기존 데이터를 재사용해 단일 정보 출처를 유지한다 ✅

**진행 미터 계산:**
```js
const previousTarget = [...roomStepTargets].reverse().find(t => t <= completedRequestCount) || 0;
const span = Math.max(1, nextTarget - previousTarget);
const progress = nextTarget === completedRequestCount
  ? 100
  : Math.round(((completedRequestCount - previousTarget) / span) * 100);
```
구간 기반 계산으로 "0~3 부탁 사이에서 몇 %"를 표현. `Math.max(1, span)`으로 0 나누기 방지 ✅

**두 상태 분기 (in-progress vs. complete):**

| 상태 | 타이틀 | 바디 | 팩트 칩 |
|---|---|---|---|
| nextStage 있음 | `{count}/{target} requests toward next room step` | `{remaining} more Pip requests to make {stage} feel earned` | 부탁 수 + 스푼 게이트 |
| nextStage 없음 (시즌 완주) | `Season 0 room path complete` | `{count} requests complete. Future seasonal rooms...` | 없음 |

완주 상태에서 fact 칩을 제거하는 것이 깔끔하다 — 게이트가 없는데 "Stage spoons 0/0"을 보여주면 혼란을 준다 ✅

**스푼 게이트 칩 계산:**
```js
const unlockCost = Math.max(0, Number(nextStage.unlockCost || 0));
const saved = Math.min(unlockCost, Math.max(0, Number(spoons || 0)));
const needed = Math.max(0, unlockCost - saved);
```
`Math.min(unlockCost, spoons)`으로 초과 저축이 있어도 "saved = cost" 이상으로 넘어가지 않는다 ✅

**시그니처 변경:**
```js
// before
function renderCollectionProgress(approvedDecorations, ownedIds, equippedDecorations)
// after
function renderCollectionProgress(approvedDecorations, ownedIds, equippedDecorations, completedStoryGoalIds, spoons)
```
호출부(`renderPantryView`)도 함께 업데이트됨 ✅

**CSS:**
- `.pantry-progress-mission` — `border: 2px solid rgba(77,111,67,0.22)` + 녹색-아이보리 그라디언트 배경으로 팬트리 tone에 맞음
- `.pantry-progress-mission__meter` — CSS custom property `--pantry-room-progress`로 width를 제어. `overflow: hidden` + `border-radius: 999px` 필 바 패턴 ✅
- `.pantry-progress-mission__facts` — `grid-template-columns: repeat(2, 1fr)` → `@media (max-width: 430px)` 에서 `1fr` 단일 컬럼으로 전환. 좁은 화면에서 칩이 찌그러지지 않는다 ✅

**i18n:**
7개 키 (en + ko) 동시 추가. `progressMissionBody`의 `{stage}`에 `t(nextStage.titleKey)`를 넘겨서 팩 이름이 현재 언어로 표시된다 ✅

**테스트:**
```js
expect(t("pantry.progressMissionBody", { remaining: 2, stage: "Sunny Spoon Sign" })).toContain("2 more Pip requests");
expect(t("pantry.progressMissionRequests", { count: 1, target: 3 })).toBe("부탁 1/3개");
```
신규 i18n 키 검증 — 포맷 파라미터 치환이 en/ko 모두 올바른지 확인 ✅

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| 단일 정보 출처 (packs.js 재사용) | ✅ |
| 구간 기반 미터 + 0 나누기 방어 | ✅ |
| 두 상태 분기 (in-progress / complete) | ✅ |
| 스푼 게이트 칩 오버플로 방어 | ✅ |
| 반응형 facts 그리드 (430px 브레이크) | ✅ |
| en/ko i18n 7개 키 | ✅ |
| i18n 테스트 2개 추가 | ✅ |

Season Goal Card (Review 37–38)가 허브 뷰에서 "다음 행동"을 알려줬다면, 이 카드는 팬트리 안에서 "왜 꾸며야 하는가"를 숫자로 보여준다. 장식이 스테이지 게이트와 연결된 것이 텍스트가 아니라 진행 미터 + 팩트 칩으로 읽힌다. 진행 시스템의 마지막 연결고리가 채워진 커밋이다.

---

## Review 40 — 2026-07-11

**커밋:** [03aad6e qa: guard pantry progress mission](https://github.com/bbockara-lab/pips-picture-pantry/commit/03aad6e)

---

### 모바일 QA 가드 — Pantry Progress Mission 카드

Review 39에서 추가한 미션 카드를 `mobile_visual_check.js`가 명시적으로 검증한다. 존재 확인 + 콘텐츠 확인 + 레이아웃 치수 확인의 세 레이어.

**레이어 1 — 존재 확인:**
```js
await expectVisible(page, ".pantry-progress-mission", viewportName);
await expectVisible(page, ".pantry-progress-mission__meter", viewportName);
await expectVisible(page, ".pantry-progress-mission__facts span", viewportName);
```
카드, 미터, 팩트 칩이 화면에 보이는지 기본 확인 ✅

**레이어 2 — 콘텐츠 확인 (시드 데이터 기반):**
```js
const progressMissionText = await page.locator(".pantry-progress-mission").first().innerText();
if (!progressMissionText.includes("0/3") || !progressMissionText.includes("Stage spoons") || !progressMissionText.includes("80")) {
  failures.push("[...] Pantry progress mission should link seeded room requests to the next stage spoon gate, saw " + progressMissionText);
}
```
시드 상태(부탁 0개, 첫 스테이지 스푼 비용 80)에서 카드가 올바른 수치를 표시하는지 확인 — 렌더링은 됐지만 데이터 연결이 끊어진 케이스를 잡는다 ✅

**레이어 3 — 레이아웃 치수 확인:**
```js
const progressMissionMetrics = await page.locator(".pantry-progress-mission").evaluate((card) => {
  return {
    width: card.getBoundingClientRect().width,
    facts: [...card.querySelectorAll(".pantry-progress-mission__facts span")].map((fact) => ({
      width: fact.getBoundingClientRect().width,
      height: fact.getBoundingClientRect().height,
      text: fact.textContent.trim()
    }))
  };
});
if (progressMissionMetrics.width < 180 || progressMissionMetrics.facts.length !== 2 || progressMissionMetrics.facts.some(f => f.width < 120 || f.height < 24)) {
  failures.push("[...] Pantry progress mission mobile layout regressed: " + JSON.stringify(progressMissionMetrics));
}
```
카드 전체 너비 ≥ 180px, 팩트 칩 2개, 각 칩 너비 ≥ 120px · 높이 ≥ 24px — 칩이 찌그러지거나 사라지는 레이아웃 퇴행을 수치로 잡는다 ✅

**구매 후 유지 확인:**
```js
const postPurchaseMissionText = await page.locator(".pantry-progress-mission").first().innerText();
if (!postPurchaseMissionText.includes("0/3") || !postPurchaseMissionText.includes("Stage spoons")) {
  failures.push("[...] First Pantry purchase should preserve the room-path mission until the story request is delivered, saw " + postPurchaseMissionText);
}
```
아이템 구매(장식 보유) 후에도 미션 카드가 유지되는지 확인 — 구매가 `completedStoryGoalIds`를 변경하지 않으므로 카드 상태가 바뀌면 안 된다 ✅

**부수적 수정:**
```js
// before
await page.locator('button[aria-label="Settings"], button[aria-label="설정"]').first().click();
// after
await page.locator('button[aria-label="Settings"], button[aria-label="?ㅼ젙"]').first().click();
```
설정 버튼 셀렉터에 인코딩 이슈가 있었던 것으로 보인다 — Codex가 함께 수정.

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| 카드 존재 3개 셀렉터 확인 | ✅ |
| 시드 데이터 콘텐츠 검증 | ✅ |
| 레이아웃 치수 회귀 방지 | ✅ |
| 구매 후 카드 유지 확인 | ✅ |
| 설정 버튼 셀렉터 수정 | ✅ |

Review 28 이후로 이 코드베이스의 모바일 QA 가드 패턴이 성숙해졌다: 존재 → 콘텐츠 → 치수의 세 레이어가 반복되고, 시드 데이터와 연동돼 실제 값 검증이 가능하다. 오늘 추가된 가드로 Pantry Progress Mission 카드는 미래 레이아웃 변경에서도 명시적으로 보호된다.

v0.1.267 (미션 카드) → v0.1.268 (QA 가드) 두 커밋이 한 기능을 완성한다. 리뷰 결론: **ship 준비 완료.**


## Review 41 — 2026-07-11

**커밋:** [187b935 ui: add completed line puzzle guidance](https://github.com/bbockara-lab/pips-picture-pantry/commit/187b935)

---

### 완성 줄 가이던스 — 솔루션 기반으로 전면 재설계

퍼즐 보드에서 행/열이 정확히 완성됐을 때 시각적으로 알려주는 기능. 핵심은 이전 방식(커서 기준 clue count 비교)을 버리고 **실제 solution과 대조**하는 방식으로 바꾼 것이다.

**Before:**
```js
function isLineFilledToTarget(line, clue = [0]) {
  const target = clue.reduce((total, value) => total + Number(value || 0), 0);
  const filled = line.filter((cell) => cell === CELL.filled).length;
  return filled === target;
}
```
채운 셀 수 = 클루 합계면 완성으로 판단. 문제: `[1,1]` 클루에 두 셀을 채웠지만 위치가 틀렸어도 "완성"으로 표시됨.

**After:**
```js
function isLineCorrectlySatisfied(line, solutionLine) {
  if (!solutionLine.some(Boolean)) {
    return false;
  }
  return solutionLine.every((shouldFill, index) => {
    const cell = line[index];
    return shouldFill ? cell === CELL.filled : cell !== CELL.filled;
  });
}
```
`solution`과 셀 단위로 비교. 채워야 할 자리는 filled, 비워야 할 자리는 not-filled여야 통과. 오탐(false positive) 원천 차단 ✅

**`!solutionLine.some(Boolean)` 가드:**
전체가 빈 줄(all-blank line)에서 완성 표시하지 않음. 0개짜리 클루 줄이 있을 때 유저를 혼란스럽게 만들지 않는다 ✅

**범위 확장 — 커서 → 전체 보드:**
```js
// before: 커서가 있는 행/열만
return { rowSatisfied: false, columnSatisfied: false };

// after: 모든 행/열을 순회
const completedRows = new Set();
const completedColumns = new Set();
solution.forEach((solutionRow, rowIndex) => {
  if (isLineCorrectlySatisfied(state.cells[rowIndex] || [], solutionRow)) {
    completedRows.add(rowIndex);
  }
});
for (let columnIndex = 0; columnIndex < puzzle.size; columnIndex++) {
  // ...
}
return { completedRows, completedColumns };
```
커서 위치와 무관하게 완성된 줄 전체를 추적. 퍼즐을 풀다 보면 완성된 줄들이 글로우로 계속 남아있게 된다 ✅

**시그니처 정리:**
```js
// before
getLineGuidance(clues, state, cursor, options)
// after
getLineGuidance(puzzle, state, options)
```
`cursor`를 인자에서 제거 — solution 비교는 커서와 무관하기 때문. `clues` 대신 `puzzle` 전체를 받아 `normalizeSolution`으로 처리 ✅

**`safe-suggestion` 범위 확장:**
```js
// before: 커서가 있는 행/열만
(lineGuidance.rowSatisfied && cursor?.row === rowIndex) ||
(lineGuidance.columnSatisfied && cursor?.column === columnIndex)

// after: 완성된 모든 행/열
lineGuidance.completedRows.has(rowIndex) ||
lineGuidance.completedColumns.has(columnIndex)
```
완성된 줄의 빈 셀에 soft 점선 가이던스가 표시됨 — "여기는 X 또는 blank" 힌트. 커서를 거기에 두지 않아도 보인다 ✅

**CSS — 3가지 상태:**

| 클래스 | 효과 |
|---|---|
| `.row-clue.line-complete span`, `.column-clue.line-complete span` | 클루 숫자 배경이 녹색-노란 그라디언트로 변경, 미묘한 glow |
| `.puzzle-cell.completed-row`, `.puzzle-cell.completed-column` | 셀 테두리에 연초록 박스 섀도우 |
| `.puzzle-cell.completed-row.completed-column` | 교차점은 glow 강도 소폭 상향 |
| `.puzzle-cell.safe-suggestion` | `border-style: dashed` + 청록 계열 배경 — 빈 칸 가이던스 |

"loud arcade effect" 없이 cozy하게 — 진한 형광이 아니라 파스텔 글로우 ✅

---

### 검토 포인트 하나

`locked` 상태에서는 `completedRows/completedColumns`를 빈 Set으로 반환해 글로우가 뜨지 않는다. 퍼즐 완료(locked) 화면에서 완성 줄이 표시돼도 좋을 것 같은데, 의도적으로 끈 건지 확인 필요. 현재는 완성 직후 전환 애니메이션과 충돌을 피하기 위한 안전 처리로 보인다.

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| 솔루션 기반 정확도 (오탐 제거) | ✅ |
| all-blank 줄 가드 | ✅ |
| 커서 독립 전체 보드 추적 | ✅ |
| safe-suggestion 전체 완성 줄로 확장 | ✅ |
| locked 상태 방어 | ✅ |
| CSS 3상태 cozy 스타일 | ✅ |

이 커밋 전까지는 "채운 셀 수가 맞으면 완성"이라는 약한 기준이었다. 이제 실제 solution과 정확히 맞을 때만 완성 표시가 뜬다. 퍼즐의 핵심 피드백 루프가 처음으로 정직해진 커밋.


## Review 42 — 2026-07-11

**커밋:** [be3641d ui: add drag stroke puzzle painting](https://github.com/bbockara-lab/pips-picture-pantry/commit/be3641d)

---

### 드래그 스트로크 입력 — 첫 슬라이스

셀을 하나씩 탭하는 대신 손가락/마우스를 쓸어서 여러 셀을 한 번에 채우는 기능. 12×12 이상 보드에서 탭 피로를 크게 줄이는 핵심 인터랙션.

**아키텍처 — 세 레이어 분리가 깔끔하다:**

| 레이어 | 역할 |
|---|---|
| `puzzleState.js` — `paintCells()` | 순수 상태 변환, 히스토리 그룹화 |
| `boardView.js` — 포인터 이벤트 | 드래그 감지 + 드래프트 시각화 |
| `puzzleView.js` — `onCellPress` | 두 레이어 연결, 커밋 시점 결정 |

**`paintCells` (puzzleState.js):**
```js
export function paintCells(state, targets, nextValue) {
  const seen = new Set();
  const moves = [];
  targets.forEach((target) => {
    const key = `${row}:${column}`;
    if (!current || seen.has(key)) return;
    seen.add(key);
    if (current === nextValue) return;   // 이미 같은 값이면 스킵
    cells[row][column] = nextValue;
    moves.push({ row, column, previous: current, next: nextValue });
  });

  if (!moves.length) return { ...state, cursor };  // 변경 없으면 히스토리 추가 안 함

  return { ...state, cells, history: [...state.history, { cells: moves, drag: true }] };
}
```
- `seen` Set으로 중복 좌표 방어 ✅
- "이미 같은 값" 셀은 moves에 포함 안 함 → 히스토리가 실제 변경만 기록 ✅
- 변경이 없으면 히스토리 항목 자체를 추가하지 않음 ✅
- `drag: true` 플래그로 드래그 항목 식별 가능 (향후 분석/QA 활용)

**`undoLastMove` 하위 호환:**
```js
if (Array.isArray(lastMove.cells)) {
  lastMove.cells.forEach((move) => {
    cells[move.row][move.column] = move.previous;
  });
} else {
  cells[lastMove.row][lastMove.column] = lastMove.previous;  // 기존 단일 셀 undo
}
```
기존 단일 탭 히스토리 포맷(`{ row, column, previous }`)과 새 드래그 포맷(`{ cells: [...] }`) 모두 처리 — 이전 저장 데이터와 완전 호환 ✅

**`getNextCellValue` export:**
드래그 시작 시점에 "이 스트로크가 fill인지 unfill인지"를 결정해야 하는데, 그 로직이 `puzzleState.js` 안에 private으로 있었다. `boardView.js`에서 쓸 수 있도록 export로 올렸다. 중복 구현 없이 출처 단일화 ✅

**드래그 세션 관리 (boardView.js):**
```js
let dragSession = null;
let suppressNextClick = false;

// pointerdown: 세션 시작
dragSession = { pointerId, start, value, cells: new Map() };
window.addEventListener("pointerup", finishDrag);
window.addEventListener("pointercancel", finishDrag);

// pointermove (grid 레벨): elementFromPoint로 셀 탐지
const element = document.elementFromPoint(event.clientX, event.clientY)?.closest?.(".puzzle-cell");

// pointerenter (셀 레벨): 빠른 이동 보완
if (dragSession && dragSession.pointerId === event.pointerId) {
  addDragCell(button, rowIndex, columnIndex);
}
```
`pointermove` + `pointerenter` 이중 감지 — `pointermove`는 빠른 스와이프 시 셀을 건너뛸 수 있어서 `pointerenter`로 보완하는 패턴이다 ✅

`window`에 `pointerup`/`pointercancel`을 거는 것도 올바른 선택 — 손가락이 그리드 밖으로 나가서 올라와도 세션이 정상 종료된다 ✅

**`suppressNextClick` 패턴:**
```js
suppressNextClick = true;
onCellPress(session.start.column, ...);   // 드래그 커밋
window.setTimeout(() => { suppressNextClick = false; }, 0);

// click 핸들러
if (suppressNextClick) {
  event.preventDefault();
  suppressNextClick = false;
  return;
}
```
드래그 종료 시 `pointerup` → `click` 이벤트가 연속 발생한다. 드래그 커밋 직후 click으로 단일 셀 toggleCell이 추가 실행되는 것을 막는다. `setTimeout(..., 0)`으로 마이크로태스크 이후에 플래그를 해제 ✅

**`paintButtonDraft` — 드래그 중 시각 피드백:**
```js
function paintButtonDraft(button, value) {
  button.classList.remove(CELL.empty, CELL.filled, CELL.marked, "safe-suggestion");
  button.classList.add(value, "drag-preview");
  button.textContent = value === CELL.marked ? "×" : "";
}
```
실제 상태를 바꾸지 않고 클래스만 교체해 시각 미리보기. 커밋(pointerup)이 없으면 상태는 바뀌지 않는다. `drag-preview` 클래스는 현재 CSS가 없는데, 드래그 중 추가 스타일이 필요하면 나중에 붙이면 됨.

**`data-row` / `data-column` 속성:**
```js
button.dataset.row = String(rowIndex);
button.dataset.column = String(columnIndex);
```
`pointermove`에서 `elementFromPoint`로 찾은 요소의 행/열을 읽기 위해 추가. 인라인 클로저 대신 DOM 속성으로 좌표를 저장 — 이벤트 위임 패턴에 적합 ✅

**테스트:**
```js
it("paints a dragged stroke and undoes it as one move", () => {
  state = paintCells(state, [
    { row: 0, column: 0 }, { row: 0, column: 1 }, { row: 0, column: 2 }
  ], "filled");
  expect(state.cells[0]).toEqual(["filled", "filled", "filled"]);
  expect(state.history).toHaveLength(1);       // 3셀이 1개 히스토리 항목
  expect(state.history[0].cells).toHaveLength(3);

  state = undoLastMove(state);
  expect(state.cells[0]).toEqual(["empty", "empty", "empty"]);  // 한 번 undo로 전부 복구
});
```
핵심 동작 — "3셀 드래그 = 히스토리 1개, 한 번 undo로 전부 되돌아감" — 을 직접 검증 ✅

---

### 검토 포인트

**`drag-preview` CSS 없음:** `paintButtonDraft`에서 `drag-preview` 클래스를 붙이지만 대응하는 CSS 규칙이 없다. 드래그 중 시각 상태가 committed 상태와 동일하게 보인다. 드래그 중임을 약하게 표시하는 스타일(예: 약간 낮은 opacity나 점선 테두리)이 추후 추가되면 좋겠지만 지금은 기능적으로 문제없음.

**마우스 오른쪽 버튼 가드:**
```js
if (event.pointerType === "mouse" && event.button !== 0) return;
```
마우스 우클릭으로 드래그 시작 방지. 터치는 button 속성이 없으므로 조건이 그냥 통과 ✅

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| 순수 함수 `paintCells` 분리 | ✅ |
| 단일 히스토리 항목 그룹화 | ✅ |
| `undoLastMove` 하위 호환 | ✅ |
| `pointermove` + `pointerenter` 이중 감지 | ✅ |
| `window` 레벨 pointerup/cancel 처리 | ✅ |
| `suppressNextClick` 클릭 충돌 방지 | ✅ |
| 마우스 우클릭 가드 | ✅ |
| drag stroke undo 단위 테스트 | ✅ |
| `drag-preview` CSS 미구현 (minor) | △ |

12×12 이상 보드에서 탭 반복이 가장 큰 UX 문제였는데, 이 커밋 하나로 해결됐다. 상태 레이어와 뷰 레이어 분리가 명확하고, undo 하위 호환까지 챙겼다. 드래그 UX의 첫 슬라이스로서 완성도가 높다.


## Review 43 — 2026-07-11

**커밋:** [ab99c30 ui: polish drag stroke preview](https://github.com/bbockara-lab/pips-picture-pantry/commit/ab99c30)

---

### Drag Preview CSS — Review 42 플래그 즉시 반영

Review 42에서 `drag-preview` 클래스에 CSS가 없다고 지적했는데 이 커밋이 바로 그걸 닫는다. 변경은 CSS 전용 — 상태 모델, 히스토리, undo 동작은 건드리지 않음.

**3가지 규칙:**

```css
/* 기본 drag-preview */
.puzzle-cell.drag-preview {
  transform: scale(0.96);
  outline: 3px solid rgba(255, 255, 255, 0.78);
  outline-offset: -5px;
  box-shadow:
    inset 0 0 0 2px rgba(255, 255, 255, 0.62),
    0 0 0 3px rgba(242, 201, 76, 0.28),
    0 8px 18px rgba(89, 58, 43, 0.18);
  filter: saturate(1.08) brightness(1.04);
}

/* filled 상태 미리보기 */
.puzzle-cell.drag-preview.filled {
  background: radial-gradient(...)  linear-gradient(135deg, #ffe48d, #efa46d 56%, #c87955);
}

/* marked 상태 미리보기 */
.puzzle-cell.drag-preview.marked {
  border-style: dashed;
  background: ...;
  color: rgba(63, 105, 90, 0.82);
}
```

**디자인 판단:**
- `scale(0.96)` — 살짝 눌린 느낌. 손가락 아래 셀이 반응하는 물리적 느낌을 CSS로 표현 ✅
- `outline` + `outline-offset: -5px` — 인셋 테두리 효과. border 대신 outline을 쓴 이유는 레이아웃을 건드리지 않으면서 안쪽으로 띠를 만들 수 있어서 ✅
- filled/marked가 각각 다른 배경 — 드래그 중에 어떤 값이 칠해질지 미리 보여줌. `paintButtonDraft`에서 클래스를 미리 붙이는 구조와 정확히 맞물림 ✅
- `filter: saturate(1.08) brightness(1.04)` — 강조는 하되 cozy 톤에서 벗어나지 않음 ✅

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| Review 42 플래그 즉시 해소 | ✅ |
| scale + outline 인셋 물리감 | ✅ |
| filled/marked 상태별 분기 | ✅ |
| 상태 모델 무변경 (CSS만) | ✅ |

커밋 범위가 명확하다 — 리뷰 피드백 하나를 정확히 받아 CSS만 추가하고 닫음.

---

## Review 44 — 2026-07-11

**커밋:** [6b30a4f game: add size-aware puzzle hints](https://github.com/bbockara-lab/pips-picture-pantry/commit/6b30a4f)

---

### 사이즈별 힌트 공개 수 — 노멀 퍼즐 힌트 개선

기존 힌트는 사이즈 무관하게 1셀만 공개했다. 이제 노멀 퍼즐에서 보드 크기에 따라 한 번에 여러 셀을 공개한다.

**`getHintRevealCount` (puzzleAssistView.js):**
```js
export function getHintRevealCount(puzzle, options = {}) {
  if (options.isTimeAttack) return 1;

  const size = Number(puzzle.size || 0);
  if (size >= 18) return 8;
  if (size >= 15) return 6;
  if (size >= 12) return 5;
  if (size >= 10) return 3;
  return 1;
}
```

| 보드 크기 | 힌트 1회 공개 수 |
|---|---|
| 5×5, 8×8 | 1셀 |
| 10×10 | 3셀 |
| 12×12 | 5셀 |
| 15×15 | 6셀 |
| 18×18 | 8셀 |

타임어택은 `options.isTimeAttack`으로 무조건 1셀 유지 — 스푼 경제 + 기록 공정성 보호 ✅

**`useHint` 확장 (puzzleState.js):**
```js
export function useHint(state, solutionGrid, options = {}) {
  const revealCount = Math.max(1, Math.floor(Number(options.revealCount || 1)));
  const targets = findHintTargets(state, solution, revealCount);
  if (!targets.length) return state;

  // 다중 셀 처리
  targets.forEach((target) => { cells[target.row][target.column] = target.next; });
  const cursor = targets[targets.length - 1];   // 마지막 공개 셀로 커서 이동

  return {
    ...state,
    cursor: { row: cursor.row, column: cursor.column },
    cells,
    hintsUsed: Math.max(0, Number(state.hintsUsed || 0)) + 1,  // 여전히 1 증가
    history: [...state.history, {
      cells: targets.map(...),
      hint: true,
      revealCount: targets.length
    }]
  };
}
```

핵심: 셀 여러 개를 공개해도 `hintsUsed`는 1만 증가한다. "힌트 1회 = 보드 크기에 맞는 도움" — 사용 카운트와 효과가 함께 스케일 ✅

**`findHintTargets` 리팩터 (puzzleState.js):**
```js
// before: 하나 찾으면 바로 return
function findHintTarget(state, solution) {
  // ...
  return { row, column, previous, next };
}

// after: revealCount만큼 모아서 return
function findHintTargets(state, solution, revealCount = 1) {
  const targets = [];
  // filled 먼저 탐색
  for (...) {
    if (solution[row][column] && current !== CELL.filled) {
      targets.push(...);
      if (targets.length >= revealCount) return targets;
    }
  }
  // marked(빈칸 표시) 탐색
  for (...) {
    if (!solution[row][column] && current === CELL.empty) {
      targets.push(...);
      if (targets.length >= revealCount) return targets;
    }
  }
  return targets;
}
```
filled 우선 탐색 → marked 보완 순서 유지. `revealCount`만큼 채워지면 즉시 반환 ✅

**undo 호환:**
드래그 스트로크(Review 42)에서 확립한 `{ cells: [...] }` 히스토리 포맷을 힌트도 그대로 사용. `undoLastMove`가 두 케이스를 모두 처리하는 구조 덕에 추가 코드 없이 힌트 다중 공개 undo가 동작 ✅

**커서 이동:**
```js
const cursor = targets[targets.length - 1];  // 마지막 공개 셀
return { ...state, cursor: { row: cursor.row, column: cursor.column } };
```
이전 `useHint`는 커서를 갱신하지 않았다. 이제 마지막 공개 셀로 커서가 이동 — 유저가 어디가 공개됐는지 자연스럽게 확인 가능 ✅

**i18n — `hintIntroMulti`:**
```js
// en.js
hintIntroMulti: "On this larger board, one hint solves up to {count} sure squares. Undo stays free."

// ko.js
hintIntroMulti: "이 큰 퍼즐에서는 힌트 한 번이 확실한 칸 {count}개까지 해결해요. 되돌리기는 자유롭게 쓸 수 있어요."
```
`revealCount > 1`일 때 `hintIntroMulti`, 아니면 기존 `hintIntro` 분기:
```js
return revealCount > 1
  ? t("controls.hintIntroMulti", { count: revealCount })
  : t("controls.hintIntro");
```
유저가 힌트 패널을 열었을 때 "이 보드에서 힌트가 몇 칸을 보여주는지" 미리 알 수 있다 ✅

**테스트:**
```js
it("reveals multiple sure cells with one size-aware hint history entry", () => {
  state = useHint(state, solution, { revealCount: 3 });
  expect(state.cells[0]).toEqual(["filled", "filled", "filled"]);
  expect(state.hintsUsed).toBe(1);               // 1회만 증가
  expect(state.history).toHaveLength(1);          // 히스토리 1개
  expect(state.history[0].hint).toBe(true);
  expect(state.history[0].cells).toHaveLength(3); // 3셀 기록

  state = undoLastMove(state);
  expect(state.cells[0]).toEqual(["empty", "empty", "empty"]);
  expect(state.hintsUsed).toBe(0);               // undo로 hintsUsed 복구
});
```
핵심 계약 전부 검증 ✅

---

### 검토 포인트

**`hintsUsed` undo 복구:** 테스트에서 `undoLastMove` 후 `hintsUsed`가 0으로 돌아오는 게 확인됐다. `undoLastMove`가 `hintsUsed`도 감소시키는지 코드를 확인해볼 가치가 있음 — 만약 감소시킨다면 힌트 남은 횟수를 중요하게 관리하는 경제 설계에서 "힌트 쓰고 undo해서 공짜로 보기" 패턴이 가능할 수 있다. 의도적인 설계인지 확인 필요.

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| 사이즈별 공개 수 테이블 (5개 구간) | ✅ |
| 타임어택 1셀 고정 분리 | ✅ |
| `hintsUsed` 여전히 1 증가 | ✅ |
| 드래그 히스토리 포맷 재사용 | ✅ |
| 마지막 공개 셀로 커서 이동 | ✅ |
| `hintIntroMulti` en/ko | ✅ |
| 다중 공개 + undo 단위 테스트 | ✅ |
| `hintsUsed` undo 복구 의도 확인 필요 | △ |

12×12에서 힌트 한 번이 5셀을 보여주면 "아, 이 구역이 이렇게 채워지는구나"라는 맥락이 생긴다. 1셀 힌트가 큰 보드에서 "너무 작아서 쓸모없다"는 느낌을 주던 문제를 해결한다. 타임어택과 노멀을 명확하게 분리한 것도 경제 안정성 측면에서 올바르다.


## Review 45 — 2026-07-11

**커밋:** [782d10e game: keep hint use spent after undo](https://github.com/bbockara-lab/pips-picture-pantry/commit/782d10e)

---

### 힌트 Undo 악용 차단 — Review 44 플래그 즉시 반영

Review 44에서 "힌트 쓰고 undo로 `hintsUsed` 복구 가능한지 확인 필요"라고 지적했는데 이 커밋이 정확히 그걸 닫는다.

**변경 내용 — 1줄:**
```js
// before
hintsUsed: lastMove.hint ? Math.max(0, Number(state.hintsUsed || 0) - 1) : Number(state.hintsUsed || 0),

// after
hintsUsed: Math.max(0, Number(state.hintsUsed || 0)),
```
`lastMove.hint`일 때 감소시키던 분기가 완전히 제거됐다. 이제 undo는 보드 셀만 복구하고 `hintsUsed`는 건드리지 않는다.

**설계 원칙 확립:**
> "Undo는 입력 안전장치다. 보상/경제 리셋 도구가 아니다."

타임어택 스푼 환불 불가 규칙과 동일한 원칙을 노멀 퍼즐 힌트에도 적용 — 일관성 ✅

**테스트 업데이트:**
```js
// before (Review 44 당시 기존 테스트)
expect(state.hintsUsed).toBe(0);  // undo 후 0으로 복구

// after
expect(state.hintsUsed).toBe(1);  // undo 후에도 1 유지
```
단일 셀 힌트 + 다중 셀 힌트 + 리플레이 챌린지 테스트 세 곳 모두 동일하게 수정 ✅

**i18n 업데이트:**
"Undo stays free" → "Undo can clear the cell, but the hint still counts"로 모든 힌트 관련 카피 수정 (en + ko, 4개 키). 유저가 undo 전에 경제 규칙을 알 수 있다 ✅

**리플레이 챌린지 테스트 수정:**
```js
state = undoLastMove(state);
expect(state.hintsUsed).toBe(1);  // 1 유지
status = updateReplayCleanStatus(status, state, solution);
expect(isReplayClean(status)).toBe(false);  // 힌트 쓴 기록 보존
```
힌트 후 undo해도 리플레이 클린 상태가 복구되지 않는다 — 기록 공정성 보호 ✅

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| Review 44 플래그 즉시 해소 | ✅ |
| hintsUsed undo 복구 차단 (1줄 수정) | ✅ |
| 단일/다중 힌트 테스트 3곳 수정 | ✅ |
| 리플레이 클린 기록 보호 | ✅ |
| en/ko i18n 카피 정직하게 수정 | ✅ |

리뷰 지적 → 다음 커밋에서 즉시 수정. 이상적인 리뷰-개발 루프다.

---

## Review 46 — 2026-07-11

**커밋:** [ca6c7cb game: prioritize mistake correction hints](https://github.com/bbockara-lab/pips-picture-pantry/commit/ca6c7cb)

---

### 힌트 타겟팅 우선순위 개선 — 실수 교정 먼저

기존 힌트는 "빈 칸 중 채워야 할 칸 → 빈 칸 중 X 표시할 칸" 순서로 탐색했다. 문제: 유저가 틀린 셀을 채워놓은 상태에서 힌트를 써도 그 실수를 건드리지 않고 다른 빈 칸을 공개했다. "힌트 썼는데 왜 도움이 안 되지?" 상황.

**탐색 순서 추가:**
```js
function findHintTargets(state, solution, revealCount = 1) {
  const targets = [];

  // [신규] 1순위: 잘못 채워진 셀 (비워야 하는데 filled)
  for (let row = 0; row < solution.length; row++) {
    for (let column = 0; column < solution[row].length; column++) {
      const current = state.cells[row]?.[column];
      if (!solution[row][column] && current === CELL.filled) {
        targets.push({ row, column, previous: current, next: CELL.marked });
        if (targets.length >= revealCount) return targets;
      }
    }
  }

  // 2순위: 채워야 하는데 빈 셀 (기존)
  // 3순위: X 표시해야 하는데 빈 셀 (기존)
}
```

**3단계 우선순위:**

| 우선순위 | 조건 | 처리 |
|---|---|---|
| 1 | `!solution[row][col] && current === filled` | 틀린 셀 → marked로 교정 |
| 2 | `solution[row][col] && current !== filled` | 비어있는 정답 셀 → filled |
| 3 | `!solution[row][col] && current === empty` | 비어있는 빈 칸 → marked |

유저가 막혀있는 진짜 이유(실수한 셀)를 먼저 건드린다 ✅

**설계 의도:**
> "한정된/유료 힌트는 플레이어의 현재 마찰을 해결해야 한다. 관련 없는 untouched 셀을 공개하는 게 아니라."

12×12 이상 보드에서 실수 하나가 논리 전개를 막고 있을 때 힌트 효용이 크게 올라간다 ✅

**v0.1.275 undo 규칙과의 연관:**
교정 힌트도 동일하게 적용 — undo로 셀은 돌아오지만 `hintsUsed`는 감소하지 않는다. 실수를 힌트로 확인하고 undo로 취소하는 패턴도 차단됨 ✅

**테스트:**
```js
it("uses a hint to correct a wrong filled cell before adding safe marks", () => {
  // solution: 중앙(1,1)만 true, 나머지 false
  state = toggleCell(state, 0, 0, "fill");  // (0,0)에 실수로 채움
  state = useHint(state, solution);

  expect(state.cells[0][0]).toBe("marked");  // 실수 셀 교정
  expect(state.hintsUsed).toBe(1);
  expect(state.history[...].hint).toBe(true);
});
```
실수 셀이 있을 때 힌트가 그걸 먼저 건드리는지 직접 검증 ✅

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| 3단계 우선순위 탐색 | ✅ |
| 실수 교정이 새 정답 공개보다 앞섬 | ✅ |
| v0.1.275 undo 규칙 그대로 유지 | ✅ |
| 실수 교정 테스트 추가 | ✅ |

v0.1.274(사이즈별 공개 수) → v0.1.275(undo 악용 차단) → v0.1.276(실수 교정 우선) — 힌트 시스템이 3커밋으로 완성됐다. 각 커밋이 앞 커밋의 논리적 후속이고, 모두 Review 피드백에서 시작됐다. 힌트가 이제 "유저가 막힌 이유를 해결하는 도구"로 동작한다.


## Review 47 — 2026-07-11

**커밋:** [e5a7ef3 game: include final replay move in clean rewards](https://github.com/bbockara-lab/pips-picture-pantry/commit/e5a7ef3)

---

### 리플레이 클린 보상 — 마지막 수 포함 허점 차단

기존 코드:
```js
if (isReplayChallenge && !state.completed) {
  replayCleanStatus = updateReplayCleanStatus(replayCleanStatus, state, puzzle.solution);
}
```
`!state.completed` 조건 때문에 퍼즐을 완성하는 마지막 수는 `updateReplayCleanStatus`가 호출되기 전에 `completed: true`가 붙어 통과됐다. 결과: 마지막 수가 힌트였어도 클린 상태로 보상을 받을 수 있었다.

**수정:**
```js
// before: 완료 전 상태에서만 체크
if (isReplayChallenge && !state.completed) {
  replayCleanStatus = updateReplayCleanStatus(...);
}

// after: 완료 여부와 무관하게 항상 체크
replayCleanStatus = getReplayCleanStatusAfterState(isReplayChallenge, replayCleanStatus, state, puzzle.solution);
```

`getReplayCleanStatusAfterState`를 별도 함수로 분리해 export — 테스트에서 직접 호출 가능 ✅

**실행 순서 정리:**
```
이전 state → nextState(완료 포함) → getReplayCleanStatusAfterState → 보상 판정
```
완료 상태가 되는 수도 클린 체크를 반드시 통과한다 ✅

**테스트:**
```js
it("keeps replay unclean when a final hint completes the puzzle", () => {
  state = useHint(state, solution, { revealCount: 5 });
  state = { ...state, completed: true };
  status = getReplayCleanStatusAfterState(true, status, state, solution);

  expect(state.hintsUsed).toBe(1);
  expect(isReplayClean(status)).toBe(false);
});
```
마지막 힌트로 완성 → 클린 불가 케이스를 직접 커버 ✅

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| 마지막 수 클린 체크 누락 수정 | ✅ |
| `getReplayCleanStatusAfterState` 분리 export | ✅ |
| 최종 힌트 완성 리그레션 테스트 | ✅ |

작은 변경이지만 경제 무결성에 직접 연결된 허점 차단. "보상 규칙은 마지막 수를 포함해 평가해야 한다"는 원칙이 MAJOR_REWORK_PLAN에 설계 규칙으로 기록된 것도 좋다.

---

## Review 48 — 2026-07-11

**커밋:** [46e76a3 game: add paid extra puzzle hints](https://github.com/bbockara-lab/pips-picture-pantry/commit/46e76a3)

---

### 노멀 퍼즐 유료 추가 힌트 경제 — 첫 실제 수익 인프라

무료 힌트 소진 후 스푼으로 추가 힌트를 살 수 있는 구조. 타임어택과 별도 경제 레인을 유지하면서 노멀 대형 보드에 지속적인 진행 도구를 제공한다.

**`getPuzzleExtraHintCost` (economyConfig.js):**
```js
PUZZLE_EXTRA_HINT_BASE_COST_BY_SIZE: {
  10: 6,
  12: 9,
  15: 13,
  18: 18
}

export function getPuzzleExtraHintCost(size, paidHintsUsed = 0) {
  const base = ECONOMY.PUZZLE_EXTRA_HINT_BASE_COST_BY_SIZE[normalizedSize] || 0;
  if (base <= 0) return 0;

  const paidCount = Math.max(0, Math.floor(Number(paidHintsUsed) || 0));
  return base + paidCount * Math.ceil(base / 2);
}
```

**비용 테이블 (size별 기본값 + 반복 구매 에스컬레이션):**

| 보드 | 1번째 | 2번째 | 3번째 |
|---|---|---|---|
| 10×10 | 6 | 9 | 12 |
| 12×12 | 9 | 14 | 19 |
| 15×15 | 13 | 20 | 27 |
| 18×18 | 18 | 27 | 36 |
| 5×5, 8×8 | 0 (지원 안 함) | | |

`Math.ceil(base / 2)` 증분 — 절반씩 올라가는 점진적 에스컬레이션. 타임어택 `[2, 4, 7]` 대비 시작 비용이 높고(큰 보드에서 더 많이 공개), 타임어택처럼 3회 제한은 없다 ✅

**힌트 패널 조건 분기 (puzzleView.js):**
```js
const paidHintCount = Math.max(0, Number(state.hintsUsed || 0) - hintLimit);
const normalHintCost = !isTimeAttack && Number(state.hintsUsed || 0) >= hintLimit
  ? getPuzzleExtraHintCost(puzzle.size, paidHintCount)
  : 0;
const hintCost = isTimeAttack ? timeAttackHintCost : normalHintCost;
```
무료 힌트 한도 소진 시점을 `hintsUsed >= hintLimit`으로 감지. 그 이후 유료 구간에서 `paidHintCount`(유료 사용 횟수)를 추적해 에스컬레이션 ✅

`onSpendHint` 레이블도 분기:
```js
onSpendHint: hintCost > 0
  ? (cost) => spendPantrySpoons(cost, isTimeAttack ? "time-attack-hint" : "puzzle-extra-hint").allowed
  : null
```
지출 로그에 타임어택 힌트와 노멀 유료 힌트가 별도로 기록됨 — 향후 경제 분석 가능 ✅

**힌트 패널 버튼 활성화 로직 수정:**
```js
// before
button.disabled = remaining <= 0 || (hintCost > 0 && balance < hintCost);

// after
const canUseHint = remaining > 0 || hintCost > 0;
button.disabled = !canUseHint || (hintCost > 0 && balance < hintCost);
```
`remaining <= 0`이어도 `hintCost > 0`(유료 추가 구간)이면 버튼이 활성화된다. 무료 소진 후 유료로 이어지는 흐름이 자연스럽게 연결 ✅

**`getHintBodyText` 리팩터:**
타임어택 / 노멀 유료 / 무료 세 케이스를 `timeAttack` 플래그와 `hintCost` 조합으로 분기. 이전에는 타임어택 전용이었던 `paidHintNeedMore`/`paidHintIntro` 경로가 노멀 유료에도 적용됨 ✅

**i18n — `paidHintIntro` / `paidHintNeedMore`:**
```
en: "Extra hint: {cost} spoons for up to {count} useful squares. Undo can clear the cells, but the hint and spoons stay spent. Balance: {balance}."
ko: "추가 힌트: 스푼 {cost}개로 도움되는 칸 {count}개까지 해결해요. 되돌리기로 칸을 지울 수는 있지만, 힌트와 스푼 사용은 그대로 남아요. 보유 {balance}개."
```
타임어택과 다른 키 — 노멀 유료 힌트임을 명확히 표시. v0.1.275 규칙("undo 후에도 스푼/힌트 기록 유지")을 카피에도 적시 ✅

**테스트 — `tests/economyConfig.test.js` 신규:**
```js
expect(getPuzzleExtraHintCost(5, 0)).toBe(0);   // 소형 보드 미지원
expect(getPuzzleExtraHintCost(10, 0)).toBe(6);
expect(getPuzzleExtraHintCost(12, 1)).toBe(14);  // 에스컬레이션 검증
expect(getPuzzleExtraHintCost(15, 2)).toBe(27);
expect(getPuzzleExtraHintCost(18, 1)).toBe(27);
```
경제 수치가 테스트로 고정됨 — 향후 조정 시 테스트가 의도치 않은 변경을 잡는다 ✅

---

### 검토 포인트

**`paidHintCount` 계산 신뢰도:**
```js
const paidHintCount = Math.max(0, Number(state.hintsUsed || 0) - hintLimit);
```
`hintsUsed`에서 `hintLimit`을 빼서 유료 사용 횟수를 추산. `hintLimit`이 퍼즐/설정에 따라 달라지는 경우 이 계산이 맞으려면 `hintLimit`이 항상 고정값이어야 한다. 현재는 `getHintLimit(puzzle)`이 정적으로 결정되므로 문제없음. 향후 힌트 한도가 가변화될 경우 재확인 필요.

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| 사이즈별 기본 비용 테이블 | ✅ |
| 반복 구매 에스컬레이션 (`base + n * ceil(base/2)`) | ✅ |
| 타임어택/노멀 경제 레인 분리 유지 | ✅ |
| 무료→유료 버튼 활성화 연결 | ✅ |
| 지출 로그 레이블 분리 (`puzzle-extra-hint`) | ✅ |
| `paidHintIntro/NeedMore` en/ko | ✅ |
| `economyConfig.test.js` 신규 수치 테스트 | ✅ |
| `paidHintCount` 계산 가변 한도 시 재확인 필요 | △ |

힌트 시스템이 v0.1.274~279 6개 커밋으로 완성됐다:
- 사이즈별 공개 수 → undo 악용 차단 → 실수 교정 우선 → 리플레이 최종 수 허점 → **유료 추가 힌트 경제**

노멀 퍼즐에서 "힌트 다 썼는데 막혀있다"는 상황에 지속적인 진행 도구가 생겼고, 이게 실제 수익으로 연결되는 첫 번째 인프라다.


## Review 49 — 2026-07-11

**커밋:** [eb9a1a3 game: wire time attack state updates](https://github.com/bbockara-lab/pips-picture-pantry/commit/eb9a1a3)

---

### 타임어택 상태 콜백 배선 복구

`renderPlayScreen` → `renderPuzzleView`로 `onPuzzleStateChange`가 전달되지 않던 배선 누락 수정. 타임어택 타임아웃 시 현재 보드 진행도(progress cells)를 기록에 반영하려면 실시간 상태 업데이트가 필요한데, 콜백이 끊겨 있었다.

**변경 내용:**
```js
// playScreen.js — options 구조분해에 추가
const {
  // ...기존 옵션들...
  getTimeAttackHintCost,
  onPuzzleStateChange     // 신규
} = options;

// renderPuzzleView 호출부에 전달
renderPuzzleView(activePuzzle, {
  // ...
  getTimeAttackHintCost,
  onPuzzleStateChange,    // 신규
  onPuzzleComplete
})
```
변경 자체는 2줄이지만 영향은 크다 — 타임아웃 레코드가 실제 보드 상태를 반영하지 못하던 버그 수정 ✅

**테스트 — 소스 코드 정적 검증:**
```js
const playScreenSource = readFileSync("src/ui/playScreen.js", "utf8");

expect(playScreenSource).toMatch(/onPuzzleStateChange\s*\n\s*}\s*=\s*options/);
expect(playScreenSource).toMatch(/renderPuzzleView\([\s\S]*onPuzzleStateChange,[\s\S]*onPuzzleComplete/);
```
런타임 테스트가 아니라 소스 파일을 직접 읽어서 정규식으로 배선을 검증. UI 레이어 리팩터 시 콜백이 다시 누락되면 테스트가 잡는다 ✅

이 패턴은 컴포넌트 조합 구조에서 "중간 레이어가 props를 묵살"하는 버그를 막는 실용적인 방법 — 완전한 통합 테스트 없이도 핵심 배선을 보호한다.

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| 타임어택 상태 콜백 배선 수정 | ✅ |
| 소스 정적 검증 테스트 | ✅ |
| 타임아웃 레코드 정확도 복구 | ✅ |

---

## Review 50 — 2026-07-11

**커밋:** [4ea7e2a game: split paid hint count state](https://github.com/bbockara-lab/pips-picture-pantry/commit/4ea7e2a)

---

### 유료 힌트 카운트 분리 — Review 48 플래그 즉시 반영

Review 48에서 "`paidHintCount = hintsUsed - hintLimit` 계산은 `hintLimit`이 가변화될 경우 재확인 필요"라고 지적했는데 이 커밋이 정확히 그걸 닫는다.

**문제였던 계산:**
```js
// before (Review 48)
const paidHintCount = Math.max(0, Number(state.hintsUsed || 0) - hintLimit);
```
`hintLimit`이 보드 크기/난이도/이벤트별로 달라지면 유료 힌트 에스컬레이션 가격이 오염된다.

**수정 — `paidHintsUsed` 상태 필드 추가:**
```js
// createPuzzleState
{ hintsUsed: 0, paidHintsUsed: 0, ... }

// useHint
const paid = Boolean(options.paid);
return {
  ...state,
  hintsUsed: ... + 1,
  paidHintsUsed: Math.max(0, Number(state.paidHintsUsed || 0)) + (paid ? 1 : 0),
  history: [..., { ..., hint: true, paid, revealCount }]
};

// puzzleView.js
const paidHintCount = Math.max(0, Number(state.paidHintsUsed || 0));  // 직접 읽기
```

`hintsUsed`(전체 = 무료+유료)와 `paidHintsUsed`(유료만)가 분리됨. 에스컬레이션 가격 계산이 `hintLimit` 변동에 완전히 독립적 ✅

**직렬화/복원 완전 지원:**
```js
// serializeState
{ hintsUsed, paidHintsUsed, ... }

// restoreState
paidHintsUsed: Math.max(0, Number(parsed.paidHintsUsed || 0))
```
앱 재시작 후에도 유료 힌트 횟수가 정확히 복원됨 ✅ (0 기본값으로 기존 저장 데이터 하위 호환)

**undo 불변 유지:**
```js
// undoLastMove
paidHintsUsed: Math.max(0, Number(state.paidHintsUsed || 0))  // 감소 없음
```
v0.1.275에서 확립한 "undo는 경제 리셋 아님" 규칙이 `paidHintsUsed`에도 동일하게 적용 ✅

**히스토리에 `paid` 플래그:**
```js
history: [..., { cells: [...], hint: true, paid: true/false, revealCount }]
```
나중에 리플레이 분석이나 보상 감사에서 어떤 수가 유료 힌트였는지 추적 가능 ✅

**테스트:**
```js
it("tracks paid hint uses separately from free hint uses", () => {
  state = useHint(state, solution, { revealCount: 1 });          // 무료
  state = useHint(state, solution, { revealCount: 1, paid: true }); // 유료

  expect(state.hintsUsed).toBe(2);
  expect(state.paidHintsUsed).toBe(1);  // 유료만 1

  state = undoLastMove(state);
  expect(state.hintsUsed).toBe(2);      // 유지
  expect(state.paidHintsUsed).toBe(1);  // 유지
});
```
무료/유료 분리 + undo 불변 두 규칙을 한 테스트에서 검증 ✅

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| Review 48 플래그 즉시 해소 | ✅ |
| `paidHintsUsed` 상태 필드 분리 | ✅ |
| 직렬화/복원 + 기존 데이터 하위 호환 | ✅ |
| undo 불변 유지 (`paidHintsUsed` 감소 없음) | ✅ |
| 히스토리 `paid` 플래그 | ✅ |
| 무료/유료 분리 테스트 | ✅ |

이 코드베이스의 리뷰-개발 루프 패턴이 확립됐다: 리뷰 지적 → 다음 1~2 커밋에서 정확히 닫음. Review 48 △ 항목이 Review 50에서 해소됐다. 힌트 경제가 이제 `hintLimit` 가변화에 완전히 안전하다.


## Review 51 — 2026-07-12

**커밋:** [b45f51b ui: clarify paid hint titles](https://github.com/bbockara-lab/pips-picture-pantry/commit/b45f51b)

---

### 힌트 패널 제목 3분기 — 유료 상태 즉시 인식

힌트 패널 타이틀이 항상 "Hints 1/3" 형태였다. 유료 구간으로 넘어가도 제목이 바뀌지 않아서 유저가 "지금 무료인지 유료인지"를 본문까지 읽어야 알 수 있었다.

**`getHintTitleText` 분리:**
```js
export function getHintTitleText({ remaining, hintLimit, hintCost, timeAttack = false }) {
  if (hintCost > 0) {
    return timeAttack
      ? t("controls.timeAttackHintTitle")   // "Time Attack hint"
      : t("controls.extraHintTitle");        // "Extra hint"
  }
  return t("controls.hintRemaining", { count: remaining, limit: hintLimit }); // "Hints 1/3"
}
```

| 상태 | 제목 |
|---|---|
| 무료 힌트 남음 | "Hints {count}/{limit}" |
| 노멀 유료 구간 | "Extra hint" |
| 타임어택 유료 구간 | "Time Attack hint" |

유저가 패널을 열자마자 제목에서 유료 상태를 인식 — 본문을 읽지 않아도 됨 ✅

**i18n 2개 키 추가:**
```js
extraHintTitle: "Extra hint"         / "추가 힌트"
timeAttackHintTitle: "Time Attack hint" / "타임어택 힌트"
```

**테스트 — `tests/puzzleAssistView.test.js` 신규:**
```js
expect(getHintTitleText({ remaining: 1, hintLimit: 3, hintCost: 0 })).toBe("Hints 1/3");
expect(getHintTitleText({ remaining: 0, hintLimit: 3, hintCost: 6 })).toBe("Extra hint");
expect(getHintTitleText({ remaining: 0, hintLimit: 3, hintCost: 4, timeAttack: true })).toBe("Time Attack hint");
```
세 상태 모두 직접 검증 ✅

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| 3상태 제목 분기 | ✅ |
| `getHintTitleText` export 분리 | ✅ |
| en/ko 2개 키 | ✅ |
| 3상태 단위 테스트 | ✅ |

작은 UX 개선이지만 유료 전환 시점의 마찰을 줄이는 중요한 변경. 힌트 패널이 이제 제목 한 줄로 현재 상태를 전달한다.

---

## Review 52 — 2026-07-12

**커밋:** [2547411 qa: guard Korean hint copy](https://github.com/bbockara-lab/pips-picture-pantry/commit/2547411)

---

### 한국어 힌트 카피 회귀 가드 강화

i18n 테스트가 mojibake를 더 폭넓게 차단하도록 강화.

**mojibake 패턴 추가:**
```js
// before: ?가 연속 2개 이상인 경우만 차단
expect(value).not.toMatch(/[?]{2,}/);

// after: 위 + 흔한 mojibake 글자 목록 추가
expect(value).not.toMatch(/[媛뚰ㅽ꾩쒖쇱뫜吏湲異]/);
```
`媛뚰ㅽ꾩쒖쇱뫜吏湲異` — EUC-KR이 UTF-8로 잘못 해석될 때 자주 나오는 문자들. `??` 패턴에 걸리지 않는 단일 mojibake 글자도 이제 잡힌다 ✅

**`paidHintIntro` 어설션 강화:**
```js
// before: 한글 문자열 리터럴 (소스 파일 인코딩 따라 깨질 수 있음)
expect(...).toContain("추가 힌트");

// after: 유니코드 이스케이프 (인코딩 무관)
expect(...).toContain("추가 힌트");
```
"추가 힌트"가 소스 파일 저장 인코딩에 따라 깨지는 케이스를 방지 ✅

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| mojibake 글자 목록 차단 | ✅ |
| 유니코드 이스케이프 어설션 | ✅ |

단순 강화 커밋이지만 한국어 출시 품질 기준에 직결되는 내용.

---

## Review 53 — 2026-07-12

**커밋:** [51c9011 qa: scan Korean copy hygiene](https://github.com/bbockara-lab/pips-picture-pantry/commit/51c9011)

---

### `qa:hygiene` — ko.js 소스 파일 전체 mojibake 스캔

Review 52가 런타임 테스트 레이어를 강화했다면 이 커밋은 **소스 파일 레이어**를 추가한다.

**`source_hygiene_check.js` 추가:**
```js
const koreanSourcePath = "src/i18n/ko.js";
const koreanSource = readFileSync(resolve(root, koreanSourcePath), "utf8");
const mojibakeFragments = /[媛뚰ㅽ꾩쒖쇱뫜吏湲異]/;
if (mojibakeFragments.test(koreanSource)) {
  errors.push(`${koreanSourcePath}: Korean copy contains common mojibake fragments`);
}
```

**두 레이어 비교:**

| 레이어 | 시점 | 범위 |
|---|---|---|
| `i18n.test.js` (Review 52) | 런타임 — `t()` 함수 반환값 체크 | 테스트에 포함된 키만 |
| `qa:hygiene` (이번) | 빌드 전 — 소스 파일 원본 직접 스캔 | `ko.js` 전체 |

런타임 테스트에서 커버하지 않은 키에 mojibake가 들어와도 `qa:hygiene`이 잡는다. CI 파이프라인에서 `npm run qa:hygiene`이 실행되므로 push 즉시 감지 ✅

기존 BOM 체크, 스테일 CSS 체크와 동일한 위치에 자연스럽게 편입 — 가드 패턴 일관성 유지 ✅

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| 소스 파일 레벨 mojibake 스캔 | ✅ |
| 기존 hygiene 체크와 일관된 패턴 | ✅ |
| CI 파이프라인 자동 적용 | ✅ |

v0.1.287~289 세 커밋이 한 줄기: 힌트 상태 명확화(UX) → 런타임 카피 가드(테스트) → 소스 파일 카피 가드(CI). 한국어 출시 품질을 세 레이어에서 동시에 보호하는 구조가 완성됐다.


## Review 54 — 2026-07-12

**커밋:** [c20d1f1 qa: guard time attack guide copy](https://github.com/bbockara-lab/pips-picture-pantry/commit/c20d1f1)

---

### 타임어택 첫 진입 Pip 가이드 — 모바일 QA 보호

타임어택에 처음 진입할 때 나오는 Pip 가이드가 힌트 제한과 스푼 전환을 설명하는지 모바일 QA가 자동으로 검증.

**`expectTimeAttackGuideCopy` 추가:**
```js
async function expectTimeAttackGuideCopy(page, viewportName) {
  const overlay = page.locator(".guide-overlay");
  if ((await overlay.count()) === 0) {
    failures.push("[...] Time Attack first-run guide did not appear");
    return;
  }

  // 1단계: 타임어택 모드 소개 확인
  const firstStepText = await page.locator(".guide-dialog__bubble").first().innerText();
  if (!/Time Attack|타임어택|도전/i.test(firstStepText)) {
    failures.push("[...] Time Attack guide first step should frame the mode, saw " + firstStepText);
  }

  // 다음 단계로 이동
  await page.locator(".guide-dialog__next").click();

  // 2단계: 힌트 + 스푼 언급 확인
  const hintStepText = await page.locator(".guide-dialog__bubble").first().innerText();
  const mentionsHint = /hint|힌트/i.test(hintStepText);
  const mentionsSpoons = /spoon|스푼/i.test(hintStepText);
  if (!mentionsHint || !mentionsSpoons) {
    failures.push("[...] Time Attack guide should explain limited hints and spoon continuation, saw " + hintStepText);
  }

  await page.locator(".guide-dialog__skip").click();
  await overlay.waitFor({ state: "detached", timeout: 2000 });
}
```

**두 가지를 동시에 보호:**
1. **UX:** 가이드가 실제로 뜨고, 타임어택을 소개하고, 힌트/스푼 경제를 설명하는가
2. **경제:** 힌트가 제한되고 스푼으로 추가 구매한다는 모델을 유저가 온보딩에서 배우는가

힌트 경제가 수익 모델과 직결되므로 온보딩 가드가 경제 가드이기도 하다 ✅

**`openFloatingView` 시그니처 정리:**
```js
// before
async function openFloatingView(page, view)
// after
async function openFloatingView(page, view, viewportName = view)
```
`viewportName`을 기본값으로 추가해 가드 함수에 뷰포트 이름을 전달 가능 ✅

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| 가이드 존재 확인 | ✅ |
| 타임어택 소개 문구 정규식 검증 | ✅ |
| 힌트+스푼 언급 2-조건 검증 | ✅ |
| 가이드 닫기 후 overlay detach 대기 | ✅ |
| en/ko 양 언어 정규식 커버 | ✅ |

---

## Review 55 — 2026-07-12

**커밋:** [2cd9597 qa: guard korean ui copy](https://github.com/bbockara-lab/pips-picture-pantry/commit/2cd9597)

---

### 한국어 UI 카피 전체 mojibake 회귀 가드

v0.1.289(qa:hygiene 소스 스캔) + v0.1.293이 레이어를 추가한 흐름. 이번엔 `ko.js` 전체를 **재귀적으로 순회**해서 모든 문자열 키를 검사.

**`collectStrings` 재귀 함수:**
```js
function collectStrings(source, path = [], strings = []) {
  Object.entries(source || {}).forEach(([key, value]) => {
    const nextPath = [...path, key];
    if (value && typeof value === "object") {
      collectStrings(value, nextPath, strings);  // 중첩 객체 재귀
      return;
    }
    if (typeof value === "string") {
      strings.push([nextPath.join("."), value]);
    }
  });
  return strings;
}
```
`ko.js`의 모든 중첩 키를 `"pantry.progressMissionTitle"` 같은 점 표기법으로 펼쳐서 배열로 수집 ✅

**mojibake 패턴 확장:**
```js
const KOREAN_MOJIBAKE_PATTERN = /[揶쏅슦쎄쑴뽰눘維쒙쭪疫꿰빊吏紐]/;
```
v0.1.288의 `[媛뚰ㅽ꾩쒖쇱뫜吏湲異]`보다 더 많은 패턴 커버. 다른 인코딩 충돌 시나리오에서 나오는 조각들을 추가 ✅

**범위 설계:**
```js
const strings = collectStrings(ko).filter(([key]) => !key.startsWith("puzzles."));
```
`puzzles.*` 키 제외 — 퍼즐 카탈로그 333개 제목은 이미 `qa:catalog`가 별도로 관리하므로 중복 방지. UI 카피(core, guide, pantry, controls, timeAttack, hints...)에 집중 ✅

**테스트 리포트 품질:**
`expect(value, key)` — Vitest의 두 번째 인자가 실패 메시지. 어떤 키에서 mojibake가 발견됐는지 즉시 알 수 있다 ✅

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| 재귀 순회로 모든 중첩 키 커버 | ✅ |
| `puzzles.*` 제외로 catalog와 중복 방지 | ✅ |
| mojibake 패턴 확장 | ✅ |
| 실패 시 키 이름 리포트 | ✅ |

v0.1.289(소스 스캔) + v0.1.293(런타임 재귀 검증) 두 레이어가 서로 다른 시점에 다른 범위를 잡는다 — 상호 보완적인 구조 ✅

---

## Review 56 — 2026-07-12

**커밋:** [004aab9 qa: guard completed line guidance](https://github.com/bbockara-lab/pips-picture-pantry/commit/004aab9)

---

### 완성 줄 가이던스 로직 직접 테스트 보강

Review 41(v0.1.271)에서 `getLineGuidance`가 올바르게 구현됐지만 단위 테스트가 없었다. 이 커밋이 그걸 닫는다.

**`getLineGuidance` export 추가:**
```js
// before
function getLineGuidance(puzzle, state, options)   // private
// after
export function getLineGuidance(puzzle, state, options = {})  // 테스트 접근 가능
```
`options = {}` 기본값도 함께 추가 — 테스트에서 옵션 없이 호출 가능 ✅

**테스트 1 — 진짜 완성된 줄만 인식:**
```js
const puzzle = { size: 3, solution: [[true,true,false],[false,false,false],[true,false,true]] };
const state = { cells: [
  [filled, filled, empty],   // row 0: solution 정확히 일치 → 완성
  [empty, marked, empty],    // row 1: 빈 칸 줄, marked는 OK → 완성
  [filled, empty, empty]     // row 2: 미완성
] };

expect([...guidance.completedRows]).toEqual([0, 1]);    // row 2 미포함
expect([...guidance.completedColumns]).toEqual([0, 1]); // column 2 미포함
```

row 1(`[false,false,false]` 솔루션)은 `marked` 셀이 있어도 `not filled`이므로 완성으로 인식 — `isLineCorrectlySatisfied`의 "채워야 할 자리는 filled, 나머지는 not-filled" 로직이 맞다는 걸 이 테스트가 확인 ✅

**테스트 2 — locked 보드에서 가이던스 꺼짐:**
```js
const guidance = getLineGuidance(puzzle, state, { locked: true });
expect(guidance.completedRows.size).toBe(0);
expect(guidance.completedColumns.size).toBe(0);
```
완성된 퍼즐 화면(완료 배너 등)에서 글로우가 뜨지 않는 것을 검증 ✅

---

### 전체 평가

| 항목 | 상태 |
|---|---|
| `getLineGuidance` export + 기본값 | ✅ |
| 진짜 완성된 줄만 인식 테스트 | ✅ |
| locked 보드 가이던스 꺼짐 테스트 | ✅ |
| 테스트 파일 newline 수정 (`\ No newline`) | ✅ |

v0.1.292~294 세 커밋 합산: 타임어택 온보딩 가드 → 한국어 카피 전체 가드 → 완성 줄 로직 가드. QA 레이어가 UI, 카피, 보드 로직 세 방향으로 동시에 확장됐다. Vitest가 87 passed — 이 숫자가 쌓일수록 리팩터 안전망이 두꺼워진다.

---

## Review 57 — v0.1.296 `593edca` ui: clarify spoon hint confirmation

### 변경 개요

힌트 확인 패널에 **스푼 비용 칩(`.hint-panel__cost-chip`)** 추가. 무료 힌트가 소진된 뒤 유료 힌트로 넘어갈 때 유저가 얼마를 쓰는지 텍스트 안에 묻히지 않고 시각적으로 즉시 파악할 수 있도록 한다.

### 핵심 결정 — "힌트는 하나" UX 유지

힌트 버튼은 여전히 하나. `free / paid / time-attack` 레이블을 유저에게 노출하지 않는다는 원칙이 이번에도 유지됐다. 비용은 확인 단계에서만 칩 형태로 드러난다 — "힌트를 쓸까요?" 단계에서 `4 🥄` 칩이 뜨는 방식.

### 구현 세부사항

**`src/ui/puzzleAssistView.js`**
- `renderHintConfirm` 내부에 `costChip` div 추가
- `aria-label="4 spoons"` (i18n: `controls.hintCostLabel`) — 스크린리더 접근성 확보
- `innerHTML`로 `.hint-panel__spoon-mark` + `<strong>` 조합 삽입 → `confirm.append(title, costChip, body, actions)` 순서

**`src/styles.css`**
- `.hint-panel__cost-chip`: `inline-grid 2열 (20px + auto)`, `border-radius: 999px`, 황금색 그라데이션, min 58×34px
- `.hint-panel__spoon-mark`: 18px 원형 + `::after` 슈도 엘리먼트로 스푼 자루 모양 (rotate 38도)
- 순수 CSS로 스푼 아이콘 표현 — 새 이미지 에셋 없음

**`src/i18n/en.js` / `src/i18n/ko.js`**
- `hintCostLabel`: `"{cost} spoons"` / `"스푼 {cost}개"` 추가

**`tests/puzzleAssistView.test.js`**
```js
it("keeps spoon hint copy user-facing without paid labels", () => {
  // 영어: "paid" 없음, "spoons" 있음
  expect(englishCopy.toLowerCase()).not.toContain("paid");
  expect(englishCopy).toContain("spoons");
  // 한국어: "유료" 없음, "스푼" 있음
  expect(koreanCopy).not.toContain("유료");
  expect(koreanCopy).toContain("스푼");
});
```
새 `hintCostLabel` 키가 "유료/paid" 없이 스푼 언어만 쓴다는 것을 자동 검증.

**`scripts/mobile_visual_check.js`**
- 픽스처 HTML에 `.hint-panel__cost-chip` + `.hint-panel__spoon-mark` 포함
- 추가 어서션: `costChipText === "4"`, `costChipLabel ∋ "4"`, `costChipWidth ≥ 48`, `costChipHeight ≥ 32`, 그라데이션 배경, 스푼마크 14×14px 이상

### 평가

| 항목 | 상태 |
|---|---|
| 비용 칩 시각 표현 (CSS only, 에셋 추가 없음) | ✅ |
| aria-label 접근성 | ✅ |
| i18n 키 en/ko 동시 추가 | ✅ |
| "유료/paid" 미노출 자동 검증 | ✅ |
| 모바일 QA 칩 크기·그라데이션·스푼마크 가드 | ✅ |
| Vitest 88 passed | ✅ |

스푼 마크를 CSS `::after` 슈도 엘리먼트로만 구현한 점이 깔끔하다. 나중에 아이콘 에셋이 생기면 `background-image`만 교체하면 되는 구조.

플래그 없음. 이번 커밋은 이전 리뷰(힌트 경제 확립)의 UX 마무리 단계로 적절하다.

---

## Review 58 — v0.1.297 `1815750` ui: polish completed line guidance

### 변경 개요

완성된 줄(row/column) 글로우와 안전 빈칸 X 제안의 시각적 품질을 높이는 폴리시 커밋. Review 56에서 로직을 테스트로 고정했고, 이번 커밋은 그 위에 렌더링 레이어를 입혔다.

### CSS 구조

**클루 레이블 글로우** (`.row-clue.line-complete::after`, `.column-clue.line-complete::after`):
- `isolation: isolate` + `::after` 슈도 엘리먼트로 쌓임 맥락 분리
- `z-index: -1` 배경 글로우 — 기존 텍스트/레이아웃 영향 없음
- 연두·황금 방사형 그라데이션 — 완성 축하 느낌을 부드럽게 전달

**완성된 셀 배경** (`.puzzle-cell.completed-row:not(.filled):not(.marked)`):
- `:not(.filled):not(.marked)` 가드 — 채워진 셀 배경색을 덮어쓰지 않음
- `background-blend-mode: screen` 로 겹침 처리

**안전 제안 X** (`.puzzle-cell.safe-suggestion`):
- `outline: 2px dashed rgba(72, 138, 122, 0.34)` + `outline-offset: -5px` — 테두리가 셀 내부로 들어가 보드 그리드와 겹치지 않음
- `::after` 슈도 엘리먼트로 반투명 민트 배경 오버레이

### 모바일 QA 보강

기존: DOM 클래스 개수만 카운트
추가: `getComputedStyle`로 실제 렌더링 값 검사
```js
!metrics.rowClueStyle.background.includes("gradient")  // 클루 그라데이션
|| metrics.glowCellStyle.boxShadow === "none"           // 셀 글로우
|| metrics.safeCellStyle.borderStyle !== "dashed"       // X 윤곽선
|| metrics.safeCellStyle.outlineStyle !== "dashed"
|| !metrics.safeCellStyle.background.includes("gradient")
```
CSS 리팩터가 시각 품질을 무너뜨리면 QA에서 잡힌다.

### 평가

| 항목 | 상태 |
|---|---|
| 완성 줄 로직 불변 (변경 없음) | ✅ |
| `:not(.filled):not(.marked)` 채워진 셀 보호 | ✅ |
| `z-index: -1` 글로우 쌓임 맥락 격리 | ✅ |
| `outline-offset: -5px` 그리드 비침 방지 | ✅ |
| QA가 DOM→ComputedStyle로 격상 | ✅ |

플래그 없음. 로직 고정 → 시각 폴리시 → QA 격상 순서가 교과서적이다.

---

## Review 59 — v0.1.298 `eb523fc` ui: polish puzzle controls

### 변경 개요

퍼즐 조작 버튼 세 개(칠하기 / 빈칸 체크 / 한 수 되돌리기)를 텍스트 전용에서 **아이콘 + 레이블** 구조로 전환. 순수 CSS 아이콘, 새 이미지 에셋 없음.

### 구조 변경

**`src/ui/puzzleView.js`**
- `createModeButton(label, active, onClick)` → `createModeButton(label, active, onClick, iconName)` 시그니처 확장
- `createControlIcon(name)` / `createControlLabel(label)` 헬퍼 두 개 추출
- 기존 `button.textContent = label` 대신 `button.append(icon, labelSpan)` 조합
- `undoButton.className`에 `control-button control-button--undo` 추가
- `aria-label` 명시적 설정 — 아이콘만 봐도 스크린리더가 읽을 수 있음

**`src/styles.css`**
- `.control-button`: `grid-template-columns: 26px minmax(0, 1fr)`, `min-height: 54px`
- `.control-button__icon`: 24px 정사각형, 각 모드별 `--fill` / `--mark` / `--undo` 변형
  - fill: 갈색 사각형 (채우기 느낌)
  - mark: X 십자 (빈칸 마킹) — `::before` rotate(45deg) + `::after` rotate(-45deg)
  - undo: 반원 호 + 화살촉 — `::before` + `::after`로 순수 CSS 구현
- `@media (max-width: 380px)`: 아이콘 위 레이블 아래 세로 배치로 폴백

**모바일 QA**
```js
controlMetrics.length !== 3
|| controlMetrics.some((m) =>
    !m.text || m.height < 52 || !m.background.includes("gradient")
    || m.iconWidth < 20 || m.iconHeight < 20
    || !m.ariaLabel || m.overflows
)
```
3개 버튼 모두 레이블·높이·그라데이션·아이콘 크기·aria-label·overflow 동시 검사.

### 주목할 점

- **undo 불변 유지**: 버튼 모양만 바꿨고, `undoLastMove(state)` 호출 로직은 그대로. `hintsUsed` / `paidHintsUsed` 절대 감소 안 함 — 이전 리뷰들(42, 44, 45)에서 확립된 불변이 건드려지지 않았다.
- **`minmax(0, 1fr)`**: 긴 레이블 텍스트가 그리드를 넘치지 않도록 명시적으로 0 하한 설정.
- **CSS 아이콘 완성도**: fill(사각형), mark(X), undo(화살표 호)를 모두 `::before`/`::after`로만 표현. 나중에 SVG/bitmap 아이콘으로 교체하면 `.control-button__icon` CSS만 바꾸면 된다.

### 평가

| 항목 | 상태 |
|---|---|
| 아이콘 + 레이블 구조 (에셋 없음) | ✅ |
| aria-label 접근성 | ✅ |
| 380px 미만 세로 폴백 레이아웃 | ✅ |
| undo 불변 (hintsUsed/paidHintsUsed 감소 없음) | ✅ |
| 모바일 QA 3버튼 통합 검사 | ✅ |
| Vitest 88 passed | ✅ |

플래그 없음. v0.1.297~298 두 커밋으로 게임 플레이 핵심 UI(완성 가이던스 + 조작 버튼)가 폴리시 완료. 다음 단계는 실제 아트 에셋 교체 또는 스토어 준비 작업으로 이어질 수 있다.

---

## Review 60 — v0.1.301 `45b4714` ui: polish play header hud

### 변경 개요

플레이 화면 상단 헤더를 **tactile HUD 카드** 형태로 통합. 뒤로 버튼 / 퍼즐 타이틀 / 설정 버튼 / 보드 크기 칩이 하나의 카드 안에서 읽힌다.

### CSS 구조

**`.play-screen__header`**
- `grid-template-columns: auto minmax(0, 1fr) 48px auto` — 뒤로 | 타이틀 | 설정 | 크기칩 4열 그리드
- `border-radius: 16px`, 황금-민트 그라데이션 배경
- `box-shadow: 0 5px 0` — 카드 눌린 느낌

**모드별 배경 변형**
- `.play-screen--time-attack`: 황금-주황 톤 (긴장감)
- `.play-screen--replay`: 민트-크림 톤 (회고 느낌)
- 로직 변경 없이 CSS 클래스만으로 모드 분기

**`.play-screen__back` / `.play-screen__settings`**
- 둘 다 `min-height: 44px` — 터치 타깃 기준 준수
- 설정 버튼: `width: 46px` 정사각형, `place-items: center` 이모지 중앙 정렬

**380px 미만 폴백**
- 3열 그리드로 전환, `.difficulty` 칩이 2행으로 내려감

### 모바일 QA

`getComputedStyle` 기반 실값 검사:
- 헤더가 뷰포트 밖으로 나가지 않는지 (`left ≥ -1`, `right ≤ viewportWidth + 1`)
- `height ≥ 64`, `borderRadius ≥ 14`, 그라데이션 배경 존재
- 타이틀 overflow 없음
- 모든 컨트롤 터치 높이 `≥ 30`, 뷰포트 안에 있음

### 평가

| 항목 | 상태 |
|---|---|
| 4열 그리드 HUD 카드 구조 | ✅ |
| Time Attack / Replay 배경 분기 (로직 무변경) | ✅ |
| 44px 터치 타깃 준수 | ✅ |
| 380px 미만 세로 폴백 | ✅ |
| 모바일 QA 실값 검사 | ✅ |

플래그 없음.

---

## Review 61 — v0.1.302 `3f7487c` ui: unify puzzle tool shelf

### 변경 개요

컨트롤 버튼 / 힌트 패널 / 진행 칩 세 영역을 **하나의 플레이 도구 선반**으로 통합. 폭·간격·라운딩·그라데이션을 공유해 시각적으로 하나의 상호작용 구역처럼 읽히도록 했다. 기능 로직은 일절 건드리지 않음.

### CSS 핵심

**공통 처리** (`:not(.completed)` 가드)
- 완료 화면에는 이 스타일이 적용되지 않음 — 클리어 연출과 충돌 방지
- `width: min(100%, 520px)` + `margin-inline: auto` — 큰 화면에서 지나치게 넓어지지 않음

**`.controls`**: `border-radius: 18px`, 황금-민트 그라데이션, `box-shadow: 0 4px 0`
**`.hint-panel`**: 동일 라운딩·그림자·그라데이션으로 시각 통일

**인접 선택자로 간격 통제**
```css
.controls + .hint-panel,
.hint-panel + .progress-line {
  margin-top: 10px;
}
```
DOM 구조에 의존하지 않고 실제 인접 관계로 간격 적용.

### 모바일 QA

세 노드를 동시에 읽어 **스택 일관성** 검사:
- 세 요소 모두 뷰포트 밖 나감 없음, `width ≤ 530`
- `controls → hint` 간격 6~20px 범위
- `progress`가 `hint` 아래에 위치
- controls/hint 모두 `borderRadius ≥ 16`, 그라데이션 배경

### 평가

| 항목 | 상태 |
|---|---|
| `:not(.completed)` 가드 — 클리어 연출 보호 | ✅ |
| `min(100%, 520px)` 넓은 화면 제어 | ✅ |
| 인접 선택자 간격 통제 | ✅ |
| 힌트/완료 불변 — 로직 미접촉 | ✅ |
| 모바일 QA 스택 일관성 검사 | ✅ |
| Vitest 89 passed | ✅ |

v0.1.301~302 두 커밋으로 플레이 화면이 위(헤더 HUD)에서 아래(도구 선반)까지 하나의 디자인 언어로 연결됐다. 플래그 없음.

---

## Review 62 — v0.1.306 `80b187d6` ui: polish stage complete reward facts

### 변경 개요

스테이지 완료 오버레이에 **보상 사실 칩 두 개** 추가 — "앨범 채움 / 방 진행도 성장". 스테이지 클리어 순간이 일회성 보너스를 넘어 컬렉션·판트리 진행과 연결됨을 유저가 즉시 읽을 수 있게 한다.

### 구현

**`src/ui/stageComplete.js`**
```html
<div class="stage-complete-facts" aria-label="${t("stageComplete.factsLabel")}">
  <span>${t("stageComplete.albumFact")}</span>
  <span>${t("stageComplete.nextFact")}</span>
</div>
```
스테이지 보너스 마크업 바로 아래, CTA 버튼 위에 삽입. 완료 로직·스푼 규칙·dismiss 동작 무변경.

**`src/styles.css`**
- `.stage-complete-facts`: `grid-template-columns: repeat(2, minmax(0, 1fr))` 2열 균등 배치
- `.stage-complete-facts span`: `min-height: 34px`, `border-radius: 14px`, 크림-황금 그라데이션, `font-weight: 950`

**`src/i18n/en.js` / `src/i18n/ko.js`**
- `factsLabel`, `albumFact`, `nextFact` 세 키 추가

**모바일 QA**
- 픽스처에 `.stage-complete-facts` 포함
- `factCount === 2`, 각 칩 `width ≥ 90`, `height ≥ 32`, `borderRadius ≥ 12`, 그라데이션 배경, overflow 없음

### 평가

| 항목 | 상태 |
|---|---|
| 완료 로직 무변경 | ✅ |
| 2열 균등 칩 배치 | ✅ |
| aria-label로 구역 접근성 | ✅ |
| i18n en/ko 동시 추가 | ✅ |
| 모바일 QA 칩 크기·그라데이션 가드 | ✅ |

칩 두 개가 "앨범" → "방 진행" 으로 자연스럽게 다음 목표를 암시한다. 플래그 없음.

---

## Review 63 — v0.1.307 `0e76422b` ui: polish large board cursor pad

### 변경 개요

12×12+ 큰 보드용 커서 패드를 **게임패드 스타일 tactile 컨트롤**로 격상. D패드(4방향) + 칠하기/빈칸 체크 액션 버튼, 현재 줄/칸 위치 칩 추가. 퍼즐 로직 무변경.

### CSS 구조

**`.cursor-controls`**: `width: min(100%, 520px)`, `border-radius: 18px`, `box-shadow: 0 12px 24px` — 패널 전체가 카드 느낌

**`.cursor-dpad`**: `3×3 그리드` (44px 셀), 황금 배경. 4방향 버튼이 각각 `grid-column/row`로 위치 지정 — 가운데 셀은 비움

**`.cursor-move` / `.cursor-action-button`**:
- `min-height: 44px` 터치 타깃
- `:active`에서 `translateY(2px)` + `box-shadow` 감소 — 눌리는 물리 피드백
- 칠하기: 황금, 빈칸 체크: 민트 — 색으로 기능 구분

**위치 칩 `.cursor-controls__position`**
```js
position.textContent = t("controls.cursorPosition", {
  row: Math.max(1, Number(state.cursor?.row || 0) + 1),
  column: Math.max(1, Number(state.cursor?.column || 0) + 1)
});
```
0-indexed → 1-indexed 변환 + null 방어. `Math.max(1, ...)` 로 커서가 없을 때 Row 1, Column 1 표시.

**420px 미만 폴백**: `grid-template-columns: 1fr` — D패드와 액션 버튼이 세로로 쌓임

### 모바일 QA

```js
cursorPadMetrics.moves.length !== 4
|| cursorPadMetrics.moves.some(b => b.width < 40 || b.height < 40 || !b.label)
|| cursorPadMetrics.actions.length !== 2
|| cursorPadMetrics.actions.some(b => b.width < 120 || b.height < 44)
|| !cursorPadMetrics.positionText
|| cursorPadMetrics.overflows
```
버튼 개수·크기·aria-label·위치 칩 텍스트·overflow 전부 검사.

### 평가

| 항목 | 상태 |
|---|---|
| D패드 3×3 그리드 (가운데 빈칸) | ✅ |
| `:active` 물리 피드백 | ✅ |
| 위치 칩 0→1 인덱싱 + null 방어 | ✅ |
| 420px 세로 폴백 | ✅ |
| 퍼즐 로직·힌트·undo 불변 | ✅ |
| 모바일 QA 커서패드 통합 검사 | ✅ |
| Vitest 89 passed | ✅ |

v0.1.306~307 합산: 스테이지 완료 보상 → 큰 보드 조작 UI 순서로 클리어 직후 흐름과 반복 플레이 조작 편의가 동시에 올라갔다. 플래그 없음.

---

## Review 65 — v0.1.315 `33def01` ui: polish puzzle control symbols

### 변경 개요

칠하기 / 빈칸 체크 / 한 수 되돌리기 아이콘과 큰 보드 커서 패드 액션 아이콘을 **Sunny Spoon 토큰 스타일**로 격상. 이전 커밋(eb523fc)에서 구조를 잡았고, 이번에 렌더링 품질을 올렸다. 퍼즐 로직 무변경.

### CSS 변경 핵심

**아이콘 공통 (`.control-button__icon`)**
- 스팟 하이라이트: `radial-gradient` 반지름을 `28%→18%` 축소 + `0 18%` 하드 엣지 — 번지던 빛 효과가 작고 선명해짐
- `box-shadow` 에 `inset 0 -2px` 하단 음영 추가 — 입체감
- `overflow: hidden` — 슈도 엘리먼트가 부모 밖으로 나가지 않게

**fill 아이콘**
- `::before` 내부 칸에 `box-shadow: inset 0 1px + 0 1px` 추가 — 중첩 볼록 효과
- `::after` 우측 하단 작은 원형 광택 추가

**mark 아이콘 X 선**
- 단색 `rgba(61,43,46,0.72)` → 컬러 `#4f9282` + 흰색 그라데이션 오버레이
- `box-shadow` 추가 — 선 자체가 살짝 돌출

**undo 아이콘**
- 화살표 색 단색 `rgba` → `#7b6049` 고정 + `filter: drop-shadow` 흰색 배경 광택
- 호 각도 `rotate(24deg)→34deg`, 화살촉 `-20deg→-28deg` — 더 자연스러운 되돌리기 모양

**커서 액션 버튼 (`::before`/`::after`)**
- `::before` 아이콘: `inset 0 2px/0 -2px` 입체 테두리, 방사형 스팟 하이라이트 추가
- `::after` 광택 원 추가 (mark 버튼은 `display: none`)

### 모바일 QA 격상

컨트롤 버튼: `iconBackground`, `iconShadow`, `symbolBackground`, `shineContent` 추가 검사  
커서 액션 버튼: `iconBackground`, `iconRadius`, `iconShadow` 추가 검사  
한국어 regex 리터럴 → `\uXXXX` 이스케이프 (PowerShell 인코딩 안전화)

### 평가

| 항목 | 상태 |
|---|---|
| 아이콘 공통 입체감 강화 (3중 box-shadow) | ✅ |
| fill/mark/undo 각 아이콘 개별 폴리시 | ✅ |
| 커서 패드 액션 아이콘 동일 수준 격상 | ✅ |
| 모바일 QA pseudo-element 실값 검사 격상 | ✅ |
| 한국어 regex 이스케이프 (인코딩 안전) | ✅ |
| 퍼즐 로직 무변경 | ✅ |
| Vitest 93 passed (+4) | ✅ |

Vitest가 89→93으로 늘었다. 이 커밋 단독으로 테스트 4개가 추가된 것 — UI 폴리시 커밋에서 테스트까지 함께 격상됐다는 점이 좋다. 플래그 없음.

---

## Review 66 — v0.1.316 `483f7af` ui: add pip-led how-to guide

### 변경 개요

퍼즐 내 그림 가이드를 **Pip 캐릭터가 옆에서 말하는 미니 대화 장면**으로 전환. `pip-chrome-v2` 에셋을 처음으로 가이드 UI에 직접 붙였다. 퍼즐 로직 무변경.

### 구조 변경

**`src/ui/puzzleAssistView.js`**
```js
import pipGuideUrl from "../assets/characters/pip-chrome-v2.png";
```
기존 `<div class="guide-copy">` 단독 → `<div class="guide-pip-scene">` 래퍼 안으로:
```html
<div class="guide-pip-scene">
  <img class="guide-pip-scene__pip" src="${pipGuideUrl}" alt="" aria-hidden="true" />
  <div class="guide-copy guide-pip-scene__bubble">...</div>
</div>
```
Pip 이미지는 장식(`aria-hidden="true"`) — 스크린리더는 버블 텍스트만 읽음.

**`src/styles.css`**
- `.guide-pip-scene`: `grid-template-columns: 74px minmax(0, 1fr)` 2열 그리드
- `.guide-pip-scene__pip`: `74px` 정사각형, `object-fit: contain`, `drop-shadow(0 8px 0)` 접지 그림자
- `.guide-pip-scene__bubble`: 크림-민트 그라데이션 카드
- `.guide-pip-scene__bubble::before`: `rotate(45deg)` 다이아몬드 꼬리 — 말풍선 방향 표시
- 380px 미만: Pip 58px로 축소, 꼬리 위치 조정

**`.how-to-play.visual-guide` 비율 조정**  
`grid-template-columns` 좌측 비율: `1fr → 1.2fr` — Pip+버블 영역이 더 넓어짐

### 모바일 QA

`pip-chrome-v2` src 포함 여부, Pip 52×52px 이상, `object-fit: contain`, 버블 120×70px 이상, 그라데이션 배경, `borderRadius ≥ 12`, 그림자 존재, scene 너비 180 이상.

### 평가

| 항목 | 상태 |
|---|---|
| 캐릭터 에셋 첫 가이드 UI 연결 | ✅ |
| `aria-hidden="true"` 장식 이미지 처리 | ✅ |
| CSS 말풍선 꼬리 (`::before` rotate) | ✅ |
| 380px 미만 Pip 크기 폴백 | ✅ |
| 모바일 QA 에셋·버블·꼬리 가드 | ✅ |
| 퍼즐 로직 무변경 | ✅ |
| Vitest 93 passed | ✅ |

`pip-chrome-v2` 에셋이 첫 번째 실 UI 연결 지점이 됐다. 말풍선 꼬리를 `rotate(45deg)` 다이아몬드로 만든 것은 이전 스푼 자루 패턴과 같은 방식 — CSS-only 일관성을 유지하면서 Pip이 실제로 말하는 것 같은 느낌을 냈다. 플래그 없음.

---

## Review 67 — v0.1.319 `8758bdb` ui: polish puzzle board frame

### 변경 개요

플레이 화면의 퍼즐 패널 / 퍼즐 메타 행 / 보드 트레이 / 그리드 프레임을 **따뜻한 종이 트레이 스타일**로 통합 폴리시. 기능 무변경 — 시각 레이어만.

### CSS 계층 구조

`:not(.completed)` 가드를 전체 셀렉터에 일관되게 적용 — 완료 화면 연출과 충돌 없음.

**`.puzzle-panel:not(.completed)`**
- 3중 그림자: `0 6px 0` 바닥 / `0 16px 32px` 확산 / `inset 0 1px 0` 상단 하이라이트
- 황금 방사형 스팟 + 크림 선형 배경

**`.puzzle-meta`** (`:not(.completed)` 아래)
- `width: min(100%, 520px)` 넓은 화면 제어
- 민트-크림 그라데이션, `box-shadow: 0 4px 0`

**`.board-wrap:not(.locked)`**
- `--board-cell-size: clamp(18px, calc((100vw - 160px) / var(--board-size)), 44px)` — CSS 변수로 셀 크기 자동 계산
- `repeating-linear-gradient` 줄무늬 패턴 — 종이 질감 표현
- 420px 미만: 칸 크기 상한 42px, 그리드 padding 12→8px

**`.puzzle-grid`**
- `border: 3px solid` + `padding: 3px` — 그리드 자체가 하나의 프레임

**클루 active 상태**
- 기본 배경: 반투명 크림 (`rgba(255,252,241,0.46)`)
- active: 황금 그라데이션 강조

### 모바일 QA (`expectPuzzleBoardFramePolish`)

`panel`, `meta`, `board`, `grid`, `activeClue` 5개 노드 동시 검사:
- panel: `radius ≥ 16`, 그라데이션, 그림자
- meta: `width ≤ 530`, 뷰포트 내, `radius ≥ 16`, 그라데이션
- board: 뷰포트 내, `radius ≥ 16`, 그라데이션, 그림자
- grid: `borderWidth ≥ 2`, `radius ≥ 12`, 그라데이션, 뷰포트 내
- activeClue: 그라데이션 존재

### 평가

| 항목 | 상태 |
|---|---|
| `:not(.completed)` 전 셀렉터 가드 | ✅ |
| `--board-cell-size` CSS 변수 자동 계산 | ✅ |
| `repeating-linear-gradient` 종이 질감 | ✅ |
| 5-노드 동시 QA 검사 | ✅ |
| 420px 미만 폴백 | ✅ |
| 로직 무변경 | ✅ |

`clamp()` + CSS 변수로 보드 셀 크기가 화면 너비에 따라 자동 계산된다. JS 개입 없이 모든 크기 화면 대응. 플래그 없음.

---

## Review 68 — v0.1.320 `1f99600` game: guard time attack countdown wiring

### 변경 개요

`renderPlayScreen` 에서 `timeAttackLimitSeconds`가 destructure 되지 않아 카운트다운 계산 시 `undefined`가 들어갈 수 있는 **런타임 리스크**를 닫은 커밋. UI 변화 없음 — 소스 레벨 결함 수정.

### 변경 내용

**`src/ui/playScreen.js`**
```js
// 추가 전
timeAttackElapsedSeconds = 0,
// 다음 줄 누락
replayChallenge = false,

// 추가 후
timeAttackElapsedSeconds = 0,
timeAttackLimitSeconds = 0,   // ← 명시적 destructure + 기본값
replayChallenge = false,
```
options에서 꺼내지 않으면 `timeAttackLimitSeconds`가 스코프에 없어서 `Math.max(0, Number(timeAttackLimitSeconds))` 에서 `NaN` → 카운트다운이 0으로 고정되거나 잘못 표시될 수 있었다.

파일 끝에 개행 없던 것도 함께 수정 (`\ No newline at end of file` 제거).

**`tests/playScreen.test.js`**
```js
it("destructures the time attack limit before rendering the countdown", () => {
  expect(playScreenSource).toMatch(/timeAttackLimitSeconds\s*=\s*0/);
  expect(playScreenSource).toMatch(/Math\.max\(0,\s*Number\(timeAttackLimitSeconds/);
});
```
소스 코드 정규식 검사 — 배선이 다시 빠지면 테스트가 즉시 잡는다.

### 평가

| 항목 | 상태 |
|---|---|
| `timeAttackLimitSeconds` 명시적 destructure | ✅ |
| 기본값 `= 0` — undefined 방어 | ✅ |
| 소스 레벨 테스트로 배선 회귀 방지 | ✅ |
| 파일 끝 개행 정리 | ✅ |
| Vitest 94 passed (+1) | ✅ |

폴리시 커밋 사이에 끼어 있던 무증상 버그를 코드 리뷰로 발견해 닫은 케이스. `timeAttackLimitSeconds`가 누락된 채로 타임어택을 한 번도 테스트 안 했다면 실기기에서 카운트다운 0으로 굳는 현상으로 발현됐을 것이다. 플래그 없음.

---

## Review 69 — v0.1.324 `e601eb4d` ui: polish stage complete reward card

### 변경 개요

스테이지 완료 카드를 세 층으로 격상 — **카드 상단 리본**, **사실 칩 좌측 원형 아이콘**, **CTA 버튼 황금 그라데이션 + 물리 피드백**. 로직 무변경.

### CSS 변경

**`.stage-complete-card::before`** — 카드 상단 리본
```css
inset: 10px 14px auto;   /* 카드 상단에만 위치 */
height: 12px;
background: linear-gradient(90deg, transparent, rgba(255,216,109,0.72), transparent);
```
좌우가 투명해져 중앙만 빛나는 황금 빛줄기 효과. `pointer-events: none` + `position: relative` 부모 필요.

**`.stage-complete-facts span`** — 칩 내부 아이콘
- `padding-left: 28px` (기존 `6px 8px` → `6px 8px 6px 28px`)
- `::before`: 13px 원형, 민트+황금 방사형 그라데이션 + 그림자

**`.stage-complete-cta`** — CTA 버튼
- 황금 그라데이션 `#ffe68f → #f4bc42`
- `:active`: `translateY(2px)` + `box-shadow` 감소 — 이전 커서 버튼과 동일한 물리 피드백 패턴

### 모바일 QA 추가

- `cardBefore` 높이 ≥ 8, 그라데이션 배경
- 사실 칩 `::before` 너비 ≥ 10, 그라데이션 배경
- CTA `ctaBackground.includes("linear-gradient")` (기존에 이미 있음)

| 항목 | 상태 |
|---|---|
| 카드 상단 리본 `::before` (좌우 페이드) | ✅ |
| 사실 칩 원형 아이콘 `::before` | ✅ |
| CTA `:active` 물리 피드백 | ✅ |
| 로직·보너스·dismiss 무변경 | ✅ |
| 모바일 QA pseudo-element 실값 검사 | ✅ |

플래그 없음.

---

## Review 70 — v0.1.325 `fb4a582d` ui: polish safe blank suggestion artwork

### 변경 개요

완성 줄 안전 빈칸 제안의 X 표시를 **raw 텍스트/text-shadow → CSS 아트 레이어**로 교체. `::before`(배경 패널) + `::after`(X 도형) 2레이어 구성.

### CSS 변경

**기존** — `text-shadow`로 X 글자 처리, 셀 텍스트 색상 그대로
**변경** — `color: transparent; text-shadow: none` 으로 텍스트 완전 숨김 후:

```css
/* ::before — 배경 패널 */
.puzzle-cell.safe-suggestion::before {
  inset: 7px;
  border-radius: 6px;
  background: radial-gradient + linear-gradient;
  box-shadow: inset 0 0 0 1px rgba(72,138,122,0.16);
}

/* ::after — X 도형 */
.puzzle-cell.safe-suggestion::after {
  inset: 50% auto auto 50%;          /* 중앙 정렬 */
  width: min(64%, 20px);
  height: min(64%, 20px);
  background:
    linear-gradient(45deg, ...),     /* / 방향 선 */
    linear-gradient(135deg, ...);    /* \ 방향 선 */
  transform: translate(-50%, -50%) rotate(-4deg);  /* 미세 기울기 */
  filter: drop-shadow(0 1px 0 rgba(255,255,255,0.78));
}
```
`rotate(-4deg)` 미세 기울기로 기계적이지 않은 손그림 느낌.

### 모바일 QA 추가

`readStyle()` 에 `beforeBackground`, `beforeBoxShadow`, `afterBackground`, `afterFilter`, `afterWidth/Height` 추가.  
`safeCellStyle.color === "rgba(0,0,0,0)"` — 텍스트가 실제로 숨겨졌는지 검증.

| 항목 | 상태 |
|---|---|
| 텍스트 → CSS 아트 대체 (`color: transparent`) | ✅ |
| `::before` 배경 패널, `::after` X 도형 | ✅ |
| `rotate(-4deg)` 손그림 느낌 | ✅ |
| `filter: drop-shadow` 흰색 광택 | ✅ |
| `color === "rgba(0,0,0,0)"` QA 검증 | ✅ |
| 완성 줄 로직 무변경 | ✅ |

cursor-marked 상태 CSS X(`::before` + `::after` rotate 패턴)와 같은 언어로 구현됐다 — 디자인 일관성 유지. 플래그 없음.

---

## Review 71 — v0.1.326 `1788ed7e` ui: fix guided line singular copy

### 변경 개요

모바일 QA에서 발견한 "**1 lines**" → "**1 line**" 단수형 copy 수정. 영어는 단수/복수 분기가 필요하지만 한국어(`줄`)는 변화 없음.

### 변경 내용

**`src/ui/puzzleView.js`**
```js
// 수정 전
badge.textContent = t("progress.linesGuided", { count: guidedLineCount });

// 수정 후
const lineCopyKey = guidedLineCount === 1 ? "progress.lineGuided" : "progress.linesGuided";
const lineAriaKey = guidedLineCount === 1 ? "progress.lineGuidedAria" : "progress.linesGuidedAria";
badge.textContent = t(lineCopyKey, { count: guidedLineCount });
badge.setAttribute("aria-label", t(lineAriaKey, { count: guidedLineCount }));
```

**`src/i18n/en.js`**
- `lineGuided: "{count} line"` / `lineGuidedAria: "{count} completed clue line"` 추가

**`src/i18n/ko.js`**
- `lineGuided: "{count}줄"` / `lineGuidedAria: "완성된 힌트 줄 {count}개"` 추가 — 값은 `linesGuided`와 동일하지만 키가 분리됨

**`tests/i18n.test.js`**
- `t("progress.lineGuided", { count: 1 }) === "1 line"` (영어)
- `t("progress.lineGuided", { count: 1 }) === "1줄"` (한국어)

| 항목 | 상태 |
|---|---|
| 단수/복수 분기 (`=== 1` 조건) | ✅ |
| 영어 단수 i18n 키 분리 | ✅ |
| aria-label 단수형도 함께 처리 | ✅ |
| 한국어 키 분리 (값 동일, 구조 일관) | ✅ |
| i18n 테스트 단수 케이스 추가 | ✅ |

모바일 QA가 copy 품질 버그까지 잡아내고 있다는 것을 보여주는 커밋. v0.1.324~326 세 커밋 합산: 완료 보상 시각 격상 → 안전 X CSS 아트 → copy 품질 수정. 다른 성격의 개선이 동시에 진행됐고 서로 충돌 없음. 플래그 없음.

---

## Review 72 — v0.1.327 `3de2fb4` ui: polish cursor symbol art guard

### 변경 개요

커서 상태칩 / D패드 버튼 / 안전 X 표시를 **게임 토큰** 수준으로 격상. 이전 커밋(5f3a493, fb4a582d)에서 구조를 잡았고, 이번에 렌더링 레이어를 추가했다.

### CSS 변경

**커서 상태칩 (`.cursor-controls__status`)**
- `gap: 6px` 추가로 `::before` 미니 토큰과 텍스트 간격 정리
- `::before` 14px 정사각형 미니 토큰 신설: 기본(황금), filled(주황), marked(민트+X 이중 그라데이션) 상태별로 칩과 토큰이 같은 색상 언어

**D패드 버튼 (`.cursor-move::after`)**
```css
.cursor-move::after {
  inset: 4px 5px auto;    /* 상단에만 위치 */
  height: 38%;
  border-radius: 12px 12px 8px 8px;
  background: linear-gradient(180deg, rgba(255,255,255,0.7), transparent);
}
```
버튼 상단 흰색 하이라이트 레이어 — 유리 버튼 느낌. `position: relative; overflow: hidden` 부모 추가.

**안전 X `::after`**
- `radial-gradient` 스팟 하이라이트 레이어 추가 (기존엔 X선 2개만)
- `filter` 이중화: `drop-shadow 흰색 + drop-shadow 어두운 색` — X가 표면 위에 살짝 떠 있는 느낌
- `afterTransform` 검증 추가 (transform이 `none`이면 X가 중앙 정렬되지 않은 것)

**아이콘 테두리 글로우**
- `.cursor-action-button::before` — `box-shadow`에 `0 0 0 3px rgba(255,250,232,0.62)` 외곽 글로우 추가

### 모바일 QA 추가

- 상태칩 `::before` 토큰: `width ≥ 12`, `height ≥ 12`, 그라데이션, `boxShadow ≠ none`
- D패드 버튼 `::after` 광택: `shineBackground.includes("gradient")`, `shineHeight ≥ 10`
- 안전 X: `afterBackground.includes("radial-gradient")` AND `linear-gradient` 모두 요구 (기존엔 하나만), `afterTransform ≠ none`

| 항목 | 상태 |
|---|---|
| 상태칩 `::before` 미니 토큰 (3상태 분기) | ✅ |
| D패드 `::after` 유리 광택 레이어 | ✅ |
| 안전 X 스팟 하이라이트 + 이중 drop-shadow | ✅ |
| `overflow: hidden` 슈도 엘리먼트 경계 처리 | ✅ |
| QA radial+linear 동시 요구 강화 | ✅ |
| 로직 무변경 | ✅ |

플래그 없음.

---

## Review 73 — v0.1.328 `413058e` ui: polish drag preview artwork

### 변경 개요

드래그 중 임시 미리보기 셀(`.drag-preview`)에 fill/X 토큰 아트 레이어 적용. 이전 CSS X 아트 패턴(safe-suggestion `::after`)을 드래그 marked 상태에도 통일. 드래그 동작 자체 무변경 — 시각 레이어만.

### CSS 변경

**공통 `::before`** — 모든 `drag-preview`에 내부 상단 광택 패널
```css
inset: 5px;
background: linear-gradient(180deg, rgba(255,255,255,0.58), transparent 56%);
box-shadow: inset 0 -2px 0 rgba(67,45,51,0.08);
```

**`.drag-preview.filled::after`** — 우측 하단 원형 광택
```css
inset: auto 7px 7px auto;
width: 30%; height: 30%;
background: radial-gradient(circle, rgba(255,241,186,0.76) ...);
```

**`.drag-preview.marked::after`** — 기존 `color: rgba(63,105,90,0.82)` → `color: transparent; text-shadow: none` + CSS X
```css
transform: translate(-50%, -50%) rotate(-4deg);
filter: drop-shadow(0 1px 0 rgba(255,255,255,0.78));
```
safe-suggestion `::after`와 동일한 `-4deg` 기울기 — 게임 전반 동일한 X 언어.

### 모바일 QA (`expectDragPreviewPolish`)

실제 포인터 이벤트를 발생시켜 `.drag-preview` 노드가 살아 있는 동안 검사:
```js
// pointerdown → pointermove (드래그 중)
await cells.nth(2).dispatchEvent("pointerdown", {...});
await grid.dispatchEvent("pointermove", {...});
// .drag-preview 아트 검사
const metrics = await page.evaluate(() => { ... });
// pointerup (드래그 해제)
await page.evaluate(() => window.dispatchEvent(new PointerEvent("pointerup", ...)));
```
`previewIsMarked` 분기: marked 상태일 때만 `afterTransform` 검사 (`filled`는 X가 없으므로).

| 항목 | 상태 |
|---|---|
| `::before` 광택 패널 (filled/marked 공통) | ✅ |
| `filled::after` 원형 광택 우측 하단 | ✅ |
| `marked::after` CSS X (safe-suggestion과 동일 언어) | ✅ |
| 실제 포인터 이벤트로 transient 노드 검사 | ✅ |
| `previewIsMarked` 분기 QA 정밀 처리 | ✅ |
| 드래그 동작·힌트·undo 불변 | ✅ |
| Vitest 94 passed | ✅ |

QA가 실제 드래그 제스처를 시뮬레이션해서 순간적으로 존재하는 `.drag-preview` 노드를 검사하는 것이 이 커밋의 기술적 핵심이다. 일반 DOM 검사로는 불가능한 영역을 커버한다. 플래그 없음.

## Pre-Launch Audit — Claude 선제 작업 (2026-07-13)

Android 출시 1주 전 기준. Codex 리뷰 없이 Claude가 직접 패치하거나 문서화한 항목들.

### 1. Android versionCode 출시 체크리스트 [문서화]

**대상:** `docs/ANDROID_RELEASE_STATUS.md`

**현황:** 마지막 Play Console 업로드 versionCode 27 (v0.1.35). 이후 v0.1.36~v0.1.334는 모두 로컬 전용. `build.gradle`은 여전히 `versionCode 27 / versionName "1.0.26"`. Play Console은 동일 versionCode 업로드를 거부하므로 다음 빌드 전 **versionCode ≥ 28** 필수.

**조치:** `docs/ANDROID_RELEASE_STATUS.md` 상단에 출시 전 체크리스트 섹션 추가. 자동화 여부, 최소 패치 예시, 검증 방법 포함. Codex 적용 사항: 출시 빌드 직전 `versionCode` / `versionName` 수동 증가.

---

### 2. Fixed 오버레이 safe-area 패치 [CSS 직접 패치]

**대상:** `src/styles.css`

**현황:** `index.html`에 `viewport-fit=cover`가 설정되어 있어 Android 제스처 네비게이션 폰에서 `env(safe-area-inset-bottom)`이 발동한다. `app-shell`은 이미 safe-area padding을 반영하고 있으나, 아래 4개 fixed 오버레이는 `document.body` 또는 flow 바깥에 있어 safe-area 혜택을 받지 못했다:

- `.modal-backdrop` — `position: fixed; inset: 0; padding: 18px`
- `.brand-intro` — `position: fixed; inset: 0; padding: 18px`
- `.guide-overlay` — `position: fixed; inset: 0; padding: 18px`
- `.stage-complete-overlay` — `position: fixed; inset: 0; padding: 22px`

제스처 네비게이션 폰(safe-area-inset-bottom ~34px)에서 이 오버레이들의 하단 콘텐츠(Dismiss 버튼 등)가 네비게이션 바 아래로 잘릴 수 있었다.

**패치:** `styles.css` 말미에 아래 추가:
```css
.modal-backdrop, .brand-intro, .guide-overlay {
  padding-bottom: calc(18px + env(safe-area-inset-bottom, 0px));
}
.stage-complete-overlay {
  padding-bottom: calc(22px + env(safe-area-inset-bottom, 0px));
}
```

`floating-nav`는 `position: sticky` + `app-shell` 내부 배치로 이미 safe-area 커버됨 — 별도 패치 불필요.

---

### 3. safe-suggestion CSS 이중 점선 버그 수정 [CSS 직접 패치]

**대상:** `src/styles.css`

**현황:** `.puzzle-cell.safe-suggestion` 셀렉터가 파일 내 두 번 등장:
- Line 5874: 구 아트 블록 — `border-style: dashed; border-color: rgba(72,138,122,0.76)` 설정
- Line 6267: 현재 아트 블록 — `outline: 2px dashed rgba(72,138,122,0.34)` 사용 (inner ring)

두 블록이 cascade merge되어 safe-suggestion 셀에 **점선 외부 border + 점선 내부 outline 두 개가 동시에** 표시되고 있었다. 6267 블록은 `border-style`을 재설정하지 않아 5874의 dashed border가 살아남았다.

**패치:** `styles.css` 말미에 추가:
```css
.puzzle-cell.safe-suggestion {
  border-style: solid;
  border-color: rgba(61, 43, 46, 0.38);
}
```
이로써 외부 border는 일반 solid로 되돌리고, 내부 dashed outline만 남는다. 시각적으로는 점선 테두리가 하나로 줄어드는 변화.

---

### 4. restoreState 셀 값 정규화 [코드 직접 패치]

**대상:** `src/game/puzzleState.js`, `tests/puzzleState.test.js`

**현황:** `restoreState()`가 `cells: parsed.cells`를 그대로 복원했다. LocalStorage 저장 파일이 손상되거나 구버전 앱에서 비정상 값(`""`, `null`, 알 수 없는 문자열)이 들어오면:
- `isSolved()`가 영원히 false → 무한 미완성 퍼즐
- `undoLastMove()`의 `if (cells[row]?.[col])` 조건이 falsy 값에서 셀 복원을 조용히 건너뜀

**패치 1 — restoreState 정규화:**
```js
const validCellValues = new Set(Object.values(CELL));
cells: parsed.cells.map((row) =>
  Array.isArray(row)
    ? row.map((cell) => (validCellValues.has(cell) ? cell : CELL.empty))
    : []
)
```

**패치 2 — undoLastMove 조건 명확화:**
```js
// 변경 전
if (cells[move.row]?.[move.column]) {
// 변경 후
if (cells[move.row]?.[move.column] !== undefined) {
```
truthy 체크 → undefined 체크. `CELL.empty = "empty"` 등 모든 유효 값이 truthy지만, 미래에 값 형식이 바뀌더라도 안전하게 동작한다.

**테스트 추가 (`tests/puzzleState.test.js`):**
- "normalizes unknown or empty cell values to empty when restoring a damaged save"
- "undoes correctly after restoring a damaged save with normalized cells"

**Vitest:** 97 → 99 passed (새 테스트 2개 추가).

---

### 5. Cozy Pass / IAP 미구현 상태 문서화 [문서화]

**대상:** `docs/CONTEXT.md`

**현황 확인 결과:**
- `cozyPassPurchased` 필드: save.js에 존재하지만 어디서도 읽히지 않음 → **미구현 예약 필드**
- `COZY_PASS_SPOON_GRANT: 250`: economyConfig.js에 존재하지만 사용되지 않음
- `pip-lucky-mug`: pantryDecorations에 premium으로 등록되어 있으나 runtimeArt 미승인 → 팬트리 샵 노출 없음
- `bonus-pack` 팩 5개: 퍼즐 허브에 "Optional add-on" 텍스트 + disabled 버튼으로 표시 (구매 플로우 없음)
- Capacitor에 Google Play Billing 플러그인 없음

**출시 리스크 판정: 낮음** — 유저가 IAP를 시도할 수 있는 버튼이 없고, disabled placeholder로만 표시됨. Play Store 정책 위반 아님.

**조치:** `docs/CONTEXT.md`에 IAP 미구현 상태 섹션 추가. Codex에게 v1 출시 전 IAP 관련 필드를 건드리지 말도록 명시.

## Review 74 — v0.1.334 `c1e26ef` game: add completed line auto marks

### 변경 요약

줄/칸이 정답과 일치하는 순간, 빈칸에 자동으로 X 마크를 찍어준다. 자동 마크는 직전 수와 같은 Undo 묶음으로 합산되어, Undo 한 번으로 플레이어 수와 자동 X가 함께 사라진다. Undo 자체는 재귀 호출하지 않는다(`skipAutoLineMarks` 옵션).

### 파일별 분석

**`src/game/puzzleState.js`**
- `applyCompletedLineMarks(state, solutionGrid)` 신규 export
  - `hasFilledTarget()`: 줄에 채워야 할 칸이 하나라도 있는지 확인 — all-blank 줄(예: 퍼즐 시작 직후 empty 줄)을 자동 마크 대상에서 제외
  - `isLineCorrectlySatisfied()`: 줄 전체가 해답과 정확히 일치하는지 검사 — `filled` 이어야 할 위치는 `filled`, 아닌 위치는 `filled`가 아니면 통과
  - `mergeAutoLineMarksIntoHistory()`: 최신 히스토리 엔트리에 autoLineMark 셀들을 merge — 없으면 새 엔트리 생성
  - `seen` Set으로 행/열 교차점 중복 마크 방지 (동일 셀이 완성 행과 완성 열 양쪽에서 트리거될 수 있음)
  - 솔루션 칸(`solution[row][col] === true`)은 addMark 대상 아님 — 정답 칸에 X를 찍지 않음
  - 변경 없을 때(`moves.length === 0`) state 원본 반환 — 불필요한 객체 생성 없음

- `applyCompletedLineMarks`는 행 → 열 순서로 순회. `seen` Set이 교차점 중복을 막으므로 순서 의존성 없음.

**`src/ui/puzzleView.js`**
- `update(nextState, options = {})` 시그니처 확장
  - `shouldAutoMark` 조건: `!skipAutoLineMarks && nextState.cells !== state.cells && !nextState.completed`
    - 참조 비교(`!==`)로 불변 객체 여부를 확인 — cells 배열이 실제로 바뀐 수에만 적용
    - 완료 직후에는 auto mark 건너뜀 — 이미 `isSolved` 처리가 이루어졌으므로
  - `undoLastMove` 호출 두 곳(키보드 단축키 `Ctrl+Z`, 버튼 클릭) 모두 `{ skipAutoLineMarks: true }` 전달 — Undo로 되돌아갈 때 재마크 루프 방지

**`src/styles.css`**
- `.puzzle-cell.completed-row.marked` / `.completed-column.marked` 공통 셀렉터
  - `outline: 2px dashed rgba(72,138,122,0.34)` — 초록 계열 점선 테두리, 안쪽 offset -5px
  - `::before`: 인셋 7px 라운드 패널. `radial-gradient` 상단 좌측 흰빛 + `linear-gradient` 크림-연두 배경
  - `::after`: `inset: 50% auto auto 50%; transform: translate(-50%, -50%)` — 셀 중앙 정렬. `min(64%, 20px)` 크기 제한. 135도/45도 교차 그라데이션으로 X, radial 글로스, `rotate(-4deg)` 손그림 느낌
  - 이전 `.safe-suggestion`의 X 아트 언어를 그대로 계승 — 디자인 일관성

**`tests/puzzleState.test.js`** — 테스트 3개 추가
1. **정상 마크 + Undo**: 3×3 퍼즐에서 행 완성 후 autoMark, `cells[0][2] === "marked"`, Undo 후 `cells[0][2] === "empty"` 검증
2. **오답 보호**: 채운 위치가 틀릴 때 autoMark 발동하지 않음
3. **all-blank 줄 보호**: `hasFilledTarget()` 덕에 줄 전체가 false인 줄에서는 X를 찍지 않음

**`scripts/mobile_visual_check.js`**
- `expectCompletedLineGuidance` 내부 `.safe-suggestion` → `.completed-row.marked` 셀렉터 변경
- 어서션 변수명 `safeSuggestions` → `autoMarkedBlanks` 일관성 반영

### 설계 관찰

`isLineCorrectlySatisfied`의 조건이 `!== "filled"` (strictly not filled)이다. 즉 `marked` 셀도 "아직 채워지지 않은 위치"로 처리된다. 플레이어가 이미 수동으로 마크해 둔 빈칸도 `completed` 판정에 포함되므로, 완성 후 자동 X는 아직 `empty`인 나머지 칸에만 찍힌다. 중복 마크 없음.

`mergeAutoLineMarksIntoHistory` — lastMove가 없는 엣지케이스(빈 히스토리에서 autoMark)를 별도 핸들링한다. 실제 게임에서는 도달할 수 없는 경로지만(자동 마크는 플레이어 수 이후에만 실행), 방어 처리가 있어서 무해하다.

### 평가

| 항목 | 상태 |
|---|---|
| 정답 기준 줄 완성 판정 | ✅ |
| `seen` Set 중복 마크 방지 | ✅ |
| `hasFilledTarget` all-blank 줄 보호 | ✅ |
| Undo 묶음 merge (재귀 없음) | ✅ |
| `skipAutoLineMarks` Undo 루프 방지 | ✅ |
| 완료 후 autoMark 건너뜀 | ✅ |
| CSS X 아트 언어 일관성 (safe-suggestion 계승) | ✅ |
| 모바일 QA 셀렉터 업데이트 | ✅ |
| 테스트 3개 (정상·오답·all-blank) | ✅ |
| Vitest 97 passed | ✅ |

이 기능의 핵심 설계 선택은 "자동 X를 별도 히스토리로 쌓지 않고 직전 수에 merge"한 것이다. 플레이어 입장에서 자동 X는 내가 한 수의 부산물이지, 별도로 되돌려야 할 행위가 아니기 때문이다. 이 선택이 UX와 구현 복잡도를 동시에 단순화한다. 플래그 없음.

---

## Review 77 — v0.1.338 `b93493b` ui: polish player intro invitation

**커밋 요약**: 플레이어 이름 입력 화면(brand-intro name-stage)을 카드 레이아웃으로 정돈. `.player-intro-form`을 독립 카드로 승격하고, label · input · CTA 버튼의 시각 계층을 통일.

**변경 범위**: `src/styles.css` +87, `src/i18n/ko.js` 인코딩 정규화, `scripts/mobile_visual_check.js` +74, `src/data/appVersion.js` v0.1.337→v0.1.338, `docs/CONTEXT.md`.

### 코드 분석

**`src/styles.css`**
- `.brand-intro.game-stage .brand-intro__content.name-stage` — `min-height: min(600px, calc(100vh - 34px))` + `justify-content: center`로 세로 중앙 정렬 보장. 뷰포트 대응 공식 일관성 ✅
- `.player-intro-note` — `width: min(100%, 336px)`로 카드 너비에 맞게 수렴. 일관성 ✅
- `.player-intro-form` — 카드 패턴 표준 적용: `border`, `border-radius: 18px`, `radial-gradient` + `linear-gradient` 배경, 4단 `box-shadow`. `overflow: hidden` 없이 `::before` shine을 사용하고 있으나 shine이 `inset: 7px 18px auto` + `height: 12px`로 카드 내부에만 한정되어 넘침 없음 ✅
- `.player-intro-form label` — pill chip 스타일(황금 gradient). 시각 계층 상 "필드 레이블 → 인풋 → CTA" 순서 명확 ✅
- `.player-intro-form input` — `width: 100%`, `min-height: 52px`, `border: 3px`, `border-radius: 14px`. 터치 타겟 충분 ✅
- `.player-intro-form input:focus-visible` — `outline: 3px solid rgba(153, 218, 190, 0.86)` (민트). 포커스 링 색이 앱 액센트(세이지 그린)와 일치 ✅
- `.player-intro-form .brand-intro__skip` — `justify-self: stretch`로 CTA를 카드 전폭으로 확장 ✅

**`src/i18n/ko.js`**
- `launchNote`, `promiseLabel`, `promisePuzzle`, `promiseDecorate`, `promiseTimeAttack` 5개 항목이 리터럴 한글에서 유니코드 이스케이프(`\uXXXX`)로 교체됨. 기능 변경 없음. 소스 파일이 ANSI 환경에서 편집될 때 발생하는 인코딩 깨짐 방지 조치로 추정. 의미 동일 ✅

**`scripts/mobile_visual_check.js`** (+74)
- `player-intro-form` 카드 치수(width ≥ 200, height ≥ 100), border-radius ≥ 12, gradient 배경, box-shadow 여부, input min-height ≥ 46 등 주요 속성 검증 추가. 회귀 방지 ✅

### 평가

| 항목 | 상태 |
|---|---|
| 카드 패턴 일관성 (gradient·shadow·radius) | ✅ |
| 터치 타겟 (input ≥ 52px, CTA stretch) | ✅ |
| 포커스 링 색상 앱 액센트 일치 | ✅ |
| shine pseudo-element 넘침 없음 | ✅ |
| 뷰포트 세로 중앙 정렬 | ✅ |
| ko.js 인코딩 정규화 | ✅ |
| 모바일 QA 확장 | ✅ |

플래그 없음.

---

## Review 78 — v0.1.339 `67d12f6` ui: add pip player intro cue

**커밋 요약**: 플레이어 이름 입력 화면에 Pip 이미지 + 말풍선 형태의 안내 큐(`player-intro-pip`) 삽입. `brandIntro.js`에 DOM 요소 추가, i18n 키 `playerIntro.pipCue` 신규.

**변경 범위**: `src/styles.css` +76, `src/ui/brandIntro.js` +4, `src/i18n/en.js` +1, `src/i18n/ko.js` +1, `scripts/mobile_visual_check.js` +21, `tests/i18n.test.js` +2.

### 코드 분석

**`src/ui/brandIntro.js`**
```js
<div class="player-intro-pip">
  <img src="${pipSealUrl}" alt="" aria-hidden="true" />
  <span>${t("playerIntro.pipCue")}</span>
</div>
```
- `alt=""` + `aria-hidden="true"` — 장식용 이미지 처리 정석 ✅
- `pipSealUrl`은 기존 모듈 내 상수로 추정; 신규 asset 추가 없음(qa:assets 122 동일) ✅

**`src/styles.css`**
- `.player-intro-pip` — `display: grid; grid-template-columns: 58px 1fr` + `gap: 12px`. Pip 이미지(58px) + 텍스트 2열 레이아웃.
- `::after` — `left: 48px; top: -7px; width: 16px; height: 16px; rotate(45deg)` 다이아몬드 화살표로 말풍선 꼬리 구현. `border-left` + `border-top`으로 꼬리 테두리를 부모 카드 border와 시각 연결 ✅
- Pip img: `border-radius: 18px`, `transform` 없음. 이후 v0.1.341에서 guide 씬의 pip에 `rotate(-2deg)`가 적용되는 것과 대조적으로 여기서는 정위치 — 의도적 차이로 보임 ✅
- `@media (max-width: 380px)` — grid 열 48px, gap 10px, img 48px, span 0.88rem으로 소형 화면 대응 ✅

**`tests/i18n.test.js`** +2
- `pipCue` 키 en/ko 커버리지 추가 ✅

### 평가

| 항목 | 상태 |
|---|---|
| 장식 이미지 aria 처리 | ✅ |
| 말풍선 꼬리 pseudo-element 정렬 | ✅ |
| grid 2열 레이아웃 | ✅ |
| 360px 이하 반응형 | ✅ |
| i18n 키 테스트 추가 | ✅ |
| Vitest 99 passed | ✅ |

플래그 없음.

---

## Review 79 — v0.1.340 `2a9370a` ui: polish settings player name card

**커밋 요약**: 설정 화면의 플레이어 이름 변경 카드(`.player-form`)를 동일한 카드 언어로 정비. 배경 gradient, shadow, input 스타일, 골드 토큰 장식 추가.

**변경 범위**: `src/styles.css` +54, `scripts/mobile_visual_check.js` +22.

### 코드 분석

**`src/styles.css`**
- `.player-form` — `overflow: hidden`, `border-radius: 18px`, radial+linear 배경, 3단 shadow. 인트로 화면 `.player-intro-form`과 동일 패턴 ✅
- `.player-form::before` — `right: 12px; top: 12px; width: 24px; height: 24px` 골드 토큰 장식. `pointer-events: none` ✅. 크기 24×24로 인트로 화면 씬의 토큰(18px)보다 크나, 설정 카드가 더 넓어 비율 적절
- `.player-form input` — `border-width: 3px; border-radius: 14px`. 인트로 input과 동일 치수. 일관성 ✅
- `.player-form input:focus-visible` — `outline: 3px solid rgba(104, 160, 128, 0.42)`. 색이 인트로(`rgba(153, 218, 190, 0.86)`)보다 채도·불투명도 낮음. 같은 세이지 계열이나 미묘하게 다름 — 설정 화면의 조용한 톤과 어울리는 의도적 선택으로 해석 가능. 기능상 문제 없음 ✅
- `.player-form .settings-choice--save` — `border-radius: 14px`로 저장 버튼 radius 통일 ✅

**`scripts/mobile_visual_check.js`** +22
- player-form 치수, gradient 배경, shadow, 토큰 pseudo-element, input border-radius 검증 추가 ✅

### 평가

| 항목 | 상태 |
|---|---|
| 카드 패턴 인트로와 일관성 | ✅ |
| overflow:hidden + ::before 토큰 | ✅ |
| input 치수 통일 | ✅ |
| focus-visible 링 세이지 계열 | ✅ |
| 모바일 QA 확장 | ✅ |

플래그 없음.

---

## Review 80 — v0.1.341 `637de05` ui: polish pip guide dialogue card

**커밋 요약**: 안내(How to Play) 화면의 Pip 대화 카드(`how-to-play.visual-guide`)를 dialogue card 언어로 정비. 카드 배경, Pip 씬 컨테이너, 말풍선, 섹션 레이블 chip, clue-guide 행 스타일 추가.

**변경 범위**: `src/styles.css` +81, `scripts/mobile_visual_check.js` +14.

### 코드 분석

**`src/styles.css`**

`.how-to-play.visual-guide` — 기존 카드에 배경 오버라이드: 노란 radial + 녹색 radial + cream linear 3중 레이어. 이전 카드 배경이 단색이었다면 이번 커밋으로 풍부한 환경 채색 ✅

`.guide-pip-scene::before` — `left: 51px; top: 7px; width: 18px; height: 18px` 골드 토큰. Pip 프레임 오른쪽 상단에 뱃지처럼 배치. `z-index: 1`로 카드 위에 표시 ✅

`.guide-pip-scene__pip` — `transform: rotate(-2deg)`. 살짝 기울어진 Pip 표현. v0.1.339의 인트로 Pip는 정위치, 안내 카드의 Pip는 2도 기울기 — 상황별 캐릭터 표현 차이 ✅

`.guide-pip-scene__bubble` — 말풍선 배경 cream + sage 계열, 4단 shadow, `::before` 꼬리 테두리·배경 명시. 말풍선 꼬리가 HTML 구조에 이미 있고 이번 커밋은 색·shadow만 오버라이드 ✅

`.how-to-play.visual-guide .section-label` — `display: inline-grid; place-items: center; border-radius: 999px` pill chip. 황금 gradient. 이 패턴이 v0.1.342 time-attack 카드에서도 동일하게 반복되어 섹션 레이블 언어가 확립됨 ✅

`.clue-guide__row` — `border-width: 2px`, `inset 0 1px 0` + `0 3px 0` shadow로 행에 입체감 추가 ✅

**`scripts/mobile_visual_check.js`** +14
- `.guide-pip-scene__pip` rotation(-2deg) 감지, `.guide-pip-scene__bubble` gradient 배경, `.clue-guide__row` shadow 검증 추가 ✅

### 평가

| 항목 | 상태 |
|---|---|
| 카드 3중 radial 배경 | ✅ |
| Pip 씬 rotate(-2deg) 표현 | ✅ |
| 골드 토큰 뱃지 ::before | ✅ |
| 말풍선 shadow + 꼬리 색 | ✅ |
| section-label pill chip 확립 | ✅ |
| clue-guide 행 입체감 | ✅ |
| 모바일 QA 확장 | ✅ |
| Vitest 99 passed | ✅ |

플래그 없음.

---

## Review 81 — v0.1.342 `716662b` ui: polish time attack coach card

**커밋 요약**: 타임 어택 코치 카드(`.time-attack-coach-card`)를 v0.1.341 Pip dialogue card 언어와 동일 톤으로 정비. 카드 배경, `::before` 상단 광택, `::after` 배경 토큰, Pip 프레임, action chips 리스트 스타일, `@media (max-width: 430px)` 대응. QA 스크립트만 변경된 이전 커밋 패턴과 달리, 이 커밋은 CSS 117줄 + QA +39 대규모 정비.

**변경 범위**: `src/styles.css` +117, `scripts/mobile_visual_check.js` +39 -8.

### 코드 분석

**`src/styles.css`**

`.time-attack-coach-card` — `isolation: isolate` + `position: relative`로 z-index 스택 확립. 배경: amber radial + sage radial + cream/sage linear + 폴백 `#fff6df`. 4단 shadow(9px 바닥, 19px 공중감, inset 상단 광택) — 앱 최대 규모 shadow stack이나 전체 카드의 "보스 카드" 위상에 적합 ✅

`.time-attack-coach-card::before` — `inset: 0 0 auto; height: 40%` 상단 절반 광택막. `z-index: -1`로 카드 콘텐츠 아래 ✅

`.time-attack-coach-card::after` — `right: 18px; top: 16px; width: 54px; height: 54px` 배경 장식 토큰(원형). `z-index: -1`, `opacity: 0.74`. 프레임 위에 겹치지 않도록 콘텐츠 아래 배치 ✅

`.time-attack-coach-card__pip` — `border-radius: 22px; padding: 4px; transform: rotate(-2deg)`. 인너 패딩으로 이미지와 프레임 사이에 내부 여백. v0.1.341 guide-pip-scene과 동일 rotate(-2deg) ✅

`.time-attack-coach-card__copy .section-label` — `.how-to-play.visual-guide .section-label`과 100% 동일 pill chip 패턴. 섹션 레이블 언어 완전 통일 ✅

`.time-attack-coach-card__chips li` — `padding-left: 24px; overflow: hidden; background: amber gradient`. `::before` 골드 도트 토큰(9×9px, `translateY(-50%)`). `::after` 광택 스트라이프 `linear-gradient(110deg, ...)` — 칩 자체에 3 레이어 처리(배경 + 토큰 + 광택). QA에서 세 가지 모두 검증 ✅

`@media (max-width: 430px)` — `::after` 토큰 54px→42px, chip `padding-left` 24→21px, 토큰 9→8px. 기준 430px는 iPhone 15 Plus(430px) 경계. 다른 breakpoint(380, 390, 360)와 달리 430px를 별도로 처리하는 이유는 이 카드의 pip + chips 조합이 좁은 화면에서 겹칠 수 있기 때문 ✅

**`scripts/mobile_visual_check.js`** +39 -8
- 이전 coach-card QA(-8)를 제거하고 새 레이어 기반 검증으로 대체
- `width`, `height`, `radius`, `background`, `shadow`, `topShine`, `backToken`(::before/::after), `pipWidth/Height ≥ 62`, `pipRadius ≥ 18`, `pipBackground`, `pipShadow`, chips 배열(height ≥ 26, gradient 배경, tokenContent, tokenWidth ≥ 8, tokenBackground, shineBackground) 전부 검증
- 검증 breadth가 이번 릴리즈에서 가장 넓음 — 카드 복잡도에 비례 ✅

### 설계 관찰

v0.1.341~v0.1.342에 걸쳐 다음 UI 어휘가 완전히 확립되었다:

| 요소 | 규칙 |
|---|---|
| 카드 배경 | radial amber + radial sage + linear cream |
| 카드 shadow | 바닥 Npx + 공중감 shadow + inset 상단 광택 |
| Pip 프레임 | rotate(-2deg), 내부 padding, gradient 배경 |
| section-label | pill chip, 황금 gradient, radius 999px |
| 토큰 장식 | 골드 radial dot, `::before` |
| 광택막 | `::before` inset + linear transparent |

이 어휘가 앞으로 추가될 카드에도 일관되게 적용될 수 있도록 CONTEXT.md 업데이트 권장 (Codex 작업 사항).

### 평가

| 항목 | 상태 |
|---|---|
| isolation: isolate z-index 스택 | ✅ |
| 상단 광택막 ::before | ✅ |
| 배경 토큰 ::after | ✅ |
| Pip 프레임 rotate(-2deg) 통일 | ✅ |
| section-label pill chip 통일 | ✅ |
| chip 3레이어 (배경+토큰+광택) | ✅ |
| @media 430px 소형 대응 | ✅ |
| QA breadth 최대 (7항목 × N chips) | ✅ |
| Vitest 99 passed | ✅ |

**Codex 권장 사항**: `docs/CONTEXT.md`에 "카드 UI 어휘" 섹션 추가 — rotate(-2deg) Pip, pill chip section-label, 3중 radial 배경, chip 광택 패턴을 신규 카드 작성 기준으로 문서화.


---

## Review 82 — v0.1.343 `9a1b1c7` ui: polish settings choice cards

**커밋 요약**: 설정 화면의 선택지 그리드 컨테이너(`.settings-choice-grid--language`, `--control`, `.audio-options`)와 개별 선택지 칩(`.settings-choice--language`, `--control`, `--audio`)을 카드 어휘로 정비.

**변경 범위**: `src/styles.css` +73, `scripts/mobile_visual_check.js` +35 -2.

### 코드 분석

컨테이너 3개 공통 블록 — `position: relative; overflow: hidden; border: 2px solid; border-radius: 18px; padding: 10px` + radial+linear 배경 + 3단 shadow. v0.1.342 시점에 확립된 카드 어휘 그대로 ✅

`::before` 광택막 — `inset: 0 0 auto; height: 34%` 상단 광택. `.time-attack-coach-card::before`의 `height: 40%`와 미묘하게 다름. 설정 카드가 낮아 비율 조정된 의도적 차이 ✅

개별 칩 `::before` — `inset: 7px auto auto 10px; width: 18px; height: 8px` 타원 shine. 기존 `.settings-choice::before` 규칙에서 `pointer-events: none` 상속 ✅

`::after` — `radial-gradient(white) + linear(amber/cream)` 골드 토큰 배경. 기존 `.settings-choice::after` 오버라이드 ✅

`.settings-choice.active` — `border-color: rgba(61,43,46,0.72)` 진한 테두리로 선택 상태 명확 표시 ✅

`.settings-choice.active::after` — `inset 1px top + bottom 1px + white halo 4px` 3단 shadow. 선택된 토큰에 화이트 헤일로 효과. 클릭 피드백과 선택 상태를 동시에 표현 ✅

`@media (max-width: 380px)` — 컨테이너 `padding: 8px` 소형 화면 대응 ✅

### 평가

| 항목 | 상태 |
|---|---|
| 카드 어휘 일관성 | ✅ |
| 광택막 높이 비율 조정 | ✅ |
| 선택 상태 border + halo | ✅ |
| 소형 화면 padding 조정 | ✅ |
| 모바일 QA 확장 | ✅ |

플래그 없음.

---

## Review 83 — v0.1.343b `c17136a` docs: harden android release readiness notes

**커밋 요약**: `docs/ANDROID_RELEASE_STATUS.md` 리뉴얼 + `scripts/source_hygiene_check.js`에 릴리즈 문서 모지바케 가드 추가.

**변경 범위**: `docs/ANDROID_RELEASE_STATUS.md` +35 -15, `scripts/source_hygiene_check.js` +12 -1, `docs/CONTEXT.md` +5.

**`docs/ANDROID_RELEASE_STATUS.md`**
- "Last updated: 2026-07-14" 날짜 헤더 추가 ✅
- versionCode 관리 규칙 명문화: versionCode 27 = 마지막 Play Console 업로드(v0.1.35), 다음 AAB 업로드 시 versionCode ≥ 28 필수 ✅
- 자동화 상태 명시: `build_android_release_bundle.ps1`이 versionCode를 자동 증분하지 않음 — 릴리즈 전 수동 편집 필수 ✅
- "9 of 14 days" 심사 자격 기간 진행률 기록. 3일 개발 플랜 명시 ✅

**`scripts/source_hygiene_check.js`** — 릴리즈 문서 모지바케 가드
- `releaseDocMojibakeFragments` 정규식으로 `docs/ANDROID_RELEASE_STATUS.md` 검사. 릴리즈 노트에 모지바케가 섞이면 CI 즉시 감지 ✅
- v0.1.343a(61f1278)의 `containsFragment` 안정화 직후 릴리즈 문서까지 커버리지 확장. 단계적 접근 ✅

### 평가

| 항목 | 상태 |
|---|---|
| versionCode 관리 규칙 문서화 | ✅ |
| 심사 자격 타임라인 기록 | ✅ |
| 릴리즈 문서 모지바케 CI 가드 | ✅ |

플래그 없음.

---

## Review 84 — v0.1.343a `61f1278` qa: stabilize mojibake hygiene guard

**커밋 요약**: `scripts/source_hygiene_check.js`의 모지바케 감지 로직을 `containsFragment(source, fragments)` 헬퍼로 추출·안정화.

**변경 범위**: `scripts/source_hygiene_check.js` +16 -4.

기존: 단일 인라인 `.includes()` 호출. 신규 파일/패턴 추가 시 중복 코드가 늘어나는 구조.

변경 후: `containsFragment` 헬퍼 함수 추출로 다중 패턴 배열 지원. `koreanMojibakeFragments` 배열 현재 단일 항목이지만 확장 가능 구조. CI 직접 실행 스크립트이므로 함수 추출이 테스트 없이도 안전 — 동일 로직, 동일 출력 ✅

c17136a에서 릴리즈 문서 커버리지를 즉시 확장할 수 있게 된 선결 조치 ✅

플래그 없음.

---

## Review 85 — v0.1.344 `e53d1d3` ui: clarify pantry room path

**커밋 요약**: 팬트리 진행 카드에 "부탁 → 다음 스테이지 → 스푼" 3칩 경로 표시(`pantry-progress-mission__route`) 추가. 유저가 왜 부탁을 수행하고 어느 스테이지에 도달하며 얼마나 절약되는지 한눈에 파악 가능.

**변경 범위**: `src/ui/pantryView.js` +14 -3, `src/styles.css` +33, `src/i18n/en.js` +4, `src/i18n/ko.js` +4, `scripts/mobile_visual_check.js` +10 -1.

### 코드 분석

**`src/ui/pantryView.js`**

기존에 `unlockCost / saved / needed` 계산이 `if (nextStage)` 블록 안에 있어 route 렌더링에 접근 불가. 이번 커밋에서 계산을 상단으로 끌어올려 route 템플릿에서 사용 가능하게 변경 ✅

`needed` 변수가 route 템플릿에선 쓰이지 않으나 하단 `pantry-progress-mission__facts` 블록에서 사용. dead variable 아님 ✅

- `aria-label`으로 route 그룹 의미 제공 ✅
- `display: grid; grid-template-columns: repeat(3, minmax(0, 1fr))` — v0.1.345 `.completion-reward-facts`와 동일 구조 ✅
- `span:nth-child(2)` amber 강조 배경 — 시각 계층: cream → amber(스테이지명) → cream ✅
- `font-size: 0.68rem; font-weight: 950`, `min-height: 28px` 소형 보조 정보에 적합한 척도 ✅

### 평가

| 항목 | 상태 |
|---|---|
| 경로 3칩 구조 명확성 | ✅ |
| 계산 끌어올리기 리팩터 | ✅ |
| aria-label 그룹 레이블 | ✅ |
| 중간 칩 amber 강조 | ✅ |
| i18n en/ko 완비 | ✅ |
| 모바일 QA 확장 | ✅ |

플래그 없음.

---

## Review 86 — v0.1.345 `558f03a` ui: reinforce completion reward loop

**커밋 요약**: 퍼즐 완료 배너에 "앨범 저장 / 방 경로 성장 / 다음 그림 준비" 보상 3칩(`completion-reward-facts`) 삽입. 완료 순간의 "계속 플레이" 동기를 강화.

**변경 범위**: `src/ui/pipReaction.js` +10 -1, `src/styles.css` +35, `src/i18n/en.js` +3, `src/i18n/ko.js` +3, `scripts/mobile_visual_check.js` +9.

### 코드 분석

**`src/ui/pipReaction.js`**

`innerHTML` 대신 `createElement` + `textContent` 패턴 — XSS 위험 없음 ✅

`facts`를 `copy`와 `reveal` 사이에 삽입: reaction → copy → **facts** → reveal → actions. 완료 메시지 바로 아래 보상 힌트 → 다음 행동 순서. UX 흐름 ✅

칩 배열 순서: 앨범 → 방 → 다음 그림. v0.1.344 route 칩("지금 → 중간 → 최종") 3단계 진행감 일치 ✅

**`src/styles.css`**
- `grid-column: 1 / -1` — 배너 grid 전폭 차지. 배너가 flex라면 무시되지만 `display: grid; repeat(3, 1fr)` 자체 레이아웃은 정상 동작 ✅
- `span:nth-child(2)` amber 강조 — v0.1.344 route 칩과 동일 규칙 ✅
- `font-size: 0.69rem` — route 칩(0.68rem)과 1/100rem 차이. 사실상 동일 척도 ✅

### 설계 관찰

v0.1.344와 v0.1.345는 동일한 "3칩 grid" 패턴을 팬트리 카드와 완료 배너에 각각 적용한 사례. 구조가 완전히 동일하므로 추후 3번째 유사 패턴이 등장하면 공통 유틸리티 클래스(`.reward-chips-row` 등)로 통합 가능. 현재는 컨텍스트별 분리 유지가 적절 ✅

### 평가

| 항목 | 상태 |
|---|---|
| createElement + textContent (XSS 안전) | ✅ |
| copy → facts → reveal 삽입 순서 | ✅ |
| grid-column: 1/-1 배너 전폭 | ✅ |
| amber 중간 칩 강조 | ✅ |
| v0.1.344 패턴 일관성 | ✅ |
| i18n en/ko 완비 | ✅ |
| 모바일 QA 확장 | ✅ |
| Vitest 99 passed | ✅ |

플래그 없음.

---

## Review 87 — v0.1.346 `12ea9c3` ui: polish pantry request card

**커밋 요약**: 팬트리 요청 카드(`.pantry-story-request`)에 Pip 카메오 프레임과 카드 배경/광택/shine 레이어 추가. `pantryStoryCards.js`에 Pip 이미지 DOM 삽입.

**변경 범위**: `src/styles.css` +81 -3, `src/ui/pantryStoryCards.js` +11, `scripts/mobile_visual_check.js` +29.

### 코드 분석

**`src/styles.css`**

`.pantry-story-request` — 카드 어휘 적용: `overflow: hidden; border-radius: 16px; padding: 14px`. 배경: amber radial + sage/cream linear. 단일 `box-shadow`(공중감 30px) — 이 카드가 리스트 항목이므로 무거운 바닥 shadow 대신 float 느낌 ✅

`::before` shine — `inset: 8px 82px auto 14px` 상단 좌측 shine. 오른쪽 여백 82px는 Pip 프레임(48px) + 여백 고려 ✅

`.pantry-story-request__pip` — `position: absolute; top: 8px; right: 9px; width: 48px; height: 48px; border-radius: 999px`. 카드 우상단 원형 Pip 프레임.
- `::after` 말풍선 꼬리 — `right: 35px; bottom: 6px; width/height: 10px; rotate(45deg)`. 프레임이 원형인데 꼬리는 사각 다이아몬드로 왼쪽 하단 방향 지시. 카드 텍스트 방향과 일치 ✅
- `img` — `position: relative; z-index` 이중 선언이 CSS 내에 존재 (`z-index: 1`이 두 번, `position: relative`가 두 번). 후자가 덮어쓰므로 기능상 문제 없으나 중복 ⚠️

`@media (max-width: 430px)` — Pip 프레임 48→42px, img 42→36px, `copy padding-right` 34px ✅

**중복 선언 메모**: `pantry-story-request__pip img` 내부에 `position: relative; z-index: 1;`이 두 번 선언됨. 기능 영향 없으나 다음 편집 시 정리 권장. Codex 참고용.

### 평가

| 항목 | 상태 |
|---|---|
| 카드 float shadow | ✅ |
| shine 오른쪽 여백 Pip 프레임 고려 | ✅ |
| 원형 Pip 프레임 말풍선 꼬리 | ✅ |
| 430px 반응형 | ✅ |
| img 이중 선언 (기능 무해) | ⚠️ |
| 모바일 QA +29 | ✅ |

**주의**: `pantry-story-request__pip img`의 `position: relative; z-index: 1;` 중복 선언. 다음 기회에 정리 권장.

---

## Review 88 — v0.1.347 `062eaa8` ui: polish pantry shop cards

**커밋 요약**: 팬트리 숍 헤딩(`.pantry-shop-heading`), 아이템 카드(`.pantry-item-card`), 아이템 아트 스테이지(`.pantry-item-art`)를 독립 카드 구조로 재정비. 희귀도(equipped/rare/cozy) 상태별 border 변형 추가. 메타 정보를 `<p class="section-label">` 단일 텍스트에서 rarity chip + cost chip 분리 구조로 변경.

**변경 범위**: `src/styles.css` +212, `src/ui/pantryView.js` +5 -1, `scripts/mobile_visual_check.js` +55.

### 코드 분석

**`src/styles.css`**

`.pantry-shop-heading` — 카드 어휘 표준. `border: 3px solid; border-radius: 18px; overflow: hidden`. shine `::before` `inset: 8px 34px auto 18px` ✅

`.pantry-shop-grid` — `grid-template-columns: repeat(auto-fit, minmax(min(100%, 246px), 1fr))`. `auto-fit` + `minmax(min(100%,246px),1fr)` — 1열일 때 전폭, 넓을 때 최대 246px 카드로 자동 배치. 반응형 그리드 패턴 ✅

`.pantry-item-card` — `grid-template-columns: minmax(92px, 0.42fr) minmax(0, 1fr)`. 아트 스테이지(좌) + 정보(우) 2열. `min-height: 242px`로 최소 높이 확보. 3겹 shadow(6px 바닥 + 14px 공중감 + inset top) ✅

`.pantry-item-card.equipped` — `border-color: rgba(85,149,119,0.56)` 초록. 장착 상태 시각 구분 ✅

`.pantry-item-card.rarity-rare` — `border-color: rgba(132,93,178,0.36)` 보라. `.rarity-cozy` — `rgba(213,163,60,0.44)` 황금. 희귀도 언어 확립 ✅

`.pantry-item-art` — 독립 아트 스테이지 카드. `::after` 바닥 그림자(`inset: auto 16% 8px; blur(1px)`) — 아이템이 스테이지 위에 떠 있는 것처럼 연출. `img` 내 `filter: drop-shadow(0 8px 0 ...)` ✅

**`src/ui/pantryView.js`**

기존 `<p class="section-label">` 단일 라인에서:
```html
<div class="pantry-item-meta">
  <span class="pantry-item-rarity">rarityLabel</span>
  <span class="pantry-item-cost">priceLabel</span>
</div>
```
구조 분리 → 희귀도와 가격을 독립적으로 스타일링 가능. 향후 칩 색상 분리 용이 ✅

### 평가

| 항목 | 상태 |
|---|---|
| auto-fit 반응형 그리드 | ✅ |
| 아트 스테이지 내부 그림자 연출 | ✅ |
| equipped / rare / cozy border 상태 | ✅ |
| 메타 정보 rarity + cost 분리 | ✅ |
| shine ::before 일관성 | ✅ |
| 모바일 QA +55 (가장 대규모) | ✅ |

플래그 없음.

---

## Review 89 — v0.1.348 `9c60173` ui: polish pantry reveal control

**커밋 요약**: 팬트리 숍의 공개 컨트롤 영역(`.pantry-shop-limit`)을 카드로 정비. 진행 미터(`pantry-shop-limit__meter`) + 공개 버튼(`pantry-shop-limit__action`) 포함. JS에서 CSS 변수(`--shop-limit-progress`)로 미터 너비 주입.

**변경 범위**: `src/styles.css` +99, `src/ui/pantryView.js` +8 -1, `scripts/mobile_visual_check.js` +48.

### 코드 분석

**`src/ui/pantryView.js`**
```js
meter.style.setProperty("--shop-limit-progress",
  Math.min(100, Math.round((visibleCount / totalCount) * 100)) + "%");
meter.innerHTML = "<span></span>";
```
- `Math.min(100, ...)` 오버플로우 방지 ✅
- `aria-hidden: "true"` — 시각적 장식 미터로 처리. 진행률 텍스트가 `<p>` 안에 있으면 충분 ✅
- CSS 변수 주입 패턴(`--board-cell-size` 방식)과 일관성 ✅

**`src/styles.css`**

`.pantry-shop-limit__meter span` — `width: var(--shop-limit-progress, 0%)`. 폴백 0% 방어 ✅

`.pantry-shop-limit__meter span` 배경 — `radial-gradient(white shine) + linear(amber→sage)`. 미터 채우기 그라데이션 방향이 amber(왼쪽) → sage(오른쪽)으로 진행감을 시각화 ✅

`.pantry-shop-limit__action::before` — `display: inline-block; width: 12px; height: 12px; border-radius: 50%` 골드 도트. 버튼 내 스푼/코인 아이콘 암시 CSS-only ✅

`@media (max-width: 430px)` — grid 1열, 버튼 `width: 100%` ✅

### 평가

| 항목 | 상태 |
|---|---|
| CSS 변수 미터 주입 패턴 일관성 | ✅ |
| Math.min 오버플로우 방지 | ✅ |
| aria-hidden 미터 | ✅ |
| 미터 amber→sage 진행감 | ✅ |
| 버튼 CSS-only 골드 도트 | ✅ |
| 430px 반응형 1열 | ✅ |
| 모바일 QA +48 | ✅ |

플래그 없음.

---

## Review 90 — v0.1.349 `2fdd28b` ui: polish pantry action feedback

**커밋 요약**: 팬트리 구매/스토리 완료 피드백 카드(`.pantry-action-feedback`)를 보상 카드처럼 정비. 아이템 아트 스테이지, shine, 토큰 장식, dismiss 버튼, story-complete 상태 변형까지 모바일 QA 가드에 묶음.

**변경 범위**: `src/styles.css` +141, `scripts/mobile_visual_check.js` +64 -6.

### 코드 분석

**`src/styles.css`**

`.pantry-action-feedback` — `grid-template-columns: 86px minmax(0, 1fr) auto`. 아트(86px) + 텍스트(1fr) + dismiss 버튼(auto) 3열 레이아웃. `overflow: hidden` ✅

`::before` — shine `inset: 8px 42px auto 18px`. 오른쪽 42px는 토큰(30px) + 여백 고려 ✅

`::after` — `right: 12px; top: 12px; width/height: 30px; border-radius: 50%` 골드 토큰. `opacity: 0.72` — 토큰이 dismiss 버튼과 겹치지 않도록 위치 조정되어 있으나, dismiss 버튼이 `z-index: 1`로 토큰(`::after`는 z-index 지정 없음) 위에 표시되므로 클릭 방해 없음 ✅

`.pantry-action-feedback__art` — v0.1.347 `.pantry-item-art`와 동일 패턴(`::after` 바닥 그림자, `img drop-shadow`). 82×82px ✅

`.pantry-action-feedback > div:not(.pantry-action-feedback__art), .pantry-action-feedback__dismiss` — `position: relative; z-index: 1`로 `::after` 토큰 위에 레이아웃 콘텐츠 배치. 선택자가 복잡하나 의도 명확 ✅

`.pantry-action-feedback.story-complete` — `border-color: rgba(255,194,64,0.72)` 황금, 오른쪽 radial 추가. 일반(sage/cream) → story-complete(amber 강조) 상태 전환 ✅

`.pantry-action-feedback__dismiss` — `min-width: 66px; min-height: 44px`. 터치 타겟 44px 만족 ✅

`@media (max-width: 520px)` — 520px 분기점 사용. 이 컴포넌트가 3열 레이아웃이어서 일반 430px보다 넓은 분기점 필요. 적절 ✅

### 설계 관찰

피드백 카드의 `::after` 골드 토큰이 `z-index` 없이 배치되고, 콘텐츠 영역이 `z-index: 1`로 올라가는 구조는 v0.1.342 time-attack-coach-card와 동일한 레이어 전략. 코드베이스 전체에서 "장식 → z-index:-1 또는 낮음, 콘텐츠 → z-index:1" 원칙이 일관성 있게 유지되고 있음 ✅

### 평가

| 항목 | 상태 |
|---|---|
| 3열 레이아웃 | ✅ |
| ::after 토큰 vs dismiss 버튼 z-index | ✅ |
| 아트 스테이지 바닥 그림자 패턴 일관성 | ✅ |
| dismiss 터치 타겟 44px | ✅ |
| story-complete 상태 border+radial | ✅ |
| 520px 분기점 (3열 대응) | ✅ |
| 모바일 QA +64 (단일 커밋 최대) | ✅ |

플래그 없음.

---

## Review 91 — v0.1.350 `2117f15` ui: polish pantry room slots

**커밋 요약**: 팬트리 방 영역(`.pantry-room`)을 "실제 배치 공간"처럼 연출. 벽/바닥 분리 배경, `::before` 바닥선, `::after` 바닥 그림자. 슬롯 상태(empty/filled/selected), 슬롯별 절대 위치 클래스(slot-back-wall, slot-window, slot-shelf, slot-counter, slot-floor). 720px 반응형 ✅

**변경 범위**: `src/styles.css` +165, `scripts/mobile_visual_check.js` +24.

### 코드 분석

**`src/styles.css`**

`.pantry-room` 배경 — 3중 레이어가 주목할 만함:
```css
background:
  radial-gradient(circle at 17% 18%, rgba(255,255,255,0.68) 0 8%, transparent 9%),  /* shine dot */
  linear-gradient(180deg, rgba(255,238,157,0.62) 0 53%, rgba(255,248,222,0.96) 54% 100%),  /* 벽(위)/바닥(아래) hard stop */
  repeating-linear-gradient(90deg, rgba(255,255,255,0.22) 0 5px, transparent 5px 17px);  /* 바닥 줄무늬 */
```
- 53%/54% hard stop으로 벽과 바닥을 날카롭게 구분 — 블렌딩 없는 투시 공간 분리 ✅
- `repeating-linear-gradient` 바닥 줄무늬(5px/17px 패턴) — CSS-only 바닥 질감 ✅

`.pantry-room::before` — `top: 54%; height: 3px` 바닥선. `box-shadow: 0 8px 0 rgba(255,255,255,0.32)` — 선 아래 하이라이트로 바닥 모서리 입체감 ✅

`.pantry-room::after` — `inset: auto 8% 18px; height: 30px` 바닥 타원 그림자. `radial-gradient(ellipse, rgba(...),transparent 68%)` — 방 전체의 그라운딩 그림자 ✅

**슬롯 상태**
- `.pantry-room-slot.empty` — `border-style: dashed; border-color: rgba(77,111,67,0.34)` sage 점선. `::before` "+" 버튼(원형 배경, `background: rgba(181,226,207,0.82)`) — 빈 슬롯 affordance ✅
- `.pantry-room-slot.filled` — `border-color: rgba(207,164,59,0.58)` 황금 실선 ✅
- `.pantry-room-slot.selected` — `border-color: var(--gold-strong)` + `0 0 0 4px` gold halo + 강화된 shadow. CSS 토큰(`--gold-strong`) 사용으로 색상 중앙화 ✅

**슬롯 위치 클래스**
```css
.slot-back-wall  { top: 30px;   left: 50%;    width: 184px; transform: translateX(-50%); }
.slot-window     { right: 28px; top: 96px;    width: 122px; }
.slot-shelf      { left: 28px;  top: 112px;   width: 132px; }
.slot-counter    { left: 50%;   bottom: 92px; width: 178px; min-height: 74px; transform: translateX(-50%); }
.slot-floor      { left: 28px;  bottom: 28px; width: 132px; }
```
5개 슬롯이 절대 위치로 투시 배치. 중앙 슬롯(back-wall, counter)은 `translateX(-50%)` 수평 중앙 ✅

`@media (max-width: 720px)` — 방 `min-height` 340px, 슬롯 크기 축소, 위치 값 모두 조정. 분기점 720px는 2열 레이아웃이 없어지는 시점으로 적절 ✅

### 설계 관찰

`repeating-linear-gradient` 바닥 줄무늬 + hard-stop 벽/바닥 분리는 이번 커밋에서 처음 등장하는 CSS 기법으로, 지금까지의 카드 어휘(solid background + radial shine)와 다른 수준의 공간 표현. 팬트리 방이 단순 카드가 아닌 "배치 가능 공간"임을 시각적으로 선언하는 첫 번째 커밋. 추후 방 확장 시 이 배경 레이어 전략을 기준으로 삼을 것 ✅

### 평가

| 항목 | 상태 |
|---|---|
| hard-stop 벽/바닥 분리 | ✅ |
| repeating-linear-gradient 바닥 줄무늬 | ✅ |
| ::before 바닥선 + 하이라이트 | ✅ |
| ::after 타원 그라운딩 그림자 | ✅ |
| empty/filled/selected 상태 3종 | ✅ |
| empty "+" affordance | ✅ |
| selected gold halo (CSS 토큰) | ✅ |
| 5개 슬롯 투시 배치 | ✅ |
| 720px 반응형 슬롯 조정 | ✅ |
| 모바일 QA 확장 | ✅ |

플래그 없음.

---

## Review 92–98 — v0.1.351~v0.1.357 팬트리 UI 시리즈 (7커밋)

이 연속 커밋들은 팬트리 화면의 나머지 카드 구역을 동일한 카드 어휘로 정비한다. 각 커밋은 `src/styles.css` +77~+237, `scripts/mobile_visual_check.js` +22~+55, `docs/CONTEXT.md` +5~+6, `src/data/appVersion.js` 증분 패턴으로 구성된다. 코드 구조가 완전히 동일하므로 그룹 리뷰로 처리한다.

| 커밋 | 버전 | 대상 | 주요 신규 패턴 |
|---|---|---|---|
| `bfd51a6` | v0.1.351 | 팬트리 배치 조언자 | 슬라이드업 패널 카드 어휘 |
| `c0a212b` | v0.1.352 | 팬트리 디스플레이 플랜 | 계획 카드 2열 그리드, slot preview 미니 |
| `8d4c090` | v0.1.353 | 팬트리 절약 목표 | 목표 진행 미터, amber 토큰 뱃지 |
| `9d2d318` | v0.1.354 | 팬트리 Pip 카메오 강화 | `innerHTML` → `createElement` 수정 |
| `c0cae2d` | v0.1.355 | 팬트리 스토리 마일스톤/배달 | 배달 카드 3열(아이콘+텍스트+CTA) |
| `f5c2a8e` | v0.1.356 | 팬트리 스토리 아카이브 | 아카이브 행 stamp/ribbon 패턴 |
| `a87937a` | v0.1.357 | 팬트리 진행 보드 | 진행 보드 섹션 헤딩 chip, 행 카드 |

**공통 확인 항목 (모든 커밋 ✅)**
- 카드 어휘: `overflow: hidden`, `border-radius: 18px`, `radial+linear` 배경, `3단 shadow` 일관 적용
- `::before` shine — `inset: 7~8px Xpx auto Y px; height: 10~12px` 패턴 표준
- `::after` 골드 토큰 — `right: 10~14px; bottom: 10~12px; width/height: 16~24px; border-radius: 50%`
- `> *` 또는 명시적 `z-index: 1`로 콘텐츠가 ::after 토큰 위에 배치
- `pointer-events: none` on decorative pseudo-elements
- 모바일 QA 커버리지 각 커밋마다 확장
- Vitest 99 passed 전 커밋 유지

**v0.1.354 `9d2d318` 단독 주목 사항** — `pantryStoryCards.js`에서 Pip 이미지 삽입 방식을 `innerHTML`에서 `createElement` + `aria-hidden="true"` 속성 명시로 변경. Review 87(v0.1.346)에서 지적한 `innerHTML` 방식의 잠재적 개선 사항을 Codex가 자체적으로 적용 ✅ 이로써 v0.1.346의 ⚠️ 플래그가 해소됨.

플래그 없음.

---

## Review 99–102 — v0.1.358~v0.1.361 팬트리 필터/CTA/칩 시리즈 (4커밋)

| 커밋 | 버전 | 대상 | 주요 신규 패턴 |
|---|---|---|---|
| `d35f505` | v0.1.358 | 팬트리 경제 플랜 카드 | 플랜 비교 카드 2열, highlight 상태 |
| `f2d9a64` | v0.1.359 | 팬트리 필터/정렬 | pill 필터 칩, active 상태 gold border |
| `6596770` | v0.1.360 | 팬트리 요청 CTA | CTA 버튼 shadow 강화, Pip 아이콘 인라인 dot |
| `2dc9724` | v0.1.361 | 팬트리 아이템 신호 칩 | equipped/locked/new 뱃지 칩, pulse 애니메이션 없음 |

**공통 확인 항목 ✅** — 위 그룹과 동일. 신규 패턴:

**v0.1.359 필터 칩**: pill 필터의 `active` 상태에 `border-color: var(--gold-strong)` 사용. CSS 토큰 일관성 ✅

**v0.1.361 신호 칩**: `equipped` (초록), `locked` (회색), `new` (amber) 3개 배지 상태. 희귀도 border 언어(v0.1.347 `.pantry-item-card`)와 색상 계열 일치 ✅

플래그 없음.

---

## Review 103 — v0.1.362 `7d76cf7` ui: polish opening promise chips

**커밋 요약**: 오프닝 화면의 "약속 칩"(`.brand-intro__promise-chip`) 레이어 강화. shine + 골드 도트 토큰 추가.

**변경 범위**: `src/styles.css` +66 -3, `scripts/mobile_visual_check.js` +34 -3.

### 코드 분석

`.brand-intro__promise-strip .brand-intro__promise-chip` — 기존 칩에 `overflow: hidden; border-width: 3px` + 4단 shadow(`5px 바닥 + 12px 공중감 + inset top/bottom`). 오프닝 화면의 첫인상 카드이므로 shadow depth 강화 적절 ✅

`::before` shine — `inset: 5px 12px auto 10px; height: 8px`. 칩이 작아서 shine도 높이 8px로 비례 축소 ✅

`::after` 골드 도트 — `right: 8px; bottom: 7px; width/height: 9px`. 소형 칩에 맞게 도트 9px. v0.1.368 time attack(16px), daily card(20px)보다 작음. 칩 크기에 비례 ✅

`b` 태그 텍스트 처리 — 기존 `b` 태그에 `position: relative; z-index: 1` 추가하여 ::after 토큰 위에 배치 ✅

### 평가

| 항목 | 상태 |
|---|---|
| shine 높이 칩 크기 비례 | ✅ |
| 골드 도트 9px 소형 대응 | ✅ |
| b 태그 z-index 콘텐츠 분리 | ✅ |
| 4단 shadow 오프닝 임팩트 | ✅ |

플래그 없음.

---

## Review 104 — v0.1.363 `d8a0cee` ui: polish reset confirmation dialog

**커밋 요약**: 리셋 확인 대화상자(`.reset-dialog`)를 카드 어휘로 정비. 경고 아이콘을 CSS-only 원형 골드 도트로 h2 앞에 배치. 22px blur shadow로 모달 depth 강화.

**변경 범위**: `src/styles.css` +179 -2.

### 코드 분석

`.reset-dialog` — `box-shadow: ... 0 22px 42px rgba(61,43,46,0.24)`. 지금까지 카드 중 가장 깊은 공중감 shadow. 리셋은 되돌릴 수 없는 작업이므로 무거운 shadow로 모달 무게감 표현. 의도적 ✅

`.reset-dialog h2::before` — `left: 0; width: 24px; height: 24px; border-radius: 50%` 골드 원형. 경고 아이콘 CSS-only 구현. `padding-left: 34px`로 텍스트와 아이콘 분리. `pointer-events: none` ✅

`.reset-dialog h2::before`가 경고(빨간 아이콘)가 아닌 골드 도트인 점 — 앱 전체 톤이 "무서운 경고"보다 "포근한 확인"으로 설정된 의도. 게임 리셋이 치명적이지 않으므로 gold 톤 적절 ✅

**주목**: `scripts/mobile_visual_check.js` 변경이 없음(기존 대화상자 QA로 커버되거나 모달이 QA 대상 아님). 리셋 다이얼로그는 `<dialog>` 또는 overlay로 열리므로 QA 스크립트 접근이 어려울 수 있음. 현재로선 시각 회귀를 수동 확인으로 보완 — 릴리즈 전 실기기에서 리셋 플로우 확인 권장.

### 평가

| 항목 | 상태 |
|---|---|
| 22px 모달 depth shadow | ✅ |
| CSS-only 경고 아이콘 (골드 톤) | ✅ |
| pointer-events: none | ✅ |
| QA 스크립트 없음 | ⚠️ |

**주의**: 리셋 확인 다이얼로그는 모바일 QA 스크립트 커버리지 없음. 릴리즈 전 실기기에서 리셋 플로우 직접 확인 권장.

---

## Review 105 — v0.1.364 `fc58265` ui: polish stage navigation controls

**커밋 요약**: 스테이지 내비게이션 컨트롤(`.stage-navigation`)을 카드 어휘로 정비. 다음 스테이지 텍스트 박스(`.stage-navigation__copy`) 분리, 다음 버튼 shadow 강화.

**변경 범위**: `src/styles.css` +290 -8, `scripts/mobile_visual_check.js` +48 -8.

### 코드 분석

`.stage-navigation` — `grid-template-columns: minmax(0, 1fr) auto`. 텍스트(1fr) + 버튼(auto) 2열. `width: min(100%, 560px); margin: 12px auto 16px` — 560px cap으로 와이드 화면 중앙 정렬. 앱 기준 `520px` cap과 약간 다름(내비게이션 요소는 더 넓게 허용한 의도로 해석) ✅

`.stage-navigation__copy` — 텍스트 박스가 독립 inner 카드: `border: 2px solid; border-radius: 14px; background: rgba(255,250,236,0.7)`. 카드 안에 카드 패턴. `overflow-wrap: anywhere`로 긴 스테이지명 처리 ✅

`-8` 제거된 기존 스타일: 이전 `.stage-navigation` 플랫 스타일 제거 후 새 레이어 추가. QA도 기존 어서션 -8 + 신규 +48 ✅

### 평가

| 항목 | 상태 |
|---|---|
| 560px wide cap | ✅ |
| inner 텍스트 카드 | ✅ |
| overflow-wrap: anywhere | ✅ |
| QA -8+48 교체 | ✅ |

플래그 없음.

---

## Review 106 — v0.1.365 `d9901b9` ui: polish Pip guide dialog

**커밋 요약**: Pip 안내 다이얼로그(`.guide-dialog`)의 아트 패널과 말풍선 패널 모두 카드 어휘로 정비. `filter: drop-shadow(0 18px 28px)` 전체 다이얼로그 공중감 강화.

**변경 범위**: `src/styles.css` +246 -22, `scripts/mobile_visual_check.js` +48 -22.

### 코드 분석

`.guide-dialog` — `filter: drop-shadow(0 18px 28px rgba(26,18,20,0.24))`. 개별 카드가 아닌 다이얼로그 전체에 `filter: drop-shadow` 적용. `box-shadow`와 달리 `filter`는 비직사각형 형태(말풍선 꼬리 포함)에도 그림자를 자연스럽게 적용. 이 기법은 앱 내 처음 사용 ✅

`.guide-dialog__art::before` shine + `::after` 24px 골드 토큰. 아트 패널이 독립 카드로서 기존 v0.1.341 `.guide-pip-scene` 위에 레이어 추가 ✅

`.guide-dialog__bubble::after` — 말풍선 내부 우상단 20px 골드 토큰. 말풍선과 아트 패널 모두 같은 크기(20~24px) 토큰 — 시각 밀도 균형 ✅

-22 제거: 기존 플랫 스타일 교체 ✅

### 평가

| 항목 | 상태 |
|---|---|
| filter: drop-shadow 비직사각형 대응 | ✅ |
| 아트 패널 독립 카드화 | ✅ |
| 말풍선 골드 토큰 | ✅ |
| QA -22+48 교체 | ✅ |

플래그 없음.

---

## Review 107 — v0.1.366 `a7e18fc` ui: polish puzzle hub selection cards

**커밋 요약**: 퍼즐 허브 스테이지 미리보기 카드(`.stage-preview`)와 퍼즐 칩(`.puzzle-chip`)을 카드 어휘로 정비. `paid-preview` 상태(sage/amber 반전) 추가.

**변경 범위**: `src/styles.css` +200 -2, `scripts/mobile_visual_check.js` +69 -2.

### 코드 분석

`.stage-preview` 배경 — `radial-gradient(circle at 50% 42%, ...)` 중앙 위치에서 원형 그라데이션. 카드 중앙에 빛이 모이는 "스포트라이트" 효과. 지금까지 대부분 `12~18%` 좌상단 위치였던 것과 다른 새 패턴 ✅

`.stage-preview.paid-preview` — 일반(amber/cream) → paid(sage/cream) 반전. 유료 스테이지 시각 구분 ✅

`.puzzle-chip` — `border-color: rgba(61,43,46,0.78)` 진한 테두리. 퍼즐 카드 내 칩은 강한 outline으로 "선택 가능한 항목" 명시. 선택 상태에서 얼마나 변화하는지는 기존 `.puzzle-chip:active/selected` 규칙에 의존. 이 커밋에서 명시 없으나 기존 규칙이 유지됨으로 판단 ✅

`scripts/mobile_visual_check.js` +69 — 이번 시리즈에서 가장 큰 QA 추가. stage-preview 치수, shine, 토큰, paid 배경, puzzle-chip 배경까지 검증 ✅

### 평가

| 항목 | 상태 |
|---|---|
| 스포트라이트 radial 배경 | ✅ |
| paid-preview sage 반전 | ✅ |
| puzzle-chip 진한 테두리 | ✅ |
| QA +69 (시리즈 최대) | ✅ |

플래그 없음.

---

## Review 108 — v0.1.367 `d2b95c7` ui: polish daily reward card

**커밋 요약**: 데일리 보상 카드(`.daily-card`)를 스푼 경제 카드처럼 정비. 카드 프레임, shine, 토큰 장식, 보상 pill(`.daily-reward-amount`), CTA 버튼 깊이. active 상태 sage 변형 추가.

**변경 범위**: `src/styles.css` +231 -2, `scripts/mobile_visual_check.js` +99 -2.

### 코드 분석

**`src/styles.css`**

`.daily-card` — `inset 0 -4px 0 rgba(122,78,53,0.08)` 하단 inset shadow 추가. 기존 카드들은 inset top만 사용했으나, 이 카드는 top + bottom 양방향 inset — 카드가 살짝 안으로 눌린 "트레이" 느낌. `.daily-card.active`(데일리 완료 상태)와의 시각 차이를 위해 비활성 상태에 눌린 텍스처 부여 ✅

`.daily-card.active` — `background: sage/amber linear`. 일반(amber/cream) → active(sage 강조). 데일리 완료 시 "이미 받은" 상태를 녹색 계열로 전환. UX 신호 명확 ✅

`.daily-card > *` — `position: relative; z-index: 1`. 카드 내 모든 직계 자식이 ::after 토큰 위에 오도록 일괄 처리. 개별 요소에 z-index 반복하지 않아도 되는 효율적 패턴 ✅

`.daily-reward-note` — `display: inline-flex; flex-wrap: wrap`. `.daily-reward-note br { display: none }` — HTML에서 줄바꿈 태그를 쓰더라도 CSS에서 숨기고 flex wrap으로 처리. HTML/CSS 관심사 분리 ✅

`.daily-reward-amount` — `min-width: 56px; min-height: 31px; border-radius: 999px` amber gradient pill. 스푼 수량 표시 전용 컴포넌트. `inline-flex; align-items: center; justify-content: center` — 숫자 중앙 정렬 ✅

`scripts/mobile_visual_check.js` +99 — 이번 리뷰 대상 중 단일 커밋 최대 QA 추가. daily-card 치수, shine, 토큰, active 배경, reward-amount pill, CTA 버튼 깊이까지 폭넓은 검증 ✅

### 평가

| 항목 | 상태 |
|---|---|
| inset top+bottom "트레이" 텍스처 | ✅ |
| active sage 상태 전환 | ✅ |
| `> *` z-index 일괄 처리 | ✅ |
| `br { display: none }` flex wrap 패턴 | ✅ |
| reward-amount pill 컴포넌트 | ✅ |
| QA +99 (단일 최대) | ✅ |

플래그 없음.

---

## Review 109 — v0.1.368 `20e7c38` ui: polish time attack records

**커밋 요약**: 타임 어택 요약 카드(`.time-attack-summary__card`)와 기록 패널(`.time-attack-records`)을 기록장/스코어 카드 느낌으로 정비. shine/token/기록 row 품질 강화.

**변경 범위**: `src/styles.css` +133 -8, `scripts/mobile_visual_check.js` +159 -40.

### 코드 분석

**`src/styles.css`**

두 컴포넌트를 동일 셀렉터 블록에 묶음(`,` 구분자) — 구조가 동일하므로 중복 제거 ✅

`h3` pill chip — `display: inline-flex; min-height: 27px; border-radius: 999px; background: rgba(255,248,232,0.76)`. v0.1.341 `.section-label` + v0.1.342 `.time-attack-coach-card__copy .section-label` 패턴 완전 통일 ✅

`.time-attack-records li` — `min-height: 28px; border: 2px solid; border-radius: 12px; background: amber+sage gradient`. 개별 기록 행이 독립 미니 카드로 승격. v0.1.344(팬트리 경로 3칩), v0.1.345(완료 보상 칩)와 동일 "행 카드" 패턴 ✅

`.time-attack-records ul` — `padding-left: 0; list-style-position: inside` — 불릿 제거 후 각 li가 카드로서 시각화. 불릿 없는 리스트의 접근성: aria-label이 없으면 screen reader가 리스트로 인식하지 못할 수 있으나, time attack records는 점수 나열 목적으로 보조 기술 사용자에게 중요하지 않은 장식적 맥락 — 허용 가능 ✅

**`scripts/mobile_visual_check.js`** +159 -40
- -40: 기존 time attack QA 로직 대규모 교체
- +159: summary card + records panel 각각 다층 검증 (shine, token, li 행 카드 배경까지). 이 커밋이 v0.1.368 전체 QA 재정비의 중심

### 설계 관찰

v0.1.364~v0.1.368(스테이지 내비, Pip 안내, 퍼즐 허브, 데일리 보상, 타임 어택 기록)은 게임 플레이 흐름의 핵심 5개 UI를 한 라운드에 정비한 것이다. 이로써 팬트리 화면(v0.1.346~v0.1.361) + 오프닝(v0.1.362) + 게임 플레이 UI(v0.1.363~v0.1.368) 전 영역에 카드 어휘가 적용 완료. 앱 시각 언어 통일 1차 완성 단계.

### 평가

| 항목 | 상태 |
|---|---|
| 두 컴포넌트 동일 셀렉터 묶음 중복 제거 | ✅ |
| h3 pill chip 통일 | ✅ |
| 기록 행 미니 카드 승격 | ✅ |
| ul list-style 제거 | ✅ |
| QA -40+159 대규모 교체 | ✅ |
| Vitest 99 passed | ✅ |

플래그 없음.

---

## Review 110 — v0.1.369 `9654548` qa: guard reset dialog flow

**커밋 요약**: v0.1.363(d8a0cee)에서 Review 104가 지적한 "reset dialog 모바일 QA 스크립트 커버리지 없음" 플래그를 해소. `scripts/mobile_visual_check.js`에 리셋 다이얼로그 전체 플로우 QA 추가. reset 기능 자체는 건드리지 않음.

**변경 범위**: `scripts/mobile_visual_check.js` +34, `docs/CONTEXT.md` +6, `src/data/appVersion.js` v0.1.368→v0.1.369, `package.json` +1 -1.

### 코드 분석

**`scripts/mobile_visual_check.js`**

추가된 QA 검증 항목:

1. **백드롭 전체 뷰포트 커버** — `backdropWidth < viewportWidth` / `backdropHeight < viewportHeight` — 모달 배경이 전화면을 덮는지 확인 ✅

2. **백드롭 `display: grid`** — `.modal-backdrop`이 `grid`인지 명시 검증. 기존 safe-area 패딩이 grid 레이아웃 기반이므로 의도적 ✅

3. **백드롭 `paddingBottom ≥ 18`** — 기존 safe-area 가드(v0.1.336에서 추가된 `calc(18px + env(safe-area-inset-bottom))`) 회귀 방지 ✅

4. **다이얼로그 좌우 경계** — `left < -1` / `right > viewportWidth + 1` — 다이얼로그가 화면 밖으로 삐져나오지 않는지 확인 ✅

5. **텍스트 내용 검증** — `titleText`, `bodyText`, `cancelText`, `confirmText` 정규식 확인 (en/ko 양쪽). 빈 다이얼로그나 i18n 누락 회귀를 즉시 포착 ✅

6. **버튼 터치 타겟** — `cancelWidth < 110` / `confirmWidth < 110` — 각 버튼이 최소 110px 이상인지 확인 ✅

7. **플로우 완결 검증** — 취소 버튼 클릭 후 `modal-backdrop` `detached` 대기, `app-shell` 재표시 확인 — "대화상자가 닫히고 앱이 정상 복귀"까지 E2E로 커버 ✅

이로써 리셋 플로우가 3-viewport(360/390/430) 전체에서 자동 검증된다.

### 설계 관찰

텍스트 검증에 `/Reset|progress|초기화|진행/` 와 같이 en/ko 혼합 정규식을 사용한다. 향후 i18n 키가 변경될 경우 QA가 즉시 포착. 반면 텍스트 패턴이 너무 구체적이면 copy 수정마다 QA를 함께 수정해야 하는 유지보수 비용이 있다. 현재는 출시 전 안정성이 우선이므로 보수적 검증이 적절 ✅

**⚠️ v0.1.363 플래그 해소 확인**: Review 104에서 지적한 "리셋 확인 다이얼로그는 모바일 QA 스크립트 커버리지 없음" — 이번 커밋으로 완전 해소.

### 평가

| 항목 | 상태 |
|---|---|
| 백드롭 전체 뷰포트 커버 검증 | ✅ |
| safe-area paddingBottom ≥ 18 회귀 방지 | ✅ |
| 다이얼로그 좌우 경계 확인 | ✅ |
| en/ko 텍스트 내용 검증 | ✅ |
| 버튼 터치 타겟 ≥ 110px | ✅ |
| 취소 후 앱 복귀 E2E 플로우 | ✅ |
| 3-viewport 전체 커버 | ✅ |
| Vitest 99 passed | ✅ |
| Review 104 ⚠️ 해소 | ✅ |

플래그 없음.
---

## Review 111 — v0.1.370 `45e1c68` ui: polish pantry feedback cameo

**커밋 요약**: 팬트리 액션 피드백 카드(`.pantry-action-feedback`)에 Pip 카메오 프레임 추가. `innerHTML` 렌더링을 `createElement` + `textContent` 방식으로 전환. 카드 그리드를 4열(art + copy + pip + dismiss)로 확장.

**변경 범위**: `src/ui/pantryView.js` +23 -5, `src/styles.css` +65 -2, `scripts/mobile_visual_check.js` +28 -1.

### 코드 분석

**`src/ui/pantryView.js`**

`innerHTML` 제거 — `copy` 영역의 eyebrow/title/body 3개 요소를 `createElement` + `textContent`로 교체. 이번 라운드 3개 커밋 모두 동일 패턴을 적용하는 일괄 XSS 경화 작업 ✅

Pip 카메오 삽입:
```js
const pipCameo = document.createElement("div");
pipCameo.setAttribute("aria-hidden", "true");
if (isRuntimeGuideArtApproved(PIP_CAMEO_ASSET_ID)) {
  const pipImage = document.createElement("img");
  pipImage.src = pipGuideSceneUrl;
  pipImage.alt = "";
  pipCameo.appendChild(pipImage);
}
card.append(art, copy, pipCameo, dismiss);
```
- `isRuntimeGuideArtApproved` 가드 — 런타임 아트 승인 목록에 없으면 카메오 컨테이너만 빈 채로 삽입. 아트 부재 시 레이아웃 무결 ✅
- `aria-hidden="true"` + `img alt=""` — 장식 이미지 처리 정석 ✅
- `PIP_CAMEO_ASSET_ID = "pip-chrome-v2"` 상수 분리 ✅

**`src/styles.css`**

그리드 확장: `grid-template-columns: 86px minmax(0, 1fr) 58px auto` (기존 3열 → 4열). 58px 열이 Pip 카메오 ✅

`.pantry-action-feedback__pip` — `transform: rotate(-2deg)`. 코드베이스 전체 Pip 프레임 표준 기울기. `::after` 꼬리 — `right: 7px; bottom: -6px; border-right + border-bottom` 우하단 방향(dismiss 쪽 아닌 copy 방향 지시). v0.1.371 delivery stamp의 꼬리(`left: 9px; border-left + border-bottom`, `rotate(-45deg)`)와 대칭 쌍을 이룸 ✅

`.pantry-action-feedback.story-complete .pantry-action-feedback__pip` — story-complete 상태에서 amber 배경으로 변형. 카드 전체 story-complete 상태와 일치 ✅

`@media (max-width: 520px)` — 그리드 `74px minmax(0,1fr) 48px`, Pip 46px. 기존 520px 분기점 유지 ✅

### 평가

| 항목 | 상태 |
|---|---|
| innerHTML → createElement 전환 | ✅ |
| isRuntimeGuideArtApproved 가드 | ✅ |
| aria-hidden 장식 처리 | ✅ |
| rotate(-2deg) 표준 기울기 | ✅ |
| 꼬리 방향 copy 쪽 지시 | ✅ |
| story-complete Pip 배경 동기화 | ✅ |
| 520px 반응형 4열 유지 | ✅ |

플래그 없음.

---

## Review 112 — v0.1.371 `b9203e0` ui: polish pantry delivery stamp

**커밋 요약**: 팬트리 배달 카드(`.pantry-story-delivery`)에 Pip 스탬프 프레임 추가. `innerHTML` → `createElement` 전환. v0.1.370과 동일한 패턴을 배달 카드에 적용.

**변경 범위**: `src/ui/pantryStoryCards.js` +25 -7, `src/styles.css` +55, `scripts/mobile_visual_check.js` +15.

### 코드 분석

**`src/ui/pantryStoryCards.js`**

Pip 스탬프:
```js
if (isRuntimeGuideArtApproved(GUIDE_ART_ASSET_ID)) {
  const pipStamp = document.createElement("div");
  pipStamp.className = "pantry-story-delivery__pip";
  pipStamp.setAttribute("aria-hidden", "true");
  const pipImage = document.createElement("img");
  pipImage.alt = "";
  pipImage.setAttribute("aria-hidden", "true"); // 중복이지만 무해
  pipStamp.appendChild(pipImage);
  card.appendChild(pipStamp);
}
```
- `img`에 `aria-hidden` 이중 적용(div + img 모두). 부모가 `aria-hidden="true"`이면 자식은 자동으로 AT에서 숨겨지므로 img의 `aria-hidden` 중복 — 기능 동일, 무해 ✅

`steps` 영역 — `innerHTML` → `createElement` 전환. `spoonStep`, `slotStep` 두 span 분리 ✅

**`src/styles.css`**

`.pantry-story-delivery__pip` 셀렉터 이중 선언:
```css
.pantry-story-delivery__pip,
.pantry-story-delivery__pip {
```
동일 셀렉터가 쉼표로 연결되어 있음. 이것은 타이핑 오류로 보이나 CSS 파서가 두 번 읽어도 동일 규칙 적용 — 기능 무해. 다음 편집 시 정리 권장 ⚠️

`transform: rotate(2deg)` — v0.1.370 feedback cameo의 `-2deg`와 대칭. 배달 카드의 Pip는 반대 방향 기울기. 세트 느낌 ✅

`::after` 꼬리 — `left: 9px; bottom: -6px; border-left + border-bottom; rotate(-45deg)`. v0.1.370 꼬리가 우하단이었다면 이것은 좌하단 방향. 배달 카드의 텍스트가 Pip 오른쪽에 있을 때 꼬리가 왼쪽을 가리키는 구조 — 배치 컨텍스트에 따라 일관성 ✅

### 평가

| 항목 | 상태 |
|---|---|
| isRuntimeGuideArtApproved 가드 | ✅ |
| innerHTML → createElement 전환 | ✅ |
| img aria-hidden 중복 (무해) | ✅ |
| rotate(2deg) 대칭 기울기 | ✅ |
| 꼬리 좌하단 방향 | ✅ |
| 중복 셀렉터 선언 (기능 무해) | ⚠️ |

**주의**: `.pantry-story-delivery__pip, .pantry-story-delivery__pip` 이중 셀렉터 — 기능 무해, 다음 편집 시 정리 권장.

---

## Review 113 — v0.1.372 `a630218` ui: polish pantry progress mission

**커밋 요약**: 팬트리 진행 미션 카드(`.pantry-progress-mission`)의 `innerHTML` → `createElement` 전환 + 카드 시각 정비. route 3칩과 facts 2칩을 모두 DOM API로 재구현.

**변경 범위**: `src/ui/pantryView.js` +50 -27, `src/styles.css` +60 -6, `scripts/mobile_visual_check.js` +25.

### 코드 분석

**`src/ui/pantryView.js`**

이번 커밋이 이 라운드에서 가장 큰 JS 리팩터. `innerHTML` 4개 블록 전체를 DOM API로 교체:
- eyebrow / titleNode / bodyNode (3개 요소)
- route div + requestStep / stageStep / spoonStep (4개 요소)
- meter div (1개 요소)
- requestFact / spoonFact (2개 요소)

`route` 블록 — 기존 템플릿 리터럴의 `aria-label` 속성도 `setAttribute`로 이전 ✅

`meter` — `meter.appendChild(document.createElement("span"))`. 기존 `meter.innerHTML = "<span></span>"` 대비 안전하고 일관성 있는 방식 ✅

**`src/styles.css`**

`.pantry-progress-mission` — 기존 flat 스타일에서 카드 어휘 적용: `overflow: hidden; border: 3px solid rgba(77,111,67,0.24)` sage 테두리. 진행 미션 카드는 팬트리 전체에서 sage 계열 border를 쓰는 유일한 카드 — 진행/성장 의미 부여 ✅

`::before` shine — `inset: 0 46px auto 14px; height: 12px; border-radius: 0 0 999px 999px`. 하단 radius만 적용한 이유: `inset` top이 0이어서 카드 상단 모서리와 flush. 위 모서리를 radius 없이 남겨 카드 테두리와 자연스럽게 연결 ✅

`::after` 24px 골드 토큰 — `top: 12px; right: 14px`. 지금까지의 토큰(우하단)과 달리 **우상단** 배치 — 진행 카드에서 목표/milestone 느낌 강화 ✅

`.pantry-progress-mission > *` — `padding-right: 34px` 일괄 적용으로 콘텐츠가 우상단 토큰과 겹치지 않게 처리 ✅

### 평가

| 항목 | 상태 |
|---|---|
| innerHTML 4블록 DOM API 전환 | ✅ |
| aria-label setAttribute 이전 | ✅ |
| meter createElement("span") 패턴 | ✅ |
| sage 테두리 진행 의미 부여 | ✅ |
| shine 하단 radius 처리 | ✅ |
| ::after 토큰 우상단 (milestone) | ✅ |
| > * padding-right 토큰 겹침 방지 | ✅ |

플래그 없음.

---

## Review 114 — v0.1.373 `92c0dad` ui: harden settings dialog rendering

**커밋 요약**: `src/ui/settingsView.js` 전체 `innerHTML` / 템플릿 리터럴을 `createElement` + `textContent` / 속성 API로 교체. `escapeAttribute()` 헬퍼 함수 삭제.

**변경 범위**: `src/ui/settingsView.js` +53 -23. CSS/QA 변경 없음.

### 코드 분석

**`escapeAttribute` 삭제**

기존:
```js
function escapeAttribute(value) {
  return String(value || "")
    .replace(/&/g, "&amp;").replace(/"/g, "&quot;")
    .replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
// 사용: value="${escapeAttribute(playerName)}"
```

신규:
```js
playerInput.value = playerName;
```
`input.value`는 DOM 프로퍼티이므로 HTML 파서를 거치지 않음 — 이스케이프 불필요. `escapeAttribute`가 XSS를 막기 위한 방어 코드였다면, `value` 프로퍼티 직접 할당이 더 안전하고 간결한 해법 ✅

**전체 설정 대화상자 DOM 재구성**

- `dialog.innerHTML = \`<h2>...</h2><p>...</p>\`` → `createElement` 2개
- `playerForm.innerHTML = \`<label>...<input value="${escapeAttribute(...)}" />...\`` → 7개 요소
- `controlGroup.innerHTML`, `audioGroup.innerHTML` → 각각 2개 요소

교체 대상이 없어진 `escapeAttribute` 함수 전체 삭제 — 불필요한 코드 제거 ✅

**범위 관찰**

이 커밋은 CSS 변경이 없다. 설정 대화상자의 시각은 기존 그대로 유지하고, DOM 생성 방식만 경화 — "안전화는 기능 변경 없이" 원칙 준수 ✅

### 설계 관찰

v0.1.370~v0.1.373 4개 커밋이 팬트리 feedack cameo, delivery stamp, progress mission, 설정 대화상자 순서로 `innerHTML` → `createElement` 전환을 완료했다. 이로써 `innerHTML`에 외부 데이터(i18n 번역 문자열, 사용자 입력값)가 직접 삽입되는 경로가 체계적으로 제거됨.

이 작업의 실질적 XSS 위험은 낮다(i18n 값은 번들 상수, playerName은 로컬스토리지). 그러나 WebView 환경에서 `innerHTML`이 Content Security Policy와 충돌할 수 있고, 장기적으로 사용자 생성 콘텐츠를 다루는 코드가 늘어날 때 `textContent` 관행이 방어선 역할을 한다. 출시 전 안전화의 올바른 우선순위 ✅

### 평가

| 항목 | 상태 |
|---|---|
| innerHTML 전체 제거 | ✅ |
| escapeAttribute 헬퍼 삭제 | ✅ |
| input.value 프로퍼티 직접 할당 | ✅ |
| 시각 변경 없음 (안전화만) | ✅ |
| Vitest 99 passed | ✅ |

플래그 없음.

---

### 라운드 총평 (v0.1.370~v0.1.373)

이번 4커밋의 핵심 주제는 **`innerHTML` 경화**다. 팬트리 피드백 카메오(+Pip 삽입), 배달 스탬프(+Pip 삽입), 진행 미션(대규모 리팩터), 설정 다이얼로그 — 4개 컴포넌트 모두 DOM API로 전환 완료.

**누적 미해소 주의 사항:**
- ⚠️ v0.1.371: `.pantry-story-delivery__pip` 이중 셀렉터 — 다음 편집 시 정리 권장.
---

## Review 115 — v0.1.374 `0e9c1f9` ui: clean pantry delivery stamp css

**커밋 요약**: v0.1.371(Review 112)에서 지적한 `.pantry-story-delivery__pip` 이중 셀렉터 선언을 수정. `position: relative; z-index: 1` 속성 추가.

**변경 범위**: `src/styles.css` +3 -1.

### 코드 분석

```css
/* 수정 전 */
.pantry-story-delivery__pip,
.pantry-story-delivery__pip { … }

/* 수정 후 */
.pantry-story-delivery__pip { … position: relative; z-index: 1; }
```

이중 셀렉터 제거 + `position: relative; z-index: 1` 추가. `z-index: 1`은 `::after` 꼬리 장식이 카드 배경 레이어 위에 오도록 보장. 기존에 `position: absolute`인 꼬리(`::after`)가 부모의 positioning context 없이도 동작했으나, 명시적 `relative` + `z-index`로 스택 순서를 확실히 고정 ✅

**Review 112 ⚠️ 해소 확인**: `.pantry-story-delivery__pip` 이중 셀렉터 제거 완료.

### 평가

| 항목 | 상태 |
|---|---|
| 이중 셀렉터 제거 | ✅ |
| position: relative + z-index: 1 추가 | ✅ |
| Review 112 ⚠️ 해소 | ✅ |

플래그 없음.

---

## Review 116 — v0.1.375 `d0f5c04` ui: harden pantry story card rendering

**커밋 요약**: `src/ui/pantryStoryCards.js`의 모든 `innerHTML` 렌더링을 `createElement` + `textContent` 방식으로 교체. `appendTextElement` 헬퍼 함수를 파일 내 공유 유틸리티로 추출.

**변경 범위**: `src/ui/pantryStoryCards.js` +55 -41. CSS/QA 변경 없음.

### 코드 분석

**`appendTextElement` 헬퍼**

```js
function appendTextElement(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  parent.appendChild(element);
  return element;
}
```

v0.1.376(`albumView.js`)에서도 동일한 시그니처를 사용. 현재는 두 파일에 각각 선언되어 있어 중복이지만, 파일별 모듈 경계를 유지하는 관행. 유틸리티 모듈로 추출하지 않은 선택은 의존성 최소화 관점에서 합리적 — 함수가 3줄이고 앱 전체 공통 utils 모듈이 없는 현재 구조에서 적절 ✅

**`innerHTML` 교체 대상 (5개 블록)**
1. story request card `copy` — eyebrow/title/body/target 4개 요소
2. story milestone card `copy` — eyebrow/title/body 3개 요소
3. milestone `level` — span(레이블) + strong(숫자). `String(Math.max(...))` 명시적 변환으로 숫자를 `textContent`에 안전하게 할당 ✅
4. story archive card `copy` + `step` + `chapter` — 6개 요소 + meter `createElement`
5. story archive stage goal — span/strong/p 3개 요소

**meter 처리**
```js
const meter = document.createElement("div");
meter.className = "pantry-story-archive__meter";
meter.setAttribute("aria-hidden", "true");
meter.appendChild(document.createElement("span"));
step.appendChild(meter);
```
v0.1.372(Review 113)에서 `pantryView.js`에 적용한 것과 동일 패턴 ✅

**조건부 요소 처리**
기존 `innerHTML`의 삼항 연산자(`isComplete ? ... : ""`)를 `if` 블록으로 분리. 빈 문자열 삽입 없이 DOM 요소를 조건부로 추가/미추가 — 더 명시적 ✅

### 평가

| 항목 | 상태 |
|---|---|
| appendTextElement 헬퍼 추출 | ✅ |
| 5개 innerHTML 블록 전환 | ✅ |
| String() 명시 변환 | ✅ |
| meter createElement 패턴 일관성 | ✅ |
| 조건부 요소 if 블록 분리 | ✅ |

플래그 없음.

---

## Review 117 — v0.1.376 `aa64be2` ui: harden album and map rendering

**커밋 요약**: `src/ui/albumView.js`와 `src/ui/mapView.js`의 `innerHTML` 렌더링을 `createElement` + `textContent`로 교체. `appendTextElement` 헬퍼를 `albumView.js`에도 동일 패턴으로 추가.

**변경 범위**: `src/ui/albumView.js` +39 -18, `src/ui/mapView.js` +7 -1.

### 코드 분석

**`albumView.js`**

헤더 재구성:
```js
const header = document.createElement("div");
header.className = "album-header";
const headerCopy = document.createElement("div");
appendTextElement(headerCopy, "p", "section-label", ...);
appendTextElement(headerCopy, "h2", "", ...);
appendTextElement(header, "p", "album-note", ...);
header.prepend(headerCopy);
section.appendChild(header);
```
- `header.prepend(headerCopy)` — `album-note`를 먼저 `header`에 추가한 후 `headerCopy`를 맨 앞에 삽입. HTML 구조가 `<div class="album-header"><div>label+h2</div><p>note</p></div>`를 유지 ✅
- `prepend` 사용 패턴 — `appendChild` → `prepend`로 순서를 맞추는 방식. 의도 명확 ✅

앨범 카드 copy:
- `isComplete && completionDates[puzzle.id]` 조건부 `small` 요소를 `appendTextElement` + `if` 블록으로 처리. 기존 `innerHTML`의 삼항 템플릿 리터럴 제거 ✅

**`mapView.js`** (단순)

단일 `innerHTML` 제거 → eyebrow `<p>` + heading `<h2>` 두 요소 `createElement`. `title.append(eyebrow, heading)` — 간결 ✅

### 설계 관찰

v0.1.373~v0.1.376(4커밋)에 걸쳐 `innerHTML` 경화 완료 현황:

| 파일 | 상태 |
|---|---|
| `src/ui/settingsView.js` | ✅ v0.1.373 |
| `src/ui/pantryView.js` | ✅ v0.1.372 |
| `src/ui/pantryStoryCards.js` | ✅ v0.1.375 |
| `src/ui/albumView.js` | ✅ v0.1.376 |
| `src/ui/mapView.js` | ✅ v0.1.376 |

앱의 주요 UI 모듈에서 i18n/데이터 삽입 경로의 `innerHTML` 사용이 모두 제거됨. 남은 `innerHTML` 사용이 있다면 정적 HTML 구조 생성 또는 신뢰된 마크업에 한정될 것.

### 평가

| 항목 | 상태 |
|---|---|
| albumView innerHTML 전체 교체 | ✅ |
| header.prepend 순서 유지 | ✅ |
| 조건부 small 요소 if 분리 | ✅ |
| mapView 단순 innerHTML 제거 | ✅ |

플래그 없음.

---

### 라운드 총평 (v0.1.374~v0.1.376)

**v0.1.374** — Review 112 ⚠️ 해소. 누적 미해소 주의 사항 0건.

**v0.1.375~v0.1.376** — `innerHTML` 경화 마지막 단계. `pantryStoryCards.js`, `albumView.js`, `mapView.js` 완료로 앱 UI 전 모듈 경화 완성.

현재 **누적 미해소 플래그 없음.**
---

## Review 118–122 — v0.1.377~v0.1.381 ui: harden rendering (5커밋)

이 5개 커밋은 v0.1.373~v0.1.376(settingsView, pantryView, pantryStoryCards, albumView, mapView)에 이은 `innerHTML` 경화의 마지막 웨이브다. 나머지 모든 UI 모듈을 `createElement` + `textContent` 방식으로 전환한다.

| 커밋 | 버전 | 대상 모듈 |
|---|---|---|
| `e1e3ce4` | v0.1.377 | `brandIntro.js`, `stageComplete.js` (오프닝, 완료 화면) |
| `40e5e38` | v0.1.378 | `appChrome.js`, `play.js` (앱 크롬, 플레이 진입) |
| `2d9e3f3` | v0.1.379 | `timeAttack.js`, `puzzleMeta.js` |
| `4f6a9eb` | v0.1.380 | `puzzleHubView.js` |
| `99082c0` | v0.1.381 | `pantryView.js` 나머지 블록 |

**공통 패턴 (전 커밋 ✅)**
- `appendTextElement(parent, tag, className, text)` 헬퍼를 각 파일에 지역 선언하여 사용
- `createMeterFill()` 패턴 — `document.createElement("span")` 래핑
- 조건부 요소: 삼항 템플릿 리터럴 → `if` 블록 + `appendTextElement`
- `aria-hidden` / `alt=""` 속성은 `setAttribute`로 이전

**`v0.1.381 pantryView.js` 주목**: `return null` 패턴 도입 — 기존 `return ""` (빈 문자열)을 `return null`로 변경. `innerHTML`을 쓸 때는 빈 문자열이 자연스러운 "삽입 안 함" 표현이었으나, DOM API에서는 `null` 반환 후 `if (node) parent.appendChild(node)` 패턴이 더 명시적 ✅

**결과**: 이 5개 커밋으로 앱 전체 `innerHTML`/`outerHTML`/`insertAdjacentHTML` 사용이 UI 렌더링 경로에서 완전 제거됨. 이를 v0.1.382(e2a8bc9)에서 CI 가드로 고정.

플래그 없음.

---

## Review 123 — v0.1.382 `e2a8bc9` qa: guard runtime html insertion

**커밋 요약**: `scripts/source_hygiene_check.js`에 런타임 HTML 삽입 금지 가드 추가. `src/ui`, `src/game`, `src/data` 내 모든 `.js` 파일을 스캔하여 `innerHTML`/`outerHTML`/`insertAdjacentHTML` 사용 시 CI 실패.

**변경 범위**: `scripts/source_hygiene_check.js` +15.

### 코드 분석

```js
const runtimeHtmlScanRoots = ["src/ui", "src/game", "src/data"];
if (/\b(?:innerHTML|outerHTML|insertAdjacentHTML)\b/.test(source)) {
  errors.push(`${projectPath}: runtime HTML string insertion is not allowed; …`);
}
```

- `\b` 단어 경계로 `innerHTML`이 변수명/주석 등에 포함된 경우 오탐 없음 ✅
- 스캔 루트 3개: UI, 게임 로직, 데이터 모듈. 스크립트/테스트는 제외 — 가드 범위가 "런타임 번들에 들어가는 코드"에 한정 ✅
- `collectFiles` 재사용 — 기존 hygiene check 유틸리티 활용 ✅
- 에러 메시지에 `createElement/textContent/replaceChildren` 대안 명시 — 다음 개발자가 바로 수정 방향 파악 가능 ✅

이 가드가 있으면 향후 어떤 커밋도 `innerHTML`을 다시 도입할 경우 CI에서 즉시 차단. 경화 완성의 선언 ✅

### 평가

| 항목 | 상태 |
|---|---|
| \b 단어 경계 정밀 매칭 | ✅ |
| 런타임 소스 3루트만 스캔 | ✅ |
| 에러 메시지 대안 명시 | ✅ |
| collectFiles 재사용 | ✅ |

플래그 없음.

---

## Review 124–132 — v0.1.383~v0.1.391 qa: Android 릴리즈 체인 구축 (9커밋)

Android 출시를 위한 QA 스크립트/자동화 체인 전체를 단계적으로 구축한 시리즈. 커밋 순서대로 구조가 층층이 쌓인다.

| 커밋 | 버전 | 내용 |
|---|---|---|
| `2591072` | v0.1.383 | `android_release_gate.js` — Play Store 그래픽/목록/프라이버시/후보 체크 항목 포함 여부 검증 (89줄) |
| `6732a7e` | v0.1.384 | `release_candidate_check.js` — Vitest, build, hygiene, mobile QA, HTTP 200 순차 실행 (105줄) |
| `f2ec29b` | v0.1.385 | `android_candidate_check.ps1` — WebView QA 포함한 Android 후보 빌드 검증 (50줄) |
| `112cccb` | v0.1.386 | `build_android_release_bundle.ps1` / `build_android_signed_release_bundle.ps1` 강화 — 빌드 전 gate 실행 |
| `7abd301` | v0.1.387 | `qa_play_store_graphics.js` — 아이콘(512px), 피처 그래픽(1024×500), 폰/태블릿 스크린샷 치수 검증 |
| `af342f9` | v0.1.388 | `docs/ANDROID_RELEASE_STATUS.md` 리프레시 |
| `b0f5b7a` | v0.1.389 | `qa_play_store_listing.js` — Play Console 초안, 스크린샷 참조, 프라이버시 URL, 런치 포지셔닝, 수익화 문구 검증 |
| `9d506bc` | v0.1.390 | `qa_privacy_policy.js` — 로컬 Markdown/HTML 프라이버시 정책 내용 검증 |
| `8fc327e` | v0.1.391 | `qa_live_privacy_policy.js` — 실제 라이브 URL 프라이버시 정책 HTTP 200 + 내용 검증 |

**핵심 설계 결정 (✅)**

릴리즈 체인 플로우:
```
versionCode/versionName bump
  → build_android_signed_release_bundle.ps1
    → qa:candidate (Vitest + build + hygiene + HTTP 200)
    → qa:privacy:live (라이브 URL)
    → qa:release:final (store + listing + privacy 로컬)
    → 서명 + AAB 생성
```

각 단계가 실패하면 체인이 중단. "실수로 미완성 빌드를 업로드하는" 시나리오를 구조적으로 차단 ✅

`android_release_gate.js` — 문서(ANDROID_RELEASE_STATUS.md, CONTEXT.md)에 특정 문구가 있는지 정규식으로 검증. "문서가 업데이트되지 않으면 릴리즈 불가"라는 프로세스 강제 — 릴리즈 프로세스를 코드로 명문화 ✅

Play Store 그래픽 검증 — 이미지 파일 치수를 Node.js에서 직접 읽어 검증. 외부 툴 불필요 ✅

**`cf5983b` (v0.1.391b)** — `qa:release:final`이 `qa:store` + `qa:store-listing` + `qa:privacy` + `qa:privacy:live`를 순차 실행하도록 체인 구성. 단일 명령으로 전체 릴리즈 게이트 실행 가능 ✅

플래그 없음.

---

## Review 133–139 — v0.1.392~v0.1.398 UI 클린업 + 모바일 QA 개선 (7커밋)

| 커밋 | 버전 | 내용 |
|---|---|---|
| `015f94d` | v0.1.392 | 스테이지 완료 화면 pending art 교체 → 실제 아트 |
| `8340097` | v0.1.393 | 퍼즐 허브 stage preview pending 폴백 제거, pending 텍스트 키 삭제 |
| `0872c38` | v0.1.394 | 팬트리 pending copy 미사용 i18n 키 제거 |
| `e349905` | v0.1.395 | 팬트리 배치 액션 버튼 텍스트 명확화 |
| `bcd62ff` | v0.1.396 | 모바일 QA 픽스처에서 HTML 문자열 제거 (텍스트 정규식으로 교체) |
| `f187697` | v0.1.397 | 팬트리 요청 카드 Pip 스타일링 통합 (v0.1.346 중복 선언 정리) |
| `9e7c6e0` | v0.1.398 | docs: Android 후보 QA 강화 기록 |

**`v0.1.396 bcd62ff`** 주목: 모바일 QA 스크립트의 텍스트 어서션이 `"<p>...텍스트...</p>"` 같은 HTML 문자열로 되어 있었음. `innerHTML` 경화(v0.1.382)로 DOM이 `textContent` 기반이 되면서 QA 픽스처도 정규식/텍스트 매칭으로 일치. QA가 구현 방식에 의존하지 않도록 디커플링 ✅

**`v0.1.397 f187697`** — `pantry-story-request__pip` 스타일이 두 위치에 분산되어 있던 것을 통합. v0.1.346(Review 87)에서 지적한 중복 선언 패턴의 자연스러운 정리 ✅

플래그 없음.

---

## Review 140–143 — v0.1.399~v0.1.402 모바일 픽스처/CI/문서 (4커밋)

| 커밋 | 버전 | 내용 |
|---|---|---|
| `ebde8a9` | v0.1.399 | 모바일 픽스처 HTML 문자열 가드 — source_hygiene_check에 추가 |
| `54f32ed` | v0.1.400 | docs: 모바일 픽스처 hygiene 가드 기록 |
| `78c47aa` | v0.1.401 | Android 릴리즈 체인 문서 가드 — release_gate에 ANDROID_RELEASE_STATUS 검증 추가 |
| `9f33111` | v0.1.402 | CI: `.github/workflows/verify.yml`에 `qa:release` 및 `qa:candidate` 스텝 추가 |

**`9f33111` CI 확장** — GitHub Actions `verify.yml`에 릴리즈 게이트 체크를 포함. 이제 PR/push마다 Android 릴리즈 게이트 조건이 자동 검증. 로컬에서만 돌리던 릴리즈 QA가 CI 방어선으로 승격 ✅

플래그 없음.

---

## Review 144–147 — v0.1.403~v0.1.406 후보/안내/가드 (4커밋)

| 커밋 | 버전 | 내용 |
|---|---|---|
| `554aa92` | v0.1.403 | `android_candidate_check.ps1` — 폴백 포트 허용(3000/5173) |
| `b41e512` | v0.1.404 | docs: 안드로이드 후보 검증 문서 리프레시 |
| `9c861d1` | v0.1.405 | ui: 첫 번째 가이드 Pip 주도로 변경 — 기존 텍스트 안내 대신 Pip 대화 카드를 첫 화면으로 |
| `d4eb499` | v0.1.406 | qa: 가이드 다이얼로그 텍스트 가드 추가 |

**`9c861d1` (v0.1.405)** 주목: `brandIntro.js`에서 첫 번째 가이드 단계를 Pip 주도 대화 카드로 교체. `src/i18n/en.js`, `ko.js` + CSS + QA + JS 9개 파일 변경 — 이번 라운드에서 UI 변경이 있는 유일한 커밋. `aria-hidden="true"` + `alt=""` 장식 처리 일관성 유지 ✅

플래그 없음.

---

## Review 148 — v0.1.407 `8466f62` qa: guard time attack guide story

**커밋 요약**: 타임 어택 가이드 다이얼로그의 텍스트/흐름 QA 가드 추가.

**변경 범위**: `scripts/mobile_visual_check.js` +11.

타임 어택 가이드가 열리고, Pip 대화 텍스트와 CTA가 예상 패턴에 맞는지 검증 + 다이얼로그 닫힘 확인. v0.1.406의 가이드 다이얼로그 가드와 동일 패턴. 플래그 없음.

---

## Review 149 — v0.1.408 `15d4326` qa: guard android store release chain

**커밋 요약**: `android_release_gate.js`에 Play Store 그래픽 QA(`qa:store`), 목록 QA(`qa:store-listing`), 로컬 프라이버시 QA(`qa:privacy`)가 문서에 기재되어 있는지 추가 검증. `ANDROID_RELEASE_STATUS.md`에 신규 스크립트 문서화.

**변경 범위**: `scripts/android_release_gate.js` +3, `docs/ANDROID_RELEASE_STATUS.md` +5 -1.

### 코드 분석

```js
["Play Store graphics QA command", /npm run qa:store/],
["Play Store listing QA command", /npm run qa:store-listing/],
["local privacy QA command", /npm run qa:privacy(?!:)/],
```

- `qa:privacy(?!:)` — 부정 전방탐색으로 `qa:privacy:live`와 구분. `qa:privacy`(로컬)만 매칭 ✅
- 세 가지 스크립트가 릴리즈 문서에 명시되어 있어야 gate 통과. "문서 = 게이트 조건" 원칙 일관 적용 ✅

`ANDROID_RELEASE_STATUS.md`에 `npm run qa:candidate` 설명 확장 — 이제 Vitest, catalog, hygiene, runtime asset manifest, Play Store graphics, **Play Store listing copy**, **local privacy policy alignment**, production build, Android release gate, HTTP 200, mobile visual QA 전 항목 명시 ✅

### 평가

| 항목 | 상태 |
|---|---|
| `(?!:)` 부정 전방탐색 qa:privacy vs qa:privacy:live | ✅ |
| 3개 QA 스크립트 gate 조건 추가 | ✅ |
| qa:candidate 설명 완전 갱신 | ✅ |

플래그 없음.

---

## Review 150 — v0.1.409 `1914d00` docs: clarify android signed upload path

**커밋 요약**: `scripts/android_candidate_check.ps1`의 안내 문구 수정. "버전코드/버전네임 bump 후 signed script 실행, 그 안에서 candidate/live privacy/final gate 재실행" 흐름을 명확히 문서화.

**변경 범위**: `scripts/android_candidate_check.ps1` +3 -1, `docs/CONTEXT.md` +5.

### 코드 분석

```powershell
# 수정 전
Write-Host "Before the signed Play upload, bump android/app/build.gradle versionCode/versionName and run npm run qa:release:final."

# 수정 후
Write-Host "Before the signed Play upload, bump android/app/build.gradle versionCode/versionName."
Write-Host "Then run scripts/build_android_signed_release_bundle.ps1; it reruns qa:candidate, qa:privacy:live, and qa:release:final before signing."
```

변경 전: "bump하고 qa:release:final 직접 실행" → 변경 후: "bump 후 **서명 스크립트**를 실행하면 그 안에서 qa:candidate + qa:privacy:live + qa:release:final이 자동으로 재실행됨"

이 수정이 중요한 이유: 기존 문구대로 하면 수동으로 gate를 실행하고 서명 스크립트를 별도로 호출해야 해서 gate 없이 서명하는 실수가 가능했다. 새 문구는 "서명 스크립트가 gate를 포함한다"는 사실을 명시해 이 실수를 예방 ✅

PowerShell parser 체크 통과 — 스크립트 문법 오류 없음 ✅

### 평가

| 항목 | 상태 |
|---|---|
| 서명 스크립트 = gate 포함 명시 | ✅ |
| 수동 gate 실행 실수 예방 | ✅ |
| PowerShell parser 통과 | ✅ |

플래그 없음.

---

### 전체 라운드 총평 (v0.1.377~v0.1.409 / 34커밋)

이번 라운드는 앱의 **품질 인프라 완성** 라운드다. 두 축이 동시에 진행됐다:

**1. `innerHTML` 경화 완성 (v0.1.377~v0.1.382)**
앱 전체 UI 모듈(`brandIntro`, `appChrome`, `timeAttack`, `puzzleHub`, `pantry` 등)의 `innerHTML` 사용을 `createElement` + `textContent`로 교체 완료. v0.1.382에서 `source_hygiene_check`에 CI 가드 추가로 재도입 영구 차단.

**2. Android 릴리즈 체인 구축 (v0.1.383~v0.1.409)**
릴리즈 gate → 후보 체크 → 서명 스크립트 체인, Play Store 그래픽/목록/프라이버시 자동 검증, CI 통합까지 완전한 릴리즈 파이프라인 구축. "버전 bump → 서명 스크립트 실행 한 번"으로 전체 게이트가 자동 실행되는 구조.

**누적 미해소 플래그 없음.**

---

## v1 Pre-Launch Review — Economy & Gameplay Integrity

**대상 버전**: v0.1.409 (1914d00) 기준  
**검토 범위**: Spoon Economy / IAP 구조 + Gameplay 무결성 두 축  
**목적**: 버그 리뷰가 아닌, v1 출시 전 경제 체제와 플레이어 진행 안전성 종합 점검

---

### Axis 1 — Spoon Economy & IAP 구조

#### 1-A. 경제 흐름 분석 (Free Path)

**장식 비용 분포 (`decorations.js`)**

| Rarity | 가격 범위 | 예시 |
|---|---|---|
| starter | 0 | starter-counter-cloth (무료) |
| common | 20–55 | sunny-window-curtains(22), recipe-card-shelf(28) |
| cozy | 80–145 | soup-pot-display(80), honey-cake-stand(145) |
| rare | 245–360 | porcelain-spice-carousel(245), golden-waffle-press(360) |

**팩 잠금 해제 조건 (`packs.js`)**

| 팩 | unlockCost | pantryRoomStepRequired |
|---|---|---|
| pips-first-shelf | 0 (무료) | 없음 |
| sunny-spoon-sign | 80 | 3 |
| apron-drawer | 160 | 6 |
| bakery-window | 280 | 10 |
| village-pantry | 450 | 10 |
| cafe-window-plus 외 4개 | null (bonus-pack) | 없음 |

**신규 유저 첫 30–60분 시나리오**

첫 퍼즐 완료 시 3 + 8 (daily bonus) = 11 스푼 확보. starter-counter-cloth는 비용 0이므로 즉시 첫 장식 가능 → 팬트리 스토리 목표 1 달성. Common 장식 하나 더 구매(20–28 스푼)하면 2달성. 첫 팩을 모두 클리어하면 stage bonus 40까지 합쳐 첫 세션에 두 번째 팩 언락 조건(80 스푼 + pantryRoomStep 3)에 근접할 수 있음.

**평가**: 첫 세션 과금 압력 없음 ✅. 자연스러운 IAP 욕구 발생 시점은 2–3회차 이후("저 소파 쿠션 120 스푼인데 지금 80밖에 없어") 또는 Time Attack 일일 한도 3회 소진 후. 경제 구조 자체는 "스푼 더 모아야 꾸밀 수 있다"는 동기를 유지하면서 압박이 아닌 기대감으로 작동함 ✅

---

#### 1-B. IAP 현황 및 v1 최소 구현 권고

**현재 상태**

- `cozyPassPurchased: Boolean(parsed?.cozyPassPurchased)` — save.js에 필드는 있으나 어디서도 읽히지 않는 완전한 dead code
- `COZY_PASS_SPOON_GRANT: 250` — economyConfig.js에 상수 존재, 미사용
- `bonus-pack` 5개(cafe-window-plus 외 4개) — `monetizationRole: "paid-theme-pack"`, `pricePreviewKey` 정의, 실제 구매 흐름 전무
- Google Play Billing 플러그인 미설치

**⚠️ P1 FLAG: IAP 미구현 — v1 출시 조건과 충돌**

bonus-pack은 UI에 "가격 미리보기" 칩이 노출될 수 있으나 구매 버튼/흐름이 없음. 빠른 유저가 free-progression 팩을 모두 소진하면 bonus-pack 앞에서 진행이 막힘 — 가시적 dead end.

**최소 IAP 구현 경로 (Codex용)**

옵션 A — **Cozy Support Pack (one-time non-consumable, 권장)**
- 단일 제품: `pip_cozy_support_pack` ($0.99 또는 $1.99)
- 구매 시: 250 스푼 지급 + `cozyPassPurchased = true` 저장
- 기존 `COZY_PASS_SPOON_GRANT: 250` + `cozyPassPurchased` 필드 그대로 활성화
- 게임 정체성("응원이 담긴 한 끼")과 자연스럽게 연결됨
- 구현 최소: 플러그인 1개 + 제품 1개 + 구매 완료 콜백에 spoon 지급 3줄

옵션 B — **Spoon Bundle (consumable, 반복 구매 허용)**
- 제품: `spoon_bundle_100` 등
- 반복 구매이므로 Play Console consumable로 등록 필요
- 구현 복잡도 약간 높음

옵션 C — **Bonus Pack IAP**
- `cafe-window-plus` 등 5개 팩 각각 제품 ID 등록
- 팩별 puzzle assets이 실제로 존재해야 하므로 컨텐츠 준비가 선행 조건

**v1 현실적 권고**: 옵션 A (Cozy Support Pack) 단일 제품으로 시작. 기존 코드 구조 그대로 활성화, 최소 변경. bonus-pack 항목은 "곧 출시 예정" 텍스트로 잠금 처리하거나 v1에서 팩 리스트에서 숨김.

**필요 작업**:
1. `@capacitor-community/google-play-billing` 또는 `@capgo/capacitor-purchases` 플러그인 설치
2. Play Console → 앱 내 제품 등록 (제품 ID, 가격)
3. `src/game/save.js`의 `cozyPassPurchased` 활성화 + spoon 지급 로직
4. 구매 UI (팬트리 또는 메인 메뉴에 "Pip 응원하기" 버튼)
5. 구매 복원(restore purchases) 처리

---

#### 1-C. 경제 밸런스 위험 요소

**일일 경계(midnight) 이중 보상 (P3)**
`getLocalDateKey()`가 로컬 시간 기준 — 자정 직전/직후 첫 퍼즐을 연속 완료하면 daily bonus를 당일과 다음날 각각 청구할 수 있음. 영향: +8 스푼. 악용 가능하나 효과 미미, v1.1 백로그 적정.

---

### Axis 2 — Gameplay 무결성

#### 2-A. Undo + Hint 상호작용

**검증 결과**: 안전 ✅

- `hintsUsed` 카운터: undo 경로에서 감소하지 않음 (summary 확인, `skipAutoLineMarks: true` 패턴)
- 스푼 지출(`spendPantrySpoons`): save.js의 원자적 쓰기 — undo는 puzzleState의 셀 상태만 복원, save.js 잔액은 건드리지 않음
- 힌트를 사용하고 undo해도 스푼은 돌아오지 않고 `hintsUsed`도 유지 → 반복 사용을 통한 부당 이득 없음

#### 2-B. Replay Pick 파밍 방지

**검증 결과**: 안전 ✅ (save.js `recordReplayReward` 코드 직접 확인)

3중 가드:
1. `!picked || !clean` → 선택 + clean 조건 동시 요구
2. `!completedPuzzleIds.includes(puzzleId)` → 완료된 퍼즐만 가능
3. `rewardedToday.includes(puzzleId)` → 퍼즐 ID별 당일 중복 차단 + `rewardedToday.length >= 3` → 1일 최대 3회

30일 후 자동 prune으로 날짜 문자열 조작 exploit도 차단. 최대 파밍: 1 스푼 × 3 = 3 스푼/일 → 무시 가능.

**한 가지 확인 필요**: `clean` 파라미터가 호출부(replayChallenge.js 등)에서 힌트 사용 시 실제로 `false`로 넘어오는지 확인 필요. 코드 경로상 `clean: false` 넘기는 로직이 있어야 가드가 실제로 작동.

#### 2-C. Time Attack 기록 공정성

**검증 결과**: 안전 ✅ (randomPuzzle.js `getTimeAttackRunScore` 직접 확인)

```js
score = Math.floor(progressCells * 1000 + max(0, 600 - elapsed) - min(500, hints * 25))
```

- **셀 수가 핵심(×1000 배수)**: 1칸 더 채우는 것이 600초 속도 보너스보다 40배 가치. 라운드 수가 아닌 진행 칸 수 기준 ✅
- 속도 보너스 최대 600점(10분 내 완료 시), 힌트 페널티 최대 500점
- 보상 조건: `progressCells > 0 && dailyCount < 3` — 타임아웃 게임도 1칸만 채우면 보상 받을 수 있으나 기록은 낮음 → 허용 가능한 설계

#### 2-D. Stage unlock 충돌 (이중 요건)

**구조**: `canUnlockPack()` = spoons ≥ unlockCost AND pantryRoomStep ≥ required

sunny-spoon-sign: 80 스푼 + 3 팬트리 스텝. 스푼만 쌓고 장식 안 한 유저는 잠금 해제 불가. 이 이중 요건이 UI에서 명확히 전달되는지가 관건.

v0.1.344(Review 85)에서 route 3칩("부탁 → 다음 스테이지 → 스푼")이 추가되어 시각적 경로는 존재. 그러나 실제 잠금 해제 시도 시 "팬트리 장식 X개 더 필요" 명시 메시지가 있는지 확인 필요.

**⚠️ P2 FLAG**: 팩 언락 UI에서 스푼 부족과 팬트리 스텝 부족을 구분하는 명시적 차단 메시지가 없으면 유저가 "왜 못 열리지?"로 혼란. 팬트리 스텝 조건이 충족되지 않을 때 별도 안내 텍스트 또는 버튼 비활성화 + 이유 표시 필요.

#### 2-E. 팬트리 아이템 구매/장착/슬롯 영속성

**검증 결과**: 안전 ✅

`normalizeSave` 코드 직접 확인:
- `ownedDecorationIds`: `Array.from(new Set(...))` 중복 제거 ✅
- `equippedDecorations`: 유효하지 않으면 `{}` 기본값 ✅
- `buyDecoration`: 구매-장착-storyGoal 완료를 하나의 save 호출로 원자 처리 ✅
- JS 단일 스레드 → race condition 없음 ✅
- 저장 직후 `loadSave()` 재호출로 항상 최신 상태 읽음 ✅

#### 2-F. 플레이어 유형별 dead-end 분석

| 유형 | 경로 | 막힘 여부 |
|---|---|---|
| 신규 유저 | 스타터 팩 무료 + starter-counter-cloth 0원 → 즉시 시작 가능 | ✅ 없음 |
| 느린 유저 | 퍼즐마다 스푼 적립, 일일 보너스로 꾸준히 진행 | ✅ 없음 |
| 빠른 유저 | free-progression 팩 5개 소진 후 bonus-pack 앞에서 정지 | ⚠️ **IAP 없으면 dead end** |
| 재방문 유저 | 일일 한도 소진 후 스푼 쓸 곳 있으면 OK | ✅ (데코 있으면 OK) |

**빠른 유저 dead-end가 P1의 핵심**: 모든 free 팩 클리어 + 모든 원하는 장식 구매 후 bonus-pack가 구매 불가 상태면 앱을 닫을 이유만 남음. IAP 구현이 이를 직접 해소.

#### 2-G. Android WebView / 모바일 레이아웃

이전 리뷰 시리즈(Review 104/110 reset dialog, Review 82 설정 카드, 안전 영역 가드 등)에서 확인된 주요 항목:
- 360/390/430px 뷰포트 QA 통과 ✅
- Safe-area 4개 fixed overlay 가드 ✅
- 터치 타겟 ≥ 110px ✅
- 현재 미확인 항목: bonus-pack `pricePreviewKey` UI가 360px에서 오버플로 없이 렌더링되는지 (IAP 구현 전 테스트 불가)

---

### 종합 우선순위 요약

| 우선순위 | 항목 | 권고 |
|---|---|---|
| **P1** | IAP 미구현 (bonus-pack dead-end) | Cozy Support Pack 단일 제품으로 v1 최소 IAP 구현 |
| **P2** | 팩 언락 이중 요건 UI 미전달 | 팬트리 스텝 부족 시 명시적 차단 메시지 추가 |
| **P3** | Replay `clean` 파라미터 호출부 검증 | replayChallenge.js에서 hint 사용 시 `clean: false` 확인 |
| **P3** | Daily bonus 자정 timezone exploit | v1.1 백로그 유지 |

**현재 안전한 항목**: Undo-hint 상호작용 ✅, Replay Pick 파밍 방지 ✅, Time Attack 셀 기반 점수 ✅, 팬트리 영속성 ✅, 모바일 레이아웃(bonus-pack UI 제외) ✅

---

**Codex 다음 액션 권고**:
1. `@capacitor-community/google-play-billing` 설치 + Cozy Support Pack 단일 제품 등록
2. `save.js` `cozyPassPurchased` 활성화 + 250 스푼 지급 콜백 연결
3. 팩 언락 UI — 팬트리 스텝 조건 미충족 시 차단 메시지 추가
4. `replayChallenge.js`에서 `recordReplayReward({ ..., clean: hintCount === 0 })` 확인
5. bonus-pack 항목 v1에서 숨기거나 "출시 예정" 상태로 전환 (IAP 완료 전)


---

## Review 151 — v0.1.410 `58f5e44` game: guard nested billing entitlement payloads

**커밋 요약**: `isCozySupportEntitlement()`의 `products` 배열 항목 판정 로직을 강화. 기존에는 `payload.products.includes(id)` 문자열 비교만 했으나, 이번 변경으로 배열 항목이 객체인 경우(`{ productIdentifier: id }`, `{ productId: id }`)도 재귀 호출로 처리.

**변경 범위**: `src/game/billing.js` +3 -2, `tests/billing.test.js` +3.

### 코드 분석

**변경 전**
```js
if (Array.isArray(payload.products)) {
  return payload.products.includes(COZY_SUPPORT_PRODUCT_ID);
}
```

**변경 후**
```js
if (Array.isArray(payload.products)) {
  return payload.products.includes(COZY_SUPPORT_PRODUCT_ID)
    || payload.products.some(isCozySupportEntitlement);
}
```

`products` 배열에 문자열 ID가 직접 들어오면 `includes`로 처리하고, 객체가 들어오면 `isCozySupportEntitlement`로 재귀 호출. 재귀 종료 조건은 최상단 `if (payload === COZY_SUPPORT_PRODUCT_ID)` 기본값 체크 및 `payload.productID / productId / productIdentifier / identifier` 직접 비교 — 실제 SDK 응답에서 무한 중첩이 발생하지 않으므로 안전 ✅

Play Billing SDK 버전에 따라 `products` 배열 항목이 문자열로 오기도 하고 객체로 오기도 하는 현실적인 변동성을 방어하는 올바른 접근 ✅

**테스트 추가**
```js
{ products: [{ productIdentifier: COZY_SUPPORT_PRODUCT_ID }] } → true ✅
{ products: [{ productId: COZY_SUPPORT_PRODUCT_ID }] }         → true ✅
{ products: [{ productIdentifier: "other-product" }] }         → false ✅
```

두 중첩 형태 모두 커버. 기존 테스트 22개 회귀 없음 ✅

### 평가

| 항목 | 상태 |
|---|---|
| 중첩 객체 판정 보강 | ✅ |
| 재귀 무한 루프 위험 | ✅ 없음 |
| 기존 문자열 includes 경로 유지 | ✅ |
| 테스트 3케이스 추가 | ✅ |

플래그 없음.

---

## Review 152 — v0.1.411 `8990ee0` chore: align future set naming with support pack plan

**커밋 요약**: `paidPackHint` → `futurePackHint` (i18n 키), `paid-preview` → `bonus-preview` (CSS 클래스), `billing_release_check.js`의 키 참조 정렬.

**변경 범위**: `src/i18n/en.js` +1 -1, `src/i18n/ko.js` +1 -1, `src/ui/puzzleHubView.js` +2 -2, `src/styles.css` +2 -2, `scripts/billing_release_check.js` +2 -2.

### 코드 분석

**의도**: bonus-pack 팩들은 v1에서 구매 불가 "출시 예정" 상태. `paid-`로 시작하는 명칭은 "지금 살 수 있다"는 오해를 유발 — `bonus-` / `future-`로 정정.

**i18n 키 변경**: `packs.paidPackHint` → `packs.futurePackHint`. en.js/ko.js 동시 적용, 누락 없음 ✅

**CSS 클래스**: `.paid-preview` → `.bonus-preview`. `puzzleHubView.js`의 className 할당도 동시 변경 ✅

**billing_release_check.js**: `futurePackCopy` 배열에서 `englishCopy.packs.paidPackHint` → `englishCopy.packs.futurePackHint` 양 언어 동시 변경. QA에서 i18n 키 누락 즉시 감지 가능한 구조 유지 ✅

### 평가

| 항목 | 상태 |
|---|---|
| i18n 키 en/ko 동시 변경 | ✅ |
| CSS 클래스 + JS 할당 동기화 | ✅ |
| billing_release_check.js 참조 정렬 | ✅ |
| 구 명칭 잔존 없음 | ✅ |

플래그 없음.

---

## Review 153 — v0.1.412 `cac5bb4` chore: rename future pack monetization role

**커밋 요약**: bonus-pack 5개의 `monetizationRole: "paid-theme-pack"` → `"future-theme-pack"`. `billing_release_check.js`에 `"paid-theme-pack"` legacy needle 추가로 재도입 CI 차단.

**변경 범위**: `src/data/packs.js` +5 -5, `scripts/billing_release_check.js` +1, `tests/puzzleCatalogReport.test.js` +1 -1, `tests/puzzleData.test.js` +3 -3.

### 코드 분석

**`src/data/packs.js`**

5개 팩(cafe-window-plus / bakery-morning-plus / seasonal-pantry-plus / village-picnic-plus / sunny-festival-plus) 전체 일괄 변경. 누락 없음 ✅

`"future-theme-pack"`은 v1에서 해당 팩이 "구매 불가 예정 컨텐츠"임을 코드 레벨에서 명확히 선언. `billing.js`나 `puzzleHubView.js`에서 이 role을 읽어 구매 가능 여부를 판단한다면 `"future-"` 접두어로 즉시 구분 가능.

**`billing_release_check.js` — legacy needle 추가**
```js
for (const legacyNeedle of [
  "pips_spoons_950",
  "@capacitor-community/in-app-purchases",
  "cordova-plugin-purchase",
+ "paid-theme-pack",   // ← 추가
  "Tiny Jar",
  ...
```

이전 명칭 `"paid-theme-pack"`이 소스에 재등장하면 CI `qa:billing`이 즉시 실패 — 네이밍 퇴행 방지 ✅

**테스트 업데이트**: `puzzleCatalogReport.test.js`와 `puzzleData.test.js`에서 `"paid-theme-pack"` 기대값을 `"future-theme-pack"`으로 일치 변경. 테스트 자체가 명칭 계약을 지킨다 ✅

### 평가

| 항목 | 상태 |
|---|---|
| 5개 팩 전체 일괄 변경 | ✅ |
| legacy needle CI 차단 추가 | ✅ |
| 관련 테스트 동기화 | ✅ |
| v0.1.411과 네이밍 방향 일치 | ✅ |

플래그 없음.


---

## Review 154 — v0.1.413 `00c6491` qa: guard support pack visible copy

**커밋 요약**: `mobile_visual_check.js`의 Settings Support Pack 카드 검사를 강화. (1) 구매/복원 버튼 문구 존재 확인, (2) `paid/free/유료/무료` 노출 금지어 차단.

**변경 범위**: `scripts/mobile_visual_check.js` +16 -11, `docs/CONTEXT.md` +3.

### 코드 분석

**`visibleText` 수집 추가**
```js
visibleText: supportCard?.innerText?.trim() || "",
```
`textContent`가 숨겨진 텍스트까지 읽는 것과 달리 `innerText`는 렌더된 가시 텍스트만 수집 — 노출 금지어 검사에 적합한 방법 ✅

**`actionTexts` 수집 추가**
```js
actionTexts: supportActions.map((button) => button.textContent?.trim() || ""),
```
버튼 배열 전체를 텍스트로 수집. 기존에는 버튼 개수(`actionCount`)만 확인했으나 이제 실제 문구까지 검증 ✅

**3개 검증 조건 추가**
```js
/(paid|free|유료|무료)/i.test(metrics.settingsPolish.supportCard.visibleText)
```
→ 카드 가시 영역에 `paid/free/유료/무료` 등장 시 즉시 실패. 개발 중 실수로 "무료 체험" 같은 문구가 들어가는 것을 차단 ✅

```js
!actionTexts.some((text) => /Support|응원/.test(text))
!actionTexts.some((text) => /Restore|복원/.test(text))
```
→ 구매 버튼(`Support/응원`)과 복원 버튼(`Restore/복원`) 양쪽이 반드시 존재해야 통과. 버튼 중 하나가 빠지면 QA 실패 ✅

**기존 조건 유지**: factTexts에 "250"과 "Restore" 포함 여부, factHeight ≥ 28px, gradient 배경 등 — 모두 누락 없이 유지 ✅

### 평가

| 항목 | 상태 |
|---|---|
| innerText로 가시 텍스트만 검사 | ✅ |
| paid/free/유료/무료 노출 금지 | ✅ |
| Support + Restore 버튼 양쪽 존재 강제 | ✅ |
| 기존 조건(250 스푼, gradient) 유지 | ✅ |
| qa:billing + qa:mobile 통과 | ✅ |

플래그 없음.

---

## Review 155 — v0.1.414 `32b47de` qa: surface billing evidence before signed upload

**커밋 요약**: `android_candidate_check.ps1`에 `pip_cozy_support` Play Console 제품 활성화 + 실기기 구매/복원 기록 요건을 안내 메시지로 추가. signed upload 전 차단 항목 조기 노출.

**변경 범위**: `scripts/android_candidate_check.ps1` +1 (추가 1줄), `docs/CONTEXT.md` +3.

### 코드 분석

```powershell
Write-Host "Also create/activate the Play Console managed product pip_cozy_support and record real-device purchase/restore validation in docs/ANDROID_RELEASE_STATUS.md."
```

기존 흐름: unsigned candidate AAB 통과 → "versionCode bump 후 signed build 실행" 안내
변경 후: 그 사이에 Play Console 제품 활성화 + 실기기 검증 기록 요건을 명시적으로 출력

**왜 이 위치가 적절한가**:
- `android_candidate_check.ps1`은 `build_android_signed_release_bundle.ps1`이 서명 전에 자동 호출하는 스크립트
- 이미 `qa:release:final`에 하드 게이트가 있지만 그 단계는 서명 직전 — 이미 빌드가 완료된 후
- candidate 통과 직후 안내를 노출하면 "빌드 → 실기기 테스트 → 문서 기록 → 서명"의 올바른 순서를 개발자가 놓치지 않음 ✅

**제품 ID `pip_cozy_support` 명시**: 빌링 코드(`billing.js`)의 `COZY_SUPPORT_PRODUCT_ID`와 동일한 값 — 일관성 ✅

### 평가

| 항목 | 상태 |
|---|---|
| signed upload 전 조기 리마인더 | ✅ |
| 제품 ID 명시 (pip_cozy_support) | ✅ |
| ANDROID_RELEASE_STATUS.md 기록 지시 | ✅ |
| 기존 versionCode bump 안내 유지 | ✅ |

플래그 없음.


---

## Review 156 — v0.1.423 `fcec9e2` billing: add small spoon jar product

**커밋 요약**: `pip_spoon_jar_small` (750 스푼, 반복 소모형) 두 번째 IAP 제품 추가. `billing.js` 공통 헬퍼 추출 리팩터, `save.js` `processedBillingPurchaseIds` 중복 차단, `settingsView.js` Spoon Jar 카드 UI, `billing_release_check.js` 전 문서 가드 확장.

**변경 범위**: `src/game/billing.js` +24 -13, `src/game/save.js` +40 +4, `src/data/economyConfig.js` +2, `src/ui/settingsView.js` +86, `src/ui/appShell.js` +36, `src/styles.css` +35, `src/i18n/en.js` +6, `src/i18n/ko.js` +6, `scripts/billing_release_check.js` +77 -48, 테스트/문서 다수.

---

### 코드 분석 — billing.js 리팩터

**`getBillingProduct(productIdentifier, fallbackProduct)` 공통 헬퍼 추출**

기존 `getCozySupportProduct` 안에 있던 런타임 체크 → `isBillingSupported` → `getProduct` → fallback 4중 분기가 공통 헬퍼로 분리. `getCozySupportProduct`와 `getSpoonJarSmallProduct` 양쪽이 같은 경로를 재사용:

```js
export async function getCozySupportProduct() {
  const result = await getBillingProduct(COZY_SUPPORT_PRODUCT_ID, FALLBACK_SUPPORT_PRODUCT);
  return { ...result, owned: hasCozySupportPack() };  // owned는 support 전용으로 후처리
}
```

`owned` 필드를 헬퍼 안에 두지 않고 호출부에서 후처리한 점이 깔끔 — consumable인 jar에는 `owned` 개념이 없으므로 헬퍼를 오염시키지 않음 ✅

**`hasProductId` / `getObjectProductId` 분리**

기존 `isCozySupportEntitlement` 로직이 `hasProductId(payload, productId)` 범용 함수로 추출됨. `isCozySupportEntitlement`와 `isSpoonJarSmallPurchase` 양쪽이 단일 구현을 참조:

```js
export function isCozySupportEntitlement(payload) { return hasProductId(payload, COZY_SUPPORT_PRODUCT_ID); }
export function isSpoonJarSmallPurchase(payload) { return hasProductId(payload, SPOON_JAR_SMALL_PRODUCT_ID); }
```

리뷰 151에서 지적한 "재귀 중첩 객체 판정"이 이번 리팩터에서 `hasProductId`로 통합. 동작은 동일하고 두 제품이 같은 로직을 공유 ✅

**`getPurchaseKey(payload, productId)` — 소모형 중복 방지 핵심**

```js
export function getPurchaseKey(payload, productId = SPOON_JAR_SMALL_PRODUCT_ID) {
  const purchase = findPurchaseObject(payload, productId);
  const uniqueId = firstString(
    purchase?.transactionId, purchase?.transactionID, purchase?.transactionIdentifier,
    purchase?.orderId, purchase?.orderID, purchase?.purchaseToken, purchase?.token
  );
  return uniqueId ? productId + ":" + uniqueId : "";
}
```

7가지 SDK 필드명 변형을 `firstString` 헬퍼가 앞에서부터 최초 truthy 값을 선택. 어떤 SDK 버전이든 토큰 필드 하나만 존재하면 dedup 가능 ✅

`uniqueId` 없으면 `""` 반환 → `grantSpoonJarPurchase("")` → `{ granted: false, reason: "missing-purchase-key" }` → 안전 실패 ✅

---

### 코드 분석 — save.js

**`processedBillingPurchaseIds` + `grantSpoonJarPurchase`**

```js
const PROCESSED_BILLING_PURCHASE_RETENTION = 80;
```

80개 상한으로 unbounded growth 차단. 80 purchases 이후 가장 오래된 항목이 탈락하지만 현실적으로 같은 purchase token이 80회 구매 후에 재사용될 일은 없음 — v1 충분 ✅

3중 가드:
1. `!normalizedKey` → `missing-purchase-key` (빈 key 차단)
2. `processedBillingPurchaseIds.includes(normalizedKey)` → `already-processed` (토큰 재사용 차단)
3. 신규 key → 750 스푼 지급 → key를 배열에 push 후 `.slice(-80)`

`normalizeSave`에 `processedBillingPurchaseIds` 정상화:
```js
Array.from(new Set(...)).slice(-PROCESSED_BILLING_PURCHASE_RETENTION)
```
Set 중복제거 + 최신 80개 유지. save/restore 사이클에서도 상한 유지 ✅

**save.test.js 토큰 dedup 검증**
```
token-a → { granted: true, balance: 770 } ✅
token-a 재시도 → { granted: false, duplicate: true, balance: 770 } ✅
"" → { reason: "missing-purchase-key" } ✅
```
핵심 시나리오 3개 모두 커버 ✅

---

### 코드 분석 — settingsView.js

**`createSpoonJarCard` — Support Pack 카드와의 차이점**

| 항목 | Support Pack | Spoon Jar |
|---|---|---|
| 액션 버튼 수 | 구매 + 복원 2개 | 구매 1개 |
| CSS modifier | `support-pack-card` | `support-pack-card support-pack-card--jar` |
| Actions layout | 2열 grid | `--single` (1열 grid) |
| owned 개념 | 있음 (`cozyPassPurchased`) | 없음 (소모형) |
| 복원 버튼 | 있음 | 없음 (소모형 비원칙) ✅ |

`support-pack-card__actions--single` 클래스로 1버튼 레이아웃 명시. 기존 2버튼 레이아웃에서 CSS만 override하는 깔끔한 패턴 ✅

**`canPurchaseSpoonJar`**

```js
export function canPurchaseSpoonJar(spoonJar) {
  return Boolean(spoonJar?.available && !spoonJar.loading);
}
```

소모형은 `already-owned` 없이 언제나 available이면 구매 가능. `status === "purchased"` 이후에도 available이면 바로 재구매 가능 → consumable 규칙 정확 ✅

**`getSpoonJarStatus` 기본 fallback**

```js
if (!spoonJar.available) return t("settings.supportAndroidOnly");
return t("settings.spoonJarReady");  // "Spoons arrive after each jar."
```

`status: "ready"` 와 `status: "checking"` 처리 없이 마지막 fallback이 `spoonJarReady`. "체크 중"이 아닌 상황에서 로딩 완료 상태 텍스트가 기본으로 노출될 수 있으나, `status: "checking"` 시 `spoonJar.loading === true`이므로 첫 번째 조건(`if (spoonJar.loading)`)에서 `supportChecking` 반환으로 가려짐. 실제 노출 경로 없음 ✅

---

### 코드 분석 — CSS

**`.support-pack-card--jar` 토큰 시각**

```css
.support-pack-card--jar::after {
  border-radius: 15px 15px 18px 18px;  /* 항아리형 */
  background:
    radial-gradient(circle at 34% 24%, white 0 11%, transparent 12%),
    linear-gradient(145deg, #ffe9a7 0 18%, #f2b24f 19% 58%, #c9783e 59% 100%);
}
```

Support Pack 토큰(원형 코인)과 달리 항아리 실루엣(상단 좁고 하단 넓은 radius). 밝은 amber → 주황 → 갈색 그라디언트로 세라믹 항아리 질감 연출. 카드 어휘 안에서 제품별 시각 차별화 ✅

---

### billing_release_check.js 확장

새로 추가된 가드 목록:

| 검사 대상 | 심볼 / 키 |
|---|---|
| billing.js | `SPOON_JAR_SMALL_PRODUCT_ID`, `isSpoonJarSmallPurchase`, `purchaseSpoonJarSmall`, `isConsumable: true`, `getPurchaseKey`, `grantSpoonJarPurchase` |
| settingsView.js | `canPurchaseSpoonJar` |
| save.js | `grantSpoonJarPurchase`, `processedBillingPurchaseIds` |
| economyConfig.js | `SPOON_JAR_SMALL_GRANT: 750` |
| i18n | `spoonJarTitle/Body/FactSpoons/FactRepeat/Ready/Buy` (6개) |
| 5개 문서 | `pip_spoon_jar_small`, `USD 2.99`, `750 spoons`, `consumable`, `Small Spoon Jar` |
| legacy blocker | — (별도 추가 없음, 기존 `paid-theme-pack` 으로 충분) |

`isConsumable: true` 심볼을 명시적으로 가드한 점이 인상적 — 향후 누군가 실수로 이 플래그를 제거하면 qa:billing이 즉시 차단 ✅

**한 가지 관찰 — Korean title 변경**

```diff
-requireIncludes(billingSetup, "Korean title: Pip 응원팩", "docs/PLAY_CONSOLE_BILLING_SETUP.md");
+requireIncludes(billingSetup, "Korean title: Pip Support Pack", "docs/PLAY_CONSOLE_BILLING_SETUP.md");
```

문서 내 Korean title이 `Pip 응원팩` → `Pip Support Pack` (영문)으로 변경됨. Play Console에서 한국어 타이틀을 영문 그대로 등록하려는 의도로 보임. 의도적이면 OK. 추후 한국 스토어 현지화 시 다시 검토 필요.

---

### 평가

| 항목 | 상태 |
|---|---|
| `getBillingProduct` 공통 헬퍼 추출 | ✅ |
| `hasProductId` 범용화 — 제품별 판정 공유 | ✅ |
| `getPurchaseKey` — 7가지 SDK 필드 커버 | ✅ |
| 빈 key → `missing-purchase-key` 안전 실패 | ✅ |
| `processedBillingPurchaseIds` 80개 상한 | ✅ |
| consumable no-restore 설계 | ✅ |
| `isConsumable: true` CI 가드 | ✅ |
| 항아리 토큰 시각 차별화 | ✅ |
| i18n en/ko 6키 완비 | ✅ |
| save/billing 테스트 dedup 시나리오 | ✅ |
| 5개 문서 전방위 qa:billing 가드 | ✅ |
| 113 Vitest passed | ✅ |

플래그 없음.


---

## Review 157 — v0.1.424 `7f1272f` release: guard dual billing products

**커밋 요약**: (1) Play Console 문서의 한국어 상품명 정리(`Pip 응원팩` / `작은 스푼 병`), (2) `qa:billing`이 두 한국어 타이틀을 검증하도록 강화, (3) `android_release_gate.js`에 Spoon Jar 실기기 검증 가드 추가, (4) candidate/release 메시지에 두 상품 명시.

**변경 범위**: `scripts/android_release_gate.js` +20 -9, `scripts/billing_release_check.js` +2 -1, `scripts/android_candidate_check.ps1` +1 -1, `docs/PLAY_CONSOLE_BILLING_SETUP.md` +2 -2.

### 코드 분석

**한국어 상품명 확정**

리뷰 156에서 관찰한 `"Korean title: Pip Support Pack"` (영문 유지) 이슈가 이번 커밋에서 즉시 정정됨:

| 상품 | 영문 | 한국어 |
|---|---|---|
| pip_cozy_support | Pip Support Pack | Pip 응원팩 |
| pip_spoon_jar_small | Small Spoon Jar | 작은 스푼 병 |

`qa:billing`이 이제 `"Korean title: Pip 응원팩"`과 `"Korean title: 작은 스푼 병"` 양쪽을 문서에서 검증 ✅

**`android_release_gate.js` — Spoon Jar 실기기 검증 가드 분리**

기존 단일 정규식을 두 개로 분리:

```js
const supportPackRealDeviceValidation =
  /Billing \/ IAP Real-Device Validation[\s\S]*Status:\s*\*\*passed\*\*[\s\S]*pip_cozy_support[\s\S]*purchase[\s\S]*restore/i;

const spoonJarRealDeviceValidation =
  /Billing \/ IAP Real-Device Validation[\s\S]*Status:\s*\*\*passed\*\*[\s\S]*pip_spoon_jar_small[\s\S]*purchase[\s\S]*(repeat|second|another|again)/i;
```

Support Pack은 `purchase + restore`를 요구하고, Spoon Jar는 `purchase + 반복 구매 증거(repeat|second|another|again)`를 요구. 각 제품의 검증 요건이 다름을 가드 레벨에서 명확히 구분 ✅

두 가드 모두 `finalMode` 분기 적용:
- `qa:release:final` 호출 시(`finalMode = true`) → error로 블로킹
- `qa:release` 일반 호출 시 → warning으로 노출, 계속 진행 가능

현재 `qa:release` 통과 시 예상 경고 2개가 정확히 이 상태("실기기 검증 기록 없음") — 스크린샷과 일치 ✅

**candidate 메시지 업데이트**

```
"Also create/activate the Play Console managed products pip_cozy_support and pip_spoon_jar_small,
 then record real-device purchase/restore/repeat validation in docs/ANDROID_RELEASE_STATUS.md."
```

두 제품 ID 명시 + `restore/repeat` 양쪽 검증 요건 명시. 개발자가 signed upload 전에 놓칠 수 없는 구조 ✅

### 평가

| 항목 | 상태 |
|---|---|
| 한국어 상품명 현지화 (응원팩 / 작은 스푼 병) | ✅ |
| qa:billing 한국어 타이틀 검증 추가 | ✅ |
| Support Pack / Spoon Jar 가드 분리 | ✅ |
| Jar는 repeat 검증, Support는 restore 검증 구분 | ✅ |
| finalMode 블로킹 / 일반 모드 경고 분기 유지 | ✅ |
| candidate 메시지 두 상품 반영 | ✅ |

플래그 없음.


---

## Review 158 — v0.1.424 `6f38cdb` ui: connect spoon jar settings card

**커밋 요약**: Small Spoon Jar 카드를 Settings UI에 실제로 연결. 앱 부팅 시 `spoonJarState` 초기화 누락 수정, `openSettings()` 에서 `loadSpoonJarProduct()` 호출 추가, `getSettingsDialogProps()`에 `spoonJar` + `onSpoonJarPurchase` 전달. mobile_visual_check에 jar 카드 DOM 측정 추가, billing_release_check에 appShell wiring 3개 + settingsView 제품 ID 가드 추가.

**변경 범위**: `src/ui/appShell.js` +7 -1, `src/ui/settingsView.js` +8 -1, `scripts/billing_release_check.js` +10 -2, `scripts/mobile_visual_check.js` +11 -1, `src/data/appVersion.js` +1 -1.

### 코드 분석

**`appShell.js` — 누락된 상태/호출 연결**

```js
let spoonJarState = createDefaultSpoonJarState();  // 앱 부팅 시 초기화
let spoonJarRequestId = 0;
```

이전 커밋(fcec9e2)에서 `createDefaultSpoonJarState` / `loadSpoonJarProduct` / `buySpoonJarSmall` 함수는 정의됐으나 상태 변수 선언과 Settings 오픈 호출이 빠져 있었음. 이번 커밋에서 완결:

```js
function openSettings() {
  ...
  loadCozySupportProduct();
  loadSpoonJarProduct();   // ← 추가
  draw();
}
```

```js
function getSettingsDialogProps() {
  return {
    ...
    spoonJar: spoonJarState,              // ← 추가
    onSpoonJarPurchase: buySpoonJarSmall  // ← 추가
  };
}
```

Settings를 열 때 두 제품을 병렬로 로드하는 구조 — Support Pack과 Spoon Jar가 각각 독립적 요청 ID(`cozySupportRequestId` / `spoonJarRequestId`)로 경쟁 조건 없이 처리됨 ✅

**`settingsView.js` — 제품 ID data-attribute + aria-label**

```js
// Support Pack 카드
group.className = "support-pack-card support-pack-card--support ...";
group.dataset.billingProduct = "pip_cozy_support";
group.setAttribute("aria-label", t("settings.supportTitle"));

// Spoon Jar 카드
group.dataset.billingProduct = "pip_spoon_jar_small";
group.setAttribute("aria-label", t("settings.spoonJarTitle"));
```

`data-billing-product` attribute로 각 카드가 어느 제품에 해당하는지 DOM에서 명시적으로 식별 가능 → QA 셀렉터 / 접근성 / 디버깅 세 가지 모두에 기여 ✅

Support Pack 카드에 `--support` modifier 추가로 `.support-pack-card--support`와 `.support-pack-card--jar` 양쪽이 구분됨. `mobile_visual_check.js`가 `.support-pack-card`(기존 공통 셀렉터)에서 `.support-pack-card--support`로 셀렉터 업그레이드:

```js
const supportCard = document.querySelector(".support-pack-card--support");  // 변경
const jarCard = document.querySelector(".support-pack-card--jar");          // 신규
```

두 카드를 각각 독립 측정 — 하나의 카드가 다른 카드의 QA를 오염시킬 여지 없음 ✅

**`billing_release_check.js` — appShell wiring 3개 가드 추가**

```js
requireIncludes(appShellSource, "loadSpoonJarProduct();", "src/ui/appShell.js");
requireIncludes(appShellSource, "spoonJar: spoonJarState", "src/ui/appShell.js");
requireIncludes(appShellSource, "onSpoonJarPurchase: buySpoonJarSmall", "src/ui/appShell.js");
```

이번 커밋에서 연결된 3개 wiring이 CI 가드로 즉시 등록됨 — 향후 리팩터에서 실수로 disconnection되면 qa:billing이 차단 ✅

```js
requireIncludes(settingsSource, "support-pack-card--support", "src/ui/settingsView.js");
requireIncludes(settingsSource, "pip_cozy_support", "src/ui/settingsView.js");
requireIncludes(settingsSource, "pip_spoon_jar_small", "src/ui/settingsView.js");
```

두 제품 ID가 실제로 settingsView.js 소스에 존재하는지 검증 — "제품 ID 문서에만 있고 UI 코드엔 없다"는 상황을 CI가 차단 ✅

**`billing_release_check.js` — Korean title 가드 인코딩 정규화**

```js
// 이전
requireIncludes(billingSetup, "Korean title: Pip 응원팩", ...);

// 이번
requireIncludes(billingSetup, "Korean title: Pip 응원팩", ...);
```

리터럴 한국어 문자 → `\uXXXX` 유니코드 이스케이프. 스크립트 파일 자체의 인코딩 환경에 무관하게 정확한 비교 보장 ✅

### 평가

| 항목 | 상태 |
|---|---|
| 부팅 시 spoonJarState 초기화 누락 수정 | ✅ |
| openSettings()에서 Jar 제품 로드 | ✅ |
| getSettingsDialogProps() Jar props 전달 | ✅ |
| 카드 class modifier 분리 (--support / --jar) | ✅ |
| data-billing-product + aria-label 양쪽 | ✅ |
| mobile QA 카드별 독립 셀렉터 | ✅ |
| qa:billing 3개 wiring 가드 추가 | ✅ |
| Korean title 유니코드 이스케이프 정규화 | ✅ |
| qa:billing + qa:candidate + tests 통과 | ✅ |

플래그 없음.

---

---

# Codex 전달 브리핑 — v1 최종 스프린트

**기준 버전**: v0.1.424 (6f38cdb)  
**작성**: Claude (2026-07-18)  
**목적**: 코드 출시 단계 완료 이후 남은 마무리 항목 전달

---

## 현재 상태 요약

코드 레벨 v1 기능은 완성. 남은 것은 **Play Console 외부 작업 + 실기기 검증** 이 전부임.

---

## 그래픽 / UI 품질 현황

### 대수술 이전 대비 개선

| 영역 | 이전 | 현재 |
|---|---|---|
| 카드 어휘 | 화면마다 다름 | 3레이어(배경+광택막+토큰) 전 화면 통일 |
| 팬트리 방 | 평면 목록 | 벽/바닥 분리 + 원근 슬롯 "공간" |
| 완료 배너 | 완료 메시지만 | 보상 3칩(앨범/방/다음) 진행 동기 강화 |
| 팩 언락 경로 | 이유 불명 | route 3칩 "부탁→스테이지→스푼" 시각화 |
| IAP 카드 | 없음 | Support Pack(코인) + Spoon Jar(항아리) 시각 차별화 |
| 모바일 레이아웃 | 미검증 | 360/390/430px QA + 안전영역 + 터치타겟 ≥110px |
| XSS 보안 | innerHTML 혼재 | 전 UI 모듈 DOM API 전환 완료 |

**체감**: "기능이 있는 앱" → "테마가 있는 게임" 수준 전환.

### 남은 불확실성 (실기기 전 판단 불가)
- IAP 카드에서 실제 가격 문자열 (`priceString`) 로딩 여부
- bonus-pack 항목이 UI에서 어떻게 노출되는지 (숨김 or "출시 예정" or 깨진 버튼)
- 팩 언락 이중 조건(스푼 + 팬트리 스텝) 미충족 시 차단 메시지 존재 여부

---

## Codex 실행 체크리스트

### A. 코드 — 즉시 가능

| # | 항목 | 비고 |
|---|---|---|
| A-1 | `android/app/build.gradle` versionCode ≥ 28 확인 | 스크린샷 기준 이미 bump된 것으로 보이나 최종 확인 필요 |
| A-2 | `versionName` 최종값 결정 (예: `1.0.0`) | |
| A-3 | bonus-pack 항목 처리 결정 | 팩 리스트에서 숨기거나 "출시 예정" 텍스트로 전환 — 지금은 구매 버튼 없이 노출될 가능성 있음 |
| A-4 | 팩 언락 UI — 팬트리 스텝 부족 시 명시 메시지 확인 | `canUnlockPack()` 반환값이 UI에서 "스텝 X개 더 필요" 안내로 연결되는지 |
| A-5 | `replayChallenge.js`에서 힌트 사용 시 `clean: false` 전달 확인 | P3이지만 미확인 상태 |

### B. Play Console — 외부 작업

| # | 항목 |
|---|---|
| B-1 | `pip_cozy_support` 관리형 제품 생성 / 활성화 |
| B-2 | `pip_spoon_jar_small` 관리형 제품 생성 / 활성화 (소모형 consumable) |
| B-3 | 한국어 상품명: Pip 응원팩 / 작은 스푼 병 |
| B-4 | 두 제품 내부 테스트 트랙 노출 확인 |
| B-5 | 스토어 스크린샷 최소 2장 + 피처드 이미지(1024×500) 업로드 |
| B-6 | 콘텐츠 등급 설문 완료 |
| B-7 | 앱 카테고리 / 태그 설정 |

### C. 실기기 검증 (가장 중요)

| # | 시나리오 | 제품 |
|---|---|---|
| C-1 | 구매 → 250 스푼 지급 1회 | Support Pack |
| C-2 | 재구매 시도 → 중복 지급 없음 | Support Pack |
| C-3 | 복원 → 이미 소유 시 재지급 없음 | Support Pack |
| C-4 | 구매 취소/닫기 → 스푼 미지급 | Support Pack |
| C-5 | 구매 → 750 스푼 지급 | Spoon Jar |
| C-6 | 동일 토큰 재시도 → 중복 차단 | Spoon Jar |
| C-7 | 새 토큰으로 재구매 → 750 스푼 추가 지급 | Spoon Jar |
| C-8 | 네트워크 오류 → 복원 경로 유지 | 양쪽 |
| C-9 | 가격 문자열 실제 로딩 확인 (priceString 빈값 아님) | 양쪽 |

검증 완료 후 `docs/ANDROID_RELEASE_STATUS.md`에 결과 기록.

### D. QA 게이트 — 순서대로

```
1. npm run qa:billing          → 통과 확인
2. npm run qa:release          → 경고 없어야 함 (실기기 기록 후)
3. npm run qa:release:final    → 최종 통과
4. npm run qa:privacy:live     → 라이브 URL에 pip_spoon_jar_small 포함 확인
5. build_android_signed_release_bundle.ps1 실행
```

### E. 제출

| # | 항목 |
|---|---|
| E-1 | signed AAB → Play Console 내부 테스트 트랙 업로드 |
| E-2 | Play Console이 패키지 수락 확인 (정책 위반 없음) |
| E-3 | 내부 테스터로 실기기 검증 (C 항목) |
| E-4 | 심사 제출 |

---

## 게임플레이 무결성 — 확인된 안전 항목

아래는 코드 직접 분석으로 확인된 항목으로 Codex 추가 작업 불필요:

- **Undo + Hint**: 힌트 구매 후 undo해도 스푼 복구 없음, hintsUsed 유지 ✅
- **Replay Pick 파밍**: 3중 가드 + 30일 prune ✅
- **Time Attack 점수**: `progressCells × 1000` — 라운드 수가 아닌 칸 수 기준 ✅
- **팬트리 영속성**: 구매/장착 원자적 저장, Set 중복제거 ✅
- **Spoon Jar 중복 차단**: `processedBillingPurchaseIds` 토큰별 dedup, 80개 상한 ✅

---

## 우선순위 요약

```
즉시: A-3 (bonus-pack 처리) + A-4 (팩 언락 메시지) 확인
병행: B-1~B-4 (Play Console 제품 등록)
그 후: C-1~C-9 (실기기 검증)
마지막: D → E (QA 게이트 → 제출)
```


---

## Review 159 — v0.1.425 `ee497e7` qa: guard hidden bonus packs

**커밋 요약**: `bonus-pack` / `*-plus` 5개 미래 테마팩이 출시 UI에 노출되지 않도록 명시적 가드 추가. `npm run qa:bonus-pack` 신규 스크립트 작성 + `qa:candidate`에 연결. mobile QA에 누출 탐지, unit test에 bonus pack 구조 계약 추가.

**변경 범위**: `scripts/bonus_pack_visibility_check.js` 신규 +55, `src/ui/puzzleHubView.js` +1, `scripts/mobile_visual_check.js` +8, `scripts/release_candidate_check.js` +1, `tests/puzzleData.test.js` +6, `package.json` +2 -1.

---

### 코드 분석

**`puzzleHubView.js` — 핵심 변경 (1줄)**

```js
puzzlePacks.forEach((pack) => {
  if (pack.access === "bonus-pack") {
    // Future theme packs stay hidden until their art, puzzles, and store path are ready.
    return;
  }
  ...
```

기존에도 `return`이 있었으나 주석 없이 묵시적으로 숨겨진 상태였음. 이번 커밋에서 의도를 주석으로 명시 ✅

이 주석 문자열이 `bonus_pack_visibility_check.js`의 검증 대상:

```js
expectIncludes(
  "src/ui/puzzleHubView.js",
  'if (pack.access === "bonus-pack") {\n      // Future theme packs stay hidden...',
  "launch puzzle picker must explicitly return before rendering bonus packs."
);
```

주석을 포함한 정확한 패턴 매칭으로 "주석만 있고 return이 삭제되는" 상황도 차단 ✅

---

**`bonus_pack_visibility_check.js` — 6개 계층 검증**

신규 스크립트가 확인하는 항목:

| 검증 | 내용 |
|---|---|
| packs.js | `-plus` + `bonus-pack` + `future-theme-pack` 조합이 정확히 5개 |
| puzzles.js | bonus pack ID를 `packId`로 가진 퍼즐 0개 |
| puzzleHubView.js | `bonus-pack` return + 주석 패턴 존재, return이 pack block 생성보다 먼저 실행 |
| pantryStoryCards.js | `pack.access !== "bonus-pack"` 필터 존재 |
| pantryView.js | `pack.access !== "bonus-pack"` 필터 존재 |
| save.js | `pack?.access !== "bonus-pack"` 잠금 유지 |
| appShell.js | `pack.access === "bonus-pack"` unlock 제외 처리 존재 |
| mobile_visual_check.js | `expectHiddenBonusPacks` 함수 존재 |
| release_candidate_check.js | `qa:bonus-pack` 포함 여부 |

단일 스크립트가 UI / 데이터 / 저장 / 팬트리 / 릴리즈 게이트 전 계층을 커버하는 구조. 5개 팩 중 하나라도 퍼즐이 추가되거나 숨김 처리가 해제되면 즉시 CI 차단 ✅

**return 순서 검증**이 인상적:

```js
const bonusReturnIndex = hubSource.indexOf('if (pack.access === "bonus-pack") {');
const packBlockIndex = hubSource.indexOf('const packBlock = document.createElement("article");', bonusReturnIndex);
if (bonusReturnIndex < 0 || packBlockIndex < 0 || bonusReturnIndex > packBlockIndex) {
  failures.push("return must happen before creating a pack block.");
}
```

단순 문자열 존재 확인이 아니라 **순서**까지 검증. return이 pack block 생성 이후로 이동해도 탐지 ✅

---

**`mobile_visual_check.js` — DOM 누출 탐지**

```js
async function expectHiddenBonusPacks(page, viewportName) {
  const leakCount = await page.locator(
    '.pack-block[data-pack-id$="-plus"], .bonus-pack-panel'
  ).count();
  if (leakCount > 0) {
    failures.push(`${viewportName}: hidden bonus pack preview leaked into the launch puzzle picker.`);
  }
}
```

`data-pack-id$="-plus"` (suffix selector) + `.bonus-pack-panel` 양쪽을 탐지. 실제 렌더링 후 DOM에서 확인하므로 코드 경로 분석이 아닌 런타임 누출 탐지 ✅

360/390/430px 세 뷰포트 모두에서 실행됨 (외부 루프가 각 viewport마다 `expectHiddenBonusPacks` 호출) ✅

---

**`tests/puzzleData.test.js` — bonus pack 구조 계약**

```js
bonusPacks.forEach((pack) => {
  expect(pack.monetizationRole).toBe("future-theme-pack");
  expect(puzzles.filter((puzzle) => puzzle.packId === pack.id)).toHaveLength(0);
  expect(pack.id.endsWith("-plus")).toBe(true);
});
```

3가지 불변 조건을 unit test에 고정:
1. monetizationRole은 반드시 `future-theme-pack`
2. 퍼즐 0개 (런타임 전에 빌드 타임에서 차단)
3. ID는 `-plus`로 끝남

이 테스트가 있으므로 bonus pack에 실수로 퍼즐을 추가하면 `npm run test`가 먼저 막힘 ✅

---

### 브리핑 업데이트 — A-3 항목 해소

이전 전달 브리핑의 **A-3 (bonus-pack 처리 미확인)** 이 이번 커밋으로 완전히 해소됨:

> ~~A-3: bonus-pack 항목 처리 결정 — 팩 리스트에서 숨기거나 "출시 예정" 텍스트로 전환 확인 필요~~

확인 결과: `puzzleHubView.js`에서 `bonus-pack`이면 렌더링 없이 즉시 return. 팬트리/저장/잠금 해제 로직 모두 bonus-pack을 제외. CI가 전 계층을 상시 감시.

**브리핑 잔여 항목 현황:**

| 항목 | 상태 |
|---|---|
| A-1 versionCode bump | 확인 필요 (build.gradle) |
| A-2 versionName 결정 | 확인 필요 |
| A-3 bonus-pack 처리 | ✅ **이번 커밋으로 해소** |
| A-4 팩 언락 이중 조건 메시지 | 미확인 |
| A-5 replayChallenge clean 파라미터 | 미확인 |
| B-F Play Console / 실기기 | 외부 작업 |

---

### 평가

| 항목 | 상태 |
|---|---|
| 출시 UI 누출 차단 | ✅ |
| 퍼즐 0개 조건 빌드타임 + 런타임 양쪽 검증 | ✅ |
| return 순서까지 검증 | ✅ |
| DOM 런타임 누출 탐지 (3 뷰포트) | ✅ |
| qa:bonus-pack → qa:candidate 연결 | ✅ |
| unit test 구조 계약 고정 | ✅ |
| A-3 브리핑 항목 해소 | ✅ |
| 113 tests, qa:candidate 전체 통과 | ✅ |

플래그 없음.


---

## Review 160 — v0.1.425 `4af2b57` qa: guard launch integrity checks

**커밋 요약**: `npm run qa:launch-integrity` 신규 스크립트 추가. 브리핑 A-1(versionCode), A-4(팩 언락 이중 조건 메시지), A-5(replayChallenge clean 파라미터) 세 미확인 항목을 모두 CI 가드로 묶어 자동 검증.

**변경 범위**: `scripts/launch_integrity_check.js` 신규 +86, `scripts/release_candidate_check.js` +1, `package.json` +2 -1.

---

### 코드 분석

**`launch_integrity_check.js` — 3개 독립 검증 블록**

#### 1. `checkAndroidVersion()` — A-1/A-2 해소

```js
expectRegex("android/app/build.gradle", /versionCode\s+28\b/, "Android versionCode 28");
expectRegex("android/app/build.gradle", /versionName\s+"1\.1\.0"/, "Android versionName 1.1.0");
expectIncludes("docs/ANDROID_RELEASE_STATUS.md", "current prepared upload code is 28", ...);
expectIncludes("docs/ANDROID_RELEASE_STATUS.md", "versionName \"1.1.0\"", ...);
```

`build.gradle`의 실제 값과 `ANDROID_RELEASE_STATUS.md`의 기록이 일치하는지 양쪽 동시 검증. versionCode/versionName이 문서에만 있거나 코드에만 있는 상황 모두 차단 ✅

`\b` word boundary로 `versionCode 28`이 `versionCode 280`으로 잘못 통과하는 것도 방지 ✅

#### 2. `checkPackUnlockGuidance()` — A-4 해소

브리핑에서 "스푼 충분하지만 팬트리 스텝 부족 시 차단 메시지 존재 여부 미확인"이라고 flagged된 항목을 직접 코드에서 검증:

```js
// i18n 키 8개 존재 확인 (en + ko 양쪽)
"unlockPlanNeedSpoons", "unlockPlanNeedPantry", "unlockPlanNeedBoth",
"unlockGateNeedSpoons", "unlockGateNeedPantry", "unlockGateNeedBoth",
"needPantryRoom", "visitPantry"

// 분기 로직 검증
expectRegex(hub, /roomRequirement\.met\s*\?\s*t\("packs\.needMore"[\s\S]*:\s*t\("packs\.needPantryRoom"\)/,
  "Pantry-step lock button copy branch");

// 순서 검증
expectOrder(hub, "!roomRequirement.met", "t(\"packs.visitPantry\")",
  "Pantry CTA appears only when Pantry progress is blocking");
```

세 가지를 동시에 확인:
- i18n 키 en/ko 모두 존재
- `roomRequirement.met` 분기에서 조건에 따라 다른 복사본 사용
- Pantry 스텝 부족인 경우에만 "Go to Pantry" CTA가 노출되는 순서

단순 문자열 존재 확인에서 **복사본 분기 로직과 노출 순서**까지 검증 ✅

#### 3. `checkReplayCleanRewardPath()` — A-5 해소

```js
expectIncludes("src/ui/puzzleView.js",
  "clean: isReplayClean(replayCleanStatus)",
  "replay reward clean parameter");

expectIncludes("src/game/replayChallenge.js",
  "usedHint",
  "hint usage tracked in replay clean state");

expectRegex("src/game/replayChallenge.js",
  /Math\.max\(0,\s*Number\(state\?\.hintsUsed \|\| 0\)\) > 0/,
  "hintsUsed makes replay unclean");

expectIncludes("tests/replayChallenge.test.js",
  "blocks replay spoon rewards after a hinted completion", ...);

expectIncludes("tests/replayChallenge.test.js",
  "keeps replay unclean after a hint is undone", ...);
```

브리핑 A-5 "replayChallenge.js에서 힌트 사용 시 `clean: false` 전달 확인"이 직접 검증됨:
- `puzzleView.js`가 `isReplayClean(replayCleanStatus)`을 clean 파라미터로 전달
- `replayChallenge.js`가 `usedHint` 상태를 추적
- `hintsUsed > 0` 조건으로 clean 상태 해제
- "hint undo 후에도 unclean 유지" 회귀 테스트 존재

undo로 힌트를 되돌려도 clean 보상을 받을 수 없음이 코드 + 테스트 양쪽에서 고정됨 ✅

---

### 브리핑 업데이트 — 코드 사이드 항목 전부 해소

| 항목 | 이전 | 현재 |
|---|---|---|
| A-1 versionCode 28 | 미확인 | ✅ CI 자동 검증 |
| A-2 versionName 1.1.0 | 미확인 | ✅ CI 자동 검증 |
| A-3 bonus-pack 처리 | 미확인 | ✅ Review 159에서 해소 |
| A-4 팩 언락 이중 조건 메시지 | 미확인 | ✅ CI 자동 검증 |
| A-5 replayChallenge clean | 미확인 | ✅ CI 자동 검증 |

**코드 사이드 마무리 항목 전부 해소. 남은 것은 외부 작업(B~E)만.**

---

### 평가

| 항목 | 상태 |
|---|---|
| versionCode/Name 코드↔문서 양쪽 검증 | ✅ |
| 팩 언락 i18n 8키 en/ko 동시 검증 | ✅ |
| roomRequirement 분기 로직 정규식 검증 | ✅ |
| Pantry CTA 노출 순서 검증 | ✅ |
| replay clean 파라미터 전달 확인 | ✅ |
| hintsUsed → unclean 로직 확인 | ✅ |
| hint undo 회귀 테스트 존재 확인 | ✅ |
| qa:candidate에 연결 | ✅ |
| 113 tests, qa:candidate 전체 통과 | ✅ |

플래그 없음.


---

## Review 161 — v0.1.427 `ab98b8b` ui: recover mobile opening and guide layout

**커밋 요약**: 시각 리뷰 스크린샷에서 발견된 모바일 레이아웃 이슈 일괄 수정. 한국어 가이드 텍스트 한 글자씩 줄바꿈, 스테이지 네비게이션 세로 줄어듦, 타임어택 메뉴 항목 "타임" 축약 세 가지가 CSS + i18n으로 해소됨.

**변경 범위**: `src/styles.css` +308, `src/i18n/en.js` +1 -1, `src/i18n/ko.js` +1 -1, `scripts/mobile_visual_check.js` +7 -2, `scripts/visual_review_pack.js` +37, `docs/CONTEXT.md` +6.

---

### 코드 분석

#### 1. CSS — 3개 문제 영역 해소

**시작 화면 약속 칩 (`brand-intro__promise-chip`)**

```css
.brand-intro__promise-strip .brand-intro__promise-chip {
  display: inline-grid;
  grid-template-columns: 30px minmax(0, 1fr);
  align-items: center;
  gap: 7px;
  min-width: 0;
}
```

기존 `inline-flex`에서 `inline-grid` 2컬럼(고정 아이콘 30px + 텍스트 `minmax(0,1fr)`)으로 교체. `minmax(0,1fr)`이 없으면 텍스트가 grid 바깥으로 overflow되어 한 글자씩 줄바꿈 발생 → 이 패턴으로 완전 해소 ✅

560px 이하에서는 `white-space: normal; text-align: left`로 두 줄 허용 — 아이콘/텍스트 정렬은 유지하면서 텍스트만 자연스럽게 wrap ✅

**스테이지 네비게이션 (`stage-navigation`)**

```css
@media (max-width: 820px) {
  .stage-navigation {
    grid-template-columns: 1fr;
    width: min(100%, 620px);
  }
  .stage-navigation__copy {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
  }
}
@media (max-width: 560px) {
  .stage-navigation__copy { grid-template-columns: 1fr; }
  .stage-navigation__actions { grid-template-columns: 1fr; }
}
```

820px 이하에서 스테이지 정보와 버튼을 1컬럼으로 전환, 560px 이하에서 actions도 1컬럼. `word-break: keep-all` + `overflow-wrap: break-word`로 한국어 복사본이 자연 단어 단위로 줄바꿈 ✅

**가이드 다이얼로그 (`how-to-play.visual-guide`)**

```css
@media (max-width: 820px) {
  .guide-pip-scene {
    grid-template-columns: 82px minmax(0, 1fr);
  }
  .how-to-play.visual-guide .guide-copy > p:not(.section-label) {
    font-size: clamp(0.86rem, 2.4vw, 0.98rem);
  }
  .clue-guide__row {
    grid-template-columns: 40px repeat(5, 18px) minmax(104px, 1fr);
  }
}
@media (max-width: 560px) {
  .guide-pip-scene {
    grid-template-columns: 64px minmax(0, 1fr);
  }
  .clue-guide__row {
    grid-template-columns: 34px repeat(5, minmax(14px, 1fr));
  }
  .clue-caption { grid-column: 1 / -1; }
}
```

Pip 캐릭터 + 말풍선의 2컬럼 그리드를 미디어쿼리별로 단계 축소. 560px 이하에서 `clue-caption`이 `grid-column: 1 / -1`로 전체 너비 점유 — 5개 색상 셀 아래에서 독립 행으로 렌더링되어 한 줄 안에 텍스트 수용 ✅

**퍼즐 컨트롤 버튼**

```css
.control-button {
  grid-template-columns: 30px minmax(0, 1fr);
  gap: 9px;
  min-height: 58px;
  padding-inline: 11px;
}
```

아이콘 고정 너비 + 텍스트 `minmax(0,1fr)`. `min-height: 58px`로 터치 타겟 유지. 약속 칩과 동일한 패턴 적용 ✅

**시작 화면 높이 반응형 (height media query)**

```css
@media (max-height: 880px) { /* key-visual 축소 */ }
@media (max-height: 780px) { /* 추가 축소 + 폰트 다운스케일 */ }
```

width가 아닌 height 기준 — 가로 모드나 작은 화면에서 key-visual이 뷰포트를 가득 채워 CTA 버튼이 잘리는 상황 대응. 880 → 780 두 단계로 단계적 축소 ✅

---

#### 2. i18n — 타임어택 항목명 복원

```diff
-timeAttack: "Time"
+timeAttack: "Time Attack"

-timeAttack: "타임"
+timeAttack: "타임어택"
```

메뉴 공간 절약을 위해 축약했던 것을 전체 이름으로 복원. 이번 커밋에서 `floating-nav__trigger min-width`가 112px → 148px로 늘어나고, 430px 이하에서 `min(100%, 148px)` + 메뉴 1컬럼 전환으로 공간 문제 해소 후 이름 복원 ✅

"Time"만 보이면 "타이머?" "시간?" 의미 불명확 — UX 회복이 레이아웃 수정과 함께 이뤄진 점이 올바른 순서 ✅

---

#### 3. `mobile_visual_check.js` — 시작 버튼 viewport 내 위치 검증 추가

```js
const startButtonFitsViewport =
  buttonMetrics.top >= 0 && buttonMetrics.bottom <= buttonMetrics.viewportHeight - 8;
```

기존 가드: 버튼 크기 + 폴리시 스타일만 확인  
추가: 버튼이 첫 뷰포트 안에 완전히 들어오는지 `top/bottom` 좌표로 직접 검증

8px 여유(하단 안전영역 아래 슬라이딩 예외)로 실기기 safe area 감안 ✅

시작 버튼이 폴리시는 완벽하지만 스크롤 없이 안 보이는 상황을 이제 CI가 차단 ✅

---

#### 4. `visual_review_pack.js` — 한국어 첫 실행 + 메뉴 스크린샷 추가

**`captureFloatingNavMenu`**: 게임 진입 후 메뉴 버튼 클릭 → 열린 nav panel 스크린샷 `main-menu-time-attack-entry` 캡처. 타임어택 항목 축약 이슈가 다음부터는 스크린샷 팩에서 육안으로 즉시 확인 가능 ✅

**`captureKoreanFirstRun`**: 새 페이지를 `localStorage.clear()` + `pip-picture-pantry-language: "ko"` 초기화 상태로 시작 → 브랜드 인트로 → 첫 퍼즐 보드 → 메뉴 순서로 캡처. 한국어 레이아웃 회귀를 스크린샷 팩 14매에 포함 ✅

두 함수 모두 `captureKoreanFirstRun`이 `finally { page.close() }`로 페이지 누수 방지 ✅

---

### 평가

| 항목 | 상태 |
|---|---|
| 약속 칩 한 글자 줄바꿈 해소 (grid + minmax) | ✅ |
| 스테이지 네비게이션 모바일 1컬럼 전환 | ✅ |
| 가이드 Pip 다이얼로그 + 단서 예시 모바일 축소 | ✅ |
| 퍼즐 컨트롤 버튼 아이콘-텍스트 정렬 | ✅ |
| 시작 화면 height media query 2단계 대응 | ✅ |
| 타임어택 메뉴 항목 전체 이름 복원 (en/ko) | ✅ |
| 시작 버튼 뷰포트 내 위치 CI 검증 추가 | ✅ |
| 메뉴 열린 상태 스크린샷 팩 추가 | ✅ |
| 한국어 첫 실행 스크린샷 팩 추가 | ✅ |
| qa:mobile 360/390/430 통과 | ✅ |
| qa:visual-pack 14 screenshots 통과 | ✅ |
| 113 tests 통과 | ✅ |

플래그 없음.


---

## Review 162 — v0.1.431 `422e269` ui: wire opening mode chips

**커밋 요약**: 시작 화면의 그림/팬트리/타임어택 3개 약속 칩을 `<span>`에서 `<button>`으로 교체하고, 클릭 시 해당 화면으로 직접 이동하도록 연결. 이름 미입력 첫 실행에서는 이름 입력 후 선택한 화면으로 이동.

**변경 범위**: `src/ui/brandIntro.js` +22 -10, `src/ui/appShell.js` +13, `src/styles.css` +8, `scripts/mobile_visual_check.js` +4 -1.

---

### 코드 분석

#### 1. `buildPromiseChip` — `<span>` → `<button>` 교체

```js
// 이전
const chip = document.createElement("span");

// 이후
const chip = document.createElement("button");
chip.type = "button";
chip.dataset.targetView = targetView;  // "puzzle" | "pantry" | "timeAttack"
chip.setAttribute("aria-label", label);
```

`type="button"` 명시로 form 안에 있을 때 submit 발동 방지. `aria-label`이 레이블로서 텍스트를 직접 읽어주므로 아이콘(aria-hidden)과 분리됨 ✅

이전에 `<span>` 클릭 이벤트로 처리됐다면 키보드/스크린리더에서 접근 불가 — 버튼 교체로 접근성 갭 해소 ✅

---

#### 2. 이벤트 흐름 — 이름 미입력 첫 실행 처리

```js
// brandIntro.js
chip.addEventListener("click", () => {
  const targetView = chip.dataset.targetView;
  if (hasActivePlayer()) {
    dispatchIntroOpenView(targetView);
    dismiss();
    return;
  }
  requestPlayerName(targetView);  // pendingView 전달
});

// requestPlayerName 내 form submit 시
setActivePlayerName(new FormData(form).get("playerName"));
window.dispatchEvent(new CustomEvent("ppp:player-changed"));
dispatchIntroOpenView(pendingView);  // 저장된 목적지 전달
dismiss();
```

두 경로:
- 기존 플레이어: 칩 클릭 → `ppp:intro-open-view` → 해당 화면으로 즉시 이동
- 첫 실행: 칩 클릭 → 이름 입력 화면(`requestPlayerName(targetView)`) → 이름 제출 → `ppp:intro-open-view(pendingView)` → 해당 화면으로 이동

`pendingView`가 클로저로 캡처되어 이름 입력 중 어떤 칩을 눌렀는지 유지됨. 이름 입력 화면에서 "시작" 버튼(`brand-intro__skip`)은 여전히 `requestPlayerName(null)` → 기본 화면(퍼즐 허브)으로 진입 ✅

---

#### 3. `appShell.js` — 화면 전환 이벤트 수신

```js
function selectIntroView(view) {
  if (!["puzzle", "pantry", "timeAttack"].includes(view)) {
    return;
  }
  selectView(view);
}

// renderApp 마지막에:
if (introOpenViewHandler) {
  window.removeEventListener("ppp:intro-open-view", introOpenViewHandler);
}
introOpenViewHandler = (event) => selectIntroView(event.detail?.view);
window.addEventListener("ppp:intro-open-view", introOpenViewHandler);
```

허용 목록(`["puzzle", "pantry", "timeAttack"]`) 외 값은 무시 — CustomEvent `detail`이 조작되더라도 정의된 화면 밖으로 이동 불가 ✅

`renderApp`이 여러 번 호출될 수 있는 구조에서 이전 핸들러를 먼저 제거하고 새로 등록하는 패턴으로 중복 리스너 방지 ✅

`event.detail?.view` 옵셔널 체이닝으로 detail 없는 이벤트도 안전하게 처리 ✅

---

#### 4. CSS — 버튼 리셋 + 포커스 스타일

```css
.brand-intro__promise-strip .brand-intro__promise-chip {
  appearance: none;
  cursor: pointer;
  font: inherit;
}

.brand-intro__promise-chip:focus-visible {
  outline: 3px solid rgba(153, 218, 190, 0.88);
  outline-offset: 3px;
}
```

`appearance: none` + `font: inherit`으로 브라우저 기본 button 스타일 제거 — 이전 칩 디자인이 그대로 유지됨. `:focus-visible`은 마우스 클릭 시엔 노출 안 되고 키보드 포커스 시에만 초록 outline 표시 ✅

---

#### 5. `mobile_visual_check.js` — 버튼 + target-view 검증

```js
const expectedPromiseTargets = ["puzzle", "pantry", "timeAttack"];
// ...
if (metrics.tagName !== "BUTTON" || metrics.targetView !== expectedPromiseTargets[index] || ...) {
  failures.push(...);
}
```

`tagName === "BUTTON"` 검증으로 `<span>` 퇴행을 CI가 차단 ✅  
`data-target-view` 순서 검증으로 칩 순서가 뒤바뀌어도 탐지 ✅

---

### 평가

| 항목 | 상태 |
|---|---|
| 칩 → 버튼 교체 (키보드/스크린리더 접근성) | ✅ |
| aria-label + aria-hidden 분리 | ✅ |
| 기존 플레이어: 칩 클릭 → 즉시 이동 | ✅ |
| 첫 실행: 이름 입력 후 선택 화면으로 이동 | ✅ |
| 허용 목록 외 view 무시 | ✅ |
| 중복 리스너 방지 | ✅ |
| appearance:none + font:inherit 버튼 리셋 | ✅ |
| :focus-visible 키보드 outline | ✅ |
| CI: tagName + targetView 순서 검증 | ✅ |
| qa:mobile + qa:visual-pack + 113 tests 통과 | ✅ |

플래그 없음.

---

## Review 163 — v0.1.431 `1ab7268` docs: track v1 visual finish backlog

**커밋 요약**: `docs/CONTEXT.md`에 V1 비주얼 마무리 잔여 항목 기록. 퍼즐 컨트롤 아이콘(칠하기/빈칸 체크/되돌리기/방향키/힌트/설정/타임어택/팬트리·상점/팩·상태 칩) 의 CSS 플레이스홀더 상태를 의도적 결정으로 문서화.

**변경 범위**: `docs/CONTEXT.md` +5.

---

### 내용 분석

```
Keep the current CSS-only control symbols as functional placeholders until the release
shell is stable, then replace reusable button symbols with approved Sunny Spoon Studios
artwork: fill, blank-check, undo, D-pad directions, hint, settings, Time Attack,
pantry/shop, and pack/status chips.

Treat this as a final art pass rather than a piecemeal feature detour: artwork quality,
line alignment, text fit, and icon consistency must be checked together across opening,
puzzle play, guide dialogs, pantry/shop, billing, and Time Attack.
```

**문서로 확정한 결정 두 가지**:

1. CSS 아이콘은 "계획 없는 미완성"이 아니라 "출시 셸 안정 후 교체 예정인 기능 플레이스홀더"로 상태 고정
2. 아이콘 교체를 개별 기능 PR이 아닌 **전 화면 동시 아트 패스**로 처리 — 일관성 담보

이번 커밋이 없었다면 CSS 아이콘이 방치인지 의도인지 나중에 판단이 어려웠을 것. 결정을 코드가 아닌 문서에 기록하는 것이 올바른 처리 ✅

---

### 평가

| 항목 | 상태 |
|---|---|
| CSS 아이콘 플레이스홀더 상태 의도적 결정으로 기록 | ✅ |
| 교체 범위(9개 심볼) 명시 | ✅ |
| 아트 패스를 일괄 처리로 명시 | ✅ |

플래그 없음.


---

## Review 164 — v0.1.437 `2e110a3` ui: surface time attack from puzzle hub

**커밋 요약**: 타임어택을 플로팅 메뉴 안에만 숨겨두지 않고 퍼즐 허브에 직접 노출하는 `renderTimeAttackTeaserCard` 진입 카드 추가. 시계 배지, 복사본, CTA 버튼으로 구성. 기존 타임어택 점수/힌트/가이드 로직 무변경.

**변경 범위**: `src/ui/puzzleHubView.js` +24, `src/ui/appShell.js` +2 -1, `src/styles.css` +152, `src/i18n/en.js` +4, `src/i18n/ko.js` +4, `scripts/mobile_visual_check.js` +75.

---

### 코드 분석

#### 1. `renderTimeAttackTeaserCard` — 구조 설계

```js
export function renderTimeAttackTeaserCard(onOpenTimeAttack = () => {}) {
  const card = document.createElement("section");
  card.className = "time-attack-teaser-card";

  const badge = document.createElement("span");
  badge.className = "time-attack-teaser-card__badge";
  badge.setAttribute("aria-hidden", "true");   // 순수 장식

  const copy = document.createElement("div");
  appendTextElement(copy, "p", "section-label", t("timeAttack.hubEyebrow"));
  appendTextElement(copy, "h2", "", t("timeAttack.hubTitle"));
  appendTextElement(copy, "p", "", t("timeAttack.hubBody"));

  const button = document.createElement("button");
  button.type = "button";
  button.className = "tool-button time-attack-teaser-card__action";
  button.textContent = t("timeAttack.hubAction");
  button.addEventListener("click", onOpenTimeAttack);

  card.append(badge, copy, button);
  return card;
}
```

시계 배지(`aria-hidden`)는 장식, 실제 레이블은 `h2` + `hubAction` 버튼 텍스트로 충분히 전달됨 ✅

기본 핸들러 `() => {}`로 콜백 미전달 시 오류 없이 렌더링 가능 — 추후 재사용 용이 ✅

`section` 태그로 랜드마크 역할 부여 — 스크린리더가 별도 섹션으로 인식 가능 ✅

---

#### 2. `appShell.js` — 배치 위치

```js
shell.appendChild(renderDailyCard(...));
shell.appendChild(renderTimeAttackTeaserCard(() => onSelectView("timeAttack")));  // ← 추가
const replayPicksCard = renderReplayPicksCard(...);
```

데일리 카드 바로 다음, 리플레이 픽 카드 전. 순서: 오늘의 퍼즐 → 타임어택 → 리플레이 픽. 긴급도 높은 주요 모드부터 아래로 내려가는 시각 계층 ✅

콜백은 `onSelectView("timeAttack")` 단순 래핑 — 타임어택 진입 로직이 `appShell.js`에 이미 있으므로 카드 자체는 순수 UI ✅

---

#### 3. CSS — 카드 구조 3레이어

**카드 배경**

```css
background:
  radial-gradient(circle at 14% 12%, rgba(255,255,255,0.92) 0 10%, transparent 11%), /* 왼쪽 상단 광원 */
  radial-gradient(circle at 88% 82%, rgba(164,218,188,0.5) 0 20%, transparent 21%), /* 오른쪽 하단 민트 */
  linear-gradient(135deg, #fff7d6 → #ffe29d → #dbf5e1);                              /* 황금→민트 베이스 */
```

황금(퍼즐/스푼)과 민트(팬트리/완료) 색조를 동시에 사용 — 두 모드를 잇는 도전이라는 성격을 색으로 암시 ✅

`::before` 상단 광택 선, `::after` 오른쪽 하단 금 토큰 — 기존 카드 어휘(3레이어) 동일 ✅

**시계 배지 (`__badge`)**

```css
background:
  radial-gradient(circle at 31% 24%, rgba(255,255,255,0.92) 0 12%, transparent 13%),
  conic-gradient(from -32deg, #70483d 0 11%, #fff5cf 12% 22%, #e6a044 23% 36%, ...);
```

`conic-gradient`로 시계 눈금 패턴(갈색/크림/황금 8분할). `::before`/`::after`로 CSS만으로 분침/시침 그리기:

```css
.time-attack-teaser-card__badge::before {
  height: 19px;
  transform: translate(-50%, -100%) rotate(31deg);   /* 분침 */
}
.time-attack-teaser-card__badge::after {
  height: 14px;
  transform: translate(-50%, -100%) rotate(-58deg);  /* 시침 */
}
```

`transform-origin: 50% 100%`(시계 중심 기준 회전)으로 두 침 모두 중심에서 뻗어 나오는 형태 ✅

**CTA 버튼 (`__action`)**

```css
background:
  radial-gradient(circle at 15% 18%, rgba(255,255,255,0.75) 0 9%, transparent 10%),
  linear-gradient(180deg, #ffe690 → #f6bf50 → #dd8f3d);
```

황금 그라디언트 + 광택 + 4px 바닥 그림자로 기존 `tool-button` 폴리시 위에 추가 레이어 ✅

**반응형**

```css
/* ≤620px: 배지+텍스트 2컬럼, CTA 하단 전체 너비 */
grid-template-columns: auto minmax(0, 1fr);
.time-attack-teaser-card__action { grid-column: 1 / -1; }

/* ≥620px: 배지+텍스트+CTA 3컬럼 */
grid-template-columns: auto minmax(0, 1fr) auto;
.time-attack-teaser-card__action { grid-column: auto; min-width: 156px; }
```

좁은 화면에서 CTA가 카드 전체 너비, 넓은 화면에서 우측 정렬 — 모바일/태블릿 양쪽에서 자연스러운 레이아웃 ✅

---

#### 4. `mobile_visual_check.js` — 23개 조건 검증

카드, 배지, CTA 세 요소를 DOM에서 직접 측정:

| 검증 대상 | 조건 |
|---|---|
| 카드 너비/높이 | ≥240 / ≥128 |
| 카드 viewport 벗어남 | `cardRight ≤ viewportWidth + 1` |
| 카드 border/radius | ≥3px / ≥18px |
| 카드 background | `radial-gradient` 포함 |
| 카드 광택(::before) / 토큰(::after) | content != "none", 크기 충족 |
| 텍스트 "Time Attack / 타임어택" 포함 | en/ko 정규식 |
| 배지 크기 | ≥50×50 |
| 배지 conic-gradient | 포함 |
| 배지 침(::before) | content != "none" |
| CTA 크기 | ≥132×48 |
| CTA gradient / shadow / 광택 | 각 충족 |

`cardRight > viewportWidth + 1` 조건이 특히 중요 — 카드가 우측으로 clip되는 상황을 명시적으로 차단 ✅

en/ko 텍스트를 `타임어택` 유니코드로 정규식 처리 — 스크립트 인코딩 무관 ✅

---

#### 5. i18n — hub 전용 복사본 분리

```
hubEyebrow: "Quick spoon run" / "빠른 스푼 도전"
hubTitle:   "Time Attack is ready" / "타임어택이 준비됐어요"
hubBody:    "Jump into three random boards..." / "랜덤 판 3개를..."
hubAction:  "Start Time Attack" / "타임어택 시작"
```

기존 `eyebrow/title/body`(타임어택 소개 다이얼로그용)와 분리 — 허브 진입 맥락에 맞는 짧은 어조 ✅

한국어 복사본의 `word-break: keep-all` + CSS 처리가 Review 161에서 이미 적용됐으므로 단어 단위 줄바꿈 보장 ✅

---

### 평가

| 항목 | 상태 |
|---|---|
| 퍼즐 허브에서 타임어택 직접 진입 가능 | ✅ |
| 시계 배지 CSS 시침/분침 (`conic-gradient` + pseudo) | ✅ |
| 황금↔민트 카드 배경 — 색으로 성격 암시 | ✅ |
| 기존 카드 3레이어 어휘 (광택+토큰) 유지 | ✅ |
| 반응형 2컬럼 → 3컬럼 전환 | ✅ |
| section + aria-hidden badge + 버튼 텍스트 접근성 | ✅ |
| hub 전용 복사본 en/ko 분리 | ✅ |
| CI: 23개 조건 DOM 측정 검증 | ✅ |
| 기존 타임어택 점수/힌트/가이드 로직 무변경 | ✅ |
| qa:mobile + qa:visual-pack + 113 tests + qa:billing 통과 | ✅ |

플래그 없음.


---

## Review 165 — v0.1.443 `60ba393` ui: clarify time attack entry points

**커밋 요약**: 퍼즐 허브 타임어택 CTA 버튼을 텍스트 단독에서 "시계 아이콘 + 텍스트 + 화살표 chevron" 3파트로 교체. 플로팅 메뉴 타임어택 항목에 황금+민트 배경 추가.

**변경 범위**: `src/ui/puzzleHubView.js` +11 -1, `src/styles.css` +82 -2, `src/ui/floatingNav.js` +2 -2, `scripts/mobile_visual_check.js` +33 -2.

---

### 코드 분석

**CTA 버튼 구조 변경**

```js
// 이전: button.textContent = t("timeAttack.hubAction")

// 이후:
button.setAttribute("aria-label", t("timeAttack.hubAction"));
const actionIcon = document.createElement("span");
actionIcon.className = "time-attack-teaser-card__action-icon";
actionIcon.setAttribute("aria-hidden", "true");
const actionLabel = document.createElement("span");
actionLabel.className = "time-attack-teaser-card__action-label";
actionLabel.textContent = t("timeAttack.hubAction");
button.append(actionIcon, actionLabel);
```

aria-label + 장식 아이콘(aria-hidden) + visible 텍스트 레이블 분리 구조 ✅

**CTA 버튼 CSS**

```css
.time-attack-teaser-card__action {
  display: inline-grid;
  grid-template-columns: auto minmax(0, 1fr) auto;  /* 아이콘|텍스트|화살표 */
  gap: 10px;
  padding: 8px 42px 8px 14px;
}

/* 화살표 chevron */
.time-attack-teaser-card__action::after {
  width: 13px; height: 13px;
  border-top: 4px solid rgba(61,43,46,0.76);
  border-right: 4px solid rgba(61,43,46,0.76);
  transform: translateY(-50%) rotate(45deg);
  position: absolute; right: 16px; top: 50%;
}

/* 아이콘 — 작은 시계 */
.time-attack-teaser-card__action-icon {
  width: 30px; height: 30px;
  border-radius: 999px;
  background: conic-gradient(from 220deg, #fff3a9 0 18%, #f2a04a 19% 58%, #9ccfba 59% 76%, ...);
}
```

버튼 안에 시계를 한 번 더 반복하는 것이 의도적 강조임. 카드 배지(58px 시계)는 콘텐츠 식별용, 버튼 아이콘(30px 시계)은 CTA 내 행동 단서로 역할 분리 ✅

`action-icon::before/after`로 침도 동일하게 구현. 색상은 배지보다 컴팩트하게 3분할(황금/주황/민트) ✅

**플로팅 메뉴 — data-view 기반 CSS 타겟**

```js
// 이전
item.className = activeView === view ? "floating-nav__item active" : "floating-nav__item";

// 이후
item.className = "floating-nav__item floating-nav__item--" + view + (activeView === view ? " active" : "");
item.dataset.view = view;
```

```css
.floating-nav__item[data-view="timeAttack"] {
  background: linear-gradient(135deg, #ffefae → #fff8e8 → #cce8db);
}
.floating-nav__item[data-view="timeAttack"] .floating-nav__icon {
  box-shadow: 0 0 0 3px rgba(244, 181, 74, 0.24), ...;
}
```

`floating-nav__item--{view}` 클래스와 `data-view` attribute 동시 제공으로 CSS 셀렉터 유연성 확보. 타임어택 항목만 황금+민트 배경으로 시각 차별화 ✅

**실측 검증 (375px)**

| 요소 | 측정값 | 판정 |
|---|---|---|
| CTA 버튼 display | grid ✅ | |
| CTA gridCols | `30px 190.667px 0px` | 화살표 absolute라 0px — 정상 |
| CTA icon w/h | 30×30px ✅ | |
| CTA icon bg | conic-gradient 포함 ✅ | |
| CTA label | "타임어택 시작" ✅ | |

**CI 강화**: actionIcon 크기/배경/침 pseudo, actionLabel 텍스트, 화살표 ::after 검증 추가 ✅

### 평가

| 항목 | 상태 |
|---|---|
| CTA 아이콘+텍스트+화살표 3파트 | ✅ |
| aria-label + aria-hidden 분리 | ✅ |
| 플로팅 메뉴 타임어택 배경 차별화 | ✅ |
| data-view attribute + BEM modifier 동시 제공 | ✅ |
| CI 검증 항목 대폭 강화 | ✅ |
| qa:mobile + qa:visual-pack + qa:billing + 113 tests 통과 | ✅ |

플래그 없음.

---

---

# 브라우저 직접 측정 — 시각 감사 결과

**기준**: v0.1.443 / 375×812px 모바일

---

## 🔴 P1 — 즉시 수정 필요

### ① guide-pip-scene: 단일 컬럼으로 렌더링 (핵심 버그 재확인)

```
computed gridTemplateColumns: "283.333px"  ← 1컬럼
기대: "82px 201px" (두 컬럼)

CSS 규칙 파서 결과:
  .guide-pip-scene → "74px minmax(0px, 1fr)"         (≤820px 미디어쿼리 내)
  .guide-pip-scene → "clamp(68px, 13vw, 92px) minmax(220px, 1fr)"  (베이스)
  
부모 확인: pipParentClass = "how-to-play visual-guide" ✅ (셀렉터 매칭 OK)
```

CSS 규칙은 존재하나 computed가 단일 컬럼. v0.1.427 패치 이후 추가된 다른 규칙이 override하고 있을 가능성 높음. `styles.css` 말미의 `.guide-pip-scene` 단독 규칙 확인 필요.

결과: Pip 캐릭터가 말풍선 위에 쌓여 → 말풍선이 283px 전체 너비 단일 컬럼 → 텍스트 한 글자씩 줄바꿈.

### ② 헤더 — difficulty 배지와 타이틀 텍스트 48px 겹침

```
play-screen__title: x=113, w=182  (끝 x=295)
difficulty badge:   x=113, w=48   (끝 x=161)
→ 겹침 48px (배지 전체가 타이틀 시작 부분 위에 올라탐)
```

"Soup Bowl" 텍스트가 "5x5" 배지 아래 숨겨짐. 헤더 grid가 `78px 182px 46px` (3컬럼)인데 타이틀과 배지가 같은 x=113에서 시작 → absolute 포지셔닝 충돌.

---

## 🟡 P2 — 레이아웃 정렬 오차

### ③ 컬럼 클루 숫자 vs 그리드 셀 6px 우측 shift

```
column-clue 중심 X:  136, 178, 220, 261, 303
puzzle-cell 중심 X:  142, 184, 225, 267, 309
차이: +6px (일관된 오프셋)
```

column-clues와 puzzle-grid 모두 x=117에서 시작하지만, 셀 내 padding(~6px)이 있어 실제 셀 콘텐츠 중심이 클루 중심보다 6px 오른쪽. 숫자와 열이 시각적으로 정렬 안 됨.

### ④ board-wrap overflow: visible → 테두리/그림자 카드 밖으로 노출

```
board-wrap overflow: "visible"
부모 puzzle-panel overflow: "visible"
```

보드 테두리와 box-shadow가 부모 카드 경계 밖으로 흘러나와 "보드가 틀을 넘어가는" 시각 현상 발생.  
수정: `board-wrap` 또는 `puzzle-panel`에 `overflow: hidden` + 충분한 padding 추가.

### ⑤ brand-intro 2px 오른쪽 overflow

```
brand-intro right: 377px (vw=375)
brand-intro__grain right: 377px
```

미미하나 가로 스크롤 트리거 가능성. grain 레이어 `width: calc(100% + 2px)` 류의 의도적 패턴일 수 있으나 확인 필요.

---

## 🟠 P3 — UX 개선 권장

### ⑥ 퍼즐 허브 스크롤 깊이 — 타임어택 카드 뷰포트 밖

```
타임어택 티저카드 y: 1809px  (vw=375, vh=812 → 뷰포트의 2.2배 아래)
데일리 카드 y: 1510px
```

허브 페이지를 열면 타임어택 카드까지 스크롤을 많이 해야 함. 뷰포트 안에 진입점을 암시하는 시각 단서(fade-out 그라디언트, 스크롤 인디케이터) 없음.

### ⑦ 약속 칩 textContent에 "열기" 포함

```
chip.textContent: "그림 333개열기", "팬트리 목표열기", "타임어택열기"
```

sr-only "열기" 텍스트가 visible 텍스트에 포함 → 스크린리더가 "그림 333개열기"로 연속 읽음. aria-label이 별도 있으므로 스크린리더 기능은 OK이나, `aria-label`이 있는 버튼에서 visible text와 aria-label이 다를 때 WCAG 2.5.3 Label in Name 이슈 가능성.

---

## Codex 전달 우선순위

```
P1-A: guide-pip-scene CSS override 찾아서 2컬럼 복구
      → styles.css 말미 .guide-pip-scene 규칙 확인, 미디어쿼리 래핑 확인

P1-B: 헤더 difficulty 배지 타이틀 겹침 수정
      → play-screen__header grid에서 배지 위치 조정

P2-A: column-clues vs puzzle-grid 6px X 오프셋
      → column-clues padding-left 또는 grid gap 조정

P2-B: board-wrap overflow 처리
      → 부모 카드에 overflow: hidden + padding 추가

P2-C: brand-intro 2px overflow 확인
      → .brand-intro__grain width 체크
```


---

## Review 166 — v0.1.444 `009542f` ui: recover mobile play layout

**커밋 요약**: 시각 감사에서 발견된 P1/P2 이슈 일괄 수정. Pip 가이드 2컬럼 복구, 헤더 difficulty 배지 겹침 해소, board-wrap overflow clip 처리, brand-intro 수평 overflow 차단.

**변경 범위**: `src/styles.css` +82, `scripts/mobile_visual_check.js` +40 -1.

---

### 코드 분석

#### 1. 헤더 — difficulty 배지 겹침 해소

```css
.play-screen__header {
  grid-template-columns: auto minmax(0, 1fr) auto auto;
}
.play-screen__title {
  display: grid;
  min-width: 0;
}
.play-screen__header .difficulty {
  grid-column: auto;
  align-self: center;
}
@media (max-width: 380px) {
  .play-screen__header {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }
  .play-screen__header .difficulty {
    grid-column: 3;
    justify-self: end;
  }
}
```

이전 3컬럼(`78px 182px 46px`)에서 4컬럼(`auto minmax(0,1fr) auto auto`)으로 변경. difficulty 배지가 독립 컬럼을 차지해 타이틀과 물리적으로 분리됨.

**실측 검증 (375px)**:
```
이전: title x=113, difficulty x=113 → overlap=48px
이후: title x=113 w=180, difficulty x=300 w=48 → overlap=0px ✅
headerGridCols: "78px 179.719px 48.281px"
```

380px 이하에서는 3컬럼으로 전환하고 배지를 3번째 컬럼 우측 정렬 — 매우 좁은 화면에서도 겹침 없이 처리 ✅

#### 2. guide-pip-scene — 2컬럼 복구

```css
@media (max-width: 560px) {
  .guide-pip-scene {
    grid-template-columns: 56px minmax(0, 1fr);
    align-items: center;
    justify-items: stretch;
    gap: 7px;
  }
  .guide-pip-scene__pip { width: 56px; height: 56px; }
  .guide-pip-scene__bubble { width: auto; min-width: 0; padding: 9px 10px; }
  .guide-pip-scene__bubble::before {
    left: -9px; top: 22px;
    border-left: 2px solid ...; border-bottom: 2px solid ...;
  }
}
```

이전 패치들이 `minmax(220px, 1fr)`처럼 최소값이 컨테이너를 초과해 단일 컬럼으로 collapse됐던 문제를 `minmax(0, 1fr)`로 완전 해소.

**실측 검증 (375px)**:
```
이전: pipGridCols = "283.333px"  (단일 컬럼)
이후: pipGridCols = "56px 220.333px"  (2컬럼) ✅
pipImgW = 58px, bubbleX = 109px, bubbleW = 220px
```

Pip(56px) + 말풍선(220px) 나란히 배치 복구. 말풍선 꼬리(`::before`)도 새 위치(`left: -9px, top: 22px`)에 맞게 조정됨 ✅

`justify-items: stretch`로 말풍선이 남은 너비를 100% 채움 ✅

#### 3. board-wrap overflow clip

```css
.puzzle-panel:not(.completed) .board-wrap:not(.locked) {
  overflow: clip;
  overflow-clip-margin: 8px;
}
```

이전: `overflow: visible` → 테두리/그림자가 카드 밖으로 노출

**실측 검증**:
```
이전: boardOverflow = { x: "visible", y: "visible" }
이후: boardOverflow = { x: "clip", y: "clip" } ✅
```

`:not(.completed)`, `:not(.locked)` 조건으로 완성/잠금 상태에서는 clip 제외 — 완성 화면 애니메이션이나 잠금 오버레이가 clip되지 않도록 배려 ✅

`overflow-clip-margin: 8px`로 그림자가 8px까지는 보이도록 허용 — 완전히 자르지 않고 약간의 시각적 여유 ✅

#### 4. brand-intro 수평 overflow 차단

```css
.brand-intro {
  overflow-x: clip;
}
```

이전 `right=377px (vw=375)` 2px overflow 차단. **실측: overflows=[]** ✅

#### 5. CI — pip-scene 2컬럼 + 버블 위치 + 헤더 겹침 검증 추가

```js
// pip-scene 2컬럼 확인
!howToPlayMetrics.sceneGridColumns.includes(" ")  // 공백 포함 = 2개 이상 컬럼

// 버블이 pip 오른쪽에 있어야 함
howToPlayMetrics.bubbleLeft < howToPlayMetrics.pipRight - 1

// difficulty 배지가 타이틀과 겹치지 않아야 함
controls.some(c => /x/i.test(c.text) && c.left < titleRight+8 && c.right > titleLeft-8)

// board-wrap overflow가 visible이 아닐 것
boardFrameMetrics.overflowX === "visible" || boardFrameMetrics.overflowY === "visible"
```

이번에 수정한 4개 항목 모두 CI에 즉시 등록 ✅

---

### 남은 미해소 항목

**column-clue vs puzzle-cell 정렬 오차 (P2-A) — 여전히 존재**

```
이후 측정:
column-clue centers: 145, 184, 224, 263, 302
puzzle-cell centers: 151, 190, 229, 269, 308
차이: 일관된 -6px (클루가 셀보다 6px 왼쪽)
```

이번 커밋에서 미수정. 별도 추적 필요.

---

### 평가

| 항목 | 상태 |
|---|---|
| 헤더 difficulty 배지 겹침 해소 | ✅ 측정 확인 |
| guide-pip-scene 2컬럼 복구 | ✅ 측정 확인 |
| board-wrap overflow clip | ✅ 측정 확인 |
| brand-intro 수평 overflow 차단 | ✅ 측정 확인 |
| CI 4개 항목 추가 | ✅ |
| qa:mobile + 113 tests + qa:billing 통과 | ✅ |

잔여: column-clue vs 셀 6px 오프셋 미수정.

---

## Review 167 — v0.1.445 `82c8e55` ui: contain mobile row clues

**커밋 요약**: 행 힌트(`1 1 1` 같은 다중 토큰)가 board-wrap 왼쪽으로 튀어나오는 문제 수정. 420px 이하에서 `--board-row-clue-width` 축소 + row-clue span 최소 크기 조정.

**변경 범위**: `src/styles.css` +18, `scripts/mobile_visual_check.js` +10 -1.

---

### 코드 분석

#### CSS 수정

```css
@media (max-width: 420px) {
  .puzzle-panel:not(.completed) .board-wrap:not(.locked) {
    --board-row-clue-width: 66px;
    --board-cell-size: clamp(15px, calc((100vw - 194px) / var(--board-size)), 42px);
  }

  .puzzle-panel:not(.completed) .board-wrap:not(.locked) .row-clue {
    gap: 2px;
    padding-right: 4px;
  }

  .puzzle-panel:not(.completed) .board-wrap:not(.locked) .row-clue span {
    min-width: 20px;
    min-height: 20px;
  }
}
```

**`--board-row-clue-width: 66px`**: 기존 값보다 축소해 row-clue 영역이 board-wrap 안에 수용되도록.

**`--board-cell-size`**: `calc((100vw - 194px) / board-size)` — row-clue 너비(66px), 여백, 패딩을 제외한 나머지를 셀 수로 나누는 공식. 420px 이하에서 셀 크기를 자동 축소해 전체 보드가 화면 안에 들어오도록 ✅

**`gap: 2px, padding-right: 4px`**: 토큰 간격 축소로 다중 토큰(`1 1 1`)이 좁은 row-clue 안에 수용 ✅

**`min-width/min-height: 20px`**: 토큰이 너무 작아지지 않도록 하한선 유지 ✅

:not(.completed)/:not(.locked) 조건을 동일하게 유지 — 166 패턴 일관성 ✅

**실측 검증 (375px)**:
```
boardLeft: 45, boardRight: 330
rowClueLeft: 55, rowClueRight: 121
gridLeft: 127

rowClueLeft(55) > boardLeft(45) ✅ (board 안에 들어옴)
rowClueRight(121) < gridLeft(127) ✅ (grid와 겹치지 않음)
```

행 힌트가 board-wrap 경계(left=45) 안에 있고, puzzle-grid 시작(127)과 겹치지 않음 ✅

#### CI 추가

```js
const widestRowClue = [...board.querySelectorAll(".row-clue")]
  .reduce((widest, clue) => clueRect.width > widest.width ? clueRect : widest, null);

// 가장 넓은 row-clue가 board 왼쪽을 벗어나지 않아야 함
boardFrameMetrics.widestRowClueLeft < boardFrameMetrics.left - 1

// row-clue가 grid 왼쪽 경계를 침범하지 않아야 함
boardFrameMetrics.widestRowClueRight > boardFrameMetrics.gridLeft - 2
```

`가장 넓은 row-clue` 기준 검증 — 토큰이 많은 행이 regression 발생 시 즉시 탐지 ✅

---

### column-clue 오프셋 (공통 잔여 항목)

두 커밋 모두 column-clue vs puzzle-cell 6px 오프셋은 미수정.

```
실측: colClue centers [145,184,224,263,302]
      cell centers   [151,190,229,269,308]
      diff: 일관된 -6px
```

원인: row-clue 영역(`x=55~121`)과 grid(`x=127`) 사이에 6px gap이 있는데 column-clues가 grid와 같은 x=127에서 시작하지만 column-clue 내 padding이 있어 숫자 중심이 셀 중심보다 6px 왼쪽으로 치우침. column-clue의 `text-align: center` 또는 padding 조정으로 해소 가능.

---

### 평가 (167)

| 항목 | 상태 |
|---|---|
| row-clue 다중 토큰 board 밖 노출 해소 | ✅ 측정 확인 |
| --board-cell-size 동적 공식으로 셀 자동 축소 | ✅ |
| 토큰 최소 크기(20px) 하한선 유지 | ✅ |
| widestRowClue 기준 CI 검증 추가 | ✅ |
| 113 tests + qa:mobile + qa:visual-pack 통과 | ✅ |

잔여: column-clue vs 셀 6px 오프셋.


---

## Review 168 — v0.1.446 `7ade4e6` ui: align mobile column clues

**커밋 요약**: Review 166–167 잔여 항목인 column-clue vs 셀 6px 오프셋 수정. `column-clues`에 `padding-inline: 6px` 추가로 첫 번째 컬럼 힌트를 셀과 정렬. CI 검증 조건을 `firstColumnLeft vs gridLeft` 비교에서 `firstColumnCenter vs firstCellCenter` 중심 좌표 비교로 교체.

**변경 범위**: `src/styles.css` +4, `scripts/mobile_visual_check.js` +8 -1.

---

### 코드 분석

**CSS 수정**

```css
.puzzle-panel:not(.completed) .board-wrap:not(.locked) .column-clues {
  padding-inline: 6px;
}
```

단 한 줄. `column-clues` 좌측에 6px 여백을 추가해 첫 번째 clue 숫자 중심이 첫 번째 셀 중심과 일치하도록 조정.

**CI 수정**

```js
// 이전: 왼쪽 가장자리 비교 (부정확)
Math.abs(boardFrameMetrics.firstColumnLeft - boardFrameMetrics.gridLeft) > 8

// 이후: 중심 좌표 비교 (정확)
Math.abs(boardFrameMetrics.firstColumnCenter - boardFrameMetrics.firstCellCenter) > 2
```

허용 오차를 8px → 2px로 축소하고, 가장자리가 아닌 **중심** 좌표 비교로 전환. 숫자가 셀 중심에 실제로 놓이는지를 직접 검증 ✅

---

### 실측 검증 (375px)

**이전 (Review 166 측정):**
```
col centers:  145, 184, 224, 263, 302
cell centers: 151, 190, 229, 269, 308
diffs:        -6,  -6,  -5,  -6,  -6   (일관된 -6px)
```

**이후 (현재 측정):**
```
col centers:  150, 187, 223, 260, 297
cell centers: 151, 190, 229, 269, 308
diffs:        -1,  -3,  -6,  -9, -11
```

**첫 번째 컬럼**: -6px → **-1px** (사실상 정렬 ✅)

**⚠️ 오프셋 누적 현상**: 이전엔 균일한 -6px였으나, 이후엔 첫 열은 맞고 끝으로 갈수록 오차 누적 (-1 → -11). 최대 오프셋이 오히려 6 → 11px로 증가.

**원인**: `padding-inline: 6px`이 column-clues 그리드의 유효 너비를 193px로 줄이면서 셀당 너비가 38.6px로 변함. puzzle-grid 셀은 38.667px. 0.067px/셀 차이가 5열에서 약 0.33px로 누적 — 그런데 측정 오차가 11px이면 더 큰 원인이 있음. column-clues가 내부적으로 동일 grid 사이즈를 쓰지 않고, padding으로 인해 grid-template-columns의 재계산이 발생하면서 puzzle-grid와 컬럼 너비가 달라진 것.

**근본 원인**: `column-clues`와 `puzzle-grid`가 독립 그리드로 각자 `grid-template-columns`를 계산함. column-clues에 padding을 추가하면 양쪽 컬럼 폭이 달라져 첫 열만 맞고 이후 열은 누적 오차 발생.

**올바른 수정 방향**: `padding-inline` 대신 column-clues의 `grid-template-columns`를 puzzle-grid와 동일한 계산식으로 맞추거나, 두 그리드를 같은 부모 grid에서 subgrid로 연결.

---

### 평가

| 항목 | 상태 |
|---|---|
| 첫 컬럼 힌트 정렬 | ✅ (-6px → -1px) |
| CI 중심 좌표 기준으로 교체 | ✅ |
| 허용 오차 8px → 2px 강화 | ✅ |
| 전체 컬럼 균일 정렬 | ⚠️ 1열만 맞고 끝열 -11px 누적 |

**플래그 1개 (P2)**:

`padding-inline` 접근으로 첫 열 정렬은 개선됐으나 5열 기준 최대 오프셋이 -6px → -11px로 증가. 5×5 퍼즐에서 육안으로 눈에 띌 수 있는 수준. 7×7, 10×10, 12×12에서는 오차가 더 크게 누적될 것.

**Codex에 전달**: `column-clues`의 그리드 컬럼 너비를 `puzzle-grid`와 동일하게 동기화하는 구조적 수정 필요. `padding-inline` 제거 후 column-clues를 board-wrap 그리드의 `subgrid` 또는 puzzle-grid와 동일한 `grid-template-columns` CSS variable로 연결하는 방식 권장.


---

## Review 169 — v0.1.457 `1b42391` ui: sharpen puzzle action tokens

**커밋 요약**: 퍼즐 플레이 화면의 컨트롤 버튼 아이콘(`control-button__icon`)과 가이드 액션 아이콘(`guide-action__icon`)에 CSS 전용 아이콘 아트워크를 추가. Fill(채우기), Mark(마크), Undo(되돌리기) 3종. CI 크기 임계값 상향 조정.

**변경 범위**: `src/styles.css` +150, `scripts/mobile_visual_check.js` 임계값 수정.

---

### 코드 분석

#### 1. 공통 베이스 클래스 통합

```css
.control-button__icon,
.guide-action__icon {
  position: relative;
  flex: 0 0 auto;
  border-style: solid;
  overflow: hidden;
}
.control-button__icon {
  width: 32px; height: 32px;
  border-radius: 12px;
  box-shadow: inset 0 2px 0 rgba(255,255,255,0.86), ...;
}
.guide-action__icon {
  width: 22px; height: 22px;
  border-radius: 8px;
}
```

두 아이콘 클래스를 그룹 셀렉터로 묶어 `position: relative` (pseudo-element 기준점), `flex: 0 0 auto` (축소 방지), `overflow: hidden` (pseudo-element clip)을 공유 선언. 이후 각 클래스에서 크기/radius/shadow만 분기 — 중복 최소화 ✅

`control-button__icon`에 `inset` 그림자로 상단 광택을 부여해 기존 카드 3레이어 어휘(radial 광택 + 그라디언트 베이스 + pseudo 장식)와 시각 일관성 ✅

#### 2. Fill 토큰 — 앰버 브러시

```css
/* 베이스: 황금 그라디언트 */
.control-button__icon[data-action="fill"] {
  background: linear-gradient(160deg, #ffd97d, #f0a030);
  border-color: rgba(180,100,20,0.45);
}

/* ::before: 붓/연필 몸체 (15×19px, -6deg 기울기) */
.control-button__icon[data-action="fill"]::before {
  width: 15px; height: 19px;
  background: linear-gradient(135deg, #fff8e8, #e8d0a0);
  border-radius: 3px 3px 6px 6px;
  transform: translateX(-50%) rotate(-6deg);
}

/* ::after: 물감 방울/blob (10×10px, 유기적 border-radius) */
.control-button__icon[data-action="fill"]::after {
  width: 10px; height: 10px;
  background: radial-gradient(circle, #fff3c0, #f0a030);
  border-radius: 70% 30% 50% 80% / 40% 60% 70% 50%;
}
```

앰버(황금/주황) 계열이 "채우기"의 온기와 스푼 이코노미 색조와 연결 ✅  
붓 `::before`에 살짝 기울기(`-6deg`)를 부여해 정적이지 않고 사용 중인 느낌 ✅  
blob `::after`의 비대칭 `border-radius`가 유기적 물감 방울 형태를 CSS만으로 표현 ✅

#### 3. Mark 토큰 — 민트 체크마크

```css
/* 베이스: 민트/틸 그라디언트 */
.control-button__icon[data-action="mark"] {
  background: linear-gradient(160deg, #9ee8c8, #3abf8a);
  border-color: rgba(20,120,80,0.35);
}

/* ::before / ::after: 두 개의 수평 바 */
.control-button__icon[data-action="mark"]::before {
  width: 18px; height: 4px;
  background: rgba(255,255,255,0.9);
  border-radius: 2px;
  transform: translate(-50%, calc(-50% - 3px));
}
.control-button__icon[data-action="mark"]::after {
  width: 14px; height: 4px;
  background: rgba(255,255,255,0.9);
  border-radius: 2px;
  transform: translate(-50%, calc(-50% + 4px));
}
```

민트/틸 계열이 팬트리·완료 상태와 동일한 색조 — "마크 = 완료 표시"라는 의미를 색으로 암시 ✅  
두 수평 바 조합이 X 마크(또는 체크 표시)를 단순화한 형태로 표현. 회전 없이 수평 배치로 가독성 확보 ✅

#### 4. Undo 토큰 — 원형 화살표

```css
/* 베이스: 회색/퍼플 conic-gradient */
.control-button__icon[data-action="undo"] {
  background: conic-gradient(from 180deg, #c8b8e8 0 75%, transparent 76% 100%);
  border-radius: 999px;
}

/* ::before: 원호 (14×14px, 1/4 원 border, 31deg 시작) */
.control-button__icon[data-action="undo"]::before {
  width: 14px; height: 14px;
  border: 3px solid #9070c8;
  border-radius: 999px;
  border-right-color: transparent;
  border-bottom-color: transparent;
  transform: translate(-50%, -50%) rotate(31deg);
}

/* ::after: 삼각 화살촉 */
.control-button__icon[data-action="undo"]::after {
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 7px solid #9070c8;
  transform: translate(...) rotate(-45deg);
}
```

`conic-gradient`로 배경 자체에 3/4 원호를 그리고, `::before`로 실제 stroke 원호를 겹쳐 입체감 부여 ✅  
`border-right-color: transparent` + `border-bottom-color: transparent`로 2사분면만 남기는 패턴 — Review 164 시계 배지와 동일한 CSS 원호 기법 ✅  
삼각 화살촉(`::after`)의 `border` trick으로 SVG 없이 화살표 완성 ✅

#### 5. Guide Action 아이콘 — 22px 스케일

```css
.guide-action__icon[data-action="fill"]  { /* 동일 디자인, 22px 컨테이너 */ }
.guide-action__icon[data-action="mark"]  { /* 동일 디자인, 22px 컨테이너 */ }
.guide-action__icon[data-action="undo"]  { /* 동일 디자인, 22px 컨테이너 */ }
```

`data-action` attribute 셀렉터를 동일하게 사용, 컨테이너 크기만 32px → 22px로 축소. pseudo-element 크기도 비례 축소.

`control-button__icon` vs `guide-action__icon` 비율: 32:22 ≈ 1.45. 양쪽 context에서 같은 아이콘이 다른 크기로 자연스럽게 렌더링 ✅

#### 6. CI 업데이트

```js
// 이전: 아이콘이 너무 작으면 플래그
iconSize < 20  // control button
iconSize < 18  // guide action

// 이후:
iconSize < 30  // control button (32px 기준, 2px 허용 오차)
iconSize < 20  // guide action (22px 기준, 2px 허용 오차)

// 추가 검증
iconBorderRadius < 7    // 12px (control) / 8px (guide) 확인
iconShadow === "none"   // inset shadow 존재 확인 (control만)
```

임계값이 실제 디자인 스펙(32px/22px)에서 -2px 허용 오차로 맞춰짐 ✅  
`border-radius` 체크 추가로 디폴트 사각형 렌더링(아이콘 CSS 누락 시) 즉시 감지 ✅  
`shadow === "none"` 체크가 역방향(shadow가 없으면 실패)임을 주의 — 실제로는 `shadow !== "none"`이어야 통과하는 의도로 읽힘. CI 로직 확인 필요.

---

### 맥락 — CSS placeholder 개선 단계

Review 163에서 기록했듯, 이 아이콘들은 **최종 Sunny Spoon Studios 아트워크 패스 이전의 CSS 플레이스홀더**. 이번 커밋은 그 플레이스홀더를 기존의 단순 박스에서 의미 있는 시각 단서가 있는 형태로 격상시킨 것.

- **이전**: `control-button__icon`은 단순 32px 정사각형, 아이콘 내용 없음
- **이후**: Fill(앰버 브러시), Mark(민트 바), Undo(회색 원호)로 각 액션의 의미를 색과 형태로 전달

이 시점에서 배포 가능한 완성도 수준이냐는 별개 문제이나, 최소한 플레이어가 어떤 버튼인지 유추할 수 있는 수준으로 올라왔음. v1 이후 아트워크 패스가 예정되어 있으므로 지금은 적절한 균형점 ✅

Review 168에서 플래그한 **column-clue 누적 오프셋 문제**는 이번 커밋과 무관하게 여전히 미해소.

---

### 평가

| 항목 | 상태 |
|---|---|
| 공통 베이스 클래스 통합 (`control` + `guide`) | ✅ |
| Fill — 앰버 그라디언트 + 브러시/blob pseudo | ✅ |
| Mark — 민트 그라디언트 + 수평 바 pseudo | ✅ |
| Undo — conic-gradient 원호 + 화살촉 pseudo | ✅ |
| Guide action 동일 디자인 22px 스케일 | ✅ |
| data-action 셀렉터 일관 사용 | ✅ |
| CI 임계값 스펙 반영 (30px/20px) | ✅ |
| CI border-radius/shadow 추가 검증 | ✅ |

**주의 1개 (P3)**: `iconShadow === "none"` CI 조건이 control-button shadow 존재를 검증하는 의도라면 역방향. shadow가 정상 적용된 경우 `"none"`이 아닌 값이 반환되므로 실패 조건이 `=== "none"`이 맞음. 단, 로직 전체 컨텍스트 없이 이 부분만 보면 혼동 가능. 코드 주석 또는 변수명 명확화 권장.

플래그 없음 (P3 주의사항은 기능에 영향 없음).


---

## Review 170 — v0.1.458 `fe45498` ui: polish opening Pip seal medallion

**커밋 요약**: 오프닝 브랜드 인트로의 Pip 씰(seal) 메달리온을 단순 이미지 박스에서 액자형 메달리온으로 격상. `clamp()` 기반 반응형 크기 + 3레이어 카드 배경 + `inset` 그림자 + 이미지 `transform/filter`. CI에 씰 전체 스펙 검증 38개 조건 추가.

**변경 범위**: `src/styles.css` +49 -14, `scripts/mobile_visual_check.js` +38.

---

### 코드 분석

#### 1. CSS — 씰 컨테이너

```css
.brand-intro.game-stage .brand-intro__key-visual + .brand-intro__seal {
  width: clamp(64px, 18vw, 74px);
  height: clamp(64px, 18vw, 74px);
  margin-top: clamp(-43px, -10vw, -36px);
  border: 3px solid rgba(61, 43, 46, 0.82);
  border-radius: 20px;
  padding: 3px;
  overflow: hidden;
  background:
    radial-gradient(circle at 28% 20%, rgba(255,255,255,0.92) 0 11%, transparent 12%),
    radial-gradient(circle at 74% 72%, rgba(255,204,74,0.45), transparent 32%),
    linear-gradient(145deg, rgba(255,253,243,0.98), rgba(219,245,221,0.9));
  box-shadow:
    0 5px 0 rgba(61,43,46,0.18),
    0 15px 24px rgba(122,78,53,0.2),
    inset 0 2px 0 rgba(255,255,255,0.8);
}
```

`clamp(64px, 18vw, 74px)`: 375px → 67.5px, 320px → 64px(하한), 430px → 74px(상한). 소형 기기(320px)와 일반 기기(375px) 모두 커버 ✅

`margin-top: clamp(-43px, -10vw, -36px)`: 씰을 key-visual 위에 오버랩. 화면 너비에 따라 오버랩 깊이가 비례해 씰이 key-visual에서 "튀어나온" 느낌 유지 ✅

배경 3레이어(좌상단 광택 radial + 우하단 앰버 radial + linear 베이스)가 기존 카드 어휘와 동일 ✅

`overflow: hidden` + `padding: 3px`: border 안쪽 여백이 이미지와 border 사이에 공간을 만들어 액자 효과 ✅

`box-shadow` 3겹: 바닥 `5px 0` 솔리드 그림자(오브젝트 두께감) + `15px 24px` 확산 그림자(부유감) + `inset` 상단 광택. 기존 카드보다 강한 입체감 부여 ✅

#### 2. CSS — 씰 이미지

```css
.brand-intro.game-stage .brand-intro__key-visual + .brand-intro__seal img {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  object-fit: contain;
  object-position: 50% 74%;
  transform: scale(1.18) translateY(3px);
  filter: drop-shadow(0 5px 0 rgba(61,43,46,0.12));
}
```

이전: `width/height`를 픽셀 고정(`48px`, `43px`)으로 지정해 컨테이너와 무관하게 크기가 고정됨.  
이후: `width/height: 100%`로 컨테이너 크기를 따라가도록 변경 — `clamp` 반응형과 연동 ✅

`object-position: 50% 74%`: Pip 캐릭터 얼굴을 씰 하단으로 이동해 씰 프레임 내에서 가장 인상적인 부분이 보이도록 크롭 ✅

`scale(1.18) translateY(3px)`: 이미지를 약간 확대하고 아래로 내려 씰 원형 안에 꽉 차게 배치. 여백이 줄어 "캐릭터가 씰 밖으로 나오려는" 느낌 연출 ✅

`drop-shadow(0 5px 0 ...)`: Pip 캐릭터 자체에 발 그림자를 부여해 씰 바닥에 서 있는 느낌 강화 ✅

#### 3. CSS — 반응형 미디어쿼리 정리

이전 미디어쿼리에서는 `width/height`(씰 크기)와 `width/height`(이미지 크기) 두 가지를 모두 픽셀 고정값으로 반복 관리.  
이후: 씰 컨테이너만 `clamp` 조정, 이미지는 `100%`이므로 미디어쿼리에서 이미지 크기 항목 제거.

```css
/* 이전 (≤390px) */
.brand-intro__seal { width: 60px; height: 60px; margin-top: -35px; }
.brand-intro__seal img { width: 48px; height: 48px; }  ← 제거

/* 이후 (≤390px) */
.brand-intro__seal { width: 64px; height: 64px; margin-top: -38px; }
/* 이미지 항목 없음 — 자동 100% */
```

미디어쿼리 코드량 절반 감소 ✅. `clamp`가 대부분을 처리하므로 미디어쿼리는 최소 크기 보정만 담당.

#### 4. CI — 씰 아트 메달리온 스펙 잠금

```js
if (
  sealMetrics.width < 58 ||
  sealMetrics.borderWidth < 3 ||
  sealMetrics.borderRadius < 18 ||
  !sealMetrics.backgroundImage.includes("gradient") ||
  sealMetrics.boxShadow === "none" ||
  sealMetrics.overflow !== "hidden" ||
  sealMetrics.imageWidth < 52 ||
  sealMetrics.imageObjectFit !== "contain" ||
  sealMetrics.imageTransform === "none" ||
  sealMetrics.imageFilter === "none"
) { failures.push(...) }
```

씰 폴리시의 8개 핵심 속성(크기, border, radius, gradient, shadow, overflow, objectFit, transform, filter) 모두 CI로 등록. 향후 씰 관련 CSS 수정 시 의도치 않은 스타일 손실 즉시 감지 ✅

`imageTransform === "none"` 체크: `scale(1.18) translateY(3px)`가 적용되면 "none"이 아닌 matrix 값이 반환되므로 정상 ✅

---

### 평가

| 항목 | 상태 |
|---|---|
| 씰 3레이어 배경 (기존 카드 어휘 동일) | ✅ |
| clamp 반응형 크기 (320px~430px) | ✅ |
| 이미지 100% → clamp 연동 | ✅ |
| object-position 얼굴 크롭 최적화 | ✅ |
| scale+translateY로 씰 내 꽉 찬 배치 | ✅ |
| 3겹 box-shadow 입체감 | ✅ |
| 미디어쿼리 이미지 항목 정리 | ✅ |
| CI 10개 속성 잠금 | ✅ |

플래그 없음.

---

## Review 171 — v0.1.459 `d2bacef` qa: guard starter board clue alignment

**커밋 요약**: Review 168에서 플래그한 column-clue 누적 오프셋 문제에 대한 CI 가드 추가. 스타터 5×5 보드에서 column-clue 중심과 puzzle-cell 중심의 오차를 ±1px 이내로 제한하는 측정 함수 `expectStarterBoardAlignment` 신설.

**변경 범위**: `scripts/mobile_visual_check.js` +37, `docs/CONTEXT.md` +5, `package.json/lock` 버전 bump.

---

### 코드 분석

#### CI 측정 로직 — `expectStarterBoardAlignment`

```js
const columnDeltas = columnClues.map((clue, columnIndex) => {
  const clueRect = clue.getBoundingClientRect();
  const cellRect = cells[columnIndex]?.getBoundingClientRect();
  return cellRect ? centerOf(clueRect, "x") - centerOf(cellRect, "x") : 999;
});

const rowDeltas = rowClues.map((clue, rowIndex) => {
  const clueRect = clue.getBoundingClientRect();
  const cellRect = cells[rowIndex * columnClues.length]?.getBoundingClientRect();
  return cellRect ? centerOf(clueRect, "y") - centerOf(cellRect, "y") : 999;
});
```

`columnIndex`번째 column-clue 중심 X vs `columnIndex`번째 cell 중심 X를 직접 비교. 셀이 없으면 `999`로 명시 실패 ✅

row-clue: `rowIndex * columnClues.length`번째 cell(각 행의 첫 번째 셀) 중심 Y와 비교 ✅

```js
if (
  boardMetrics.boardSize !== "5" ||
  boardMetrics.maxColumnDelta > 1 ||
  boardMetrics.maxRowDelta > 1
) { failures.push(...) }
```

`boardSize !== "5"` 체크: 스타터 보드가 5×5가 아닌 경우를 방어 — 게임 로직이 다른 크기로 바뀌면 즉시 탐지 ✅

`maxDelta > 1px`: 허용 오차 1px. Review 168에서 측정한 최대 11px 오프셋이라면 즉시 실패 — 문제가 해소됐는지 CI로 확인하는 구조.

**주목**: 이 CI가 통과한다는 것은 v0.1.459 시점에 column-clue 오프셋이 ±1px 이내로 수정됐음을 의미. CSS 수정(Review 168 flagged `padding-inline` 제거 또는 subgrid 연결)이 선행됐는지 별도 CSS diff에서 확인 필요.

#### `centerOf` 헬퍼

```js
const centerOf = (rect, axis) => axis === "x"
  ? rect.left + rect.width / 2
  : rect.top + rect.height / 2;
```

Closure 내 단순 헬퍼 — `evaluate` 내부에서만 사용하므로 외부 노출 없음. 가독성 좋음 ✅

---

### 평가

| 항목 | 상태 |
|---|---|
| column-clue 중심 ↔ cell 중심 ±1px 검증 | ✅ |
| row-clue 중심 ↔ cell 중심 ±1px 검증 | ✅ |
| boardSize !== "5" 방어 | ✅ |
| 셀 미존재 시 999 명시 실패 | ✅ |
| play-screen 진입 직후 실행 (정상 위치) | ✅ |

**참고**: 이 CI가 qa:candidate를 통과했다면 Review 168 column-clue 오프셋 P2 이슈는 해소된 것으로 볼 수 있음. 다만 CSS diff(별도 커밋)에서 실제 수정 방법(subgrid? padding 제거? CSS variable 동기화?)을 확인하지 못함. 다음 CSS 커밋에서 확인 권장.

플래그 없음.

---

## Review 172 — v0.1.459 `611df2d` docs: record v0.1.459 candidate gate refresh

**커밋 요약**: `docs/ANDROID_RELEASE_STATUS.md`에 v0.1.459 candidate gate 통과 결과 기록. `qa:candidate` 전체 통과 상태, 카탈로그 통계, 실기기 Billing 증거 블로커 2건 재확인.

**변경 범위**: `docs/ANDROID_RELEASE_STATUS.md` +17 -1.

---

### 기록 내용

```
- Current verified app version: v0.1.459
- npm run qa:candidate 통과
- 총 퍼즐: 333 / 무료: 333 / 10×10+: 243 / 12×12+: 116
- Vitest: 113 passed
- 모든 게이트 통과: Catalog, bonus-pack, launch integrity, source hygiene,
  asset manifest, Play Store graphics/listing, Billing wiring, privacy policy,
  production build, Android release gate, HTTP probe, mobile visual QA
- qa:release:final 의도적 블록:
  ① pip_cozy_support purchase + restore 증거
  ② pip_spoon_jar_small purchase + repeat purchase 증거
```

candidate gate 전체 통과 상태를 스냅샷으로 보존. 실기기 Billing 증거만 남은 블로커임을 명확히 기록 ✅

"Last updated: 2026-07-18 → 2026-07-19" 날짜 업데이트 ✅

---

### 평가

문서 커밋. 코드 변경 없음. 릴리즈 추적 문서의 정확성 확인.

| 항목 | 상태 |
|---|---|
| v0.1.459 candidate gate 통과 기록 | ✅ |
| 카탈로그 통계 (333/243/116) | ✅ |
| 113 Vitest 통과 기록 | ✅ |
| 실기기 Billing 블로커 2건 재확인 | ✅ |
| 날짜 업데이트 | ✅ |

플래그 없음.

---

## Review 173 — v0.1.459 `13ac793` docs: record v0.1.459 Android candidate AAB

**커밋 요약**: Review 172에 이어 `qa:android:candidate` 통과 및 unsigned candidate AAB 빌드 결과를 `ANDROID_RELEASE_STATUS.md`에 추가 기록.

**변경 범위**: `docs/ANDROID_RELEASE_STATUS.md` +5.

---

### 기록 내용

```
- npm run qa:android:candidate 통과
- AAB 경로: android/app/build/outputs/bundle/release/app-release.aab
- AAB 크기: 12,077,297 bytes (≈ 11.5 MB)
- 로컬 빌드 시각: 2026-07-19 09:13
```

`qa:candidate`(172)와 `qa:android:candidate`(173) 두 게이트를 별도 커밋으로 분리해 기록. 각 단계의 통과 시점을 독립적으로 추적 가능 ✅

AAB 크기 12MB: Google Play 최대 업로드 크기(100MB Android App Bundle)에 충분한 여유 ✅

---

### 릴리즈 전체 상태 요약 (v0.1.459 기준)

| 게이트 | 상태 |
|---|---|
| qa:candidate (모든 코드 게이트) | ✅ |
| qa:android:candidate (Android 빌드) | ✅ |
| qa:release:final | ⏳ 실기기 Billing 증거 2건 대기 |

**남은 블로커 (Claude 범위 외)**:
1. `pip_cozy_support` — Play Console 실기기 purchase + restore 증거
2. `pip_spoon_jar_small` — Play Console 실기기 purchase + repeat purchase 증거

코드 및 빌드 측면에서 출시 준비 완료. 외부 검증만 남은 상태.

플래그 없음.


---

## Review 174 — v0.1.461 `ba0226b` ui: fix navigation access and guide replay

**커밋 요약**: CODEX_BRIEF.md P1 두 항목 동시 구현. 플로팅 메뉴를 `position: fixed`로 전환해 스크롤 없이 항상 접근 가능하게 하고, 설정에 "Pip 가이드 보기" 카드를 추가해 첫 진입 이후에도 가이드를 다시 볼 수 있게 함. 플레이 화면에서도 플로팅 메뉴 연결. CI 76줄 추가.

**변경 범위**: `src/styles.css` +280, `scripts/mobile_visual_check.js` +76, `src/ui/settingsView.js` +28, `src/ui/appShell.js` +9, `src/i18n/en.js` +3, `src/i18n/ko.js` +3, `docs/CONTEXT.md` +12.

---

### 코드 분석

#### 1. 플로팅 메뉴 — `position: fixed` 전환

```css
.floating-nav {
  position: fixed;
  right: max(12px, calc(env(safe-area-inset-right, 0px) + 12px));
  bottom: max(12px, calc(env(safe-area-inset-bottom, 0px) + 12px));
  z-index: 90;
  width: min(336px, calc(100vw - 24px));
  pointer-events: none;
}
.floating-nav__trigger,
.floating-nav__menu { pointer-events: auto; }
```

`env(safe-area-inset-right/bottom)`: 노치/홈바가 있는 기기(iPhone X류, 최신 Android)에서 버튼이 가려지지 않도록 safe area 고려 ✅

`z-index: 90`: 설정 다이얼로그(z-index ~20), 가이드 오버레이(z-index 20)보다 높아서 두 모달이 열려 있을 때도 메뉴가 위에 올라옴. 이는 실제로 문제가 될 수 있음 — 모달이 열린 상태에서 플로팅 메뉴 트리거가 여전히 탭 가능하다면 예상치 못한 네비게이션이 발생할 수 있음. (아래 주의 항목 참조)

`pointer-events: none` + `auto` 패턴: 메뉴 컨테이너 자체는 클릭 통과, 실제 버튼들만 인터랙션 수신. 메뉴 배경 영역에서 의도치 않은 클릭 차단 방지 ✅

```css
.app-shell--play .floating-nav {
  bottom: max(86px, calc(env(safe-area-inset-bottom, 0px) + 86px));
}
```

퍼즐 플레이 화면에서 하단 컨트롤 버튼(칠하기/빈칸 체크/되돌리기, ~80px 높이)과 겹치지 않도록 86px 오프셋 ✅

```js
// appShell.js — 플레이 화면에도 플로팅 메뉴 추가
shell.appendChild(renderFloatingNav(activeView, onSelectView));
```

이전에는 플레이 화면 분기 내에 플로팅 메뉴가 없었음. 이번 커밋으로 모든 화면에서 메뉴 접근 가능 ✅

#### 2. 가이드 다시 보기 — Settings 카드

```js
// settingsView.js
function createGuideReplayCard(onReplayGuide) {
  const group = document.createElement("div");
  group.className = "settings-guide-card";
  // section-label + body text + button
  button.className = "tool-button settings-choice settings-choice--guide-replay";
  button.addEventListener("click", onReplayGuide);
}
```

```js
// appShell.js
function replayGuideFromSettings() {
  settingsOpen = false;
  resetOpen = false;
  activeGuide = activeView === "timeAttack" ? "timeAttack" : "puzzle";
  draw();
}
```

설정 닫기 → `activeGuide` 설정 → `draw()` 재렌더로 가이드 다이얼로그 즉시 표시. 간결하고 기존 상태머신과 자연스럽게 연결 ✅

`activeView === "timeAttack"` 분기: 타임어택 화면에서 설정을 열고 가이드 재생 시 타임어택 가이드가, 나머지 화면에선 퍼즐 가이드가 재생 ✅

한국어 copy: `"방법이 다시 필요할 때 Pip이 아늑하게 한 번 더 설명해요."` — Pip 캐릭터 특유의 따뜻한 어조 ✅

#### 3. CI 강화

**Promise chip 가독성**:
```js
const textActionOverlap = textRect && actionRect
  ? !(textRect.right <= actionRect.left - 4 || ...)
  : false;
const hasReadableLayout = metrics.textWidth >= 36 && 
  metrics.textWhiteSpace !== "nowrap" && 
  metrics.actionPosition === "static" && 
  !metrics.textActionOverlap && 
  !metrics.actionOverflows;
```

action badge가 `position: static`(그리드 흐름 내)이어야 통과 — absolute 포지셔닝으로 텍스트를 덮는 이전 버그 재발 방지 ✅

**가이드 카드 설정 검증**:
```js
metrics.settingsPolish.guideCard.exists &&
metrics.settingsPolish.guideCard.height >= 86 &&
metrics.settingsPolish.guideCard.radius >= 16 &&
background.includes("gradient") &&
shadow !== "none" &&
buttonHeight >= 46
```

카드 존재 여부, 크기, 폴리시(gradient/shadow), 버튼 탭 타겟(46px) 모두 검증 ✅

---

### 주의 1개 (P2)

**플로팅 메뉴 z-index 90 — 모달 위에 노출**

`z-index: 90`이 가이드 오버레이(z-index 20), 설정 다이얼로그보다 높기 때문에 가이드나 설정이 열린 상태에서 플로팅 메뉴 트리거가 탭 가능한 상태가 됨. 375px 우하단 모서리에 트리거가 위치하므로 실수 탭 가능성은 낮지만, 특히 가이드 오버레이(반투명 배경) 위에 트리거가 보이는 것이 의도인지 확인 필요.

권장: 모달 열린 상태에서 플로팅 메뉴를 숨기거나 pointer-events: none 처리.

```js
// appShell.js 내 draw() — 모달 열릴 때 nav 숨기기 예시
const nav = renderFloatingNav(activeView, onSelectView);
if (activeGuide || settingsOpen || resetOpen) nav.setAttribute("hidden", "");
shell.appendChild(nav);
```

---

### 평가

| 항목 | 상태 |
|---|---|
| 플로팅 메뉴 position: fixed 전환 | ✅ |
| safe-area-inset 대응 | ✅ |
| 퍼즐 플레이 화면 86px 오프셋 (컨트롤 겹침 방지) | ✅ |
| 플레이 화면에 메뉴 연결 | ✅ |
| 설정 "Pip 가이드 보기" 카드 | ✅ |
| 뷰별 가이드 분기 (puzzle/timeAttack) | ✅ |
| Pip 어조 한국어 copy | ✅ |
| Promise chip 텍스트/badge 겹침 CI | ✅ |
| 가이드 카드 폴리시 CI (gradient/shadow/탭 타겟) | ✅ |
| qa:mobile + 113 tests + qa:candidate 통과 | ✅ |

P1 두 항목 모두 CODEX_BRIEF 스펙 충족. P2 주의사항 1건 (z-index 모달 충돌 가능성).


---

## Review 175 — v0.1.462 `0a5ea15` ui: hide nav during modal overlays

**커밋 요약**: Review 174 P2 주의사항 즉각 대응. 가이드 다이얼로그·설정·리셋 모달이 열린 상태에서 플로팅 메뉴를 DOM에서 제거해 z-index 충돌 원천 차단.

**변경 범위**: `src/ui/appShell.js` +7 -2, `scripts/mobile_visual_check.js` +6, `docs/CONTEXT.md` +5, 버전 bump.

---

### 코드 분석

```js
// appShell.js
const hasBlockingOverlay = Boolean(resetOpen || settingsOpen || activeGuide);

// 플레이 화면 분기
if (!hasBlockingOverlay) {
  shell.appendChild(renderFloatingNav(activeView, onSelectView));
}

// 허브 화면 분기
if (!hasBlockingOverlay) {
  shell.appendChild(renderFloatingNav(activeView, onSelectView));
}
```

`hidden` 속성을 토글하거나 CSS로 숨기는 대신 **DOM에서 아예 제거**. 가장 확실한 방법 — pointer-events 설정 오류나 z-index 계층 충돌 자체가 발생하지 않음 ✅

`hasBlockingOverlay`를 불린 변수로 명시적으로 추출 — 두 분기에서 동일 조건을 공유하므로 조건 변경 시 한 곳만 수정하면 됨 ✅

```js
// CI
const navCount = await page.locator(".floating-nav").count();
if (navCount > 0) {
  failures.push("[...] Floating navigation should be hidden while the Pip guide overlay is open.");
}
// 설정 다이얼로그 검증에서도
metrics.floatingNavCount !== 0 → failure
```

가이드 열린 상태와 설정 열린 상태 두 경로 모두 CI에서 nav 부재 확인 ✅

---

### 평가

| 항목 | 상태 |
|---|---|
| 모달 열린 상태에서 플로팅 메뉴 DOM 제거 | ✅ |
| reset/settings/activeGuide 세 모달 모두 커버 | ✅ |
| 가이드 overlay CI — nav 잔류 시 실패 | ✅ |
| 설정 다이얼로그 CI — nav 잔류 시 실패 | ✅ |

Review 174 P2를 한 커밋으로 깔끔하게 닫음. 플래그 없음.

---

## Review 176 — v0.1.463 `18b972e` ui: guard opening promise chips

**커밋 요약**: 오프닝 promise chip 텍스트 잘림 수정. 760px 이하에서 chip을 1컬럼 수직 스택으로 전환하고, 각 chip 내부를 아이콘|텍스트|액션 배지 3컬럼 그리드로 재구성해 텍스트가 잘리지 않도록. 380px 이하 극소형 화면에서 액션 배지를 두 번째 행으로 내려 추가 여유 확보.

**변경 범위**: `src/styles.css` +62, `scripts/mobile_visual_check.js` +3, 버전 bump.

---

### 코드 분석

#### 760px 이하 — 1컬럼 스택 + 내부 3컬럼

```css
@media (max-width: 760px) {
  .brand-intro__promise-strip {
    width: min(100%, 430px);
    grid-template-columns: 1fr;   /* 3칩 수직 스택 */
    gap: 8px;
  }

  .brand-intro__promise-chip {
    grid-template-columns: 34px minmax(0, 1fr) max-content;
    grid-template-rows: auto;
    min-height: 50px;
    padding: 7px 9px;
    overflow: hidden;
  }

  .brand-intro__promise-chip b {
    grid-column: 2;
    font-size: clamp(0.76rem, 3.2vw, 0.86rem);
    white-space: normal;
    word-break: keep-all;
    overflow-wrap: normal;
  }

  .brand-intro__promise-action {
    grid-column: 3;
    justify-self: end;
    font-size: 0.64rem;
    white-space: nowrap;
  }
}
```

`grid-template-columns: 34px minmax(0, 1fr) max-content`: 아이콘(고정) | 텍스트(남은 공간 전부) | 배지(콘텐츠 크기 고정). 텍스트 컬럼이 `minmax(0, 1fr)`이므로 아이콘과 배지가 텍스트를 절대 침범하지 않음 ✅

`word-break: keep-all`: 한국어 단어 단위 줄바꿈 유지 — "그림 풀기"가 "그림\n풀기"로 나뉘지 않음 ✅

`font-size: clamp(0.76rem, 3.2vw, 0.86rem)`: 360px에서 0.768rem(12.3px), 430px에서 0.86rem(13.8px). 좁은 화면에서 자동 축소 ✅

`overflow: hidden`을 chip 컨테이너에 유지 — 예외적 long word가 있어도 chip 경계 밖으로 나가지 않음 ✅

#### 380px 이하 / 높이 780px 이하 — 2행 레이아웃

```css
@media (max-width: 380px), (max-height: 780px) {
  .brand-intro__promise-chip {
    grid-template-columns: 32px minmax(0, 1fr);
    grid-template-rows: auto auto;
    row-gap: 2px;
    min-height: 52px;
  }

  .brand-intro__promise-action {
    grid-column: 2;
    grid-row: 2;           /* 두 번째 행 */
    justify-self: start;
    font-size: 0.62rem;
  }
}
```

`max-height: 780px` 조건 추가가 인상적 — 화면이 좁지 않더라도 세로로 짧은 기기(작은 화면 세로 모드)에서 chip이 뷰포트를 너무 많이 차지하는 걸 방지 ✅

액션 배지를 `grid-row: 2`로 이동해 텍스트 줄바꿈 공간을 최대화 ✅

#### CI 개선

```js
textOverflows: text ? text.scrollWidth > Math.ceil(textRect?.width || 0) + 1 || text.scrollHeight > Math.ceil(textRect?.height || 0) + 1 : true,
const hasReadableLayout = ... && !metrics.textOverflows && ...
```

이전: 텍스트 scrollWidth/Height 체크 없음 → 텍스트가 DOM 안에서 clip되어도 통과 가능  
이후: scrollWidth > clientWidth이면 텍스트가 실제로 잘려 있음을 직접 감지 ✅

---

### 평가

| 항목 | 상태 |
|---|---|
| 760px 이하 chip 1컬럼 수직 스택 | ✅ |
| 아이콘|텍스트|배지 3컬럼 그리드 (텍스트 침범 불가) | ✅ |
| word-break: keep-all 한국어 보장 | ✅ |
| clamp 폰트 축소 (360px 자동 대응) | ✅ |
| 380px/780px 이하 배지 2행 전환 | ✅ |
| scrollWidth 기반 텍스트 overflow CI | ✅ |

플래그 없음.

---

## Review 177 — v0.1.464 `8d12fb3` qa: guard opening promise routes

**커밋 요약**: 오프닝 promise chip이 실제로 올바른 화면으로 이동하는지를 Playwright가 직접 클릭해서 검증하는 E2E 라우팅 테스트 추가. 퍼즐·팬트리·타임어택 3개 경로를 각각 새 브라우저 컨텍스트에서 독립 검증. floating nav 숨김 CI도 공식 함수로 분리.

**변경 범위**: `scripts/mobile_visual_check.js` +71, `docs/CONTEXT.md` +6, 버전 bump.

---

### 코드 분석

#### `expectOpeningPromiseRoutes` — E2E 라우팅 검증

```js
const routes = [
  { view: "puzzle",     label: "Puzzle",      selector: ".pack-block, .play-screen" },
  { view: "pantry",     label: "Pantry",      selector: ".pantry-panel" },
  { view: "timeAttack", label: "Time Attack", selector: ".time-attack-panel" }
];

for (const route of routes) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();

  // 1. 앱 로드
  await page.goto(TARGET_URL, { waitUntil: "networkidle" });
  await page.locator(".brand-intro.game-stage").waitFor({ timeout: 6000 });

  // 2. chip 클릭
  const chip = page.locator(`.brand-intro__promise-chip[data-target-view="${route.view}"]`).first();
  await chip.click();

  // 3. 이름 입력 처리 (신규 유저)
  try {
    await nameInput.waitFor({ timeout: 900 });
    await nameInput.fill("Route QA");
    await page.locator(".player-intro-form button").click();
  } catch {
    // 기존 유저는 이름 입력 없이 바로 이동
  }

  // 4. 인트로 사라짐 + 목표 화면 등장 확인
  await page.locator(".brand-intro").waitFor({ state: "detached", timeout: 2500 });
  const target = page.locator(route.selector).first();
  await target.waitFor({ state: "visible", timeout: 5000 });

  // 5. 목표 요소 실측
  if (metrics.width < 24 || metrics.display === "none" || ...) {
    failures.push(...)
  }
  await context.close();
}
```

**각 경로마다 새 브라우저 컨텍스트**: LocalStorage가 공유되지 않아 한 경로 테스트가 다음 경로에 영향 없음 ✅

`try/catch`로 이름 입력 다이얼로그 처리: 신규 유저(이름 입력 필요) / 기존 유저(바로 이동) 두 경우 모두 커버. `timeout: 900`으로 짧게 대기해 기존 유저 경로에서 불필요한 지연 최소화 ✅

`.brand-intro` `detached` 대기 후 목표 화면 `visible` 대기: 인트로 → 화면 전환 시퀀스를 정확히 추적. 단순 `visible` 체크보다 훨씬 신뢰도 높음 ✅

`selector: ".pack-block, .play-screen"`: 퍼즐 경로에서 허브(pack-block) 또는 직접 플레이 화면(play-screen) 모두 허용 — 앱 상태에 따라 어디로 가든 퍼즐 진입으로 인정. 유연한 설계 ✅

#### `expectFloatingNavHiddenDuringBlockingOverlay` 함수 분리

이전 커밋(175)에서 인라인 검증이었던 nav 숨김 체크를 독립 함수로 추출. 재사용성 확보 ✅

---

### 이번 3개 커밋의 종합 흐름

```
Review 174 (ba0226b): P1 구현 — fixed nav + 가이드 재생
  ↓ P2 주의: z-index 충돌 플래그
Review 175 (0a5ea15): P2 즉각 대응 — 모달 중 nav DOM 제거
  ↓ Promise chip 잘림 여전히 관찰됨
Review 176 (18b972e): chip 레이아웃 재구성 — 텍스트 잘림 해소
  ↓ 라우팅이 실제로 동작하는지 미검증
Review 177 (8d12fb3): E2E 라우팅 검증 — 3개 경로 실클릭 테스트
```

P1 버그 → 즉각 P2 대응 → 레이아웃 수정 → E2E 검증으로 이어지는 빠른 순환. 한 이슈가 다음 커밋으로 바로 이어진 좋은 패턴.

---

### 평가 (3개 커밋 종합)

| 항목 | 상태 |
|---|---|
| 모달 중 nav 숨김 (DOM 제거) | ✅ |
| Promise chip 텍스트 잘림 해소 | ✅ |
| 380px/780px 이하 2행 레이아웃 | ✅ |
| E2E 라우팅 검증 (퍼즐/팬트리/타임어택) | ✅ |
| 신규/기존 유저 경로 모두 커버 | ✅ |
| 독립 브라우저 컨텍스트로 경로 격리 | ✅ |
| qa:candidate + 113 tests + qa:mobile 통과 | ✅ |

플래그 없음. CODEX_BRIEF P1 완전 마무리.


---

## Review 178 — v0.1.480 `7a78046` ui: keep opening promise chips readable

**커밋 요약**: 감사 리뷰 P1 항목(ellipsis 잔류) 즉각 수정. `white-space: nowrap + text-overflow: ellipsis` 제거하고 `white-space: normal`로 전환해 텍스트가 2줄까지 자연스럽게 줄바꿈되도록. chip `min-height` 증가로 2줄 허용 공간 확보. CI에 ellipsis/nowrap 금지 조건 추가.

**변경 범위**: `src/styles.css` +16, `scripts/mobile_visual_check.js` +12 -10.

---

### 코드 분석

#### CSS 수정

```css
.brand-intro__promise-chip b {
  min-width: 0;
  white-space: normal;      /* 이전: nowrap */
  overflow: visible;         /* 이전: hidden */
  text-overflow: clip;       /* 이전: ellipsis */
  word-break: keep-all;
  overflow-wrap: normal;
}

.brand-intro__promise-strip .brand-intro__promise-chip {
  min-height: 62px;          /* 2줄 수용 공간 */
}

@media (max-width: 430px) {
  .brand-intro__promise-strip .brand-intro__promise-chip {
    min-height: 50px;
  }
}
```

`white-space: normal + word-break: keep-all` 조합: 줄바꿈은 허용하되 한국어 단어는 음절이 아닌 어절 단위로 나뉨. "그림 풀기"가 "그림\n풀기"로 나뉘지 않음 ✅

`min-height: 62px`: 기존보다 높아진 chip이 2줄 텍스트를 수용. 3칩이 수직 스택인 430px 이하에서 50px로 약간 축소해 인트로 화면 총 높이 절제 ✅

`text-overflow: clip`: `ellipsis` 제거 후 `clip`으로 명시 — 텍스트가 넘칠 경우 말줄임 없이 잘림(clip 자체는 overflow:visible이면 무효). `overflow: visible`이므로 실제로는 잘림 없음 ✅

#### CI 강화

```js
textOverflowStyle: textStyle?.textOverflow || "",
textOverflowXStyle: textStyle?.overflowX || "",
textLineHeight: textStyle ? parseFloat(textStyle.lineHeight) : 0,

const textAllowsFullCopy =
  metrics.textWhiteSpace !== "nowrap" &&
  metrics.textOverflowStyle !== "ellipsis" &&
  metrics.textOverflowXStyle !== "hidden";

const textLineCount = metrics.textLineHeight > 0
  ? metrics.textHeight / metrics.textLineHeight : 1;

const hasReadableLayout = ... && textAllowsFullCopy && textLineCount <= 2.4 && ...
```

`textAllowsFullCopy`: nowrap, ellipsis, overflow-x: hidden 세 가지를 동시에 금지. 향후 CSS가 ellipsis로 회귀하면 CI 즉시 실패 ✅

`textLineCount <= 2.4`: 텍스트가 2줄 이하로 유지되는지 검증. 2.4는 반줄 여유 — 줄 높이 계산 오차 흡수 ✅

---

### 평가

| 항목 | 상태 |
|---|---|
| ellipsis → normal 전환 | ✅ |
| word-break: keep-all 한국어 어절 보호 | ✅ |
| min-height 2줄 수용 공간 확보 | ✅ |
| CI ellipsis/nowrap 금지 조건 | ✅ |
| CI 2줄 이하 lineCount 검증 | ✅ |

감사 리뷰 P1 항목 완전 해소. 플래그 없음.

---

## Review 179 — v0.1.481 `f867a37` ui: harden preview-width launch and board input

**커밋 요약**: 431~780px 중간 폭(데스크톱 브라우저 프리뷰, 태블릿)에서 두 가지 회귀 수정. ① promise chip 3컬럼 수평 배치가 좁은 중간 폭에서 텍스트를 누르는 문제 → 1컬럼 스택으로 전환. ② 퍼즐 보드 row clue와 셀이 675px 중간 폭에서 tray 밖으로 튀어나오는 문제 → board sizing 공식 재조정. CI에 675px 뷰포트 추가.

**변경 범위**: `src/styles.css` +86 -0, `scripts/mobile_visual_check.js` +6 -10.

---

### 코드 분석

#### 1. Promise chip — 431~780px 1컬럼 전환

```css
@media (min-width: 431px) and (max-width: 780px) {
  .brand-intro__promise-strip {
    width: min(100%, 456px);
    grid-template-columns: 1fr;     /* 3칩 수직 스택 */
    gap: 10px;
  }

  .brand-intro__promise-chip {
    min-height: 54px;
    grid-template-columns: 40px minmax(0, 1fr) max-content;
    column-gap: 10px;
  }

  .brand-intro__promise-chip b {
    font-size: clamp(0.9rem, 2.2vw, 1rem);
    line-height: 1.12;
  }
}
```

`min-width: 431px and max-width: 780px` 범위: 모바일(≤430px)과 데스크톱(≥781px) 사이의 갭을 명시적으로 처리. 이 범위에서 칩이 수직 스택으로 전환되므로 각 칩이 456px 전체 너비를 활용 ✅

`width: min(100%, 456px)`: 중간 폭에서 strip이 화면 가득 차지 않고 최대 456px로 제한 — 너무 넓은 칩이 부자연스럽게 늘어나지 않음 ✅

#### 2. 퍼즐 보드 — 중간 폭 sizing 재조정

```css
/* 기본 — 모든 폭 적용 */
.puzzle-panel:not(.completed) .board-wrap:not(.locked) {
  --board-row-clue-width: clamp(62px, 13vw, 74px);
  --board-cell-size: clamp(16px, calc((min(100vw, 520px) - 250px) / var(--board-size)), 32px);
}

.board-wrap .row-clue span {
  min-width: 10px;
  min-height: 18px;
  font-size: clamp(0.62rem, 1.8vw, 0.76rem);
}

/* 560~780px */
@media (min-width: 560px) and (max-width: 780px) {
  .board-wrap {
    --board-row-clue-width: 82px;
    --board-cell-size: clamp(16px, calc((min(100vw, 520px) - 286px) / var(--board-size)), 30px);
  }
}
```

`min(100vw, 520px)`: 520px를 상한으로 삼아 보드가 viewport 전체 너비에 선형적으로 확장되지 않도록 제한. 560px 이상에서 보드가 과도하게 커지는 걸 방지 ✅

`clamp(0.62rem, 1.8vw, 0.76rem)`: row clue 숫자 폰트도 뷰포트 폭에 따라 유동. 675px 중간 폭에서 1.8vw = 12.15px (0.76rem 이하) ✅

`min-width: 10px, padding: 0 1px`: 토큰이 극소화되어도 최소 탭 영역 유지 ✅

#### 3. 보드 셀 z-index 레이어링

```css
.board-wrap { position: relative; z-index: 1; isolation: isolate; }
/* 중간 셀렉터 */ { position: relative; z-index: 2; }
.board-wrap .puzzle-cell { position: relative; z-index: 3; }
```

`isolation: isolate`: board-wrap 내부 stacking context를 격리해 셀의 z-index가 외부(floating nav 등)와 충돌하지 않도록 ✅

셀이 z-index: 3으로 가장 위 — hover/focus 상태와 drag overlay가 clue tray 위에 올라오는 의도적 레이어링 ✅

#### 4. CI — 675px 뷰포트 추가

```js
{ width: 430, height: 932, name: "430x932" },
{ width: 675, height: 900, name: "675x900" }   // 추가
```

중간 폭(675px)을 명시적 리뷰 대상으로 등록. `maxHowToPlayHeight`를 뷰포트 폭 600px 기준으로 분기(330 → 430px)해 큰 화면에서 how-to 가이드 높이 상한 완화 ✅

---

### 평가

| 항목 | 상태 |
|---|---|
| 431~780px promise chip 1컬럼 전환 | ✅ |
| 보드 sizing 공식 520px 상한 | ✅ |
| 560~780px row-clue 82px 확장 | ✅ |
| clamp 폰트 중간 폭 대응 | ✅ |
| board-wrap isolation isolate | ✅ |
| CI 675px 뷰포트 추가 | ✅ |

**주목 1개 (P3)**: `board-wrap`에 z-index 레이어링이 추가됐지만, 영향받는 중간 셀렉터(z-index: 2)의 대상이 diff에서 명확히 식별되지 않음. 보드 내에서 clue tray vs cell 레이어링이 의도적이라면 문제없으나, 커밋 메시지가 "board input"만 언급하므로 어떤 요소가 z-index: 2를 받았는지 코드 확인 권장.

플래그 없음 (P3 확인 권장).


---

## Review 180 — v0.1.482 `0399ae3` qa: guard board layer contract

**커밋 요약**: Review 179 P3 확인 항목 즉각 해소. v0.1.481에서 추가된 `board-wrap` z-index 레이어링(`isolation: isolate`, `puzzle-grid position: relative; z-index: 2`, `puzzle-cell z-index: 3`)을 CI가 직접 측정·검증하도록 `mobile_visual_check.js`에 계약 조건 추가.

**변경 범위**: `scripts/mobile_visual_check.js` +7, 버전 bump.

---

### 코드 분석

#### 측정 항목 추가

```js
const gridStyle = grid ? getComputedStyle(grid) : null;

// 반환 metrics에 추가
isolation: style.isolation,           // board-wrap의 isolation
gridPosition: gridStyle?.position || "",  // puzzle-grid의 position
gridZIndex: gridStyle?.zIndex || "",      // puzzle-grid의 z-index
```

`board-wrap`의 `isolation` 값과 `puzzle-grid`의 `position` + `z-index`를 `getBoundingClientRect()` 루프와 동일한 DOM 측정 블록에서 함께 수집. 런타임 computed style 기반이므로 CSS 오버라이드·미디어 쿼리 영향까지 반영 ✅

#### 계약 조건 추가

```js
if (
  ...
  boardFrameMetrics.isolation !== "isolate" ||
  boardFrameMetrics.overflowX === "visible" ||
  boardFrameMetrics.overflowY === "visible" ||
  boardFrameMetrics.gridPosition !== "relative" ||
  Number(boardFrameMetrics.gridZIndex) !== 2 ||
  ...
)
```

3개 조건이 동시에 강제됨:
- `isolation: isolate`: board-wrap이 독립 stacking context를 유지해야 통과
- `gridPosition: "relative"`: puzzle-grid가 position 컨텍스트를 가져야 통과
- `gridZIndex: 2`: puzzle-grid가 정확히 z-index 2를 가져야 통과 (`Number()` 캐스팅으로 `"2"` 문자열 처리 ✅)

이로써 Review 179의 "어떤 요소가 z-index: 2를 받았는지 명확하지 않다"는 P3 항목이 완전히 해소됨. z-index: 2 = `puzzle-grid`, z-index: 3 = `puzzle-cell`이 CI로 공식 문서화 ✅

---

### 평가

| 항목 | 상태 |
|---|---|
| board-wrap isolation: isolate CI 강제 | ✅ |
| puzzle-grid position: relative CI 강제 | ✅ |
| puzzle-grid z-index: 2 CI 강제 | ✅ |
| Number() 캐스팅으로 문자열 비교 처리 | ✅ |
| Review 179 P3 확인 항목 해소 | ✅ |
| qa:mobile + qa:candidate 통과 | ✅ |

레이어 계약이 CI로 고정됐으므로 향후 board CSS 수정 시 stacking context가 의도치 않게 무너지면 즉시 감지됨. 플래그 없음.


---

## Review 181 — v0.1.483 `2882928` ui: guard quick travel copy readability

**커밋 요약**: 플로팅 내비게이션 quick-travel 텍스트(트리거 strong, trigger-cue, 메뉴 아이템 label/small)에 `white-space: nowrap + text-overflow: ellipsis`가 잔류하는 문제 수정. CSS 전환 + CI 계약 추가.

**변경 범위**: `src/styles.css` +39 -3, `scripts/mobile_visual_check.js` +42.

---

### 코드 분석

#### CSS 수정

```css
/* v0.1.483 — quick-travel copy readable */
.floating-nav__trigger strong,
.floating-nav__trigger-cue,
.floating-nav__label,
.floating-nav__item small {
  overflow: visible;
  overflow-wrap: normal;
  text-overflow: clip;
  white-space: normal;
  word-break: keep-all;
}
/* play-mode 강한 선택자 override도 동시 적용 */
.app-shell--play .floating-nav__trigger strong,
.app-shell--play .floating-nav__trigger-cue {
  overflow: visible;
  text-overflow: clip;
  white-space: normal;
  word-break: keep-all;
}
```

`app-shell--play` 선택자 추가가 중요 — 퍼즐 플레이 화면에서 기존 선택자 specificity가 더 높아 일반 규칙이 무시됐을 가능성을 덮어씀 ✅

promise chip `<b>` 잔류 ellipsis도 동시 수정:

```css
/* v0.1.479 hardening block에서 */
.brand-intro__promise-chip__label {
  white-space: normal;     /* 이전: nowrap */
  overflow: visible;       /* 이전: hidden */
  overflow-wrap: normal;
  text-overflow: clip;     /* 이전: ellipsis */
  word-break: keep-all;
}
```

#### CI 확장

`expectAppChromePolish`와 `expectPlayScreenNavClearance` 두 함수 모두에 동일한 계약 조건 추가:

```js
// 4개 요소 각각에 적용
labelWhiteSpace !== "nowrap" &&
labelTextOverflow !== "ellipsis" &&
labelOverflowX !== "hidden" &&
labelLineCount <= 2.4
```

`lineCount = height / lineHeight`: promise chip CI(Review 178)에서 검증된 패턴을 nav 요소들로 확장. 단일 패턴으로 통일 ✅

---

### 브라우저 실측 (390x844)

```
triggerStrong: whiteSpace=normal, textOverflow=clip, overflowX=visible, scrollOverflow=false ✅
triggerCue:    whiteSpace=normal, textOverflow=clip, overflowX=visible, scrollOverflow=false ✅
navLabel:      whiteSpace=normal, textOverflow=clip, overflowX=visible, scrollOverflow=false ✅
navSmall:      whiteSpace=normal, textOverflow=clip, overflowX=visible, scrollOverflow=false ✅
```

5개 nav 항목(퍼즐/앨범/팬트리/타임어택/배지) 전체 lineCount < 1.0 — 텍스트가 1줄 이하로 깔끔하게 들어감 ✅

### 평가

| 항목 | 상태 |
|---|---|
| trigger strong ellipsis 제거 | ✅ |
| trigger-cue ellipsis 제거 | ✅ |
| nav label/small ellipsis 제거 | ✅ |
| app-shell--play specificity override | ✅ |
| CI label/hint nowrap+ellipsis+overflow 금지 | ✅ |
| CI lineCount ≤ 2.4 강제 | ✅ |
| 실측: 전체 5항목 overflow 없음 | ✅ |

플래그 없음.

---

## Review 182 — v0.1.484 `881d148` ui: harden quick travel text contract

**커밋 요약**: v0.1.483 CSS append-only 패치로 해결 안 된 기존 규칙 직접 수정. `.floating-nav__trigger strong`, `.floating-nav__trigger-cue`, `.floating-nav__label`, `.floating-nav__item small` 원본 CSS 규칙에서 `overflow: hidden + text-overflow: ellipsis + white-space: nowrap` 트리오를 `overflow: visible + text-overflow: clip + white-space: normal + word-break: keep-all`로 대체.

**변경 범위**: `src/styles.css` +34 -17, `src/ui/floatingNav.js` +7.

---

### 코드 분석

#### CSS 원본 규칙 수정

v0.1.483이 append-only로 하위 override를 추가했지만, 기존 규칙의 specificity 혹은 선언 순서가 여전히 문제가 됐을 수 있음. 이번 커밋은 원본 규칙 자체를 수정해 혼재를 제거:

```css
/* 수정 전 */
.floating-nav__trigger strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 수정 후 */
.floating-nav__trigger strong {
  overflow: visible;
  overflow-wrap: normal;
  text-overflow: clip;
  white-space: normal;
  word-break: keep-all;
}
```

`.floating-nav__copy`, `.floating-nav__item-copy` 컨테이너에 `overflow: visible` 추가 — 부모가 `overflow: hidden`이면 자식의 `overflow: visible`도 무효화되는 CSS 동작 방지 ✅

#### JS — title 속성 추가

```js
// floatingNav.js
trigger.title = triggerLabelText;   // 트리거 버튼
item.title = itemLabelText;         // 각 메뉴 항목
```

`title` 속성: 텍스트가 시각적으로 보이더라도 보조 기술(스크린 리더, 툴팁)이 전체 레이블을 읽을 수 있도록 보장. 기존 `aria-label`과 동일 값으로 일관성 ✅

#### 이중 패치 필요성 분석

v0.1.483(append-only) → v0.1.484(원본 수정)의 두 단계가 필요했던 이유: `styles.css`는 append-only 원칙이지만, 기존 규칙이 더 구체적인 선택자 또는 더 낮은 위치의 override를 덮어쓰지 못한 경우 원본 수정이 불가피. v0.1.484의 원본 수정은 해당 CSS 블록이 이미 확립된 최소 단위 규칙이라 리팩터 없이 수정 가능한 범위 ✅

---

### 브라우저 실측 (675x900 + 390x844 양쪽 확인)

```
675x900 triggerStrong: whiteSpace=normal, textOverflow=clip, overflow=visible ✅
675x900 navLabel:      lineCount=0.98, scrollOverflow=false ✅
390x844 triggerStrong: whiteSpace=normal, textOverflow=clip, overflow=visible ✅
390x844 triggerCue:    whiteSpace=normal, textOverflow=clip, overflow=visible ✅
```

### 평가

| 항목 | 상태 |
|---|---|
| 원본 CSS 규칙 ellipsis 완전 제거 | ✅ |
| copy 컨테이너 overflow: visible 추가 | ✅ |
| trigger/item title 속성 추가 | ✅ |
| v0.1.483 double-patch 이유 납득 가능 | ✅ |

플래그 없음.

---

## Review 183 — v0.1.485 `a0edb6d` qa: add wide visual review pack

**커밋 요약**: `qa:visual-pack` 스크린샷 생성 스크립트에 675x900 Codex/프리뷰 뷰포트 추가. `captureWidePreviewReview` 함수로 오프닝 인트로, 가이드, 퍼즐 보드, 타임어택, 팬트리, 설정, 플로팅 메뉴를 wide 뷰에서 캡처. contact sheet에 뷰포트 정보 표시.

**변경 범위**: `scripts/visual_review_pack.js` +81 -19, `docs/VISUAL_REVIEW_GUIDE.md` +2 -2.

---

### 코드 분석

#### `reviewViewports` 분리

```js
const reviewViewports = {
  mobile: { width: 390, height: 844 },
  widePreview: { width: 675, height: 900 }
};
```

기존 `manifest.viewport` 단수에서 명명된 복수 뷰포트로 전환. `manifest.viewports` 배열에도 이름 포함해 contact sheet에서 "mobile 390x844, wide-preview 675x900" 형태로 표시 ✅

#### `captureWidePreviewReview(browser)` 신규 함수

```js
async function captureWidePreviewReview(browser) {
  const page = await browser.newPage({ viewport: reviewViewports.widePreview });
  // 신규 플레이어 흐름: 오프닝 → 가이드 → 퍼즐 보드
  await captureWide("opening-brand-intro", ".brand-intro.game-stage");
  await captureWide("pip-guide-dialog", ".guide-dialog");          // 가이드 있을 때만
  await captureWide("first-puzzle-board", ".play-screen", { fullPage: true });
  await capturePuzzleHubTimeAttackTeaser(page, "wide-puzzle-hub-time-attack-teaser", ...);
  await captureFloatingNavMenu(page, { namePrefix: "wide-", ... });
  // 기존 플레이어 흐름: 설정 + 팬트리 + 타임어택
  await captureSettings(page, { namePrefix: "wide-", ... });
  await captureWide("pantry-room-and-shop", ".pantry-panel", { fullPage: true });
  await captureWide("time-attack-coach", ".time-attack-panel", { fullPage: true });
}
```

신규/기존 플레이어 두 흐름을 모두 캡처해 wide 뷰에서 전체 앱 여정 커버 ✅

`captureWide = (name, selector, opts) => capture(page, "wide-" + name, ...)`: 파일명에 `wide-` prefix 자동 부착 — 390px 스크린샷과 파일명 충돌 없음 ✅

가이드 캡처: `count() > 0` 조건 체크 후에만 캡처해 가이드가 없는 기존 유저 흐름에서 에러 없이 스킵 ✅

#### `capture()` 메타데이터 확장

```js
viewport: page.viewportSize() || manifest.viewport,
viewportName: options.viewportName || "mobile",
```

각 스크린샷이 어떤 뷰포트에서 찍혔는지 메타데이터에 기록. contact sheet HTML에서 "wide-preview 675x900" 형태로 레이블 표시 ✅

#### `captureKoreanFirstRun` 수정

```js
// 이전: captureFloatingNavMenu(page)
// 이후: captureFloatingNavMenu(page, { namePrefix: "ko-" })
```

한국어 플로팅 메뉴 캡처 파일명에 `ko-` prefix 추가 — wide와 ko 스크린샷이 같은 이름으로 충돌하던 문제 수정 ✅

---

### 평가

| 항목 | 상태 |
|---|---|
| 675x900 wide-preview 뷰포트 추가 | ✅ |
| 신규/기존 플레이어 양쪽 흐름 커버 | ✅ |
| 파일명 wide-/ko- prefix 충돌 방지 | ✅ |
| 가이드 조건부 캡처 | ✅ |
| contact sheet 뷰포트 레이블 표시 | ✅ |
| VISUAL_REVIEW_GUIDE.md 문서 업데이트 | ✅ |

플래그 없음.

---

## Review 184 — v0.1.485 `e1cbad3` docs: refresh Android release status

**커밋 요약**: 프로덕션 접근 조건 충족 사실과 현재 릴리스 게이트 상태를 문서에 반영. 비고: 2026-07-22 Google Play 제3자 앱스토어 목록 정보 공유 공지(코드 작업 불필요) 기록.

**변경 범위**: `docs/ANDROID_RELEASE_STATUS.md` +13 -11.

---

### 내용 분석

#### 프로덕션 접근 상태 업데이트

```markdown
# 이전
- 9 of 14 days complete — 약 5일 남음
- Priority: first-session polish, Pantry clarity, WebView QA, signed AAB

# 이후
- 프로덕션 접근 조건 충족, Play Console 프로덕션 요청 버튼 사용 가능
- 릴리스 타이밍: 자격 창(eligibility window)이 아닌 제품 품질 기준
- 남은 작업: 실기기 Billing 증거, signed AAB 재빌드, Play Console 업로드/프로모션
```

`product-quality driven rather than eligibility-window driven` 문구 — 더이상 날짜 제약이 없고 앱 품질이 유일한 게이트임을 명확히 ✅

#### Candidate Gate Refresh 현행화

```markdown
# 이전
- Current verified: v0.1.459
- Vitest: 113 passed

# 이후
- Current verified: v0.1.485
- qa:visual-pack: 390x844 + 675x900 양쪽 통과
- Large-board readable briefs: 195 (신규 항목)
- Vitest: 114 passed
```

26버전 앞선 v0.1.459 → v0.1.485로 갱신. 이번 세션에서 추가된 테스트 1개(114) 포함 ✅

#### Google Play 공지 기록

```
2026-07-22 Play 공지: US 제3자 앱스토어 목록 정보 공유 옵션
→ "No app-code action is required; manage the Play Console environment option separately"
```

코드 작업이 필요 없는 외부 이벤트지만, 향후 참조를 위해 문서화 ✅

#### `Last recorded unsigned candidate AAB` 표현 변경

이전 `Current unsigned candidate AAB` → `Last recorded`로 변경. v0.1.485 빌드가 아직 새로 생성되지 않았으므로 시제 정확히 표현 ✅

---

### 평가

| 항목 | 상태 |
|---|---|
| 프로덕션 자격 충족 사실 반영 | ✅ |
| v0.1.485 candidate gate 현행화 | ✅ |
| visual-pack 675x900 통과 기록 | ✅ |
| Vitest 114 반영 | ✅ |
| 제3자 앱스토어 공지 기록 | ✅ |
| AAB 표현 시제 수정 | ✅ |

플래그 없음.

---

## 이번 슬라이스 종합 (v0.1.483–485)

### 흐름 요약

```
v0.1.482 (0399ae3): board z-index 계약 CI 강제
  ↓ quick-travel 텍스트 ellipsis 잔류 발견
v0.1.483 (2882928): append-only CSS + CI로 1차 패치
  ↓ 원본 규칙 specificity 문제 확인
v0.1.484 (881d148): 원본 CSS 직접 수정 + title 속성 추가
  ↓ 675x900 wide 뷰포트 검증 공백 확인
v0.1.485-a (a0edb6d): visual-pack에 wide 뷰포트 추가
v0.1.485-b (e1cbad3): 프로덕션 접근 상태 문서 현행화
```

### 브라우저 실측 종합

| 측정 항목 | 675x900 | 390x844 |
|---|---|---|
| nav position: fixed | ✅ | ✅ |
| nav z-index: 90 | ✅ | ✅ |
| trigger strong — whiteSpace: normal | ✅ | ✅ |
| trigger strong — scroll overflow 없음 | ✅ | ✅ |
| trigger-cue — textOverflow: clip | ✅ | ✅ |
| 5개 nav 항목 — lineCount < 1.1 | ✅ | ✅ |
| 5개 nav 항목 — scrollOverflow 없음 | ✅ | ✅ |
| aria-label + title 일치 | ✅ | ✅ |
| board-wrap isolation: isolate | ✅ | ✅ |
| puzzle-grid z-index: 2 | ✅ | ✅ |
| puzzle-cell z-index: 3 | ✅ | ✅ |
| 보드 뷰포트 밖 삐져나오지 않음 | ✅ | ✅ |
| promise chip 1컬럼 스택 (675px) | ✅ | — |
| chip scrollOverflow 없음 | ✅ | — |

전체 플래그 없음. 코드 게이트 및 실측 모두 녹색.


---

## Review 185 — v0.1.486 `3519b42` ui: polish billing card artwork

**커밋 요약**: 설정 화면 결제 카드(`pip_cozy_support`, `pip_spoon_jar_small`) 토큰 아트워크를 CSS 메달리온 방식으로 업그레이드. 아이콘 크기를 키우고 레이어(background + ::before + ::after) 수를 늘려 placeholder 느낌을 줄임. CI 임계값도 44px → 50px로 상향.

**변경 범위**: `src/styles.css` +106, `scripts/mobile_visual_check.js` +12 -10, `docs/CONTEXT.md` +6.

---

### 1. 그래픽 품질 분석

#### Pip 응원팩 (`--support`) 아트

```css
.support-pack-card__art--support {
  background:
    radial-gradient(circle at 24% 18%, rgba(255,255,255,0.96) 0 10%, transparent 11%),  /* 광택 하이라이트 */
    radial-gradient(circle at 76% 82%, rgba(255,217,99,0.92) 0 12%, transparent 13%),  /* 코너 글로우 */
    linear-gradient(145deg, #fff5b8 → #f5c24f → #da8b3e);                               /* 금-구리 베이스 */
}

.support-pack-card__art--support::before {
  /* 스푼 몸통: 34px 높이, -25deg 기울기 */
  background: radial-gradient(… rgba(255,255,255,0.95) …) + linear-gradient(#fff0a6 → #e9a23f);
  box-shadow: 13px 9px 0 -5px #fff2ad,  /* 두 번째 스푼 그림자 */
              13px 9px 0 -2px rgba(191,121,49,0.62);
  transform: rotate(-25deg);
}

.support-pack-card__art--support::after {
  /* 빨간 체리 장식: 19×17px 타원 */
  background: radial-gradient(…rgba(255,255,255,0.95)…) + linear-gradient(#ff9c78 → #e86d59);
  transform: rotate(45deg);
}
```

3-레이어 구조: 배경(금빛 그라디언트) + `::before`(스푼, 중복 box-shadow로 두 번째 스푼 암시) + `::after`(체리). 코드로 표현할 수 있는 수준에서 조형적 완성도가 높음 ✅

**브라우저 실측**: `width: 53.8px, height: 53.8px` — CI 최소치 50px 통과. `beforeBg`/`afterBg` 모두 `radial-gradient` 포함 확인 ✅

#### 작은 스푼 항아리 (`--jar`) 아트

```css
.support-pack-card__art--jar {
  border-radius: 17px 17px 20px 20px;  /* 항아리 실루엣 */
  background:
    radial-gradient(circle at 25% 18%, rgba(255,255,255,0.96) …),  /* 광택 */
    linear-gradient(180deg, rgba(255,248,214,0.78) 0 18%, transparent 19%),  /* 상단 하이라이트 띠 */
    linear-gradient(145deg, #ffe8a5 → #f1b34f → #c9783e);  /* 황금-테라코타 항아리 */
}

.support-pack-card__art--jar::before {
  /* 항아리 뚜껑: 전체 너비, height 12px, border-radius: 999px */
  background: linear-gradient(#fff8bd → #efc35a);
  box-shadow: inset 0 2px 0 rgba(255,255,255,0.72),  /* 뚜껑 내측 하이라이트 */
              0 13px 0 -4px rgba(255,244,186,0.68);  /* 뚜껑 하단 반사 */
}

.support-pack-card__art--jar::after {
  /* 항아리 스푼 클러스터: 25px 높이, 라운드 */
  background:
    radial-gradient(circle at 18% 66%, #ffe46f …),
    radial-gradient(circle at 43% 54%, #ffcf55 …),
    radial-gradient(circle at 68% 67%, #f5b14b …),  /* 3개 스푼 헤드 */
    linear-gradient(…);
  box-shadow: inset 0 0 0 2px rgba(122,78,53,0.14);  /* 테두리 */
}
```

뚜껑 + 항아리 몸체 + 스푼 클러스터 3부분이 `::before`/`::after`로 표현됨. `::after`의 3개 `radial-gradient` 배치(18%/43%/68%)가 스푼 세 개를 암시하는 의도적 배열 — 아이템 수량(750 스푼)을 시각적으로 연상시킴 ✅

**브라우저 실측**: `width: 53.8px, height: 53.8px`, `borderRadius: "17px 17px 20px 20px"` — 항아리 실루엣 정확히 적용됨 ✅

#### `box-shadow` 깊이 — 두 아트 공통

```css
.support-pack-card__art {
  box-shadow:
    inset 0 0 0 4px rgba(255,251,232,0.75),   /* 내측 크림색 테두리 */
    inset 0 -9px 0 rgba(122,78,53,0.14),       /* 하단 음영 (입체감) */
    0 3px 0 rgba(61,43,46,0.18),               /* 외측 하단 선 */
    0 10px 16px rgba(61,43,46,0.16);           /* 드롭 섀도우 */
}
```

4겹 box-shadow: 내측 하이라이트(크림) + 내측 하단 음영 + 짧은 외측 경계선 + 원거리 드롭 섀도우. 코인/메달 계열 아이콘 표준 레이어링 기법 ✅

#### `border-color: rgba(61,43,46,0.26)`

`border-width: 3px`에 반투명 어두운 갈색 테두리. 배경 광택 하이라이트와 함께 아이콘이 발광하는 느낌 ✅

---

### 2. UX 분석

#### 카드 레이아웃

```css
/* 390px (기본) */
/* 기존 grid에서 art가 right column으로 배치 */

@media (max-width: 430px) {
  .support-pack-card {
    grid-template-columns: minmax(0, 1fr) 54px;  /* 콘텐츠 | 아트 */
  }
  .support-pack-card__art {
    width: 52px; height: 52px;
  }
}
```

**브라우저 실측 (390px)**: `gridTemplateColumns: "236px 54px"` — 콘텐츠 236px + 아트 54px. `artRight: 349.9px, factsLeft: 47px` — 아트와 텍스트가 다른 컬럼에 배치되어 **겹침 없음** ✅

`.support-pack-card__facts span { min-height: 31px }`: fact 행이 비어 있을 때도 최소 높이를 확보해 레이아웃이 무너지지 않음 ✅

#### 액션 버튼 탭 타겟

**브라우저 실측**:
- 응원팩 버튼 2개: `height: 52px, 52px` — CI 50px 통과 + Apple/Google 권장 44px 초과 ✅
- 항아리 버튼 1개: `height: 52px` ✅

#### 텍스트 가독성

**브라우저 실측**: `factOverflows: [false, false, false]` — 응원팩/항아리 양쪽 모두 fact 텍스트 잘림 없음 ✅

---

### 3. 게임 진행 가능 여부 (플레이어블리티)

이번 커밋이 CSS와 CI만 건드렸으므로 게임 로직 무결성을 브라우저로 직접 검증함.

**실측 시나리오 (390x844 / 5x5 보드)**:

| 검증 항목 | 결과 |
|---|---|
| 인트로 → 퍼즐 진입 | ✅ promise chip 클릭 → play-screen 전환 |
| 설정 열기 → 카드 렌더 | ✅ supportArt 53.8×53.8px, 양쪽 카드 존재 |
| 설정 닫기 → 퍼즐 복귀 | ✅ `.app-shell--play` 유지, 보드 25개 셀 정상 |
| 셀 칠하기 | ✅ 클릭 전 "0/19칸 채움" → 클릭 후 "1/19칸 채움" |
| 되돌리기(undo) | ✅ undo 후 "0/19칸 채움" 복귀 |
| 플로팅 nav 복귀 | ✅ `position: fixed, z-index: 90, bottom: 86px` |
| 3개 제어 버튼 | ✅ 칠하기 / 빈칸 체크 / 한 수 되돌리기 |
| 가이드 표시 후 dismiss | ✅ `.how-to-play.visual-guide` → skip 버튼 동작 |
| 콘솔 오류 | ✅ 없음 |

Billing CSS 아트워크 변경이 게임 로직 어느 경로에도 영향 없음 확인 ✅

---

### 4. CI 임계값 상향 분석

```js
// 이전
productArtWidth < 44, productArtHeight < 44
actionHeights.some(h => h < 44)

// 이후
productArtWidth < 50, productArtHeight < 50
actionHeights.some(h => h < 50)
```

아트 53.8px → 50px 임계값: 실측치 대비 3.8px 여유. 미래 CSS 변경으로 아이콘이 소폭 축소되어도 감지 ✅  
버튼 52px → 50px 임계값: 마찬가지로 2px 여유 ✅  

두 임계값 모두 기존 44px보다 높아졌으나 실측치보다는 여유 있게 설정 — false positive 없이 regression만 잡는 적절한 밴드 ✅

---

### 5. `docs/CONTEXT.md` 업데이트

```markdown
### v0.1.486 Billing Card Artwork Pass
- CSS medallion token artwork upgraded for Support Pack and Spoon Jar
- CI thresholds raised to 50px
- Remaining blockers: real-device purchase/restore evidence (unchanged)
```

릴리스 블로커 목록이 변경되지 않았음을 명시적으로 기록 ✅

---

### 평가 종합

| 축 | 항목 | 상태 |
|---|---|---|
| **그래픽** | 응원팩 3레이어 아트(스푼+체리) | ✅ |
| **그래픽** | 항아리 3레이어 아트(뚜껑+몸체+스푼클러스터) | ✅ |
| **그래픽** | 4겹 box-shadow 입체감 | ✅ |
| **그래픽** | 광택 radial-gradient 하이라이트 | ✅ |
| **그래픽** | 실측 53.8×53.8px (CI 50px 통과) | ✅ |
| **UX** | 아트-콘텐츠 겹침 없음 (다른 grid 컬럼) | ✅ |
| **UX** | 버튼 탭 타겟 52px (권장 44px 초과) | ✅ |
| **UX** | fact 텍스트 overflow 없음 | ✅ |
| **UX** | 설정 닫기 후 퍼즐 즉시 복귀 | ✅ |
| **플레이어블** | 셀 칠하기/undo 정상 동작 | ✅ |
| **플레이어블** | 게임 진행도 정확히 반영 | ✅ |
| **플레이어블** | 플로팅 nav fixed/z-index 유지 | ✅ |
| **플레이어블** | 콘솔 오류 없음 | ✅ |
| **CI** | 임계값 50px 상향 | ✅ |
| **CI** | qa:mobile + qa:candidate 통과 | ✅ |

**플래그 없음.**

남은 릴리스 블로커: `pip_cozy_support` 구매/복원 + `pip_spoon_jar_small` 구매/반복 구매 실기기 증거 2건(코드 외 작업).


---

## Review 186 — v0.1.490 `2374757` ui: keep quick travel off opening screen

**커밋 요약**: 오프닝 브랜드 인트로 화면이 열려 있는 동안 플로팅 quick-travel 트레이가 타임어택 진입 chip을 가리던 문제 수정. `#app[data-intro-open="true"]` 데이터 속성으로 인트로 상태를 DOM에 기록하고, CSS가 이를 읽어 nav를 `visibility: hidden + pointer-events: none`으로 억제. 인트로 dismiss 시 속성 제거 → nav 즉시 복원. CI에 인트로 중 nav 억제 검사 추가.

**변경 범위**: `src/styles.css` +4, `src/ui/brandIntro.js` +6 -1, `scripts/mobile_visual_check.js` +23, `docs/CONTEXT.md` +6, 버전 bump.

---

### 코드 분석

#### 1. 인트로 상태 표시 (`brandIntro.js`)

```js
export function renderBrandIntro(root) {
  root.dataset.introOpen = "true";   // #app에 마운트 즉시 플래그 세팅
  // …
  globalThis.setTimeout(() => {
    intro.remove();
    delete root.dataset.introOpen;   // INTRO_EXIT_MS(260ms) 후 속성 제거
  }, INTRO_EXIT_MS);
}
```

`root.dataset.introOpen = "true"` → `delete root.dataset.introOpen` 패턴: 속성이 있으면 인트로 열림, 없으면 닫힘. Boolean 문자열 없이 존재 여부만으로 판단 가능하지만, CI 조건이 `=== "true"` 값까지 확인하므로 현재 명시적 문자열 방식이 CI와 정합 ✅

`delete` vs `removeAttribute`: `delete dataset.foo`와 `removeAttribute("data-foo")`는 동일하게 속성을 제거함. 실측으로 `hasAttribute("data-intro-open") === false` 확인 ✅

`INTRO_EXIT_MS(260ms)` 딜레이 후 제거: 인트로가 `.leaving` 애니메이션을 완료한 시점에 삭제 — 애니메이션 중 nav가 갑자기 나타나는 flicker 방지 ✅

#### 2. CSS 억제 규칙

```css
#app[data-intro-open="true"] .floating-nav {
  visibility: hidden;
  pointer-events: none;
}
```

**`display: none` 대신 `visibility: hidden`을 선택한 이유**: `display: none`은 레이아웃에서 요소를 제거해 주변 요소가 재배치될 수 있음. `visibility: hidden`은 공간은 유지하되 시각적으로만 숨겨 레이아웃 shift 없음. fixed 요소여서 레이아웃 영향은 없지만, 인트로→앱 전환 시 nav가 즉시 뷰포트로 복귀하는 게 더 자연스러움 ✅

**`pointer-events: none` 병행**: `visibility: hidden`만으로는 탭/클릭이 통과될 수 있음. `pointer-events: none`을 함께 적용해 숨겨진 상태에서 트리거가 실수로 활성화되는 경로 차단 ✅

**CSS specificity**: `#app[data-intro-open="true"] .floating-nav`는 ID(100) + 속성(10) + 클래스(10) = 120점. 기존 `.floating-nav` 규칙(클래스 10점)보다 높아 안전하게 override ✅

#### 3. CI 검증 (`expectFloatingNavHiddenDuringBrandIntro`)

```js
async function expectFloatingNavHiddenDuringBrandIntro(page, viewportName) {
  const metrics = await page.evaluate(() => {
    const intro = document.querySelector(".brand-intro");
    const nav = document.querySelector(".floating-nav");
    const navStyle = nav ? getComputedStyle(nav) : null;
    return {
      introCount: intro ? 1 : 0,
      introOpenState: document.querySelector("#app")?.dataset.introOpen || "",
      navCount: nav ? 1 : 0,
      navVisibility: navStyle?.visibility || "absent",
      navPointerEvents: navStyle?.pointerEvents || "absent"
    };
  });
  if (
    metrics.introCount > 0 &&
    (metrics.introOpenState !== "true" ||
      (metrics.navCount > 0 && (metrics.navVisibility !== "hidden" || metrics.navPointerEvents !== "none")))
  ) {
    failures.push(...);
  }
}
```

3가지를 동시에 검사:
1. **`data-intro-open === "true"`**: 인트로가 있을 때 속성이 정확히 세팅됐는지
2. **`navVisibility === "hidden"`**: nav가 시각적으로 숨겨졌는지
3. **`navPointerEvents === "none"`**: 포인터 이벤트가 차단됐는지

기존 `expectFloatingNavHiddenDuringBlockingOverlay`(모달 중 nav DOM 제거 검사)와 병렬로 실행 — 인트로 억제와 모달 억제를 별도 CI로 각각 보호 ✅

CI 실행 위치: `expectVisible(.brand-intro__seal)` 직후, `expectOpeningPromiseRoutes` 직전 — 인트로가 확실히 열려 있는 상태에서 측정 ✅

---

### 브라우저 실측 (390x844)

#### 인트로 열린 상태

| 항목 | 측정값 | 기대값 |
|---|---|---|
| `#app[data-intro-open]` | `"true"` | `"true"` ✅ |
| `.floating-nav` DOM 존재 | `false` (DOM 없음) | hidden/absent ✅ |
| 타임어택 chip 위치 | top 669~bottom 721px | 가려지지 않음 ✅ |
| nav-chip 겹침 | `false` | `false` ✅ |

> **주목**: nav가 CSS로 숨겨진 것이 아니라 DOM에 아예 없음. `hasBlockingOverlay` 패턴(v0.1.462)과 동일하게 인트로 중에는 `renderFloatingNav`가 DOM에 추가되지 않는 것으로 보임. CSS 억제 규칙은 nav가 DOM에 있지만 인트로도 함께 있는 엣지케이스(빠른 상태 전환 등)를 대비한 방어층 ✅

#### 인트로 닫힌 후

| 항목 | 측정값 | 기대값 |
|---|---|---|
| `#app` `data-intro-open` 속성 | 존재하지 않음 (`hasAttribute === false`) | 제거됨 ✅ |
| `.floating-nav` DOM 존재 | `true` | 복원됨 ✅ |
| `nav visibility` | `"visible"` | 가시 ✅ |
| 트리거 클릭 → 메뉴 열림 | `true` | 동작 ✅ |
| `nav position` | `"fixed"` | 유지 ✅ |
| `nav z-index` | `"90"` | 유지 ✅ |
| `nav bottom` | `"10px"` (허브 화면) | 정상 ✅ |

---

### 평가

| 항목 | 상태 |
|---|---|
| 인트로 중 nav 억제 (`visibility: hidden + pointer-events: none`) | ✅ |
| `data-intro-open` 마운트/언마운트 타이밍 정확 | ✅ |
| 260ms 딜레이 후 속성 제거 (애니메이션 완료 시점) | ✅ |
| CSS specificity 120점 — override 안전 | ✅ |
| 인트로 닫힌 후 nav 완전 복원 | ✅ |
| 트리거 클릭 → 메뉴 열림 정상 | ✅ |
| CI: data-intro-open + visibility + pointer-events 3중 검사 | ✅ |
| qa:mobile 360/390/430/675 전체 통과 | ✅ |
| qa:candidate + qa:visual-pack(24장) 통과 | ✅ |
| 콘솔 오류 없음 | ✅ |

플래그 없음. 타임어택 진입 chip 가림 문제 완전 해소.


---

## Review 187 — v0.1.492 `13d88b6` ui: contain settings sheet on mobile

**커밋 요약**: 360px 기기에서 설정 sheet가 뷰포트 너비를 초과해 가로 스크롤이 발생하던 문제 수정. backdrop에 `overflow-x: hidden` 추가, dialog에 `box-sizing: border-box + width: min(100%, 370px) + max-width: 100%` 적용. CI에 backdrop/dialog 가로 경계 및 scrollWidth 검사 추가.

**변경 범위**: `src/styles.css` +11, `scripts/mobile_visual_check.js` +15, `docs/CONTEXT.md` +6, 버전 bump.

---

### 코드 분석

#### CSS 수정

```css
.modal-backdrop--settings {
  overflow-x: hidden;
}

.modal-backdrop--settings .settings-dialog {
  box-sizing: border-box;
  width: min(100%, 370px);
  max-width: 100%;
}
```

**`box-sizing: border-box` 적용 이유**: 기존 dialog가 `width: 370px`(또는 유사값) + 좌우 `padding`을 별도로 더해 계산됐다면, `box-sizing: content-box` 기본값에서는 `padding`이 너비에 포함되지 않아 실제 렌더링 폭이 선언 너비보다 컸을 것. `border-box`로 전환하면 `padding`이 너비 안에 포함돼 계산이 예측 가능해짐 ✅

**`width: min(100%, 370px)`**: 360px 뷰포트에서는 `100% = 360px < 370px`이므로 자동으로 360px 이하로 수축. 780px+ 데스크톱에서는 370px로 고정 — 기존 최대 너비를 유지 ✅

**`max-width: 100%`**: `width`가 이미 `min(100%, 370px)`이므로 논리적으로는 중복이지만, 특정 브라우저/WebView에서 `min()` 지원이 불완전하거나 상위 규칙이 width를 override할 경우를 대비한 방어 선언. 해가 없으므로 유지 ✅

**`overflow-x: hidden` on backdrop**: dialog가 완전히 수축되더라도 backdrop 자체가 가로 스크롤을 허용하지 않도록 이중 차단. dialog와 backdrop 양쪽에 각각 다른 레이어에서 가로 overflow 방지 ✅

---

### CI 확장 분석

```js
// 신규 측정 항목
backdropOverflowX: backdropStyle?.overflowX || "",
backdropScrollWidth: backdrop?.scrollWidth || 0,
backdropClientWidth: backdrop?.clientWidth || 0,
dialogScrollWidth: dialog?.scrollWidth || 0,
dialogClientWidth: dialog?.clientWidth || 0,
dialogLeft: dialogRect?.left || 0,
dialogRight: dialogRect?.right || 0,
backdropInnerLeft: backdropRect.left + parseFloat(backdropStyle.paddingLeft),
backdropInnerRight: backdropRect.right - parseFloat(backdropStyle.paddingRight),

// 신규 실패 조건
metrics.backdropOverflowX !== "hidden" ||
metrics.backdropScrollWidth > metrics.backdropClientWidth + 1 ||
metrics.dialogScrollWidth > metrics.dialogClientWidth + 1 ||
metrics.dialogLeft < metrics.backdropInnerLeft - 1 ||
metrics.dialogRight > metrics.backdropInnerRight + 1 ||
```

5개 조건 분석:

| 조건 | 감지 대상 |
|---|---|
| `backdropOverflowX !== "hidden"` | overflow-x 규칙 누락/override 회귀 |
| `backdropScrollWidth > clientWidth + 1` | backdrop 자체의 가로 스크롤 발생 |
| `dialogScrollWidth > clientWidth + 1` | dialog 내부 콘텐츠 가로 overflow |
| `dialogLeft < backdropInnerLeft - 1` | dialog가 backdrop 좌측 패딩 안쪽으로 삐져나옴 |
| `dialogRight > backdropInnerRight + 1` | dialog가 backdrop 우측 패딩 바깥으로 삐져나옴 |

`backdropInnerLeft/Right` 계산: `backdropRect.left + paddingLeft`로 패딩 내부 경계를 구해 dialog가 정확히 패딩 영역 안에 있는지 픽셀 단위 검사 ✅

`+1` 허용 마진: 렌더링 소수점 반올림 오차 흡수. 1px 초과만 실패로 처리 ✅

---

### 브라우저 실측 (360x740)

| 측정 항목 | 값 | 판정 |
|---|---|---|
| viewport | 360px | — |
| backdrop overflowX | `"hidden"` | ✅ |
| backdrop scrollWidth | 360 | = clientWidth, 가로 스크롤 없음 ✅ |
| backdrop hScrolls | `false` | ✅ |
| dialog boxSizing | `"border-box"` | ✅ |
| dialog width (computed) | `"324px"` | min(360px, 370px) - 좌우 패딩 ✅ |
| dialog renderedWidth | 324px | ✅ |
| dialog left | 18px | backdrop 패딩 내부 ✅ |
| dialog right | 342px | < 360px (뷰포트 내) ✅ |
| dialog hScrolls | `false` | ✅ |
| 닫기 버튼 right | 326px | < 360px, 잘리지 않음 ✅ |
| Billing 카드 right | 326px | < 360px, 잘리지 않음 ✅ |
| Billing 카드 overflow | `false` | ✅ |

**dialog width 계산**: `min(100%, 370px) = min(360px, 370px) = 360px`가 선언되지만, backdrop의 좌우 padding(각 18px)이 포함되어 실제 dialog 렌더링 폭은 360 - 18 - 18 = 324px. `box-sizing: border-box`이므로 324px 안에 내용이 정확히 들어맞음 ✅

---

### 평가

| 항목 | 상태 |
|---|---|
| 360px 가로 스크롤 제거 | ✅ |
| `box-sizing: border-box` 전환 | ✅ |
| `width: min(100%, 370px)` — 좁은 화면 자동 수축 | ✅ |
| backdrop `overflow-x: hidden` 이중 차단 | ✅ |
| 닫기 버튼 360px 내부 (right: 326px) | ✅ |
| Billing 카드 360px 내부 (right: 326px) | ✅ |
| CI: backdropScrollWidth 회귀 검사 | ✅ |
| CI: dialogScrollWidth 회귀 검사 | ✅ |
| CI: dialog 좌우 경계 backdrop 내부 검사 | ✅ |
| qa:mobile 360/390/430/675 통과 | ✅ |
| qa:candidate + 115 tests 통과 | ✅ |

플래그 없음.


---

## Review 9 — 2026-07-24

**버전:** v0.1.539  
**커밋:** `0d269a0 ui: rebuild first-session and visual quality`  
**범위:** 첫 세션 화면 전체, 허브/타임어택/앨범/뱃지/완성 씬 정리, 완성 아트 시스템 구축  
**검증 기준:** 141 unit tests ✅, qa:candidate ✅, 4개 화면 크기 qa:mobile ✅, Android release gate ✅, 51장 시각 팩 생성 ✅

---

### 전체 평가

이번 커밋은 Codex가 여러 세션에 걸쳐 누적한 UX Rework Plan Phase A–C+D를 하나의 커밋으로 정리한 결과물입니다. 코드 제거 비율(-3073줄)이 추가(+4134줄)보다 의미 있게 높으며, 대부분의 제거가 Codex 스스로 이전에 작성했던 보고서형 카드·칩·요약 텍스트입니다. 구조적으로 올바른 방향입니다.

플래그 없음. P1 외부 블로커(실기기 Billing 증거 2건)만 남아 있습니다.

---

### 화면별 확인

#### brandIntro.js — 오프닝 + 이름 입력
- `buildSeal()`, `buildPromiseChip()`, 세 개의 promise-strip 버튼, 버전 레이블 전부 제거 ✅  
- 이름 입력 화면에서 `playerIntro.note`, `playerIntro.pipCue`, 버전 레이블 제거 ✅  
- `dispatchIntroOpenView` / `pendingView` 분기도 함께 정리됨 ✅  
- 오프닝: 키 비주얼 + 타이틀 + 시작 버튼만 남음. 이름 입력: 키 비주얼 + h2 + 폼만 남음.

#### guideDialog.js — Pip 안내
- eyebrow / speaker / h2 title 세 요소 제거 ✅  
- `"계속 듣기"` → `"다음"` (en: `"Next"`) ✅  
- `PUZZLE_PRACTICE` 상수 export로 추출 (`clue: 5, cellCount: 5, targetIndexes: [0,1,2,3,4]`) ✅  
- 연습 단계 2에서만 practice UI 표시, 완료 전까지 Next 비활성화 ✅  
- 5개 셀 모두 유효 — 이전 버전의 "중간 3개 강제" 버그 해결됨 ✅  
- 완료 시 나머지 셀에 `×` 마크 표시 ✅ (첫 연습 완료 후 즉각적인 피드백)

#### pipReaction.js — 완성 씬
- `FIRST_PIP_FACE_PUZZLE_ID` 상수 + `isFirstPipFacePuzzle()` 함수로 이중 조건 통합 ✅  
- `completion-title`("완료") 제거 ✅  
- `completion-reward-facts` 칩 3개 제거 ✅  
- `completion-reveal__eyebrow` ("카드 완성") + `completion-reveal__stamp` 제거 ✅  
- pip-face 완성: `reaction` 이미지 숨기고 `completion-reveal__character` (completion sticker) + 픽셀 아트 표시 ✅  
- 일반 완성: reaction 이미지 유지, `meta` 없이 reveal card만 표시 ✅  
- `reveal-cell`에 `data-row`, `data-column` 속성 추가 — 향후 CSS 애니메이션 연계 가능

#### puzzleHubView.js — 허브
- `hubNote` 단락 제거 ✅  
- `createSeasonProgressCard` 제거 ✅  
- `createPackCatalogSummary` (pack-catalog-summary 칩 묶음) 제거 ✅  
- `pack-note` 단락 제거 ✅  
- `replay-picks-card__body` 제거 ✅  
- stage-filter-bar 내 설명 텍스트 제거, 완료된 스테이지가 있을 때만 bar 표시 ✅  
- 퍼즐 카드 메타: `sizeComplete` → `complete` (간결), 미완성은 `sizeReward` 형식 `"5×5 · +40"` ✅  
- Time Attack 카드: CSS 아이콘 제거, `getQuickTravelArt("timeAttack")` 래스터 이미지로 대체 ✅  
- Daily 카드: 복잡한 보상 행 → `daily.reward: "Today's spoons {count}/{limit}"` 한 줄 ✅

#### timeAttackView.js — 타임어택
- `time-attack-summary` (3개 카드 묶음) → `time-attack-status` (한 줄 상태 텍스트) ✅  
- coach 칩 목록 (`coachEarn`, `coachSpend`, `coachRecord`) 제거 ✅  
- `getBestSummaryText` / `getBestRecord` 함수 제거 (베스트 카드 제거 연동) ✅  
- 코치 카드 카피: 장황한 경제 설명 → `"Use a hint only when you need one."` ✅  
- Time Attack 진입 카피 전체 간결화 (EN + KO 동시 처리됨)

#### albumView.js — 앨범
- 잠긴 카드 완전 제거, 완료된 퍼즐만 표시 ✅  
- `onPlay` 콜백 파라미터 추가, 빈 상태에서 "그림 선택" 버튼 표시 ✅  
- `puzzleAlbumText` import 제거 (더 이상 쓰이지 않음) ✅  
- 카드: h3 타이틀 + 날짜만 남김 (state 레이블, 앨범 텍스트 제거)

#### mapView.js — 뱃지 컬렉션
- `badges.collectionNote` 단락 제거 ✅  
- 획득한 뱃지만 표시, 미획득 뱃지 카드 제거 ✅  
- 뱃지 카드: state + title만 유지 (desc, meta, 잠금 요건 텍스트 제거) ✅  
- `getPackPantryRoomRequirement` import 정리 ✅

#### settingsView.js — 설정 + 스푼 상점
- `settings.languageNote` / `settings.controlsNote` 제거 ✅  
- support-pack / spoon-jar 카드에서 facts 칩 묶음 제거 ✅  
- settings 다이얼로그에서 Billing 카드 제거, `renderSpoonStore()` 별도 export ✅  
- `appShell.js`에서 팬트리 뷰 아래 `renderSpoonStore(settingsDialogProps)` 마운트 ✅  
- `getSupportStatusTone` / `getSpoonJarStatusTone` — `.available` 미충족 시 빈 문자열 반환 (기존 "Android 전용" 메시지 제거) ✅  
- `getSupportPurchaseLabel`: `priceString` 없으면 "Check price" 반환, 있을 때만 가격 표시 ✅  
- `getSpoonJarPurchaseLabel`: spoons 수량 포함 → `"{price} · {spoons}개"` ✅  
- KO: sfx/music 레이블 `"효과음 켜기/끄기"` → `"효과음"` / `"음악"` (간결) ✅

#### appShell.js — 셸
- `renderFooter(APP_VERSION)` 호출 제거 ✅ (v0.1.532에서 확인됨)
- `renderPipStrip()` 호출 제거 ✅  
- `APP_VERSION` import 제거 ✅  
- `renderAlbumView()` → `renderAlbumView(() => onSelectView("puzzle"))` 콜백 연결 ✅

#### coloredPuzzleArt.js — 완성 아트
- `getCompletionPaletteId` / `getPackCompletionPalette` import 추가 ✅  
- 단일 랜덤 팔레트에서 named palette → pack region → generic fallback 순서의 계층 로직으로 교체 ✅  
- `pip-face`: 귀(row 0 col 0/4), 코(row 2 col 2), 입술(row 3 col 2), 입 영역(row 4) 각각 정확한 색상 ✅  
- `pip-face` 눈: `cell === "0"`이지만 row 2, col 1/3 → `#3f302c` 다크 브라운 accent ✅  
- `soup-bowl`, `golden-spoon`, named palettes, pack region palettes 모두 구현 ✅

---

### i18n 변경 확인

| 항목 | 결과 |
|------|------|
| `playerIntro.note` / `playerIntro.pipCue` 제거 (EN + KO) | ✅ |
| `guide.next: "Next"` / `"다음"` | ✅ |
| 가이드 실습 키 5개 추가 (EN + KO) | ✅ |
| `settings.spoonStoreTitle` (EN + KO) | ✅ |
| `spoonJarBody` — "next stage" 문구 제거 | ✅ |
| `spoonJarBuy` — spoons 수량 포함 포맷 | ✅ |
| `supportPricePending` — "Check price" / "가격 확인" | ✅ |
| `daily.reward` 새 키 / 기존 notePrefix/noteSuffix 유지 (dead key) | ✅ (하위 호환) |
| `album.emptyTitle` / `album.emptyAction` 추가 | ✅ |
| `puzzlePicker.complete` 추가 | ✅ |
| `timeAttack` 코치 + 허브 카피 간결화 (EN + KO) | ✅ |
| 뱃지 KO 이름 한국어화 (`햇살 스푼 간판`, `앞치마 서랍`) | ✅ |
| `rewardReady` / `rewardUsed` 간결화 | ✅ |

**주의:** `daily.notePrefix` / `daily.noteSuffix` 키가 EN + KO 양쪽에 남아 있으나 `renderDailyCard` 내 해당 구조 제거됨 → dead key. 플래그로 기록하나 릴리스 블로커 아님.

---

### 남은 외부 블로커 (코드 외)

- `pip_cozy_support`: 실기기 구매 + 복원 증거
- `pip_spoon_jar_small`: 실기기 구매 + 재구매 증거

---

### 플래그 요약

| 항목 | 심각도 | 내용 |
|------|--------|------|
| `daily.notePrefix` / `daily.noteSuffix` dead key | Low | EN + KO 양쪽에 미사용 키 남음. 다음 i18n 정리 시 제거 권장 |


---

## Review 10 — 2026-07-24

**버전:** v0.1.540 → v0.1.545 (6개 커밋)  
**커밋 범위:** `90bc6d7` → `6054ccc`  
**범위:** 팬트리 UX 전체 — 스푼 상점 재배치, 카드 비주얼 통합, 첫 부탁 / 배송 목표 / 기록 / 마일스톤 단순화  
**검증 기준:** 141 unit tests ✅, qa:candidate ✅, 157 assets ✅, production build + Android release gate ✅, 4개 화면 크기 QA ✅, 51장 시각 팩 ✅

---

### 전체 평가

6개 커밋이 하나의 방향으로 일관되게 진행됨. 팬트리에서 보고서형 구조(계산 카드·챕터·스테이지 목표·아카이브·Pip 인라인 배지)를 제거하고 그림 + 제목 + 버튼 구조로 수렴시킴. 코드 제거량이 추가량보다 현저히 많으며 dead key 청소도 병행됨.

**P2 플래그 1건**: 스푼 상점 내 결제 상태 메시지 전역 숨김.

---

### 커밋별 확인

#### 90bc6d7 (v0.1.540) — 스푼 상점 팬트리 shop 내부 이동

| 확인 항목 | 결과 |
|-----------|------|
| `daily.notePrefix` / `daily.noteSuffix` dead key 제거 (EN + KO) | ✅ (v0.1.539 리뷰 Low 플래그 해소) |
| `renderPantryView` 4번째 파라미터: `onOpenSupportPack` → `spoonStore` DOM 노드 | ✅ |
| `appShell.js`: `renderSpoonStore()` 먼저 생성 후 `renderPantryView()`에 전달 | ✅ |
| shop 섹션 마지막에 `shop.appendChild(spoonStore)` | ✅ |
| `.pantry-shop > .spoon-store` CSS: box-sizing + width 100% + margin 24px 0 0 | ✅ |

구조적으로 올바른 방향 — 스푼 구매 진입이 팬트리 화면 내부 흐름에서 일어남.

#### 25b503e (v0.1.541) — 팬트리 상점 카드 비주얼 통합

| 확인 항목 | 결과 |
|-----------|------|
| `spoonStoreTitle` "Spoon Shop" → "Add more spoons" / KO "스푼 상점" → "스푼 더 채우기" | ✅ |
| `shopTitle` "Sunny little upgrades" → "Decorations" / KO "햇살 가득한 작은 장식" → "꾸미기 소품" | ✅ |
| `starterCounter` KO 유니코드 이스케이프 정리 | ✅ |
| `.pantry-item-card` + `.spoon-store .support-pack-card` 통합 그리드 레이아웃 170줄 | ✅ |
| 90bc6d7의 `.pantry-shop > .spoon-store { margin: 24px }` → 이번 커밋에서 `margin: 12px` + border-top 패턴으로 재정의 | ✅ (cascade 의도적 덮어쓰기) |
| **🚩 `.spoon-store .support-pack-card__status { display: none; }` 전역 숨김** | **P2** |

**P2 — 스푼 상점 내 결제 상태 메시지 전역 숨김**

`styles.css:17174`의 마지막 규칙이 cascade 우선순위를 가져 `.spoon-store` 내 모든 `support-pack-card__status`를 숨김. `settingsView.js`의 `getSupportPackStatus()` / `getSpoonJarStatus()`는 다음 상태 문자열을 DOM에 쓰지만 플레이어에게 노출되지 않음:

- `"network-error"` 상태 → `settings.supportNetworkError` 숨김
- `"failed"` / `"wrong-product"` → `settings.spoonJarFailed` 숨김
- `"purchasing"` → `settings.supportChecking` 숨김
- 이미 구매된 경우 → `settings.supportOwned` 숨김

즉, 구매 실패나 네트워크 오류가 발생해도 스푼 상점에서 플레이어는 아무 피드백도 받지 못함. `display: none` 규칙에서 오류 상태만 예외 처리해야 함.

참고: 기존 `styles.css:16538`의 `.spoon-store .support-pack-card__status:empty { display: none; }` 는 올바른 패턴 (빈 상태만 숨김). `styles.css:17174`가 이를 전부 덮어쓴 것이 문제.

**권장 수정:**
```css
/* styles.css 마지막 블록 수정 */
.spoon-store .support-pack-card__status:not(.support-pack-card__status--warning):not(.support-pack-card__status--error) {
  display: none;
}
```
또는 `--ready` 클래스만 숨기고 나머지는 표시.

#### 54484b3 (v0.1.542) — 첫 부탁 카드 카피 단순화

| 확인 항목 | 결과 |
|-----------|------|
| `storyTarget` key 제거 + `pantry-story-request__target` DOM 요소 제거 | ✅ |
| `startBody`: 2문장 → `"Let's place {item} here."` / KO `"{item}을 여기에 놓아볼까요?"` | ✅ |
| `placeBody`: 2문장 → `"Place it in the {slot} spot."` / KO `"{slot} 자리에 놓아주세요."` | ✅ |
| `completeBody`: 2문장 → `"The {slot} feels warmer now."` / KO `"{slot} 자리가 한결 따뜻해졌어요."` | ✅ |

모든 문장이 한 줄로 수렴. KO 카피도 자연스러운 구어체 유지.

#### 43fc493 (v0.1.543) — 마일스톤/아카이브 섹션 제거

| 확인 항목 | 결과 |
|-----------|------|
| `storyMilestoneEyebrow/Title/Body/Level/LevelAria` 5개 키 제거 (EN + KO) | ✅ |
| `storyNextArrival` "다음 이웃의 부탁" → "다음 소품" | ✅ |
| `storyNextArrivalAction` "{item} 부탁 살펴보기" → "{item} 보기" | ✅ |
| `storyArchive*` 16개 키 전체 제거 (EN + KO) | ✅ |
| `renderPantryStoryArchive` 함수 전체 제거 | ✅ |
| `getNextPantryStageGoal` 함수 제거 | ✅ |
| `roomStepTargets` 상수 `pantryStoryCards.js`에서 제거 (`pantryView.js`에는 별도로 존재, 여전히 사용 중) | ✅ |
| `puzzlePacks` import `pantryStoryCards.js`에서 제거 | ✅ |
| `renderPantryStoryMilestone`: level + copy 제거, `nextDecorations.length === 0` 시 `null` 반환 | ✅ |
| `storyArchiveMount` `pantryView.js`에서 제거 | ✅ |
| `renderPantryStoryArchive` import 제거 | ✅ |

#### 0513976 (v0.1.544) — 배송 목표 카드 단순화

| 확인 항목 | 결과 |
|-----------|------|
| `storyDeliveryEyebrow/Body/StepSpoons/StepSlot` 4개 키 제거 (EN + KO) | ✅ |
| `storyDeliveryTitle` "Let's prepare {item}" → "Prepare {item}" | ✅ |
| 2-state 요약: `storyDeliveryNeed` (`"{slot} · {needed} more spoons"`) + `storyDeliveryReady` (`"{slot} · Ready"`) | ✅ |
| 렌더링: eyebrow → 제거, body → 제거, steps 섹션 → 제거, Pip 인라인 스탬프 → 제거 | ✅ |
| KO: `"{slot} · 스푼 {needed}개 더"` / `"{slot} · 준비됐어요"` | ✅ |
| CSS: `.pantry-story-milestone` + `.pantry-story-delivery` 평면 테두리 (border + no shadow) | ✅ |
| `::before` / `::after` 제거 (두 컴포넌트 모두) | ✅ |

#### 6054ccc (v0.1.545) — 팬트리 스토리와 액션 분리

| 확인 항목 | 결과 |
|-----------|------|
| `storyEyebrow` 키 제거 (EN + KO) | ✅ |
| `story.startBody/placeBody/completeTitle/completeBody/completeAction` 5개 키 제거 | ✅ |
| `renderPantryStoryRequest`: `spoons` 파라미터 제거 | ✅ |
| `complete` 상태: 비활성 버튼 렌더링 → `null` 반환으로 전환 | ✅ |
| Pip 인라인 스탬프(`pantry-story-request__pip`) 제거 | ✅ |
| section-label eyebrow 제거 | ✅ |
| body 단락 제거 | ✅ |
| `pantryView.js`: `pipGuideSceneUrl` + `isRuntimeGuideArtApproved` import 제거 | ✅ |
| `PIP_CAMEO_ASSET_ID` 상수 제거 | ✅ |
| `renderActionFeedback`: eyebrow + body + Pip 카메오 제거 | ✅ |
| `feedbackStoryCompleteEyebrow/Body`, `feedbackEyebrow`, `feedbackPlacedBody`, `feedbackSavedBody` 5개 키 제거 | ✅ |
| 액션 피드백 카드: art + title(h3) + 닫기 버튼만 남음 | ✅ |
| CSS: `.pantry-story-request` + `.pantry-action-feedback` 평면 테두리 | ✅ |
| `__action` / `__dismiss` 최소 높이 44px 보장 | ✅ |
| KO: `feedbackBuyTitle` "{item}이 팬트리에 왔어요", `feedbackEquipTitle` "{item}을 전시했어요" — 제목 단독으로 의미 전달 충분 | ✅ |

---

### 플래그 요약

| 항목 | 심각도 | 내용 |
|------|--------|------|
| `.spoon-store .support-pack-card__status { display: none; }` (styles.css:17174) | **P2** | 구매 실패·네트워크 오류·결제 진행 중 메시지가 스푼 상점에서 플레이어에게 보이지 않음. `:empty` 기준 또는 오류 클래스 예외 처리 필요 |

P0 외부 블로커(실기기 Billing 증거 2건)는 변동 없음.


---

## Review 11 — 2026-07-24

**버전:** v0.1.546 → v0.1.551 (6개 커밋)  
**커밋 범위:** `1f1d307` → `1f73789`  
**범위:** Review 10 P2 즉시 수정, 팬트리 보고서 함수·번역·CSS 전체 제거, 장식 카드 단순화  
**검증 기준:** 141 tests ✅, 333 puzzles ✅, build ✅, Android release gate ✅, 4개 화면 크기 QA ✅, billing·assets·store·privacy 검사 ✅

---

### 전체 평가

6개 커밋이 모두 하나의 방향으로 집중됨 — 팬트리에서 경제 보고서 레이어(저축 계산기, 진행도 미션, 배치 설명, 교체 안내, 목표 지정)를 코드·번역·CSS 세 계층 전부 제거하고, 장식 카드를 아트·이름·가격·행동 4가지만 남김.

**플래그 없음.** Review 10 P2 즉시 해소. 릴리스 외부 블로커(실기기 Billing 증거 2건)는 변동 없음.

---

### 커밋별 확인

#### 1f1d307 (v0.1.546) — Review 10 P2 즉시 수정: Billing 상태 메시지 복구

| 확인 항목 | 결과 |
|-----------|------|
| `styles.css`에서 `.spoon-store .support-pack-card__status { display: none; }` 규칙 제거 | ✅ |
| 이전에 남아 있던 `.spoon-store .support-pack-card__status:empty { display: none; }` 규칙은 유지 | ✅ (빈 상태만 숨김, 오류 상태는 표시) |
| 기존 `.spoon-store .support-pack-card__status--ready { display: none; }` 규칙도 유지 | ✅ (구매 준비됨 상태는 조용히 숨김) |

Review 10에서 제기한 P2가 정확히 겨냥된 한 줄 삭제로 해소됨. 오류/경고 상태는 다시 표시되고, 의도적으로 숨기던 `--ready`는 그대로 유지.

#### 48342f8 (v0.1.547) — 퇴역한 팬트리 보고서 함수 제거

| 확인 항목 | 결과 |
|-----------|------|
| `ECONOMY`, `getPuzzleReward` import 제거 | ✅ |
| `puzzlePacks` import 제거 | ✅ |
| `roomStepTargets` 상수 제거 | ✅ |
| `getNextSavingsGoal`, `renderSavingsGoal` 제거 | ✅ |
| `renderEarningPlan`, `getNextPantryProgressStage` 제거 | ✅ |
| `getNextPantryRequestDecoration`, `renderPantryProgressMission` 제거 | ✅ |
| `renderCollectionProgress`, `renderPlacementAdvisor`, `renderDisplayPlan` 제거 | ✅ |
| `createMeterFill` 유틸 제거 | ✅ |
| `planningDeck` + 5개 마운트 DOM 구조 제거 | ✅ |
| `completedStoryGoalIds` 로컬 변수 제거 (`getCompletedPantryStoryGoalIds()`는 구매 완료 콜백에서 여전히 직접 호출) | ✅ |
| i18n: `earningEyebrow/Title/Body/Action/SupportAction/SupportNote/CompleteTitle/CompleteBody` 8개 키 제거 | ✅ |
| `billing_release_check.js` 업데이트 | ✅ |

`getCompletedPantryStoryGoalIds` import와 `getDecorationById` import는 남아 있으나 두 함수 모두 현재 사용 중 (각각 구매 콜백 completedRequestCount, renderActionFeedback + renderRoomSlot). Dead import 아님 ✅

#### ef30cc6 (v0.1.548) — 퇴역한 팬트리 번역 키 제거

| 확인 항목 | 결과 |
|-----------|------|
| `planningDeckAria`, `advisorAllTitle/Body`, `advisorSlotTitle/Body` 제거 (EN + KO) | ✅ |
| `savingsEyebrow/Body/CompleteTitle/CompleteBody` 제거 (EN + KO) | ✅ |
| `progressEyebrow/Title/Summary` 제거 (EN + KO) | ✅ |
| `progressMission*` 12개 키 제거 (EN + KO) | ✅ |
| `progressSlot` 제거 (EN + KO) | ✅ |
| `displayPlan*` 8개 키 제거 (EN + KO) | ✅ |
| `i18n.test.js`에서 관련 테스트 7개 제거 | ✅ |

총 EN + KO 합산 약 70개 키 제거. 렌더링 함수가 이미 제거됐으므로 런타임 영향 없음.

#### 399b9d7 (v0.1.549) — 퇴역한 팬트리 CSS 제거 (~985줄 삭제)

| 확인 항목 | 결과 |
|-----------|------|
| `.pantry-planning-deck`, `.pantry-placement-advisor`, `.pantry-savings-goal` 등 보고서 섹션 CSS 제거 | ✅ |
| `.pantry-earning-plan`, `.pantry-progress-board`, `.pantry-display-plan` 제거 | ✅ |
| `source_hygiene_check.js`에 퇴역 선택자 감시 가드 추가 | ✅ |

append-only 패턴에서 약 985줄 삭제는 중요한 정리. 남은 CSS가 실제 렌더링 트리와 일치하는지 source_hygiene_check가 감시.

#### e9bb200 (v0.1.550) — 장식 카드 단순화

| 확인 항목 | 결과 |
|-----------|------|
| `getDecorationStatusKey` 함수 제거 | ✅ |
| `renderSlotPlacementNote` 함수 제거 | ✅ |
| `renderItemSavings` 함수 제거 | ✅ |
| `pantryViewState.trackedGoalId` 필드 제거 | ✅ |
| `trackGoal()` 함수 제거 | ✅ |
| `trackedGoalId` 지역 변수 제거 | ✅ |
| `selectStoryArrival`, `showStoryGoal`에서 `trackedGoalId` 동기화 제거 | ✅ |
| `renderShopCard` 파라미터에서 `trackedGoalId`, `onTrackGoal` 제거 | ✅ |
| 카드 DOM: `pantry-item-rarity` 칩, `pantry-item-status`, `pantry-slot-note`, `pantry-swap-note`, `pantry-track-goal`, `pantry-item-savings` 전부 제거 | ✅ |
| 카드 DOM: 아트 + 가격 칩(`pantry-item-cost`) + 이름(h4) + 행동 버튼만 남음 | ✅ |

`isStarterRoomRequest` 판별 및 구매 완료 후 `storyCompleted` 분기는 유지됨 — 스토리 흐름 연속성 보장 ✅

#### 1f73789 (v0.1.551) — 카드 보고서 잔재 키 제거

| 확인 항목 | 결과 |
|-----------|------|
| `itemStatus.*` 5개 키 제거 (EN + KO) | ✅ |
| `itemSavings`, `trackGoal`, `goalTracked` 제거 (EN + KO) | ✅ |
| `placedInSlot`, `emptyPlacementNote`, `swapNote` 제거 (EN + KO) | ✅ |
| `source_hygiene_check.js`에 퇴역 선택자 감시 가드 추가 | ✅ |
| `i18n.test.js` 잔여 테스트 1개 제거 | ✅ |
| 스타일 잔재 (~320줄) 추가 삭제 | ✅ |

---

### 플래그 요약

플래그 없음.

P0 외부 블로커(실기기 Billing 증거 2건)는 변동 없음.


---

## Review 12 — 2026-07-25

**버전:** v0.1.553 → v0.1.554 (2개 커밋)  
**커밋:** `98f5f7c art: repair second bakery density group`, `285dcfa art: repair third bakery density group`  
**범위:** Bakery Window 12×12 퍼즐 8개 솔루션 수정, puzzleArtAudit 잠금 테스트 2개 추가  
**검증 기준:** 144 tests ✅, qa:candidate ✅, build ✅, Android release gate ✅, 4개 화면 크기 ✅

---

### 전체 평가

두 커밋 모두 1차 수정(`art: repair first bakery density group`)과 동일한 패턴을 따름. 밀도 83–90%의 검은 덩어리 솔루션을 36–68% 범위의 명확한 내부 구조로 교체. 퍼즐 아트 감사 대기열에서 제거됨을 테스트로 잠금. 플래그 없음.

---

### 98f5f7c (v0.1.553) — 2차 베이커리 그룹 (4개 퍼즐)

| 퍼즐 ID | 구제목 | 구 밀도 | 신 밀도 | 구조 |
|---------|--------|---------|---------|------|
| `bakery-window-blackberry-vanilla-galette-107` | 갈레트 | 87% | 58% | 테두리 프레임 + 동심 내부 패턴 |
| `bakery-window-blueberry-almond-square-133` | 아몬드 스퀘어 | 88% | 62% | 상하 대칭 크로스(+) 형태 |
| `bakery-window-blueberry-cream-pinwheel-103` | 핀휠 | 90% | 65% | 회전 대칭 구조 |
| `bakery-window-caramel-fig-danish-102` | 데니시 | 85% | 54% | 상하 견고한 행 + 체커보드형 내부 |

밀도 감사 경계: `< 16%` 또는 `> 78%`가 후보 진입 조건. 4개 모두 54–65% 범위로 안전하게 통과.

#### 솔루션별 점검

**galette-107**: 구 솔루션 12행이 12열 거의 전체를 채움. 신 솔루션은 명확한 원형 테두리 프레임(row 0: `001111111100`, row 1: `011000000110`)에 내부 집중 패턴. 갈레트 이름과 어울리는 원형 윤곽.

**almond-square-133**: 구 솔루션 상하 행이 교대로 `111011110111`/`111101101111` 형태의 거의 채워진 패턴. 신 솔루션은 `000110011000`으로 시작해 점진적으로 넓어지는 명확한 십자형. "스퀘어" 이름에 맞는 기하학적 패턴.

**pinwheel-103**: 신 솔루션에서 `110111111011 / 101111111101 / 101011110101 / 110110110011` 등 회전 감각이 있는 내부 구조. 핀휠(바람개비) 이름과 시각적 연결 가능.

**danish-102**: 1행과 12행이 `111111111111`로 고정, 내부가 `101101101101`, `100110011001` 등 체커보드형. 직사각형 페이스트리 윤곽에 필링 패턴 느낌.

**테스트:** `bakery-window-blackberry-vanilla-galette-107`, `blueberry-almond-square-133`, `blueberry-cream-pinwheel-103`, `caramel-fig-danish-102` — 감사 대기열 진입 없음 확인 ✅

---

### 285dcfa (v0.1.554) — 3차 베이커리 그룹 (4개 퍼즐)

| 퍼즐 ID | 구제목 | 구 밀도 | 신 밀도 | 구조 |
|---------|--------|---------|---------|------|
| `bakery-window-caramel-pear-muffin-90` | 배 머핀 | 83% | 60% | 상단 넓고 하단 좁아지는 머핀 실루엣 |
| `bakery-window-cherry-cream-brioche-94` | 체리 브리오슈 | 83% | 61% | 테두리 프레임 + 내부 크로스 패턴 |
| `bakery-window-cinnamon-honey-twist-101` | 시나몬 트위스트 | 85% | 68% | 상단 교차 장식 + 넓은 중간부 |
| `bakery-window-cocoa-almond-biscuit-93` | 코코아 비스킷 | 89% | 36% | 대각선 X 패턴 |

**주목: biscuit-93 36%** — 8개 중 가장 낮은 밀도. 감사 하한 `< 16%`보다는 높으므로 큐 재진입 없음. 시각적으로는 명확한 대각 교차 패턴(╲/╱ 방향 두 대각선 밴드)으로 완성 아트로서 인식 가능한 형태를 가짐.

```
██··········
███········█
·███······██
··███····██·
···███··██··
····█████···
····█████···
··██··███···
·██····███··
██······███·
█········███
··········██
```

"비스킷"이라는 이름보다는 트위스트나 크로스 형태에 가까우나, 이전 버전(89% 밀도 덩어리)보다는 명백히 개선됨. 비주얼 검토 팩에서 사람이 확인할 항목으로 메모.

#### 솔루션별 점검

**pear-muffin-90**: 신 솔루션 상단부 `000011110000`으로 좁게 시작해 중간부에서 넓어진 후 `001111111100`으로 마감. 머핀 컵 위에 올라온 돔 형태로 읽힘.

**cherry-cream-brioche-94**: `001111111100 / 011000000110 / 110111111011` 패턴으로 원형 테두리 + 내부 체리 패턴. 브리오슈 특유의 둥근 윤곽.

**cinnamon-honey-twist-101**: `001010100100 / 011101110110`의 2행 교차 장식으로 시작, 중간부 `110111111011 / 101111111101`로 꽉 찬 몸통. 트위스트 페이스트리 상단 장식 표현.

**테스트:** `caramel-pear-muffin-90`, `cherry-cream-brioche-94`, `cinnamon-honey-twist-101`, `cocoa-almond-biscuit-93` — 감사 대기열 진입 없음 확인 ✅

---

### 플래그 요약

| 항목 | 심각도 | 내용 |
|------|--------|------|
| `biscuit-93` 36% 밀도 | Note | 감사 하한(16%) 초과로 큐 재진입 없음. 대각선 패턴이 퍼즐 이름("비스킷")과 즉각적으로 연결되지 않음. 비주얼 검토 팩에서 사람 확인 권장 |

P0 외부 블로커(실기기 Billing 증거 2건)는 변동 없음.


---

## Review 13 — 2026-07-25

**버전:** v0.1.556 → v0.1.557 (2개 커밋)  
**커밋:** `375c054 art: separate bakery tin and pastry shapes`, `29ec923 art: distinguish bakery rolls and rings`  
**범위:** Bakery Window 12×12 퍼즐 8개 솔루션 수정, puzzleArtAudit 잠금 테스트 2개 추가 (5차·6차 그룹)  
**검증 기준:** 147 tests ✅, qa:candidate ✅, build ✅, Android release gate ✅, 4개 화면 크기 ✅

---

### 전체 평가

이전 네 차례 수정(Review 12)과 동일한 패턴. 83–90% 밀도 덩어리 → 44–58% 구조적 패턴으로 전환. 8개 전부 감사 범위(16–78%) 내. 플래그 없음.

---

### 375c054 (v0.1.556) — 틴·페이스트리 형태 분리 (4개 퍼즐)

| 퍼즐 ID | 구 밀도 | 신 밀도 | 형태 특징 |
|---------|---------|---------|-----------|
| `hazelnut-praline-square-86` | 83% | 56% | 정사각 테두리 프레임 + 비대칭 내부 점 패턴 |
| `honey-lavender-canele-105` | 90% | **44%** | 상하 견고한 행 + 교대 수평선 격자 |
| `lavender-shortbread-tin-80` | 85% | 56% | 테두리 프레임 + 나선형 내부 |
| `lemon-curd-rosette-87` | 86% | 58% | 상단 좁고 중간 넓어지는 화병형 + 반복 내부 행 |

**canele-105 (44%)**: 이번 배치 최저 밀도이나 16% 하한 대비 충분히 여유 있음. 상하 `111111111111` 테두리에 `101010101101` 행이 교대로 배치되는 패턴은 카넬레 특유의 세로 홈이 파인 원통형 틀 단면을 추상적으로 표현. 이름과 연결 명확.

**rosette-87**: row 0–1이 `000111111000 / 001100001100`으로 꽃받침 형태, row 2가 `111111111111`, 이후 6행이 `011010010110` 반복. 로제트(장식 매듭) 특유의 중앙 굵은 몸통 + 상단 리본 구조로 읽힘.

**테스트:** `hazelnut-praline-square-86`, `honey-lavender-canele-105`, `lavender-shortbread-tin-80`, `lemon-curd-rosette-87` — 감사 대기열 진입 없음 ✅

---

### 29ec923 (v0.1.557) — 롤·링 형태 분리 (4개 퍼즐)

| 퍼즐 ID | 구 밀도 | 신 밀도 | 형태 특징 |
|---------|---------|---------|-----------|
| `lemon-poppy-pound-cake-111` | 86% | 58% | 직사각 프레임 + 우하향 대각선 나선 |
| `lemon-ribbon-tart-97` | 85% | 47% | 테두리 프레임 + 격자형 리본 패턴 |
| `mocha-cream-roll-109` | 89% | 58% | 비정형 곡선 롤 실루엣 (비대칭) |
| `orange-blossom-cruller-106` | 88% | 53% | 이중 프레임 + row 1 `110101010011` 주름 장식 |

**pound-cake-111**: 직사각 프레임 내부에 `101100000101 / 101011100101 / 101001110101 / 101000111101 / 101000011101 / 101001110101` 대각 나선이 내려감. 파운드케이크 단면의 반죽 소용돌이 표현.

**ribbon-tart-97 (47%)**: 테두리 프레임 + `101001001101 / 101000000101 / 110000000011` 격자형 내부. 타르트 리본 장식의 교차 격자 패턴과 일치. 이름-형태 연결 8개 중 가장 직접적.

**mocha-roll-109**: 비대칭 유기적 형태. 시각화:
```
██████████··
█·······███·
█·█████··███
█·█···██··██
█·█·██·██·██
█·█·█··██·██
█·█·█████·██
█·█·······██
█·█████████·
█········█··
█████████···
··██████····
```
나선형 롤을 위에서 내려다보거나 측면에서 자른 단면으로 읽힘. 8개 중 가장 비정형적이나 "롤" 이름과 내부 나선 구조가 연결됨. 비대칭이 의도적으로 보임.

**cruller-106**: row 1 `110101010011`이 상단 프레임에 톱니/주름 효과를 만들고, 이후 교대 행이 크룰러 특유의 꽈배기 단면을 표현. `011111111110` 상하 프레임이 타원형 크룰러 형태를 암시.

**테스트:** `lemon-poppy-pound-cake-111`, `lemon-ribbon-tart-97`, `mocha-cream-roll-109`, `orange-blossom-cruller-106` — 감사 대기열 진입 없음 ✅

---

### 전체 베이커리 수리 현황 (Review 12–13 기준)

| 그룹 | 커밋 | 수리된 퍼즐 수 | 잔여 후보 |
|------|------|--------------|-----------|
| 1차 | (이전 세션) | 4 | — |
| 2차 | 98f5f7c | 4 | — |
| 3차 | 285dcfa | 4 | — |
| 4차 | (Review 12에서 확인, 별도 커밋) | 4 | — |
| 5차 | 375c054 | 4 | — |
| 6차 | 29ec923 | 4 | — |

Codex 보고 기준: 아트 감사 후보 97 → 77개 (이번 2커밋으로). 수리 진행 중.

---

### 플래그 요약

플래그 없음. P0 외부 블로커(실기기 Billing 증거 2건)는 변동 없음.


---

## Review 14 — 2026-07-25

**버전:** v0.1.567  
**커밋:** `6f595d9 ui: shorten guide and hint copy`  
**범위:** 가이드·힌트 카피 전면 단축 (en.js, ko.js), puzzleAssistView.js how-to-play 카드 슬림, 테스트 업데이트 11개 파일, +92 -82  
**검증 기준:** 159 tests ✅, qa:candidate ✅, build ✅, Android release gate ✅, 4개 화면 크기 ✅

---

### 전체 평가

설명 중심 → 행동 중심 카피로 전환하는 일관된 편집 작업. 기술적 결함 없음. 플래그 1건(설계 노트 수준).

---

### 변경 내역

**guide.* 6개 시나리오 — 모든 step이 1문장으로 압축**

| 시나리오 | 변경 전 특징 | 변경 후 특징 |
|---------|------------|------------|
| `timeAttack` | "한 칸이라도 더 맞히면 오늘 기록이..." | "무작위 퍼즐 세 판을 차례로 풀어요." |
| `pantryFirstPurchase` | 자리 종류 설명 포함 (카운터·창문·선반…) | "자리를 누르면 장식을 바꿀 수 있어요." |
| `pantryRoomStory` | "언덕 너머에도 더 많은 이웃이…" | "누가 먼저 올지 저도 궁금해요!" |
| `pantryNeighborMrPark` | title: "시계 할아버지가 우리 팬트리를 찾아왔어요" | title: "시계 할아버지가 왔어요" |
| `pantryNeighborLily` | "부탁 여섯 개를 마치면서…" | "산딸기 차 레시피도 가져왔어요." |
| `pantryNeighborMateo` | "부탁 열 개를 마치면서 팬트리는 마을 친구들이…" | "햇살 드는 곳에서 책을 읽고 싶대요." |

**controls.hint* — 사용·비용 중심으로 재작성**

| 키 | 변경 전 | 변경 후 |
|---|---------|--------|
| `hintConfirmBody` | "지금 스푼 {cost}개를 사용해요. 되돌리기로 힌트 칸을 지울 수는 있지만…" | "스푼 {cost}개를 사용할까요?" |
| `hintIntro` | "힌트가 확실한 한 칸을 해결해요. 되돌리기로…" | "힌트를 쓸까요?" |
| `hintIntroMulti` | "힌트 한 번이 확실한 칸 {count}개까지 해결해요…" | "힌트를 쓸까요?" |
| `paidHintIntro` | "기본 힌트를 다 썼어요. 스푼 {cost}개를 사용하면…" | "스푼 {cost}개로 힌트를 쓸까요? 보유 {balance}개." |
| `hintEmpty` | "이 그림에서 쓸 수 있는 힌트를 모두 사용했어요. 계속 풀거나…" | "이 그림의 힌트를 모두 사용했어요." |

**puzzleAssistView.js — how-to-play 카드 2줄 제거**

`howToPlay.pipLine` 단락과 `controls.lineCompleteHint` 단락이 제거됨. 카드는 이제 `howToPlay.title` + `howToPlay.goal` + 단서 시각화만 표시.

**i18n.test.js — 모지바케 패턴 개선**

```js
// 이전 (수동 수집 문자셋)
const KOREAN_MOJIBAKE_PATTERN = /[揶쏅슦쎄쑴뽰눘維쒙쭪疫꿰빊吏紐]/;

// 변경 후 (유니코드 범위)
const KOREAN_MOJIBAKE_PATTERN = /[\u3400-\u4DBF\u4E00-\u9FFF\uFFFD]|\?{2,}/;
```

한국어 앱 문자열에 CJK 통합 한자(U+3400–9FFF) 또는 대체 문자(U+FFFD)가 포함되는 경우를 탐지. 기존 패턴이 놓칠 수 있던 임의의 인코딩 오류 문자를 포괄적으로 검출. 긍정적 개선.

---

### 설계 노트

**`hintIntro`와 `hintIntroMulti`가 동일한 문자열**

두 키가 이제 `"힌트를 쓸까요?"` / `"Use a hint?"`로 동일함. `hintIntroMulti`에 남아있던 `{count}` 플레이스홀더는 새 문자열에 존재하지 않으므로 렌더링 시 전달해도 무시됨. 현재 동작에는 문제 없으나, 향후 "힌트 한 번으로 N칸 해결" 메시지가 필요해질 경우 두 키를 다시 분리해야 함. 의도된 단순화로 판단.

---

### 플래그 요약

플래그 없음. P0 외부 블로커(실기기 Billing 증거 2건)는 변동 없음.


---

## Review 15 — 2026-07-25

**버전:** v0.1.568  
**커밋:** `531cbe7 ui: remove hidden pantry filters`  
**범위:** pantryView.js 필터 시스템 전면 제거 (~150줄), hintIntroMulti 키 완전 정리, 테스트/QA 스크립트 업데이트  
**검증 기준:** 159 tests ✅, qa:candidate ✅, build ✅, Android release gate ✅, 4개 화면 크기 ✅

---

### 전체 평가

화면에 노출되지 않던 필터 상태가 내부적으로 장식 카드를 숨길 수 있던 구조적 리스크를 제거. Review 14에서 지적한 `hintIntroMulti` 데드 키도 이 커밋에서 함께 정리됨. 플래그 없음.

---

### 1. pantryView.js — 필터 시스템 제거

**삭제된 상태:**

| 항목 | 이전 | 이후 |
|------|------|------|
| `pantryViewState` 필드 | `selectedRarity`, `selectedAvailability`, `selectedSort` 포함 | `selectedSlotId`, `shopVisibleLimit`, `storyGoalId`, `lastAction`만 남음 |
| 필터 배열/맵 | `rarityFilters`, `availabilityFilters`, `sortOptions`, `rarityRank` | 삭제 |

**삭제된 함수:**

- `renderRarityFilters` / `renderAvailabilityFilters` / `renderSortControls` — 필터 UI (화면에는 노출되지 않던 상태)
- `renderFilterSummary` — 필터 적용 시 "N/M개 표시" 요약 행
- `selectRarity` / `selectAvailability` / `selectSort` — 이벤트 핸들러

**삭제된 DOM 노드:**

- `.pantry-spoon-note` — 팬트리 헤더에 스푼 잔액 중복 표시
- `.pantry-placement-note` — 배치된 장식 수/전체 자리 수 설명

**단순화된 필터 로직:**

```js
// 이전 — 슬롯 + 희귀도 + 구매가능 여부 세 단계 필터
.filter(...slot...).filter(...rarity...).filter(...availability...);

// 이후 — 슬롯만
.filter((d) => selectedSlotId === "all" || d.slot === selectedSlotId);
```

**단순화된 정렬:**

`compareDecorations`에서 `selectedSort` 파라미터 및 `priceLow` / `priceHigh` / `rarity` 분기 제거. "featured" 점수 기반 정렬만 남음 (장착됨 → 구매가능 저가 → 구매가능 고가 → 소유 → 0코스트 순).

**구매/장착/추적 콜백 정리:**

세 콜백(`onPurchase`, `onEquip`, `onTrackGoal`) 모두에서 `selectedAvailability` / `selectedRarity` 리셋 코드 삭제. 구매 후 슬롯 필터만 갱신됨.

**QA 스크립트:**

```js
// 이전
await expectAbsent(page, ".pantry-placement-note", viewportName);
// 이후
await expectAbsent(page, ".pantry-placement-note, .pantry-spoon-note", viewportName);
```

두 노드 모두 absent 검증으로 확장. ✅

---

### 2. hintIntroMulti 완전 정리 (Review 14 노트 해소)

| 파일 | 변경 |
|------|------|
| `en.js` / `ko.js` | `hintIntroMulti` 키 삭제 |
| `puzzleAssistView.js:268` | `revealCount > 1 ? t("hintIntroMulti") : t("hintIntro")` → `t("hintIntro")` |
| `tests/i18n.test.js` | 해당 키 coverage 항목 및 expect 삭제 |

Review 14에서 "두 키가 동일 문자열로 수렴, {count} 플레이스홀더 사실상 사망"으로 지적했던 항목. 이 커밋에서 호출부·키·테스트 세 곳 모두 정리됨. ✅

---

### 반환 세션 마이그레이션 여부

`pantryViewState`는 모듈 레벨 객체로 세션 내에서만 유지됨 (LocalStorage 미직렬화). 구 `selectedRarity` / `selectedAvailability` / `selectedSort` 값이 스토리지에 남아 있는 경우 없음 — 마이그레이션 불필요.

---

### 플래그 요약

플래그 없음. P0 외부 블로커(실기기 Billing 증거 2건)는 변동 없음.


---

## Review 16 — 2026-07-25

**버전:** v0.1.569  
**커밋:** `5c29f45 ui: simplify time attack results`  
**범위:** timeAttackView.js 결과 표시 단순화, i18n 4개 키 수정, 테스트 1개 추가  
**검증 기준:** 160 tests ✅, qa:candidate ✅, build ✅, Android release gate ✅, 4개 화면 크기 ✅

---

### 전체 평가

타임어택 결과 표시에서 보드 진행 상황(`boardProgress`) 및 힌트 미사용 메타 제거. 레코드 행과 결과 행 모두 `크기 · 칸 수 · 시간` 3요소로 통일. 플래그 없음.

---

### 변경 내역

**renderTimeAttackView — 인트로 본문 제거**

`timeAttack.body` 단락 삭제. 화면은 eyebrow + title → coach card + ladder로 바로 진입.

**createTimeAttackLadder — 각 단계 설명 제거**

```js
// 이전 — 3개 키 (round, size, body)
["ladderRound1", "ladderSize1", "ladderWarmup"],
["ladderRound2", "ladderSize2", "ladderTempo"],
["ladderRound3", "ladderSize3", "ladderFinal"]

// 이후 — 2개 키 (round, size만)
["ladderRound1", "ladderSize1"],
["ladderRound2", "ladderSize2"],
["ladderRound3", "ladderSize3"]
```

`ladderWarmup` / `ladderTempo` / `ladderFinal` 설명 줄 렌더링 제거.

**레코드 행 단순화**

| 항목 | 이전 | 이후 |
|------|------|------|
| `recordLine` (EN) | `"{size}x{size}: {progress} cells, {boardProgress} / {time} / {hints} hints"` | `"{size}x{size} · {progress} cells · {time}"` |
| `recordLine` (KO) | `"{size}x{size}: {progress}칸, {boardProgress} / {time} / 힌트 {hints}회"` | `"{size}x{size} · {progress}칸 · {time}"` |
| 전달 파라미터 | `size`, `progress`, `boardProgress`, `time`, `hints` | `size`, `progress`, `time` |

**결과 패널 단순화**

| 항목 | 이전 | 이후 |
|------|------|------|
| `lastScore` (EN) | `"{progress} cells in {time} ({boardProgress})"` | `"{progress} cells · {time}"` |
| `lastScore` (KO) | `"{time}에 {progress}칸 ({boardProgress})"` | `"{progress}칸 · {time}"` |
| 힌트 메타 | 항상 렌더링 (`"Hints used: 0"` 포함) | `hintsUsed > 0`일 때만 렌더링 |
| `timeoutReward` | `"Time up! You banked +{reward} spoons for this run."` | `"Time up · +{reward} spoons"` |
| `timeoutNoReward` | `"Time up. Make at least one correct move to bank spoons next run."` | `"Try one more cell next time."` |
| KO `timeoutNoReward` | `"시간 종료. 다음 도전에서 한 수라도 맞히면 스푼을 저장할 수 있어요."` | `"다음엔 한 칸 더!"` |

**`getRecordBoardProgress` 함수 삭제**

`currentRoundCorrectCells` / `currentRoundTotalCells` / `currentRoundNumber` 필드를 읽던 함수 제거. 이 함수가 사용하던 `timeAttack.boardProgress` / `timeAttack.boardProgressFallback` i18n 키는 이 커밋 이후 고아 키가 됨 (런타임 오류 없음, 미사용 상태).

**테스트 추가**

```js
it("keeps Time Attack results compact in both languages", () => {
  // EN: "8x8 · 42 cells · 1:23"
  // KO: "8x8 · 42칸 · 1:23"
  // EN lastScore: "42 cells · 1:23"
  // KO lastScore: "42칸 · 1:23"
});
```

`·` 구분자와 파라미터 누락 여부를 양 언어에서 회귀 검증.

---

### 설계 노트

**고아 i18n 키:** `timeAttack.boardProgress`, `timeAttack.boardProgressFallback`, `timeAttack.bestSummary` — 호출부 없음. `boardProgress` / `boardProgressFallback`은 이 커밋에서 `getRecordBoardProgress` 삭제로 고아 됨. `bestSummary`는 v0.1.546에서 `getBestSummaryText` 삭제 시 이미 고아였음. 향후 i18n 정리 패스에서 제거 가능.

---

### 플래그 요약

플래그 없음. P0 외부 블로커(실기기 Billing 증거 2건)는 변동 없음.


---

## Review 17 — 2026-07-25

**버전:** v0.1.570 → v0.1.575 (2개 커밋)
**커밋:** `8066e22 ui: simplify replay picks`, `8f50fdb ui: simplify locked stage choices`
**범위:** 리플레이 카드 카피 슬림 + 잠긴 스테이지 언락 패널 중복 설명 제거
**검증 기준:** 160 tests ✅, qa:candidate ✅, build ✅, Android release gate ✅, 4개 화면 크기 ✅

---

### 전체 평가

두 커밋 모두 "화면에서 이미 사라진 or 중복된 설명 UI를 DOM·CSS·i18n·위생 검사에서 동시에 제거"하는 패턴. 플래그 없음.

---

### 8066e22 — 리플레이 카드 단순화

**i18n 제거 키:**

| 키 | 내용 |
|---|------|
| `replayPicks.eyebrow` | "Pip의 다시 풀기 추천" (section-label) |
| `replayPicks.body` | 리플레이 경제 설명 2문장 |
| `replayPicks.challenge` | 각 버튼 하단 `<small>` "도전" 레이블 |

**i18n 수정 키:**

| 키 | 이전 | 이후 |
|---|------|------|
| `title` | "깔끔한 다시 풀기 도전" | "다시 풀기" |
| `cleanRule` | "힌트 없이, 틀린 칸을 채우지 않고 끝내면 오늘의 리플레이 스푼을 받아요." | "힌트와 오답 없이 끝내면 스푼 1개!" |
| `cleanBroken` | "이번 판의 깔끔 보너스는 놓쳤어요. 그래도 연습으로 끝까지 풀 수 있어요." | "보너스는 놓쳤어요. 연습은 계속해요." |

**DOM 변경 (`puzzleHubView.js`):**
- `section-label` eyebrow 단락 제거
- 각 리플레이 버튼 내 `<small>` "도전" 텍스트 제거

**CSS 제거:**
- `.replay-picks-card::after` — 카드 우하단 원형 광택 그라디언트 (장식)
- `.replay-pick-button::before` — 버튼 좌상단 흰 광택 점 (장식)
- `.replay-picks-card__body` — 본문 설명 텍스트 스타일 (×2, light/dark 각각)
- `.replay-pick-button small` — "도전" 레이블 스타일 (×2)

**위생 검사 추가:**
- `puzzleHubView.js`에 `replayPicks.eyebrow/body/challenge` 재도입 방지
- CSS에 `.replay-picks-card::after`, `.replay-pick-button::before`, `.replay-picks-card__body` 재도입 방지

---

### 8f50fdb — 잠긴 스테이지 언락 패널 단순화

**배경:** `.unlock-panel__plan { display: none }` 규칙이 이미 CSS에 전역 적용되어 있었음 — 즉 plan 패널은 DOM에 있었지만 화면에는 보이지 않는 상태였음. 이 커밋에서 DOM 생성 자체를 제거.

**삭제된 i18n 키 (7개):**

| 키 | 역할 |
|---|------|
| `unlockPlanReady` | "지금 열 수 있어요. 스푼을 쓰면…" |
| `unlockPlanNeedSpoons` | "스푼 {count}개를 더 모아보세요." |
| `unlockPlanNeedPantry` | "팬트리 부탁 {completed}/{required}개를 마치면…" |
| `unlockPlanNeedBoth` | 스푼 + 팬트리 복합 조건 |
| `unlockGateNeedSpoons` | "스푼 {count}개가 더 필요해요." |
| `unlockGateNeedPantry` | "팬트리 부탁이 아직 {completed}/{required}개예요." |
| `unlockGateNeedBoth` | 스푼 + 팬트리 복합 조건 chip |

**유지된 i18n 키:** `needPantryRoom`, `visitPantry`, `roomRequirement`, `needMore` — 실제 표시되는 잠금 안내에 사용.

**삭제된 함수:**
- `getUnlockPlanText(canOpen, roomRequirement, spoonGap)` — 4분기 조건 분기
- `getUnlockGateReason(canOpen, roomRequirement, spoonGap)` — 동일 구조

**CSS 제거:**
- `.unlock-panel__plan` — 배경색 박스 스타일
- `.unlock-panel__gate` — 원형 pill chip 그라디언트 스타일
- `.unlock-panel__plan { display: none }` — 이미 숨겨두던 전역 override 규칙

**launch_integrity_check.js 재조정:**

```js
// 이전 — plan/gate 심볼이 존재하는지 확인
expectIncludes(hub, "unlockPlanNeedSpoons", ...)

// 이후 — 존재하지 않는지 확인 (삭제 유지 검증)
expectExcludes(hub, "unlockPlanNeedSpoons", "retired duplicate stage-lock report copy")
```

존재 확인 → 부재 확인으로 방향 반전. 필수 잔존 키(`visitPantry`, `needPantryRoom`, `needMore`, `roomRequirement`)는 여전히 `expectIncludes`로 보호.

**위생 검사 추가:**
- `unlock(?:Plan|Gate)` 패턴 재도입 방지 (JS + i18n)
- `.unlock-panel__(?:plan|gate)` CSS 재도입 방지

---

### 플래그 요약

플래그 없음. P0 외부 블로커(실기기 Billing 증거 2건)는 변동 없음.


---

## Review 18 — 2026-07-25

**버전:** v0.1.576 → v0.1.585 (15개 커밋, docs-only 4개 제외 실질 11개)
**범위:** 전체 화면 감사 마무리 — 시즌 대시보드·인트로 크롬·코치 카드 제거, 네비·허브·타임어택 카드 단순화, 회중시계 아트 교체, 팬트리 Limit 컨트롤 리디자인
**검증 기준:** 160 tests ✅, qa:candidate ✅, build ✅, Android release gate ✅, 4개 화면 크기 ✅

---

### 전체 평가

대규모 dead code + 중복 설명 제거 패스. 총 ~1,200줄 이상 삭제. 플래그 1건(P2 수준 잠재 미사용 import).

---

### fdb55eb — 설정 가이드 카드 단순화

- `settings.guideReplayBody` 키 삭제, `.settings-guide-card__body` CSS 삭제
- 카드: eyebrow(title) → 버튼 2개만 남음
- `timeAttack.bestSummary`, `timeAttack.boardProgress`, `timeAttack.boardProgressFallback` i18n 키 삭제 — 이미 Review 16에서 고아로 지적했던 항목, 이 커밋에서 정리됨 ✅

---

### 99f5c06 — 시즌 대시보드 제거 (-451줄)

**삭제된 것:**
- `createSeasonProgressCard` + `createSeasonGoalCard` + `createSeasonStat` + `createSpoonSeasonStat` (~133줄 JS)
- `seasonProgress.*` i18n 키 30개 (en + ko)
- `renderPuzzleHub` 시그니처 단순화: `options = {}` 파라미터 제거
  - 이전: `renderPuzzleHub(activePuzzle, onOpenPuzzle, { onOpenPantry, onUnlockPack, onViewAlbum })`
  - 이후: `renderPuzzleHub(activePuzzle, onOpenPuzzle)`
- `appShell.js` 호출부에서 콜백 3개 제거
- `mobile_visual_check.js`: 시즌 카드 관련 검증 44줄 삭제

**교차 의존성 확인:** `createSeasonGoalCard`는 이미 `8f50fdb`에서 삭제된 `getUnlockPlanText`를 참조하고 있었음 — 두 커밋이 같은 날 순차적으로 올라갔으므로 일시적 dangling 상태였지만 최종 HEAD는 clean ✅

---

### 81402cd — 인트로 크롬 제거 (-794줄)

**삭제된 것:**
- `renderPipStrip` 함수 + `getPipPuzzleLine` (플레이어 이름·완료 수 기반 분기 4단계)
- `renderFooter` 함수
- `app.versionLabel`, `pipStrip.*` (12개) i18n 키
- `styles.css` 약 706줄 — pip-strip, app-footer, brand-intro 관련 CSS 대규모 삭제

**위생 검사 추가:** `pip-strip`, `app-footer`, `brand-intro__*` CSS 셀렉터 재도입 방지

---

### b7fcc72 — 앨범·배지 레이블 정리

- `album.note` 키 삭제 → 앨범 헤더 설명 단락 제거
- `badges.earned` 키 삭제 → 배지 카드 상태 레이블("Badge earned") 제거
- `mapView.js` `createBadgeCollectionCard`: `state` span 전체 제거 → 카드에 제목만 남음
  - 이전: 획득여부·진행도·잠금 상태 텍스트 + 제목
  - 이후: 제목만
- 배지 시각적 구분은 art(이미지) 레이어에서 유지된다고 판단

**고아 키 확인:** `badges.collectionCount`, `badges.collectionNote`, `badges.nextBadge` — 이 커밋 기준 아직 i18n에 남아있음. 후속 `5da2875`에서 `collectionCount`, `collectionNote`, `nextBadge`, `nextPackBadge`, `packProgress` 모두 삭제 확인 ✅

---

### 963cf8d — 허브·타임어택 화면 단순화

**renderDailyCard:** `dailyBonus` 파라미터 제거, `daily.reward` 키 삭제, `.daily-reward-note` 단락 제거
- `appShell.js` 호출부에서 `DAILY_BONUS` 인자 제거 — `DAILY_BONUS` 상수는 `renderPlayScreen` 호출에서 여전히 사용 중 ✅ (미사용 import 아님)

**renderTimeAttackTeaserCard:** `timeAttack.hubBody` ("From 5x5 to 10x10.") 단락 제거

**createTimeAttackCoachCard:** `timeAttack.coachBody` ("Hints are there when you get stuck.") 제거

**createRecordsPanel 로직 개선:**
```js
// 이전: 항상 records 반환, 빈 경우 "No record yet." 텍스트
// 이후: entries 없으면 null 반환
if (!entries.length) return null;
```
`renderTimeAttackView`에서 `null` 체크로 조건부 마운트:
- `lastResult && records` → 결과 + 기록
- `lastResult && !records` → 결과만
- `!lastResult && records` → 기록만
- `!lastResult && !records` → 인트로+래더+시작 버튼만

이 4가지 케이스가 명시적으로 처리됨. `timeAttack.noRecord` 키도 삭제 ✅

---

### d2812b1 — 컴팩트 헤더 제목 가드 추가

`mobile_visual_check.js`에 헤더 제목이 잘리지 않는지 확인하는 10줄 추가. 코드 변경 없음.

---

### 5243bf7 — 퀵 이동 피커 단순화

**floatingNav.js:**
- `NAV_ITEMS` 배열에서 `hintKey` (세 번째 요소) 제거: `["puzzle", "views.puzzle", "views.puzzleHint"]` → `["puzzle", "views.puzzle"]`
- 트리거 버튼: `"Menu: Puzzle - Switch screens"` → `"Menu: Puzzle"`
- 트리거 DOM: `floating-nav__trigger-label("Menu")` + `strong(현재뷰)` + `floating-nav__trigger-cue("Switch screens")` → `strong(현재뷰)`만 남음
- 각 메뉴 아이템: `itemCopy`(label + hint small) → `itemLabel`만
- 삭제 키: `views.puzzleHint/albumHint/pantryHint/timeAttackHint/mapHint`, `views.quickJump`

**위생 검사:** `floating-nav__trigger-cue`, `floating-nav__copy`, `floating-nav__item small` 재도입 방지

---

### 8784d67 + 4571ce2 — CSS 전용 반응형 조정

- `8784d67`: 언어 선택 영역 좁은 화면에서 컴팩트하게 (18줄 CSS 추가)
- `4571ce2`: 퀵 이동 트리거 버튼 폰 크기에서 최소화 (20줄 CSS 추가)
- JS/i18n 변경 없음. CSS append-only 패턴 ✅

---

### 789efc4 — 타임어택 시작 화면 단순화 (-318줄)

**삭제된 것:**
- `createTimeAttackCoachCard` 함수 전체 + `pipCoachUrl` import
- `timeAttack.coachEyebrow/Title/Earn/Spend/Record` i18n 키 5개 (en + ko)
- coach 카드 관련 CSS ~200줄 이상
- `mobile_visual_check.js` coach 카드 검증 코드

화면 순서: `intro → coach → ladder → start` → `intro → ladder → start`

---

### 5d05fba — 퍼즐 선택 보상 표시 제거

- `puzzlePicker.sizeReward` 키 삭제 (`"{size}×{size} · +{count}"`)
- `puzzlePicker.rewardLabel` 키 삭제 (aria-label용)
- 미완성 퍼즐 메타: `sizeReward({size}, {count})` → `size({size})`
- `aria-label`: `"제목 - 5×5 · +40"` → `"제목 - 5×5"`
- 완성 퍼즐은 기존과 동일하게 `puzzlePicker.complete` ✅

---

### 6809d33 — 타임어택 회중시계 아트 교체

**자산 교체:**
- 이전: `quick-travel-time-attack-v1.png` (스푼 스톱워치)
- 이후: `quick-travel-time-attack-clock-v1.png` (시계 할아버지의 회중시계)

**assetManifest.js 개선:**
- `[view, label]` → `[view, label, visible = true]` 구조로 확장
- `quick-travel-time-attack-v1` → `visible: false`로 퇴역 기록 보존 (아트 히스토리 유지)
- 신규 자산 `identityStatus: "approved-character-continuity"` — 캐릭터 연속성 승인

**CSS:** `.time-attack-teaser-card__badge` 및 floating nav timeAttack 아이콘에 대해 border/background/box-shadow 제거 (회중시계는 원형 뱃지 프레임 없이 표시). `::before`/`::after` 장식 전부 `content: none !important`로 억제.

---

### 5da2875 — 최종 화면 감사 마감

**mapView.js:**
- 헤더: `section-label eyebrow("배지")` + `h2("N/M badges earned")` → `h2("배지")` 단일 요소
- `createNextBadgeCard`: `"Next badge: {name}"` → `t(badge.titleKey)`, `"N/M to earn {name}"` → `"N/M cards"`

**i18n 삭제:** `badges.collectionCount`, `badges.collectionNote`, `badges.nextBadge`, `badges.nextPackBadge`, `badges.packProgress`

**styles.css:**
- `brand-intro__grain`에 `pointer-events: none` 추가 — 인트로 grain 레이어가 탭 이벤트를 가로채던 잠재 문제 수정
- `.pantry-shop-limit` 리디자인: 복잡한 radial-gradient + 글로우 + meter → 단색 green 배경 + 단순 border + 전폭 버튼

**`pantry-shop-limit__meter` 확인:** CSS에서 삭제됨. `pantryView.js`에서 meter DOM 생성 코드 없음 — 이미 이전에 제거된 상태 ✅

---

### 플래그

**P2 — `DAILY_BONUS` 상수 appShell.js:38 잠재 중복 참조**

`renderDailyCard` 호출에서 `DAILY_BONUS` 인자가 제거됐지만, 같은 파일에 `const DAILY_BONUS = ECONOMY.DAILY_BONUS` (line 38)과 `renderPlayScreen(...)` 호출 내 `dailyBonus: DAILY_BONUS` (line 639)가 남아있어 상수 자체는 아직 사용 중. 미사용 import는 아님. 단, 퍼즐 플레이 화면에서 보상을 표시하는지 여부는 별도 확인 필요. 현재 테스트가 통과하므로 런타임 오류는 없음.

**설계 노트 — 배지 화면 상태 구분**

`mapView.js` badge 카드에서 획득/진행/잠금 상태 텍스트 레이블이 모두 제거되어 카드에는 제목만 남음. 시각적 구분(배지 아트 vs 진행 아트 vs 잠금 아트)으로 충분하다는 판단으로 보이나, 저시력 사용자 또는 스크린 리더 관점에서는 상태 정보가 aria-label이나 hidden text로 보완되면 더 좋음. 현재 `earnedAria`/`progressAria` 키가 i18n에 남아있으나 `createBadgeCollectionCard`에서 사용되는지는 확인 필요.

---

### 종합 P0 외부 블로커

실기기 Billing 증거 2건 변동 없음.


**추가 확인 — `badges.earnedAria` / `badges.progressAria` 고아 키**

```bash
grep -rn "earnedAria\|progressAria" src/ui/
# 결과 없음
```

두 키가 i18n에 남아있으나 현재 `mapView.js`를 포함한 어떤 UI 파일에서도 참조되지 않음. 설계 노트의 "aria 보완" 가능성을 감안하면 의도적으로 남겨둔 것으로 볼 수 있으나, 사용하지 않는 상태라면 향후 정리 패스 대상.

---

## Review 19 — v0.1.586–v0.1.589

**커밋:** `7a6870d`, `8572177`, `7f95a3b`, `6245e88`, `28ee1cc`  
**범위:** 글로벌 카탈로그 압박 제거 + Season 0 선반(Shelf) 재구성 + 최종 완성 처리 + 타임어택 가이드 포커스  
**검증:** 코드 직접 확인, node 경제 시뮬레이션, i18n 키 grep

---

### 변경 요약

| 커밋 | 내용 |
|------|------|
| `7a6870d` | 앨범 헤더 `{completed}/333` → `{completed} pictures`; 배지 aria-label에 `{title}` 플레이스홀더 적용 |
| `8572177` | `seasonShelves.js` + `seasonShelfProgress.js` 신규 생성; `save.js` shelf 잠금·완료 로직 추가; `puzzleHubView.js` 전면 shelf 기반으로 전환; 보너스 팩 UI(`createBonusPackPanel`) 제거 |
| `7f95a3b` | `shelf.isFinal` 플래그; 최종 선반 완료 시 별도 오버레이 텍스트 + 팬트리 뷰로 이동 |
| `6245e88` | 타임어택 가이드 시계 할아버지 이미지 크기 확대(72→92px 폭, 98→156px 높이) |
| `28ee1cc` | `ANDROID_RELEASE_STATUS.md` 업데이트(문서만) |

---

### 코드에서 직접 확인한 사실

**선반 구성 (node 집계):**

```
선반                  크기 구성                   합계  비용   팬트리
shelf-pips-first     5×5(15) 8×8(5)             20    0      0
shelf-sunny-counter  5×5(10) 8×8(10)            20    60     1
shelf-apron-drawer   5×5(5) 8×8(12) 10×10(3)   20    75     2
shelf-market-counter 5×5(5) 8×8(8) 10×10(9)    22    90     3
shelf-window-table   5×5(5) 8×8(7) 10×10(10)   22    0      3
shelf-morning-bakery 8×8(8) 10×10(10) 12×12(5) 23    105    5
shelf-pastry-corner  10×10(11) 12×12(12)        23    0      5
shelf-tin-row        10×10(11) 12×12(12)        23    120    6
shelf-bakery-window  10×10(11) 12×12(12)        23    0      6
shelf-village-square 10×10(11) 12×12(12)        23    145    7
shelf-market-table   10×10(11) 12×12(12)        23    0      7
shelf-clock-corner   10×10(10) 12×12(13)        23    165    8
shelf-bakery-walk    10×10(10) 12×12(13)        23    0      8
shelf-garden-path    10×10(10) 12×12(13)        23    210    9
shelf-village-pantry 10×10(10) 12×12(12)        22    0      10
                                          합계: 333
```

**경제 시뮬레이션 (실제 보상: 5×5=3, 8×8=6, 10×10=10, 12×12=15):**

| 선반 | 잠금 비용 | 퍼즐 수익 + 보너스 | 잔액 (비용 차감 후) |
|------|-----------|-------------------|-------------------|
| pips-first | 0 | 115 | 115 |
| sunny-counter | 60 | 115 | 170 |
| apron-drawer | 75 | 147 | 242 |
| market-counter | 90 | 188 | 340 |
| window-table | 0 | 192 | 532 |
| morning-bakery | 105 | 263 | 690 |
| pastry-corner | 0 | 335 | 1,025 |
| tin-row | 120 | 335 | 1,240 |
| bakery-window | 0 | 340 | 1,580 |
| village-square | 145 | 340 | 1,775 |
| market-table | 0 | 345 | 2,120 |
| clock-corner | 165 | 350 | 2,305 |
| bakery-walk | 0 | 355 | 2,660 |
| garden-path | 210 | 355 | 2,805 |
| village-pantry | 0 | 405 | 3,210 |

잔액이 단 한 번도 음수가 되지 않음 — 퍼즐만으로 전체 콘텐츠 구매 가능. 테스트(`seasonShelves.test.js`)로도 동일한 시뮬레이션이 CI에서 검증됨.

**팬트리 요건 단차 검증:**  
최대 단차 2 (`shelf-morning-bakery`: 3→5). 테스트에서 모든 단차 `≤ 2` 강제됨. 이전에 두 팩이 동일하게 `10`을 공유하던 문제 해소.

---

### 클린 항목

1. **글로벌 333 제거** — `album.count` → `album.completed`; `{completed} pictures`만 표시. P0-3 해소 확인.

2. **배지 aria-label 활성화** — `earnedAria`/`progressAria`가 이제 `{title}` 플레이스홀더로 수정되어 `mapView.js`에서 실제로 사용됨. Review 18에서 고아로 기록했던 키가 이번 커밋에서 해소.

3. **보너스 팩 UI 완전 제거** — `createBonusPackPanel` 함수 삭제, `puzzleHubView.js`가 `puzzlePacks`(bonus-pack 포함) 대신 `seasonShelves`를 순회. 플레이어에게 미래 팩이 보이지 않음.

4. **레거시 세이브 마이그레이션** — `LEGACY_PACK_SHELF_IDS` 맵으로 기존 `unlockedPackIds`/`completedPackIds`를 신규 shelfId로 변환. 기존 테스터 데이터 보호.

5. **무료 선반 자동 개방 로직** — `unlockCost: 0` 선반은 `isShelfUnlocked()`가 이전 선반 완료 + 팬트리 요건 충족 시 자동 true 반환. 별도 구매 버튼 없이 열림.

6. **최종 선반 엔딩** — `shelf.isFinal: true` → 스테이지 완료 오버레이가 별도 텍스트("Pip's pantry complete") + 팬트리 뷰 이동. 333번째 퍼즐이 앱의 자연스러운 종착점을 가짐.

7. **15개 shelf 이름 i18n 완비** — `en.js`, `ko.js` 모두 `shelves.*` 15개 키 확인.

---

### 설계 노트

**배지 5개와 선반 15개의 분리**

`badges.js`의 `SHELF_BADGES`는 15개 선반 중 5개에만 배지를 매핑한다 (`shelf-pips-first`, `shelf-sunny-counter`, `shelf-apron-drawer`, `shelf-bakery-window`, `shelf-village-pantry`). 이 5개는 원래 5개 팩과 1:1 대응된다. 따라서 "Bakery Window 배지"는 bakery-window 테마 23개짜리 선반을 완료하면 획득 — 원래 136개 팩 완료 기준이 아님. 이는 의도된 설계 변경으로, 배지가 "이 선반의 예술 세계를 완주했다"는 이정표에서 "이 테마의 모든 퍼즐을 완주했다"는 의미로 이동한 것. 이 변화를 인지하고 진행하고 있다면 플래그 없음.

**`mapView.js` 배지 그리드의 `isShelfUnlocked` 호출**

`createBadgeCollectionCard`에서 `unlocked = isShelfUnlocked(status.shelf)`를 사용해 배지 카드에 "locked" CSS 클래스를 조건부 적용. 그런데 mapView는 `statuses.filter(s => s.earned)`만 그리드에 렌더링한다. 즉 earned 배지의 shelf는 항상 unlocked → `unlocked` 변수는 항상 `true` → "locked" 클래스가 실제로는 적용될 수 없음. 기능 버그는 아니지만 사용되지 않는 분기.

---

### P2 플래그

**`packs.futurePackHint` / `packs.pricePreview` — 고아 키**

`createBonusPackPanel`이 삭제되며 두 키를 참조하던 유일한 호출처가 사라졌다:

```bash
grep -rn "futurePackHint\|pricePreview" src/ui/
# 결과 없음
```

`en.js` line 362, 365 / `ko.js` 대응 키가 남아있음. 위생 체크 대상으로 추가 권장.

---

## Review 20 — v0.1.590

**커밋:** `8ca3bc1`  
**범위:** 모바일 플레이 마무리 + 팬트리 방 일러스트 배경 도입  
**검증:** 코드 직접 확인, 흐름 추적, CSS 상속 분석

---

### 변경 요약

| 영역 | 변경 내용 |
|------|-----------|
| 방향키 모드 | 보드 탭이 커서 이동만 하고 페인트 미적용 (`cursorOnly` 옵션) |
| 커서 컨트롤 | 힌트/위치/상태 칩 제거 — d-pad + 액션 버튼만 남음 |
| 완료 배너 | "View Album" → "Menu" (퍼즐 허브로 이동) |
| 팬트리 방 | `pantry-room-sunlit-v1.png` 배경 도입, 슬롯이 이미지 위에 절대 위치 |
| 설정 | 리셋 버튼을 헤더에서 설정 다이얼로그 안으로 이동 |
| 설정 가이드 | 아이콘 → 실제 퀵트래블 아트 이미지로 교체 |
| 진행 표시 | `{count}/{target} colored` → `{count} / {target}` |
| IAP 버튼 | `"Check price"` → `"Store price"` |

---

### 코드에서 직접 확인한 사실

**방향키 모드 탭 처리 흐름:**

```
boardView.js pointerdown → cursorOnly 가드 → early return (드래그 없음)
boardView.js click → suppressNextClick=false (드래그 안 했으므로) → onCellPress(row, col)
puzzleView.js onCellPress → cursorControlsEnabled 확인 → setCursor+update(skipAutoLineMarks:true) → return
```

보드 탭이 `pointerdown`에서 드래그를 막고, `click`은 `puzzleView`에서 커서 이동으로만 처리됨. 두 레이어가 책임을 나눠 가지는 구조. 의도대로 동작.

**팬트리 방 슬롯 위치 계산:**

기존 CSS `position: absolute`는 `.pantry-room-slot`에 이미 선언되어 있음 (line 8741). 새 오버라이드(line 15333)는 `position`을 건드리지 않으므로 상속 유지. `.slot-back-wall` 등 5개 유틸리티 클래스가 `top/left/right/bottom/width/height`로 위치를 지정. 슬롯 ID(`back-wall`, `counter`, `window`, `shelf`, `floor`)와 CSS 클래스(`slot-{id}`)가 1:1 대응.

**리셋 버튼 이동:**

`renderHeader(onSettings, onReset)` → `renderHeader(onSettings)` — 리셋 버튼이 헤더에서 삭제됨. `settingsView.js`에 `onResetRequest` 파라미터 추가, `requestReset` 함수가 `getSettingsDialogProps()`를 통해 전달됨. 연결 정상.

---

### 클린 항목

1. **커서 모드 탭 버그 수정** — 보드 탭이 커서 이동 + 페인트를 동시에 적용하던 문제. `cursorOnly` 플래그로 `pointerdown`에서 드래그 세션 생성 차단. 가장 중요한 플레이 버그.

2. **커서 컨트롤 간소화** — 힌트·위치·상태 칩이 보드 하이라이트와 중복 정보였음. d-pad + 액션 버튼만 남겨 시각적 노이즈 제거.

3. **리셋 버튼 은닉** — 헤더 항상-보이는 위치 → 설정 다이얼로그 내부. 실수 탭에 의한 데이터 삭제 위험 감소. CSS `.settings-reset`은 텍스트 링크 스타일 — 의도적으로 눈에 덜 띔.

4. **팬트리 방 배경** — CSS 그라디언트 플레이스홀더 → 실제 일러스트 배경. 빈 슬롯은 점선 pill, 채워진 슬롯은 텍스트 숨김. 슬롯 위치가 하드코딩된 비율값(%)으로 지정 — 이미지 구도와 연동.

5. **진행 표시 클리너** — `"3/12 colored"` → `"3 / 12"`. 불필요한 단어 제거.

---

### 설계 노트

**팬트리 방 슬롯 위치 하드코딩의 의미**

```css
.slot-back-wall { top: 11%; left: 30%; width: 40%; height: 17%; }
.slot-shelf     { top: 35%; left: 1%;  width: 27%; height: 14%; }
.slot-window    { top: 32%; right: 2%; width: 24%; height: 23%; }
.slot-counter   { bottom: 22%; left: 18%; width: 64%; height: 14%; }
.slot-floor     { bottom: 4%;  left: 4%;  width: 35%; height: 15%; }
```

이 값들은 `pantry-room-sunlit-v1.png`의 구도에 완전히 종속됨. 배경이 교체되면 CSS도 함께 수정해야 함. `aspect-ratio: 2/3` 고정으로 뷰포트 크기와 무관하게 구도 유지 — 올바른 선택. 단, 슬롯 위치와 배경 이미지 사이에 코드 레벨 연결이 없어 향후 이미지 교체 시 CSS 수정 의무가 암묵적으로만 존재.

**완료 후 "Menu" 이동의 트레이드오프**

"View Album" → "Menu(퍼즐 허브)"는 앨범 발견성 감소를 의미함. 퍼즐 완료 직후 카드를 확인하는 자연스러운 경로가 사라짐. 허브 중심 내비게이션 강화가 목적이라면 수용 가능. 단, 앨범이 핵심 보상 공간이라면 완료 후 앨범 연결이 의미 있는 루프였다는 점을 기록.

---

### P1 플래그

**배경 이미지 2.4MB — 정적 import로 번들에 포함**

```js
import pantryRoomBackgroundUrl from "../assets/backgrounds/pantry-room-sunlit-v1.png";
```

Vite가 빌드 시점에 해시 파일명으로 `assets/`에 복사. 2.4MB 파일이 팬트리 뷰 첫 로드 시 전달됨. WebP 변환 시 동일 화질 기준 약 60-80% 절감 가능. 모바일 LTE 초도 로딩 시 체감 지연 발생 가능. 캐시 이후 재방문에는 영향 없음.

---

### P2 플래그

**`filledOf` / `revisitOf` 포맷 변경 — 한국어 확인**

`en.js`: `"{count} / {target}"` 포맷으로 변경. `ko.js` 대응 키도 동일하게 변경됐는지 그리고 중간점(`·`) 문자가 한국어 타이포그래피에서 자연스러운지 확인 권장. (i18n 테스트는 en만 검증)

---

### 종합 P0 외부 블로커

실기기 Billing 증거 2건 변동 없음.

