import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const appShellSource = readFileSync(new URL("../src/ui/appShell.js", import.meta.url), "utf8");
const puzzleHubSource = readFileSync(new URL("../src/ui/puzzleHubView.js", import.meta.url), "utf8");
const floatingNavSource = readFileSync(new URL("../src/ui/floatingNav.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

describe("Workshop supporting cards wiring", () => {
  it("renders Daily and completed-puzzle replay cards below the Workshop scene", () => {
    expect(appShellSource).toContain("renderDailyCard(");
    expect(appShellSource).toContain('{ dailyChallenge: true }');
    expect(appShellSource).toContain("completedDate: getDailyCompletedDate()");
    expect(appShellSource).toContain("today: getDailyDateKey()");
    expect(appShellSource).not.toContain("renderTimeAttackTeaserCard");
    expect(puzzleHubSource).not.toContain("renderTimeAttackTeaserCard");
    expect(appShellSource).toContain("getDailyReplayPicks({");
    expect(appShellSource).toContain("completedPuzzleIds: getCompletedPuzzleIds()");
    expect(appShellSource).toContain('onSelectPuzzle(puzzleId, "puzzle", { replayChallenge: true })');
    expect(appShellSource).toContain('hubCards.className = "puzzle-hub-cards"');
    expect(appShellSource).toContain("shell.appendChild(hubCards)");
  });

  it("removes the teaser while preserving the existing Time Attack navigation entries", () => {
    expect(puzzleHubSource).toContain('["timeAttack", "home.timeAttackLabel"');
    expect(floatingNavSource).toContain('["timeAttack", "views.timeAttack"]');
    expect(appShellSource).toContain('activeView === "timeAttack"');
  });

  it("keeps completion Next inside the replay pool and returns to its card when exhausted", () => {
    expect(appShellSource).toContain("if (replayChallenge)");
    expect(appShellSource).toContain("getNextDailyReplayPick(replayPicks, activePuzzle.id)");
    expect(appShellSource).toContain('{ replayChallenge: true }');
    expect(appShellSource).toContain('pendingScrollTarget = "replay"');
    expect(appShellSource).toContain('? ".replay-picks-card"');
  });

  it("keeps the restored cards inset and clear of the bottom safe area", () => {
    expect(styles).toMatch(
      /\.puzzle-hub-cards\s*\{[\s\S]*?padding:\s*14px 14px calc\(max\(env\(safe-area-inset-bottom,\s*0px\),\s*16px\) \+ 120px\);/
    );
  });
});
