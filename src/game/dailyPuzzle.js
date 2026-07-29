export function getDailyPuzzle(puzzles, now = new Date()) {
  const dayNumber = Math.floor(now.getTime() / 86400000);
  return puzzles[dayNumber % puzzles.length];
}

export function getDailyDateKey(now = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
