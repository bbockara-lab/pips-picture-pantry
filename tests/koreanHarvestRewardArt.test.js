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

  it("renders all four approved rewards into the live Pantry", () => {
    const originalDocument = globalThis.document;
    globalThis.document = {
      createElement(tagName) {
        return {
          tagName,
          children: [],
          dataset: {},
          className: "",
          textContent: "",
          append(...children) { this.children.push(...children); },
          appendChild(child) { this.children.push(child); return child; }
        };
      }
    };
    try {
      const shelf = renderKoreanHarvestRewardShelf([]);
      expect(shelf?.dataset.eventTheme).toBe("korean-harvest");
      const items = shelf?.children.find((child) => child.className === "seasonal-reward-shelf__items");
      expect(items?.children).toHaveLength(4);
    } finally {
      globalThis.document = originalDocument;
    }
  });
});
