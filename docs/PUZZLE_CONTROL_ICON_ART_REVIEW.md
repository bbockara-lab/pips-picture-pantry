# Puzzle Control Icon Art Review

Last updated: 2026-07-22
Mode: live set with archived experimental history

## Purpose

This set replaces the most repeated CSS control symbols: Fill, Blank Check, Undo, Hint, and Settings. Fill, Blank Check, and regenerated Undo v2 were promoted to the live puzzle shelf in v0.1.497. Hint and Settings passed their separate 54px and 44px context reviews and completed the approved runtime set in v0.1.498.

Review board: `docs/art-review/puzzle-control-icon-review-v1.html`

## Candidate Set

- `puzzle-control-fill-candidate-v1.png`: promoted as `puzzle-control-fill-v1.png`
- `puzzle-control-mark-candidate-v1.png`: promoted as `puzzle-control-mark-v1.png`
- `puzzle-control-undo-candidate-v1.png`: superseded; center reads as a jigsaw piece
- `puzzle-control-undo-candidate-v2.png`: promoted as `puzzle-control-undo-v1.png`; center is a square nonogram cell
- `puzzle-control-hint-candidate-v1.png`: promoted as `puzzle-control-hint-v1.png`
- `puzzle-control-settings-candidate-v1.png`: promoted as `puzzle-control-settings-v1.png`

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

Undo v1 remains deliberately blocked because its center is a jigsaw puzzle piece rather than a nonogram cell. Undo v2 preserves the broad counter-clockwise arrow while replacing that center with a straight-sided cream tile and amber filled-square inset. Together with Fill and Blank Check, it now forms the approved live three-action shelf. The runtime copies are isolated under `puzzle-controls-v1`; archived candidates remain hidden for provenance and rollback.

## Approval Rule

Do not import any candidate from runtime source while its manifest entry is hidden. The v0.1.497 promotion deliberately scoped the live set to the three primary shelf actions and required:

1. approved runtime copies plus an explicit allowlist,
2. unchanged accessible button names and puzzle behavior,
3. exact 256x256 raster identity checks in mobile QA,
4. removal of the replaced pseudo-element construction only for raster-backed icons.

All five live derivatives are isolated under `puzzle-controls-v1` and guarded by the runtime allowlist. The generated candidates and sources remain hidden review history and must not be imported directly.

The 20px how-to legend remains on its compact CSS tokens. A v0.1.499 reuse trial showed that the 256px control art's transparent margins collapse the three silhouettes at legend scale, while enlarging the slot makes the 360px guide card taller and wraps Undo. Use dedicated tightly cropped micro-icons for that surface rather than shrinking these runtime masters.
