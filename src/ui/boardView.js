import { CELL, computeClues } from "../game/nonogram.js";
import { puzzleText } from "../i18n/index.js";

export function renderBoard(puzzle, state, onCellPress, options = {}) {
  const clues = computeClues(puzzle.solution);
  const board = document.createElement("div");
  board.className = options.locked ? "board-wrap locked" : "board-wrap";
  board.style.setProperty("--board-size", puzzle.size);

  board.appendChild(renderColumnClues(clues.columns));
  board.appendChild(renderRowClues(clues.rows));
  board.appendChild(renderCells(puzzle, state, onCellPress, options.locked));

  return board;
}

function renderColumnClues(columns) {
  const clueRow = document.createElement("div");
  clueRow.className = "column-clues";

  columns.forEach((clue) => {
    const cell = document.createElement("div");
    cell.className = "column-clue";
    clue.forEach((number) => {
      const numberElement = document.createElement("span");
      numberElement.textContent = number;
      cell.appendChild(numberElement);
    });
    clueRow.appendChild(cell);
  });

  return clueRow;
}

function renderRowClues(rows) {
  const clueColumn = document.createElement("div");
  clueColumn.className = "row-clues";

  rows.forEach((clue) => {
    const cell = document.createElement("div");
    cell.className = "row-clue";
    clue.forEach((number) => {
      const numberElement = document.createElement("span");
      numberElement.textContent = number;
      cell.appendChild(numberElement);
    });
    clueColumn.appendChild(cell);
  });

  return clueColumn;
}

function renderCells(puzzle, state, onCellPress, locked) {
  const grid = document.createElement("div");
  grid.className = "puzzle-grid";
  grid.setAttribute("role", "grid");
  grid.setAttribute("aria-label", `${puzzleText(puzzle.id, "title")} puzzle board`);

  state.cells.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `puzzle-cell ${cell}`;
      button.disabled = Boolean(locked);
      button.setAttribute("role", "gridcell");
      button.setAttribute("aria-label", `Row ${rowIndex + 1}, column ${columnIndex + 1}, ${cell}`);
      if (!locked) {
        button.addEventListener("click", () => onCellPress(rowIndex, columnIndex));
      }
      button.textContent = cell === CELL.marked ? "•" : "";
      grid.appendChild(button);
    });
  });

  return grid;
}
