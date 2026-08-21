import { KOREAN_HARVEST_CONTENT, isKoreanHarvestContentRuntimeReady } from "../data/koreanHarvestContent.js";
import { getKoreanHarvestRewardArtUrl } from "../data/koreanHarvestRewardArt.js";
import { t } from "../i18n/index.js";

export function getKoreanHarvestCompletedCount(completedPuzzleIds = []) {
  const completed = completedPuzzleIds instanceof Set ? completedPuzzleIds : new Set(completedPuzzleIds || []);
  return KOREAN_HARVEST_CONTENT.puzzles.filter((puzzle) => completed.has(puzzle.id)).length;
}

export function renderKoreanHarvestRewardShelf(completedPuzzleIds = []) {
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
    items.appendChild(card);
  });

  section.append(header, items);
  return section;
}
