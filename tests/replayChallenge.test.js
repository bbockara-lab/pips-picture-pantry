import { beforeEach, describe, expect, it } from "vitest";
import { recordReplayReward, getPantrySpoons, setActivePlayerName, saveGame, loadSave } from "../src/game/save.js";
import { CELL } from "../src/game/nonogram.js";
import { createPuzzleState, toggleCell, undoLastMove, useHint } from "../src/game/puzzleState.js";
import { createReplayCleanStatus, isReplayClean, updateReplayCleanStatus } from "../src/game/replayChallenge.js";
import { getReplayCleanStatusAfterState } from "../src/ui/puzzleView.js";

class LocalStorageMock {
  constructor() { this.store = new Map(); }
  getItem(key) { return this.store.has(key) ? this.store.get(key) : null; }
  setItem(key, value) { this.store.set(key, String(value)); }
  removeItem(key) { this.store.delete(key); }
  clear() { this.store.clear(); }
}

const replayPuzzle = { id: "pips-first-shelf-pip-face-1", size: 3 };
const solution = ["010", "111", "010"];

describe("replay challenge reward guard", () => {
  beforeEach(() => {
    globalThis.localStorage = new LocalStorageMock();
    setActivePlayerName("Jay");
    saveGame({ ...loadSave(), completedPuzzleIds: ["pips-first-shelf-pip-face-1"], pantrySpoons: 3 });
  });

  it("rewards only picked clean replay completions", () => {
    expect(recordReplayReward({ puzzleId: "pips-first-shelf-pip-face-1", picked: true, clean: true, dateKey: "2026-07-06" })).toMatchObject({ rewardAllowed: true, reward: 1 });
    expect(getPantrySpoons()).toBe(4);
    expect(recordReplayReward({ puzzleId: "pips-first-shelf-pip-face-1", picked: true, clean: true, dateKey: "2026-07-06" })).toMatchObject({ rewardAllowed: false, reason: "already-claimed" });
  });

  it("keeps replay unclean after a wrong fill is undone", () => {
    let state = createPuzzleState(replayPuzzle);
    let status = createReplayCleanStatus();

    state = toggleCell(state, 0, 0, "fill");
    status = updateReplayCleanStatus(status, state, solution);
    expect(isReplayClean(status)).toBe(false);

    state = undoLastMove(state);
    expect(state.cells[0][0]).toBe(CELL.empty);
    status = updateReplayCleanStatus(status, state, solution);
    expect(isReplayClean(status)).toBe(false);
  });

  it("keeps replay unclean when a final hint completes the puzzle", () => {
    let state = createPuzzleState(replayPuzzle);
    let status = createReplayCleanStatus();

    state = useHint(state, solution, { revealCount: 5 });
    state = { ...state, completed: true };
    status = getReplayCleanStatusAfterState(true, status, state, solution);

    expect(state.hintsUsed).toBe(1);
    expect(isReplayClean(status)).toBe(false);
  });

  it("blocks replay spoon rewards after a hinted completion", () => {
    let state = createPuzzleState(replayPuzzle);
    let status = createReplayCleanStatus();

    state = useHint(state, solution, { revealCount: 5 });
    state = { ...state, completed: true };
    status = getReplayCleanStatusAfterState(true, status, state, solution);

    const result = recordReplayReward({
      puzzleId: replayPuzzle.id,
      picked: true,
      clean: isReplayClean(status),
      dateKey: "2026-07-07"
    });

    expect(result).toMatchObject({ rewardAllowed: false, reason: "not-eligible" });
    expect(getPantrySpoons()).toBe(3);
  });

  it("keeps replay unclean after a hint is undone", () => {
    let state = createPuzzleState(replayPuzzle);
    let status = createReplayCleanStatus();

    state = useHint(state, solution);
    status = updateReplayCleanStatus(status, state, solution);
    expect(isReplayClean(status)).toBe(false);

    state = undoLastMove(state);
    expect(state.hintsUsed).toBe(1);
    status = updateReplayCleanStatus(status, state, solution);
    expect(isReplayClean(status)).toBe(false);
  });
});
