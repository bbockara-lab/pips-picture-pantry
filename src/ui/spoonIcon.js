import spoonTokenUrl from "../assets/icons/spoon-token-v2.png";
import { t } from "../i18n/index.js";

export function createSpoonIcon(size = "") {
  const icon = document.createElement("img");
  icon.className = size ? `spoon-icon ${size}` : "spoon-icon";
  icon.src = spoonTokenUrl;
  icon.alt = "";
  icon.dataset.assetId = "spoon-token-v2";
  icon.setAttribute("aria-hidden", "true");
  return icon;
}

export function appendSpoonLabel(element, localizedText, size = "small") {
  const text = String(localizedText || "").replace(/\u{1F944}/gu, "").replace(/\s+/g, " ").trim();
  element.replaceChildren(document.createTextNode(text + " "), createSpoonIcon(size));
  return element;
}

export function renderSpoonBalanceChip(spoons, onTap = null) {
  const chip = document.createElement(onTap ? "button" : "div");
  if (onTap) {
    chip.type = "button";
    chip.addEventListener("click", onTap);
  }
  chip.className = "spoon-balance-chip";
  const label = t("currency.spoons", { count: Number(spoons) || 0 });
  appendSpoonLabel(chip, label, "small");
  chip.setAttribute("aria-label", label);
  return chip;
}