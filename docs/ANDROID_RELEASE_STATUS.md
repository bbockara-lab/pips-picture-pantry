# Android Release Status

Last updated: 2026-07-16

## Public Launch Checklist (release-safe, 2026-07-14)

**versionCode management rule:**
- Last Play Console upload: versionCode **27** / versionName **"1.0.26"** (v0.1.35, closed testing).
- v0.1.36 through current local builds have not been uploaded as AABs; they are local/GitHub development versions only.
- The next Play Console upload must increase `android/app/build.gradle` before building the release bundle:
  - `versionCode` -> **28 or higher** (Play Console rejects duplicate or lower codes).
  - `versionName` -> final public-launch label to be chosen at release time. Keep it separate from the web/internal app version in `package.json` and `src/data/appVersion.js`.

**Automation status:** `build.gradle` versionCode is still manually managed. `scripts/build_android_release_bundle.ps1` and signed-bundle scripts do not auto-increment it. Update it intentionally right before the next AAB upload.

**Automated guard:** run `npm run qa:release` during normal QA and `npm run qa:release:final` immediately before building the signed Play upload AAB. The normal guard reports release-number warnings without blocking local polish; the final guard fails if `versionCode` / `versionName` still match the last uploaded Play build.

**Minimum release patch example:**
```gradle
// android/app/build.gradle defaultConfig
versionCode 28
versionName "1.1.0" // or the final public launch version name
```

**Verification method:** after the release build, upload the AAB to the Play Console internal/closed test track and confirm there is no version conflict message. Record the accepted package/version details below before promoting.

---

## Closed Testing Access Window - 2026-07-14

- User reported that Google Play production access eligibility now shows **9 of 14 days complete**.
- Remaining release work should assume about five eligibility days remain, with a working goal to finish the Android-ready candidate in the next three development days and reserve the final window for review, real-device checks, AAB upload, and store-listing cleanup.
- Priority order for the three-day push: first-session polish, Pantry purpose/economy clarity, Android/WebView QA, release numbering, signed AAB rebuild, and rollback notes.

---

## Current State

- 2026-07-10 planning update: launch content strategy now targets about 333 polished Season 0 puzzles rather than completing 1,000 puzzles before release.
- Long-term 1,000+ puzzle depth remains a live-service update goal through seasonal/quarterly content packs.
- Near-term release readiness should prioritize first-session polish, art consistency, Pantry story/economy flow, Time Attack, guide presentation, and mobile UX once the catalog approaches the 333 range.

- Mode: live-candidate
- App ID: com.sunnyspoonstudios.pipspicturepantry
- App name: Pip's Picture Pantry
- Capacitor CLI: 8.4.1
- Android shell: generated under android/
- Web assets: synced from dist/

## Verified Outputs

- `npm run qa:candidate` passes with Vitest, catalog, hygiene, runtime asset manifest, Play Store graphics, Play Store listing copy, local privacy policy alignment, production build, Android release gate, HTTP 200, and mobile visual QA.
- `npm run qa:store` verifies Play Store app icon, feature graphic, phone screenshots, and tablet screenshots.
- `npm run qa:store-listing` verifies the Play Console listing draft, screenshot references, privacy URL, launch positioning, and monetization wording.
- `npm run qa:privacy` verifies local Markdown/HTML privacy policy alignment before submission.
- `npm run qa:privacy:live` passes against the public Firebase Hosting privacy policy URL:
  - https://sunny-spoon-pantry.web.app/privacy-policy.html
  - Last verified after Firebase Hosting deploy on 2026-07-16.
- `npm run qa:android:candidate` passes and builds the current unsigned candidate AAB:
  - android/app/build/outputs/bundle/release/app-release.aab
- Current candidate AAB size: 10,551,476 bytes.
- `scripts/build_android_signed_release_bundle.ps1` now runs `npm run qa:candidate`, `npm run qa:privacy:live`, and `npm run qa:release:final` before signing. It intentionally stops until `android/app/build.gradle` is bumped above the last Play Console upload.

## Signing Status

- Upload keystore exists outside the repo under D:\Users\bbock\OneDrive\00. Private\10. Development\99. Key Paths\Android\Pip's Picture Pantry.
- Local-only signing env file exists outside the repo and is not committed.
- Current pre-upload blocker: choose the public launch Android `versionCode` / `versionName`, update `android/app/build.gradle`, run `npm run qa:release:final`, then build and verify the signed Play-upload AAB.

## Local Tooling Notes

- Android Studio JBR exists at D:\Program Files\Android\Android Studio\jbr.
- Android SDK exists at C:\Users\bbock\AppData\Local\Android\Sdk.
- java is not on the default PATH in this shell, so scripts set JAVA_HOME, ANDROID_HOME, and ANDROID_SDK_ROOT explicitly.

## Repeatable Commands Verified

- `npm run qa:candidate` passed after adding Play Store graphics checks.
- `npm run qa:privacy:live` passed after deploying the refreshed 2026-07-16 privacy policy HTML to Firebase Hosting.
- `npm run qa:android:candidate` passed after hardening native PowerShell exit-code handling.
- `npm run qa:android:candidate` passed again on 2026-07-16 after release-gate and GitHub Actions QA expansion; unsigned candidate AAB size: 10,551,476 bytes.
- `scripts/build_android_signed_release_bundle.ps1` is wired to the full candidate QA chain plus live privacy verification before the final numbering gate and signing step.

## Next Android Actions

1. Finish final human review on Android/WebView and visible store screenshots.
2. Choose final public Android `versionCode` / `versionName` and bump `android/app/build.gradle`.
3. Run `npm run qa:release:final`.
4. Build the signed Play-upload AAB with `scripts/build_android_signed_release_bundle.ps1`.
5. Upload the signed AAB to Google Play internal/closed testing and confirm Play Console accepts it.
6. Capture accepted package/version details and real-device screenshots.
7. Keep the upload keystore/env file backed up outside the repo.

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

## Verification Update - 2026-06-30 v0.1.29 Badge Shelf Simplification

- Release target: v0.1.29 / Android versionCode 22 / versionName 1.0.21.
- User-facing Roadmap was replaced with a Badge Shelf, and the five free stages now reveal separate stage badge pictures.
- Verification after this slice: node --check passed on changed JS modules; npm run test passed with 29 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; signed AAB rebuilt and jarsigner reported `jar verified`.
- Signed AAB size: 10,311,937 bytes.

## Verification Update - 2026-06-30 v0.1.30 Release Candidate Polish

- Release target: v0.1.30 / Android versionCode 23 / versionName 1.0.22.
- Village Pantry stage art is now visible in stage previews and badge cards.
- Verification after this slice: node --check passed on changed JS modules; npm run test passed with 29 tests; npm run build passed; npm run qa:mobile passed at 360x740, 390x844, and 430x932; signed AAB rebuilt and jarsigner reported `jar verified`.
- Signed AAB size: 10,201,350 bytes.

## Verification Update - 2026-06-30 v0.1.31 Launcher Icon Repair

- Release target: v0.1.31 / Android versionCode 24 / versionName 1.0.23.
- Regenerated launcher icon PNG resources from store-assets/play-console/app-icon-512.png for mdpi through xxxhdpi, including adaptive icon foreground PNGs.
- Verification after this slice: node --check passed on appShell; npm run build passed; signed AAB rebuilt. Full jarsigner verification was not available because jarsigner is not installed on PATH or the detected local Java folders. Play Console upload validation remains the final signature check.
- Signed AAB size: 10,814,753 bytes.


## Verification Update - 2026-07-01 v0.1.32 Tutorial / Mystery Tile Polish

- Release target: v0.1.32 / Android versionCode 25 / versionName 1.0.24.
- Scope: local UX review build candidate for visual first-puzzle guidance and stage/badge mystery tile previews.
- Signed AAB: not rebuilt yet; rebuild after local UX approval. Local verification passed with JS syntax checks and npm run build.

## Verification Update - 2026-07-01 v0.1.33 Tutorial Label Polish

- Release target: v0.1.33 / Android versionCode 25 / versionName 1.0.24.
- Scope: copy-only polish for the first-puzzle visual guide heading; no Android numbering change because versionCode 25 has not been uploaded yet.
- Verification after this slice: node --check passed for ko/en i18n and appShell; npm run build passed; signed AAB rebuilt at android/app/build/outputs/bundle/release/app-release.aab.
- Signed AAB size: 10,815,359 bytes.

## Verification Update - 2026-07-01 v0.1.34 Stage Navigation Comfort

- Prepared tester-feedback UX update for local review before the next Play Console upload.
- Android version target updated to versionCode 26 / versionName 1.0.25.
- Web version/package updated to v0.1.34 / 0.1.34.
- Added puzzle-panel same-stage previous/next/list navigation and automatic scroll-to-board/list behavior.
- Verification so far: node --check passed for changed JS modules; npm run build passed.
- Signed AAB has not been rebuilt for this version yet; rebuild only after local UX approval.

## Verification Update - 2026-07-01 v0.1.35 Late-Stage 10x10 Trial

- Release target: v0.1.35 / Android versionCode 27 / versionName 1.0.26.
- Scope: late-stage difficulty expansion with 10 total 10x10 puzzles, while keeping the beginner stages unchanged.
- Signed AAB has not been rebuilt for this version yet; rebuild only after local UX approval.

## Local Experimental Update - 2026-07-05 v0.1.68 Focused Play Settings Access
- Web/local version moved to v0.1.68 for the experimental major rework.
- Android AAB generation and Play Console upload remain paused for this design-heavy slice.
- Next Android release should still verify launcher icon placement, Samsung/Game Launcher behavior, visible version, core navigation, and rollback readiness before upload.

## Local Experimental Update - 2026-07-05 v0.1.69 Focused Play Module Extraction
- Web/local version moved to v0.1.69 for structural containment during the major rework.
- Android AAB generation and Play Console upload remain paused.
- No Android numbering changes were made in this slice.

## Local Experimental Update - 2026-07-05 v0.1.70 Puzzle Hub And Stage List Extraction
- Web/local version moved to v0.1.70 for app shell containment during the major rework.
- Android AAB generation and Play Console upload remain paused.
- No Android numbering changes were made in this slice.

## Local Experimental Update - 2026-07-05 v0.1.71 Completion Banner Routing Check
- Web/local version moved to v0.1.71 after reconnecting focused-play completion Album routing.
- Completion remains user-paced rather than auto-advancing.
- Android AAB generation and Play Console upload remain paused.

## Local Experimental Update - 2026-07-05 v0.1.72 Settings Dialog Extraction
- Web/local version moved to v0.1.72 for app shell containment during the major rework.
- Android AAB generation and Play Console upload remain paused.
- No Android numbering changes were made in this slice.

## Local Experimental Update - 2026-07-05 v0.1.73 App Chrome Extraction
- Web/local version moved to v0.1.73 for app shell containment during the major rework.
- Android AAB generation and Play Console upload remain paused.
- No Android numbering changes were made in this slice.

## Local Experimental Update - 2026-07-05 v0.1.74 UI Preference Module Extraction
- Web/local version moved to v0.1.74 for app shell containment during the major rework.
- Android AAB generation and Play Console upload remain paused.
- No Android numbering changes were made in this slice.

## Local Experimental Update - 2026-07-05 v0.1.75 Daily Card And Stage Navigation Extraction
- Web/local version moved to v0.1.75 for app shell containment during the major rework.
- Android AAB generation and Play Console upload remain paused.
- No Android numbering changes were made in this slice.

## Local Experimental Update - 2026-07-05 v0.1.76 Time Attack Flow Extraction
- Web/local version moved to v0.1.76 for app shell containment during the major rework.
- Android AAB generation and Play Console upload remain paused.
- No Android numbering changes were made in this slice.

## Local Experimental Update - 2026-07-05 v0.1.77 Time Attack Hub Expansion
- Web/local version moved to v0.1.77 for Time Attack usability polish during the major rework.
- Android AAB generation and Play Console upload remain paused.
- No Android numbering changes were made in this slice.

## Local Experimental Update - 2026-07-05 v0.1.78 Puzzle Assist View Extraction
- Web/local version moved to v0.1.78 for tutorial/hint UI containment during the major rework.
- Android AAB generation and Play Console upload remain paused.
- No Android numbering changes were made in this slice.

## Local Experimental Update - 2026-07-05 v0.1.79 Puzzle Cursor Controls Extraction
- Web/local version moved to v0.1.79 for larger-board cursor/D-pad control containment during the major rework.
- Android AAB generation and Play Console upload remain paused.
- No Android numbering changes were made in this slice.

## Local Experimental Update - 2026-07-05 v0.1.80 Pip Guided Dialogue Onboarding
- Web/local version moved to v0.1.80 for Pip-led first-run puzzle and Time Attack guide dialogs.
- Added approved raster guide art and per-player guide-seen save tracking.
- Android AAB generation and Play Console upload remain paused.
- No Android numbering changes were made in this slice.

## Local Experimental Update - 2026-07-05 v0.1.81 Pip Character Continuity Correction
- Web/local version moved to v0.1.81 after correcting the guide art identity drift.
- The generated guide image from v0.1.80 is now rejected/hidden because it did not preserve Pip's Sunny Spoon character identity.
- Guide dialogs now use established baseline Sunny Spoon/Pip raster art until a new Pip-consistent guide scene is explicitly approved.
- Android AAB generation and Play Console upload remain paused.
- No Android numbering changes were made in this slice.

## Local Experimental Update - 2026-07-05 v0.1.82 Art Cohesion Reset Start
- Web/local version moved to v0.1.82 after starting the coordinated Sunny Spoon/Pip art-system reset.
- Removed the inconsistent cast-sheet collage from the opening game identity screen until a coherent key visual is approved.
- Added an art rework roadmap and QA coverage against the old opening cast-sheet returning.
- Android AAB generation and Play Console upload remain paused.
- No Android numbering changes were made in this slice.

## Local Experimental Update - 2026-07-05 v0.1.83 Runtime Art Import Guard
- Web/local version moved to v0.1.83 for art-pipeline hardening.
- Asset QA now blocks candidate/rejected/hidden-only asset paths from being referenced by runtime source files.
- Current visible temporary art debt is explicitly tracked for spoon currency, Pip chrome, and completion reaction art.
- Android AAB generation and Play Console upload remain paused.
- No Android numbering changes were made in this slice.

## Local Experimental Update - 2026-07-05 v0.1.84 Pip Master Art Candidate Intake
- Web/local version moved to v0.1.84 after adding a hidden Pip master key visual candidate for review.
- The candidate is registered as hidden and not wired into runtime UI or the production bundle.
- Added a dedicated Pip master art review note before any visible approval decision.
- Android AAB generation and Play Console upload remain paused.
- No Android numbering changes were made in this slice.

## Local Experimental Update - 2026-07-05 v0.1.85 Pip Master Art Review Board
- Web/local version moved to v0.1.85 after adding a docs-only Pip master art comparison board.
- Added `docs/art-review/pip-master-review-v1.html` to compare baseline Pip references, rejected drift, and the hidden master candidate against explicit identity criteria.
- No new candidate art was wired into runtime UI; the master candidate remains hidden and manifest-gated.
- No signed AAB was rebuilt; Android upload remains paused during the experimental art-system reset.

## Local Experimental Update - 2026-07-05 v0.1.86 Korean Guide Copy Repair
- Web/local version moved to v0.1.86 after repairing Korean first-run guide and hint copy mojibake.
- Added i18n regression coverage for Korean guide/hint readability.
- No new candidate art was wired into runtime UI; the master candidate remains hidden and manifest-gated.
- No signed AAB was rebuilt; Android upload remains paused during the experimental art-system reset.

## Local Experimental Update - 2026-07-05 v0.1.87 Time Attack Save Retention
- Web/local version moved to v0.1.87 after adding Time Attack daily-count save retention.
- `timeAttackDailyCount` now keeps only recent valid local-date keys during save normalization, limiting long-term save growth.
- Added save regression coverage for stale/malformed daily-count key pruning.
- No signed AAB was rebuilt; Android upload remains paused during the experimental art-system reset.

## Local Experimental Update - 2026-07-05 v0.1.88 Art-Gated Guide And Pantry QA
- Web/local version moved to v0.1.88 after adding manifest-gated guide art rendering and Pantry paused-state QA.
- v0.1.97 reopens Pantry shop/equip UI with six approved visible Sunny Spoon pantry-decoration raster assets.
- Guide dialog art now has an explicit manifest approval guard around the current baseline raster import.
- No signed AAB was rebuilt; Android upload remains paused during the experimental art-system reset.

## Local Experimental Update - 2026-07-05 v0.1.89 Spoon Token Candidate Intake
- Web/local version moved to v0.1.89 after adding a hidden transparent spoon currency candidate.
- `spoon-token-candidate-v2` is registered as hidden candidate art only; runtime UI still uses the existing temporary spoon token.
- Added `docs/SPOON_TOKEN_ART_REVIEW.md` to track review and approval criteria before any currency replacement.
- No signed AAB was rebuilt; Android upload remains paused during the experimental art-system reset.

## Local Experimental Update - 2026-07-05 v0.1.90 Runtime Manifest Isolation
- Web/local version moved to v0.1.90 after isolating the full asset manifest from runtime imports.
- Runtime guide art and Pantry decoration approval now use a small approved allowlist instead of importing hidden candidate manifest records into the production JS bundle.
- Asset QA now blocks direct runtime imports of `assetManifest.js`.
- No signed AAB was rebuilt; Android upload remains paused during the experimental art-system reset.

## Local Experimental Update - 2026-07-05 v0.1.91 Approved Spoon Token Runtime Swap
- Web/local version moved to v0.1.91 after promoting the user-approved spoon token into runtime UI.
- `spoon-token-v2` is now approved visible currency art; `spoon-token-v1` is hidden legacy audit art.
- Runtime UI imports now use the optimized 256x256 transparent spoon token.
- No signed AAB was rebuilt; Android upload remains paused during the experimental art-system reset.


## Local Experimental Update - 2026-07-05 v0.1.92 Pip Chrome And Completion Candidate Intake
- Web/local version moved to v0.1.92 after adding hidden Pip chrome and completion reaction candidates.
- `pip-chrome-candidate-v2` and `pip-completion-candidate-v2` are review-only transparent PNG assets and are not wired into runtime UI.
- The current visible Pip chrome/completion stickers remain temporary approved baseline art until the new candidates pass explicit character-continuity review.
- No signed AAB was rebuilt; Android upload remains paused during the experimental art-system reset.


## Local Experimental Update - 2026-07-05 v0.1.93 First Stage Reward Candidate Intake
- Web/local version moved to v0.1.93 after adding a hidden first free-stage reward art candidate.
- `pips-first-shelf-reward-candidate-v1` is review-only and is not wired into `stageArt.js` or runtime UI.
- Stage reward surfaces remain in their conservative pending-art state until approved visible reward art exists.
- No signed AAB was rebuilt; Android upload remains paused during the experimental art-system reset.


## Local Experimental Update - 2026-07-05 v0.1.94 Approved Art Runtime Promotion
- Web/local version moved to v0.1.94 after promoting approved Pip chrome, Pip completion, and first-stage reward art into runtime UI.
- The previous visible temporary Pip chrome/completion assets are now hidden legacy audit records.
- The first free-stage reward art is now available through `stageArt.js` for `pips-first-shelf`.
- No signed AAB was rebuilt; Android upload remains paused during the experimental art-system reset.


## Local Experimental Update - 2026-07-05 v0.1.95 Free Stage Reward Art Set
- Web/local version moved to v0.1.95 after adding approved runtime reward art for all five free stage packs.
- `stageArt.js` now maps Pip's First Shelf, Sunny Spoon Sign, Apron Drawer, Bakery Window, and Village Pantry to approved WebP stage reward art.
- No signed AAB was rebuilt; Android upload remains paused during the experimental art-system reset.


## Local Experimental Update - 2026-07-05 v0.1.96 Free Stage Badge Art Set
- Web/local version moved to v0.1.96 after adding approved collectible badge art for all five free stage packs.
- Badge shelf and Pantry Map badge collection cards now use approved badge art through `src/data/badgeArt.js`.
- No signed AAB was rebuilt; Android upload remains paused during the experimental art-system reset.

### v0.1.97 Pantry Decoration MVP
- Pantry shop/equip UI is live locally with approved v2 decoration WebP assets.
- Android packaging remains deferred until the user explicitly requests a release build.

### v0.1.98 Pantry First Purchase Guide
- Added the one-time Pip guide after the first decoration purchase and documented Pantry placement/economy guardrails.
- Android packaging remains deferred until explicitly requested.

### v0.1.99 Pantry Placement Affordances
- Pantry room slots now act as visible placement filters, making fixed slot placement understandable before purchase.
- Android packaging remains deferred until explicitly requested.

### v0.1.100 Pantry Economy Guardrails
- Decoration economy values now match the approved spec and are enforced by asset QA.
- Android packaging remains deferred until explicitly requested.

### v0.1.101 Pantry Placement Mobile QA
- Mobile visual QA now covers Pantry placement filters and slot-specific shop behavior.
- Android packaging remains deferred until explicitly requested.

### v0.1.102 Pantry First Purchase Callback Fix
- Fixed the first-purchase Pantry guide callback and added mobile QA coverage for the guide overlay.
- Android packaging remains deferred until explicitly requested.

### v0.1.103 Opening Key Visual
- Brand intro now uses an approved Sunny Spoon/Pip key visual WebP with mobile QA coverage.
- Android packaging remains deferred until explicitly requested.


### v0.1.104 Pantry Common Decoration Expansion
- Local web version now includes 10 approved Pantry decorations, adding four common-priced items across counter, window, back-wall, and shelf slots.
- Android packaging remains deferred until explicitly requested.


### Post-v0.1.104 Review 20 QA Hardening
- Added local asset QA coverage for approved stage reward art mappings after Review 20.
- Android packaging remains deferred until explicitly requested.


### v0.1.105 Pantry Slot Decoration Set 15
- Local web version now includes 15 approved Pantry decorations across all five room slots.
- Android packaging remains deferred until explicitly requested.


### v0.1.106 Pantry Cozy Decoration Goals
- Local web version now includes 20 approved Pantry decorations with a cozy upgrade target for every room slot.
- Android packaging remains deferred until explicitly requested.


### v0.1.107 Pantry Rare Decoration Goals
- Local web version now includes 25 approved Pantry decorations with rare long-term goals for every room slot.
- Android packaging remains deferred until explicitly requested.


### v0.1.108 Pantry Rarity Filters
- Local web version now includes Pantry rarity filters for the 25-item decoration catalog.
- Android packaging remains deferred until explicitly requested.


### v0.1.109 Pantry Availability Filters
- Local web version now includes Pantry availability filters for the 25-item decoration catalog.
- Android packaging remains deferred until explicitly requested.


### v0.1.110 Pantry Filter Empty State

- Local web version now includes a guided empty state and reset action for Pantry filter combinations with no results.
- Android packaging remains deferred until explicitly requested.


### v0.1.111 Pantry Filter Summary

- Local web version now includes a Pantry filter result summary and clear-filters action for the expanded decoration catalog.
- Android packaging remains deferred until explicitly requested.


### v0.1.112 Pantry Sort And Recommendation Badges

- Local web version now includes Pantry sorting controls and item recommendation/status badges for the expanded decoration shop.
- Android packaging remains deferred until explicitly requested.


### v0.1.113 Pantry Placement Advisor

- Local web version now includes a Pantry placement advisor that explains item count, owned count, and price range for selected room slots.
- Android packaging remains deferred until explicitly requested.


### v0.1.114 Pantry Savings Goal

- Local web version now includes a Pantry savings-goal card that shows the next decoration target and remaining spoon gap.
- Android packaging remains deferred until explicitly requested.


### v0.1.115 Pantry Collection Progress

- Local web version now includes a Pantry collection progress board with overall and per-slot decoration counts.
- Android packaging remains deferred until explicitly requested.


### v0.1.116 Pantry Item Savings Meters

- Local web version now includes per-decoration spoon progress meters for unowned paid Pantry items.
- Android packaging remains deferred until explicitly requested.


### v0.1.117 Pantry Placement Swap Notes

- Local web version now includes card-level Pantry placement notes explaining empty-slot placement or display replacement.
- Android packaging remains deferred until explicitly requested.


### Post-v0.1.117 Pantry Purchase QA Hardening

- Local QA now verifies the first Pantry purchase updates collection progress and fills the counter slot.
- Android packaging remains deferred until explicitly requested.


### v0.1.118 Pantry Display Plan

- Local web version now includes a Pantry display-plan card for selected room spots, including current display state and next upgrade guidance.
- Android packaging remains deferred until explicitly requested.


### v0.1.119 Pantry Browsing State Retention

- Local web version now preserves Pantry filter and selected-slot context across purchase/equip refreshes.
- Android packaging remains deferred until explicitly requested.


### v0.1.120 Pantry Purchase Feedback

- Local web version now shows a Pantry action feedback card after decoration purchase/equip, using approved decoration art.
- Android packaging remains deferred until explicitly requested.


### v0.1.121 Pantry Earning Plan

- Local web version now shows a Pantry earning-plan card for the next decoration goal using the shared economy config.
- Android packaging remains deferred until explicitly requested.


### v0.1.122 Pantry Earning CTA

- Local web version now links Pantry decoration goals back to puzzle play through a Play for spoons CTA.
- Android packaging remains deferred until explicitly requested.


### v0.1.123 Pantry Goal Tracking

- Local web version now supports tracking a desired Pantry decoration goal and retargeting the savings/earning plan to that item.
- Android packaging remains deferred until explicitly requested.


### v0.1.124 Replay Reward Guardrails

- Local web version now includes save-layer guardrails for future Pip Replay Pick rewards: clean picked replay only, daily cap 3, and one reward per puzzle per day.
- Android packaging remains deferred until explicitly requested.


### v0.1.125 Replay Picks Hub Surface
- Added the visible Pip Replay Picks hub card for completed unlocked puzzles, including daily limit copy and mobile QA coverage.
- Replay reward claiming remains gated behind the next challenge replay state slice so completed puzzle saves remain stable.


### v0.1.126 Replay Challenge Session
- Added the local replay challenge flow behind Pip Replay Picks, with ephemeral board state and clean-run reward gating.
- Android packaging remains paused until this experimental economy loop receives local approval.


### v0.1.127 Replay Clean Undo Guard
- Added cumulative clean-status tracking for Replay Picks: undo does not restore reward eligibility after a wrong fill or hint use.
- Android packaging remains paused during the experimental economy loop.

### v0.1.128 Reusable Sunny Spoon Studios Bumper Art
- Added approved reusable Sunny Spoon Studios bumper art to the first launch stage.
- Runtime uses optimized WebP at `src/assets/brand/sunny-spoon-studios-bumper-v1.webp`; PNG source remains archived for review/rework.
- Studio bumper art is guarded through `runtimeArt.js` and asset manifest QA.
- Web/local version moved to v0.1.128.

### v0.1.129 Pantry Story Request Benchmark Pass
- Added a story-framed first Pantry request card to make the starter decoration purchase feel like Pip's room request.
- Mobile QA now verifies the Pantry request card and target item surface.
- Web/local version moved to v0.1.129.


### v0.1.130 Pantry Story Milestone

- Added a post-first-request Pantry milestone card with room-level feedback and next-arrival decoration previews.
- Added mobile QA selectors for the milestone surface.
- Web/local version moved to v0.1.130.


### v0.1.131 Pantry Delivery Note Goal

- Next-arrival Pantry preview items now open a Pip delivery note goal card.
- Mobile visual QA now verifies the delivery-note card after the first Pantry purchase milestone.
- Web/local version moved to v0.1.131.


### v0.1.132 Pantry Story Split And Delivery Complete

- Split Pantry story card rendering into src/ui/pantryStoryCards.js to keep pantryView.js below the next maintainability threshold.
- Added delivery-complete feedback when a pinned delivery-note target is purchased/equipped.
- Web/local version moved to v0.1.132.

### v0.1.133 Pantry Shop Progressive Reveal

- Pantry shop now defaults to 6 prioritized cards and expands by batch with a Show more decorations control.
- Mobile QA verifies the 6/25 initial reveal and 12-card expansion across 360x740, 390x844, and 430x932.
- Web/local version moved to v0.1.133.

### v0.1.134 Pantry Planning Deck

- Pantry support cards are now grouped into a single planning deck to reduce scattered top-of-page card stacking in mobile preview.
- Mobile QA verifies the grouped deck plus existing 6/25 progressive shop reveal on 360x740, 390x844, and 430x932.
- Web/local version moved to v0.1.134.

### v0.1.135 Durable Pantry Delivery Goal

- Pantry delivery-note goals now persist through save state instead of living only in module memory.
- Mobile QA verifies the delivery note survives a page reload, then clears when the goal decoration is purchased.
- Web/local version moved to v0.1.135.


### v0.1.136 Pantry Delivery Completion History
- Pantry delivery request completion is now durable: completed request ids are stored in `pantryCompletedStoryGoalIds`.
- Purchase/equip paths dedupe completed delivery ids and clear the active goal only when the target is actually satisfied.
- Added test and mobile QA coverage for the completed Small Jam Jar delivery save state.
- Web/local version moved to v0.1.136.


### v0.1.137 Pantry Request Completion Archive
- Completed Pantry delivery requests now surface in a visible request-log card.
- Mobile QA checks the request-log card after completing the Small Jam Jar delivery.
- Web/local version moved to v0.1.137.


### v0.1.138 Pantry Room Step Progress
- Pantry request history now shows next-room-step progress from completed delivery counts.
- Mobile QA verifies the completed Small Jam Jar request shows 1/3 progress toward the next room step.
- Web/local version moved to v0.1.138.

### v0.1.139 Pantry Story Stage Gate
- Web/local version moved to v0.1.139.
- Unlockable puzzle stages now require both spoons and Pantry delivery progress before a new pack can be opened.
- The gate is save-compatible: previously unlocked stages remain unlocked, but new unlock attempts must satisfy the room-step requirement.
- Pending validation: unit tests, asset manifest QA, production build, HTTP smoke, and mobile visual QA.

### v0.1.140 Badge Map Gate Clarity
- Web/local version moved to v0.1.140.
- Badge/map locked cards now expose the Pantry room-step gate used by puzzle pack unlocks.
- Android packaging remains deferred until explicitly requested.

### v0.1.141 Stage Gate Pantry Action
- Web/local version moved to v0.1.141.
- Locked stage cards now provide a direct Pantry action when the story gate blocks a new stage.
- Android packaging remains deferred until explicitly requested.

### v0.1.142 Pantry Stage Goal
- Web/local version moved to v0.1.142.
- Pantry request-log progress now names the next puzzle stage tied to room-step progress.
- Android packaging remains deferred until explicitly requested.


### v0.1.143 Stage Art QA Guard
- Web/local version moved to v0.1.143.
- Mobile visual QA now asserts stage previews use approved tile artwork instead of pending-art placeholders.
- Android packaging remains deferred until explicitly requested.


### v0.1.144 Pantry Archive Next Request
- Web/local version moved to v0.1.144.
- Completed Pantry request logs now offer a direct Plan request CTA for the next Pip delivery note.
- Android packaging remains deferred until explicitly requested.


### v0.1.145 Pantry Room Chapter Signal
- Web/local version moved to v0.1.145.
- Pantry request logs now expose the current room chapter progress for the decoration/story loop.
- Android packaging remains deferred until explicitly requested.


### v0.1.146 Pantry Stage Spoon Gate
- Web/local version moved to v0.1.146.
- Pantry archive stage goals now include the spoon key requirement alongside request progress.
- Android packaging remains deferred until explicitly requested.


### v0.1.147 Legacy Unlockable Dot Cleanup
- Web/local version moved to v0.1.147.
- Removed stale unlockable puzzle-chip dot styling from the old puzzle-level lock experiment.

### v0.1.148 Source Hygiene QA Guard
- Web/local version moved to v0.1.148.
- Added `npm run qa:hygiene` so source BOMs and legacy puzzle-chip dot styling are blocked by automated release checks.

### v0.1.149 Pack Size Contract
- Web/local version moved to v0.1.149.
- Added puzzle data coverage so progression pack declared board sizes must match their current maximum shipped puzzle size before more 10x10+ content is added.

### v0.1.150 Puzzle Scale Test Flex
- Web/local version moved to v0.1.150.
- Relaxed puzzle data tests from fixed 100/40/50/10 counts into scalable catalog contracts so future puzzle additions are not blocked by stale test constants.

### v0.1.151 First 12x12 Catalog Puzzle
- Web/local version moved to v0.1.151.
- Added the first authored 12x12 free progression puzzle and raised Bakery Window's declared size to match the shipped catalog.

### v0.1.152 12x12 Mobile QA Path
- Web/local version moved to v0.1.152.
- Mobile visual QA now opens the 12x12 catalog puzzle and verifies 144-cell focused play rendering with hints and cursor controls.
- Android packaging remains deferred until explicitly requested.

## v0.1.153 - 12x12 Bakery Mini Batch
- Added a small 12x12 Bakery Window puzzle batch and QA coverage. Android bundle generation remains paused while the rework continues locally.
- Verification after this slice: `node --check tests\\puzzleData.test.js`, `node --check scripts\\mobile_visual_check.js`, and `node --check src\\data\\puzzles.js` passed; targeted `tests/puzzleData.test.js` passed 6 tests; full `npm run test -- --run` passed 52 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932 with the three-card 12x12 Bakery Window catalog check.


## v0.1.154 - Intro And Settings Polish
- Polished the web opening screen seal/start button and settings dialog styling. Android bundle generation remains paused while the rework continues locally.
- Verification after this slice: `node --check src\\ui\\brandIntro.js` and `node --check src\\ui\\settingsView.js` passed; full `npm run test -- --run` passed 52 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK; Playwright visual capture found 0 overflowing opening/settings controls and reduced the settings dialog height from about 808px to about 731px on 390x844; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.


## v0.1.155 - First-Impression QA Guard
- Added mobile QA guards for opening seal/start-button polish and settings dialog layout. Android bundle generation remains paused while the rework continues locally.
- Verification after this slice: `node --check scripts\\mobile_visual_check.js` passed; full `npm run test -- --run` passed 52 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932 with the opening seal/start-button and settings-dialog polish guards active.

## v0.1.156 - Opening Seal Asset Guard
- Added source-level asset QA for the opening seal art. Android bundle generation remains paused while the rework continues locally.
- Verification after this slice: `node --check scripts\\asset_manifest_check.js` passed; `npm run qa:assets` passed with 122 assets; full `npm run test -- --run` passed 52 tests; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.

## v0.1.157 - Tactile Button System Polish
- Added shared tactile styling for primary gameplay controls and navigation. Android bundle generation remains paused while the rework continues locally.
- Verification after this slice: `npm run qa:assets` passed with 122 assets; `node --check scripts\\mobile_visual_check.js` passed; full `npm run test -- --run` passed 52 tests; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.

## v0.1.158 - App Chrome Polish
- Polished the web header/HUD and floating nav presentation. Android bundle generation remains paused while the rework continues locally.
- Verification after this slice: `npm run qa:assets` passed with 122 assets; `node --check scripts\\mobile_visual_check.js` passed; full `npm run test -- --run` passed 52 tests; `npm run build` passed; local HTTP smoke returned 200 OK; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932.

## v0.1.159 - App Chrome QA Guard
- Added mobile QA guards for header/HUD and floating-nav visual polish. Android bundle generation remains paused while the rework continues locally.
- Verification after this slice: `node --check scripts\\mobile_visual_check.js` passed; `npm run qa:mobile` passed for 360x740, 390x844, and 430x932 with the app chrome polish guard active; full `npm run test -- --run` passed 52 tests; `npm run qa:assets` passed with 122 assets; `npm run build` passed; local HTTP smoke returned 200 OK.
## v0.1.160 - Completion Reward Polish
- Upgraded solved puzzle and stage completion reward UI styling for stronger first-session polish.
- Keeps approved raster Pip/stage assets as the visual source while improving the surrounding app chrome.
- Verification pending: assets, tests, build, HTTP, mobile QA.
## v0.1.161 - Reward Polish QA Guards
- Mobile QA now guards completion reward and stage-complete reward visual contracts.
- Verification passed: `npm run qa:mobile`, `npm run qa:assets`, `npm run test -- --run`, `npm run build`, and HTTP 200 local server check.
## v0.1.162 - Settings Dialog Polish
- Upgraded settings dialog visual hierarchy and tactile controls.
- Verification passed by v0.1.163 mobile polish guard plus standard assets/tests/build/HTTP gate.
## v0.1.163 - Settings Polish QA Guard
- Added direct mobile QA checks for settings dialog visual polish.
- Also confirms v0.1.162 settings polish through the same mobile visual QA flow.
- Verification passed: `npm run qa:mobile`, `npm run qa:assets`, `npm run test -- --run`, `npm run build`, and HTTP 200 local server check.
## v0.1.164 - iOS Safe Area Chrome Guard
- Addressed Claude Review 27 follow-up: top bar can no longer rely on fixed 16px padding only on iOS safe-area devices.
- Verification passed: `npm run qa:mobile`, `npm run qa:assets`, `npm run test -- --run`, `npm run build`, and HTTP 200 local server check.
## v0.1.165 - Replay Picks Polish
- Upgraded replay picks visual treatment and added mobile QA guard coverage.
- Verification passed: `npm run qa:mobile`, `npm run qa:assets`, `npm run test -- --run`, `npm run build`, and HTTP 200 local server check.
## v0.1.166 - Album And Map Polish
- Upgraded album and badge map presentation to reduce placeholder feel in collection/progression screens.
- Verification passed: `npm run qa:mobile`, `npm run qa:assets`, `npm run test -- --run`, `npm run build`, and HTTP 200 local server check.
## v0.1.167 - 12x12 Bakery Content Batch 2
- Expanded the curated 12x12 Bakery Window catalog from 3 to 5 puzzles.
- Verification passed: `npm run test -- tests/puzzleData.test.js --run`, `npm run qa:mobile`, `npm run qa:assets`, `npm run test -- --run`, `npm run build`, and HTTP 200 local server check.
## v0.1.168 - Village Pantry 10x10 Content Batch
- Expanded late-stage Village Pantry content with two curated 10x10 puzzles.
- Verification passed: `npm run test -- tests/puzzleData.test.js --run`, `npm run qa:mobile`, `npm run qa:assets`, `npm run test -- --run`, `npm run build`, and HTTP 200 local server check.
## v0.1.169 - Village Pantry 10x10 Content Batch 2
- Expanded late-stage Village Pantry content with two additional curated 10x10 puzzles.
- Verification passed: `npm run test -- tests/puzzleData.test.js --run`, `npm run qa:mobile`, `npm run qa:assets`, `npm run test -- --run`, `npm run build`, and HTTP 200 local server check.
## v0.1.170 - 12x12 Bakery Content Batch 3
- Expanded the curated 12x12 Bakery Window catalog from 5 to 7 puzzles.
- Verification passed: `npm run test -- tests/puzzleData.test.js --run`, `npm run qa:mobile`, `npm run qa:assets`, `npm run test -- --run`, `npm run build`, and HTTP 200 local server check.
## v0.1.171 - Puzzle Catalog Report Guard
- Added a local catalog report QA command for content-volume planning before larger puzzle batches.
- Verification passed: `npm run qa:catalog`, `npm run test -- tests/puzzleCatalogReport.test.js --run`, `npm run qa:hygiene`, `npm run qa:mobile`, `npm run qa:assets`, `npm run test -- --run`, `npm run build`, and HTTP 200 local server check.
## v0.1.172 - Village Pantry 10x10 Content Batch 3
- Expanded late-stage Village Pantry content with two additional curated 10x10 puzzles.
- Verification passed: `npm run qa:catalog`, `npm run test -- tests/puzzleData.test.js tests/puzzleCatalogReport.test.js --run`, `npm run qa:hygiene`, `npm run qa:mobile`, `npm run qa:assets`, `npm run test -- --run`, `npm run build`, and HTTP 200 local server check.
## v0.1.173 - Village Pantry Mobile Catalog Guard
- Added mobile visual QA coverage for the expanded Village Pantry 10x10 catalog.
- Verification passed: `npm run qa:mobile`, `npm run qa:catalog`, `npm run qa:hygiene`, `npm run qa:assets`, `npm run test -- --run`, `npm run build`, and HTTP 200 local server check.
## v0.1.174 - 12x12 Bakery Content Batch 4
- Expanded the curated 12x12 Bakery Window catalog from 7 to 9 puzzles.
- Verification passed: `npm run qa:catalog`, `npm run test -- tests/puzzleData.test.js tests/puzzleCatalogReport.test.js --run`, `npm run qa:hygiene`, `npm run qa:mobile`, `npm run qa:assets`, `npm run test -- --run`, `npm run build`, and HTTP 200 local server check.
## v0.1.175 - Village Pantry 10x10 Content Batch 4
- Expanded late-stage Village Pantry content from 12 to 14 10x10 puzzles.
- Verification passed: `npm run qa:catalog`, `npm run test -- tests/puzzleData.test.js tests/puzzleCatalogReport.test.js --run`, `npm run qa:mobile`, `npm run qa:assets`, `npm run test -- --run`, `npm run build`, and HTTP 200 local server check.
## v0.1.176 - 12x12 Bakery Content Batch 5
- Expanded the curated 12x12 Bakery Window catalog from 9 to 11 puzzles.
- Verification passed: `npm run qa:catalog`, `npm run test -- tests/puzzleData.test.js tests/puzzleCatalogReport.test.js --run`, `npm run qa:hygiene`, `npm run qa:mobile`, `npm run qa:assets`, `npm run test -- --run`, `npm run build`, and HTTP 200 local server check.
## v0.1.177 - Village Pantry 10x10 Content Batch 5
- Expanded late-stage Village Pantry content from 14 to 16 10x10 puzzles.
- Verification passed: `npm run qa:catalog`, `npm run test -- tests/puzzleData.test.js tests/puzzleCatalogReport.test.js --run`, `npm run qa:hygiene`, `npm run qa:mobile`, `npm run qa:assets`, `npm run test -- --run`, `npm run build`, and HTTP 200 local server check.
## v0.1.178 - 12x12 Bakery Content Batch 6
- Expanded the curated 12x12 Bakery Window catalog from 11 to 13 puzzles.
- Verification passed: `npm run qa:catalog`, `npm run test -- tests/puzzleData.test.js tests/puzzleCatalogReport.test.js --run`, `npm run qa:hygiene`, `npm run qa:mobile`, `npm run qa:assets`, `npm run test -- --run`, `npm run build`, and HTTP 200 local server check.
## v0.1.179 - Village Pantry 10x10 Content Batch 6
- Expanded late-stage Village Pantry content from 16 to 18 10x10 puzzles.
- Verification passed: `npm run qa:catalog`, `npm run test -- tests/puzzleData.test.js tests/puzzleCatalogReport.test.js --run`, `npm run qa:hygiene`, `npm run qa:mobile`, `npm run qa:assets`, `npm run test -- --run`, `npm run build`, and HTTP 200 local server check.

## v0.1.180 - Village Pantry Translation Metadata Guard
- Fixed the Review 29 titleKey/i18n follow-up for recent Village Pantry content. Android bundle generation remains paused while the rework continues locally.
- Verification passed: syntax checks, targeted i18n/data/catalog tests, `npm run qa:catalog`, `npm run qa:hygiene`, `npm run qa:assets`, full `npm run test -- --run`, `npm run build`, HTTP 200 local server check, and `npm run qa:mobile`.

## v0.1.181 - Large-Board Translation Metadata Guard
- Extended the Review 29 fix into a full large-board catalog metadata guard. Android bundle generation remains paused while the rework continues locally.
- Verification passed: syntax checks, targeted i18n/data/catalog tests, `npm run qa:catalog`, `npm run qa:hygiene`, `npm run qa:assets`, full `npm run test -- --run`, `npm run build`, HTTP 200 local server check, and `npm run qa:mobile`.

## v0.1.182 - Catalog Metadata QA Guard
- Strengthened catalog QA for future large-board puzzle expansion. Android bundle generation remains paused while the rework continues locally.
- Verification passed: syntax checks, targeted catalog tests, `npm run qa:catalog`, `npm run qa:hygiene`, `npm run qa:assets`, full `npm run test -- --run`, `npm run build`, HTTP 200 local server check, and `npm run qa:mobile`.

## v0.1.183 - 12x12 Bakery Content Batch 7
- Expanded the curated Bakery Window 12x12 catalog from 13 to 15 puzzles. Android bundle generation remains paused while the rework continues locally.
- Verification passed: syntax checks, targeted data/catalog tests, `npm run qa:catalog`, `npm run qa:hygiene`, `npm run qa:assets`, full `npm run test -- --run`, `npm run build`, HTTP 200 local server check, and `npm run qa:mobile`.

## v0.1.184 - Village Pantry 10x10 Content Batch 7
- Expanded late-stage Village Pantry content from 18 to 20 10x10 puzzles. Android bundle generation remains paused while the rework continues locally.
- Verification passed: syntax checks, targeted data/catalog tests, `npm run qa:catalog`, `npm run qa:hygiene`, `npm run qa:assets`, full `npm run test -- --run`, `npm run build`, HTTP 200 local server check, and `npm run qa:mobile`.

## v0.1.185 - 12x12 Bakery Content Batch 8
- Expanded the curated Bakery Window 12x12 catalog from 15 to 17 puzzles. Android bundle generation remains paused while the rework continues locally.
- Verification passed: syntax checks, targeted data/catalog tests, `npm run qa:catalog`, `npm run qa:hygiene`, `npm run qa:assets`, full `npm run test -- --run`, `npm run build`, HTTP 200 local server check, and `npm run qa:mobile`.

## v0.1.186 - Village Pantry 10x10 Content Batch 8
- Expanded late-stage Village Pantry content from 20 to 22 10x10 puzzles. Android bundle generation remains paused while the rework continues locally.
- Verification passed: syntax checks, targeted data/catalog tests, `npm run qa:catalog`, `npm run qa:hygiene`, `npm run qa:assets`, full `npm run test -- --run`, `npm run build`, HTTP 200 local server check, and `npm run qa:mobile`.

## v0.1.187 - Puzzle Batch Intake Guard
- Added a reusable pre-catalog puzzle batch intake guard for future content expansion. Android bundle generation remains paused while the rework continues locally.
- Verification passed: syntax checks, direct batch test, `npm run qa:catalog`, `npm run qa:hygiene`, `npm run qa:assets`, full `npm run test -- --run`, `npm run build`, HTTP 200 local server check, and `npm run qa:mobile`.

## v0.1.188 - Village Pantry 10x10 Batch
- Added two Village Pantry 10x10 puzzles with English/Korean catalog names and explicit `titleKey` metadata.
- Verification passed: syntax checks, direct batch test, `npm run qa:catalog`, `npm run qa:hygiene`, `npm run qa:assets`, full `npm run test -- --run`, `npm run build`, HTTP 200 local server check, and `npm run qa:mobile`.

## v0.1.189 - Bakery Window 12x12 Batch
- Added two Bakery Window 12x12 puzzles with English/Korean catalog names and explicit `titleKey` metadata.
- Verification passed: syntax checks, direct batch test, `npm run qa:catalog`, `npm run qa:hygiene`, `npm run qa:assets`, full `npm run test -- --run`, `npm run build`, HTTP 200 local server check, and `npm run qa:mobile`.

## v0.1.190 - Village Pantry 10x10 Pair
- Added two Village Pantry 10x10 puzzles with English/Korean catalog names and explicit `titleKey` metadata.
- Verification passed: syntax checks, direct batch test, `npm run qa:catalog`, `npm run qa:hygiene`, `npm run qa:assets`, full `npm run test -- --run`, `npm run build`, HTTP 200 local server check, and `npm run qa:mobile`.

## v0.1.191 - Readable Puzzle Art Intake
- Added two Bakery Window 12x12 puzzles designed around bold, readable silhouettes and future color mood metadata.
- Strengthened the batch intake guard to require art readability briefs for future large-board candidates.
- Verification passed: syntax checks, batch/readability guard test, targeted data/catalog tests, `npm run qa:catalog`, `npm run qa:hygiene`, `npm run qa:assets`, full `npm run test -- --run`, `npm run build`, HTTP 200 local server check, and `npm run qa:mobile`.

## v0.1.192 - Village Readable Puzzle Pair
- Added two Village Pantry 10x10 puzzles designed around simple, instantly readable pantry silhouettes.
- Verification passed: syntax checks, batch/readability guard test, targeted data/catalog tests, `npm run qa:catalog`, `npm run qa:hygiene`, `npm run qa:assets`, full `npm run test -- --run`, `npm run build`, HTTP 200 local server check, and `npm run qa:mobile`.

## v0.1.193 - Bakery Readable Puzzle Pair
- Added two Bakery Window 12x12 puzzles designed around instantly readable cozy bakery silhouettes.
- Verification passed: syntax checks, batch/readability guard test, targeted data/catalog tests, `npm run qa:catalog`, `npm run qa:hygiene`, `npm run qa:assets`, full `npm run test -- --run`, `npm run build`, HTTP 200 local server check, and `npm run qa:mobile`.

## v0.1.194 - Village Readable Puzzle Pair
- Added two Village Pantry 10x10 puzzles designed around instantly readable village pantry silhouettes.
- Verification passed: syntax checks, batch/readability guard test, targeted data/catalog tests, `npm run qa:catalog`, `npm run qa:hygiene`, `npm run qa:assets`, full `npm run test -- --run`, `npm run build`, HTTP 200 local server check, and `npm run qa:mobile`.

## v0.1.195 - Bakery Readable Puzzle Pair
- Added 2 Bakery Window 12x12 puzzles with explicit readability briefs: Layer Cake Slice and Ribbon Cookie Box.
- Catalog thresholds now guard at least 149 free puzzles, 59 large-board free puzzles, and 25 Bakery Window 12x12 boards.
- Verification passed: `node --check` for touched JS files, `npm run qa:catalog`, targeted puzzle/catalog tests, `tests/puzzleBatchIntake.test.js`, `npm run qa:hygiene`, `npm run qa:assets`, full `npm run test -- --run` (13 files / 59 tests), `npm run build`, `curl.exe -I http://127.0.0.1:5173/`, and `npm run qa:mobile` (360x740, 390x844, 430x932).

## 2026-07-09 Play Production Access Watch
- Current Play Console production access status: closed testing track is active with 12 selected testers and 5 days of participation elapsed toward the 14-day requirement.
- Development implication: keep using the remaining Android closed-test window for content, UI polish, and regression hardening; do not block web/common development on production access.
- iOS implication: Mac mini is expected around 2026-07-23, so keep shared web/Capacitor readiness moving now and defer Mac-only App Store packaging/signing until the hardware arrives.

## v0.1.196 - Village Readable Puzzle Pair
- Added 2 Village Pantry 10x10 puzzles with explicit readability briefs: Cinnamon Braid and Teapot Cozy.
- Catalog thresholds now guard at least 151 free puzzles, 61 large-board free puzzles, 25 Bakery Window 12x12 boards, and 32 Village Pantry 10x10 boards.
- Verification passed: `node --check` for touched JS files, `npm run qa:catalog`, targeted puzzle/catalog tests, `tests/puzzleBatchIntake.test.js`, `npm run qa:hygiene`, `npm run qa:assets`, full `npm run test -- --run` (13 files / 59 tests), `npm run build`, `curl.exe -I http://127.0.0.1:5173/`, and `npm run qa:mobile` (360x740, 390x844, 430x932).

## v0.1.197 - Four Puzzle Readability Batch
- Added 4 readable large-board puzzles in one content batch: Bakery Window 12x12 Peach Tart Fan and Sugar Bell; Village Pantry 10x10 Copper Kettle and Berry Bowl.
- Catalog thresholds now guard at least 155 free puzzles, 65 large-board free puzzles, 27 total 12x12 boards, 27 Bakery Window 12x12 boards, and 34 Village Pantry 10x10 boards.
- Verification passed: `node --check` for touched JS files, `npm run qa:catalog`, targeted puzzle/catalog tests, `tests/puzzleBatchIntake.test.js`, `npm run qa:hygiene`, `npm run qa:assets`, full `npm run test -- --run` (13 files / 59 tests), `npm run build`, `curl.exe -I http://127.0.0.1:5173/`, and `npm run qa:mobile` (360x740, 390x844, 430x932).

## v0.1.198 - Puzzle Readability Report Guard
- Promoted large-board art readability from batch-intake-only validation into the catalog report.
- The catalog report now counts readable large-board briefs and warns when recent free 10x10+ puzzles lack a usable silhouette/color/tag brief.
- Verification passed: syntax checks, `npm run qa:catalog`, targeted catalog/batch tests, `npm run qa:hygiene`, `npm run qa:assets`, full `npm run test -- --run` (13 files / 60 tests), `npm run build`, `curl.exe -I http://127.0.0.1:5173/`, and `npm run qa:mobile` (360x740, 390x844, 430x932).

## v0.1.199 - Four Puzzle Quality Batch
- Added 4 readable large-board puzzles: Bakery Window 12x12 Jam Thumbprint and Lemon Glaze Bun; Village Pantry 10x10 Flower Milk Jug and Toast Rack.
- Catalog thresholds now guard at least 159 free puzzles, 69 large-board free puzzles, 29 total 12x12 boards, 29 Bakery Window 12x12 boards, 36 Village Pantry 10x10 boards, and 21 readable large-board briefs.
- Verification passed: syntax checks, `npm run qa:catalog`, targeted puzzle/catalog/batch tests, `npm run qa:hygiene`, `npm run qa:assets`, full `npm run test -- --run` (13 files / 60 tests), `npm run build`, `curl.exe -I http://127.0.0.1:5173/`, and `npm run qa:mobile` (360x740, 390x844, 430x932).

## v0.1.200 - Four Puzzle Quality Batch
- Added 4 readable large-board puzzles: Bakery Window 12x12 Caramel Custard Cup and Berry Cream Roll; Village Pantry 10x10 Honey Dipper and Egg Basket.
- Catalog thresholds now guard at least 163 free puzzles, 73 large-board free puzzles, 31 total 12x12 boards, 31 Bakery Window 12x12 boards, 38 Village Pantry 10x10 boards, and 25 readable large-board briefs.
- Verification passed: syntax checks, `npm run qa:catalog`, targeted puzzle/catalog/batch tests, `npm run qa:hygiene`, `npm run qa:assets`, full `npm run test -- --run` (13 files / 60 tests), `npm run build`, `curl.exe -I http://127.0.0.1:5173/`, and `npm run qa:mobile` (360x740, 390x844, 430x932).

## v0.1.201 - Recent Puzzle Edge Row Polish
- Addressed Review 31's blank-row diversity note by replacing fully blank bottom rows in recent readable puzzles with intentional plate, shadow, base, or handle rows.
- Added a regression test so recent free 10x10+ readable puzzles cannot ship with fully blank first or last solution rows.
- Verification passed: syntax checks, `npm run qa:catalog`, targeted puzzle/catalog tests, `npm run qa:hygiene`, `npm run qa:assets`, full `npm run test -- --run` (13 files / 61 tests), `npm run build`, `curl.exe -I http://127.0.0.1:5173/`, and `npm run qa:mobile` (360x740, 390x844, 430x932).

## v0.1.202 - Four Puzzle Quality Batch
- Added 4 readable large-board puzzles without blank edge rows: Bakery Window 12x12 Cocoa Cream Puff and Sprinkle Donut; Village Pantry 10x10 Cotton Napkin Ring and Spice Scoop.
- Catalog thresholds now guard at least 167 free puzzles, 77 large-board free puzzles, 33 total 12x12 boards, 33 Bakery Window 12x12 boards, 40 Village Pantry 10x10 boards, and 29 readable large-board briefs.
- Verified syntax checks, catalog QA, targeted puzzle/catalog/batch tests, hygiene/assets QA, full test suite, production build, local HTTP 200, and mobile visual QA at 360x740, 390x844, and 430x932.

## v0.1.203 - Four Puzzle Quality Batch
- Added 4 readable large-board puzzles without blank edge rows: Bakery Window 12x12 Cinnamon Swirl Roll and Strawberry Tart; Village Pantry 10x10 Ribbon Tea Tin and Checked Pot Holder.
- Catalog thresholds now guard at least 171 free puzzles, 81 large-board free puzzles, 35 total 12x12 boards, 35 Bakery Window 12x12 boards, 42 Village Pantry 10x10 boards, and 33 readable large-board briefs.
- Verified syntax checks, catalog QA, targeted puzzle/catalog/batch tests, hygiene/assets QA, full test suite, production build, local HTTP 200, and mobile visual QA at 360x740, 390x844, and 430x932.

## v0.1.204 - Four Puzzle Quality Batch
- Added 4 readable large-board puzzles without blank edge rows: Bakery Window 12x12 Honey Cruller Twist and Pear Galette; Village Pantry 10x10 Lace Jar Cover and Garden Herb Bundle.
- Catalog thresholds now guard at least 175 free puzzles, 85 large-board free puzzles, 37 total 12x12 boards, 37 Bakery Window 12x12 boards, 44 Village Pantry 10x10 boards, and 37 readable large-board briefs.
- Verified syntax checks, catalog QA, targeted puzzle/catalog/batch tests, hygiene/assets QA, full test suite, production build, local HTTP 200, and mobile visual QA at 360x740, 390x844, and 430x932.

## v0.1.205 - Time Attack Hint Economy
- Added stepped Time Attack hint pricing through economy config: 2, 4, then 7 spoons per run.
- Time Attack hint panels now show paid hint cost, current spoon balance, confirmation, and insufficient-spoon disabled state.
- Refreshed first Time Attack Pip guide copy to explain random puzzles, spoon earning, paid hints, and record chasing.
- Verified syntax checks, save/i18n tests, full test suite, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA at 360x740, 390x844, and 430x932.

## v0.1.206 - Time Attack Hint Confirmation Polish
- Replaced the native browser confirm for paid Time Attack hints with an in-game confirmation panel.
- Made the no-refund-on-undo rule explicit in Time Attack hint copy and confirmation copy.
- Repaired Korean Time Attack guide copy so it stays readable in the first-run Pip dialog.
- Verified syntax checks, i18n/save tests, full test suite, hygiene/assets QA, production build, local HTTP 200, mobile visual QA at 360x740, 390x844, and 430x932, and catalog guard.

## v0.1.207 - Four Puzzle Quality Batch
- Added four readable large-board puzzles: Apricot Danish, Vanilla Eclair, Hanging Ladle, and Pickle Jar.
- Raised guarded catalog thresholds to 179 free puzzles, 89 large-board free puzzles, 39 Bakery Window 12x12 boards, 46 Village Pantry 10x10 boards, and 41 readable large-board briefs.
- Verified syntax checks, catalog QA, targeted puzzle/i18n tests, full test suite, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA at 360x740, 390x844, and 430x932.

## v0.1.208 - Four Puzzle Quality Batch
- Added four readable large-board puzzles: Jam Crescent, Lemon Tartlet, Flour Sifter, and Cocoa Scoop Tin.
- Raised guarded catalog thresholds to 183 free puzzles, 93 large-board free puzzles, 41 Bakery Window 12x12 boards, 48 Village Pantry 10x10 boards, and 45 readable large-board briefs.
- Verified syntax checks, catalog QA, targeted puzzle/i18n tests, full test suite, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA at 360x740, 390x844, and 430x932.

## v0.1.209 - Four Puzzle Quality Batch
- Added four readable large-board puzzles: Braided Pretzel, Berry Danish Square, Measuring Spoons, and Jam Label Jar.
- Raised guarded catalog thresholds to 187 free puzzles, 97 large-board free puzzles, 43 Bakery Window 12x12 boards, 50 Village Pantry 10x10 boards, and 49 readable large-board briefs.
- Verified syntax checks, catalog QA, targeted puzzle/i18n tests, full test suite, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA at 360x740, 390x844, and 430x932.

## v0.1.210 - Recent Puzzle Title Guard
- Added a regression guard so recent readable 10x10+ free puzzle titles stay unique while older cross-pack starter repeats remain allowed.
- This protects catalog polish after the Cocoa Tin/Cocoa Scoop Tin naming correction.
- Verified targeted puzzle data test, full test suite, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA at 360x740, 390x844, and 430x932.

## v0.1.211 - Four Puzzle Quality Batch
- Added four readable large-board puzzles: Almond Pinwheel, Cherry Turnover, Tea Strainer, and Blue Gingham Cloth.
- Raised guarded catalog thresholds to 191 free puzzles, 101 large-board free puzzles, 45 Bakery Window 12x12 boards, 52 Village Pantry 10x10 boards, and 53 readable large-board briefs.
- Verified syntax checks, catalog QA, targeted puzzle/i18n tests, full test suite, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA at 360x740, 390x844, and 430x932.

## v0.1.212 - Catalog Report Threshold Tightening
- Raised stale catalog report regression thresholds to the current v0.1.211 catalog floor: 191 free puzzles, 45 12x12 boards, 53 readable large-board briefs, 45 Bakery Window 12x12 boards, and 52 Village Pantry large boards.
- This keeps the QA report aligned with the current content scale before the next 200-puzzle push.
- Verified catalog report test, full test suite, catalog QA, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA at 360x740, 390x844, and 430x932.

## v0.1.213 - Four Puzzle Quality Batch
- Added four readable large-board puzzles: Custard Star, Poppy Seed Roll, Scalloped Plate, and Honey Clothespin.
- Raised guarded catalog thresholds to 195 free puzzles, 105 large-board free puzzles, 47 Bakery Window 12x12 boards, 54 Village Pantry 10x10 boards, and 57 readable large-board briefs.
- Verified syntax checks, catalog QA, targeted puzzle/i18n/report tests, full test suite, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA at 360x740, 390x844, and 430x932.

## v0.1.214 - Four Puzzle Quality Batch
- Added four readable large-board puzzles: Maple Palmier, Fig Tart Square, Copper Funnel, and Embroidered Napkin.
- Raised guarded catalog thresholds to 199 free puzzles, 109 large-board free puzzles, 49 Bakery Window 12x12 boards, 56 Village Pantry 10x10 boards, and 61 readable large-board briefs.
- Verified syntax checks, catalog QA, targeted puzzle/i18n/report tests, full test suite, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA at 360x740, 390x844, and 430x932.


## v0.1.215 - 200+ Puzzle Milestone Batch
- Added four readable large-board puzzles: Bakery Window 12x12 Orange Brioche Knot and Cream Horn; Village Pantry 10x10 Linen Bread Bag and Porcelain Butter Dish.
- Raised guarded catalog thresholds to 203 free puzzles, 113 large-board free puzzles, 51 Bakery Window 12x12 boards, 58 Village Pantry 10x10 boards, and 65 readable large-board briefs.
- Verified syntax checks, catalog QA, targeted puzzle/i18n/report tests, full test suite, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA at 360x740, 390x844, and 430x932.


## v0.1.216 - Opening Screen Tactile Polish
- Improved the first game-stage intro surface with a deeper warm card, framed key visual, larger Pip seal, and a more dimensional start button.
- Tightened mobile visual QA so the opening start button cannot regress to a flat treatment.
- Verified syntax checks, hygiene/assets QA, full test suite, production build, local HTTP 200, and mobile visual QA at 360x740, 390x844, and 430x932.


## v0.1.217 - Catalog Summary Polish
- Added puzzle hub pack summary chips for catalog scale: completion, total picture count, large-board count, and max board size.
- Added mobile visual QA assertions for Bakery Window and Village Pantry catalog summaries.
- Verified syntax checks, targeted i18n test, hygiene/assets QA, full test suite, production build, and mobile visual QA at 360x740, 390x844, and 430x932.


## v0.1.218 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Honey Cruller Ring and Raspberry Linzer Frame.
- Added Village Pantry 10x10 Ceramic Measuring Cup and Herb Drying Rack.
- Raised guarded catalog thresholds to 207 free puzzles, 117 large-board free puzzles, 53 Bakery Window 12x12 boards, 60 Village Pantry 10x10 boards, and 69 readable large-board briefs.
- Verified syntax checks, catalog QA, targeted puzzle/catalog/batch/i18n tests, full test suite, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA at 360x740, 390x844, and 430x932.


## v0.1.219 - Recent Korean Puzzle Title Guard
- Repaired Korean title/imageName copy for the newest large-board catalog entries from Copper Funnel through Herb Drying Rack.
- Added targeted i18n coverage so recent Korean puzzle names cannot silently regress to mojibake.
- Verified with syntax checks, targeted i18n test, catalog report, hygiene/assets QA, full Vitest, production build, and mobile visual QA.


## v0.1.220 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Blueberry Babka Slice and Vanilla Canele Tower.
- Added Village Pantry 10x10 Polka Dot Sugar Tin and Wooden Egg Crate.
- Raised guarded catalog thresholds to 211 free puzzles, 121 large-board free puzzles, 55 Bakery Window 12x12 boards, 62 Village Pantry 10x10 boards, and 73 readable large-board briefs.
- Verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.


## v0.1.221 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Strawberry Charlotte Dome and Cocoa Biscotti Bundle.
- Added Village Pantry 10x10 Checkered Tea Towel and Honeycomb Glass Jar.
- Raised guarded catalog thresholds to 215 free puzzles, 125 large-board free puzzles, 57 Bakery Window 12x12 boards, 64 Village Pantry 10x10 boards, and 77 readable large-board briefs.
- Verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.


## v0.1.222 - Bakery 12x12 Guard Alignment
- Aligned the Bakery Window-specific 12x12 regression guard with the current 57-card Bakery Window 12x12 catalog floor.
- Verified with targeted puzzle-data and catalog-report tests.


## v0.1.223 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Almond Croissant Stack and Peach Cream Tartlet.
- Added Village Pantry 10x10 Blue Enamel Colander and Cinnamon Stick Jar.
- Raised guarded catalog thresholds to 219 free puzzles, 129 large-board free puzzles, 59 Bakery Window 12x12 boards, 66 Village Pantry 10x10 boards, and 81 readable large-board briefs.
- Verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

## v0.1.224 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Lavender Shortbread Tin and Maple Pecan Braid.
- Added Village Pantry 10x10 Red Check Apron and Pearl Sugar Bowl.
- Raised guarded catalog thresholds to 223 free puzzles, 133 large-board free puzzles, 61 Bakery Window 12x12 boards, 68 Village Pantry 10x10 boards, and 85 readable large-board briefs.
- Verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

## v0.1.225 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Apricot Jam Tart and Cocoa Swirl Meringue.
- Added Village Pantry 10x10 Gingham Butter Cloche and Pressed Flower Frame.
- Raised guarded catalog thresholds to 227 free puzzles, 137 large-board free puzzles, 63 Bakery Window 12x12 boards, 70 Village Pantry 10x10 boards, and 89 readable large-board briefs.
- Verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

## v0.1.226 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Candied Orange Scone and Rose Cream Eclair.
- Added Village Pantry 10x10 Striped Pickle Jar and Little Recipe Box.
- Raised guarded catalog thresholds to 231 free puzzles, 141 large-board free puzzles, 65 Bakery Window 12x12 boards, 72 Village Pantry 10x10 boards, and 93 readable large-board briefs.
- Verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

## v0.1.227 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Hazelnut Praline Square and Lemon Curd Rosette.
- Added Village Pantry 10x10 Cornflower Tea Canister and Ribboned Bread Basket.
- Raised guarded catalog thresholds to 235 free puzzles, 145 large-board free puzzles, 67 Bakery Window 12x12 boards, 74 Village Pantry 10x10 boards, and 97 readable large-board briefs.
- Verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

## v0.1.228 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Vanilla Bean Cupcake and Pistachio Glaze Donut.
- Added Village Pantry 10x10 Sage Thread Spool and Ceramic Honey Spoon Rest.
- Raised guarded catalog thresholds to 239 free puzzles, 149 large-board free puzzles, 69 Bakery Window 12x12 boards, 76 Village Pantry 10x10 boards, and 101 readable large-board briefs.
- Verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

## v0.1.229 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Caramel Pear Muffin and Sugar Dusted Bundt.
- Added Village Pantry 10x10 Daisy Milk Bottle and Quilted Pot Mat.
- Raised guarded catalog thresholds to 243 free puzzles, 153 large-board free puzzles, 71 Bakery Window 12x12 boards, 78 Village Pantry 10x10 boards, and 105 readable large-board briefs.
- Verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

## v0.1.230 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Berry Cream Crown and Cocoa Almond Biscuit.
- Added Village Pantry 10x10 Lace Jam Spoon and Mint Label Flour Tin.
- Raised guarded catalog thresholds to 247 free puzzles, 157 large-board free puzzles, 73 Bakery Window 12x12 boards, 80 Village Pantry 10x10 boards, and 109 readable large-board briefs.
- Verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

## v0.1.231 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Cherry Cream Brioche and Ginger Honey Madeleine.
- Added Village Pantry 10x10 Blue Ribbon Mason Jar and Floral Rolling Pin.
- Raised guarded catalog thresholds to 251 free puzzles, 161 large-board free puzzles, 75 Bakery Window 12x12 boards, 82 Village Pantry 10x10 boards, and 113 readable large-board briefs.
- Verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

## v0.1.232 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Raspberry Choux Puff and Lemon Ribbon Tart.
- Added Village Pantry 10x10 Little Spice Drawer and Checkered Napkin Ring.
- Raised guarded catalog thresholds to 255 free puzzles, 165 large-board free puzzles, 77 Bakery Window 12x12 boards, 84 Village Pantry 10x10 boards, and 117 readable large-board briefs.
- Verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

## v0.1.233 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Almond Crescent Roll and Peach Custard Square.
- Added Village Pantry 10x10 Copper Measuring Cups and Blue Check Sugar Tin.
- Raised guarded catalog thresholds to 259 free puzzles, 169 large-board free puzzles, 79 Bakery Window 12x12 boards, 86 Village Pantry 10x10 boards, and 121 readable large-board briefs.
- Verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

## v0.1.234 - Four Puzzle Quality Batch
- Added Bakery Window 12x12 Strawberry Vanilla Puff and Cinnamon Honey Twist.
- Added Village Pantry 10x10 Green Label Tea Tin and Little Linen Basket.
- Raised guarded catalog thresholds to 263 free puzzles, 173 large-board free puzzles, 81 Bakery Window 12x12 boards, 88 Village Pantry 10x10 boards, and 125 readable large-board briefs.
- Verified with syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

## v0.1.235 - Four Puzzle Quality Batch
- Added four readable free puzzles: Caramel Fig Danish, Blueberry Cream Pinwheel, Honey Label Crock, and Daisy Checked Teapot.
- Raised guarded catalog thresholds to 267 free puzzles, 177 large-board free puzzles, 83 Bakery Window 12x12 boards, 90 Village Pantry 10x10 boards, and 129 readable large-board briefs.
- Verification passed: syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

## v0.1.236 - Four Puzzle Quality Batch
- Added four readable free puzzles: Plum Cardamom Braid, Honey Lavender Canele, Rose Label Jam Pot, and Blue Linen Bowl Cover.
- Raised guarded catalog thresholds to 271 free puzzles, 181 large-board free puzzles, 85 Bakery Window 12x12 boards, 92 Village Pantry 10x10 boards, and 133 readable large-board briefs.
- Verification passed: syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

## v0.1.237 - Four Puzzle Quality Batch
- Added four readable free puzzles: Orange Blossom Cruller, Blackberry Vanilla Galette, Gingham Egg Cup, and Sage Butter Dish.
- Raised guarded catalog thresholds to 275 free puzzles, 185 large-board free puzzles, 87 Bakery Window 12x12 boards, 94 Village Pantry 10x10 boards, and 137 readable large-board briefs.
- Verification passed: syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

## v0.1.238 - Four Puzzle Quality Batch
- Added four readable free puzzles: Pear Ginger Turnover, Mocha Cream Roll, Poppy Seed Mortar, and Striped Pantry Towel.
- Raised guarded catalog thresholds to 279 free puzzles, 189 large-board free puzzles, 89 Bakery Window 12x12 boards, 96 Village Pantry 10x10 boards, and 141 readable large-board briefs.
- Verification passed: syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

## v0.1.239 - Four Puzzle Quality Batch
- Added four readable free puzzles: Cherry Almond Biscotti, Lemon Poppy Pound Cake, Little Cocoa Scoop, and Sunflower Flour Sieve.
- Raised guarded catalog thresholds to 283 free puzzles, 193 large-board free puzzles, 91 Bakery Window 12x12 boards, 98 Village Pantry 10x10 boards, and 145 readable large-board briefs.
- Verification passed: syntax checks, catalog QA, targeted puzzle/catalog/i18n tests, full Vitest, hygiene/assets QA, production build, local HTTP 200, and mobile visual QA.

## v0.1.240 - Time Attack Coach Polish
- Added the Pip coach card to the Time Attack lobby and kept Android bundle generation paused during the local rework.
- Verification focus for this slice: i18n copy, mobile Time Attack lobby containment, and full local test/build health.

## v0.1.241 - Time Attack Hint Confirmation Polish
- Polished the in-game paid-hint confirmation panel for Time Attack and added a hygiene guard against native browser confirm dialogs.
- Added mobile visual QA coverage for the paid-hint confirmation panel treatment.
- Android bundle generation remains paused during the local major rework; next signed AAB should wait for broader UX/art approval.

## v0.1.242 - Time Attack Three-Round Pacing
- Changed the default Time Attack size ramp to 5x5, 8x8, and 10x10 so short runs can still surface the hint-spend decision.
- Time Attack records now use the largest board reached in the run rather than the first 5x5 board.
- Android bundle generation remains paused during the local major rework.

## v0.1.243 - Time Attack Ladder Polish
- Time Attack lobby now previews the 5x5, 8x8, and 10x10 round ramp before a run begins.
- Added mobile QA coverage for the ladder while Android bundle generation remains paused during the local rework.

## v0.1.244 - Readable Puzzle Batch
- Added 4 quality-gated launch-catalog puzzles with titleKey, English/Korean catalog copy, and artReadability briefs.
- Catalog now stands at 287/333 free puzzles, with 46 remaining to the Season 0 launch target. Android bundle generation remains paused during local rework.

## v0.1.245 - Time Attack Progress-Cell Records
- Time Attack records now store progress-cell metadata instead of relying only on completed-round scoring.
- Android bundle generation remains paused during local rework.

## v0.1.246 - Time Attack Timeout Records
- Time Attack now supports a 3-minute timeout and saves partial progress-cell records.
- Android bundle generation remains paused during local rework.

## v0.1.247 - Time Attack Timeout Visual Polish
- Polished the Time Attack remaining-time pill and timeout result card.
- Android bundle generation remains paused during local rework.

### v0.1.250 Opening Version Visibility
- 오프닝 게임 시작 화면과 이름 입력 화면에 작은 버전 칩을 추가해, 미리보기에서 현재 빌드를 즉시 확인할 수 있게 했다.
- APP_VERSION을 src/data/appVersion.js로 분리해 앱 쉘과 브랜드 인트로가 같은 버전 값을 공유하도록 정리했다.
- 모바일 QA가 오프닝 버전 칩을 확인하도록 확장했다.

## v0.1.251 - Four Puzzle Quality Batch
- Added 4 quality-gated launch-catalog puzzles with titleKey, English/Korean catalog copy, and artReadability briefs.
- Catalog now stands at 291/333 free puzzles, with 42 remaining to the Season 0 launch target. Android bundle generation remains paused during local rework.

## v0.1.252 - Four Puzzle Quality Batch
- Added 4 more quality-gated launch-catalog puzzles with titleKey, English/Korean catalog copy, and artReadability briefs.
- Catalog now stands at 295/333 free puzzles, with 38 remaining to the Season 0 launch target. Android bundle generation remains paused during local rework.

## v0.1.253 - Four Puzzle Quality Batch
- Added 4 quality-gated launch-catalog puzzles with titleKey, English/Korean catalog copy, and artReadability briefs.
- Catalog now stands at 299/333 free puzzles, with 34 remaining to the Season 0 launch target. Android bundle generation remains paused during local rework.

## v0.1.254 - Four Puzzle Quality Batch
- Added 4 quality-gated launch-catalog puzzles with titleKey, English/Korean catalog copy, and artReadability briefs.
- Catalog now stands at 303/333 free puzzles, with 30 remaining to the Season 0 launch target. Android bundle generation remains paused during local rework.

## v0.1.255 - Four Puzzle Quality Batch
- Added 4 quality-gated launch-catalog puzzles with titleKey, English/Korean catalog copy, and artReadability briefs.
- Catalog now stands at 307/333 free puzzles, with 26 remaining to the Season 0 launch target. Android bundle generation remains paused during local rework.

## v0.1.256 - Four Puzzle Quality Batch
- Added 4 quality-gated launch-catalog puzzles with titleKey, English/Korean catalog copy, and artReadability briefs.
- Catalog now stands at 311/333 free puzzles, with 22 remaining to the Season 0 launch target. Android bundle generation remains paused during local rework.

## v0.1.257 - Four Puzzle Quality Batch
- Added 4 quality-gated launch-catalog puzzles with titleKey, English/Korean catalog copy, and artReadability briefs.
- Catalog now stands at 315/333 free puzzles, with 18 remaining to the Season 0 launch target. Android bundle generation remains paused during local rework.

## v0.1.258 - Four Puzzle Quality Batch
- Added 4 quality-gated launch-catalog puzzles with titleKey, English/Korean catalog copy, and artReadability briefs.
- Catalog now stands at 319/333 free puzzles, with 14 remaining to the Season 0 launch target. Android bundle generation remains paused during local rework.

## v0.1.259 - Four Puzzle Quality Batch
- Added 4 quality-gated launch-catalog puzzles with titleKey, English/Korean catalog copy, and artReadability briefs.
- Catalog now stands at 323/333 free puzzles, with 10 remaining to the Season 0 launch target. Android bundle generation remains paused during local rework.

## v0.1.260 - Season 0 Launch Catalog Completion Batch
- Added 10 quality-gated launch-catalog puzzles with titleKey, English/Korean catalog copy, and artReadability briefs.
- Catalog now stands at 333/333 free puzzles, completing the Season 0 launch target. Android bundle generation remains paused during local rework while UX/art/game-feel polish continues.

### v0.1.261 - Season 0 Progress Hub
- Puzzle Hub에 Season 0 진행 카드를 추가해 333개 출시 퍼즐을 하나의 런칭 시즌 카탈로그로 보이게 했다.
- 카드에서 전체 완성률, 열린 스테이지 수, 보유 스푼을 함께 보여 주어 다음 스테이지 해금과 Pantry 요청이 자연스러운 목표가 되도록 정리했다.
- 다음 시즌 업데이트 예고 문구를 추가해 출시 후 계절성 퍼즐 팩 확장 방향을 UI 안에 심었다.
- 모바일 preview guard에서 발견된 대형 팩 mosaic 압축 문제를 함께 수정했다. 실제 136개/137개 퍼즐 수를 그대로 렌더하지 않고 20칸 샘플에 진행률을 환산해 stage art가 안정적으로 보이게 했다.

### v0.1.262 - Stage Unlock Plan Copy
- 잠긴 스테이지 카드에 다음 행동 플랜 문구를 추가했다. 스푼 부족, Pantry 요청 부족, 둘 다 부족한 상황을 각각 설명해 다음 퍼즐을 열기 위한 목표를 더 명확하게 보여 준다.
- Season 0의 333개 퍼즐을 단순 목록이 아니라 스푼 수급과 Pantry 진행으로 단계적으로 열어 가는 구조로 느끼게 하는 UI 보강이다.


### v0.1.263 - Opening Promise Strip
- Added a Season 0 launch note and three tactile promise chips to the brand intro: 333 pictures, Pantry goals, and Time Attack.
- The first game screen now previews puzzle volume, decoration goals, and competitive play before the user enters the puzzle loop.


### v0.1.264 - Season Next Goal Card
- Added a Next Goal panel to the Season 0 Puzzle Hub card so the 333-picture catalog points players toward the next locked shelf, album completion, or next-season savings goal.
- Reused the existing spoon/Pantry gate logic inside the hub instead of adding a separate economy rule, keeping stage pacing, room requests, and UI copy aligned.


### v0.1.265 - Season Goal Actions
- Added direct actions to the Season 0 Next Goal card: open a ready stage, route to Pantry when room progress is missing, or view the Album when all stages are open.
- Fixed the Next Goal locked-copy path so it passes the actual unlock-ready boolean into the shared unlock-plan text helper.

## Verification Update - 2026-07-11 v0.1.266 Floating Navigation Context Polish
- Visible app version: v0.1.266.
- Android bundle generation remains paused during the local rework; next release build should include the clarified floating navigation trigger and localized destination hints.
- Planned verification: full local web QA plus mobile visual QA before the next Android handoff.

## Verification Update - 2026-07-11 v0.1.267 Pantry Progress Mission Card
- Visible app version: v0.1.267.
- Android bundle generation remains paused during the local rework; the next handoff should include the Pantry Room Path mission block that links decoration requests to stage unlock pacing.
- Planned verification: local web QA plus mobile visual QA before Android packaging resumes.

## Verification Update - 2026-07-11 v0.1.268 Pantry Progress Mission Mobile Guard
- Visible app version: v0.1.268.
- Android bundle generation remains paused during the local rework; the next handoff should include the mobile QA guard for the Pantry Room Path mission card.
- Planned verification: local web QA plus mobile visual QA before Android packaging resumes.

## Verification Update - 2026-07-11 v0.1.269 Pantry Progress Mission Action
- Visible app version: v0.1.269.
- Android bundle generation remains paused during the local rework; the next handoff should include the Room Path CTA that connects Pantry progression to the next decoration request.
- Planned verification: local web QA plus mobile visual QA before Android packaging resumes.

## Verification Update - 2026-07-11 v0.1.270 Time Attack Board Progress Records
- Visible app version: v0.1.270.
- Android bundle generation remains paused during the local rework; the next handoff should include Time Attack records that show active-board progress for better leaderboard/readback clarity.
- Planned verification: Time Attack save/UI tests, local web QA, and mobile visual QA before Android packaging resumes.

## Verification Update - 2026-07-11 v0.1.271 Completed Line Guidance Foundation
- Visible app version: v0.1.271.
- Android bundle generation remains paused during the local rework; the next handoff should include solution-aware completed-line glow and soft blank/X board guidance.
- Planned verification: board syntax, full local web QA, and mobile visual QA before Android packaging resumes.

## Verification Update - 2026-07-11 v0.1.272 Drag Stroke Cell Painting
- Visible app version: v0.1.272.
- Android bundle generation remains paused during the local rework; the next handoff should include drag/sweep cell painting for larger-board comfort.
- Planned verification: puzzle state stroke tests, full local web QA, and mobile visual QA before Android packaging resumes.

## Verification Update - 2026-07-11 v0.1.273 Drag Stroke Preview Polish
- Visible app version: v0.1.273.
- Android bundle generation remains paused during the local rework; the next handoff should include the clearer drag-preview styling for sweep input.
- Planned verification: local web QA and mobile visual QA before Android packaging resumes.

## v0.1.274 - Size-Aware Hint Reveal Foundation
- Normal puzzle hints can now reveal multiple sure cells on larger boards while consuming one hint use.
- Time Attack paid hints remain one-cell hints for launch balance.
- Verification passed: targeted puzzle/i18n tests, full Vitest 70 tests, qa:hygiene, qa:catalog, qa:assets, production build, and mobile QA 360/390/430.
## v0.1.275 - Hint Undo Exploit Guard
- Hint Undo now restores cells only; hint use count stays recorded.
- This protects replay cleanliness, Time Attack records, and future paid normal-puzzle hint economy from free-preview abuse.
- Verification passed: targeted hint/replay/i18n tests, full Vitest 70 tests, qa:hygiene, qa:catalog, qa:assets, production build, HTTP 200, and mobile QA 360/390/430.
## v0.1.276 - Hint Mistake Correction Priority
- Hint targeting now corrects wrong filled cells before adding safe blank marks, making hints more useful on larger boards and preserving the no-free-preview Undo rule.
- Verification passed: targeted hint/replay tests, full Vitest 71 tests, qa:hygiene, qa:catalog, qa:assets, production build, HTTP 200, and mobile QA 360/390/430.
## v0.1.277 - Safe Suggestion Tap Guard
- Completed-line safe X suggestions now commit as marks on touch/drag instead of toggling into wrong filled cells.
- Verification passed: board-view targeted tests, full Vitest 73 tests, qa:hygiene, qa:catalog, qa:assets, production build, HTTP 200, and mobile QA 360/390/430.
## v0.1.278 - Replay Final-Move Clean Guard
- Replay clean status now includes the final completing move before reward payout, closing the final-hint clean reward loophole.
- Verification passed: replay challenge targeted tests, full Vitest 74 tests, qa:hygiene, qa:catalog, qa:assets, production build, HTTP 200, and mobile QA 360/390/430.
## v0.1.279 - Normal Puzzle Extra Hint Economy
- Normal large-board puzzles can offer paid extra hints after their free hint allowance is exhausted; Android bundle generation remains paused during local rework.
- Verification passed: economy/i18n/puzzle targeted tests, full Vitest 76 tests, qa:hygiene, qa:catalog, qa:assets, production build, HTTP 200, and mobile QA 360/390/430.

## v0.1.280 - Time Attack State Callback Wiring Guard
- Focused play now forwards puzzle state changes into the puzzle view so Time Attack timeout records can keep current-board progress.
- Verification passed: play-screen wiring tests, save tests, full Vitest 77 tests, qa:hygiene, qa:catalog, qa:assets, production build, HTTP 200, and mobile QA 360/390/430.


## v0.1.281 - Paid Hint Count State Split
- Normal puzzle extra-hint pricing no longer depends on `hintsUsed - hintLimit`; puzzle state now keeps `paidHintsUsed` explicitly.
- Verification passed: full Vitest 78 tests, qa:hygiene, qa:catalog, qa:assets, production build, and mobile QA 360/390/430.


## v0.1.282 - Zero-Clue Line Guidance
- 0-clue rows/columns now participate in completed-line glow and safe X suggestions when no wrong fill is present.
- Verification passed: full Vitest 79 tests, qa:hygiene, qa:catalog, qa:assets, production build, HTTP 200, and mobile QA 360/390/430.


## v0.1.283 - First-Play Line Guidance Copy
- Added how-to-play copy for completed-line glow and safe X suggestions.
- Verification passed: full Vitest 79 tests, qa:hygiene, production build, and mobile QA 360/390/430.


## v0.1.284 - Drag Stroke Safe-Suggestion Protection
- Swipe painting now supports per-cell target values so safe X suggestions remain marks during a fill drag.
- Verification passed: full Vitest 81 tests, qa:hygiene, qa:catalog, qa:assets, production build, HTTP 200, and mobile QA 360/390/430.

## v0.1.285 - Drag Stroke Value Regression Guard
- Safe X suggestion protection now preserves the original stroke value for normal cells, including drag-to-clear strokes.
- Verification passed: full Vitest 81 tests, qa:hygiene, qa:catalog, qa:assets, production build, HTTP 200, and mobile QA 360/390/430.

## v0.1.286 - Korean Replay And Hint Copy Polish
- Repaired Korean replay-pick and Time Attack paid-hint copy in the gameplay guidance layer.
- Verification passed: full Vitest 81 tests, qa:hygiene, qa:catalog, qa:assets, production build, HTTP 200, and mobile QA 360/390/430.

## v0.1.287 - Paid Hint Title Clarity
- Hint panels now use separate titles for free hints, normal extra hints, and Time Attack paid hints.
- Verification passed: full Vitest 82 tests, qa:hygiene, qa:catalog, qa:assets, production build, HTTP 200, and mobile QA 360/390/430.

## v0.1.288 - Korean Copy Regression Guard
- Korean guide/hint regression tests now reject common mojibake fragments and verify the readable extra-hint phrase.
- Verification passed: full Vitest 82 tests, qa:hygiene, qa:catalog, qa:assets, production build, HTTP 200, and mobile QA 360/390/430.

## v0.1.289 - Korean Source Hygiene Guard
- Source hygiene now rejects common mojibake fragments in src/i18n/ko.js before Android packaging.
- Verification passed: full Vitest 82 tests, qa:hygiene, qa:catalog, qa:assets, production build, HTTP 200, and mobile QA 360/390/430.
## Verification Update - 2026-07-12 v0.1.290 Unified Hint Presentation

- Hint UI no longer exposes separate free/extra/Time Attack hint titles; it keeps a single hint count and explains spoon use only when needed.
- Time Attack hints now use the free allowance before switching to spoon-spending hints.
- Verification passed: targeted hint/i18n/economy tests, full Vitest (84 tests), hygiene/catalog/assets, production build, mobile QA, and HTTP 200 smoke all passed.
## Verification Update - 2026-07-12 v0.1.291 Hint Icon Control Polish

- Hint action is now an accessible icon-only control with the remaining hint count left in panel copy.
- Mobile QA now guards hint button touch size, icon presence, and absence of visible button text.
- Verification passed: syntax, targeted tests, full Vitest (84 tests), hygiene/catalog/assets, production build, mobile QA, and HTTP 200 smoke all passed.
## Verification Update - 2026-07-12 v0.1.292 Time Attack Guide QA Guard

- Mobile QA now opens Time Attack and verifies the first-run Pip guide reaches the hint/spoon explanation step.
- Verification passed: syntax, full Vitest (84 tests), hygiene/catalog/assets, production build, mobile QA, and HTTP 200 smoke all passed.
## Verification Update - 2026-07-12 v0.1.293 Korean UI Copy Guard

- Korean non-puzzle UI copy now has recursive mojibake regression coverage in i18n tests.
- Verification passed: targeted i18n test, full Vitest (85 tests), hygiene/catalog/assets, production build, mobile QA, and HTTP 200 smoke all passed.
## Verification Update - 2026-07-12 v0.1.294 Completed-Line Guidance Guard

- Board guidance logic now has direct regression coverage for truly completed rows/columns and locked-board suppression.
- Verification passed: targeted board-view test, full Vitest (87 tests), hygiene/catalog/assets, production build, mobile QA, and HTTP 200 smoke all passed.


## Verification Update - 2026-07-12 v0.1.295 Opening Promise Chip Polish

- Opening launch highlights now use tactile promise chips with CSS-only Sunny Spoon styled marks.
- Android bundle generation remains paused during the local rework; next handoff should include this first-impression polish after full local QA passes.
- Verification passed: syntax checks, full Vitest (87 tests), hygiene/catalog/assets, production build, mobile QA, and HTTP 200 smoke all passed.


## Verification Update - 2026-07-12 v0.1.296 Spoon Hint Confirmation Clarity

- Hint confirmation now includes a compact spoon-cost chip while preserving a single hint-button presentation.
- Android bundle generation remains paused during the local rework; next handoff should include this hint-economy UX clarification after full local QA passes.
- Verification passed: syntax, targeted hint/i18n tests, full Vitest (88 tests), hygiene/catalog/assets, production build, mobile QA, and HTTP 200 smoke all passed.

## Verification Update - 2026-07-12 v0.1.297 Completed-Line Visual Guard

- Completed-line guidance received a visual polish pass for solved row/column glow and safe X suggestions.
- Android bundle generation remains paused during the local rework; next handoff should include this large-board guidance polish after full local QA passes.
- Verification passed: syntax, targeted board/hint/i18n tests, full Vitest (88 tests), hygiene/catalog/assets, production build, mobile QA, and HTTP 200 smoke all passed.

## Verification Update - 2026-07-12 v0.1.298 Puzzle Control Icon Polish

- Core puzzle controls now use icon+label treatment while preserving existing fill/mark/undo behavior.
- Android bundle generation remains paused during the local rework; next handoff should include this play-control polish after full local QA passes.
- Verification passed: syntax, targeted puzzle/puzzle-state/i18n tests, full Vitest (88 tests), hygiene/catalog/assets, production build, mobile QA, and HTTP 200 smoke all passed.

## Verification Update - 2026-07-12 v0.1.299 Puzzle Progress Chip Polish

- Puzzle progress now renders as a compact status chip for filled, revisit, and complete states.
- Android bundle generation remains paused during the local rework; next handoff should include this play-HUD polish after full local QA passes.
- Verification passed: syntax, targeted puzzle/puzzle-state/i18n tests, full Vitest (88 tests), hygiene/catalog/assets, production build, mobile QA, and HTTP 200 smoke all passed.

## Verification Update - 2026-07-12 v0.1.300 Hint Allowance Meter Polish

- Hint panels now show a compact free-hint allowance meter while preserving the single icon-only hint action.
- Android bundle generation remains paused during the local rework; next handoff should include this hint-UX polish after full local QA passes.
- Verification passed: syntax, targeted hint/i18n tests, full Vitest (89 tests), hygiene/catalog/assets, production build, mobile QA, and HTTP 200 smoke all passed.

## Verification Update - 2026-07-12 v0.1.301 Play Header HUD Polish

- Focused play headers now use compact tactile HUD styling for back, title, settings, and board-size metadata.
- Android bundle generation remains paused during the local rework; next handoff should include this play-header polish after full local QA passes.
- Verification passed: syntax, targeted play/puzzle/hint/i18n tests, full Vitest (89 tests), hygiene/catalog/assets, production build, mobile QA, and HTTP 200 smoke all passed.

## Verification Update - 2026-07-12 v0.1.302 Puzzle Tool Shelf Cohesion
- Lower puzzle controls, hint panel, and progress chip now share a cohesive play-tool shelf treatment.
- Android bundle generation remains paused during the local rework; next handoff should include this repeated-play polish after full local QA passes.
- Verification passed: syntax, targeted play/puzzle/hint/i18n tests, full Vitest (89 tests), hygiene/catalog/assets, production build, mobile QA, and HTTP 200 smoke all passed.

## Verification Update - 2026-07-12 v0.1.303 How-To Guide Card Polish
- In-puzzle how-to guidance now uses a polished guide-card treatment with clue rows and compact action chips.
- Android bundle generation remains paused during the local rework; next handoff should include this first-play guidance polish after full local QA passes.
- Verification passed: syntax, targeted puzzle/hint/i18n tests, full Vitest (89 tests), hygiene/catalog/assets, production build, mobile QA, and HTTP 200 smoke all passed.

## Verification Update - 2026-07-12 v0.1.304 Season Update Teaser Polish
- Season 0 hub now presents the post-launch update cadence as an in-game update-note card with puzzle drop, season room, and Pip news chips.
- Android bundle generation remains paused during the local rework; next handoff should include this live-service expectation polish after full local QA passes.
- Verification passed: syntax, full Vitest (89 tests), hygiene/catalog/assets, production build, HTTP 200 smoke, and mobile QA 360/390/430 all passed.

## Verification Update - 2026-07-12 v0.1.305 Completion Collectible Card Polish
- Puzzle completion now presents the solved reveal as a compact album-card reward with a saved stamp.
- Android bundle generation remains paused during the local rework; next handoff should include this completion-reward polish after full local QA passes.
- Verification passed: syntax, full Vitest (89 tests), hygiene/catalog/assets, production build, HTTP 200 smoke, and mobile QA 360/390/430 all passed.

## Verification Update - 2026-07-12 v0.1.306 Stage Complete Fact Chip Polish
- Stage-complete overlays now include compact fact chips tying stage completion to album progress and room-path momentum.
- Android bundle generation remains paused during the local rework; next handoff should include this milestone-reward polish after full local QA passes.
- Verification passed: syntax, full Vitest (89 tests), hygiene/catalog/assets, production build, HTTP 200 smoke, and mobile QA 360/390/430 all passed.


## Verification Update - 2026-07-12 v0.1.307 Large Board Cursor Pad Polish
- Added tactile large-board cursor pad styling and a row/column position chip while preserving puzzle logic and hint economy behavior.
- Verification passed: syntax checks, full Vitest (89 tests), hygiene/catalog/assets QA, production build, HTTP 200 smoke, and mobile QA 360/390/430 all passed.

## Verification Update - 2026-07-12 v0.1.308 Puzzle Progress Target Count
- Puzzle progress chips now show colored cells against the actual solution target, keeping mistake warnings in the same compact play surface.
- Android bundle generation remains paused during the local rework; next handoff should include this large-board progress clarity after full local QA passes.
- Verification passed: syntax checks, full Vitest (89 tests), hygiene/catalog/assets QA, production build, HTTP 200 smoke, and mobile QA 360/390/430 all passed.

## Verification Update - 2026-07-13 v0.1.309 Puzzle Progress Rail Polish
- Puzzle progress chips now include a soft progress rail behind the target-count text, improving at-a-glance progress clarity on large boards.
- Android bundle generation remains paused during the local rework; next handoff should include this play-surface polish after full local QA passes.
- Verification passed: syntax checks, full Vitest (89 tests), hygiene/catalog/assets QA, production build, HTTP 200 smoke, and mobile QA 360/390/430 all passed.

## Verification Update - 2026-07-13 v0.1.310 Guided Line Progress Badge
- Puzzle progress chips now show a compact completed-line badge when solved rows/columns are available, reinforcing the friendly guidance loop without adding new puzzle rules.
- Android bundle generation remains paused during the local rework; next handoff should include this play-guidance polish after full local QA passes.
- Verification passed: syntax checks, full Vitest (89 tests), hygiene/catalog/assets QA, production build, HTTP 200 check, and mobile QA 360/390/430 all passed.
## Verification Update - 2026-07-15 Android Candidate Gate

- Added `npm run qa:android:candidate` as the fast Android candidate lane.
- The lane runs the web candidate gate, Capacitor sync, unsigned Android release bundle build, and AAB output sanity check.
- Verified the lane exits successfully and produces `android/app/build/outputs/bundle/release/app-release.aab`.
- Expected pre-final warnings remain: Android `versionCode` / `versionName` still match the last Play upload until the final upload bump.

## Billing / IAP Release Note - 2026-07-16

- v1 Android now includes a minimal optional Google Play Billing path for one non-consumable support product: `pip_cozy_support`.
- `npm run qa:billing` verifies the Billing dependency, Android Billing permission, product ID wiring, support-pack i18n keys, policy/listing references, and no paid/free wording in player-facing support copy.
- Play Console setup required before final store test: create the managed product, set price, activate it, and test purchase/restore on an internal tester account.
- Android manifest includes `com.android.vending.BILLING`; Capacitor sync must be run after Billing plugin changes before building an AAB.
- The app grants 250 spoons once per local profile after purchase or restore. Refund/revocation server reconciliation is deferred to v1.1+ unless Play Console testing exposes a blocking issue.
