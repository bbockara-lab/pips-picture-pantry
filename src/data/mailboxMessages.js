import welcomeArtUrl from "../assets/mailbox/pip-developer-letter-welcome-v1.webp";

const GUIDE_MESSAGES = [
  ["guide-puzzle", "puzzle"],
  ["guide-cursor", "cursorControlsIntro"],
  ["guide-pantry-jar", "pantryJarIntro"],
  ["guide-time-attack", "timeAttack"],
  ["guide-map", "map"],
  ["story-spoon-run", "spoonRunIntro"],
  ["story-first-purchase", "pantryFirstPurchase"],
  ["story-pantry-room", "pantryRoomStory"],
  ["story-mr-park", "pantryNeighborMrPark"],
  ["story-lily", "pantryNeighborLily"],
  ["story-mateo", "pantryNeighborMateo"]
];

export const MAILBOX_MESSAGES = [
  {
    id: "developer-welcome-2026-08",
    kind: "letter",
    titleKey: "mailbox.welcomeTitle",
    previewKey: "mailbox.welcomePreview",
    bodyKey: "mailbox.welcomeBody",
    dateKey: "mailbox.welcomeDate",
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

export function getMailboxMessages(kind = "all") {
  return kind === "all" ? MAILBOX_MESSAGES : MAILBOX_MESSAGES.filter((message) => message.kind === kind);
}

export function getUnlockedMailboxMessages(kind = "all", hasSeenGuide = () => false) {
  return getMailboxMessages(kind).filter((message) => (
    message.kind === "letter" || (message.guideId && hasSeenGuide(message.guideId))
  ));
}
