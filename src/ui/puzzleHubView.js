import spoonTokenUrl from "../assets/icons/spoon-token-v2.png";
import puzzleWorkshopBackgroundUrl from "../assets/generated/pip-puzzle-workshop-summer-v1.webp";
import pipGuideUrl from "../assets/characters/pip-chrome-v2.png";
import pipSummerHomeUrl from "../assets/characters/pip-home-summer-v1.webp";
import { getSeasonShelfForPuzzle, getSeasonShelfPuzzles, getSeasonShelfSizeCounts, seasonShelves } from "../data/seasonShelves.js";
import { puzzles } from "../data/puzzles.js";
import { PANTRY_JARS, getJarById } from "../data/pantryJars.js";
import { getPaidJarProgressForPantryShelf, getPantryShelfForSeasonShelf } from "../data/stagePantryLinks.js";
import { ECONOMY } from "../data/economyConfig.js";
import { getCompletedPuzzleIds, getFeaturedBadgeId, getFeaturedJarId, getOwnedJarIds, getPaidJarCount, getPantryGrowthBonusStatus, getReplayDailyCount, getShelfPantryRoomRequirement, isShelfUnlocked } from "../game/save.js";
import { puzzleTitle, t } from "../i18n/index.js";
import { getQuickTravelArt } from "../data/quickTravelArt.js";
import { getPuzzleControlArt } from "../data/puzzleControlArt.js";
import { getPreviousSeasonShelf, isSeasonShelfComplete } from "../game/seasonShelfProgress.js";
import { renderColoredPuzzleArt } from "./coloredPuzzleArt.js";
import { getJarArtUrl } from "../data/jarArt.js";
import { getBadgeArtUrl } from "../data/badgeArt.js";
import { BADGE_MILESTONES, getPackBadgeStatus } from "../game/badges.js";

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

export function getBadgeHomeProgress(completedPuzzleIds = getCompletedPuzzleIds()) {
  return {
    current: getPackBadgeStatus(completedPuzzleIds).filter((status) => status.earned).length,
    total: BADGE_MILESTONES.length
  };
}

export function getPantryHomeProgress(jars = PANTRY_JARS, paidJarCount = getPaidJarCount()) {
  const total = jars.filter((jar) => Number(jar.cost) > 0).length;
  return {
    current: Math.min(total, Math.max(0, Number(paidJarCount) || 0)),
    total
  };
}

export function getPuzzleHubOpenDecision(
  activePuzzle,
  completedPuzzleIds = getCompletedPuzzleIds(),
  shelfUnlocked = isShelfUnlocked
) {
  const completed = completedPuzzleIds instanceof Set
    ? completedPuzzleIds
    : new Set(completedPuzzleIds || []);
  const currentShelf = getSeasonShelfForPuzzle(activePuzzle);
  if (!currentShelf || !isSeasonShelfComplete(currentShelf, completed)) {
    return { type: "open", puzzle: activePuzzle };
  }

  const nextShelf = seasonShelves[currentShelf.index + 1] || null;
  if (!nextShelf) {
    return { type: "open", puzzle: activePuzzle };
  }
  if (!shelfUnlocked(nextShelf)) {
    return { type: "unlock-guide", currentShelf, nextShelf };
  }

  const nextShelfPuzzles = getSeasonShelfPuzzles(nextShelf);
  const nextPuzzle = nextShelfPuzzles.find((puzzle) => !completed.has(puzzle.id))
    || nextShelfPuzzles[0]
    || activePuzzle;
  return { type: "open", puzzle: nextPuzzle };
}

export function renderPuzzleHub(activePuzzle, options = {}) {
  const {
    onOpenPuzzle = () => {},
    onShowList = () => {},
    onSelectView = () => {},
    onOpenSettings = () => {},
    spoonRunOpportunity = { total: 0 },
    greetingMessage = null,
    greetingAction = null
  } = typeof options === "function" ? { onOpenPuzzle: options } : options;
  const stack = document.createElement("div");
  stack.className = "puzzle-hub-stack puzzle-home";

  const scene = document.createElement("section");
  scene.className = "puzzle-home-scene";
  scene.dataset.eventTheme = "summer";
  scene.style.setProperty("--puzzle-home-background", `url("${puzzleWorkshopBackgroundUrl}")`);
  scene.setAttribute("aria-label", t("home.sceneAria"));

  const viewTitle = appendTextElement(scene, "h1", "puzzle-home-scene__title", t("views.puzzle"));
  viewTitle.setAttribute("aria-label", t("views.puzzle"));

  const greetingWrap = document.createElement("div");
  greetingWrap.className = "puzzle-home-scene__greeting-wrap hub-greeting-wrap";
  const eventRibbon = appendTextElement(
    greetingWrap,
    "span",
    "puzzle-home-scene__event-ribbon",
    t("home.summerEventWeek")
  );
  eventRibbon.setAttribute("aria-label", t("home.summerEventWeek"));
  const greetingPip = document.createElement("img");
  greetingPip.className = "puzzle-home-scene__greeting-pip hub-greeting-pip";
  greetingPip.src = pipSummerHomeUrl;
  greetingPip.alt = "";
  greetingPip.setAttribute("aria-hidden", "true");
  greetingPip.dataset.assetId = "pip-home-summer-v1";
  const greeting = appendTextElement(
    greetingWrap,
    "p",
    "puzzle-home-scene__greeting hub-greeting-bubble",
    greetingMessage || t(getDailyGreetingKey())
  );
  greeting.setAttribute("aria-live", "polite");
  if (greetingAction) {
    greeting.classList.add("hub-greeting-bubble--update");
    const actions = document.createElement("span");
    actions.className = "hub-greeting-bubble__actions";
    const update = document.createElement("button");
    update.type = "button";
    update.className = "hub-greeting-bubble__update";
    update.textContent = greetingAction.updateLabel;
    update.addEventListener("click", greetingAction.onUpdate);
    const later = document.createElement("button");
    later.type = "button";
    later.className = "hub-greeting-bubble__later";
    later.textContent = greetingAction.laterLabel;
    later.addEventListener("click", greetingAction.onLater);
    actions.append(update, later);
    greeting.appendChild(actions);
  }
  greetingWrap.append(greetingPip, greeting);
  scene.appendChild(greetingWrap);

  const activeShelf = getSeasonShelfForPuzzle(activePuzzle);
  const featuredJarId = getFeaturedJarId();
  const featuredJar = featuredJarId && getOwnedJarIds().includes(featuredJarId)
    ? getJarById(featuredJarId)
    : null;

  const featuredBadgeId = getFeaturedBadgeId();
  const featuredBadgeStatus = featuredBadgeId
    ? getPackBadgeStatus(getCompletedPuzzleIds()).find(
      (status) => status.earned && status.badge.id === featuredBadgeId
    )
    : null;

  if (featuredJar || featuredBadgeStatus) {
    const keepsakeShelf = document.createElement("div");
    keepsakeShelf.className = "home-keepsake-shelf";
    keepsakeShelf.setAttribute("aria-label", t("home.keepsakeShelfAria"));

    if (featuredJar) {
      const jarButton = document.createElement("button");
      jarButton.type = "button";
      jarButton.className = "home-keepsake-shelf__item home-keepsake-shelf__jar puzzle-home-scene__featured-jar";
      jarButton.dataset.jarId = featuredJar.id;
      jarButton.setAttribute("aria-label", t("pantry.jar.featuredAria", { item: t(featuredJar.nameKey) }));
      const jarImage = document.createElement("img");
      jarImage.className = "home-keepsake-jar";
      jarImage.src = getJarArtUrl(featuredJar.id);
      jarImage.alt = "";
      jarImage.setAttribute("aria-hidden", "true");
      jarImage.dataset.assetId = `jar-${featuredJar.id}-v1`;
      jarButton.appendChild(jarImage);
      const growthBonus = getPantryGrowthBonusStatus();
      if (growthBonus.chance > 0) {
        const bonusBadge = document.createElement("span");
        bonusBadge.className = "home-keepsake-shelf__bonus";
        bonusBadge.textContent = t("pantry.jar.growthBadgeCompact", {
          chance: growthBonus.chance
        });
        bonusBadge.setAttribute("aria-label", t("pantry.jar.growthBadgeAria", {
          chance: growthBonus.chance
        }));
        jarButton.appendChild(bonusBadge);
      }
      jarButton.addEventListener("click", () => onSelectView("pantry"));
      keepsakeShelf.appendChild(jarButton);
    }

    if (featuredBadgeStatus) {
      const featuredBadge = document.createElement("button");
      featuredBadge.type = "button";
      featuredBadge.className = "home-keepsake-shelf__item home-keepsake-shelf__badge puzzle-home-scene__featured-badge";
      featuredBadge.setAttribute("aria-label", t("badges.featuredAria", {
        title: t(featuredBadgeStatus.badge.titleKey)
      }));
      const badgeImage = document.createElement("img");
      badgeImage.src = getBadgeArtUrl(featuredBadgeStatus.badge.id);
      badgeImage.alt = "";
      badgeImage.setAttribute("aria-hidden", "true");
      featuredBadge.appendChild(badgeImage);
      featuredBadge.addEventListener("click", () => onSelectView("map"));
      keepsakeShelf.appendChild(featuredBadge);
    }

    scene.appendChild(keepsakeShelf);
  }

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
    ["timeAttack", "views.timeAttack", () => onSelectView("timeAttack")],
    ["map", "home.mapLabel", () => onSelectView("map")]
  ];
  const completedIds = new Set(getCompletedPuzzleIds());
  const activeShelfPuzzles = activeShelf ? getSeasonShelfPuzzles(activeShelf) : [];
  const activeShelfCompletedCount = activeShelfPuzzles.filter((puzzle) => completedIds.has(puzzle.id)).length;
  const badgeProgress = getBadgeHomeProgress(completedIds);
  const pantryProgress = getPantryHomeProgress();
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
    let collectionProgress = null;
    if (artId === "puzzle") {
      collectionProgress = {
        current: activeShelfCompletedCount,
        total: activeShelfPuzzles.length
      };
      appendTextElement(
        button,
        "span",
        "puzzle-home-destination__badge",
        `${collectionProgress.current}/${collectionProgress.total}`
      );
    } else if (artId === "album") {
      collectionProgress = {
        current: completedIds.size,
        total: puzzles.length
      };
      appendTextElement(
        button,
        "span",
        "puzzle-home-destination__badge",
        `${collectionProgress.current}/${collectionProgress.total}`
      );
    } else if (artId === "pantry") {
      collectionProgress = pantryProgress;
      appendTextElement(
        button,
        "span",
        "puzzle-home-destination__badge",
        `${collectionProgress.current}/${collectionProgress.total}`
      );
    } else if (artId === "spoonRun") {
      const badge = appendTextElement(
        button,
        "span",
        "puzzle-home-destination__badge puzzle-home-destination__badge--spoon-run",
        `+${Math.max(0, Number(spoonRunOpportunity?.total) || 0)}`
      );
      badge.setAttribute("aria-label", t("spoonRun.homeOpportunity", {
        count: Math.max(0, Number(spoonRunOpportunity?.total) || 0)
      }));
    } else if (artId === "map") {
      collectionProgress = badgeProgress;
      appendTextElement(
        button,
        "span",
        "puzzle-home-destination__badge",
        `${collectionProgress.current}/${collectionProgress.total}`
      );
    }
    button.setAttribute("aria-label", artId === "spoonRun"
      ? `${t(labelKey)}. ${t("spoonRun.homeOpportunity", {
        count: Math.max(0, Number(spoonRunOpportunity?.total) || 0)
      })}`
      : collectionProgress
        ? `${t(labelKey)}. ${t("home.collectionProgress", collectionProgress)}`
        : t(labelKey));
    button.title = t(labelKey);
    button.addEventListener("click", onClick);
    destinations.appendChild(button);
  });

  const sceneControls = document.createElement("div");
  sceneControls.className = "puzzle-home-scene__controls";

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

  sceneControls.append(settingsButton);
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

  const glow = document.createElement("div");
  glow.className = "daily-card__sun";
  glow.setAttribute("aria-hidden", "true");
  const token = document.createElement("img");
  token.src = spoonTokenUrl;
  token.alt = "";
  token.dataset.assetId = "spoon-token-v2";
  glow.appendChild(token);

  const text = document.createElement("div");
  text.className = "daily-card__copy";
  appendTextElement(text, "p", "section-label", t("daily.eyebrow"));
  appendTextElement(text, "h2", "", puzzleTitle(dailyPuzzle));
  appendTextElement(text, "p", "daily-card__reward", completed
    ? t("spoonRun.collected")
    : t("spoonRun.dailyReward", { count: Math.max(0, Number(options.reward) || 0) }));

  const button = document.createElement("button");
  button.type = "button";
  button.className = "tool-button daily-button";
  button.textContent = completed ? t("daily.completed") : selected ? t("daily.selected") : t("daily.play");
  button.disabled = completed || selected;
  if (!completed && !selected) {
    button.addEventListener("click", () => onSelectPuzzle(dailyPuzzle.id));
  }

  card.append(glow, text, button);
  return card;
}

export function renderReplayPicksCard(replayPicks, activePuzzleId, onSelectPuzzle, options = {}) {
  const picks = Array.isArray(replayPicks) ? replayPicks : [];
  const {
    dailyCount = getReplayDailyCount(),
    dailyLimit = ECONOMY.REPLAY_PICK_DAILY_LIMIT,
    reward = 0,
    onReplayPick = onSelectPuzzle
  } = options;
  const card = document.createElement("section");
  card.className = "replay-picks-card" + (picks.length ? "" : " replay-picks-card--empty");

  const header = document.createElement("div");
  header.className = "replay-picks-card__header";
  const headerCopy = document.createElement("div");
  appendTextElement(headerCopy, "h2", "", t("replayPicks.title"));
  appendTextElement(headerCopy, "p", "replay-picks-card__reward", t("spoonRun.replayReward", {
    count: Math.max(0, Number(reward) || 0)
  }));
  const count = document.createElement("span");
  count.textContent = t("replayPicks.count", { count: dailyCount, limit: dailyLimit });
  header.append(headerCopy, count);

  const list = document.createElement("div");
  list.className = "replay-picks-list";
  picks.forEach((puzzle, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = puzzle.id === activePuzzleId ? "replay-pick-button active" : "replay-pick-button";
    button.dataset.puzzleId = puzzle.id;
    appendTextElement(button, "span", "replay-pick-button__number", String(index + 1));
    appendTextElement(button, "span", "replay-pick-button__title", puzzleTitle(puzzle));
    appendTextElement(button, "span", "replay-pick-button__spoon", `+${ECONOMY.REPLAY_PICK_REWARD}`);
    button.addEventListener("click", () => onReplayPick(puzzle.id));
    list.appendChild(button);
  });

  if (!picks.length) {
    const empty = document.createElement("div");
    empty.className = "replay-picks-card__empty";
    const emptyPip = document.createElement("img");
    emptyPip.src = pipGuideUrl;
    emptyPip.alt = "";
    emptyPip.setAttribute("aria-hidden", "true");
    emptyPip.dataset.assetId = "pip-chrome-v2";
    appendTextElement(empty, "p", "", t("spoonRun.replayEmpty"));
    empty.prepend(emptyPip);
    list.appendChild(empty);
  }

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
  opportunity = { dailyReward: 0, replayReward: 0, total: 0 },
  onSelectDaily = () => {},
  onSelectReplay = () => {}
}) {
  const view = document.createElement("section");
  view.className = "spoon-run-view content-panel";

  const header = document.createElement("header");
  header.className = "spoon-run-view__header spoon-run-scene";
  const pip = document.createElement("img");
  pip.className = "spoon-run-scene__pip";
  pip.src = pipGuideUrl;
  pip.alt = "";
  pip.setAttribute("aria-hidden", "true");
  pip.dataset.assetId = "pip-chrome-v2";
  const icon = document.createElement("img");
  icon.className = "spoon-run-scene__token";
  icon.src = spoonTokenUrl;
  icon.alt = "";
  icon.setAttribute("aria-hidden", "true");
  icon.dataset.assetId = "spoon-token-v2";
  const copy = document.createElement("div");
  copy.className = "spoon-run-scene__copy";
  appendTextElement(copy, "p", "section-label", t("spoonRun.eyebrow"));
  appendTextElement(copy, "h1", "", t("views.spoonRun"));
  const opportunityBubble = document.createElement("div");
  opportunityBubble.className = "spoon-run-scene__opportunity";
  appendTextElement(opportunityBubble, "strong", "", `+${Math.max(0, Number(opportunity.total) || 0)}`);
  appendTextElement(opportunityBubble, "span", "", t("spoonRun.availableToday"));
  opportunityBubble.appendChild(icon);
  const intro = appendTextElement(header, "p", "spoon-run-view__intro", t("spoonRun.intro"));
  header.append(pip, copy, opportunityBubble);
  header.appendChild(intro);

  const cards = document.createElement("div");
  cards.className = "spoon-run-view__cards";
  cards.appendChild(renderDailyCard(
    dailyPuzzle,
    activePuzzleId,
    onSelectDaily,
    { completedDate, today, reward: opportunity.dailyReward }
  ));
  const replayCard = renderReplayPicksCard(
    replayPicks,
    activePuzzleId,
    onSelectReplay,
    { dailyCount, dailyLimit, reward: opportunity.replayReward, onReplayPick: onSelectReplay }
  );
  cards.appendChild(replayCard);

  view.append(header, cards);
  return view;
}
export function getShelfCollapsedState(shelfId, isComplete, collapseOverrides = new Map()) {
  if (collapseOverrides instanceof Map && collapseOverrides.has(shelfId)) {
    return Boolean(collapseOverrides.get(shelfId));
  }
  return Boolean(isComplete);
}

export function getShelfTeaserKey(shelf) {
  return `${shelf?.titleKey || ""}Teaser`;
}

export function formatShelfPuzzleSummary(shelf) {
  return Object.entries(getSeasonShelfSizeCounts(shelf))
    .map(([size, count]) => t("puzzlePicker.sizeCount", { size, count }))
    .join(" · ");
}

export function renderPuzzlePicker(activePuzzleId, onSelectPuzzle, options = {}) {
  const {
    shelfCollapseOverrides = new Map(),
    onToggleShelfCollapsed = () => {},
    onOpenPantry = () => {}
  } = options;
  const completedPuzzleIds = getCompletedPuzzleIds();
  const completedPuzzleIdSet = new Set(completedPuzzleIds);
  const section = document.createElement("section");
  section.className = "puzzle-picker content-panel";
  section.dataset.eventTheme = "summer";
  seasonShelves.forEach((shelf) => {
    const shelfPuzzles = getSeasonShelfPuzzles(shelf);
    const completeCount = shelfPuzzles.filter((puzzle) => completedPuzzleIdSet.has(puzzle.id)).length;
    const unlocked = isShelfUnlocked(shelf);
    const isStageComplete = shelfPuzzles.length > 0 && completeCount >= shelfPuzzles.length;
    if (!unlocked) {
      const lockedBlock = document.createElement("article");
      lockedBlock.className = "pack-block pack-block--locked";
      lockedBlock.dataset.shelfId = shelf.id;
      lockedBlock.dataset.locked = "true";
      if (shelf.artPackId === "summer-pantry") lockedBlock.dataset.eventTheme = "summer";
      const lockedHeader = document.createElement("div");
      lockedHeader.className = "pack-header";
      appendTextElement(lockedHeader, "p", "section-label", `🔒 ${t(shelf.titleKey)}`);
      const preview = document.createElement("div");
      preview.className = "locked-stage-preview";
      shelfPuzzles.slice(0, 3).forEach((puzzle) => {
        preview.appendChild(renderColoredPuzzleArt(puzzle, { className: "locked-stage-preview__art" }));
      });
      appendTextElement(lockedBlock, "p", "locked-stage-summary", formatShelfPuzzleSummary(shelf));
      appendTextElement(lockedBlock, "p", "locked-stage-teaser", t(getShelfTeaserKey(shelf)));
      lockedBlock.append(lockedHeader, preview, createUnlockPanel(shelf, onOpenPantry));
      section.appendChild(lockedBlock);
      return;
    }

    const collapsed = getShelfCollapsedState(shelf.id, isStageComplete, shelfCollapseOverrides);
    const packBlock = document.createElement("article");
    packBlock.className = collapsed ? "pack-block pack-block--collapsed" : "pack-block";
    packBlock.dataset.shelfId = shelf.id;
    if (shelf.artPackId === "summer-pantry") packBlock.dataset.eventTheme = "summer";
    packBlock.dataset.collapsed = String(collapsed);
    if (shelfPuzzles.some((puzzle) => puzzle.id === activePuzzleId)) packBlock.dataset.activeStage = "true";

    const contentId = `shelf-content-${shelf.id}`;
    const header = document.createElement("div");
    header.className = "pack-header";
    const headerCopy = document.createElement("div");
    appendTextElement(headerCopy, "p", "section-label", t(shelf.titleKey));
    if (shelf.artPackId === "summer-pantry") {
      appendTextElement(headerCopy, "span", "pack-event-badge", `☀ ${t("home.summerEventWeek")}`);
    }
    if (isStageComplete) {
      appendTextElement(headerCopy, "span", "pack-stage-complete-badge", `✓ ${t("puzzlePicker.stageComplete")}`);
    }
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
  const pantryShelf = getPantryShelfForSeasonShelf(shelf);
  const pantryShelfProgress = pantryShelf
    ? getPaidJarProgressForPantryShelf(pantryShelf.id, getOwnedJarIds())
    : { current: 0, total: 0, complete: true };
  return {
    puzzle: {
      met: Boolean(previousShelf) && isSeasonShelfComplete(previousShelf, [...completed]),
      remaining: puzzleRemaining
    },
    pantry: {
      met: roomRequirement.met,
      remaining: roomRequirement.remaining,
      shelf: pantryShelf,
      progress: pantryShelfProgress
    },
    roomRequirement
  };
}

function appendLockCondition(parent, type, condition) {
  if (type === "Pantry" && condition.shelf) {
    const row = document.createElement("div");
    row.className = `unlock-panel__condition unlock-panel__condition--pantry ${condition.met ? "is-met" : "is-unmet"}`;
    row.dataset.condition = "pantry";
    appendTextElement(
      row,
      "p",
      "unlock-panel__condition-title",
      `${condition.met ? "✓" : "🏺"} ${t("shelf.requiresPantryShelf", { shelf: t(condition.shelf.nameKey) })}`
    );
    appendTextElement(
      row,
      "p",
      "unlock-panel__condition-progress",
      t("shelf.pantryProgress", {
        current: condition.progress.current,
        total: condition.progress.total
      })
    );
    parent.appendChild(row);
    return row;
  }
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

function createUnlockPanel(shelf, onOpenPantry) {
  const panel = document.createElement("div");
  panel.className = "unlock-panel";
  const lockConditions = getShelfLockConditions(shelf);
  const requirements = document.createElement("div");
  requirements.className = "unlock-panel__requirements";
  appendLockCondition(requirements, "Puzzle", lockConditions.puzzle);
  appendLockCondition(requirements, "Pantry", lockConditions.pantry);

  if (!lockConditions.pantry.met) {
    const actions = document.createElement("div");
    actions.className = "unlock-panel__actions";
    const pantryButton = document.createElement("button");
    pantryButton.type = "button";
    pantryButton.className = "stage-gate-link";
    pantryButton.textContent = t("packs.visitPantry");
    pantryButton.addEventListener("click", onOpenPantry);
    actions.appendChild(pantryButton);
    panel.append(requirements, actions);
    return panel;
  }

  panel.appendChild(requirements);
  return panel;
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
