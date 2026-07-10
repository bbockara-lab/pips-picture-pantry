# Pip's Picture Pantry — Economy Design Spec

Last updated: 2026-07-03
Author: Claude (design) / Codex (implementation)
Status: approved for implementation

---

## 원칙

- 단일 통화: 스푼(Spoon)만 사용한다. 이중 통화 없음.
- 광고 없음. 리워드 광고 포함 모든 광고 제거.
- 무료로 모든 콘텐츠(퍼즐 + 장식)에 도달할 수 있어야 한다. 단, 시간이 걸린다.
- 유료 결제는 "더 빠르게" 또는 "더 많이"를 사는 것이지, 콘텐츠 잠금 해제 비용이 아니다.
- 팩 언락과 팬트리 장식이 같은 스푼 풀을 공유해 자연스러운 긴장이 생긴다.

---

## 1. 스푼 수입원

### 1-A. 퍼즐 완료 보상

첫 완료 시에만 보상. 재도전은 0.

```
5×5   → 3 spoons
8×8   → 6 spoons
10×10 → 10 spoons
12×12 → 15 spoons
15×15 → 22 spoons
18×18 → 30 spoons
```

puzzles.js 각 퍼즐에 `reward` 필드로 저장. 사이즈에 따라 위 표를 따른다.

### 1-B. 데일리 퍼즐 보너스

하루 1회, 지정된 데일리 퍼즐 완료 시 추가 지급.
```
DAILY_BONUS = 8
```
(기존 5에서 8로 상향. 데일리 접속 가치 강화.)

### 1-C. 스테이지 완료 보너스

팩의 퍼즐 20개 전부 첫 완료 시 1회 지급. `completedPackIds`로 중복 방지.

```
5×5  팩 → +40 spoons
8×8  팩 → +80 spoons
10×10 팩 → +130 spoons
12×12 팩 → +200 spoons
15×15 팩 → +300 spoons
18×18 팩 → +420 spoons
```

save.js `markPackCompletedIfFirst()` 호출 시 해당 보너스를 `pantrySpoons`에 가산한다.
팩 데이터에 `stageBonus` 필드 추가:
```js
{ id: "pips-first-shelf", size: 5, stageBonus: 40, ... }
```

### 1-D. 타임어택 보상

세션 완료 기준. 개인 최고 기록 갱신 시 추가 보너스. 하루 3세션까지만 보상 지급.

```
5×5  세션 완료    → +15 spoons
8×8  세션 완료    → +25 spoons
10×10 세션 완료   → +38 spoons
12×12 세션 완료   → +55 spoons

개인 최고 기록 갱신 → +12 추가 (사이즈 무관)
일일 보상 한도 (3세션) → 하루 최대 약 +177 spoons (12×12 × 3 + 기록 × 3)
```

save.js에 `timeAttackDailyCount`, `timeAttackBestScores` 필드 추가.

### 1-E. Cozy Pass 구매 즉시 지급 (유료)

아래 IAP 섹션 참조. 구매 즉시 +250 spoons.

---

## 2. 스푼 지출: 팩 언락

### 팩 진행 구조 (총 1000 퍼즐, 50팩 × 20퍼즐)

팩을 6개 티어로 구분한다. Tier 1 (5개 팩)은 무료. 이후 스푼으로 언락.

```
Tier 1 — 5×5  — 팩 5개  — 무료 (unlockCost: 0)
Tier 2 — 8×8  — 팩 10개 — 언락비: 80 spoons/팩
Tier 3 — 10×10 — 팩 10개 — 언락비: 160 spoons/팩
Tier 4 — 12×12 — 팩 10개 — 언락비: 280 spoons/팩
Tier 5 — 15×15 — 팩 10개 — 언락비: 450 spoons/팩
Tier 6 — 18×18 — 팩 5개  — 언락비: 700 spoons/팩
```

전체 팩 언락 누적 비용:
```
Tier 1:  0      (5팩 무료)
Tier 2:  800    (10 × 80)
Tier 3:  1,600  (10 × 160)
Tier 4:  2,800  (10 × 280)
Tier 5:  4,500  (10 × 450)
Tier 6:  3,500  (5 × 700)
합계:   13,200 spoons
```

---

## 3. 스푼 지출: 팬트리 장식

### 장식 아이템 구성 (45개)

rarity 5단계. 팬트리 슬롯별로 분배.

```
starter  (3개)  — 0 spoons      — 즉시 보유, 게임 시작 선물
common   (14개) — 20–60 spoons  — 초반 1–5시간
cozy     (12개) — 80–160 spoons — 중반 10–20시간
rare     (10개) — 200–380 spoons — 후반 30–60시간
premium  (6개)  — 500–900 spoons — 장기 목표 또는 IAP
```

rarity별 전체 구매 비용:
```
starter:  0
common:   560   (14개 × avg 40)
cozy:     1,440 (12개 × avg 120)
rare:     2,900 (10개 × avg 290)
premium:  4,200 (6개  × avg 700)
합계:     9,100 spoons (전체 구매 시)
```

### 구체적 아이템 목록 (decorations.js 구현 기준)

**starter (무료)**
```
starter-counter-cloth    slot:counter   cost:0   rarity:starter
starter-pip-doll         slot:shelf     cost:0   rarity:starter
starter-bread-basket     slot:counter   cost:0   rarity:starter
```

**common**
```
sunny-window-curtains    slot:window    cost:22   rarity:common
recipe-card-shelf        slot:shelf     cost:28   rarity:common
mint-check-rug           slot:floor     cost:35   rarity:common
small-jam-jar            slot:counter   cost:20   rarity:common
herb-pot                 slot:window    cost:25   rarity:common
cork-board               slot:back-wall cost:32   rarity:common
yellow-tea-towel         slot:counter   cost:18   rarity:common
wooden-clock             slot:back-wall cost:38   rarity:common
small-candle             slot:shelf     cost:24   rarity:common
cotton-curtain-tie       slot:window    cost:30   rarity:common
checkered-tablecloth     slot:floor     cost:42   rarity:common
tiny-succulent           slot:shelf     cost:26   rarity:common
paper-recipe-book        slot:shelf     cost:36   rarity:common
wicker-tray              slot:counter   cost:44   rarity:common
```

**cozy**
```
soup-pot-display         slot:counter   cost:80   rarity:cozy
golden-spoon-sign        slot:back-wall cost:90   rarity:cozy
pip-portrait-frame       slot:back-wall cost:100  rarity:cozy
warm-lamp                slot:back-wall cost:110  rarity:cozy
flour-sack-stack         slot:floor     cost:85   rarity:cozy
spice-rack               slot:shelf     cost:120  rarity:cozy
linen-apron-hook         slot:back-wall cost:95   rarity:cozy
window-plant-basket      slot:window    cost:130  rarity:cozy
hand-painted-mug-rack    slot:shelf     cost:140  rarity:cozy
bread-display-board      slot:counter   cost:150  rarity:cozy
soft-braided-rug         slot:floor     cost:160  rarity:cozy
sunset-curtain-set       slot:window    cost:145  rarity:cozy
```

**rare**
```
cozy-reading-corner      slot:floor     cost:200  rarity:rare
pip-season-banner        slot:back-wall cost:240  rarity:rare
hand-tiled-backsplash    slot:back-wall cost:280  rarity:rare
vintage-recipe-cabinet   slot:shelf     cost:260  rarity:rare
sunny-morning-window     slot:window    cost:320  rarity:rare
market-flower-bucket     slot:floor     cost:300  rarity:rare
pantry-chandelier        slot:back-wall cost:350  rarity:rare
copper-pot-collection    slot:counter   cost:340  rarity:rare
handwoven-wall-mat       slot:back-wall cost:380  rarity:rare
heirloom-spoon-display   slot:shelf     cost:360  rarity:rare
```

**premium**
```
pip-cozy-nook            slot:floor     cost:500  rarity:premium
full-pantry-mural        slot:back-wall cost:700  rarity:premium
sunny-festival-set       slot:window    cost:600  rarity:premium
gold-recipe-arch         slot:back-wall cost:800  rarity:premium
pip-lucky-mug            slot:shelf     cost:0    rarity:premium  note:Cozy Pass 전용 — 구매 없이 취득 불가
village-harvest-scene    slot:floor     cost:900  rarity:premium
```

---

## 4. 전체 경제 시뮬레이션

### 헌신적 무료 플레이어 (모든 퍼즐 완료 기준)

```
퍼즐 완료 보상:
  5×5  100개 × 3  =   300
  8×8  200개 × 6  = 1,200
  10×10 200개 × 10 = 2,000
  12×12 250개 × 15 = 3,750
  15×15 200개 × 22 = 4,400
  18×18  50개 × 30 = 1,500
  소계:            13,150

스테이지 완료 보너스:
  Tier 1: 5팩 × 40  =   200
  Tier 2: 10팩 × 80 =   800
  Tier 3: 10팩 × 130 = 1,300
  Tier 4: 10팩 × 200 = 2,000
  Tier 5: 10팩 × 300 = 3,000
  Tier 6: 5팩 × 420 =  2,100
  소계:              9,400

데일리 보너스 (6개월, 180일):
  180 × 8 = 1,440

타임어택 (주 3회, 6개월):
  약 1,800

총 수입: 약 25,790 spoons
```

```
총 지출:
  팩 언락 전체: 13,200
  장식 전체:     9,100
  합계:         22,300 spoons
```

결론: 모든 것을 다 하는 헌신적 플레이어는 **약 3,500 스푼 여유**가 생긴다. 전부 무료로 달성 가능하되, 6개월 이상 꾸준히 플레이해야 한다.

### 일반 플레이어 (퍼즐 200개 완료 기준, 약 2–3개월)

```
퍼즐 완료: 약 1,200 spoons
스테이지 보너스: 약 1,000 spoons
데일리 보너스 (60일): 480
타임어택: 약 600
총 수입: 약 3,280 spoons
```

```
팩 언락 (Tier 1–3, 25팩): 약 2,400 spoons
장식 구매 (starter + common + cozy 일부): 약 700 spoons
합계: 약 3,100 spoons
```

결론: 일반 플레이어는 거의 빠듯하게 진행된다. **Tier 3 언락 + 코지 장식 일부**까지가 자연스러운 무료 경험. rare/premium은 추가 노력 또는 IAP가 필요.

---

## 5. IAP 상품 설계 (광고 없음)

### 5-A. Cozy Pass (non-consumable, $2.99)

한 번 구매하면 영구. 게임 내 구매 압박 없이 "응원" 성격.

포함:
- 스푼 +250 즉시 지급
- premium 장식 아이템 "pip-lucky-mug" 즉시 지급 (이 아이템은 Cozy Pass로만 획득 가능)
- 향후 모든 확장팩 10% 할인 (구조만 준비, 실제 적용은 IAP 연동 후)
- 설정 화면에 "Cozy Supporter" 뱃지 표시

```js
// save.js에 추가
cosyPassPurchased: Boolean  // normalizeSave default: false
```

Google Play 상품 ID: `com.sunnyspoonstudios.pipspicturepantry.cozy_pass`
Apple 상품 ID: `com.sunnyspoonstudios.pipspicturepantry.cozy_pass`

### 5-B. Spoon 번들 (consumable)

```
Tiny Jar     +150 spoons    $0.99
Cookie Tin   +400 spoons    $1.99   ← 주력 (단위당 가장 유리한 느낌)
Full Pantry  +950 spoons    $3.99
```

Google Play / Apple 상품 ID:
```
pips_spoons_150
pips_spoons_400
pips_spoons_950
```

### 5-C. 시즌 퍼즐 팩 (non-consumable, $1.99 each)

콘텐츠 확장. 출시 후 분기별 추가.
- 퍼즐 20개 + 전용 장식 아이템 2개 포함
- 분기당 1팩 목표
- 예시: "Cherry Blossom Season", "Winter Pantry", "Sunny Festival"

```
pips_season_pack_spring
pips_season_pack_winter
...
```

---

## 6. 자연 긴장 포인트 (monetization moments)

Codex는 아래 시점에서 자연스럽게 IAP 안내 화면이 노출되도록 구현한다.
**절대 강제 팝업이나 인터럽트 없음.** 팬트리 샵 안에서만 노출.

```
[긴장 포인트 1 — 약 50–80 퍼즐 완료]
  상황: Tier 2 팩 2–3번째 언락 + common 장식 몇 개 구매
  스푼 보유: 약 100–200 spoons
  갖고 싶은 cozy 아이템: 80+ spoons
  다음 팩 언락비: 80 spoons
  → "Tiny Jar ($0.99)"가 자연스러운 해결책

[긴장 포인트 2 — 약 150–200 퍼즐 완료]
  상황: Tier 3 진입, rare 아이템이 눈에 보이기 시작
  스푼 보유: 약 300–500 spoons
  갖고 싶은 rare 아이템: 200–300 spoons
  다음 팩 언락비: 160 spoons
  → "Cookie Tin ($1.99)" 또는 "Cozy Pass ($2.99)"가 자연스러운 선택

[긴장 포인트 3 — 약 400+ 퍼즐 완료]
  상황: Tier 5 진입, premium 아이템 욕망
  스푼 보유: 약 1,000–2,000 spoons
  갖고 싶은 premium: 500–900 spoons
  → "Full Pantry ($3.99)" 또는 장기 그라인드
```

---

## 7. 구현 체크리스트 (Codex 기준)

### save.js

```js
// normalizeSave()에 추가
timeAttackBestScores: {},      // { "5x5": 42, "8x8": 30, ... }
timeAttackDailyCount: {},      // { "2026-07-03": 2, ... }
cosyPassPurchased: false,
```

### packs.js

각 팩 오브젝트에 추가:
```js
{
  stageBonus: 40,    // 스테이지 완료 일회성 보너스 (spoons)
  size: 5,           // 주요 퍼즐 사이즈 (언락비 계산 기준)
  unlockCost: 0,     // Tier 1은 0, 이후 표 참조
}
```

### decorations.js

위 아이템 목록 전체 반영. `rarity` 필드 추가 (현재 있음), `cost` 필드 재설계.

### puzzles.js

각 퍼즐의 `reward` 필드를 사이즈 기준 표로 재설정.
```js
const REWARD_BY_SIZE = { 5: 3, 8: 6, 10: 10, 12: 15, 15: 22, 18: 30 };
```

### timeAttack.js (신규)

```js
export function getTimeAttackReward(size) {
  return { 5: 15, 8: 25, 10: 38, 12: 55 }[size] ?? 25;
}
export function getTimeAttackRecordBonus() { return 12; }
export function getDailyTimeAttackLimit() { return 3; }
```

### IAP 연동

Capacitor에서 `@capacitor-community/in-app-purchases` 또는 `cordova-plugin-purchase` 사용.
실제 결제 연동은 구조만 준비하고 상품 ID를 상수로 정의해 둔다:

```js
// src/data/iap.js
export const IAP_PRODUCTS = {
  COZY_PASS:      "com.sunnyspoonstudios.pipspicturepantry.cozy_pass",
  SPOONS_150:     "com.sunnyspoonstudios.pipspicturepantry.spoons_150",
  SPOONS_400:     "com.sunnyspoonstudios.pipspicturepantry.spoons_400",
  SPOONS_950:     "com.sunnyspoonstudios.pipspicturepantry.spoons_950",
};
```

---

## 8. UI 노출 규칙

- IAP 안내는 팬트리 샵 내부 "스푼 충전" 버튼을 통해서만 접근.
- 퍼즐 플레이 중 어떤 구매 유도도 없음.
- 퍼즐 20개 미만 완료 플레이어에게 구매 유도 화면 노출 없음.
- Cozy Pass 구매자에게는 "스푼 충전" 버튼 대신 "Spoon 번들" 버튼만 표시 (Pass 중복 구매 유도 없음).
- "pip-lucky-mug"는 팬트리 샵에서 보이되, cost 대신 "Cozy Pass 전용"으로 표시.


## Implementation Status - 2026-07-04 v0.1.54

- Implemented the central economy constants in `src/data/economyConfig.js`.
- Wired puzzle-stage completion to one-time `stageBonus` rewards through `markPackCompletedIfFirst(pack)`.
- Wired the daily recommendation bonus to the shared economy config.
- Added save-layer hooks for future Time Attack rewards, record bonuses, best scores, and daily reward-count limits.
- Not yet implemented: Time Attack UI, Pantry decoration store reopening, Cozy Pass/IAP, spoon bundle purchase flows, large-volume puzzle catalog generation, and final raster art replacement.
- Release note: this remains an experimental local-web slice. Do not build/upload an AAB until the Pantry art gate and UX direction are reviewed.


## Draft Decision - 2026-07-04 Economy Baseline For Major Rework

- Launch/rework target keeps the first 100 handcrafted stage puzzles as the onboarding and badge runway, but the economy must not depend only on those static puzzles.
- Time Attack becomes the repeatable spoon source using generated seeded boards. It can start with 5x5 and 8x8, then ramp into 10x10, 12x12, and 15x15 as the dedicated puzzle screen matures.
- Pantry room 1 should be the first main sink: target 5 placement slots and roughly 25-30 reviewed decoration assets across starter/common/cozy/rare tiers. Room 2 or a second floor should follow as the first major content update.
- Paid design principle remains: no forced ads and no hard paywall for core puzzle play. Purchases should accelerate Pantry decoration or add optional themed expansions, not block the main free loop.
- Badge rewards stay as milestone collectibles for completing stages. They should use distinct reviewed badge art and should not replace Pantry as the long-term progression system.
- Replay rewards should be conservative to avoid inflation. Prefer daily/Time Attack rewards and stage completion bonuses over paying full rewards for repeated catalog puzzle clears.
- Open balance items for Claude after Codex confirms implementation scope: exact item prices, hint economy, Time Attack daily cap, and room expansion cadence.

---

## 6. Pantry Placement and Economy Guardrails (v0.1.98)

These rules are mandatory for future Pantry item additions.

### 6-A. First Purchase Guidance

- The first successful decoration purchase triggers Pip's one-time `pantryFirstPurchase` guide.
- The guide must explain why decorations matter, where purchased items go, and that items are saved permanently.
- This guide is part of the economy loop: puzzle -> spoons -> purchase -> visible room improvement -> motivation to solve more puzzles.

### 6-B. Placement Model

Current model: fixed semantic slots, one equipped item per slot.

```
back-wall, counter, window, shelf, floor
```

- Every decoration must declare exactly one slot in `decorations.js`.
- Buying an item auto-equips it into its slot. This avoids drag/drop complexity for early users.
- Equipping another item in the same slot swaps the display; owned items remain in inventory.
- The UI must show the slot name on both empty and filled slots so the player understands the placement limit.

### 6-C. Physical Room Capacity

- The visible room should feel full with 5 equipped items, not crowded.
- MVP capacity is 5 visible items because each slot represents one physical room region.
- Future expansion should add either new rooms or alternate variants per slot before adding more simultaneous items to this room.
- Item art must be authored as transparent raster assets sized for the slot: wide items for wall/counter/floor, compact/tall items for shelf/window. Runtime CSS may scale down, but should not be responsible for rescuing badly proportioned art.

### 6-D. Item Count Per Room

- A single room should target 3-5 starter/common items per slot over time, giving 15-25 meaningful choices without overcrowding the physical scene.
- The long-term 45-item decoration catalog should be distributed across multiple rooms or room themes, not all treated as simultaneous objects in one Pantry.
- Premium/rare items should be visually bigger or more transformative, but still occupy one slot.

### 6-E. Spoon Economy Fit

- Early room satisfaction: after the first 5x5 stage, players should afford at least 2-3 common decorations.
- Full free completion remains possible, but completionist decoration collecting should lag behind puzzle progression enough to create meaningful choices.
- Players who want to decorate faster are nudged toward paid spoon bundles or Cozy Pass by time pressure, not by hard content locks.
- Any new decoration batch must be checked against available puzzle rewards, stage bonuses, daily rewards, and time attack rewards before promotion to approved runtime art.

### 6-F. Automated Guardrails (v0.1.100)

`npm run qa:assets` now enforces the Pantry placement/economy contract:

- exactly 5 physical Pantry slots for the MVP room,
- every decoration must declare a valid slot, rarity, cost, and assetId,
- starter/common/cozy/rare/premium costs must stay within the approved economy ranges,
- every runtime decoration must point to approved visible `pantry-decoration` raster art,
- at least one free starter decoration must remain available for onboarding.

The current MVP decoration prices are aligned to the approved list: curtains 22, shelf 28, rug 35, soup pot 80, golden sign 90.


## 7. Replay and Pantry Milestone Direction (v0.1.124)

The economy should not let completed catalog puzzles become an infinite spoon source. A solved picture is easy to memorize, so ordinary replay must not pay spoons by default.

- Ordinary replay: no spoon reward.
- Rewarded replay: only through Pip-designated Replay Picks.
- Replay reward conditions: puzzle already completed, currently selected as a Pip Replay Pick, clean solve/no hint condition, one reward per puzzle per local day, daily cap 3.
- Reward size: 1 spoon per eligible replay pick. This is a light habit reward, not a primary grind path.
- Primary repeatable economy remains Daily, Time Attack, new stage clears, and later optional spoon bundles.

Pantry should become a progression soft gate, not a hostile hard paywall. Future stage expansion should prefer milestone gates such as decorating 2-3 room spots or reaching a Pantry comfort threshold before opening a full next stage. A few preview puzzles may remain playable so puzzle-first players can taste the next stage, but complete stage access should reinforce the loop: solve puzzles -> earn spoons -> decorate Pantry -> open more puzzle content.


### v0.1.125 Replay Picks UI Surface
- Pip's Replay Picks are now surfaced in the puzzle hub after the player has completed eligible unlocked pictures.
- The first shipped surface is intentionally a limited daily review lane: it communicates that only Pip-picked clean replay challenges can later grant replay spoons.
- Full challenge replay must use separate ephemeral board state before reward claiming is wired into play, so canonical completed puzzle saves are not overwritten.


### v0.1.126 Replay Challenge Session
- Replay Picks now launch a separate ephemeral challenge session, protecting completed puzzle save data from being reset.
- Replay spoons are awarded only when the selected daily pick is completed cleanly. Clean means no hint use and no wrong filled cell during the replay run.
- This keeps replay useful as a small daily skill challenge while avoiding unlimited low-friction spoon farming.


### v0.1.127 Replay Clean Undo Guard
- Clean replay means no wrong filled cell and no hint use at any point in the replay session. Undo can repair the board for practice, but it cannot restore replay reward eligibility.
- This closes the replay exploit where a player could test a move or hint, undo it, and still claim a clean reward.
