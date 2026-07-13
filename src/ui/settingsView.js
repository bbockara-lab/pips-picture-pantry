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
  dialog.innerHTML = `
    <h2 id="settings-dialog-title">${t("settings.title")}</h2>
    <p>${t("settings.languageNote")}</p>
  `;

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
  playerForm.innerHTML = `
    <label for="player-name-input">${t("settings.playerName")}</label>
    <div>
      <input id="player-name-input" name="playerName" maxlength="18" autocomplete="nickname" value="${escapeAttribute(playerName)}" />
      <button type="submit" class="tool-button settings-choice settings-choice--save">${t("settings.savePlayer")}</button>
    </div>
  `;
  playerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    onPlayerChange(new FormData(playerForm).get("playerName"));
  });

  const controlGroup = document.createElement("div");
  controlGroup.className = "control-options";
  controlGroup.innerHTML = `<p class="section-label">${t("settings.controls")}</p><p>${t("settings.controlsNote")}</p>`;
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
  audioGroup.innerHTML = `<p class="section-label">${t("settings.sound")}</p>`;
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

function escapeAttribute(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
