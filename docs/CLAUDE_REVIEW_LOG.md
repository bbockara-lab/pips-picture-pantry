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
