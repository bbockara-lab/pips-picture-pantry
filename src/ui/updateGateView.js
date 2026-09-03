import { t } from "../i18n/index.js";

export function renderMandatoryUpdateView(decision, onUpdate) {
  const main = document.createElement("main");
  main.className = "update-gate";
  main.setAttribute("role", "alertdialog");
  main.setAttribute("aria-modal", "true");
  const card = document.createElement("section");
  card.className = "update-gate__card";
  const icon = document.createElement("div");
  icon.className = "update-gate__icon";
  icon.textContent = "🥄";
  const title = document.createElement("h1");
  title.textContent = t("updatePolicy.mandatoryTitle");
  const copy = document.createElement("p");
  copy.textContent = t("updatePolicy.mandatoryMessage", { version: decision.latestVersion });
  const button = document.createElement("button");
  button.type = "button";
  button.className = "update-gate__button";
  button.textContent = t("updatePolicy.updateNow");
  button.addEventListener("click", onUpdate);
  card.append(icon, title, copy, button);
  main.appendChild(card);
  return main;
}
