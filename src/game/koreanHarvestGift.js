import { KOREAN_HARVEST_CONTENT, isKoreanHarvestContentRuntimeReady } from "../data/koreanHarvestContent.js";
import { claimSeasonalSpoonGift } from "./save.js";

export function claimKoreanHarvestWelcomeGift(dateKey, options = {}) {
  const content = options.content || KOREAN_HARVEST_CONTENT;
  const isRuntimeReady = options.isRuntimeReady || isKoreanHarvestContentRuntimeReady;
  if (!isRuntimeReady(content)) return null;
  return claimSeasonalSpoonGift(content.welcomeGift, dateKey);
}
