import { describe, expect, it } from "vitest";
import {
  COZY_WORKSHOP_BAKING_BENCH_PUZZLES,
  COZY_WORKSHOP_GARDEN_NOOK_PUZZLES,
  COZY_WORKSHOP_MORNING_TABLE_PUZZLES,
  COZY_WORKSHOP_PUZZLES,
  COZY_WORKSHOP_STARLIGHT_SHELF_PUZZLES,
  COZY_WORKSHOP_VILLAGE_CART_PUZZLES
} from "../src/data/cozyWorkshopPuzzles.js";
import { getSeasonShelfById, getSeasonShelfPuzzles } from "../src/data/seasonShelves.js";
import { countNonogramSolutions } from "../src/game/nonogramUniqueness.js";
import { en } from "../src/i18n/en.js";
import { ko } from "../src/i18n/ko.js";

describe("Cozy Workshop expansion", () => {
  it("ships the first stage as exactly twenty 10x10 pictures", () => {
    expect(COZY_WORKSHOP_MORNING_TABLE_PUZZLES).toHaveLength(20);
    expect(new Set(COZY_WORKSHOP_MORNING_TABLE_PUZZLES.map((puzzle) => puzzle.id)).size).toBe(20);
    expect(COZY_WORKSHOP_MORNING_TABLE_PUZZLES.every((puzzle) => puzzle.size === 10)).toBe(true);
  });

  it("assigns every picture to the Morning Table shelf", () => {
    const shelf = getSeasonShelfById("shelf-cozy-workshop-morning-table");
    expect(shelf?.artPackId).toBe("cozy-workshop-morning-table");
    expect(getSeasonShelfPuzzles(shelf).map((puzzle) => puzzle.id)).toEqual(
      COZY_WORKSHOP_MORNING_TABLE_PUZZLES.map((puzzle) => puzzle.id)
    );
  });

  it("ships Baking Bench as the second twenty-picture stage", () => {
    expect(COZY_WORKSHOP_BAKING_BENCH_PUZZLES).toHaveLength(20);
    expect(new Set(COZY_WORKSHOP_PUZZLES.map((puzzle) => puzzle.id)).size).toBe(100);
    expect(COZY_WORKSHOP_BAKING_BENCH_PUZZLES.every((puzzle) => puzzle.size === 10)).toBe(true);

    const shelf = getSeasonShelfById("shelf-cozy-workshop-baking-bench");
    expect(shelf?.artPackId).toBe("cozy-workshop-baking-bench");
    expect(getSeasonShelfPuzzles(shelf).map((puzzle) => puzzle.id)).toEqual(
      COZY_WORKSHOP_BAKING_BENCH_PUZZLES.map((puzzle) => puzzle.id)
    );
  });

  it("ships Garden Nook as the third twenty-picture stage", () => {
    expect(COZY_WORKSHOP_GARDEN_NOOK_PUZZLES).toHaveLength(20);
    expect(COZY_WORKSHOP_PUZZLES).toHaveLength(100);
    expect(COZY_WORKSHOP_GARDEN_NOOK_PUZZLES.every((puzzle) => puzzle.size === 10)).toBe(true);

    const shelf = getSeasonShelfById("shelf-cozy-workshop-garden-nook");
    expect(shelf?.artPackId).toBe("cozy-workshop-garden-nook");
    expect(getSeasonShelfPuzzles(shelf).map((puzzle) => puzzle.id)).toEqual(
      COZY_WORKSHOP_GARDEN_NOOK_PUZZLES.map((puzzle) => puzzle.id)
    );
  });

  it("ships Village Cart as the fourth twenty-picture stage", () => {
    expect(COZY_WORKSHOP_VILLAGE_CART_PUZZLES).toHaveLength(20);
    expect(COZY_WORKSHOP_VILLAGE_CART_PUZZLES.every((puzzle) => puzzle.size === 10)).toBe(true);

    const shelf = getSeasonShelfById("shelf-cozy-workshop-village-cart");
    expect(shelf?.artPackId).toBe("cozy-workshop-village-cart");
    expect(getSeasonShelfPuzzles(shelf).map((puzzle) => puzzle.id)).toEqual(
      COZY_WORKSHOP_VILLAGE_CART_PUZZLES.map((puzzle) => puzzle.id)
    );
  });

  it("ships Starlight Shelf as the fifth and final twenty-picture stage", () => {
    expect(COZY_WORKSHOP_STARLIGHT_SHELF_PUZZLES).toHaveLength(20);
    expect(COZY_WORKSHOP_STARLIGHT_SHELF_PUZZLES.every((puzzle) => puzzle.size === 10)).toBe(true);

    const shelf = getSeasonShelfById("shelf-cozy-workshop-starlight-shelf");
    expect(shelf?.artPackId).toBe("cozy-workshop-starlight-shelf");
    expect(getSeasonShelfPuzzles(shelf).map((puzzle) => puzzle.id)).toEqual(
      COZY_WORKSHOP_STARLIGHT_SHELF_PUZZLES.map((puzzle) => puzzle.id)
    );
  });

  it("has bilingual copy, readable briefs, and unique clues", () => {
    COZY_WORKSHOP_PUZZLES.forEach((puzzle) => {
      expect(en.puzzles[puzzle.id]?.title).toBeTruthy();
      expect(ko.puzzles[puzzle.id]?.title).toBeTruthy();
      expect(puzzle.artReadability.tags.length).toBeGreaterThanOrEqual(2);
      expect(countNonogramSolutions(puzzle.solution)).toBe(1);
    });
  });
});
