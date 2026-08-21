import { getSeasonShelfById, getSeasonShelfPuzzles } from "../data/seasonShelves.js";
import { isKoreanHarvestContentRuntimeReady } from "../data/koreanHarvestContent.js";

const koreanHarvestIsLive = isKoreanHarvestContentRuntimeReady();

export const BADGE_MILESTONES = Object.freeze([
  { stage: 0, group: "A", shelfIds: ["shelf-pips-first"], id: "badge-pips-first-shelf", titleKey: "shelves.pipsFirst" },
  { stage: 1, group: "A", shelfIds: ["shelf-sunny-counter"], id: "badge-sunny-spoon-sign", titleKey: "shelves.sunnyCounter" },
  { stage: 2, group: "A", shelfIds: ["shelf-apron-drawer"], id: "badge-apron-drawer", titleKey: "shelves.apronDrawer" },
  { stage: 3, group: "B", shelfIds: ["shelf-market-counter", "shelf-window-table"], id: "badge-pip-bakery-door", titleKey: "shelves.windowTable" },
  { stage: 4, group: "B", shelfIds: ["shelf-morning-bakery", "shelf-pastry-corner"], id: "badge-pip-pastry-morning", titleKey: "shelves.pastryCorner" },
  { stage: 5, group: "B", shelfIds: ["shelf-tin-row", "shelf-bakery-window"], id: "badge-pip-tin-collection", titleKey: "shelves.bakeryWindow" },
  { stage: 6, group: "C", shelfIds: ["shelf-village-square", "shelf-market-table"], id: "badge-pip-village-path", titleKey: "shelves.marketTable" },
  { stage: 7, group: "C", shelfIds: ["shelf-clock-corner", "shelf-bakery-walk"], id: "badge-pip-clock-corner", titleKey: "shelves.bakeryWalk" },
  { stage: 8, group: "C", shelfIds: ["shelf-garden-path", "shelf-village-pantry"], id: "badge-pip-full-pantry", titleKey: "shelves.villagePantry" },
  { stage: 9, group: "D", shelfIds: ["shelf-herb-terrace", "shelf-sunroom-table"], id: "badge-pip-sunroom-botanicals", titleKey: "shelves.sunroomTable" },
  { stage: 10, group: "D", shelfIds: ["shelf-orchard-window", "shelf-lantern-courtyard"], id: "badge-pip-orchard-lantern", titleKey: "shelves.lanternCourtyard" },
  { stage: 11, group: "D", shelfIds: ["shelf-moonlit-veranda", "shelf-hearth-gallery"], id: "badge-pip-hearth-gallery", titleKey: "shelves.hearthGallery" },
  { stage: 12, group: "E", shelfIds: ["shelf-summer-window", "shelf-fruit-market"], id: "badge-pip-summer-market", titleKey: "shelves.fruitMarket" },
  { stage: 13, group: "E", shelfIds: ["shelf-garden-basket", "shelf-picnic-lawn"], id: "badge-pip-picnic-lawn", titleKey: "shelves.picnicLawn" },
  { stage: 14, group: "E", shelfIds: ["shelf-seaside-table", "shelf-sunset-feast"], id: "badge-pip-sunset-feast", titleKey: "shelves.sunsetFeast", final: !koreanHarvestIsLive },
  ...(koreanHarvestIsLive ? [{
    stage: 15,
    group: "F",
    shelfIds: ["shelf-korean-harvest-1", "shelf-korean-harvest-2", "shelf-korean-harvest-3", "shelf-korean-harvest-4"],
    id: "badge-korean-harvest",
    titleKey: "badges.koreanHarvest",
    final: true
  }] : [])
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
