import { getDailyReplayPickLimit, getDailyTimeAttackLimit, getReplayPickReward, getTimeAttackRecordBonus, getTimeAttackReward } from "../data/economyConfig.js";
import { isDecorationArtApproved } from "../data/decorations.js";
import { restoreState, serializeState } from "./puzzleState.js";

const LEGACY_SAVE_KEY = "pips-picture-pantry:v0.1:save";
const SAVE_PREFIX = "pips-picture-pantry:v0.1:save:";
const ACTIVE_PLAYER_KEY = "pips-picture-pantry:v0.1:active-player";
const PLAYERS_KEY = "pips-picture-pantry:v0.1:players";
const GUIDE_IDS = new Set(["puzzle", "timeAttack", "pantryFirstPurchase"]);
const DEFAULT_PLAYER_NAME = "Friend";
const STARTER_PACK_ID = "pips-first-shelf";
const TIME_ATTACK_DAILY_COUNT_RETENTION_DAYS = 30;
const REPLAY_REWARD_RETENTION_DAYS = 30;

export function loadSave() {
  const payload = localStorage.getItem(getActiveSaveKey());
  if (!payload) {
    return null;
  }

  try {
    const parsed = JSON.parse(payload);
    return normalizeSave(parsed);
  } catch {
    return null;
  }
}

export function saveGame(data) {
  localStorage.setItem(getActiveSaveKey(), JSON.stringify(normalizeSave(data)));
}

export function loadPuzzleState(puzzleId) {
  const save = loadSave();
  return restoreState(save?.puzzleStates?.[puzzleId] || null);
}

export function savePuzzleState(state, rewardOptions = {}) {
  const save = loadSave() || createEmptySave();
  const wasCompleted = save.completedPuzzleIds.includes(state.puzzleId);
  save.puzzleStates[state.puzzleId] = serializeState(state);

  if (state.completed && !wasCompleted) {
    save.completedPuzzleIds.push(state.puzzleId);
    save.completionDates[state.puzzleId] = getLocalDateKey();
    const reward = Number(rewardOptions.reward || 0);
    if (reward > 0 && !save.rewardedPuzzleIds.includes(state.puzzleId)) {
      save.pantrySpoons += reward;
      save.rewardedPuzzleIds.push(state.puzzleId);
    }
    if (rewardOptions.dailyKey && !save.dailyRewardedDates.includes(rewardOptions.dailyKey)) {
      const dailyBonus = Number(rewardOptions.dailyBonus || 0);
      if (dailyBonus > 0) {
        save.pantrySpoons += dailyBonus;
        save.dailyRewardedDates.push(rewardOptions.dailyKey);
      }
    }
  }

  saveGame(save);
}

export function getCompletedPuzzleIds() {
  return loadSave()?.completedPuzzleIds || [];
}

export function getPantrySpoons() {
  return loadSave()?.pantrySpoons || 0;
}

export function spendPantrySpoons(cost, reason = "spend") {
  const normalizedCost = Math.max(0, Number(cost) || 0);
  const save = loadSave() || createEmptySave();
  if (normalizedCost <= 0) {
    return { spent: 0, balance: save.pantrySpoons, allowed: true, reason };
  }
  if (save.pantrySpoons < normalizedCost) {
    return { spent: 0, balance: save.pantrySpoons, allowed: false, reason: "not-enough-spoons" };
  }
  save.pantrySpoons -= normalizedCost;
  saveGame(save);
  return { spent: normalizedCost, balance: save.pantrySpoons, allowed: true, reason };
}

export function getOwnedDecorationIds() {
  return loadSave()?.ownedDecorationIds || [];
}

export function getEquippedDecorations() {
  return loadSave()?.equippedDecorations || {};
}

export function getPantryStoryGoalId() {
  return loadSave()?.pantryStoryGoalId || null;
}

export function getCompletedPantryStoryGoalIds() {
  return loadSave()?.pantryCompletedStoryGoalIds || [];
}

export function getPantryRoomStepCount() {
  return getCompletedPantryStoryGoalIds().length;
}

export function getPackPantryRoomRequirement(pack) {
  const required = Math.max(0, Number(pack?.pantryRoomStepRequired || 0));
  const completed = getPantryRoomStepCount();
  return {
    required,
    completed,
    remaining: Math.max(0, required - completed),
    met: completed >= required
  };
}

export function hasCompletedPantryStoryGoal(decorationOrId) {
  const decorationId = normalizeDecorationId(decorationOrId);
  return Boolean(decorationId && getCompletedPantryStoryGoalIds().includes(decorationId));
}

export function setPantryStoryGoalId(decorationOrId) {
  const decorationId = normalizeDecorationId(decorationOrId);
  const save = loadSave() || createEmptySave();
  save.pantryStoryGoalId = decorationId;
  saveGame(save);
}

export function clearPantryStoryGoalId(decorationOrId = null) {
  const decorationId = normalizeDecorationId(decorationOrId);
  const save = loadSave() || createEmptySave();
  if (!decorationId || save.pantryStoryGoalId === decorationId) {
    save.pantryStoryGoalId = null;
    saveGame(save);
  }
}

export function recordPantryStoryGoalComplete(decorationOrId) {
  const decorationId = normalizeDecorationId(decorationOrId);
  if (!decorationId) {
    return false;
  }

  const save = loadSave() || createEmptySave();
  const completedIds = new Set(save.pantryCompletedStoryGoalIds);
  completedIds.add(decorationId);
  save.pantryCompletedStoryGoalIds = [...completedIds];
  if (save.pantryStoryGoalId === decorationId) {
    save.pantryStoryGoalId = null;
  }
  saveGame(save);
  return true;
}

export function buyDecoration(decoration) {
  if (!decoration?.id || !decoration.slot) {
    return false;
  }
  if (!isDecorationArtApproved(decoration)) {
    return false;
  }

  const save = loadSave() || createEmptySave();
  if (save.ownedDecorationIds.includes(decoration.id)) {
    return true;
  }

  const cost = Number(decoration.cost || 0);
  if (save.pantrySpoons < cost) {
    return false;
  }

  save.pantrySpoons -= cost;
  save.ownedDecorationIds.push(decoration.id);
  save.equippedDecorations[decoration.slot] = decoration.id;
  completePantryStoryGoalIfMatched(save, decoration);
  saveGame(save);
  return true;
}

export function equipDecoration(decoration) {
  if (!decoration?.id || !decoration.slot) {
    return false;
  }
  if (!isDecorationArtApproved(decoration)) {
    return false;
  }

  const save = loadSave() || createEmptySave();
  if (!save.ownedDecorationIds.includes(decoration.id)) {
    return false;
  }

  save.equippedDecorations[decoration.slot] = decoration.id;
  completePantryStoryGoalIfMatched(save, decoration);
  saveGame(save);
  return true;
}

export function getUnlockedPackIds() {
  return loadSave()?.unlockedPackIds || [STARTER_PACK_ID];
}

export function getCompletionDates() {
  return loadSave()?.completionDates || {};
}

export function markPackCompletedIfFirst(packOrId) {
  const packId = typeof packOrId === "string" ? packOrId : packOrId?.id;
  if (!packId) {
    return { completed: false, bonus: 0 };
  }

  const save = loadSave() || createEmptySave();
  if (save.completedPackIds.includes(packId)) {
    return { completed: false, bonus: 0 };
  }

  const bonus = Math.max(0, Number(typeof packOrId === "string" ? 0 : packOrId?.stageBonus || 0));
  save.completedPackIds.push(packId);
  if (bonus > 0) {
    save.pantrySpoons += bonus;
  }
  saveGame(save);
  return { completed: true, bonus };
}

export function recordTimeAttackResult({
  size,
  score,
  seed,
  completedRounds = 0,
  elapsedSeconds = 0,
  progressCells = 0,
  currentRoundCorrectCells = 0,
  hintsUsed = 0,
  outcome = "complete"
} = {}) {
  const save = loadSave() || createEmptySave();
  const today = getLocalDateKey();
  const dailyCount = Number(save.timeAttackDailyCount[today] || 0);
  const rewardKey = String(size || "mixed");
  const previousBest = Number(save.timeAttackBestScores[rewardKey]?.score || 0);
  const normalizedScore = Math.max(0, Number(score || 0));
  const normalizedCompletedRounds = Math.max(0, Number(completedRounds || 0));
  const normalizedElapsedSeconds = Math.max(0, Math.floor(Number(elapsedSeconds) || 0));
  const normalizedProgressCells = Math.max(0, Math.floor(Number(progressCells) || 0));
  const normalizedCurrentRoundCorrectCells = Math.max(0, Math.floor(Number(currentRoundCorrectCells) || 0));
  const normalizedHintsUsed = Math.max(0, Math.floor(Number(hintsUsed) || 0));
  const normalizedOutcome = outcome === "timeout" ? "timeout" : "complete";
  const recordImproved = normalizedScore > previousBest;
  const rewardAllowed = dailyCount < getDailyTimeAttackLimit() && normalizedProgressCells > 0;
  let reward = 0;

  if (rewardAllowed) {
    reward += getTimeAttackReward(size);
    if (recordImproved) {
      reward += getTimeAttackRecordBonus();
    }
    save.timeAttackDailyCount[today] = dailyCount + 1;
    save.pantrySpoons += reward;
  }

  if (recordImproved) {
    save.timeAttackBestScores[rewardKey] = {
      score: normalizedScore,
      size: Number(size) || null,
      seed: seed || null,
      completedRounds: normalizedCompletedRounds,
      elapsedSeconds: normalizedElapsedSeconds,
      progressCells: normalizedProgressCells,
      currentRoundCorrectCells: normalizedCurrentRoundCorrectCells,
      hintsUsed: normalizedHintsUsed,
      outcome: normalizedOutcome,
      date: today
    };
  }

  saveGame(save);
  return {
    reward,
    recordImproved,
    rewardAllowed,
    dailyCount: save.timeAttackDailyCount[today] || dailyCount,
    score: normalizedScore,
    completedRounds: normalizedCompletedRounds,
    elapsedSeconds: normalizedElapsedSeconds,
    progressCells: normalizedProgressCells,
    currentRoundCorrectCells: normalizedCurrentRoundCorrectCells,
    hintsUsed: normalizedHintsUsed,
    outcome: normalizedOutcome
  };
}

export function getTimeAttackBestScores() {
  return loadSave()?.timeAttackBestScores || {};
}

export function getTimeAttackDailyCount(dateKey = getLocalDateKey()) {
  return Number(loadSave()?.timeAttackDailyCount?.[dateKey] || 0);
}

export function getReplayRewardedPuzzleIds(dateKey = getLocalDateKey()) {
  const ids = loadSave()?.replayRewardedPuzzleIdsByDate?.[dateKey];
  return Array.isArray(ids) ? ids : [];
}

export function getReplayDailyCount(dateKey = getLocalDateKey()) {
  return getReplayRewardedPuzzleIds(dateKey).length;
}

export function recordReplayReward({ puzzleId, clean = false, picked = false, dateKey = getLocalDateKey() } = {}) {
  const normalizedPuzzleId = String(puzzleId || "");
  const save = loadSave() || createEmptySave();
  const rewardedToday = Array.isArray(save.replayRewardedPuzzleIdsByDate[dateKey])
    ? save.replayRewardedPuzzleIdsByDate[dateKey]
    : [];

  if (!normalizedPuzzleId || !picked || !clean || !save.completedPuzzleIds.includes(normalizedPuzzleId)) {
    return { reward: 0, rewardAllowed: false, reason: "not-eligible", dailyCount: rewardedToday.length };
  }

  if (rewardedToday.includes(normalizedPuzzleId)) {
    return { reward: 0, rewardAllowed: false, reason: "already-claimed", dailyCount: rewardedToday.length };
  }

  if (rewardedToday.length >= getDailyReplayPickLimit()) {
    return { reward: 0, rewardAllowed: false, reason: "daily-limit", dailyCount: rewardedToday.length };
  }

  const reward = getReplayPickReward();
  save.replayRewardedPuzzleIdsByDate[dateKey] = [...rewardedToday, normalizedPuzzleId];
  save.pantrySpoons += reward;
  saveGame(save);
  return { reward, rewardAllowed: true, reason: "claimed", dailyCount: save.replayRewardedPuzzleIdsByDate[dateKey].length };
}

export function hasSeenGuide(guideId) {
  return loadSave()?.seenGuideIds?.includes(normalizeGuideId(guideId)) || false;
}

export function markGuideSeen(guideId) {
  const normalizedGuideId = normalizeGuideId(guideId);
  const save = loadSave() || createEmptySave();
  if (!save.seenGuideIds.includes(normalizedGuideId)) {
    save.seenGuideIds.push(normalizedGuideId);
    saveGame(save);
  }
}

export function isPackUnlocked(pack) {
  if (!pack || pack.access === "free" || Number(pack.unlockCost || 0) <= 0) {
    return true;
  }
  return getUnlockedPackIds().includes(pack.id);
}

export function canUnlockPack(pack) {
  return pack?.access !== "bonus-pack"
    && !isPackUnlocked(pack)
    && getPantrySpoons() >= Number(pack.unlockCost || 0)
    && getPackPantryRoomRequirement(pack).met;
}

export function unlockPack(pack) {
  if (!pack || isPackUnlocked(pack)) {
    return false;
  }

  const cost = Number(pack.unlockCost || 0);
  const save = loadSave() || createEmptySave();
  if (save.pantrySpoons < cost || !getPackPantryRoomRequirement(pack).met) {
    return false;
  }

  save.pantrySpoons -= cost;
  save.unlockedPackIds = Array.from(new Set([...save.unlockedPackIds, pack.id]));
  saveGame(save);
  return true;
}

export function resetProgress() {
  localStorage.removeItem(getActiveSaveKey());
}

export function getActivePlayer() {
  return readJson(ACTIVE_PLAYER_KEY, null);
}

export function getActivePlayerName() {
  return getActivePlayer()?.name || "";
}

export function hasActivePlayer() {
  return Boolean(getActivePlayer()?.id);
}

export function setActivePlayerName(name) {
  const cleanName = normalizePlayerName(name);
  const player = { id: createPlayerId(cleanName), name: cleanName };
  const existingSave = localStorage.getItem(SAVE_PREFIX + player.id);
  const legacySave = localStorage.getItem(LEGACY_SAVE_KEY);

  if (!existingSave && legacySave) {
    localStorage.setItem(SAVE_PREFIX + player.id, legacySave);
  }

  localStorage.setItem(ACTIVE_PLAYER_KEY, JSON.stringify(player));
  savePlayerRecord(player);
  return player;
}

export function getPlayerRecords() {
  const records = readJson(PLAYERS_KEY, []);
  return Array.isArray(records) ? records.filter((record) => record?.id && record?.name) : [];
}

function getActiveSaveKey() {
  const player = getActivePlayer();
  return player?.id ? SAVE_PREFIX + player.id : LEGACY_SAVE_KEY;
}

function savePlayerRecord(player) {
  const records = getPlayerRecords().filter((record) => record.id !== player.id);
  records.unshift(player);
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(records.slice(0, 8)));
}

function normalizeSave(parsed) {
  return {
    puzzleStates: parsed?.puzzleStates || {},
    completedPuzzleIds: Array.isArray(parsed?.completedPuzzleIds) ? parsed.completedPuzzleIds : [],
    rewardedPuzzleIds: Array.isArray(parsed?.rewardedPuzzleIds) ? parsed.rewardedPuzzleIds : [],
    dailyRewardedDates: Array.isArray(parsed?.dailyRewardedDates) ? parsed.dailyRewardedDates : [],
    completedPackIds: Array.isArray(parsed?.completedPackIds) ? parsed.completedPackIds : [],
    ownedDecorationIds: Array.isArray(parsed?.ownedDecorationIds) ? Array.from(new Set(parsed.ownedDecorationIds)) : [],
    equippedDecorations: parsed?.equippedDecorations && typeof parsed.equippedDecorations === "object" ? parsed.equippedDecorations : {},
    completionDates: parsed?.completionDates && typeof parsed.completionDates === "object" ? parsed.completionDates : {},
    unlockedPackIds: Array.isArray(parsed?.unlockedPackIds) && parsed.unlockedPackIds.length
      ? Array.from(new Set([STARTER_PACK_ID, ...parsed.unlockedPackIds]))
      : [STARTER_PACK_ID],
    pantrySpoons: Math.max(0, Number(parsed?.pantrySpoons || 0)),
    pantryStoryGoalId: parsed?.pantryStoryGoalId ? String(parsed.pantryStoryGoalId) : null,
    pantryCompletedStoryGoalIds: Array.isArray(parsed?.pantryCompletedStoryGoalIds) ? Array.from(new Set(parsed.pantryCompletedStoryGoalIds.map((id) => String(id || "")).filter(Boolean))) : [],
    timeAttackBestScores: parsed?.timeAttackBestScores && typeof parsed.timeAttackBestScores === "object" ? parsed.timeAttackBestScores : {},
    timeAttackDailyCount: pruneTimeAttackDailyCount(parsed?.timeAttackDailyCount),
    replayRewardedPuzzleIdsByDate: pruneReplayRewardedPuzzleIdsByDate(parsed?.replayRewardedPuzzleIdsByDate),
    seenGuideIds: Array.isArray(parsed?.seenGuideIds) ? Array.from(new Set(parsed.seenGuideIds.map(normalizeGuideId).filter(Boolean))) : [],
    cozyPassPurchased: Boolean(parsed?.cozyPassPurchased)
  };
}

function pruneReplayRewardedPuzzleIdsByDate(value, todayKey = getLocalDateKey()) {
  if (!value || typeof value !== "object") {
    return {};
  }

  const todayDay = dateKeyToUtcDay(todayKey);
  return Object.entries(value).reduce((kept, [dateKey, puzzleIds]) => {
    const entryDay = dateKeyToUtcDay(dateKey);
    const daysOld = todayDay - entryDay;
    if (Number.isFinite(daysOld) && daysOld >= 0 && daysOld < REPLAY_REWARD_RETENTION_DAYS && Array.isArray(puzzleIds)) {
      kept[dateKey] = Array.from(new Set(puzzleIds.map((id) => String(id || "")).filter(Boolean)));
    }
    return kept;
  }, {});
}

function pruneTimeAttackDailyCount(value, todayKey = getLocalDateKey()) {
  if (!value || typeof value !== "object") {
    return {};
  }

  const todayDay = dateKeyToUtcDay(todayKey);
  return Object.entries(value).reduce((kept, [dateKey, count]) => {
    const entryDay = dateKeyToUtcDay(dateKey);
    const daysOld = todayDay - entryDay;
    if (Number.isFinite(daysOld) && daysOld >= 0 && daysOld < TIME_ATTACK_DAILY_COUNT_RETENTION_DAYS) {
      kept[dateKey] = Math.max(0, Number(count) || 0);
    }
    return kept;
  }, {});
}

function dateKeyToUtcDay(dateKey) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateKey || ""));
  if (!match) {
    return Number.NaN;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const time = Date.UTC(year, month - 1, day);
  if (!Number.isFinite(time)) {
    return Number.NaN;
  }
  return Math.floor(time / 86400000);
}

function normalizeDecorationId(decorationOrId) {
  const decorationId = typeof decorationOrId === "string" ? decorationOrId : decorationOrId?.id;
  return decorationId ? String(decorationId) : null;
}

function completePantryStoryGoalIfMatched(save, decoration) {
  if (save.pantryStoryGoalId !== decoration.id) {
    return;
  }

  save.pantryStoryGoalId = null;
  save.pantryCompletedStoryGoalIds = Array.from(new Set([...save.pantryCompletedStoryGoalIds, decoration.id]));
}

function normalizeGuideId(guideId) {
  const value = String(guideId || "");
  return GUIDE_IDS.has(value) ? value : "puzzle";
}

function createEmptySave() {
  return normalizeSave({});
}

function normalizePlayerName(name) {
  const trimmed = String(name || "").trim().replace(/\s+/g, " ").slice(0, 18);
  return trimmed || DEFAULT_PLAYER_NAME;
}

function createPlayerId(name) {
  const normalized = name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized || "friend";
}

function readJson(key, fallback) {
  try {
    const payload = localStorage.getItem(key);
    return payload ? JSON.parse(payload) : fallback;
  } catch {
    return fallback;
  }
}

function getLocalDateKey(now = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}
