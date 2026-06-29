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


  it("ships the first launch shelf with 30 playable pictures", () => {
    expect(puzzles).toHaveLength(30);
    expect(puzzles.filter((puzzle) => puzzle.size === 5)).toHaveLength(12);
    expect(puzzles.filter((puzzle) => puzzle.size === 8)).toHaveLength(12);
    expect(puzzles.filter((puzzle) => puzzle.size === 10)).toHaveLength(6);
  });
  it("includes starter, easy, and next-step launch-board sizes", () => {
    expect(puzzles.some((puzzle) => puzzle.size === 5)).toBe(true);
    expect(puzzles.some((puzzle) => puzzle.size === 8)).toBe(true);
    expect(puzzles.some((puzzle) => puzzle.size === 10)).toBe(true);
  });

  it("supports stacked multi-number column clues", () => {
    const windowPuzzle = puzzles.find((puzzle) => puzzle.id === "cafe-window-8");
    const clues = computeClues(windowPuzzle.solution);

    expect(clues.columns.some((clue) => clue.length > 1)).toBe(true);
  });

  it("keeps monetization access metadata explicit and non-blocking", () => {
    const supportedAccess = new Set(["free", "unlockable", "bonus-pack"]);

    puzzles.forEach((puzzle) => {
      expect(supportedAccess.has(puzzle.access)).toBe(true);
      expect(puzzle.reward).toBeUndefined();
    });

    expect(puzzles.filter((puzzle) => puzzle.access === "free").length).toBeGreaterThan(5);
    expect(puzzles.some((puzzle) => puzzle.access === "unlockable")).toBe(true);
  });
});
