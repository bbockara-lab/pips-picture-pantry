import { puzzles } from "../data/puzzles.js";
import { getDailyPuzzle } from "../game/dailyPuzzle.js";
import { resetProgress } from "../game/save.js";
import { renderPuzzleView } from "./puzzleView.js";

export const APP_VERSION = "v0.1.0";

export function renderApp(root) {
  const dailyPuzzle = getDailyPuzzle(puzzles);
  let activePuzzle = dailyPuzzle;

  function selectPuzzle(puzzleId) {
    activePuzzle = puzzles.find((puzzle) => puzzle.id === puzzleId) || dailyPuzzle;
    draw();
  }

  function handleReset() {
    resetProgress();
    draw();
  }

  function draw() {
    root.innerHTML = "";
    root.appendChild(createShell(activePuzzle, selectPuzzle, handleReset));
  }

  draw();
}

function createShell(activePuzzle, onSelectPuzzle, onReset) {
  const shell = document.createElement("main");
  shell.className = "app-shell";

  shell.appendChild(createHeader(onReset));
  shell.appendChild(createPipStrip(activePuzzle));
  shell.appendChild(renderPuzzleView(activePuzzle));
  shell.appendChild(createPuzzlePicker(activePuzzle.id, onSelectPuzzle));
  shell.appendChild(createFooter());

  return shell;
}

function createHeader(onReset) {
  const header = document.createElement("header");
  header.className = "top-bar";

  const titleGroup = document.createElement("div");
  titleGroup.className = "title-group";
  titleGroup.innerHTML = `
    <p class="studio-name">Sunny Spoon Studios</p>
    <h1>Pip's Picture Pantry</h1>
  `;

  const resetButton = document.createElement("button");
  resetButton.className = "icon-button";
  resetButton.type = "button";
  resetButton.title = "Reset progress";
  resetButton.setAttribute("aria-label", "Reset progress");
  resetButton.textContent = "↺";
  resetButton.addEventListener("click", onReset);

  header.append(titleGroup, resetButton);
  return header;
}

function createPipStrip(puzzle) {
  const strip = document.createElement("section");
  strip.className = "pip-strip";
  strip.innerHTML = `
    <img src="/src/assets/app-icons/app-icon-192.png" alt="Pip" />
    <div>
      <p class="pip-line">Pip found today's picture.</p>
      <p class="pip-note">Fill the grid to reveal <strong>${puzzle.title}</strong>.</p>
    </div>
  `;
  return strip;
}

function createPuzzlePicker(activePuzzleId, onSelectPuzzle) {
  const section = document.createElement("section");
  section.className = "puzzle-picker";

  const label = document.createElement("p");
  label.className = "section-label";
  label.textContent = "Starter shelf";
  section.appendChild(label);

  const list = document.createElement("div");
  list.className = "puzzle-list";

  puzzles.forEach((puzzle) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = puzzle.id === activePuzzleId ? "puzzle-chip active" : "puzzle-chip";
    button.textContent = puzzle.title;
    button.addEventListener("click", () => onSelectPuzzle(puzzle.id));
    list.appendChild(button);
  });

  section.appendChild(list);
  return section;
}

function createFooter() {
  const footer = document.createElement("footer");
  footer.className = "app-footer";
  footer.textContent = APP_VERSION;
  return footer;
}
