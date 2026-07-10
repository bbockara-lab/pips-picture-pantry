import { CELL, computeClues } from "../game/nonogram.js";
import { puzzleText } from "../i18n/index.js";
import { getPuzzleCellColor } from "./coloredPuzzleArt.js";

export function renderBoard(puzzle, state, onCellPress, options = {}) {
  const clues = computeClues(puzzle.solution);
  const board = document.createElement("div");
  board.className = options.locked ? "board-wrap locked" : "board-wrap";
  board.style.setProperty("--board-size", puzzle.size);

  const cursor = options.cursorEnabled === false ? null : state.cursor;
  const lineGuidance = getLineGuidance(clues, state, cursor, options);
  board.appendChild(renderColumnClues(clues.columns, cursor));
  board.appendChild(renderRowClues(clues.rows, cursor));
  board.appendChild(renderCells(puzzle, state, onCellPress, options, lineGuidance));

  return board;
}

function renderColumnClues(columns, cursor) {
  const clueRow = document.createElement("div");
  clueRow.className = "column-clues";

  columns.forEach((clue, columnIndex) => {
    const cell = document.createElement("div");
    cell.className = cursor?.column === columnIndex ? "column-clue active" : "column-clue";
    clue.forEach((number) => {
      const numberElement = document.createElement("span");
      numberElement.textContent = number;
      cell.appendChild(numberElement);
    });
    clueRow.appendChild(cell);
  });

  return clueRow;
}

function renderRowClues(rows, cursor) {
  const clueColumn = document.createElement("div");
  clueColumn.className = "row-clues";

  rows.forEach((clue, rowIndex) => {
    const cell = document.createElement("div");
    cell.className = cursor?.row === rowIndex ? "row-clue active" : "row-clue";
    clue.forEach((number) => {
      const numberElement = document.createElement("span");
      numberElement.textContent = number;
      cell.appendChild(numberElement);
    });
    clueColumn.appendChild(cell);
  });

  return clueColumn;
}

function renderCells(puzzle, state, onCellPress, options, lineGuidance) {
  const grid = document.createElement("div");
  grid.className = "puzzle-grid";
  grid.setAttribute("role", "grid");
  grid.setAttribute("aria-label", `${puzzleText(puzzle.id, "title")} puzzle board`);
  const locked = Boolean(options.locked);
  const showColoredReward = Boolean(options.completed);

  state.cells.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      const classes = ["puzzle-cell", cell];
      if (showColoredReward && cell === CELL.filled) {
        classes.push("colored");
      }
      const cursor = options.cursorEnabled === false ? null : state.cursor;
      if (!locked && cursor?.row === rowIndex) {
        classes.push("current-row");
      }
      if (!locked && cursor?.column === columnIndex) {
        classes.push("current-column");
      }
      if (!locked && cursor?.row === rowIndex && cursor?.column === columnIndex) {
        classes.push("selected");
      }
      const safeSuggestion = !locked && cell === CELL.empty && (
        (lineGuidance.rowSatisfied && cursor?.row === rowIndex) ||
        (lineGuidance.columnSatisfied && cursor?.column === columnIndex)
      );
      if (safeSuggestion) {
        classes.push("safe-suggestion");
      }
      button.className = classes.join(" ");
      button.disabled = locked;
      button.setAttribute("role", "gridcell");
      button.setAttribute("aria-label", `Row ${rowIndex + 1}, column ${columnIndex + 1}, ${safeSuggestion ? "blank suggestion" : cell}`);
      if (!locked) {
        button.addEventListener("click", () => onCellPress(rowIndex, columnIndex));
      }
      if (showColoredReward && cell === CELL.filled) {
        button.style.setProperty("--cell-color", getPuzzleCellColor(puzzle, rowIndex, columnIndex));
      }
      button.textContent = cell === CELL.marked || safeSuggestion ? "\u00d7" : "";
      grid.appendChild(button);
    });
  });

  return grid;
}

function getLineGuidance(clues, state, cursor, options) {
  if (options.locked || options.cursorEnabled === false || !cursor) {
    return { rowSatisfied: false, columnSatisfied: false };
  }

  const row = state.cells[cursor.row] || [];
  const column = state.cells.map((line) => line[cursor.column]);
  return {
    rowSatisfied: isLineFilledToTarget(row, clues.rows[cursor.row]),
    columnSatisfied: isLineFilledToTarget(column, clues.columns[cursor.column])
  };
}

function isLineFilledToTarget(line, clue = [0]) {
  const target = clue.reduce((total, value) => total + Number(value || 0), 0);
  const filled = line.filter((cell) => cell === CELL.filled).length;
  return filled === target;
}