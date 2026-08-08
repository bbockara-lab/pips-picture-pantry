import { describe, expect, it } from "vitest";
import { countNonogramSolutions, hasUniqueNonogramSolution } from "../src/game/nonogramUniqueness.js";
import { puzzles } from "../src/data/puzzles.js";

describe("nonogram solution uniqueness", () => {
  it("recognizes an ambiguous clue set", () => {
    expect(countNonogramSolutions(["10", "01"])).toBe(2);
    expect(hasUniqueNonogramSolution(["10", "01"])).toBe(false);
  });

  it("recognizes a uniquely constrained clue set", () => {
    expect(countNonogramSolutions(["10", "10"])).toBe(1);
    expect(hasUniqueNonogramSolution(["10", "10"])).toBe(true);
  });

  it("keeps every authored picture uniquely solvable", () => {
    const ambiguousIds = puzzles
      .filter((puzzle) => !hasUniqueNonogramSolution(puzzle.solution))
      .map((puzzle) => puzzle.id);

    expect(ambiguousIds).toEqual([]);
  });
});
