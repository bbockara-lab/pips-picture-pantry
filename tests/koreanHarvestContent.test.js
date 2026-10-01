import { describe, expect, it } from "vitest";
import {
  KOREAN_HARVEST_CONTENT,
  KOREAN_HARVEST_SHELVES,
  getKoreanHarvestLifecycle,
  getKoreanHarvestPlayerState,
  getKoreanHarvestRewardForProgress,
  getKoreanHarvestCompletedPuzzleCount,
  isKoreanHarvestRewardUnlocked,
  isKoreanHarvestArchiveAvailable,
  isKoreanHarvestContentRuntimeReady
} from "../src/data/koreanHarvestContent.js";

describe("Korean Harvest live content", () => {
  it("publishes only after theme, content, and reward art are approved", () => {
    expect(KOREAN_HARVEST_CONTENT.status).toBe("live");
    expect(isKoreanHarvestContentRuntimeReady()).toBe(true);
    expect(KOREAN_HARVEST_CONTENT.mailboxLetter.unlockRule).toBe("theme-live");
  });

  it("ships matching Korean and English seasonal copy", () => {
    expect(KOREAN_HARVEST_CONTENT.localization.supported).toEqual(["en", "ko"]);
    expect(KOREAN_HARVEST_CONTENT.localization.eventTitle.en).toContain("Harvest Moon");
    expect(KOREAN_HARVEST_CONTENT.localization.eventTitle.ko).toContain("추석");
    expect(KOREAN_HARVEST_CONTENT.mailboxLetter.body.en.length).toBeGreaterThan(100);
    expect(KOREAN_HARVEST_CONTENT.mailboxLetter.body.ko.length).toBeGreaterThan(80);
    expect(KOREAN_HARVEST_CONTENT.welcomeGift).toMatchObject({
      id: "korean-harvest-2026-welcome-gift",
      spoons: 50,
      localDateWindow: { start: "2026-09-17", end: "2026-10-04" }
    });
  });

  it("unlocks one pantry reward after each four-puzzle chapter", () => {
    expect(getKoreanHarvestRewardForProgress(3)).toBeNull();
    expect(getKoreanHarvestRewardForProgress(4)?.id).toBe("songpyeon-tray");
    expect(getKoreanHarvestRewardForProgress(11)?.id).toBe("bojagi-gift");
    expect(getKoreanHarvestRewardForProgress(16)?.id).toBe("moonlit-lantern");
    expect(getKoreanHarvestRewardForProgress(4)?.assetId).toBe("korean-harvest-songpyeon-tray-v1");
  });

  it("uses the authored reward thresholds as the single unlock source", () => {
    const firstFour = KOREAN_HARVEST_CONTENT.puzzles.slice(0, 4).map(({ id }) => id);
    expect(getKoreanHarvestCompletedPuzzleCount(firstFour)).toBe(4);
    expect(isKoreanHarvestRewardUnlocked("songpyeon-tray", firstFour)).toBe(true);
    expect(isKoreanHarvestRewardUnlocked("bojagi-gift", firstFour)).toBe(false);
    expect(isKoreanHarvestRewardUnlocked("unknown", firstFour)).toBe(false);
  });

  it("defines four ordered shelves without duplicating an event puzzle", () => {
    expect(KOREAN_HARVEST_SHELVES).toHaveLength(4);
    const puzzleIds = KOREAN_HARVEST_SHELVES.flatMap((shelf) => shelf.puzzleIds);
    expect(puzzleIds).toHaveLength(16);
    expect(puzzleIds).toHaveLength(KOREAN_HARVEST_CONTENT.puzzles.length);
    expect(new Set(puzzleIds).size).toBe(16);
    expect(KOREAN_HARVEST_SHELVES.map((shelf) => shelf.stageBonus)).toEqual([24, 32, 40, 48]);
  });

  it("retires only the live promotion and keeps the collection as an archive", () => {
    expect(getKoreanHarvestLifecycle("2026-08-29")).toBe("upcoming");
    expect(getKoreanHarvestLifecycle("2026-09-17")).toBe("live");
    expect(getKoreanHarvestLifecycle("2026-10-04")).toBe("live");
    expect(getKoreanHarvestLifecycle("2026-10-05")).toBe("archive");
    expect(isKoreanHarvestArchiveAvailable("2026-10-05")).toBe(true);
  });

  it("preserves complete, partial, and nonparticipant player states", () => {
    const ids = KOREAN_HARVEST_CONTENT.puzzles.map((puzzle) => puzzle.id);
    expect(getKoreanHarvestPlayerState([])).toMatchObject({ state: "not-started", completedCount: 0, progressPreserved: true });
    expect(getKoreanHarvestPlayerState(ids.slice(0, 7))).toMatchObject({ state: "in-progress", completedCount: 7, replayAvailable: true });
    expect(getKoreanHarvestPlayerState(ids)).toMatchObject({ state: "complete", completedCount: 16, replayAvailable: true });
  });
});
