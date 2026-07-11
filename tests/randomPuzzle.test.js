import { describe, expect, it } from "vitest";
import {
  createTimeAttackPuzzle,
  createTimeAttackRun,
  getTimeAttackRunScore,
  getTimeAttackSizeForRound
} from "../src/game/randomPuzzle.js";

describe("time attack random puzzle generation", () => {
  it("generates deterministic puzzles for the same seed", () => {
    const first = createTimeAttackPuzzle({ seed: "daily-speed", size: 10, index: 2 });
    const second = createTimeAttackPuzzle({ seed: "daily-speed", size: 10, index: 2 });

    expect(second.solution).toEqual(first.solution);
    expect(second.id).toBe(first.id);
  });

  it("keeps every row and column playable", () => {
    const puzzle = createTimeAttackPuzzle({ seed: "playable-lines", size: 12, index: 4 });
    const rows = puzzle.solution;
    const columns = Array.from({ length: puzzle.size }, (_, column) => rows.map((row) => row[column]).join(""));

    for (const line of [...rows, ...columns]) {
      expect(line).toContain("1");
      expect(line).toContain("0");
    }
  });

  it("ramps board size during a run", () => {
    expect([0, 1, 2, 3, 5, 6, 12].map(getTimeAttackSizeForRound)).toEqual([5, 8, 10, 12, 12, 15, 15]);
    expect(createTimeAttackRun({ seed: "run", rounds: 3 }).map((puzzle) => puzzle.size)).toEqual([5, 8, 10]);
    expect(createTimeAttackRun({ seed: "run", rounds: 6 }).map((puzzle) => puzzle.size)).toEqual([5, 8, 10, 12, 12, 12]);
  });

  it("scores time attack records by progress cells before speed", () => {
    expect(getTimeAttackRunScore({ progressCells: 189, elapsedSeconds: 45 })).toBe(189555);
    expect(getTimeAttackRunScore({ progressCells: 90, elapsedSeconds: 300 })).toBeGreaterThan(
      getTimeAttackRunScore({ progressCells: 89, elapsedSeconds: 1 })
    );
    expect(getTimeAttackRunScore({ progressCells: 90, elapsedSeconds: 1, hintsUsed: 2 })).toBeLessThan(
      getTimeAttackRunScore({ progressCells: 90, elapsedSeconds: 1, hintsUsed: 0 })
    );
  });
});
