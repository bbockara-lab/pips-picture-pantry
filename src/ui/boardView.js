import { CELL, computeClues } from "../game/nonogram.js";

export function renderBoard(puzzle, state, onCellPress) {
  const clues = computeClues(puzzle.solution);
  const board = document.createElement("div");
  board.className = "board-wrap";
  board.style.setProperty("--board-size", puzzle.size);

  board.appendChild(renderColumnClues(clues.columns));
  board.appendChild(renderRowClues(clues.rows));
  board.appendChild(renderCells(puzzle, state, onCellPress));

  return board;
}

function renderColumnClues(columns) {
  const clueRow = document.createElement("div");
  clueRow.className = "column-clues";

  columns.forEach((clue) => {
    const cell = document.createElement("div");
    cell.className = "column-clue";
    cell.textContent = clue.join(" ");
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
    cell.textContent = clue.join(" ");
    clueColumn.appendChild(cell);
  });

  return clueColumn;
}

function renderCells(puzzle, state, onCellPress) {
  const grid = document.createElement("div");
  grid.className = "puzzle-grid";
  grid.setAttribute("role", "grid");
  grid.setAttribute("aria-label", `${puzzle.title} puzzle board`);

  state.cells.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `puzzle-cell ${cell}`;
      button.setAttribute("role", "gridcell");
      button.setAttribute("aria-label", `Row ${rowIndex + 1}, column ${columnIndex + 1}, ${cell}`);
      button.addEventListener("click", () => onCellPress(rowIndex, columnIndex));
      button.textContent = cell === CELL.marked ? "×" : "";
      grid.appendChild(button);
    });
  });

  return grid;
}
