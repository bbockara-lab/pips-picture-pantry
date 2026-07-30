import { describe, expect, it } from "vitest";
import {
  ECONOMY,
  getDailyTimeAttackLimit,
  getPuzzleReward,
  getPuzzleExtraHintCost,
  getTimeAttackHintCost,
  getTimeAttackRecordBonus,
  getTimeAttackReward
} from "../src/data/economyConfig.js";

describe("economy config", () => {
  it("uses the Pantry-focused puzzle reward curve", () => {
    expect([5, 8, 10, 12].map(getPuzzleReward)).toEqual([2, 4, 6, 10]);
  });
  it("keeps the large spoon jar above three support packs", () => {
    expect(ECONOMY.COZY_PASS_SPOON_GRANT).toBe(150);
    expect(ECONOMY.SPOON_JAR_SMALL_GRANT).toBe(500);
    expect(ECONOMY.SPOON_JAR_SMALL_GRANT).toBeGreaterThan(ECONOMY.COZY_PASS_SPOON_GRANT * 3);
  });
  it("keeps Time Attack attractive without overpowering daily puzzle rewards", () => {
    expect([5, 8, 10, 12].map(getTimeAttackReward)).toEqual([10, 18, 30, 45]);
    expect(getTimeAttackReward(999)).toBe(18);
    expect(getTimeAttackRecordBonus()).toBe(12);
    expect(getDailyTimeAttackLimit()).toBe(3);
  });
  it("keeps time attack hint costs escalating by run use", () => {
    expect(getTimeAttackHintCost(0)).toBe(2);
    expect(getTimeAttackHintCost(1)).toBe(4);
    expect(getTimeAttackHintCost(2)).toBe(7);
    expect(getTimeAttackHintCost(3)).toBe(0);
  });

  it("prices normal extra puzzle hints by board size and paid count", () => {
    expect(getPuzzleExtraHintCost(5, 0)).toBe(3);
    expect(getPuzzleExtraHintCost(5, 1)).toBe(5);
    expect(getPuzzleExtraHintCost(8, 0)).toBe(5);
    expect(getPuzzleExtraHintCost(8, 1)).toBe(8);
    expect(getPuzzleExtraHintCost(10, 0)).toBe(6);
    expect(getPuzzleExtraHintCost(12, 0)).toBe(9);
    expect(getPuzzleExtraHintCost(12, 1)).toBe(14);
    expect(getPuzzleExtraHintCost(15, 2)).toBe(27);
    expect(getPuzzleExtraHintCost(18, 1)).toBe(27);
  });
});
