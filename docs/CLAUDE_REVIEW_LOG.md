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
