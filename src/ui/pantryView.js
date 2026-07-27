import { getApprovedPantryDecorations, getDecorationById, pantrySlots } from "../data/decorations.js";
import { getDecorationArtUrl } from "../data/decorationArt.js";
import { getPantryOverlayUrl } from "../data/pantryOverlayArt.js";
import pantryRoomBackgroundUrl from "../assets/backgrounds/pantry-room-sunlit-v2.webp";
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
  const overlayUrl = decoration ? getPantryOverlayUrl(decoration.assetId) : "";
  const selected = selectedSlotId === slot.id;
  const slotElement = document.createElement("button");
  slotElement.className = "pantry-room-slot slot-" + slot.id + " " + (overlayUrl ? "filled" : "empty") + " " + (selected ? "selected" : "");
  slotElement.type = "button";
  slotElement.setAttribute("aria-pressed", String(selected));
  slotElement.setAttribute("aria-label", t("pantry.slotAction", { slot: t(slot.titleKey) }));

  if (decoration) {
    slotElement.dataset.decoration = decoration.id;
  } else {
    const label = document.createElement("span");
    label.textContent = t(slot.titleKey);
    slotElement.appendChild(label);
  }
  // A room tap is a shortcut into that slot's shop. The list is below the
  // room on mobile, so bring the available swaps into view instead of leaving
  // the player to hunt for a second control.
  slotElement.addEventListener("click", () => onSelectSlot(selected ? "all" : slot.id, { fromRoom: true }));
  return slotElement;
}

function renderRoomOverlays(equippedDecorations) {
  const layer = document.createElement("div");
  layer.className = "pantry-room-overlays";
  layer.setAttribute("aria-hidden", "true");
  pantrySlots.forEach((slot) => {
    const decoration = getDecorationById(equippedDecorations[slot.id]);
    const overlayUrl = decoration ? getPantryOverlayUrl(decoration.assetId) : "";
    if (!overlayUrl) return;
    const image = document.createElement("img");
    image.className = "pantry-room-overlay";
    image.dataset.slot = slot.id;
    image.src = overlayUrl;
    image.alt = "";
    layer.appendChild(image);
  });
  return layer;
}

function compareDecorations(left, right, ownedIds, equippedDecorations, spoons) {
  const leftOwned = ownedIds.includes(left.id);
  const rightOwned = ownedIds.includes(right.id);
  const leftEquipped = equippedDecorations[left.slot] === left.id;
  const rightEquipped = equippedDecorations[right.slot] === right.id;
  const leftAffordable = !leftOwned && spoons >= Number(left.cost || 0);
  const rightAffordable = !rightOwned && spoons >= Number(right.cost || 0);

  // In a selected room slot, the player must always be able to find both the
  // item currently on display and every item they already own before offers.
  // The old ascending score sorted these to the bottom of a three-card list.
  const priority = (owned, equipped, affordable) => {
    if (equipped) return 0;
    if (owned) return 1;
    if (affordable) return 2;
    return 3;
  };
  return priority(leftOwned, leftEquipped, leftAffordable) - priority(rightOwned, rightEquipped, rightAffordable)
    || Number(left.cost || 0) - Number(right.cost || 0)
    || left.id.localeCompare(right.id);
}

function renderShopCard(decoration, ownedIds, equippedDecorations, spoons, storyGoalId, onRefresh, onFirstPurchase, onOpenSpoonStore) {
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
    const slotOccupied = Boolean(equippedDecorations[decoration.slot])
      && equippedDecorations[decoration.slot] !== decoration.id;
    button.textContent = affordable
      ? (slotOccupied ? t("pantry.replaceItem") : t("pantry.buy"))
      : t("pantry.addSpoons", { count: Math.max(0, decoration.cost - spoons) });
    button.addEventListener("click", () => {
      if (!affordable) {
        onOpenSpoonStore?.(decoration);
        return;
      }
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

export function renderPantryView(onRefresh = () => {}, onFirstPurchase = () => {}, spoonStore = null, onOpenSpoonStore = () => {}) {
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
    room.appendChild(renderRoomOverlays(equippedDecorations));
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
      grid.appendChild(renderShopCard(decoration, ownedIds, equippedDecorations, spoons, storyGoalId, onRefresh, onFirstPurchase, onOpenSpoonStore));
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
    // A request may point to a free starter item that was bought earlier and
    // later replaced. Restore it now instead of hiding it behind the shop filter.
    if (ownedIds.includes(decoration.id)) {
      const storyCompleted = decoration.id === storyGoalId || decoration.id === "starter-counter-cloth";
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
      return;
    }
    selectedSlotId = decoration.slot || "all";
    pantryViewState.selectedSlotId = selectedSlotId;
    pantryViewState.storyGoalId = storyGoalId;
    shopVisibleLimit = defaultShopCardLimit;
    pantryViewState.shopVisibleLimit = shopVisibleLimit;
    drawDecorations();
  }

  function selectSlot(slotId, { fromRoom = false } = {}) {
    selectedSlotId = slotId || "all";
    pantryViewState.selectedSlotId = selectedSlotId;
    shopVisibleLimit = defaultShopCardLimit;
    pantryViewState.shopVisibleLimit = shopVisibleLimit;
    drawDecorations();
    if (fromRoom) {
      shop.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
