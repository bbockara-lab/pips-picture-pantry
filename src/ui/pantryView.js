import { JAR_SHELVES, PANTRY_JARS, getJarsByShelf } from "../data/pantryJars.js";
import { getJarArtUrl } from "../data/jarArt.js";
import { getSeasonShelvesForPantryShelf } from "../data/stagePantryLinks.js";
import {
  buyJar,
  ensureStarterJars,
  getPantryGrowthBonusStatus,
  getCompletedPuzzleIds,
  getFeaturedJarId,
  getFeaturedSeasonalRewardId,
  hasSeenGuide,
  getOwnedJarIds,
  getPaidJarCount,
  getPantrySpoons,
  isShelfUnlocked,
  setFeaturedJar,
  setFeaturedSeasonalReward
} from "../game/save.js";
import { t } from "../i18n/index.js";
import { appendSpoonLabel, createSpoonIcon } from "./spoonIcon.js";
import "../styles/pantryJarArt.css";
import "../styles/pantrySpoon.css";
import "../styles/pantryShelfCelebration.css";
import "../styles/koreanHarvestRewards.css";
import { getLiveSeasonalTheme, getSeasonalThemeLabel } from "../data/seasonalThemes.js";
import { renderKoreanHarvestRewardShelf } from "./koreanHarvestRewardShelf.js";

let pendingShelfCelebrationId = null;
const PANTRY_JAR_GUIDE_ID = "pantryJarIntro";

export function shouldShowPantryJarIntro(hasSeen = hasSeenGuide) {
  return !hasSeen(PANTRY_JAR_GUIDE_ID);
}

function appendTextElement(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  parent.appendChild(element);
  return element;
}

export function isPaidShelfComplete(shelfId, ownedIds) {
  const owned = new Set(ownedIds);
  const paidJars = getJarsByShelf(shelfId).filter((jar) => jar.cost > 0);
  return paidJars.length > 0 && paidJars.every((jar) => owned.has(jar.id));
}

export function isShelfCompletionTransition(shelfId, previousOwnedIds, nextOwnedIds) {
  return !isPaidShelfComplete(shelfId, previousOwnedIds)
    && isPaidShelfComplete(shelfId, nextOwnedIds);
}

export function triggerShelfCelebration(shelfSection, bonusMessage = "") {
  if (!shelfSection) return false;
  shelfSection.querySelectorAll(".pantry-sparkle").forEach((sparkle) => sparkle.remove());
  shelfSection.classList.remove("pantry-shelf--celebrating");
  void shelfSection.offsetWidth;
  shelfSection.classList.add("pantry-shelf--celebrating");
  if (bonusMessage) {
    const bonus = appendTextElement(shelfSection, "strong", "pantry-shelf__bonus-celebration", bonusMessage);
    bonus.setAttribute("role", "status");
    globalThis.setTimeout(() => bonus.remove(), 2400);
  }
  for (let index = 0; index < 8; index += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "pantry-sparkle";
    sparkle.setAttribute("aria-hidden", "true");
    sparkle.style.left = (6 + index * 12) + "%";
    sparkle.style.bottom = "8px";
    sparkle.style.animationDelay = (index * 70) + "ms";
    shelfSection.appendChild(sparkle);
    globalThis.setTimeout(() => sparkle.remove(), 1800);
  }
  globalThis.setTimeout(() => shelfSection.classList.remove("pantry-shelf--celebrating"), 2400);
  return true;
}

function renderJarVisual(jar, owned, compact = false) {
  const visual = document.createElement("span");
  visual.className = [
    "pantry-jar__visual",
    compact ? "pantry-jar__visual--compact" : ""
  ].filter(Boolean).join(" ");
  visual.dataset.jarId = jar.id;

  const aura = document.createElement("span");
  aura.className = "pantry-jar__aura";
  const image = document.createElement("img");
  image.className = "pantry-jar__art";
  image.src = getJarArtUrl(jar.id);
  image.alt = "";
  image.loading = "lazy";
  image.decoding = "async";
  if (!owned) image.setAttribute("aria-hidden", "true");

  visual.append(aura, image);
  return visual;
}

function renderJar(jar, ownedIds, onOpen) {
  const owned = ownedIds.includes(jar.id);
  const button = document.createElement("button");
  button.type = "button";
  button.className = [
    "pantry-jar",
    "rarity-" + jar.rarity,
    owned ? "owned" : "unowned"
  ].join(" ");
  button.dataset.jarId = jar.id;
  button.setAttribute("aria-label", t("pantry.jar.openDetail", { item: t(jar.nameKey) }));
  button.appendChild(renderJarVisual(jar, owned));
  appendTextElement(button, "span", "pantry-jar__name", t(jar.nameKey));
  if (!owned) {
    const price = appendTextElement(button, "span", "pantry-jar__price", "");
    appendSpoonLabel(price, t("pantry.jar.spoonCost", { count: jar.cost }), "tiny");
  }
  button.addEventListener("click", () => onOpen(jar));
  return button;
}

function renderShelf(shelf, ownedIds, onOpen) {
  const section = document.createElement("section");
  const shelfJars = getJarsByShelf(shelf.id);
  const ownedCount = shelfJars.filter((jar) => ownedIds.includes(jar.id)).length;
  section.className = "pantry-shelf" + (isPaidShelfComplete(shelf.id, ownedIds) ? " complete" : "");
  section.dataset.shelfId = shelf.id;
  if (["summer-orchard", "sunny-garden", "picnic-table"].includes(shelf.id)) {
    section.dataset.eventTheme = "summer";
  }
  section.style.setProperty("--shelf-progress", String(ownedCount));
  const heading = document.createElement("div");
  heading.className = "pantry-shelf__heading";
  appendTextElement(heading, "h3", "pantry-shelf__title", t(shelf.nameKey));
  appendTextElement(heading, "span", "pantry-shelf__progress", ownedCount + " / " + shelfJars.length);
  section.appendChild(heading);

  const linkedStages = getSeasonShelvesForPantryShelf(shelf.id);
  const linkedStageNames = linkedStages.map((stage) => t(stage.titleKey)).join(" + ");
  const linkedStagesOpen = linkedStages.length > 0 && linkedStages.every(isShelfUnlocked);
  const connection = appendTextElement(
    section,
    "p",
    `pantry-shelf__stage-link ${linkedStagesOpen ? "is-open" : "is-pending"}`,
    t(linkedStagesOpen ? "pantry.shelfStageUnlocked" : "pantry.shelfUnlocksStage", {
      stage: linkedStageNames
    })
  );
  connection.setAttribute("aria-live", "polite");

  const row = document.createElement("div");
  row.className = "pantry-shelf__jars";
  getJarsByShelf(shelf.id).forEach((jar) => {
    row.appendChild(renderJar(jar, ownedIds, onOpen));
  });
  const board = document.createElement("div");
  board.className = "pantry-shelf__board";
  board.setAttribute("aria-hidden", "true");
  section.append(row, board);
  return section;
}

function createDetailPanel() {
  const backdrop = document.createElement("div");
  backdrop.className = "pantry-jar-detail-backdrop";
  backdrop.hidden = true;
  const panel = document.createElement("section");
  panel.className = "pantry-jar-detail";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-labelledby", "pantry-jar-detail-name");
  backdrop.appendChild(panel);
  return { backdrop, panel };
}

function showJarDetail({ backdrop, panel, jar, ownedIds, onRefresh, onFirstPurchase, onOpenSpoonStore }) {
  const owned = ownedIds.includes(jar.id);
  const shelf = JAR_SHELVES.find((candidate) => candidate.id === jar.shelfId);
  const spoons = getPantrySpoons();
  panel.replaceChildren();

  const header = document.createElement("div");
  header.className = "pantry-jar-detail__header";
  const preview = document.createElement("div");
  preview.className = "pantry-jar-detail__preview";
  preview.appendChild(renderJarVisual(jar, owned, true));
  const info = document.createElement("div");
  info.className = "pantry-jar-detail__info";
  const name = appendTextElement(info, "h3", "pantry-jar-detail__name", t(jar.nameKey));
  name.id = "pantry-jar-detail-name";
  appendTextElement(info, "p", "pantry-jar-detail__shelf", t("pantry.jar.shelfLabel", { shelf: t(shelf.nameKey) }));
  appendTextElement(info, "p", "pantry-jar-detail__rarity", t("pantry.jar.rarity." + jar.rarity));
  header.append(preview, info);

  const growthStatus = getPantryGrowthBonusStatus();
  const effect = document.createElement("div");
  effect.className = "pantry-jar-detail__effect";
  const effectHeading = document.createElement("div");
  effectHeading.className = "pantry-jar-detail__effect-heading";
  appendTextElement(effectHeading, "span", "pantry-jar-detail__effect-label", t("pantry.jar.growthEffectLabel"));
  appendTextElement(
    effectHeading,
    "strong",
    "pantry-jar-detail__effect-chance",
    growthStatus.chance > 0
      ? t("pantry.jar.growthEffectChance", { chance: growthStatus.chance })
      : t("pantry.jar.growthEffectChanceLocked")
  );
  effect.appendChild(effectHeading);
  appendTextElement(effect, "p", "pantry-jar-detail__effect-description", t(
    growthStatus.chance > 0
      ? "pantry.jar.growthEffectDescription"
      : "pantry.jar.growthEffectDescriptionLocked",
    {
      chance: growthStatus.chance,
      reward: growthStatus.reward
    }
  ));
  appendTextElement(effect, "small", "pantry-jar-detail__effect-progress", t("pantry.jar.growthEffectProgress", {
    completed: growthStatus.completedShelves,
    cap: growthStatus.futureShelfCap
  }));

  const actions = document.createElement("div");
  actions.className = "pantry-jar-detail__actions";
  let primary = null;
  if (!owned) {
    primary = document.createElement("button");
    primary.type = "button";
    const affordable = spoons >= jar.cost;
    primary.className = "pantry-jar-detail__btn-buy";
    if (affordable) {
      appendSpoonLabel(primary, t("pantry.jar.buyAction", { count: jar.cost }), "small");
    } else {
      primary.classList.add("is-shortfall");
      const icon = document.createElement("span");
      icon.className = "pantry-jar-detail__shortfall-icon";
      icon.appendChild(createSpoonIcon("small"));
      const copy = document.createElement("span");
      copy.className = "pantry-jar-detail__shortfall-copy";
      appendTextElement(copy, "strong", "", t("pantry.jar.needSpoons", { count: jar.cost - spoons }));
      appendTextElement(copy, "small", "", t("pantry.jar.openSpoonStore"));
      const arrow = appendTextElement(primary, "span", "pantry-jar-detail__shortfall-arrow", "›");
      arrow.setAttribute("aria-hidden", "true");
      primary.prepend(icon, copy);
      primary.setAttribute("aria-label", t("pantry.jar.needSpoonsAction", { count: jar.cost - spoons }));
    }
    primary.addEventListener("click", () => {
      if (!affordable) {
        close();
        onOpenSpoonStore?.(jar);
        return;
      }
      const previousOwnedIds = getOwnedJarIds();
      const result = buyJar(jar.id);
      if (result.ok) {
        const nextOwnedIds = getOwnedJarIds();
        if (isShelfCompletionTransition(jar.shelfId, previousOwnedIds, nextOwnedIds)) {
          pendingShelfCelebrationId = jar.shelfId;
        }
        close();
        onFirstPurchase?.(jar, {
          completedRequestCount: getPaidJarCount()
        });
        onRefresh?.();
      }
    });
  }

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "pantry-jar-detail__btn-close";
  closeButton.textContent = t("pantry.jar.close");
  const close = () => {
    backdrop.classList.remove("visible");
    backdrop.hidden = true;
  };
  closeButton.addEventListener("click", close);
  if (primary) actions.appendChild(primary);
  let focusTarget = primary;
  if (owned) {
    const featured = getFeaturedJarId() === jar.id;
    const homeButton = document.createElement("button");
    homeButton.type = "button";
    homeButton.className = "pantry-jar-detail__btn-feature";
    homeButton.textContent = t(featured ? "pantry.jar.featuredOnHome" : "pantry.jar.featureOnHome");
    homeButton.disabled = featured;
    homeButton.addEventListener("click", () => {
      if (setFeaturedJar(jar.id)) {
        close();
        onRefresh?.();
      }
    });
    actions.appendChild(homeButton);
    focusTarget = homeButton;
  }
  actions.appendChild(closeButton);
  panel.append(header, effect, actions);

  backdrop.hidden = false;
  requestAnimationFrame(() => {
    backdrop.classList.add("visible");
    (focusTarget || closeButton).focus();
  });
  backdrop.onclick = (event) => {
    if (event.target === backdrop) close();
  };
  backdrop.onkeydown = (event) => {
    if (event.key === "Escape") close();
  };
}

function renderOnboarding() {
  if (getPaidJarCount() > 0) return null;
  const card = document.createElement("aside");
  card.className = "pantry-jar-onboarding";
  appendTextElement(card, "strong", "", t("pantry.jar.onboardingTitle"));
  appendTextElement(card, "span", "", t("pantry.jar.onboardingPrompt"));
  return card;
}

export function scheduleInitialJarDetailResume({
  jar,
  guidePending = shouldShowPantryJarIntro(),
  showDetail = () => {},
  onOpened = () => {},
  requestFrame = globalThis.requestAnimationFrame
} = {}) {
  if (!jar || guidePending) return false;
  requestFrame(() => {
    showDetail(jar);
    onOpened(jar);
  });
  return true;
}

export function renderPantryView(
  onRefresh = () => {},
  onFirstPurchase = () => {},
  spoonStore = null,
  onOpenSpoonStore = () => {},
  { onRequestJarGuide = () => {}, initialJarDetailId = null, onInitialJarDetailOpened = () => {} } = {}
) {
  ensureStarterJars();
  const ownedIds = getOwnedJarIds();
  const growthStatus = getPantryGrowthBonusStatus();
  const panel = document.createElement("section");
  panel.className = "pantry-panel pantry-jar-panel content-panel";
  const liveTheme = getLiveSeasonalTheme();
  panel.dataset.eventTheme = liveTheme?.id || "";

  const header = document.createElement("header");
  header.className = "pantry-jar-header";
  const copy = document.createElement("div");
  appendTextElement(copy, "h2", "", t("pantry.title"));
  appendTextElement(copy, "span", "pantry-event-badge", getSeasonalThemeLabel(liveTheme, t));
  appendTextElement(
    copy,
    "span",
    "pantry-growth-bonus",
    growthStatus.chance > 0
      ? t("pantry.jar.growthBonusSummary", { chance: growthStatus.chance })
      : t("pantry.jar.growthBonusSummaryLocked")
  );
  header.prepend(copy);

  const onboarding = renderOnboarding();
  const shelves = document.createElement("div");
  shelves.className = "pantry-jar-shelves";
  const seasonalRewardShelf = renderKoreanHarvestRewardShelf(getCompletedPuzzleIds(), {
    featuredRewardId: getFeaturedSeasonalRewardId(),
    seasonalBonusActive: growthStatus.seasonalBonusActive,
    onFeature: (rewardId) => {
      if (setFeaturedSeasonalReward(rewardId)) onRefresh();
    }
  });
  if (seasonalRewardShelf) shelves.appendChild(seasonalRewardShelf);
  const detail = createDetailPanel();
  const openDetail = (jar) => {
    if (shouldShowPantryJarIntro()) {
      onRequestJarGuide(jar);
      return;
    }
    showJarDetail({
      ...detail,
      jar,
      ownedIds,
      onRefresh,
      onFirstPurchase,
      onOpenSpoonStore
    });
  };
  JAR_SHELVES.forEach((shelf) => shelves.appendChild(renderShelf(shelf, ownedIds, openDetail)));

  panel.append(header);
  if (onboarding) panel.appendChild(onboarding);
  panel.append(shelves);
  if (spoonStore) panel.appendChild(spoonStore);
  panel.appendChild(detail.backdrop);

  const initialJar = initialJarDetailId
    ? PANTRY_JARS.find((jar) => jar.id === initialJarDetailId)
    : null;
  scheduleInitialJarDetailResume({
    jar: initialJar,
    guidePending: shouldShowPantryJarIntro(),
    showDetail: (jar) => showJarDetail({
      ...detail,
      jar,
      ownedIds,
      onRefresh,
      onFirstPurchase,
      onOpenSpoonStore
    }),
    onOpened: onInitialJarDetailOpened
  });

  const celebrationShelfId = pendingShelfCelebrationId;
  if (celebrationShelfId) {
    pendingShelfCelebrationId = null;
    globalThis.requestAnimationFrame(() => {
      const shelfSection = panel.querySelector(
        '.pantry-shelf[data-shelf-id="' + celebrationShelfId + '"]'
      );
      triggerShelfCelebration(shelfSection, t("pantry.jar.shelfBonusCelebration", {
        chance: growthStatus.chance
      }));
    });
  }
  return panel;
}
