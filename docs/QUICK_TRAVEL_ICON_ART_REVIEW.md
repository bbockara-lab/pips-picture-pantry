# Quick Travel Icon Art Review

Last updated: 2026-07-22
Mode: approved runtime artwork

## Purpose

This set began as the first raster replacement candidate for the shared Puzzle, Album, Pantry, Time Attack, and Map quick-travel symbols. The five icons were reviewed together for Sunny Spoon world fit, small-size legibility, and route recognition, then promoted as the v0.1.496 runtime navigation set.

Review board: `docs/art-review/quick-travel-icon-review-v1.html`

## Candidate Set

- `src/assets/icons/quick-travel-candidate-v1/quick-travel-puzzle-candidate-v1.png`
- `src/assets/icons/quick-travel-candidate-v1/quick-travel-album-candidate-v1.png`
- `src/assets/icons/quick-travel-candidate-v1/quick-travel-pantry-candidate-v1.png`
- `src/assets/icons/quick-travel-candidate-v1/quick-travel-time-attack-candidate-v1.png`
- `src/assets/icons/quick-travel-candidate-v1/quick-travel-map-candidate-v1.png`

All five files are RGBA 256x256 PNGs with transparent corners. The raw and transparent source sheets are archived beside the crops.

Approved runtime derivatives live under `src/assets/icons/quick-travel-v1/` with candidate-free filenames. The original candidate crops remain hidden as review history.

## Prompt Intent

Built-in image generation used the approved opening pantry visual and approved golden spoon token as style references. The prompt requested exactly five isolated, text-free, character-free route objects on a flat magenta chroma background:

1. nonogram picture board
2. album book
3. pantry jar
4. spoon stopwatch
5. folded pantry map with heart pin

The target language is warm cream enamel, cocoa outline, amber highlights, and sage/mint accents with readable silhouettes at 48px.

## Promotion Assessment

Positive:

- The set has a noticeably more authored, game-ready finish than the current CSS constructions.
- Puzzle, Album, Time Attack, and Map remain distinct at 48px.
- Material, outline, heart motifs, and palette align well with the approved spoon token and Sunny Spoon pantry artwork.

Accepted tradeoffs:

- Pantry reads as a cookie jar first, but the route label and shop/decorate hint keep the destination explicit.
- Album carries more scenic detail than the other tokens, but its book silhouette remains distinct at compact trigger/menu sizes.
- The set is intentionally richer than adjacent CSS controls; promotion is limited to the shared navigation surface while puzzle controls remain a separate review lane.

## Approval Rule

The original candidate files remain hidden and must not be imported directly. The approved runtime derivatives are allowlisted through `src/data/runtimeArt.js` and mapped by `src/data/quickTravelArt.js`. Any future replacement requires:

1. explicit five-icon set review,
2. new approved visible manifest entries,
3. runtime allowlist and mapping updates,
4. removal of the replaced construction without changing accessible route copy,
5. mobile QA at 360/390/430/675 widths and a full visual-pack comparison.
