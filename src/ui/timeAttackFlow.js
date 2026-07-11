import { createTimeAttackRun, getTimeAttackRunScore } from "../game/randomPuzzle.js";
import { recordTimeAttackResult } from "../game/save.js";

export const TIME_ATTACK_TRIAL_ROUNDS = 3;

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

export function advanceTimeAttackSession({ run, seed, startedAt, roundIndex, puzzle } = {}) {
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

  const elapsedSeconds = getTimeAttackElapsedSeconds(startedAt);
  const result = recordTimeAttackResult({
    size: getTimeAttackRunRecordSize(run, puzzle),
    score: getTimeAttackRunScore({ completedRounds: run.length, elapsedSeconds }),
    seed,
    completedRounds: run.length,
    elapsedSeconds
  });

  return {
    status: "complete",
    elapsedSeconds,
    result
  };
}

export function getTimeAttackElapsedSeconds(startedAt) {
  if (!startedAt) return 0;
  return Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
}

function getTimeAttackRunRecordSize(run, puzzle) {
  const runSizes = Array.isArray(run) ? run.map((entry) => Number(entry?.size || 0)).filter(Boolean) : [];
  return Math.max(...runSizes, Number(puzzle?.size || 0), 5);
}
