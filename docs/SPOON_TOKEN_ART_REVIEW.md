# Spoon Token Art Review

Last updated: 2026-07-05
Mode: experimental candidate review

## Candidate: spoon-token-candidate-v2

Path: `src/assets/icons/spoon-token-candidate-v2.png`
Raw chroma source: generated from built-in image generation, copied through `src/assets/icons/spoon-token-candidate-v2-raw.png` during processing.
Manifest id: `spoon-token-candidate-v2`
Status: approved derivative promoted to `spoon-token-v2`; original candidate archived hidden

## Prompt Intent

Create a premium cozy mobile-game currency icon that can eventually replace the current temporary spoon token:

- one rounded golden spoon charm
- no face, no text, no mascot
- warm cream rim and cocoa outline
- readable at small UI sizes
- polished cozy pantry mood
- transparent PNG after chroma-key removal

## Technical Validation

- Output path: `src/assets/icons/spoon-token-candidate-v2.png`
- Mode/size: RGBA, 1254x1254
- Alpha: transparent corners confirmed, alpha range 0-255
- Runtime status: not imported by app UI; registered as hidden candidate only

## Approval Rule

Completed in v0.1.91: `spoon-token-v2` is the approved runtime currency asset. Future replacements must still follow the same flow: candidate review first, then explicit manifest promotion, then one deliberate runtime import switch.

## Approval - v0.1.91

User review: the spoon icon was approved as very satisfying. The high-resolution candidate was downscaled into `src/assets/icons/spoon-token-v2.png` for runtime use.

Runtime asset:

- Path: `src/assets/icons/spoon-token-v2.png`
- Mode/size: RGBA, 256x256
- Alpha: transparent corner and 0-255 alpha range confirmed
- Manifest id: `spoon-token-v2`
- Status: approved visible currency art

The legacy `spoon-token-v1` asset is now hidden in the manifest and kept only as audit history.
