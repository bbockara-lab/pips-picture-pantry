import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const playScreenSource = readFileSync("src/ui/playScreen.js", "utf8");
const indexSource = readFileSync("index.html", "utf8");

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

  it("forwards the Daily completion confirmation route to the puzzle view", () => {
    expect(playScreenSource).toMatch(/onNextPuzzle,\s*\n\s*onBackToSpoonRun,\s*\n\s*onPreviousStagePuzzle/);
    expect(playScreenSource).toMatch(/renderPuzzleView\([\s\S]*dailyBonus:[\s\S]*onNextPuzzle,\s*\n\s*onBackToSpoonRun,\s*\n\s*controlMode/);
  });

  it("does not duplicate the shared quick-travel navigation with legacy header actions", () => {
    expect(playScreenSource).not.toContain('className = "play-screen__back"');
    expect(playScreenSource).not.toContain('className = "play-screen__settings');
    expect(playScreenSource).not.toContain("openPauseMenu()");
    expect(playScreenSource).not.toContain('className = "play-pause-overlay"');
  });

  it("offers an in-game shortcut between direct input and the D-pad", () => {
    expect(playScreenSource).toContain("shouldShowCursorControls(activePuzzle, controlMode)");
    expect(playScreenSource).toContain('className = "play-screen__control-toggle"');
    expect(playScreenSource).toContain('onControlModeChange?.(usesCursorControls ? "direct" : "cursor")');
  });

  it("prevents persistent iOS double-tap zoom during rapid puzzle input", () => {
    expect(indexSource).toContain("maximum-scale=1.0");
    expect(indexSource).toContain("user-scalable=no");
  });
});
