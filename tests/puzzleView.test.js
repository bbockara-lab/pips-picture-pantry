import { describe, expect, it } from "vitest";
import { getPuzzleHintCost } from "../src/ui/puzzleView.js";

describe("puzzle view hint cost", () => {
  it("keeps Time Attack hints free until the run allowance is used", () => {
    const getTimeAttackHintCost = (paidHintsUsed) => [2, 4, 7][paidHintsUsed] || 0;

    expect(getPuzzleHintCost({
      puzzleSize: 12,
      hintsUsed: 2,
      paidHintsUsed: 0,
      hintLimit: 3,
      isTimeAttack: true,
      getTimeAttackHintCost
    })).toBe(0);

    expect(getPuzzleHintCost({
      puzzleSize: 12,
      hintsUsed: 3,
      paidHintsUsed: 0,
      hintLimit: 3,
      isTimeAttack: true,
      getTimeAttackHintCost
    })).toBe(2);

    expect(getPuzzleHintCost({
      puzzleSize: 12,
      hintsUsed: 4,
      paidHintsUsed: 1,
      hintLimit: 3,
      isTimeAttack: true,
      getTimeAttackHintCost
    })).toBe(4);
  });

  it("uses the size-aware spoon cost after normal puzzle free hints", () => {
    expect(getPuzzleHintCost({ puzzleSize: 12, hintsUsed: 3, paidHintsUsed: 0, hintLimit: 4 })).toBe(0);
    expect(getPuzzleHintCost({ puzzleSize: 12, hintsUsed: 4, paidHintsUsed: 0, hintLimit: 4 })).toBe(9);
    expect(getPuzzleHintCost({ puzzleSize: 12, hintsUsed: 5, paidHintsUsed: 1, hintLimit: 4 })).toBe(14);
  });
});