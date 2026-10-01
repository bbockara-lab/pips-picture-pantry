import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { seasonShelves } from "../src/data/seasonShelves.js";
import { formatShelfPuzzleSummary, getShelfTeaserKey } from "../src/ui/puzzleHubView.js";

const hubSource = readFileSync("src/ui/puzzleHubView.js", "utf8");
const styles = readFileSync("src/styles.css", "utf8");

function lockedShelf(index) {
  return seasonShelves[index];
}

describe("Puzzle stage roadmap", () => {
  it("formats every size bucket on a future stage", () => {
    expect(formatShelfPuzzleSummary(lockedShelf(2))).toBe("5 5×5 puzzles · 12 8×8 puzzles · 3 10×10 puzzles");
  });

  it("derives teaser keys from the same title key used by the stage", () => {
    expect(getShelfTeaserKey(lockedShelf(1))).toBe("shelves.sunnyCounterTeaser");
    expect(getShelfTeaserKey(lockedShelf(14))).toBe("shelves.villagePantryTeaser");
  });

  it("renders every locked stage without the previous-stage visibility filter", () => {
    expect(hubSource).not.toContain("if (!previousShelf || !isShelfUnlocked(previousShelf)) return;");
    expect(hubSource).toContain("shelfPuzzles.slice(0, 3)");
    expect(hubSource).toContain('className: "locked-stage-preview__art"');
    expect(hubSource).toContain('"locked-stage-summary"');
    expect(hubSource).toContain('"locked-stage-teaser"');
    const lockedRules = [...styles.matchAll(/\.pack-block--locked\s*\{([\s\S]*?)\}/g)].map((match) => match[1]);
    expect(lockedRules).toHaveLength(2);
    expect(lockedRules.every((rule) => rule.includes("padding: 14px 16px"))).toBe(true);
  });

  it("marks complete stages and keeps their default collapsed behavior", () => {
    expect(hubSource).toContain('"pack-stage-complete-badge"');
    expect(hubSource).toContain('t("puzzlePicker.stageComplete")');
    expect(styles).toContain(".pack-stage-complete-badge");
    expect(styles).toMatch(/\.locked-stage-preview__art\s*\{[\s\S]*?filter:\s*grayscale\(1\) blur\(1\.2px\);[\s\S]*?opacity:\s*0\.34;/);
  });
});