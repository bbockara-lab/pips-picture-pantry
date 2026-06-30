import { describe, expect, it } from "vitest";
import { getDailyPuzzle } from "../src/game/dailyPuzzle.js";

describe("daily puzzle selection", () => {
  it("selects from the provided playable candidate pool", () => {
    const candidates = [
      { id: "starter-1" },
      { id: "starter-2" }
    ];
    const selected = getDailyPuzzle(candidates, new Date(0));

    expect(candidates).toContain(selected);
  });
});
