# Pip's Picture Pantry - Active Context

Last updated: 2026-06-28

## Current Phase

- Mode: `live-candidate`
- Version: `v0.1.13`
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
- 2026-06-28: Responded to Claude Review 2: added `src/i18n` scaffold for English/Korean, extracted gameplay UI strings, restored the x difficulty badge via `\u00d7`, converted album stamps from text abbreviations to mini puzzle-grid visuals, added `.content-panel`, and added `min-height` for album stamps.
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


## Progress Update - 2026-06-28 Sunny Spoon Entry Identity

- Bumped visible app version to v0.1.1.
- Added an in-app Sunny Spoon Studios opening screen using the launch app seal, cozy paper texture, warm family-look copy, and the opening expression character sheet.
- Added a Start skip button and short auto-dismiss timing so the brand moment is visible without slowing the puzzle loop.
- Updated Pip strip imagery from the generic app icon to character art for stronger family look continuity.
- Added shared CSS tokens and paper-grid texture treatment across the body, panels, buttons, daily card, board cells, and completion state.
- Aligned Android native color resources, splash theme colors, launcher background color, and web theme-color with the Sunny Spoon cream/paper palette.
- Updated mobile QA to verify the brand intro before continuing to puzzle and album checks.
- Verification after this slice: node --check passed on changed JS files; npm run test passed with 16 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; npm run cap:sync passed; scripts/build_android_release_bundle.ps1 passed; jarsigner still reports the release AAB is unsigned.

## Progress Update - 2026-06-28 Studio Logo / Language Settings

- Bumped visible app version to v0.1.2.
- Split startup identity into two explicit stages: Sunny Spoon Studios company logo bumper first, then Pip's Picture Pantry game identity.
- Kept the company bumper as a fixed English studio mark, while game identity and app UI follow the active language.
- Added in-app Settings with language choices: System, English, Korean.
- Default language behavior is System, which follows device/browser language; explicit user choices are stored locally and override System.
- Added i18n tests for system default and in-app language override behavior.
- Updated mobile QA to verify both the studio logo stage and game identity stage before checking puzzle and album screens.
- Android language direction noted: Android 13+ supports centralized per-app language preferences; native LocaleManager/AppCompat integration remains a later Android polish step after the Capacitor MVP shell is stable.
- Verification after this slice: node --check passed on changed JS files; npm run test passed with 17 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; npm run cap:sync passed; scripts/build_android_release_bundle.ps1 passed; jarsigner still reports the release AAB is unsigned.

## Progress Update - 2026-06-28 First-Play Clarity / Copy Cleanup

- Bumped visible app version to v0.1.3.
- Removed internal product-direction copy from the game identity screen. The game identity now shows title, character art, and Start only.
- Set the first puzzle on launch to the 5x5 Pip Face starter puzzle instead of a rotating Daily puzzle, so first-time players begin with the easiest board.
- Added a compact How to Play card above the board with the first action: choose Fill, read number clues, tap squares, and use Mark for blanks.
- Added a simple clue example visual so the player sees what a clue like 3 means before touching the grid.
- Updated Korean font handling by setting document language from the active locale and adding Korean-first font stack for lang=ko.
- Updated user-facing copy to remove vague direction/brand-positioning lines; keep future visible copy concrete and player-useful.
- Updated mobile QA to verify the How to Play card is visible before checking the puzzle board.
- Verification after this slice: node --check passed on changed JS files; npm run test passed with 17 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; npm run cap:sync passed; scripts/build_android_release_bundle.ps1 passed; jarsigner still reports the release AAB is unsigned.


## Product Copy Rule

- Do not show internal development-positioning phrases to players. Lines such as quiet minutes, cozy world intent, or why we are making the game belong in planning docs, not the app UI.
- First-play screens must answer what should I do now within one glance.
- Player-facing text should be concrete: tap, fill, mark, solve, save, album, today.

## Progress Update - 2026-06-28 Clue Readability / Visual Direction

- Bumped visible app version to v0.1.4.
- Removed the ambiguous cropped character thumbnail from the Pip strip; first-play UI now focuses on instruction and board state.
- Removed difficult player-facing terminology such as grid from onboarding copy, replacing it with picture squares / picture cells.
- Clarified clue wording: 3 means three together; 1 1 means two separate singles.
- Improved clue number rendering so separate numbers no longer visually collapse into 111.
- Improved fill/mark visual language: fill uses warmer honey/coral tones, mark uses mint dashed styling and a dot marker.
- Added Korean font handling and copy cleanup carried forward from v0.1.3.
- Generated first experimental character redesign candidate at docs/visual-concepts/pip-cast-redesign-concept-v1.png.
- Added docs/CHARACTER_REDESIGN_DIRECTION.md with redesign principles, avoid-list, and IP clearance notes.
- Verification after this slice: node --check passed on changed JS files; npm run test passed with 17 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; npm run cap:sync passed; scripts/build_android_release_bundle.ps1 passed; jarsigner still reports the release AAB is unsigned.


## Progress Update - 2026-06-28 Character Direction Approval

- Bumped visible app version to v0.1.5.
- User approved the first Pip/cast redesign concept as the production target direction.
- Created a resized app asset at src/assets/characters/pip-cast-redesign-concept-v1-web.jpg from the approved concept for app use.
- Updated the game identity cast image to show the approved redesign direction instead of the older expression sheet, using Vite asset imports so the image is bundled into dist/Android.
- Updated brand metadata so launchProductName and currentAppTitle point to Pip's Picture Pantry instead of Elena's Cozy Village.
- Documented that the app icon/native launcher assets still need a dedicated redesign-based icon pass before final store submission.
- Verification after this slice: node --check passed on changed JS files; npm run test passed with 17 tests; npm run build passed with the app character asset bundled at about 119 KB; npm run qa:mobile passed at 360x740, 390x844, and 430x932; npm run cap:sync passed; scripts/build_android_release_bundle.ps1 passed after running separately from cap:sync; jarsigner still reports the release AAB is unsigned.


## Progress Update - 2026-06-28 Pip Strip Sticker

- Bumped visible app version to v0.1.6.
- Generated a dedicated Pip sticker asset for the in-game Pip strip using the approved cozy sticker direction.
- Saved the app asset at src/assets/characters/pip-strip-sticker-v1.png with transparent corners and a 320px square size.
- Restored Pip character presence in the Pip strip without reusing a cropped character sheet or app icon.
- Updated CHARACTER_IP_BIBLE.md so Pip's MVP visual anchors match the approved chef-hat/scarf pantry-helper direction.
- Updated mobile visual QA to require the Pip strip sticker to render on 360px, 390px, and 430px mobile widths.
- Verification after this slice: node --check passed on appShell.js and mobile_visual_check.js; npm run test passed with 17 tests; npm run build passed with the Pip strip asset bundled at about 170 KB; npm run qa:mobile passed; npm run cap:sync passed; scripts/build_android_release_bundle.ps1 passed; jarsigner still reports the release AAB is unsigned.

## Progress Update - 2026-06-28 Completion Reward Moment

- Bumped visible app version to v0.1.7.
- Generated and added a dedicated Pip completion reaction sticker at src/assets/characters/pip-complete-sticker-v1.png.
- Rebuilt the completion banner into a reward moment with Pip reaction art, concrete saved-card copy, completion CTAs, and a larger solved-picture reveal card.
- Updated mobile visual QA to seed a completed starter puzzle and verify .completion-pip and .completion-reveal render on 360px, 390px, and 430px mobile widths.
- Verification after this slice: node --check passed on appShell.js, pipReaction.js, and mobile_visual_check.js; npm run test passed with 17 tests; npm run build passed with the Pip completion asset bundled at about 221 KB; npm run qa:mobile passed; npm run cap:sync passed; scripts/build_android_release_bundle.ps1 passed; jarsigner still reports the release AAB is unsigned.


## Progress Update - 2026-06-28 Unlock Gate

- Bumped visible app version to v0.1.8.
- Added src/game/puzzleAccess.js to evaluate unlock requirements independently from UI rendering.
- Connected the Sunny Spoon Sign 10x10 puzzle to completed-count progress: it now stays locked until 5 cards are completed.
- Puzzle picker now renders locked chips as disabled with a visible completion requirement instead of allowing early selection.
- Added unlock access tests covering free puzzles, completed-count locking, unlocking, and duplicate completed-id handling.
- Updated mobile visual QA to require a locked puzzle chip before the starter completion seed runs.
- Verification after this slice: node --check passed on appShell.js, puzzleAccess.js, and mobile_visual_check.js; npm run test passed with 20 tests; npm run build passed; npm run qa:mobile passed; npm run cap:sync passed; scripts/build_android_release_bundle.ps1 passed; jarsigner still reports the release AAB is unsigned.

## Product Copy Rule

- Do not show internal development-positioning phrases to players. Lines such as quiet minutes, cozy world intent, or why we are making the game belong in planning docs, not the app UI.
- First-play screens must answer what should I do now within one glance.
- Player-facing text should be concrete: tap, fill, mark, solve, save, album, today.
- Avoid technical terms like grid when a simpler player term works.

## Character Direction Rule

- Treat current generated character art as clearance-pending and replaceable.
- Prefer original, simplified 2D sticker-like shapes over glossy AI-rendered fur or semi-realistic mascot detail.
- Do not ship a final character design without visual similarity review and trademark/name clearance in target markets.

## Next Actions

- Expand launch puzzle content toward the 30-picture store target after the completion loop feels rewarding.
- Create/connect upload keystore outside the repo and build a signed Android release AAB.
- Draft Android/iOS store metadata and screenshot checklist using the v0.1.6 first-play flow.
- Run a manual real-device or emulator check of native splash to Sunny Spoon logo bumper to game identity to first puzzle handoff.
- Later Android polish: connect in-app language picker to Android per-app language APIs/LocaleManager or AppCompat so system settings and app settings stay synchronized on Android 13+.

## Progress Update - 2026-06-28 Android Signing Pipeline

- Kept UI version at v0.1.8 because this slice changes release infrastructure, not player-visible behavior.
- Added environment-variable based Android release signing in android/app/build.gradle.
- Added scripts/create_android_upload_keystore.ps1 for one-time upload keystore creation outside the repo.
- Added scripts/build_android_signed_release_bundle.ps1 for signed AAB builds and jarsigner verification once signing variables are set.
- Added docs/ANDROID_SIGNING_SETUP.md and .gitignore safeguards for keystore/signing-secret files.
- Next Android blocker: run the keystore creation step with owner-chosen passwords, set PPP_UPLOAD_* environment variables, build the signed AAB, and upload to Google Play internal testing.

## Progress Update - 2026-06-28 Signed Android AAB

- Kept UI version at v0.1.8 because this slice changes release readiness, not player-facing behavior.
- Created the Android upload keystore and a local-only signing env file outside the repo under D:\Users\bbock\OneDrive\00. Private\10. Development\99. Key Paths\Android\Pip's Picture Pantry.
- Built the first signed release AAB at android/app/build/outputs/bundle/release/app-release.aab.
- Verified the signed AAB with jarsigner: jar verified, exit code 0.
- Recorded upload key SHA-256 fingerprint in docs/ANDROID_RELEASE_STATUS.md for Play Console reference.
- Next Android action: upload signed AAB to Google Play internal testing and capture Play Console acceptance or rejection details.

## Progress Update - 2026-06-28 Key Paths Organization

- Organized private Android signing materials under 99. Key Paths/Android by project name.
- Moved Pip's Picture Pantry upload keystore and local signing env file to 99. Key Paths/Android/Pip's Picture Pantry outside the repo.
- Moved Elena Cozy Village upload key into 99. Key Paths/Android/Elena Cozy Village for the same key-storage convention.
- Updated Android signing docs and the keystore creation script default path to the 99. Key Paths convention.
- Verification after this slice: rebuilt the signed AAB using the moved Pip env file path; jarsigner reported jar verified; current upload key SHA-256 is recorded in docs/ANDROID_RELEASE_STATUS.md.

## Progress Update - 2026-06-28 v0.1.9 First Internal Test Feedback

- Bumped visible app version to v0.1.9 and Android release version to versionCode 2 / versionName 1.0.1 for the next Play internal test upload.
- Changed the game identity screen so it no longer auto-dismisses; players must tap Start before entering the puzzle.
- Clarified first puzzle instructions: 3 is now described as three continuous squares, and 1 1 explains coloring one square, leaving a gap, then coloring one more.
- Renamed controls from Fill / Mark / Undo to Color / Blank Check / Undo last move in English, and to coloring / blank-check wording in Korean.
- Lightened the cozy paper background while keeping the Sunny Spoon cream palette.
- Reframed Today's card as Today's pick: a suggested picture with no bonus, meant only to reduce choice friction.
- Updated mobile visual QA to verify the game identity screen stays visible until Start is tapped.
- Verification after this slice: node --check passed on changed JS modules; npm run test passed with 20 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; signed AAB rebuilt and jarsigner reported jar verified.
## Progress Update - 2026-06-28 v0.1.10 Puzzle List Progress Cues

- Bumped visible app version to v0.1.10 and Android release version to versionCode 3 / versionName 1.0.2 for the next internal test upload.
- Added each puzzle size to the bottom picture list, so players can see 5x5 / 8x8 / 10x10 before choosing a picture.
- Added completed-state labeling and a soft mint completed style to solved pictures in the bottom list, not only in the album.
- Adjusted the album note so the Korean line "completed cards appear here" stays on one line on the target mobile widths.
- Captured the user's larger retention idea as a future Pantry Mural / meta-picture system: solved cards can become tiles toward a larger cozy illustration.
- Captured the audio idea as a post-internal-test polish candidate: cute tap/mark/complete SFX and a low-volume cozy BGM loop, with mute/settings controls and no extra monetization pressure.

## Product Direction Candidates

- Pantry Mural: each solved card can fill one slot of a larger pantry/cafe illustration. This should be a motivation layer, not a blocker for enjoying individual free cards.
- Audio polish: add lightweight local audio assets only after current first-play flow is stable. Required controls: sound effects on/off, music on/off, conservative default volume, and no disruptive autoplay assumptions.
## Progress Update - 2026-06-28 v0.1.11 Player Profiles / Pantry Map

- Bumped visible app version to v0.1.11 and Android release version to versionCode 4 / versionName 1.0.3 for the next internal test upload.
- Added a first-launch player name step after the Sunny Spoon Studios and game identity screens. The app now asks what Pip should call the player before entering the puzzle loop.
- Added local player profiles: progress is saved by player name, and entering a different name can start or resume a separate local progress track on the same device.
- Preserved existing single-profile progress by migrating the legacy save into the first named profile when a player name is created.
- Added a Pantry Map tab where solved cards fill slots in a larger pantry wall. This is the first MVP version of the larger meta-picture retention loop.
- Added a player-name input in Settings so a device can switch to a new local name later.
- Audio remains deferred until after the name/profile and map loop have been tested on-device.
## Progress Update - 2026-06-28 v0.1.12 Launch Puzzle Volume

- Bumped visible app version to v0.1.12 and Android release version to versionCode 5 / versionName 1.0.4 for the next internal test upload.
- Corrected the map expansion direction: this slice expands the playable picture count, not only the Pantry Map meta view.
- Expanded the first launch shelf to 30 playable pictures: twelve 5x5 starter pictures, twelve 8x8 easy pictures, and six 10x10 next-step pictures.
- Kept the content mostly free and progression-based. The 10x10 pictures unlock by completed-card count rather than payment.
- Added puzzle data coverage to enforce the 30-picture launch volume and size distribution.


## Progress Update - 2026-06-28 v0.1.13 Review Fixes

- Bumped visible app version to v0.1.13 and Android release version to versionCode 6 / versionName 1.0.5.
- Fixed corrupted Korean albumText strings for the new launch puzzles from teacup-5 through village-window-10.
- Fixed createShell() to include onPlayerChange in the destructured parameter list so Settings can change the local player name.
- Clarified the three-tab model: Album stores completed cards, while Wall / Pantry Wall shows cards filling a larger pantry-wall progression view.
- Restored first-run player-name onboarding after the Start button and added a short note explaining that progress is saved under that name on this device.

## Progress Update - 2026-06-28 v0.1.14 Folder Economy / Audio Trial

- Bumped visible app version to v0.1.14 and Android release version to versionCode 7 / versionName 1.0.6.
- Fixed the live player profile path again from the tester screenshots: the Pip strip now receives the active player name, Settings shows translated player-name controls, and the `Jay` profile stays visible after first onboarding.
- Replaced the weak Today's pick wording with a reward reason: completing the daily pick now grants an extra spoon bonus once per day.
- Added the first trial economy loop: completed cards award spoons, the header shows spoon balance, and later folders can be opened with earned spoons.
- Expanded free launch content to 100 cards arranged as five folders of 20 cards each: Pip's First Shelf, Sunny Spoon Sign, Apron Drawer, Bakery Window, and Village Pantry.
- Converted the Roadmap view from individual card slots into folder-level mural progress, so each completed folder fills a larger Pip-picture part.
- Added lightweight local WebAudio tap/complete effects and a very quiet background loop with Settings toggles for effects and music.
- Brightened the game background and added uniform folder card art/spacing so folder labels and art no longer press against borders.
- Verification after this slice: node --check passed on changed JS modules; npm run test passed with 25 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; signed AAB rebuilt and jarsigner reported jar verified.

## Progress Update - 2026-06-28 v0.1.15 Review 8 Polish

- Bumped visible app version to v0.1.15 and Android release version to versionCode 8 / versionName 1.0.7.
- Replaced the remaining folder-art mural label hardcode with localized `map.parts.*` copy, so Korean mode no longer shows labels such as `Pip Ear` in English.
- Replaced `window.setTimeout` usage in audio and brand intro timing with `globalThis.setTimeout` for consistency with the rest of the browser-safe code.
- Softened early spoon-gate costs for internal testing: Sunny Spoon Sign now opens at 24 spoons, followed by 70 / 110 / 120 spoon folder gates.
- Confirmed `map.parts.*` keys already exist in both English and Korean dictionaries.
- Verification after this slice: node --check passed on changed JS modules; npm run test passed with 25 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; signed AAB rebuilt and jarsigner reported jar verified.
