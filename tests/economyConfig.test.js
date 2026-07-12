import { describe, expect, it } from "vitest";
import { getPuzzleExtraHintCost, getTimeAttackHintCost } from "../src/data/economyConfig.js";

describe("economy config", () => {
  it("keeps time attack hint costs escalating by run use", () => {
    expect(getTimeAttackHintCost(0)).toBe(2);
    expect(getTimeAttackHintCost(1)).toBe(4);
    expect(getTimeAttackHintCost(2)).toBe(7);
    expect(getTimeAttackHintCost(3)).toBe(0);
  });

  it("prices normal extra puzzle hints by board size and paid count", () => {
    expect(getPuzzleExtraHintCost(5, 0)).toBe(0);
    expect(getPuzzleExtraHintCost(8, 0)).toBe(0);
    expect(getPuzzleExtraHintCost(10, 0)).toBe(6);
    expect(getPuzzleExtraHintCost(12, 0)).toBe(9);
    expect(getPuzzleExtraHintCost(12, 1)).toBe(14);
    expect(getPuzzleExtraHintCost(15, 2)).toBe(27);
    expect(getPuzzleExtraHintCost(18, 1)).toBe(27);
  });
});
