import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const puzzleHubSource = readFileSync("src/ui/puzzleHubView.js", "utf8");
const stageCompleteSource = readFileSync("src/ui/stageComplete.js", "utf8");
const settingsSource = readFileSync("src/ui/settingsView.js", "utf8");
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
    expect(styles).toMatch(/\.pack-block--locked \.unlock-panel\s*\{[\s\S]*?width:\s*100%;[\s\S]*?padding-inline:\s*0;/);
    expect(en).toContain('lockConditionPuzzle: "Solve {count} more on this shelf"');
    expect(en).toContain('requiresPantryShelf: "Finish {shelf}"');
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

  it("keeps native version and build information visible in Settings", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
    const en = readFileSync("src/i18n/en.js", "utf8");
    const ko = readFileSync("src/i18n/ko.js", "utf8");

    expect(packageJson.dependencies["@capacitor/app"]).toBeTruthy();
    expect(settingsSource).toContain('import { App } from "@capacitor/app"');
    expect(settingsSource).toContain("App.getInfo()");
    expect(settingsSource).toContain('version.className = "settings-version"');
    expect(settingsSource).toContain('t("settings.version"');
    expect(en).toContain('version: "Version {version} (build {build})"');
    expect(ko).toContain('version: "\\ubc84\\uc804 {version} (\\ube4c\\ub4dc {build})"');
    expect(styles).toContain(".settings-version");
  });
});
