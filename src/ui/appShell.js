import { puzzles } from "../data/puzzles.js";
import { getDailyPuzzle } from "../game/dailyPuzzle.js";
import { resetProgress } from "../game/save.js";
import { puzzleText, t } from "../i18n/index.js";
import { renderAlbumView } from "./albumView.js";
import { renderPuzzleView } from "./puzzleView.js";

export const APP_VERSION = "v0.1.0";

export function renderApp(root) {
  const dailyPuzzle = getDailyPuzzle(puzzles);
  let activePuzzle = dailyPuzzle;
  let activeView = "puzzle";

  function selectPuzzle(puzzleId) {
    activePuzzle = puzzles.find((puzzle) => puzzle.id === puzzleId) || dailyPuzzle;
    activeView = "puzzle";
    draw();
  }

  function selectView(view) {
    activeView = view;
    draw();
  }

  function handleReset() {
    resetProgress();
    draw();
  }

  function draw() {
    root.innerHTML = "";
    root.appendChild(createShell(activePuzzle, activeView, selectPuzzle, selectView, handleReset));
  }

  draw();
}

function createShell(activePuzzle, activeView, onSelectPuzzle, onSelectView, onReset) {
  const shell = document.createElement("main");
  shell.className = "app-shell";

  shell.appendChild(createHeader(onReset));
  shell.appendChild(createPipStrip(activePuzzle, activeView));
  shell.appendChild(createViewTabs(activeView, onSelectView));

  if (activeView === "album") {
    shell.appendChild(renderAlbumView());
  } else {
    shell.appendChild(renderPuzzleView(activePuzzle));
    shell.appendChild(createPuzzlePicker(activePuzzle.id, onSelectPuzzle));
  }

  shell.appendChild(createFooter());

  return shell;
}

function createHeader(onReset) {
  const header = document.createElement("header");
  header.className = "top-bar";

  const titleGroup = document.createElement("div");
  titleGroup.className = "title-group";
  titleGroup.innerHTML = `
    <p class="studio-name">${t("app.studioName")}</p>
    <h1>${t("app.title")}</h1>
  `;

  const resetButton = document.createElement("button");
  resetButton.className = "icon-button";
  resetButton.type = "button";
  resetButton.title = t("header.resetProgress");
  resetButton.setAttribute("aria-label", t("header.resetProgress"));
  resetButton.textContent = "\u21ba";
  resetButton.addEventListener("click", onReset);

  header.append(titleGroup, resetButton);
  return header;
}

function createPipStrip(puzzle, activeView) {
  const strip = document.createElement("section");
  strip.className = "pip-strip";
  const puzzleTitle = puzzleText(puzzle.id, "title");
  const line = activeView === "album" ? t("pipStrip.albumLine") : t("pipStrip.puzzleLine");
  const note = activeView === "album" ? t("pipStrip.albumNote") : t("pipStrip.puzzleNote", { title: puzzleTitle });
  strip.innerHTML = `
    <img src="/src/assets/app-icons/app-icon-192.png" alt="Pip" />
    <div>
      <p class="pip-line">${line}</p>
      <p class="pip-note">${note}</p>
    </div>
  `;
  return strip;
}

function createViewTabs(activeView, onSelectView) {
  const tabs = document.createElement("nav");
  tabs.className = "view-tabs";
  tabs.setAttribute("aria-label", t("views.navLabel"));

  [
    ["puzzle", t("views.puzzle")],
    ["album", t("views.album")]
  ].forEach(([view, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = activeView === view ? "view-tab active" : "view-tab";
    button.textContent = label;
    button.addEventListener("click", () => onSelectView(view));
    tabs.appendChild(button);
  });

  return tabs;
}

function createPuzzlePicker(activePuzzleId, onSelectPuzzle) {
  const section = document.createElement("section");
  section.className = "puzzle-picker content-panel";

  const label = document.createElement("p");
  label.className = "section-label";
  label.textContent = t("sections.starterShelf");
  section.appendChild(label);

  const list = document.createElement("div");
  list.className = "puzzle-list";

  puzzles.forEach((puzzle) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = puzzle.id === activePuzzleId ? "puzzle-chip active" : "puzzle-chip";
    button.textContent = puzzleText(puzzle.id, "title");
    button.addEventListener("click", () => onSelectPuzzle(puzzle.id));
    list.appendChild(button);
  });

  section.appendChild(list);
  return section;
}

function createFooter() {
  const footer = document.createElement("footer");
  footer.className = "app-footer";
  footer.textContent = t("app.versionLabel", { version: APP_VERSION });
  return footer;
}
