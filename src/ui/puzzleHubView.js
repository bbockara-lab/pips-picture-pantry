import spoonTokenUrl from "../assets/icons/spoon-token-v2.png";
import puzzleWorkshopBackgroundUrl from "../assets/generated/pip-puzzle-workshop-v1.webp";
import { getSeasonShelfForPuzzle, getSeasonShelfPuzzles, seasonShelves } from "../data/seasonShelves.js";
import { getStageArtUrl, hasApprovedStageArt } from "../data/stageArt.js";
import { getApprovedPantryDecorations } from "../data/decorations.js";
import { ECONOMY } from "../data/economyConfig.js";
import { canUnlockShelf, getCompletedPuzzleIds, getOwnedDecorationIds, getPantrySpoons, getReplayDailyCount, getShelfPantryRoomRequirement, isShelfUnlocked } from "../game/save.js";
import { puzzleTitle, t } from "../i18n/index.js";
import { getQuickTravelArt } from "../data/quickTravelArt.js";
import { getPuzzleControlArt } from "../data/puzzleControlArt.js";
import { getPreviousSeasonShelf } from "../game/seasonShelfProgress.js";

function appendTextElement(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  element.textContent = text;
  parent.appendChild(element);
  return element;
}

function createMeterFill() {
  return document.createElement("span");
}

export function renderPuzzleHub(activePuzzle, options = {}) {
  const {
    onOpenPuzzle = () => {},
    onShowList = () => {},
    onSelectView = () => {},
    onOpenSettings = () => {}
  } = typeof options === "function" ? { onOpenPuzzle: options } : options;
  const stack = document.createElement("div");
  stack.className = "puzzle-hub-stack puzzle-home";

  const scene = document.createElement("section");
  scene.className = "puzzle-home-scene";
  scene.style.setProperty("--puzzle-home-background", `url("${puzzleWorkshopBackgroundUrl}")`);
  scene.setAttribute("aria-label", t("home.sceneAria"));

  const greeting = appendTextElement(
    scene,
    "p",
    "puzzle-home-scene__greeting",
    t(["home.greetingPuzzle", "home.greetingPip", "home.greetingToday"][activePuzzle.id.length % 3])
  );
  greeting.setAttribute("aria-live", "polite");

  const play = document.createElement("button");
  play.type = "button";
  play.className = "puzzle-home-scene__play";
  play.dataset.destination = "play";
  play.setAttribute("aria-label", `${t("playScreen.open")}: ${puzzleTitle(activePuzzle)}`);
  const playArt = getPuzzleControlArt("fill");
  if (playArt) {
    const image = document.createElement("img");
    image.src = playArt.src;
    image.alt = "";
    image.setAttribute("aria-hidden", "true");
    image.dataset.assetId = playArt.assetId;
    play.appendChild(image);
  }
  const playLabel = document.createElement("span");
  playLabel.className = "puzzle-home-scene__play-label";
  appendTextElement(playLabel, "span", "puzzle-home-scene__play-label-main", t("playScreen.open"));
  play.appendChild(playLabel);
  play.addEventListener("click", onOpenPuzzle);

  const destinations = document.createElement("nav");
  destinations.className = "puzzle-home-destinations";
  destinations.setAttribute("aria-label", t("home.destinationsAria"));
  const destinationItems = [
    ["puzzle", "home.pictureList", onShowList],
    ["album", "views.album", () => onSelectView("album")],
    ["pantry", "home.room", () => onSelectView("pantry")],
    ["timeAttack", "views.timeAttack", () => onSelectView("timeAttack")],
    ["map", "views.map", () => onSelectView("map")]
  ];
  const completedIds = new Set(getCompletedPuzzleIds());
  const activeShelf = getSeasonShelfForPuzzle(activePuzzle);
  const activeShelfPuzzles = activeShelf ? getSeasonShelfPuzzles(activeShelf) : [];
  const activeShelfCompletedCount = activeShelfPuzzles.filter((puzzle) => completedIds.has(puzzle.id)).length;
  const ownedDecorationIds = new Set(getOwnedDecorationIds());
  const hasNewPantryDecoration = getApprovedPantryDecorations()
    .some((decoration) => !ownedDecorationIds.has(decoration.id));
  destinationItems.forEach(([artId, labelKey, onClick]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `puzzle-home-destination puzzle-home-destination--${artId}`;
    button.dataset.destination = artId;
    const art = getQuickTravelArt(artId);
    if (art) {
      const image = document.createElement("img");
      image.src = art.src;
      image.alt = "";
      image.setAttribute("aria-hidden", "true");
      image.dataset.assetId = art.assetId;
      button.appendChild(image);
    }
    const label = appendTextElement(button, "span", "puzzle-home-destination__label", t(labelKey));
    label.setAttribute("aria-hidden", "true");
    if (artId === "puzzle") {
      appendTextElement(
        button,
        "span",
        "puzzle-home-destination__badge",
        `${activeShelfCompletedCount}/${activeShelfPuzzles.length}`
      );
    } else if (artId === "pantry" && hasNewPantryDecoration) {
      appendTextElement(button, "span", "puzzle-home-destination__badge", t("home.new"));
    }
    button.setAttribute("aria-label", t(labelKey));
    button.title = t(labelKey);
    button.addEventListener("click", onClick);
    destinations.appendChild(button);
  });

  const sceneControls = document.createElement("div");
  sceneControls.className = "puzzle-home-scene__controls";

  const currency = document.createElement("div");
  currency.className = "puzzle-home-scene__currency";
  currency.setAttribute("aria-label", t("currency.spoons", { count: getPantrySpoons() }));
  const spoon = document.createElement("img");
  spoon.src = spoonTokenUrl;
  spoon.alt = "";
  spoon.setAttribute("aria-hidden", "true");
  spoon.dataset.assetId = "spoon-token-v2";
  currency.append(spoon, document.createTextNode(String(getPantrySpoons())));

  const settingsButton = document.createElement("button");
  settingsButton.type = "button";
  settingsButton.className = "puzzle-home-scene__settings";
  settingsButton.dataset.destination = "settings";
  settingsButton.setAttribute("aria-label", t("header.settings"));
  const settingsArt = getQuickTravelArt("settings");
  if (settingsArt) {
    const image = document.createElement("img");
    image.src = settingsArt.src;
    image.alt = "";
    image.setAttribute("aria-hidden", "true");
    image.dataset.assetId = settingsArt.assetId;
    settingsButton.appendChild(image);
  }
  settingsButton.addEventListener("click", onOpenSettings);

  sceneControls.append(currency, settingsButton);
  scene.append(destinations, sceneControls, play);
  stack.append(scene);
  return stack;
}

export function getStageNavigation(activePuzzle, onPrevious, onNext, onShowList) {
  const shelf = getSeasonShelfForPuzzle(activePuzzle);
  const shelfPuzzles = getSeasonShelfPuzzles(shelf);
  const currentIndex = shelfPuzzles.findIndex((puzzle) => puzzle.id === activePuzzle.id);
  return {
    packTitle: shelf ? t(shelf.titleKey) : t("sections.currentPicture"),
    current: Math.max(currentIndex + 1, 1),
    total: shelfPuzzles.length || 1,
    hasPrevious: currentIndex > 0,
    hasNext: currentIndex >= 0 && currentIndex < shelfPuzzles.length - 1,
    onPrevious,
    onNext,
    onShowList
  };
}

export function renderDailyCard(dailyPuzzle, activePuzzleId, onSelectPuzzle) {
  const card = document.createElement("section");
  card.className = dailyPuzzle.id === activePuzzleId ? "daily-card active" : "daily-card";

  const text = document.createElement("div");
  appendTextElement(text, "p", "section-label", t("daily.eyebrow"));
  appendTextElement(text, "h2", "", puzzleTitle(dailyPuzzle));

  const button = document.createElement("button");
  button.type = "button";
  button.className = "tool-button daily-button";
  button.textContent = dailyPuzzle.id === activePuzzleId ? t("daily.selected") : t("daily.play");
  button.disabled = dailyPuzzle.id === activePuzzleId;
  button.addEventListener("click", () => onSelectPuzzle(dailyPuzzle.id));

  card.append(text, button);
  return card;
}

export function renderTimeAttackTeaserCard(onOpenTimeAttack = () => {}) {
  const card = document.createElement("section");
  card.className = "time-attack-teaser-card";

  const badge = document.createElement("span");
  badge.className = "time-attack-teaser-card__badge";
  badge.setAttribute("aria-hidden", "true");
  const timeAttackArt = getQuickTravelArt("timeAttack");
  if (timeAttackArt) {
    const image = document.createElement("img");
    image.src = timeAttackArt.src;
    image.alt = "";
    image.dataset.assetId = timeAttackArt.assetId;
    badge.appendChild(image);
  }

  const copy = document.createElement("div");
  appendTextElement(copy, "p", "section-label", t("timeAttack.hubEyebrow"));
  appendTextElement(copy, "h2", "", t("timeAttack.hubTitle"));
  const button = document.createElement("button");
  button.type = "button";
  button.className = "tool-button time-attack-teaser-card__action";
  button.setAttribute("aria-label", t("timeAttack.hubAction"));

  const actionLabel = document.createElement("span");
  actionLabel.className = "time-attack-teaser-card__action-label";
  actionLabel.textContent = t("timeAttack.hubAction");

  button.append(actionLabel);
  button.addEventListener("click", onOpenTimeAttack);

  card.append(badge, copy, button);
  return card;
}

export function renderReplayPicksCard(replayPicks, activePuzzleId, onSelectPuzzle, options = {}) {
  if (!Array.isArray(replayPicks) || replayPicks.length === 0) {
    return null;
  }

  const { dailyCount = getReplayDailyCount(), dailyLimit = ECONOMY.REPLAY_PICK_DAILY_LIMIT, onReplayPick = onSelectPuzzle } = options;
  const card = document.createElement("section");
  card.className = "replay-picks-card";

  const header = document.createElement("div");
  header.className = "replay-picks-card__header";
  const headerCopy = document.createElement("div");
  appendTextElement(headerCopy, "h2", "", t("replayPicks.title"));
  const count = document.createElement("span");
  count.textContent = t("replayPicks.count", { count: dailyCount, limit: dailyLimit });
  header.append(headerCopy, count);

  const list = document.createElement("div");
  list.className = "replay-picks-list";
  replayPicks.forEach((puzzle) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = puzzle.id === activePuzzleId ? "replay-pick-button active" : "replay-pick-button";
    button.dataset.puzzleId = puzzle.id;
    appendTextElement(button, "span", "", puzzleTitle(puzzle));
    button.addEventListener("click", () => onReplayPick(puzzle.id));
    list.appendChild(button);
  });

  card.append(header, list);
  return card;
}

export function renderPuzzlePicker(activePuzzleId, onSelectPuzzle, onUnlockShelf, options = {}) {
  const {
    hideCompletedStages = false,
    onToggleHideCompletedStages = () => {},
    onOpenPantry = () => {},
    onGoHome = () => {}
  } = options;
  const completedPuzzleIds = getCompletedPuzzleIds();
  const completedPuzzleIdSet = new Set(completedPuzzleIds);
  const section = document.createElement("section");
  section.className = "puzzle-picker content-panel";
  const homeButton = document.createElement("button");
  homeButton.type = "button";
  homeButton.className = "puzzle-picker__home";
  homeButton.textContent = t("home.sceneAria");
  homeButton.addEventListener("click", onGoHome);
  section.appendChild(homeButton);
  const stageStats = seasonShelves
    .map((shelf) => {
      const shelfPuzzles = getSeasonShelfPuzzles(shelf);
      const completeCount = shelfPuzzles.filter((puzzle) => completedPuzzleIdSet.has(puzzle.id)).length;
      return {
        shelf,
        total: shelfPuzzles.length,
        completeCount,
        complete: shelfPuzzles.length > 0 && completeCount >= shelfPuzzles.length
      };
    });
  const completedStageCount = stageStats.filter((stat) => stat.complete).length;
  if (completedStageCount > 0) {
    section.appendChild(createStageFilterBar(hideCompletedStages, completedStageCount, onToggleHideCompletedStages));
  }

  seasonShelves.forEach((shelf) => {
    const shelfPuzzles = getSeasonShelfPuzzles(shelf);
    const completeCount = shelfPuzzles.filter((puzzle) => completedPuzzleIdSet.has(puzzle.id)).length;
    const unlocked = isShelfUnlocked(shelf);
    const isStageComplete = shelfPuzzles.length > 0 && completeCount >= shelfPuzzles.length;
    if (hideCompletedStages && isStageComplete) {
      return;
    }
    if (!unlocked) {
      // Keep the next reachable shelf visible. Hiding every locked shelf made
      // the stage path appear to end after a player finished the previous one.
      const previousShelf = getPreviousSeasonShelf(shelf);
      const previousComplete = Boolean(previousShelf)
        && getSeasonShelfPuzzles(previousShelf).every((puzzle) => completedPuzzleIdSet.has(puzzle.id));
      if (!previousComplete) {
        return;
      }

      const lockedBlock = document.createElement("article");
      lockedBlock.className = "pack-block pack-block--locked";
      lockedBlock.dataset.shelfId = shelf.id;
      lockedBlock.dataset.locked = "true";

      const lockedHeader = document.createElement("div");
      lockedHeader.className = "pack-header";
      appendTextElement(lockedHeader, "p", "section-label", t(shelf.titleKey));

      lockedBlock.append(
        lockedHeader,
        createStagePreview(shelf, 0, shelfPuzzles.length),
        createUnlockPanel(shelf, onUnlockShelf, onOpenPantry)
      );
      section.appendChild(lockedBlock);
      return;
    }
    const packBlock = document.createElement("article");
    packBlock.className = "pack-block";
    packBlock.dataset.shelfId = shelf.id;
    if (shelfPuzzles.some((puzzle) => puzzle.id === activePuzzleId)) {
      packBlock.dataset.activeStage = "true";
    }

    const header = document.createElement("div");
    header.className = "pack-header";
    const headerCopy = document.createElement("div");
    appendTextElement(headerCopy, "p", "section-label", t(shelf.titleKey));
    header.append(headerCopy);
    packBlock.appendChild(header);
    packBlock.appendChild(createStagePreview(shelf, completeCount, shelfPuzzles.length));

    const list = document.createElement("div");
    list.className = "puzzle-list";

    shelfPuzzles.forEach((puzzle) => {
      const complete = completedPuzzleIdSet.has(puzzle.id);
      const button = document.createElement("button");
      button.type = "button";
      button.className = getPuzzleChipClass(puzzle, activePuzzleId, true, complete);
      button.dataset.size = String(puzzle.size);
      button.dataset.complete = String(complete);
      button.dataset.puzzleId = puzzle.id;

      const label = document.createElement("span");
      label.textContent = puzzleTitle(puzzle);
      button.appendChild(label);

      const meta = document.createElement("small");
      if (complete) {
        meta.textContent = t("puzzlePicker.complete");
      } else {
        meta.textContent = t("puzzlePicker.size", { size: puzzle.size });
      }
      button.appendChild(meta);
      button.setAttribute("aria-label", `${puzzleTitle(puzzle)} - ${meta.textContent}`);
      button.addEventListener("click", () => onSelectPuzzle(puzzle.id));

      list.appendChild(button);
    });

    packBlock.appendChild(list);
    section.appendChild(packBlock);
  });

  return section;
}

function createStageFilterBar(hideCompletedStages, hiddenStageCount, onToggleHideCompletedStages) {
  const bar = document.createElement("div");
  bar.className = "stage-filter-bar";

  const button = document.createElement("button");
  button.type = "button";
  button.className = hideCompletedStages ? "stage-filter-toggle active" : "stage-filter-toggle";
  button.setAttribute("aria-pressed", String(hideCompletedStages));
  button.textContent = hideCompletedStages ? t("stageFilter.showCompleted") : t("stageFilter.hideCompleted");
  button.addEventListener("click", onToggleHideCompletedStages);

  bar.append(button);
  return bar;
}

function createStagePreview(shelf, completeCount, total) {
  const preview = document.createElement("div");
  preview.className = "stage-preview";
  preview.setAttribute("aria-hidden", "true");
  const stageProgressRatio = completeCount / Math.max(total || 20, 1);
  preview.style.setProperty("--stage-progress", `${Math.round(stageProgressRatio * 100)}%`);
  preview.style.setProperty("--stage-progress-ratio", String(Math.min(1, Math.max(0, stageProgressRatio))));
  const wrap = document.createElement("div");
  wrap.className = "stage-pip-preview tile-stage-preview";
  const previewTileTotal = 20;
  const previewCompleteCount = Math.round(stageProgressRatio * previewTileTotal);
  if (hasApprovedStageArt(shelf.artPackId || shelf.id)) {
    wrap.append(createStageTileMosaic(shelf, previewCompleteCount, previewTileTotal), createStageProgressMeter());
  } else {
    wrap.append(createStageFallbackMosaic(previewCompleteCount, previewTileTotal), createStageProgressMeter());
  }
  preview.appendChild(wrap);
  return preview;
}

function createStageTileMosaic(shelf, completeCount, total) {
  const columns = 5;
  const rows = Math.ceil(total / columns);
  const mosaic = document.createElement("div");
  mosaic.className = "pip-tile-mosaic stage-tile-mosaic";
  const artId = shelf.artPackId || shelf.id;
  const artUrl = getStageArtUrl(artId);
  if (!artUrl) {
    return createStageFallbackMosaic(completeCount, total);
  }
  const peekIndex = getPeekTileIndex(artId, total);
  for (let index = 0; index < total; index += 1) {
    const tile = document.createElement("span");
    const col = index % columns;
    const row = Math.floor(index / columns);
    const revealed = index < completeCount;
    const peek = !revealed && index === peekIndex;
    tile.className = revealed ? "pip-tile revealed" : peek ? "pip-tile peek" : "pip-tile";
    tile.style.backgroundImage = `url("${artUrl}")`;
    tile.style.backgroundSize = `${columns * 100}% ${rows * 100}%`;
    tile.style.backgroundPosition = `${columns === 1 ? 50 : (col / (columns - 1)) * 100}% ${rows === 1 ? 50 : (row / (rows - 1)) * 100}%`;
    mosaic.appendChild(tile);
  }
  return mosaic;
}

function createStageFallbackMosaic(completeCount, total) {
  const mosaic = document.createElement("div");
  mosaic.className = "pip-tile-mosaic stage-tile-mosaic stage-tile-mosaic--fallback";
  const safeTotal = Math.max(1, total || 20);
  const safeComplete = Math.min(Math.max(0, completeCount || 0), safeTotal);
  const peekIndex = Math.min(safeTotal - 1, Math.max(safeComplete, Math.floor(safeTotal / 2)));
  for (let index = 0; index < safeTotal; index += 1) {
    const tile = document.createElement("span");
    const revealed = index < safeComplete;
    const peek = !revealed && index === peekIndex;
    tile.className = revealed ? "pip-tile revealed" : peek ? "pip-tile peek" : "pip-tile";
    mosaic.appendChild(tile);
  }
  return mosaic;
}

function getPeekTileIndex(packId, total) {
  const preferred = {
    "starter-pantry": 7,
    "sunny-spoon-sign": 8,
    "apron-drawer": 12,
    "bakery-window": 13,
    "village-pantry": 16
  };
  return Math.min(Math.max(preferred[packId] ?? Math.floor(total / 2), 0), Math.max(total - 1, 0));
}

function createStageProgressMeter() {
  const meter = document.createElement("div");
  meter.className = "stage-progress-meter";
  meter.setAttribute("aria-hidden", "true");
  meter.appendChild(createMeterFill());
  return meter;
}

function createUnlockPanel(shelf, onUnlockShelf, onOpenPantry) {
  const panel = document.createElement("div");
  panel.className = "unlock-panel";
  const canOpen = canUnlockShelf(shelf);
  const roomRequirement = getShelfPantryRoomRequirement(shelf);
  const spoonGap = Math.max(0, Number(shelf.unlockCost || 0) - getPantrySpoons());
  const disabledText = roomRequirement.met
    ? t("packs.needMore", { count: spoonGap })
    : t("packs.needPantryRoom");
  const requirements = document.createElement("div");
  requirements.className = "unlock-panel__requirements";
  const copy = document.createElement("p");
  copy.className = "unlock-panel__cost";
  copy.append(createSpoonIcon("small"), document.createTextNode(String(shelf.unlockCost)));
  requirements.appendChild(copy);
  if (roomRequirement.required > 0) {
    appendTextElement(requirements, "p", "unlock-panel__room", t("packs.roomRequirement", roomRequirement));
    appendTextElement(requirements, "p", "unlock-panel__hint", t("packs.roomRequirementHint"));
  }

  const actions = document.createElement("div");
  actions.className = "unlock-panel__actions";
  const unlockButton = document.createElement("button");
  unlockButton.type = "button";
  unlockButton.className = "tool-button";
  unlockButton.disabled = !canOpen;
  unlockButton.textContent = canOpen ? t("packs.openStage") : disabledText;
  unlockButton.addEventListener("click", () => onUnlockShelf(shelf.id));
  actions.appendChild(unlockButton);
  if (!roomRequirement.met) {
    const pantryButton = document.createElement("button");
    pantryButton.type = "button";
    pantryButton.className = "stage-gate-link";
    pantryButton.textContent = t("packs.visitPantry");
    pantryButton.addEventListener("click", onOpenPantry);
    actions.appendChild(pantryButton);
  }
  panel.append(requirements, actions);
  return panel;
}

function createSpoonIcon(size = "") {
  const icon = document.createElement("img");
  icon.className = size ? `spoon-icon ${size}` : "spoon-icon";
  icon.src = spoonTokenUrl;
  icon.alt = "";
  icon.setAttribute("aria-hidden", "true");
  return icon;
}

function getPuzzleChipClass(puzzle, activePuzzleId, unlocked, complete) {
  const classes = ["puzzle-chip"];
  if (puzzle.id === activePuzzleId) {
    classes.push("active");
  }
  if (!unlocked) {
    classes.push("locked");
  }
  if (complete) {
    classes.push("complete");
  }
  return classes.join(" ");
}
