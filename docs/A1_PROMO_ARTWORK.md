# A1 Play Store Promotional Artwork

Status: owner-review candidate, not uploaded to Play Console  
Prepared: 2026-07-30  
App candidate: v0.1.700 / Android 1.1.8 (versionCode 36)

## Deliverables

- `store-assets/play-console/promo-a1/feature-graphic-1024x500.png`
  - Google Play feature graphic
  - 1024 x 500, RGB PNG
- `store-assets/play-console/promo-a1/ko/01.png` through `05.png`
  - Korean promotional screenshot set
  - 1080 x 1920, RGB PNG
- `store-assets/play-console/promo-a1/en/01.png` through `05.png`
  - English promotional screenshot set
  - 1080 x 1920, RGB PNG
- `store-assets/play-console/promo-a1/source/pip-pantry-feature-master-v1.png`
  - Generated painterly source master for the feature graphic and invitation scene

## Scene Order

1. Pip invitation
2. Puzzle play
3. Pantry decorating
4. Album collection
5. Badge collection

## Production Notes

- The generated master uses the documented Pip identity contract: warm-brown capybara silhouette, cream chef hat, muted red scarf, dot eyes, blunt muzzle, and quiet helper energy.
- Store copy is typeset during deterministic local composition rather than generated inside the artwork.
- Existing approved game screenshots and runtime art are used for scenes 2-5.
- `scripts/generate_promo_a1.py` regenerates the complete candidate set.
- These files do not replace the currently guarded Play Console assets until owner review and manual upload.

## Tomorrow's Play Console Handoff

1. Review the feature graphic and both screenshot language folders.
2. Open the main store listing for each language.
3. Replace the feature graphic with `feature-graphic-1024x500.png`.
4. Upload the corresponding five screenshots in numbered order.
5. Save the store listing.
6. Confirm the store-listing changes appear in Publishing overview.
7. Submit the production release, countries/regions, and artwork changes together for review.

