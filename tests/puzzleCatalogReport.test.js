import { describe, expect, it } from "vitest";
import { buildPuzzleCatalogReport } from "../scripts/puzzle_catalog_report.js";

describe("puzzle catalog report", () => {
  it("summarizes launch catalog scale by pack and board size", () => {
    const report = buildPuzzleCatalogReport();
    const bakeryWindow = report.byPack.find((pack) => pack.id === "bakery-window");
    const villagePantry = report.byPack.find((pack) => pack.id === "village-pantry");

    expect(report.warningMessages).toEqual([]);
    expect(report.totals.freePuzzles).toBeGreaterThanOrEqual(263);
    expect(report.totals.twelveByTwelveBoards).toBeGreaterThanOrEqual(81);
    expect(report.totals.readableLargeBoards).toBeGreaterThanOrEqual(125);
    expect(bakeryWindow.twelveByTwelveCount).toBeGreaterThanOrEqual(81);
    expect(villagePantry.largeBoardCount).toBeGreaterThanOrEqual(88);
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
