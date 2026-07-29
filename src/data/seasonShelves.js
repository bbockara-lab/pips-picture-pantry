import { puzzles } from "./puzzles.js";

// Season 0 keeps every authored puzzle, but publishes them as short shelves
// rather than five oversized catalog packs. Puzzle IDs remain stable so save
// completion, album stamps, and replay history survive the presentation change.
const SHELF_BLUEPRINT = [
  { id: "shelf-pips-first", titleKey: "shelves.pipsFirst", sizes: { 5: 15, 8: 5 }, unlockCost: 0, pantryRoomStepRequired: 0, stageBonus: 80, artPackId: "pips-first-shelf" },
  { id: "shelf-sunny-counter", titleKey: "shelves.sunnyCounter", sizes: { 5: 10, 8: 10 }, unlockCost: 60, pantryRoomStepRequired: 5, stageBonus: 50, artPackId: "sunny-spoon-sign" },
  { id: "shelf-apron-drawer", titleKey: "shelves.apronDrawer", sizes: { 5: 5, 8: 12, 10: 3 }, unlockCost: 75, pantryRoomStepRequired: 10, stageBonus: 50, artPackId: "apron-drawer" },
  { id: "shelf-market-counter", titleKey: "shelves.marketCounter", sizes: { 5: 5, 8: 8, 10: 9 }, unlockCost: 90, pantryRoomStepRequired: 15, stageBonus: 35, artPackId: "bakery-window" },
  { id: "shelf-window-table", titleKey: "shelves.windowTable", sizes: { 5: 5, 8: 7, 10: 10 }, unlockCost: 0, pantryRoomStepRequired: 15, stageBonus: 35, artPackId: "bakery-window" },
  { id: "shelf-morning-bakery", titleKey: "shelves.morningBakery", sizes: { 8: 8, 10: 10, 12: 5 }, unlockCost: 150, pantryRoomStepRequired: 20, stageBonus: 40, artPackId: "bakery-window" },
  { id: "shelf-pastry-corner", titleKey: "shelves.pastryCorner", sizes: { 10: 11, 12: 12 }, unlockCost: 0, pantryRoomStepRequired: 20, stageBonus: 45, artPackId: "bakery-window" },
  { id: "shelf-tin-row", titleKey: "shelves.tinRow", sizes: { 10: 11, 12: 12 }, unlockCost: 200, pantryRoomStepRequired: 25, stageBonus: 45, artPackId: "bakery-window" },
  { id: "shelf-bakery-window", titleKey: "shelves.bakeryWindow", sizes: { 10: 11, 12: 12 }, unlockCost: 0, pantryRoomStepRequired: 25, stageBonus: 50, artPackId: "bakery-window" },
  { id: "shelf-village-square", titleKey: "shelves.villageSquare", sizes: { 10: 11, 12: 12 }, unlockCost: 260, pantryRoomStepRequired: 30, stageBonus: 50, artPackId: "village-pantry" },
  { id: "shelf-market-table", titleKey: "shelves.marketTable", sizes: { 10: 11, 12: 12 }, unlockCost: 0, pantryRoomStepRequired: 30, stageBonus: 55, artPackId: "village-pantry" },
  { id: "shelf-clock-corner", titleKey: "shelves.clockCorner", sizes: { 10: 10, 12: 13 }, unlockCost: 320, pantryRoomStepRequired: 35, stageBonus: 55, artPackId: "village-pantry" },
  { id: "shelf-bakery-walk", titleKey: "shelves.bakeryWalk", sizes: { 10: 10, 12: 13 }, unlockCost: 0, pantryRoomStepRequired: 35, stageBonus: 60, artPackId: "village-pantry" },
  { id: "shelf-garden-path", titleKey: "shelves.gardenPath", sizes: { 10: 10, 12: 13 }, unlockCost: 380, pantryRoomStepRequired: 40, stageBonus: 60, artPackId: "village-pantry" },
  { id: "shelf-village-pantry", titleKey: "shelves.villagePantry", sizes: { 10: 10, 12: 12 }, unlockCost: 0, pantryRoomStepRequired: 40, stageBonus: 100, artPackId: "village-pantry" }
];

const SUPPORTED_SIZES = [5, 8, 10, 12];
const puzzlesBySize = new Map(SUPPORTED_SIZES.map((size) => [
  size,
  puzzles.filter((puzzle) => puzzle.size === size)
]));
const cursorsBySize = new Map(SUPPORTED_SIZES.map((size) => [size, 0]));

export const seasonShelves = Object.freeze(SHELF_BLUEPRINT.map((blueprint, index) => {
  const puzzleIds = [];
  SUPPORTED_SIZES.forEach((size) => {
    const count = Number(blueprint.sizes[size] || 0);
    const bucket = puzzlesBySize.get(size) || [];
    const cursor = cursorsBySize.get(size) || 0;
    const selected = bucket.slice(cursor, cursor + count);
    if (selected.length !== count) {
      throw new Error(`Season shelf ${blueprint.id} needs ${count} ${size}x${size} puzzles.`);
    }
    cursorsBySize.set(size, cursor + count);
    puzzleIds.push(...selected.map((puzzle) => puzzle.id));
  });
  return Object.freeze({
    ...blueprint,
    index,
    isFinal: index === SHELF_BLUEPRINT.length - 1,
    puzzleIds: Object.freeze(puzzleIds)
  });
}));

const unassignedPuzzleIds = SUPPORTED_SIZES.flatMap((size) => {
  const bucket = puzzlesBySize.get(size) || [];
  return bucket.slice(cursorsBySize.get(size) || 0).map((puzzle) => puzzle.id);
});

if (unassignedPuzzleIds.length) {
  throw new Error(`Season shelf blueprint leaves ${unassignedPuzzleIds.length} authored puzzles unassigned.`);
}

const shelfById = new Map(seasonShelves.map((shelf) => [shelf.id, shelf]));
const shelfIdByPuzzleId = new Map(
  seasonShelves.flatMap((shelf) => shelf.puzzleIds.map((puzzleId) => [puzzleId, shelf.id]))
);

if (shelfIdByPuzzleId.size !== puzzles.length) {
  throw new Error("Season shelf blueprint must assign every authored puzzle exactly once.");
}

export function getSeasonShelfById(shelfId) {
  return shelfById.get(shelfId) || null;
}

export function getSeasonShelfForPuzzle(puzzleOrId) {
  const puzzleId = typeof puzzleOrId === "string" ? puzzleOrId : puzzleOrId?.id;
  return getSeasonShelfById(shelfIdByPuzzleId.get(puzzleId));
}

export function getSeasonShelfPuzzles(shelfOrId) {
  const shelf = typeof shelfOrId === "string" ? getSeasonShelfById(shelfOrId) : shelfOrId;
  if (!shelf) {
    return [];
  }
  const byId = new Map(puzzles.map((puzzle) => [puzzle.id, puzzle]));
  return shelf.puzzleIds.map((puzzleId) => byId.get(puzzleId)).filter(Boolean);
}

export function getSeasonShelfSizeCounts(shelfOrId) {
  return getSeasonShelfPuzzles(shelfOrId).reduce((counts, puzzle) => {
    counts[puzzle.size] = (counts[puzzle.size] || 0) + 1;
    return counts;
  }, {});
}
