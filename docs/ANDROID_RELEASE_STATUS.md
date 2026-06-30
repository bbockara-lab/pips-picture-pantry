# Android Release Status

Last updated: 2026-06-28

## Current State

- Mode: live-candidate
- App ID: com.sunnyspoonstudios.pipspicturepantry
- App name: Pip's Picture Pantry
- Capacitor CLI: 8.4.1
- Android shell: generated under android/
- Web assets: synced from dist/

## Verified Outputs

- Mobile visual QA passed at 360x740, 390x844, and 430x932.
- Debug APK built successfully:
  - android/app/build/outputs/apk/debug/app-debug.apk
- Release AAB built successfully:
  - android/app/build/outputs/bundle/release/app-release.aab
- Signed release AAB built and verified successfully:
  - android/app/build/outputs/bundle/release/app-release.aab

## Signing Status

- Upload keystore exists outside the repo under D:\Users\bbock\OneDrive\00. Private\10. Development\99. Key Paths\Android\Pip's Picture Pantry.
- Local-only signing env file exists outside the repo and is not committed.
- jarsigner -verify reports: jar verified.
- Current blocker: upload the signed AAB to Google Play internal testing and confirm Play Console accepts it.

## Local Tooling Notes

- Android Studio JBR exists at D:\Program Files\Android\Android Studio\jbr.
- Android SDK exists at C:\Users\bbock\AppData\Local\Android\Sdk.
- java is not on the default PATH in this shell, so scripts set JAVA_HOME, ANDROID_HOME, and ANDROID_SDK_ROOT explicitly.

## Repeatable Commands Verified

- npm run cap:sync passed.
- scripts/build_android_release_bundle.ps1 passed after final sync.

## Next Android Actions

1. Upload the signed AAB to Google Play internal testing.
2. Confirm Play Console accepts the upload key / bundle.
3. Capture package/version details from Play Console.
4. Install from internal testing and capture real-device screenshots.
5. Keep the upload keystore/env file backed up outside the repo.

## Verification Update - 2026-06-28 Game Loop Slice

- npm run cap:sync passed after Daily card, completion CTA, access metadata, and 10x10 puzzle changes.
- scripts/build_android_release_bundle.ps1 passed after sync.
- jarsigner -verify still reports: jar is unsigned.
- Signing/upload keystore remains the Android Play upload blocker.

## Verification Update - 2026-06-28 v0.1.1 Entry Identity

- Added Android color resources for Sunny Spoon cream/paper/cocoa/mint palette.
- Updated native splash/post-splash theme colors and launcher background color.
- npm run cap:sync passed after v0.1.1 web and Android resource changes.
- scripts/build_android_release_bundle.ps1 passed after sync.
- jarsigner -verify still reports: jar is unsigned.
- Signing/upload keystore remains the Android Play upload blocker.

## Verification Update - 2026-06-28 v0.1.2 Studio Logo / Language Settings

- npm run cap:sync passed after v0.1.2 startup identity and language-setting changes.
- scripts/build_android_release_bundle.ps1 passed after sync.
- jarsigner -verify still reports: jar is unsigned.
- Signing/upload keystore remains the Android Play upload blocker.
- Later Android polish: wire the in-app language picker to Android 13+ per-app language APIs or AndroidX AppCompat language APIs so Android system settings and app settings remain synchronized.

## Verification Update - 2026-06-28 v0.1.3 First-Play Clarity

- npm run cap:sync passed after v0.1.3 first-play clarity changes.
- scripts/build_android_release_bundle.ps1 passed after sync.
- jarsigner -verify still reports: jar is unsigned.
- Signing/upload keystore remains the Android Play upload blocker.

## Verification Update - 2026-06-28 v0.1.4 Clue Readability

- npm run cap:sync passed after v0.1.4 clue readability, color, and first-play copy changes.
- scripts/build_android_release_bundle.ps1 passed after sync.
- jarsigner -verify still reports: jar is unsigned.
- Signing/upload keystore remains the Android Play upload blocker.

## Verification Update - 2026-06-28 Android Signing Pipeline

- Added Gradle release signing config that reads only environment variables and does not require signing secrets in the repo.
- Added scripts/create_android_upload_keystore.ps1 to create the upload keystore outside the repo.
- Added scripts/build_android_signed_release_bundle.ps1 to build, sync, bundle, and verify a signed release AAB when signing environment variables are present.
- Added docs/ANDROID_SIGNING_SETUP.md with the one-time keystore setup and signed AAB build flow.
- The existing unsigned release build path remains available for local build validation.
- Actual signed AAB generation is still pending the local upload keystore passwords / environment variables.

## Verification Update - 2026-06-28 Signed Android AAB

- Created upload keystore outside the repo at D:\Users\bbock\OneDrive\00. Private\10. Development\99. Key Paths\Android\Pip's Picture Pantry\pip-picture-pantry-upload.jks.
- Created local-only signing env file outside the repo at D:\Users\bbock\OneDrive\00. Private\10. Development\99. Key Paths\Android\Pip's Picture Pantry\pip-picture-pantry-upload.env.ps1.
- Built signed release AAB at android/app/build/outputs/bundle/release/app-release.aab.
- Signed AAB size: 3,746,786 bytes.
- jarsigner -verify returned jar verified with exit code 0.
- Upload key SHA-256 fingerprint: 80:A0:F9:F5:FB:21:04:0D:3B:7A:3B:3A:DD:8E:8A:CD:18:3B:5F:72:FD:FA:8C:A7:D9:5F:79:BA:E2:C9:6D:98.
- Next blocker: upload this AAB to Google Play internal testing and confirm Play Console accepts the upload key / bundle.

## Verification Update - 2026-06-28 Key Paths Organization

- Organized private Android signing material under 99. Key Paths/Android by project name.
- Pip's Picture Pantry upload keystore and local signing env now live under D:\Users\bbock\OneDrive\00. Private\10. Development\99. Key Paths\Android\Pip's Picture Pantry.
- Elena Cozy Village upload key was moved under D:\Users\bbock\OneDrive\00. Private\10. Development\99. Key Paths\Android\Elena Cozy Village.
- Rebuilt signed release AAB after the move: android/app/build/outputs/bundle/release/app-release.aab.
- Signed AAB size after rebuild: 3,746,786 bytes.
- jarsigner verification after the move: jar verified.
- Current Pip upload key SHA-256 fingerprint: 80:A0:F9:F5:FB:21:04:0D:3B:7A:3B:3A:DD:8E:8A:CD:18:3B:5F:72:FD:FA:8C:A7:D9:5F:79:BA:E2:C9:6D:98.
## Verification Update - 2026-06-28 v0.1.9 Internal Test Feedback Build

- Built a new signed Android App Bundle for the tester-feedback update.
- Android versionCode: 2.
- Android versionName: 1.0.1.
- Visible app version: v0.1.9.
- Signed AAB path: android/app/build/outputs/bundle/release/app-release.aab.
- Signed AAB size: 3,746,933 bytes.
- jarsigner verification: jar verified.
- Play Console next upload should create internal test release 2 (1.0.1), because versionCode 1 is already used by the first internal test release.
## Verification Update - 2026-06-28 v0.1.10 Puzzle List Progress Cues

- Android versionCode: 3.
- Android versionName: 1.0.2.
- Visible app version: v0.1.10.
- Purpose: next internal test build with clearer picture-list size labels and completed-list states.
- Signed AAB rebuilt successfully at android/app/build/outputs/bundle/release/app-release.aab.
- Signed AAB size: 3,747,129 bytes.
- jarsigner verification: jar verified.
- Play Console next upload should create internal test release 3 (1.0.2), because versionCode 1 and 2 are already used by earlier internal test builds.
## Verification Update - 2026-06-28 v0.1.11 Player Profiles / Pantry Map

- Android versionCode: 4.
- Android versionName: 1.0.3.
- Visible app version: v0.1.11.
- Purpose: next internal test build with player-name local profiles and the first Pantry Map meta-progression view.
- Signed AAB rebuilt successfully at android/app/build/outputs/bundle/release/app-release.aab.
- Signed AAB size: 3,747,816 bytes.
- jarsigner verification: jar verified.
- Play Console next upload should create internal test release 4 (1.0.3), because versionCode 1, 2, and 3 are already used by earlier internal test builds.
## Verification Update - 2026-06-28 v0.1.12 Launch Puzzle Volume

- Android versionCode: 5.
- Android versionName: 1.0.4.
- Visible app version: v0.1.12.
- Purpose: next internal test build with 30 playable launch pictures.
- Signed AAB rebuilt successfully at android/app/build/outputs/bundle/release/app-release.aab.
- Signed AAB size: 3,749,122 bytes.
- jarsigner verification: jar verified.
- Play Console next upload should create internal test release 5 (1.0.4), because versionCode 1 through 4 are already used by earlier internal test builds.


## Verification Update - 2026-06-28 v0.1.13 Review Fixes

- Android versionCode: 6.
- Android versionName: 1.0.5.
- Visible app version: v0.1.13.
- Purpose: reviewer-priority fix build for Korean copy, player-name settings, tab clarity, and first-run name onboarding.
- Signed AAB rebuilt successfully at android/app/build/outputs/bundle/release/app-release.aab.
- Signed AAB size: 3,750,068 bytes.
- jarsigner verification: jar verified.
- Play Console next upload should create internal test release 6 (1.0.5), because versionCode 1 through 5 are already used by earlier internal test builds.

## Verification Update - 2026-06-28 v0.1.14 Folder Economy / Audio Trial

- Android versionCode: 7.
- Android versionName: 1.0.6.
- Visible app version: v0.1.14.
- Purpose: next internal test build with profile display fixes, spoon rewards, 100 free foldered cards, folder roadmap progression, brighter UI, and first local audio trial.
- Signed AAB rebuilt successfully at android/app/build/outputs/bundle/release/app-release.aab.
- Signed AAB size: 3,752,150 bytes.
- jarsigner verification: jar verified.
- Play Console next upload should create internal test release 7 (1.0.6), because versionCode 1 through 6 are already used by earlier internal test builds.

## Verification Update - 2026-06-28 v0.1.15 Review 8 Polish

- Android versionCode: 8.
- Android versionName: 1.0.7.
- Visible app version: v0.1.15.
- Purpose: next internal test build with localized folder-art roadmap labels, globalThis timer cleanup, and softer early spoon unlock costs.
- Signed AAB rebuilt successfully at android/app/build/outputs/bundle/release/app-release.aab.
- Signed AAB size: 3,752,069 bytes.
- jarsigner verification: jar verified.
- Play Console next upload should create internal test release 8 (1.0.7), because versionCode 1 through 7 are already used or prepared by earlier internal test builds.

## Verification Update - 2026-06-28 v0.1.16 Stage / Currency Polish

- Android versionCode: 9.
- Android versionName: 1.0.8.
- Visible app version: v0.1.16.
- Purpose: next internal test build with music default off, visual spoon currency, stage wording, future paid theme placeholders, and roadmap silhouettes.
- Signed AAB rebuilt successfully at android/app/build/outputs/bundle/release/app-release.aab.
- Signed AAB size: 3,752,961 bytes.
- jarsigner verification: jar verified.
- Play Console next upload should create internal test release 9 (1.0.8), because versionCode 1 through 8 are already used or prepared by earlier internal test builds.

## Verification Update - 2026-06-28 v0.1.17 Roadmap / Reward Polish

- Android versionCode: 10.
- Android versionName: 1.0.9.
- Visible app version: v0.1.17.
- Purpose: next internal test build with clearer reward formatting, polished reward token, real Pip-image roadmap previews, hidden low-quality music toggle, BOM cleanup, and bonus-pack roadmap filtering.
- Signed AAB rebuilt successfully at android/app/build/outputs/bundle/release/app-release.aab.
- Signed AAB size: 3,753,568 bytes.
- jarsigner verification: jar verified.
- Play Console next upload should create internal test release 10 (1.0.9), because versionCode 1 through 9 are already used or prepared by earlier internal test builds.

## Verification Update - 2026-06-29 v0.1.18 Badge / Future Sets Polish

- Android versionCode: 11.
- Android versionName: 1.0.10.
- Visible app version: v0.1.18.
- Purpose: next internal test build with completion badges, five future paid-theme set placeholders, fixed preview i18n, price-preview copy, and explicit file-based BGM deferral.
- Signed AAB rebuilt successfully at android/app/build/outputs/bundle/release/app-release.aab.
- Signed AAB size: 3,755,030 bytes.
- jarsigner verification: jar verified by scripts/build_android_signed_release_bundle.ps1 before successful exit.
- Play Console next upload should create internal test release 11 (1.0.10), because versionCode 1 through 10 are already used or prepared by earlier internal test builds.

## Verification Update - 2026-06-29 v0.1.19 Store-Safe Add-On Copy

- Android versionCode: 12.
- Android versionName: 1.0.11.
- Visible app version: v0.1.19.
- Purpose: next internal test build with store-safe add-on copy, earned-only top badge shelf, and appShell BOM cleanup.
- Signed AAB rebuilt successfully at android/app/build/outputs/bundle/release/app-release.aab.
- Signed AAB size: 3,755,036 bytes.
- jarsigner verification: jar verified.
- Play Console next upload should create internal test release 12 (1.0.11), because versionCode 1 through 11 are already used or prepared by earlier internal test builds.

## Verification Update - 2026-06-29 v0.1.20 Retention Polish

- Android versionCode: 13.
- Android versionName: 1.0.12.
- Visible app version: v0.1.20.
- Purpose: next internal test build with pack-level badges, earned-only top badge shelf, Album completion dates, and evolving Pip dialogue.
- Signed AAB rebuilt successfully at android/app/build/outputs/bundle/release/app-release.aab.
- Signed AAB size: 3,756,069 bytes.
- jarsigner verification: jar verified.
- Play Console next upload should create internal test release 13 (1.0.12), because versionCode 1 through 12 are already used or prepared by earlier internal test builds.

## Verification Update - 2026-06-29 v0.1.21 Stage Completion Celebration

- Android versionCode: 14.
- Android versionName: 1.0.13.
- Visible app version: v0.1.21.
- Purpose: next internal test build with one-time stage completion celebration, stage-complete SFX, completed-pack save tracking, and the previous retention polish intact.
- Signed AAB rebuilt successfully at android/app/build/outputs/bundle/release/app-release.aab.
- Signed AAB size: 3,756,979 bytes.
- jarsigner verification: jar verified by scripts/build_android_signed_release_bundle.ps1 before successful exit.
- Play Console next upload should create internal test release 14 (1.0.13), because versionCode 1 through 13 are already used or prepared by earlier internal test builds.

## Verification Update - 2026-06-29 v0.1.22 Daily Reward Clarity

- Android versionCode: 15.
- Android versionName: 1.0.14.
- Visible app version: v0.1.22.
- Purpose: next internal test build with clearer Today's pick reward copy showing the reward token icon plus +5.
- Signed AAB rebuilt successfully at android/app/build/outputs/bundle/release/app-release.aab.
- Signed AAB size: 3,757,060 bytes.
- jarsigner verification: jar verified by scripts/build_android_signed_release_bundle.ps1 before successful exit.
- Play Console next upload should create internal test release 15 (1.0.14), because versionCode 1 through 14 are already used or prepared by earlier internal test builds.

## Verification Update - 2026-06-29 v0.1.23 Cozy Music Trial

- Android versionCode: 16.
- Android versionName: 1.0.15.
- Visible app version: v0.1.23.
- Purpose: next internal test build with an optional quiet WebAudio cozy music loop and restored music setting toggle.
- Signed AAB rebuilt successfully at android/app/build/outputs/bundle/release/app-release.aab.
- Signed AAB size: 3,757,693 bytes.
- jarsigner verification: jar verified.
- Play Console next upload should create internal test release 16 (1.0.15), because versionCode 1 through 15 are already used or prepared by earlier internal test builds.

## Verification Update - 2026-06-29 v0.1.24 Roadmap Clarity

- Android versionCode: 17.
- Android versionName: 1.0.16.
- Visible app version: v0.1.24.
- Purpose: next internal test build with playable-only Today's pick selection, clearer reward line wrapping, and non-clipped Roadmap progress visuals.
- Signed AAB rebuilt successfully at android/app/build/outputs/bundle/release/app-release.aab.
- Signed AAB size: 3,757,997 bytes.
- jarsigner verification: jar verified.
- Play Console next upload should create internal test release 17 (1.0.16), because versionCode 1 through 16 are already used or prepared by earlier internal test builds.

## Verification Update - 2026-06-29 v0.1.25 File-Based Cozy BGM

- Release target: v0.1.25 / Android versionCode 18 / versionName 1.0.17.
- Added bundled BGM asset: src/assets/music/bgm-cozy.mp3.
- Replaced generated WebAudio music with file-based loop playback through the existing Settings music toggle.

## Verification Update - 2026-06-29 v0.1.26 Stage-Part Roadmap Reveal

- Release target: v0.1.26 / Android versionCode 19 / versionName 1.0.18.
- Roadmap reveal now uses stage-part masking instead of overlapping full Pip images.
- The five free stages now contribute distinct visible areas to the Pip portrait.

## Verification Update - 2026-06-30 v0.1.27 Roadmap / Stage Preview Split

- Release target: v0.1.27 / Android versionCode 20 / versionName 1.0.19.
- Main Roadmap uses the full Pip portrait reveal; stage cards use focused part previews only.

## Verification Update - 2026-06-30 v0.1.28 Pip Tile Roadmap

- Release target: v0.1.28 / Android versionCode 21 / versionName 1.0.20.
- Roadmap and stage previews now use tile-based Pip image reveal rather than semantic body-part masks.
