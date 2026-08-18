import { describe, expect, it } from "vitest";
import { puzzles } from "../src/data/puzzles.js";
import { getSeasonShelfForPuzzle, getSeasonShelfPuzzles, getSeasonShelfSizeCounts, seasonShelves } from "../src/data/seasonShelves.js";
import { PANTRY_JARS } from "../src/data/pantryJars.js";
import { pantryDecorations } from "../src/data/decorations.js";
import { getPreviousSeasonShelf, getSeasonShelfProgress, isSeasonShelfComplete } from "../src/game/seasonShelfProgress.js";

describe("Season 0 shelves", () => {
  it("repackages every authored puzzle exactly once without changing puzzle IDs", () => {
    const assignedIds = seasonShelves.flatMap((shelf) => shelf.puzzleIds);

    expect(seasonShelves).toHaveLength(27);
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

  it("marks only the summer sunset feast as the closing shelf", () => {
    expect(seasonShelves.filter((shelf) => shelf.isFinal)).toHaveLength(1);
    expect(seasonShelves.at(-1)?.id).toBe("shelf-sunset-feast");
  });

  it("balances the full stage economy against the expanded Pantry", () => {
    const totals = seasonShelves.reduce((result, shelf) => ({
      unlockCost: result.unlockCost + Number(shelf.unlockCost || 0),
      stageBonus: result.stageBonus + Number(shelf.stageBonus || 0)
    }), { unlockCost: 0, stageBonus: 0 });

    expect(totals).toEqual({ unlockCost: 0, stageBonus: 970 });
  });

  it("reserves spoon spending for Pantry jars while keeping the authored reward curve", () => {
    expect(seasonShelves.every((shelf) => shelf.unlockCost === 0)).toBe(true);
    const puzzleRewards = seasonShelves.reduce(
      (total, shelf) => total + getSeasonShelfPuzzles(shelf).reduce(
        (shelfTotal, puzzle) => shelfTotal + Number(puzzle.reward || 0),
        0
      ),
      0
    );
    expect(puzzleRewards).toBe(4124);
  });

  it("maps seventy paid Pantry collectibles to fourteen five-item stage gates", () => {
    expect(seasonShelves.map((shelf) => shelf.pantryRoomStepRequired)).toEqual([
      0, 5, 10, 15, 15, 20, 20, 25, 25, 30, 30, 35, 35, 40, 40,
      45, 45, 50, 50, 55, 55, 60, 60, 65, 65, 70, 70
    ]);
  });

  it("places stabilization shelves at three new Pantry gates and preserves the full economy gap", () => {
    const stabilizationShelves = seasonShelves.slice(15, 21);
    expect(stabilizationShelves.map((shelf) => shelf.id)).toEqual([
      "shelf-herb-terrace",
      "shelf-sunroom-table",
      "shelf-orchard-window",
      "shelf-lantern-courtyard",
      "shelf-moonlit-veranda",
      "shelf-hearth-gallery"
    ]);
    expect(stabilizationShelves.map((shelf) => getSeasonShelfSizeCounts(shelf))).toEqual([
      { 8: 8, 10: 20 },
      { 8: 8, 10: 20 },
      { 8: 8, 10: 20 },
      { 8: 8, 10: 20 },
      { 8: 8, 10: 20 },
      { 8: 7, 10: 20 }
    ]);
    expect(stabilizationShelves.map((shelf) => shelf.pantryRoomStepRequired)).toEqual([45, 45, 50, 50, 55, 55]);

    const authoredRewards = seasonShelves.reduce((total, shelf) => total
      + Number(shelf.stageBonus || 0)
      + getSeasonShelfPuzzles(shelf).reduce(
        (shelfTotal, puzzle) => shelfTotal + Number(puzzle.reward || 0),
        0
      ), 0);
    const paidJarCost = PANTRY_JARS.reduce((total, jar) => total + Number(jar.cost || 0), 0);
    const decorationCost = pantryDecorations.reduce((total, decoration) => total + Number(decoration.cost || 0), 0);

    expect(authoredRewards).toBe(5094);
    expect(paidJarCost).toBe(10655);
    expect(decorationCost).toBe(2706);
    expect(paidJarCost + decorationCost - authoredRewards).toBe(8267);
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
