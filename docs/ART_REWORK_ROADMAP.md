# Pip's Picture Pantry Art Rework Roadmap

Last updated: 2026-07-05
Mode: experimental art-system reset

## Goal

Rebuild the visible art direction as one coherent Sunny Spoon Studios world, not a collection of convenient generated or legacy images. The target quality is premium cozy mobile-game art: extremely cute, polished, warm, consistent, and immediately recognizable as Pip's Picture Pantry.

## Core Principle

Every visible player-facing image must answer three questions before it ships:

1. Does this look like the same Pip and the same Sunny Spoon Studios world?
2. Is the quality high enough to sit next to the best generated guide-art attempt, not merely acceptable as a placeholder?
3. Does this asset have a specific product role, instead of being a reused character sheet or random cute image?

If any answer is no, the asset stays hidden, candidate-only, or replaced by a conservative non-art layout.

## Unified Pip Standard

Pip must stay one character across app icon, opening screen, guide dialogs, completion reactions, spoon rewards, badges, Pantry decorations, and future store art.

Required identity anchors:

- rounded warm-brown capybara-like pantry helper silhouette
- tiny cream chef hat
- muted red scarf
- small dot eyes, tiny nose/mouth, soft blush
- warm-brown outline and soft sticker-like readability
- calm, loyal, quietly funny helper energy

Avoid:

- generic bear, hamster, plush toy, or unrelated mascot drift
- changing Pip's face shape between screens
- using a cast sheet crop as a finished scene
- mixing unrelated lighting, palettes, render styles, or proportions in the same first-run flow

## Surface-By-Surface Reset Order

### Phase 1 - Stop Visible Inconsistency

- Opening screen: remove inconsistent cast-sheet collage from the first viewport until a coherent key visual is approved.
- Guide dialog: use only baseline Pip art or approved new Pip-specific guide art.
- Completion and reward moments: keep current art visible only where it is already baseline/temporary-approved; do not expand reuse.
- Asset manifest: rejected identity drift must remain hidden and fail QA if visible.

### Phase 2 - Establish Final Style Target

Create or approve a small master set before broad replacement:

1. Sunny Spoon Studios reusable studio bumper/mark
2. app icon and runtime Pip identity alignment
3. Pip master portrait/key visual
4. Pip guide pose set: hello, clue-pointing, cheering
5. polished spoon/charm currency icon
6. first stage reward/badge style sample
7. opening key visual background

These should be reviewed as a set for consistency before wiring into multiple screens.

### Phase 3 - Replace High-Frequency Assets

Priority order:

1. app icon / launch identity alignment
2. Sunny Spoon Studios reusable studio screen
3. game start screen key visual
4. spoon icon and reward chips
5. guide dialog art
6. puzzle completion effect art
7. stage badges and reward art
8. Pantry decoration item set
9. floating navigation icons

## Implementation Rules

- Candidate art may exist in the repo, but visible UI must import only approved continuity-safe assets.
- A new generated image starts as candidate, never approved by default.
- Candidate approval requires local visual review against `docs/CHARACTER_IP_BIBLE.md`, `docs/ART_DIRECTION.md`, and `src/data/characterIdentity.js`.
- The production bundle should not include rejected large art through runtime imports.
- Large PNGs should be optimized to WebP or downscaled after approval, not before identity review.

## Current Decision - 2026-07-05

The generated `pip-guide-scene-v1.png` is rejected for character drift: it is cute and polished but reads as an unfamiliar bear-like mascot rather than Pip. It remains in the asset manifest only as a rejected audit record and must not be visible.

The opening screen no longer shows the inconsistent cast-sheet collage. A coherent Sunny Spoon/Pip key visual should replace that space after the master style target is approved. The first free-stage reward style sample, `pips-first-shelf-reward-candidate-v1`, is now hidden in review and should be used to decide whether this scene-card language can scale to the other free stages.

## Shared Studio Opening Requirement - 2026-07-06

The first-run identity sequence should be designed as three coordinated layers: app icon, Sunny Spoon Studios bumper, and Pip's Picture Pantry start screen. The studio bumper must be reusable across future Sunny Spoon Studios games, so it should avoid puzzle-specific mechanics, Pantry-only props, or one-off character poses that cannot scale to another title. The game start screen can then become more Pip/Pantry-specific while preserving the same illustration quality, palette, outline language, and cozy lighting.
