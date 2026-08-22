import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const appShellSource = readFileSync(new URL("../src/ui/appShell.js", import.meta.url), "utf8");
const puzzleHubSource = readFileSync(new URL("../src/ui/puzzleHubView.js", import.meta.url), "utf8");
const floatingNavSource = readFileSync(new URL("../src/ui/floatingNav.js", import.meta.url), "utf8");
const quickTravelSource = readFileSync(new URL("../src/data/quickTravelArt.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

describe("Workshop supporting cards wiring", () => {
  it("uses balanced home-only artwork for the primary play action", () => {
    expect(puzzleHubSource).toContain('getHomeActionArt("play")');
    expect(puzzleHubSource).not.toContain('getPuzzleControlArt("fill")');
  });

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

  it("builds Spoon Run as a Pip scene with one shared earn-today value", () => {
    expect(puzzleHubSource).toContain('pip.className = "spoon-run-scene__pip"');
    expect(puzzleHubSource).toContain('opportunityBubble.className = "spoon-run-scene__opportunity"');
    expect(puzzleHubSource).toContain("puzzle-home-destination__badge--spoon-run");
    expect(appShellSource).toContain("getSpoonRunOpportunity({");
    expect(appShellSource).toContain("spoonRunOpportunity");
    expect(styles).toContain("Step 64 canonical Spoon Run scene");
    expect(puzzleHubSource).toContain("opportunityBubble.appendChild(icon)");
    expect(puzzleHubSource).toContain("header.append(pip, copy, opportunityBubble)");
    expect(puzzleHubSource).not.toContain("header.append(pip, icon");
    expect(styles).toContain(".spoon-run-scene__opportunity > .spoon-run-scene__token");
  });

  it("keeps Workshop positioning in one canonical composition block", () => {
    const canonicalMarker = "v0.1.714 - Step 63 canonical Workshop composition";
    const canonicalIndex = styles.indexOf(canonicalMarker);
    expect(canonicalIndex).toBeGreaterThan(-1);

    const supersededStyles = styles.slice(0, canonicalIndex);
    expect(supersededStyles).not.toContain(".puzzle-home-scene__play");
    expect(supersededStyles).not.toContain(".puzzle-home-destinations");
    expect(supersededStyles).not.toContain(".puzzle-home-destination--");

    const canonicalStyles = styles.slice(canonicalIndex);
    expect(canonicalStyles).toContain("white-space: nowrap");
    expect(canonicalStyles).toContain(".app-shell--workshop-home .puzzle-home-destinations");
    expect(canonicalStyles).toContain(".app-shell--workshop-home .puzzle-home-scene__play");
  });

  it("keeps Play free of card-like background treatment", () => {
    const canonicalMarker = "v0.1.714 - Step 63 canonical Workshop composition";
    const canonicalStyles = styles.slice(styles.indexOf(canonicalMarker));
    const playRule = canonicalStyles.match(
      /\.app-shell--workshop-home \.puzzle-home-scene__play\s*\{([\s\S]*?)\}/
    )?.[1] || "";

    expect(playRule).toMatch(/background:\s*transparent\s*!important;/);
    expect(playRule).toMatch(/border:\s*0\s*!important;/);
    expect(playRule).toMatch(/box-shadow:\s*none\s*!important;/);
    expect(playRule).toMatch(/animation:\s*none;/);
    expect(playRule).not.toMatch(/linear-gradient|background-color|#ffd96b|#f4bb36/);
  });

  it("keeps Play Now exactly 1.5 times larger than the other home destinations", () => {
    const canonicalMarker = "v0.1.714 - Step 63 canonical Workshop composition";
    const canonicalStyles = styles.slice(styles.indexOf(canonicalMarker));

    expect(canonicalStyles).toContain("--workshop-destination-size: clamp(74px, 20vw, 92px)");
    expect(canonicalStyles).toContain("--workshop-play-size: clamp(111px, 30vw, 138px)");
  });
});
