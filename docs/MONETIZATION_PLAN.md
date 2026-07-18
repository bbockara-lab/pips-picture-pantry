# Monetization Plan

Last updated: 2026-07-17

## Position

Pip's Picture Pantry should launch as a warm, mostly free cozy puzzle game with one visible, optional support purchase. Monetization exists to support the pantry loop and give fast players a fair spoon top-up path, not to interrupt puzzle play or make the first session feel blocked.

## v1 Android Product

- Product ID: `pip_cozy_support`.
- Type: one-time non-consumable support pack.
- Suggested price: about USD 0.99 / KRW 1,100, finalized in Play Console.
- Reward: 250 spoons through `COZY_PASS_SPOON_GRANT`.
- Player framing: support Pip and add spoons to the pantry.
- User-facing copy should not use paid/free category language in English or Korean. Use store, support, spoons, restore, and thank-you language.
- Ads remain deferred for v1.

## Why It Ships In v1

Launching with no visible store economy and adding purchases later would teach early players that the game is purely free, then change expectations after trust is formed. v1 should therefore include the small optional support pack from the start, while keeping the first-session experience generous and non-pushy.

The support pack also protects fast players from a dead end if they exhaust spoons before the next natural earning loop. It is intentionally small and low-price so it feels like a friendly top-up, not a whale-oriented economy.

## UX Rules

- Never interrupt active puzzle play with a purchase prompt.
- Do not show purchase prompts before the player understands puzzles, spoons, and Pantry goals.
- Keep the support pack in Settings or a gentle store/support surface, not as a modal roadblock.
- When a player lacks spoons, explain the earning paths first: solve puzzles, replay eligible picks, Time Attack, daily rewards, and Pantry goals.
- If the support pack appears near a spoon shortage, frame it as optional help, not the only solution.
- Purchase restore must be visible wherever the support pack is offered.
- After purchase or restore, the UI should show a thank-you state and avoid offering the same pack again.

## Economy Guardrails

- Starter content remains playable without purchase.
- Season 0 launches with 333 polished puzzles; puzzle count is not a paywall by itself.
- Spoon sinks should come from meaningful choices: unlocking packs, decorating rooms, using extra hints, and Time Attack pressure.
- Extra hints spend spoons after the included allowance is exhausted. Undo may clear hint-revealed cells, but it must not refund hint usage or spoon spending.
- Time Attack hints remain a separate tuning lane: smaller reveal payload, stronger record-pressure context, clear spoon cost.
- Replay rewards stay capped and deterministic so replay cannot become the dominant spoon farm.

## Implementation Status

- Android Billing uses `@capgo/native-purchases` and product ID `pip_cozy_support`.
- `src/game/billing.js` handles product lookup, purchase, restore, cancellation/network/failure status, and entitlement response variants.
- `src/game/save.js` already stores `cozyPassPurchased` and grants the one-time spoon reward with duplicate protection.
- `scripts/billing_release_check.js` guards dependency, manifest permission, i18n keys, policy docs, product ID, purchase/restore wiring, and player-facing copy hygiene.
- Play Console managed product setup is still required before final signed upload testing; follow `docs/PLAY_CONSOLE_BILLING_SETUP.md`.
- v1 validation is client-side Google Play Billing result plus local duplicate guard. Server validation, refund revocation handling, and richer support products are deferred until v1.1+ if needed.

## Deferred

- Consumable spoon bundles.
- Ad removal package.
- Rewarded ads.
- Cozy Pass subscription.
- Server-side receipt validation.
- Automatic refund/revocation sync.
- iOS StoreKit implementation.

These should only be revisited after v1 play data shows where players actually run out of spoons and which loops they enjoy enough to support.
