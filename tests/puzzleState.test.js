import { describe, expect, it } from "vitest";
import {
  createPuzzleState,
  restoreState,
  serializeState,
  setMode,
  toggleCell,
  undoLastMove
} from "../src/game/puzzleState.js";

const puzzle = {
  id: "test-puzzle",
  size: 3
};

describe("puzzle state", () => {
  it("creates an empty puzzle state", () => {
    const state = createPuzzleState(puzzle);

    expect(state.puzzleId).toBe("test-puzzle");
    expect(state.mode).toBe("fill");
    expect(state.cells).toHaveLength(3);
    expect(state.cells[0]).toEqual(["empty", "empty", "empty"]);
  });

  it("toggles cells using fill and mark modes", () => {
    let state = createPuzzleState(puzzle);

    state = toggleCell(state, 1, 1, "fill");
    expect(state.cells[1][1]).toBe("filled");

    state = setMode(state, "mark");
    state = toggleCell(state, 0, 0);
    expect(state.cells[0][0]).toBe("marked");
  });

  it("undoes the latest move", () => {
    let state = createPuzzleState(puzzle);
    state = toggleCell(state, 1, 1, "fill");
    state = undoLastMove(state);

    expect(state.cells[1][1]).toBe("empty");
    expect(state.history).toHaveLength(0);
  });

  it("serializes and restores state", () => {
    let state = createPuzzleState(puzzle);
    state = toggleCell(state, 2, 2, "fill");

    const restored = restoreState(serializeState(state));
    expect(restored.puzzleId).toBe("test-puzzle");
    expect(restored.cells[2][2]).toBe("filled");
  });
});
