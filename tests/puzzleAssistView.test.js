import { describe, expect, it } from "vitest";
import { getHintTitleText } from "../src/ui/puzzleAssistView.js";

describe("puzzle assist hint copy", () => {
  it("separates free, paid, and time attack hint titles", () => {
    expect(getHintTitleText({ remaining: 1, hintLimit: 3, hintCost: 0 })).toBe("Hints 1/3");
    expect(getHintTitleText({ remaining: 0, hintLimit: 3, hintCost: 6 })).toBe("Extra hint");
    expect(getHintTitleText({ remaining: 0, hintLimit: 3, hintCost: 4, timeAttack: true })).toBe("Time Attack hint");
  });
});
