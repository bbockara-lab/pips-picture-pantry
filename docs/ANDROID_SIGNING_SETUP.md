# Android Signing Setup

Last updated: 2026-07-16
Mode: live-candidate release infrastructure

## Goal

Pip's Picture Pantry needs a signed Android App Bundle before it can be uploaded to Google Play internal testing or production tracks. The repo can build unsigned AABs today; this setup adds a repeatable signed-release path without committing signing secrets.

## Secret Handling Rule

Do not commit keystores, passwords, or local signing property files.

The Gradle release signing config reads these environment variables only:

- PPP_UPLOAD_STORE_FILE
- PPP_UPLOAD_STORE_PASSWORD
- PPP_UPLOAD_KEY_ALIAS
- PPP_UPLOAD_KEY_PASSWORD

If any value is missing, Gradle keeps building the existing unsigned release AAB. The signed build script fails early instead of producing a misleading artifact.

## Create The Upload Keystore

Run this once from the repo root:

```powershell
scripts\create_android_upload_keystore.ps1
```

Default output location:

```text
D:\Users\bbock\OneDrive\00. Private\10. Development\99. Key Paths\Android\Pip's Picture Pantry\pip-picture-pantry-upload.jks
```

The script uses Android Studio's bundled JBR keytool and prompts for passwords. Save those passwords in a password manager. Google Play App Signing should then manage the app signing key, while this local upload key is used to upload AABs.

## Build A Signed AAB

Set the signing environment variables in the same PowerShell session:

```powershell
$env:PPP_UPLOAD_STORE_FILE='D:\Users\bbock\OneDrive\00. Private\10. Development\99. Key Paths\Android\Pip's Picture Pantry\pip-picture-pantry-upload.jks'
$env:PPP_UPLOAD_KEY_ALIAS='pip-picture-pantry-upload'
$env:PPP_UPLOAD_STORE_PASSWORD='<store password>'
$env:PPP_UPLOAD_KEY_PASSWORD='<key password>'
```

Then run:

```powershell
scripts\build_android_signed_release_bundle.ps1
```

Expected output:

```text
android\app\build\outputs\bundle\release\app-release.aab
```

The script first runs `npm run qa:candidate`, `npm run qa:privacy:live`, and `npm run qa:release:final`. It then runs `npm run build`, `npx cap sync android`, `gradlew bundleRelease`, and `jarsigner -verify` using Android Studio's bundled JBR.

If `android/app/build.gradle` still uses the last Play Console upload values, the script stops before reading signing secrets or producing a Play-upload AAB.

## Play Console Next Step

Upload the signed AAB to Google Play internal testing first. After the upload succeeds, capture the package/version details and update `docs/ANDROID_RELEASE_STATUS.md`.
