import { eventSeasonShelves, getSeasonShelfById, getSeasonShelfForPuzzle, getSeasonShelfPuzzles, seasonShelves } from "../data/seasonShelves.js";

export function getSeasonShelfProgress(shelfOrId, completedPuzzleIds = []) {
  const shelf = typeof shelfOrId === "string" ? getSeasonShelfById(shelfOrId) : shelfOrId;
  const completed = new Set(completedPuzzleIds || []);
  const puzzles = getSeasonShelfPuzzles(shelf);
  const completeCount = puzzles.filter((puzzle) => completed.has(puzzle.id)).length;
  return {
    shelf,
    completed: completeCount,
    total: puzzles.length,
    complete: puzzles.length > 0 && completeCount >= puzzles.length
  };
}

export function isSeasonShelfComplete(shelfOrId, completedPuzzleIds = []) {
  return getSeasonShelfProgress(shelfOrId, completedPuzzleIds).complete;
}

export function getPreviousSeasonShelf(shelfOrId) {
  const shelf = typeof shelfOrId === "string" ? getSeasonShelfById(shelfOrId) : shelfOrId;
  if (!shelf || shelf.index <= 0) {
    return null;
  }
  const shelfGroup = shelf.eventTheme === "korean-harvest" ? eventSeasonShelves : seasonShelves;
  const groupIndex = shelfGroup.findIndex((candidate) => candidate.id === shelf.id);
  return groupIndex > 0 ? shelfGroup[groupIndex - 1] : null;
}

export function getSeasonShelfForPuzzleId(puzzleId) {
  return getSeasonShelfForPuzzle(puzzleId);
}
