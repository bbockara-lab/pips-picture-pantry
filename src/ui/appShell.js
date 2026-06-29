import pipStripStickerUrl from "../assets/characters/pip-strip-sticker-v1.png";
import { puzzlePacks } from "../data/packs.js";
import { puzzles } from "../data/puzzles.js";
import { getDailyPuzzle } from "../game/dailyPuzzle.js";
import { getUnlockRequirementProgress, isPuzzleUnlocked } from "../game/puzzleAccess.js";
import { getCompletedPuzzleIds, resetProgress } from "../game/save.js";
import { getLanguagePreference, puzzleText, setLanguagePreference, t } from "../i18n/index.js";
import { renderAlbumView } from "./albumView.js";
import { renderPuzzleView } from "./puzzleView.js";

export const APP_VERSION = "v0.1.10";

export function renderApp(root) {
  const dailyPuzzle = getDailyPuzzle(puzzles);
  let activePuzzle = getStartPuzzle();
  let activeView = "puzzle";
  let resetOpen = false;
  let settingsOpen = false;

  function selectPuzzle(puzzleId) {
    const nextPuzzle = puzzles.find((puzzle) => puzzle.id === puzzleId) || dailyPuzzle;
    if (!isPuzzleUnlocked(nextPuzzle, getCompletedPuzzleIds())) {
      return;
    }

    activePuzzle = nextPuzzle;
    activeView = "puzzle";
    resetOpen = false;
    settingsOpen = false;
    draw();
  }

  function selectNextPuzzle() {
    const completedPuzzleIds = getCompletedPuzzleIds();
    const unlockedPuzzles = puzzles.filter((puzzle) => isPuzzleUnlocked(puzzle, completedPuzzleIds));
    const currentIndex = unlockedPuzzles.findIndex((puzzle) => puzzle.id === activePuzzle.id);
    const nextPuzzle = unlockedPuzzles[(currentIndex + 1) % unlockedPuzzles.length] || dailyPuzzle;
    selectPuzzle(nextPuzzle.id);
  }

  function selectView(view) {
    activeView = view;
    resetOpen = false;
    settingsOpen = false;
    draw();
  }

  function requestReset() {
    resetOpen = true;
    settingsOpen = false;
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

  function requestSettings() {
    settingsOpen = true;
    resetOpen = false;
    draw();
  }

  function closeSettings() {
    settingsOpen = false;
    draw();
  }

  function changeLanguage(preference) {
    setLanguagePreference(preference);
    draw();
  }

  function draw() {
    root.innerHTML = "";
    root.appendChild(createShell({
      activePuzzle,
      activeView,
      dailyPuzzle,
      resetOpen,
      settingsOpen,
      onSelectPuzzle: selectPuzzle,
      onSelectView: selectView,
      onRequestReset: requestReset,
      onCancelReset: cancelReset,
      onConfirmReset: confirmReset,
      onRequestSettings: requestSettings,
      onCloseSettings: closeSettings,
      onLanguageChange: changeLanguage,
      onNextPuzzle: selectNextPuzzle
    }));
  }

  draw();
}

function getStartPuzzle() {
  return puzzles.find((puzzle) => puzzle.id === "pip-face-5") || puzzles[0];
}

function createShell({
  activePuzzle,
  activeView,
  dailyPuzzle,
  resetOpen,
  settingsOpen,
  onSelectPuzzle,
  onSelectView,
  onRequestReset,
  onCancelReset,
  onConfirmReset,
  onRequestSettings,
  onCloseSettings,
  onLanguageChange,
  onNextPuzzle
}) {
  const shell = document.createElement("main");
  shell.className = "app-shell";

  shell.appendChild(createHeader(onRequestSettings, onRequestReset));
  shell.appendChild(createPipStrip(activePuzzle, activeView));
  shell.appendChild(createViewTabs(activeView, onSelectView));

  if (activeView === "album") {
    shell.appendChild(renderAlbumView());
  } else {
    shell.appendChild(renderPuzzleView(activePuzzle, {
      onViewAlbum: () => onSelectView("album"),
      onNextPuzzle
    }));
    shell.appendChild(createDailyCard(dailyPuzzle, activePuzzle.id, onSelectPuzzle));
    shell.appendChild(createPuzzlePicker(activePuzzle.id, onSelectPuzzle));
  }

  shell.appendChild(createFooter());

  if (resetOpen) {
    shell.appendChild(createResetDialog(onCancelReset, onConfirmReset));
  }

  if (settingsOpen) {
    shell.appendChild(createSettingsDialog(onCloseSettings, onLanguageChange));
  }

  return shell;
}

function createHeader(onSettings, onReset) {
  const header = document.createElement("header");
  header.className = "top-bar";

  const titleGroup = document.createElement("div");
  titleGroup.className = "title-group";
  titleGroup.innerHTML = `
    <p class="studio-name">${t("app.studioName")}</p>
    <h1>${t("app.title")}</h1>
  `;

  const actions = document.createElement("div");
  actions.className = "header-actions";

  const settingsButton = document.createElement("button");
  settingsButton.className = "icon-button";
  settingsButton.type = "button";
  settingsButton.title = t("header.settings");
  settingsButton.setAttribute("aria-label", t("header.settings"));
  settingsButton.textContent = "\u2699";
  settingsButton.addEventListener("click", onSettings);

  const resetButton = document.createElement("button");
  resetButton.className = "icon-button";
  resetButton.type = "button";
  resetButton.title = t("header.resetProgress");
  resetButton.setAttribute("aria-label", t("header.resetProgress"));
  resetButton.textContent = "\u21ba";
  resetButton.addEventListener("click", onReset);

  actions.append(settingsButton, resetButton);
  header.append(titleGroup, actions);
  return header;
}

function createPipStrip(puzzle, activeView) {
  const strip = document.createElement("section");
  strip.className = "pip-strip";
  const puzzleTitle = puzzleText(puzzle.id, "title");
  const line = activeView === "album" ? t("pipStrip.albumLine") : t("pipStrip.puzzleLine");
  const note = activeView === "album" ? t("pipStrip.albumNote") : t("pipStrip.puzzleNote", { title: puzzleTitle });
  strip.innerHTML = `
    <img class="pip-strip__portrait" src="${pipStripStickerUrl}" alt="" />
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
  const completedPuzzleIds = getCompletedPuzzleIds();
  const completedPuzzleIdSet = new Set(completedPuzzleIds);
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
          const unlocked = isPuzzleUnlocked(puzzle, completedPuzzleIds);
          const complete = completedPuzzleIdSet.has(puzzle.id);
          const button = document.createElement("button");
          button.type = "button";
          button.className = getPuzzleChipClass(puzzle, activePuzzleId, unlocked, complete);
          button.dataset.access = puzzle.access;
          button.dataset.size = String(puzzle.size);
          button.dataset.complete = String(complete);
          button.disabled = !unlocked;

          const label = document.createElement("span");
          label.textContent = puzzleText(puzzle.id, "title");
          button.appendChild(label);

          const meta = document.createElement("small");
          meta.textContent = complete
            ? t("puzzlePicker.sizeComplete", { size: puzzle.size })
            : t("puzzlePicker.size", { size: puzzle.size });
          button.appendChild(meta);

          if (!unlocked) {
            const progress = getUnlockRequirementProgress(puzzle, completedPuzzleIds);
            const requirement = document.createElement("small");
            requirement.textContent = getUnlockRequirementLabel(progress);
            button.appendChild(requirement);
            button.title = requirement.textContent;
            button.setAttribute("aria-label", `${puzzleText(puzzle.id, "title")} - ${meta.textContent} - ${requirement.textContent}`);
          } else {
            button.setAttribute("aria-label", `${puzzleText(puzzle.id, "title")} - ${meta.textContent}`);
            button.addEventListener("click", () => onSelectPuzzle(puzzle.id));
          }

          list.appendChild(button);
        });

      packBlock.appendChild(list);
      section.appendChild(packBlock);
    });

  return section;
}


function getPuzzleChipClass(puzzle, activePuzzleId, unlocked, complete) {
  const classes = ["puzzle-chip"];
  if (puzzle.id === activePuzzleId) {
    classes.push("active");
  }
  if (!unlocked) {
    classes.push("locked");
  }
  if (complete) {
    classes.push("complete");
  }
  return classes.join(" ");
}

function getUnlockRequirementLabel(progress) {
  if (!progress) {
    return t("packs.locked");
  }
  return t("packs.completeToUnlock", { count: progress.required });
}

function createResetDialog(onCancel, onConfirm) {
  const overlay = createModalBackdrop();

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

function createSettingsDialog(onClose, onLanguageChange) {
  const overlay = createModalBackdrop();
  const preference = getLanguagePreference();

  const dialog = document.createElement("section");
  dialog.className = "settings-dialog";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "settings-dialog-title");
  dialog.innerHTML = `
    <h2 id="settings-dialog-title">${t("settings.title")}</h2>
    <p>${t("settings.languageNote")}</p>
  `;

  const group = document.createElement("div");
  group.className = "language-options";
  group.setAttribute("role", "group");
  group.setAttribute("aria-label", t("settings.language"));

  [
    ["system", t("settings.systemDefault")],
    ["en", t("settings.english")],
    ["ko", t("settings.korean")]
  ].forEach(([value, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = preference === value ? "language-option active" : "language-option";
    button.textContent = label;
    button.setAttribute("aria-pressed", String(preference === value));
    button.addEventListener("click", () => onLanguageChange(value));
    group.appendChild(button);
  });

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "tool-button settings-close";
  closeButton.textContent = t("settings.close");
  closeButton.addEventListener("click", onClose);

  dialog.append(group, closeButton);
  overlay.appendChild(dialog);
  return overlay;
}

function createModalBackdrop() {
  const overlay = document.createElement("div");
  overlay.className = "modal-backdrop";
  overlay.setAttribute("role", "presentation");
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
