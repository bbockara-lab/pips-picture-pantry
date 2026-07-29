import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const appShellSource = readFileSync(new URL("../src/ui/appShell.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

describe("Workshop supporting cards wiring", () => {
  it("renders Daily, Time Attack, and completed-puzzle replay cards below the Workshop scene", () => {
    expect(appShellSource).toContain("renderDailyCard(");
    expect(appShellSource).toContain('{ dailyChallenge: true }');
    expect(appShellSource).toContain("completedDate: getDailyCompletedDate()");
    expect(appShellSource).toContain("today: getDailyDateKey()");
    expect(appShellSource).toContain('renderTimeAttackTeaserCard(() => onSelectView("timeAttack"))');
    expect(appShellSource).toContain("getDailyReplayPicks({");
    expect(appShellSource).toContain("completedPuzzleIds: getCompletedPuzzleIds()");
    expect(appShellSource).toContain('onSelectPuzzle(puzzleId, "puzzle", { replayChallenge: true })');
    expect(appShellSource).toContain('hubCards.className = "puzzle-hub-cards"');
    expect(appShellSource).toContain("shell.appendChild(hubCards)");
  });

  it("keeps the restored cards inset and clear of the bottom safe area", () => {
    expect(styles).toMatch(
      /\.puzzle-hub-cards\s*\{[\s\S]*?padding:\s*14px 14px calc\(max\(env\(safe-area-inset-bottom,\s*0px\),\s*16px\) \+ 120px\);/
    );
  });
});
