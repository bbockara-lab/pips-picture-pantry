export function getDailyPuzzle(puzzles, now = new Date()) {
  const dayNumber = Math.floor(now.getTime() / 86400000);
  return puzzles[dayNumber % puzzles.length];
}
