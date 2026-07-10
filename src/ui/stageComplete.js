import spoonTokenUrl from "../assets/icons/spoon-token-v2.png";
import { getStageArtUrl, hasApprovedStageArt } from "../data/stageArt.js";
import { t } from "../i18n/index.js";

export function renderStageCompleteOverlay(pack, onDismiss = () => {}, completionResult = {}) {
  const overlay = document.createElement("div");
  overlay.className = "stage-complete-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", t("stageComplete.ariaLabel"));

  const card = document.createElement("section");
  card.className = "stage-complete-card";
  const artMarkup = hasApprovedStageArt(pack.id)
    ? `<img class="stage-complete-pip" src="${getStageArtUrl(pack.id)}" alt="" />`
    : `<div class="stage-complete-pip stage-complete-pending-art" aria-hidden="true"><strong>${t("badges.artPendingShort")}</strong></div>`;
  const bonus = Math.max(0, Number(completionResult?.bonus || 0));
  const stageBonusMarkup = bonus > 0
    ? `<p class="stage-complete-bonus"><img src="${spoonTokenUrl}" alt="" /> ${t("stageComplete.bonus", { count: bonus })}</p>`
    : "";

  card.innerHTML = `
    ${artMarkup}
    <div class="stage-complete-copy">
      <p class="stage-complete-eyebrow">${t("stageComplete.eyebrow")}</p>
      <h2>${t(pack.titleKey)}</h2>
      <p>${t("stageComplete.message")}</p>
      ${stageBonusMarkup}
      <button type="button" class="tool-button stage-complete-cta">${t("stageComplete.cta")}</button>
    </div>
  `;

  function dismiss() {
    overlay.classList.add("stage-complete-overlay--exit");
    globalThis.setTimeout(() => {
      overlay.remove();
      onDismiss();
    }, 180);
  }

  card.querySelector("button").addEventListener("click", dismiss);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      dismiss();
    }
  });
  card.addEventListener("click", (event) => event.stopPropagation());
  overlay.appendChild(card);
  return overlay;
}
