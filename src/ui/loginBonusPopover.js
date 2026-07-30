import pipArtUrl from "../assets/characters/pip-chrome-v2.png";
import { t } from "../i18n/index.js";

export function renderLoginBonusPopover(count, onDismiss) {
  const message = t("toast.loginBonus", { count });
  const popover = document.createElement("button");
  popover.type = "button";
  popover.className = "login-bonus-popover";
  popover.setAttribute("aria-label", message);

  const pip = document.createElement("img");
  pip.className = "login-bonus-popover__pip";
  pip.src = pipArtUrl;
  pip.alt = "";
  pip.dataset.assetId = "pip-chrome-v2";

  const bubble = document.createElement("span");
  bubble.className = "login-bonus-popover__bubble";
  bubble.textContent = message;

  popover.append(pip, bubble);
  popover.addEventListener("click", onDismiss, { once: true });
  return popover;
}