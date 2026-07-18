export const puzzlePacks = [
  {
    id: "pips-first-shelf",
    titleKey: "packs.pips-first-shelf.title",
    noteKey: "packs.pips-first-shelf.note",
    access: "free",
    monetizationRole: "starter",
    unlockCost: 0,
    size: 5,
    stageBonus: 40,
    muralPart: "pip-hat",
    muralSet: "pip-portrait",
    badge: {
      id: "badge-pips-first-shelf",
      titleKey: "badges.pipsFirstShelf",
      descriptionKey: "badges.pipsFirstShelfDesc"
    }
  },
  {
    id: "sunny-spoon-sign",
    titleKey: "packs.sunny-spoon-sign.title",
    noteKey: "packs.sunny-spoon-sign.note",
    access: "unlockable",
    monetizationRole: "free-progression",
    unlockCost: 80,
    pantryRoomStepRequired: 3,
    size: 8,
    stageBonus: 80,
    muralPart: "pip-scarf",
    muralSet: "pip-portrait",
    badge: {
      id: "badge-sunny-spoon-sign",
      titleKey: "badges.sunnySpoonSign",
      descriptionKey: "badges.sunnySpoonSignDesc"
    }
  },
  {
    id: "apron-drawer",
    titleKey: "packs.apron-drawer.title",
    noteKey: "packs.apron-drawer.note",
    access: "unlockable",
    monetizationRole: "free-progression",
    unlockCost: 160,
    pantryRoomStepRequired: 6,
    size: 8,
    stageBonus: 130,
    muralPart: "pip-face",
    muralSet: "pip-portrait",
    badge: {
      id: "badge-apron-drawer",
      titleKey: "badges.apronDrawer",
      descriptionKey: "badges.apronDrawerDesc"
    }
  },
  {
    id: "bakery-window",
    titleKey: "packs.bakery-window.title",
    noteKey: "packs.bakery-window.note",
    access: "unlockable",
    monetizationRole: "free-progression",
    unlockCost: 280,
    pantryRoomStepRequired: 10,
    size: 12,
    stageBonus: 200,
    muralPart: "pip-body",
    muralSet: "pip-portrait",
    badge: {
      id: "badge-bakery-window",
      titleKey: "badges.bakeryWindow",
      descriptionKey: "badges.bakeryWindowDesc"
    }
  },
  {
    id: "village-pantry",
    titleKey: "packs.village-pantry.title",
    noteKey: "packs.village-pantry.note",
    access: "unlockable",
    monetizationRole: "free-progression",
    unlockCost: 450,
    pantryRoomStepRequired: 10,
    size: 10,
    stageBonus: 300,
    muralPart: "pip-card",
    muralSet: "pip-portrait",
    badge: {
      id: "badge-village-pantry",
      titleKey: "badges.villagePantry",
      descriptionKey: "badges.villagePantryDesc"
    }
  },
  {
    id: "cafe-window-plus",
    titleKey: "packs.cafe-window-plus.title",
    noteKey: "packs.cafe-window-plus.note",
    access: "bonus-pack",
    monetizationRole: "future-theme-pack",
    unlockCost: null,
    muralPart: "bonus-cafe",
    muralSet: "cozy-cafe-room",
    pricePreviewKey: "packs.pricePreview"
  },
  {
    id: "bakery-morning-plus",
    titleKey: "packs.bakery-morning-plus.title",
    noteKey: "packs.bakery-morning-plus.note",
    access: "bonus-pack",
    monetizationRole: "future-theme-pack",
    unlockCost: null,
    muralPart: "bonus-bakery",
    muralSet: "bakery-morning",
    pricePreviewKey: "packs.pricePreview"
  },
  {
    id: "seasonal-pantry-plus",
    titleKey: "packs.seasonal-pantry-plus.title",
    noteKey: "packs.seasonal-pantry-plus.note",
    access: "bonus-pack",
    monetizationRole: "future-theme-pack",
    unlockCost: null,
    muralPart: "bonus-season",
    muralSet: "seasonal-pantry",
    pricePreviewKey: "packs.pricePreview"
  },
  {
    id: "village-picnic-plus",
    titleKey: "packs.village-picnic-plus.title",
    noteKey: "packs.village-picnic-plus.note",
    access: "bonus-pack",
    monetizationRole: "future-theme-pack",
    unlockCost: null,
    muralPart: "bonus-picnic",
    muralSet: "village-picnic",
    pricePreviewKey: "packs.pricePreview"
  },
  {
    id: "sunny-festival-plus",
    titleKey: "packs.sunny-festival-plus.title",
    noteKey: "packs.sunny-festival-plus.note",
    access: "bonus-pack",
    monetizationRole: "future-theme-pack",
    unlockCost: null,
    muralPart: "bonus-festival",
    muralSet: "sunny-spoon-festival",
    pricePreviewKey: "packs.pricePreview"
  }
];

export function getPackById(id) {
  return puzzlePacks.find((pack) => pack.id === id) || puzzlePacks[0];
}
