export const CELL = Object.freeze({
  empty: "empty",
  filled: "filled",
  marked: "marked"
});

export function normalizeSolution(solutionGrid) {
  return solutionGrid.map((row) => {
    if (typeof row === "string") {
      return [...row].map((cell) => cell === "1");
    }
    return row.map(Boolean);
  });
}

export function computeLineClues(line) {
  const clues = [];
  let run = 0;

  for (const value of line) {
    if (value) {
      run += 1;
    } else if (run > 0) {
      clues.push(run);
      run = 0;
    }
  }

  if (run > 0) {
    clues.push(run);
  }

  return clues.length ? clues : [0];
}

export function computeClues(solutionGrid) {
  const grid = normalizeSolution(solutionGrid);
  const rows = grid.map(computeLineClues);
  const columns = grid[0].map((_, columnIndex) =>
    computeLineClues(grid.map((row) => row[columnIndex]))
  );

  return { rows, columns };
}

export function isSolved(state, solutionGrid) {
  const solution = normalizeSolution(solutionGrid);

  return solution.every((row, rowIndex) =>
    row.every((shouldFill, columnIndex) => {
      const current = state.cells[rowIndex][columnIndex];
      return shouldFill ? current === CELL.filled : current !== CELL.filled;
    })
  );
}

export function countMistakes(state, solutionGrid) {
  const solution = normalizeSolution(solutionGrid);
  let mistakes = 0;

  solution.forEach((row, rowIndex) => {
    row.forEach((shouldFill, columnIndex) => {
      if (!shouldFill && state.cells[rowIndex][columnIndex] === CELL.filled) {
        mistakes += 1;
      }
    });
  });

  return mistakes;
}

export function countCorrectCells(state, solutionGrid) {
  if (!state?.cells || !Array.isArray(solutionGrid)) {
    return 0;
  }
  if (isSolved(state, solutionGrid)) {
    const solution = normalizeSolution(solutionGrid);
    return solution.reduce((total, row) => total + row.length, 0);
  }

  const solution = normalizeSolution(solutionGrid);
  let correct = 0;
  solution.forEach((row, rowIndex) => {
    row.forEach((shouldFill, columnIndex) => {
      const current = state.cells?.[rowIndex]?.[columnIndex];
      if (shouldFill && current === CELL.filled) {
        correct += 1;
      } else if (!shouldFill && current === CELL.marked) {
        correct += 1;
      }
    });
  });
  return correct;
}
