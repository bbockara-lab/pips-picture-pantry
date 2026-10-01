import { KOREAN_HARVEST_CONTENT, isKoreanHarvestContentRuntimeReady } from "../data/koreanHarvestContent.js";
import { claimSeasonalSpoonGift, hasClaimedSeasonalGift } from "./save.js";

export function claimKoreanHarvestWelcomeGift(dateKey, options = {}) {
  const content = options.content || KOREAN_HARVEST_CONTENT;
  const isRuntimeReady = options.isRuntimeReady || isKoreanHarvestContentRuntimeReady;
  if (!isRuntimeReady(content)) return null;
  return claimSeasonalSpoonGift(content.welcomeGift, dateKey);
}

export function getKoreanHarvestGiftStatus(dateKey = getLocalDateKey(), options = {}) {
  const content = options.content || KOREAN_HARVEST_CONTENT;
  const gift = content.welcomeGift;
  if (!isKoreanHarvestContentRuntimeReady(content)) return { state: "unavailable", gift };
  if (hasClaimedSeasonalGift(gift.id)) return { state: "claimed", gift };
  if (dateKey < gift.localDateWindow.start) return { state: "upcoming", gift };
  if (dateKey > gift.localDateWindow.end) return { state: "expired", gift };
  return { state: "available", gift };
}

function getLocalDateKey(now = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
