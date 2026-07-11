import { countCorrectCells } from "../game/nonogram.js";
import { createTimeAttackRun, getTimeAttackRunScore } from "../game/randomPuzzle.js";
import { recordTimeAttackResult } from "../game/save.js";

export const TIME_ATTACK_TRIAL_ROUNDS = 3;
export const TIME_ATTACK_LIMIT_SECONDS = 180;

export function createTimeAttackSession({ currentPuzzle, rounds = TIME_ATTACK_TRIAL_ROUNDS, now = Date.now() } = {}) {
  const seed = now.toString(36);
  const run = createTimeAttackRun({ seed, rounds });
  return {
    seed,
    run,
    startedAt: now,
    roundIndex: 0,
    activePuzzle: run[0] || currentPuzzle,
    lastResult: null
  };
}

export function advanceTimeAttackSession({ run, seed, startedAt, roundIndex, puzzle, puzzleState, previousHintsUsed = 0 } = {}) {
  if (!run?.length) {
    return { status: "closed" };
  }

  const nextIndex = Math.max(0, Number(roundIndex) || 0) + 1;
  if (nextIndex < run.length) {
    return {
      status: "next-round",
      roundIndex: nextIndex,
      activePuzzle: run[nextIndex]
    };
  }

  return finishTimeAttackSession({
    run,
    seed,
    startedAt,
    roundIndex,
    puzzle,
    puzzleState,
    previousHintsUsed,
    completedRounds: run.length,
    outcome: "complete"
  });
}

export function finishTimeAttackSession({
  run,
  seed,
  startedAt,
  roundIndex = 0,
  puzzle,
  puzzleState,
  previousHintsUsed = 0,
  completedRounds = 0,
  outcome = "complete"
} = {}) {
  if (!run?.length) {
    return { status: "closed" };
  }

  const elapsedSeconds = getTimeAttackElapsedSeconds(startedAt);
  const progress = getTimeAttackProgress({ run, roundIndex, puzzle, puzzleState });
  const hintsUsed = Math.max(0, Number(previousHintsUsed || 0)) + Math.max(0, Number(puzzleState?.hintsUsed || 0));
  const status = outcome === "timeout" ? "timeout" : "complete";
  const result = recordTimeAttackResult({
    size: getTimeAttackRunRecordSize(run, puzzle, roundIndex),
    score: getTimeAttackRunScore({ progressCells: progress.progressCells, elapsedSeconds, hintsUsed }),
    seed,
    completedRounds,
    elapsedSeconds,
    progressCells: progress.progressCells,
    currentRoundCorrectCells: progress.currentRoundCorrectCells,
    currentRoundTotalCells: progress.currentRoundTotalCells,
    currentRoundNumber: progress.currentRoundNumber,
    hintsUsed,
    outcome: status
  });

  return {
    status,
    elapsedSeconds,
    result
  };
}

export function getTimeAttackElapsedSeconds(startedAt) {
  if (!startedAt) return 0;
  return Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
}

export function getTimeAttackProgress({ run, roundIndex = 0, puzzle, puzzleState } = {}) {
  const safeRun = Array.isArray(run) ? run : [];
  const currentIndex = Math.max(0, Math.floor(Number(roundIndex) || 0));
  const completedBefore = safeRun.slice(0, currentIndex).reduce((total, entry) => {
    const size = Math.max(0, Number(entry?.size || 0));
    return total + size * size;
  }, 0);
  const currentPuzzle = puzzle || safeRun[currentIndex];
  const currentRoundCorrectCells = countCorrectCells(puzzleState, currentPuzzle?.solution || []);
  const currentRoundTotalCells = Math.max(0, Number(currentPuzzle?.size || 0) ** 2);
  return {
    completedBefore,
    currentRoundCorrectCells,
    currentRoundTotalCells,
    currentRoundNumber: currentIndex + 1,
    progressCells: completedBefore + currentRoundCorrectCells
  };
}

function getTimeAttackRunRecordSize(run, puzzle, roundIndex = 0) {
  const currentIndex = Math.max(0, Math.floor(Number(roundIndex) || 0));
  const reachedRun = Array.isArray(run) ? run.slice(0, currentIndex + 1) : [];
  const runSizes = reachedRun.map((entry) => Number(entry?.size || 0)).filter(Boolean);
  return Math.max(...runSizes, Number(puzzle?.size || 0), 5);
}
