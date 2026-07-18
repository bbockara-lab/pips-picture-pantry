# Play Console Billing Setup

Mode: live-candidate release checklist
Last updated: 2026-07-18

This document is the non-secret Play Console setup checklist for the v1 Android store purchases. It keeps the store-side work aligned with the code path guarded by `npm run qa:billing`.

## Managed Products

### Pip Support Pack

- Product ID: `pip_cozy_support`
- Product type: one-time managed product / non-consumable
- Suggested launch price: USD 0.99 / KRW 1,100
- Player-facing reward: 250 spoons
- App copy framing: support Pip, restore purchase, spoons arrive
- Do not describe the player-facing card as a paid tier or free tier.
- English title: Pip Support Pack
- Korean title: Pip 응원팩

### Small Spoon Jar

- Product ID: `pip_spoon_jar_small`
- Product type: managed product / consumable repeatable top-up
- Suggested launch price: USD 2.99 / KRW 3,300-4,400
- Player-facing reward: 750 spoons
- App copy framing: fill the spoon jar for extra hints, room goals, and the next stage
- English title: Small Spoon Jar
- Korean title: 작은 스푼 병

## Play Console Steps

1. Open Play Console for `com.sunnyspoonstudios.pipspicturepantry`.
2. Go to Monetize > Products > In-app products.
3. Create and activate `pip_cozy_support` as a one-time/non-consumable managed product.
4. Create and activate `pip_spoon_jar_small` as a consumable managed product.
5. Set titles and descriptions using support/jar/spoon language, not paid/free tier language.
6. Mention 250 spoons for the support pack and 750 spoons for the spoon jar in the product descriptions.
7. Set launch prices near USD 0.99 / KRW 1,100 and USD 2.99 / KRW 3,300-4,400.
8. Confirm both products are available to the internal or closed test track used for the final AAB.

## Internal Tester Validation

Before public launch, use a Google Play license tester or internal tester account and verify all of these on a real Android install from Play:

- The Settings support card can load the store product.
- Support purchase completes and grants exactly 250 spoons once.
- Closing or cancelling the purchase sheet does not grant spoons.
- Tapping support purchase again after ownership does not grant a duplicate reward.
- Restore keeps or brings back the support state and does not duplicate spoons.
- The Small Spoon Jar card can load the store product.
- Spoon jar purchase completes and grants exactly 750 spoons per completed purchase.
- Spoon jar repeat purchase works with a new store token and grants another 750 spoons.
- Replaying the same spoon jar purchase token does not grant twice.
- Network or store-unavailable errors leave the player in a recoverable state.

Use `npm run billing:evidence` to print the exact Markdown evidence block for `docs/ANDROID_RELEASE_STATUS.md`. Leave the status as `pending` until both products are tested on a Play-installed Android build, then change it to `passed` with tester/device/build details.

## Final Release Rule

Do not build the final signed Play-upload AAB until:

- Both Play Console managed products are active.
- `npm run qa:billing` passes.
- `npm run billing:evidence:check` passes after the real-device evidence block is marked passed.
- `npm run qa:release:final` passes after the final Android version bump.
- A real-device internal tester support purchase/restore pass is recorded in `docs/ANDROID_RELEASE_STATUS.md`.
- A real-device internal tester spoon jar purchase/repeat pass is recorded in `docs/ANDROID_RELEASE_STATUS.md`.
