# Play Console Billing Setup

Mode: live-candidate release checklist
Last updated: 2026-07-17

This document is the non-secret Play Console setup checklist for the v1 Android support purchase. It keeps the store-side work aligned with the code path guarded by `npm run qa:billing`.

## Managed Product

- Product ID: `pip_cozy_support`
- Product type: one-time managed product / non-consumable
- Suggested launch price: USD 0.99 / KRW 1,100
- Player-facing reward: 250 spoons
- App copy framing: support Pip, restore purchase, spoons arrive
- Do not describe the player-facing card as a paid tier or free tier.

## Play Console Steps

1. Open Play Console for `com.sunnyspoonstudios.pipspicturepantry`.
2. Go to Monetize > Products > In-app products.
3. Create a managed product with ID `pip_cozy_support`.
4. Set the title and description using support-pack language:
   - English title: Pip Support Pack
   - Korean title: Pip 응원팩
   - Mention 250 spoons in the description.
5. Set the launch price near USD 0.99 / KRW 1,100.
6. Activate the product.
7. Confirm the product is available to the internal or closed test track used for the final AAB.

## Internal Tester Validation

Before public launch, use a Google Play license tester or internal tester account and verify all of these on a real Android install from Play:

- The Settings support card can load the store product.
- Purchase completes and grants exactly 250 spoons once.
- Closing or cancelling the purchase sheet does not grant spoons.
- Tapping purchase again after ownership does not grant a duplicate reward.
- Restore keeps or brings back the support state and does not duplicate spoons.
- Network or store-unavailable errors leave the Restore path visible when recovery makes sense.

## Final Release Rule

Do not build the final signed Play-upload AAB until:

- This Play Console managed product is active.
- `npm run qa:billing` passes.
- `npm run qa:release:final` passes after the final Android version bump.
- A real-device internal tester purchase/restore pass is recorded in `docs/ANDROID_RELEASE_STATUS.md`.
