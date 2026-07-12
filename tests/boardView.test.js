import { describe, expect, it } from "vitest";
import { CELL } from "../src/game/nonogram.js";
import { getCellPaintValue } from "../src/ui/boardView.js";

describe("board view paint decisions", () => {
  it("turns a safe suggestion tap into a mark instead of a wrong fill", () => {
    expect(getCellPaintValue(CELL.empty, "fill", { safeSuggestion: true })).toBe(CELL.marked);
  });

  it("keeps normal fill-mode toggles unchanged", () => {
    expect(getCellPaintValue(CELL.empty, "fill")).toBe(CELL.filled);
    expect(getCellPaintValue(CELL.filled, "fill")).toBe(CELL.empty);
  });
});