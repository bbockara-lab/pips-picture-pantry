import { describe, expect, it } from "vitest";
import {
  createPuzzleState,
  moveCursor,
  paintCells,
  restoreState,
  serializeState,
  setMode,
  setCursor,
  toggleCell,
  toggleCursorCell,
  undoLastMove,
  useHint
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
  it("paints a dragged stroke and undoes it as one move", () => {
    let state = createPuzzleState(puzzle);
    state = paintCells(state, [
      { row: 0, column: 0 },
      { row: 0, column: 1 },
      { row: 0, column: 2 }
    ], "filled");

    expect(state.cells[0]).toEqual(["filled", "filled", "filled"]);
    expect(state.history).toHaveLength(1);
    expect(state.history[0].cells).toHaveLength(3);

    state = undoLastMove(state);
    expect(state.cells[0]).toEqual(["empty", "empty", "empty"]);
    expect(state.history).toHaveLength(0);
  });

  it("moves and clamps the cursor", () => {
    let state = createPuzzleState(puzzle);

    state = setCursor(state, 2, 2, puzzle.size);
    expect(state.cursor).toEqual({ row: 2, column: 2 });

    state = moveCursor(state, 1, 1, puzzle.size);
    expect(state.cursor).toEqual({ row: 2, column: 2 });

    state = moveCursor(state, -2, -1, puzzle.size);
    expect(state.cursor).toEqual({ row: 0, column: 1 });
  });

  it("toggles the selected cursor cell", () => {
    let state = createPuzzleState(puzzle);
    state = setCursor(state, 2, 1, puzzle.size);
    state = toggleCursorCell(state, "mark");

    expect(state.cells[2][1]).toBe("marked");
  });


  it("uses a hint on an unresolved correct cell and keeps the hint count after undo", () => {
    const hintPuzzle = { id: "hint-puzzle", size: 3 };
    const solution = [
      [false, true, false],
      [false, false, false],
      [false, false, false]
    ];
    let state = createPuzzleState(hintPuzzle);

    state = useHint(state, solution);
    expect(state.cells[0][1]).toBe("filled");
    expect(state.hintsUsed).toBe(1);

    state = undoLastMove(state);
    expect(state.cells[0][1]).toBe("empty");
    expect(state.hintsUsed).toBe(1);
  });

  it("reveals multiple sure cells with one size-aware hint history entry", () => {
    const hintPuzzle = { id: "large-hint-puzzle", size: 3 };
    const solution = [
      [true, true, true],
      [false, false, false],
      [false, false, false]
    ];
    let state = createPuzzleState(hintPuzzle);

    state = useHint(state, solution, { revealCount: 3 });
    expect(state.cells[0]).toEqual(["filled", "filled", "filled"]);
    expect(state.hintsUsed).toBe(1);
    expect(state.history).toHaveLength(1);
    expect(state.history[0].hint).toBe(true);
    expect(state.history[0].cells).toHaveLength(3);

    state = undoLastMove(state);
    expect(state.cells[0]).toEqual(["empty", "empty", "empty"]);
    expect(state.hintsUsed).toBe(1);
  });

  it("serializes and restores state", () => {
    let state = createPuzzleState(puzzle);
    state = toggleCell(state, 2, 2, "fill");
    state = useHint(state, [[false, false, false], [false, false, false], [false, false, true]]);

    const restored = restoreState(serializeState(state));
    expect(restored.puzzleId).toBe("test-puzzle");
    expect(restored.cells[2][2]).toBe("filled");
    expect(restored.cursor).toEqual({ row: 0, column: 0 });
    expect(restored.hintsUsed).toBe(1);
  });
});
