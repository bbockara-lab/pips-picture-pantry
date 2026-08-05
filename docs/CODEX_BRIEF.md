# Codex Work Brief — Pip's Picture Pantry

> Prepared by Claude (reviewer). Current app: **v0.1.460**. Last candidate gate: **v0.1.459 passed**.
> Release blocker remaining: real-device Billing evidence only (non-Codex scope).

---

## Current Release State

- `qa:candidate` ✅ (v0.1.459)
- `qa:android:candidate` ✅ — unsigned AAB 12MB built
- `qa:release:final` ⏳ blocked on two real-device Billing evidence records (Play Console work, not Codex scope)
- All code-side gates green. What remains below is **UX and visual quality work** before final signed upload.

---

## P1 — Functional Bugs (Fix First)

### 1-A. Floating Nav must be `position: fixed`, not `sticky`

**File**: `src/styles.css` — `.floating-nav`

**Problem**: The floating nav trigger is currently `position: sticky; bottom: 10px`. It only appears after scrolling to the bottom of the page. Users cannot see it from the top of any view, so Pantry, Time Attack, Album, and Badges are effectively hidden.

**Required fix**:
```css
.floating-nav {
  position: fixed;
  right: 16px;
  bottom: 20px;
  z-index: 50;
  /* remove: width, margin, display:grid */
}
```

The menu panel (`.floating-nav__menu`) must open upward from the trigger. The trigger button should be a round ~52px tap target in the bottom-right corner, always visible regardless of scroll position.

**CI to add**: `mobile_visual_check.js` — verify `.floating-nav` has `position: fixed` in computed style and that the trigger is within 30px of the viewport right/bottom edge at all three review widths.

---

### 1-B. Guide dialog must be replayable from Settings

**Context** (`docs/CONTEXT.md`, 2026-07-02 direction): "skippable, remembered locally, and **replayable from settings/help**."

**Current state**: `hasSeenGuide("puzzle")` flag blocks the guide from ever showing again after first play. There is no way to replay it.

**Required fix**:
1. Add a "퍼즐 하는 법 다시 보기 / Replay how-to guide" button to `src/ui/settingsView.js`.
2. On click: call `markGuideSeen` inverse — i.e. clear the `puzzle` guide flag from save state — then close settings and trigger the guide dialog.
3. The guide dialog (`renderGuideDialog`) already works as a full-screen overlay with Pip art + 3-step bubble. It just needs to be triggerable again.

**Do NOT** change the first-play auto-trigger logic. Only add the manual replay path.

---

## P2 — UX Improvements

### 2-A. Pip first-play guide dialog: make it feel like a character conversation

**Context** (`docs/CONTEXT.md`, direction): "show 2-3 short character dialogue slides… it should feel like Pip is talking to the player."

**Current state**: `renderGuideDialog` (`src/ui/guideDialog.js`) already renders a full-screen overlay with Pip on the left and a speech bubble on the right. This is correct architecture. The problem is players may have already dismissed it and can't replay it (covered by 1-B above).

**Required fix**: No structural change needed. After 1-B is done, verify the dialog reads naturally as a character conversation by reviewing the i18n copy in `guide.puzzle.step1/2/3`. If the copy reads like a manual rather than Pip speaking directly, rewrite it to first-person Pip voice:
- Step 1: "숫자만큼 칸을 묶어 칠해봐요! 나머지 빈칸엔 X가 생겨요." 
- Step 2: "줄 옆 숫자는 그 줄에 들어갈 묶음 크기예요."
- Step 3: "준비됐으면 시작해봐요! 막히면 힌트도 있어요."

Keep it short, warm, and in Pip's voice. Not a rules explanation.

---

### 2-B. Promise chip layout check (v0.1.460)

v0.1.460 already rebuilt the opening promise chips with a measured grid instead of absolute badge overlap. **Verify** on the browser at 360px, 390px, 430px that all three chips ("그림 풀기", "팬트리 꾸미기", "타임어택 도전") are fully readable with no text clipping.

If still clipping at 360px: reduce font-size inside the chip promise text to `0.78rem` and ensure the action badge uses `flex-shrink: 0`.

---

## P3 — Visual Quality (CSS Polish Pass)

### 3-A. Floating nav icon artwork

**Current state**: v0.1.434 added decorative icon spans. These are CSS-drawn.

**Direction** (`docs/CONTEXT.md`, art gate rule): Navigation icons must use **approved PNG/WebP raster assets**, not CSS-drawn icons, before release. However, since those assets don't exist yet, the CSS artwork is the acceptable pre-release state.

**Required**: Ensure all 5 nav icons (puzzle, album, pantry, timeAttack, map) are clearly distinguishable and readable at the floating nav trigger button size. If the trigger button currently shows only text ("메뉴" + current view name), add the active view's icon to the trigger as well.

---

### 3-B. V1 Visual Finish Backlog (defer until after Billing gate)

**Do not** start the full icon art replacement pass until `qa:release:final` passes. The art pass covers:
- Fill / blank-check / undo tokens → real Sunny Spoon Studios assets
- D-pad arrows, hint spoon, settings icon
- Time Attack, Pantry/shop, pack/status chips

This is a coordinated pass, not piecemeal. **Hold until release blockers are clear.**

---

## P4 — Post-Release (Do Not Start Now)

These are confirmed user direction items recorded in `docs/CONTEXT.md` for after v1 launch:

| Item | Source |
|---|---|
| Drag/sweep cell selection on large boards | Direction 2026-07-10 |
| Completed-line feedback animations | Direction 2026-07-10 |
| Stronger hint bundles | Direction 2026-07-10 |
| Guided 5x5 demo (optional, after name entry) | Direction 2026-07-02 |
| Seasonal/quarterly puzzle packs | Launch roadmap |
| 1,000+ puzzle long-term target | Launch roadmap |

---

## Execution Order

```
1. Fix floating nav → position: fixed, bottom-right  (1-A)
2. Add guide replay button to Settings               (1-B)
3. Verify promise chip readability at 360px          (2-B)
4. Review/rewrite Pip guide copy to character voice  (2-A)
5. Verify floating nav icon discoverability          (3-A)
6. Bump version, run qa:candidate, build unsigned AAB
7. [Owner: non-Codex] Real-device Billing evidence
8. [Owner: non-Codex] Signed AAB + Play Console upload
```

---

## What NOT to Do

- Do not generate or embed AI-generated image assets. Raster assets require Sunny Spoon Studios review and approval. CSS artwork is acceptable as a placeholder only.
- Do not start the V1 icon art replacement pass (3-B) until Billing gate clears.
- Do not change puzzle logic, undo behavior, hint economy, Billing wiring, or Pantry purchase flow.
- Do not amend commits already pushed to `main`.

---

*This brief was prepared by Claude based on CONTEXT.md history, CLAUDE_REVIEW_LOG.md Reviews 160–173, and live browser measurement. Codex should treat this as authoritative scope for the next work slice.*

---

## NEW — UX 버그 및 텍스트 수정 (Steps 1–6)

> 위의 P1–P4 작업과 별개로 추가된 항목. 현재 브랜치 작업 완료 후 순서대로 처리.

---

### Step 1 — 팬트리 알림 닷 조건 개선

**파일:** `src/ui/puzzleHubView.js` (약 115번째 줄)

**현재 문제:**
```js
const hasNewPantryItem = PANTRY_JARS.some((jar) => !ownedJarIds.has(jar.id));
```
미구매 병이 하나라도 있으면 항상 빨간 닷 표시 → 사실상 영구 표시.

**변경:**
```js
const spoons = getPantrySpoons(); // save.js에서 이미 import됨
const hasNewPantryItem = PANTRY_JARS.some(
  (jar) => !ownedJarIds.has(jar.id) && jar.cost > 0 && jar.cost <= spoons
);
```
"지금 살 수 있는 병이 있을 때"만 닷 표시. 스푼이 부족하면 닷 없음.

**추가 확인:** `home.pantryLabel` 버튼(홈 허브 하단 네비)에도 동일 닷이 있는지 확인하고 같은 조건 적용.

---

### Step 2 — 시계 할아버지 팝업 화면 깨짐 수정

**파일:** `src/ui/guideDialog.js`

**현재 문제:**
팬트리에서 누적 3번째 병 구매 시 `pantryNeighborMrPark` 가이드 팝업이 트리거됨 (트리거 자체는 정상). 팝업이 팬트리 선반 배경 위에 제대로 올라오지 않고 화면이 깨진 것처럼 보임.

**변경:**
- 가이드 팝업 backdrop이 팬트리 뷰 전체를 완전히 덮도록 z-index 및 overlay 처리 수정
- 팝업이 열릴 때 배경 스크롤이 잠기는지 확인 (`overflow: hidden` on body or scroll container)
- 팝업 내부 캐릭터 이미지(`story-friend-mr-park-v1.png`)가 잘리지 않고 온전히 보이는지 확인

---

### Step 3 — 내비게이션 명칭 변경

**파일:** `src/i18n/ko.js`, `src/i18n/en.js`

**ko.js 변경:**

| 키 | 현재 | 변경 후 |
|---|---|---|
| `views.pantry` (18번째 줄 근처) | `"꾸미기 방"` | `"Pip의 팬트리"` |
| `home.pantryLabel` (395번째 줄 근처) | `"팬트리 꾸미기"` | `"Pip의 팬트리"` |

**en.js 변경:**

| 키 | 변경 후 |
|---|---|
| `views.pantry` | `"Pip's Pantry"` |
| `home.pantryLabel` | `"Pip's Pantry"` |

---

### Step 4 — 오늘의 그림 완성 상태 오표시 수정

**파일:** `src/game/save.js`, `src/game/dailyPuzzle.js`, `src/ui/puzzleHubView.js`

**현재 문제:**
오늘의 그림 완성 여부를 일반 `completedPuzzleIds`로 확인함. 해당 퍼즐을 이전에 일반 플레이로 풀었으면 "완성됨"으로 잘못 표시됨.

**변경:**
1. `save.js`에 오늘의 그림 전용 완성 기록 추가:
   - `getDailyCompletedDate()` — 저장된 날짜 반환 (없으면 null)
   - `recordDailyComplete(dateString)` — 오늘 날짜(`YYYY-MM-DD`)를 저장
2. 오늘의 그림 완료 처리 지점에서 `recordDailyComplete(today)` 호출
3. `puzzleHubView.js`의 `renderDailyCard()`에서 완성 여부를 `getDailyCompletedDate() === today`로 판단

오늘의 그림 완성 = 오늘 날짜에 한 번 완료 기록. 내일이 되면 자동으로 새 퍼즐로 리셋.

---

### Step 5 — 리플레이 도전 "다음 그림" 오동작 수정

**파일:** `src/ui/appShell.js` (`selectNextPuzzle()`, 112번째 줄 근처)

**현재 문제:**
리플레이 도전 완성 후 "다음 그림"을 누르면 `selectNextPuzzle()`이 호출되어 일반 미완성 퍼즐로 이동함. 리플레이 도전 컨텍스트를 벗어남.

**변경:**
- `replayChallenge` 상태가 `true`일 때 "다음 그림"은 `selectNextPuzzle()` 대신 **리플레이 후보 목록 내 다음 항목**을 선택하는 별도 함수 사용
- 리플레이 후보 목록은 `puzzleHubView.js`의 replay pool과 동일한 소스에서 가져올 것
- 리플레이 도전 중 "다음 그림" → 다음 리플레이 대상 퍼즐 (리플레이 모드 유지)
- 리플레이 후보를 모두 소진하면 리플레이 목록 화면으로 복귀

---

### Step 6 — 완성 화면 버튼 정리 (메뉴 버튼 제거)

**파일:** `src/ui/pipReaction.js` (`renderCompletionBanner()`, 17번째 줄 근처)

**현재 문제:**
완성 화면에 "메뉴로"(리플레이 도전 시 "뒤로") + "다음 그림" 두 버튼이 있음. floating nav(오른쪽 하단 둥근 네비 버튼)으로 메뉴 이동이 가능하므로 중복.

**변경:**
- `albumButton` 완전 제거
- `nextButton("다음 그림")` 단일 버튼만 유지
- 일반 퍼즐 완성, 리플레이 도전 완성 모두 동일하게 적용

```js
// 변경 전
actions.append(albumButton, nextButton);

// 변경 후
actions.append(nextButton);
```

`replayChallenge` 분기로 `albumButton` 텍스트를 바꾸던 코드도 함께 제거.

---

## NEW — 홈 화면 구조 개편 + 스푼 벌기 뷰 통합 (Steps 7–14)

> Steps 1–6 완료 후 처리. 설계 방향이 큰 변경이므로 Step 단위로 하나씩 완료·커밋할 것.

---

### Step 7 — 홈 화면에서 타임어택 카드 제거

**파일:** `src/ui/puzzleHubView.js`, `src/ui/appShell.js`

**현재 문제:**
홈 허브에 타임어택 카드(`renderTimeAttackTeaserCard`)가 표시되지만, floating nav에 이미 타임어택 전용 아이콘이 있어 중복.

**변경:**
- `renderPuzzleHub()` 내부에서 타임어택 카드를 렌더링하는 부분 제거
- `appShell.js`에서 `renderTimeAttackTeaserCard` 호출 제거
- 타임어택 진입은 floating nav 아이콘으로만 가능하게 통일
- 홈 허브는 퍼즐 플레이 버튼 + 오늘의 그림 + 다시 풀기 + 하단 네비로 정리

---

### Step 8 — "스푼 벌러 가기" 통합 뷰 신설 + 네비 아이콘 추가

**파일:** `src/ui/puzzleHubView.js`, `src/ui/floatingNav.js`, `src/ui/appShell.js`, `src/data/quickTravelArt.js`, `src/i18n/ko.js`, `src/i18n/en.js`

**설계:**
오늘의 그림 + 다시 풀기를 "스푼 벌러 가기" 테마로 하나의 뷰로 통합. floating nav에 새 아이콘 추가.

**변경 목록:**

1. `floatingNav.js` — `NAV_ITEMS`에 `["spoonRun", "views.spoonRun"]` 추가  
   ```js
   ["puzzle", "home.sceneAria"],
   ["spoonRun", "views.spoonRun"],   // ← 신규
   ["album", "views.album"],
   ["pantry", "views.pantry"],
   ["timeAttack", "views.timeAttack"],
   ["map", "views.map"],
   ["settings", "header.settings"]
   ```

2. `ko.js` / `en.js` — 새 i18n 키 추가:
   ```js
   views: { spoonRun: "스푼 벌러 가기" }   // ko
   views: { spoonRun: "Earn Spoons" }        // en
   ```

3. `quickTravelArt.js` — `spoonRun` 아이콘 등록 (스푼 토큰 이미지 `spoon-token-v2.png` 임시 사용)

4. `appShell.js` — `"spoonRun"` 뷰 케이스 추가: `renderSpoonRunView()` 렌더링

5. `puzzleHubView.js` — `renderSpoonRunView()` 함수 신규 작성:
   - 상단: "오늘의 그림" 섹션 (기존 `renderDailyCard` 내용)
   - 하단: "다시 풀기" 섹션 (기존 `renderReplayPicksCard` 내용)
   - 기존 홈 허브에서 두 카드 제거 (Step 7에서 타임어택 제거와 함께 정리)

6. 홈 허브 하단 네비(`destinationItems`)에도 `spoonRun` 아이콘 추가, 기존 `timeAttack` 아이콘 제거

---

### Step 9 — 오늘의 그림 게임 로직 재정비

**파일:** `src/game/save.js`, `src/game/dailyPuzzle.js`, `src/ui/appShell.js`

**현재 문제:**
- 오늘의 그림 완성 여부를 일반 `completedPuzzleIds`로 판단 → 이전에 일반 플레이로 풀었으면 "완성됨" 오표시 (= 기존 Step 4)
- 오늘의 그림 완료 후 "다음 그림" 버튼이 일반 퍼즐 플로우로 이동 → 스푼 벌러 가기 컨텍스트 탈출
- 스푼 지급 로직이 일반 퍼즐 완료와 동일 경로를 탐 → 이중 지급 또는 누락 위험

**변경:**
1. `save.js`에 날짜별 오늘의 그림 전용 완성 기록 추가:
   - `getDailyCompletedDate()` — 저장된 완성 날짜 반환 (없으면 null)
   - `recordDailyComplete(dateString)` — 오늘 날짜(`YYYY-MM-DD`) 저장
2. 오늘의 그림 완료 시 `recordDailyComplete(today)` 호출 + 완성 화면에서 "스푼 +N 획득" 표시
3. `renderDailyCard()` 완성 여부: `getDailyCompletedDate() === today`로만 판단
4. 오늘의 그림 완료 후 "다음 그림" → 다시 풀기 목록으로 이동 (스푼 벌러 가기 뷰 내 유지)
5. 오늘의 그림은 스푼 일일 보너스(`DAILY_BONUS = 8sp`)와 별개로 퍼즐 완료 보상 지급

---

### Step 10 — 다시 풀기 게임 로직 재정비

**파일:** `src/ui/appShell.js` (`selectNextPuzzle()`, `replayChallenge` 관련)

**현재 문제:**
- 다시 풀기 완료 후 "다음 그림"이 `selectNextPuzzle()`을 호출 → 일반 미완성 퍼즐로 이동 (= 기존 Step 5)
- 다시 풀기 후보 소진 시 어디로 가야 하는지 처리 없음
- 리플레이 도전 완료 후 스푼 지급 표시가 완성 화면에 명확히 보이지 않음

**변경:**
1. `replayChallenge === true` 상태에서 "다음 그림" 버튼 → 다시 풀기 후보 목록 내 다음 항목 선택 (리플레이 모드 유지)
2. 후보 소진 시 → "스푼 벌러 가기" 뷰(`spoonRun`)로 복귀
3. 다시 풀기 완료 화면에서 스푼 보상(`+1sp`) 및 하루 잔여 횟수 명확히 표시
4. `replayPicked` 플래그가 없는 일반 다시 풀기와 리플레이 도전 모드가 혼용되지 않도록 경로 분리

---

### Step 11 — 오늘의 그림 / 다시 풀기 Pip 온보딩 안내

**파일:** `src/ui/guideDialog.js`, `src/i18n/ko.js`, `src/i18n/en.js`, `src/game/save.js`

**설계:**
처음 "스푼 벌러 가기" 뷰를 열었을 때 Pip이 간단한 안내를 해줌. 한 번 보면 다시 뜨지 않음 (hasSeenGuide 패턴 재사용).

**추가할 가이드 ID:** `spoonRunIntro`

**안내 내용 (2 슬라이드):**

- 슬라이드 1 — 오늘의 그림:
  > "오늘의 그림을 풀면 스푼을 추가로 얻을 수 있어요! 매일 새 그림이 기다리고 있어요."

- 슬라이드 2 — 다시 풀기:
  > "이미 완성한 그림도 다시 도전할 수 있어요. 하루 3번까지 스푼을 받을 수 있답니다!"

**변경:**
1. `save.js`의 `SEEN_GUIDE_IDS`에 `"spoonRunIntro"` 추가
2. `guideDialog.js`에 `spoonRunIntro` 가이드 정의 추가 (Pip 캐릭터, 2슬라이드)
3. `ko.js` / `en.js`에 안내 텍스트 i18n 키 추가
4. `appShell.js`에서 spoonRun 뷰 최초 진입 시 `!hasSeenGuide("spoonRunIntro")`면 가이드 트리거

---

### Step 12 — 타임어택 힌트 UI 복원 확인

**파일:** `src/ui/puzzleView.js`, `src/ui/puzzleAssistView.js`

**현재 문제:**
타임어택 진행 중 퍼즐 화면에 힌트 버튼이 보이지 않음. `economyConfig.js`에는 `TIME_ATTACK_HINT_COSTS: [2, 4, 7]`로 로직이 존재하지만 UI에서 노출되지 않는 상태.

**변경:**
1. `puzzleView.js` 또는 `puzzleAssistView.js`에서 타임어택 모드일 때 힌트 버튼 렌더링 조건 확인
2. 타임어택 중 힌트 사용 가능하게 복원 (비용 2→4→7sp 순차 차감)
3. 힌트 사용 횟수가 최종 결과 기록에 반영되는지 (`hintsUsed`) 확인

---

### Step 13 — 타임어택 보상 경제체계 재검토

**파일:** `src/data/economyConfig.js`

**현재 값:**
```js
TIME_ATTACK_REWARD_BY_SIZE: { 5: 15, 8: 25, 10: 38, 12: 55 }
TIME_ATTACK_RECORD_BONUS: 12
TIME_ATTACK_DAILY_LIMIT: 3
```
8×8 기준 하루 최대 75sp → 일일 스푼 획득 비중에서 타임어택이 너무 큼.

**현재 경제 설계 기준** (`docs/ECONOMY_DESIGN_SPEC.md`):
일반 퍼즐 5×5=3sp, 8×8=6sp, 10×10=10sp, 12×12=15sp / 일일 보너스 8sp.

**변경 방향:**
타임어택 보상을 "일반 퍼즐 1판 보상의 약 3배" 수준으로 조정하여 매력은 유지하되 경제 과부하 방지:

| 크기 | 현재 | 변경 후 |
|---|---|---|
| 5×5 | 15sp | 10sp |
| 8×8 | 25sp | 18sp |
| 10×10 | 38sp | 30sp |
| 12×12 | 55sp | 45sp |

기록 갱신 보너스 12sp는 유지. 일일 한도 3회 유지.

---

### Step 14 — 누진 IAP 경제 수치 및 배지 글로우 확인

**파일:** `src/data/pantryJars.js`, `src/ui/mapView.js` (배지 뷰)

**14-A. 팬트리 선반 비용 누진 적용 확인**

기획서(REDESIGN_SPEC_V2)의 누진 비용 구조가 실제 `pantryJars.js`에 반영됐는지 검증:

| 선반 | 목표 비용 범위 |
|---|---|
| 잼 & 과일 병조림 | 유료 병 30–70sp |
| 꿀 & 시럽 | 40–90sp |
| 허브 & 꽃 | 20–95sp |
| 씨앗 & 향신료 | 20–110sp |
| 피클 | 25–135sp ★ (Stage 5부터 강화) |
| 과일청 | 65–200sp ★ |
| 허브오일 | 이후 선반 ★★ |
| 보태니컬 차 | 최고가 선반 ★★ |

현재 값이 위 범위와 맞지 않으면 후반 4개 선반(피클~차) 병 가격을 상향 조정.

**14-B. 배지 획득 시 골드 글로우 이펙트 추가**

배지를 새로 획득했을 때:
1. 토스트 메시지 표시 (기존 유지)
2. 해당 배지 슬롯에 `.badge-slot--just-earned` 클래스 추가 → CSS 골드 글로우 + pulse 애니메이션
3. 마지막 배지(`pip-full-pantry`) 획득 시 글로우 상시 유지

CSS 예시:
```css
.badge-slot--just-earned {
  animation: badge-glow 1.8s ease-out forwards;
}
@keyframes badge-glow {
  0%   { box-shadow: 0 0 0 0 rgba(255, 200, 60, 0); }
  30%  { box-shadow: 0 0 18px 6px rgba(255, 200, 60, 0.7); }
  100% { box-shadow: 0 0 0 0 rgba(255, 200, 60, 0); }
}
.badge-slot--permanent-glow {
  box-shadow: 0 0 12px 4px rgba(255, 200, 60, 0.4);
}
```

---

## NEW — UI 마무리 수정 (Steps 15–19)

> Steps 7–14 완료 후 처리.

---

### Step 15 — 완성 화면 "다음 그림" 버튼 가운데 정렬

**파일:** `src/styles.css` (`.completion-actions`, 611번째 줄 근처)

**현재 문제:**
Step 6에서 버튼을 1개로 줄였지만 CSS가 `grid-template-columns: 1fr 1fr` (2개 기준)으로 남아 있어 버튼이 왼쪽 절반에만 렌더링됨.

**변경:**
```css
/* 변경 전 */
.completion-actions {
  grid-template-columns: 1fr 1fr;
}

/* 변경 후 */
.completion-actions {
  grid-template-columns: 1fr;
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
}
```

---

### Step 16 — 완성 화면 스푼 내역 분리 표시

**파일:** `src/ui/puzzleView.js`, `src/ui/pipReaction.js`, `src/i18n/ko.js`, `src/i18n/en.js`

**현재 문제:**
퍼즐 완성 시 스테이지 보너스(예: 80sp)와 퍼즐 자체 보상(3sp)이 구분 없이 한 숫자로 합산되어 표시됨. 유저가 "오늘의 그림 1개에 80sp 줬다"고 오해함.

**변경:**
완성 화면 메시지를 보상 항목별로 분리 표시:

```
퍼즐 완성    +3sp
일일 보너스  +8sp
선반 완성 🎉 +80sp
```

- `renderCompletionBanner()`에 `stageBonus` 파라미터 추가
- 스테이지 보너스가 있을 때만 별도 줄 렌더링
- i18n 키 추가: `completion.stageBonus` ("선반 완성 보너스 +{count}sp")
- ko.js / en.js 각각 추가

---

### Step 17 — 스테이지 이름 통일 + 중복 퍼즐 수정

**17-A. 스테이지 이름 통일**

**파일:** `src/i18n/ko.js`, `src/i18n/en.js`, 관련 UI 파일

**현재 문제:**
퍼즐 피커, 배지, 스테이지 완성 화면이 각각 다른 i18n 키를 참조해 같은 선반을 다른 이름으로 표시함.
- 퍼즐 피커: `shelves.pipsFirst` ("Pip's First Shelf")
- 배지: `badges.pipsFirstShelf` ("First Shelf Badge")
- 팩: `packs.pips-first-shelf.title`

**변경:**
선반 이름의 단일 소스를 `shelves.*` 키로 통일. 배지·스테이지 완성 화면에서 선반 이름을 표시할 때 모두 `shelves.*` 키를 참조하도록 수정. 각 화면에서 선반 이름을 어떤 키로 가져오는지 일괄 점검.

**17-B. 중복 퍼즐 수정**

**파일:** `src/data/puzzles.js`, `src/i18n/ko.js`, `src/i18n/en.js`

**현재 문제:**
`pips-first-shelf-spoon-3`과 `pips-first-shelf-spoon-2-13`의 solution이 완전히 동일 (`['01100','01100','00100','00100','00100']`). 같은 그림을 이름만 다르게 두 번 넣은 상태.

**변경:**
`pips-first-shelf-spoon-2-13` (13번째 퍼즐)의 solution을 **다른 스푼 형태**로 교체.
- 새 solution은 기존 spoon-3와 확연히 다른 실루엣이어야 함 (예: 가로로 놓인 스푼, 더 굵은 손잡이 등)
- ko.js / en.js의 해당 퍼즐 title/imageName도 구분되도록 수정 (예: "반짝이는 스푼" → "나무 스푼")
- solution 변경 후 Vitest 실행해 중복 감지 테스트 통과 확인

---

### Step 18 — "Hide Completed" 버튼 → 선반별 접기 화살표

**파일:** `src/ui/puzzleHubView.js`, `src/styles.css`, `src/i18n/ko.js`, `src/i18n/en.js`

**현재 문제:**
`createStageFilterBar()`로 구현된 전역 토글 버튼이 퍼즐 피커 상단에 따로 떠 있어 다른 UI와 어울리지 않음.

**변경:**
- 전역 `createStageFilterBar()` 함수 및 관련 버튼 **삭제**
- 각 스테이지 섹션 헤더 오른쪽에 개별 ▼/▲ 토글 화살표 추가
- 완성된 스테이지는 기본 상태로 **접혀 있음** (collapsed by default)
- 미완성 스테이지는 기본 펼쳐져 있음 (expanded by default)
- 화살표 클릭 시 해당 섹션만 펼치기/접기 (개별 동작, 전체 토글 아님)
- `hideCompletedStages` 전역 상태 및 `getHideCompletedStagesPreference()` 제거
- 접힘 상태는 세션 내에서만 유지 (localStorage 저장 불필요)

---

### Step 19 — 퍼즐 피커 바둑판 모자이크 제거

**파일:** `src/ui/puzzleHubView.js` (473–509번째 줄 근처), `src/styles.css`

**현재 문제:**
각 스테이지 섹션 상단에 완성한 퍼즐 셀을 타일로 쌓은 fallback 모자이크가 표시됨. 현재 앱 비주얼 컨셉(병 선반, 캐릭터 아트)과 어울리지 않음.

**변경:**
- `renderStageMosaic()` 및 `renderFallbackMosaic()` 함수 **삭제**
- `getStageArtUrl()`, `hasApprovedStageArt()` 호출 제거
- 해당 모자이크 컨테이너(`.pip-tile-mosaic`, `.stage-tile-mosaic`) CSS도 함께 제거
- 스테이지 섹션은 헤더(이름 + 진행 카운트) + 퍼즐 그리드만 남김

---

## NEW — 힌트 시스템 확장 + 경제 조정 (Steps 20–22)

> Steps 15–19 완료 후 처리.

---

### Step 20 — 소형 퍼즐(5×5, 8×8) 힌트 추가

**파일:** `src/ui/puzzleAssistView.js`, `src/data/economyConfig.js`

**현재 문제:**
`getHintLimit(puzzle)` 함수가 `puzzle.size < 10`이면 `return 0`을 반환 → 5×5, 8×8 퍼즐에서 힌트가 완전히 없음. 처음 플레이하는 유저는 막막할 수 있음.

**현재 코드 (puzzleAssistView.js):**
```js
export function getHintLimit(puzzle) {
  if (puzzle.size < 10) return 0;   // 5×5, 8×8 힌트 없음
  if (puzzle.size < 12) return 3;
  if (puzzle.size < 15) return 4;
  return 5;
}
```

**변경:**
```js
export function getHintLimit(puzzle) {
  if (puzzle.size <= 5)  return 1;   // 5×5: 무료 1회
  if (puzzle.size <= 8)  return 2;   // 8×8: 무료 2회
  if (puzzle.size < 12) return 3;
  if (puzzle.size < 15) return 4;
  return 5;
}
```

**economyConfig.js — 소형 퍼즐 추가 힌트 비용 추가:**
```js
PUZZLE_EXTRA_HINT_BASE_COST_BY_SIZE: {
  5: 3,    // ← 신규
  8: 5,    // ← 신규
  10: 6,
  12: 9,
  15: 13,
  18: 18
}
```

- 무료 힌트 소진 후 추가 힌트는 스푼 차감 (5×5: 3sp, 8×8: 5sp/회)
- 힌트 셀 공개 개수는 기존 로직(`getHintRevealCount()`) 그대로 — 5×5는 1셀, 8×8은 1셀

---

### Step 21 — IAP 가격 및 스푼 수량 조정

**파일:** `src/data/economyConfig.js`, `src/data/iapProducts.js` (또는 Billing 관련 파일)

**현재 문제:**
- `COZY_PASS_SPOON_GRANT: 250` ($0.99) vs `SPOON_JAR_SMALL_GRANT: 750` ($2.99)
- 3 × $0.99 = $2.97 ≈ $2.99인데 750sp로 동일 → 대형 팩 구매 동인 제로
- `SPOON_JAR_SMALL_GRANT: 750`은 중간 스테이지 병(~500sp)을 한 번에 살 수 있어 경제 압력이 너무 낮음

**변경:**

| 제품 | 현재 | 변경 후 | 이유 |
|---|---|---|---|
| `COZY_PASS_SPOON_GRANT` ($0.99) | 250sp | 150sp | 소팩 단가 낮춤 → 대팩 상대 메리트 생김 |
| `SPOON_JAR_SMALL_GRANT` ($2.99) | 750sp | 500sp | 3×소팩=450sp < 대팩=500sp → 11% 보너스로 차별화 |

```js
// economyConfig.js (또는 iapProducts.js)
COZY_PASS_SPOON_GRANT: 150,   // 변경 (기존 250)
SPOON_JAR_SMALL_GRANT: 500,   // 변경 (기존 750)
```

**주의:** Billing 연동 시 실제 수량을 서버 또는 앱 내 상품 정의에서 가져온다면 해당 위치도 함께 수정. UI에 sp 수량이 하드코딩된 곳(상품 설명 문자열, i18n 키 등) 일괄 점검.

---

### Step 22 — 팬트리 섹션 eyebrow 텍스트 제거

**파일:** `src/i18n/ko.js` (558번째 줄 근처), `src/i18n/en.js`, `src/ui/pantryView.js`

**현재 문제:**
`pantry.jar.eyebrow: "팬트리 유리병 수집"` — 유리병만 수집하는 지금은 맞지만 나중에 다른 수집품이 추가되면 바로 낡은 문구가 됨.

**변경:**
- `ko.js`: `"팬트리 유리병 수집"` → `"Pip의 팬트리"` (또는 eyebrow 키 자체 제거)
- `en.js`: 동일 키 → `"Pip's Pantry"` (또는 제거)
- `pantryView.js`에서 해당 eyebrow를 렌더링하는 부분 확인:
  - eyebrow가 섹션 제목과 중복이면 **렌더링 자체 제거** 권장
  - 섹션 구분 목적이면 단순히 텍스트만 변경

---

### Step 23 — 다시 풀기 3/3 소진 시 완성 화면 처리

**파일:** `src/ui/pipReaction.js`, `src/ui/appShell.js`, `src/i18n/ko.js`, `src/i18n/en.js`

**현재 문제:**
다시 풀기를 3/3 모두 소진한 후 마지막 퍼즐 완성 화면에서도 "다음 그림" 버튼이 그대로 표시됨. 더 이상 보상이 없는 상태에서 계속 진행을 유도하는 건 부자연스러움.

**변경:**
1. `renderCompletionBanner()`에 `replayExhausted` 파라미터 추가
2. `replayExhausted === true`일 때:
   - "다음 그림" 버튼 **숨김**
   - 대신 완성 메시지 아래에 종료 문구 표시:
     - ko: `"오늘의 다시 풀기는 여기까지! 내일 또 도전해봐요 🍀"`
     - en: `"That's all for today's replays! Come back tomorrow 🍀"`
   - "스푼 벌러 가기로 돌아가기" 버튼 하나만 표시 → `spoonRun` 뷰로 이동
3. `appShell.js`에서 다시 풀기 완료 후 잔여 횟수(`replayCount`)가 0이면 `replayExhausted: true`로 완성 화면 호출

**i18n 추가 키:**
```js
// ko.js
completion: {
  replayExhausted: "오늘의 다시 풀기는 여기까지! 내일 또 도전해봐요 🍀",
  backToSpoonRun: "스푼 벌러 가기로 돌아가기"
}

// en.js
completion: {
  replayExhausted: "That's all for today's replays! Come back tomorrow 🍀",
  backToSpoonRun: "Back to Earn Spoons"
}
```

---

### Step 24 — 설정 진행 초기화 실제 동작 수정

**파일:** `src/ui/appShell.js` (`confirmReset()`), `src/game/save.js` (`resetProgress()`)

**현재 문제:**
`resetProgress()`는 `localStorage.removeItem(getActiveSaveKey())`만 실행함. 그러나 `confirmReset()` 이후 `draw()`만 호출하기 때문에, **이미 메모리에 로드된 앱 상태(completedPuzzleIds, spoons, pantryJars 등)가 그대로 남아** 있어 초기화가 체감되지 않음. 웹 환경에서는 네이티브와 달리 앱이 종료되지 않으므로 특히 두드러짐.

**변경:**

`confirmReset()` (`appShell.js`, 334번째 줄 근처):
```js
function confirmReset() {
  resetProgress();
  // 페이지 새로고침으로 모든 인메모리 상태 초기화
  window.location.reload();
}
```

이 방법이 가장 단순하고 확실함. 새로고침 시 LocalStorage의 save 키가 없으므로 초기 상태로 시작됨.

**확인 사항:**
- 초기화 확인 다이얼로그(confirm dialog)가 이미 존재하는지 확인 (`requestReset` → confirm 단계)
- 존재하면 확인 후 `reload()` 실행
- 존재하지 않으면 초기화 버튼 클릭 시 확인 다이얼로그 먼저 띄운 후 확인 시 `reload()` 실행
- `ACTIVE_PLAYER_KEY`(플레이어 정보)는 초기화 범위에 포함할지 여부 결정 필요:
  - 포함 시: 이름 입력 화면부터 다시 시작
  - 미포함 시: 같은 플레이어 이름으로 퍼즐 진행만 초기화
  - **권장: 미포함** (이름은 유지, 퍼즐·스푼·팬트리 진행만 초기화)

---

### Step 25 — 오늘의 그림 완성 후 플로우 개선

**파일:** `src/ui/pipReaction.js`, `src/ui/puzzleHubView.js`, `src/ui/appShell.js`, `src/i18n/ko.js`, `src/i18n/en.js`

**현재 문제:**
오늘의 그림은 하루에 1개뿐인데 완성 후 "다음 그림" 버튼이 표시됨 → 누르면 엉뚱한 퍼즐로 이동하거나 어색한 동작 발생. 또한 스푼 벌러 가기 뷰의 오늘의 그림 카드가 완료 후에도 "풀기" 버튼 그대로 남아 있음.

**변경 1 — 완성 화면 (pipReaction.js):**
- `renderCompletionBanner()`에 `isDailyPuzzle` 파라미터 추가
- `isDailyPuzzle === true`일 때:
  - "다음 그림" 버튼 **숨김**
  - 완성된 그림 reveal은 그대로 표시
  - 스푼 지급 내역 표시 (Step 16과 동일 포맷: `퍼즐 완성 +Nsp`, `일일 보너스 +8sp`)
  - "확인" 버튼 1개만 표시 → 클릭 시 `spoonRun` 뷰로 이동

```js
// i18n 추가
completion: {
  dailyDone: "오늘의 그림 완료!",   // ko
  confirm: "확인"                    // ko (이미 있으면 재사용)
}
// en
completion: {
  dailyDone: "Daily picture complete!",
  confirm: "OK"
}
```

**변경 2 — 스푼 벌러 가기 뷰 오늘의 그림 카드 (puzzleHubView.js):**
- `renderDailyCard()`에서 오늘 이미 완료(`getDailyCompletedDate() === today`)인 경우:
  - 버튼 텍스트를 "풀기" → "완료 ✓" 로 변경
  - 버튼 비활성화(`disabled`) 또는 스타일 변경으로 이미 완료됐음을 시각적으로 표시
  - 클릭해도 퍼즐로 이동하지 않음

**변경 3 — appShell.js:**
- 오늘의 그림 완료 시 `renderCompletionBanner`에 `isDailyPuzzle: true` 전달

---

### Step 26 — 전체 뷰 공통 스푼 잔액 표시

**파일:** `src/ui/appShell.js`, `src/ui/spoonIcon.js` (또는 새 `src/ui/spoonBalanceBar.js`), `src/styles.css`

**현재 문제:**
스푼 잔액이 `pantryView.js`의 `pantry-jar-header`에만 표시됨. 스푼 벌러 가기, 타임어택, 앨범, 배지 등 다른 뷰에서는 잔액을 전혀 알 수 없어 퍼즐 완성 후 스푼 변화를 체감하기 어려움.

**설계 방향:**
뷰별로 각각 구현하지 말고, `appShell.js`에서 **현재 활성 뷰 위에 항상 오버레이되는 공통 스푼 칩**을 렌더링. 팬트리 뷰는 기존 `pantry-jar-balance`가 있으므로 중복 표시 방지.

**변경:**

1. **공통 스푼 칩 컴포넌트 (`spoonIcon.js` 또는 신규 파일):**
```js
export function renderSpoonBalanceChip(spoons) {
  const chip = document.createElement("div");
  chip.className = "spoon-balance-chip";
  appendSpoonLabel(chip, t("currency.spoons", { count: spoons }), "small");
  return chip;
}
```

2. **CSS (`styles.css`):**
```css
.spoon-balance-chip {
  position: fixed;
  top: 12px;
  right: 16px;
  z-index: 100;
  background: var(--surface-raised);
  border-radius: 999px;
  padding: 4px 12px 4px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(0,0,0,0.12);
  pointer-events: none;
}
```

3. **appShell.js — `draw()` 내부:**
   - 기존 스푼 칩 요소를 제거하고 새로 렌더링 (잔액 변경 시 자동 반영)
   - **팬트리 뷰(`pantry`)일 때는 칩 숨김** → `pantry-jar-header`의 기존 잔액 표시와 중복 방지
   - 퍼즐 플레이 화면(`puzzle` 뷰)에서는 이미 퍼즐 UI 내 스푼 표시가 있는지 확인 후 결정 (없으면 표시)

4. **스푼 변경 즉시 반영:**
   - 퍼즐 완성, 구매, 힌트 사용 등 `draw()`를 호출하는 모든 시점에 칩도 자동 갱신됨 (별도 구독 불필요)

---

### Step 27 — 퍼즐 스테이지 잠금 해제 조건 안내 개선

**배경 (Step 28 이후 적용):**
Step 28로 스푼 unlock 비용이 제거된 후, 스테이지 잠금 해제 조건은 두 가지만 남음:
1. 이전 스테이지 퍼즐 **모두 완성** (`isSeasonShelfComplete`)
2. Pip의 팬트리 유료 병 **누적 N개** 소유 (`pantryRoomStepRequired`)

현재 잠금 카드에는 "N개 더 필요"만 표시되고 무엇이 부족한지(퍼즐인지 팬트리인지) 구분이 없음. Step 29의 팬트리 연결성 표시와 함께 동작해야 함.

**파일:** `src/ui/puzzleHubView.js` (잠금 스테이지 렌더링 부분), `src/i18n/ko.js`, `src/i18n/en.js`

**변경 — 잠금 스테이지 카드에 조건별 상태 표시:**

잠금된 스테이지 카드에 충족/미충족 조건을 각각 표시:

```
[ 퍼즐 완성 ] ✓ 이전 선반 완성   or   ✗ 퍼즐 N개 더 필요
[ 팬트리    ] ✓ 팬트리 조건 충족  or   ✗ 잼 & 과일 병조림 선반 N개 더 필요
```

구현:
1. `getShelfPantryRoomRequirement()` 결과로 팬트리 조건 상태 파악
2. `isSeasonShelfComplete(previousShelf)` 결과로 퍼즐 조건 상태 파악
3. 각 조건을 체크마크(✓)/엑스(✗) + 짧은 설명으로 렌더링
4. 두 조건 모두 충족 시 자동 개방 (버튼 불필요 — Step 28에서 unlock 비용 제거됨)

**i18n 추가 키:**
```js
// ko.js
shelf: {
  lockConditionPuzzle: "이전 퍼즐 {count}개 더 필요",
  lockConditionPuzzleDone: "이전 선반 완성 ✓",
  lockConditionPantry: "팬트리 병 {count}개 더 필요",
  lockConditionPantryDone: "팬트리 조건 충족 ✓",
}
```

---

### Step 28 — 스테이지 unlock 비용 제거 (팬트리 선반 완성만으로 개방)

**파일:** `src/data/seasonShelves.js`, `src/game/save.js`, `src/ui/puzzleHubView.js`, `src/i18n/ko.js`, `src/i18n/en.js`

**배경:**
현재 스테이지 unlock 조건이 **스푼 비용 + 팬트리 병 N개** 이중 조건이라, 팬트리에 스푼을 쓸수록 다음 스테이지를 열 스푼이 부족해지는 구조적 충돌이 있음. 스푼을 팬트리 병 구매에만 집중시키고 스테이지는 선반 완성이 자동 개방 조건이 되도록 변경.

**변경 1 — `seasonShelves.js`: 모든 스테이지 `unlockCost` 0으로 설정**

```js
// 변경 전 예시
{ id: "shelf-sunny-counter", unlockCost: 60, pantryRoomStepRequired: 5, ... }
{ id: "shelf-apron-drawer",  unlockCost: 75, pantryRoomStepRequired: 10, ... }
// ...

// 변경 후: 모든 unlockCost → 0
{ id: "shelf-sunny-counter", unlockCost: 0, pantryRoomStepRequired: 5, ... }
{ id: "shelf-apron-drawer",  unlockCost: 0, pantryRoomStepRequired: 10, ... }
```

`pantryRoomStepRequired`(누적 유료 병 수)는 그대로 유지. 각 선반 완성(병 5개) = 5 paid jars 추가 → 다음 스테이지 자동 개방.

**변경 2 — `save.js` `canUnlockShelf()` / `isShelfUnlocked()` 정리**

스푼 잔액 조건(`getPantrySpoons() >= unlockCost`) 제거. 팬트리 조건만 남김:
```js
export function canUnlockShelf(shelf) {
  if (!shelf || isShelfUnlocked(shelf)) return false;
  const previousShelf = getPreviousSeasonShelf(shelf);
  return Boolean(previousShelf)
    && isSeasonShelfComplete(previousShelf, getCompletedPuzzleIds())
    && getShelfPantryRoomRequirement(shelf).met;
}
```

**변경 3 — `puzzleHubView.js`: 잠금 카드에서 스푼 부족 메시지 제거**

스테이지 잠금 카드에서 "스푼 N개 부족" 표시 제거. 팬트리 조건 미충족 메시지만 남김.

**변경 4 — i18n: 스테이지 unlock 스푼 관련 키 제거 또는 미사용 처리**

---

**변경 5 — 퍼즐 보상 및 스테이지 보너스 하향 조정**

스테이지 unlock 비용이 사라지면서 스푼 지출처가 팬트리 병 구매만 남음. 퍼즐 보상을 그대로 두면 F2P로 팬트리 전체(3,310sp)를 너무 쉽게 달성해 IAP 동인이 사라지므로 보상을 줄임.

**경제 시뮬레이션 (조정 후):**

| 항목 | 수익 |
|---|---|
| 퍼즐 완성 (전 스테이지) | ~2,000sp |
| 스테이지 보너스 (전체) | ~500sp |
| 일일 보너스 90일 (8sp/일) | ~720sp |
| 타임어택 적당히 | ~300sp |
| **F2P 총 획득 가능** | **~3,520sp** |
| 팬트리 전체 비용 | 3,310sp |
| **여유분** | **+210sp** |

후반 3개 선반(과일청+오일+차) 합계 2,070sp — 전체의 63%. 이 구간에서 IAP 구매 동인 자연 발생.

**`src/data/economyConfig.js` 퍼즐 보상 변경:**

```js
// 변경 전
PUZZLE_REWARD_BY_SIZE: { 5: 3, 8: 6, 10: 10, 12: 15 }

// 변경 후
PUZZLE_REWARD_BY_SIZE: { 5: 2, 8: 4, 10: 6, 12: 10 }
```

**`src/data/seasonShelves.js` 스테이지 보너스 변경:**

| 스테이지 | 현재 stageBonus | 변경 후 |
|---|---|---|
| shelf-pips-first | 80sp | 50sp |
| shelf-sunny-counter | 50sp | 30sp |
| shelf-apron-drawer | 50sp | 30sp |
| shelf-market-counter | 35sp | 25sp |
| shelf-window-table | 35sp | 25sp |
| shelf-morning-bakery | 40sp | 25sp |
| shelf-pastry-corner | 45sp | 30sp |
| shelf-tin-row | 45sp | 30sp |
| shelf-bakery-window | 50sp | 30sp |
| shelf-village-square | 50sp | 35sp |
| shelf-market-table | 55sp | 35sp |
| shelf-clock-corner | 55sp | 35sp |
| shelf-bakery-walk | 60sp | 40sp |
| shelf-garden-path | 60sp | 40sp |
| shelf-village-pantry | 100sp | 60sp |

**일일 보너스 및 타임어택 보상은 유지** (리텐션 목적, 경제 비중 작음)

---

### Step 29 — 팬트리 선반 ↔ 퍼즐 스테이지 연결성 표시

**파일:** `src/ui/pantryView.js`, `src/ui/puzzleHubView.js`, `src/i18n/ko.js`, `src/i18n/en.js`

**배경 (Step 28 이후 적용):**
각 팬트리 선반이 어떤 퍼즐 스테이지 개방과 연결되는지 양쪽에서 명확히 보여줘야 함.

**선반 ↔ 스테이지 매핑 (pantryRoomStepRequired 기준):**

| 팬트리 선반 완성 | 개방되는 퍼즐 스테이지 |
|---|---|
| 잼 & 과일 병조림 (5 jars) | 햇살 카운터 |
| 꿀 & 시럽 (10 jars) | 앞치마 서랍 |
| 허브 & 꽃 (15 jars) | 마켓 카운터 + 창가 테이블 |
| 씨앗 & 향신료 (20 jars) | 아침 베이커리 + 패스트리 코너 |
| 피클 (25 jars) | 양철 선반 + 베이커리 창가 |
| 과일청 (30 jars) | 마을 광장 + 마켓 테이블 |
| 허브오일 (35 jars) | 시계 코너 + 베이커리 산책로 |
| 보태니컬 차 (40 jars) | 정원 길 + 마을 팬트리 |

**변경 1 — `pantryView.js`: 선반 헤더에 연결 스테이지 표시**

각 팬트리 선반 섹션 상단에 뱃지 형태로:
```
🧩 완성하면 → 햇살 카운터 스테이지 개방
```
- 이미 해당 스테이지가 열린 경우: `✓ 햇살 카운터 개방됨` (비활성 색상)
- 아직 안 열린 경우: `🧩 완성하면 햇살 카운터 열림` (강조)

**변경 2 — `puzzleHubView.js`: 잠금 스테이지 카드에 필요한 팬트리 선반 표시**

잠금된 스테이지 카드에:
```
🏺 잼 & 과일 병조림 선반 완성 필요
   (현재 3/5 병 보유)
```

**i18n 추가 키:**
```js
// ko.js
pantry: {
  shelfUnlocksStage: "완성하면 '{stage}' 스테이지가 열려요",
  shelfStageUnlocked: "'{stage}' 스테이지 개방됨 ✓",
}
shelf: {
  requiresPantryShelf: "'{shelf}' 선반 완성 필요",
  pantryProgress: "현재 {current}/{total}개 보유",
}
```

---

### Step 30 — 퍼즐방 스테이지 전체 목록 표시 + 완료 표시 + 기대감 문구

**파일:** `src/ui/puzzleHubView.js`, `src/i18n/ko.js`, `src/i18n/en.js`

**현재 문제:**
- 완료한 스테이지에 완료 표시가 없음
- 잠긴 스테이지가 다음 1개만 보이거나, 전체 목록이 보이지 않아 앞으로 뭐가 있는지 알 수 없음
- 잠긴 스테이지 내용(어떤 그림들이 있는지)에 대한 예고가 없어 진행 동기 부족

**변경:**

**1. 완료 스테이지 — 완료 뱃지 표시**

완료된 스테이지 섹션 헤더에 완료 표시 추가:
```
[Pip의 첫 선반]  ✓ 완료  ▼
```
- 헤더 오른쪽에 `완료` 뱃지 (초록 계열 pill)
- 완료 스테이지는 기본 접힘(Step 18과 동일 방향)

**2. 잠긴 스테이지 — 전체 목록 표시**

현재 다음 1개만 보이는 구조라면 **모든 잠긴 스테이지를 목록으로 표시**.
각 잠긴 스테이지 카드:
```
┌─────────────────────────────┐
│ 🔒 햇살 카운터               │
│ 5×5 퍼즐 10개 · 8×8 퍼즐 10개 │
│                              │
│ [ 잼 선반 완성 필요 · 3/5 ]   │
└─────────────────────────────┘

┌─────────────────────────────┐
│ 🔒 앞치마 서랍               │  ← 더 먼 스테이지도 보임
│ 5×5 퍼즐 5개 · 8×8 퍼즐 12개 · 10×10 퍼즐 3개 │
│                              │
│ [ 꿀 선반 완성 필요 ]         │
└─────────────────────────────┘
```

- 퍼즐 그리드(실제 이미지)는 잠금 상태에서 흐리게(blur 또는 실루엣) 표시
- 잠금 조건은 Step 27에서 정의한 포맷 그대로 사용
- 팬트리 선반과의 연결 문구는 Step 29에서 정의한 키 재사용

**3. 잠긴 스테이지 기대감 문구**

각 스테이지에 `seasonShelves.js`의 `titleKey`와 연결된 짧은 예고 문구 추가.
`src/i18n/ko.js`에 각 스테이지별 `shelves.*.teaser` 키 추가:

```js
shelves: {
  sunnyCounter:   { teaser: "따뜻한 카운터 위, 스푼과 레시피가 기다려요" },
  apronDrawer:    { teaser: "앞치마 서랍 속 아늑한 도구들을 발견해봐요" },
  marketCounter:  { teaser: "마켓 카운터의 싱싱한 풍경을 담아보세요" },
  windowTable:    { teaser: "창가 테이블에서 햇살을 바라보는 오후" },
  morningBakery:  { teaser: "아침 베이커리의 구수한 냄새가 느껴져요" },
  pastryCorner:   { teaser: "달콤한 패스트리가 가득한 코너" },
  tinRow:         { teaser: "양철 통들이 줄지어 선 정겨운 선반" },
  bakeryWindow:   { teaser: "베이커리 창가 너머로 보이는 거리 풍경" },
  villageSquare:  { teaser: "마을 광장의 활기찬 하루를 담아요" },
  marketTable:    { teaser: "시장 테이블 위 알록달록한 제철 재료들" },
  clockCorner:    { teaser: "시계 코너에서 느긋하게 흐르는 시간" },
  bakeryWalk:     { teaser: "베이커리 산책로의 소소한 발견들" },
  gardenPath:     { teaser: "정원 길을 따라 피어난 허브와 꽃들" },
  villagePantry:  { teaser: "마을 팬트리의 모든 보물이 모였어요 🌿" },
}
```

teaser 문구는 스테이지 카드 하단에 작은 글씨로 표시. 잠긴 상태에서만 노출, 완료 후 숨김.


---

### Step 31 — Floating Nav `position: fixed` 수정 ⚠️ 릴리즈 블로커

**파일:** `src/styles.css` (`.floating-nav`, 2692번째 줄)

**현재 문제:**
```css
.floating-nav {
  position: sticky;
  bottom: 10px;
  /* ... */
}
```
`position: sticky`이므로 페이지 최하단으로 스크롤해야만 nav가 보임. 모바일에서 뷰 상단 진입 시 팬트리·타임어택·앨범·배지 메뉴가 사실상 숨겨진 상태 — 출시 전 반드시 수정 필요.

**변경:**
```css
.floating-nav {
  position: fixed;
  right: 16px;
  bottom: 20px;
  z-index: 50;
  pointer-events: none;
  /* 제거: width, margin, display:grid */
}
```

- trigger 버튼은 항상 우하단에 고정, 스크롤 위치 무관하게 노출
- 메뉴 패널(`.floating-nav__menu`)은 trigger 위로 열리는 구조 유지
- `z-index: 50` — 완성 화면·가이드 팝업(z-index 100–200)보다 낮게 설정
- 변경 후 360px·390px·430px 세 가지 너비에서 trigger가 항상 우하단에 보이는지 확인

---

### Step 32 — 메인 화면(Pip의 퍼즐방) 뷰 타이틀 표시

**파일:** `src/ui/puzzleHubView.js`, `src/i18n/ko.js`, `src/i18n/en.js`

**현재 문제:**
Floating nav에서 메인 화면 아이콘 레이블이 `views.puzzle = "퍼즐"` 이고, 메인 화면 진입 시 상단에 현재 뷰 이름이 표시되지 않음. 다른 뷰(팬트리, 타임어택 등)도 동일하지만, 메인 화면은 특히 "여기가 Pip의 퍼즐방입니다"라는 컨텍스트를 줄 레이블이 없어 어색함.

**변경 1 — i18n 키 수정:**
```js
// ko.js
views: {
  puzzle: "Pip의 퍼즐방",   // 변경 (기존 "퍼즐")
  ...
}

// en.js
views: {
  puzzle: "Pip's Puzzle Room",  // 변경 (기존 "Puzzle")
  ...
}
```

**변경 2 — `puzzleHubView.js` 상단 헤더 타이틀 추가:**
- 퍼즐방 뷰 최상단(그리팅 Pip 위 또는 아래)에 `h1` 또는 뷰 타이틀 레이블 추가
- 스타일: 다른 뷰 헤더와 동일한 시각적 계층
- 텍스트: `t("views.puzzle")` → "Pip의 퍼즐방"
- floating nav 레이블, 홈 허브 내 탭 등 `views.puzzle` 키를 참조하는 곳 모두 자동 반영됨

---

### Step 33 — 모든 퍼즐 완료 후 "지금 풀기" 클릭 시 안내 메시지

**파일:** `src/ui/puzzleHubView.js`, `src/ui/appShell.js`, `src/i18n/ko.js`, `src/i18n/en.js`

**현재 문제:**
현재 스테이지의 퍼즐을 모두 완료한 상태에서 "지금 풀기"를 누르면 이미 완료한 퍼즐들이 그대로 떠서 다시 풀게 됨. 다음 스테이지가 잠겨 있을 때 유저가 어디로 가야 하는지 알 수 없음.

**변경:**
현재 스테이지 퍼즐 전체 완료 + 다음 스테이지 잠김 상태에서 "지금 풀기" 클릭 시:
1. 퍼즐로 바로 이동하지 않고 안내 팝업 표시
2. 팝업 내용:
   - Pip 캐릭터 + 말풍선
   - "이 선반 그림은 모두 완성했어요! 다음 선반을 열려면 팬트리를 먼저 꾸며봐요 🏺"
   - 버튼 1: "팬트리 꾸미러 가기" → 팬트리 뷰로 이동
   - 버튼 2: "스푼 벌러 가기" → spoonRun 뷰로 이동
3. 다음 스테이지가 열려 있으면 기존과 동일하게 해당 스테이지 퍼즐로 이동

**판단 조건 (`appShell.js`):**
```js
const allCurrentComplete = isSeasonShelfComplete(currentShelf, completedPuzzleIds);
const nextShelfLocked = !isShelfUnlocked(nextShelf);
if (allCurrentComplete && nextShelfLocked) {
  // 안내 팝업 표시
}
```

**i18n 추가 키:**
```js
// ko.js
guide: {
  allPuzzlesDone: "이 선반 그림은 모두 완성했어요!",
  unlockNextHint: "다음 선반을 열려면 팬트리를 먼저 꾸며봐요 🏺",
  goToPantry: "팬트리 꾸미러 가기",
  goToSpoonRun: "스푼 벌러 가기",
}
```

---

### Step 34 — 로그인(앱 실행) 시 일일 스푼 지급

**파일:** `src/game/save.js`, `src/ui/appShell.js`, `src/data/economyConfig.js`, `src/i18n/ko.js`, `src/i18n/en.js`

**배경:**
현재 `DAILY_BONUS: 8`은 오늘의 그림 완료 시 지급됨. 로그인 보너스는 별도로 없음.
로그인 보너스를 추가하면 DAU(일일 접속자) 리텐션에 도움이 되고, 스푼을 벌기 위해 매일 앱을 여는 동기가 생김.

**단, Step 28 경제 재설계와 연동 필요** — 로그인 보너스가 추가되면 F2P 총 획득 가능 스푼이 늘어나므로 Step 28 시뮬레이션에 반영해야 함. Step 28 이후에 처리.

**경제 영향 시뮬레이션:**
- 로그인 보너스 3sp/일 × 90일 = 270sp 추가
- Step 28 기준 F2P 총 획득 가능: 3,520sp + 270sp = **3,790sp**
- 팬트리 전체 비용 3,310sp 대비 여유 480sp → IAP 동인 유지
- 5sp는 여유가 너무 커지고, 3sp가 "매일 조금씩 쌓인다"는 느낌에 적절

**변경:**

1. `economyConfig.js`에 로그인 보너스 추가:
```js
LOGIN_BONUS: 3,  // 신규
```

2. `save.js`에 로그인 보너스 지급 로직 추가:
```js
export function claimLoginBonus(dateKey = getLocalDateKey()) {
  const save = loadSave();
  if (save.lastLoginBonusDate === dateKey) return null; // 오늘 이미 수령
  save.lastLoginBonusDate = dateKey;
  save.spoons = (save.spoons || 0) + ECONOMY.LOGIN_BONUS;
  writeSave(save);
  return ECONOMY.LOGIN_BONUS;
}
```

3. `appShell.js` 앱 초기화 시 `claimLoginBonus()` 호출:
   - 반환값이 있으면(오늘 첫 접속) **Pip 말풍선 알림** 표시:
     - 토스트가 아닌 Pip 캐릭터 + 말풍선 형태 (가이드 팝업보다 가볍게, 탭하면 닫힘)
     - 내용: "안녕! 오늘도 왔구나 🥄 스푼 3개 가져왔어요!"
     - 자동으로 3초 후 사라지거나 탭 시 닫힘
     - 홈 화면(puzzleHub 뷰)이 완전히 렌더링된 후 표시 (앱 로딩 중 아님)
   - 이미 수령한 날이면 조용히 무시

4. i18n 추가:
```js
// ko.js
toast: {
  loginBonus: "오늘의 스푼 +{count}개! 🥄"
}
// en.js
toast: {
  loginBonus: "+{count} daily spoons! 🥄"
}
```

---

### Step 35 — 진열 병에 실제 의미 부여: 홈 화면 + 완성 화면 노출

**파일:** `src/ui/pantryView.js`, `src/ui/puzzleHubView.js`, `src/ui/pipReaction.js`, `src/game/save.js`, `src/i18n/ko.js`, `src/i18n/en.js`

**배경:**
현재 "이 병 진열하기(`equipAction`)"는 선반에서 노란 테두리 하이라이트를 줄 병을 선택하는 기능뿐. 모든 병이 이미 선반에 보이고 있어 유저가 기능의 의미를 오해함. 진열 선택이 실제로 앱 내 다른 곳에 반영되도록 해서 "내가 고른 병"이 의미를 갖게 함.

**변경 1 — 홈 화면(puzzleHubView.js): 현재 진열 병 표시**

현재 풀고 있는 스테이지와 연결된 팬트리 선반의 진열 병을 홈 화면 상단 또는 Pip 옆에 작게 표시:
```
[Pip 이미지]  🏺 [진열된 병 이미지 + 이름]
              오렌지 마말레이드
```
- `getEquippedJarForCurrentStage()` — 현재 스테이지의 `pantryRoomStepRequired`에 해당하는 선반의 진열 병 반환
- 진열 병이 없으면(선반 미개방) 표시 안 함
- 탭하면 팬트리 뷰로 이동

**변경 2 — 완성 화면(pipReaction.js): 퍼즐 완성 시 진열 병 등장**

퍼즐 완성 화면 하단에 현재 스테이지 연결 선반의 진열 병을 작게 표시:
```
✨ 완성! [퍼즐 reveal]

🏺 오늘의 팬트리  [병 이미지]  오렌지 마말레이드
```
- 진열 병이 있을 때만 노출, 없으면 숨김
- `renderCompletionBanner()`에 `equippedJar` 파라미터 추가

**변경 3 — i18n 키 수정:**
```js
// ko.js
pantry: {
  equipAction: "이 병 선택하기",        // 변경 (기존 "이 병 진열하기") — 선택의 의미로 명확화
  equipped: "현재 선택됨 ✓",            // 변경 (기존 "진열 중")
  todaysPantry: "오늘의 팬트리",        // 신규
}
// en.js
pantry: {
  equipAction: "Select this jar",
  equipped: "Selected ✓",
  todaysPantry: "Today's Pantry",
}
```

**변경 4 — `save.js`: 현재 스테이지 연결 선반 진열 병 조회 함수 추가**
```js
export function getEquippedJarForCurrentStage() {
  const equippedJars = getEquippedDecorations(); // 기존 함수 재사용
  const currentShelf = getCurrentSeasonShelf();   // 현재 진행 중 스테이지
  if (!currentShelf) return null;
  // pantryRoomStepRequired → 해당 JAR_SHELF 매핑
  const jarShelfId = getLinkedJarShelfId(currentShelf);
  const equippedJarId = equippedJars[jarShelfId];
  return equippedJarId ? getJarById(equippedJarId) : null;
}
```

---

### Step 36 — 스푼 잔액 칩 아이콘 크기 수정 ⚠️ 시각 버그

**파일:** `src/styles.css`

**현재 문제:**
`.spoon-balance-chip .spoon-icon`에 `width`/`height` 제한이 없어 스푼 이미지가 원본 크기 그대로 노출됨. 칩 위에 스푼 아이콘이 팝업처럼 크게 떠있는 상태.

**변경:**
```css
.spoon-balance-chip .spoon-icon {
  flex: 0 0 auto;
  width: 20px;      /* 추가 */
  height: 20px;     /* 추가 */
  object-fit: contain;
}
```

확인 사항:
- 칩 높이 32px 기준으로 아이콘 20px이 자연스럽게 들어맞는지 확인
- 숫자 텍스트와 아이콘이 수직 정렬되는지 확인
- 배지 뷰, 타임어택, 스푼 벌러 가기 등 여러 뷰에서 칩 크기 일정한지 확인

---

### Step 37 — 홈 화면 배지 전시 (선택된 배지 1개 표시)

**파일:** `src/ui/puzzleHubView.js`, `src/ui/mapView.js` (배지 뷰), `src/game/save.js`, `src/i18n/ko.js`, `src/i18n/en.js`

**배경:**
Step 35에서 홈 화면에 선택된 팬트리 병을 전시하는 것과 동일한 맥락. 배지도 유저가 1개를 골라 홈 화면에 전시하면 성취욕을 지속적으로 자극하고 배지 수집 동기가 강화됨.

**변경 1 — 배지 뷰(`mapView.js`): 배지 선택 기능 추가**

배지를 탭하면 뜨는 상세 팝업에 "홈에 전시하기" 버튼 추가:
- 현재 선택된 배지면 "전시 중 ✓" (비활성)
- 다른 배지면 "홈에 전시하기" → 선택 저장
- 배지가 없는(미획득) 슬롯은 선택 불가

**변경 2 — `save.js`: 선택된 배지 저장/조회**
```js
export function setFeaturedBadge(badgeId) {
  const save = loadSave();
  save.featuredBadgeId = badgeId;
  writeSave(save);
}

export function getFeaturedBadgeId() {
  return loadSave()?.featuredBadgeId || null;
}
```

**변경 3 — 홈 화면(`puzzleHubView.js`): 팬트리 병 + 배지 나란히 전시**

Pip 아래 또는 옆에 작은 전시 영역:
```
┌─────────────────────────────┐
│  🏺 오렌지 마말레이드        │
│  🏅 Pip의 첫 선반 배지       │
└─────────────────────────────┘
```
- 팬트리 병: Step 35에서 구현한 `getEquippedJarForCurrentStage()` 재사용
- 배지: `getFeaturedBadgeId()`로 조회, 획득한 배지 이미지 표시
- 둘 다 탭 시 각각 팬트리 / 배지 뷰로 이동
- 선택된 배지 없으면 "배지를 골라보세요" 빈 슬롯 또는 숨김 처리

**i18n 추가 키:**
```js
// ko.js
badge: {
  featureOnHome: "홈에 전시하기",
  featuredOnHome: "전시 중 ✓",
  noFeatured: "배지를 골라보세요",
}
// en.js
badge: {
  featureOnHome: "Display on home",
  featuredOnHome: "Displayed ✓",
  noFeatured: "Pick a badge to display",
}
```

---

### Step 38 — 홈 화면 뷰 타이틀 색상 수정 + 한국어 "핍" 통일

**38-A. 홈 화면 "Pip의 퍼즐방" 텍스트 가독성 수정**

**파일:** `src/styles.css` (`.puzzle-hub-title` 또는 해당 h1 클래스)

**현재 문제:**
배경 이미지가 어두운 구석인 좌상단에 텍스트가 위치해 있어 어두운 글씨색으로는 잘 안 보임.

**변경:**
- 텍스트 색상을 밝은 크림 계열로 변경: `color: #fff8f0` 또는 `color: var(--surface-raised)`
- 가독성 확보를 위해 텍스트 섀도 추가:
```css
text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
```
- 배경 이미지가 밝은 경우도 있으므로 반투명 다크 pill 배경으로 감싸는 것도 고려:
```css
background: rgba(0, 0, 0, 0.25);
border-radius: 8px;
padding: 4px 10px;
```

---

**38-B. 한국어 전체 "Pip" → "핍" 통일**

**파일:** `src/i18n/ko.js`

`ko.js` 내 한국어 문맥에서 사용되는 모든 `Pip` → `핍` 으로 교체.
단, 다음은 **변경하지 않음**:
- 앱 타이틀 고유명사: `"Pip's Picture Pantry"` (브랜드명)
- 영문 ariaLabel 등 영어 문맥
- `en.js` 파일 (영문 버전은 Pip 유지)

**변경 대상 예시:**
```js
// 변경 전
views: { puzzle: "Pip의 퍼즐방", pantry: "Pip의 팬트리" }
badges: { groupA: "선반 A - Pip의 첫걸음" }
settings: { guideReplayTitle: "Pip의 가이드" }

// 변경 후
views: { puzzle: "핍의 퍼즐방", pantry: "핍의 팬트리" }
badges: { groupA: "선반 A - 핍의 첫걸음" }
settings: { guideReplayTitle: "핍의 가이드" }
```

`ko.js` 전체를 일괄 검색해서 한국어 문맥의 `Pip` 를 모두 `핍` 으로 교체. 작업 후 앱 전체 뷰를 순회하며 어색한 부분 없는지 확인.

---

### Step 39 — 잠긴 스테이지 카드 내부 여백 수정

**파일:** `src/styles.css`

**현재 문제:**
`.pack-block--locked` 에 `padding`이 없어 내부 콘텐츠(퍼즐 미리보기, 조건 텍스트, 버튼)가 점선 테두리에 바로 붙어 있음.

**변경:**
```css
/* 기존 */
.pack-block--locked {
  border: 1.5px dashed rgba(180, 140, 90, 0.42);
  background: rgba(255, 251, 238, 0.62);
}

/* 변경 후 */
.pack-block--locked {
  border: 1.5px dashed rgba(180, 140, 90, 0.42);
  background: rgba(255, 251, 238, 0.62);
  padding: 14px 16px;   /* 추가 */
}
```

- 내부 요소들이 점선 테두리와 최소 14–16px 간격 유지
- `pack-header`, `locked-stage-preview`, `locked-stage-summary`, `locked-stage-teaser`, `.unlock-panel` 등 모든 자식 요소에 자동 적용
- 모바일 360px에서도 콘텐츠가 잘리지 않는지 확인

---

### Step 40 — 플로팅 네브 트리거 버튼 크기 및 여백 조정

**배경:**
"지금 풀기" 트리거 버튼(`min-height: 58px`)이 메뉴 아이템들(`min-height: 62~66px`)보다 오히려 작음. 트리거가 가장 크게 눈에 들어와야 함.

**파일:** `src/styles.css`

**변경 1 — 트리거 버튼 크기 확대:**
```css
/* 기존 */
.app-shell--play .floating-nav__trigger {
  min-height: 58px;
  ...
}

/* 변경 후 */
.app-shell--play .floating-nav__trigger {
  min-height: 68px;   /* 메뉴 아이템(62~66px)보다 크게 */
  ...
}
```

**변경 2 — 하단 여백 확대 + safe-area 공식 수정:**

Step 31에서 추가된 아래 규칙에 버그가 있음:
```css
/* Step 31에서 추가된 현재 코드 (버그) */
.floating-nav {
  bottom: max(20px, env(safe-area-inset-bottom)) !important;
}
```
iPhone 홈 인디케이터(~34px)가 있으면 `max(20px, 34px) = 34px`만 적용되어, safe area 바로 경계선에 붙어버림. "safe area 위로 20px"가 아님.

```css
/* 수정 후 — 기존 Step 31 규칙을 덮어씀 */
.floating-nav {
  bottom: max(20px, calc(env(safe-area-inset-bottom, 0px) + 20px)) !important;
}
```

- 트리거 아이콘도 34px → 40px로 맞춰서 텍스트 레이아웃 비율 유지
- `app-shell--play .floating-nav` bottom도 `max(86px, calc(env(safe-area-inset-bottom, 0px) + 86px))`로 동일하게 수정

---

### Step 41 — 스푼 잔액 칩 전체 뷰 통일 적용

**배경:**
현재 `appShell.js`가 전역 `spoon-balance-chip`(position: fixed)을 렌더링하고 있지만, 팬트리 뷰는 별도로 `pantry-jar-balance`를 헤더 안에 자체 렌더링하고 있어 스푼 잔액이 두 번 표시됨. 또한 칩이 홈 화면 설정 기어 아이콘, 앨범/배지 뷰 헤더 텍스트와 겹치는 문제가 있음.

**목표:**
- 스푼 잔액은 전역 `spoon-balance-chip` 하나만 사용
- 모든 뷰에서 동일한 위치·스타일로 표시
- 어떤 뷰에서도 다른 UI 요소와 겹치지 않음

**파일:** `src/ui/pantryView.js`, `src/styles.css`, `src/ui/appShell.js`

**변경 1 — 팬트리 자체 잔액 표시 제거 (`pantryView.js`):**

`renderPantryView()` 안의 `pantry-jar-balance` 요소 생성 코드 제거:
```js
// 제거할 코드 (pantryView.js ~272번째 줄)
const balance = appendTextElement(header, "div", "pantry-jar-balance", "");
appendSpoonLabel(balance, t("pantry.jar.balance", { count: getPantrySpoons() }));
balance.setAttribute("aria-label", t("currency.spoons", { count: getPantrySpoons() }));
```
전역 칩이 이미 잔액을 표시하므로 중복 불필요.

**변경 2 — 칩 위치 조정 (`styles.css`):**

홈 화면: 설정 기어 아이콘(우상단)과 겹치지 않도록 칩을 기어 왼쪽에 위치:
```css
/* 기존: right: max(16px, env(safe-area-inset-right)) */
/* → 설정 버튼(약 44px) + 간격(8px)을 고려 */
.spoon-balance-chip {
  right: max(68px, calc(env(safe-area-inset-right, 0px) + 68px));
}
```

단, 뷰에 설정 버튼이 없는 경우(앨범, 배지, 팬트리 등)는 더 오른쪽으로 붙어도 되므로, 설정 버튼이 있는 뷰(`app-shell--workshop-home`)에서만 right 값 조정:
```css
/* 홈 화면(설정 기어 있음) */
.app-shell--workshop-home .spoon-balance-chip {
  right: max(68px, calc(env(safe-area-inset-right, 0px) + 68px));
}

/* 나머지 뷰는 기본값(16px) 유지 */
```

**변경 3 — 칩 스타일 통일:**
칩 내 텍스트 포맷을 `spoonIcon.js`에서 일관되게 유지. 현재 뷰마다 "스푼 12 🔑" / "🔑 12" 등 다르게 보이는 원인 확인 후 `renderSpoonBalanceChip()`이 항상 동일 포맷을 출력하는지 검증.

**확인 사항:**
- 홈, 앨범, 팬트리, 배지, 타임어택, 스푼 벌러 가기 각 뷰에서 칩이 겹침 없이 표시되는지
- 팬트리에서 잔액이 중복 표시되지 않는지
- 칩 수치가 스푼 소비/획득 즉시 갱신되는지

---

### Step 42 — 미획득 배지 상세 프리뷰 흐림 처리

**파일:** `src/ui/mapView.js`

**현재 문제:**
배지 그리드(슬롯)에서는 미획득 배지에 `badge-slot__lock` 오버레이를 씌워 흐리게 처리하지만, 배지를 탭했을 때 하단에 노출되는 상세 프리뷰(`showBadgeDetail()`)에서는 `createBadgeImage()`만 호출하여 획득 여부와 무관하게 배지 아트가 선명하게 노출됨.

**변경 (`mapView.js` `showBadgeDetail()` 함수):**
```js
// 기존 (123번째 줄 근처)
const image = createBadgeImage(status.badge.id);

// 변경 후
const image = createBadgeImage(status.badge.id);
if (!status.earned) {
  image.classList.add("badge-image--locked");  // 흐림 처리 클래스 추가
}
```

또는 그리드 슬롯과 동일한 구조로 `badge-circle` + `badge-slot__lock` 오버레이를 상세 영역에도 적용:
```js
const imageWrap = document.createElement("span");
imageWrap.className = "badge-circle" + (status.earned ? "" : " locked");
imageWrap.appendChild(createBadgeImage(status.badge.id));
if (!status.earned) {
  const lock = document.createElement("span");
  lock.className = "badge-slot__lock";
  lock.textContent = status.completed + "/" + status.total;
  imageWrap.appendChild(lock);
}
detail.append(imageWrap, copy);
```

- 미획득 배지 프리뷰는 그리드와 동일하게 흐림(locked 상태) 처리
- 획득 완료 배지는 기존과 동일하게 선명하게 표시
- 진행도 숫자(`0/20`)도 함께 표시하여 그리드와 일관성 유지

---

### Step 43 — 홈 화면 팬트리 병 + 배지 진열 위치 통합 재설계

**배경:**
현재 배지(`top: 38%, right`)가 홈 화면 우측 네비 아이콘(앨범, Pip의 팬트리)과 정확히 겹치고, 팬트리 병(`top: 25%, left: 50%`)은 말풍선 영역에 걸침. 두 요소가 각각 독립적으로 배치되어 시각적 조화가 없음.

**파일:** `src/styles.css`

**변경 방향:**
병과 배지를 각각 독립된 floating 요소로 두지 않고, **화면 하단 Play Now 버튼 위**에 가로 나란히 한 줄로 배치. 이 위치는 기존 네비 아이콘과 겹치지 않고, 두 요소가 함께 보여 "내 진열장" 개념이 자연스럽게 전달됨.

```
[pip 캐릭터 영역]

        ┌──────────┐  ┌──────────┐
        │ 🏺 병 이름 │  │ 🥇 배지명 │
        └──────────┘  └──────────┘
              [Play Now 버튼]
```

**변경 1 — 팬트리 병 위치 (`puzzle-home-scene__featured-jar`):**
```css
/* 기존 */
.app-shell--workshop-home .puzzle-home-scene__featured-jar {
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
}

/* 변경 후 */
.app-shell--workshop-home .puzzle-home-scene__featured-jar {
  position: absolute;
  bottom: calc(max(20px, env(safe-area-inset-bottom, 0px) + 20px) + 72px); /* Play Now 버튼(68px) + 간격 */
  left: max(16px, env(safe-area-inset-left, 0px));
  transform: none;
  max-width: calc(50vw - 24px);
}
```

**변경 2 — 배지 위치 (`puzzle-home-scene__featured-badge`):**
```css
/* 기존 */
.app-shell--workshop-home .puzzle-home-scene__featured-badge {
  position: absolute;
  top: 38%;
  right: clamp(12px, 4vw, 24px);
}

/* 변경 후 */
.app-shell--workshop-home .puzzle-home-scene__featured-badge {
  position: absolute;
  bottom: calc(max(20px, env(safe-area-inset-bottom, 0px) + 20px) + 72px);
  right: max(16px, env(safe-area-inset-right, 0px));
  top: auto; /* top 해제 */
}
```

- 병(왼쪽)과 배지(오른쪽)가 같은 `bottom` 기준선에서 양쪽으로 배치
- Play Now 버튼과 겹치지 않는 높이 유지
- 배지만 있거나 병만 있어도 각자 자기 위치에서 표시 (독립적)
- 소형 화면(max-height: 700px)에서는 병 이름 텍스트 숨김(기존 규칙 유지)

---

### Step 44 — 스푼 잔액 칩 탭 시 스푼 구매 화면 연결

**파일:** `src/ui/spoonIcon.js`, `src/ui/appShell.js`, `src/styles.css`

**현재 문제:**
`renderSpoonBalanceChip()`이 `div` 요소를 반환하고 CSS에서 `pointer-events: none`으로 설정되어 있어 클릭 불가. 스푼이 부족한 유저가 잔액을 탭했을 때 구매 화면으로 연결되는 자연스러운 진입점이 없음.

**변경 1 — `spoonIcon.js`: 콜백 파라미터 추가, `button`으로 변경:**
```js
export function renderSpoonBalanceChip(spoons, onTap = null) {
  const chip = document.createElement(onTap ? "button" : "div");
  if (onTap) {
    chip.type = "button";
    chip.addEventListener("click", onTap);
  }
  chip.className = "spoon-balance-chip";
  const label = t("currency.spoons", { count: Number(spoons) || 0 });
  appendSpoonLabel(chip, label, "small");
  chip.setAttribute("aria-label", label);
  return chip;
}
```

**변경 2 — `appShell.js`: 스푼 스토어 열기 콜백 전달:**
```js
// 기존
shell.appendChild(renderSpoonBalanceChip(getPantrySpoons()));

// 변경 후
shell.appendChild(renderSpoonBalanceChip(getPantrySpoons(), () => {
  // 팬트리 뷰로 이동 후 스푼 스토어 열기
  // 기존 onOpenSpoonStore 콜백과 동일한 방식 사용
  onSelectView("pantry");
  // 또는 settings 내 스푼 스토어 직접 오픈 (구현에 따라 선택)
}));
```

단, 퍼즐 풀기 중(`app-shell--play`)에는 칩이 보이지 않거나 클릭 무시해도 됨 — 플레이 화면 이탈 방지.

**변경 3 — `styles.css`: 버튼일 때 커서 및 hover 피드백:**
```css
.spoon-balance-chip:is(button) {
  pointer-events: auto;
  cursor: pointer;
}
.spoon-balance-chip:is(button):hover {
  background: rgba(255, 248, 215, 0.98);
  box-shadow: 0 3px 10px rgba(74, 55, 40, 0.2);
}
.spoon-balance-chip:is(button):active {
  transform: translateY(1px);
}
```

**확인 사항:**
- 모든 뷰(홈, 앨범, 배지, 타임어택 등)에서 칩 탭 시 스푼 구매 화면으로 이동
- 퍼즐 풀기 중에는 인터랙션 차단 또는 칩 숨김 유지
- 스푼 구매 후 칩 숫자가 즉시 갱신되는지 확인

---

### Step 45 — 누락 수정 묶음 + "스푼 벌러 가기" 문구 변경

#### 45-A — 잠긴 스테이지 카드 내부 여백 (Step 39 누락)

**파일:** `src/styles.css`

`.pack-block--locked` 두 곳 모두에 padding 추가:
```css
.pack-block--locked {
  border: 1.5px dashed rgba(180, 140, 90, 0.42);
  background: rgba(255, 251, 238, 0.62);
  padding: 14px 16px;   /* 추가 */
}
```

#### 45-B — 플로팅 네브 트리거 크기 + safe-area 수정 (Step 40 누락)

**파일:** `src/styles.css`

1. 트리거 버튼 `min-height: 58px → 68px`, 아이콘 `34px → 40px`
2. safe-area 공식 수정 (Step 31에서 잘못 적용됨):
```css
.floating-nav {
  bottom: max(20px, calc(env(safe-area-inset-bottom, 0px) + 20px)) !important;
}
.app-shell--play .floating-nav {
  bottom: max(86px, calc(env(safe-area-inset-bottom, 0px) + 86px)) !important;
}
```

#### 45-C — 홈 화면 팬트리 병 + 배지 위치 통합 (Step 43 누락)

**파일:** `src/styles.css`

병(왼쪽 하단)과 배지(오른쪽 하단)를 Play Now 버튼 위에 좌우 배치:
```css
.app-shell--workshop-home .puzzle-home-scene__featured-jar {
  position: absolute;
  bottom: calc(max(20px, env(safe-area-inset-bottom, 0px) + 20px) + 80px);
  left: max(16px, env(safe-area-inset-left, 0px));
  top: auto;
  transform: none;
  max-width: calc(50vw - 24px);
}
.app-shell--workshop-home .puzzle-home-scene__featured-jar:active {
  transform: translateY(1px);
}
.app-shell--workshop-home .puzzle-home-scene__featured-badge {
  position: absolute;
  bottom: calc(max(20px, env(safe-area-inset-bottom, 0px) + 20px) + 80px);
  right: max(16px, env(safe-area-inset-right, 0px));
  top: auto;
}
@media (max-height: 700px) {
  .app-shell--workshop-home .puzzle-home-scene__featured-jar { bottom: calc(... + 68px); }
  .app-shell--workshop-home .puzzle-home-scene__featured-badge { bottom: calc(... + 68px); }
}
```
`top: auto`로 기존 `top: 25%` / `top: 38%` 규칙을 명시적으로 해제할 것.

#### 45-D — "스푼 벌러 가기" → "스푼 모으러 가기"

**파일:** `src/i18n/ko.js`

```js
// 변경 전
views: { spoonRun: "스푼 벌러 가기" }  // line 23
guide: { goToSpoonRun: "스푼 벌러 가기" }  // line 228

// 변경 후
views: { spoonRun: "스푼 모으러 가기" }
guide: { goToSpoonRun: "스푼 모으러 가기" }
```

**파일:** `src/i18n/en.js`

```js
// 변경 전
views: { spoonRun: "Earn Spoons" }

// 변경 후
views: { spoonRun: "Collect Spoons" }
```

확인: 홈 화면 아이콘 레이블, 플로팅 네브 메뉴, 가이드 팝업 버튼 등 `spoonRun` / `goToSpoonRun` 키를 참조하는 모든 곳에 자동 반영.

---

### Step 46 — 홈 화면 진열 선반 통합 재설계

**배경:**
Step 35(팬트리 병)와 Step 37(배지) 각각 독립 구현되었으나 세 가지 문제:
1. 팬트리 병 상세에 "홈에 표시" 전용 버튼 없어 유저가 선택 방법을 모름
2. 배지가 흰 카드 + 이름 텍스트로 과하게 렌더링됨 (원하는 건 배지 이미지만)
3. 병과 배지가 각각 떠있어 "미니 선반" 개념이 전달되지 않음

---

#### 46-A — 팬트리 병 "홈에 표시하기" 버튼 추가 (`pantryView.js`)

소유한 병 상세 팝업에 현재 `equipAction`("이 병 선택하기") 외에 홈 표시 전용 버튼 추가:

```js
// showJarDetail() 내부, equipped 여부와 무관하게 owned이면 표시
if (owned) {
  const homeBtn = document.createElement("button");
  homeBtn.type = "button";
  homeBtn.className = "pantry-jar-detail__btn-home";
  const isFeatured = getFeaturedJarId() === jar.id;
  homeBtn.textContent = isFeatured
    ? t("pantry.jar.featuredOnHome")   // "홈에 전시 중 ✓"
    : t("pantry.jar.featureOnHome");    // "홈에 전시하기"
  homeBtn.disabled = isFeatured;
  if (!isFeatured) {
    homeBtn.addEventListener("click", () => {
      setFeaturedJar(jar.id);
      close();
      onRefresh?.();
    });
  }
  actions.appendChild(homeBtn);
}
```

`save.js`에 추가:
```js
export function setFeaturedJar(jarId) {
  const save = loadSave();
  save.featuredJarId = jarId ? String(jarId) : null;
  writeSave(save);
}
export function getFeaturedJarId() {
  return loadSave()?.featuredJarId || null;
}
```

`puzzleHubView.js`에서 병 조회 방식 변경:
```js
// 기존: getEquippedJarForCurrentStage() — 스테이지-선반 링크 의존
// 변경: getFeaturedJarId()로 직접 조회
const featuredJarId = getFeaturedJarId();
const featuredJar = featuredJarId ? getJarById(featuredJarId) : null;
```

이렇게 하면 스테이지-선반 링크 버그에 무관하게 유저가 직접 고른 병이 홈에 표시됨.

i18n 추가:
```js
// ko.js
pantry: { jar: {
  featureOnHome: "홈에 전시하기",
  featuredOnHome: "홈에 전시 중 ✓"
}}
// en.js
pantry: { jar: {
  featureOnHome: "Display on home",
  featuredOnHome: "Displayed on home ✓"
}}
```

---

#### 46-B — 홈 화면 미니 선반 컨테이너로 통합 (`puzzleHubView.js`, `styles.css`)

병과 배지를 각각 `scene.appendChild`로 따로 추가하지 않고 하나의 컨테이너에 묶음:

```js
// 기존: scene.appendChild(featuredJarCard), scene.appendChild(featuredBadge) 따로
// 변경:
if (featuredJar || featuredBadgeStatus) {
  const shelf = document.createElement("div");
  shelf.className = "home-keepsake-shelf";
  if (featuredJar) shelf.appendChild(/* 병 이미지만 */);
  if (featuredBadgeStatus) shelf.appendChild(/* 배지 이미지만 */);
  scene.appendChild(shelf);
}
```

위치:
```css
.app-shell--workshop-home .home-keepsake-shelf {
  position: absolute;
  bottom: calc(max(20px, env(safe-area-inset-bottom, 0px) + 20px) + 80px);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  align-items: flex-end;
  z-index: 5;
}
```
화면 하단 중앙, Play Now 버튼 위에 가로 나란히.

---

#### 46-C — 이미지만 표시 (카드/이름 제거)

**병:** `renderFeaturedJar()` 대신 홈용 간소화 렌더:
```js
const jarImg = document.createElement("img");
jarImg.className = "home-keepsake-jar";
jarImg.src = getJarArtUrl(featuredJar.id);
jarImg.alt = t(featuredJar.nameKey);
```

**배지:** 흰 카드(`border`, `background`, `box-shadow`) 및 이름 텍스트 제거:
```css
/* 기존 규칙 덮어씀 */
.app-shell--workshop-home .puzzle-home-scene__featured-badge {
  border: none;
  background: none;
  box-shadow: none;
  padding: 0;
  width: clamp(52px, 14vw, 68px);
}
.app-shell--workshop-home .puzzle-home-scene__featured-badge-name {
  display: none;
}
```

또는 JS에서 배지 이름 요소 자체를 생성하지 않도록 제거.

---

**확인 사항:**
- 팬트리 병 상세에서 "홈에 전시하기" 탭 → 홈 화면에 즉시 반영
- 병과 배지가 하단 중앙에 나란히 표시
- 배지만 있거나 병만 있어도 각자 중앙 정렬 유지
- Play Now 버튼과 겹치지 않는지 확인

---

### Step 47 — 인트로(온보딩) 화면에서 스푼 잔액 칩 숨기기

**파일:** `src/styles.css`

**현재 문제:**
`시작` 버튼이 있는 인트로 화면에서 우상단에 스푼 잔액(스푼 12 🔑)이 표시됨. 게임 시작 전이라 맥락에 맞지 않음.

**변경:**
기존 `.floating-nav` 숨김 패턴과 동일하게 추가:
```css
#app[data-intro-open="true"] .spoon-balance-chip {
  visibility: hidden;
  pointer-events: none;
}
```

한 줄 추가로 완료.

---

### Step 48 — 팬트리 병 이름 2줄 표시 (모바일 최적화)

**파일:** `src/styles.css`

**현재 문제:**
`white-space: nowrap`으로 긴 이름이 말줄임표로 잘림. 특히 영어("Orange Marmalade", "Lavender Honey" 등)에서 심각.

**핵심 설계 원칙:**
이름 줄 수가 달라도 병 아트가 일정 높이에 정렬되어야 함.
→ 이름 영역에 2줄 높이를 **항상 예약**해서 1줄 이름도 2줄 공간을 차지하게 함.

**변경 1 — 병 이름 2줄 허용:**
```css
/* 기존 */
.pantry-jar__name,
.pantry-jar__price,
.pantry-jar__status {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 0.68rem;
  line-height: 1.15;
}

/* 변경 후 */
.pantry-jar__name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;           /* nowrap 해제 */
  text-overflow: unset;          /* -webkit-box와 충돌 방지 */
  min-height: calc(0.68rem * 1.2 * 2);  /* 2줄 높이 항상 예약 */
  word-break: break-word;
  font-size: 0.68rem;
  line-height: 1.2;
  text-align: center;
}

/* price/status는 기존 nowrap 유지 (짧은 텍스트) */
.pantry-jar__price,
.pantry-jar__status {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

**변경 2 — 병 그리드 열 정렬 수정:**
```css
/* 기존 */
.pantry-shelf__jars {
  align-items: end;
}

/* 변경 후 */
.pantry-shelf__jars {
  align-items: stretch;   /* 모든 셀이 같은 높이 → 아트 정렬 일정 */
}
```

**변경 3 — 병 카드 내부 레이아웃:**
```css
.pantry-jar-panel .pantry-jar {
  justify-content: space-between;  /* 아트 위, 이름 아래 */
  min-height: 128px;               /* 116px → 2줄 이름 여유분 추가 */
}
```

**변경 4 — 소형 화면(max-width: 380px) 조정:**
```css
@media (max-width: 380px) {
  .pantry-jar__name {
    font-size: 0.62rem;
    min-height: calc(0.62rem * 1.2 * 2);
  }
}
```

**확인 사항:**
- 375px / 360px 모바일에서 3열 기준 이름 2줄 표시 확인
- 6열 태블릿 뷰에서도 아트 정렬 일정한지 확인
- "현재 선택됨 ✓" / "15 🔑" 등 하단 status/price는 그대로 1줄 유지
- 선반 보드(갈색 막대)와 병 하단 간격 자연스러운지 확인

---

### Step A1 — 앱스토어 프로모션 스크린샷 아트웍 제작 (출시 후 교체용)

**시점:** Step 48 완료 직후, 바이너리 심사 제출 전 (심사 한 번에 같이 통과)
**담당:** Codex (아트 생성 + 규격 맞춤 합성)

---

#### 규격

**App Store (iPhone):**
- 6.7인치: 1290 × 2796px (필수)
- 6.5인치: 1284 × 2778px (권장)
- 최대 10장

**Google Play:**
- 스크린샷: 최소 320px, 최대 3840px / 비율 16:9 또는 9:16
- 피처 그래픽: 1024 × 500px (Play 스토어 상단 배너)
- 최대 8장

---

#### 제작할 장면 구성 (총 5장 기준)

**장면 1 — 인트로: Pip 초대 장면**
- Pip이 퍼즐 카드를 들고 정면을 바라보며 웃는 장면
- 말풍선: "그림 하나 같이 풀어볼까요? 🥄"
- 배경: 팬트리 주방 따뜻한 분위기

**장면 2 — 퍼즐 플레이 장면**
- 실제 5×5 또는 8×8 퍼즐 풀리는 순간 (컬러 셀이 채워지는 장면)
- 완성된 그림이 오른쪽에 reveal
- 텍스트: "색칠하고 그림을 완성해요"

**장면 3 — 팬트리 꾸미기 장면**
- 팬트리 선반에 병들이 놓여있는 장면
- Pip이 병 하나를 들고 선반에 올리는 포즈
- 텍스트: "스푼을 모아 팬트리를 꾸며요"

**장면 4 — 컬렉션/앨범 장면**
- 완성된 그림들이 앨범처럼 나열된 장면
- Pip이 앨범을 펼쳐보며 흐뭇한 표정
- 텍스트: "완성한 그림들이 모여요"

**장면 5 — 배지 + 성취 장면**
- 배지 선반에 빛나는 배지들
- Pip이 첫 배지를 받는 순간
- 텍스트: "도전하고 배지를 수집해요"

---

#### 아트 방향
- **스타일:** 게임 내 일러스트와 동일한 따뜻한 코지 톤 (크림/황금/갈색 팔레트)
- **Pip:** 게임 내 캐릭터 아트(pip-chrome-v2.png) 기준으로 일관성 유지
- **텍스트:** 한국어 버전과 영어 버전 각각 별도 제작
- **품질:** 300ppi 이상, 앱스토어 업로드 기준 최고 해상도
- **여백:** 상하 15
---

### Step A1 — 앱스토어 프로모션 스크린샷 아트웍 제작 (출시 후 교체용)

**시점:** Step 48 완료 직후, 바이너리 심사 제출 전 (심사 한 번에 같이 통과)
**담당:** Codex (아트 생성 + 규격 맞춤 합성)

---

#### 규격

**App Store (iPhone):**
- 6.7인치: 1290 x 2796px (필수)
- 6.5인치: 1284 x 2778px (권장)
- 최대 10장

**Google Play:**
- 스크린샷: 최소 320px, 최대 3840px / 비율 16:9 또는 9:16
- 피처 그래픽: 1024 x 500px (Play 스토어 상단 배너)
- 최대 8장

---

#### 제작할 장면 구성 (총 5장)

**장면 1 - Pip 초대 장면**
- Pip이 퍼즐 카드를 들고 정면을 바라보며 웃는 장면
- 말풍선: "그림 하나 같이 풀어볼까요?"
- 배경: 팬트리 주방 따뜻한 분위기

**장면 2 - 퍼즐 플레이 장면**
- 실제 5x5 또는 8x8 퍼즐이 완성되는 순간
- 완성된 그림이 reveal되는 장면
- 텍스트: "색칠하고 그림을 완성해요"

**장면 3 - 팬트리 꾸미기 장면**
- 팬트리 선반에 병들이 놓여있는 장면
- Pip이 병 하나를 들고 선반에 올리는 포즈
- 텍스트: "스푼을 모아 팬트리를 꾸며요"

**장면 4 - 컬렉션/앨범 장면**
- 완성된 그림들이 앨범처럼 나열된 장면
- Pip이 앨범을 펼쳐보며 흐뭇한 표정
- 텍스트: "완성한 그림들이 모여요"

**장면 5 - 배지 수집 장면**
- 배지 선반에 빛나는 배지들
- Pip이 첫 배지를 받는 순간
- 텍스트: "도전하고 배지를 수집해요"

---

#### 아트 방향
- **스타일:** 게임 내 일러스트와 동일한 따뜻한 코지 톤 (크림/황금/갈색 팔레트)
- **Pip:** 게임 내 캐릭터 아트(pip-chrome-v2.png) 기준으로 일관성 유지
- **텍스트:** 한국어 버전과 영어 버전 각각 별도 제작
- **품질:** 앱스토어 업로드 기준 최고 해상도
- **여백:** 상하 15%는 텍스트/UI 영역 확보, 중앙 70%에 핵심 장면

---

#### Codex 작업 순서
1. 각 장면별 레이아웃 초안 생성
2. 게임 실제 스크린샷 + Pip 캐릭터 아트 합성
3. 1290x2796px App Store 규격으로 export
4. 1024x500px Google Play 피처 그래픽 별도 제작
5. 영어/한국어 텍스트 레이어 분리 버전 보관


---

### Step 49 — 가이드 다이얼로그 하단 safe-area 수정

**파일:** `src/styles.css`

**증상:** 온보딩/가이드 다이얼로그 "다음" 버튼이 모바일 화면 하단에서 잘림.

**원인:** `max(24px, env(safe-area-inset-bottom, 0px))` 공식은 홈 인디케이터(34px) 기기에서 34px만 확보 — Pip 카드 위에 여유 없음.

**수정 (CSS 1줄):**

```css
/* 현재 (line ~17258) */
.guide-overlay {
  padding: 0 0 max(24px, env(safe-area-inset-bottom, 0px)) !important;
}

/* 수정 후 */
.guide-overlay {
  padding: 0 0 max(24px, calc(env(safe-area-inset-bottom, 0px) + 24px)) !important;
}
```

**주의:** `.guide-overlay--pantryNeighborMrPark` 등 이웃 대화창에 동일 selector가 걸리면 같이 적용됨 — 검토 후 필요 시 scope 분리.

---

### Step 50 — 로그인 보너스 팝오버 위치: 화면 중앙으로 이동

**파일:** `src/styles.css`

**증상:** 홈 화면 진입 시 "+3 스푼" 팝오버가 상단에 표시되어 홈 배경 Pip 캐릭터와 겹침.

**현재 위치:** `top: calc(max(18px, env(safe-area-inset-top)) + 76px)` — 화면 위쪽

**수정:** 화면 수직 중앙(40-45% 지점)으로 이동해서 Pip 캐릭터(하단 배치)와 겹치지 않게.

```css
/* 현재 (line ~18852) */
.login-bonus-popover {
  top: calc(max(18px, env(safe-area-inset-top)) + 76px);
  left: 50%;
  transform: translateX(-50%);
}

/* 수정 후 */
.login-bonus-popover {
  top: 42%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes login-bonus-arrive {
  from { opacity: 0; transform: translate(-50%, calc(-50% - 8px)) scale(0.96); }
  to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
```

---

### Step 51 — "지금 풀기" 버튼: 크기 키우기 + 위치 상향

**파일:** `src/styles.css`

**증상:** "지금 풀기" 버튼이 우측 하단에 있으나 너무 작고 너무 밑에 붙어 있음 (사용자 반복 요청).

**현재 (line ~16905, app-shell--workshop-home 맥락):**
```css
width: clamp(116px, 30vw, 144px);
height: clamp(116px, 30vw, 144px);
bottom: max(4%, env(safe-area-inset-bottom));
right: max(3%, env(safe-area-inset-right));
```

**수정:**
- 크기: `clamp(128px, 34vw, 160px)` (기존보다 약 12px 크게)
- 위치: floating nav 위에 안정적으로 올라오도록  
  `bottom: calc(max(20px, calc(env(safe-area-inset-bottom, 0px) + 20px)) + clamp(72px, 19vw, 88px))`  
  ← floating nav 높이(~68px) + 여유 간격

```css
.app-shell--workshop-home .puzzle-home-scene__play {
  right: max(3%, env(safe-area-inset-right));
  bottom: calc(max(20px, calc(env(safe-area-inset-bottom, 0px) + 20px)) + clamp(72px, 19vw, 88px));
  width: clamp(128px, 34vw, 160px);
  min-width: 0;
  height: clamp(128px, 34vw, 160px);
  min-height: 0;
  /* 나머지 속성 유지 */
}
```

아이콘 이미지도 비율 맞게:
```css
.app-shell--workshop-home .puzzle-home-scene__play > img {
  width: min(62%, 74px);
  height: min(62%, 74px);
}
```

---

### Step 52 — 플로팅 네비 메뉴: "설정" 항목 완전히 감싸도록 패딩 추가

**파일:** `src/styles.css`

**증상:** 네비게이션 드로어(7개 항목)를 열었을 때 마지막 "설정" 항목이 container 바깥으로 살짝 벗어남.

**현재 (line ~15388):**
```css
.floating-nav__menu {
  grid-template-columns: minmax(0, 1fr);
  width: min(286px, calc(100vw - 24px));
}
```

메뉴 padding이 `8px`인데 7개 아이템 × 52px + 6개 gap × 8px = 412px + 상하 8px+8px = 428px가 필요. 메뉴 `max-height`나 `overflow`가 이를 자르고 있을 수 있음.

**수정:**
```css
.floating-nav__menu {
  grid-template-columns: minmax(0, 1fr);
  width: min(286px, calc(100vw - 24px));
  padding: 10px;          /* 8px → 10px */
  max-height: 80vh;       /* 있다면 제거 또는 충분히 크게 */
  overflow-y: auto;
}
```

→ 실제 `max-height` / `overflow` 제한이 있는 CSS 버전 찾아 수정.

---

### Step 53 — 스푼 모으러 가기 헤더 레이아웃 재설계

**파일:** `src/ui/puzzleHubView.js` + `src/styles.css`

**증상:** 헤더 카드에서 아이콘(64px)이 왼쪽을 차지해 h1 제목이 3줄로 쪼개지고, 설명 문장도 좁은 컬럼에 갇혀 레이아웃이 길쭉해짐.

**현재 HTML 구조:**
```html
<header class="spoon-run-view__header">  <!-- flex row -->
  <img>  <!-- 64px 스푼 아이콘 -->
  <div>
    <p class="section-label">스푼 모으기</p>
    <h1>스푼 모으러 가기</h1>
    <p class="spoon-run-view__intro">오늘의 그림과 다시 풀기로...</p>  ← 이게 좁은 칸에 갇힘
  </div>
</header>
```

**목표 레이아웃:**
```
[ 아이콘 ] [ 스푼 모으기 (eyebrow) / 스푼 모으러 가기 (h1) ]
[ 오늘의 그림과 다시 풀기로 스푼을 더 모아보세요. ← 전체 너비 ]
```

**JS 수정 (`puzzleHubView.js`):**

`renderSpoonRunView()` 안 header 구성 부분:
```js
// 변경 전
const copy = document.createElement("div");
appendTextElement(copy, "p", "section-label", t("spoonRun.eyebrow"));
appendTextElement(copy, "h1", "", t("views.spoonRun"));
appendTextElement(copy, "p", "spoon-run-view__intro", t("spoonRun.intro"));
header.append(icon, copy);

// 변경 후
const copy = document.createElement("div");
appendTextElement(copy, "p", "section-label", t("spoonRun.eyebrow"));
appendTextElement(copy, "h1", "", t("views.spoonRun"));
header.append(icon, copy);
appendTextElement(header, "p", "spoon-run-view__intro", t("spoonRun.intro"));
// ← intro p를 header의 직접 자식으로 이동
```

**CSS 수정:**
```css
/* 기존 flex → grid로 전환 */
.spoon-run-view__header {
  display: grid;
  grid-template-columns: 64px 1fr;
  grid-template-rows: auto auto;
  align-items: center;
  gap: 0 14px;
  padding: 14px 16px;
  /* border/border-radius/background/box-shadow 유지 */
}

/* 아이콘: row 1만 */
.spoon-run-view__header > img {
  grid-row: 1;
  grid-column: 1;
  width: 64px;
  height: 64px;
  object-fit: contain;
  filter: drop-shadow(0 4px 5px rgba(120, 75, 18, 0.2));
}

/* copy div: row 1 오른쪽 */
.spoon-run-view__header > div {
  grid-row: 1;
  grid-column: 2;
}

/* intro: row 2, 전체 너비 */
.spoon-run-view__intro {
  grid-row: 2;
  grid-column: 1 / -1;
  margin-top: 10px !important;
  color: #6a4a3c;
  line-height: 1.45;
}
```

---

### Step 54 — 미완료 consume 구매 자동 복구 (Pending Purchase Restore)

**배경:**  
소모성(consumable) 인앱 제품은 Google Play에서 `consume()` 호출이 완료돼야 다시 구매 가능 상태가 됨. 이전 버전 앱에서 `acknowledge`만 하고 `consume`을 완료하지 못한 경우, 재설치 후에도 "already owned" 상태로 잠겨 재구매 불가.

**목표:**  
앱 시작 시 미완료(pending/unconsumed) 구매를 자동으로 감지해 복구하거나 consume 처리.

**구현 위치:** `src/game/billing.js`

**추가 함수 `restorePendingPurchases()`:**

```js
export async function restorePendingPurchases() {
  if (!isBillingRuntimeAvailable()) return { restored: [] };

  try {
    // @capgo/native-purchases getPurchases() 또는 restorePurchases()로
    // 미완료 구매 목록 조회
    const { purchases } = await NativePurchases.restorePurchases();
    const restored = [];

    for (const purchase of purchases ?? []) {
      const productId = getObjectProductId(purchase);

      if (productId === COZY_SUPPORT_PRODUCT_ID) {
        const purchaseKey = getPurchaseKey(purchase, COZY_SUPPORT_PRODUCT_ID);
        const grant = grantCozySupportPack(purchaseKey, "restore");
        // consume 재시도
        try {
          await NativePurchases.consumePurchase({ purchaseToken: purchase.purchaseToken });
        } catch { /* consume 실패는 무시 */ }
        if (grant.granted || grant.duplicate) restored.push(COZY_SUPPORT_PRODUCT_ID);
      }

      if (productId === SPOON_JAR_SMALL_PRODUCT_ID) {
        const purchaseKey = getPurchaseKey(purchase, SPOON_JAR_SMALL_PRODUCT_ID);
        const grant = grantSpoonJarPurchase(purchaseKey, "restore");
        try {
          await NativePurchases.consumePurchase({ purchaseToken: purchase.purchaseToken });
        } catch { /* consume 실패는 무시 */ }
        if (grant.granted || grant.duplicate) restored.push(SPOON_JAR_SMALL_PRODUCT_ID);
      }
    }

    return { restored };
  } catch {
    return { restored: [] };
  }
}
```

**호출 위치:** `src/ui/appShell.js` — 앱 초기화 시 (스토어 뷰 열기 전에) 호출:

```js
import { restorePendingPurchases, ... } from "../game/billing.js";

// 앱 마운트 후 백그라운드에서 실행
restorePendingPurchases().then(({ restored }) => {
  if (restored.length > 0) draw(); // 스푼 잔액 갱신
});
```

**주의:**  
- `@capgo/native-purchases`의 `restorePurchases()` / `consumePurchase()` API 명세 확인 후 실제 메서드명 맞게 조정
- `grantCozySupportPack(purchaseKey, "restore")` — `purchaseKey`가 이미 처리된 거래면 `duplicate: true` 반환 → 중복 지급 안전
- iOS는 `isBillingRuntimeAvailable()`이 false라 진입 안 함 (현재 Android 전용)

---

### Step 55 — 모바일 드래그 색칠 복구: puzzle-grid touch-action 추가

**파일:** `src/styles.css`

**증상:** 모바일에서 셀을 쓱 밀어서 연속 색칠 시 중간에 끊기거나 작동 안 함.

**원인:** `.puzzle-grid`에 `touch-action: none`이 없어서, Android 브라우저가 드래그를 스크롤 제스처로 인식해 `pointermove` 이벤트를 중단시킴. `pointerdown`의 `event.preventDefault()`만으로는 불충분.

참고: `guide-practice__row`에는 이미 `touch-action: none`이 적용되어 있음.

**수정:**

최신 `.puzzle-grid` CSS 규칙에 두 줄 추가:

```css
.puzzle-grid {
  touch-action: none;   /* ← 추가 */
  user-select: none;    /* ← 추가 */
  /* 기존 속성들 유지 */
}
```

`touch-action: none`은 해당 요소 내 모든 터치 제스처를 JS로 넘겨서 `pointermove`가 끊기지 않게 함.

---

### Step 56 — Play Store 앱 소개 자료 업데이트

**배경:**  
v1.1.8 출시 완료. 스토어 리스팅의 스크린샷·피처드 그래픽·홍보 영상을 이번 릴리즈에서 새로 제작된 에셋으로 교체해야 함.

**작업 위치:** Google Play Console → 앱 콘텐츠 → 스토어 등록정보

**교체 대상:**
- 스크린샷 (phone): `store-assets/` 폴더의 최신 이미지
- 피처드 그래픽
- 홍보 영상 (있는 경우)

**주의:** 코드 변경 없음. Play Console에서 직접 업로드.

---

### Step 57 — 튜토리얼 가이드 대화창 잘림 수정 + 레이아웃 상향

**배경:**  
모바일(≤520px)에서 튜토리얼 가이드 오버레이가 전체 화면을 채울 때, 대화창 버블 영역이 너무 좁아 내용이 잘림. 또한 핍 이미지와 버블이 화면 아래쪽에 치우쳐 있어 위로 올라와야 함.

**파일:** `src/styles.css`

**현재 문제 위치 (line ~13722–13738):**

```css
@media (max-width: 520px) {
  .guide-dialog {
    width: 100%;
    height: 100%;
    max-height: none;
    border-radius: 0;
    grid-template-rows: minmax(0, 58%) minmax(0, 42%);  /* ← 버블이 42%만 */
  }

  .guide-dialog__art {
    min-height: 0;
  }

  .guide-dialog__bubble {
    align-content: center;
    padding: 20px 22px max(20px, env(safe-area-inset-bottom));
  }
}
```

**그리고 풀스크린 guide-dialog art 위쪽 패딩 (line ~13848):**

```css
.guide-dialog__art {
  padding: max(30px, env(safe-area-inset-top)) 20px 72px;  /* 하단 72px이 공간 낭비 */
```

**수정:**

1. `grid-template-rows` 비율 변경 — 버블에 공간을 더 확보하고 전체 레이아웃을 위로:

```css
grid-template-rows: minmax(0, 48%) minmax(0, 52%);
```

2. art 하단 패딩 축소 — 핍이 더 위쪽에 자리 잡도록:

```css
padding: max(20px, env(safe-area-inset-top, 0px)) 20px 48px;
```

**검증:**
- 가이드 1~3페이지 전부 확인 — 텍스트, 연습 그리드, 버튼이 잘리지 않아야 함
- 360px / 390px / 430px 기기 너비 모두 확인
- 버블 하단 버튼("자, 가보자!")이 항상 화면 안에 보여야 함

---

### Step 59 — 비-퍼즐 가이드 다이얼로그 레이아웃 통일 (타임어택 기준)

**배경:**  
가이드 다이얼로그가 guideId별로 레이아웃이 제각각임. 타임어택(시계 할아버지) 스타일이 가장 완성도 높아 — 캐릭터가 화면 중앙에 적당한 크기로 위치하고, 버블이 자연스럽게 하단에 붙음. 반면 map·spoonRunIntro 등 핍이 등장하는 가이드는 art 영역 상단에 큰 여백이 생기고 핍이 작고 아래쪽에 치우쳐 보임.

**현재 구조 파악:**
- `timeAttack` → `guide-dialog__art--neighbor guide-dialog__art--mr-park` 클래스 사용 (≤520px에서 `width: min(58vw, 220px); height: min(87vw, 330px)` 카드 형태로 렌더됨)
- `puzzle` / `map` / `spoonRunIntro` / `pantryFirstPurchase` / `pantryRoomStory` → `guide-dialog__art` 클래스만 사용, Pip 이미지 크기 `height: clamp(180px, 36vh, 240px)`로 고정
- 문제: Pip 가이드의 art 영역이 너무 넓어 여백 과다, Pip 이미지가 상대적으로 작고 낮음

**파일:** `src/styles.css`

**목표:** `map`, `spoonRunIntro`, `pantryFirstPurchase`, `pantryRoomStory` 가이드에서 Pip 이미지가 타임어택 캐릭터처럼 화면 중앙 상단에 크고 자연스럽게 위치하도록 수정.

**수정 방향:**

1. 해당 가이드들의 art 영역 상단 패딩 줄이기 — Pip이 더 위로 올라오도록:

```css
.guide-overlay--map .guide-dialog__art,
.guide-overlay--spoonRunIntro .guide-dialog__art,
.guide-overlay--pantryFirstPurchase .guide-dialog__art,
.guide-overlay--pantryRoomStory .guide-dialog__art {
  padding-top: max(16px, env(safe-area-inset-top, 0px));
  align-items: center;
}
```

2. Pip 이미지 크기 키우기 — `clamp(180px, 36vh, 240px)` → `clamp(220px, 46vh, 300px)`:

```css
.guide-overlay--map .guide-dialog__art img,
.guide-overlay--spoonRunIntro .guide-dialog__art img,
.guide-overlay--pantryFirstPurchase .guide-dialog__art img,
.guide-overlay--pantryRoomStory .guide-dialog__art img {
  height: clamp(220px, 46vh, 300px) !important;
  width: auto;
}
```

3. art / bubble 비율 — Step 57과 마찬가지로 48/52 적용 (이미 적용된 경우 스킵):

```css
.guide-overlay--map .guide-dialog,
.guide-overlay--spoonRunIntro .guide-dialog,
.guide-overlay--pantryFirstPurchase .guide-dialog,
.guide-overlay--pantryRoomStory .guide-dialog {
  grid-template-rows: minmax(0, 48fr) minmax(0, 52fr);
}
```

**주의:**
- `puzzle` 가이드(인터랙티브 연습 그리드 있음)는 Step 57에서 이미 처리됐으므로 이번 수정에서 제외
- `pantryNeighborMrPark / Lily / Mateo` 가이드는 neighbor 아트 스타일 자체가 이미 타임어택과 동일 → 제외
- 각 가이드별로 브라우저에서 직접 트리거해 육안 확인 필요

**검증:**
- 브라우저에서 각 guideId를 `renderGuideDialog("map", () => {})` 등으로 직접 호출해 확인
- Pip이 화면 상단 중앙에 크게 위치하는지
- 버블 내용이 잘리지 않는지
- 360px / 390px / 430px 너비에서 모두 확인

---

### Step 60 — 비-퍼즐 Pip 가이드 버블 3가지 수정

**배경:**  
Step 59 이후에도 실기기에서 다음 3가지 문제가 남아 있음:
1. 버블 텍스트가 좌정렬 — 타임어택처럼 가운데 정렬이어야 함
2. "핍" 이름 칩(name-tag)이 버블 텍스트와 겹침 — art 하단 `bottom: 6px`에 absolute 위치하는데 bubble의 `margin-top: -20px`로 인해 겹침
3. 버블 내부 빈 공간 과다 — `align-content` 없어서 텍스트가 위에 쏠리고 아래가 비어 보임

**파일:** `src/styles.css`

**수정 1 — 텍스트 가운데 정렬:**

```css
.guide-overlay--map .guide-dialog__line,
.guide-overlay--map .guide-dialog__bubble p:not(.guide-dialog__eyebrow),
.guide-overlay--spoonRunIntro .guide-dialog__line,
.guide-overlay--spoonRunIntro .guide-dialog__bubble p:not(.guide-dialog__eyebrow),
.guide-overlay--pantryFirstPurchase .guide-dialog__line,
.guide-overlay--pantryFirstPurchase .guide-dialog__bubble p:not(.guide-dialog__eyebrow),
.guide-overlay--pantryRoomStory .guide-dialog__line,
.guide-overlay--pantryRoomStory .guide-dialog__bubble p:not(.guide-dialog__eyebrow) {
  text-align: center;
}
```

**수정 2 — name-tag 겹침 해소:**  
현재 `.guide-dialog__name-tag { bottom: 6px }` + bubble `margin-top: -20px` 조합이 겹침 원인.  
name-tag를 art 안이 아닌 bubble 상단으로 이동하거나, art의 bottom padding을 name-tag 높이(약 28px)만큼 확보:

```css
.guide-overlay--map .guide-dialog__art,
.guide-overlay--spoonRunIntro .guide-dialog__art,
.guide-overlay--pantryFirstPurchase .guide-dialog__art,
.guide-overlay--pantryRoomStory .guide-dialog__art {
  padding-bottom: 36px !important;  /* name-tag가 bubble에 겹치지 않도록 */
}
```

**수정 3 — 버블 내부 수직 정렬:**

```css
.guide-overlay--map .guide-dialog__bubble,
.guide-overlay--spoonRunIntro .guide-dialog__bubble,
.guide-overlay--pantryFirstPurchase .guide-dialog__bubble,
.guide-overlay--pantryRoomStory .guide-dialog__bubble {
  align-content: center;
}
```

**검증:**
- `map`, `spoonRunIntro`, `pantryFirstPurchase` 가이드에서 브라우저 직접 호출로 확인
- 버블 텍스트가 가운데 정렬인지
- "핍" 칩이 텍스트와 겹치지 않는지
- 버블 내부 텍스트가 세로 중앙에 자리잡는지