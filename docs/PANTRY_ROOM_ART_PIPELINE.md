# Pantry Room Art Pipeline

Status: **experimental art production contract**. This document deliberately does not authorize more CSS coordinate tuning of the current room.

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

The existing `pantry-room-sunlit-v1` background remains live, but its product thumbnail placements are not eligible for further coordinate refinement. This is intentional until a matching master/base/overlay set is available.