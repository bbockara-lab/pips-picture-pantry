import {
  ECONOMY,
  getDailyReplayPickLimit,
  getPuzzleReward,
  getReplayPickReward
} from "../data/economyConfig.js";

export function getSpoonRunOpportunity(options = {}) {
  const {
    dailyPuzzle = null,
    dailyCompleted = false,
    replayPicks = [],
    replayRewardedPuzzleIds = [],
    replayDailyCount = replayRewardedPuzzleIds.length,
    replayDailyLimit = getDailyReplayPickLimit()
  } = options;

  const dailyPuzzleReward = dailyCompleted ? 0 : getPuzzleReward(dailyPuzzle?.size);
  const dailyBonus = dailyCompleted || !dailyPuzzle ? 0 : ECONOMY.DAILY_BONUS;
  const rewarded = new Set(replayRewardedPuzzleIds || []);
  const unclaimedReplayPicks = Array.from(new Map(
    (Array.isArray(replayPicks) ? replayPicks : [])
      .filter((puzzle) => puzzle?.id && !rewarded.has(puzzle.id))
      .map((puzzle) => [puzzle.id, puzzle])
  ).values());
  const remainingReplaySlots = Math.max(
    0,
    Math.max(0, Number(replayDailyLimit) || 0) - Math.max(0, Number(replayDailyCount) || 0)
  );
  const replayPickCount = Math.min(unclaimedReplayPicks.length, remainingReplaySlots);
  const replayReward = replayPickCount * getReplayPickReward();

  return {
    dailyPuzzleReward,
    dailyBonus,
    dailyReward: dailyPuzzleReward + dailyBonus,
    replayReward,
    replayPickCount,
    remainingReplaySlots,
    total: dailyPuzzleReward + dailyBonus + replayReward
  };
}
