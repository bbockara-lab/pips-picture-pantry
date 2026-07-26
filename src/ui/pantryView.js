import { getApprovedPantryDecorations, getDecorationById, pantrySlots } from "../data/decorations.js";
import { getDecorationArtUrl } from "../data/decorationArt.js";
import pantryRoomBackgroundUrl from "../assets/backgrounds/pantry-room-sunlit-v1.png";
import {
  buyDecoration,
  equipDecoration,
  getCompletedPantryStoryGoalIds,
  getEquippedDecorations,
  getOwnedDecorationIds,
  getPantrySpoons,
  getPantryStoryGoalId,
  setPantryStoryGoalId
} from "../game/save.js";
import { t } from "../i18n/index.js";
import { renderPantryStoryMilestone, renderPantryStoryRequest } from "./pantryStoryCards.js";

const defaultShopCardLimit = 3;
const pantryViewState = {
  selectedSlotId: "all",
  shopVisibleLimit: defaultShopCardLimit,
  storyGoalId: null
};

function appendTextElement(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  element.textContent = text;
  parent.appendChild(element);
  return element;
}

function replaceWithOptional(parent, ...nodes) {
  parent.replaceChildren();
  nodes.forEach((node) => {
    if (node && typeof node === "object" && "nodeType" in node) {
      parent.appendChild(node);
    }
  });
}

function renderRoomSlot(slot, equippedDecorations, selectedSlotId, onSelectSlot) {
  const decoration = getDecorationById(equippedDecorations[slot.id]);
  const artUrl = decoration ? getDecorationArtUrl(decoration.assetId) : "";
  const selected = selectedSlotId === slot.id;
  const slotElement = document.createElement("button");
  slotElement.className = "pantry-room-slot slot-" + slot.id + " " + (artUrl ? "filled" : "empty") + " " + (selected ? "selected" : "");
  slotElement.type = "button";
  slotElement.setAttribute("aria-pressed", String(selected));
  slotElement.setAttribute("aria-label", t("pantry.slotAction", { slot: t(slot.titleKey) }));

  if (artUrl) {
    const image = document.createElement("img");
    image.className = "pantry-room-decoration";
    image.src = artUrl;
    image.alt = t(decoration.titleKey);
    slotElement.appendChild(image);
  }

  if (decoration) {
    slotElement.dataset.decoration = decoration.id;
  } else {
    const label = document.createElement("span");
    label.textContent = t(slot.titleKey);
    slotElement.appendChild(label);
  }
  slotElement.addEventListener("click", () => onSelectSlot(selected ? "all" : slot.id));
  return slotElement;
}

function compareDecorations(left, right, ownedIds, equippedDecorations, spoons) {
  const leftOwned = ownedIds.includes(left.id);
  const rightOwned = ownedIds.includes(right.id);
  const leftEquipped = equippedDecorations[left.slot] === left.id;
  const rightEquipped = equippedDecorations[right.slot] === right.id;
  const leftAffordable = !leftOwned && spoons >= Number(left.cost || 0);
  const rightAffordable = !rightOwned && spoons >= Number(right.cost || 0);

  const score = (decoration, owned, equipped, affordable) => {
    if (equipped) return 70;
    if (!owned && Number(decoration.cost || 0) === 0) return 0;
    if (affordable) return 10 + Number(decoration.cost || 0) / 1000;
    if (owned) return 50;
    return 30 + Math.max(0, Number(decoration.cost || 0) - spoons) / 1000;
  };
  return score(left, leftOwned, leftEquipped, leftAffordable) - score(right, rightOwned, rightEquipped, rightAffordable) || left.id.localeCompare(right.id);
}

function renderShopCard(decoration, ownedIds, equippedDecorations, spoons, storyGoalId, onRefresh, onFirstPurchase) {
  const owned = ownedIds.includes(decoration.id);
  const equipped = equippedDecorations[decoration.slot] === decoration.id;
  const affordable = spoons >= Number(decoration.cost || 0);
  const isStarterRoomRequest = decoration.id === "starter-counter-cloth";
  const artUrl = getDecorationArtUrl(decoration.assetId);
  const slot = pantrySlots.find((candidate) => candidate.id === decoration.slot);
  const slotLabel = slot ? t(slot.titleKey) : decoration.slot;

  const card = document.createElement("article");
  card.className = ["pantry-item-card", "rarity-" + decoration.rarity, equipped ? "equipped" : ""].filter(Boolean).join(" ");

  const art = document.createElement("div");
  art.className = "pantry-item-art";
  const image = document.createElement("img");
  image.src = artUrl;
  image.alt = t(decoration.titleKey);
  art.appendChild(image);

  const body = document.createElement("div");
  body.className = "pantry-item-body";
  const priceLabel = owned ? t("pantry.owned") : decoration.cost > 0 ? t("pantry.spoonCost", { count: decoration.cost }) : t("pantry.free");
  const meta = document.createElement("div");
  meta.className = "pantry-item-meta";
  appendTextElement(meta, "span", "pantry-item-cost", priceLabel);
  body.appendChild(meta);
  appendTextElement(body, "h4", "", t(decoration.titleKey));

  const button = document.createElement("button");
  button.className = "button secondary pantry-item-action";
  button.type = "button";

  if (equipped) {
    button.disabled = true;
    button.textContent = t("pantry.equipped");
  } else if (owned) {
    button.textContent = t("pantry.equipToSlot", { slot: slotLabel });
    button.addEventListener("click", () => {
      const storyCompleted = decoration.id === storyGoalId || isStarterRoomRequest;
      equipDecoration(decoration);
      if (storyCompleted) {
        storyGoalId = null;
        pantryViewState.storyGoalId = null;
        onFirstPurchase?.(decoration, {
          storyCompleted: true,
          completedRequestCount: getCompletedPantryStoryGoalIds().length
        });
      }
      onRefresh?.();
    });
  } else {
    button.disabled = !affordable;
    button.textContent = affordable ? t("pantry.buy") : t("pantry.needMore", { count: Math.max(0, decoration.cost - spoons) });
    button.addEventListener("click", () => {
      if (buyDecoration(decoration)) {
        const storyCompleted = decoration.id === storyGoalId || isStarterRoomRequest;
        if (storyCompleted) {
          storyGoalId = null;
          pantryViewState.storyGoalId = null;
        }
        onFirstPurchase?.(decoration, {
          storyCompleted,
          completedRequestCount: getCompletedPantryStoryGoalIds().length
        });
        onRefresh?.();
      }
    });
  }

  card.append(art, body, button);
  return card;
}

function renderSlotFilters(selectedSlotId, onSelectSlot) {
  const filters = document.createElement("div");
  filters.className = "pantry-filter-row pantry-slot-filters";
  filters.setAttribute("aria-label", t("pantry.slotFilterLabel"));

  const options = [{ id: "all", titleKey: "pantry.allSlots" }, ...pantrySlots];
  options.forEach((slot) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = selectedSlotId === slot.id ? "pantry-slot-filter active" : "pantry-slot-filter";
    button.setAttribute("aria-pressed", String(selectedSlotId === slot.id));
    button.textContent = t(slot.titleKey);
    button.addEventListener("click", () => onSelectSlot(slot.id));
    filters.appendChild(button);
  });

  return filters;
}

function renderEmptyShopState(onResetFilters) {
  const emptyState = document.createElement("article");
  emptyState.className = "pantry-empty-state";

  const title = document.createElement("h4");
  title.textContent = t("pantry.emptyFilterTitle");
  const body = document.createElement("p");
  body.textContent = t("pantry.emptyFilterBody");
  const resetButton = document.createElement("button");
  resetButton.className = "button secondary pantry-reset-filters";
  resetButton.type = "button";
  resetButton.textContent = t("pantry.resetFilters");
  resetButton.addEventListener("click", () => onResetFilters?.());

  emptyState.append(title, body, resetButton);
  return emptyState;
}

function renderShopLimitControl(visibleCount, totalCount, onShowMore) {
  if (visibleCount >= totalCount) {
    return null;
  }

  const control = document.createElement("div");
  control.className = "pantry-shop-limit";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "pantry-shop-limit__action";
  button.textContent = t("pantry.shopLimitAction");
  button.addEventListener("click", () => onShowMore?.());

  control.appendChild(button);
  return control;
}

export function renderPantryView(onRefresh = () => {}, onFirstPurchase = () => {}, spoonStore = null) {
  const panel = document.createElement("section");
  panel.className = "pantry-panel content-panel";

  const spoons = getPantrySpoons();
  const ownedIds = getOwnedDecorationIds();
  const equippedDecorations = getEquippedDecorations();
  const approvedDecorations = getApprovedPantryDecorations();
  let selectedSlotId = pantryViewState.selectedSlotId || "all";
  let shopVisibleLimit = Math.max(defaultShopCardLimit, Number(pantryViewState.shopVisibleLimit || defaultShopCardLimit));
  let storyGoalId = pantryViewState.storyGoalId || getPantryStoryGoalId() || null;
  pantryViewState.storyGoalId = storyGoalId;

  const header = document.createElement("div");
  header.className = "pantry-header";
  const headerCopy = document.createElement("div");
  appendTextElement(headerCopy, "h2", "", t("pantry.title"));
  header.insertBefore(headerCopy, header.firstChild);

  const room = document.createElement("div");
  room.className = "pantry-room";
  room.style.setProperty("--pantry-room-background", `url("${pantryRoomBackgroundUrl}")`);
  room.setAttribute("aria-label", t("pantry.roomAria"));

  const storyRequestMount = document.createElement("div");
  storyRequestMount.className = "pantry-story-request-mount";

  const storyMilestoneMount = document.createElement("div");
  storyMilestoneMount.className = "pantry-story-milestone-mount";

  const shop = document.createElement("section");
  shop.className = "pantry-shop";
  const shopHeading = document.createElement("div");
  shopHeading.className = "pantry-shop-heading";
  const shopCopy = document.createElement("div");
  appendTextElement(shopCopy, "h3", "", t("pantry.shopTitle"));
  shopHeading.appendChild(shopCopy);
  shop.appendChild(shopHeading);

  const filtersMount = document.createElement("div");
  const grid = document.createElement("div");
  grid.className = "pantry-shop-grid";
  const shopLimitMount = document.createElement("div");
  shopLimitMount.className = "pantry-shop-limit-mount";
  shop.append(filtersMount, grid, shopLimitMount);
  if (spoonStore) {
    shop.appendChild(spoonStore);
  }

  function drawDecorations() {
    room.replaceChildren();
    pantrySlots.forEach((slot) => {
      room.appendChild(renderRoomSlot(slot, equippedDecorations, selectedSlotId, selectSlot));
    });

    replaceWithOptional(storyRequestMount, renderPantryStoryRequest(approvedDecorations, ownedIds, equippedDecorations, startStoryRequest));
    replaceWithOptional(storyMilestoneMount, renderPantryStoryMilestone(approvedDecorations, ownedIds, equippedDecorations, selectStoryArrival));
    filtersMount.replaceChildren();
    filtersMount.className = "pantry-filter-stack";

    const visibleDecorations = approvedDecorations
      .filter((decoration) => selectedSlotId === "all" || decoration.slot === selectedSlotId);

    const sortedDecorations = [...visibleDecorations]
      .sort((left, right) => compareDecorations(left, right, ownedIds, equippedDecorations, spoons));
    const visibleShopDecorations = sortedDecorations.slice(0, shopVisibleLimit);
    filtersMount.append(renderSlotFilters(selectedSlotId, selectSlot));

    grid.replaceChildren();
    shopLimitMount.replaceChildren();
    if (visibleDecorations.length === 0) {
      grid.appendChild(renderEmptyShopState(resetFilters));
      return;
    }

    visibleShopDecorations.forEach((decoration) => {
      grid.appendChild(renderShopCard(decoration, ownedIds, equippedDecorations, spoons, storyGoalId, onRefresh, onFirstPurchase));
    });

    const shopLimitControl = renderShopLimitControl(visibleShopDecorations.length, visibleDecorations.length, showMoreDecorations);
    if (shopLimitControl) {
      shopLimitMount.appendChild(shopLimitControl);
    }
  }

  function planNextRoomRequest(decoration) {
    if (!decoration) {
      return;
    }
    if (Number(decoration.cost || 0) === 0) {
      startStoryRequest(decoration);
      return;
    }
    selectStoryArrival(decoration);
  }

  function selectStoryArrival(decoration) {
    if (!decoration) {
      return;
    }
    storyGoalId = decoration.id;
    selectedSlotId = decoration.slot || "all";
    setPantryStoryGoalId(storyGoalId);
    pantryViewState.storyGoalId = storyGoalId;
    pantryViewState.selectedSlotId = selectedSlotId;
    shopVisibleLimit = defaultShopCardLimit;
    pantryViewState.shopVisibleLimit = shopVisibleLimit;
    drawDecorations();
  }

  function startStoryRequest(decoration) {
    if (!decoration) {
      return;
    }
    selectedSlotId = decoration.slot || "all";
    pantryViewState.selectedSlotId = selectedSlotId;
    pantryViewState.storyGoalId = storyGoalId;
    shopVisibleLimit = defaultShopCardLimit;
    pantryViewState.shopVisibleLimit = shopVisibleLimit;
    drawDecorations();
  }

  function selectSlot(slotId) {
    selectedSlotId = slotId || "all";
    pantryViewState.selectedSlotId = selectedSlotId;
    shopVisibleLimit = defaultShopCardLimit;
    pantryViewState.shopVisibleLimit = shopVisibleLimit;
    drawDecorations();
  }

  function resetFilters() {
    selectedSlotId = "all";
    pantryViewState.selectedSlotId = selectedSlotId;
    shopVisibleLimit = defaultShopCardLimit;
    pantryViewState.shopVisibleLimit = shopVisibleLimit;
    drawDecorations();
  }

  function showMoreDecorations() {
    shopVisibleLimit += defaultShopCardLimit;
    pantryViewState.shopVisibleLimit = shopVisibleLimit;
    drawDecorations();
  }

  drawDecorations();
  panel.append(header, room, storyRequestMount, storyMilestoneMount, shop);
  return panel;
}
