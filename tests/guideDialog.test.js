import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const guideSource = readFileSync(new URL("../src/ui/guideDialog.js", import.meta.url), "utf8");
const appShellSource = readFileSync(new URL("../src/ui/appShell.js", import.meta.url), "utf8");
const settingsSource = readFileSync(new URL("../src/ui/settingsView.js", import.meta.url), "utf8");

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