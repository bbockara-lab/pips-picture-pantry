import { describe, expect, it } from "vitest";
import {
  applyCompletedLineMarks,
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
  it("allows a drag stroke to carry per-cell target values", () => {
    let state = createPuzzleState(puzzle);
    state = paintCells(state, [
      { row: 0, column: 0 },
      { row: 0, column: 1, next: "marked" }
    ], "filled");

    expect(state.cells[0][0]).toBe("filled");
    expect(state.cells[0][1]).toBe("marked");
    expect(state.history[0].cells).toHaveLength(2);
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
    expect(state.paidHintsUsed).toBe(0);

    state = undoLastMove(state);
    expect(state.cells[0][1]).toBe("empty");
    expect(state.hintsUsed).toBe(1);
  });

  it("uses a hint to correct a wrong filled cell before adding safe marks", () => {
    const hintPuzzle = { id: "hint-correction-puzzle", size: 3 };
    const solution = [
      [false, false, false],
      [false, true, false],
      [false, false, false]
    ];
    let state = createPuzzleState(hintPuzzle);

    state = toggleCell(state, 0, 0, "fill");
    state = useHint(state, solution);

    expect(state.cells[0][0]).toBe("marked");
    expect(state.hintsUsed).toBe(1);
    expect(state.history[state.history.length - 1].hint).toBe(true);
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

  it("tracks paid hint uses separately from free hint uses", () => {
    const paidHintPuzzle = { id: "paid-hint-puzzle", size: 3 };
    const solution = [
      [true, true, true],
      [false, false, false],
      [false, false, false]
    ];
    let state = createPuzzleState(paidHintPuzzle);

    state = useHint(state, solution, { revealCount: 1 });
    state = useHint(state, solution, { revealCount: 1, paid: true });

    expect(state.hintsUsed).toBe(2);
    expect(state.paidHintsUsed).toBe(1);

    state = undoLastMove(state);
    expect(state.hintsUsed).toBe(2);
    expect(state.paidHintsUsed).toBe(1);
  });


  it("auto-marks blank cells only on correctly completed lines and undoes them with the move", () => {
    const linePuzzle = { id: "line-mark-puzzle", size: 3 };
    const solution = [
      [true, true, false],
      [false, false, false],
      [false, false, false]
    ];
    let state = createPuzzleState(linePuzzle);

    state = toggleCell(state, 0, 0, "fill");
    state = toggleCell(state, 0, 1, "fill");
    state = applyCompletedLineMarks(state, solution);

    expect(state.cells[0]).toEqual(["filled", "filled", "marked"]);
    expect(state.history[state.history.length - 1].cells).toEqual(expect.arrayContaining([
      expect.objectContaining({ row: 0, column: 1, next: "filled" }),
      expect.objectContaining({ row: 0, column: 2, next: "marked", autoLineMark: true })
    ]));

    state = undoLastMove(state);
    expect(state.cells[0]).toEqual(["filled", "empty", "empty"]);
  });

  it("does not auto-mark blanks when the filled cells are in the wrong place", () => {
    const linePuzzle = { id: "wrong-line-mark-puzzle", size: 3 };
    const solution = [
      [true, false, true],
      [false, false, false],
      [false, false, false]
    ];
    let state = createPuzzleState(linePuzzle);

    state = toggleCell(state, 0, 0, "fill");
    state = toggleCell(state, 0, 1, "fill");
    state = applyCompletedLineMarks(state, solution);

    expect(state.cells[0]).toEqual(["filled", "filled", "empty"]);
  });

  it("does not auto-mark all-blank clue lines at the start of a puzzle", () => {
    const blankLinePuzzle = { id: "blank-line-puzzle", size: 3 };
    const solution = [
      [false, false, false],
      [false, true, false],
      [false, false, false]
    ];
    let state = createPuzzleState(blankLinePuzzle);

    state = toggleCell(state, 1, 1, "fill");
    state = applyCompletedLineMarks(state, solution);

    expect(state.cells[0]).toEqual(["empty", "marked", "empty"]);
    expect(state.cells[2]).toEqual(["empty", "marked", "empty"]);
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
    expect(restored.paidHintsUsed).toBe(0);
  });

  it("normalizes unknown or empty cell values to empty when restoring a damaged save", () => {
    const damaged = JSON.stringify({
      puzzleId: "test-puzzle",
      mode: "fill",
      cursor: { row: 0, column: 0 },
      cells: [
        ["filled", "", null],
        ["marked", "UNKNOWN", undefined],
        ["empty", "empty", "empty"]
      ],
      history: [],
      hintsUsed: 0,
      paidHintsUsed: 0,
      completed: false
    });

    const restored = restoreState(damaged);
    expect(restored.cells[0]).toEqual(["filled", "empty", "empty"]);
    expect(restored.cells[1]).toEqual(["marked", "empty", "empty"]);
    expect(restored.cells[2]).toEqual(["empty", "empty", "empty"]);
  });

  it("undoes correctly after restoring a damaged save with normalized cells", () => {
    const damaged = JSON.stringify({
      puzzleId: "test-puzzle",
      mode: "fill",
      cursor: { row: 0, column: 0 },
      cells: [["filled", "", "empty"], ["empty", "empty", "empty"], ["empty", "empty", "empty"]],
      history: [{ row: 0, column: 0, previous: "empty", next: "filled" }],
      hintsUsed: 0,
      paidHintsUsed: 0,
      completed: false
    });

    let state = restoreState(damaged);
    state = undoLastMove(state);
    expect(state.cells[0][0]).toBe("empty");
    expect(state.history).toHaveLength(0);
  });
});
