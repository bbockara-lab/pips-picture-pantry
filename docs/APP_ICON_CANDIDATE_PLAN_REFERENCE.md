# Elena's Cozy Village - App Icon Candidate Plan

Last update: June 18, 2026

## Purpose

This file tracks the first App Store icon candidate package for v1.36. It does not mark the icon as final artwork. It keeps the final-art blocker visible while making the next production pass easier to review and repeat.


## Rendered Candidate

- Primary bitmap: store-assets/app-icon/v1.36/pip-recipe-badge-app-store-1024.png
- Source generation: store-assets/app-icon/v1.36/pip-recipe-badge-v1.png
- Small-size previews: 180, 120, 87, and 60 px in the same folder.
- iOS asset catalog: store-assets/app-icon/v1.36/AppIcon.appiconset with 18 iPhone, iPad, and marketing slots.
- Review state: Pip Soup Badge v2 final-approved on June 24, 2026; external similarity audit remains open as a separate P1.

## Candidate Package

- Manifest: `store-assets/app-icon/v1.36/candidate-manifest.json`
- Review report: `store-assets/app-icon/v1.36/candidate-report.html`
- Source brief: `APP_ICON_BRIEF.md`
- Submission blocker: `RELEASE_MANUAL_INPUTS.md` item `final-app-icon`

## Primary Candidate

`pip-recipe-badge`

Pip faces forward with a readable warm expression, holding one small recipe card beside a soup bowl. The composition uses a cream sticker outline and the Sunny Spoon Cafe rose, honey, soft teal, and soup-orange palette. The recipe card is a prop, not readable text.

## Alternate Candidate

`sunny-spoon-bowl`

A soup bowl and spoon sit in the foreground, with Pip's face and chef-hat detail as the strongest silhouette. This option is safer for small-size readability if the recipe card becomes too detailed.

## Final Artwork Gate

Before `final-app-icon` can move from `open` to `ready`, the icon package must include:

- 1024 x 1024 App Store icon PNG.
- Editable or transparent-source master asset.
- Small-size readability review at 180, 120, 87, and 60 px.
- Similarity audit against early restaurant-management references.
- Confirmation that the icon contains no text, no PlateUp-like kitchen grid, and no borrowed UI framing.

## Review Notes

- Favor Pip as the mascot signal over a full cast composition.
- Keep one clear object only: recipe card or soup bowl.
- Preserve cozy-life-sim warmth rather than a restaurant-management UI read.
- Do not directly translate vocabulary or word-category learning content inside the icon.

## Finalist Set - June 21, 2026

- Finalist A: finalists/pip-soup-badge-v2-app-store-1024.png, with soup as the single strong prop.
- Finalist B: finalists/pip-recipe-card-v2-app-store-1024.png, with the tomato recipe card as the single strong prop.
- Both retain 1254 x 1254 source masters plus exact 1024, 180, 120, 87, and 60 px review exports.
- Compare both in store-assets/app-icon/v1.36/finalists/finalist-report.html.
- Final selection and external similarity sign-off remain manual; this set does not close final-app-icon.

## Provisional Packaging Recommendation - June 21, 2026

- Pip Soup Badge v2 is the provisional packaging recommendation because the mascot and soup silhouette remain clearer at small sizes.
- The recommendation now drives the 18-slot iOS AppIcon catalog and 192, 512, and 180 px web icons.
- recommended-icon-manifest.json records the selected source and SHA-256.
- Owner approval is complete for Pip Soup Badge v2. External similarity review remains a separate P1 and does not change the selected artwork.
