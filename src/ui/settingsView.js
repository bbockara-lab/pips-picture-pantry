import { getActivePlayerName } from "../game/save.js";
import { getLanguagePreference, t } from "../i18n/index.js";
import { getAudioPreferences } from "./audio.js";

export function renderSettingsDialog({
  onClose,
  onLanguageChange,
  onPlayerChange,
  onSfxChange,
  onMusicChange,
  controlMode,
  onControlModeChange
}) {
  const overlay = createModalBackdrop();
  const preference = getLanguagePreference();
  const playerName = getActivePlayerName();
  const audio = getAudioPreferences();

  const dialog = document.createElement("section");
  dialog.className = "settings-dialog";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "settings-dialog-title");
  const title = document.createElement("h2");
  title.id = "settings-dialog-title";
  title.textContent = t("settings.title");
  const languageNote = document.createElement("p");
  languageNote.textContent = t("settings.languageNote");
  dialog.append(title, languageNote);

  const group = document.createElement("div");
  group.className = "language-options settings-choice-grid settings-choice-grid--language";
  group.setAttribute("role", "group");
  group.setAttribute("aria-label", t("settings.language"));

  [
    ["system", t("settings.systemDefault")],
    ["en", t("settings.english")],
    ["ko", t("settings.korean")]
  ].forEach(([value, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = preference === value
      ? "language-option settings-choice settings-choice--language active"
      : "language-option settings-choice settings-choice--language";
    button.textContent = label;
    button.setAttribute("aria-pressed", String(preference === value));
    button.addEventListener("click", () => onLanguageChange(value));
    group.appendChild(button);
  });

  const playerForm = document.createElement("form");
  playerForm.className = "player-form";
  const playerLabel = document.createElement("label");
  playerLabel.setAttribute("for", "player-name-input");
  playerLabel.textContent = t("settings.playerName");
  const playerRow = document.createElement("div");
  const playerInput = document.createElement("input");
  playerInput.id = "player-name-input";
  playerInput.name = "playerName";
  playerInput.maxLength = 18;
  playerInput.autocomplete = "nickname";
  playerInput.value = playerName;
  const playerSave = document.createElement("button");
  playerSave.type = "submit";
  playerSave.className = "tool-button settings-choice settings-choice--save";
  playerSave.textContent = t("settings.savePlayer");
  playerRow.append(playerInput, playerSave);
  playerForm.append(playerLabel, playerRow);
  playerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    onPlayerChange(new FormData(playerForm).get("playerName"));
  });

  const controlGroup = document.createElement("div");
  controlGroup.className = "control-options";
  const controlLabel = document.createElement("p");
  controlLabel.className = "section-label";
  controlLabel.textContent = t("settings.controls");
  const controlNote = document.createElement("p");
  controlNote.textContent = t("settings.controlsNote");
  controlGroup.append(controlLabel, controlNote);
  const controlButtons = document.createElement("div");
  controlButtons.className = "language-options compact settings-choice-grid settings-choice-grid--control";
  controlButtons.setAttribute("role", "group");
  controlButtons.setAttribute("aria-label", t("settings.controls"));
  [
    ["auto", t("settings.controlsAuto")],
    ["direct", t("settings.controlsDirect")],
    ["cursor", t("settings.controlsCursor")]
  ].forEach(([value, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = controlMode === value
      ? "language-option settings-choice settings-choice--control active"
      : "language-option settings-choice settings-choice--control";
    button.textContent = label;
    button.setAttribute("aria-pressed", String(controlMode === value));
    button.addEventListener("click", () => onControlModeChange(value));
    controlButtons.appendChild(button);
  });
  controlGroup.appendChild(controlButtons);

  const audioGroup = document.createElement("div");
  audioGroup.className = "audio-options";
  const audioLabel = document.createElement("p");
  audioLabel.className = "section-label";
  audioLabel.textContent = t("settings.sound");
  audioGroup.appendChild(audioLabel);
  audioGroup.append(
    createAudioToggle(t("settings.sfx"), audio.sfx, onSfxChange),
    createAudioToggle(t("settings.music"), audio.music, onMusicChange)
  );

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "tool-button settings-choice settings-choice--close settings-close";
  closeButton.textContent = t("settings.close");
  closeButton.addEventListener("click", onClose);

  dialog.append(group, playerForm, controlGroup, audioGroup, closeButton);
  overlay.appendChild(dialog);
  return overlay;
}

function createAudioToggle(label, active, onChange) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = active
    ? "language-option settings-choice settings-choice--audio active"
    : "language-option settings-choice settings-choice--audio";
  button.textContent = label;
  button.setAttribute("aria-pressed", String(active));
  button.addEventListener("click", () => onChange(!active));
  return button;
}

function createModalBackdrop() {
  const overlay = document.createElement("div");
  overlay.className = "modal-backdrop";
  overlay.setAttribute("role", "presentation");
  return overlay;
}
