# Pip's Picture Pantry - Active Context

Last updated: 2026-07-10

## Current Launch Strategy Snapshot - 2026-07-10

- Current local catalog after v0.1.239: 283 free puzzles, 193 large boards, 91 12x12 boards, 98 Village Pantry 10x10 boards, and 145 readable large-board briefs.
- Launch target is now **about 333 high-quality puzzles**, not 1,000 puzzles before release.
- The long-term 1,000+ puzzle ambition remains, but it becomes a post-launch live-service roadmap through seasonal and quarterly updates.
- Once the launch catalog nears the 333 range, prioritize total game quality over more bulk puzzle generation: Sunny Spoon/Pip art consistency, opening screen, button/UI feel, settings polish, Pip guide dialogs, Pantry story loop, Time Attack hint economy, completion effects, and mobile QA.
- Seasonal updates should preserve anticipation and freshness: spring picnic, summer fruit/cafe, autumn baking, winter cocoa/gifts, Sunny Spoon festival, or other timely cozy packs.
- Every future puzzle update still needs the same quality gate: logical solve, readable object, distinct silhouette, strong color/design concept, translated catalog copy, art-readability metadata, and automated catalog/i18n/mobile guards.

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

## Progress Update - 2026-06-28 v0.1.16 Stage / Currency Polish

- Bumped visible app version to v0.1.16 and Android release version to versionCode 9 / versionName 1.0.8.
- Removed the current continuous background oscillator from the music toggle and made music default off; tap and completion sound effects remain enabled by default.
- Reworked the visible progression language from folders to stages/scenes, while keeping the data model stable internally.
- Added a CSS spoon icon for the header balance, puzzle rewards, and unlock costs so the player-facing economy is visual rather than text-heavy.
- Added two future optional paid theme stage placeholders, while keeping spoons as an earned in-game progression currency instead of a purchasable consumable.
- Changed the roadmap and stage previews from folder art / explicit Pip-part labels into soft silhouettes that become clearer with progress.
- Cleaned Korean stage copy for consistency across the free progression stages.
- Verification after this slice: node --check passed on changed JS modules; npm run test passed with 25 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; signed AAB rebuilt and jarsigner reported jar verified.

## Progress Update - 2026-06-28 v0.1.17 Roadmap / Reward Polish

- Bumped visible app version to v0.1.17 and Android release version to versionCode 10 / versionName 1.0.9.
- Removed the confusing `5x5 - +3` reward formatting. Puzzle cards now show the size followed by a small reward token and `+3`.
- Replaced the rough spoon glyph with a warmer golden reward token that carries a small spoon mark, so the economy reads as visual currency without relying on the word spoon.
- Replaced the crude CSS circle silhouettes in stage previews and the Roadmap with the real Pip complete sticker as a ghosted target image that reveals color by progress.
- Hid the music toggle for now because the previous generated background tone did not meet the cozy quality bar. Tap and completion sound effects remain available; file-based BGM is deferred until we have a real audio asset.
- Removed the BOM character from `src/data/packs.js` after Claude review.
- Kept future bonus stage placeholders in the stage list as optional paid-theme previews, but excluded empty bonus packs from the Roadmap progression so they do not appear as 0/0 completion targets.
- Verification after this slice: node --check passed on changed JS modules; npm run test passed with 25 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; signed AAB rebuilt and jarsigner reported jar verified.

## Progress Update - 2026-06-29 v0.1.18 Badge / Future Sets Polish

- Bumped visible app version to v0.1.18 and Android release version to versionCode 11 / versionName 1.0.10.
- Added a top badge shelf: the first 100-card free roadmap now leads to a Pip Portrait badge that becomes earned when the full free set is complete.
- Added the same badge state to the Roadmap view so the 100-card completion goal has a visible pride reward, not only a revealed picture.
- Expanded future paid-theme placeholders from two to five 20-card set concepts: Cozy Cafe Room, Bakery Morning, Seasonal Pantry, Village Picnic, and Sunny Spoon Festival.
- Fixed the missing `packs.preview` i18n key so Korean no longer shows a raw translation key in bonus-stage badges.
- Changed future paid-stage copy from vague Coming Soon wording to a price-preview placeholder (`$0.99 planned` / `예상 가격 $0.99`) for later store wiring.
- Kept BGM disabled intentionally and documented `startMusic()` as a placeholder until an original looped music file is added; current SFX remains active.
- Verification after this slice: node --check passed on changed JS modules; npm run test passed with 25 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; signed AAB rebuilt and the release script requires jarsigner `jar verified` before succeeding.

## Progress Update - 2026-06-29 v0.1.19 Store-Safe Add-On Copy

- Bumped visible app version to v0.1.19 and Android release version to versionCode 12 / versionName 1.0.11.
- Replaced hardcoded `$0.99 planned` add-on text with store-safe value copy: `Optional add-on - 100 puzzles` / `선택 추가 세트 - 100개 퍼즐`.
- Changed the top badge shelf so it appears only after the first 100-card Pip Portrait badge is earned; in-progress badge tracking remains in the Roadmap view.
- Removed the residual BOM from `src/ui/appShell.js`.
- Verification after this slice: node --check passed on appShell; npm run test passed with 25 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932.

## Progress Update - 2026-06-29 v0.1.20 Retention Polish

- Bumped visible app version to v0.1.20 and Android release version to versionCode 13 / versionName 1.0.12.
- Added pack-level badge metadata for the five free progression stages and a new `src/game/badges.js` helper for earned / next badge status.
- Changed Roadmap badge progress from one large 100-card counter to the next pack badge target, giving players a shorter 20-card milestone.
- Kept the top badge shelf earned-only: it now appears only after at least one pack badge is earned, avoiding noisy 0-progress UI for new players.
- Added completion dates to saved puzzle progress and shows the completed date on finished Album cards.
- Added simple Pip strip dialogue progression based on completed-card count so Pip responds differently as the pantry fills up.
- Verification after this slice: node --check passed on changed JS modules; npm run test passed with 27 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932.

## Progress Update - 2026-06-29 v0.1.21 Stage Completion Celebration

- Bumped visible app version to v0.1.21 and Android release version to versionCode 14 / versionName 1.0.13.
- Added a one-time stage completion celebration when all 20 cards in a free progression stage are complete.
- Added `completedPackIds` to local save normalization so older saves migrate safely and completed-stage celebrations do not repeat.
- Added a short stage-complete sound effect and a Pip sticker overlay that confirms the whole stage has been saved to the Album.
- Kept the previous BGM decision unchanged: generated background music remains disabled until an original looped audio asset exists.
- Deferred large puzzle-size replacement for later content expansion because changing launched puzzle boards can disturb existing internal-test saves and balance.
- Verification after this slice: node --check passed on changed JS modules; npm run test passed with 28 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; signed AAB rebuilt and the release script requires jarsigner `jar verified` before succeeding.

## Progress Update - 2026-06-29 v0.1.22 Daily Reward Clarity

- Bumped visible app version to v0.1.22 and Android release version to versionCode 15 / versionName 1.0.14.
- Updated Today's pick reward copy so the bonus displays with the same reward token icon used elsewhere in the economy, making it clear the player receives +5 spoons/tokens.
- Kept the current Roadmap art model unchanged for this patch: the free 100-card path completes one Pip Portrait. Stage-specific preview/badge art remains a planned pre-release polish item for the next broader content pass.
- Verification after this slice: node --check passed on changed JS modules; npm run test passed with 28 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; signed AAB rebuilt and the release script requires jarsigner `jar verified` before succeeding.

## Progress Update - 2026-06-29 v0.1.23 Cozy Music Trial

- Bumped visible app version to v0.1.23 and Android release version to versionCode 16 / versionName 1.0.15.
- Added an optional WebAudio cozy music loop using a quiet 12-second C-major pattern with soft note envelopes and low bass support.
- Restored the music toggle in Settings as `Cozy music on/off` / `아늑한 음악 켜기/끄기`; music remains opt-in and does not autoplay by default.
- Kept SFX behavior unchanged and preserved the previous tap, card-complete, and stage-complete effects.
- Verification after this slice: node --check passed on changed JS modules; npm run test passed with 28 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; signed AAB rebuilt and jarsigner reported `jar verified`.

## Progress Update - 2026-06-29 v0.1.24 Roadmap Clarity

- Bumped visible app version to v0.1.24 and Android release version to versionCode 17 / versionName 1.0.16.
- Fixed Today's pick selection so it only chooses from currently unlocked/playable puzzle stages, avoiding locked daily recommendations.
- Changed Today's pick reward copy layout so the reward token and +5 stay together on the second line.
- Reworked stage previews and Roadmap cards to stop clipping Pip vertically; stage cards now show a progress meter, while the main Pip portrait becomes gradually clearer by overall 100-card progress.
- Verification after this slice: node --check passed on changed JS modules; npm run test passed with 29 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; signed AAB rebuilt and jarsigner reported `jar verified`.

## Progress Update - 2026-06-29 v0.1.25 File-Based Cozy BGM

- Bumped visible app version to v0.1.25 and Android release version to versionCode 18 / versionName 1.0.17.
- Added the provided original cozy background music file at src/assets/music/bgm-cozy.mp3.
- Replaced the temporary WebAudio generated music loop with a looped, opt-in MP3 background track at conservative volume.
- Kept music off by default and controlled through Settings, while SFX behavior remains unchanged.

## Progress Update - 2026-06-29 v0.1.26 Stage-Part Roadmap Reveal

- Bumped visible app version to v0.1.26 and Android release version to versionCode 19 / versionName 1.0.18.
- Reworked the Roadmap goal from overlapping full-image opacity to stage-specific Pip part reveals.
- Mapped the five free stages to clearer Pip portrait parts: chef hat, scarf, face, body, and picture card.
- Removed the misleading large progress stripe from Roadmap cards; progress remains in compact meters so the cards do not look like sliced images.

## Progress Update - 2026-06-30 v0.1.27 Roadmap / Stage Preview Split

- Bumped visible app version to v0.1.27 and Android release version to versionCode 20 / versionName 1.0.19.
- Clarified the visual model: the main Roadmap image is the full Pip portrait becoming clearer across 100 completed cards.
- Changed stage previews and Roadmap stage cards to show only the relevant Pip part for that stage, with compact progress meters.
- Removed broad left-to-right fill backgrounds from stage art areas so stage cards no longer look like clipped full portraits.

## Progress Update - 2026-06-30 v0.1.28 Pip Tile Roadmap

- Bumped visible app version to v0.1.28 and Android release version to versionCode 21 / versionName 1.0.20.
- Replaced semantic Pip-part cutting with a stable tile-puzzle reveal model.
- The main Roadmap now treats the first 100 free puzzles as a 10x10 Pip portrait tile board; each completed puzzle reveals one tile.
- Stage previews and Roadmap stage cards now show 20-tile mini boards instead of trying to identify character body parts.

## Progress Update - 2026-06-30 v0.1.29 Badge Shelf Simplification

- Bumped visible app version to v0.1.29 and Android release version to versionCode 22 / versionName 1.0.21.
- Removed the confusing Roadmap concept from the user-facing flow and repurposed the third tab as a Badge Shelf.
- Kept the tile-reveal style in stage previews, but each of the five free stages now uses a different target image instead of repeating Pip.
- Stage completion and the earned top badge shelf now use the matching stage badge image.
- Verification after this slice: JS syntax checks passed, unit tests passed, production build passed, mobile visual QA passed, and signed AAB was rebuilt with jarsigner verification.

## Progress Update - 2026-06-30 v0.1.30 Release Candidate Polish

- Bumped visible app version to v0.1.30 and Android release version to versionCode 23 / versionName 1.0.22.
- Replaced the nearly invisible Village Pantry stage badge art with the Story Friends image sheet so the fifth free stage has a visible target picture.
- Slightly increased unrevealed tile opacity for stage previews and locked badge cards so future badge art reads as an intentional preview instead of an empty panel.
- Verification after this slice: JS syntax checks passed, unit tests passed, production build passed, mobile visual QA passed, and signed AAB was rebuilt with jarsigner verification.

## Progress Update - 2026-06-30 v0.1.31 Launcher Icon Repair

- Bumped visible app version to v0.1.31 and Android release version to versionCode 24 / versionName 1.0.23.
- Regenerated Android launcher icon PNG resources from the Play Console 512px Pip app icon so installed tester builds should show the intended launcher icon instead of a blank/default icon.
- This is a packaging-only follow-up intended for the closed test track after the first Alpha review/install checks.
- Verification after this slice: appShell syntax check passed, production web build passed, and signed AAB was rebuilt as versionCode 24 / versionName 1.0.23.


## Progress Update - 2026-07-01 v0.1.32 Tutorial / Mystery Tile Polish

- Bumped visible app version to v0.1.32 and prepared Android release numbering as versionCode 25 / versionName 1.0.24 for the next closed-test build if this UX pass is approved.
- Reworked the first-puzzle help card into a visual-first guide: clue examples now show how 3 and 1 1 1 map onto five cells, and the action buttons are shown as short labels instead of a long ordered explanation.
- Made unrevealed stage and badge art more mysterious while keeping one peek tile visible, so players can sense a hidden picture without seeing too much of the final badge.
- Verification after this slice: node --check passed for puzzleView, appShell, and mapView; npm run build passed. Local Vite server responds at http://127.0.0.1:5173/.

- Refined the v0.1.32 first-puzzle guide copy and clue captions so 3 reads as adjacent cells and 1 1 1 reads as separated cells without relying on long numbered instructions.

## Progress Update - 2026-07-01 v0.1.33 Tutorial Label Polish

- Bumped visible app version to v0.1.33 while keeping Android release numbering at versionCode 25 / versionName 1.0.24 because the next closed-test AAB has not been uploaded yet.
- Renamed the first-puzzle help heading from the Korean `그림 칸 가이드` wording to a friendlier picture-square guide label, while keeping the visual clue examples for adjacent 3 cells and separated 1 1 1 cells.
- Verification after this slice: node --check passed for ko/en i18n and appShell; npm run build passed; signed AAB rebuilt for the next closed-test upload.
## Tester Feedback - 2026-07-01 Stage Navigation / Puzzle Size Expansion

- Closed-test feedback from a tester on the previous build: within a stage, selecting a later picture requires scrolling farther down as the stage progresses, and after entering a puzzle the view does not jump directly to the puzzle board. Returning to choose another picture can require repeated long scrolling.
- UX requirement before adding 10x10 or larger puzzles: reduce vertical travel between stage picture selection and puzzle play. Candidate solutions include a compact current-stage carousel, previous/next picture buttons, auto-scroll to the active puzzle board after selection, and a sticky mini stage selector.
- For 10x10/12x12 expansion, prioritize navigation comfort and board reachability before adding more difficult content; larger boards will make this friction more noticeable.

## Progress Update - 2026-07-01 v0.1.34 Stage Navigation Comfort

- Mode: live-candidate polish while closed testing remains active.
- Bumped visible app version to v0.1.34 for a tester-feedback UX slice.
- Added same-stage navigation inside the puzzle panel: previous picture, picture list, and next picture.
- Selecting a picture now scrolls back to the puzzle board, reducing repeated manual scrolling after choosing a lower stage puzzle.
- The picture list button scrolls to the active stage block so players can choose another picture in the same stage without hunting through the page.
- Android target for the next upload is versionCode 26 / versionName 1.0.25, pending local play review before signed AAB rebuild.
- Verification: node --check passed for appShell.js, puzzleView.js, ko.js, and en.js; npm run build passed.

## Progress Update - 2026-07-01 v0.1.35 Late-Stage 10x10 Trial

- Bumped visible app version to v0.1.35 for the next tester-facing difficulty expansion slice.
- Introduced 10x10 puzzles only in the later free stages: Bakery Window now ends with four 10x10 medium puzzles, and Village Pantry now ends with six 10x10 medium puzzles. The first three stages remain unchanged so new players still start with 5x5 and 8x8 only.
- Kept each free stage at 20 puzzles and preserved existing unlock costs. The new composition is 40 5x5 puzzles, 50 8x8 puzzles, and 10 10x10 puzzles across the 100 free puzzles.
- Adjusted board sizing so larger boards fit better on mobile before the next local UX check.
- Android target for the next upload is versionCode 27 / versionName 1.0.26, pending local play review before signed AAB rebuild.

## Direction Plan - 2026-07-02 Major Rework / Pantry Decoration Economy

- Mode: experimental direction planning; AAB uploads are paused while closed-test feedback and market research are folded into a larger product rework.
- Created `docs/MAJOR_REWORK_PLAN.md` for Claude review.
- Direction: shift the long-term loop from "spoons unlock more puzzles" toward "puzzles reveal color cards, earn spoons, and fund Pantry decoration."
- Production asset rule: stop relying on CSS-built player-facing reward art. Spoon currency, shop items, badges, opening/login images, and major reward visuals should become real PNG/WebP assets with clear placeholder-vs-production tracking.
- Badge decision: keep badges as milestone rewards, but demote them from the main goal. Pantry decoration becomes the primary meta-progression loop; badges can be displayed through Pantry/Album as pride objects.
- Added large-board strategy to the plan: 10x10/12x12/15x15+ should use a cursor/D-pad mode with row/column guides, clue highlighting, soft X guidance, sound feedback, and conservative haptic settings.


## Progress Update - 2026-07-02 v0.1.36 Experimental Rework First Slice

- Mode: experimental local-development slice; Play/AAB upload remains paused while the larger Pantry decoration rework is shaped.
- Bumped visible web app version to v0.1.36 and package version to 0.1.36 without changing Android versionCode/versionName.
- Added a completed-stage visibility toggle to the puzzle list so testers can hide finished stages while keeping completed cards in Album and earned milestones in Badges.
- Expanded the major rework plan with fast-player reward pacing: immediate puzzle rewards, stage badges, room/theme unlocks, decoration mastery, challenge rewards, and seasonal/repeatable sinks so high-engagement players do not exhaust the economy too quickly.
- Image generation for the new spoon currency asset was attempted, but generated results did not meet the requested asset direction; no bad asset was committed.


## Progress Update - 2026-07-02 v0.1.37 Pantry Decoration Skeleton

- Scope: experimental major-rework slice; Android AAB churn remains paused while the new meta loop is validated locally.
- Bumped visible web app version to v0.1.37 and package version to 0.1.37.
- Added a dedicated Pantry tab as the first playable decoration-economy skeleton: the save model now tracks owned and equipped decorations, and the UI lets players buy/place items with puzzle-earned spoons.
- Separated decoration data into src/data/decorations.js so future real PNG/WebP item assets can be added without mixing item economy with shell UI code.
- Intentional art boundary: this slice uses labeled PNG slots only. It does not ship weak CSS-made item art, because the major rework direction is to replace currency, badge, decoration, and completion art with proper generated/imported image assets.
- Next action: create/curate real spoon currency, badge, and pantry item PNG assets, then replace the placeholder slots and tune costs/reward pacing.

## Progress Update - 2026-07-02 v0.1.38 Colored Completion Rewards

- Scope: experimental major-rework slice; Play/AAB uploads remain paused while the new reward loop is validated locally.
- Bumped visible web app version to v0.1.38 and package version to 0.1.38.
- Added colored completed-puzzle rendering so finished boards and Album cards shift from single brown blocks toward warmer multi-color reward stamps.
- Added src/ui/coloredPuzzleArt.js as a deterministic color layer for existing puzzle masks. This is an interim reward polish layer, not a replacement for future real generated card artwork.
- Verification after this slice: node --check passed for albumView, boardView, coloredPuzzleArt, and puzzleView; npm run test -- --run passed; npm run build passed after removing BOM introduced during Windows patching.


## Progress Update - 2026-07-02 v0.1.39 Real Pantry Asset Pipeline

- Added project-local PNG assets for the spoon token and the first six Pantry decorations under `src/assets/icons` and `src/assets/decorations`.
- Wired Pantry decoration data to explicit `assetUrl` fields so shop cards and equipped room slots render actual image files instead of placeholder text.
- Replaced the CSS-built spoon icon with an image-backed spoon token across Pantry currency UI.
- Note: built-in image generation returned irrelevant outputs during this slice, so those generated files were not used. This version establishes the replaceable asset pipeline first; final art can now be swapped by replacing PNG files.
- Verification target: run syntax checks, unit tests, and production build after this asset wiring.


## Progress Update - 2026-07-02 v0.1.40 Global Spoon Token

- Extended the new PNG spoon token beyond Pantry into the main app shell currency display, daily reward, puzzle reward chips, and stage unlock cost UI.
- The old CSS-drawn spoon remains overridden by the v0.1.39 image-backed styles, so visible currency now uses the same asset across the app.
- This is still marked as a replaceable asset pipeline step; final currency art can be improved by swapping `src/assets/icons/spoon-token-v1.png`.
## Progress Update - 2026-07-02 v0.1.41 Startup Recovery

- Scope: recovery patch after the v0.1.40 local preview showed a blank app shell.
- Fixed the undefined `hideCompletedStages` runtime path by initializing the setting inside `renderApp()` and adding the localStorage preference helpers used by the stage filter.
- Bumped visible web app version to v0.1.41 and package version to 0.1.41 so this recovery build is distinguishable during local QA.

## Progress Update - 2026-07-02 v0.1.42 Pantry Containment

- Mode: `recovery` / containment, not feature expansion.
- Bumped visible app version to v0.1.42 and package version to 0.1.42.
- Removed the broken Pantry decoration shop surface from the playable UI because CSS/shape-like placeholder art and absolute slot placement were damaging layout quality.
- Replaced the Pantry tab with a stable holding view that preserves spoon progress and states the asset rule: Pantry rewards must use finished PNG/WebP game assets, not code-drawn placeholder items.
- Fixed the Pantry i18n block in English and Korean to remove development-facing text such as "final PNG will replace these slots" from player-facing UI.
- Next action: rebuild Pantry only after a small approved real-asset set exists: spoon currency, 2-3 decoration items, and 1-2 badge images.

## Direction Update - 2026-07-02 Floating Navigation / Pip Tutorial

- Mode: `experimental` planning; no AAB/upload target.
- Added plan direction to replace the web-like text tab row with icon-first floating navigation, starting with one bottom-right expandable menu to limit clutter and asset burden.
- Added Pip guided onboarding direction: after name entry, show 2-3 short character dialogue slides and an optional guided 5x5 demo; it should be skippable, remembered locally, and replayable from settings/help.
- Asset rule reiterated: navigation icons and tutorial character poses must use approved PNG/WebP assets, not CSS-drawn placeholder icons.
## Progress Update - 2026-07-02 v0.1.43 Asset-Gated Floating Navigation

- Mode: `experimental` shell slice; Play/AAB uploads remain paused during the larger rework.
- Bumped visible web app version to v0.1.43 and package version to 0.1.43.
- Replaced the always-visible text tab row with a bottom-right floating navigation menu so the main screen can move toward an icon-first mobile game shell.
- Important asset boundary: this slice intentionally does not add CSS-drawn navigation icons or decoration art. The floating menu currently uses text labels as conservative UI chrome until approved PNG/WebP icons exist.
- Reaffirmed the production art rule after the failed generated-image attempt: reward, currency, badge, decoration, tutorial, and menu art must be real raster assets; bad generated outputs and CSS-like placeholder art should not be wired into player-facing screens.


## Android launcher placement note - 2026-07-02

- Tester feedback: the last Android test install appeared under a system/game folder rather than directly on the home screen, and the launcher icon behavior still needs review before the next Android AAB build.
- Keep AAB generation paused during the experimental rework, but before the next tester upload verify launcher icon resources, manifest category/launcher intent behavior, and Samsung/Game Launcher style device behavior.

### v0.1.43 Follow-up - Mobile QA Tap Targets
- Raised stage navigation and completed-stage filter tap targets to 44px minimum after mobile QA found 36-38px controls.
- Re-ran npm run qa:mobile: passed for 360x740, 390x844, and 430x932.
- Re-ran npm run build: passed. No Android/AAB build was produced in this experimental asset-gate pass.

## Progress Update - 2026-07-03 v0.1.44 Asset Manifest Guard

- Mode: `experimental` art-pipeline guard; Play/AAB uploads remain paused.
- Bumped visible web app version to v0.1.44 and package version to 0.1.44.
- Added `src/data/assetManifest.js` and `npm run qa:assets` so player-facing art can be tracked as real raster assets with explicit approval status.
- The guard blocks visible placeholder/candidate art and fails if CSS pseudo-elements try to draw the spoon currency token again.
- Kept the Pantry decoration shop hidden until approved PNG/WebP assets exist; existing decoration PNGs are registered as hidden candidates only.
- Android launcher placement remains recorded for the next AAB pass, but no Android build was produced in this slice.


## Progress Update - 2026-07-03 v0.1.45 Cursor Board Controls

- Bumped visible web version to v0.1.45 for a local UX iteration only; Android AAB generation remains paused during the major rework.
- Added persistent puzzle cursor state so larger boards can support D-pad style control without relying only on direct cell taps.
- Added row/column clue and board-cell highlighting for the selected cursor position.
- Added large-board cursor controls below the existing touch controls: move selection, color selected cell, and blank-check selected cell.
- Kept this slice free of CSS-drawn art assets; the changes are interaction UI only, while player-facing decorative art remains blocked behind the asset manifest replacement plan.
- Deferred note remains: next Android release should check why some devices place the app under a game folder/Game Launcher rather than directly on the home screen.

## Progress Update - 2026-07-03 v0.1.46 Pantry Holding Copy + Recovery

- Mode: `experimental` stabilization during the major art/economy rework; Android AAB generation remains paused.
- Bumped visible web version to v0.1.46 and package version to 0.1.46.
- Recovered Korean i18n and cursor-control text after malformed strings caused a blank/unstable local screen risk.
- Replaced the player-facing Pantry placeholder/shop with a simple holding card so CSS-drawn decoration items and developer asset-rule copy are not shown to players.
- Confirmed the current image-generation attempt produced off-prompt assets, so no new generated art was wired into the app. Future currency, badge, decoration, tutorial, and menu icons must be reviewed raster assets before use.
- Deferred Android note: before the next AAB upload, verify launcher/home-screen placement and Samsung/Game Launcher behavior.

## Progress Update - 2026-07-03 v0.1.47 Player-Facing Copy Cleanup

- Mode: `experimental` stability and player-copy cleanup; Android AAB generation remains paused.
- Bumped visible web version to v0.1.47 and package version to 0.1.47.
- Removed remaining developer-facing Pantry copy from the player experience, including prototype/asset-rule wording.
- Fixed the Korean floating menu label so it renders as `메뉴` instead of mojibake.
- No new CSS-drawn art was introduced. Pantry remains a holding view until reviewed raster decoration and currency assets are ready.

## Guard Update - 2026-07-03 Asset Copy And CSS-Art Checks

- Mode: `experimental` guardrail; no Android/AAB build produced.
- Extended `npm run qa:assets` so it now also blocks likely CSS-drawn decoration/badge/menu/floating-nav art selectors and scans player i18n files for development-only copy such as prototype, asset-rule, and PNG/WebP wording.
- Added `docs/ART_ASSET_BACKLOG.md` as the working list for real raster art needed before reopening Pantry, replacing visible temporary stage/badge/currency art, and moving to icon-first navigation/tutorial screens.
- Current known acceptable warnings remain temporary visible currency and stage-reward art; these are tracked replacement targets, not final art.


## Progress Update - 2026-07-03 v0.1.48 Reward Art Gate

- Mode: `experimental` containment during the major art/economy rework; Android AAB generation remains paused.
- Bumped visible web version to v0.1.48 and package version to 0.1.48.
- Disabled reused Pip/cast stage reward art by emptying the approved stage-art map and demoting previous stage-reward entries in the asset manifest to hidden.
- Stage previews, badge shelf, badge room, and stage-complete overlay now show conservative pending-art states when no approved dedicated raster art exists, instead of broken images or recycled character art.
- The only remaining asset-manifest warning is `spoon-token-v1`, which remains visible as the current currency token but is still tracked for replacement with a better production currency asset.
- Deferred Android note remains: before the next AAB upload, verify launcher/home-screen placement and Samsung/Game Launcher behavior.
- Verification after this slice: node --check passed for changed JS/i18n modules; `npm run qa:assets` passed with only the spoon-token warning; `npm run test -- --run` passed 32 tests; `npm run build` passed; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.


## Progress Update - 2026-07-03 v0.1.49 Control Mode And Time Attack Generator

- Mode: `experimental`; Android AAB generation remains paused during the major rework.
- Bumped visible web version to v0.1.49 and package version to 0.1.49.
- Added a persistent control-mode setting: Auto, Tap cells, or D-pad. Auto keeps direct tapping for small boards and shows D-pad controls for larger boards.
- Compact D-pad/action layout so cursor controls do not collide with the selected-cell action buttons on narrow mobile screens.
- Hidden future bonus/paid pack previews from the puzzle flow while the design moves away from stage paywalls toward the Pantry decoration economy.
- Added a deterministic random puzzle generator scaffold for Time Attack. Time Attack can now use generated rule-valid puzzles rather than memorized catalog puzzles.
- The spoon currency remains the existing temporary raster asset for now; no CSS replacement art was added. A proper reviewed currency asset is still required before the next release-art pass.
- Deferred Android note remains: before the next AAB upload, verify launcher/home-screen placement and Samsung/Game Launcher behavior.

### v0.1.49 Follow-up - Control Mode Startup Recovery

- Fixed a startup regression in the experimental control-mode slice: `controlMode` preference state and helpers are now initialized inside `renderApp()` so the app no longer renders a blank screen on local boot.
- Re-ran local runtime smoke in Playwright; the app shell renders and the brand intro reaches the game stage.
- Re-ran verification after the recovery: `node --check src\ui\appShell.js`, `npm run test -- --run`, `npm run build`, `npm run qa:assets`, and `npm run qa:mobile` all passed. `qa:assets` still reports the expected temporary spoon-token replacement warning.
- No Android/AAB build was produced; this remains an experimental local-development slice.


## Progress Update - 2026-07-03 v0.1.50 Focused Puzzle Shell

- Mode: `experimental`; Android AAB generation and Play upload work remain paused during the major UX/art rework.
- Bumped visible web version to v0.1.50 and package version to 0.1.50.
- Split puzzle solving into a focused play screen with its own header and back-to-list action, so larger boards and D-pad controls can use more vertical space.
- The main Puzzle tab now behaves as a picture-selection hub instead of embedding the full board inline with the stage list.
- Kept Pantry decoration and new reward art gated: no new CSS-drawn player-facing art was introduced in this slice. Real PNG/WebP assets are still required before reopening the decoration economy.
- Deferred Android note remains: before the next AAB upload, verify launcher/home-screen placement and Samsung/Game Launcher behavior.


## Progress Update - 2026-07-03 v0.1.51 Cursor Layout Polish

- Mode: `experimental`; Android AAB generation and Play uploads remain paused during the major UX/art rework.
- Bumped visible web version to v0.1.51 and package version to 0.1.51.
- Tightened the focused puzzle D-pad layout so move buttons and selected-cell actions no longer collide on narrow screens.
- Action buttons now wrap safely and the D-pad scales down on small widths, preserving the focused puzzle-screen direction for larger boards and future Time Attack.
- Kept the art gate intact: no new CSS-drawn player-facing art was introduced. Pantry decoration, menu art, badge art, and final currency art still require reviewed raster assets before release use.
- Fixed the focused play-screen size label so it no longer risks mojibake display.
- Verification: `node --check src\ui\appShell.js`, `node --check src\ui\puzzleView.js`, `npm run test -- --run`, `npm run build`, `npm run qa:assets`, and `npm run qa:mobile` all passed. `qa:assets` still reports only the expected temporary spoon-token replacement warning.

## Progress Update - 2026-07-03 v0.1.52 Focused Play Text Safety

- Mode: `experimental`; Android AAB generation and Play uploads remain paused while the major UX/art rework continues in local web first.
- Bumped visible web version to v0.1.52 and package version to 0.1.52.
- Fixed the focused play-screen puzzle size label in code to use a stable ASCII `5x5` style label, removing the remaining mojibake path in the play header.
- Reconfirmed the current art gate: Pantry decoration, badge art, menu icons, and the final spoon/currency must remain behind real raster assets. No new CSS-drawn player-facing art should be added.
- Next action: continue the focused puzzle screen, larger-board controls, Time Attack random puzzle structure, and raster-asset pipeline without building a new AAB until local UX is reviewed.

## Progress Update - 2026-07-03 v0.1.53 Cursor Control Containment

- Mode: `experimental`; Android AAB generation and Play uploads remain paused while the major UX/art rework continues locally first.
- Bumped visible web version to v0.1.53 and package version to 0.1.53.
- Tightened the focused puzzle D-pad control layout again after narrow-screen feedback: the D-pad is smaller, action labels use safer sizing, and screens under 380px stack the D-pad above the two action buttons to prevent overlap.
- Kept the existing control-mode setting direction: Auto, Tap cells, and D-pad remain the planned choices for direct-touch vs cursor play.
- Reconfirmed the art boundary after failed/off-prompt image generation attempts: no newly generated off-prompt or CSS-drawn player-facing art is wired into the app. Pantry decoration, menu icons, badge art, and final currency art remain gated behind reviewed raster assets.
- Deferred Android note remains: before the next AAB upload, verify launcher/home-screen placement and Samsung/Game Launcher behavior.

## Progress Update - 2026-07-04 v0.1.54 Economy Foundation

- Mode: `experimental`; no Android AAB was produced and Play uploads remain paused while the major economy/art/UX rework continues locally first.
- Bumped visible web version to v0.1.54 and package version to 0.1.54.
- Added `src/data/economyConfig.js` as the central economy configuration for puzzle rewards, stage completion bonuses, daily bonus, Time Attack rewards, record bonus, daily Time Attack limit, and future Cozy Pass spoon grant.
- Stage completion now grants a one-time stage bonus through `markPackCompletedIfFirst(pack)` and shows that bonus in the stage-complete overlay when earned.
- Daily recommendation bonus now reads from the shared economy config instead of a local magic number.
- Added Time Attack save/reward hooks (`recordTimeAttackResult`, best scores, daily counts) so the later seeded-random Time Attack mode can reward spoons and preserve personal records without wiring the UI yet.
- Updated starter and free pack metadata with size, unlock cost, and stage bonus values from the economy spec. This is foundation data only; the broader plan still moves monetization pressure toward Pantry decoration rather than harsh puzzle locking.
- Claude economy consultation has been considered: long-term retention needs many more puzzles, repeated Pantry expansion, Time Attack as a renewable challenge/reward source, and purchase options that accelerate decoration rather than replace play. These remain planned implementation work, not completed UI.
- The art gate remains strict: no new CSS-drawn player-facing decoration, badge, menu, or currency art was added. The current spoon token is still a temporary visible raster asset and must be replaced by reviewed production art.
- Verification: `node --check` passed for changed JS modules, `npm run test -- --run` passed 36 tests, `npm run build` passed, `npm run qa:assets` passed with only the expected temporary spoon-token warning, and `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.


## Progress Update - 2026-07-04 v0.1.55 Pantry Art Approval Gate

- Mode: `experimental`; no Android AAB was produced and Play uploads remain paused while the major economy/art/UX rework continues locally first.
- Bumped visible web version to v0.1.55 and package version to 0.1.55.
- Added an explicit asset approval gate for Pantry decorations: `src/data/assetManifest.js` now exposes asset lookup/approval helpers, and every Pantry decoration is tied to an `assetId` that must be an approved visible `pantry-decoration` raster asset before it can be used.
- Updated save-layer behavior so `buyDecoration()` and `equipDecoration()` reject decoration records whose art is not approved. This prevents temporary CSS-style or candidate decoration art from becoming a real purchase/equip reward.
- Kept the Pantry feature intentionally paused in the UI. It now explains the future reward loop with text only: solve puzzles, earn spoons, finish stages, then decorate once reviewed item art is ready.
- Updated save tests to lock this behavior: candidate Pantry items cannot be bought or equipped until approved.
- Claude economy consultation has been read and folded into next actions: before reopening Pantry, Codex needs to settle the launch puzzle volume/size mix, Pantry room-1 slot and item counts, room expansion cadence, daily puzzle pool size, and whether repeat puzzle clears should ever pay a small long-tail reward.
- The art gate remains strict: no new CSS-drawn player-facing decoration, badge, menu, or currency art should be added. The current spoon token is still a temporary visible raster asset and must be replaced by reviewed production art.
- Deferred Android note remains: before the next AAB upload, verify launcher/home-screen placement and Samsung/Game Launcher behavior.
- Verification: `node --check` passed for changed JS/i18n modules, `npm run test -- --run` passed 36 tests, `npm run build` passed, `npm run qa:assets` passed with only the expected temporary spoon-token warning, and `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.



## Progress Update - 2026-07-04 v0.1.56 Large-Board Control Stabilization

- Mode: `experimental`; no Android AAB was produced. Closed-test uploads remain paused while the local major UX/economy/art rework continues.
- Bumped visible web version to v0.1.56 and package version to 0.1.56.
- Tightened the large-board cursor control layout so the D-pad and action buttons no longer overlap on narrow mobile widths. Cursor actions now use shorter copy and responsive button sizing.
- Updated cursor guide copy to focus on the actual interaction: move with arrows, then choose color or blank.
- Added design decisions from the latest playtest and market review to the active rework plan: undo should remain free; larger boards should use limited hint bulbs instead of undo limits; Time Attack should use generated random nonogram boards; Pantry should progress through rooms/floors with purchase reveal effects; and all player-facing reward/menu/currency/decoration art must be real reviewed raster assets, not CSS compositions.
- Deferred Android note remains: before the next AAB upload, verify launcher/home-screen placement and Samsung/Game Launcher behavior.

## Progress Update - 2026-07-04 v0.1.57 Hint-Bulb Rule Baseline

Mode: experimental gameplay rework. No Android AAB was produced.

Changes made:
- Added the first large-board hint rule: 10x10+ puzzles can expose a limited hint action instead of restricting undo.
- Hint use fills one correct unresolved cell first, then marks a definite blank if no fill target remains.
- Hint use is saved/restored with puzzle state and undo restores the hint count when undoing a hinted move.
- Added a simple text-only hint panel for now. The final bulb icon/effect must use reviewed raster art, not CSS-drawn art.

Decisions captured from Nyan Tower benchmark:
- Purchase/equip should eventually use a dimmed reveal scene, name banner, item spotlight, and placement animation.
- Pantry should become a multi-room or floor-like long-term progression surface, with decorations as the primary spoon sink.
- Larger boards should use direct touch or D-pad controls with line highlights, a selected square, and limited hints. Undo should remain forgiving.
- Time Attack should use seeded generated boards, not only existing catalog puzzles, so memorization does not break the mode.

Next actions:
- Build dedicated full-screen puzzle play surface so 12x12/15x15 boards have enough room.
- Replace hint button, floating menu, currency, decoration, badge, and tutorial visuals with approved raster art assets only.
- Add purchase/equip reveal animation after the Pantry art set is ready.

## Progress Update - 2026-07-04 v0.1.58 Cursor Control Containment And Pantry Art Gate

Mode: experimental local UX pass. No AAB was generated for this slice.

Changes:
- Bumped the visible/local version to v0.1.58.
- Added a final containment layer for cursor/D-pad controls so arrow keys and action buttons do not overlap on narrow play panels.
- Confirmed settings already expose Auto, direct tap, and D-pad control modes.
- Removed the default starter decoration from normalized save data so unapproved Pantry art cannot reappear through old default state.
- Reconfirmed the Pantry room remains paused until reviewed raster decoration assets are available. CSS/DOM-drawn decoration art must not be shown to players.

Context from Claude economy consultation:
- Long-tail spoon demand should come from Pantry decoration and expansion, not from blocking basic puzzle play.
- Fast players need renewable goals: daily puzzle pools, Time Attack records, room/floor expansion, and future decoration sets.
- Time Attack should use seeded/generated boards so memorized catalog puzzles do not undermine the mode.

Next actions:
- Build the focused puzzle screen as the primary large-board surface.
- Add generated Time Attack puzzle flow and local records.
- Replace temporary currency, badge, menu, tutorial, and Pantry visuals with approved raster assets before reopening Pantry.

### v0.1.58 Follow-up - Candidate Decoration Bundle Gate
- Removed direct runtime imports for hidden candidate Pantry decoration PNGs from src/data/decorations.js.
- Candidate decoration records remain in the asset manifest as backlog metadata only; they are not bundled or exposed until an asset is explicitly approved and made visible.
- This keeps the major-rework art rule intact: no player-facing Pantry/currency/badge/menu/tutorial reward art should ship from CSS placeholders or unapproved candidate images.

## Progress Update - 2026-07-04 v0.1.59 Time Attack Skeleton

Mode: experimental local gameplay rework. No Android AAB was generated.

Changes:
- Bumped the visible/local web version to v0.1.59 and package version to 0.1.59.
- Added a first Time Attack hub to the floating navigation. This starts a 3-round generated puzzle run, returns to the hub when the run ends, and records local best-run data.
- Kept Time Attack as a prototype shell for now: final timer pressure, leaderboard UX, reward tuning, and mode-specific art are still planned work.
- Reconfirmed the art rule after the Pantry/CSS-art regression: player-facing currency, decoration, badge, menu, reward, and tutorial visuals must use reviewed raster assets or remain text/hidden.
- Deferred Android note remains: before the next AAB upload, verify launcher/home-screen placement and Samsung/Game Launcher behavior.

Next actions:
- Move puzzle solving into a stronger focused play surface for large boards and Time Attack.
- Replace menu/currency/badge/tutorial/Pantry visuals with real approved raster assets.
- Add line-highlighting, selected-cell feedback, hint-bulb UX, and generated-board difficulty progression.



## Progress Update - 2026-07-04 v0.1.60 Cursor Feedback And Control Containment

- Kept this as experimental local rework only; no Android AAB was built for this pass.
- Bumped the visible/local web version to v0.1.60 and package version to 0.1.60.
- Added conservative cursor-control feedback: D-pad movement plays a light tick, while Color/Blank actions play a slightly stronger tick plus a very short haptic pulse when available.
- Tightened the cursor-control layout so the D-pad and selected-cell action buttons stay inside the puzzle panel on narrow screens.
- Reconfirmed the art rule for the major rework: visible reward/menu/currency/decoration art should come from real raster assets, not CSS-composed placeholder drawings.
- Deferred Android launcher behavior check: on the next Android build, verify whether Samsung/Game Launcher settings or manifest/category choices cause the app to appear only in a game folder instead of the normal home/app drawer path.

Next action:
- Continue focused play-screen polish, larger-board usability, Pantry raster-art pipeline, and generated Time Attack progression before producing another Android bundle.

## Progress Update - 2026-07-04 v0.1.61 Badge Art Gate Tightening
- Bumped the visible/local web version to v0.1.61 and package version to 0.1.61.
- Tightened the badge room art gate: badge cards no longer reuse stage preview art or CSS-tile mosaics as badge visuals. Until dedicated approved raster badge PNG assets exist, badge cards show the art-pending state only.
- Kept stage preview tile rendering gated behind `stageArt.js`; because no approved stage art is registered there yet, no reused stage artwork is exposed by default.
- This remains an experimental local rework slice only. Android AAB generation stays paused until the new art/economy/control direction is stable.


## Progress Update - 2026-07-04 v0.1.62 Cursor Control Layout Stabilization

- Mode: experimental local-development slice; Play/AAB upload remains paused during the major rework.
- Bumped visible web version to v0.1.62 and package version to 0.1.62.
- Tightened D-pad cursor controls so the direction pad and selected-cell action buttons do not overlap in narrow puzzle panels.
- Kept the existing Settings control-mode path intact: auto for big boards, direct tap, or D-pad mode.
- Reconfirmed the art boundary after another off-prompt image-generation attempt: bad generated images and CSS/DOM-drawn reward/menu/pantry/currency art must not be wired into player-facing screens.
- Next action: continue the focused puzzle-screen and large-board pass, then replace temporary currency/menu/badge visuals only with reviewed raster PNG/WebP assets.

### v0.1.63 - Soft Line Completion Guidance
- Added cursor-mode visual guidance: when the active row or column already has the clue-required number of filled cells, remaining empty cells in that line show a pale X suggestion.
- This is UI-only guidance and does not mutate puzzle state, preserving player agency while reducing friction on 10x10+ boards.
- Continued art policy: no new CSS-drawn player-facing art; decoration/art reward work remains gated until real raster assets are ready.

### v0.1.64 - Focused Puzzle Keyboard Controls

- Added keyboard support to the focused puzzle surface in cursor mode: arrow keys move the selected square, Space/Enter colors it, X/Backspace/Delete marks a blank, and Ctrl/Cmd+Z undoes the last move.
- Added tap feedback for direct board cell selection so both touch and cursor control paths provide immediate game feel.
- Preserved the no-new-CSS-art rule: this slice only changes interaction behavior and copy; raster art replacement remains a separate asset pipeline task.
- Verification: `node --check src\ui\puzzleView.js` and `npm run test -- --run` passed.
- Next action: continue focused play-screen polish for larger boards, hint UX, Time Attack pacing, and reviewed raster assets before any new Android bundle.


### v0.1.65 - Time Attack Timer And Scoring
- Added elapsed-time tracking to the experimental Time Attack run and saved local records with elapsed seconds plus a score derived from completed rounds and speed bonus.
- Time Attack remains local/experimental and continues to use generated puzzles rather than catalog puzzles.
- Verification: node syntax checks, unit tests, and production build passed before the v0.1.66 layout follow-up.

### v0.1.66 - Cursor Control Containment Follow-up
- Bumped the visible/local web version to v0.1.66 and package version to 0.1.66.
- Added the missing Time Attack timer readout to the focused play header.
- Added a final layout containment layer for D-pad controls so the direction pad and selected-cell action buttons fit inside narrow puzzle panels without overlapping.
- This remains experimental local rework only. No Android AAB was produced.

### v0.1.67 - Larger-board Hint Affordance
- Bumped the visible web version to v0.1.67 and package version to 0.1.67.
- Improved the larger-board hint panel so players can see used/available hints, understand that hints solve one sure square, and know undo remains free.
- Kept the hint visual as text/chrome only for now. Final bulb icon/effect still requires approved raster PNG/WebP art, per the no CSS player-art rule.
- Android AAB work remains paused during the experimental gameplay rework.

### v0.1.68 - Focused Play Settings Access
- Bumped the visible/local web version to v0.1.68 and package version to 0.1.68.
- Added a Settings button directly to the focused puzzle header so players can switch Auto, Tap cells, and D-pad modes without leaving the play surface.
- Added narrow-screen header containment for the new focused-play Settings button so the title, size chip, and controls do not overlap on mobile widths.
- Repaired Korean focused-play and Time Attack strings that could break syntax or show stale timer/score copy.
- This remains an experimental local rework slice. No Android AAB was generated, and no new CSS/DOM-drawn player-facing art was added.

### v0.1.69 - Focused Play Module Extraction
- Bumped the visible/local web version to v0.1.69 and package version to 0.1.69.
- Extracted the focused puzzle play surface from `src/ui/appShell.js` into `src/ui/playScreen.js` so appShell can stay closer to routing/state orchestration instead of absorbing more UI surface code.
- Kept the v0.1.68 focused-play Settings access, Time Attack timer header, daily bonus handling, and stage navigation behavior intact through the new module boundary.
- This is an experimental structural-containment slice only. No Android AAB was generated, and no new player-facing art was added.

### v0.1.70 - Puzzle Hub And Stage List Extraction
- Bumped the visible/local web version to v0.1.70 and package version to 0.1.70.
- Extracted the current-picture hub and stage/puzzle picker surface from `src/ui/appShell.js` into `src/ui/puzzleHubView.js`.
- Kept stage filtering, unlock cost display, approved-stage-art gating, art-pending fallback, and spoon reward chips intact through the new module boundary.
- This continues the experimental structural-containment pass. No Android AAB was generated, and no new CSS/DOM-drawn player-facing art was added.

### v0.1.71 - Completion Banner Routing Check
- Bumped the visible/local web version to v0.1.71 and package version to 0.1.71.
- Confirmed the completion screen is intentionally user-paced: after a card is complete, the preview waits for the player to choose Album or Next Picture instead of auto-advancing.
- Restored the focused-play completion `Album` route by passing the album-view callback through `playScreen.js`; `Next Picture` remains connected to the existing next-puzzle flow.
- Browser automation was blocked by the Windows sandbox ACL issue during this check, so verification used syntax checks, unit tests, production build, asset QA, and mobile visual QA.
- No Android AAB was generated, and no new player-facing art was added.

### v0.1.72 - Settings Dialog Extraction
- Bumped the visible/local web version to v0.1.72 and package version to 0.1.72.
- Extracted the Settings dialog from `src/ui/appShell.js` into `src/ui/settingsView.js`, keeping language, player name, sound, music, and control-mode settings intact.
- Removed the unused legacy view-tabs function from appShell now that floating navigation owns the main app navigation surface.
- This continues the experimental structural-containment pass. No Android AAB was generated, and no new player-facing art was added.

### v0.1.73 - App Chrome Extraction
- Bumped the visible/local web version to v0.1.73 and package version to 0.1.73.
- Extracted shared app chrome from `src/ui/appShell.js` into `src/ui/appChrome.js`: header, footer, Pip strip, earned badge shelf, reset dialog, and shared spoon icon rendering.
- Kept the existing real raster spoon asset path and badge art-pending fallback intact; no CSS/DOM-drawn player-facing art was added.
- This continues the experimental structural-containment pass. No Android AAB was generated.

### v0.1.74 - UI Preference Module Extraction
- Bumped the visible/local web version to v0.1.74 and package version to 0.1.74.
- Extracted local UI preference helpers from `src/ui/appShell.js` into `src/ui/preferences.js`, including completed-stage visibility and control-mode persistence.
- This creates a small home for future onboarding/tutorial/settings flags without growing appShell again.
- This continues the experimental structural-containment pass. No Android AAB was generated, and no new player-facing art was added.

### v0.1.75 - Daily Card And Stage Navigation Extraction
- Bumped the visible/local web version to v0.1.75 and package version to 0.1.75.
- Moved the Daily picture card renderer and stage-navigation model helper from `src/ui/appShell.js` into `src/ui/puzzleHubView.js`.
- This keeps puzzle-list and puzzle-hub UI together while leaving appShell focused on app state, view routing, and mode transitions.
- This continues the experimental structural-containment pass. No Android AAB was generated, and no new player-facing art was added.

### v0.1.76 - Time Attack Flow Extraction
- Bumped the visible/local web version to v0.1.76 and package version to 0.1.76.
- Extracted Time Attack session creation, round advancement, result scoring, and elapsed-time calculation into `src/ui/timeAttackFlow.js`.
- Kept appShell responsible for view routing and active puzzle assignment while moving Time Attack rules out of the shell.
- This continues the experimental structural-containment pass. No Android AAB was generated, and no new player-facing art was added.

### v0.1.77 - Time Attack Hub Expansion
- Bumped the visible/local web version to v0.1.77 and package version to 0.1.77.
- Expanded the Time Attack hub with compact summary cards for run plan, daily reward status, best run, richer record rows, and a last-result panel after a run.
- Saved Time Attack result metadata now returns score and elapsed seconds so the hub can show the just-finished run without recalculating UI state.
- This remains local experimental gameplay polish. No Android AAB was generated, and no new player-facing art was added.
- Verification: unit tests, production build, asset manifest QA, mobile visual QA, and local dev-server HTTP check passed.

### v0.1.78 - Puzzle Assist View Extraction
- Bumped the visible/local web version to v0.1.78 and package version to 0.1.78.
- Extracted the how-to-play visual guide, larger-board hint panel, hint limit rules, and mark-mode hint into `src/ui/puzzleAssistView.js`.
- Kept `src/ui/puzzleView.js` focused on puzzle state, board rendering, controls, cursor movement, progress, and completion flow.
- This creates a contained module for future tutorial/onboarding and hint UX expansion without growing the main puzzle surface file.
- This remains a local experimental structural slice. No Android AAB was generated, and no new player-facing art was added.
- Verification: syntax checks, unit tests, production build, asset manifest QA, mobile visual QA, and local dev-server HTTP check passed.

### v0.1.79 - Puzzle Cursor Controls Extraction
- Bumped the visible/local web version to v0.1.79 and package version to 0.1.79.
- Extracted larger-board cursor mode decisions, D-pad rendering, selected-cell movement, and selected-cell fill/mark actions into `src/ui/puzzleCursorControls.js`.
- Kept keyboard routing in `src/ui/puzzleView.js` while moving cursor-specific behavior and UI into a focused module for future large-board control polish.
- This remains a local experimental structural slice. No Android AAB was generated, and no new player-facing art was added.
- Verification: syntax checks, unit tests, production build, asset manifest QA, mobile visual QA, and local dev-server HTTP check passed.

### v0.1.80 - Pip Guided Dialogue Onboarding
- Bumped the visible/local web version to v0.1.80 and package version to 0.1.80.
- Added `src/ui/guideDialog.js`, a Pip-led raster-art dialogue overlay for first-time puzzle guidance and first-time Time Attack guidance.
- Generated and registered `src/assets/characters/pip-guide-scene-v1.png` as approved visible guide art in the asset manifest, keeping the guide player-facing art raster-backed instead of CSS/DOM-drawn.
- Added local save tracking for seen guide IDs so puzzle and Time Attack guides are remembered per player profile.
- Updated mobile visual QA to verify the guide dialog/art and dismiss it during first-run checks.
- Note: the current guide art is visually suitable but large at about 2.1 MB in the production bundle; next polish should downscale/convert it to WebP after visual approval.
- Verification: syntax checks, unit tests, production build, asset manifest QA, mobile visual QA, and local dev-server HTTP check passed. Browser automation through the in-app browser plugin remained blocked by the Windows ACL issue, so verification used script-based Playwright/mobile QA instead.
- This remains local experimental gameplay/onboarding polish. No Android AAB was generated.

### v0.1.81 - Pip Character Continuity Correction
- Bumped the visible/local web version to v0.1.81 and package version to 0.1.81.
- Corrected the v0.1.80 guide art decision after user review: `pip-guide-scene-v1.png` was cute but not Pip, so it is now marked `rejected`, hidden from visible UI, and labeled `rejected-wrong-character` in the asset manifest.
- Switched the guide dialog back to established Sunny Spoon/Pip baseline raster art (`pip-cast-redesign-concept-v1-web.jpg`) via the approved `pip-cast-redesign-concept-v1-web-guide` manifest record.
- Added a Character Continuity Gate to `docs/ART_DIRECTION.md`: new character art must preserve Pip's approved chef-hat/scarf/capybara-helper identity and be checked against `CHARACTER_IP_BIBLE.md`, `src/data/characterIdentity.js`, and baseline assets before visible UI wiring.
- Strengthened `scripts/asset_manifest_check.js` so visible rejected identity assets fail QA and visible guide/reward character art must carry an approved Sunny Spoon continuity status.
- Verification: unit tests, production build, asset manifest QA, and mobile visual QA passed. The rejected guide image is no longer included in the production bundle.
- This remains a local experimental art-governance correction. No Android AAB was generated.

### v0.1.82 - Art Cohesion Reset Start
- Bumped the visible/local web version to v0.1.82 and package version to 0.1.82.
- Removed the inconsistent cast-sheet collage from the opening game identity screen. The first screen now avoids mixing the app-icon Pip with unrelated legacy/generated character-sheet art until a coherent Sunny Spoon/Pip key visual is approved.
- Added `docs/ART_REWORK_ROADMAP.md` as the art-system reset plan for a unified premium cozy Sunny Spoon Studios look across app icon, opening screen, guide dialogs, spoon currency, completion effects, badges, Pantry decorations, and navigation icons.
- Expanded `docs/ART_DIRECTION.md` with the whole-app art cohesion reset: the quality target is extreme cozy/cute polish with one consistent Pip identity, not convenient reuse of existing images.
- Updated mobile visual QA to fail if the old `.brand-intro__cast` image returns to the opening screen.
- Verification: unit tests, production build, asset manifest QA, mobile visual QA, and local dev-server HTTP check passed.
- This remains a local experimental art-direction reset. No Android AAB was generated.

### v0.1.83 - Runtime Art Import Guard
- Bumped the visible/local web version to v0.1.83 and package version to 0.1.83.
- Strengthened `scripts/asset_manifest_check.js` so candidate/rejected/hidden-only asset paths fail QA if they are referenced by runtime source files.
- Added explicit manifest records for currently visible temporary Pip chrome and completion art: `pip-strip-sticker-v1-chrome` and `pip-complete-sticker-v1-completion`. These are allowed only as tracked temporary baseline debt and must be replaced during the coordinated Pip master art pass.
- Removed stale `.brand-intro__cast` CSS now that the inconsistent opening cast-sheet image is intentionally gone.
- Current art debt warnings are now explicit: spoon token, Pip strip/chrome, and Pip completion reaction all remain visible temporary assets to replace in the art reset.
- Verification: unit tests, production build, asset manifest QA, and mobile visual QA passed.
- This remains a local experimental art-pipeline hardening slice. No Android AAB was generated.

### v0.1.84 - Pip Master Art Candidate Intake
- Bumped the visible/local web version to v0.1.84 and package version to 0.1.84.
- Generated `src/assets/characters/pip-master-key-candidate-v1.png` as a first master Pip key visual candidate for the coordinated art reset.
- Registered the new image in `src/data/assetManifest.js` as `candidate`, `visible: false`, with `identityStatus: candidate-needs-character-review`; it is not wired into runtime UI.
- Added `docs/PIP_MASTER_ART_REVIEW.md` to record the candidate prompt intent, positives, and review concerns before any approval. Main concern: verify it does not drift toward a generic bear and can actually become the one consistent Pip style.
- Confirmed the candidate and the rejected guide scene do not enter the production bundle; only manifest audit references remain.
- Verification: asset manifest QA, production build, unit tests, mobile visual QA, and local dev-server HTTP check passed.
- This remains a local experimental art-candidate intake slice. No Android AAB was generated.

### v0.1.85 - Pip Master Art Review Board
- Bumped the visible/local web version to v0.1.85 and package version to 0.1.85.
- Added `docs/art-review/pip-master-review-v1.html` as a docs-only comparison board for current Pip baselines, rejected drift, and the hidden master candidate.
- Linked the board from `docs/PIP_MASTER_ART_REVIEW.md` so future art decisions compare against the same Pip identity criteria before runtime wiring.
- Kept the master candidate hidden and manifest-gated; no new player-facing character art was added in this slice.

### v0.1.86 - Korean Guide Copy Repair
- Bumped the visible/local web version to v0.1.86 and package version to 0.1.86.
- Repaired mojibake in Korean Pip guide dialog copy and large-board hint copy so first-run puzzle guidance, Time Attack guidance, and hint labels render as readable Korean.
- Added an i18n regression test that checks Korean guide/hint strings do not contain common mojibake markers.
- Kept the art master candidate hidden and manifest-gated; this slice changed copy quality, not visible character art.

### v0.1.87 - Time Attack Save Retention
- Bumped the visible/local web version to v0.1.87 and package version to 0.1.87.
- Addressed Claude Review 18's minor save-growth note by pruning `timeAttackDailyCount` to recent valid date keys during save normalization.
- Added save regression coverage so stale Time Attack daily-count keys and malformed date keys are removed while recent counts remain.
- Confirmed Claude Review 18's `createSpoonIcon` concern is already safe in `puzzleHubView.js` because the helper is local to that module and uses the raster spoon token.
- No Android AAB was generated; this remains an experimental local save-hygiene slice.

### v0.1.88 - Art-Gated Guide And Pantry QA
- Bumped the visible/local web version to v0.1.88 and package version to 0.1.88.
- Guarded `guideDialog.js` guide art rendering with the asset manifest approval check instead of relying only on a direct raster import.
- Strengthened `npm run qa:assets` so Pantry remains visibly paused and cannot expose shop/equip UI while there are no approved visible pantry-decoration assets.
- This addresses Claude Review 18's guide-art and Pantry placeholder concerns without exposing unapproved decoration art.
- No Android AAB was generated; this remains an experimental art-gate hardening slice.

### v0.1.89 - Spoon Token Candidate Intake
- Bumped the visible/local web version to v0.1.89 and package version to 0.1.89.
- Generated a new transparent golden spoon currency candidate at `src/assets/icons/spoon-token-candidate-v2.png` using built-in image generation plus local chroma-key removal.
- Registered `spoon-token-candidate-v2` in `src/data/assetManifest.js` as hidden `candidate` currency art; the live UI still uses the existing temporary `spoon-token-v1`.
- Added `docs/SPOON_TOKEN_ART_REVIEW.md` with prompt intent, technical validation, and the approval rule before any UI replacement.
- No Android AAB was generated; this remains an experimental art-candidate intake slice.

### v0.1.90 - Runtime Manifest Isolation
- Bumped the visible/local web version to v0.1.90 and package version to 0.1.90.
- Moved guide and Pantry decoration runtime approval from full `assetManifest.js` registry imports to a small `src/data/runtimeArt.js` allowlist so hidden candidate asset records do not get bundled into production JS.
- Strengthened `npm run qa:assets` to fail if runtime files import `assetManifest.js` directly.
- Confirmed the new spoon candidate remains a hidden review asset and the live UI still uses `spoon-token-v1`.
- No Android AAB was generated; this remains an experimental art-pipeline hardening slice.

### v0.1.91 - Approved Spoon Token Runtime Swap
- Bumped the visible/local web version to v0.1.91 and package version to 0.1.91.
- Promoted the user-approved golden spoon candidate into optimized runtime art at `src/assets/icons/spoon-token-v2.png` after downscaling to 256x256 transparent RGBA.
- Switched header currency, daily reward, puzzle reward, stage unlock, and stage-complete bonus icon imports from `spoon-token-v1` to `spoon-token-v2`.
- Updated `src/data/assetManifest.js` so `spoon-token-v2` is approved visible currency art, while `spoon-token-v1` is hidden legacy audit art and `spoon-token-candidate-v2` is archived candidate source.
- Updated `docs/SPOON_TOKEN_ART_REVIEW.md` with the approval note and runtime asset details.
- No Android AAB was generated; this remains an experimental art-polish slice.


### v0.1.92 - Pip Chrome And Completion Candidate Intake
- Bumped the visible/local web version to v0.1.92 and package version to 0.1.92.
- Generated two new transparent Pip candidate assets for the coordinated character reset: `src/assets/characters/pip-chrome-candidate-v2.png` and `src/assets/characters/pip-completion-candidate-v2.png`.
- Registered both assets in `src/data/assetManifest.js` as hidden candidates with `identityStatus: candidate-needs-character-review`; neither is wired into runtime UI.
- Updated `docs/PIP_MASTER_ART_REVIEW.md` and `docs/art-review/pip-master-review-v1.html` so the current baselines, rejected drift, master candidate, chrome candidate, and completion candidate can be compared together before approval.
- Updated `docs/ART_ASSET_BACKLOG.md` to mark the spoon token replacement complete and add the active Pip character candidate queue.
- No Android AAB was generated; this remains an experimental art-candidate intake slice.


### v0.1.93 - First Stage Reward Candidate Intake
- Bumped the visible/local web version to v0.1.93 and package version to 0.1.93.
- Generated and saved the first free-stage reward style sample at `src/assets/stage-rewards/pips-first-shelf-reward-candidate-v1.png`.
- Registered the reward art in `src/data/assetManifest.js` as a hidden `stage-reward-art-candidate`; `src/data/stageArt.js` remains empty, so no new runtime reward art is visible yet.
- Added `docs/STAGE_REWARD_ART_REVIEW.md` and `docs/art-review/stage-reward-review-v1.html` for review before approving any stage reward art.
- No Android AAB was generated; this remains an experimental art-candidate intake slice.


### v0.1.94 - Approved Art Runtime Promotion
- Bumped the visible/local web version to v0.1.94 and package version to 0.1.94.
- Treated the newly generated high-polish art level as approved per user direction unless a specific correction is requested.
- Optimized and promoted Pip chrome, Pip completion reaction, and the first free-stage reward candidate into runtime assets: `pip-chrome-v2.png`, `pip-completion-v2.png`, and `pips-first-shelf-reward-v1.webp`.
- Switched `appChrome.js`, `pipReaction.js`, and `stageArt.js` to use the approved runtime assets while keeping candidate/source files archived in the manifest.
- Updated `src/data/assetManifest.js` so the old visible temporary Pip chrome/completion records are hidden legacy audit assets and the new assets are approved visible art.
- No Android AAB was generated; this remains an experimental art-runtime promotion slice.


### v0.1.95 - Free Stage Reward Art Set
- Bumped the visible/local web version to v0.1.95 and package version to 0.1.95.
- Generated, optimized, registered, and wired approved reward art for the remaining four free progression stages: Sunny Spoon Sign, Apron Drawer, Bakery Window, and Village Pantry.
- Updated `src/data/stageArt.js` so all five free stage packs now have approved runtime reward art.
- Added source PNG archive records and optimized WebP runtime records to `src/data/assetManifest.js`.
- Updated stage reward review/backlog docs to mark the free-stage reward art set complete.
- No Android AAB was generated; this remains an experimental art-runtime promotion slice.


### v0.1.96 - Free Stage Badge Art Set
- Bumped the visible/local web version to v0.1.96 and package version to 0.1.96.
- Generated, circular-masked, optimized, registered, and wired approved collectible badge art for the five free progression stages.
- Added `src/data/badgeArt.js` and connected badge art into the badge shelf and Pantry Map badge collection cards.
- Replaced player-facing "art pending" badge placeholders with actual approved badge medals, while still dimming unearned/locked badges with progress labels.
- Updated `docs/ART_ASSET_BACKLOG.md` to mark free-stage badge art complete.
- No Android AAB was generated; this remains an experimental art-runtime promotion slice.

### Pantry Decoration Raw Intake - Pending Background Removal
- Generated and copied six high-polish Pantry decoration raw images into `src/assets/decorations/*-v2-raw.png`: starter counter cloth, sunny window curtains, recipe card shelf, mint check rug, soup pot display, and golden spoon sign.
- These raw images still have chroma-key backgrounds and are not runtime-safe yet. Do not wire them into `src/data/runtimeArt.js`, `src/data/decorations.js`, or `src/ui/pantryView.js` until background removal and alpha validation are complete.
- The next safe implementation step is to run chroma-key removal into `*-v2.png`, validate RGBA alpha/corners, then promote the approved decoration IDs into the runtime Pantry decoration allowlist.
- Pantry remains paused because `APPROVED_PANTRY_DECORATION_ASSET_IDS` is still empty.

### v0.1.97 - Pantry Decoration MVP Reopened
- Promoted six approved Sunny Spoon Pantry decoration artworks into runtime WebP assets and archived their raw/transparent sources in the manifest.
- Reopened the Pantry room/shop UI: approved decorations can be previewed in room slots, bought with spoons, and equipped per slot.
- Updated the save regression test from the old art-blocked behavior to the approved buy/equip flow, including an insufficient-spoons guard.
- Version bumped to v0.1.97; release gates now treat Pantry decoration art as approved visible raster assets instead of a paused placeholder surface.

### v0.1.98 - Pantry First Purchase Guide and Placement Guardrails
- Added a one-time Pip guide for the first successful Pantry decoration purchase using the existing guide persistence system.
- Clarified the current placement model in code and docs: fixed room slots, one equipped item per slot, auto-equip on purchase, owned items retained.
- Added Pantry placement, physical capacity, item-count, and spoon-economy guardrails to the economy design spec so future art/item batches are balanced against room space and monetization pacing.
- Version bumped to v0.1.98.

### v0.1.99 - Pantry Placement Affordances
- Added visible placement affordances to Pantry: each room slot is selectable, highlights the active placement region, and filters the shop to compatible decorations.
- Added slot labels to shop cards so players can see where each purchased item will appear before spending spoons.
- Added a room-capacity note showing decorated slots out of the five physical Pantry spots.
- Version bumped to v0.1.99.

### v0.1.100 - Pantry Economy Guardrails
- Aligned MVP Pantry decoration prices/rarities with the economy design spec: common items sit in the 18-60 range and cozy items now start at 80+.
- Extended `npm run qa:assets` to enforce Pantry slot validity, rarity cost ranges, approved visible decoration art, unique decoration IDs/assets, and at least one free starter decoration.
- Updated the save regression expectation for the new sunny-window-curtains cost.
- Version bumped to v0.1.100.

### v0.1.101 - Pantry Placement Mobile QA
- Extended `npm run qa:mobile` to navigate into Pantry and verify the room, slot filters, placement labels, selected slot state, and slot-specific shop filtering.
- The QA now checks default all-item state, counter slot filtering, window filter behavior, all-spots restoration, tap-target sizing, and horizontal overflow on mobile viewports.
- Version bumped to v0.1.101.

### v0.1.102 - Pantry First Purchase Callback Fix
- Fixed the Claude Review 19 bug where `onPantryFirstPurchase` was referenced inside `createShell` without being defined or passed from `draw()`.
- Reintroduced `requestPantryFirstPurchaseGuide()` and passed it through `createShell` so the first successful Pantry purchase opens Pip's one-time guide.
- Extended mobile QA to click the first Pantry decoration purchase and assert that the Pip guide overlay appears.
- Confirmed Review 19's stageArt and timeAttackDailyCount concerns are stale against current code: stage reward art is populated and time attack daily counts are pruned in `normalizeSave()`.
- Version bumped to v0.1.102.

### v0.1.103 - Opening Key Visual
- Generated, optimized, registered, and wired a new Sunny Spoon/Pip opening key visual into `brandIntro.js`.
- Replaced the app-icon-only first impression with a richer pantry scene while keeping title/studio text in UI for localization and avoiding generated text artifacts.
- Registered the source PNG and approved runtime WebP in `assetManifest.js`; asset QA now treats visible opening key visuals as character-continuity-gated art.
- Updated mobile visual QA to require the opening key visual image and continue blocking the old inconsistent cast collage.
- Version bumped to v0.1.103.


### v0.1.104 - Pantry Common Decoration Expansion
- Added four approved common Pantry decorations: Small Jam Jar, Herb Pot, Recipe Cork Board, and Tiny Succulent.
- Archived generated raw/transparent PNG sources and wired only optimized WebP assets into runtime decoration art.
- Extended Pantry shop data, approved runtime art gates, translations, asset manifest records, and mobile visual QA counts for the expanded 10-item shop.
- Version bumped to v0.1.104.


### Post-v0.1.104 - Review 20 QA Hardening
- Confirmed Claude Review 20 remaining stageArt and timeAttackDailyCount notes are stale against current code: all five free stage reward artworks are wired and time attack daily counts are already pruned by tests.
- Added an asset QA gate requiring every Pip Portrait/free-progression pack to have an approved visible stage-reward asset and a live stageArt.js runtime mapping.
- Kept app version at v0.1.104 because this is QA hardening only, with no user-visible UI or behavior change.


### v0.1.105 - Pantry Slot Decoration Set 15
- Added five approved common Pantry decorations: Spoon Wall Clock, Berry Tea Tins, Ribbon Rolling Pin, Sunny Flower Vase, and Woven Pantry Basket.
- Expanded the live Pantry shop from 10 to 15 decorations, with at least two choices in every physical room slot and additional mid-common price points.
- Archived generated raw/transparent PNG sources and wired optimized WebP assets through decorationArt, runtimeArt, assetManifest, translations, and mobile visual QA.
- Version bumped to v0.1.105.


### v0.1.106 - Pantry Cozy Decoration Goals
- Added five approved cozy Pantry decorations: Honey Cake Stand, Lace Window Lantern, Copper Cookie Tin, Plush Floor Cushion, and Framed Recipe Glow.
- Expanded the live Pantry shop from 15 to 20 decorations and added one higher-value cozy target for every physical room slot.
- Archived generated raw/transparent PNG sources and wired optimized WebP assets through decorationArt, runtimeArt, assetManifest, translations, and mobile visual QA.
- Version bumped to v0.1.106.


### v0.1.107 - Pantry Rare Decoration Goals
- Added five approved rare Pantry decorations: Golden Waffle Press, Stained Glass Suncatcher, Porcelain Spice Carousel, Pantry Delivery Cart, and Spoon Wall Tapestry.
- Expanded the live Pantry shop from 20 to 25 decorations and added long-term rare purchase goals across all five room slots.
- Archived generated raw/transparent PNG sources and wired optimized WebP assets through decorationArt, runtimeArt, assetManifest, translations, and mobile visual QA.
- Version bumped to v0.1.107.


### v0.1.108 - Pantry Rarity Filters
- Added Pantry shop rarity filters for starter, common, cozy, and rare decorations while preserving slot filters.
- Shop cards now show decoration grade next to price so the larger 25-item catalog is easier to scan.
- Updated mobile visual QA to require rarity filters and verify the rare filter count.
- Version bumped to v0.1.108.


### v0.1.109 - Pantry Availability Filters
- Added Pantry shop availability filters for All items, Can buy, and Owned so players can quickly find decorations that match their current spoon balance.
- Availability filters combine with existing slot and rarity filters, keeping the 25-item catalog scannable as the economy grows.
- Fixed the decoration card grade/price separator to render as a proper middle dot.
- Updated mobile visual QA to require availability filters and verify Can buy behavior at the seeded starter balance.
- Version bumped to v0.1.109.


### v0.1.110 - Pantry Filter Empty State

- Added a Pantry shop empty state for filter combinations with no matching decorations, including a clear reset-filters action.
- The empty state combines with slot, rarity, and availability filters so the larger decoration catalog never looks broken when a strict filter returns zero cards.
- Updated mobile visual QA to verify the rare + can-buy empty state and reset flow before purchasing the starter decoration.
- Version bumped to v0.1.110.


### v0.1.111 - Pantry Filter Summary

- Added a Pantry filter summary showing how many decorations match the current slot, rarity, and availability filters.
- Added a compact clear-filters action beside the summary so filtered catalog browsing can return to the full shop quickly.
- Updated mobile visual QA to require the summary and verify the rare-filter count.
- Version bumped to v0.1.111.


### v0.1.112 - Pantry Sort And Recommendation Badges

- Added Pantry shop sorting controls: recommended, low price, high price, and rare-first.
- Added item status badges so decorations communicate start-here, can-buy-now, save-for-later, owned, and on-display states before the purchase button.
- Recommended sorting now prioritizes the free starter item, currently affordable unowned items, save goals, owned items, and equipped decorations in a predictable order.
- Updated mobile visual QA to require sort controls/status badges and verify high-price sorting.
- Version bumped to v0.1.112.


### v0.1.113 - Pantry Placement Advisor

- Added a Pantry placement advisor under the room view so players can understand the fixed five-slot decoration model before buying.
- The advisor explains total catalog coverage in the all-spots view and, for a selected slot, shows compatible item count, owned count, and spoon price range.
- This directly supports the room-capacity and economy-planning guardrails: each physical spot now communicates how many items fit and how its price ladder grows.
- Updated mobile visual QA to verify the advisor and selected counter-slot guidance.
- Version bumped to v0.1.113.


### v0.1.114 - Pantry Savings Goal

- Added a Pantry savings-goal card that points players toward the next unowned decoration target and shows current spoon progress.
- The goal respects the selected room slot, so choosing counter/window/shelf/floor/back-wall reframes the economy around that physical placement area.
- This makes the decoration economy more legible: players can see what to solve puzzles for next and how many more spoons are needed.
- Updated mobile visual QA to require the savings goal and verify the seeded 3-spoon state points to the next 17-spoon gap.
- Version bumped to v0.1.114.


### v0.1.115 - Pantry Collection Progress

- Added a Pantry collection progress board that shows owned decorations out of the approved catalog and displayed room spots out of the five fixed placements.
- Added per-slot progress chips so players can see whether counter, window, shelf, floor, and back-wall choices are filling out evenly.
- This supports room-capacity balancing and helps future item-count decisions stay visible in the product UI instead of only in docs.
- Updated mobile visual QA to require the progress board and verify the seeded 0/25 catalog and 0/6 counter progress.
- Version bumped to v0.1.115.


### v0.1.116 - Pantry Item Savings Meters

- Added per-item spoon progress meters on unowned paid Pantry decorations so players can see saved spoons, total cost, and remaining gap directly on each card.
- This complements the global savings goal: the catalog now communicates both the next recommended target and per-decoration progress toward future purchases.
- Updated mobile visual QA to require item savings meters and verify seeded spoon progress text.
- Version bumped to v0.1.116.


### v0.1.117 - Pantry Placement Swap Notes

- Added per-card placement notes explaining whether a decoration will fill an empty room spot or replace the currently displayed item in that fixed slot.
- This makes the one-item-per-slot model visible before purchase/equip decisions, reducing ambiguity around where bought decorations go.
- Updated mobile visual QA to require swap/placement notes and verify the seeded empty-slot explanation.
- Version bumped to v0.1.117.


### Post-v0.1.117 Pantry Purchase QA Hardening

- Strengthened mobile visual QA after the first Pantry purchase: the test now verifies collection progress updates to 1/25, displayed-room progress updates to 1/5, and the counter slot becomes filled.
- Kept visible app version at v0.1.117 because this is QA coverage only, not a player-facing UI change.


### v0.1.118 - Pantry Display Plan

- Added a Pantry display-plan card that explains the selected room spot's current decoration state and the next matching upgrade target.
- The plan distinguishes all-room overview from slot-specific empty/filled placement, making the fixed five-slot decoration model clearer before purchase or equip decisions.
- Fixed the Pantry card grade/price separator back to the approved middle dot.
- Updated mobile visual QA to require the display-plan card in the all-room and counter-slot flows.
- Version bumped to v0.1.118.


### v0.1.119 - Pantry Browsing State Retention

- Preserved Pantry slot, rarity, availability, and sort selections across purchase/equip refreshes so players keep the room spot they were planning.
- Updated mobile visual QA to buy the starter counter decoration from a selected counter context and confirm the filled counter display plan remains visible after the first-purchase guide.
- Version bumped to v0.1.119.


### v0.1.120 - Pantry Purchase Feedback

- Added a Pantry action feedback card after decoration purchase/equip so the player sees the acquired item, placement result, and cozy room improvement immediately after the action.
- The feedback uses the approved runtime decoration art and keeps the existing slot-planning context intact.
- Updated mobile visual QA to require the starter counter purchase feedback after the first-purchase guide flow.
- Version bumped to v0.1.120.


### v0.1.121 - Pantry Earning Plan

- Added a Pantry earning-plan card that converts the next decoration's spoon gap into approximate starter-puzzle runs and daily-bonus runs using the shared economy config.
- This makes the puzzle -> spoons -> decoration loop more legible without introducing paid purchase prompts or hard gates.
- Updated mobile visual QA to require the earning plan and verify the seeded 17-spoon gap maps to about 6 starter puzzles or 2 daily-bonus runs.
- Version bumped to v0.1.121.


### v0.1.122 - Pantry Earning CTA

- Added a Play for spoons action to the Pantry earning-plan card, linking the decoration goal back to the puzzle view without introducing paid prompts or hard gates.
- Updated mobile visual QA to require the earning CTA alongside the spoon-run estimate.
- Version bumped to v0.1.122.


### v0.1.123 - Pantry Goal Tracking

- Added Track goal controls to unowned paid Pantry decorations so players can choose a desired item instead of only following the cheapest next target.
- Savings goal and Spoon plan now prioritize the tracked decoration when it matches the current room-slot context, and tracking a card moves the Pantry context to that item's physical slot.
- Updated mobile visual QA to track Golden Waffle Press and verify the spoon plan retargets to its 357-spoon gap.
- Version bumped to v0.1.123.


### v0.1.124 - Replay Reward Guardrails

- Locked the new economy direction into implementation: ordinary replay remains unpaid, while future Pip Replay Picks can award only tiny controlled rewards.
- Added save-layer replay reward guardrails: completed puzzle required, Pip-picked flag required, clean-solve flag required, one reward per puzzle per day, and a daily cap of 3 replay rewards.
- Added tests proving replay rewards cannot be farmed by repeatedly solving the same memorized picture.
- Version bumped to v0.1.124.


### v0.1.125 - Replay Picks Hub Surface
- Added deterministic Pip replay picks for completed, unlocked pictures so replay economy now has a visible daily surface before full challenge replay mode.
- Puzzle hub now shows a cozy replay picks card with today count/limit and review actions; the copy explicitly frames replay rewards as limited Pip-picked challenges, not unlimited farming.
- Added replay pick unit coverage and mobile visual QA expectations for the card after a seeded completed puzzle.
- Version bumped to v0.1.125.


### v0.1.126 - Replay Challenge Session
- Replay Picks now open an ephemeral replay challenge board instead of the completed saved puzzle state.
- Replay challenge completion can call the existing replay reward guard, awarding only Pip-picked clean runs and leaving canonical album/progression saves untouched.
- Clean replay is broken by any wrong filled cell during the run or by hint use; the player may still finish for practice.
- Version bumped to v0.1.126.


### v0.1.127 - Replay Clean Undo Guard
- Addressed Claude Review 22 follow-up: replay clean status is now an explicit cumulative tracker.
- A wrong filled cell permanently breaks the clean replay bonus for that run even if the move is undone.
- Hint use also permanently breaks the clean replay bonus for that run even if the hint move is undone and the visible hint count returns to zero.
- Version bumped to v0.1.127.


### Art Direction Note - 2026-07-06 Shared Sunny Spoon Identity
- User direction: the current coordinated art reset must cover the full first impression sequence: app icon, Sunny Spoon Studios screen, and game start screen.
- Sunny Spoon Studios should be treated as a reusable studio brand layer for future games, not a splash made only for Pip's Picture Pantry.
- The game start screen may be Pip/Pantry-specific, but it must visually match the app icon and studio bumper through character proportions, palette, lighting, outline weight, and premium cozy polish.
- Added this requirement to docs/ART_DIRECTION.md and docs/ART_REWORK_ROADMAP.md; no runtime version bump because this is planning/context only.

### v0.1.128 - Reusable Sunny Spoon Studios Bumper Art
- Generated and promoted a reusable Sunny Spoon Studios bumper image for the first launch stage.
- Replaced the CSS-only studio bumper mark with approved raster art guarded by `runtimeArt.js`; the image has no embedded text and avoids Pip/Pantry-specific props so it can scale to future Sunny Spoon titles.
- Runtime uses optimized `src/assets/brand/sunny-spoon-studios-bumper-v1.webp`; the generated PNG source is archived in the asset manifest.
- Mobile visual QA now checks the studio bumper image directly instead of the old CSS text mark.
- Version bumped to v0.1.128.

### v0.1.129 - Pantry Story Request Benchmark Pass
- User benchmark: decoration/shop flow should feel like a small story request, not only a utility purchase.
- Added a first Pantry request card above the shop so the starter counter item is framed as Pip's first room request.
- The request card guides the player to the relevant slot/filter and can later expand into authored request chains, character reactions, and reward moments.
- Version bumped to v0.1.129.


### v0.1.130 - Pantry Story Milestone

- Extended the first Pantry request into a small story milestone: after Pip's first counter request is placed, the Pantry now shows a room-level/bond card and previews the next three affordable decoration goals.
- Kept the implementation as a UI/story layer on top of existing owned/equipped decoration state, avoiding a save-schema change while the benchmarked story loop is still being shaped.
- Added Korean/English i18n keys and a regression check so the milestone copy does not fall back to English in Korean mode.
- Version bumped to v0.1.130.


### v0.1.131 - Pantry Delivery Note Goal

- Extended the Pantry story loop again: tapping a next-arrival decoration now pins a Pip delivery note with the target item, room slot, remaining spoon need, and a direct goal CTA.
- Kept this as view-level story state, not a save migration, so the delivery-note interaction can evolve before becoming durable task data.
- Added Korean/English i18n coverage and mobile QA coverage for the delivery-note surface.
- Version bumped to v0.1.131.


### v0.1.132 - Pantry Story Card Split And Delivery Completion

- Split the Pantry story request, milestone, and delivery-note renderers out of pantryView.js into src/ui/pantryStoryCards.js, reducing pantryView.js from 938 lines to under 800 lines.
- Added a delivery-complete feedback path: if the current delivery-note target is bought or equipped, the Pantry shows a dedicated Delivery complete celebration instead of generic purchase feedback.
- Extended i18n and mobile visual QA to cover the delivery-complete story feedback.
- Version bumped to v0.1.132.

### v0.1.133 - Pantry Shop Progressive Reveal

- Addressed the Review 23 mobile-scroll caution by changing the Pantry shop to reveal the first 6 prioritized decoration cards by default, then expose additional cards through a Show more decorations control.
- Filter, sort, slot, story-goal, and reset actions now return the shop to the focused 6-card reveal so the player sees the most relevant choices before scanning the whole catalog.
- Added i18n, styling, and mobile visual QA coverage for the 6/25 progressive reveal and 12-card expansion flow.
- Version bumped to v0.1.133.

### v0.1.134 - Pantry Planning Deck

- Addressed the Review 24 remaining concern about upper Pantry support cards stacking independently by grouping display plan, savings goal, earning plan, placement advisor, and room progress into a single `pantry-planning-deck`.
- Added mobile visual QA coverage that verifies the planning deck groups exactly 5 support-card mounts while preserving the existing story request, milestone, delivery note, and progressive shop flow.
- Confirmed the Review 24 `stageArt.js` pending note is stale against current code: all five free stage reward artworks are already wired through `approvedStageArtUrls`.
- Version bumped to v0.1.134.

### v0.1.135 - Durable Pantry Delivery Goal

- Promoted the Pantry delivery-note target from view-only state into the save layer as `pantryStoryGoalId`.
- Added `getPantryStoryGoalId`, `setPantryStoryGoalId`, and `clearPantryStoryGoalId`; purchasing or equipping the target decoration now clears the saved delivery goal automatically.
- Pantry view now restores the pinned delivery note from save after reload, and mobile visual QA verifies the Small Jam Jar delivery note survives a page reload before completion.
- Version bumped to v0.1.135.


### v0.1.136 - Pantry Delivery Completion History
- Added save-backed Pantry delivery completion history as `pantryCompletedStoryGoalIds`, plus helpers for reading, checking, and recording completed story requests.
- Updated Pantry purchase/equip completion so a matched delivery target now clears `pantryStoryGoalId` and records the completed decoration id exactly once.
- Extended save tests and mobile visual QA to verify that the Small Jam Jar delivery completion survives as save-state history after the story-complete feedback.
- Version bumped to v0.1.136.


### v0.1.137 - Pantry Request Completion Archive
- Added a Pantry request-log card that appears after completed delivery requests and shows the recent completed decoration goals.
- Wired the card to the v0.1.136 `pantryCompletedStoryGoalIds` save history, making completed requests visible instead of silently disappearing after fulfillment.
- Extended mobile visual QA to verify the Small Jam Jar request appears in the completed request log after story completion.
- Version bumped to v0.1.137.


### v0.1.138 - Pantry Room Step Progress
- Added a next-room-step progress meter to the Pantry request log, using completed delivery request counts as the first visible chapter-progress signal.
- The first completed delivery now shows 1/3 requests toward the next room step, preparing the Pantry loop for story/chapter gating and economy pressure.
- Extended Korean i18n and mobile visual QA to cover the new room-step progress text.
- Version bumped to v0.1.138.

### v0.1.139 - Pantry Story Stage Gate
- Added a Pantry room-step gate to unlockable puzzle packs: Sunny Spoon Sign now requires 3 completed Pantry delivery requests, Apron Drawer 6, Bakery Window 10, and Village Pantry 10.
- canUnlockPack() and unlockPack() now both require the room-step condition, while already-unlocked packs remain playable for save compatibility.
- Locked stage cards now show the Pantry room progress requirement alongside the spoon cost, making the economy pressure visible instead of hidden.
- Mobile QA now checks that the first locked stage explains the Pantry story requirement (0/3, Need pantry story).
- Version bumped to v0.1.139.

Validation planned: unit tests, asset QA, production build, local HTTP smoke, and mobile visual QA.

### v0.1.140 - Badge Map Gate Clarity
- Badge/map locked cards now reuse the Pantry room-step requirement helper, so locked future badges explain the same story gate as the puzzle list.
- Mobile QA now checks that locked badge cards show Pantry room progress (0/3) instead of only a generic locked state.
- Version bumped to v0.1.140.

Validation planned: syntax checks, unit tests, asset QA, build, HTTP smoke, and mobile visual QA.

### v0.1.141 - Stage Gate Pantry Action
- Locked puzzle stage cards now include a Go to Pantry action when the Pantry room-step gate is not met.
- The action routes directly to the Pantry view, keeping the progression loop actionable instead of only descriptive.
- Mobile QA now checks that the first locked stage includes the Pantry action copy.
- Version bumped to v0.1.141.

Validation planned: syntax checks, unit tests, asset QA, build, HTTP smoke, and mobile visual QA.

### Direction Note - Puzzle Scale Correction
- Clarified the puzzle-volume strategy: do not treat 1,000 puzzles as a fixed launch promise. The product direction is to provide as many high-quality curated puzzles as possible across launch and future updates.
- Launch count should be determined by readiness: puzzle quality, art consistency, QA coverage, performance, Pantry/story gates, and spoon economy balance.
- Puzzle quantity remains a competitive advantage, but each catalog puzzle still needs strong design, recognizable cozy imagery, appealing color sensibility, and logical solvability.

### v0.1.142 - Pantry Stage Goal
- Pantry request-log progress now names the next puzzle stage unlocked by Pantry story progress.
- After the first completed delivery, the archive explains that 2 more requests are needed to open Sunny Spoon Sign, making the stage gate actionable inside the Pantry loop.
- Mobile QA now verifies the next-stage goal text and card.
- Version bumped to v0.1.142.

Validation planned: syntax checks, unit tests, asset QA, build, HTTP smoke, and mobile visual QA.


### v0.1.143 - Stage Art QA Guard
- Confirmed the earlier Review note about empty `stageArt.js` is stale: the five free-stage reward artworks are wired into runtime previews.
- Strengthened mobile visual QA so stage previews must render approved tile mosaics and must not fall back to pending-art placeholders.
- Version bumped to v0.1.143.

Validation planned: syntax checks, unit tests, asset QA, build, HTTP smoke, and mobile visual QA.


### v0.1.144 - Pantry Archive Next Request
- Completed Pantry request logs now include a next Pip request CTA that pins the next unowned decoration into the existing delivery-note flow.
- This keeps the benchmark-inspired request loop moving from completed request -> next request without adding a separate save schema.
- Version bumped to v0.1.144.

Validation planned: syntax checks, unit tests, asset QA, build, HTTP smoke, and mobile visual QA.


### v0.1.145 - Pantry Room Chapter Signal
- Pantry request logs now show a room chapter card derived from completed delivery requests, making the request count feel like authored room progression rather than only a numeric gate.
- Mobile QA verifies the first completed delivery shows Chapter 2 progress alongside the next stage and next Pip request CTA.
- Version bumped to v0.1.145.

Validation planned: syntax checks, unit tests, asset QA, build, HTTP smoke, and mobile visual QA.


### v0.1.146 - Pantry Stage Spoon Gate
- Pantry request logs now show both requirements for the next puzzle stage: completed Pip requests and saved spoons.
- This removes the misleading impression that request count alone opens a gated stage and better exposes the intended decoration/economy pacing.
- Version bumped to v0.1.146.

Validation planned: syntax checks, unit tests, asset QA, build, HTTP smoke, and mobile visual QA.


### v0.1.147 - Legacy Unlockable Dot Cleanup
- Removed the stale `puzzle-chip[data-access="unlockable"]::after` CSS rule from early unlock-gate experiments.
- Current pack locking uses stage cards, Pantry gates, and explicit unlock panels, so the old dot marker was dead styling and could confuse future UI work.
- Version bumped to v0.1.147.

Validation planned: syntax checks, unit tests, asset QA, build, HTTP smoke, mobile visual QA, and legacy CSS absence check.

### v0.1.148 - Source Hygiene QA Guard
- Added `npm run qa:hygiene` to block UTF-8 BOMs in source files and catch the removed legacy unlockable puzzle-chip dot rule if it returns.
- This keeps old review cleanup items guarded by automation instead of relying on manual search before release.
- Version bumped to v0.1.148.

Verification after this slice: `node --check scripts\\source_hygiene_check.js` passed; `npm run test -- --run` passed 51 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932. `npm run qa:hygiene` was added but its direct run was blocked by the current Codex usage/ACL gate, so it remains the one pending direct command check.

### v0.1.149 - Pack Size Contract
- Added puzzle data regression coverage requiring every progression pack's declared board size to match the maximum board size it actually ships.
- Corrected the current pack metadata so Apron Drawer declares 8x8 and the mixed late-stage Bakery Window/Village Pantry packs declare their current 10x10 maximum instead of future 12x12/15x15 ambitions.
- This turns the 10x10+ content-scale direction into a concrete data contract before adding more late-stage puzzle volume.
- Version bumped to v0.1.149.

Verification after this slice: targeted `tests/puzzleData.test.js` passed 6 tests; full `npm run test -- --run` passed 52 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.

### v0.1.150 - Puzzle Scale Test Flex
- Replaced hardcoded puzzle distribution checks with scalable catalog contracts: at least 100 free progression puzzles, at least five progression packs, at least 20 puzzles per progression pack, and larger boards only inside packs declared for larger boards.
- This removes the test bottleneck called out in Review 26 before the next authored puzzle expansion pass.
- Version bumped to v0.1.150.

Verification after this slice: `node --check tests\\puzzleData.test.js` passed; targeted `tests/puzzleData.test.js` passed 6 tests; full `npm run test -- --run` passed 52 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.

### v0.1.151 - First 12x12 Catalog Puzzle
- Added the first authored 12x12 catalog puzzle, `Bakery Window Glow`, to the Bakery Window progression pack.
- Raised Bakery Window's declared board size to 12 now that it actually ships a 12x12 board, keeping the v0.1.149 pack-size contract honest.
- Extended puzzle data tests so the free progression catalog must now include at least one 12x12 puzzle and at least 101 free puzzles.
- Version bumped to v0.1.151.

Verification after this slice: `node --check tests\\puzzleData.test.js` passed; targeted `tests/puzzleData.test.js` passed 6 tests; full `npm run test -- --run` passed 52 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.


### v0.1.152 - 12x12 Mobile QA Path
- Extended mobile visual QA to seed Bakery Window access, open the authored 12x12 `Bakery Window Glow` catalog puzzle, and verify the focused play screen renders 144 cells.
- The QA now also checks the 12x12 board CSS variable, hint panel, cursor controls, and horizontal overflow across the standard mobile viewport set.
- Version bumped to v0.1.152.

Verification after this slice: `node --check scripts\\mobile_visual_check.js` passed; full `npm run test -- --run` passed 52 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932 including the 12x12 Bakery Window Glow focused-play path.

### v0.1.153 - 12x12 Bakery Mini Batch
- Added two more authored 12x12 Bakery Window catalog puzzles, `Croissant Tray` and `Tiered Cakes`, so the larger-board path is now a small batch instead of a single proof card.
- Raised puzzle data contracts from one 12x12 free puzzle to at least three, and kept the free progression catalog minimum aligned at 103 puzzles.
- Extended mobile visual QA so the Bakery Window unlocked catalog must expose at least three 12x12 puzzle chips before opening the focused 12x12 play screen.
- Version bumped to v0.1.153.

Verification after this slice: `node --check tests\\puzzleData.test.js`, `node --check scripts\\mobile_visual_check.js`, and `node --check src\\data\\puzzles.js` passed; targeted `tests/puzzleData.test.js` passed 6 tests; full `npm run test -- --run` passed 52 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932 with the three-card 12x12 Bakery Window catalog check.


### v0.1.154 - Intro And Settings Polish
- Replaced the opening screen's small seal image with the current Pip chrome character asset so the first screen no longer mixes the new key visual with the old app-icon crop.
- Restyled the opening start/name buttons with a warmer pressed game-button treatment that better matches the cozy key visual.
- Polished the settings dialog surface and option buttons so Korean labels wrap cleanly and the audio/control toggles feel less like flat placeholder UI.
- Version bumped to v0.1.154.

Verification after this slice: `node --check src\\ui\\brandIntro.js` and `node --check src\\ui\\settingsView.js` passed; full `npm run test -- --run` passed 52 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK; Playwright visual capture found 0 overflowing opening/settings controls and reduced the settings dialog height from about 808px to about 731px on 390x844; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.


### v0.1.155 - First-Impression QA Guard
- Added mobile visual QA coverage for the opening screen's Pip seal and polished start button treatment so future icon swaps do not accidentally restore the old app-icon crop or flat button styling.
- Added settings-dialog polish QA to catch overflowing controls and excessive modal height on mobile viewports.
- Version bumped to v0.1.155.

Verification after this slice: `node --check scripts\\mobile_visual_check.js` passed; full `npm run test -- --run` passed 52 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932 with the opening seal/start-button and settings-dialog polish guards active.

### v0.1.156 - Opening Seal Asset Guard
- Added asset-manifest QA rules so `brandIntro.js` cannot silently return to the old app-icon crop for the opening seal.
- The guard now requires the current approved `pip-chrome-v2` character art and an explicit `pipSealUrl` import path, making the final icon swap easier to update deliberately.
- Version bumped to v0.1.156.

Verification after this slice: `node --check scripts\\asset_manifest_check.js` passed; `npm run qa:assets` passed with 122 assets; full `npm run test -- --run` passed 52 tests; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.

### v0.1.157 - Tactile Button System Polish
- Added a shared tactile button treatment across common gameplay buttons, puzzle chips, floating navigation, and Pantry secondary actions so the main UI better matches the polished opening screen.
- Preserved the existing 44px+ tap target contract while adding subtle gradient depth, pressed states, and active-state color consistency.
- Version bumped to v0.1.157.

Verification after this slice: `npm run qa:assets` passed with 122 assets; `node --check scripts\\mobile_visual_check.js` passed; full `npm run test -- --run` passed 52 tests; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.

### v0.1.158 - App Chrome Polish
- Polished the top header as a framed app chrome surface so the title, spoon counter, settings, and reset controls feel like one designed game HUD rather than loose buttons.
- Refined the floating navigation menu panel to match the tactile button system with a warmer surface, stronger elevation, and safer compact sizing.
- Version bumped to v0.1.158.

Verification after this slice: `npm run qa:assets` passed with 122 assets; `node --check scripts\\mobile_visual_check.js` passed; full `npm run test -- --run` passed 52 tests; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.

### v0.1.159 - App Chrome QA Guard
- Added mobile visual QA coverage for the polished app header/HUD treatment and floating navigation panel layout.
- The guard now checks top-bar elevation/radius treatment, currency pill sizing, and floating nav panel viewport containment.
- Version bumped to v0.1.159.

Verification after this slice: `node --check scripts\\mobile_visual_check.js` passed; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932 with the app chrome polish guard active; full `npm run test -- --run` passed 52 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK.
### v0.1.160 - Completion Reward Polish
- Reward and completion moments now have a richer cozy surface layer: completion banners use the approved Pip completion sticker in a framed reward card, solved reveals have stronger presentation, and action spacing matches the newer tactile button system.
- Stage completion overlays now have a dedicated modal/card treatment instead of relying on generic button styling only.
- Version bumped to v0.1.160.
### v0.1.161 - Reward Polish QA Guards
- Added mobile visual QA guards for the solved completion banner: Pip sticker sizing, reveal square, action width, radius, and gradient treatment are now checked across supported mobile widths.
- Added a lightweight stage-complete reward card CSS fixture check so the stage reward overlay keeps its dedicated cozy modal treatment while the real gameplay trigger evolves.
- Version bumped to v0.1.161.
### v0.1.162 - Settings Dialog Polish
- Settings modal styling now matches the tactile Sunny Spoon UI system: warmer framed surface, softer section grouping, stronger active states, and cleaner player-name/audio controls.
- Kept existing settings behavior unchanged while improving the mobile first impression noted in preview feedback.
- Version bumped to v0.1.162.
### v0.1.163 - Settings Polish QA Guard
- Mobile visual QA now checks settings dialog polish metrics directly: modal radius/gradient, active language button treatment, input sizing, and close button treatment.
- This closes the v0.1.162 follow-up so the settings screen cannot quietly regress to a flat temporary form.
- Version bumped to v0.1.163.
### v0.1.164 - iOS Safe Area Chrome Guard
- Added `viewport-fit=cover` and safe-area-aware app-shell padding so the top HUD is protected on notched iOS devices.
- Mobile visual QA now checks the viewport meta and shell/top-bar spacing contract across supported preview widths.
- Version bumped to v0.1.164.
### v0.1.165 - Replay Picks Polish
- Replay Picks now uses the newer cozy card surface, count pill, tactile replay buttons, and stronger active state so the replay loop feels intentional rather than placeholder-like.
- Mobile visual QA now checks replay card/button radius, gradients, count pill treatment, and horizontal containment.
- Version bumped to v0.1.165.
### v0.1.166 - Album And Map Polish
- Album and Map screens now share the current cozy/tactile surface system: framed panels, warmer album stamps, badge cards, progress strip, and next-badge card treatment.
- Mobile visual QA now guards album/map panel radius, gradients, stamp/token sizing, and horizontal containment.
- Version bumped to v0.1.166.
### v0.1.167 - 12x12 Bakery Content Batch 2
- Added two more authored Bakery Window 12x12 catalog puzzles: `Macaron Box` and `Cocoa Tin`.
- Raised puzzle data contracts from at least three to at least five 12x12 free progression puzzles, and raised the free catalog floor to 105.
- Mobile visual QA now requires at least five 12x12 Bakery catalog chips before opening the focused 12x12 play path.
- Version bumped to v0.1.167.
### v0.1.168 - Village Pantry 10x10 Content Batch
- Added two more authored Village Pantry 10x10 puzzles: `Market Basket` and `Garden Window`.
- Raised the free catalog floor from 105 to 107 while keeping the new content inside the existing 10x10 late-stage progression pack.
- Version bumped to v0.1.168.
### v0.1.169 - Village Pantry 10x10 Content Batch 2
- Added two more authored Village Pantry 10x10 puzzles: `Picnic Cloth` and `Flower Cart`.
- Raised the free catalog floor from 107 to 109 while keeping the new content in the existing late-stage 10x10 progression lane.
- Version bumped to v0.1.169.

### v0.1.170 - 12x12 Bakery Content Batch 3
- Added two more authored Bakery Window 12x12 puzzles: `Honey Jar Shelf` and `Berry Tart`.
- Raised large-board/free-catalog contracts from 5 to 7 Bakery 12x12 cards and from 109 to 111 free puzzles.
- Version bumped to v0.1.170.

### v0.1.171 - Puzzle Catalog Report Guard
- Added `scripts/puzzle_catalog_report.js` and `npm run qa:catalog` to summarize pack counts, size distribution, free-puzzle volume, 10x10+ boards, and 12x12+ boards before larger content expansion.
- Added a regression test for the report so the launch catalog floor, Bakery 12x12 count, and Village Pantry large-board count stay visible during future puzzle-growth slices.
- Version bumped to v0.1.171.

### v0.1.172 - Village Pantry 10x10 Content Batch 3
- Added two more authored Village Pantry 10x10 puzzles: `Tea Tray` and `Jam Crate`.
- Raised free-catalog and catalog-report contracts to 113 free puzzles and 12 Village Pantry large-board puzzles.
- Version bumped to v0.1.172.

### v0.1.173 - Village Pantry Mobile Catalog Guard
- Extended mobile visual QA so the unlocked Puzzle Hub must expose at least 12 Village Pantry 10x10 chips.
- This protects the v0.1.168, v0.1.169, and v0.1.172 Village Pantry content batches from disappearing behind catalog UI changes.
- Version bumped to v0.1.173.

### v0.1.174 - 12x12 Bakery Content Batch 4
- Added two more authored Bakery Window 12x12 puzzles: `Pie Lattice` and `Cookie Jar Row`.
- Raised large-board/free-catalog contracts to 9 Bakery 12x12 cards and 115 free puzzles.
- Version bumped to v0.1.174.

### v0.1.175 - Village Pantry 10x10 Content Batch 4
- Added two more authored Village Pantry 10x10 puzzles: `Flour Sack` and `Spice Rack`.
- Raised free-catalog and catalog-report contracts to 117 free puzzles and 14 Village Pantry large-board puzzles.
- Version bumped to v0.1.175.

### v0.1.176 - 12x12 Bakery Content Batch 5
- Added two more authored Bakery Window 12x12 puzzles: `Scone Basket` and `Milk Glass`.
- Raised large-board/free-catalog contracts to 11 Bakery 12x12 cards and 119 free puzzles.
- Version bumped to v0.1.176.

### v0.1.177 - Village Pantry 10x10 Content Batch 5
- Added two more authored Village Pantry 10x10 puzzles: `Hanging Herbs` and `Checkered Napkin`.
- Raised free-catalog and catalog-report contracts to 121 free puzzles and 16 Village Pantry large-board puzzles.
- Version bumped to v0.1.177.

### v0.1.178 - 12x12 Bakery Content Batch 6
- Added two more authored Bakery Window 12x12 puzzles: `Cinnamon Rolls` and `Cup Stack`.
- Raised large-board/free-catalog contracts to 13 Bakery 12x12 cards and 123 free puzzles.
- Version bumped to v0.1.178.

### v0.1.179 - Village Pantry 10x10 Content Batch 6
- Added two more authored Village Pantry 10x10 puzzles: `Candle Shelf` and `Wicker Tray`.
- Raised free-catalog and catalog-report contracts to 125 free puzzles and 18 Village Pantry large-board puzzles.
- Version bumped to v0.1.179.


### v0.1.180 - Village Pantry Translation Metadata Guard
- Added titleKey metadata and English/Korean puzzle copy for the six recent Village Pantry 10x10 additions: Flour Sack, Spice Rack, Hanging Herbs, Checkered Napkin, Candle Shelf, and Wicker Tray.
- Added regression guards so late-stage Village Pantry catalog names stay translated in album/list surfaces instead of falling back to raw English titles.
- Version bumped to v0.1.180.


### v0.1.181 - Large-Board Translation Metadata Guard
- Added titleKey metadata and English/Korean puzzle copy for all remaining 10x10+ free progression puzzles.
- Added a regression guard so every large-board free puzzle must have translated catalog metadata before future puzzle-volume expansion continues.
- Version bumped to v0.1.181.


### v0.1.182 - Catalog Metadata QA Guard
- Extended `npm run qa:catalog` so every 10x10+ free progression puzzle must carry its expected titleKey and English/Korean title/imageName copy.
- Added a regression test with synthetic bad catalog data so missing large-board metadata now fails as a catalog warning before future puzzle batches ship.
- Version bumped to v0.1.182.


### v0.1.183 - 12x12 Bakery Content Batch 7
- Added two more authored Bakery Window 12x12 puzzles: `Lemon Tart` and `Sugar Duster`.
- Raised free-catalog, large-board, Bakery 12x12, catalog-report, and mobile catalog visibility contracts to 127 free puzzles, 37 large boards, and 15 Bakery 12x12 cards.
- Version bumped to v0.1.183.


### v0.1.184 - Village Pantry 10x10 Content Batch 7
- Added two more authored Village Pantry 10x10 puzzles: `Pickle Crocks` and `Bread Board`.
- Raised free-catalog, large-board, Village Pantry large-board, catalog-report, and mobile catalog visibility contracts to 129 free puzzles, 39 large boards, and 20 Village Pantry 10x10 cards.
- Version bumped to v0.1.184.


### v0.1.185 - 12x12 Bakery Content Batch 8
- Added two more authored Bakery Window 12x12 puzzles: `Pretzel Twist` and `Berry Jam Pot`.
- Raised free-catalog, large-board, Bakery 12x12, catalog-report, and mobile catalog visibility contracts to 131 free puzzles, 41 large boards, and 17 Bakery 12x12 cards.
- Version bumped to v0.1.185.


### v0.1.186 - Village Pantry 10x10 Content Batch 8
- Added two more authored Village Pantry 10x10 puzzles: `Copper Ladle` and `Potato Sack`.
- Raised free-catalog, large-board, Village Pantry large-board, catalog-report, and mobile catalog visibility contracts to 133 free puzzles, 43 large boards, and 22 Village Pantry 10x10 cards.
- Version bumped to v0.1.186.


### v0.1.187 - Puzzle Batch Intake Guard
- Added `scripts/puzzle_batch_intake.js` so future authored/generated puzzle batches can be checked before they enter the main catalog.
- The intake guard validates duplicate ids, pack max board size, solution dimensions, binary rows, and 10x10+ free puzzle titleKey/i18n metadata.
- Added `npm run qa:batch` and regression coverage for both accepted and rejected candidate batches.
- Version bumped to v0.1.187.

### v0.1.188 - Village Pantry 10x10 Batch
- Added 2 Village Pantry 10x10 progression puzzles: Tea Tin Stack and Market Basket.
- Raised large-board and mobile catalog guard thresholds so the new content is protected by regression checks.
- Version bumped to v0.1.188.

### v0.1.189 - Bakery Window 12x12 Batch
- Added 2 Bakery Window 12x12 progression puzzles: Icing Piping Bag and Cherry Danish Tray.
- Raised 12x12, large-board, and mobile catalog guard thresholds so this bigger-board batch is protected.
- Version bumped to v0.1.189.

### v0.1.190 - Village Pantry 10x10 Pair
- Added 2 Village Pantry 10x10 progression puzzles: Herb Bundle and Patchwork Tea Cozy.
- Raised large-board and Village Pantry mobile catalog guard thresholds for the expanded catalog.
- Version bumped to v0.1.190.

### v0.1.191 - Readable Puzzle Art Intake
- Added 2 Bakery Window 12x12 puzzles with explicit readability briefs: Flower Box Window and Honey Spoon Jar.
- Strengthened puzzle batch intake so future free 10x10+ candidates must include a readable `artReadability` brief with silhouette, color mood, and visual tags.
- Raised 12x12, large-board, catalog, and mobile QA thresholds for the expanded puzzle set.
- Version bumped to v0.1.191.

### v0.1.192 - Village Readable Puzzle Pair
- Added 2 Village Pantry 10x10 puzzles with explicit readability briefs: Blueberry Label and Potted Basil.
- Continued using silhouette, color mood, and visual tags for new large-board puzzle planning.
- Raised large-board, catalog, and mobile QA thresholds for the expanded puzzle set.
- Version bumped to v0.1.192.

### v0.1.193 - Bakery Readable Puzzle Pair
- Added 2 Bakery Window 12x12 puzzles with explicit readability briefs: Cocoa Mug Steam and Gingerbread Heart.
- Continued using bold silhouettes and future color mood planning for new large-board puzzle additions.
- Raised 12x12, large-board, catalog, and mobile QA thresholds for the expanded puzzle set.
- Version bumped to v0.1.193.

### v0.1.194 - Village Readable Puzzle Pair
- Added 2 Village Pantry 10x10 puzzles with explicit readability briefs: Warm Pie Window and Checkered Jam Cloth.
- Continued balancing Bakery/Village puzzle volume while keeping the large-board silhouette and color mood contract.
- Raised large-board, catalog, and mobile QA thresholds for the expanded puzzle set.
- Version bumped to v0.1.194.

### v0.1.195 - Bakery Readable Puzzle Pair
- Added 2 Bakery Window 12x12 puzzles with explicit readability briefs: Layer Cake Slice and Ribbon Cookie Box.
- Raised guarded launch-catalog thresholds to 149 free puzzles, 59 large-board free puzzles, 25 total 12x12 boards, and 25 Bakery Window 12x12 boards; full test/build/mobile QA passed.
- Version bumped to v0.1.195.

### 2026-07-09 Android Production Access / Mac Mini Timing
- Play Console production access is still gated by the closed-test requirement: 12 selected testers are in place and 5 days have elapsed toward the 14-day participation requirement.
- Mac mini is expected around 2026-07-23; until then, continue prioritizing shared web/Android content scale, art consistency, QA guards, and Capacitor readiness rather than Mac-only App Store packaging.

### v0.1.196 - Village Readable Puzzle Pair
- Added 2 Village Pantry 10x10 puzzles with explicit readability briefs: Cinnamon Braid and Teapot Cozy.
- Raised guarded launch-catalog thresholds to 151 free puzzles, 61 large-board free puzzles, and 32 Village Pantry 10x10 boards; full test/build/mobile QA passed.
- Version bumped to v0.1.196.

### v0.1.197 - Four Puzzle Readability Batch
- Added 4 readable large-board puzzles in a faster batch: Peach Tart Fan, Sugar Bell, Copper Kettle, and Berry Bowl.
- Raised guarded launch-catalog thresholds to 155 free puzzles, 65 large-board free puzzles, 27 Bakery Window 12x12 boards, and 34 Village Pantry 10x10 boards; full test/build/mobile QA passed.
- Version bumped to v0.1.197.

### v0.1.198 - Puzzle Readability Report Guard
- Promoted the user's quality-first direction into catalog QA: recent free 10x10+ puzzles now need readable silhouette/color/tag briefs in the catalog report, not only in batch intake.
- Added readable large-board brief totals to npm run qa:catalog; the new guard found and fixed a missing brief on Patchwork Tea Cozy.
- Version bumped to v0.1.198.

### v0.1.199 - Four Puzzle Quality Batch
- Added 4 readable large-board puzzles: Jam Thumbprint, Lemon Glaze Bun, Flower Milk Jug, and Toast Rack.
- Raised guarded launch-catalog thresholds to 159 free puzzles, 69 large-board free puzzles, 29 Bakery Window 12x12 boards, 36 Village Pantry 10x10 boards, and 21 readable large-board briefs; full test/build/mobile QA passed.
- Version bumped to v0.1.199.

### v0.1.200 - Four Puzzle Quality Batch
- Added 4 readable large-board puzzles: Caramel Custard Cup, Berry Cream Roll, Honey Dipper, and Egg Basket.
- Raised guarded launch-catalog thresholds to 163 free puzzles, 73 large-board free puzzles, 31 Bakery Window 12x12 boards, 38 Village Pantry 10x10 boards, and 25 readable large-board briefs; full test/build/mobile QA passed.
- Version bumped to v0.1.200.

### v0.1.201 - Recent Puzzle Edge Row Polish
- Considered Review 31's note that repeated 000000 edge rows can make puzzle silhouettes feel less authored.
- Polished recent readable puzzle solutions so bottom rows become meaningful plate, shadow, base, or handle rows instead of empty padding.
- Added a regression test for recent free 10x10+ readable puzzles to avoid fully blank first/last solution rows; full test/build/mobile QA passed.
- Version bumped to v0.1.201.

### v0.1.202 - Four Puzzle Quality Batch
- Added 4 readable large-board puzzles without blank edge rows: Cocoa Cream Puff, Sprinkle Donut, Cotton Napkin Ring, and Spice Scoop.
- Raised guarded launch-catalog thresholds to 167 free puzzles, 77 large-board free puzzles, 33 Bakery Window 12x12 boards, 40 Village Pantry 10x10 boards, and 29 readable large-board briefs; full test/build/mobile QA passed.
- Version bumped to v0.1.202.

### v0.1.203 - Four Puzzle Quality Batch
- Added four readable, edge-filled large-board puzzles: Cinnamon Swirl Roll, Strawberry Tart, Ribbon Tea Tin, and Checked Pot Holder.
- Raised guarded launch-catalog thresholds to 171 free puzzles, 81 large-board free puzzles, 35 Bakery Window 12x12 boards, 42 Village Pantry 10x10 boards, and 33 readable large-board briefs; full test/build/mobile QA passed.
- Version bumped to v0.1.203.

### v0.1.204 - Four Puzzle Quality Batch
- Added four readable, edge-filled large-board puzzles: Honey Cruller Twist, Pear Galette, Lace Jar Cover, and Garden Herb Bundle.
- Raised guarded launch-catalog thresholds to 175 free puzzles, 85 large-board free puzzles, 37 Bakery Window 12x12 boards, 44 Village Pantry 10x10 boards, and 37 readable large-board briefs; full test/build/mobile QA passed.
- Version bumped to v0.1.204.

### v0.1.205 - Time Attack Hint Economy
- Added Time Attack as a two-way economy loop: players can earn daily spoons from runs, but optional hints spend spoons at 2/4/7 per run.
- Updated Pip's Time Attack first-run guide to explain random puzzles, record chasing, and the choice between spending hints or saving for Pantry goals.
- Version bumped to v0.1.205; full test/build/mobile QA passed after restarting the local dev server.

### v0.1.206 - Time Attack Hint Confirmation Polish
- Replaced native confirm with an in-app paid-hint confirmation panel for Time Attack so Android WebView/browser UI stays consistent with the game.
- Clarified that Undo can remove the hint move but does not refund spent spoons.
- Version bumped to v0.1.206; full test/build/mobile/catalog QA passed.

### v0.1.207 - Four Puzzle Quality Batch
- Added four readable, edge-filled large-board puzzles: Apricot Danish, Vanilla Eclair, Hanging Ladle, and Pickle Jar.
- Kept the quality-first puzzle expansion rule active: clear silhouette, future color mood, tags, no blank edge rows, and localized names.
- Version bumped to v0.1.207; full test/build/mobile/catalog QA passed.

### v0.1.208 - Four Puzzle Quality Batch
- Added four readable, edge-filled large-board puzzles: Jam Crescent, Lemon Tartlet, Flour Sifter, and Cocoa Scoop Tin.
- Continued alternating Bakery 12x12 and Village 10x10 additions with explicit readability briefs and localized names.
- Version bumped to v0.1.208; full test/build/mobile/catalog QA passed.

### v0.1.209 - Four Puzzle Quality Batch
- Added four readable, edge-filled large-board puzzles: Braided Pretzel, Berry Danish Square, Measuring Spoons, and Jam Label Jar.
- Continued pushing catalog depth while varying silhouettes across loops, square pastries, fanned tools, and labeled jars.
- Version bumped to v0.1.209; full test/build/mobile/catalog QA passed.

### v0.1.210 - Recent Puzzle Title Guard
- Added a recent-readable-large-board title uniqueness guard to prevent newly authored high-quality puzzle batches from reusing names.
- Kept older starter-pack repeated titles untouched because those are part of the existing cross-pack structure.
- Version bumped to v0.1.210; full test/build/mobile QA passed.

### v0.1.211 - Four Puzzle Quality Batch
- Added four readable, edge-filled large-board puzzles: Almond Pinwheel, Cherry Turnover, Tea Strainer, and Blue Gingham Cloth.
- Continued catalog growth after the recent-title uniqueness guard, with each new title remaining distinct and localized.
- Version bumped to v0.1.211; full test/build/mobile/catalog QA passed.

### v0.1.212 - Catalog Report Threshold Tightening
- Raised stale puzzle catalog report thresholds to the current 191-puzzle / 101-large-board / 45-12x12 / 53-readable-brief catalog floor.
- Version bumped to v0.1.212; full test/build/mobile/catalog QA passed.

### v0.1.213 - Four Puzzle Quality Batch
- Added four readable, edge-filled large-board puzzles: Custard Star, Poppy Seed Roll, Scalloped Plate, and Honey Clothespin.
- Continued the march toward 200+ puzzles while keeping report thresholds, mobile QA thresholds, and recent-title uniqueness aligned.
- Version bumped to v0.1.213; full test/build/mobile/catalog QA passed.

### v0.1.214 - Four Puzzle Quality Batch
- Added four readable, edge-filled large-board puzzles: Maple Palmier, Fig Tart Square, Copper Funnel, and Embroidered Napkin.
- Brought the catalog to 199 free puzzles while keeping recent-title uniqueness, readable art briefs, and mobile catalog thresholds aligned.
- Version bumped to v0.1.214; full test/build/mobile/catalog QA passed.


### v0.1.215 - 200+ Puzzle Milestone Batch
- Added four readable, edge-filled large-board puzzles: Orange Brioche Knot, Cream Horn, Linen Bread Bag, and Porcelain Butter Dish.
- Crossed the 200-puzzle milestone with 203 free puzzles while keeping Bakery 12x12, Village 10x10, readable art briefs, recent-title uniqueness, and mobile catalog thresholds aligned.
- Version bumped to v0.1.215; full test/build/mobile/catalog QA passed.


### v0.1.216 - Opening Screen Tactile Polish
- Added a scoped opening screen polish layer for the game-stage intro: warmer card depth, improved key-visual frame, larger Pip seal, and a more tactile start button.
- Tightened the mobile visual guard so the start button must keep larger dimensions, rounded corners, gradient, and real shadow treatment.
- Version bumped to v0.1.216; full test/build/mobile QA passed.


### v0.1.217 - Catalog Summary Polish
- Added compact catalog summary chips to puzzle pack headers so large stages show progress, total pictures, large-board count, and maximum board size at a glance.
- Added mobile QA coverage for Bakery Window and Village Pantry summary chips so the 200+ puzzle catalog remains visibly scannable.
- Version bumped to v0.1.217; syntax checks, targeted i18n test, hygiene/assets QA, full test suite, production build, and mobile visual QA passed.


### v0.1.218 - Four Puzzle Quality Batch
- Added four readable large-board puzzles: Honey Cruller Ring, Raspberry Linzer Frame, Ceramic Measuring Cup, and Herb Drying Rack.
- Resumed content growth after the catalog summary polish while keeping Bakery 12x12, Village 10x10, translated metadata, readable art briefs, and mobile catalog thresholds aligned.
- Version bumped to v0.1.218; syntax checks, catalog QA, targeted puzzle/catalog/batch/i18n tests, full test suite, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA passed.


### v0.1.219 - Recent Korean Puzzle Title Guard
- Repaired the newest Korean large-board puzzle names from the v0.1.215-v0.1.218 content run so catalog browsing does not show mojibake for recent cards.
- Added an i18n regression guard for the newest Bakery/Village large-board titles and image names.
- Verified with syntax checks, targeted i18n test, catalog report, hygiene/assets QA, full Vitest, production build, and mobile visual QA.


### v0.1.220 - Four Puzzle Quality Batch
- Added four readable large-board puzzles: Blueberry Babka Slice, Vanilla Canele Tower, Polka Dot Sugar Tin, and Wooden Egg Crate.
- Raised catalog guards to 211 free puzzles, 121 large-board free puzzles, 55 Bakery Window 12x12 boards, 62 Village Pantry 10x10 boards, and 73 readable large-board briefs.
- Version bumped to v0.1.220; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.


### v0.1.221 - Four Puzzle Quality Batch
- Added four readable large-board puzzles: Strawberry Charlotte Dome, Cocoa Biscotti Bundle, Checkered Tea Towel, and Honeycomb Glass Jar.
- Raised catalog guards to 215 free puzzles, 125 large-board free puzzles, 57 Bakery Window 12x12 boards, 64 Village Pantry 10x10 boards, and 77 readable large-board briefs.
- Version bumped to v0.1.221; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.


### v0.1.222 - Bakery 12x12 Guard Alignment
- Aligned the Bakery Window-specific 12x12 regression guard with the current v0.1.221 catalog floor of 57 authored Bakery 12x12 puzzles.
- Version bumped to v0.1.222; targeted puzzle-data and catalog-report tests passed.


### v0.1.223 - Four Puzzle Quality Batch
- Added four readable large-board puzzles: Almond Croissant Stack, Peach Cream Tartlet, Blue Enamel Colander, and Cinnamon Stick Jar.
- Raised catalog guards to 219 free puzzles, 129 large-board free puzzles, 59 Bakery Window 12x12 boards, 66 Village Pantry 10x10 boards, and 81 readable large-board briefs.
- Version bumped to v0.1.223; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.224 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Lavender Shortbread Tin and Maple Pecan Braid.
- Added Village Pantry 10x10 Red Check Apron and Pearl Sugar Bowl.
- Raised catalog guards to 223 free puzzles, 133 large-board free puzzles, 61 Bakery Window 12x12 boards, 68 Village Pantry 10x10 boards, and 85 readable large-board briefs.
- Version bumped to v0.1.224; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.225 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Apricot Jam Tart and Cocoa Swirl Meringue.
- Added Village Pantry 10x10 Gingham Butter Cloche and Pressed Flower Frame.
- Raised catalog guards to 227 free puzzles, 137 large-board free puzzles, 63 Bakery Window 12x12 boards, 70 Village Pantry 10x10 boards, and 89 readable large-board briefs.
- Version bumped to v0.1.225; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.226 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Candied Orange Scone and Rose Cream Eclair.
- Added Village Pantry 10x10 Striped Pickle Jar and Little Recipe Box.
- Raised catalog guards to 231 free puzzles, 141 large-board free puzzles, 65 Bakery Window 12x12 boards, 72 Village Pantry 10x10 boards, and 93 readable large-board briefs.
- Version bumped to v0.1.226; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.227 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Hazelnut Praline Square and Lemon Curd Rosette.
- Added Village Pantry 10x10 Cornflower Tea Canister and Ribboned Bread Basket.
- Raised catalog guards to 235 free puzzles, 145 large-board free puzzles, 67 Bakery Window 12x12 boards, 74 Village Pantry 10x10 boards, and 97 readable large-board briefs.
- Version bumped to v0.1.227; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.228 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Vanilla Bean Cupcake and Pistachio Glaze Donut.
- Added Village Pantry 10x10 Sage Thread Spool and Ceramic Honey Spoon Rest.
- Raised catalog guards to 239 free puzzles, 149 large-board free puzzles, 69 Bakery Window 12x12 boards, 76 Village Pantry 10x10 boards, and 101 readable large-board briefs.
- Version bumped to v0.1.228; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.229 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Caramel Pear Muffin and Sugar Dusted Bundt.
- Added Village Pantry 10x10 Daisy Milk Bottle and Quilted Pot Mat.
- Raised catalog guards to 243 free puzzles, 153 large-board free puzzles, 71 Bakery Window 12x12 boards, 78 Village Pantry 10x10 boards, and 105 readable large-board briefs.
- Version bumped to v0.1.229; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.230 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Berry Cream Crown and Cocoa Almond Biscuit.
- Added Village Pantry 10x10 Lace Jam Spoon and Mint Label Flour Tin.
- Raised catalog guards to 247 free puzzles, 157 large-board free puzzles, 73 Bakery Window 12x12 boards, 80 Village Pantry 10x10 boards, and 109 readable large-board briefs.
- Version bumped to v0.1.230; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.231 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Cherry Cream Brioche and Ginger Honey Madeleine.
- Added Village Pantry 10x10 Blue Ribbon Mason Jar and Floral Rolling Pin.
- Raised catalog guards to 251 free puzzles, 161 large-board free puzzles, 75 Bakery Window 12x12 boards, 82 Village Pantry 10x10 boards, and 113 readable large-board briefs.
- Version bumped to v0.1.231; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.232 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Raspberry Choux Puff and Lemon Ribbon Tart.
- Added Village Pantry 10x10 Little Spice Drawer and Checkered Napkin Ring.
- Raised catalog guards to 255 free puzzles, 165 large-board free puzzles, 77 Bakery Window 12x12 boards, 84 Village Pantry 10x10 boards, and 117 readable large-board briefs.
- Version bumped to v0.1.232; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.233 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Almond Crescent Roll and Peach Custard Square.
- Added Village Pantry 10x10 Copper Measuring Cups and Blue Check Sugar Tin.
- Raised catalog guards to 259 free puzzles, 169 large-board free puzzles, 79 Bakery Window 12x12 boards, 86 Village Pantry 10x10 boards, and 121 readable large-board briefs.
- Version bumped to v0.1.233; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.234 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Strawberry Vanilla Puff and Cinnamon Honey Twist.
- Added Village Pantry 10x10 Green Label Tea Tin and Little Linen Basket.
- Raised catalog guards to 263 free puzzles, 173 large-board free puzzles, 81 Bakery Window 12x12 boards, 88 Village Pantry 10x10 boards, and 125 readable large-board briefs.
- Version bumped to v0.1.234; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.235 - Four Puzzle Quality Batch
- Added four readable free puzzles: Caramel Fig Danish, Blueberry Cream Pinwheel, Honey Label Crock, and Daisy Checked Teapot.
- Raised catalog guards to 267 free puzzles, 177 large-board free puzzles, 83 Bakery Window 12x12 boards, 90 Village Pantry 10x10 boards, and 129 readable large-board briefs.
- Version bumped to v0.1.235; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.236 - Four Puzzle Quality Batch
- Added four readable free puzzles: Plum Cardamom Braid, Honey Lavender Canele, Rose Label Jam Pot, and Blue Linen Bowl Cover.
- Raised catalog guards to 271 free puzzles, 181 large-board free puzzles, 85 Bakery Window 12x12 boards, 92 Village Pantry 10x10 boards, and 133 readable large-board briefs.
- Version bumped to v0.1.236; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.237 - Four Puzzle Quality Batch
- Added four readable free puzzles: Orange Blossom Cruller, Blackberry Vanilla Galette, Gingham Egg Cup, and Sage Butter Dish.
- Raised catalog guards to 275 free puzzles, 185 large-board free puzzles, 87 Bakery Window 12x12 boards, 94 Village Pantry 10x10 boards, and 137 readable large-board briefs.
- Version bumped to v0.1.237; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.238 - Four Puzzle Quality Batch
- Added four readable free puzzles: Pear Ginger Turnover, Mocha Cream Roll, Poppy Seed Mortar, and Striped Pantry Towel.
- Raised catalog guards to 279 free puzzles, 189 large-board free puzzles, 89 Bakery Window 12x12 boards, 96 Village Pantry 10x10 boards, and 141 readable large-board briefs.
- Version bumped to v0.1.238; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.239 - Four Puzzle Quality Batch
- Added four readable free puzzles: Cherry Almond Biscotti, Lemon Poppy Pound Cake, Little Cocoa Scoop, and Sunflower Flour Sieve.
- Raised catalog guards to 283 free puzzles, 193 large-board free puzzles, 91 Bakery Window 12x12 boards, 98 Village Pantry 10x10 boards, and 145 readable large-board briefs.
- Version bumped to v0.1.239; verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

### v0.1.240 - Time Attack Coach Polish
- Added a Pip coach card to the Time Attack lobby so the mode explains its role even after the first-run guide is dismissed.
- The card now frames Time Attack as a spoon source, a selective hint sink, and a personal-record challenge.
- Added mobile QA coverage for the Time Attack coach card treatment and bumped the visible app version to v0.1.240.

### v0.1.241 - Time Attack Hint Confirmation Polish
- Polished the paid Time Attack hint confirmation panel so spending spoons stays inside the cozy game UI instead of feeling like a browser dialog.
- Added a source hygiene guard that blocks window.confirm/globalThis.confirm from returning to runtime or QA code.
- Added mobile visual QA coverage for the paid-hint confirmation panel treatment.
- Bumped the visible app version to v0.1.241 while keeping Android bundle generation paused during the local rework.

### v0.1.242 - Time Attack Three-Round Pacing
- Changed the default 3-round Time Attack run from three 5x5 boards to 5x5, 8x8, then 10x10 so the mode exposes a meaningful paid-hint decision within a short session.
- Time Attack records now use the largest board reached in the run instead of always recording against the opening 5x5 board.
- Bumped the visible app version to v0.1.242.

### v0.1.243 - Time Attack Ladder Polish
- Added a visible 5x5 -> 8x8 -> 10x10 run ladder to the Time Attack lobby so the shorter 3-round pacing is clear before players start.
- Added mobile QA coverage for the ladder treatment and bumped the visible app version to v0.1.243.

### v0.1.244 - Readable Puzzle Batch
- Added four readable large-board puzzles: Bakery Window 12x12 Raspberry Lattice Tart and Sesame Pretzel Knot; Village Pantry 10x10 Porcelain Measuring Jug and Embroidered Tea Cozy.
- Raised catalog guards to 287 free puzzles, 197 large-board free puzzles, 93 Bakery Window 12x12 boards, 100 Village Pantry 10x10 boards, and 149 readable large-board briefs.

### v0.1.245 - Time Attack Progress-Cell Records
- Changed Time Attack record metadata and lobby copy from round-only scoring toward progress-cell records: completed previous boards plus correct cells on the current board.
- Saved best scores now include progressCells, currentRoundCorrectCells, hintsUsed, elapsedSeconds, and score so future timed partial runs can rank by one-more-correct-cell progress.

### v0.1.246 - Time Attack Timeout Records
- Added a 3-minute Time Attack limit so the mode now ends on time instead of relying only on full 3-board completion.
- Time Attack now snapshots the active puzzle state and records partial timeout runs by progressCells, preserving the one-more-correct-cell record design.

### v0.1.247 - Time Attack Timeout Visual Polish
- Polished the Time Attack remaining-time pill and result card so timeout, record, and normal run outcomes are easier to distinguish in the first-session flow.
- Kept the change visual-only on top of v0.1.246 timeout recording behavior.

### v0.1.248 - Time Attack Result Detail Polish
- 타임어택 타임아웃 결과에서 보상이 있는 타임아웃과 진행 부족으로 보상이 없는 타임아웃을 문구로 분리했다.
- 결과 카드에 사용한 힌트 수를 노출해, 기록 경쟁과 스푼 소비가 한 화면에서 함께 이해되도록 정리했다.
- 버전 표기는 v0.1.248로 갱신했다.
