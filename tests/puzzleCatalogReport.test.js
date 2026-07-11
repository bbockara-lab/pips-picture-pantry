import { describe, expect, it } from "vitest";
import { buildPuzzleCatalogReport } from "../scripts/puzzle_catalog_report.js";

describe("puzzle catalog report", () => {
  it("summarizes launch catalog scale by pack and board size", () => {
    const report = buildPuzzleCatalogReport();
    const bakeryWindow = report.byPack.find((pack) => pack.id === "bakery-window");
    const villagePantry = report.byPack.find((pack) => pack.id === "village-pantry");

    expect(report.warningMessages).toEqual([]);
    expect(report.totals.freePuzzles).toBeGreaterThanOrEqual(287);
    expect(report.totals.twelveByTwelveBoards).toBeGreaterThanOrEqual(93);
    expect(report.totals.readableLargeBoards).toBeGreaterThanOrEqual(149);
    expect(report.launchTarget.targetFreePuzzles).toBe(333);
    expect(report.launchTarget.remainingFreePuzzles).toBeLessThanOrEqual(46);
    expect(report.launchTarget.shouldPrioritizePolish).toBe(true);
    expect(bakeryWindow.twelveByTwelveCount).toBeGreaterThanOrEqual(93);
    expect(villagePantry.largeBoardCount).toBeGreaterThanOrEqual(100);
  });

  it("reports launch-target progress for smaller catalogs", () => {
    const report = buildPuzzleCatalogReport({
      packList: [],
      puzzleList: [
        { id: "starter-1", access: "free", size: 5 },
        { id: "starter-2", access: "free", size: 5 },
        { id: "bonus-1", access: "bonus-pack", size: 5 }
      ],
      dictionaries: { en: {}, ko: {} }
    });

    expect(report.launchTarget).toEqual({
      targetFreePuzzles: 333,
      remainingFreePuzzles: 331,
      progressPercent: 1,
      shouldPrioritizePolish: false
    });
  });

  it("warns when recent large-board progression puzzles lack readable art briefs", () => {
    const report = buildPuzzleCatalogReport({
      packList: [
        {
          id: "test-pack",
          access: "free",
          monetizationRole: "free-progression",
          size: 10
        }
      ],
      puzzleList: [
        {
          id: "test-pack-big-card-40",
          title: "Big Card",
          titleKey: "puzzles.test-pack-big-card-40",
          packId: "test-pack",
          access: "free",
          size: 10,
          solution: []
        }
      ],
      dictionaries: {
        en: { puzzles: { "test-pack-big-card-40": { title: "Big Card", imageName: "Big Card" } } },
        ko: { puzzles: { "test-pack-big-card-40": { title: "큰 카드", imageName: "큰 카드" } } }
      }
    });

    expect(report.warningMessages).toContain("test-pack-big-card-40 missing readable artReadability brief");
  });

  it("warns when large-board progression puzzles lack translated catalog metadata", () => {
    const report = buildPuzzleCatalogReport({
      packList: [
        {
          id: "test-pack",
          access: "free",
          monetizationRole: "free-progression",
          size: 10
        }
      ],
      puzzleList: [
        {
          id: "test-pack-big-card-1",
          title: "Big Card",
          packId: "test-pack",
          access: "free",
          size: 10,
          solution: []
        }
      ],
      dictionaries: {
        en: { puzzles: {} },
        ko: { puzzles: {} }
      }
    });

    expect(report.warningMessages).toContain("test-pack-big-card-1 missing titleKey puzzles.test-pack-big-card-1");
  });
});
