# Stage Reward Art Review

Last updated: 2026-07-05
Mode: experimental candidate review

## Purpose

This file tracks stage reward / album card art candidates before they become visible runtime assets. Stage reward art must feel like the Sunny Spoon Studios world and must not reuse Pip stickers, cast sheets, or unrelated generated images as a shortcut.

## Candidate: pips-first-shelf-reward-candidate-v1

Path: `src/assets/stage-rewards/pips-first-shelf-reward-candidate-v1.png`
Manifest id: `pips-first-shelf-reward-candidate-v1`
Stage pack: `pips-first-shelf`
Status: candidate, hidden from runtime UI
Review board: `docs/art-review/stage-reward-review-v1.html`

### Prompt Intent

Create a premium square reward illustration for the first free stage, "Pip's First Shelf":

- warm pantry shelf at sunrise
- golden spoon charm as the stage reward object
- small cozy pantry props such as towel, jar, and recipe card
- optional framed Pip portrait only if it preserves Pip identity
- polished enough for tile reveal, album card, and future badge source review

### Initial Assessment

Positive:

- Strong cozy pantry mood and clear reward-card role.
- Better product fit than using a character sheet or random sticker as stage reward art.
- Visually compatible with the approved golden spoon token direction.

Needs review before approval:

- Check whether any Pip portrait detail still reads as the same capybara-like Pip rather than a generic animal mascot.
- Check whether the square scene remains readable in small album and stage-complete contexts.
- Decide whether this visual language should become the template for the other four free-stage reward candidates.

### Approval Rule

Do not add this image to `src/data/stageArt.js` or any runtime UI import until it is explicitly promoted in `src/data/assetManifest.js` from hidden candidate to approved visible stage reward art.


## Approval - v0.1.94

The user approved this art-quality level for application unless a specific correction is requested. The candidate was promoted into optimized runtime art:

- Runtime asset: `src/assets/stage-rewards/pips-first-shelf-reward-v1.webp`
- Runtime map: `src/data/stageArt.js` now exposes it for `pips-first-shelf`
- Candidate source remains archived for review history.


## Approval - v0.1.95

The remaining four free-stage reward artworks were generated at the approved quality threshold and promoted into optimized runtime WebP assets:

- `src/assets/stage-rewards/sunny-spoon-sign-reward-v1.webp`
- `src/assets/stage-rewards/apron-drawer-reward-v1.webp`
- `src/assets/stage-rewards/bakery-window-reward-v1.webp`
- `src/assets/stage-rewards/village-pantry-reward-v1.webp`

Together with `pips-first-shelf-reward-v1.webp`, all five free progression stage reward surfaces now have approved Sunny Spoon reward art.
