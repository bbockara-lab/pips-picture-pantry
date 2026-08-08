import { computeClues, normalizeSolution } from "./nonogram.js";

// Counts only as far as release validation needs: zero, one, or many.
export function countNonogramSolutions(solutionGrid, maxSolutions = 2) {
  const grid = normalizeSolution(solutionGrid);
  const size = grid.length;
  if (!size || grid.some((row) => row.length !== size)) return 0;

  const { rows, columns } = computeClues(grid);
  const rowDomains = rows.map((clue) => getLineCandidates(size, clue));
  const columnDomains = columns.map((clue) => getLineCandidates(size, clue));
  let found = 0;

  function search(assignedRows = new Set(), assignedColumns = new Set()) {
    if (found >= maxSolutions) return;
    if (assignedRows.size === size && assignedColumns.size === size) {
      found += 1;
      return;
    }

    const options = [];
    rowDomains.forEach((candidates, index) => {
      if (!assignedRows.has(index)) options.push({ axis: "row", index, candidates });
    });
    columnDomains.forEach((candidates, index) => {
      if (!assignedColumns.has(index)) options.push({ axis: "column", index, candidates });
    });
    options.sort((left, right) => left.candidates.length - right.candidates.length);
    const choice = options[0];
    if (!choice || choice.candidates.length === 0) return;

    for (const candidate of choice.candidates) {
      const nextRows = rowDomains.slice();
      const nextColumns = columnDomains.slice();
      if (choice.axis === "row") {
        nextRows[choice.index] = [candidate];
        for (let columnIndex = 0; columnIndex < size; columnIndex += 1) {
          nextColumns[columnIndex] = nextColumns[columnIndex].filter((line) => line[choice.index] === candidate[columnIndex]);
        }
      } else {
        nextColumns[choice.index] = [candidate];
        for (let rowIndex = 0; rowIndex < size; rowIndex += 1) {
          nextRows[rowIndex] = nextRows[rowIndex].filter((line) => line[choice.index] === candidate[rowIndex]);
        }
      }
      if (nextRows.some((domain) => domain.length === 0) || nextColumns.some((domain) => domain.length === 0)) continue;

      const previousRows = rowDomains.slice();
      const previousColumns = columnDomains.slice();
      nextRows.forEach((domain, index) => { rowDomains[index] = domain; });
      nextColumns.forEach((domain, index) => { columnDomains[index] = domain; });
      const nextAssignedRows = new Set(assignedRows);
      const nextAssignedColumns = new Set(assignedColumns);
      if (choice.axis === "row") nextAssignedRows.add(choice.index);
      else nextAssignedColumns.add(choice.index);
      search(nextAssignedRows, nextAssignedColumns);
      previousRows.forEach((domain, index) => { rowDomains[index] = domain; });
      previousColumns.forEach((domain, index) => { columnDomains[index] = domain; });
      if (found >= maxSolutions) return;
    }
  }

  search();
  return found;
}

export function hasUniqueNonogramSolution(solutionGrid) {
  return countNonogramSolutions(solutionGrid) === 1;
}

export function getLineCandidates(length, clues) {
  const runs = Array.isArray(clues) && clues.length && clues[0] !== 0 ? clues.map(Number) : [];
  const candidates = [];
  function place(runIndex, cursor, cells) {
    if (runIndex >= runs.length) {
      candidates.push([...cells, ...Array(length - cells.length).fill(false)]);
      return;
    }
    const remaining = runs.slice(runIndex + 1);
    const latestStart = length - runs[runIndex] - remaining.reduce((total, run) => total + run, 0) - remaining.length;
    for (let start = cursor; start <= latestStart; start += 1) {
      const next = [...cells, ...Array(start - cells.length).fill(false), ...Array(runs[runIndex]).fill(true)];
      if (runIndex < runs.length - 1) next.push(false);
      place(runIndex + 1, next.length, next);
    }
  }
  place(0, 0, []);
  return candidates;
}