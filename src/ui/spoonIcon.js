import spoonTokenUrl from "../assets/icons/spoon-token-v2.png";
import spoonBalanceHudUrl from "../assets/icons/spoon-balance-hud-v1.png";
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
  const count = Number(spoons) || 0;
  const label = t("currency.spoons", { count });
  chip.dataset.digits = String(Math.max(1, String(count).length));
  const countElement = document.createElement("span");
  countElement.className = "spoon-balance-chip__count";
  countElement.textContent = String(count);
  const artwork = document.createElement("img");
  artwork.className = "spoon-balance-chip__artwork";
  artwork.src = spoonBalanceHudUrl;
  artwork.alt = "";
  artwork.setAttribute("aria-hidden", "true");
  artwork.dataset.assetId = "spoon-balance-hud-v1";
  chip.replaceChildren(createSpoonIcon("small"), artwork, countElement);
  chip.setAttribute("aria-label", label);
  return chip;
}
