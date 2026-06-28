import { describe, expect, it } from "vitest";
import { getUnlockRequirementProgress, isPuzzleUnlocked } from "../src/game/puzzleAccess.js";

const unlockablePuzzle = {
  id: "sunny-spoon-sign-10",
  access: "unlockable",
  unlockRequirement: {
    type: "completed-count",
    count: 5
  }
};

describe("puzzle access", () => {
  it("keeps free puzzles available", () => {
    expect(isPuzzleUnlocked({ access: "free" }, [])).toBe(true);
  });

  it("locks completed-count puzzles until enough cards are finished", () => {
    expect(isPuzzleUnlocked(unlockablePuzzle, ["a", "b", "c", "d"])).toBe(false);
    expect(isPuzzleUnlocked(unlockablePuzzle, ["a", "b", "c", "d", "e"])).toBe(true);
  });

  it("reports unlock progress without double-counting completed ids", () => {
    expect(getUnlockRequirementProgress(unlockablePuzzle, ["a", "a", "b"])).toEqual({
      type: "completed-count",
      completed: 2,
      required: 5,
      remaining: 3
    });
  });
});