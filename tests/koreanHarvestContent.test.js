import { describe, expect, it } from "vitest";
import {
  KOREAN_HARVEST_CONTENT,
  KOREAN_HARVEST_SHELVES,
  getKoreanHarvestRewardForProgress,
  isKoreanHarvestContentRuntimeReady
} from "../src/data/koreanHarvestContent.js";

describe("Korean Harvest candidate content", () => {
  it("stays isolated from runtime until theme, content, and reward art are approved", () => {
    expect(KOREAN_HARVEST_CONTENT.status).toBe("candidate");
    expect(isKoreanHarvestContentRuntimeReady()).toBe(false);
    expect(KOREAN_HARVEST_CONTENT.mailboxLetter.unlockRule).toBe("theme-live");
  });

  it("ships matching Korean and English seasonal copy", () => {
    expect(KOREAN_HARVEST_CONTENT.localization.supported).toEqual(["en", "ko"]);
    expect(KOREAN_HARVEST_CONTENT.localization.eventTitle.en).toContain("Harvest Moon");
    expect(KOREAN_HARVEST_CONTENT.localization.eventTitle.ko).toContain("추석");
    expect(KOREAN_HARVEST_CONTENT.mailboxLetter.body.en.length).toBeGreaterThan(100);
    expect(KOREAN_HARVEST_CONTENT.mailboxLetter.body.ko.length).toBeGreaterThan(80);
  });

  it("unlocks one pantry reward after each four-puzzle chapter", () => {
    expect(getKoreanHarvestRewardForProgress(3)).toBeNull();
    expect(getKoreanHarvestRewardForProgress(4)?.id).toBe("songpyeon-tray");
    expect(getKoreanHarvestRewardForProgress(11)?.id).toBe("bojagi-gift");
    expect(getKoreanHarvestRewardForProgress(16)?.id).toBe("moonlit-lantern");
    expect(getKoreanHarvestRewardForProgress(4)?.assetId).toBe("korean-harvest-songpyeon-tray-v1");
  });

  it("defines four ordered shelves without duplicating an event puzzle", () => {
    expect(KOREAN_HARVEST_SHELVES).toHaveLength(4);
    const puzzleIds = KOREAN_HARVEST_SHELVES.flatMap((shelf) => shelf.puzzleIds);
    expect(puzzleIds).toHaveLength(16);
    expect(puzzleIds).toHaveLength(KOREAN_HARVEST_CONTENT.puzzles.length);
    expect(new Set(puzzleIds).size).toBe(16);
    expect(KOREAN_HARVEST_SHELVES.map((shelf) => shelf.stageBonus)).toEqual([24, 32, 40, 48]);
  });
});
