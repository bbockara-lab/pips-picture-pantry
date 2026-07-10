import { getPackById } from "../data/packs.js";
import { puzzles } from "../data/puzzles.js";
import { getDailyReplayPickLimit } from "../data/economyConfig.js";
import { getCompletedPuzzleIds, isPackUnlocked } from "./save.js";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function getDailyReplayPicks(options = {}) {
  const {
    allPuzzles = puzzles,
    completedPuzzleIds = getCompletedPuzzleIds(),
    now = new Date(),
    limit = getDailyReplayPickLimit(),
    isUnlocked = (puzzle) => isPackUnlocked(getPackById(puzzle.packId))
  } = options;
  const completed = new Set(completedPuzzleIds);
  const candidates = allPuzzles.filter((puzzle) => completed.has(puzzle.id) && isUnlocked(puzzle));
  const pickLimit = Math.max(0, Number(limit) || 0);
  if (!candidates.length || pickLimit < 1) {
    return [];
  }

  const dayNumber = Number.isFinite(now?.getTime?.()) ? Math.floor(now.getTime() / MS_PER_DAY) : 0;
  const startIndex = Math.abs(dayNumber) % candidates.length;
  return Array.from({ length: Math.min(pickLimit, candidates.length) }, (_, index) => {
    return candidates[(startIndex + index) % candidates.length];
  });
}
