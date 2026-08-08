# iOS Release Status

Last updated: 2026-08-05

## 2026-08-05 Apple Developer approval, App Store Connect setup, and archive blocker

- Apple Developer Program (Individual) enrollment approved today. License Agreement and Apple Developer Agreement both accepted.
- Identity verification (US driver's license) completed via the Apple-requested file-upload flow; confirmed by the "We received your documents" email from `developer@email.apple.com`.
- Paid Applications Agreement signed. Bank Account (Bank of America, ACH/ABA routing) and U.S. Form W-9 submitted; both now show **Active** in App Store Connect > Business > Agreements.
- App Store Connect app record created: name "Pip's Picture Pantry", Bundle ID `com.sunnyspoonstudios.pipspicturepantry`, SKU `PIPPICTUREPANTRY001`, Apple ID `6798479149`.
- App Store product page filled in (English U.S.): Promotional Text, Description, Keywords, Support URL (`https://sunny-spoon-pantry.web.app/`), Copyright, App Review contact info. "Sign-in required" left unchecked (app has no login).
- Both consumable in-app purchases created in App Store Connect, status **Prepare for Submission** (no build uploaded yet):
  - `pip_cozy_support` — Reference Name "Cozy Support Pack", $0.99 (Tier 1), grants 150 spoons. Matches `ECONOMY.COZY_PASS_SPOON_GRANT` in `src/data/economyConfig.js`.
  - `pip_spoon_jar_small` — Reference Name "Small Spoon Jar", $2.99, grants 500 spoons. Matches `ECONOMY.SPOON_JAR_SMALL_GRANT`.
  - Both need a Review Screenshot added before they can actually be submitted for review; deferred until a real-device build exists.
- App Information completed: Subtitle "A quiet picture puzzle", Category Games > Puzzle, Content Rights ("does not contain third-party content"), Age Rating questionnaire answered (all None/No) → calculated **4+**.
- App Privacy completed and **published**: "Data Not Collected" (matches `docs/PRIVACY_POLICY.md` — no analytics/ad SDKs, all gameplay data stored locally only). Privacy Policy URL set to `https://sunny-spoon-pantry.web.app/privacy-policy.html`.
- EU Digital Services Act trader-status declaration intentionally left incomplete (optional for now, not blocking).
- Xcode: confirmed `DEVELOPMENT_TEAM = TQDJ9Q73WN` (Jeonghui Hwang / Sunny Spoon Studios), bundle ID, and `MARKETING_VERSION = 1.0` / build `1` were already set correctly (pre-existing from an earlier Codex session, committed before this session). In-App Purchase capability confirmed present in Signing & Capabilities.
- Fixed `ios/App/App/Info.plist`: removed `UIInterfaceOrientationLandscapeLeft`/`Right` from the iPhone `UISupportedInterfaceOrientations` array (iPhone is now portrait-only). iPad keeps all four orientations. Reason: no landscape CSS in `src/styles.css` and no `screenOrientation` lock in the Android manifest either, so landscape was never actually designed/tested on any platform. Committed as `ba916b3`.
- Simulator build succeeds ("Build Succeeded" in Xcode for the iPhone 17 Pro simulator destination).

### Archive blocker (unresolved)

- `xcodebuild archive -destination "generic/platform=iOS" -allowProvisioningUpdates` (also retried with `-configuration Release` explicitly) fails every time with:
  ```
  error: Communication with Apple failed: Your team has no devices from which to generate a provisioning profile. Connect a device to use or manually add device IDs in Certificates, Identifiers & Profiles.
  error: No profiles for 'com.sunnyspoonstudios.pipspicturepantry' were found: Xcode couldn't find any iOS App Development provisioning profiles matching 'com.sunnyspoonstudios.pipspicturepantry'.
  ```
- Root cause: this Apple Developer account was approved today and has **zero registered devices**. Automatic signing resolution appears to require an iOS App Development profile (which needs a device) even when archiving for Release/distribution on a brand-new team, so the archive is blocked before it can even reach the App Store distribution signing step.
- The Xcode GUI shows the same underlying issue in Signing & Capabilities (yellow warning: "Communication with Apple failed... Your team has no devices...").
- No cable is currently available to connect a real device: the owner's iPhone 12 Pro is Lightning, the cable on hand is USB-A-to-Lightning, and this Mac only has USB-C ports (no adapter on hand yet).
- **Next step to unblock**: get a USB-C-to-Lightning cable (or a USB-A-to-USB-C adapter for the existing cable), connect the iPhone 12 Pro once so Xcode registers it as a device, then retry the archive. After that: Organizer → Distribute App → App Store Connect upload → TestFlight → install on the iPhone over Wi-Fi (no cable needed after the first registration) → collect the real-device evidence the "TestFlight and submission gates" section below still requires (screenshots, Sandbox purchase/repeat evidence for both products, guide-overlay/save/reset checks).

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

- `pip-pantry-v3` was owner-approved on 2026-08-04 and applied to the Xcode asset catalog as a 1024px opaque PNG.
- Package resolution for `capacitor-swift-pm` now completes fine once Xcode has been opened with network access; simulator builds succeed.
- **Blocked on archiving for a real device / TestFlight** — see "Archive blocker (unresolved)" above. Needs a USB-C-to-Lightning cable or adapter before it can proceed.
- Once unblocked: upload the first build, add Review Screenshots to both in-app purchases, and collect the real-device Sandbox purchase/repeat evidence still required by "TestFlight and submission gates" below.
