import { KOREAN_HARVEST_CONTENT, KOREAN_HARVEST_DISPLAY_BONUS_CHANCE, getKoreanHarvestCompletedPuzzleCount, isKoreanHarvestContentRuntimeReady } from "../data/koreanHarvestContent.js";
import { getKoreanHarvestRewardArtUrl } from "../data/koreanHarvestRewardArt.js";
import { t } from "../i18n/index.js";

export function getKoreanHarvestCompletedCount(completedPuzzleIds = []) {
  return getKoreanHarvestCompletedPuzzleCount(completedPuzzleIds);
}

export function renderKoreanHarvestRewardShelf(completedPuzzleIds = [], {
  featuredRewardId = null,
  onFeature = null,
  seasonalBonusActive = false
} = {}) {
  if (!isKoreanHarvestContentRuntimeReady()) return null;
  const completedCount = getKoreanHarvestCompletedCount(completedPuzzleIds);
  const section = document.createElement("section");
  section.className = "seasonal-reward-shelf";
  section.dataset.eventTheme = "korean-harvest";

  const header = document.createElement("header");
  const title = document.createElement("h3");
  title.textContent = t("koreanHarvest.rewards.title");
  const progress = document.createElement("span");
  progress.textContent = t("koreanHarvest.rewards.progress", {
    current: completedCount,
    total: KOREAN_HARVEST_CONTENT.puzzles.length
  });
  header.append(title, progress);

  const bonusRule = document.createElement("p");
  bonusRule.className = "seasonal-reward-shelf__bonus-rule";
  bonusRule.textContent = t("koreanHarvest.rewards.bonusRule", {
    chance: KOREAN_HARVEST_DISPLAY_BONUS_CHANCE
  });

  const items = document.createElement("div");
  items.className = "seasonal-reward-shelf__items";
  KOREAN_HARVEST_CONTENT.rewards.forEach((reward) => {
    const unlocked = completedCount >= reward.unlockAfter;
    const card = document.createElement("article");
    card.className = `seasonal-reward-card ${unlocked ? "is-unlocked" : "is-locked"}`;
    card.dataset.rewardId = reward.id;
    const image = document.createElement("img");
    image.src = getKoreanHarvestRewardArtUrl(reward.assetId);
    image.alt = t(`koreanHarvest.rewards.${reward.id}`);
    image.dataset.assetId = reward.assetId;
    const name = document.createElement("strong");
    name.textContent = t(`koreanHarvest.rewards.${reward.id}`);
    const condition = document.createElement("small");
    condition.textContent = unlocked
      ? t("koreanHarvest.rewards.unlocked")
      : t("koreanHarvest.rewards.unlockAt", { count: reward.unlockAfter });
    card.append(image, name, condition);
    if (unlocked && typeof onFeature === "function") {
      const action = document.createElement("button");
      action.type = "button";
      action.className = "seasonal-reward-card__feature";
      action.textContent = reward.id === featuredRewardId
        ? t(seasonalBonusActive
          ? "koreanHarvest.rewards.featuredBonusActive"
          : "koreanHarvest.rewards.featuredNeedsRegular", {
          chance: KOREAN_HARVEST_DISPLAY_BONUS_CHANCE
        })
        : t("koreanHarvest.rewards.featureOnHomeBonus", {
          chance: KOREAN_HARVEST_DISPLAY_BONUS_CHANCE
        });
      action.disabled = reward.id === featuredRewardId;
      action.addEventListener("click", () => onFeature(reward.id));
      card.appendChild(action);
    }
    items.appendChild(card);
  });

  section.append(header, bonusRule, items);
  return section;
}
