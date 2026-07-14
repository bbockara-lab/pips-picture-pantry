import { getApprovedPantryDecorations, getDecorationById, pantrySlots } from "../data/decorations.js";
import { ECONOMY, getPuzzleReward } from "../data/economyConfig.js";
import { puzzlePacks } from "../data/packs.js";
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
import { renderPantryStoryArchive, renderPantryStoryDelivery, renderPantryStoryMilestone, renderPantryStoryRequest } from "./pantryStoryCards.js";

const rarityFilters = ["all", "starter", "common", "cozy", "rare"];
const availabilityFilters = ["all", "canBuy", "owned"];
const sortOptions = ["featured", "priceLow", "priceHigh", "rarity"];
const rarityRank = { starter: 0, common: 1, cozy: 2, rare: 3, premium: 4 };
const roomStepTargets = [1, 3, 6, 10];
const defaultShopCardLimit = 6;
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
  const titleKey = action.type === "storyComplete" ? "pantry.feedbackStoryCompleteTitle" : action.type === "equip" ? "pantry.feedbackEquipTitle" : "pantry.feedbackBuyTitle";
  const bodyKey = action.type === "storyComplete" ? "pantry.feedbackStoryCompleteBody" : placed ? "pantry.feedbackPlacedBody" : "pantry.feedbackSavedBody";
  const eyebrowKey = action.type === "storyComplete" ? "pantry.feedbackStoryCompleteEyebrow" : "pantry.feedbackEyebrow";
  copy.innerHTML = ""
    + '<p class="section-label">' + t(eyebrowKey) + "</p>"
    + "<h3>" + t(titleKey, { item: t(decoration.titleKey) }) + "</h3>"
    + "<p>" + t(bodyKey, { item: t(decoration.titleKey), slot: slotLabel }) + "</p>";

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
  const value = document.createElement("strong");
  value.textContent = decoration ? t(decoration.titleKey) : t("pantry.emptySlot");
  slotElement.append(label, value);
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
    return "";
  }

  const currentDecoration = getDecorationById(equippedDecorations[decoration.slot]);
  if (currentDecoration && currentDecoration.id !== decoration.id) {
    return '<p class="pantry-swap-note">' + t("pantry.swapNote", { current: t(currentDecoration.titleKey) }) + "</p>";
  }

  return '<p class="pantry-swap-note">' + t("pantry.emptyPlacementNote") + "</p>";
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
  savings.innerHTML = ""
    + "<p>" + t("pantry.itemSavings", { saved: Math.min(spoons, cost), cost, needed }) + "</p>"
    + '<div class="pantry-item-savings-meter" aria-hidden="true"><span></span></div>';
  return savings;
}

function renderShopCard(decoration, ownedIds, equippedDecorations, spoons, trackedGoalId, storyGoalId, onTrackGoal, onRefresh, onFirstPurchase) {
  const owned = ownedIds.includes(decoration.id);
  const equipped = equippedDecorations[decoration.slot] === decoration.id;
  const affordable = spoons >= Number(decoration.cost || 0);
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
  body.innerHTML = ""
    + '<p class="section-label">' + rarityLabel + " · " + priceLabel + "</p>"
    + '<p class="pantry-item-status status-' + statusKey + '">' + t("pantry.itemStatus." + statusKey) + "</p>"
    + "<h4>" + t(decoration.titleKey) + "</h4>"
    + '<p class="pantry-slot-note">' + t("pantry.placedInSlot", { slot: slotLabel }) + "</p>"
    + placementSwapNote
    + "<p>" + t(decoration.descriptionKey) + "</p>";

  const itemSavings = renderItemSavings(decoration, owned, spoons);
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
    button.textContent = t("pantry.equip");
    button.addEventListener("click", () => {
      equipDecoration(decoration);
      setPantryActionFeedback(decoration.id === storyGoalId ? "storyComplete" : "equip", decoration);
      if (decoration.id === storyGoalId) {
        storyGoalId = null;
        pantryViewState.storyGoalId = null;
      }
      onRefresh?.();
    });
  } else {
    button.disabled = !affordable;
    button.textContent = affordable ? t("pantry.buy") : t("pantry.needMore", { count: Math.max(0, decoration.cost - spoons) });
    button.addEventListener("click", () => {
      if (buyDecoration(decoration)) {
        setPantryActionFeedback(decoration.id === storyGoalId ? "storyComplete" : "buy", decoration);
        if (decoration.id === storyGoalId) {
          storyGoalId = null;
          pantryViewState.storyGoalId = null;
        }
        onFirstPurchase?.(decoration);
        onRefresh?.();
      }
    });
  }

  card.append(art, body);
  if (itemSavings) {
    card.appendChild(itemSavings);
  }
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

function getNextSavingsGoal(approvedDecorations, ownedIds, spoons, selectedSlotId, trackedGoalId) {
  const trackedGoal = approvedDecorations.find((decoration) => decoration.id === trackedGoalId);
  if (trackedGoal && !ownedIds.includes(trackedGoal.id) && (selectedSlotId === "all" || trackedGoal.slot === selectedSlotId)) {
    return trackedGoal;
  }

  const candidates = approvedDecorations
    .filter((decoration) => !ownedIds.includes(decoration.id))
    .filter((decoration) => selectedSlotId === "all" || decoration.slot === selectedSlotId)
    .sort((left, right) => Number(left.cost || 0) - Number(right.cost || 0));

  return candidates.find((decoration) => Number(decoration.cost || 0) > spoons) || candidates[0] || null;
}

function renderSavingsGoal(selectedSlotId, approvedDecorations, ownedIds, spoons, trackedGoalId) {
  const goal = getNextSavingsGoal(approvedDecorations, ownedIds, spoons, selectedSlotId, trackedGoalId);
  const goalCard = document.createElement("aside");
  goalCard.className = "pantry-savings-goal";

  if (!goal) {
    goalCard.innerHTML = ""
      + "<h3>" + t("pantry.savingsCompleteTitle") + "</h3>"
      + "<p>" + t("pantry.savingsCompleteBody") + "</p>";
    return goalCard;
  }

  const cost = Number(goal.cost || 0);
  const needed = Math.max(0, cost - spoons);
  const progress = cost <= 0 ? 100 : Math.min(100, Math.round((spoons / cost) * 100));
  const slot = pantrySlots.find((candidate) => candidate.id === goal.slot);
  const slotLabel = slot ? t(slot.titleKey) : goal.slot;
  goalCard.style.setProperty("--savings-progress", progress + "%");
  goalCard.innerHTML = ""
    + "<div>"
    + '<p class="section-label">' + t("pantry.savingsEyebrow") + "</p>"
    + "<h3>" + t(goal.titleKey) + "</h3>"
    + "<p>" + t("pantry.savingsBody", { slot: slotLabel, cost, needed }) + "</p>"
    + "</div>"
    + '<div class="pantry-savings-meter" aria-hidden="true"><span></span></div>';
  return goalCard;
}


function renderEarningPlan(selectedSlotId, approvedDecorations, ownedIds, spoons, trackedGoalId, onPlayForSpoons) {
  const goal = getNextSavingsGoal(approvedDecorations, ownedIds, spoons, selectedSlotId, trackedGoalId);
  const plan = document.createElement("aside");
  plan.className = "pantry-earning-plan";

  if (!goal) {
    plan.innerHTML = ""
      + '<p class="section-label">' + t("pantry.earningEyebrow") + "</p>"
      + "<h3>" + t("pantry.earningCompleteTitle") + "</h3>"
      + "<p>" + t("pantry.earningCompleteBody") + "</p>";
    return plan;
  }

  const needed = Math.max(0, Number(goal.cost || 0) - spoons);
  const starterReward = Math.max(1, getPuzzleReward(5));
  const dailyReward = starterReward + Math.max(0, Number(ECONOMY.DAILY_BONUS || 0));
  const starterRuns = Math.max(0, Math.ceil(needed / starterReward));
  const dailyRuns = Math.max(0, Math.ceil(needed / Math.max(1, dailyReward)));

  plan.innerHTML = ""
    + '<p class="section-label">' + t("pantry.earningEyebrow") + "</p>"
    + "<h3>" + t("pantry.earningTitle", { item: t(goal.titleKey) }) + "</h3>"
    + "<p>" + t("pantry.earningBody", { needed, starterRuns, dailyRuns }) + "</p>";

  if (needed > 0) {
    const action = document.createElement("button");
    action.type = "button";
    action.className = "pantry-earning-action";
    action.textContent = t("pantry.earningAction");
    action.addEventListener("click", () => onPlayForSpoons?.());
    plan.appendChild(action);
  }

  return plan;
}


function getNextPantryProgressStage(completedRequestCount) {
  return puzzlePacks
    .filter((pack) => pack.access !== "bonus-pack" && Number(pack.pantryRoomStepRequired || 0) > completedRequestCount)
    .sort((left, right) => Number(left.pantryRoomStepRequired || 0) - Number(right.pantryRoomStepRequired || 0) || Number(left.unlockCost || 0) - Number(right.unlockCost || 0))[0] || null;
}

function getNextPantryRequestDecoration(approvedDecorations, ownedIds, equippedDecorations) {
  const starterRequest = approvedDecorations.find((decoration) => Number(decoration.cost || 0) === 0 && decoration.slot === "counter") || approvedDecorations[0];
  if (starterRequest && (!ownedIds.includes(starterRequest.id) || equippedDecorations[starterRequest.slot] !== starterRequest.id)) {
    return starterRequest;
  }

  return approvedDecorations
    .filter((decoration) => decoration.id !== starterRequest?.id && !ownedIds.includes(decoration.id))
    .sort((left, right) => Number(left.cost || 0) - Number(right.cost || 0) || left.id.localeCompare(right.id))[0] || null;
}

function renderPantryProgressMission(completedRequestCount, spoons, nextRequestDecoration, onPlanRequest, onPlayForSpoons) {
  const mission = document.createElement("div");
  mission.className = "pantry-progress-mission";

  const nextStage = getNextPantryProgressStage(completedRequestCount);
  const roomTarget = roomStepTargets.find((target) => target > completedRequestCount) || completedRequestCount;
  const nextTarget = nextStage ? Number(nextStage.pantryRoomStepRequired || roomTarget) : roomTarget;
  const previousTarget = [...roomStepTargets].reverse().find((target) => target <= completedRequestCount) || 0;
  const remainingRequests = Math.max(0, nextTarget - completedRequestCount);
  const span = Math.max(1, nextTarget - previousTarget);
  const progress = nextTarget === completedRequestCount ? 100 : Math.round(((completedRequestCount - previousTarget) / span) * 100);
  mission.style.setProperty("--pantry-room-progress", Math.max(0, Math.min(100, progress)) + "%");
  const title = nextStage
    ? t("pantry.progressMissionTitle", { count: completedRequestCount, target: nextTarget })
    : t("pantry.progressMissionCompleteTitle");
  const body = nextStage
    ? t("pantry.progressMissionBody", { remaining: remainingRequests, stage: t(nextStage.titleKey) })
    : t("pantry.progressMissionCompleteBody", { count: completedRequestCount });
  const unlockCost = nextStage ? Math.max(0, Number(nextStage.unlockCost || 0)) : 0;
  const saved = nextStage ? Math.min(unlockCost, Math.max(0, Number(spoons || 0))) : 0;
  const needed = nextStage ? Math.max(0, unlockCost - saved) : 0;
  const route = nextStage
    ? '<div class="pantry-progress-mission__route" aria-label="' + t("pantry.progressMissionRouteAria") + '">'
      + '<span>' + t("pantry.progressMissionRouteRequests", { count: completedRequestCount, target: nextTarget }) + '</span>'
      + '<span>' + t("pantry.progressMissionRouteStage", { stage: t(nextStage.titleKey) }) + '</span>'
      + '<span>' + t("pantry.progressMissionRouteSpoons", { saved, cost: unlockCost }) + '</span>'
      + '</div>'
    : "";

  mission.innerHTML = ""
    + '<p class="section-label">' + t("pantry.progressMissionEyebrow") + "</p>"
    + "<strong>" + title + "</strong>"
    + "<p>" + body + "</p>"
    + route
    + '<div class="pantry-progress-mission__meter" aria-hidden="true"><span></span></div>';

  if (nextStage) {
    const facts = document.createElement("div");
    facts.className = "pantry-progress-mission__facts";
    facts.innerHTML = ""
      + "<span>" + t("pantry.progressMissionRequests", { count: completedRequestCount, target: Number(nextStage.pantryRoomStepRequired || nextTarget) }) + "</span>"
      + "<span>" + t("pantry.progressMissionSpoons", { saved, cost: unlockCost, needed }) + "</span>";
    mission.appendChild(facts);

    const action = document.createElement("button");
    action.type = "button";
    action.className = "pantry-progress-mission__action";
    if (remainingRequests > 0 && nextRequestDecoration) {
      action.textContent = t("pantry.progressMissionPlanRequest");
      action.addEventListener("click", () => onPlanRequest?.(nextRequestDecoration));
      mission.appendChild(action);
    } else if (needed > 0) {
      action.textContent = t("pantry.progressMissionPlaySpoons");
      action.addEventListener("click", () => onPlayForSpoons?.());
      mission.appendChild(action);
    }
  }

  return mission;
}

function renderCollectionProgress(approvedDecorations, ownedIds, equippedDecorations, completedStoryGoalIds, spoons, onPlanRequest, onPlayForSpoons) {
  const ownedSet = new Set(ownedIds);
  const progress = document.createElement("section");
  progress.className = "pantry-progress-board";

  const equippedCount = pantrySlots.filter((slot) => equippedDecorations[slot.id]).length;
  const ownedCount = approvedDecorations.filter((decoration) => ownedSet.has(decoration.id)).length;
  const completedRequestCount = Array.isArray(completedStoryGoalIds) ? completedStoryGoalIds.length : 0;
  const header = document.createElement("div");
  header.className = "pantry-progress-board__header";
  header.innerHTML = ""
    + "<div>"
    + '<p class="section-label">' + t("pantry.progressEyebrow") + "</p>"
    + "<h3>" + t("pantry.progressTitle") + "</h3>"
    + "</div>"
    + "<p>" + t("pantry.progressSummary", { owned: ownedCount, total: approvedDecorations.length, equipped: equippedCount, slots: pantrySlots.length }) + "</p>";

  const list = document.createElement("div");
  list.className = "pantry-progress-slots";
  pantrySlots.forEach((slot) => {
    const slotDecorations = approvedDecorations.filter((decoration) => decoration.slot === slot.id);
    const slotOwnedCount = slotDecorations.filter((decoration) => ownedSet.has(decoration.id)).length;
    const row = document.createElement("p");
    row.className = "pantry-progress-slot";
    row.innerHTML = "<span>" + t(slot.titleKey) + "</span><strong>" + t("pantry.progressSlot", { owned: slotOwnedCount, total: slotDecorations.length }) + "</strong>";
    list.appendChild(row);
  });

  const nextRequestDecoration = getNextPantryRequestDecoration(approvedDecorations, ownedIds, equippedDecorations);
  const mission = renderPantryProgressMission(completedRequestCount, spoons, nextRequestDecoration, onPlanRequest, onPlayForSpoons);

  progress.append(header, mission, list);
  return progress;
}

function renderPlacementAdvisor(selectedSlotId, approvedDecorations, ownedIds) {
  const advisor = document.createElement("aside");
  advisor.className = "pantry-placement-advisor";

  if (selectedSlotId === "all") {
    advisor.innerHTML = ""
      + "<h3>" + t("pantry.advisorAllTitle") + "</h3>"
      + "<p>" + t("pantry.advisorAllBody", { count: approvedDecorations.length, slots: pantrySlots.length }) + "</p>";
    return advisor;
  }

  const slot = pantrySlots.find((candidate) => candidate.id === selectedSlotId);
  const slotLabel = slot ? t(slot.titleKey) : selectedSlotId;
  const slotDecorations = approvedDecorations.filter((decoration) => decoration.slot === selectedSlotId);
  const costs = slotDecorations.map((decoration) => Number(decoration.cost || 0));
  const minCost = Math.min(...costs);
  const maxCost = Math.max(...costs);
  const ownedCount = slotDecorations.filter((decoration) => ownedIds.includes(decoration.id)).length;

  advisor.innerHTML = ""
    + "<h3>" + t("pantry.advisorSlotTitle", { slot: slotLabel }) + "</h3>"
    + "<p>" + t("pantry.advisorSlotBody", { count: slotDecorations.length, owned: ownedCount, min: minCost, max: maxCost }) + "</p>";
  return advisor;
}


function renderDisplayPlan(selectedSlotId, approvedDecorations, ownedIds, equippedDecorations, spoons) {
  const plan = document.createElement("aside");
  plan.className = "pantry-display-plan";

  if (selectedSlotId === "all") {
    const equippedCount = pantrySlots.filter((slot) => equippedDecorations[slot.id]).length;
    plan.innerHTML = ""
      + '<p class="section-label">' + t("pantry.displayPlanEyebrow") + "</p>"
      + "<h3>" + t("pantry.displayPlanAllTitle") + "</h3>"
      + "<p>" + t("pantry.displayPlanAllBody", { equipped: equippedCount, slots: pantrySlots.length }) + "</p>";
    return plan;
  }

  const slot = pantrySlots.find((candidate) => candidate.id === selectedSlotId);
  const slotLabel = slot ? t(slot.titleKey) : selectedSlotId;
  const currentDecoration = getDecorationById(equippedDecorations[selectedSlotId]);
  const nextDecoration = approvedDecorations
    .filter((decoration) => decoration.slot === selectedSlotId && !ownedIds.includes(decoration.id))
    .sort((left, right) => Number(left.cost || 0) - Number(right.cost || 0))[0];

  const currentBody = currentDecoration
    ? t("pantry.displayPlanSlotFilledBody", { item: t(currentDecoration.titleKey), slot: slotLabel })
    : t("pantry.displayPlanSlotEmptyBody", { slot: slotLabel });

  const nextBody = nextDecoration
    ? '<p class="pantry-display-plan__next"><strong>' + t("pantry.displayPlanNextTitle") + '</strong> ' + t("pantry.displayPlanNextBody", {
      item: t(nextDecoration.titleKey),
      cost: Number(nextDecoration.cost || 0),
      needed: Math.max(0, Number(nextDecoration.cost || 0) - spoons)
    }) + "</p>"
    : '<p class="pantry-display-plan__next complete">' + t("pantry.displayPlanComplete") + "</p>";

  plan.innerHTML = ""
    + '<p class="section-label">' + t("pantry.displayPlanEyebrow") + "</p>"
    + "<h3>" + t("pantry.displayPlanSlotTitle", { slot: slotLabel }) + "</h3>"
    + "<p>" + currentBody + "</p>"
    + nextBody;
  return plan;
}

function renderShopLimitControl(visibleCount, totalCount, onShowMore) {
  if (visibleCount >= totalCount) {
    return null;
  }

  const control = document.createElement("div");
  control.className = "pantry-shop-limit";

  const text = document.createElement("p");
  text.textContent = t("pantry.shopLimitSummary", { visible: visibleCount, total: totalCount });

  const button = document.createElement("button");
  button.type = "button";
  button.className = "pantry-shop-limit__action";
  button.textContent = t("pantry.shopLimitAction");
  button.addEventListener("click", () => onShowMore?.());

  control.append(text, button);
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

export function renderPantryView(onRefresh = () => {}, onFirstPurchase = () => {}, onPlayForSpoons = () => {}) {
  const panel = document.createElement("section");
  panel.className = "pantry-panel content-panel";

  const spoons = getPantrySpoons();
  const ownedIds = getOwnedDecorationIds();
  const equippedDecorations = getEquippedDecorations();
  const approvedDecorations = getApprovedPantryDecorations();
  const completedStoryGoalIds = getCompletedPantryStoryGoalIds();
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
  header.innerHTML = ""
    + "<div>"
    + '<p class="section-label">' + t("sections.pantryRoom") + "</p>"
    + "<h2>" + t("pantry.title") + "</h2>"
    + "</div>"
    + '<p class="pantry-spoon-note">' + t("pantry.spoonNote", { count: spoons }) + "</p>";

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

  const storyArchiveMount = document.createElement("div");
  storyArchiveMount.className = "pantry-story-archive-mount";

  const planningDeck = document.createElement("section");
  planningDeck.className = "pantry-planning-deck";
  planningDeck.setAttribute("aria-label", t("pantry.planningDeckAria"));

  const advisorMount = document.createElement("div");
  advisorMount.className = "pantry-placement-advisor-mount";

  const savingsGoalMount = document.createElement("div");
  savingsGoalMount.className = "pantry-savings-goal-mount";

  const earningPlanMount = document.createElement("div");
  earningPlanMount.className = "pantry-earning-plan-mount";

  const progressMount = document.createElement("div");
  progressMount.className = "pantry-progress-mount";

  const displayPlanMount = document.createElement("div");
  displayPlanMount.className = "pantry-display-plan-mount";

  planningDeck.append(displayPlanMount, savingsGoalMount, earningPlanMount, advisorMount, progressMount);

  const shop = document.createElement("section");
  shop.className = "pantry-shop";
  shop.innerHTML = ""
    + '<div class="pantry-shop-heading">'
    + "<div>"
    + '<p class="section-label">' + t("pantry.shopEyebrow") + "</p>"
    + "<h3>" + t("pantry.shopTitle") + "</h3>"
    + "</div>"
    + "<p>" + t("pantry.shopBody") + "</p>"
    + "</div>";

  const filtersMount = document.createElement("div");
  const grid = document.createElement("div");
  grid.className = "pantry-shop-grid";
  const shopLimitMount = document.createElement("div");
  shopLimitMount.className = "pantry-shop-limit-mount";
  shop.append(filtersMount, grid, shopLimitMount);

  function drawDecorations() {
    room.innerHTML = "";
    actionFeedbackMount.innerHTML = "";
    const feedback = renderActionFeedback(equippedDecorations);
    if (feedback) {
      actionFeedbackMount.appendChild(feedback);
    }
    pantrySlots.forEach((slot) => {
      room.appendChild(renderRoomSlot(slot, equippedDecorations, selectedSlotId, selectSlot));
    });

    storyRequestMount.replaceChildren(renderPantryStoryRequest(approvedDecorations, ownedIds, equippedDecorations, spoons, startStoryRequest));
    storyMilestoneMount.replaceChildren(renderPantryStoryMilestone(approvedDecorations, ownedIds, equippedDecorations, selectStoryArrival));
    storyDeliveryMount.replaceChildren(renderPantryStoryDelivery(approvedDecorations, storyGoalId, ownedIds, spoons, showStoryGoal, onPlayForSpoons));
    storyArchiveMount.replaceChildren(renderPantryStoryArchive(approvedDecorations, completedStoryGoalIds, ownedIds, selectStoryArrival, spoons));
    filtersMount.innerHTML = "";
    filtersMount.className = "pantry-filter-stack";
    advisorMount.replaceChildren(renderPlacementAdvisor(selectedSlotId, approvedDecorations, ownedIds));
    savingsGoalMount.replaceChildren(renderSavingsGoal(selectedSlotId, approvedDecorations, ownedIds, spoons, trackedGoalId));
    earningPlanMount.replaceChildren(renderEarningPlan(selectedSlotId, approvedDecorations, ownedIds, spoons, trackedGoalId, onPlayForSpoons));
    progressMount.replaceChildren(renderCollectionProgress(approvedDecorations, ownedIds, equippedDecorations, completedStoryGoalIds, spoons, planNextRoomRequest, onPlayForSpoons));
    displayPlanMount.replaceChildren(renderDisplayPlan(selectedSlotId, approvedDecorations, ownedIds, equippedDecorations, spoons));

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
    filtersMount.append(
      renderSlotFilters(selectedSlotId, selectSlot),
      renderRarityFilters(selectedRarity, selectRarity),
      renderAvailabilityFilters(selectedAvailability, selectAvailability),
      renderSortControls(selectedSort, selectSort),
      renderFilterSummary(visibleDecorations.length, approvedDecorations.length, isFiltered, resetFilters)
    );

    grid.innerHTML = "";
    shopLimitMount.innerHTML = "";
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
  panel.append(header, room, placementNote, storyRequestMount, storyMilestoneMount, storyDeliveryMount, actionFeedbackMount, storyArchiveMount, planningDeck, shop);
  return panel;
}
