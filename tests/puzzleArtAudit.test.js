import { describe, expect, it } from "vitest";
import { buildPuzzleArtAudit } from "../scripts/puzzle_art_audit.js";

describe("puzzle art audit", () => {
  it("prioritizes duplicate silhouettes before softer composition warnings", () => {
    const report = buildPuzzleArtAudit({
      packIds: ["test-pack"],
      puzzleList: [
        { id: "a", title: "A", packId: "test-pack", size: 5, solution: ["11111", "10001", "10101", "10001", "11111"] },
        { id: "b", title: "B", packId: "test-pack", size: 5, solution: ["11111", "10001", "10101", "10001", "11111"] },
        { id: "c", title: "C", packId: "test-pack", size: 5, solution: ["00100", "00100", "00100", "00100", "00100"] }
      ]
    });

    expect(report.totals.duplicateSolutionGroups).toBe(1);
    expect(report.candidates[0].reasons).toContain("duplicate silhouette");
    expect(report.candidates[1].reasons).toContain("duplicate silhouette");
  });

  it("flags extreme density and multiple blank edges", () => {
    const report = buildPuzzleArtAudit({
      packIds: ["test-pack"],
      puzzleList: [
        { id: "thin", title: "Thin", packId: "test-pack", size: 5, solution: ["00000", "00100", "00100", "00100", "00000"] }
      ]
    });

    expect(report.candidates[0].reasons).toContain("extreme density 12%");
    expect(report.candidates[0].blankEdges).toBe(4);
  });

  it("keeps repaired Bakery and Village groups out of exact-duplicate findings", () => {
    const report = buildPuzzleArtAudit();
    const repairedIds = new Set([
      "bakery-window-plum-cardamom-braid-104",
      "bakery-window-cherry-almond-biscotti-110",
      "bakery-window-cherry-cream-crown-122",
      "bakery-window-lemon-thyme-crown-136",
      "village-pantry-blue-gingham-cloth-66",
      "village-pantry-wooden-egg-crate-76",
      "village-pantry-checkered-tea-towel-77",
      "village-pantry-cornflower-tea-canister-87",
      "village-pantry-daisy-milk-bottle-91",
      "village-pantry-blue-ribbon-mason-jar-95",
      "village-pantry-gingham-egg-cup-107",
      "village-pantry-checkered-napkin-ring-98",
      "village-pantry-green-label-tea-tin-101",
      "village-pantry-honey-label-crock-103",
      "village-pantry-little-cocoa-scoop-111",
      "village-pantry-copper-berry-scoop-128",
      "village-pantry-copper-honey-measure-135"
    ]);

    expect(report.duplicateSolutions.some((group) => group.some((id) => repairedIds.has(id)))).toBe(false);
    expect(report.totals.duplicateSolutionGroups).toBe(0);
  });

  it("keeps every Bakery and Village player-facing title distinct", () => {
    const report = buildPuzzleArtAudit();

    expect(report.duplicateTitles).toEqual([]);
    expect(report.totals.duplicateTitleGroups).toBe(0);
  });

  it("keeps the repaired Village compositions out of the art-review queue", () => {
    const report = buildPuzzleArtAudit();
    const repairedIds = new Set([
      "village-pantry-tea-tray-25",
      "village-pantry-flour-sack-27",
      "village-pantry-pickle-crocks-33",
      "village-pantry-copper-ladle-35",
      "village-pantry-potato-sack-36",
      "village-pantry-herb-bundle-39",
      "village-pantry-garden-window-22"
    ]);

    expect(report.candidates.some(({ id }) => repairedIds.has(id))).toBe(false);
  });

  it("keeps the first repaired Bakery compositions out of the art-review queue", () => {
    const report = buildPuzzleArtAudit();
    const repairedIds = new Set([
      "bakery-window-berry-jam-pot-37",
      "bakery-window-berry-tart-27",
      "bakery-window-cinnamon-rolls-32",
      "bakery-window-cocoa-tin-25",
      "bakery-window-cookie-jar-row-29",
      "bakery-window-croissant-22",
      "bakery-window-cup-stack-33"
    ]);

    expect(report.candidates.some(({ id }) => repairedIds.has(id))).toBe(false);
  });

  it("keeps the final repaired Bakery compositions out of the art-review queue", () => {
    const report = buildPuzzleArtAudit();
    const repairedIds = new Set([
      "bakery-window-honey-jar-shelf-26",
      "bakery-window-lemon-tart-34",
      "bakery-window-milk-glass-31",
      "bakery-window-pie-lattice-28",
      "bakery-window-pretzel-twist-36",
      "bakery-window-scone-basket-30",
      "bakery-window-tiered-cakes-23"
    ]);

    expect(report.candidates.some(({ id }) => repairedIds.has(id))).toBe(false);
  });
  it("keeps the first repaired Bakery density group out of the art-review queue", () => {
    const report = buildPuzzleArtAudit();
    const repairedIds = new Set([
      "bakery-window-almond-crescent-roll-98",
      "bakery-window-apricot-custard-bar-117",
      "bakery-window-apricot-jam-tart-82",
      "bakery-window-berry-cream-crown-92"
    ]);

    expect(report.candidates.some(({ id }) => repairedIds.has(id))).toBe(false);
  });

  it("keeps the second repaired Bakery density group out of the art-review queue", () => {
    const report = buildPuzzleArtAudit();
    const repairedIds = new Set([
      "bakery-window-blackberry-vanilla-galette-107",
      "bakery-window-blueberry-almond-square-133",
      "bakery-window-blueberry-cream-pinwheel-103",
      "bakery-window-caramel-fig-danish-102"
    ]);

    expect(report.candidates.some(({ id }) => repairedIds.has(id))).toBe(false);
  });

  it("keeps the third repaired Bakery density group out of the art-review queue", () => {
    const report = buildPuzzleArtAudit();
    const repairedIds = new Set([
      "bakery-window-caramel-pear-muffin-90",
      "bakery-window-cherry-cream-brioche-94",
      "bakery-window-cinnamon-honey-twist-101",
      "bakery-window-cocoa-almond-biscuit-93"
    ]);

    expect(report.candidates.some(({ id }) => repairedIds.has(id))).toBe(false);
  });

  it("keeps the fourth repaired Bakery density group out of the art-review queue", () => {
    const report = buildPuzzleArtAudit();
    const repairedIds = new Set([
      "bakery-window-cocoa-almond-biscuit-93",
      "bakery-window-cocoa-pear-tartlet-125",
      "bakery-window-fig-honey-pinwheel-124",
      "bakery-window-ginger-honey-madeleine-95",
      "bakery-window-hazelnut-cocoa-tart-115"
    ]);

    expect(report.candidates.some(({ id }) => repairedIds.has(id))).toBe(false);
  });

  it("keeps the fifth repaired Bakery density group out of the art-review queue", () => {
    const report = buildPuzzleArtAudit();
    const repairedIds = new Set([
      "bakery-window-hazelnut-praline-square-86",
      "bakery-window-honey-lavender-canele-105",
      "bakery-window-lavender-shortbread-tin-80",
      "bakery-window-lemon-curd-rosette-87"
    ]);

    expect(report.candidates.some(({ id }) => repairedIds.has(id))).toBe(false);
  });

  it("keeps the sixth repaired Bakery density group out of the art-review queue", () => {
    const report = buildPuzzleArtAudit();
    const repairedIds = new Set([
      "bakery-window-lemon-poppy-pound-cake-111",
      "bakery-window-lemon-ribbon-tart-97",
      "bakery-window-mocha-cream-roll-109",
      "bakery-window-orange-blossom-cruller-106"
    ]);

    expect(report.candidates.some(({ id }) => repairedIds.has(id))).toBe(false);
  });

  it("keeps the seventh repaired Bakery density group out of the art-review queue", () => {
    const report = buildPuzzleArtAudit();
    const repairedIds = new Set([
      "bakery-window-peach-cream-tartlet-79",
      "bakery-window-pistachio-glaze-donut-89",
      "bakery-window-peach-custard-square-99",
      "bakery-window-pear-ginger-turnover-108"
    ]);

    expect(report.candidates.some(({ id }) => repairedIds.has(id))).toBe(false);
  });


  it("keeps the eighth repaired Bakery density group out of the art-review queue", () => {
    const report = buildPuzzleArtAudit();
    const repairedIds = new Set([
      "bakery-window-recipe-card-4",
      "bakery-window-bread-loaf-8",
      "bakery-window-raspberry-choux-puff-96",
      "bakery-window-plum-cream-danish-128"
    ]);

    expect(report.candidates.some(({ id }) => repairedIds.has(id))).toBe(false);
  });

});
