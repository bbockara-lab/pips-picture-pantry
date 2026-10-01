import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { isKoreanHarvestEventVisible } from "../src/data/koreanHarvestContent.js";

const appShell = fs.readFileSync("src/ui/appShell.js", "utf8");
const home = fs.readFileSync("src/ui/puzzleHubView.js", "utf8");
const eventView = fs.readFileSync("src/ui/koreanHarvestEventView.js", "utf8");

describe("Korean Harvest event destination", () => {
  it("shows the event destination only during its authored home window", () => {
    expect(isKoreanHarvestEventVisible("2026-08-29")).toBe(false);
    expect(isKoreanHarvestEventVisible("2026-08-30")).toBe(true);
    expect(isKoreanHarvestEventVisible("2026-10-04")).toBe(true);
    expect(isKoreanHarvestEventVisible("2026-10-05")).toBe(false);
  });

  it("keeps Pip's greeting separate from the event icon and explicit gift claim", () => {
    expect(home).not.toContain("getSeasonalThemeLabel(homeTheme, t)");
    expect(home).toContain("puzzle-home-scene__seasonal-event");
    expect(home).toContain("pip-korean-harvest-greeting-v3-capybara");
    expect(appShell).not.toContain("hasActivePlayer() ? claimKoreanHarvestWelcomeGift()");
    expect(appShell).toContain("claimKoreanHarvestGiftFromEvent");
  });

  it("renders sixteen event puzzles and their four keepsakes outside the regular picker", () => {
    expect(eventView).toContain("eventSeasonShelves.forEach");
    expect(eventView).toContain("renderKoreanHarvestRewardShelf");
    expect(eventView).toContain("onPlayPuzzle(puzzle.id)");
    expect(home).toContain("regularSeasonShelves.forEach");
  });

  it("reveals puzzle names and solution artwork only after completion", () => {
    expect(eventView).toContain('if (complete)');
    expect(eventView).toContain('mysteryGiftUrl');
    expect(eventView).toContain('koreanHarvest.event.mysteryPuzzle');
    expect(eventView).toContain('complete\n        ? `${index + 1}. ${puzzleImageName(puzzle)}`');
  });
});
