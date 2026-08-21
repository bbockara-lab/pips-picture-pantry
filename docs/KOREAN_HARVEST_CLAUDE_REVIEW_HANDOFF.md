# Korean Harvest Candidate — Claude Review Handoff

Review date: 2026-08-20
Repository: `/Users/jay_mac/Developer/01. Pips-Picture-Pantry`
Review scope: Korean Harvest candidate only; do not modify or inspect the OneDrive backup as an implementation source.

## Review objective

Determine whether the Korean Harvest candidate is safe, internally consistent and ready for final activation work. The event must remain invisible to current users during this review. Do not change either candidate status to `live`.

The current public release artifacts are out of scope and must not be replaced:

- iOS 1.1.22, build 5
- Android versionCode 51, versionName 1.1.22

No new AAB or IPA is being requested in this review.

## Product contract

- Pip must remain visibly present in every seasonal home composition.
- The art direction must read as one warm, painterly Sunny Spoon Studios world rather than a collection of unrelated overlays.
- Korean and English copy must remain paired and culturally respectful.
- Future puzzles, shelves, Pantry rewards, badge and mailbox letter must appear atomically only after deliberate activation.
- Existing saves must remain valid if the seasonal event is later archived.
- No future story or mailbox content may leak before activation.

## Candidate content

- Theme id: `korean-harvest`
- Content id: `korean-harvest-2026`
- Planned publish date: 2026-09-17
- Runtime state: theme `candidate`, content `candidate`
- Catalog: 16 handcrafted bilingual puzzles
  - four 5×5
  - four 8×8
  - four 10×10
  - four 12×12
- Progression: four shelves of four puzzles each
- Pantry rewards: unlock after 4, 8, 12 and 16 completions
- Maximum board size (`pack.size`): 12
- Catalog count (`pack.catalogCount`): derived from `KOREAN_HARVEST_CONTENT.puzzles.length` and expected to be 16
- Unlock cost: 0

## Change map

Data and activation:

- `src/data/koreanHarvestContent.js`
- `src/data/koreanHarvestPuzzles.js`
- `src/data/seasonalThemes.js`
- `src/data/packs.js`
- `src/data/puzzles.js`
- `src/data/seasonShelves.js`
- `src/data/completionPalettes.js`

Runtime presentation:

- `src/ui/puzzleHubView.js`
- `src/ui/mapView.js`
- `src/ui/puzzleView.js`
- `src/ui/pantryView.js`
- `src/ui/mailboxView.js`
- `src/ui/pipReaction.js`
- `src/game/badges.js`
- `src/data/badgeArt.js`
- `src/data/mailboxMessages.js`

Localization and art governance:

- `src/i18n/en.js`
- `src/i18n/ko.js`
- `src/data/assetManifest.js`
- `src/assets/seasonal/korean-harvest/`
- `src/assets/mailbox/pip-korean-harvest-letter-v1.webp`
- `src/assets/badges/badge-pip-korean-harvest-v2.webp`
- `src/assets/generated/pip-puzzle-workshop-korean-harvest-v1.webp`

Tests and QA:

- `tests/koreanHarvestContent.test.js`
- `tests/koreanHarvestRuntimeGate.test.js`
- `tests/badgeExposure.test.js`
- `tests/mailbox.test.js`
- `scripts/mobile_visual_check.js`

Documentation:

- `docs/KOREAN_HARVEST_UPDATE_ART_DIRECTION.md`
- `docs/RELEASE_PLAN.md`
- `docs/ANDROID_RELEASE_STATUS.md`

Exclude unrelated realtime-territory-game planning and marketing research from this review.

## Activation design

The candidate uses a two-key gate:

1. `seasonalThemes` must promote `korean-harvest` from `candidate` to `live` and archive summer.
2. `KOREAN_HARVEST_CONTENT.status` must promote from `candidate` to `live`.

`isKoreanHarvestContentRuntimeReady()` requires both statuses, explicit activation, approved letter art and approved reward art. A partial promotion intentionally keeps all event content hidden.

The approved home background and badge are already registered so they can be visually tested. Registration is not exposure. Development preview is available with:

`?seasonalTheme=korean-harvest`

Production continues to use the live summer theme until activation.

## Reviewer priorities

### P0 — release blockers

- Any path that exposes future event content while either status remains `candidate`.
- Regression to the current summer runtime or current save format.
- Puzzle data that is invalid, unsolvable, duplicated or disconnected from its shelf.
- Missing asset references or production imports that bypass the manifest/gate.

### P1 — correctness and activation safety

- Catalog count, shelf membership and reward cadence must agree: 16 puzzles / four shelves / four rewards. Do not confuse `pack.size` (maximum board dimension, 12) with `pack.catalogCount` (number of puzzles, 16).
- Activation and archival must be atomic and reversible without corrupting progress.
- Mailbox letter and badge unlock rules must match the same event gate.
- Android and iOS must resolve the same theme/content ids.
- Narrow phone layouts must preserve readable labels, unobscured Pip and reachable navigation.

### P2 — presentation and product quality

- Visual tone, cultural coherence, safe areas and baked-in Pip placement.
- Korean/English copy parity and natural phrasing.
- Reward cadence and zero-cost seasonal progression.
- Any maintainability issue likely to create drift at activation time.

## Verification commands

Run from the repository root:

```sh
npm run test
npm run qa:assets
PPP_URL='http://127.0.0.1:4179/?seasonalTheme=korean-harvest' npm run qa:mobile
npm run build
npm run qa:candidate
git diff --check
```

Evidence recorded before handoff:

- Unit/integration: 65 files, 388 tests; functions 3/3
- Asset manifest: 239 assets
- Korean Harvest mobile visual QA: passed at 360×740, 390×844, 430×932 and 675×900
- Production build: passed
- Full release-candidate gate: passed, including the current summer runtime visual QA at 360×740, 390×844, 430×932 and 675×900
- Android/iOS release identity gates: passed at Android 51 / 1.1.22 and iOS build 5 / 1.1.22; these current-release artifacts are outside this review scope
- Whitespace validation: passed

The production build reports Vite's existing advisory that the main JavaScript chunk exceeds 500 kB. It is a non-blocking optimization warning, not a build failure or a Korean Harvest regression.

## Requested review response

Return findings first, ordered P0 through P3. Every actionable finding should include an exact file and line, the user-visible or release risk, and the smallest safe correction. Separate true blockers from optional polish. End with one verdict:

- `BLOCKED`
- `READY FOR FIXES THEN RECHECK`
- `READY FOR ACTIVATION CHECKLIST`

Do not declare the event live, build release binaries, commit, push or modify store submissions as part of this review.
