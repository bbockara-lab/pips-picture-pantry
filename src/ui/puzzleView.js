import { countMistakes, isSolved } from "../game/nonogram.js";
import {
  createPuzzleState,
  setMode,
  toggleCell,
  undoLastMove
} from "../game/puzzleState.js";
import { loadPuzzleState, savePuzzleState } from "../game/save.js";
import { renderBoard } from "./boardView.js";
import { renderCompletionBanner } from "./pipReaction.js";

export function renderPuzzleView(puzzle) {
  let state = loadPuzzleState(puzzle.id) || createPuzzleState(puzzle);
  const section = document.createElement("section");
  section.className = "puzzle-panel";

  function update(nextState) {
    state = {
      ...nextState,
      completed: isSolved(nextState, puzzle.solution) || nextState.completed
    };
    savePuzzleState(state);
    draw();
  }

  function draw() {
    section.innerHTML = "";

    const meta = document.createElement("div");
    meta.className = "puzzle-meta";
    meta.innerHTML = `
      <div>
        <p class="section-label">Daily picture</p>
        <h2>${puzzle.title}</h2>
      </div>
      <p class="difficulty">${puzzle.size}×${puzzle.size}</p>
    `;

    section.appendChild(meta);
    section.appendChild(renderBoard(puzzle, state, (row, column) => update(toggleCell(state, row, column))));
    section.appendChild(createControls(state, update));
    section.appendChild(createProgressLine(state, puzzle));

    if (state.completed) {
      section.appendChild(renderCompletionBanner(puzzle));
    }
  }

  draw();
  return section;
}

function createControls(state, update) {
  const controls = document.createElement("div");
  controls.className = "controls";

  const fillButton = createModeButton("Fill", state.mode === "fill", () =>
    update(setMode(state, "fill"))
  );
  const markButton = createModeButton("Mark", state.mode === "mark", () =>
    update(setMode(state, "mark"))
  );

  const undoButton = document.createElement("button");
  undoButton.type = "button";
  undoButton.className = "tool-button";
  undoButton.textContent = "Undo";
  undoButton.disabled = state.history.length === 0;
  undoButton.addEventListener("click", () => update(undoLastMove(state)));

  controls.append(fillButton, markButton, undoButton);
  return controls;
}

function createModeButton(label, active, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = active ? "mode-button active" : "mode-button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function createProgressLine(state, puzzle) {
  const line = document.createElement("p");
  line.className = "progress-line";
  const filledCount = state.cells.flat().filter((cell) => cell === "filled").length;
  const mistakes = countMistakes(state, puzzle.solution);
  line.textContent = `${filledCount} filled · ${mistakes} gentle check`;
  return line;
}
