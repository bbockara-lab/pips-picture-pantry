# Pantry Room Art Pipeline

Status: **experimental art production contract**. This document deliberately does not authorize more CSS coordinate tuning of the current room.

## v2 implementation status (2026-07-27)

The `sunlit-v2` set is now wired for runtime review:

- `src/assets/backgrounds/pantry-room-sunlit-v2.webp` is the approved 1024x1536 empty-room base; its PNG is archived as source art.
- `src/assets/backgrounds/overlays/room-v2-*.png` contains 25 transparent 1024x1536, master-coordinate overlays: six counter, five window, five shelf, four floor, and five back-wall alternatives.
- The runtime selects exactly one full-canvas overlay per equipped slot. The images carry the authored perspective and object shadow themselves; responsive CSS only fills the common canvas and does not tune per-item coordinates.
- The Pantry catalog IDs still govern ownership, price, and placement. A purchasable item is not rendered in the room unless it has one of these approved v2 overlays.

The old v1 thumbnail-on-room placement path is retired from `pantryView.js`. Automated verification passed at 360x740, 390x844, 430x932, and 675x900, and the v0.1.610 visual-review pack contains the current Pantry capture. The next manual art pass should still exercise empty, starter-only, each individual equipped slot, and the all-owned room before any future theme is promoted.
## Product intent

The Pantry is a room that becomes more complete as Pip earns and buys furnishings. It must never read as a base background with unrelated product thumbnails floating above it. A purchase should look as though its object has returned to the place where it always belonged.

## Required source set

For one room theme, art must be created and approved as a matched set before runtime integration:

1. `pantry-room-<theme>-master-vN.png` — the fully furnished reference composition. All launch decorations are installed at their final intended size, lighting, and depth.
2. `pantry-room-<theme>-base-vN.webp` — the same exact composition with installable item regions cleanly removed. It is the only runtime background.
3. `pantry-room-<theme>-<slot>-vN.png` — one alpha overlay per installable slot (`back-wall`, `shelf`, `window`, `counter`, `floor`). Each overlay is exported from the master at the exact original canvas dimensions, with every non-item pixel transparent.
4. `pantry-room-<theme>-proof-vN.png` — a review sheet showing the master, base, and every overlay composited back on the base. This must visually reconstruct the master without scale drift, haloing, or lighting mismatch.

## Authoring rules

- Use one canonical 2:3 canvas and keep the master, base, proof, and all slot exports at that canvas size before optimization.
- The base must retain shadows that belong to the architecture but remove shadows cast by an installable item. The overlay contains the item and its item-specific shadow.
- Do not bake text, buttons, prices, locks, or interaction labels into art.
- Keep slot overlays separated by occlusion order. If one decoration crosses another region, split it into deliberate foreground/background layers instead of relying on CSS z-index luck.
- Existing decoration thumbnail art is catalog art only. It cannot become a room placement asset by scaling it into the scene.

## Current experimental master

`docs/visual-concepts/pantry-room-sunlit-master-concept-v2.png` is the first fully furnished 1024×1536 reference composition. It is **not** a runtime background and must not be imported by the app. Its only role is to validate the visual destination before any base/overlay extraction begins.

Before promotion, review the master for room anatomy, item scale, visual balance, and the quality of the all-owned state. If it is not strong as a complete room, regenerate the master rather than attempting to rescue it with CSS or per-item placement changes.
## Integration contract

- The runtime room renders the approved base WebP, then absolute-positioned alpha overlays using the original master coordinate system.
- CSS stores only normalized placement metadata derived from the master canvas. It does not invent new anatomy percentages through trial and error.
- A slot remains visibly empty until its matching approved overlay is owned/equipped. The empty state should be part of the room scene, not a repeated instructional card.
- New shop inventory is not wired into the room until it has a matched overlay in the current theme or a deliberate catalog-only presentation.

## Review gate

Before an art theme is enabled:

- Compare the browser composite at 360x740, 390x844, 430x932, and 675x900 against the proof sheet.
- Verify each owned/equipped state independently and all-owned state together.
- Check that no overlay clips, covers Pip's primary action, or overlaps the floating navigation target.
- Run `npm run qa:mobile`, `npm run qa:visual-pack`, `npm run qa:assets`, and `npm run qa:candidate` after runtime wiring.

## Current decision

The previous `pantry-room-sunlit-v1` thumbnail placement is no longer a runtime path. `sunlit-v2` is the active review candidate; any future decoration must receive a matching full-canvas overlay before it can render in the room.