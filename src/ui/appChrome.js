import spoonTokenUrl from "../assets/icons/spoon-token-v2.png";
import { getBadgeArtUrl } from "../data/badgeArt.js";
import { getEarnedPackBadges } from "../game/badges.js";
import { getCompletedPuzzleIds, getPantrySpoons } from "../game/save.js";
import { t } from "../i18n/index.js";
import { appendPuzzleControlArt } from "./puzzleControlArt.js";

export function renderHeader(onSettings, onReset) {
  const header = document.createElement("header");
  header.className = "top-bar";

  const titleGroup = document.createElement("div");
  titleGroup.className = "title-group";
  appendTextElement(titleGroup, "p", "studio-name", t("app.studioName"));
  appendTextElement(titleGroup, "h1", "", t("app.title"));

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
  appendPuzzleControlArt(settingsButton, "settings", "icon-button__raster-art");
  settingsButton.addEventListener("click", onSettings);

  const resetButton = document.createElement("button");
  resetButton.className = "icon-button icon-button--reset";
  resetButton.type = "button";
  resetButton.title = t("header.resetProgress");
  resetButton.setAttribute("aria-label", t("header.resetProgress"));
  appendPuzzleControlArt(resetButton, "reset", "icon-button__raster-art");
  resetButton.addEventListener("click", onReset);

  actions.append(currency, settingsButton, resetButton);
  header.append(titleGroup, actions);
  return header;
}

export function renderBadgeShelf() {
  const earnedBadges = getEarnedPackBadges(getCompletedPuzzleIds());
  if (!earnedBadges.length) {
    return null;
  }
  const shelf = document.createElement("section");
  shelf.className = "badge-shelf earned";
  shelf.setAttribute("aria-label", t("badges.earnedShelfAria", { count: earnedBadges.length }));
  earnedBadges.slice(0, 3).forEach((status) => {
    const item = document.createElement("div");
    item.className = "badge-shelf__item";
    const token = document.createElement("div");
    token.className = "badge-shelf__token";
    token.setAttribute("aria-hidden", "true");
    const image = document.createElement("img");
    image.src = getBadgeArtUrl(status.badge.id);
    image.alt = "";
    token.appendChild(image);
    const copy = document.createElement("div");
    appendTextElement(copy, "p", "", t(status.badge.titleKey));
    appendTextElement(copy, "small", "", t("badges.earned"));
    item.append(token, copy);
    shelf.appendChild(item);
  });
  return shelf;
}

export function renderResetDialog(onCancel, onConfirm) {
  const overlay = createModalBackdrop();

  const dialog = document.createElement("section");
  dialog.className = "reset-dialog";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "reset-dialog-title");
  const title = appendTextElement(dialog, "h2", "", t("header.resetTitle"));
  title.id = "reset-dialog-title";
  appendTextElement(dialog, "p", "", t("header.resetBody"));

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

export function createSpoonIcon(size = "") {
  const icon = document.createElement("img");
  icon.className = size ? `spoon-icon ${size}` : "spoon-icon";
  icon.src = spoonTokenUrl;
  icon.alt = "";
  icon.setAttribute("aria-hidden", "true");
  return icon;
}

function appendTextElement(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  element.textContent = text;
  parent.appendChild(element);
  return element;
}

function createModalBackdrop() {
  const overlay = document.createElement("div");
  overlay.className = "modal-backdrop";
  overlay.setAttribute("role", "presentation");
  return overlay;
}
