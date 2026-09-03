import { describe, expect, it } from "vitest";
import { hasBadgeArt } from "../src/data/badgeArt.js";
import { JAR_SHELVES } from "../src/data/pantryJars.js";
import { seasonShelves } from "../src/data/seasonShelves.js";
import { getSeasonShelvesForPantryShelf } from "../src/data/stagePantryLinks.js";
import { BADGE_MILESTONES } from "../src/game/badges.js";

describe("content progression impact graph", () => {
  it("covers every authored stage in exactly one badge milestone", () => {
    const badgeStageIds = BADGE_MILESTONES.flatMap((badge) => badge.shelfIds);
    const authoredStageIds = seasonShelves.map((shelf) => shelf.id);

    expect(badgeStageIds).toEqual(authoredStageIds);
    expect(new Set(badgeStageIds).size).toBe(badgeStageIds.length);
  });

  it("keeps badge sequence, grouping, final status, and runtime art complete", () => {
    const groupCounts = BADGE_MILESTONES.reduce((counts, badge) => {
      counts[badge.group] = (counts[badge.group] || 0) + 1;
      return counts;
    }, {});

    expect(BADGE_MILESTONES.map((badge) => badge.stage))
      .toEqual(BADGE_MILESTONES.map((_, index) => index));
    expect(new Set(BADGE_MILESTONES.map((badge) => badge.id)).size).toBe(BADGE_MILESTONES.length);
    expect(BADGE_MILESTONES.filter((badge) => badge.final)).toEqual([
      expect.objectContaining({ id: "badge-pip-sunset-feast" })
    ]);
    expect(BADGE_MILESTONES.filter((badge) => badge.seasonal)).toEqual([
      expect.objectContaining({ id: "badge-pip-korean-harvest" })
    ]);
    expect(BADGE_MILESTONES.every((badge) => hasBadgeArt(badge.id))).toBe(true);
    expect(groupCounts).toEqual({ A: 3, B: 3, C: 3, D: 3, E: 3, F: 1 });
  });

  it("keeps every gated stage connected to one paid Pantry shelf", () => {
    const stageIdsByPantryShelf = JAR_SHELVES.map((shelf) =>
      getSeasonShelvesForPantryShelf(shelf.id).map((stage) => stage.id)
    );
    const linkedStageIds = stageIdsByPantryShelf.flat();

    expect(stageIdsByPantryShelf.map((ids) => ids.length)).toEqual([1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
    expect(linkedStageIds).toEqual(
      seasonShelves.filter((shelf) => Number(shelf.pantryRoomStepRequired || 0) > 0).map((shelf) => shelf.id)
    );
    expect(new Set(linkedStageIds).size).toBe(linkedStageIds.length);
  });
});
