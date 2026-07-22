# Quick Travel Icon Art Review

Last updated: 2026-07-22
Mode: experimental candidate review

## Purpose

This set is the first raster replacement candidate for the shared Puzzle, Album, Pantry, Time Attack, and Map quick-travel symbols. It remains hidden from runtime UI until the five icons are reviewed together for Sunny Spoon world fit, small-size legibility, and route recognition.

Review board: `docs/art-review/quick-travel-icon-review-v1.html`

## Candidate Set

- `src/assets/icons/quick-travel-candidate-v1/quick-travel-puzzle-candidate-v1.png`
- `src/assets/icons/quick-travel-candidate-v1/quick-travel-album-candidate-v1.png`
- `src/assets/icons/quick-travel-candidate-v1/quick-travel-pantry-candidate-v1.png`
- `src/assets/icons/quick-travel-candidate-v1/quick-travel-time-attack-candidate-v1.png`
- `src/assets/icons/quick-travel-candidate-v1/quick-travel-map-candidate-v1.png`

All five files are RGBA 256x256 PNGs with transparent corners. The raw and transparent source sheets are archived beside the crops.

## Prompt Intent

Built-in image generation used the approved opening pantry visual and approved golden spoon token as style references. The prompt requested exactly five isolated, text-free, character-free route objects on a flat magenta chroma background:

1. nonogram picture board
2. album book
3. pantry jar
4. spoon stopwatch
5. folded pantry map with heart pin

The target language is warm cream enamel, cocoa outline, amber highlights, and sage/mint accents with readable silhouettes at 48px.

## Initial Assessment

Positive:

- The set has a noticeably more authored, game-ready finish than the current CSS constructions.
- Puzzle, Album, Time Attack, and Map remain distinct at 48px.
- Material, outline, heart motifs, and palette align well with the approved spoon token and Sunny Spoon pantry artwork.

Review risks:

- Pantry currently reads as a cookie jar first; confirm that this is acceptable for the Pantry/shop destination.
- Album contains more scenic detail than the other tokens and needs a 32px recognition check.
- The set is visually richer than adjacent settings and puzzle-control tokens, so runtime promotion should be a deliberate navigation-only slice with screenshot comparison.

## Approval Rule

Do not import these files from `src/ui`, `src/styles.css`, or any runtime art map while their manifest entries are `candidate` and `visible: false`. Promotion requires:

1. explicit five-icon set approval,
2. manifest status change to approved visible assets,
3. a small runtime mapping module,
4. removal of the replaced CSS icon construction,
5. mobile QA at 360/390/430/675 widths and a full visual-pack comparison.
