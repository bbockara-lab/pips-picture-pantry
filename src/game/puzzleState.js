import { CELL, normalizeSolution } from "./nonogram.js";

export function createPuzzleState(puzzle) {
  return {
    puzzleId: puzzle.id,
    mode: "fill",
    cursor: { row: 0, column: 0 },
    cells: Array.from({ length: puzzle.size }, () =>
      Array.from({ length: puzzle.size }, () => CELL.empty)
    ),
    history: [],
    hintsUsed: 0,
    completed: false,
    updatedAt: new Date().toISOString()
  };
}

export function setMode(state, mode) {
  if (!["fill", "mark"].includes(mode)) {
    return state;
  }
  return { ...state, mode };
}

export function setCursor(state, row, column, size = state.cells.length) {
  return {
    ...state,
    cursor: {
      row: clampIndex(row, size),
      column: clampIndex(column, size)
    }
  };
}

export function moveCursor(state, rowDelta, columnDelta, size = state.cells.length) {
  const cursor = getCursor(state);
  return setCursor(state, cursor.row + rowDelta, cursor.column + columnDelta, size);
}

export function toggleCursorCell(state, mode = state.mode) {
  const cursor = getCursor(state);
  return toggleCell(state, cursor.row, cursor.column, mode);
}

export function useHint(state, solutionGrid) {
  const solution = normalizeSolution(solutionGrid);
  const target = findHintTarget(state, solution);
  if (!target) {
    return state;
  }

  const cells = cloneCells(state.cells);
  cells[target.row][target.column] = target.next;

  return {
    ...state,
    cells,
    hintsUsed: Math.max(0, Number(state.hintsUsed || 0)) + 1,
    history: [
      ...state.history,
      {
        row: target.row,
        column: target.column,
        previous: target.previous,
        next: target.next,
        hint: true
      }
    ],
    updatedAt: new Date().toISOString()
  };
}

export function toggleCell(state, row, column, mode = state.mode) {
  const current = state.cells[row]?.[column];
  if (!current) {
    return state;
  }

  const nextValue = getNextCellValue(current, mode);
  const cells = cloneCells(state.cells);
  cells[row][column] = nextValue;

  return {
    ...state,
    cells,
    history: [...state.history, { row, column, previous: current, next: nextValue }],
    updatedAt: new Date().toISOString()
  };
}

export function undoLastMove(state) {
  const lastMove = state.history[state.history.length - 1];
  if (!lastMove) {
    return state;
  }

  const cells = cloneCells(state.cells);
  cells[lastMove.row][lastMove.column] = lastMove.previous;

  return {
    ...state,
    cells,
    hintsUsed: lastMove.hint ? Math.max(0, Number(state.hintsUsed || 0) - 1) : Number(state.hintsUsed || 0),
    history: state.history.slice(0, -1),
    updatedAt: new Date().toISOString()
  };
}

export function serializeState(state) {
  return JSON.stringify({
    puzzleId: state.puzzleId,
    mode: state.mode,
    cursor: getCursor(state),
    cells: state.cells,
    history: state.history,
    hintsUsed: Math.max(0, Number(state.hintsUsed || 0)),
    completed: state.completed,
    updatedAt: state.updatedAt
  });
}

export function restoreState(payload) {
  if (!payload) {
    return null;
  }

  const parsed = typeof payload === "string" ? JSON.parse(payload) : payload;
  if (!parsed.puzzleId || !Array.isArray(parsed.cells)) {
    return null;
  }

  return {
    puzzleId: parsed.puzzleId,
    mode: parsed.mode === "mark" ? "mark" : "fill",
    cursor: getCursor(parsed),
    cells: parsed.cells,
    history: Array.isArray(parsed.history) ? parsed.history : [],
    hintsUsed: Math.max(0, Number(parsed.hintsUsed || 0)),
    completed: Boolean(parsed.completed),
    updatedAt: parsed.updatedAt || new Date().toISOString()
  };
}

function findHintTarget(state, solution) {
  for (let row = 0; row < solution.length; row += 1) {
    for (let column = 0; column < solution[row].length; column += 1) {
      const current = state.cells[row]?.[column];
      if (solution[row][column] && current !== CELL.filled) {
        return { row, column, previous: current || CELL.empty, next: CELL.filled };
      }
    }
  }

  for (let row = 0; row < solution.length; row += 1) {
    for (let column = 0; column < solution[row].length; column += 1) {
      const current = state.cells[row]?.[column];
      if (!solution[row][column] && current === CELL.empty) {
        return { row, column, previous: current, next: CELL.marked };
      }
    }
  }

  return null;
}

function getNextCellValue(current, mode) {
  if (mode === "mark") {
    return current === CELL.marked ? CELL.empty : CELL.marked;
  }

  return current === CELL.filled ? CELL.empty : CELL.filled;
}

function cloneCells(cells) {
  return cells.map((row) => [...row]);
}

function getCursor(state) {
  const size = Array.isArray(state.cells) ? state.cells.length : 1;
  const row = Number.isInteger(state.cursor?.row) ? state.cursor.row : 0;
  const column = Number.isInteger(state.cursor?.column) ? state.cursor.column : 0;
  return {
    row: clampIndex(row, size),
    column: clampIndex(column, size)
  };
}

function clampIndex(value, size) {
  return Math.max(0, Math.min(size - 1, value));
}
