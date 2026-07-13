import { describe, expect, it, afterEach } from "vitest";
import { CELL } from "../src/game/nonogram.js";
import { createPuzzleState, setCursor, toggleCell } from "../src/game/puzzleState.js";
import { setActiveLocale } from "../src/i18n/index.js";
import { getCursorActionDescriptors, getCursorActionLabels, getSelectedCursorCell } from "../src/ui/puzzleCursorControls.js";

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


