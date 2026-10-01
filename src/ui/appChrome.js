
import { t } from "../i18n/index.js";
import { appendPuzzleControlArt } from "./puzzleControlArt.js";

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
