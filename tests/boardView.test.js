import { describe, expect, it } from "vitest";
import { CELL } from "../src/game/nonogram.js";
import { getCellPaintValue, getCellValueFromButton, isLineCorrectlySatisfied } from "../src/ui/boardView.js";

describe("board view paint decisions", () => {
  it("turns a safe suggestion tap into a mark instead of a wrong fill", () => {
    expect(getCellPaintValue(CELL.empty, "fill", { safeSuggestion: true })).toBe(CELL.marked);
  });

  it("keeps normal fill-mode toggles unchanged", () => {
    expect(getCellPaintValue(CELL.empty, "fill")).toBe(CELL.filled);
    expect(getCellPaintValue(CELL.filled, "fill")).toBe(CELL.empty);
  });

  it("reads cell value from button classes", () => {
    const button = { classList: { contains: (className) => className === CELL.filled } };
    expect(getCellValueFromButton(button)).toBe(CELL.filled);
  });

  it("treats zero-clue lines as satisfied when they contain no fills", () => {
    expect(isLineCorrectlySatisfied([CELL.empty, CELL.marked, CELL.empty], [false, false, false])).toBe(true);
    expect(isLineCorrectlySatisfied([CELL.empty, CELL.filled, CELL.empty], [false, false, false])).toBe(false);
  });
});