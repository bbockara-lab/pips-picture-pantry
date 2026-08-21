# Korean Harvest Update Art Direction

## Release intent

The Korean Harvest update is a shared Android and iOS content release built on top of the frozen `1.1.22` / Android version code `51` release candidate. It must not alter or replace those signed release artifacts.

Target public window: September 2026, coordinated with the submitted App Store featuring nomination and a Google Play `Major update / New content` promotional-content submission.

## Player-facing promise

Pip welcomes players into a quiet Chuseok evening: moonlight at the workshop window, warm food and autumn harvest details, respectful Korean textiles, and a new set of picture puzzles. The update should feel authored as one world rather than as ordinary screens with holiday stickers.

## Art pillars

1. **Pip belongs in the scene.** Pip wears a restrained hanbok and performs a readable activity. Pip is never a generic sticker placed over a background.
2. **Moonlight and lamplight define the season.** Deep indigo exterior light is balanced with warm amber interior light. Avoid the yellow wash of the summer release.
3. **Materials carry the theme.** Hanji, bojagi, walnut wood, celadon, woven straw, brass, fruit skin and rice-cake texture should agree in lighting and rendering.
4. **Cultural specificity stays quiet and respectful.** Use songpyeon, pears, persimmons, chestnuts, rice sheaves, a full moon, bojagi and restrained geometric patterns. Avoid mixing in generic Lunar New Year, Chinese palace or Japanese festival imagery.
5. **The interface remains playable.** Artwork reserves both navigation rails, the greeting zone and the bottom play-action zone. No control is baked into an illustration.

## Master palette

| Role | Color direction | Typical use |
| --- | --- | --- |
| Night anchor | deep indigo / blue-black | window, event headers, locked states |
| Character accent | muted jade | Pip's hanbok, success state, selected trim |
| Light neutral | warm cream / hanji | cards, envelopes, dialogue surfaces |
| Harvest accent | persimmon orange | rewards, badges, notification emphasis |
| Warm structure | walnut brown | workshop wood, frames, dividers |
| Premium metal | aged brass / yugi gold | spoon token, seals, reward rims |

Bright cyan, candy neon, pure black panels, high-saturation red and unrelated pastel gradients are outside this theme.

## Cross-screen asset family

Every item below must be reviewed against the master palette and the key visual before release.

### Home and navigation

- Korean harvest Workshop background with Pip visibly participating.
- Event ribbon and greeting treatment.
- Existing navigation icons retained for recognition; event treatment is limited to a shared indigo shadow, cream edge and restrained brass highlight.
- Play Now remains the strongest action. Seasonal decoration must not reduce its contrast.

### Puzzle experience

- Korean harvest puzzle pack with culturally specific, readable silhouettes.
- Completion palettes derived from jade, persimmon, cream, indigo and brass.
- Event chip, progress strip and completion card use the same textile-edge language.
- Puzzle controls keep their established shapes and touch targets; only surface color and trim may change.

### Rewards and collection

- Event badge: full moon above a low tiled roof or rice field, with a small Pip silhouette or spoon seal.
- Pantry collectibles: songpyeon lacquer tray, bojagi parcel, celadon tea set, persimmon basket, moon jar and woven harvest basket.
- Reward frames use a consistent aged-brass rim and hanji backing.
- No object may be represented by an emoji or CSS-drawn placeholder.

### Mailbox and dialogue

- One developer letter introduces the seasonal update in Korean and English.
- One claimable harvest gift may be attached only if save compatibility and one-time claiming are tested.
- Envelope, unread badge, attachment card and claimed state use the same cream/indigo/brass family.
- Story letters remain progression-gated; seasonal marketing must not unlock future story dialogue.

### Store promotion

- Apple featuring and Google Play promotional content share the same key art direction.
- Required derivatives: primary landscape art, square art, store screenshot set and a short public YouTube video with monetization disabled for Google Play use.
- Store artwork contains no baked-in promotional copy unless the target surface explicitly permits it.

## Initial puzzle subject shortlist

The first set should favor clear shapes over decorative complexity:

1. Half moon and cloud
2. Songpyeon on a leaf
3. Full moon over a tiled roof
4. Persimmon branch
5. Korean pear
6. Chestnut burr
7. Rice sheaf
8. Bojagi knot
9. Celadon bottle
10. Moon jar
11. Lantern
12. Rabbit rice-cake motif
13. Lacquer tray
14. Folding fan
15. Harvest basket
16. Pip in hanbok

Each final puzzle must pass silhouette readability and nonogram clue validation at its authored size. Cultural labels must be localized rather than transliterated blindly.

## Approved event-gated key visual

- Source PNG: `src/assets/generated/pip-puzzle-workshop-korean-harvest-v1.png`
- Runtime WebP: `src/assets/generated/pip-puzzle-workshop-korean-harvest-v1.webp`
- Pip presence: baked in
- Status: approved for event-gated use after full-device overlay review at 360×740, 390×844, 430×932 and 675×900. It is registered for preview, but it does not replace the live summer scene until the two release statuses are deliberately promoted together.

## Implemented candidate content — 2026-08-20

- 16 hand-authored, bilingual puzzles: four each at 5×5, 8×8, 10×10 and 12×12.
- Four sequential event shelves: Moonrise Table, Harvest Courtyard, Moon Jar Room and Full Moon Feast.
- Four approved transparent Pantry rewards, unlocked after 4, 8, 12 and 16 event pictures:
  - `src/assets/seasonal/korean-harvest/songpyeon-tray-v1.webp`
  - `src/assets/seasonal/korean-harvest/bojagi-gift-v1.webp`
  - `src/assets/seasonal/korean-harvest/moon-jar-v1.webp`
  - `src/assets/seasonal/korean-harvest/moonlit-lantern-v1.webp`
- One approved bilingual developer-letter illustration:
  - `src/assets/mailbox/pip-korean-harvest-letter-v1.webp`
- One approved event badge:
  - `src/assets/badges/badge-pip-korean-harvest-v2.webp`
- Dedicated completion palette: indigo, muted jade, warm cream, persimmon and aged brass.
- Candidate runtime gate verified: no event puzzle, pack, shelf, reward or mailbox letter appears while the content and theme statuses remain `candidate`.

## Activation contract

The seasonal release must be promoted deliberately, not by importing assets directly into a visible view.

1. Completed 2026-08-20: the home background and badge passed overlay and asset-manifest review and are approved for event-gated use.
2. Completed 2026-08-20: the approved home WebP is registered in `HOME_THEME_BACKGROUNDS` and the approved badge WebP is registered in `src/data/badgeArt.js`. Registration alone does not expose them because both seasonal status gates remain `candidate`.
3. In `src/data/seasonalThemes.js`, archive the summer entry and change the Korean Harvest entry from `candidate` to `live`; only one theme may be live.
4. Change `KOREAN_HARVEST_CONTENT.status` in `src/data/koreanHarvestContent.js` from `candidate` to `live`.
5. Keep `requiresExplicitActivation: true`; it is an assertion that the release is deliberate, not a switch to turn off.
6. Run the full release gates. The catalog, shelves, rewards and letter then appear together from the same readiness predicate.

Do not activate only one of the two status fields. A partial promotion intentionally leaves the event hidden.

## Release gates

- Pip is visible and unobscured at all supported phone sizes.
- No home navigation item collides with Pip, food, furniture or the Play Now action.
- Theme text exists in Korean and English and never falls back to summer copy.
- Every visible seasonal raster asset is registered in the asset manifest.
- No future story letter becomes visible early.
- Android and iOS load the same theme id and content catalog.
- The theme can be disabled without invalidating an existing save.
- `npm run test`, `npm run qa:assets`, `npm run qa:mobile` and both platform release gates pass before packaging.
