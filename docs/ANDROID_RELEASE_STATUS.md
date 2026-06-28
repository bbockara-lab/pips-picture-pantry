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
