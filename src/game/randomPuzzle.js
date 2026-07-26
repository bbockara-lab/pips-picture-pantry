import { hasUniqueNonogramSolution } from "./nonogramUniqueness.js";

const DEFAULT_DENSITY_BY_SIZE = new Map([
  [5, 0.44],
  [8, 0.42],
  [10, 0.4],
  [12, 0.38],
  [15, 0.36]
]);

export function createTimeAttackPuzzle({ seed, size, index = 0 } = {}) {
  const normalizedSize = normalizeSize(size);
  const seedText = String(seed || "pips-time-attack");
  const solution = createUniqueGrid(seedText, normalizedSize, index);

  return {
    id: "time-attack-" + normalizedSize + "-" + index + "-" + hashSeed(seedText),
    title: "Time Attack " + normalizedSize + "x" + normalizedSize,
    packId: "time-attack",
    access: "time-attack",
    size: normalizedSize,
    difficulty: getDifficulty(normalizedSize),
    reward: 0,
    generated: true,
    solution
  };
}

export function getTimeAttackSizeForRound(roundIndex = 0) {
  const round = Math.max(0, Number(roundIndex) || 0);
  if (round === 0) return 5;
  if (round === 1) return 8;
  if (round === 2) return 10;
  if (round < 6) return 12;
  return 15;
}

export function createTimeAttackRun({ seed, rounds = 10 } = {}) {
  const count = Math.max(1, Math.min(50, Math.floor(Number(rounds) || 10)));
  return Array.from({ length: count }, (_, index) => {
    const size = getTimeAttackSizeForRound(index);
    return createTimeAttackPuzzle({ seed, size, index });
  });
}

function createUniqueGrid(seedText, size, index) {
  // Larger boards use deterministic, visually clear templates. This keeps the
  // Time Attack run responsive while preserving a single clue-set answer.
  if (size >= 12) {
    return balanceTemplateLines(createLargeBoardTemplate(size, hashSeed(seedText + ":" + index)));
  }
  for (let attempt = 0; attempt < 96; attempt += 1) {
    const rng = createSeededRng(seedText + ":" + size + ":" + index + ":unique:" + attempt);
    const solution = generateGrid(size, rng);
    if (hasUniqueNonogramSolution(solution)) return solution;
  }
  throw new Error("Could not create a unique Time Attack " + size + "x" + size + " board.");
}

function createLargeBoardTemplate(size, seed) {
  const variant = seed % 5;
  if (variant === 4) {
    const center = (size - 1) / 2;
    return Array.from({ length: size }, (_, rowIndex) => {
      const width = size - 2 * Math.floor(Math.abs(rowIndex - center));
      const left = Math.floor((size - width) / 2);
      return "0".repeat(left) + "1".repeat(width) + "0".repeat(size - left - width);
    });
  }
  const triangle = Array.from({ length: size }, (_, rowIndex) => "1".repeat(rowIndex + 1) + "0".repeat(size - rowIndex - 1));
  if (variant === 0) return triangle;
  if (variant === 1) return triangle.map((row) => [...row].reverse().join(""));
  if (variant === 2) return [...triangle].reverse();
  return [...triangle].reverse().map((row) => [...row].reverse().join(""));
}
function balanceTemplateLines(grid) {
  const cells = grid.map((row) => [...row]);
  const size = cells.length;
  const middle = Math.floor(size / 2);
  for (let rowIndex = 0; rowIndex < size; rowIndex += 1) {
    if (cells[rowIndex].every((cell) => cell === "1")) cells[rowIndex][middle] = "0";
  }
  for (let columnIndex = 0; columnIndex < size; columnIndex += 1) {
    if (cells.every((row) => row[columnIndex] === "1")) cells[middle][columnIndex] = "0";
  }
  return cells.map((row) => row.join(""));
}
function normalizeSize(size) {
  const normalized = Math.floor(Number(size) || 5);
  if (![5, 8, 10, 12, 15].includes(normalized)) {
    throw new Error("Unsupported time attack puzzle size: " + size);
  }
  return normalized;
}

function generateGrid(size, rng) {
  const density = DEFAULT_DENSITY_BY_SIZE.get(size) || 0.4;
  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => (rng() < density ? "1" : "0"))
  );

  softenIsolatedNoise(grid, rng);
  ensureEveryLineHasSignal(grid, rng);
  return grid.map((row) => row.join(""));
}

function softenIsolatedNoise(grid, rng) {
  const size = grid.length;
  for (let row = 1; row < size - 1; row += 1) {
    for (let column = 1; column < size - 1; column += 1) {
      if (grid[row][column] !== "1") continue;
      const neighbors = [
        grid[row - 1][column],
        grid[row + 1][column],
        grid[row][column - 1],
        grid[row][column + 1]
      ].filter((cell) => cell === "1").length;

      if (neighbors === 0 && rng() < 0.65) {
        grid[row][column] = "0";
      }
    }
  }
}

function ensureEveryLineHasSignal(grid, rng) {
  const size = grid.length;
  for (let row = 0; row < size; row += 1) {
    balanceLine(grid[row], rng);
  }

  for (let column = 0; column < size; column += 1) {
    const line = grid.map((row) => row[column]);
    const balanced = balanceLine(line, rng);
    for (let row = 0; row < size; row += 1) {
      grid[row][column] = balanced[row];
    }
  }
}

function balanceLine(line, rng) {
  const filled = line.filter((cell) => cell === "1").length;
  if (filled === 0) {
    line[Math.floor(rng() * line.length)] = "1";
  }
  if (filled === line.length) {
    line[Math.floor(rng() * line.length)] = "0";
  }
  return line;
}

function getDifficulty(size) {
  if (size <= 5) return "quick";
  if (size <= 8) return "easy";
  if (size <= 10) return "medium";
  if (size <= 12) return "hard";
  return "expert";
}

function createSeededRng(seed) {
  let state = hashSeed(seed) || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function hashSeed(seed) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function getTimeAttackRunScore({ progressCells = 0, elapsedSeconds = 0, hintsUsed = 0 } = {}) {
  const progress = Math.max(0, Math.floor(Number(progressCells) || 0));
  const elapsed = Math.max(0, Number(elapsedSeconds) || 0);
  const hints = Math.max(0, Math.floor(Number(hintsUsed) || 0));
  const speedBonus = Math.max(0, 600 - Math.floor(elapsed));
  const hintPenalty = Math.min(500, hints * 25);
  return Math.max(0, Math.floor(progress * 1000 + speedBonus - hintPenalty));
}
