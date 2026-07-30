import spoonTokenUrl from "../assets/icons/spoon-token-v2.png";
import puzzleWorkshopBackgroundUrl from "../assets/generated/pip-puzzle-workshop-v1.webp";
import pipGuideUrl from "../assets/characters/pip-chrome-v2.png";
import { getSeasonShelfForPuzzle, getSeasonShelfPuzzles, seasonShelves } from "../data/seasonShelves.js";
import { PANTRY_JARS } from "../data/pantryJars.js";
import { ECONOMY } from "../data/economyConfig.js";
import { canUnlockShelf, getCompletedPuzzleIds, getOwnedJarIds, getPantrySpoons, getReplayDailyCount, getShelfPantryRoomRequirement, isShelfUnlocked } from "../game/save.js";
import { puzzleTitle, t } from "../i18n/index.js";
import { getQuickTravelArt } from "../data/quickTravelArt.js";
import { getPuzzleControlArt } from "../data/puzzleControlArt.js";
import { getPreviousSeasonShelf, isSeasonShelfComplete } from "../game/seasonShelfProgress.js";

function appendTextElement(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  element.textContent = text;
  parent.appendChild(element);
  return element;
}

const DAILY_GREETING_KEYS = [
  "home.greetingMessages.0",
  "home.greetingMessages.1",
  "home.greetingMessages.2",
  "home.greetingMessages.3",
  "home.greetingMessages.4",
  "home.greetingMessages.5",
  "home.greetingMessages.6"
];

export function getDailyGreetingKey(now = new Date()) {
  const dayNumber = Math.floor(Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ) / 86400000);
  return DAILY_GREETING_KEYS[dayNumber % DAILY_GREETING_KEYS.length];
}

export function hasAffordableUnownedPantryJar(jars, ownedJarIds, spoons) {
  const owned = ownedJarIds instanceof Set ? ownedJarIds : new Set(ownedJarIds || []);
  const balance = Math.max(0, Number(spoons) || 0);
  return jars.some((jar) => (
    !owned.has(jar.id)
    && Number(jar.cost) > 0
    && Number(jar.cost) <= balance
  ));
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

  const greetingWrap = document.createElement("div");
  greetingWrap.className = "puzzle-home-scene__greeting-wrap hub-greeting-wrap";
  const greetingPip = document.createElement("img");
  greetingPip.className = "puzzle-home-scene__greeting-pip hub-greeting-pip";
  greetingPip.src = pipGuideUrl;
  greetingPip.alt = "";
  greetingPip.setAttribute("aria-hidden", "true");
  greetingPip.dataset.assetId = "pip-chrome-v2";
  const greeting = appendTextElement(
    greetingWrap,
    "p",
    "puzzle-home-scene__greeting hub-greeting-bubble",
    t(getDailyGreetingKey())
  );
  greeting.setAttribute("aria-live", "polite");
  greetingWrap.append(greetingPip, greeting);
  scene.appendChild(greetingWrap);

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
    ["album", "home.albumLabel", () => onSelectView("album")],
    ["pantry", "home.pantryLabel", () => onSelectView("pantry")],
    ["spoonRun", "views.spoonRun", () => onSelectView("spoonRun")],
    ["map", "home.mapLabel", () => onSelectView("map")]
  ];
  const completedIds = new Set(getCompletedPuzzleIds());
  const activeShelf = getSeasonShelfForPuzzle(activePuzzle);
  const activeShelfPuzzles = activeShelf ? getSeasonShelfPuzzles(activeShelf) : [];
  const activeShelfCompletedCount = activeShelfPuzzles.filter((puzzle) => completedIds.has(puzzle.id)).length;
  const ownedJarIds = new Set(getOwnedJarIds());
  const pantrySpoons = getPantrySpoons();
  const hasNewPantryItem = hasAffordableUnownedPantryJar(PANTRY_JARS, ownedJarIds, pantrySpoons);
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
    appendTextElement(button, "span", "puzzle-home-destination__label", t(labelKey));
    if (artId === "puzzle") {
      appendTextElement(
        button,
        "span",
        "puzzle-home-destination__badge",
        `${activeShelfCompletedCount}/${activeShelfPuzzles.length}`
      );
    } else if (artId === "pantry" && hasNewPantryItem) {
      const badge = appendTextElement(button, "span", "puzzle-home-destination__badge puzzle-home-destination__badge--new", "");
      badge.setAttribute("aria-label", t("home.new"));
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
  currency.setAttribute("aria-label", t("currency.spoons", { count: pantrySpoons }));
  const spoon = document.createElement("img");
  spoon.src = spoonTokenUrl;
  spoon.alt = "";
  spoon.setAttribute("aria-hidden", "true");
  spoon.dataset.assetId = "spoon-token-v2";
  currency.append(spoon, document.createTextNode(String(pantrySpoons)));

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

export function isDailyCompleteForDate(completedDate, today) {
  return Boolean(completedDate && today && completedDate === today);
}

export function renderDailyCard(dailyPuzzle, activePuzzleId, onSelectPuzzle, options = {}) {
  const completed = isDailyCompleteForDate(options.completedDate, options.today);
  const selected = dailyPuzzle.id === activePuzzleId;
  const card = document.createElement("section");
  card.className = "daily-card" + (selected ? " active" : "") + (completed ? " completed" : "");

  const text = document.createElement("div");
  appendTextElement(text, "p", "section-label", t("daily.eyebrow"));
  appendTextElement(text, "h2", "", puzzleTitle(dailyPuzzle));

  const button = document.createElement("button");
  button.type = "button";
  button.className = "tool-button daily-button";
  button.textContent = completed ? t("daily.completed") : selected ? t("daily.selected") : t("daily.play");
  button.disabled = completed || selected;
  if (!completed && !selected) {
    button.addEventListener("click", () => onSelectPuzzle(dailyPuzzle.id));
  }

  card.append(text, button);
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

export function renderSpoonRunView({
  dailyPuzzle,
  activePuzzleId,
  replayPicks,
  completedDate,
  today,
  dailyCount,
  dailyLimit,
  onSelectDaily = () => {},
  onSelectReplay = () => {}
}) {
  const view = document.createElement("section");
  view.className = "spoon-run-view content-panel";

  const header = document.createElement("header");
  header.className = "spoon-run-view__header";
  const icon = document.createElement("img");
  icon.src = spoonTokenUrl;
  icon.alt = "";
  icon.setAttribute("aria-hidden", "true");
  icon.dataset.assetId = "spoon-token-v2";
  const copy = document.createElement("div");
  appendTextElement(copy, "p", "section-label", t("spoonRun.eyebrow"));
  appendTextElement(copy, "h1", "", t("views.spoonRun"));
  appendTextElement(copy, "p", "spoon-run-view__intro", t("spoonRun.intro"));
  header.append(icon, copy);

  const cards = document.createElement("div");
  cards.className = "spoon-run-view__cards";
  cards.appendChild(renderDailyCard(
    dailyPuzzle,
    activePuzzleId,
    onSelectDaily,
    { completedDate, today }
  ));
  const replayCard = renderReplayPicksCard(
    replayPicks,
    activePuzzleId,
    onSelectReplay,
    { dailyCount, dailyLimit, onReplayPick: onSelectReplay }
  );
  if (replayCard) {
    cards.appendChild(replayCard);
  }

  view.append(header, cards);
  return view;
}
export function getShelfCollapsedState(shelfId, isComplete, collapseOverrides = new Map()) {
  if (collapseOverrides instanceof Map && collapseOverrides.has(shelfId)) {
    return Boolean(collapseOverrides.get(shelfId));
  }
  return Boolean(isComplete);
}

export function renderPuzzlePicker(activePuzzleId, onSelectPuzzle, onUnlockShelf, options = {}) {
  const {
    shelfCollapseOverrides = new Map(),
    onToggleShelfCollapsed = () => {},
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

  seasonShelves.forEach((shelf) => {
    const shelfPuzzles = getSeasonShelfPuzzles(shelf);
    const completeCount = shelfPuzzles.filter((puzzle) => completedPuzzleIdSet.has(puzzle.id)).length;
    const unlocked = isShelfUnlocked(shelf);
    const isStageComplete = shelfPuzzles.length > 0 && completeCount >= shelfPuzzles.length;
    if (!unlocked) {
      const previousShelf = getPreviousSeasonShelf(shelf);
      const previousComplete = Boolean(previousShelf)
        && getSeasonShelfPuzzles(previousShelf).every((puzzle) => completedPuzzleIdSet.has(puzzle.id));
      if (!previousComplete) return;

      const lockedBlock = document.createElement("article");
      lockedBlock.className = "pack-block pack-block--locked";
      lockedBlock.dataset.shelfId = shelf.id;
      lockedBlock.dataset.locked = "true";
      const lockedHeader = document.createElement("div");
      lockedHeader.className = "pack-header";
      appendTextElement(lockedHeader, "p", "section-label", t(shelf.titleKey));
      lockedBlock.append(lockedHeader, createUnlockPanel(shelf, onUnlockShelf, onOpenPantry));
      section.appendChild(lockedBlock);
      return;
    }

    const collapsed = getShelfCollapsedState(shelf.id, isStageComplete, shelfCollapseOverrides);
    const packBlock = document.createElement("article");
    packBlock.className = collapsed ? "pack-block pack-block--collapsed" : "pack-block";
    packBlock.dataset.shelfId = shelf.id;
    packBlock.dataset.collapsed = String(collapsed);
    if (shelfPuzzles.some((puzzle) => puzzle.id === activePuzzleId)) packBlock.dataset.activeStage = "true";

    const contentId = `shelf-content-${shelf.id}`;
    const header = document.createElement("div");
    header.className = "pack-header";
    const headerCopy = document.createElement("div");
    appendTextElement(headerCopy, "p", "section-label", t(shelf.titleKey));
    header.append(headerCopy, createShelfCollapseToggle(shelf, collapsed, contentId, onToggleShelfCollapsed));
    packBlock.appendChild(header);

    const content = document.createElement("div");
    content.id = contentId;
    content.className = "pack-block__content";
    content.hidden = collapsed;
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
      meta.textContent = complete ? t("puzzlePicker.complete") : t("puzzlePicker.size", { size: puzzle.size });
      button.appendChild(meta);
      button.setAttribute("aria-label", `${puzzleTitle(puzzle)} - ${meta.textContent}`);
      button.addEventListener("click", () => onSelectPuzzle(puzzle.id));
      list.appendChild(button);
    });
    content.appendChild(list);
    packBlock.appendChild(content);
    section.appendChild(packBlock);
  });
  return section;
}

function createShelfCollapseToggle(shelf, collapsed, contentId, onToggleShelfCollapsed) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "shelf-collapse-toggle";
  button.dataset.shelfToggle = shelf.id;
  button.setAttribute("aria-controls", contentId);
  button.setAttribute("aria-expanded", String(!collapsed));
  button.setAttribute("aria-label", t(collapsed ? "puzzlePicker.expandShelf" : "puzzlePicker.collapseShelf", { title: t(shelf.titleKey) }));
  button.textContent = collapsed ? "▼" : "▲";
  button.addEventListener("click", () => onToggleShelfCollapsed(shelf.id, !collapsed));
  return button;
}
export function getShelfLockConditions(shelf, completedPuzzleIds = getCompletedPuzzleIds()) {
  const completed = new Set(completedPuzzleIds || []);
  const previousShelf = getPreviousSeasonShelf(shelf);
  const previousPuzzles = previousShelf ? getSeasonShelfPuzzles(previousShelf) : [];
  const puzzleRemaining = previousPuzzles.filter((puzzle) => !completed.has(puzzle.id)).length;
  const roomRequirement = getShelfPantryRoomRequirement(shelf);
  return {
    puzzle: {
      met: Boolean(previousShelf) && isSeasonShelfComplete(previousShelf, [...completed]),
      remaining: puzzleRemaining
    },
    pantry: {
      met: roomRequirement.met,
      remaining: roomRequirement.remaining
    },
    roomRequirement
  };
}

function appendLockCondition(parent, type, condition) {
  const key = condition.met
    ? `shelves.lockCondition${type}Done`
    : `shelves.lockCondition${type}`;
  const text = t(key, { count: condition.remaining });
  const row = appendTextElement(
    parent,
    "p",
    `unlock-panel__condition ${condition.met ? "is-met" : "is-unmet"}`,
    condition.met ? text : `✗ ${text}`
  );
  row.dataset.condition = type.toLowerCase();
  return row;
}

function createUnlockPanel(shelf, onUnlockShelf, onOpenPantry) {
  const panel = document.createElement("div");
  panel.className = "unlock-panel";
  const canOpen = canUnlockShelf(shelf);
  const lockConditions = getShelfLockConditions(shelf);
  const roomRequirement = lockConditions.roomRequirement;
  const spoonGap = Math.max(0, Number(shelf.unlockCost || 0) - getPantrySpoons());
  const disabledText = !lockConditions.puzzle.met
    ? t("packs.locked")
    : !roomRequirement.met
      ? t("packs.needPantryRoom")
      : t("packs.needMore", { count: spoonGap });
  const requirements = document.createElement("div");
  requirements.className = "unlock-panel__requirements";
  const copy = document.createElement("p");
  copy.className = "unlock-panel__cost";
  copy.append(createSpoonIcon("small"), document.createTextNode(String(shelf.unlockCost)));
  requirements.appendChild(copy);
  appendLockCondition(requirements, "Puzzle", lockConditions.puzzle);
  appendLockCondition(requirements, "Pantry", lockConditions.pantry);

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
