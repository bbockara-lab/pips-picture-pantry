import { puzzlePacks } from "../data/packs.js";
import { puzzles } from "../data/puzzles.js";

export function getPackBadgeStatus(completedPuzzleIds) {
  const completedSet = new Set(completedPuzzleIds || []);
  return puzzlePacks
    .filter((pack) => pack.badge)
    .map((pack) => {
      const packPuzzles = puzzles.filter((puzzle) => puzzle.packId === pack.id);
      const completed = packPuzzles.filter((puzzle) => completedSet.has(puzzle.id)).length;
      const total = packPuzzles.length;
      return {
        pack,
        badge: pack.badge,
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
