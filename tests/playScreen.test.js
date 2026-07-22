import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const playScreenSource = readFileSync("src/ui/playScreen.js", "utf8");

describe("play screen wiring", () => {
  it("passes puzzle state changes through to the puzzle view", () => {
    expect(playScreenSource).toMatch(/onPuzzleStateChange\s*\n\s*}\s*=\s*options/);
    expect(playScreenSource).toMatch(/renderPuzzleView\([\s\S]*onPuzzleStateChange,[\s\S]*onPuzzleComplete/);
  });

  it("destructures the time attack limit before rendering the countdown", () => {
    expect(playScreenSource).toMatch(/timeAttackLimitSeconds\s*=\s*0/);
    expect(playScreenSource).toMatch(/Math\.max\(0,\s*Number\(timeAttackLimitSeconds/);
  });

  it("routes the standard completion card to the album while preserving replay close behavior", () => {
    expect(playScreenSource).toMatch(/onClosePuzzle,\s*\n\s*onViewAlbum,/);
    expect(playScreenSource).toMatch(/onViewAlbum:\s*replayChallenge\s*\?\s*onClosePuzzle\s*:\s*onViewAlbum/);
  });
});
