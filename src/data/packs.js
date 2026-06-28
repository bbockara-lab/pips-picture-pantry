export const puzzlePacks = [
  {
    id: "pips-pantry-shelf",
    titleKey: "packs.pipsPantryShelf.title",
    noteKey: "packs.pipsPantryShelf.note",
    access: "free",
    monetizationRole: "starter"
  },
  {
    id: "pips-pantry-shelf-plus",
    titleKey: "packs.pipsPantryShelfPlus.title",
    noteKey: "packs.pipsPantryShelfPlus.note",
    access: "bonus-pack",
    monetizationRole: "future-iap"
  }
];

export function getPackById(id) {
  return puzzlePacks.find((pack) => pack.id === id) || puzzlePacks[0];
}
