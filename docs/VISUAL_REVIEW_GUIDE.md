# Pip's Picture Pantry Visual Review Guide

Use this guide when reviewing launch-facing art, UX, and monetization surfaces from local screenshots.

## Generate The Pack

```powershell
cd "D:\Users\bbock\OneDrive\00. Private\10. Development\03. Pip's Picture Pantry"
npm run qa:visual-pack
```

The generated pack is ignored by git:

```text
qa-artifacts/visual-review/<app-version>/index.html
qa-artifacts/visual-review/<app-version>/manifest.json
qa-artifacts/visual-review/<app-version>/screenshots/
```

Open `index.html` in a browser to review all screenshots as a contact sheet.

## Review Order

1. Opening brand intro
2. Pip guide dialog
3. First puzzle board
4. Settings Billing surface
5. Pantry room and shop
6. Time Attack coach
7. Album progress
8. Map badges
9. Large-board cursor controls

## Acceptance Checklist

- Pip must look like the current Sunny Spoon Studios character direction, not a mismatched older mascot.
- Buttons, chips, spoon marks, X marks, and undo symbols should feel like the same cozy tactile system.
- Reusable control symbols must not read as temporary CSS placeholders. Paint, blank/X, undo, hint, Time Attack, settings, stage navigation, and cursor/D-pad symbols should graduate into consistent Sunny Spoon Studios artwork before release sign-off.
- Billing copy should feel optional and supportive; avoid paid/free wording in player-facing UI.
- The Support Pack and Small Spoon Jar should both be discoverable from Settings, with distinct one-time vs repeatable roles.
- Pantry goals should make the next action obvious: decorate more, earn spoons, open stage, or view album.
- No card should look like a placeholder, flat PPT block, or unrelated imported art.
- Text must fit without overlap at the captured 390x844 viewport.
- The first-play flow should feel friendly before it feels commercial.

## Reusable Icon Artwork Pass

Treat these as shared product assets, not one-off CSS decorations. Once a symbol is approved, reuse it across buttons, guide examples, board overlays, Settings, and the visual review pack.

1. Paint / fill token
2. Blank-check / safe-X token
3. Undo token
4. Hint spoon token
5. Time Attack token
6. Settings / reset token
7. Stage previous / next / list tokens
8. Cursor and D-pad arrows

Acceptance standard: each token should look tactile, rounded, slightly glossy, and cozy enough to belong beside Pip and the spoon artwork. CSS-only construction is acceptable only as an implementation vehicle if the result reads like intentional artwork.

## Relationship To Automated QA

`npm run qa:mobile` catches layout regressions across 360x740, 390x844, and 430x932.

`npm run qa:visual-pack` creates the human-review screenshots. It is intentionally not a replacement for mobile QA; it is the art direction layer on top.
