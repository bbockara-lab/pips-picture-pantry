import { restoreState, serializeState } from "./puzzleState.js";

const LEGACY_SAVE_KEY = "pips-picture-pantry:v0.1:save";
const SAVE_PREFIX = "pips-picture-pantry:v0.1:save:";
const ACTIVE_PLAYER_KEY = "pips-picture-pantry:v0.1:active-player";
const PLAYERS_KEY = "pips-picture-pantry:v0.1:players";
const DEFAULT_PLAYER_NAME = "Friend";
const STARTER_PACK_ID = "pips-first-shelf";

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

export function getUnlockedPackIds() {
  return loadSave()?.unlockedPackIds || [STARTER_PACK_ID];
}

export function isPackUnlocked(pack) {
  if (!pack || pack.access === "free" || Number(pack.unlockCost || 0) <= 0) {
    return true;
  }
  return getUnlockedPackIds().includes(pack.id);
}

export function canUnlockPack(pack) {
  return !isPackUnlocked(pack) && getPantrySpoons() >= Number(pack.unlockCost || 0);
}

export function unlockPack(pack) {
  if (!pack || isPackUnlocked(pack)) {
    return false;
  }

  const cost = Number(pack.unlockCost || 0);
  const save = loadSave() || createEmptySave();
  if (save.pantrySpoons < cost) {
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
    unlockedPackIds: Array.isArray(parsed?.unlockedPackIds) && parsed.unlockedPackIds.length
      ? Array.from(new Set([STARTER_PACK_ID, ...parsed.unlockedPackIds]))
      : [STARTER_PACK_ID],
    pantrySpoons: Math.max(0, Number(parsed?.pantrySpoons || 0))
  };
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
