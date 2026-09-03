# Monetization Plan

Last updated: 2026-08-20

## Position

Pip's Picture Pantry should launch as a warm, mostly free cozy puzzle game with two visible, optional Google Play purchases: one small repeatable support pack and one repeatable spoon top-up. Monetization exists to support the pantry loop and give fast players a fair spoon path, not to interrupt puzzle play or make the first session feel blocked.

## v1 Android Products

### Pip Support Pack

- Product ID: `pip_cozy_support`.
- Type: repeatable consumable support top-up.
- Suggested price: about USD 0.99 / KRW 1,100, finalized in Play Console.
- Reward: 150 spoons through `COZY_PASS_SPOON_GRANT`.
- Player framing: support Pip and add spoons to the pantry.
- Each completed purchase grants 150 spoons; a store purchase token may grant only once.

### Small Spoon Jar

- Product ID: `pip_spoon_jar_small`.
- Type: repeatable consumable spoon top-up.
- Suggested price: about USD 2.99 / KRW 3,300-4,400, finalized in Play Console.
- Reward: 500 spoons through `SPOON_JAR_SMALL_GRANT`.
- The jar grants about 11% more than three support packs (500 vs 450 spoons).
- Player framing: refill the spoon jar for extra hints, room goals, and the next stage.
- The app keeps a local `processedBillingPurchaseIds` guard so the same store purchase token cannot grant twice.

Shared rules:

- User-facing copy should not use paid/free category language in English or Korean. Use store, support, spoons, jar, and thank-you language.
- Ads remain deferred for v1.

## Post-Korean-Theme Banner Ad Experiment — Owner Direction 2026-08-20

### Release order

1. Ship the Korean seasonal/theme update without introducing advertising.
2. In the following update, run a limited small-banner monetization experiment.
3. Treat the first advertising release as an instrumented experiment, not a permanent entitlement to occupy every screen.

### Initial placement

- Start with one dedicated bottom advertising rail on ordinary puzzle play only.
- Do not place the banner over the puzzle grid, clue numbers, cursor/D-pad, hint, fill/blank, undo, completion action, floating navigation, or device safe area.
- The page must reserve a real layout slot for the loaded banner; never position an ad as an overlay over gameplay.
- When no ad is available, collapse the slot so an empty white/black bar does not remain.
- Maintain clear separation from interactive game controls to reduce accidental taps.
- Do not show the first banner during onboarding, the guided practice puzzle, character dialogue, purchase flow, or a developer letter.
- Home-screen, Pantry, Album, Time Attack, mailbox, and full-screen interstitial placements are outside the first experiment.

### Commercial stance

- Evaluate the banner as a real revenue surface rather than hiding it so thoroughly that it cannot perform.
- Keep the ad visibly separate from Sunny Spoon artwork and label it according to the provider/platform requirements.
- Measure impressions, fill rate, effective revenue, session length, puzzle completion, early exits, repeat sessions, crashes, and layout regressions.
- Compare revenue against any loss in play completion and retention before expanding placement.
- If the banner performs without materially damaging play, consider additional calm non-gameplay placements in a later experiment.
- Interstitial, rewarded, and app-open formats require a separate owner decision and design review; they are not implicitly approved by this banner direction.

### Player purchase path

- Prepare a one-time Remove Ads purchase alongside or immediately after the banner experiment so players have a direct permanent opt-out.
- Decide before implementation whether previous Pip Support Pack purchasers receive ad removal automatically or a separate loyalty benefit.
- Store copy must say exactly which formats are removed and whether any future optional rewarded format remains.

### Mandatory pre-implementation gates

- Select an ad provider only after SDK size, child/family suitability, data collection, consent support, regional availability, fill, and mediation requirements are reviewed.
- Update the privacy policy, App Store privacy disclosure, Google Play Data safety form, age-rating answers, consent flow, and store release notes before public rollout.
- Add Android and iOS native test-ad configuration; production ad-unit identifiers must never be used for automated or development tapping.
- Add QA for loaded, failed, offline, consent-required, purchased-ad-free, narrow-phone, tablet, rotation, keyboard, and safe-area states.
- Verify the exact signed Android and iOS candidates on physical devices before calling the placement resolved.
- Establish a remote disable path or release rollback plan before enabling production inventory.

### Success and stop criteria

Initial thresholds must be set from baseline analytics collected before the ad release. At minimum, stop or remotely disable the experiment if it causes:

- puzzle controls or clues to become obscured;
- meaningful puzzle-completion or next-day-retention decline;
- accidental-navigation/tap complaints;
- consent, privacy, age-rating, or store-policy uncertainty;
- material crash, ANR, startup, battery, or network regressions;
- banner persistence after a verified Remove Ads entitlement.

## Why It Ships In v1

Launching with no visible store economy and adding purchases later would teach early players that the game is purely free, then change expectations after trust is formed. v1 should therefore include a small optional store economy from the start, while keeping the first-session experience generous and non-pushy.

The support pack offers a low-cost way to support Pip, while the Small Spoon Jar protects fast players from a dead end if they exhaust spoons before the next natural earning loop. Both are intentionally modest so they feel like friendly support and top-up options, not a whale-oriented economy.

## UX Rules

- Never interrupt active puzzle play with a purchase prompt.
- Do not show purchase prompts before the player understands puzzles, spoons, and Pantry goals.
- Keep the support pack and spoon jar in Settings or a gentle store/support surface, not as modal roadblocks.
- When a player lacks spoons, explain the earning paths first: solve puzzles, replay eligible picks, Time Attack, daily rewards, and Pantry goals.
- If store options appear near a spoon shortage, frame them as optional help, not the only solution.
- Both purchases remain repeatable, but only as intentional button taps from a store/settings surface.
- After a completed purchase, keep the relevant action available for a future distinct purchase and never replay the same token reward.

## Economy Guardrails

- Starter content remains playable without purchase.
- Season 0 launches with 333 polished puzzles; puzzle count is not a paywall by itself.
- Spoon sinks should come from meaningful choices: unlocking packs, decorating rooms, using extra hints, and Time Attack pressure.
- Extra hints spend spoons after the included allowance is exhausted. Undo may clear hint-revealed cells, but it must not refund hint usage or spoon spending.
- Time Attack hints remain a separate tuning lane: smaller reveal payload, stronger record-pressure context, clear spoon cost.
- Replay rewards stay capped and deterministic so replay cannot become the dominant spoon farm.

## Implementation Status

- Android Billing uses `@capgo/native-purchases` and product IDs `pip_cozy_support` and `pip_spoon_jar_small`.
- `src/game/billing.js` handles product lookup, support purchase, repeat support purchase, spoon jar purchase, cancellation/network/failure status, entitlement response variants, and consumable purchase-token extraction.
- `src/game/save.js` stores `processedBillingPurchaseIds` so the same support-pack or spoon-jar purchase token cannot be replayed.
- `scripts/billing_release_check.js` guards dependency, manifest permission, i18n keys, policy docs, both product IDs, repeatable consumable wiring for both products, and player-facing copy hygiene.
- Play Console managed product setup is still required for both products before final signed upload testing; follow `docs/PLAY_CONSOLE_BILLING_SETUP.md`.
- v1 validation is client-side Google Play Billing result plus local duplicate guard. Server validation, refund revocation handling, and richer support products are deferred until v1.1+ if needed.

## Deferred

- Larger consumable spoon bundles.
- Ad removal package is deferred only until the post-Korean-theme banner experiment described above.
- Rewarded ads remain separately deferred and are not part of the first banner experiment.
- Cozy Pass subscription.
- Server-side receipt validation.
- Automatic refund/revocation sync.
- iOS StoreKit implementation.

These should only be revisited after v1 play data shows where players actually run out of spoons and which loops they enjoy enough to support.
