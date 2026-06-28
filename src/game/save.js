import { restoreState, serializeState } from "./puzzleState.js";

const SAVE_KEY = "pips-picture-pantry:v0.1:save";

export function loadSave() {
  const payload = localStorage.getItem(SAVE_KEY);
  if (!payload) {
    return null;
  }

  try {
    const parsed = JSON.parse(payload);
    return {
      puzzleStates: parsed.puzzleStates || {},
      completedPuzzleIds: Array.isArray(parsed.completedPuzzleIds) ? parsed.completedPuzzleIds : []
    };
  } catch {
    return null;
  }
}

export function saveGame(data) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

export function loadPuzzleState(puzzleId) {
  const save = loadSave();
  return restoreState(save?.puzzleStates?.[puzzleId] || null);
}

export function savePuzzleState(state) {
  const save = loadSave() || { puzzleStates: {}, completedPuzzleIds: [] };
  save.puzzleStates[state.puzzleId] = serializeState(state);

  if (state.completed && !save.completedPuzzleIds.includes(state.puzzleId)) {
    save.completedPuzzleIds.push(state.puzzleId);
  }

  saveGame(save);
}

export function getCompletedPuzzleIds() {
  return loadSave()?.completedPuzzleIds || [];
}

export function resetProgress() {
  localStorage.removeItem(SAVE_KEY);
}
