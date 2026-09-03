import { describe, expect, it } from "vitest";
import { PANTRY_JARS, JAR_SHELVES } from "../src/data/pantryJars.js";
import { puzzles } from "../src/data/puzzles.js";
import { seasonShelves, getSeasonShelfSizeCounts } from "../src/data/seasonShelves.js";
import { BADGE_MILESTONES } from "../src/game/badges.js";
import { buildSummerPuzzleArtReviewHtml } from "../scripts/summer_puzzle_art_review.js";
import { NATIVE_SUMMER_ART, REVIEWED_SUMMER_ART } from "../src/data/summerPuzzleArt.js";

const SUMMER_SHELF_IDS = [
  "shelf-summer-window",
  "shelf-fruit-market",
  "shelf-garden-basket",
  "shelf-picnic-lawn",
  "shelf-seaside-table",
  "shelf-sunset-feast"
];

const SUMMER_COLLECTION_SHELF_IDS = ["summer-orchard", "sunny-garden", "picnic-table"];
const CLAUDE_REVIEWED_ART_IDS = [
  1, 13, 15, 17, 20, 21, 23, 30, 32,
  43, 46, 63, 70, 72, 75, 79, 85, 86
];

function filledCellDistance(rowsA, rowsB) {
  const cellsA = rowsA.join("");
  const cellsB = rowsB.join("");
  let union = 0;
  let difference = 0;

  for (let index = 0; index < cellsA.length; index += 1) {
    if (cellsA[index] === "1" || cellsB[index] === "1") union += 1;
    if (cellsA[index] !== cellsB[index]) difference += 1;
  }

  return difference / union;
}

describe("Android 48 / iOS build 2 summer content contract", () => {
  it("requires every summer puzzle to use a title-specific final-grid drawing", () => {
    const summerPuzzles = puzzles.filter((puzzle) => puzzle.packId === "summer-pantry");

    expect(Object.keys(NATIVE_SUMMER_ART)).toHaveLength(100);
    summerPuzzles.forEach((puzzle, index) => {
      const rows = NATIVE_SUMMER_ART[index + 1];
      expect(rows, `${puzzle.title} is missing native art`).toBeDefined();
      expect(rows, `${puzzle.title} has the wrong height`).toHaveLength(puzzle.size);
      expect(rows.every((row) => row.length === puzzle.size), `${puzzle.title} has the wrong width`).toBe(true);
      expect(rows.every((row) => /^[01]+$/.test(row)), `${puzzle.title} contains invalid cells`).toBe(true);
    });
  });

  it("keeps every silhouette called out by the Claude art review on its direct final-grid drawing", () => {
    expect(Object.keys(REVIEWED_SUMMER_ART).map(Number).sort((a, b) => a - b))
      .toEqual(CLAUDE_REVIEWED_ART_IDS);

    CLAUDE_REVIEWED_ART_IDS.forEach((number) => {
      expect(NATIVE_SUMMER_ART[number]).toBeDefined();
      expect(NATIVE_SUMMER_ART[number]).toHaveLength(REVIEWED_SUMMER_ART[number].length);
    });
  });

  it("prevents the reviewed summer silhouettes from collapsing back into near-identical blobs", () => {
    const idsBySize = new Map();
    CLAUDE_REVIEWED_ART_IDS.forEach((number) => {
      const size = NATIVE_SUMMER_ART[number].length;
      idsBySize.set(size, [...(idsBySize.get(size) ?? []), number]);
    });

    idsBySize.forEach((numbers) => {
      for (let left = 0; left < numbers.length; left += 1) {
        for (let right = left + 1; right < numbers.length; right += 1) {
          const leftId = numbers[left];
          const rightId = numbers[right];
          const distance = filledCellDistance(
            NATIVE_SUMMER_ART[leftId],
            NATIVE_SUMMER_ART[rightId]
          );
          expect(
            distance,
            `summer puzzles ${leftId} and ${rightId} are too visually similar`
          ).toBeGreaterThanOrEqual(0.35);
        }
      }
    });
  });

  it("preserves the 100-picture summer expansion inside the 616-picture live catalog", () => {
    const summerPuzzles = puzzles.filter((puzzle) => puzzle.packId === "summer-pantry");
    const bySize = summerPuzzles.reduce((counts, puzzle) => {
      counts[puzzle.size] = (counts[puzzle.size] || 0) + 1;
      return counts;
    }, {});

    expect(puzzles).toHaveLength(616);
    expect(summerPuzzles).toHaveLength(100);
    expect(bySize).toEqual({ 5: 12, 8: 28, 10: 36, 12: 24 });
    expect(new Set(puzzles.map((puzzle) => puzzle.id)).size).toBe(616);
    expect(new Set(summerPuzzles.map((puzzle) => puzzle.solution.join("/"))).size).toBe(100);
    expect(summerPuzzles.every((puzzle) => puzzle.titleKey && puzzle.completionPalette)).toBe(true);
  });

  it("renders all summer solutions with bilingual titles for manual art review", () => {
    const summerPuzzles = puzzles.filter((puzzle) => puzzle.packId === "summer-pantry");
    const html = buildSummerPuzzleArtReviewHtml(summerPuzzles);

    expect(html.match(/<article>/g)).toHaveLength(100);
    summerPuzzles.forEach((puzzle) => {
      expect(html).toContain(puzzle.title);
      expect(html).toContain(puzzle.titleKo);
    });
  });

  it("assigns every new puzzle exactly once across six summer stages", () => {
    const summerShelves = seasonShelves.filter((shelf) => SUMMER_SHELF_IDS.includes(shelf.id));
    expect(seasonShelves).toHaveLength(31);
    expect(summerShelves.map((shelf) => shelf.id)).toEqual(SUMMER_SHELF_IDS);
    expect(summerShelves.map((shelf) => shelf.puzzleIds.length)).toEqual([16, 16, 17, 17, 17, 17]);
    expect(summerShelves.map((shelf) => shelf.pantryRoomStepRequired)).toEqual([60, 60, 65, 65, 70, 70]);
    expect(summerShelves.map((shelf) => getSeasonShelfSizeCounts(shelf))).toEqual([
      { 5: 6, 8: 10 },
      { 5: 6, 8: 10 },
      { 8: 4, 10: 9, 12: 4 },
      { 8: 4, 10: 9, 12: 4 },
      { 10: 9, 12: 8 },
      { 10: 9, 12: 8 }
    ]);
    expect(new Set(summerShelves.flatMap((shelf) => shelf.puzzleIds)).size).toBe(100);
  });

  it("adds three shape-neutral summer collectible shelves and preserves the spoon sink", () => {
    const summerCollectibles = PANTRY_JARS.filter((item) => SUMMER_COLLECTION_SHELF_IDS.includes(item.shelfId));
    expect(JAR_SHELVES).toHaveLength(14);
    expect(PANTRY_JARS).toHaveLength(84);
    expect(PANTRY_JARS.filter((item) => item.cost > 0)).toHaveLength(70);
    expect(PANTRY_JARS.reduce((total, item) => total + item.cost, 0)).toBe(10655);
    expect(summerCollectibles).toHaveLength(18);
    expect(summerCollectibles.every((item) => item.collectibleType && item.displayStyle)).toBe(true);
    expect(new Set(summerCollectibles.map((item) => item.collectibleType)).size).toBeGreaterThan(3);
    SUMMER_COLLECTION_SHELF_IDS.forEach((shelfId) => {
      const items = summerCollectibles.filter((item) => item.shelfId === shelfId);
      expect(items).toHaveLength(6);
      expect(items.filter((item) => item.rarity === "starter")).toHaveLength(1);
    });
  });

  it("keeps badge group E intact before the Korean Harvest finale", () => {
    expect(BADGE_MILESTONES).toHaveLength(16);
    expect(BADGE_MILESTONES.filter((badge) => badge.group === "E")).toHaveLength(3);
    expect(BADGE_MILESTONES.filter((badge) => badge.final)).toEqual([
      expect.objectContaining({ id: "badge-pip-sunset-feast" })
    ]);
    expect(BADGE_MILESTONES.filter((badge) => badge.seasonal)).toEqual([
      expect.objectContaining({ id: "badge-pip-korean-harvest" })
    ]);
    expect(BADGE_MILESTONES.flatMap((badge) => badge.shelfIds)).toEqual(
      seasonShelves.map((shelf) => shelf.id)
    );
  });

  it("keeps the new one-time spoon supply well below its matching collectible sink", () => {
    const summerPuzzleReward = puzzles
      .filter((puzzle) => puzzle.packId === "summer-pantry")
      .reduce((total, puzzle) => total + puzzle.reward, 0);
    const summerStageReward = seasonShelves
      .filter((shelf) => SUMMER_SHELF_IDS.includes(shelf.id))
      .reduce((total, shelf) => total + shelf.stageBonus, 0);
    const summerPaidCost = PANTRY_JARS
      .filter((item) => SUMMER_COLLECTION_SHELF_IDS.includes(item.shelfId))
      .reduce((total, item) => total + item.cost, 0);

    expect(summerPuzzleReward).toBe(644);
    expect(summerStageReward).toBe(240);
    expect(summerPaidCost).toBe(4240);
    expect(summerPuzzleReward + summerStageReward).toBeLessThan(summerPaidCost);
  });
});
