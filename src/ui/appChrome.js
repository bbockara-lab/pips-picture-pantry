
import { getBadgeArtUrl } from "../data/badgeArt.js";
import { getEarnedPackBadges } from "../game/badges.js";
import { getCompletedPuzzleIds } from "../game/save.js";
import { t } from "../i18n/index.js";
import { appendPuzzleControlArt } from "./puzzleControlArt.js";

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
