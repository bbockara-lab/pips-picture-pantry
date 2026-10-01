import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getTimeAttackHintCost } from "../src/data/economyConfig.js";
import { finishTimeAttackSession } from "../src/ui/timeAttackFlow.js";
import { getPuzzleHintCost } from "../src/ui/puzzleView.js";

const originalLocalStorage = globalThis.localStorage;

beforeEach(() => {
  const values = new Map();
  globalThis.localStorage = {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    clear: () => values.clear()
  };
});

afterEach(() => {
  if (originalLocalStorage) {
    globalThis.localStorage = originalLocalStorage;
  } else {
    delete globalThis.localStorage;
  }
});

describe("Time Attack hint restoration", () => {
  it("charges every Time Attack hint in the 2, 4, 7 spoon sequence", () => {
    const costs = [0, 1, 2, 3].map((paidHintsUsed) => getPuzzleHintCost({
      puzzleSize: 5,
      hintsUsed: paidHintsUsed,
      paidHintsUsed,
      hintLimit: 3,
      isTimeAttack: true,
      getTimeAttackHintCost
    }));

    expect(costs).toEqual([2, 4, 7, 0]);
  });

  it("includes current and previous-round hints in the final result", () => {
    const puzzle = { id: "time-attack-hint-result", size: 1, solution: ["1"] };
    const result = finishTimeAttackSession({
      run: [puzzle],
      seed: "hint-result",
      startedAt: Date.now(),
      roundIndex: 0,
      puzzle,
      puzzleState: { cells: [["filled"]], hintsUsed: 2 },
      previousHintsUsed: 1,
      completedRounds: 1,
      outcome: "complete"
    });

    expect(result.status).toBe("complete");
    expect(result.result.hintsUsed).toBe(3);
  });
});