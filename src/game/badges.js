import { getSeasonShelfById, getSeasonShelfPuzzles } from "../data/seasonShelves.js";

// Five keepsake badges mark story milestones, not the old oversized packs.
// The existing approved art stays meaningful while progress now follows the
// short shelves players actually see.
const SHELF_BADGES = [
  { shelfId: "shelf-pips-first", id: "badge-pips-first-shelf", titleKey: "shelves.pipsFirst" },
  { shelfId: "shelf-sunny-counter", id: "badge-sunny-spoon-sign", titleKey: "shelves.sunnyCounter" },
  { shelfId: "shelf-apron-drawer", id: "badge-apron-drawer", titleKey: "shelves.apronDrawer" },
  { shelfId: "shelf-bakery-window", id: "badge-bakery-window", titleKey: "shelves.bakeryWindow" },
  { shelfId: "shelf-village-pantry", id: "badge-village-pantry", titleKey: "shelves.villagePantry" }
];

export function getPackBadgeStatus(completedPuzzleIds) {
  const completedSet = new Set(completedPuzzleIds || []);
  return SHELF_BADGES.map((badge) => {
    const shelf = getSeasonShelfById(badge.shelfId);
    const shelfPuzzles = getSeasonShelfPuzzles(shelf);
    const completed = shelfPuzzles.filter((puzzle) => completedSet.has(puzzle.id)).length;
    const total = shelfPuzzles.length;
    return {
      shelf,
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
