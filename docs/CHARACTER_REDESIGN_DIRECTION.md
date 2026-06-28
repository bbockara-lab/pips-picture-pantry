# Character Redesign Direction

Last updated: 2026-06-28

## Status

- Mode: approved visual direction for Pip's Picture Pantry MVP.
- User approved the first generated direction as the production target direction on 2026-06-28.
- Current production UI may still contain older placeholder assets until each surface is intentionally replaced.
- Approved direction reference: docs/visual-concepts/pip-cast-redesign-concept-v1.png

## Why Redesign

User and family feedback flagged the current Pip/cast art as too AI-like and not cute enough. The redesign should reduce glossy rendering, excessive fur detail, uncanny facial polish, and unclear cropped character-sheet usage in UI.

## Direction

- Simple 2D sticker feeling, not semi-realistic rendering.
- Rounded, soft, child-friendly silhouettes.
- Thick warm-brown outline and flat, readable shapes.
- Low-detail faces: dot eyes, small nose, small mouth, light blush.
- Capybara should be cuter through simplification and proportion, not realistic anatomy.
- Cozy pantry/cafe identity can appear through small outfit details: scarf, apron, chef cap, spoon, recipe card.
- Palette should stay warm but cleaner: cream, toast, cocoa, honey, mint, muted coral.

## Avoid

- Do not copy or closely imitate specific existing brands, sticker packs, games, or mascot franchises.
- Avoid highly recognizable Sanrio, Animal Crossing, Capoo, Mofusand, Supercell, or other franchise-specific proportions, faces, or outlines.
- Avoid photorealistic fur, shiny AI gloss, excessive eye highlights, and over-detailed accessories.
- Avoid cropped character sheets inside gameplay UI unless the crop is hand-composed and clearly intentional.

## IP / Clearance Notes

This is not legal advice. Pip as a name, capybara as an animal, and cozy pantry themes are not enough by themselves to define a copyright problem, but final commercial use still needs clearance work:

- Visual similarity review against major mobile games, sticker brands, toy brands, and character franchises.
- Trademark search for Sunny Spoon Studios, Pip's Picture Pantry, Pip, and major character names in target markets.
- Provenance record for generated and edited assets.
- If an external illustrator is used later, written assignment/license terms for commercial use.

## App UI Rule

Player-facing screens should not use ambiguous character-sheet crops. Character art in gameplay should either be a deliberate helper portrait, a finished reward card, or a polished sticker asset.

## Integration Notes

- v0.1.5 uses a resized app copy of the approved redesign concept as the game identity cast image: src/assets/characters/pip-cast-redesign-concept-v1-web.jpg.
- The app icon and native launcher assets still use the previous Pip soup badge until a dedicated redesign-based icon candidate is generated and reviewed.
- Next production asset step: generate/crop individual polished sticker assets for Pip, Elena, and Aunt Mina instead of using a full concept sheet in gameplay.
- v0.1.6 adds a dedicated Pip strip sticker asset: src/assets/characters/pip-strip-sticker-v1.png.
