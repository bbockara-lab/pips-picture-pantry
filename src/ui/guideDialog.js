import pipGuideSceneUrl from "../assets/characters/pip-chrome-v2.png";
import { isRuntimeGuideArtApproved } from "../data/runtimeArt.js";
import { t } from "../i18n/index.js";

const GUIDE_ART_ASSET_ID = "pip-chrome-v2";
const GUIDE_STEPS = {
  puzzle: ["guide.puzzle.step1", "guide.puzzle.step2", "guide.puzzle.step3"],
  timeAttack: ["guide.timeAttack.step1", "guide.timeAttack.step2", "guide.timeAttack.step3"],
  pantryFirstPurchase: ["guide.pantryFirstPurchase.step1", "guide.pantryFirstPurchase.step2", "guide.pantryFirstPurchase.step3"]
};

export function renderGuideDialog(guideId, onClose) {
  const steps = GUIDE_STEPS[guideId] || GUIDE_STEPS.puzzle;
  let index = 0;

  const overlay = document.createElement("div");
  overlay.className = "guide-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "guide-dialog-title");

  const card = document.createElement("section");
  card.className = "guide-dialog";
  overlay.appendChild(card);

  function draw() {
    const isLast = index >= steps.length - 1;
    const artMarkup = isRuntimeGuideArtApproved(GUIDE_ART_ASSET_ID)
      ? `<div class="guide-dialog__art" aria-hidden="true"><img src="${pipGuideSceneUrl}" alt="" /></div>`
      : "";
    card.innerHTML = `
      ${artMarkup}
      <div class="guide-dialog__bubble">
        <p class="guide-dialog__eyebrow">${t("guide.eyebrow")}</p>
        <h2 id="guide-dialog-title">${t(`guide.${guideId}.title`)}</h2>
        <p>${t(steps[index])}</p>
        <div class="guide-dialog__dots" aria-hidden="true">
          ${steps.map((_, stepIndex) => `<span class="${stepIndex === index ? "active" : ""}"></span>`).join("")}
        </div>
        <div class="guide-dialog__actions">
          <button type="button" class="guide-dialog__skip">${t("guide.skip")}</button>
          <button type="button" class="guide-dialog__next">${isLast ? t("guide.done") : t("guide.next")}</button>
        </div>
      </div>
    `;
    card.querySelector(".guide-dialog__skip").addEventListener("click", onClose);
    card.querySelector(".guide-dialog__next").addEventListener("click", () => {
      if (isLast) {
        onClose();
        return;
      }
      index += 1;
      draw();
    });
  }

  draw();
  return overlay;
}

