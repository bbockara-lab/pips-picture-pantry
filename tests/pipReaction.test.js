import { describe, expect, it } from "vitest";
import { isFirstPipFacePuzzle } from "../src/ui/pipReaction.js";

describe("Pip completion scene", () => {
  it("reserves the first-completion scene for the first Pip puzzle id", () => {
    expect(isFirstPipFacePuzzle({
      id: "pips-first-shelf-pip-face-1",
      completionPalette: "pip-face"
    })).toBe(true);
    expect(isFirstPipFacePuzzle({
      id: "pips-first-shelf-pip-face-2-11",
      completionPalette: "pip-face"
    })).toBe(false);
  });
});
