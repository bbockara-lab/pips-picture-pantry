import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const appShellSource = readFileSync(new URL("../src/ui/appShell.js", import.meta.url), "utf8");

describe("Time Attack exit recovery", () => {
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
      /function selectView\(view\)[\s\S]*?clearTimeAttackSession\(\);[\s\S]*?activeView = view/
    );
    expect(appShellSource).toMatch(
      /function closeTimeAttackRun\(\)[\s\S]*?activeView = "puzzle";[\s\S]*?clearTimeAttackSession\(\);/
    );
    expect(appShellSource.match(/clearTimeAttackSession\(\);/g)?.length).toBeGreaterThanOrEqual(4);
  });
});
