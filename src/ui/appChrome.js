import pipStripStickerUrl from "../assets/characters/pip-chrome-v2.png";
import spoonTokenUrl from "../assets/icons/spoon-token-v2.png";
import { getBadgeArtUrl } from "../data/badgeArt.js";
import { getEarnedPackBadges } from "../game/badges.js";
import { getActivePlayerName, getCompletedPuzzleIds, getPantrySpoons } from "../game/save.js";
import { puzzleTitle, t } from "../i18n/index.js";

export function renderHeader(onSettings, onReset) {
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
  currency.append(createSpoonIcon(), document.createTextNode(String(getPantrySpoons())));
  currency.setAttribute("aria-label", t("currency.spoons", { count: getPantrySpoons() }));

  const settingsButton = document.createElement("button");
  settingsButton.className = "icon-button icon-button--settings";
  settingsButton.type = "button";
  settingsButton.title = t("header.settings");
  settingsButton.setAttribute("aria-label", t("header.settings"));
  settingsButton.addEventListener("click", onSettings);

  const resetButton = document.createElement("button");
  resetButton.className = "icon-button icon-button--reset";
  resetButton.type = "button";
  resetButton.title = t("header.resetProgress");
  resetButton.setAttribute("aria-label", t("header.resetProgress"));
  resetButton.addEventListener("click", onReset);

  actions.append(currency, settingsButton, resetButton);
  header.append(titleGroup, actions);
  return header;
}

export function renderPipStrip(puzzle, activeView) {
  const strip = document.createElement("section");
  strip.className = "pip-strip";
  const playerName = getActivePlayerName() || t("playerIntro.defaultName");
  const puzzleName = puzzleTitle(puzzle);
  const completedCount = getCompletedPuzzleIds().length;
  const line = activeView === "album"
    ? t("pipStrip.albumLine")
    : activeView === "map"
      ? t("pipStrip.mapLine")
      : activeView === "pantry"
        ? t("pipStrip.pantryLine")
        : getPipPuzzleLine(playerName, completedCount);
  const note = activeView === "album"
    ? t("pipStrip.albumNote")
    : activeView === "map"
      ? t("pipStrip.mapNote")
      : activeView === "pantry"
        ? t("pipStrip.pantryNote")
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

export function renderBadgeShelf() {
  const earnedBadges = getEarnedPackBadges(getCompletedPuzzleIds());
  if (!earnedBadges.length) {
    return null;
  }
  const shelf = document.createElement("section");
  shelf.className = "badge-shelf earned";
  shelf.setAttribute("aria-label", t("badges.earnedShelfAria", { count: earnedBadges.length }));
  shelf.innerHTML = earnedBadges.slice(0, 3).map((status) => `
    <div class="badge-shelf__item">
      <div class="badge-shelf__token" aria-hidden="true">
        <img src="${getBadgeArtUrl(status.badge.id)}" alt="" />
      </div>
      <div>
        <p>${t(status.badge.titleKey)}</p>
        <small>${t("badges.earned")}</small>
      </div>
    </div>
  `).join("");
  return shelf;
}

export function renderResetDialog(onCancel, onConfirm) {
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

export function renderFooter(version) {
  const footer = document.createElement("footer");
  footer.className = "app-footer";
  footer.textContent = t("app.versionLabel", { version });
  return footer;
}

export function createSpoonIcon(size = "") {
  const icon = document.createElement("img");
  icon.className = size ? `spoon-icon ${size}` : "spoon-icon";
  icon.src = spoonTokenUrl;
  icon.alt = "";
  icon.setAttribute("aria-hidden", "true");
  return icon;
}

function getPipPuzzleLine(playerName, completedCount) {
  if (completedCount === 0) {
    return t("pipStrip.puzzleLineFirst", { player: playerName });
  }
  if (completedCount < 5) {
    return t("pipStrip.puzzleLineEarly", { player: playerName });
  }
  if (completedCount < 15) {
    return t("pipStrip.puzzleLineMid", { player: playerName });
  }
  return t("pipStrip.puzzleLineLate", { player: playerName });
}

function createModalBackdrop() {
  const overlay = document.createElement("div");
  overlay.className = "modal-backdrop";
  overlay.setAttribute("role", "presentation");
  return overlay;
}