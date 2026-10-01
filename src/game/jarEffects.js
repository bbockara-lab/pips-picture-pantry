import { JAR_SHELVES, getJarsByShelf } from "../data/pantryJars.js";
import { KOREAN_HARVEST_DISPLAY_BONUS_CHANCE, isKoreanHarvestRewardUnlocked } from "../data/koreanHarvestContent.js";

export const PANTRY_BONUS_FUTURE_SHELF_CAP = 24;
export const PANTRY_BONUS_MAX_CHANCE = 26;
export const PANTRY_BONUS_MAX_WITH_SEASONAL_DISPLAY = PANTRY_BONUS_MAX_CHANCE + KOREAN_HARVEST_DISPLAY_BONUS_CHANCE;
export const PANTRY_BONUS_REWARD = 1;
export const PANTRY_BONUS_COMPLETION_RETENTION = 1600;

// Front-load the first Pantry levels so the effect is visible early, then
// taper toward the existing 16% live-content and 26% future-content caps.
export const PANTRY_BONUS_EARLY_CURVE = Object.freeze([
  0, 5, 7, 9, 10, 11, 12, 13, 13, 14, 14, 15, 15, 16, 16
]);

export function getCompletedPantryShelfCountFromSave(save) {
  const owned = new Set(Array.isArray(save?.ownedJarIds) ? save.ownedJarIds : []);
  return JAR_SHELVES.filter((shelf) => {
    const paidJars = getJarsByShelf(shelf.id).filter((jar) => jar.cost > 0);
    return paidJars.length > 0 && paidJars.every((jar) => owned.has(jar.id));
  }).length;
}

// The first completed shelf starts at 5%. Growth tapers through the 14 live
// shelves, then resumes at one point per future shelf to reach 26% at 24.
export function getPantryGrowthBonusChance(completedShelfCount) {
  const completed = Math.max(0, Math.floor(Number(completedShelfCount) || 0));
  if (completed < PANTRY_BONUS_EARLY_CURVE.length) {
    return PANTRY_BONUS_EARLY_CURVE[completed];
  }
  return Math.min(PANTRY_BONUS_MAX_CHANCE, completed + 2);
}

export function getPantryGrowthBonusStatus(save) {
  const completedShelves = getCompletedPantryShelfCountFromSave(save);
  const baseChance = getPantryGrowthBonusChance(completedShelves);
  const ownedJarIds = Array.isArray(save?.ownedJarIds) ? save.ownedJarIds : [];
  const hasFeaturedJar = Boolean(save?.featuredJarId && ownedJarIds.includes(save.featuredJarId));
  const seasonalRewardId = save?.featuredSeasonalRewardId || null;
  const hasUnlockedSeasonalReward = Boolean(
    seasonalRewardId && isKoreanHarvestRewardUnlocked(seasonalRewardId, save?.completedPuzzleIds)
  );
  const seasonalDisplayBonus = hasFeaturedJar && hasUnlockedSeasonalReward
    ? KOREAN_HARVEST_DISPLAY_BONUS_CHANCE
    : 0;
  return {
    completedShelves,
    futureShelfCap: PANTRY_BONUS_FUTURE_SHELF_CAP,
    baseChance,
    seasonalDisplayBonus,
    seasonalBonusActive: seasonalDisplayBonus > 0,
    chance: Math.min(PANTRY_BONUS_MAX_WITH_SEASONAL_DISPLAY, baseChance + seasonalDisplayBonus),
    reward: PANTRY_BONUS_REWARD
  };
}

export function applyPantryGrowthBonus(save, completionKey, randomValue = Math.random()) {
  const status = getPantryGrowthBonusStatus(save);
  const base = {
    pantryBonusReward: 0,
    pantryBonusTriggered: false,
    pantryBonusChance: status.chance,
    completedPantryShelves: status.completedShelves,
    // Compatibility for completion consumers while old saves migrate.
    jarEffectReward: 0,
    jarEffectTriggered: false
  };
  if (!completionKey || status.chance <= 0) return base;

  save.pantryBonusCompletionKeys = Array.isArray(save.pantryBonusCompletionKeys)
    ? save.pantryBonusCompletionKeys
    : [];
  if (save.pantryBonusCompletionKeys.includes(completionKey)) return base;
  save.pantryBonusCompletionKeys = [...save.pantryBonusCompletionKeys, completionKey]
    .slice(-PANTRY_BONUS_COMPLETION_RETENTION);

  const numericRoll = Number(randomValue);
  const roll = Number.isFinite(numericRoll)
    ? Math.max(0, Math.min(0.999999, numericRoll))
    : Math.random();
  if (roll >= status.chance / 100) return base;

  save.pantrySpoons += PANTRY_BONUS_REWARD;
  return {
    ...base,
    pantryBonusReward: PANTRY_BONUS_REWARD,
    pantryBonusTriggered: true,
    jarEffectReward: PANTRY_BONUS_REWARD,
    jarEffectTriggered: true
  };
}
