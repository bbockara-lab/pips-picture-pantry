import { JAR_SHELVES, PANTRY_JARS, getJarsByShelf } from "../data/pantryJars.js";
import { getJarArtUrl } from "../data/jarArt.js";
import { getSeasonShelvesForPantryShelf } from "../data/stagePantryLinks.js";
import {
  buyJar,
  ensureStarterJars,
  getEquippedJars,
  getOwnedJarIds,
  getPaidJarCount,
  getPantrySpoons,
  isShelfUnlocked,
  setEquippedJar
} from "../game/save.js";
import { t } from "../i18n/index.js";
import { appendSpoonLabel } from "./spoonIcon.js";
import "../styles/pantryJarArt.css";
import "../styles/pantrySpoon.css";
import "../styles/pantryShelfCelebration.css";

let pendingShelfCelebrationId = null;

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

export function triggerShelfCelebration(shelfSection) {
  if (!shelfSection) return false;
  shelfSection.querySelectorAll(".pantry-sparkle").forEach((sparkle) => sparkle.remove());
  shelfSection.classList.remove("pantry-shelf--celebrating");
  void shelfSection.offsetWidth;
  shelfSection.classList.add("pantry-shelf--celebrating");
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

function renderJar(jar, ownedIds, equippedJars, onOpen) {
  const owned = ownedIds.includes(jar.id);
  const equipped = equippedJars[jar.shelfId] === jar.id;
  const button = document.createElement("button");
  button.type = "button";
  button.className = [
    "pantry-jar",
    "rarity-" + jar.rarity,
    owned ? "owned" : "unowned",
    equipped ? "equipped" : ""
  ].join(" ");
  button.dataset.jarId = jar.id;
  button.setAttribute("aria-label", t("pantry.jar.openDetail", { item: t(jar.nameKey) }));
  button.appendChild(renderJarVisual(jar, owned));
  appendTextElement(button, "span", "pantry-jar__name", t(jar.nameKey));
  if (!owned) {
    const price = appendTextElement(button, "span", "pantry-jar__price", "");
    appendSpoonLabel(price, t("pantry.jar.spoonCost", { count: jar.cost }), "tiny");
  } else if (equipped) {
    appendTextElement(button, "span", "pantry-jar__status", t("pantry.jar.equipped"));
  }
  button.addEventListener("click", () => onOpen(jar));
  return button;
}

function renderShelf(shelf, ownedIds, equippedJars, onOpen) {
  const section = document.createElement("section");
  const shelfJars = getJarsByShelf(shelf.id);
  const ownedCount = shelfJars.filter((jar) => ownedIds.includes(jar.id)).length;
  section.className = "pantry-shelf" + (isPaidShelfComplete(shelf.id, ownedIds) ? " complete" : "");
  section.dataset.shelfId = shelf.id;
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
    row.appendChild(renderJar(jar, ownedIds, equippedJars, onOpen));
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

function showJarDetail({ backdrop, panel, jar, ownedIds, equippedJars, onRefresh, onFirstPurchase, onOpenSpoonStore }) {
  const owned = ownedIds.includes(jar.id);
  const equipped = equippedJars[jar.shelfId] === jar.id;
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

  const actions = document.createElement("div");
  actions.className = "pantry-jar-detail__actions";
  const primary = document.createElement("button");
  primary.type = "button";
  if (!owned) {
    const affordable = spoons >= jar.cost;
    primary.className = "pantry-jar-detail__btn-buy";
    if (affordable) {
      appendSpoonLabel(primary, t("pantry.jar.buyAction", { count: jar.cost }), "small");
    } else {
      primary.textContent = t("pantry.jar.needSpoons", { count: jar.cost - spoons });
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
          storyCompleted: false,
          completedRequestCount: getPaidJarCount()
        });
        onRefresh?.();
      }
    });
  } else if (!equipped) {
    primary.className = "pantry-jar-detail__btn-equip";
    primary.textContent = t("pantry.jar.equipAction");
    primary.addEventListener("click", () => {
      if (setEquippedJar(jar.shelfId, jar.id)) {
        close();
        onRefresh?.();
      }
    });
  } else {
    primary.className = "pantry-jar-detail__btn-equipped";
    primary.textContent = t("pantry.jar.equipped");
    primary.disabled = true;
  }

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "pantry-jar-detail__btn-close";
  closeButton.textContent = t("common.close");
  const close = () => {
    backdrop.classList.remove("visible");
    backdrop.hidden = true;
  };
  closeButton.addEventListener("click", close);
  actions.append(primary, closeButton);
  panel.append(header, actions);

  backdrop.hidden = false;
  requestAnimationFrame(() => {
    backdrop.classList.add("visible");
    primary.focus();
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

export function renderPantryView(onRefresh = () => {}, onFirstPurchase = () => {}, spoonStore = null, onOpenSpoonStore = () => {}) {
  ensureStarterJars();
  const ownedIds = getOwnedJarIds();
  const equippedJars = getEquippedJars();
  const panel = document.createElement("section");
  panel.className = "pantry-panel pantry-jar-panel content-panel";

  const header = document.createElement("header");
  header.className = "pantry-jar-header";
  const copy = document.createElement("div");
  appendTextElement(copy, "h2", "", t("pantry.title"));
  const balance = appendTextElement(header, "div", "pantry-jar-balance", "");
  appendSpoonLabel(balance, t("pantry.jar.balance", { count: getPantrySpoons() }));
  balance.setAttribute("aria-label", t("currency.spoons", { count: getPantrySpoons() }));
  header.prepend(copy);

  const onboarding = renderOnboarding();
  const shelves = document.createElement("div");
  shelves.className = "pantry-jar-shelves";
  const detail = createDetailPanel();
  const openDetail = (jar) => showJarDetail({
    ...detail,
    jar,
    ownedIds,
    equippedJars,
    onRefresh,
    onFirstPurchase,
    onOpenSpoonStore
  });
  JAR_SHELVES.forEach((shelf) => shelves.appendChild(renderShelf(shelf, ownedIds, equippedJars, openDetail)));

  panel.append(header);
  if (onboarding) panel.appendChild(onboarding);
  panel.append(shelves);
  if (spoonStore) panel.appendChild(spoonStore);
  panel.appendChild(detail.backdrop);

  const celebrationShelfId = pendingShelfCelebrationId;
  if (celebrationShelfId) {
    pendingShelfCelebrationId = null;
    globalThis.requestAnimationFrame(() => {
      const shelfSection = panel.querySelector(
        '.pantry-shelf[data-shelf-id="' + celebrationShelfId + '"]'
      );
      triggerShelfCelebration(shelfSection);
    });
  }
  return panel;
}
