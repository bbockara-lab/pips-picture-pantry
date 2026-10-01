# Content Change Impact Checklist

Use this checklist before calling any gameplay-content change complete. Content is a connected system, not only the file that was edited.

## Mandatory impact graph

Trace the change through every applicable node:

`content data -> stage allocation -> unlock gate -> spoon economy -> collectible reward -> artwork -> runtime registry -> i18n -> UI surfaces -> save compatibility -> automated QA -> store/release assets`

A node may be marked not applicable only with a concrete reason recorded in the handoff. “No new art needed” is not a reason by itself; first prove whether the current art catalog has unused approved assets or is already a closed 1:1 set.

## Questions that must be answered

1. **Content and allocation** — What count changed? Where is every new item consumed? Are IDs stable and unique?
2. **Progression** — What unlocks before and after the change? Do boundary saves unlock neither early nor late?
3. **Economy** — How do authored rewards, recurring rewards, paid collectibles, decorations, and IAP motivation change?
4. **Rewards and collections** — Does adding stages require Pantry shelves, jars, badges, album entries, completion cards, celebrations, or home keepsakes?
5. **Artwork** — Does every visible collectible have unique production art at the correct dimensions and alpha format? Is it registered 1:1?
6. **Language** — Are every new visible name, group label, guide line, accessibility label, and store-facing phrase present in English and Korean?
7. **UI surfaces** — Which home, picker, play, Pantry, Album, Badge, completion, Settings, and navigation screens now display larger counts or new groups?
8. **Persistence** — Do old saves remain valid? Are featured/owned/completed IDs preserved? Are boundary save states tested?
9. **QA contracts** — Which hard-coded counts, visual expectations, asset manifests, catalog gates, and release checks must change?
10. **Release** — Are version identity and handoff documents updated? Has packaging remained paused when review is requested?

## Required evidence before handoff

- A before/after count table for every expanded catalog.
- Boundary tests for progression gates.
- A computed economy summary rather than a qualitative guess.
- A 1:1 data-to-art assertion for visible collectibles.
- An assertion that every stage belongs to exactly one badge milestone and every gated stage belongs to exactly one Pantry shelf.
- Full tests plus the relevant catalog, uniqueness, art, asset, build, and mobile contracts.
- A clearly separated list of new regressions versus known pre-existing failures.

## Current automatic guard

`tests/contentProgressionIntegrity.test.js` fails when a stage is added without badge coverage, when a gated stage is not connected to a Pantry shelf, when badge ordering/finality drifts, or when a badge lacks runtime art. Extend this guard whenever a new progression-linked collection is introduced.
