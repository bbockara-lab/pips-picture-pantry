# Monetization Plan

Last updated: 2026-07-18

## Position

Pip's Picture Pantry should launch as a warm, mostly free cozy puzzle game with two visible, optional Google Play purchases: one small one-time support pack and one repeatable spoon top-up. Monetization exists to support the pantry loop and give fast players a fair spoon path, not to interrupt puzzle play or make the first session feel blocked.

## v1 Android Products

### Pip Support Pack

- Product ID: `pip_cozy_support`.
- Type: one-time non-consumable support pack.
- Suggested price: about USD 0.99 / KRW 1,100, finalized in Play Console.
- Reward: 250 spoons through `COZY_PASS_SPOON_GRANT`.
- Player framing: support Pip and add spoons to the pantry.
- Restore must be visible because the player can only own this once.

### Small Spoon Jar

- Product ID: `pip_spoon_jar_small`.
- Type: repeatable consumable spoon top-up.
- Suggested price: about USD 2.99 / KRW 3,300-4,400, finalized in Play Console.
- Reward: 750 spoons through `SPOON_JAR_SMALL_GRANT`.
- Player framing: refill the spoon jar for extra hints, room goals, and the next stage.
- The app keeps a local `processedBillingPurchaseIds` guard so the same store purchase token cannot grant twice.

Shared rules:

- User-facing copy should not use paid/free category language in English or Korean. Use store, support, spoons, restore, jar, and thank-you language.
- Ads remain deferred for v1.

## Why It Ships In v1

Launching with no visible store economy and adding purchases later would teach early players that the game is purely free, then change expectations after trust is formed. v1 should therefore include a small optional store economy from the start, while keeping the first-session experience generous and non-pushy.

The support pack establishes trust and restore safety, while the Small Spoon Jar protects fast players from a dead end if they exhaust spoons before the next natural earning loop. Both are intentionally modest so they feel like friendly support and top-up options, not a whale-oriented economy.

## UX Rules

- Never interrupt active puzzle play with a purchase prompt.
- Do not show purchase prompts before the player understands puzzles, spoons, and Pantry goals.
- Keep the support pack and spoon jar in Settings or a gentle store/support surface, not as modal roadblocks.
- When a player lacks spoons, explain the earning paths first: solve puzzles, replay eligible picks, Time Attack, daily rewards, and Pantry goals.
- If store options appear near a spoon shortage, frame them as optional help, not the only solution.
- Purchase restore must be visible wherever the one-time support pack is offered.
- After support purchase or restore, the UI should show a thank-you state and avoid offering the same pack again.
- The spoon jar remains repeatable, but only as an intentional button tap from a store/settings surface.

## Economy Guardrails

- Starter content remains playable without purchase.
- Season 0 launches with 333 polished puzzles; puzzle count is not a paywall by itself.
- Spoon sinks should come from meaningful choices: unlocking packs, decorating rooms, using extra hints, and Time Attack pressure.
- Extra hints spend spoons after the included allowance is exhausted. Undo may clear hint-revealed cells, but it must not refund hint usage or spoon spending.
- Time Attack hints remain a separate tuning lane: smaller reveal payload, stronger record-pressure context, clear spoon cost.
- Replay rewards stay capped and deterministic so replay cannot become the dominant spoon farm.

## Implementation Status

- Android Billing uses `@capgo/native-purchases` and product IDs `pip_cozy_support` and `pip_spoon_jar_small`.
- `src/game/billing.js` handles product lookup, support purchase, support restore, spoon jar purchase, cancellation/network/failure status, entitlement response variants, and consumable purchase-token extraction.
- `src/game/save.js` stores `cozyPassPurchased`, grants the one-time support reward with duplicate protection, and stores `processedBillingPurchaseIds` so the same spoon jar purchase token cannot be replayed.
- `scripts/billing_release_check.js` guards dependency, manifest permission, i18n keys, policy docs, both product IDs, purchase/restore wiring, consumable jar wiring, and player-facing copy hygiene.
- Play Console managed product setup is still required for both products before final signed upload testing; follow `docs/PLAY_CONSOLE_BILLING_SETUP.md`.
- v1 validation is client-side Google Play Billing result plus local duplicate guard. Server validation, refund revocation handling, and richer support products are deferred until v1.1+ if needed.

## Deferred

- Larger consumable spoon bundles.
- Ad removal package.
- Rewarded ads.
- Cozy Pass subscription.
- Server-side receipt validation.
- Automatic refund/revocation sync.
- iOS StoreKit implementation.

These should only be revisited after v1 play data shows where players actually run out of spoons and which loops they enjoy enough to support.
