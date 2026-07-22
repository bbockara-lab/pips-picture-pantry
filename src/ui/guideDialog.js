import pipGuideSceneUrl from "../assets/characters/pip-chrome-v2.png";
import storyFriendsSheetUrl from "../assets/characters/story-friends-sheet-v1-clean.png";
import { isRuntimeGuideArtApproved } from "../data/runtimeArt.js";
import { t } from "../i18n/index.js";

const GUIDE_ART_ASSET_ID = "pip-chrome-v2";
const NEIGHBOR_ART_ASSET_ID = "story-friends-sheet-v1-clean";
const GUIDE_STEPS = {
  puzzle: ["guide.puzzle.step1", "guide.puzzle.step2", "guide.puzzle.step3"],
  timeAttack: ["guide.timeAttack.step1", "guide.timeAttack.step2", "guide.timeAttack.step3"],
  pantryFirstPurchase: ["guide.pantryFirstPurchase.step1", "guide.pantryFirstPurchase.step2", "guide.pantryFirstPurchase.step3"],
  pantryRoomStory: ["guide.pantryRoomStory.step1", "guide.pantryRoomStory.step2", "guide.pantryRoomStory.step3"],
  pantryNeighborMrPark: ["guide.pantryNeighborMrPark.step1", "guide.pantryNeighborMrPark.step2", "guide.pantryNeighborMrPark.step3"],
  pantryNeighborLily: ["guide.pantryNeighborLily.step1", "guide.pantryNeighborLily.step2", "guide.pantryNeighborLily.step3"],
  pantryNeighborMateo: ["guide.pantryNeighborMateo.step1", "guide.pantryNeighborMateo.step2", "guide.pantryNeighborMateo.step3"]
};
const NEIGHBOR_GUIDE_CLASSES = {
  pantryNeighborMrPark: "mr-park",
  pantryNeighborLily: "lily",
  pantryNeighborMateo: "mateo"
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
  card.className = `guide-dialog guide-dialog--${guideId}`;
  card.dataset.guideId = guideId;
  overlay.appendChild(card);

  function draw() {
    const isLast = index >= steps.length - 1;
    card.dataset.step = String(index + 1);

    const nodes = [];
    const neighborClass = NEIGHBOR_GUIDE_CLASSES[guideId];
    if (neighborClass && isRuntimeGuideArtApproved(NEIGHBOR_ART_ASSET_ID)) {
      const art = document.createElement("div");
      art.className = `guide-dialog__art guide-dialog__art--neighbor guide-dialog__art--${neighborClass}`;
      art.setAttribute("aria-hidden", "true");

      const image = document.createElement("img");
      image.className = "guide-dialog__neighbor-sheet";
      image.src = storyFriendsSheetUrl;
      image.alt = "";
      art.appendChild(image);
      nodes.push(art);
    } else if (isRuntimeGuideArtApproved(GUIDE_ART_ASSET_ID)) {
      const art = document.createElement("div");
      art.className = "guide-dialog__art";
      art.setAttribute("aria-hidden", "true");

      const image = document.createElement("img");
      image.src = pipGuideSceneUrl;
      image.alt = "";
      art.appendChild(image);
      nodes.push(art);
    }

    const bubble = document.createElement("div");
    bubble.className = "guide-dialog__bubble";

    const eyebrow = document.createElement("p");
    eyebrow.className = "guide-dialog__eyebrow";
    eyebrow.textContent = t("guide.eyebrow");

    const speaker = document.createElement("div");
    speaker.className = "guide-dialog__speaker";
    speaker.textContent = t("guide.speaker");

    const title = document.createElement("h2");
    title.id = "guide-dialog-title";
    title.textContent = t(`guide.${guideId}.title`);

    const body = document.createElement("p");
    body.className = "guide-dialog__line";
    body.textContent = t(steps[index]);

    const dots = document.createElement("div");
    dots.className = "guide-dialog__dots";
    dots.setAttribute("aria-hidden", "true");
    steps.forEach((_, stepIndex) => {
      const dot = document.createElement("span");
      if (stepIndex === index) {
        dot.className = "active";
      }
      dots.appendChild(dot);
    });

    const actions = document.createElement("div");
    actions.className = "guide-dialog__actions";

    const skipButton = document.createElement("button");
    skipButton.type = "button";
    skipButton.className = "guide-dialog__skip";
    skipButton.textContent = t("guide.skip");

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "guide-dialog__next";
    nextButton.textContent = isLast ? t("guide.done") : t("guide.next");

    actions.append(skipButton, nextButton);
    bubble.append(eyebrow, speaker, title, body, dots, actions);
    nodes.push(bubble);

    card.replaceChildren(...nodes);
    skipButton.addEventListener("click", onClose);
    nextButton.addEventListener("click", () => {
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

