import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const appShellSource = readFileSync("src/ui/appShell.js", "utf8");

describe("settings progress reset", () => {
  it("reloads the app after clearing persisted progress instead of redrawing stale state", () => {
    expect(appShellSource).toMatch(
      /function confirmReset\(\)\s*\{\s*resetProgress\(\);\s*window\.location\.reload\(\);\s*\}/
    );
  });
});