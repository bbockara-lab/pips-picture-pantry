export function getNextPuzzleInSequence(activePuzzle, allPuzzles = []) {
  if (!Array.isArray(allPuzzles) || allPuzzles.length === 0) return null;
  const currentIndex = allPuzzles.findIndex((puzzle) => puzzle.id === activePuzzle?.id);
  if (currentIndex < 0) return allPuzzles[0] || null;
  return allPuzzles[(currentIndex + 1) % allPuzzles.length] || null;
}
