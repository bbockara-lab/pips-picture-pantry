# Release Plan

Last updated: 2026-06-28

## Target

Ship an Android-first MVP within one week. Keep iOS ready for Mac Mini packaging as soon as Apple tooling is available.

## Modes

- `live-candidate`: current small, shippable MVP path.
- `recovery`: used only if build, entry, save, navigation, or version visibility breaks.
- `experimental`: larger improvements such as puzzle editor, seasonal packs, ads, cloud save, or richer story systems.

## Android Path

1. Build web MVP.
2. Add Capacitor shell.
3. Configure app ID: `com.sunnyspoonstudios.pipspicturepantry`.
4. Generate Android project.
5. Build debug APK for device validation.
6. Prepare signed release AAB.
7. Upload internal test when signing and Play Console fields are ready.

## iOS Path

1. Keep bundle ID and metadata aligned with Android.
2. Prepare app icon and screenshots from the web MVP.
3. Add Capacitor iOS project on Mac Mini.
4. Build and archive with Xcode.
5. Submit to TestFlight when Apple account inputs are ready.

## Release Gates

- App opens to playable puzzle.
- Version label is visible.
- Starter puzzle can be completed.
- Progress survives reload.
- Reset progress works.
- 360px mobile layout has no text overlap.
- Build completes.
- Rollback path is clear before store upload.
