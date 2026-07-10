export const ECONOMY = {
  PUZZLE_REWARD_BY_SIZE: {
    5: 3,
    8: 6,
    10: 10,
    12: 15,
    15: 22,
    18: 30
  },
  DAILY_BONUS: 8,
  STAGE_BONUS_BY_SIZE: {
    5: 40,
    8: 80,
    10: 130,
    12: 200,
    15: 300,
    18: 420
  },
  TIME_ATTACK_REWARD_BY_SIZE: {
    5: 15,
    8: 25,
    10: 38,
    12: 55
  },
  TIME_ATTACK_RECORD_BONUS: 12,
  TIME_ATTACK_DAILY_LIMIT: 3,
  TIME_ATTACK_HINT_COSTS: [2, 4, 7],
  REPLAY_PICK_REWARD: 1,
  REPLAY_PICK_DAILY_LIMIT: 3,
  COZY_PASS_SPOON_GRANT: 250
};

export function getPuzzleReward(size) {
  return ECONOMY.PUZZLE_REWARD_BY_SIZE[Number(size)] || 0;
}

export function getStageBonus(size) {
  return ECONOMY.STAGE_BONUS_BY_SIZE[Number(size)] || 0;
}

export function getTimeAttackReward(size) {
  return ECONOMY.TIME_ATTACK_REWARD_BY_SIZE[Number(size)] || 25;
}

export function getTimeAttackRecordBonus() {
  return ECONOMY.TIME_ATTACK_RECORD_BONUS;
}

export function getDailyTimeAttackLimit() {
  return ECONOMY.TIME_ATTACK_DAILY_LIMIT;
}

export function getTimeAttackHintCost(hintsUsed = 0) {
  const costs = Array.isArray(ECONOMY.TIME_ATTACK_HINT_COSTS) ? ECONOMY.TIME_ATTACK_HINT_COSTS : [];
  const index = Math.max(0, Number(hintsUsed) || 0);
  return costs[index] || 0;
}

export function getTimeAttackHintCosts() {
  return [...ECONOMY.TIME_ATTACK_HINT_COSTS];
}

export function getReplayPickReward() {
  return ECONOMY.REPLAY_PICK_REWARD;
}

export function getDailyReplayPickLimit() {
  return ECONOMY.REPLAY_PICK_DAILY_LIMIT;
}
