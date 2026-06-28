import { puzzlePacks } from "../data/packs.js";
import { puzzles } from "../data/puzzles.js";
import { getDailyPuzzle } from "../game/dailyPuzzle.js";
import { resetProgress } from "../game/save.js";
import { puzzleText, t } from "../i18n/index.js";
import { renderAlbumView } from "./albumView.js";
import { renderPuzzleView } from "./puzzleView.js";

export const APP_VERSION = "v0.1.1";

export function renderApp(root) {
  const dailyPuzzle = getDailyPuzzle(puzzles);
  let activePuzzle = dailyPuzzle;
  let activeView = "puzzle";
  let resetOpen = false;

  function selectPuzzle(puzzleId) {
    activePuzzle = puzzles.find((puzzle) => puzzle.id === puzzleId) || dailyPuzzle;
    activeView = "puzzle";
    resetOpen = false;
    draw();
  }

  function selectNextPuzzle() {
    const currentIndex = puzzles.findIndex((puzzle) => puzzle.id === activePuzzle.id);
    const nextPuzzle = puzzles[(currentIndex + 1) % puzzles.length] || dailyPuzzle;
    selectPuzzle(nextPuzzle.id);
  }

  function selectView(view) {
    activeView = view;
    resetOpen = false;
    draw();
  }

  function requestReset() {
    resetOpen = true;
    draw();
  }

  function cancelReset() {
    resetOpen = false;
    draw();
  }

  function confirmReset() {
    resetProgress();
    resetOpen = false;
    draw();
  }

  function draw() {
    root.innerHTML = "";
    root.appendChild(createShell({
      activePuzzle,
      activeView,
      dailyPuzzle,
      resetOpen,
      onSelectPuzzle: selectPuzzle,
      onSelectView: selectView,
      onRequestReset: requestReset,
      onCancelReset: cancelReset,
      onConfirmReset: confirmReset,
      onNextPuzzle: selectNextPuzzle
    }));
  }

  draw();
}

function createShell({
  activePuzzle,
  activeView,
  dailyPuzzle,
  resetOpen,
  onSelectPuzzle,
  onSelectView,
  onRequestReset,
  onCancelReset,
  onConfirmReset,
  onNextPuzzle
}) {
  const shell = document.createElement("main");
  shell.className = "app-shell";

  shell.appendChild(createHeader(onRequestReset));
  shell.appendChild(createPipStrip(activePuzzle, activeView));
  shell.appendChild(createViewTabs(activeView, onSelectView));

  if (activeView === "album") {
    shell.appendChild(renderAlbumView());
  } else {
    shell.appendChild(createDailyCard(dailyPuzzle, activePuzzle.id, onSelectPuzzle));
    shell.appendChild(renderPuzzleView(activePuzzle, {
      onViewAlbum: () => onSelectView("album"),
      onNextPuzzle
    }));
    shell.appendChild(createPuzzlePicker(activePuzzle.id, onSelectPuzzle));
  }

  shell.appendChild(createFooter());

  if (resetOpen) {
    shell.appendChild(createResetDialog(onCancelReset, onConfirmReset));
  }

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
    <img src="/src/assets/characters/headshot-portrait-sheet-v1-clean.png" alt="Pip" />
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

function createDailyCard(dailyPuzzle, activePuzzleId, onSelectPuzzle) {
  const card = document.createElement("section");
  card.className = dailyPuzzle.id === activePuzzleId ? "daily-card active" : "daily-card";

  const text = document.createElement("div");
  text.innerHTML = `
    <p class="section-label">${t("daily.eyebrow")}</p>
    <h2>${puzzleText(dailyPuzzle.id, "title")}</h2>
    <p>${t("daily.note")}</p>
  `;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "tool-button daily-button";
  button.textContent = dailyPuzzle.id === activePuzzleId ? t("daily.selected") : t("daily.play");
  button.disabled = dailyPuzzle.id === activePuzzleId;
  button.addEventListener("click", () => onSelectPuzzle(dailyPuzzle.id));

  card.append(text, button);
  return card;
}

function createPuzzlePicker(activePuzzleId, onSelectPuzzle) {
  const section = document.createElement("section");
  section.className = "puzzle-picker content-panel";

  puzzlePacks
    .filter((pack) => puzzles.some((puzzle) => puzzle.packId === pack.id))
    .forEach((pack) => {
      const packBlock = document.createElement("div");
      packBlock.className = "pack-block";

      const header = document.createElement("div");
      header.className = "pack-header";
      header.innerHTML = `
        <div>
          <p class="section-label">${t(pack.titleKey)}</p>
          <p class="pack-note">${t(pack.noteKey)}</p>
        </div>
        <span>${getAccessLabel(pack.access)}</span>
      `;
      packBlock.appendChild(header);

      const list = document.createElement("div");
      list.className = "puzzle-list";

      puzzles
        .filter((puzzle) => puzzle.packId === pack.id)
        .forEach((puzzle) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = puzzle.id === activePuzzleId ? "puzzle-chip active" : "puzzle-chip";
          button.textContent = puzzleText(puzzle.id, "title");
          button.dataset.access = puzzle.access;
          button.addEventListener("click", () => onSelectPuzzle(puzzle.id));
          list.appendChild(button);
        });

      packBlock.appendChild(list);
      section.appendChild(packBlock);
    });

  return section;
}

function createResetDialog(onCancel, onConfirm) {
  const overlay = document.createElement("div");
  overlay.className = "modal-backdrop";
  overlay.setAttribute("role", "presentation");

  const dialog = document.createElement("section");
  dialog.className = "reset-dialog";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "reset-dialog-title");
  dialog.innerHTML = `
    <h2 id="reset-dialog-title">${t("header.resetTitle")}</h2>
    <p>${t("header.resetBody")}</p>
  `;

  const actions = document.createElement("div");
  actions.className = "dialog-actions";

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.className = "tool-button";
  cancelButton.textContent = t("header.cancelReset");
  cancelButton.addEventListener("click", onCancel);

  const confirmButton = document.createElement("button");
  confirmButton.type = "button";
  confirmButton.className = "tool-button danger";
  confirmButton.textContent = t("header.confirmReset");
  confirmButton.addEventListener("click", onConfirm);

  actions.append(cancelButton, confirmButton);
  dialog.appendChild(actions);
  overlay.appendChild(dialog);
  return overlay;
}

function getAccessLabel(access) {
  if (access === "bonus-pack") {
    return t("packs.bonusPack");
  }
  if (access === "unlockable") {
    return t("packs.unlockable");
  }
  return t("packs.free");
}

function createFooter() {
  const footer = document.createElement("footer");
  footer.className = "app-footer";
  footer.textContent = t("app.versionLabel", { version: APP_VERSION });
  return footer;
}
