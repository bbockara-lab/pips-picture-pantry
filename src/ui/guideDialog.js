import pipGuideSceneUrl from "../assets/characters/pip-chrome-v2.png";
import mrParkArtUrl from "../assets/characters/story-friend-mr-park-v1.png";
import lilyArtUrl from "../assets/characters/story-friend-lily-v1.png";
import mateoArtUrl from "../assets/characters/story-friend-mateo-v1.png";
import { isRuntimeGuideArtApproved } from "../data/runtimeArt.js";
import { t } from "../i18n/index.js";

const GUIDE_ART_ASSET_ID = "pip-chrome-v2";
export const PUZZLE_PRACTICE = Object.freeze({
  clue: 5,
  cellCount: 5,
  targetIndexes: Object.freeze([0, 1, 2, 3, 4])
});
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
  pantryNeighborMrPark: { className: "mr-park", assetId: "story-friend-mr-park-v1", url: mrParkArtUrl },
  pantryNeighborLily: { className: "lily", assetId: "story-friend-lily-v1", url: lilyArtUrl },
  pantryNeighborMateo: { className: "mateo", assetId: "story-friend-mateo-v1", url: mateoArtUrl }
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
    const neighborArt = NEIGHBOR_GUIDE_CLASSES[guideId];
    if (neighborArt && isRuntimeGuideArtApproved(neighborArt.assetId)) {
      const art = document.createElement("div");
      art.className = `guide-dialog__art guide-dialog__art--neighbor guide-dialog__art--${neighborArt.className}`;
      art.setAttribute("aria-hidden", "true");

      const image = document.createElement("img");
      image.className = "guide-dialog__neighbor-sheet";
      image.src = neighborArt.url;
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

    const body = document.createElement("p");
    body.className = "guide-dialog__line";
    body.id = "guide-dialog-title";
    body.textContent = t(steps[index]);

    const practice = guideId === "puzzle" && index === 1 ? createPuzzlePractice() : null;

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
    bubble.append(body);
    if (practice) bubble.appendChild(practice.element);
    bubble.append(dots, actions);
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
    if (practice) {
      nextButton.disabled = true;
      practice.onComplete(() => {
        nextButton.disabled = false;
        nextButton.focus();
      });
    }
  }

  draw();
  return overlay;
}

function createPuzzlePractice() {
  const element = document.createElement("div");
  element.className = "guide-practice";
  const clue = document.createElement("span");
  clue.className = "guide-practice__clue";
  clue.textContent = String(PUZZLE_PRACTICE.clue);
  const row = document.createElement("div");
  row.className = "guide-practice__row";
  row.setAttribute("role", "group");
  row.setAttribute("aria-label", t("guide.practiceLabel"));
  const status = document.createElement("p");
  status.className = "guide-practice__status";
  status.textContent = t("guide.practicePrompt");
  const targetIndexes = new Set(PUZZLE_PRACTICE.targetIndexes);
  const filledIndexes = new Set();
  let complete = false;
  let completionHandler = () => {};

  for (let index = 0; index < PUZZLE_PRACTICE.cellCount; index += 1) {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "guide-practice__cell";
    cell.setAttribute("aria-label", t("guide.practiceCell", { number: index + 1 }));
    cell.addEventListener("click", () => {
      if (complete) return;
      if (!targetIndexes.has(index)) {
        status.textContent = t("guide.practiceTryAgain");
        return;
      }
      filledIndexes.add(index);
      cell.classList.add("is-filled");
      cell.setAttribute("aria-pressed", "true");
      if (filledIndexes.size === targetIndexes.size) {
        complete = true;
        [...row.children].forEach((rowCell, rowIndex) => {
          rowCell.disabled = true;
          if (!targetIndexes.has(rowIndex)) {
            rowCell.classList.add("is-marked");
            rowCell.textContent = "×";
          }
        });
        status.textContent = t("guide.practiceComplete");
        completionHandler();
      }
    });
    row.appendChild(cell);
  }
  element.append(clue, row, status);
  return {
    element,
    onComplete(handler) {
      completionHandler = handler;
    }
  };
}

