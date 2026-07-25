import { pantrySlots } from "../data/decorations.js";
import pipGuideSceneUrl from "../assets/characters/pip-chrome-v2.png";
import { getDecorationArtUrl } from "../data/decorationArt.js";
import { isRuntimeGuideArtApproved } from "../data/runtimeArt.js";
import { t } from "../i18n/index.js";

const GUIDE_ART_ASSET_ID = "pip-chrome-v2";

function appendTextElement(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  element.textContent = text;
  parent.appendChild(element);
  return element;
}

export function renderPantryStoryRequest(approvedDecorations, ownedIds, equippedDecorations, spoons, onStartRequest) {
  const starterRequest = approvedDecorations.find((decoration) => Number(decoration.cost || 0) === 0 && decoration.slot === "counter") || approvedDecorations[0];
  if (!starterRequest) {
    return null;
  }

  const owned = ownedIds.includes(starterRequest.id);
  const equipped = equippedDecorations[starterRequest.slot] === starterRequest.id;
  const complete = owned && equipped;
  const state = complete ? "complete" : owned ? "place" : "start";
  const slot = pantrySlots.find((candidate) => candidate.id === starterRequest.slot);
  const slotLabel = slot ? t(slot.titleKey) : starterRequest.slot;
  const request = document.createElement("aside");
  request.className = "pantry-story-request state-" + state;

  if (isRuntimeGuideArtApproved(GUIDE_ART_ASSET_ID)) {
    const pip = document.createElement("div");
    pip.className = "pantry-story-request__pip";
    pip.setAttribute("aria-hidden", "true");
    const pipImage = document.createElement("img");
    pipImage.src = pipGuideSceneUrl;
    pipImage.alt = "";
    pipImage.setAttribute("aria-hidden", "true");
    pip.appendChild(pipImage);
    request.appendChild(pip);
  }

  const art = document.createElement("div");
  art.className = "pantry-story-request__art";
  const image = document.createElement("img");
  image.src = getDecorationArtUrl(starterRequest.assetId);
  image.alt = t(starterRequest.titleKey);
  art.appendChild(image);

  const copy = document.createElement("div");
  copy.className = "pantry-story-request__copy";
  appendTextElement(copy, "p", "section-label", t("pantry.storyEyebrow"));
  appendTextElement(copy, "h3", "", t("pantry.story." + state + "Title", { item: t(starterRequest.titleKey), slot: slotLabel }));
  appendTextElement(copy, "p", "", t("pantry.story." + state + "Body", { item: t(starterRequest.titleKey), slot: slotLabel, spoons }));


  const action = document.createElement("button");
  action.type = "button";
  action.className = complete ? "pantry-story-request__action complete" : "pantry-story-request__action";
  action.textContent = t("pantry.story." + state + "Action");
  action.disabled = complete;
  action.addEventListener("click", () => onStartRequest?.(starterRequest));

  request.append(art, copy, action);
  return request;
}

export function renderPantryStoryMilestone(approvedDecorations, ownedIds, equippedDecorations, onChooseNext) {
  const starterRequest = approvedDecorations.find((decoration) => Number(decoration.cost || 0) === 0 && decoration.slot === "counter") || approvedDecorations[0];
  if (!starterRequest || equippedDecorations[starterRequest.slot] !== starterRequest.id) {
    return null;
  }

  const nextDecorations = approvedDecorations
    .filter((decoration) => decoration.id !== starterRequest.id && !ownedIds.includes(decoration.id))
    .sort((left, right) => Number(left.cost || 0) - Number(right.cost || 0) || left.id.localeCompare(right.id))
    .slice(0, 3);

  const milestone = document.createElement("aside");
  milestone.className = "pantry-story-milestone";


  if (nextDecorations.length > 0) {
    const preview = document.createElement("div");
    preview.className = "pantry-story-milestone__preview";
    const label = document.createElement("p");
    label.className = "pantry-story-milestone__preview-label";
    label.textContent = t("pantry.storyNextArrival");
    preview.appendChild(label);

    const list = document.createElement("div");
    list.className = "pantry-story-milestone__items";
    nextDecorations.forEach((decoration) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "pantry-story-milestone__item";
      button.setAttribute("aria-label", t("pantry.storyNextArrivalAction", { item: t(decoration.titleKey) }));

      const image = document.createElement("img");
      image.src = getDecorationArtUrl(decoration.assetId);
      image.alt = "";
      image.setAttribute("aria-hidden", "true");

      const name = document.createElement("span");
      name.textContent = t(decoration.titleKey);
      button.append(image, name);
      button.addEventListener("click", () => onChooseNext?.(decoration));
      list.appendChild(button);
    });
    preview.appendChild(list);
    milestone.appendChild(preview);
  }

  return nextDecorations.length > 0 ? milestone : null;
}

export function renderPantryStoryDelivery(approvedDecorations, storyGoalId, ownedIds, spoons, onShowGoal, onPlayForSpoons) {
  const goal = approvedDecorations.find((decoration) => decoration.id === storyGoalId && !ownedIds.includes(decoration.id));
  if (!goal) {
    return null;
  }

  const slot = pantrySlots.find((candidate) => candidate.id === goal.slot);
  const slotLabel = slot ? t(slot.titleKey) : goal.slot;
  const cost = Number(goal.cost || 0);
  const needed = Math.max(0, cost - spoons);
  const card = document.createElement("aside");
  card.className = "pantry-story-delivery";

  if (isRuntimeGuideArtApproved(GUIDE_ART_ASSET_ID)) {
    const pipStamp = document.createElement("div");
    pipStamp.className = "pantry-story-delivery__pip";
    pipStamp.setAttribute("aria-hidden", "true");
    const pipImage = document.createElement("img");
    pipImage.src = pipGuideSceneUrl;
    pipImage.alt = "";
    pipImage.setAttribute("aria-hidden", "true");
    pipStamp.appendChild(pipImage);
    card.appendChild(pipStamp);
  }

  const art = document.createElement("div");
  art.className = "pantry-story-delivery__art";
  const image = document.createElement("img");
  image.src = getDecorationArtUrl(goal.assetId);
  image.alt = t(goal.titleKey);
  art.appendChild(image);

  const copy = document.createElement("div");
  copy.className = "pantry-story-delivery__copy";
  const eyebrow = document.createElement("p");
  eyebrow.className = "section-label";
  eyebrow.textContent = t("pantry.storyDeliveryEyebrow");
  const title = document.createElement("h3");
  title.textContent = t("pantry.storyDeliveryTitle", { item: t(goal.titleKey) });
  const body = document.createElement("p");
  body.textContent = t("pantry.storyDeliveryBody", { item: t(goal.titleKey), slot: slotLabel, needed });
  copy.append(eyebrow, title, body);

  const steps = document.createElement("div");
  steps.className = "pantry-story-delivery__steps";
  const spoonStep = document.createElement("span");
  spoonStep.textContent = t("pantry.storyDeliveryStepSpoons", { needed });
  const slotStep = document.createElement("span");
  slotStep.textContent = t("pantry.storyDeliveryStepSlot", { slot: slotLabel });
  steps.append(spoonStep, slotStep);

  const actions = document.createElement("div");
  actions.className = "pantry-story-delivery__actions";

  const showGoal = document.createElement("button");
  showGoal.type = "button";
  showGoal.className = "pantry-story-delivery__action";
  showGoal.textContent = t("pantry.storyDeliveryShowGoal");
  showGoal.addEventListener("click", () => onShowGoal?.(goal));
  actions.appendChild(showGoal);

  if (needed > 0) {
    const earn = document.createElement("button");
    earn.type = "button";
    earn.className = "pantry-story-delivery__action secondary";
    earn.textContent = t("pantry.storyDeliveryEarn");
    earn.addEventListener("click", () => onPlayForSpoons?.());
    actions.appendChild(earn);
  }

  card.append(art, copy, steps, actions);
  return card;
}
