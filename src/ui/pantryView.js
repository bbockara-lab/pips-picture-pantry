import { getApprovedPantryDecorations, getDecorationById, pantrySlots } from "../data/decorations.js";
import { getDecorationArtUrl } from "../data/decorationArt.js";
import {
  buyDecoration,
  clearPantryStoryGoalId,
  equipDecoration,
  getCompletedPantryStoryGoalIds,
  getEquippedDecorations,
  getOwnedDecorationIds,
  getPantrySpoons,
  getPantryStoryGoalId,
  setPantryStoryGoalId
} from "../game/save.js";
import { t } from "../i18n/index.js";
import { renderPantryStoryDelivery, renderPantryStoryMilestone, renderPantryStoryRequest } from "./pantryStoryCards.js";

const rarityFilters = ["all", "starter", "common", "cozy", "rare"];
const availabilityFilters = ["all", "canBuy", "owned"];
const sortOptions = ["featured", "priceLow", "priceHigh", "rarity"];
const rarityRank = { starter: 0, common: 1, cozy: 2, rare: 3, premium: 4 };
const defaultShopCardLimit = 3;
const pantryViewState = {
  selectedSlotId: "all",
  selectedRarity: "all",
  selectedAvailability: "all",
  selectedSort: "featured",
  shopVisibleLimit: defaultShopCardLimit,
  trackedGoalId: null,
  storyGoalId: null,
  lastAction: null
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

function createMeterFill() {
  return document.createElement("span");
}

function setPantryActionFeedback(type, decoration) {
  pantryViewState.lastAction = decoration?.id ? { type, decorationId: decoration.id } : null;
}

function renderActionFeedback(equippedDecorations) {
  const action = pantryViewState.lastAction;
  const decoration = getDecorationById(action?.decorationId);
  if (!decoration) {
    return null;
  }

  const slot = pantrySlots.find((candidate) => candidate.id === decoration.slot);
  const slotLabel = slot ? t(slot.titleKey) : decoration.slot;
  const placed = equippedDecorations[decoration.slot] === decoration.id;
  const card = document.createElement("aside");
  card.className = action.type === "storyComplete" ? "pantry-action-feedback story-complete" : "pantry-action-feedback";

  const art = document.createElement("div");
  art.className = "pantry-action-feedback__art";
  const image = document.createElement("img");
  image.src = getDecorationArtUrl(decoration.assetId);
  image.alt = t(decoration.titleKey);
  art.appendChild(image);

  const copy = document.createElement("div");
  copy.className = "pantry-action-feedback__copy";
  const titleKey = action.type === "storyComplete" ? "pantry.feedbackStoryCompleteTitle" : action.type === "equip" ? "pantry.feedbackEquipTitle" : "pantry.feedbackBuyTitle";
  const title = document.createElement("h3");
  title.textContent = t(titleKey, { item: t(decoration.titleKey) });
  copy.appendChild(title);

  const dismiss = document.createElement("button");
  dismiss.type = "button";
  dismiss.className = "pantry-action-feedback__dismiss";
  dismiss.textContent = t("pantry.feedbackDismiss");
  dismiss.addEventListener("click", () => {
    pantryViewState.lastAction = null;
    card.remove();
  });

  card.append(art, copy, dismiss);
  return card;
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

  const label = document.createElement("span");
  label.textContent = t(slot.titleKey);
  slotElement.appendChild(label);
  if (decoration) {
    const value = document.createElement("strong");
    value.textContent = t(decoration.titleKey);
    slotElement.appendChild(value);
  }
  slotElement.addEventListener("click", () => onSelectSlot(selected ? "all" : slot.id));
  return slotElement;
}

function getDecorationStatusKey(decoration, owned, equipped, affordable) {
  if (equipped) {
    return "equipped";
  }
  if (owned) {
    return "owned";
  }
  if (Number(decoration.cost || 0) === 0) {
    return "firstPick";
  }
  if (affordable) {
    return "canBuyNow";
  }
  return "saveForLater";
}

function compareDecorations(left, right, selectedSort, ownedIds, equippedDecorations, spoons) {
  const leftOwned = ownedIds.includes(left.id);
  const rightOwned = ownedIds.includes(right.id);
  const leftEquipped = equippedDecorations[left.slot] === left.id;
  const rightEquipped = equippedDecorations[right.slot] === right.id;
  const leftAffordable = !leftOwned && spoons >= Number(left.cost || 0);
  const rightAffordable = !rightOwned && spoons >= Number(right.cost || 0);

  if (selectedSort === "priceLow") {
    return Number(left.cost || 0) - Number(right.cost || 0) || left.id.localeCompare(right.id);
  }
  if (selectedSort === "priceHigh") {
    return Number(right.cost || 0) - Number(left.cost || 0) || left.id.localeCompare(right.id);
  }
  if (selectedSort === "rarity") {
    return (rarityRank[right.rarity] || 0) - (rarityRank[left.rarity] || 0) || Number(left.cost || 0) - Number(right.cost || 0) || left.id.localeCompare(right.id);
  }

  const score = (decoration, owned, equipped, affordable) => {
    if (equipped) return 70;
    if (!owned && Number(decoration.cost || 0) === 0) return 0;
    if (affordable) return 10 + Number(decoration.cost || 0) / 1000;
    if (owned) return 50;
    return 30 + Math.max(0, Number(decoration.cost || 0) - spoons) / 1000;
  };
  return score(left, leftOwned, leftEquipped, leftAffordable) - score(right, rightOwned, rightEquipped, rightAffordable) || left.id.localeCompare(right.id);
}

function renderSlotPlacementNote(decoration, equippedDecorations, equipped) {
  if (equipped) {
    return null;
  }

  const currentDecoration = getDecorationById(equippedDecorations[decoration.slot]);
  const note = document.createElement("p");
  note.className = "pantry-swap-note";
  note.textContent = currentDecoration && currentDecoration.id !== decoration.id
    ? t("pantry.swapNote", { current: t(currentDecoration.titleKey) })
    : t("pantry.emptyPlacementNote");
  return note;
}

function renderItemSavings(decoration, owned, spoons) {
  const cost = Number(decoration.cost || 0);
  if (owned || cost <= 0) {
    return null;
  }

  const progress = Math.min(100, Math.round((spoons / cost) * 100));
  const needed = Math.max(0, cost - spoons);
  const savings = document.createElement("div");
  savings.className = "pantry-item-savings";
  savings.style.setProperty("--item-savings-progress", progress + "%");
  appendTextElement(savings, "p", "", t("pantry.itemSavings", { saved: Math.min(spoons, cost), cost, needed }));
  const meter = document.createElement("div");
  meter.className = "pantry-item-savings-meter";
  meter.setAttribute("aria-hidden", "true");
  meter.appendChild(createMeterFill());
  savings.appendChild(meter);
  return savings;
}

function renderShopCard(decoration, ownedIds, equippedDecorations, spoons, trackedGoalId, storyGoalId, onTrackGoal, onRefresh, onFirstPurchase) {
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
  const rarityLabel = t("pantry.rarities." + decoration.rarity);
  const statusKey = getDecorationStatusKey(decoration, owned, equipped, affordable);
  const placementSwapNote = renderSlotPlacementNote(decoration, equippedDecorations, equipped);
  const trackedGoal = trackedGoalId === decoration.id;
  const meta = document.createElement("div");
  meta.className = "pantry-item-meta";
  appendTextElement(meta, "span", "pantry-item-rarity", rarityLabel);
  appendTextElement(meta, "span", "pantry-item-cost", priceLabel);
  const status = appendTextElement(body, "p", "pantry-item-status status-" + statusKey, t("pantry.itemStatus." + statusKey));
  body.insertBefore(meta, status);
  appendTextElement(body, "h4", "", t(decoration.titleKey));
  appendTextElement(body, "p", "pantry-slot-note", t("pantry.placedInSlot", { slot: slotLabel }));
  if (placementSwapNote) {
    body.appendChild(placementSwapNote);
  }
  const trackButton = document.createElement("button");
  const canTrackGoal = !owned && Number(decoration.cost || 0) > 0;
  if (canTrackGoal) {
    trackButton.className = trackedGoal ? "pantry-track-goal active" : "pantry-track-goal";
    trackButton.type = "button";
    trackButton.setAttribute("aria-pressed", String(trackedGoal));
    trackButton.textContent = trackedGoal ? t("pantry.goalTracked") : t("pantry.trackGoal");
    trackButton.addEventListener("click", () => onTrackGoal?.(decoration));
  }

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
      setPantryActionFeedback(storyCompleted ? "storyComplete" : "equip", decoration);
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
        setPantryActionFeedback(storyCompleted ? "storyComplete" : "buy", decoration);
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

  card.append(art, body);
  if (canTrackGoal) {
    card.appendChild(trackButton);
  }
  card.appendChild(button);
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

function renderRarityFilters(selectedRarity, onSelectRarity) {
  const filters = document.createElement("div");
  filters.className = "pantry-filter-row pantry-rarity-filters";
  filters.setAttribute("aria-label", t("pantry.rarityFilterLabel"));

  rarityFilters.forEach((rarity) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = selectedRarity === rarity ? "pantry-rarity-filter active" : "pantry-rarity-filter";
    button.setAttribute("aria-pressed", String(selectedRarity === rarity));
    button.textContent = rarity === "all" ? t("pantry.allRarities") : t("pantry.rarities." + rarity);
    button.addEventListener("click", () => onSelectRarity(rarity));
    filters.appendChild(button);
  });

  return filters;
}

function renderAvailabilityFilters(selectedAvailability, onSelectAvailability) {
  const filters = document.createElement("div");
  filters.className = "pantry-filter-row pantry-availability-filters";
  filters.setAttribute("aria-label", t("pantry.availabilityFilterLabel"));

  availabilityFilters.forEach((availability) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = selectedAvailability === availability ? "pantry-availability-filter active" : "pantry-availability-filter";
    button.setAttribute("aria-pressed", String(selectedAvailability === availability));
    button.textContent = t("pantry.availability." + availability);
    button.addEventListener("click", () => onSelectAvailability(availability));
    filters.appendChild(button);
  });

  return filters;
}

function renderSortControls(selectedSort, onSelectSort) {
  const sortBar = document.createElement("div");
  sortBar.className = "pantry-sort-bar";
  sortBar.setAttribute("aria-label", t("pantry.sortLabel"));

  const label = document.createElement("span");
  label.className = "pantry-sort-label";
  label.textContent = t("pantry.sortTitle");
  sortBar.appendChild(label);

  sortOptions.forEach((sortOption) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = selectedSort === sortOption ? "pantry-sort-option active" : "pantry-sort-option";
    button.setAttribute("aria-pressed", String(selectedSort === sortOption));
    button.textContent = t("pantry.sortOptions." + sortOption);
    button.addEventListener("click", () => onSelectSort(sortOption));
    sortBar.appendChild(button);
  });

  return sortBar;
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

function renderFilterSummary(count, total, isFiltered, onResetFilters) {
  const summary = document.createElement("div");
  summary.className = "pantry-filter-summary";

  const text = document.createElement("p");
  text.textContent = isFiltered
    ? t("pantry.filterSummary", { count, total })
    : t("pantry.filterSummaryAll", { count: total });
  summary.appendChild(text);

  if (isFiltered) {
    const clearButton = document.createElement("button");
    clearButton.className = "pantry-clear-filters";
    clearButton.type = "button";
    clearButton.textContent = t("pantry.clearFilters");
    clearButton.addEventListener("click", () => onResetFilters?.());
    summary.appendChild(clearButton);
  }

  return summary;
}

export function renderPantryView(onRefresh = () => {}, onFirstPurchase = () => {}, onPlayForSpoons = () => {}, spoonStore = null) {
  const panel = document.createElement("section");
  panel.className = "pantry-panel content-panel";

  const spoons = getPantrySpoons();
  const ownedIds = getOwnedDecorationIds();
  const equippedDecorations = getEquippedDecorations();
  const approvedDecorations = getApprovedPantryDecorations();
  const equippedCount = pantrySlots.filter((slot) => equippedDecorations[slot.id]).length;
  let selectedSlotId = pantryViewState.selectedSlotId || "all";
  let selectedRarity = rarityFilters.includes(pantryViewState.selectedRarity) ? pantryViewState.selectedRarity : "all";
  let selectedAvailability = availabilityFilters.includes(pantryViewState.selectedAvailability) ? pantryViewState.selectedAvailability : "all";
  let selectedSort = sortOptions.includes(pantryViewState.selectedSort) ? pantryViewState.selectedSort : "featured";
  let shopVisibleLimit = Math.max(defaultShopCardLimit, Number(pantryViewState.shopVisibleLimit || defaultShopCardLimit));
  let trackedGoalId = pantryViewState.trackedGoalId || null;
  let storyGoalId = pantryViewState.storyGoalId || getPantryStoryGoalId() || null;
  pantryViewState.storyGoalId = storyGoalId;

  const header = document.createElement("div");
  header.className = "pantry-header";
  const headerCopy = document.createElement("div");
  appendTextElement(headerCopy, "p", "section-label", t("sections.pantryRoom"));
  appendTextElement(headerCopy, "h2", "", t("pantry.title"));
  appendTextElement(header, "p", "pantry-spoon-note", t("pantry.spoonNote", { count: spoons }));
  header.insertBefore(headerCopy, header.firstChild);

  const room = document.createElement("div");
  room.className = "pantry-room";
  room.setAttribute("aria-label", t("pantry.roomAria"));

  const placementNote = document.createElement("p");
  placementNote.className = "pantry-placement-note";
  placementNote.textContent = t("pantry.placementNote", { count: equippedCount, total: pantrySlots.length });

  const storyRequestMount = document.createElement("div");
  storyRequestMount.className = "pantry-story-request-mount";

  const storyMilestoneMount = document.createElement("div");
  storyMilestoneMount.className = "pantry-story-milestone-mount";

  const storyDeliveryMount = document.createElement("div");
  storyDeliveryMount.className = "pantry-story-delivery-mount";

  const actionFeedbackMount = document.createElement("div");
  actionFeedbackMount.className = "pantry-action-feedback-mount";

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
    actionFeedbackMount.replaceChildren();
    const feedback = renderActionFeedback(equippedDecorations);
    if (feedback) {
      actionFeedbackMount.appendChild(feedback);
    }
    pantrySlots.forEach((slot) => {
      room.appendChild(renderRoomSlot(slot, equippedDecorations, selectedSlotId, selectSlot));
    });

    replaceWithOptional(storyRequestMount, renderPantryStoryRequest(approvedDecorations, ownedIds, equippedDecorations, startStoryRequest));
    replaceWithOptional(storyMilestoneMount, renderPantryStoryMilestone(approvedDecorations, ownedIds, equippedDecorations, selectStoryArrival));
    replaceWithOptional(storyDeliveryMount, renderPantryStoryDelivery(approvedDecorations, storyGoalId, ownedIds, spoons, showStoryGoal, onPlayForSpoons));
    filtersMount.replaceChildren();
    filtersMount.className = "pantry-filter-stack";

    const visibleDecorations = approvedDecorations
      .filter((decoration) => selectedSlotId === "all" || decoration.slot === selectedSlotId)
      .filter((decoration) => selectedRarity === "all" || decoration.rarity === selectedRarity)
      .filter((decoration) => {
        if (selectedAvailability === "owned") {
          return ownedIds.includes(decoration.id);
        }
        if (selectedAvailability === "canBuy") {
          return !ownedIds.includes(decoration.id) && spoons >= Number(decoration.cost || 0);
        }
        return true;
      });

    const sortedDecorations = [...visibleDecorations]
      .sort((left, right) => compareDecorations(left, right, selectedSort, ownedIds, equippedDecorations, spoons));
    const visibleShopDecorations = sortedDecorations.slice(0, shopVisibleLimit);
    const isFiltered = selectedSlotId !== "all" || selectedRarity !== "all" || selectedAvailability !== "all";
    filtersMount.append(renderSlotFilters(selectedSlotId, selectSlot));
    if (isFiltered) filtersMount.appendChild(renderFilterSummary(visibleDecorations.length, approvedDecorations.length, isFiltered, resetFilters));

    grid.replaceChildren();
    shopLimitMount.replaceChildren();
    if (visibleDecorations.length === 0) {
      grid.appendChild(renderEmptyShopState(resetFilters));
      return;
    }

    visibleShopDecorations.forEach((decoration) => {
      grid.appendChild(renderShopCard(decoration, ownedIds, equippedDecorations, spoons, trackedGoalId, storyGoalId, trackGoal, onRefresh, onFirstPurchase));
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

  function trackGoal(decoration) {
    trackedGoalId = decoration?.id || null;
    storyGoalId = null;
    clearPantryStoryGoalId();
    pantryViewState.trackedGoalId = trackedGoalId;
    pantryViewState.storyGoalId = storyGoalId;
    if (decoration?.slot) {
      selectedSlotId = decoration.slot;
      pantryViewState.selectedSlotId = selectedSlotId;
    }
    shopVisibleLimit = defaultShopCardLimit;
    pantryViewState.shopVisibleLimit = shopVisibleLimit;
    drawDecorations();
  }

  function selectStoryArrival(decoration) {
    if (!decoration) {
      return;
    }
    storyGoalId = decoration.id;
    trackedGoalId = decoration.id;
    selectedSlotId = decoration.slot || "all";
    selectedAvailability = "all";
    selectedRarity = "all";
    setPantryStoryGoalId(storyGoalId);
    pantryViewState.storyGoalId = storyGoalId;
    pantryViewState.trackedGoalId = trackedGoalId;
    pantryViewState.selectedSlotId = selectedSlotId;
    pantryViewState.selectedAvailability = selectedAvailability;
    pantryViewState.selectedRarity = selectedRarity;
    shopVisibleLimit = defaultShopCardLimit;
    pantryViewState.shopVisibleLimit = shopVisibleLimit;
    drawDecorations();
  }

  function showStoryGoal(decoration) {
    if (!decoration) {
      return;
    }
    trackedGoalId = decoration.id;
    selectedSlotId = decoration.slot || "all";
    selectedAvailability = "all";
    selectedRarity = "all";
    pantryViewState.trackedGoalId = trackedGoalId;
    pantryViewState.selectedSlotId = selectedSlotId;
    pantryViewState.selectedAvailability = selectedAvailability;
    pantryViewState.selectedRarity = selectedRarity;
    shopVisibleLimit = defaultShopCardLimit;
    pantryViewState.shopVisibleLimit = shopVisibleLimit;
    drawDecorations();
  }

  function startStoryRequest(decoration) {
    if (!decoration) {
      return;
    }
    selectedSlotId = decoration.slot || "all";
    selectedAvailability = ownedIds.includes(decoration.id) ? "owned" : "canBuy";
    selectedRarity = "all";
    trackedGoalId = Number(decoration.cost || 0) > 0 ? decoration.id : null;
    pantryViewState.selectedSlotId = selectedSlotId;
    pantryViewState.selectedAvailability = selectedAvailability;
    pantryViewState.selectedRarity = selectedRarity;
    pantryViewState.trackedGoalId = trackedGoalId;
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

  function selectRarity(rarity) {
    selectedRarity = rarityFilters.includes(rarity) ? rarity : "all";
    pantryViewState.selectedRarity = selectedRarity;
    shopVisibleLimit = defaultShopCardLimit;
    pantryViewState.shopVisibleLimit = shopVisibleLimit;
    drawDecorations();
  }

  function selectAvailability(availability) {
    selectedAvailability = availabilityFilters.includes(availability) ? availability : "all";
    pantryViewState.selectedAvailability = selectedAvailability;
    shopVisibleLimit = defaultShopCardLimit;
    pantryViewState.shopVisibleLimit = shopVisibleLimit;
    drawDecorations();
  }

  function selectSort(sortOption) {
    selectedSort = sortOptions.includes(sortOption) ? sortOption : "featured";
    pantryViewState.selectedSort = selectedSort;
    shopVisibleLimit = defaultShopCardLimit;
    pantryViewState.shopVisibleLimit = shopVisibleLimit;
    drawDecorations();
  }

  function resetFilters() {
    selectedSlotId = "all";
    selectedRarity = "all";
    selectedAvailability = "all";
    pantryViewState.selectedSlotId = selectedSlotId;
    pantryViewState.selectedRarity = selectedRarity;
    pantryViewState.selectedAvailability = selectedAvailability;
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
  panel.append(header, room, storyRequestMount, storyMilestoneMount, storyDeliveryMount, actionFeedbackMount, shop);
  return panel;
}
