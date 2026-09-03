# Release Plan

Last updated: 2026-08-23

## Korean Harvest interaction and audio scope — 2026-08-28

- Correct D-pad Trail Paint so a quick arrow tap moves only and a held arrow paints repeated destinations with the selected Color/Blank brush.
- Correct the completion screen's Next Picture responsiveness: acknowledge the first tap immediately, suppress duplicate taps during transition, profile the render path and verify that one tap advances exactly one picture.
- Replace the single shared BGM and oscillator placeholder effects with the authored music, stinger, UI, puzzle, reward, Pantry, Time Attack, mailbox and Pip-reaction cue set defined in `docs/KOREAN_HARVEST_AUDIO_AND_CURSOR_PLAN.md`.
- Keep both platform packages on the same cue mapping and require physical-device, airplane-mode, lifecycle and long-press input verification before signing.

## iOS 1.1.24 / Android 1.1.23 rebuilt candidate — 2026-08-23

- Prepare iOS **1.1.24 build 7** from installed-app label **v0.1.718**.
- Rebuild the not-yet-uploaded Android **versionCode 52 / versionName 1.1.23** candidate from the same v0.1.718 source; versionCode 52 is retained because the previous artifact was never uploaded.
- Include the iPhone Workshop spoon/mailbox collision fix, dedicated balance-header spacing on Time Attack/Spoon Run/Pantry, and a 3-2-1 Time Attack start sequence whose timer begins after the countdown while normal BGM remains suppressed for the run.
- The older versionCode 52 artifact is superseded and must not be uploaded.

## Functional Fix Release Before Korean Harvest — 2026-08-21

- Prepare shared version **1.1.23** as Android versionCode **52** and iOS build **6**.
- Include puzzle-screen direct/cursor switching, cursor long-press continuous painting, its Pip guide update, the third replay-pick reward fix, and app-wide view-entry scroll reset.
- Keep Korean Harvest content in `candidate` state and inactive in this release.
- iOS may proceed now because 1.1.22 is live. Android 52 must wait until Android 51 / 1.1.22 finishes Play review.

## Current Store Synchronization — 2026-08-20

- iOS 1.1.22 is released.
- Android versionCode 48 is live; versionCode 50 / versionName 1.1.21 is in review.
- Android versionCode 51 / versionName 1.1.22 is the verified catch-up artifact and must follow versionCode 50.
- The Korean Harvest release is the next shared content line after Android reaches 1.1.22. Do not hardcode its Android versionCode until all earlier Play uploads are complete.
- Store version names should converge for the seasonal release even though iOS build numbers and Android version codes remain platform-specific.

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

## Confirmed Post-Korean-Theme Monetization Sequence — 2026-08-20

- The Korean seasonal/theme release remains advertising-free.
- The immediately following planned update should test one small bottom banner slot on ordinary puzzle play.
- The experiment must follow `docs/MONETIZATION_PLAN.md`: dedicated non-overlay layout space, control/safe-area separation, ad-free onboarding/dialogue/purchases, privacy/store declarations, physical-device verification, metrics, rollback/remote disable planning, and a permanent Remove Ads purchase path.
- This is an approved roadmap item, not authorization to add an SDK or production ad unit before the Korean release and pre-implementation gates are complete.
