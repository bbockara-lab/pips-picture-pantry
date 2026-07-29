export const JAR_SHELVES = [
  { id: "jam", nameKey: "pantry.shelf.jam" },
  { id: "honey", nameKey: "pantry.shelf.honey" },
  { id: "herb", nameKey: "pantry.shelf.herb" },
  { id: "spice", nameKey: "pantry.shelf.spice" }
];

export const PANTRY_JARS = [
  { id: "strawberry-jam", shelfId: "jam", rarity: "starter", cost: 0, nameKey: "pantry.jar.strawberryJam" },
  { id: "blueberry-jam", shelfId: "jam", rarity: "common", cost: 12, nameKey: "pantry.jar.blueberryJam" },
  { id: "cherry-jam", shelfId: "jam", rarity: "common", cost: 12, nameKey: "pantry.jar.cherryJam" },
  { id: "orange-marmalade", shelfId: "jam", rarity: "rare", cost: 35, nameKey: "pantry.jar.orangeMarmalade" },
  { id: "lemon-curd", shelfId: "jam", rarity: "special", cost: 75, nameKey: "pantry.jar.lemonCurd" },
  { id: "peach-preserve", shelfId: "jam", rarity: "luxury", cost: 140, nameKey: "pantry.jar.peachPreserve" },
  { id: "acacia-honey", shelfId: "honey", rarity: "starter", cost: 0, nameKey: "pantry.jar.acaciaHoney" },
  { id: "maple-syrup", shelfId: "honey", rarity: "common", cost: 12, nameKey: "pantry.jar.mapleSyrup" },
  { id: "yuzu-syrup", shelfId: "honey", rarity: "common", cost: 12, nameKey: "pantry.jar.yuzuSyrup" },
  { id: "ginger-syrup", shelfId: "honey", rarity: "rare", cost: 35, nameKey: "pantry.jar.gingerSyrup" },
  { id: "maesil-syrup", shelfId: "honey", rarity: "special", cost: 75, nameKey: "pantry.jar.maesil" },
  { id: "lavender-honey", shelfId: "honey", rarity: "luxury", cost: 140, nameKey: "pantry.jar.lavenderHoney" },
  { id: "rosemary", shelfId: "herb", rarity: "starter", cost: 0, nameKey: "pantry.jar.rosemary" },
  { id: "chamomile", shelfId: "herb", rarity: "common", cost: 12, nameKey: "pantry.jar.chamomile" },
  { id: "dried-lavender", shelfId: "herb", rarity: "common", cost: 12, nameKey: "pantry.jar.driedLavender" },
  { id: "dried-mint", shelfId: "herb", rarity: "rare", cost: 35, nameKey: "pantry.jar.driedMint" },
  { id: "rose-petals", shelfId: "herb", rarity: "special", cost: 75, nameKey: "pantry.jar.rosePetals" },
  { id: "hibiscus", shelfId: "herb", rarity: "luxury", cost: 140, nameKey: "pantry.jar.hibiscus" },
  { id: "sea-salt", shelfId: "spice", rarity: "starter", cost: 0, nameKey: "pantry.jar.seaSalt" },
  { id: "black-pepper", shelfId: "spice", rarity: "common", cost: 12, nameKey: "pantry.jar.blackPepper" },
  { id: "cinnamon", shelfId: "spice", rarity: "common", cost: 12, nameKey: "pantry.jar.cinnamon" },
  { id: "black-sesame", shelfId: "spice", rarity: "rare", cost: 35, nameKey: "pantry.jar.blackSesame" },
  { id: "pumpkin-seeds", shelfId: "spice", rarity: "special", cost: 75, nameKey: "pantry.jar.pumpkinSeeds" },
  { id: "red-bean", shelfId: "spice", rarity: "luxury", cost: 140, nameKey: "pantry.jar.redBean" }
];

export function getJarById(id) {
  return PANTRY_JARS.find((jar) => jar.id === id) || null;
}

export function getJarsByShelf(shelfId) {
  return PANTRY_JARS.filter((jar) => jar.shelfId === shelfId);
}

export function getStarterJarIds() {
  return PANTRY_JARS.filter((jar) => jar.rarity === "starter").map((jar) => jar.id);
}
