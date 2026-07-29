import { describe, expect, it } from "vitest";
import { getSeasonShelfPuzzles, seasonShelves } from "../src/data/seasonShelves.js";
import {
  BADGE_MILESTONES,
  getBadgeForCompletedShelf,
  getEarnedPackBadges,
  getNextBadgeProgress,
  getPackBadgeStatus
} from "../src/game/badges.js";

describe("nine-stage shelf badges", () => {
  it("maps nine badges across three shelf groups", () => {
    expect(BADGE_MILESTONES).toHaveLength(9);
    expect(BADGE_MILESTONES.map((badge) => badge.stage)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    expect(BADGE_MILESTONES.map((badge) => badge.group)).toEqual(["A", "A", "A", "B", "B", "B", "C", "C", "C"]);
    expect(BADGE_MILESTONES.at(-1)).toMatchObject({ id: "badge-pip-full-pantry", final: true });
  });

  it("tracks the next badge before its milestone is complete", () => {
    const firstTwo = getSeasonShelfPuzzles(seasonShelves[0]).slice(0, 2).map((puzzle) => puzzle.id);
    const next = getNextBadgeProgress(firstTwo);

    expect(next.shelf.id).toBe("shelf-pips-first");
    expect(next.completed).toBe(2);
    expect(next.total).toBe(20);
    expect(next.earned).toBe(false);
  });

  it("earns grouped stage badges only at the group endpoint", () => {
    const stageThreeIds = [seasonShelves[3], seasonShelves[4]]
      .flatMap((shelf) => getSeasonShelfPuzzles(shelf).map((puzzle) => puzzle.id));
    const statuses = getPackBadgeStatus(stageThreeIds);
    const stageThree = statuses.find((status) => status.badge.stage === 3);

    expect(stageThree.total).toBe(44);
    expect(stageThree.earned).toBe(true);
    expect(getBadgeForCompletedShelf("shelf-market-counter", stageThreeIds)).toBeNull();
    expect(getBadgeForCompletedShelf("shelf-window-table", stageThreeIds)?.badge.id).toBe("badge-pip-bakery-door");
  });

  it("marks a keepsake earned and advances to the next milestone", () => {
    const firstShelfIds = getSeasonShelfPuzzles(seasonShelves[0]).map((puzzle) => puzzle.id);
    const earned = getEarnedPackBadges(firstShelfIds);

    expect(getPackBadgeStatus(firstShelfIds)[0].earned).toBe(true);
    expect(earned.map((status) => status.badge.id)).toContain("badge-pips-first-shelf");
    expect(getNextBadgeProgress(firstShelfIds).shelf.id).toBe("shelf-sunny-counter");
  });
});
