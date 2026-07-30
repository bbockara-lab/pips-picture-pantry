import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const puzzleHubSource = readFileSync("src/ui/puzzleHubView.js", "utf8");
const stageCompleteSource = readFileSync("src/ui/stageComplete.js", "utf8");
const styles = readFileSync("src/styles.css", "utf8");

// These source contracts keep the approval-candidate UI copy and visible
// completion moment from silently regressing during later screen cleanup.
describe("release candidate clarity", () => {
  it("shows puzzle and Pantry requirements separately on locked stages", () => {
    const en = readFileSync("src/i18n/en.js", "utf8");
    const ko = readFileSync("src/i18n/ko.js", "utf8");
    expect(puzzleHubSource).toContain("export function getShelfLockConditions");
    expect(puzzleHubSource).toContain('appendLockCondition(requirements, "Puzzle"');
    expect(puzzleHubSource).toContain('appendLockCondition(requirements, "Pantry"');
    expect(puzzleHubSource).toContain("isSeasonShelfComplete(previousShelf");
    expect(en).toContain("lockConditionPuzzleDone");
    expect(ko).toContain("lockConditionPantryDone");
    expect(styles).toContain(".unlock-panel__condition.is-met");
    expect(styles).toContain(".unlock-panel__condition.is-unmet");
  });

  it("uses a distinct, structured primary puzzle CTA label", () => {
    expect(puzzleHubSource).toContain('"puzzle-home-scene__play-label-main"');
    expect(styles).toContain(".puzzle-home-scene__play-label-main");
  });

  it("shows the one-time shelf completion moment in the mounted overlay", () => {
    expect(stageCompleteSource).toContain("stage-complete-card--burst");
    expect(stageCompleteSource).toContain('t("packs.packComplete"');
    expect(styles).toContain(".stage-complete-badge");
  });
});