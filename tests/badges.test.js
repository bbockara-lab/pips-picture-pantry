import { describe, expect, it } from "vitest";
import { puzzlePacks } from "../src/data/packs.js";
import { puzzles } from "../src/data/puzzles.js";
import { getEarnedPackBadges, getNextBadgeProgress, getPackBadgeStatus } from "../src/game/badges.js";

describe("pack badges", () => {
  it("tracks the next pack badge before a stage is complete", () => {
    const firstPack = puzzlePacks.find((pack) => pack.id === "pips-first-shelf");
    const firstTwo = puzzles.filter((puzzle) => puzzle.packId === firstPack.id).slice(0, 2).map((puzzle) => puzzle.id);
    const next = getNextBadgeProgress(firstTwo);

    expect(next.pack.id).toBe("pips-first-shelf");
    expect(next.completed).toBe(2);
    expect(next.total).toBe(20);
    expect(next.earned).toBe(false);
  });

  it("marks a stage badge earned when all pack puzzles are complete", () => {
    const firstPackIds = puzzles.filter((puzzle) => puzzle.packId === "pips-first-shelf").map((puzzle) => puzzle.id);
    const earned = getEarnedPackBadges(firstPackIds);

    expect(getPackBadgeStatus(firstPackIds).find((status) => status.pack.id === "pips-first-shelf").earned).toBe(true);
    expect(earned.map((status) => status.pack.id)).toContain("pips-first-shelf");
    expect(getNextBadgeProgress(firstPackIds).pack.id).toBe("sunny-spoon-sign");
  });
});
