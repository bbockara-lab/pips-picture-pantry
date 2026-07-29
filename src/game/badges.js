import { getSeasonShelfById, getSeasonShelfPuzzles } from "../data/seasonShelves.js";

export const BADGE_MILESTONES = Object.freeze([
  { stage: 0, group: "A", shelfIds: ["shelf-pips-first"], id: "badge-pips-first-shelf", titleKey: "badges.pipsFirstShelf" },
  { stage: 1, group: "A", shelfIds: ["shelf-sunny-counter"], id: "badge-sunny-spoon-sign", titleKey: "badges.sunnySpoonSign" },
  { stage: 2, group: "A", shelfIds: ["shelf-apron-drawer"], id: "badge-apron-drawer", titleKey: "badges.apronDrawer" },
  { stage: 3, group: "B", shelfIds: ["shelf-market-counter", "shelf-window-table"], id: "badge-pip-bakery-door", titleKey: "badges.pipBakeryDoor" },
  { stage: 4, group: "B", shelfIds: ["shelf-morning-bakery", "shelf-pastry-corner"], id: "badge-pip-pastry-morning", titleKey: "badges.pipPastryMorning" },
  { stage: 5, group: "B", shelfIds: ["shelf-tin-row", "shelf-bakery-window"], id: "badge-pip-tin-collection", titleKey: "badges.pipTinCollection" },
  { stage: 6, group: "C", shelfIds: ["shelf-village-square", "shelf-market-table"], id: "badge-pip-village-path", titleKey: "badges.pipVillagePath" },
  { stage: 7, group: "C", shelfIds: ["shelf-clock-corner", "shelf-bakery-walk"], id: "badge-pip-clock-corner", titleKey: "badges.pipClockCorner" },
  { stage: 8, group: "C", shelfIds: ["shelf-garden-path", "shelf-village-pantry"], id: "badge-pip-full-pantry", titleKey: "badges.pipFullPantry", final: true }
]);

function getMilestonePuzzles(milestone) {
  return milestone.shelfIds.flatMap((shelfId) => getSeasonShelfPuzzles(getSeasonShelfById(shelfId)));
}

export function getPackBadgeStatus(completedPuzzleIds) {
  const completedSet = new Set(completedPuzzleIds || []);
  return BADGE_MILESTONES.map((badge) => {
    const milestonePuzzles = getMilestonePuzzles(badge);
    const completed = milestonePuzzles.filter((puzzle) => completedSet.has(puzzle.id)).length;
    const total = milestonePuzzles.length;
    return {
      shelf: getSeasonShelfById(badge.shelfIds[badge.shelfIds.length - 1]),
      badge,
      completed,
      total,
      earned: total > 0 && completed >= total
    };
  });
}

export function getNextBadgeProgress(completedPuzzleIds) {
  return getPackBadgeStatus(completedPuzzleIds).find((status) => !status.earned) || null;
}

export function getEarnedPackBadges(completedPuzzleIds) {
  return getPackBadgeStatus(completedPuzzleIds).filter((status) => status.earned);
}

export function getBadgeForCompletedShelf(shelfId, completedPuzzleIds) {
  return getPackBadgeStatus(completedPuzzleIds).find((status) =>
    status.badge.shelfIds.at(-1) === shelfId && status.earned
  ) || null;
}
