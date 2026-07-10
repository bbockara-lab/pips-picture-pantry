# Pip Master Art Review

Last updated: 2026-07-05
Mode: experimental candidate review

## Purpose

This file tracks candidate master art for the coordinated Pip / Sunny Spoon Studios visual reset. Nothing listed here is approved for visible UI until it passes character continuity review.

## Candidate: pip-master-key-candidate-v1

Path: `src/assets/characters/pip-master-key-candidate-v1.png`
Manifest id: `pip-master-key-candidate-v1`
Status: candidate, hidden from runtime UI
Review board: `docs/art-review/pip-master-review-v1.html`

### Prompt Intent

Create a premium cozy mobile-game key visual of Pip as the Sunny Spoon Studios pantry helper mascot:

- rounded warm-brown capybara-like silhouette
- tiny cream chef hat
- muted red scarf
- small dot eyes, tiny nose/mouth, soft blush
- warm-brown outline
- calm helper energy
- polished, extremely cute, coherent Sunny Spoon pantry mood

### Initial Assessment

Positive:

- Higher polish target than the current mixed legacy/candidate UI art.
- Strong cozy pantry mood and good first impression.
- Better aligned with chef/scarf/Pip pantry-helper direction than the rejected guide scene.

Needs review before approval:

- Check whether the face and ears read too much like a generic bear rather than a capybara-like Pip.
- Check whether the silhouette matches the app icon and current Pip baseline closely enough.
- Check whether this can become the master style without creating another incompatible Pip variant.

### Approval Rule

Do not wire this candidate into app icon, opening screen, guide dialog, rewards, or completion effects until it is explicitly promoted in `src/data/assetManifest.js` from `candidate` to an approved visible art status.

## Candidate: pip-chrome-candidate-v2

Path: `src/assets/characters/pip-chrome-candidate-v2.png`
Raw source: `src/assets/characters/pip-chrome-candidate-v2-raw.png`
Manifest id: `pip-chrome-candidate-v2`
Status: candidate, hidden from runtime UI

### Prompt Intent

Create a polished Pip chrome sticker candidate for replacing the current visible strip art:

- rounded warm-brown capybara-like pantry helper
- tiny cream chef hat and muted red scarf
- dot eyes, tiny nose/mouth, soft blush, warm-brown outline
- holding a small golden spoon charm
- centered sticker silhouette that reads at header/chrome sizes

### Technical Validation

The source was generated on a flat chroma-key background and converted to transparent PNG with local background removal. It remains hidden and must not be imported by runtime UI until it passes character continuity review.

## Candidate: pip-completion-candidate-v2

Path: `src/assets/characters/pip-completion-candidate-v2.png`
Raw source: `src/assets/characters/pip-completion-candidate-v2-raw.png`
Manifest id: `pip-completion-candidate-v2`
Status: candidate, hidden from runtime UI

### Prompt Intent

Create a polished Pip completion reaction candidate for replacing the current visible completion sticker:

- same Pip identity anchors as the chrome candidate
- celebratory but gentle pantry-helper pose
- golden spoon charm and small blank recipe card
- no readable text, watermark, or background scene
- strong enough for a success panel without becoming a new mascot

### Technical Validation

The source was generated on a flat chroma-key background and converted to transparent PNG with local background removal. It remains hidden and must not be imported by runtime UI until it passes character continuity review.

### Review Board

Use `docs/art-review/pip-master-review-v1.html` to compare the candidate against the current app icon, guide baseline, current visible Pip stickers, and the rejected guide scene. The board is intentionally a docs-only artifact and must not be imported by runtime source.

## Approval - v0.1.94

The user approved this art-quality level for application unless a specific correction is requested. The chrome and completion candidates were promoted into optimized runtime art:

- Chrome runtime asset: `src/assets/characters/pip-chrome-v2.png`
- Completion runtime asset: `src/assets/characters/pip-completion-v2.png`
- The older visible `pip-strip-sticker-v1` and `pip-complete-sticker-v1` runtime uses are now legacy audit assets.

The master key candidate still remains review-only; this approval applies to the two surfaced UI replacement candidates and the overall quality threshold for future art intake.
