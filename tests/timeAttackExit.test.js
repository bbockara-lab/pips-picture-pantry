import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const appShellSource = readFileSync(new URL("../src/ui/appShell.js", import.meta.url), "utf8");

describe("Time Attack paint persistence", () => {
  it("passes the transient puzzle state through timer redraws without shadowing the render options", () => {
    const puzzleViewSource = readFileSync("src/ui/puzzleView.js", "utf8");
    const playScreenSource = readFileSync("src/ui/playScreen.js", "utf8");
    const appShellSource = readFileSync("src/ui/appShell.js", "utf8");

    expect(puzzleViewSource).toContain("options.puzzleState || createPuzzleState(puzzle)");
    expect(puzzleViewSource).toContain("function update(nextState, updateOptions = {})");
    expect(puzzleViewSource).toContain("options.onPuzzleStateChange?.(puzzle, state)");
    expect(playScreenSource).toContain("puzzleState,");
    expect(appShellSource).toContain("timeAttackPuzzleState: activeTimeAttackPuzzleState");
    expect(appShellSource).toContain("puzzleState: activeView === \"timeAttack\" ? timeAttackPuzzleState : null");
  });
});

describe("Time Attack exit recovery", () => {
  it("finishes the visible countdown before creating the timed session", () => {
    expect(appShellSource).toContain("let timeAttackCountdownStep = null");
    expect(appShellSource).toContain("function startTimeAttackCountdown()");
    expect(appShellSource).toContain("onStartTimeAttack: startTimeAttackCountdown");
    expect(appShellSource).toMatch(
      /function startTimeAttackRun\(\)[\s\S]*?createTimeAttackSession/
    );
    expect(appShellSource).toContain("renderTimeAttackCountdown(timeAttackCountdownStep)");
  });

  it("suppresses music for countdown and play, then restores it through cleanup", () => {
    expect(appShellSource).toMatch(/function startTimeAttackCountdown\(\)[\s\S]*?setMusicSuppressed\(true\)/);
    expect(appShellSource).toMatch(/function startTimeAttackRun\(\)[\s\S]*?setMusicSuppressed\(true\)/);
    expect(appShellSource).toMatch(/function clearTimeAttackSession\(\)[\s\S]*?setMusicSuppressed\(false\)/);
  });

  it("keeps and restores the regular puzzle around a Time Attack run", () => {
    expect(appShellSource).toContain("let preTimeAttackPuzzle = null");
    expect(appShellSource).toContain("preTimeAttackPuzzle = activePuzzle");
    expect(appShellSource).toContain("function clearTimeAttackSession");
    expect(appShellSource).toContain("activeTimeAttackSeed = null");
    expect(appShellSource).toContain("activePuzzle = preTimeAttackPuzzle");
    expect(appShellSource).toContain("preTimeAttackPuzzle = null");
  });

  it("uses the same cleanup path for close, navigation, completion, and timeout", () => {
    expect(appShellSource).toMatch(
      /function selectView\(view, scrollTarget = "top"\)[\s\S]*?clearTimeAttackSession\(\);[\s\S]*?activeView = view/
    );
    expect(appShellSource).toMatch(
      /function closeTimeAttackRun\(\)[\s\S]*?activeView = "puzzle";[\s\S]*?clearTimeAttackSession\(\);/
    );
    expect(appShellSource.match(/clearTimeAttackSession\(\);/g)?.length).toBeGreaterThanOrEqual(4);
  });
});
