import { describe, expect, it } from "vitest";
import { KOREAN_HARVEST_CONTENT } from "../src/data/koreanHarvestContent.js";
import { KOREAN_HARVEST_REWARD_ART, getKoreanHarvestRewardArtUrl } from "../src/data/koreanHarvestRewardArt.js";
import { getKoreanHarvestCompletedCount, renderKoreanHarvestRewardShelf } from "../src/ui/koreanHarvestRewardShelf.js";

describe("Korean Harvest reward shelf", () => {
  it("maps every approved reward to game-ready art", () => {
    KOREAN_HARVEST_CONTENT.rewards.forEach((reward) => {
      expect(reward.artStatus).toBe("approved");
      expect(getKoreanHarvestRewardArtUrl(reward.assetId)).toBeTruthy();
    });
    expect(Object.keys(KOREAN_HARVEST_REWARD_ART)).toHaveLength(4);
  });

  it("counts only completed Korean Harvest puzzles", () => {
    const [first, second] = KOREAN_HARVEST_CONTENT.puzzles;
    expect(getKoreanHarvestCompletedCount([first.id, second.id, "unrelated-puzzle"])).toBe(2);
  });

  it("does not render candidate content into the live Pantry", () => {
    expect(renderKoreanHarvestRewardShelf([])).toBeNull();
  });
});
