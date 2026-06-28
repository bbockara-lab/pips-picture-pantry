import { describe, expect, it } from "vitest";
import { puzzles } from "../src/data/puzzles.js";
import { computeClues } from "../src/game/nonogram.js";

describe("puzzle data", () => {
  it("keeps every solution row aligned to puzzle size", () => {
    puzzles.forEach((puzzle) => {
      expect(puzzle.solution).toHaveLength(puzzle.size);
      puzzle.solution.forEach((row) => {
        expect(row).toHaveLength(puzzle.size);
        expect(row).toMatch(/^[01]+$/);
      });
    });
  });

  it("includes starter and easy launch-board sizes", () => {
    expect(puzzles.some((puzzle) => puzzle.size === 5)).toBe(true);
    expect(puzzles.some((puzzle) => puzzle.size === 8)).toBe(true);
  });

  it("supports stacked multi-number column clues", () => {
    const windowPuzzle = puzzles.find((puzzle) => puzzle.id === "cafe-window-8");
    const clues = computeClues(windowPuzzle.solution);

    expect(clues.columns.some((clue) => clue.length > 1)).toBe(true);
  });
});
