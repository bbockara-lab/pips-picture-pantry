export const puzzlePacks = [
  {
    "id": "pips-first-shelf",
    "titleKey": "packs.pips-first-shelf.title",
    "noteKey": "packs.pips-first-shelf.note",
    "access": "free",
    "monetizationRole": "starter",
    "unlockCost": 0,
    "muralPart": "pip-ear"
  },
  {
    "id": "sunny-spoon-sign",
    "titleKey": "packs.sunny-spoon-sign.title",
    "noteKey": "packs.sunny-spoon-sign.note",
    "access": "unlockable",
    "monetizationRole": "free-progression",
    "unlockCost": 36,
    "muralPart": "pip-cheek"
  },
  {
    "id": "apron-drawer",
    "titleKey": "packs.apron-drawer.title",
    "noteKey": "packs.apron-drawer.note",
    "access": "unlockable",
    "monetizationRole": "free-progression",
    "unlockCost": 76,
    "muralPart": "pip-scarf"
  },
  {
    "id": "bakery-window",
    "titleKey": "packs.bakery-window.title",
    "noteKey": "packs.bakery-window.note",
    "access": "unlockable",
    "monetizationRole": "free-progression",
    "unlockCost": 128,
    "muralPart": "pip-hat"
  },
  {
    "id": "village-pantry",
    "titleKey": "packs.village-pantry.title",
    "noteKey": "packs.village-pantry.note",
    "access": "unlockable",
    "monetizationRole": "free-progression",
    "unlockCost": 188,
    "muralPart": "pip-face"
  }
];

export function getPackById(id) {
  return puzzlePacks.find((pack) => pack.id === id) || puzzlePacks[0];
}
