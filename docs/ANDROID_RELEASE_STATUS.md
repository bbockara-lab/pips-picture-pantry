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

## Signing Status

- jarsigner -verify reports: jar is unsigned.
- This means the release AAB is a build-valid unsigned artifact, not yet Play-upload-ready.
- Next blocker: create/connect upload keystore and produce a signed AAB.

## Local Tooling Notes

- Android Studio JBR exists at D:\Program Files\Android\Android Studio\jbr.
- Android SDK exists at C:\Users\bbock\AppData\Local\Android\Sdk.
- java is not on the default PATH in this shell, so scripts set JAVA_HOME, ANDROID_HOME, and ANDROID_SDK_ROOT explicitly.

## Repeatable Commands Verified

- npm run cap:sync passed.
- scripts/build_android_release_bundle.ps1 passed after final sync.

## Next Android Actions

1. Decide upload keystore location outside the repo.
2. Add signing config through environment variables or local-only Gradle properties.
3. Build signed release AAB.
4. Upload to Google Play internal testing.
5. Capture real-device screenshots after internal install.