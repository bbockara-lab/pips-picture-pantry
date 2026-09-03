import { describe, expect, it } from "vitest";
import { getDailyDateKey, getDailyPuzzle } from "../src/game/dailyPuzzle.js";

describe("daily puzzle selection", () => {
  it("uses the local calendar date for the daily completion key", () => {
    expect(getDailyDateKey(new Date(2026, 6, 29, 23, 30))).toBe("2026-07-29");
    expect(getDailyDateKey(new Date(2026, 6, 30, 0, 5))).toBe("2026-07-30");
  });

  it("selects from the provided playable candidate pool", () => {
    const candidates = [
      { id: "starter-1" },
      { id: "starter-2" }
    ];
    const selected = getDailyPuzzle(candidates, new Date(0));

    expect(candidates).toContain(selected);
  });
});
