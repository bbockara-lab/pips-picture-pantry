import { describe, expect, it } from "vitest";
import { getNextPuzzleInSequence } from "../src/game/puzzleSequence.js";

const puzzle = (id) => ({ id });

describe("picture completion sequence", () => {
  const allPuzzles = [puzzle("one"), puzzle("two"), puzzle("three"), puzzle("four")];

  it("opens the immediate next catalog picture even when later pictures were completed earlier", () => {
    const completedOutOfOrder = new Set(["one", "three"]);
    expect(completedOutOfOrder.has("three")).toBe(true);
    expect(getNextPuzzleInSequence(allPuzzles[0], allPuzzles)?.id).toBe("two");
  });

  it("does not skip an already completed immediate neighbour", () => {
    expect(getNextPuzzleInSequence(allPuzzles[1], allPuzzles)?.id).toBe("three");
  });

  it("wraps only after the final catalog picture", () => {
    expect(getNextPuzzleInSequence(allPuzzles[3], allPuzzles)?.id).toBe("one");
  });
});
