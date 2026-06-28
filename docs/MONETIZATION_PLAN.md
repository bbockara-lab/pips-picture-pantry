# Monetization Plan

Last updated: 2026-06-28

## Position

Monetization is a trial integration, not the product goal. The first release should sell the world, Pip, and the cozy puzzle loop before it tries to optimize revenue.

## MVP Recommendation

- Keep starter content free.
- Add one optional support purchase later: `Support Pip's Pantry`.
- Add one optional low-price bonus pack later: `Pip's Pantry Shelf Plus`.
- Do not add forced ads, rewarded-ad dependency, energy, timers, currency, or limited lives.
- For week-one release, prefer no ads and no required purchase flow unless store setup is already stable.

## Store Product Candidates

- `support_pips_pantry`: non-consumable support purchase.
- `pip_pantry_shelf_plus`: non-consumable bonus puzzle pack.

## Implementation Timing

- Milestone 1-3: no real purchases, only code architecture that does not block IAP later.
- Milestone 4: add a disabled monetization surface in settings if needed for review discussion.
- Store build: integrate platform billing only after official policy and SDK setup are verified.

## Policy Notes Checked 2026-06-28

- Google Play Billing is the official path for selling digital products and content in Android apps.
- Apple In-App Purchase supports consumable, non-consumable, auto-renewable subscription, and non-renewing subscription types.
- Ads add policy and content-rating burden. Since this product should feel gentle and most content should remain free, ads are deferred.
- If ads are ever added, avoid full-screen ads during gameplay, level starts, loading screens, or any unexpected interruption.

## UX Rules

- Never interrupt puzzle play with purchase prompts.
- No purchase prompt before a player completes at least several puzzles.
- Purchases should feel like supporting the pantry, not escaping friction.
