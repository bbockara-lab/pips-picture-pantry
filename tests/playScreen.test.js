import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const playScreenSource = readFileSync("src/ui/playScreen.js", "utf8");

describe("play screen wiring", () => {
  it("passes puzzle state changes through to the puzzle view", () => {
    expect(playScreenSource).toMatch(/onPuzzleStateChange\s*\n\s*}\s*=\s*options/);
    expect(playScreenSource).toMatch(/renderPuzzleView\([\s\S]*onPuzzleStateChange,[\s\S]*onPuzzleComplete/);
  });

  it("uses explicit Daily challenge context instead of matching puzzle ids", () => {
    expect(playScreenSource).toContain("dailyChallenge = false");
    expect(playScreenSource).toContain("dailyKey: dailyChallenge && !isTimeAttack && !replayChallenge ? getDailyDateKey() : null");
    expect(playScreenSource).not.toContain("activePuzzle.id === dailyPuzzle.id ? getDailyKey()");
  });

  it("destructures the time attack limit before rendering the countdown", () => {
    expect(playScreenSource).toMatch(/timeAttackLimitSeconds\s*=\s*0/);
    expect(playScreenSource).toMatch(/Math\.max\(0,\s*Number\(timeAttackLimitSeconds/);
  });

  it("routes the standard completion card to the album while preserving replay close behavior", () => {
    expect(playScreenSource).toMatch(/onClosePuzzle,\s*\n\s*onViewAlbum,/);
    expect(playScreenSource).toMatch(/onViewAlbum:\s*replayChallenge\s*\?\s*onClosePuzzle\s*:\s*onViewAlbum/);
  });

  it("opens a pause destination menu instead of immediately leaving normal play", () => {
    expect(playScreenSource).toContain("openPauseMenu()");
    expect(playScreenSource).toContain('className = "play-pause-overlay"');
    expect(playScreenSource).toContain('createPauseAction(t("playPause.continue")');
    expect(playScreenSource).toContain('createPauseAction(t("playPause.pictures")');
    expect(playScreenSource).toContain('onSelectView?.("album")');
    expect(playScreenSource).toContain('onSelectView?.("pantry")');
  });
});
