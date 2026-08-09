import { describe, expect, it } from "vitest";
import { getSpoonRunOpportunity } from "../src/game/spoonRunRewards.js";

describe("Spoon Run opportunity", () => {
  it("combines the daily puzzle reward, daily bonus, and remaining replay rewards", () => {
    expect(getSpoonRunOpportunity({
      dailyPuzzle: { id: "daily", size: 8 },
      replayPicks: [{ id: "one" }, { id: "two" }, { id: "three" }],
      replayRewardedPuzzleIds: ["one"],
      replayDailyCount: 1,
      replayDailyLimit: 3
    })).toMatchObject({
      dailyPuzzleReward: 4,
      dailyBonus: 8,
      dailyReward: 12,
      replayReward: 2,
      replayPickCount: 2,
      total: 14
    });
  });

  it("removes today's completed daily reward and already rewarded replay picks", () => {
    expect(getSpoonRunOpportunity({
      dailyPuzzle: { id: "daily", size: 5 },
      dailyCompleted: true,
      replayPicks: [{ id: "one" }, { id: "two" }, { id: "two" }],
      replayRewardedPuzzleIds: ["one"],
      replayDailyCount: 1,
      replayDailyLimit: 3
    })).toMatchObject({
      dailyReward: 0,
      replayReward: 1,
      replayPickCount: 1,
      total: 1
    });
  });

  it("never advertises replay rewards beyond the remaining daily limit", () => {
    expect(getSpoonRunOpportunity({
      dailyPuzzle: { id: "daily", size: 10 },
      replayPicks: [{ id: "one" }, { id: "two" }, { id: "three" }],
      replayDailyCount: 3,
      replayDailyLimit: 3
    })).toMatchObject({ replayReward: 0, replayPickCount: 0, total: 14 });
  });
});
