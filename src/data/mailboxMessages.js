import welcomeArtUrl from "../assets/mailbox/pip-developer-letter-welcome-v1.webp";
import koreanHarvestLetterArtUrl from "../assets/mailbox/pip-korean-harvest-letter-v3-capybara.webp";
import { KOREAN_HARVEST_CONTENT, isKoreanHarvestContentAvailable } from "./koreanHarvestContent.js";

const GUIDE_MESSAGES = [
  ["guide-puzzle", "puzzle"],
  ["guide-cursor", "cursorControlsIntro"],
  ["guide-pantry-jar", "pantryJarIntro"],
  ["guide-time-attack", "timeAttack"],
  ["guide-map", "map"],
  ["story-spoon-run", "spoonRunIntro"],
  ["story-first-purchase", "pantryFirstPurchase"]
];

export const MAILBOX_MESSAGES = [
  {
    id: "developer-welcome-2026-08",
    kind: "letter",
    titleKey: "mailbox.welcomeTitle",
    previewKey: "mailbox.welcomePreview",
    bodyKey: "mailbox.welcomeBody",
    dateKey: "mailbox.welcomeDate",
    artAltKey: "mailbox.welcomeArtAlt",
    art: { assetId: "pip-developer-letter-welcome-v1", src: welcomeArtUrl }
  },
  ...GUIDE_MESSAGES.map(([id, guideId]) => ({
    id,
    kind: "story",
    guideId,
    titleKey: `mailbox.messages.${id}.title`,
    previewKey: `mailbox.messages.${id}.preview`
  }))
];

export function getRuntimeSeasonalMailboxMessages() {
  if (!isKoreanHarvestContentAvailable()) return [];
  return [{
    id: KOREAN_HARVEST_CONTENT.mailboxLetter.id,
    kind: "letter",
    titleKey: "mailbox.koreanHarvest.title",
    previewKey: "mailbox.koreanHarvest.preview",
    bodyKey: "mailbox.koreanHarvest.body",
    dateKey: "mailbox.koreanHarvest.date",
    artAltKey: "mailbox.koreanHarvest.artAlt",
    art: { assetId: "pip-korean-harvest-letter-v3-capybara", src: koreanHarvestLetterArtUrl }
  }];
}

export function getMailboxMessages(kind = "all") {
  const messages = [...MAILBOX_MESSAGES, ...getRuntimeSeasonalMailboxMessages()];
  return kind === "all" ? messages : messages.filter((message) => message.kind === kind);
}

export function getUnlockedMailboxMessages(kind = "all", hasSeenGuide = () => false) {
  return getMailboxMessages(kind).filter((message) => (
    message.kind === "letter" || (message.guideId && hasSeenGuide(message.guideId))
  ));
}
