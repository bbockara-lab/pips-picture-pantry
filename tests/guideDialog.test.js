import { describe, expect, it } from "vitest";
import { PUZZLE_PRACTICE } from "../src/ui/guideDialog.js";

describe("Pip puzzle practice", () => {
  it("uses an unambiguous full-row clue", () => {
    expect(PUZZLE_PRACTICE.clue).toBe(5);
    expect(PUZZLE_PRACTICE.cellCount).toBe(5);
    expect(PUZZLE_PRACTICE.targetIndexes).toEqual([0, 1, 2, 3, 4]);
    expect(PUZZLE_PRACTICE.separatedClue).toEqual({
      clue: "1 1 1",
      filledIndexes: [0, 2, 4]
    });
  });
});
