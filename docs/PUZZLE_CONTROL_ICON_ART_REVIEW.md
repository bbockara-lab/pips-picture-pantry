# Puzzle Control Icon Art Review

Last updated: 2026-07-22
Mode: experimental candidate review

## Purpose

This hidden set explores raster replacements for the most repeated CSS control symbols: Fill, Blank Check, Undo, Hint, and Settings. The candidates use the approved spoon token plus the new quick-travel candidate language as visual references, but remain outside runtime UI until reviewed together.

Review board: `docs/art-review/puzzle-control-icon-review-v1.html`

## Candidate Set

- `puzzle-control-fill-candidate-v1.png`: strong first-pass candidate
- `puzzle-control-mark-candidate-v1.png`: strong first-pass candidate
- `puzzle-control-undo-candidate-v1.png`: regenerate before promotion; center reads as a jigsaw piece
- `puzzle-control-hint-candidate-v1.png`: strong first-pass candidate
- `puzzle-control-settings-candidate-v1.png`: strong first-pass candidate

All candidates are transparent RGBA 256x256 PNGs with alpha range 0-255 and transparent corners. Each has a separate archived magenta chroma source because the assets were generated individually.

## Shared Prompt Intent

- one isolated, text-free control object per image
- cream enamel rim and cocoa outline
- amber/gold active action color
- sage/mint secondary action color
- broad silhouette readable at 32px
- no character, face, button plate, UI screenshot, watermark, or cast shadow

## Initial Assessment

Fill, Blank Check, Hint, and Settings form a coherent tactile set and stay recognizable at compact sizes. Fill makes the brush/cell relationship clearer than the current CSS token; Hint naturally ties the light-bulb metaphor to the approved spoon economy; Settings has a friendly six-tooth silhouette.

Undo is deliberately blocked. Although its counter-clockwise arrow reads well, the generated center is a jigsaw puzzle piece rather than a square nonogram cell. Its manifest status carries `candidate-needs-regeneration` and it must not be promoted with the others.

## Approval Rule

Do not import any candidate from runtime source while its manifest entry is hidden. A future promotion must either:

1. regenerate and approve Undo, then promote the coherent five-icon set together, or
2. deliberately scope a smaller approved set while leaving Undo on the existing CSS fallback.

Any runtime slice must update the approved runtime allowlist, remove only the replaced CSS construction, preserve accessible labels, and pass mobile QA plus the full visual pack.
