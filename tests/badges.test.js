import { describe, expect, it } from "vitest";
import { getSeasonShelfPuzzles, seasonShelves } from "../src/data/seasonShelves.js";
import { getEarnedPackBadges, getNextBadgeProgress, getPackBadgeStatus } from "../src/game/badges.js";

describe("shelf badges", () => {
  it("tracks the next shelf badge before a shelf is complete", () => {
    const firstTwo = getSeasonShelfPuzzles(seasonShelves[0]).slice(0, 2).map((puzzle) => puzzle.id);
    const next = getNextBadgeProgress(firstTwo);

    expect(next.shelf.id).toBe("shelf-pips-first");
    expect(next.completed).toBe(2);
    expect(next.total).toBe(20);
    expect(next.earned).toBe(false);
  });

  it("marks a keepsake badge earned when its shelf is complete", () => {
    const firstShelfIds = getSeasonShelfPuzzles(seasonShelves[0]).map((puzzle) => puzzle.id);
    const earned = getEarnedPackBadges(firstShelfIds);

    expect(getPackBadgeStatus(firstShelfIds).find((status) => status.shelf.id === "shelf-pips-first").earned).toBe(true);
    expect(earned.map((status) => status.shelf.id)).toContain("shelf-pips-first");
    expect(getNextBadgeProgress(firstShelfIds).shelf.id).toBe("shelf-sunny-counter");
  });
});
