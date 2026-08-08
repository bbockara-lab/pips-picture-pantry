import { puzzles } from "../src/data/puzzles.js";
import { countNonogramSolutions } from "../src/game/nonogramUniqueness.js";

const ambiguous = [];
for (const puzzle of puzzles) {
  const count = countNonogramSolutions(puzzle.solution);
  if (count !== 1) {
    ambiguous.push({ id: puzzle.id, size: puzzle.size, count });
  }
}

if (ambiguous.length) {
  console.error(`Non-unique puzzle clues: ${ambiguous.map((puzzle) => puzzle.id).join(", ")}`);
  process.exit(1);
}

console.log(`Puzzle uniqueness check passed: ${puzzles.length} authored puzzles.`);
