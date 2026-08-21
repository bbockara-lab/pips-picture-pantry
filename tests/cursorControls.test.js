import { describe, expect, it, afterEach } from "vitest";
import { CELL } from "../src/game/nonogram.js";
import { createPuzzleState, setCursor, toggleCell } from "../src/game/puzzleState.js";
import { setActiveLocale } from "../src/i18n/index.js";
import {
  applyCursorAction,
  createCursorControlSession,
  getCursorActionDescriptors,
  getCursorActionLabels,
  getSelectedCursorCell,
  moveSelectedCell,
  shouldShowCursorControls
} from "../src/ui/puzzleCursorControls.js";

const puzzle = { id: "cursor-label-puzzle", size: 3 };

describe("cursor control action labels", () => {
  afterEach(() => {
    setActiveLocale("en");
  });

  it("labels an empty selected cell as color or blank check", () => {
    const state = createPuzzleState(puzzle);

    expect(getSelectedCursorCell(state)).toBe(CELL.empty);
    expect(getCursorActionLabels(state)).toEqual({ fill: "Color", mark: "Blank" });
    expect(getCursorActionDescriptors(state).fill.intent).toBe("fill");
    expect(getCursorActionDescriptors(state).mark.intent).toBe("mark");
  });

  it("labels a filled selected cell as a clear-color action", () => {
    let state = createPuzzleState(puzzle);
    state = toggleCell(state, 0, 0, "fill");

    expect(getSelectedCursorCell(state)).toBe(CELL.filled);
    expect(getCursorActionLabels(state).fill).toBe("Clear Color");
    expect(getCursorActionDescriptors(state).fill.intent).toBe("clear-fill");
  });

  it("labels a marked selected cell as a clear-X action", () => {
    let state = createPuzzleState(puzzle);
    state = setCursor(state, 1, 1, puzzle.size);
    state = toggleCell(state, 1, 1, "mark");

    expect(getSelectedCursorCell(state)).toBe(CELL.marked);
    expect(getCursorActionLabels(state).mark).toBe("Clear X");
    expect(getCursorActionDescriptors(state).mark.intent).toBe("clear-mark");
  });

  it("keeps Korean clear-action labels readable", () => {
    setActiveLocale("ko");
    let state = createPuzzleState(puzzle);
    state = toggleCell(state, 0, 0, "fill");

    expect(getCursorActionLabels(state).fill).toBe("\uc0c9 \uc9c0\uc6b0\uae30");
  });
});

describe("automatic large-board controls", () => {
  it("keeps 5×5 direct and enables the D-pad from 8×8", () => {
    expect(shouldShowCursorControls({ size: 5 }, "auto")).toBe(false);
    expect(shouldShowCursorControls({ size: 8 }, "auto")).toBe(true);
    expect(shouldShowCursorControls({ size: 12 }, "auto")).toBe(true);
  });

  it("respects explicit tap and cursor preferences", () => {
    expect(shouldShowCursorControls({ size: 12 }, "direct")).toBe(false);
    expect(shouldShowCursorControls({ size: 5 }, "cursor")).toBe(true);
  });
});

describe("continuous cursor painting", () => {
  it("paints along the route with the selected brush and keeps move-only available", () => {
    let state = createPuzzleState(puzzle);
    const session = createCursorControlSession(state);
    const update = (next) => {
      state = next;
    };

    applyCursorAction(state, "fill", update, session);
    moveSelectedCell(state, 0, 1, puzzle.size, update, session);
    moveSelectedCell(state, 1, 0, puzzle.size, update, session);

    expect(state.cells[0][0]).toBe(CELL.filled);
    expect(state.cells[0][1]).toBe(CELL.filled);
    expect(state.cells[1][1]).toBe(CELL.filled);

    applyCursorAction(state, "mark", update, session);
    moveSelectedCell(state, 0, 1, puzzle.size, update, session);
    expect(state.cells[1][2]).toBe(CELL.marked);

    session.trailEnabled = false;
    moveSelectedCell(state, 1, 0, puzzle.size, update, session);
    expect(state.cursor).toEqual({ row: 2, column: 2 });
    expect(state.cells[2][2]).toBe(CELL.empty);
  });
});


