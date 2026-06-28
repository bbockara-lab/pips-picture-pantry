import { CELL } from "./nonogram.js";

export function createPuzzleState(puzzle) {
  return {
    puzzleId: puzzle.id,
    mode: "fill",
    cells: Array.from({ length: puzzle.size }, () =>
      Array.from({ length: puzzle.size }, () => CELL.empty)
    ),
    history: [],
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
    history: state.history.slice(0, -1),
    updatedAt: new Date().toISOString()
  };
}

export function serializeState(state) {
  return JSON.stringify({
    puzzleId: state.puzzleId,
    mode: state.mode,
    cells: state.cells,
    history: state.history,
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
    cells: parsed.cells,
    history: Array.isArray(parsed.history) ? parsed.history : [],
    completed: Boolean(parsed.completed),
    updatedAt: parsed.updatedAt || new Date().toISOString()
  };
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
