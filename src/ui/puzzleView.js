import { countMistakes, isSolved } from "../game/nonogram.js";
import {
  createPuzzleState,
  setMode,
  toggleCell,
  undoLastMove
} from "../game/puzzleState.js";
import { loadPuzzleState, savePuzzleState } from "../game/save.js";
import { puzzleText, t } from "../i18n/index.js";
import { renderBoard } from "./boardView.js";
import { renderCompletionBanner } from "./pipReaction.js";

export function renderPuzzleView(puzzle, options = {}) {
  let state = loadPuzzleState(puzzle.id) || createPuzzleState(puzzle);
  const section = document.createElement("section");
  section.className = state.completed ? "puzzle-panel content-panel completed" : "puzzle-panel content-panel";

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
    section.className = state.completed ? "puzzle-panel content-panel completed" : "puzzle-panel content-panel";

    const meta = document.createElement("div");
    meta.className = "puzzle-meta";
    meta.innerHTML = `
      <div>
        <p class="section-label">${t("sections.dailyPicture")}</p>
        <h2>${puzzleText(puzzle.id, "title")}</h2>
      </div>
      <p class="difficulty">${puzzle.size}\u00d7${puzzle.size}</p>
    `;

    section.appendChild(meta);
    section.appendChild(renderBoard(puzzle, state, (row, column) => update(toggleCell(state, row, column)), {
      locked: state.completed
    }));
    section.appendChild(createControls(state, update));
    section.appendChild(createProgressLine(state, puzzle));

    if (state.mode === "mark" && !state.completed) {
      section.appendChild(createMarkHint());
    }

    if (state.completed) {
      section.appendChild(renderCompletionBanner(puzzle, options));
    }
  }

  draw();
  return section;
}

function createControls(state, update) {
  const controls = document.createElement("div");
  controls.className = "controls";

  const fillButton = createModeButton(t("controls.fill"), state.mode === "fill", () =>
    update(setMode(state, "fill"))
  );
  const markButton = createModeButton(t("controls.mark"), state.mode === "mark", () =>
    update(setMode(state, "mark"))
  );
  markButton.title = t("controls.markHint");
  markButton.setAttribute("aria-label", t("controls.markHint"));

  const undoButton = document.createElement("button");
  undoButton.type = "button";
  undoButton.className = "tool-button";
  undoButton.textContent = t("controls.undo");
  undoButton.disabled = state.history.length === 0 || state.completed;
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
  if (state.completed) {
    line.textContent = t("progress.complete");
    return line;
  }

  const filledCount = state.cells.flat().filter((cell) => cell === "filled").length;
  const mistakes = countMistakes(state, puzzle.solution);
  line.textContent = mistakes > 0
    ? t("progress.revisit", { count: filledCount, mistakes })
    : t("progress.filled", { count: filledCount });
  return line;
}

function createMarkHint() {
  const hint = document.createElement("p");
  hint.className = "mode-hint";
  hint.textContent = t("controls.markHint");
  return hint;
}
