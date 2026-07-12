import { describe, expect, it } from "vitest";
import { CELL } from "../src/game/nonogram.js";
import { getCellPaintValue, getDragCellPaintValue, getLineGuidance, isLineCorrectlySatisfied } from "../src/ui/boardView.js";

describe("board view paint decisions", () => {
  it("turns a safe suggestion tap into a mark instead of a wrong fill", () => {
    expect(getCellPaintValue(CELL.empty, "fill", { safeSuggestion: true })).toBe(CELL.marked);
  });

  it("keeps normal fill-mode toggles unchanged", () => {
    expect(getCellPaintValue(CELL.empty, "fill")).toBe(CELL.filled);
    expect(getCellPaintValue(CELL.filled, "fill")).toBe(CELL.empty);
  });

  it("protects safe suggestions without changing the drag stroke value", () => {
    const safeButton = { classList: { contains: (className) => className === "safe-suggestion" } };
    const normalButton = { classList: { contains: () => false } };

    expect(getDragCellPaintValue(safeButton, CELL.empty)).toBe(CELL.marked);
    expect(getDragCellPaintValue(normalButton, CELL.empty)).toBe(CELL.empty);
    expect(getDragCellPaintValue(normalButton, CELL.filled)).toBe(CELL.filled);
  });

  it("treats zero-clue lines as satisfied when they contain no fills", () => {
    expect(isLineCorrectlySatisfied([CELL.empty, CELL.marked, CELL.empty], [false, false, false])).toBe(true);
    expect(isLineCorrectlySatisfied([CELL.empty, CELL.filled, CELL.empty], [false, false, false])).toBe(false);
  });

  it("finds only truly completed rows and columns for board guidance", () => {
    const puzzle = {
      size: 3,
      solution: [
        [true, true, false],
        [false, false, false],
        [true, false, true]
      ]
    };
    const state = {
      cells: [
        [CELL.filled, CELL.filled, CELL.empty],
        [CELL.empty, CELL.marked, CELL.empty],
        [CELL.filled, CELL.empty, CELL.empty]
      ]
    };

    const guidance = getLineGuidance(puzzle, state);

    expect([...guidance.completedRows]).toEqual([0, 1]);
    expect([...guidance.completedColumns]).toEqual([0, 1]);
    expect(guidance.completedRows.has(2)).toBe(false);
    expect(guidance.completedColumns.has(2)).toBe(false);
  });

  it("turns completed-line guidance off for locked boards", () => {
    const puzzle = {
      size: 2,
      solution: [
        [true, false],
        [false, false]
      ]
    };
    const state = {
      cells: [
        [CELL.filled, CELL.empty],
        [CELL.empty, CELL.empty]
      ]
    };

    const guidance = getLineGuidance(puzzle, state, { locked: true });

    expect(guidance.completedRows.size).toBe(0);
    expect(guidance.completedColumns.size).toBe(0);
  });
});
