# Pip's Picture Pantry — Economy Design Spec

Last updated: 2026-07-18
Author: Claude (design) / Codex (implementation)
Status: v1 launch direction aligned with `docs/MONETIZATION_PLAN.md`

---

## 원칙

- 단일 통화: 스푼(Spoon)만 사용한다. 이중 통화 없음.
- v1은 광고 없음. 리워드 광고 포함 모든 광고 제거.
- 무료로 모든 콘텐츠(퍼즐 + 장식)에 도달할 수 있어야 한다. 단, 시간이 걸린다.
- 결제 상품은 "더 빠르게" 또는 "더 여유 있게"를 돕는 선택지이지, 콘텐츠 잠금 해제 비용이 아니다.
- 팩 언락과 팬트리 장식이 같은 스푼 풀을 공유해 자연스러운 긴장이 생긴다.
- 사용자에게는 "유료/무료 티어"가 아니라 스푼, 응원, 복원, 감사 상태로 설명한다.

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

### 1-E. Pip Support Pack 구매 즉시 지급

아래 IAP 섹션 참조. 구매 즉시 +250 spoons.

---

## 2. 스푼 지출: 팩 언락

### 출시 / 업데이트 카탈로그 구조

이전 1,000 퍼즐 / 50팩 계획은 **출시 전 완성 목표가 아니라 장기 누적 목표**로 낮춘다. 첫 출시 목표는 약 333개 수준의 Season 0 / Launch v1 카탈로그이며, 이후 분기별/시즌별 업데이트로 1,000개 이상까지 누적 확장한다.

운영 원칙:

- 출시 전에는 333개 내외의 고품질 퍼즐과 전체 게임 완성도를 우선한다.
- 333개 근처에 도달하면 퍼즐 수를 계속 밀기보다 첫인상, Pantry, Time Attack, 가이드, 효과음/시각효과, 아트 일관성, 모바일 UX를 우선 보강한다.
- 출시 후 시즌 업데이트는 새 퍼즐, 장식, 방 목표, Pip 대화, 스푼 싱크를 함께 제공해 "새 시즌이 열렸다"는 기대감을 만든다.
- 시즌 업데이트 예시는 봄 피크닉, 여름 과일/카페, 가을 베이킹, 겨울 코코아/선물, Sunny Spoon 축제팩이다.
- 경제 밸런스는 총 퍼즐 수가 아니라 `현재 공개된 퍼즐 수 + Pantry 목표 + Time Attack/데일리 보상 + 장식 가격`을 기준으로 조정한다.

### 장기 팩 진행 구조 (누적 1000+ 퍼즐 가능)

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

주의: 위 표는 장기 누적 라이브 카탈로그의 가격 스케일 기준이다. 런칭 시점에는 실제 공개 팩 수와 Pantry 진행 목표에 맞춰 일부 티어만 노출하거나, 향후 시즌 팩을 "곧 도착" 상태로 보여주는 방식이 더 적합하다.

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
pip-lucky-mug            slot:shelf     cost:TBD  rarity:premium  note:v1.1+ review; not a v1 support-pack entitlement
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

## 5. IAP 상품 설계 (v1 Android)

### 5-A. Pip Support Pack (one-time non-consumable)

v1에는 상품을 하나만 둔다. 목적은 강한 매출 최적화가 아니라, 빠른 유저가 스푼 부족으로 막혔을 때 자연스럽게 선택할 수 있는 작은 응원/보충 경로를 제공하는 것이다.

포함:
- 상품 ID: `pip_cozy_support`
- 가격 기준: USD 0.99 / KRW 1,100 근처에서 Play Console 최종 결정
- 스푼 +250 즉시 지급 (`COZY_PASS_SPOON_GRANT`)
- 중복 지급 방지: `cozyPassPurchased` 저장 필드와 `grantCozySupportPack()`에서 보호
- 복원 경로: Google Play 소유권 복원 후 같은 보상 상태로 정리

사용자에게는 다음처럼 설명한다:
- Pip을 응원하면 스푼이 도착한다.
- 구매한 적이 있으면 복원할 수 있다.
- 퍼즐을 풀어 모으는 것이 기본 길이고, 응원팩은 더 빨리 준비하고 싶을 때의 선택지다.

사용자에게 다음 표현을 쓰지 않는다:
- paid / free
- 유료 / 무료
- 티어, 패스, 구독처럼 v1 상품보다 큰 약속으로 보이는 표현

### 5-B. Deferred Products

아래 상품들은 v1에 넣지 않는다. 출시 후 실제 플레이 데이터로 스푼 부족 지점, 힌트 소비, Time Attack 참여율, Pantry 장식 욕구를 확인한 뒤 v1.1+에서 재검토한다.

- Consumable spoon bundles
- Seasonal puzzle packs
- Cozy Pass subscription
- Ad removal package
- Rewarded ads
- Premium-only decorations

---

## 6. 자연 긴장 포인트 (monetization moments)

Codex는 아래 시점에서 자연스럽게 스푼 계획과 응원팩 경로가 노출되도록 구현한다.
**절대 강제 팝업이나 인터럽트 없음.** 퍼즐 플레이 중에는 구매 유도 없음.

```
[긴장 포인트 1 — 약 50–80 퍼즐 완료]
  상황: Tier 2 팩 2–3번째 언락 + common 장식 몇 개 구매
  스푼 보유: 약 100–200 spoons
  갖고 싶은 cozy 아이템: 80+ spoons
  다음 팩 언락비: 80 spoons
  → 먼저 퍼즐/데일리/타임어택으로 모으는 길을 보여주고, 필요하면 Pip Support Pack을 볼 수 있게 한다.

[긴장 포인트 2 — 약 150–200 퍼즐 완료]
  상황: Tier 3 진입, rare 아이템이 눈에 보이기 시작
  스푼 보유: 약 300–500 spoons
  갖고 싶은 rare 아이템: 200–300 spoons
  다음 팩 언락비: 160 spoons
  → Pantry 목표 카드나 스푼 계획 안에서 Pip Support Pack이 자연스럽게 보인다.

[긴장 포인트 3 — 약 400+ 퍼즐 완료]
  상황: Tier 5 진입, premium 아이템 욕망
  스푼 보유: 약 1,000–2,000 spoons
  갖고 싶은 premium: 500–900 spoons
  → v1에서는 장기 플레이와 시즌 업데이트로 조절한다. 더 큰 스푼 상품은 출시 후 데이터가 쌓인 뒤 재검토한다.
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

v1 Android Billing은 `@capgo/native-purchases`를 사용한다. 상품 ID는 코드와 Play Console 모두 아래 값 하나만 사용한다:

```js
export const COZY_SUPPORT_PRODUCT_ID = "pip_cozy_support";
```

Play Console에서 같은 ID의 managed product / non-consumable을 생성하고 활성화해야 실제 내부 테스터 결제가 가능하다. 서버 검증과 환불/소유권 회수 동기화는 v1.1 이후 과제이며, v1은 Google Play Billing 결과 + 로컬 중복 지급 방지로 제한한다.

---

## 8. UI 노출 규칙

- Settings에는 Support Pack 카드와 Restore 경로가 항상 명확히 존재한다.
- Pantry 스푼 계획에는 선택한 목표에 스푼 부족이 있을 때만 Support Pack action을 함께 보여준다.
- 퍼즐 플레이 중 어떤 구매 유도도 없음.
- 구매/복원 완료 후에는 감사/보유 상태를 보여주고 같은 상품을 다시 사도록 유도하지 않는다.
- bonus-pack/future-pack은 v1에서 플레이 가능한 구매 대상으로 보이지 않는다. 필요하면 출시 예정/다음 시즌 기대감으로만 표현한다.


## Implementation Status - 2026-07-17 v0.1.422

- Implemented the central economy constants in `src/data/economyConfig.js`.
- Wired puzzle-stage completion to one-time `stageBonus` rewards through `markPackCompletedIfFirst(pack)`.
- Wired the daily recommendation bonus, Time Attack reward lane, Replay Pick limits, extra hint spending, and Pantry goal gates into the shared economy.
- Implemented Android Billing support path for `pip_cozy_support` with `@capgo/native-purchases`, purchase, restore, cancellation/failure states, and local duplicate reward protection.
- Implemented Pantry support-path exposure from natural spoon shortfalls while keeping active puzzle play free of purchase prompts.
- Not yet complete before public upload: Play Console managed-product activation, final Android versionCode/versionName bump, signed AAB rebuild, and real internal-tester purchase/restore validation.


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
- Players who want to decorate faster may notice the optional Pip Support Pack from spoon-planning moments, not from hard content locks or active-play prompts.
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


---

## 6. v1 Android Billing Products

v1 Android launch uses two Google Play managed products. Both are optional and should be introduced as spoons/support/jar language, not as paid/free tiers.

### Pip Support Pack

- Code constant: `COZY_SUPPORT_PRODUCT_ID`
- Product ID: `pip_cozy_support`
- Type: one-time managed product / non-consumable
- Suggested price: USD 0.99 / KRW 1,100
- Spoon grant: 250 spoons through `COZY_PASS_SPOON_GRANT`
- Save guard: `cozyPassPurchased` prevents duplicate purchase/restore grants
- Plugin path: `@capgo/native-purchases`

### Small Spoon Jar

- Code constant: `SPOON_JAR_SMALL_PRODUCT_ID`
- Product ID: `pip_spoon_jar_small`
- Type: managed product / consumable repeatable top-up
- Suggested price: USD 2.99 / KRW 3,300-4,400
- Spoon grant: 750 spoons through `SPOON_JAR_SMALL_GRANT`
- Save guard: `processedBillingPurchaseIds` keeps the same purchase token from granting twice
- Plugin path: `@capgo/native-purchases`

### v1 Validation Scope

- Client-side Play Billing result recognition is enough for v1 because the reward values are modest and local-only.
- Server-side receipt validation, refund revocation sync, cross-device entitlement sync, and larger product tiers are v1.1+ candidates after real play data.
- Play Console must activate both product IDs before the final signed AAB test.
