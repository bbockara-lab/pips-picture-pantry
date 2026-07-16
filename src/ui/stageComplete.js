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
  const bonus = Math.max(0, Number(completionResult?.bonus || 0));

  if (hasApprovedStageArt(pack.id)) {
    const art = document.createElement("img");
    art.className = "stage-complete-pip";
    art.src = getStageArtUrl(pack.id);
    art.alt = "";
    card.appendChild(art);
  } else {
    const pendingArt = document.createElement("div");
    pendingArt.className = "stage-complete-pip stage-complete-pending-art";
    pendingArt.setAttribute("aria-hidden", "true");
    appendTextElement(pendingArt, "strong", "", t("badges.artPendingShort"));
    card.appendChild(pendingArt);
  }

  const copy = document.createElement("div");
  copy.className = "stage-complete-copy";
  appendTextElement(copy, "p", "stage-complete-eyebrow", t("stageComplete.eyebrow"));
  appendTextElement(copy, "h2", "", t(pack.titleKey));
  appendTextElement(copy, "p", "", t("stageComplete.message"));

  if (bonus > 0) {
    const bonusLine = document.createElement("p");
    bonusLine.className = "stage-complete-bonus";
    const token = document.createElement("img");
    token.src = spoonTokenUrl;
    token.alt = "";
    bonusLine.append(token, document.createTextNode(` ${t("stageComplete.bonus", { count: bonus })}`));
    copy.appendChild(bonusLine);
  }

  const facts = document.createElement("div");
  facts.className = "stage-complete-facts";
  facts.setAttribute("aria-label", t("stageComplete.factsLabel"));
  appendTextElement(facts, "span", "", t("stageComplete.albumFact"));
  appendTextElement(facts, "span", "", t("stageComplete.nextFact"));
  copy.appendChild(facts);

  const cta = document.createElement("button");
  cta.type = "button";
  cta.className = "tool-button stage-complete-cta";
  cta.textContent = t("stageComplete.cta");
  copy.appendChild(cta);
  card.appendChild(copy);

  function dismiss() {
    overlay.classList.add("stage-complete-overlay--exit");
    globalThis.setTimeout(() => {
      overlay.remove();
      onDismiss();
    }, 180);
  }

  cta.addEventListener("click", dismiss);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      dismiss();
    }
  });
  card.addEventListener("click", (event) => event.stopPropagation());
  overlay.appendChild(card);
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
