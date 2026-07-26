import { describe, expect, it } from "vitest";
import { puzzles } from "../src/data/puzzles.js";
import { getSeasonShelfForPuzzle, getSeasonShelfPuzzles, getSeasonShelfSizeCounts, seasonShelves } from "../src/data/seasonShelves.js";
import { getPreviousSeasonShelf, getSeasonShelfProgress, isSeasonShelfComplete } from "../src/game/seasonShelfProgress.js";

describe("Season 0 shelves", () => {
  it("repackages every authored puzzle exactly once without changing puzzle IDs", () => {
    const assignedIds = seasonShelves.flatMap((shelf) => shelf.puzzleIds);

    expect(seasonShelves).toHaveLength(15);
    expect(assignedIds).toHaveLength(puzzles.length);
    expect(new Set(assignedIds).size).toBe(puzzles.length);
    expect(new Set(assignedIds)).toEqual(new Set(puzzles.map((puzzle) => puzzle.id)));
  });

  it("starts with short mixed-size shelves before the first 12x12 taste", () => {
    expect(getSeasonShelfSizeCounts(seasonShelves[0])).toEqual({ 5: 15, 8: 5 });
    expect(getSeasonShelfSizeCounts(seasonShelves[1])).toEqual({ 5: 10, 8: 10 });
    expect(getSeasonShelfSizeCounts(seasonShelves[2])).toEqual({ 5: 5, 8: 12, 10: 3 });
    expect(getSeasonShelfSizeCounts(seasonShelves[5])).toEqual({ 8: 8, 10: 10, 12: 5 });
  });

  it("keeps shelf navigation deterministic for the first authored puzzle", () => {
    const firstPuzzle = puzzles.find((puzzle) => puzzle.id === "pips-first-shelf-pip-face-1");
    const shelf = getSeasonShelfForPuzzle(firstPuzzle);

    expect(shelf?.id).toBe("shelf-pips-first");
    expect(getSeasonShelfPuzzles(shelf)[0]?.id).toBe("pips-first-shelf-pip-face-1");
  });

  it("preserves the prior Season 0 total economy while distributing it across shelves", () => {
    const totals = seasonShelves.reduce((result, shelf) => ({
      unlockCost: result.unlockCost + Number(shelf.unlockCost || 0),
      stageBonus: result.stageBonus + Number(shelf.stageBonus || 0)
    }), { unlockCost: 0, stageBonus: 0 });

    expect(totals).toEqual({ unlockCost: 970, stageBonus: 750 });
  });

  it("uses the previous shelf and current shelf completion as separate progression facts", () => {
    const firstShelf = seasonShelves[0];
    const firstShelfIds = getSeasonShelfPuzzles(firstShelf).map((puzzle) => puzzle.id);

    expect(getPreviousSeasonShelf(seasonShelves[1])?.id).toBe(firstShelf.id);
    expect(getSeasonShelfProgress(firstShelf, firstShelfIds)).toMatchObject({ completed: 20, total: 20, complete: true });
    expect(isSeasonShelfComplete(firstShelf, firstShelfIds)).toBe(true);
    expect(isSeasonShelfComplete(seasonShelves[1], firstShelfIds)).toBe(false);
  });
});
