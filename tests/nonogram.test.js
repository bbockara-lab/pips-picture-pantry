import { describe, expect, it } from "vitest";
import { computeClues, countMistakes, isSolved } from "../src/game/nonogram.js";

describe("nonogram logic", () => {
  it("computes row and column clues", () => {
    const clues = computeClues(["01110", "11111", "10101", "11111", "01110"]);

    expect(clues.rows).toEqual([[3], [5], [1, 1, 1], [5], [3]]);
    expect(clues.columns).toEqual([[3], [2, 2], [5], [2, 2], [3]]);
  });

  it("uses 0 for empty clue lines", () => {
    const clues = computeClues(["000", "010", "000"]);

    expect(clues.rows).toEqual([[0], [1], [0]]);
    expect(clues.columns).toEqual([[0], [1], [0]]);
  });

  it("detects solved boards without requiring marks on empty cells", () => {
    const state = {
      cells: [
        ["empty", "filled", "empty"],
        ["filled", "filled", "filled"],
        ["empty", "filled", "empty"]
      ]
    };

    expect(isSolved(state, ["010", "111", "010"])).toBe(true);
  });

  it("counts filled cells that should be empty as mistakes", () => {
    const state = {
      cells: [
        ["filled", "filled", "empty"],
        ["filled", "filled", "filled"],
        ["empty", "filled", "filled"]
      ]
    };

    expect(countMistakes(state, ["010", "111", "010"])).toBe(2);
  });
});
