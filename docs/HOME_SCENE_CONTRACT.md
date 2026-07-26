# Home Scene and Room Presentation Contract

## Player-facing premise

Pip's Puzzle Workshop is Pip's active puzzle workshop. Pip's Decor Room is the place where the player chooses and equips decor. They are separate surfaces, but they must feel like the same lived-in world: decorating should make Pip's everyday workspace feel more personal.

The current workshop image is an authored first scene. It intentionally does not reuse the editable Pantry background. That separation keeps the first screen about playing a puzzle, not managing an inventory.

## What is live now

- The main workshop has Pip actively solving at the table.
- Six icon-only destinations are deliberately kept in left/right safe rails.
- The current puzzle action is centered at the bottom and may not overlap a destination icon.
- The Pantry has five selectable room slots and is the source of truth for owned and equipped decorations.

## Required next presentation layer

This is the next visual-system slice, not a claim about the current build:

1. Keep `getEquippedDecorations()` as the single save source. Do **not** create a second `homeDecorations` save list.
2. Give each approved decoration optional `homePresentation` metadata. It maps a Pantry slot to a safe workshop overlay region (wall, table, window, shelf, floor), or explicitly says `pantry-only` when an item has no honest workshop counterpart.
3. Treat a future room-theme purchase as a pair of authored assets: `pantryBackgroundAssetId` for editing and `workshopBackgroundAssetId` for play. The same theme id selects both; the Workshop never stretches or crops the Pantry image as a substitute.
4. Overlay only props authored for that exact workshop perspective. Reusing a Pantry prop at a different perspective is worse than leaving it out.
5. Animate only the live workshop layer (Pip breathing, spoon tap, page turn); decorations remain still and never obscure the current-puzzle action.

## Permanent safe-area rules

The scene artwork owns the center. Navigation is application chrome and is never baked into a room illustration.

| Region | Allowed content |
| --- | --- |
| Center | Pip, desk, puzzle and theme-specific storytelling |
| Left/right rails | Six 48-56px destination icons only |
| Bottom-center | One current-puzzle action only |
| Top edge | No floating action: the ordinary app header owns global status |

Any new workshop background must reserve the two side rails and bottom-center action area. If an artwork cannot satisfy that composition, it needs an alternate crop or an authored variant rather than moving the persistent icons over Pip or the furniture.

## Verification

At 360x740, 390x844, 430x932 and 675x900, mobile QA now rejects:

- a workshop destination leaving the scene frame;
- destinations colliding with each other;
- a destination colliding with the bottom current-puzzle action;
- a Pantry placement slot leaving the room or colliding with another slot.

Theme and overlay implementation is not started until the current workshop composition is reviewed on a full-size device. This preserves the playable release surface while leaving a clear, asset-safe path for the decorating motivation the game needs.
