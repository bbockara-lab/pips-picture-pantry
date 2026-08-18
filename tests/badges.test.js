import { describe, expect, it } from "vitest";
import { getSeasonShelfById, getSeasonShelfPuzzles, seasonShelves } from "../src/data/seasonShelves.js";
import {
  BADGE_MILESTONES,
  getBadgeForCompletedShelf,
  getEarnedPackBadges,
  getNextBadgeProgress,
  getPackBadgeStatus
} from "../src/game/badges.js";

describe("fifteen-stage shelf badges", () => {
  it("maps fifteen badges across five shelf groups", () => {
    expect(BADGE_MILESTONES).toHaveLength(15);
    expect(BADGE_MILESTONES.map((badge) => badge.stage)).toEqual(Array.from({ length: 15 }, (_, index) => index));
    expect(BADGE_MILESTONES.map((badge) => badge.group)).toEqual(["A", "A", "A", "B", "B", "B", "C", "C", "C", "D", "D", "D", "E", "E", "E"]);
    expect(BADGE_MILESTONES.at(-1)).toMatchObject({ id: "badge-pip-sunset-feast", final: true });
  });

  it("keeps each summer Pantry shelf in its own two-stage badge milestone", () => {
    expect(BADGE_MILESTONES.slice(-3).map((badge) => badge.shelfIds)).toEqual([
      ["shelf-summer-window", "shelf-fruit-market"],
      ["shelf-garden-basket", "shelf-picnic-lawn"],
      ["shelf-seaside-table", "shelf-sunset-feast"]
    ]);
  });

  it("keeps each Step 62 shelf in its own two-shelf badge milestone", () => {
    expect(BADGE_MILESTONES.slice(9, 12).map((badge) => badge.shelfIds)).toEqual([
      ["shelf-herb-terrace", "shelf-sunroom-table"],
      ["shelf-orchard-window", "shelf-lantern-courtyard"],
      ["shelf-moonlit-veranda", "shelf-hearth-gallery"]
    ]);
    expect(BADGE_MILESTONES[8].shelfIds).toEqual(["shelf-garden-path", "shelf-village-pantry"]);
  });

  it("uses the canonical shelf name for every badge milestone", () => {
    BADGE_MILESTONES.forEach((badge) => {
      const displayShelf = getSeasonShelfById(badge.shelfIds.at(-1));
      expect(badge.titleKey).toBe(displayShelf.titleKey);
      expect(badge.titleKey).toMatch(/^shelves\./);
    });
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
