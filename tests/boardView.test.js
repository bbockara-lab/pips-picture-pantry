import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CELL } from "../src/game/nonogram.js";
import { getBoardGuideInterval, getCellPaintValue, getDragCellPaintValue, getLineGuidance, isLineCorrectlySatisfied, shouldSuppressPointerClick } from "../src/ui/boardView.js";

const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
const boardSource = readFileSync(new URL("../src/ui/boardView.js", import.meta.url), "utf8");

describe("board view paint decisions", () => {
  it("centers marked and safe-suggestion glyphs in their cells", () => {
    expect(styles).toMatch(
      /\.puzzle-cell\.marked,\s*\.puzzle-cell\.safe-suggestion\s*\{[\s\S]*?display:\s*grid\s*!important;[\s\S]*?place-items:\s*center\s*!important;/
    );
  });
  it("adds guide intervals only where larger boards benefit from them", () => {
    expect(getBoardGuideInterval(5)).toBe(0);
    expect(getBoardGuideInterval(8)).toBe(4);
    expect(getBoardGuideInterval(10)).toBe(5);
    expect(getBoardGuideInterval(12)).toBe(4);
  });

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

  it("keeps delayed-click suppression alive across board re-renders", () => {
    expect(boardSource).toMatch(/let suppressPointerClickUntil = 0;[\s\S]*?function renderCells/);
    expect(boardSource).not.toMatch(/function renderCells[\s\S]*?let suppressPointerClickUntil = 0;/);
  });

  it("suppresses the delayed pointer click after a completed touch stroke", () => {
    expect(shouldSuppressPointerClick(1750, { detail: 1 }, 1200)).toBe(true);
    expect(shouldSuppressPointerClick(1750, { detail: 0 }, 1200)).toBe(true);
    expect(shouldSuppressPointerClick(1750, { detail: 1 }, 1800)).toBe(false);
    expect(shouldSuppressPointerClick(1750, { detail: 0 }, 1800)).toBe(false);
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
