# iOS Release Status

Last updated: 2026-08-04

## Current state

- Android is public on Google Play; the shared web candidate is v0.1.703.
- Bundle ID: `com.sunnyspoonstudios.pipspicturepantry`.
- Capacitor iOS support is now part of the project dependencies.
- Native Billing is enabled for both Android and iOS, and the Settings surface identifies the App Store on iOS.
- The iOS native project has been generated and the native-purchases plugin is wired through Swift Package Manager.
- Xcode 26.6 (build 17F113) is installed and selected.
- Production web build and all 48 test files / 291 tests pass on this Mac.

## Mac setup

Xcode is ready. Recheck the selected developer directory after any Xcode update:

```sh
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
xcodebuild -version
```

Node.js/npm also needs to be installed for the repository's existing release scripts. Node 22 or newer is required by Capacitor 8.

## Local preparation

```sh
npm ci
npm test
npm run build
npm run ios:add
```

After the first native project exists, use:

```sh
npm run ios:sync
npm run ios:open
```

## Xcode setup

1. Select the App target and choose the Sunny Spoon Studios Apple Developer team.
2. Keep the bundle identifier exactly `com.sunnyspoonstudios.pipspicturepantry`.
3. Set the first App Store version/build number after checking App Store Connect.
4. Add the **In-App Purchase** capability.
5. Set the supported orientation to portrait unless device review proves another orientation is required.
6. Confirm the approved `pip-pantry-v3` icon renders correctly on a physical device and in an Archive.
7. Run on an iPhone and verify safe areas, first launch, puzzle completion, saved progress, reset, audio, and every guide overlay.

## App Store Connect

1. Create the app record with the matching bundle ID and SKU.
2. Create consumable in-app purchases `pip_cozy_support` and `pip_spoon_jar_small`.
3. Supply localized product names/descriptions and prices; the app already renders store-provided prices.
4. Create a Sandbox tester and validate purchase/repeat behavior for both products.
5. Confirm the support/privacy URLs use `https://sunny-spoon-pantry.web.app/` and `https://sunny-spoon-pantry.web.app/privacy-policy.html`.
6. Prepare iPhone screenshots from the final iOS build. Do not reuse the older Android screenshots without checking current UI and Apple dimensions.
7. Complete App Privacy, age rating, encryption/export-compliance, content-rights, and review-contact fields.

## TestFlight and submission gates

- Clean unit tests and production build.
- Successful Capacitor iOS sync with the native-purchases plugin listed.
- Successful unsigned simulator/device build, then signed Archive validation.
- Real-device Sandbox evidence for both consumable products, including a second purchase.
- No Android-only storefront wording visible on iOS.
- Final App Store screenshot review.
- TestFlight smoke test before production submission.

## Open items found on this Mac

- Xcode command-line build currently waits indefinitely while resolving `capacitor-swift-pm` from GitHub. Open the project once in Xcode with working network access and let package resolution finish before retrying the simulator build.
- `pip-pantry-v3` was owner-approved on 2026-08-04 and applied to the Xcode asset catalog as a 1024px opaque PNG.
- Apple Developer team, App Store Connect app record, product setup, signing, screenshots, and Sandbox purchase evidence still require account/device work.
