import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const appShellSource = readFileSync(new URL("../src/ui/appShell.js", import.meta.url), "utf8");
const puzzleHubSource = readFileSync(new URL("../src/ui/puzzleHubView.js", import.meta.url), "utf8");
const floatingNavSource = readFileSync(new URL("../src/ui/floatingNav.js", import.meta.url), "utf8");
const quickTravelSource = readFileSync(new URL("../src/data/quickTravelArt.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

describe("Workshop supporting cards wiring", () => {
  it("labels the Workshop as Pip's Puzzle Room", () => {
    expect(puzzleHubSource).toContain('"puzzle-home-scene__title", t("views.puzzle")');
    expect(styles).toContain("v0.1.676 - Workshop view identity");
    expect(styles).toMatch(
      /\.app-shell--workshop-home \.puzzle-home-scene__title\s*\{[\s\S]*?color:\s*#fff8f0;[\s\S]*?padding:\s*4px 10px;[\s\S]*?background:\s*rgba\(0, 0, 0, 0\.25\);[\s\S]*?text-shadow:\s*0 1px 4px rgba\(0, 0, 0, 0\.4\);/
    );
  });

  it("moves Daily and replay cards into the Spoon Run view", () => {
    expect(puzzleHubSource).toContain("export function renderSpoonRunView");
    expect(puzzleHubSource).toContain("renderDailyCard(");
    expect(puzzleHubSource).toContain("renderReplayPicksCard(");
    expect(appShellSource).toContain('activeView === "spoonRun"');
    expect(appShellSource).toContain("renderSpoonRunView({");
    expect(appShellSource).toContain('{ dailyChallenge: true }');
    expect(appShellSource).toContain('{ replayChallenge: true, replayPicked: true }');
    expect(appShellSource).not.toContain('hubCards.className = "puzzle-hub-cards"');
    expect(appShellSource).not.toContain("renderTimeAttackTeaserCard");
  });

  it("replaces the Workshop Time Attack shortcut while retaining Time Attack in floating navigation", () => {
    expect(puzzleHubSource).toContain('["spoonRun", "views.spoonRun"');
    expect(puzzleHubSource).not.toContain('["timeAttack", "home.timeAttackLabel"');
    expect(floatingNavSource).toContain('["spoonRun", "views.spoonRun"]');
    expect(floatingNavSource).toContain('["timeAttack", "views.timeAttack"]');
    expect(quickTravelSource).toContain('spoonRun: { assetId: "spoon-token-v2"');
  });

  it("keeps completion Next inside the replay pool and returns to its card when exhausted", () => {
    expect(appShellSource).toContain("if (replayChallenge)");
    expect(appShellSource).toContain("getNextDailyReplayPick(replayPicks, activePuzzle.id)");
    expect(appShellSource).toContain('{ replayChallenge: true, replayPicked: true }');
    expect(appShellSource).toContain('activeView = "spoonRun"');
    expect(appShellSource).toContain('pendingScrollTarget = "replay"');
    expect(appShellSource).toContain('? ".replay-picks-card"');
    expect(appShellSource).toContain("let replayPicked = false");
    expect(appShellSource).toContain("replayPicked = Boolean(options.replayPicked)");
    expect(appShellSource).toContain("replayPicked,");
    expect(appShellSource).not.toContain("replayPicked: replayChallenge");
  });

  it("returns Daily completion to the replay list inside Spoon Run", () => {
    expect(appShellSource).toMatch(
      /function selectNextPuzzle\(\) \{\s*if \(dailyChallenge\) \{[\s\S]*?activeView = "spoonRun";[\s\S]*?pendingScrollTarget = "replay";/
    );
  });

  it("keeps Spoon Run cards inset and clear of the bottom safe area", () => {
    expect(styles).toMatch(
      /\.spoon-run-view\s*\{[\s\S]*?padding:\s*18px 18px calc\(max\(env\(safe-area-inset-bottom,\s*0px\),\s*18px\) \+ 112px\);/
    );
  });
});
