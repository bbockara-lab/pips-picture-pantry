import { describe, expect, it } from "vitest";
import { puzzlePacks } from "../src/data/packs.js";
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

  it("ships 100 free progression pictures in five stages", () => {
    expect(puzzles).toHaveLength(100);
    expect(puzzlePacks.filter((pack) => pack.monetizationRole !== "paid-theme-pack")).toHaveLength(5);
    puzzlePacks
      .filter((pack) => pack.monetizationRole !== "paid-theme-pack")
      .forEach((pack) => {
        expect(puzzles.filter((puzzle) => puzzle.packId === pack.id)).toHaveLength(20);
      });
  });

  it("keeps the launch board sizes mobile-first", () => {
    expect(puzzles.filter((puzzle) => puzzle.size === 5)).toHaveLength(40);
    expect(puzzles.filter((puzzle) => puzzle.size === 8)).toHaveLength(60);
    expect(puzzles.some((puzzle) => puzzle.size > 8)).toBe(false);
  });

  it("supports stacked multi-number column clues", () => {
    const cluePuzzle = puzzles.find((puzzle) => {
      const clues = computeClues(puzzle.solution);
      return clues.columns.some((clue) => clue.length > 1);
    });
    expect(cluePuzzle).toBeTruthy();
  });

  it("keeps reward and access metadata explicit", () => {
    const supportedAccess = new Set(["free", "unlockable", "bonus-pack"]);

    puzzles.forEach((puzzle) => {
      expect(supportedAccess.has(puzzle.access)).toBe(true);
      expect(puzzle.reward).toBeGreaterThan(0);
    });

    expect(puzzles.filter((puzzle) => puzzle.access === "free")).toHaveLength(100);
    expect(puzzlePacks.filter((pack) => pack.access === "unlockable")).toHaveLength(4);
    expect(puzzlePacks.filter((pack) => pack.access === "bonus-pack")).toHaveLength(5);
    expect(puzzlePacks.filter((pack) => pack.muralSet === "pip-portrait")).toHaveLength(5);
  });
});
