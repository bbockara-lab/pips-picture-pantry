import {
  ECONOMY,
  getDailyReplayPickLimit,
  getReplayPickReward
} from "../data/economyConfig.js";

export function getSpoonRunOpportunity(options = {}) {
  const {
    dailyPuzzle = null,
    dailyCompleted = false,
    rewardedPuzzleIds = [],
    replayPicks = [],
    replayRewardedPuzzleIds = [],
    replayDailyCount = replayRewardedPuzzleIds.length,
    replayDailyLimit = getDailyReplayPickLimit()
  } = options;

  const rewardedPuzzles = new Set(rewardedPuzzleIds || []);
  const dailyPuzzleReward = dailyCompleted || !dailyPuzzle || rewardedPuzzles.has(dailyPuzzle.id)
    ? 0
    : Math.max(0, Number(dailyPuzzle.reward) || 0);
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
