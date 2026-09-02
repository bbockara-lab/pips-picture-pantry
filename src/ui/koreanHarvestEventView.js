import pipGreetingUrl from "../assets/characters/pip-korean-harvest-greeting-v2.webp";
import giftArtUrl from "../assets/seasonal/korean-harvest/pip-chuseok-welcome-gift-v1.webp";
import mysteryGiftUrl from "../assets/seasonal/korean-harvest/bojagi-gift-v1.webp";
import { KOREAN_HARVEST_CONTENT } from "../data/koreanHarvestContent.js";
import { eventSeasonShelves, getSeasonShelfPuzzles } from "../data/seasonShelves.js";
import { getCompletedPuzzleIds, isShelfUnlocked } from "../game/save.js";
import { puzzleImageName, t } from "../i18n/index.js";
import { renderColoredPuzzleArt } from "./coloredPuzzleArt.js";
import { renderKoreanHarvestRewardShelf } from "./koreanHarvestRewardShelf.js";
import { createSpoonIcon } from "./spoonIcon.js";

export function renderKoreanHarvestEventView({ giftStatus, onClaimGift, onClose, onPlayPuzzle }) {
  const completedIds = new Set(getCompletedPuzzleIds());
  const overlay = document.createElement("div");
  overlay.className = "korean-harvest-event-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "korean-harvest-event-title");

  const card = document.createElement("section");
  card.className = "korean-harvest-event";
  const close = document.createElement("button");
  close.type = "button";
  close.className = "korean-harvest-event__close";
  close.setAttribute("aria-label", t("koreanHarvest.event.close"));
  close.textContent = "×";
  close.addEventListener("click", onClose);

  const hero = document.createElement("header");
  hero.className = "korean-harvest-event__hero";
  const pip = document.createElement("img");
  pip.src = pipGreetingUrl;
  pip.alt = "";
  pip.setAttribute("aria-hidden", "true");
  pip.dataset.assetId = "pip-korean-harvest-greeting-v2";
  const heroCopy = document.createElement("div");
  appendTextElement(heroCopy, "p", "", t("koreanHarvest.event.eyebrow"));
  const heroTitle = appendTextElement(heroCopy, "h1", "", t("koreanHarvest.event.title"));
  heroTitle.id = "korean-harvest-event-title";
  appendTextElement(heroCopy, "span", "", t("koreanHarvest.event.intro"));
  hero.append(pip, heroCopy);

  const about = document.createElement("section");
  about.className = "korean-harvest-event__about";
  appendTextElement(about, "h2", "", t("koreanHarvest.event.aboutTitle"));
  appendTextElement(about, "p", "", t("koreanHarvest.event.aboutBody"));

  const gift = renderGift(giftStatus, onClaimGift);
  const challenge = renderKoreanHarvestPuzzleCollection({ completedIds, onPlayPuzzle });

  const rewards = renderKoreanHarvestRewardShelf(completedIds);
  card.append(close, hero, about, gift, challenge);
  if (rewards) card.appendChild(rewards);
  overlay.appendChild(card);
  return overlay;
}

export function renderKoreanHarvestPuzzleCollection({
  completedIds = new Set(getCompletedPuzzleIds()),
  onPlayPuzzle = () => {},
  archive = false
} = {}) {
  const completed = completedIds instanceof Set ? completedIds : new Set(completedIds || []);
  const completedCount = KOREAN_HARVEST_CONTENT.puzzles.filter((puzzle) => completed.has(puzzle.id)).length;
  const challenge = document.createElement("section");
  challenge.className = archive
    ? "korean-harvest-event__challenge korean-harvest-archive"
    : "korean-harvest-event__challenge";
  const sectionHeading = document.createElement("div");
  sectionHeading.className = "korean-harvest-event__section-heading";
  const sectionCopy = document.createElement("div");
  appendTextElement(sectionCopy, "p", "", t(archive ? "koreanHarvest.archive.eyebrow" : "koreanHarvest.event.puzzleEyebrow"));
  appendTextElement(sectionCopy, "h2", "", t(archive ? "koreanHarvest.archive.title" : "koreanHarvest.event.puzzleTitle"));
  if (archive) appendTextElement(sectionCopy, "span", "", t("koreanHarvest.archive.body"));
  appendTextElement(sectionHeading, "strong", "", t("koreanHarvest.event.progress", {
    current: completedCount,
    total: KOREAN_HARVEST_CONTENT.puzzles.length
  }));
  sectionHeading.prepend(sectionCopy);
  challenge.appendChild(sectionHeading);

  eventSeasonShelves.forEach((shelf) => {
    const unlocked = isShelfUnlocked(shelf);
    const group = document.createElement("section");
    group.className = `korean-harvest-event__shelf ${unlocked ? "is-unlocked" : "is-locked"}`;
    const heading = document.createElement("h3");
    heading.textContent = t(shelf.titleKey);
    group.appendChild(heading);
    const grid = document.createElement("div");
    grid.className = "korean-harvest-event__puzzles";
    getSeasonShelfPuzzles(shelf).forEach((puzzle, index) => {
      const complete = completed.has(puzzle.id);
      const button = document.createElement("button");
      button.type = "button";
      button.className = complete ? "is-complete" : unlocked ? "is-mystery" : "is-locked";
      button.disabled = !unlocked;
      if (complete) {
        button.appendChild(renderColoredPuzzleArt(puzzle, { className: "korean-harvest-event__puzzle-art" }));
      } else {
        const mystery = document.createElement("span");
        mystery.className = "korean-harvest-event__puzzle-mystery";
        const mysteryArt = document.createElement("img");
        mysteryArt.src = mysteryGiftUrl;
        mysteryArt.alt = "";
        mysteryArt.setAttribute("aria-hidden", "true");
        mysteryArt.dataset.assetId = "bojagi-gift-v1";
        mystery.appendChild(mysteryArt);
        button.appendChild(mystery);
      }
      const label = document.createElement("span");
      label.textContent = complete
        ? `${index + 1}. ${puzzleImageName(puzzle)}`
        : `${index + 1}. ${t(unlocked ? "koreanHarvest.event.mysteryPuzzle" : "koreanHarvest.event.lockedPuzzle")}`;
      button.appendChild(label);
      if (unlocked) button.addEventListener("click", () => onPlayPuzzle(puzzle.id));
      grid.appendChild(button);
    });
    group.appendChild(grid);
    if (!unlocked) {
      const locked = document.createElement("p");
      locked.className = "korean-harvest-event__locked";
      locked.textContent = t("koreanHarvest.event.locked");
      group.appendChild(locked);
    }
    challenge.appendChild(group);
  });

  return challenge;
}

function appendTextElement(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  parent.appendChild(element);
  return element;
}

function renderGift(giftStatus, onClaimGift) {
  const section = document.createElement("section");
  section.className = "korean-harvest-event__gift";
  const art = document.createElement("img");
  art.src = giftArtUrl;
  art.alt = t("seasonalGift.artAlt");
  art.dataset.assetId = "pip-chuseok-welcome-gift-v1";
  const copy = document.createElement("div");
  const title = document.createElement("h2");
  title.textContent = t("koreanHarvest.event.giftTitle");
  const body = document.createElement("p");
  body.textContent = t(`koreanHarvest.event.gift.${giftStatus?.state || "unavailable"}`);
  const reward = document.createElement("strong");
  reward.append(createSpoonIcon("small"), document.createTextNode(t("seasonalGift.reward", {
    count: giftStatus?.gift?.spoons || 50
  })));
  copy.append(title, body, reward);
  if (giftStatus?.state === "available") {
    const claim = document.createElement("button");
    claim.type = "button";
    claim.textContent = t("koreanHarvest.event.claimGift");
    claim.addEventListener("click", onClaimGift);
    copy.appendChild(claim);
  }
  section.append(art, copy);
  return section;
}
