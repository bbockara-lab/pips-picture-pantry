# Pip's Picture Pantry Art Asset Backlog

Last updated: 2026-07-22
Mode: live release-candidate final polish

## Non-Negotiable Art Rule

Player-facing reward, currency, badge, decoration, tutorial, and navigation visuals must be reviewed raster assets: PNG, WebP, or JPG. Do not ship CSS/DOM-drawn substitute art for these surfaces.

Do not reuse the same Pip sticker or cast sheet as the answer for unrelated reward art. Reuse is acceptable only for deliberate brand appearances such as a small guide avatar, not as a substitute for missing badges, stage murals, decoration items, or shop goods.

If the image generator returns off-prompt or low-quality output, do not wire it into the app. Keep the feature hidden or use a neutral holding view.

## Priority 0: Replace Visible Temporary Assets

1. Currency token
   - Status: approved and replaced in v0.1.91
   - Runtime asset: src/assets/icons/spoon-token-v2.png
   - Legacy audit asset: src/assets/icons/spoon-token-v1.png
   - Goal: a polished golden spoon/charm coin that reads clearly at 16-32px.
   - Must support: header balance, puzzle reward chip, daily reward, stage unlock cost.

2. Free-stage reward art, five distinct images
   - Current stage reward images are temporary/reused.
   - Need one unique cozy reward artwork per free stage:
     - Pip's first stage: approved in v0.1.94 at `src/assets/stage-rewards/pips-first-shelf-reward-v1.webp`
     - Sunny Spoon Sign: approved in v0.1.95 at `src/assets/stage-rewards/sunny-spoon-sign-reward-v1.webp`
     - Apron Drawer: approved in v0.1.95 at `src/assets/stage-rewards/apron-drawer-reward-v1.webp`
     - Bakery Window: approved in v0.1.95 at `src/assets/stage-rewards/bakery-window-reward-v1.webp`
     - Village Pantry: approved in v0.1.95 at `src/assets/stage-rewards/village-pantry-reward-v1.webp`
   - Each should work as a tile-reveal panel, completed album/card art, and badge source.

3. Badge images
   - Status: complete for the five free-stage badges in v0.1.96.
   - Runtime assets: `src/assets/badges/badge-*-v1.webp`.
   - Each badge is badge-specific circular medal art, not a reused screenshot or cast sheet.

## Recently Completed Art Replacements

- Currency token: approved runtime asset `src/assets/icons/spoon-token-v2.png`.
- Visible temporary Pip chrome/completion art was replaced in v0.1.94 by `src/assets/characters/pip-chrome-v2.png` and `src/assets/characters/pip-completion-v2.png`.
- First free-stage reward art was approved in v0.1.94 at `src/assets/stage-rewards/pips-first-shelf-reward-v1.webp`.
- All five free-stage reward artworks are approved and wired through `src/data/stageArt.js` as of v0.1.95.
- Free-stage badge art was approved in v0.1.96 and wired through `src/data/badgeArt.js`.

## Priority 1: Pantry Decoration MVP Asset Set

Create real decoration item PNG/WebP assets before reopening Pantry:

1. Counter cloth or counter mat
2. Sunny window curtains
3. Recipe card shelf
4. Mint check rug
5. Soup pot display
6. Golden spoon sign

Each item needs:
- transparent background or clean bounded canvas
- consistent cozy 2D style
- no text baked into the asset unless intentionally localized-free
- predictable bounding box so layout never spills outside the slot

## Priority 2: Navigation And Tutorial Assets

1. Floating menu launcher icon
2. Puzzle icon
3. Album icon
4. Pantry icon
5. Badge icon
6. Settings/help icon if separated
7. Pip tutorial poses:
   - hello / welcome
   - pointing at clues
   - celebrating completion

## Active Pip Character Candidate Queue

These assets are hidden review candidates only. They may replace visible temporary Pip art only after explicit character-continuity approval:

- `src/assets/characters/pip-master-key-candidate-v1.png`
- `src/assets/characters/pip-chrome-candidate-v2.png`
- `src/assets/characters/pip-completion-candidate-v2.png`

## Implementation Gate

A feature that depends on missing art should stay behind a holding view or text-only conservative UI. It should not invent CSS art to fill the gap.

Before wiring new art:
- add it to src/data/assetManifest.js
- mark it candidate first
- visually review in local browser
- only then mark visible/approved
- run npm run qa:assets, npm run test -- --run, npm run build, and npm run qa:mobile

### v0.1.97 Pantry Decoration Art Applied
- Applied approved v2 runtime WebP art for starter counter cloth, sunny curtains, recipe shelf, mint rug, soup pot display, and golden spoon sign.
- Kept raw and transparent PNG sources archived for future polish; runtime imports use only optimized WebP files.
- Remaining art work should continue the same Sunny Spoon Studios/Pip continuity standard unless the user requests a specific revision.

### v0.1.103 Opening Key Visual Applied
- Generated and applied a high-polish vertical Sunny Spoon/Pip opening key visual for the brand intro.
- Runtime uses `src/assets/brand/opening-key-visual-v1.webp`; source PNG is archived in the manifest.
- The image intentionally contains no text; title/studio copy remains rendered by UI for localization and typo safety.


### v0.1.104 Pantry Common Decoration Expansion
- Added approved runtime WebP art for Small Jam Jar, Herb Pot, Recipe Cork Board, and Tiny Succulent.
- Raw generated sources and transparent PNGs are archived in the manifest; runtime imports continue to use optimized WebP only.
- This expands the live Pantry decoration set from 6 to 10 while preserving the Sunny Spoon/Pip cozy art standard.


### v0.1.105 Pantry Slot Decoration Set 15
- Added approved runtime WebP art for Spoon Wall Clock, Berry Tea Tins, Ribbon Rolling Pin, Sunny Flower Vase, and Woven Pantry Basket.
- The live Pantry decoration set now has 15 approved items and preserves source PNGs for future polish passes.


### v0.1.106 Pantry Cozy Decoration Goals
- Added approved runtime WebP art for Honey Cake Stand, Lace Window Lantern, Copper Cookie Tin, Plush Floor Cushion, and Framed Recipe Glow.
- The live Pantry decoration set now has 20 approved items, including a stronger cozy upgrade layer for all five room slots.


### v0.1.107 Pantry Rare Decoration Goals
- Added approved runtime WebP art for Golden Waffle Press, Stained Glass Suncatcher, Porcelain Spice Carousel, Pantry Delivery Cart, and Spoon Wall Tapestry.
- The live Pantry decoration set now has 25 approved items, including a rare long-term goal layer for all five room slots.

## v0.1.128 Sunny Spoon Studios Bumper
- Added a reusable studio bumper image for Sunny Spoon Studios as the first opening-stage art.
- The runtime asset is `src/assets/brand/sunny-spoon-studios-bumper-v1.webp`; source PNG is archived at `src/assets/brand/sunny-spoon-studios-bumper-v1.png`.
- The image intentionally contains no text, no puzzle grid, and no Pantry-only clutter; studio name remains UI text for reuse and localization safety.

## v0.1.509 Billing Product Icons
- Replaced the visible CSS-drawn Support Pack and Small Spoon Jar product symbols with approved transparent PNG artwork.
- Runtime assets are `src/assets/billing/support-pack-gift-v1.png` and `src/assets/billing/spoon-jar-small-v1.png`.
- Both icons use the established honey-gold spoon palette, contain no baked text or real-money symbols, and remain readable in the Settings card's 46-62px artwork slot.

## v0.1.512 Progress Reset Icon
- Replaced the CSS-drawn header reset arrow with `src/assets/icons/puzzle-controls-v1/puzzle-control-reset-v1.png`.
- The approved 256px transparent icon uses a golden circular arrow and sprouting Pantry tile so progress reset reads as a gentle fresh start rather than deletion.
- Runtime approval, asset-manifest, and mobile visual checks now guard the exact raster asset and prevent pseudo-element artwork from returning.
