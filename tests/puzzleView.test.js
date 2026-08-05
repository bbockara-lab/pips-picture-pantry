import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const puzzleViewSource = readFileSync("src/ui/puzzleView.js", "utf8");
const appShellSource = readFileSync("src/ui/appShell.js", "utf8");
import { getPuzzleHintCost } from "../src/ui/puzzleView.js";

describe("Daily puzzle state isolation", () => {
  it("starts Daily from a fresh board and saves only its completed state", () => {
    expect(puzzleViewSource).toContain("const isDailyChallenge = Boolean(options.dailyKey)");
    expect(puzzleViewSource).toContain("isReplayChallenge || isTimeAttack || isDailyChallenge");
    expect(puzzleViewSource).toMatch(/isReplayChallenge \|\| isDailyChallenge\s*\? createPuzzleState\(puzzle\)/);
    expect(puzzleViewSource).toMatch(/if \(isDailyChallenge\) \{[\s\S]*savePuzzleState\(state/);
    expect(puzzleViewSource).toContain("dailyResult = savePuzzleState(state");
    expect(puzzleViewSource).toContain("rewardResult = dailyResult");
    expect(puzzleViewSource).toContain("stageBonus = Number(options.onPuzzleComplete?.(puzzle, state)?.bonus || 0)");
    expect(puzzleViewSource).toMatch(/renderCompletionBanner\(puzzle, \{[\s\S]*rewardResult,[\s\S]*stageBonus/);
    expect(appShellSource).toMatch(/const completionResult = markShelfCompletedIfFirst\(shelf\);[\s\S]*return completionResult;/);
  });
});

describe("puzzle view hint cost", () => {
  it("charges every Time Attack hint from the run allowance", () => {
    const getTimeAttackHintCost = (paidHintsUsed) => [2, 4, 7][paidHintsUsed] || 0;

    expect([0, 1, 2].map((paidHintsUsed) => getPuzzleHintCost({
      puzzleSize: 12,
      hintsUsed: paidHintsUsed,
      paidHintsUsed,
      hintLimit: 3,
      isTimeAttack: true,
      getTimeAttackHintCost
    }))).toEqual([2, 4, 7]);
  });

  it("uses the size-aware spoon cost after normal puzzle free hints", () => {
    expect(getPuzzleHintCost({ puzzleSize: 5, hintsUsed: 0, paidHintsUsed: 0, hintLimit: 1 })).toBe(0);
    expect(getPuzzleHintCost({ puzzleSize: 5, hintsUsed: 1, paidHintsUsed: 0, hintLimit: 1 })).toBe(3);
    expect(getPuzzleHintCost({ puzzleSize: 8, hintsUsed: 1, paidHintsUsed: 0, hintLimit: 2 })).toBe(0);
    expect(getPuzzleHintCost({ puzzleSize: 8, hintsUsed: 2, paidHintsUsed: 0, hintLimit: 2 })).toBe(5);
    expect(getPuzzleHintCost({ puzzleSize: 12, hintsUsed: 3, paidHintsUsed: 0, hintLimit: 4 })).toBe(0);
    expect(getPuzzleHintCost({ puzzleSize: 12, hintsUsed: 4, paidHintsUsed: 0, hintLimit: 4 })).toBe(9);
    expect(getPuzzleHintCost({ puzzleSize: 12, hintsUsed: 5, paidHintsUsed: 1, hintLimit: 4 })).toBe(14);
  });
});