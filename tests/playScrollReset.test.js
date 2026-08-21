import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const appShellSource = readFileSync("src/ui/appShell.js", "utf8");

describe("puzzle entry scroll reset", () => {
  it("queues the same top reset for normal play, hub play, and Time Attack", () => {
    expect(appShellSource).toContain('function selectPuzzle(puzzleId, scrollTarget = "play"');
    expect(appShellSource).toMatch(/function openPuzzleFromHub\(\)[\s\S]*?playOpen = true;\s*queuePlayScrollReset\(\);\s*draw\(\);/);
    expect(appShellSource).toMatch(/function startTimeAttackRun\(\)[\s\S]*?queuePlayScrollReset\(\);\s*draw\(\);/);
    expect(appShellSource).toMatch(/result\.status === "next-round"[\s\S]*?queuePlayScrollReset\(\);\s*draw\(\);/);
  });

  it("resets the document viewport immediately and after WebKit restoration", () => {
    expect(appShellSource).toMatch(/if \(target === "play"\) \{[\s\S]*?scrollRoot\.scrollTop = 0;/);
    expect(appShellSource).toContain('globalThis.scrollTo?.({ top: 0, left: 0, behavior: "auto" })');
    expect(appShellSource).toContain("globalThis.requestAnimationFrame(resetPlayViewport)");
  });
});
