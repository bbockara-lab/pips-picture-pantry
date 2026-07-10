import { describe, expect, it } from "vitest";
import { formatPuzzleBatchValidation, validatePuzzleBatch } from "../scripts/puzzle_batch_intake.js";

const packList = [
  {
    id: "test-bakery",
    access: "free",
    monetizationRole: "free-progression",
    size: 12
  }
];

function makeCandidate(overrides = {}) {
  return {
    id: "test-bakery-window-card-1",
    title: "Test Card",
    titleKey: "puzzles.test-bakery-window-card-1",
    packId: "test-bakery",
    access: "free",
    size: 12,
    difficulty: "hard",
    reward: 15,
    artReadability: {
      silhouette: "centered recipe card with a thick readable border",
      colorMood: "warm honey and mint accent",
      tags: ["recipe-card", "bold-border"]
    },
    solution: Array.from({ length: 12 }, (_, row) => (row % 2 === 0 ? "001111111100" : "010000000010")),
    ...overrides
  };
}

describe("puzzle batch intake", () => {
  it("accepts a complete large-board candidate with matching i18n copy", () => {
    const result = validatePuzzleBatch({
      packList,
      candidates: [makeCandidate()],
      dictionaries: {
        en: { puzzles: { "test-bakery-window-card-1": { title: "Test Card", imageName: "Test Card" } } },
        ko: { puzzles: { "test-bakery-window-card-1": { title: "테스트 카드", imageName: "테스트 카드" } } }
      }
    });

    expect(result.ok).toBe(true);
    expect(formatPuzzleBatchValidation(result)).toContain("passed");
  });

  it("blocks duplicate ids, oversized boards, malformed rows, and missing copy", () => {
    const result = validatePuzzleBatch({
      packList,
      existingPuzzles: [makeCandidate()],
      candidates: [
        makeCandidate({
          size: 13,
          artReadability: null,
          solution: ["10"]
        })
      ],
      dictionaries: {
        en: { puzzles: {} },
        ko: { puzzles: {} }
      }
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain("test-bakery-window-card-1 duplicates an existing puzzle id");
    expect(result.errors).toContain("test-bakery-window-card-1 is 13x13 but pack test-bakery allows 12x12");
    expect(result.errors).toContain("test-bakery-window-card-1 solution should have 13 rows");
    expect(result.errors).toContain("test-bakery-window-card-1 missing en title/imageName copy");
    expect(result.errors).toContain("test-bakery-window-card-1 missing ko title/imageName copy");
    expect(result.errors).toContain("test-bakery-window-card-1 missing readable artReadability brief");
  });
});
