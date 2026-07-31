import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const guideSource = readFileSync(new URL("../src/ui/guideDialog.js", import.meta.url), "utf8");
const appShellSource = readFileSync(new URL("../src/ui/appShell.js", import.meta.url), "utf8");
const settingsSource = readFileSync(new URL("../src/ui/settingsView.js", import.meta.url), "utf8");
const mobileQaSource = readFileSync(new URL("../scripts/mobile_visual_check.js", import.meta.url), "utf8");
const stylesSource = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

describe("guide dialog character and badge wiring", () => {
  it("assigns the approved Mr. Park art to Time Attack", () => {
    expect(guideSource).toMatch(
      /timeAttack:\s*\{\s*className:\s*"mr-park",\s*assetId:\s*"story-friend-mr-park-v1"/
    );
  });

  it("registers and automatically opens the unseen map guide", () => {
    expect(guideSource).toContain(
      'map: ["guide.map.step1", "guide.map.step2", "guide.map.step3"]'
    );
    expect(appShellSource).toMatch(
      /activeView === "map" && !hasSeenGuide\("map"\)[\s\S]*?activeGuide = "map"/
    );
  });

  it("opens the two-step Pip guide only for an unseen Spoon Run intro", () => {
    expect(guideSource).toContain(
      'spoonRunIntro: ["guide.spoonRunIntro.step1", "guide.spoonRunIntro.step2"]'
    );
    expect(guideSource).toContain('spoonRunIntro: "guide.spoonRunIntro.speakerName"');
    expect(appShellSource).toMatch(
      /activeView === "spoonRun" && !hasSeenGuide\("spoonRunIntro"\)[\s\S]*?activeGuide = "spoonRunIntro"/
    );
  });
  it("verifies and dismisses the Spoon Run intro in mobile candidate QA", () => {
    expect(mobileQaSource).toContain("expectSpoonRunFirstVisitGuide(page, viewport.name)");
    expect(mobileQaSource).toContain(".guide-dialog--spoonRunIntro");
  });
  it("keeps launch guides above the gesture safe area without changing neighbour dialogs", () => {
    expect(stylesSource).toContain(
      "padding: 48px 0 max(48px, calc(env(safe-area-inset-bottom, 0px) + 24px)) !important;"
    );
    expect(stylesSource).toMatch(
      /\.guide-overlay--pantryNeighborMrPark,[\s\S]*?padding:\s*16px !important;/
    );
  });

  it("locks background scrolling while any guide is active", () => {
    expect(appShellSource).toContain(
      'document.body.classList.toggle("guide-open", Boolean(activeGuide || allPuzzlesDonePromptOpen))'
    );
  });

  it("renders the completed-shelf Pip prompt with Pantry and Spoon Run destinations", () => {
    expect(guideSource).toContain("export function renderAllPuzzlesDoneDialog");
    expect(guideSource).toContain('t("guide.allPuzzlesDone")');
    expect(guideSource).toContain('t("guide.unlockNextHint")');
    expect(guideSource).toContain('pantryButton.addEventListener("click", onPantry)');
    expect(guideSource).toContain('spoonRunButton.addEventListener("click", onSpoonRun)');
    expect(appShellSource).toContain("getPuzzleHubOpenDecision(activePuzzle");
    expect(appShellSource).toContain('onAllPuzzlesDonePantry: () => selectView("pantry")');
    expect(appShellSource).toContain('onAllPuzzlesDoneSpoonRun: () => selectView("spoonRun")');
  });

  it("adds localized speaker name tags only to the character-led launch guides", () => {
    expect(guideSource).toContain('puzzle: "guide.puzzle.speakerName"');
    expect(guideSource).toContain('timeAttack: "guide.timeAttack.speakerName"');
    expect(guideSource).toContain('map: "guide.map.speakerName"');
    expect(guideSource).toContain('nameTag.className = "guide-dialog__name-tag"');
  });
  it("opens a real puzzle from the empty Album action", () => {
    expect(appShellSource).toContain("renderAlbumView(onNextPuzzle)");
    expect(appShellSource).not.toContain('renderAlbumView(() => onSelectView("puzzle"))');
  });

  it("offers the map guide replay with map artwork in settings", () => {
    expect(settingsSource).toContain(
      'createGuideReplayButton(t("settings.guideReplayMapAction"), "map", "map", onReplayGuide)'
    );
    expect(settingsSource).toContain('guideId === "map" ? "map" : "puzzle"');
  });
});