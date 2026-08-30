import pipHarvestGiftUrl from "../assets/seasonal/korean-harvest/pip-chuseok-welcome-gift-v1.webp";
import { t } from "../i18n/index.js";
import { createSpoonIcon } from "./spoonIcon.js";

export function renderSeasonalGiftView(gift, onClose) {
  const overlay = document.createElement("div");
  overlay.className = "seasonal-gift-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "seasonal-gift-title");

  const card = document.createElement("section");
  card.className = "seasonal-gift-card";

  const art = document.createElement("img");
  art.className = "seasonal-gift-card__art";
  art.src = pipHarvestGiftUrl;
  art.alt = t("seasonalGift.artAlt");
  art.dataset.assetId = "pip-chuseok-welcome-gift-v1";

  const eyebrow = document.createElement("p");
  eyebrow.className = "seasonal-gift-card__eyebrow";
  eyebrow.textContent = t("seasonalGift.eyebrow");

  const title = document.createElement("h1");
  title.id = "seasonal-gift-title";
  title.textContent = t("seasonalGift.title");

  const body = document.createElement("p");
  body.className = "seasonal-gift-card__body";
  body.textContent = t("seasonalGift.body");

  const reward = document.createElement("div");
  reward.className = "seasonal-gift-card__reward";
  reward.append(createSpoonIcon("medium"));
  const rewardCopy = document.createElement("strong");
  rewardCopy.textContent = t("seasonalGift.reward", { count: gift?.spoons || 0 });
  reward.appendChild(rewardCopy);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "seasonal-gift-card__button";
  button.textContent = t("seasonalGift.continue");
  button.addEventListener("click", onClose);

  card.append(art, eyebrow, title, body, reward, button);
  overlay.appendChild(card);
  return overlay;
}
