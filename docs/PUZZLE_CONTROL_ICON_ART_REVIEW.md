# Puzzle Control Icon Art Review

Last updated: 2026-07-22
Mode: experimental candidate review

## Purpose

This hidden set explores raster replacements for the most repeated CSS control symbols: Fill, Blank Check, Undo, Hint, and Settings. The candidates use the approved spoon token plus the new quick-travel candidate language as visual references, but remain outside runtime UI until reviewed together.

Review board: `docs/art-review/puzzle-control-icon-review-v1.html`

## Candidate Set

- `puzzle-control-fill-candidate-v1.png`: strong first-pass candidate
- `puzzle-control-mark-candidate-v1.png`: strong first-pass candidate
- `puzzle-control-undo-candidate-v1.png`: superseded; center reads as a jigsaw piece
- `puzzle-control-undo-candidate-v2.png`: promising regenerated candidate; center is a square nonogram cell
- `puzzle-control-hint-candidate-v1.png`: strong first-pass candidate
- `puzzle-control-settings-candidate-v1.png`: strong first-pass candidate

All active candidates are transparent RGBA 256x256 PNGs with alpha range 0-255 and transparent corners. Each has a separate archived magenta chroma source because the assets were generated individually. Undo v1 remains archived as evidence for the rejected semantic direction.

## Shared Prompt Intent

- one isolated, text-free control object per image
- cream enamel rim and cocoa outline
- amber/gold active action color
- sage/mint secondary action color
- broad silhouette readable at 32px
- no character, face, button plate, UI screenshot, watermark, or cast shadow

## Initial Assessment

Fill, Blank Check, Hint, and Settings form a coherent tactile set and stay recognizable at compact sizes. Fill makes the brush/cell relationship clearer than the current CSS token; Hint naturally ties the light-bulb metaphor to the approved spoon economy; Settings has a friendly six-tooth silhouette.

Undo v1 remains deliberately blocked because its center is a jigsaw puzzle piece rather than a nonogram cell. Undo v2 preserves the broad counter-clockwise arrow while replacing that center with a straight-sided cream tile and amber filled-square inset. It resolves the known semantic blocker and joins the other four promising candidates for set-level review, but it is not approved for runtime use yet.

## Approval Rule

Do not import any candidate from runtime source while its manifest entry is hidden. A future promotion must either:

1. approve Undo v2 and promote the coherent five-icon set together, or
2. deliberately scope a smaller approved set while leaving Undo on the existing CSS fallback.

Any runtime slice must update the approved runtime allowlist, remove only the replaced CSS construction, preserve accessible labels, and pass mobile QA plus the full visual pack.
