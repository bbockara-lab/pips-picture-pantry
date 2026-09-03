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

export function renderPantryStoryRequest(approvedDecorations, ownedIds, equippedDecorations, onStartRequest) {
  const starterRequest = approvedDecorations.find((decoration) => Number(decoration.cost || 0) === 0 && decoration.slot === "counter") || approvedDecorations[0];
  if (!starterRequest) {
    return null;
  }

  const owned = ownedIds.includes(starterRequest.id);
  const equipped = equippedDecorations[starterRequest.slot] === starterRequest.id;
  if (owned && equipped) {
    return null;
  }
  const state = owned ? "place" : "start";
  const slot = pantrySlots.find((candidate) => candidate.id === starterRequest.slot);
  const slotLabel = slot ? t(slot.titleKey) : starterRequest.slot;
  const request = document.createElement("aside");
  request.className = "pantry-story-request state-" + state;

  const art = document.createElement("div");
  art.className = "pantry-story-request__art";
  const image = document.createElement("img");
  image.src = getDecorationArtUrl(starterRequest.assetId);
  image.alt = t(starterRequest.titleKey);
  art.appendChild(image);

  const copy = document.createElement("div");
  copy.className = "pantry-story-request__copy";
  appendTextElement(copy, "h3", "", t("pantry.story." + state + "Title", { item: t(starterRequest.titleKey), slot: slotLabel }));

  const action = document.createElement("button");
  action.type = "button";
  action.className = "pantry-story-request__action";
  action.textContent = t("pantry.story." + state + "Action");
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
