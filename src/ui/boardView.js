import { CELL, computeClues, normalizeSolution } from "../game/nonogram.js";
import { getNextCellValue } from "../game/puzzleState.js";
import { puzzleText } from "../i18n/index.js";
import { getPuzzleCellColor } from "./coloredPuzzleArt.js";

export function renderBoard(puzzle, state, onCellPress, options = {}) {
  const clues = computeClues(puzzle.solution);
  const board = document.createElement("div");
  board.className = options.locked ? "board-wrap locked" : "board-wrap";
  board.style.setProperty("--board-size", puzzle.size);

  const cursor = options.cursorEnabled === false ? null : state.cursor;
  const lineGuidance = getLineGuidance(puzzle, state, options);
  board.appendChild(renderColumnClues(clues.columns, cursor, lineGuidance));
  board.appendChild(renderRowClues(clues.rows, cursor, lineGuidance));
  board.appendChild(renderCells(puzzle, state, onCellPress, options, lineGuidance));

  return board;
}

function renderColumnClues(columns, cursor, lineGuidance) {
  const clueRow = document.createElement("div");
  clueRow.className = "column-clues";

  columns.forEach((clue, columnIndex) => {
    const cell = document.createElement("div");
    const classes = ["column-clue"];
    if (cursor?.column === columnIndex) {
      classes.push("active");
    }
    if (lineGuidance.completedColumns.has(columnIndex)) {
      classes.push("line-complete");
    }
    cell.className = classes.join(" ");
    clue.forEach((number) => {
      const numberElement = document.createElement("span");
      numberElement.textContent = number;
      cell.appendChild(numberElement);
    });
    clueRow.appendChild(cell);
  });

  return clueRow;
}

function renderRowClues(rows, cursor, lineGuidance) {
  const clueColumn = document.createElement("div");
  clueColumn.className = "row-clues";

  rows.forEach((clue, rowIndex) => {
    const cell = document.createElement("div");
    const classes = ["row-clue"];
    if (cursor?.row === rowIndex) {
      classes.push("active");
    }
    if (lineGuidance.completedRows.has(rowIndex)) {
      classes.push("line-complete");
    }
    cell.className = classes.join(" ");
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
  let dragSession = null;
  let suppressNextClick = false;

  function finishDrag() {
    if (!dragSession) {
      return;
    }
    const session = dragSession;
    dragSession = null;
    window.removeEventListener("pointerup", finishDrag);
    window.removeEventListener("pointercancel", finishDrag);
    const paintCells = [...session.cells.values()];
    if (paintCells.length) {
      suppressNextClick = true;
      onCellPress(session.start.row, session.start.column, {
        paintCells,
        paintValue: session.value
      });
      window.setTimeout(() => {
        suppressNextClick = false;
      }, 0);
    }
  }

  function addDragCell(button, rowIndex, columnIndex) {
    if (!dragSession) {
      return;
    }
    const key = `${rowIndex}:${columnIndex}`;
    if (dragSession.cells.has(key)) {
      return;
    }
    dragSession.cells.set(key, { row: rowIndex, column: columnIndex });
    paintButtonDraft(button, dragSession.value);
  }

  grid.addEventListener("pointermove", (event) => {
    if (!dragSession) {
      return;
    }
    const element = document.elementFromPoint(event.clientX, event.clientY)?.closest?.(".puzzle-cell");
    if (!element || !grid.contains(element)) {
      return;
    }
    addDragCell(element, Number(element.dataset.row), Number(element.dataset.column));
  });

  state.cells.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.row = String(rowIndex);
      button.dataset.column = String(columnIndex);
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
      if (!locked && lineGuidance.completedRows.has(rowIndex)) {
        classes.push("completed-row");
      }
      if (!locked && lineGuidance.completedColumns.has(columnIndex)) {
        classes.push("completed-column");
      }
      const safeSuggestion = !locked && cell === CELL.empty && (
        lineGuidance.completedRows.has(rowIndex) ||
        lineGuidance.completedColumns.has(columnIndex)
      );
      if (safeSuggestion) {
        classes.push("safe-suggestion");
      }
      button.className = classes.join(" ");
      button.disabled = locked;
      button.setAttribute("role", "gridcell");
      button.setAttribute("aria-label", `Row ${rowIndex + 1}, column ${columnIndex + 1}, ${safeSuggestion ? "blank suggestion" : cell}`);
      if (!locked) {
        button.addEventListener("pointerdown", (event) => {
          if (event.pointerType === "mouse" && event.button !== 0) {
            return;
          }
          event.preventDefault();
          dragSession = {
            pointerId: event.pointerId,
            start: { row: rowIndex, column: columnIndex },
            value: getCellPaintValue(cell, state.mode, { safeSuggestion }),
            cells: new Map()
          };
          addDragCell(button, rowIndex, columnIndex);
          window.addEventListener("pointerup", finishDrag);
          window.addEventListener("pointercancel", finishDrag);
        });
        button.addEventListener("pointerenter", (event) => {
          if (dragSession && dragSession.pointerId === event.pointerId) {
            addDragCell(button, rowIndex, columnIndex);
          }
        });
        button.addEventListener("click", (event) => {
          if (suppressNextClick) {
            event.preventDefault();
            suppressNextClick = false;
            return;
          }
          onCellPress(rowIndex, columnIndex);
        });
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

export function getCellPaintValue(cell, mode, options = {}) {
  if (options.safeSuggestion && cell === CELL.empty) {
    return CELL.marked;
  }

  return getNextCellValue(cell, mode);
}

function paintButtonDraft(button, value) {
  button.classList.remove(CELL.empty, CELL.filled, CELL.marked, "safe-suggestion");
  button.classList.add(value, "drag-preview");
  button.textContent = value === CELL.marked ? "\u00d7" : "";
}

function getLineGuidance(puzzle, state, options) {
  const completedRows = new Set();
  const completedColumns = new Set();
  if (options.locked) {
    return { completedRows, completedColumns };
  }

  const solution = normalizeSolution(puzzle.solution);
  solution.forEach((solutionRow, rowIndex) => {
    if (isLineCorrectlySatisfied(state.cells[rowIndex] || [], solutionRow)) {
      completedRows.add(rowIndex);
    }
  });

  for (let columnIndex = 0; columnIndex < puzzle.size; columnIndex += 1) {
    const cells = state.cells.map((row) => row[columnIndex]);
    const solutionColumn = solution.map((row) => row[columnIndex]);
    if (isLineCorrectlySatisfied(cells, solutionColumn)) {
      completedColumns.add(columnIndex);
    }
  }

  return { completedRows, completedColumns };
}

export function isLineCorrectlySatisfied(line, solutionLine) {
  return solutionLine.every((shouldFill, index) => {
    const cell = line[index];
    return shouldFill ? cell === CELL.filled : cell !== CELL.filled;
  });
}