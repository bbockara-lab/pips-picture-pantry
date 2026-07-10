import { countMistakes } from "./nonogram.js";

export function createReplayCleanStatus() {
  return { hadMistake: false, usedHint: false };
}

export function updateReplayCleanStatus(status = createReplayCleanStatus(), state, solutionGrid) {
  return {
    hadMistake: Boolean(status.hadMistake) || countMistakes(state, solutionGrid) > 0,
    usedHint: Boolean(status.usedHint) || Math.max(0, Number(state?.hintsUsed || 0)) > 0
  };
}

export function isReplayClean(status = createReplayCleanStatus()) {
  return !status.hadMistake && !status.usedHint;
}
