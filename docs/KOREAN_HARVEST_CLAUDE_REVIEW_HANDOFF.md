# Korean Harvest v0.1.720 — Claude Release Review Handoff

Review prepared: 2026-08-29

Repository: `/Users/jay_mac/Developer/01. Pips-Picture-Pantry`

Target release: Android `1.1.26` (`versionCode 54`), iOS `1.1.26` (`build 9`), app `v0.1.720`

## Review objective

Review the complete Korean Harvest release candidate for user-visible regressions, save/economy safety, bilingual copy drift, forced-update rollout safety and native release readiness. Do not edit files, create another commit, deploy the mandatory policy or submit either store build during this review.

Return findings first, ordered P0 through P3. Each actionable finding must include the exact file and line, user-visible/release risk and smallest safe fix. End with one verdict: `BLOCKED`, `READY FOR FIXES THEN RECHECK`, or `READY TO SHIP`.

## Product and release contract

- Korean Harvest is live in this build; summer content is archived.
- Pip must be clearly visible in the seasonal home artwork.
- Existing local saves must migrate without losing progress, spoons, purchases or settings.
- The Chuseok gift grants exactly 50 spoons once per player during 2026-09-17 through 2026-10-04, before the ordinary login bonus prompt.
- Home Display is the only collectible-display selection. No separate effect activation or ambiguous collectible selection remains.
- A displayed collectible explains its extra-spoon chance when tapped; positive chances use `+N%`, and 0% is described as locked rather than as a bonus.
- D-pad quick taps move only. Painting while moving begins only after a deliberate hold; it must not paint on every casual direction press.
- Play Now resumes after the most recently completed puzzle, wraps to any earlier missed puzzle, and never opens a locked stage.
- Next Picture advances to the next eligible unfinished puzzle, ignores duplicate rapid activation, and routes a completed stage to its required Pantry shelf when no playable puzzle remains.
- The Pantry stage-gate guide has one required destination. Retired Lily/Mateo Pantry dialogue must not reappear; Pip alone explains useful Home Display and bonus-chance behavior.
- Time Attack shows 3→2→1→Go before its timer starts and uses its dedicated music.
- English and Korean remain functionally equivalent.
- The same web bundle and audio catalog must ship on Android and iOS.

## Release content

- 616 uniquely solvable puzzles total.
- Korean Harvest adds 16 bilingual puzzles: four each at 5×5, 8×8, 10×10 and 12×12.
- Four seasonal shelves, four Pantry rewards, one mailbox letter and one new badge.
- Total Pantry collectibles: 88. Total badges: 16.
- Runtime audio catalog: 322 MP3 cues, including home, puzzle, Pantry, Album/Map, Spoon Run, dialogue and Time Attack music plus UI/gameplay effects.
- Store event upload packet: `store-assets/events/korean-harvest-2026/`.

## High-risk review map

Gift and save migration:

- `src/data/koreanHarvestContent.js`
- `src/game/koreanHarvestGift.js`
- `src/ui/seasonalGiftView.js`
- `src/game/save.js`
- `src/ui/appShell.js`
- `tests/seasonalGiftView.test.js`
- `tests/save.test.js`

Forced update and release identity:

- `store-assets/app-update-policy.json`
- `store-assets/app-update-policy-mandatory-after-both-live.json`
- `store-assets/app-update-policy-rollback.json`
- `src/data/appVersion.js`
- `src/data/releaseBuild.js`
- `android/app/build.gradle`
- `ios/App/App.xcodeproj/project.pbxproj`
- `scripts/update_policy_check.js`
- `tests/updatePolicy.test.js`

Seasonal activation, puzzle integrity and progression:

- `src/data/koreanHarvestContent.js`
- `src/data/koreanHarvestPuzzles.js`
- `src/data/seasonalThemes.js`
- `src/data/packs.js`
- `src/game/badges.js`
- `src/data/mailboxMessages.js`
- `tests/koreanHarvest*.test.js`
- `tests/contentProgressionIntegrity.test.js`

Interaction fixes:

- `src/ui/puzzleCursorControls.js`
- `src/game/puzzleSequence.js`
- `src/ui/puzzleView.js`
- `src/ui/puzzleHubView.js`
- `src/ui/appShell.js`
- `src/ui/pantryView.js`
- `src/ui/pantryGuideFlow.js`
- `src/ui/guideDialog.js`
- matching tests under `tests/`

Audio and art:

- `src/ui/audio.js`
- `src/ui/audioCatalog.js`
- `src/assets/audio/korean-harvest/`
- `src/assets/generated/pip-puzzle-workshop-korean-harvest-v2-cute-capybara.webp`
- `src/assets/seasonal/korean-harvest/pip-chuseok-welcome-gift-v1.webp`
- `src/data/assetManifest.js`
- `scripts/audio_runtime_check.js`

Exclude unrelated social-video generators/assets and `docs/SUNNY_SPOON_REALTIME_TERRITORY_GAME_FOUNDATION.md` from this release review.

## Mandatory-update deployment safety

The committed default policy is intentionally submission-safe:

- latest Android 54 / iOS 9
- minimum Android 53 / iOS 8

It advertises the new build without blocking users while either store is still reviewing or propagating it. Only after **both exact builds are public in every intended region** may operations publish `app-update-policy-mandatory-after-both-live.json`, which raises the minimums to 54/9. If either store or the hosted policy misbehaves, publish `app-update-policy-rollback.json` immediately. Treat premature deployment of the mandatory file as P0.

## Store-event status

Apple and Google upload-ready media and bilingual metadata are in `store-assets/events/korean-harvest-2026/`. Console state could not be independently confirmed because App Store Connect was signed out and Google Play was open under a different account. If an existing event is present, update it; otherwise create it. This is an operations follow-up, not a code blocker.

## Recorded verification evidence

- Unit/integration: 70 Vitest files / 424 tests passed; functions 3/3 passed.
- All 616 puzzles passed catalog and unique-solution validation.
- Asset manifest: 241 registered assets passed.
- Runtime audio: all 322 required MP3 cues passed catalog/file validation.
- Store event assets and dimensions passed.
- Update-policy safe/mandatory/rollback semantics passed.
- Mobile visual QA passed at 360×740, 390×844, 430×932 and 675×900.
- A completed first stage was seeded in the local app and checked at 390×844: Play Now showed the single Pantry requirement guide, its action opened the Pantry, and no retired Lily/Mateo dialogue appeared.
- Native sync completed for Android and iOS from the same production build.
- iPhone 17 Pro simulator: launch, opening art, Korean Harvest home with Pip and Pantry inspected visually.
- Pixel 8 emulator: launch, Korean Harvest home with Pip, Pantry and active Time Attack board inspected visually.
- Android AudioFlinger reported `com.sunnyspoonstudios.pipspicturepantry` as an active playback client during the native home test.
- Vite's existing >500 kB main-chunk advisory remains non-blocking.

## Reviewer commands

```sh
npm run test
npm run qa:assets
npm run qa:audio
npm run qa:harvest-event
npm run qa:update-policy
npm run qa:telegram-ideas
npm run qa:candidate
git diff --check
```

## Packaging targets

- Android: `release-artifacts/android-1.1.26-54-v0.1.720-korean-harvest/Pips-Picture-Pantry-1.1.26-54.aab`
- iOS: `release-artifacts/ios-1.1.26-9-v0.1.720-korean-harvest/export/App.ipa`

Verify the final files' signatures, embedded identities and SHA-256 values after packaging. The one release commit must remain the source of both artifacts.
