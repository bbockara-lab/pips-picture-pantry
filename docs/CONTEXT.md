# Pip's Picture Pantry - Active Context

Last updated: 2026-06-28

## Current Phase

- Mode: `live-candidate`
- Version: `v0.1.0`
- Goal: ship a small Android-first cozy Nonogram MVP within one week, while keeping iOS packaging and store-readiness prepared for Mac Mini handoff.

## Decisions

- Elena's Cozy Village remains on hold.
- This project starts clean and only reuses Sunny Spoon Studios character, brand, and art references.
- MVP focuses on one puzzle loop: choose puzzle, fill or mark cells, complete a picture, save progress.
- Monetization should be weak/trial-level and should not block most content or interfere with world introduction.
- Week-one monetization should favor optional non-consumable support or a bonus pack later; ads are deferred.

## Implementation Notes

- Use Vite, plain JavaScript modules, CSS Grid, LocalStorage, and Vitest.
- Keep puzzle logic independent from UI.
- Avoid old Elena UI, old QA artifacts, and broad simulation/story systems.
- Android app ID target: `com.sunnyspoonstudios.pipspicturepantry`.
- iOS bundle ID target: `com.sunnyspoonstudios.pipspicturepantry`.

## Verification Log

- 2026-06-28: Confirmed workspace root is `D:\Users\bbock\OneDrive\00. Private\10. Development\03. Pip's Picture Pantry`.
- 2026-06-28: Confirmed handoff files exist at project root rather than under `PipPicturePantry_NewProject_Handoff`.
- 2026-06-28: Added Vite/Vitest scaffold, Milestone 0 docs, core Nonogram modules, five starter puzzles, and first playable mobile UI.
- 2026-06-28: `npm install` completed with 0 vulnerabilities.
- 2026-06-28: `npm run test` passed: 2 files, 8 tests.
- 2026-06-28: `npm run build` passed and generated `dist/`.
- 2026-06-28: Local dev server verified at `http://127.0.0.1:5173` with HTTP 200.
- 2026-06-28: Official monetization docs checked; MVP monetization remains optional non-consumable support or bonus pack, with ads deferred.
- 2026-06-28: Initialized local Git repository, added `.gitignore`, committed baseline as `a83aa08 chore: initialize Pip's Picture Pantry MVP scaffold`, and renamed branch to `main`.
- 2026-06-28: Responded to Claude Review 1: fixed stacked column clues, changed board clue row to auto height, added Pantry Album view, softened progress copy, added two 8x8 puzzles, and added puzzle data tests.
- 2026-06-28: `npm run test` passed after Claude response: 3 files, 11 tests.
- 2026-06-28: `npm run build` passed after Claude response.
- 2026-06-28: Browser visual QA was attempted, but in-app browser connection failed with Windows sandbox ACL error; mobile visual pass remained pending.
- 2026-06-28: Responded to Claude Review 2: added `src/i18n` scaffold for English/Korean, extracted gameplay UI strings, restored `×` difficulty badge via `\u00d7`, converted album stamps from text abbreviations to mini puzzle-grid visuals, added `.content-panel`, and added `min-height` for album stamps.
- 2026-06-28: Korean i18n file is stored with Unicode escape sequences to avoid Windows/PowerShell encoding corruption while still rendering Korean text in the browser.
- 2026-06-28: `npm run test` passed after i18n response: 4 files, 14 tests.
- 2026-06-28: `npm run build` passed after i18n response.
- 2026-06-28: Added Playwright mobile QA script and verified 360x740, 390x844, and 430x932 with no horizontal overflow, visible puzzle board, visible album, and acceptable tap targets.
- 2026-06-28: Added Capacitor Android shell with app ID `com.sunnyspoonstudios.pipspicturepantry`; `npx cap sync android` passed.
- 2026-06-28: Android debug APK build passed: `android/app/build/outputs/apk/debug/app-debug.apk`.
- 2026-06-28: Android release AAB build passed: `android/app/build/outputs/bundle/release/app-release.aab`.
- 2026-06-28: `jarsigner -verify` confirmed the release AAB is unsigned; upload keystore/signing remains the Play upload blocker.
- 2026-06-28: npm run cap:sync passed, then scripts/build_android_release_bundle.ps1 passed after sync.

## Progress Update - 2026-06-28 Game Loop / Monetization Foundation

- Responded to Claude Design & Game Feel Review and Direction Note 2 with a focused live-candidate polish slice.
- Added reset confirmation dialog so progress is not erased by a single accidental tap.
- Locked completed puzzle boards while keeping the solved picture visible.
- Added completion CTAs: View Album and Next Picture, connecting completion to collection value.
- Added a visually separate Daily card above the puzzle panel to make the daily habit loop clearer.
- Added pack/access metadata for future monetization structure: free, unlockable, and bonus-pack. No payment UI or forced monetization was added.
- Removed dead puzzle reward display data from puzzles.js; puzzle copy now stays in i18n dictionaries.
- Added one new 8x8 puzzle and one 10x10 next-step puzzle to exercise larger board and album stamp density.
- Cached the active locale after startup and added an explicit ko.js comment that launch puzzle titles stay English intentionally.
- Verification after this slice: node --check on changed JS modules passed; npm run test passed with 16 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; npm run cap:sync passed; scripts/build_android_release_bundle.ps1 passed; jarsigner still reports the release AAB is unsigned.

## Next Actions

- Create/connect upload keystore outside the repo and build a signed Android release AAB.
- Draft Android/iOS store metadata and screenshot checklist.
- Run a manual playthrough on the Daily card, reset modal, completion CTA, album view, and 10x10 puzzle on a real or emulator device.
- Review Korean copy quality before store screenshots; strings render through Unicode escapes but copy should still be human-polished.
- Decide whether the 10x10 unlockable puzzle should be visually locked in UI for v0.1.0 or remain selectable as a non-blocking preview.