import pipStripStickerUrl from "../assets/characters/pip-strip-sticker-v1.png";
import { getPackById, puzzlePacks } from "../data/packs.js";
import { puzzles } from "../data/puzzles.js";
import { getDailyPuzzle } from "../game/dailyPuzzle.js";
import {
  canUnlockPack,
  getActivePlayerName,
  getCompletedPuzzleIds,
  getPantrySpoons,
  isPackUnlocked,
  resetProgress,
  setActivePlayerName,
  unlockPack
} from "../game/save.js";
import { getLanguagePreference, puzzleTitle, setLanguagePreference, t } from "../i18n/index.js";
import { renderAlbumView } from "./albumView.js";
import { getAudioPreferences, setMusicEnabled, setSfxEnabled, startMusic, stopMusic } from "./audio.js";
import { renderPantryMapView } from "./mapView.js";
import { renderPuzzleView } from "./puzzleView.js";

export const APP_VERSION = "v0.1.14";
const DAILY_BONUS = 5;

export function renderApp(root) {
  const dailyPuzzle = getDailyPuzzle(puzzles);
  let activePuzzle = getStartPuzzle();
  let activeView = "puzzle";
  let resetOpen = false;
  let settingsOpen = false;

  function selectPuzzle(puzzleId) {
    const nextPuzzle = puzzles.find((puzzle) => puzzle.id === puzzleId) || dailyPuzzle;
    if (!isPackUnlocked(getPackById(nextPuzzle.packId))) {
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
    const unlockedPuzzles = puzzles.filter((puzzle) => isPackUnlocked(getPackById(puzzle.packId)));
    const nextUnfinished = unlockedPuzzles.find((puzzle) => !completedPuzzleIds.includes(puzzle.id));
    if (nextUnfinished) {
      selectPuzzle(nextUnfinished.id);
      return;
    }
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
    activePuzzle = getStartPuzzle();
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

  function changePlayerName(name) {
    setActivePlayerName(name);
    settingsOpen = false;
    draw();
  }

  function changeSfx(enabled) {
    setSfxEnabled(enabled);
    draw();
  }

  function changeMusic(enabled) {
    setMusicEnabled(enabled);
    if (enabled) {
      startMusic();
    } else {
      stopMusic();
    }
    draw();
  }

  function requestUnlockPack(packId) {
    unlockPack(getPackById(packId));
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
      onPlayerChange: changePlayerName,
      onSfxChange: changeSfx,
      onMusicChange: changeMusic,
      onUnlockPack: requestUnlockPack,
      onNextPuzzle: selectNextPuzzle
    }));
  }

  draw();
}

function getStartPuzzle() {
  return puzzles.find((puzzle) => puzzle.id === "pips-first-shelf-pip-face-1") || puzzles[0];
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
  onPlayerChange,
  onSfxChange,
  onMusicChange,
  onUnlockPack,
  onNextPuzzle
}) {
  const shell = document.createElement("main");
  shell.className = "app-shell";

  shell.appendChild(createHeader(onRequestSettings, onRequestReset));
  shell.appendChild(createPipStrip(activePuzzle, activeView));
  shell.appendChild(createViewTabs(activeView, onSelectView));

  if (activeView === "album") {
    shell.appendChild(renderAlbumView());
  } else if (activeView === "map") {
    shell.appendChild(renderPantryMapView());
  } else {
    shell.appendChild(renderPuzzleView(activePuzzle, {
      dailyKey: activePuzzle.id === dailyPuzzle.id ? getDailyKey() : null,
      dailyBonus: activePuzzle.id === dailyPuzzle.id ? DAILY_BONUS : 0,
      onViewAlbum: () => onSelectView("album"),
      onNextPuzzle
    }));
    shell.appendChild(createDailyCard(dailyPuzzle, activePuzzle.id, onSelectPuzzle));
    shell.appendChild(createPuzzlePicker(activePuzzle.id, onSelectPuzzle, onUnlockPack));
  }

  shell.appendChild(createFooter());

  if (resetOpen) {
    shell.appendChild(createResetDialog(onCancelReset, onConfirmReset));
  }

  if (settingsOpen) {
    shell.appendChild(createSettingsDialog(onCloseSettings, onLanguageChange, onPlayerChange, onSfxChange, onMusicChange));
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

  const currency = document.createElement("p");
  currency.className = "currency-pill";
  currency.textContent = t("currency.spoons", { count: getPantrySpoons() });

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

  actions.append(currency, settingsButton, resetButton);
  header.append(titleGroup, actions);
  return header;
}

function createPipStrip(puzzle, activeView) {
  const strip = document.createElement("section");
  strip.className = "pip-strip";
  const playerName = getActivePlayerName() || t("playerIntro.defaultName");
  const puzzleName = puzzleTitle(puzzle);
  const line = activeView === "album"
    ? t("pipStrip.albumLine")
    : activeView === "map"
      ? t("pipStrip.mapLine")
      : t("pipStrip.puzzleLine", { player: playerName });
  const note = activeView === "album"
    ? t("pipStrip.albumNote")
    : activeView === "map"
      ? t("pipStrip.mapNote")
      : t("pipStrip.puzzleNote", { title: puzzleName });
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
    ["album", t("views.album")],
    ["map", t("views.map")]
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
    <h2>${puzzleTitle(dailyPuzzle)}</h2>
    <p>${t("daily.note", { count: DAILY_BONUS })}</p>
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

function createPuzzlePicker(activePuzzleId, onSelectPuzzle, onUnlockPack) {
  const completedPuzzleIds = getCompletedPuzzleIds();
  const completedPuzzleIdSet = new Set(completedPuzzleIds);
  const section = document.createElement("section");
  section.className = "puzzle-picker content-panel";

  puzzlePacks
    .filter((pack) => puzzles.some((puzzle) => puzzle.packId === pack.id))
    .forEach((pack) => {
      const packPuzzles = puzzles.filter((puzzle) => puzzle.packId === pack.id);
      const completeCount = packPuzzles.filter((puzzle) => completedPuzzleIdSet.has(puzzle.id)).length;
      const unlocked = isPackUnlocked(pack);
      const packBlock = document.createElement("article");
      packBlock.className = unlocked ? "pack-block" : "pack-block locked";

      const header = document.createElement("div");
      header.className = "pack-header";
      header.innerHTML = `
        <div>
          <p class="section-label">${t(pack.titleKey)}</p>
          <p class="pack-note">${t(pack.noteKey)}</p>
        </div>
        <span>${t("packs.progress", { completed: completeCount, total: packPuzzles.length })}</span>
      `;
      packBlock.appendChild(header);
      packBlock.appendChild(createFolderArt(pack, completeCount, packPuzzles.length));

      if (!unlocked) {
        packBlock.appendChild(createUnlockPanel(pack, onUnlockPack));
        section.appendChild(packBlock);
        return;
      }

      const list = document.createElement("div");
      list.className = "puzzle-list";

      packPuzzles.forEach((puzzle) => {
        const complete = completedPuzzleIdSet.has(puzzle.id);
        const button = document.createElement("button");
        button.type = "button";
        button.className = getPuzzleChipClass(puzzle, activePuzzleId, true, complete);
        button.dataset.size = String(puzzle.size);
        button.dataset.complete = String(complete);

        const label = document.createElement("span");
        label.textContent = puzzleTitle(puzzle);
        button.appendChild(label);

        const meta = document.createElement("small");
        meta.textContent = complete
          ? t("puzzlePicker.sizeComplete", { size: puzzle.size })
          : t("puzzlePicker.sizeReward", { size: puzzle.size, count: puzzle.reward || 0 });
        button.appendChild(meta);
        button.setAttribute("aria-label", `${puzzleTitle(puzzle)} - ${meta.textContent}`);
        button.addEventListener("click", () => onSelectPuzzle(puzzle.id));

        list.appendChild(button);
      });

      packBlock.appendChild(list);
      section.appendChild(packBlock);
    });

  return section;
}

function createFolderArt(pack, completeCount, total) {
  const art = document.createElement("div");
  art.className = "folder-art";
  art.setAttribute("aria-hidden", "true");
  art.style.setProperty("--folder-progress", `${Math.round((completeCount / Math.max(total, 1)) * 100)}%`);
  art.innerHTML = `
    <div class="folder-art__tab"></div>
    <div class="folder-art__body">
      <span>${getMuralSymbol(pack.muralPart)}</span>
    </div>
  `;
  return art;
}

function getMuralSymbol(part) {
  if (part === "pip-ear") return "Pip Ear";
  if (part === "pip-cheek") return "Cheek";
  if (part === "pip-scarf") return "Scarf";
  if (part === "pip-hat") return "Hat";
  return "Face";
}

function createUnlockPanel(pack, onUnlockPack) {
  const panel = document.createElement("div");
  panel.className = "unlock-panel";
  const canOpen = canUnlockPack(pack);
  panel.innerHTML = `
    <p>${t("packs.unlockCost", { count: pack.unlockCost })}</p>
    <button type="button" class="tool-button" ${canOpen ? "" : "disabled"}>${canOpen ? t("packs.openFolder") : t("packs.needSpoons", { count: Math.max(0, pack.unlockCost - getPantrySpoons()) })}</button>
  `;
  panel.querySelector("button").addEventListener("click", () => onUnlockPack(pack.id));
  return panel;
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

function createSettingsDialog(onClose, onLanguageChange, onPlayerChange, onSfxChange, onMusicChange) {
  const overlay = createModalBackdrop();
  const preference = getLanguagePreference();
  const playerName = getActivePlayerName();
  const audio = getAudioPreferences();

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

  const playerForm = document.createElement("form");
  playerForm.className = "player-form";
  playerForm.innerHTML = `
    <label for="player-name-input">${t("settings.playerName")}</label>
    <div>
      <input id="player-name-input" name="playerName" maxlength="18" autocomplete="nickname" value="${escapeAttribute(playerName)}" />
      <button type="submit" class="tool-button">${t("settings.savePlayer")}</button>
    </div>
  `;
  playerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    onPlayerChange(new FormData(playerForm).get("playerName"));
  });

  const audioGroup = document.createElement("div");
  audioGroup.className = "audio-options";
  audioGroup.innerHTML = `<p class="section-label">${t("settings.sound")}</p>`;
  audioGroup.append(
    createAudioToggle(t("settings.sfx"), audio.sfx, onSfxChange),
    createAudioToggle(t("settings.music"), audio.music, onMusicChange)
  );

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "tool-button settings-close";
  closeButton.textContent = t("settings.close");
  closeButton.addEventListener("click", onClose);

  dialog.append(group, playerForm, audioGroup, closeButton);
  overlay.appendChild(dialog);
  return overlay;
}

function createAudioToggle(label, active, onChange) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = active ? "language-option active" : "language-option";
  button.textContent = label;
  button.setAttribute("aria-pressed", String(active));
  button.addEventListener("click", () => onChange(!active));
  return button;
}

function escapeAttribute(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function createModalBackdrop() {
  const overlay = document.createElement("div");
  overlay.className = "modal-backdrop";
  overlay.setAttribute("role", "presentation");
  return overlay;
}

function getDailyKey() {
  return new Date().toISOString().slice(0, 10);
}

function createFooter() {
  const footer = document.createElement("footer");
  footer.className = "app-footer";
  footer.textContent = t("app.versionLabel", { version: APP_VERSION });
  return footer;
}
