import { KOREAN_HARVEST_PUZZLES } from "./koreanHarvestPuzzles.js";
import { getSeasonalTheme } from "./seasonalThemes.js";

const CONTENT_STATUS = Object.freeze({
  CANDIDATE: "candidate",
  LIVE: "live",
  ARCHIVED: "archived"
});

const KOREAN_HARVEST_REWARDS = Object.freeze([
  Object.freeze({ id: "songpyeon-tray", unlockAfter: 4, slot: "counter", artStatus: "approved", assetId: "korean-harvest-songpyeon-tray-v1" }),
  Object.freeze({ id: "bojagi-gift", unlockAfter: 8, slot: "shelf", artStatus: "approved", assetId: "korean-harvest-bojagi-gift-v1" }),
  Object.freeze({ id: "moon-jar", unlockAfter: 12, slot: "shelf", artStatus: "approved", assetId: "korean-harvest-moon-jar-v1" }),
  Object.freeze({ id: "moonlit-lantern", unlockAfter: 16, slot: "window", artStatus: "approved", assetId: "korean-harvest-moonlit-lantern-v1" })
]);

export const KOREAN_HARVEST_DISPLAY_BONUS_CHANCE = 2;

const KOREAN_HARVEST_SHELF_NAMES = Object.freeze([
  "moonrise-table",
  "harvest-courtyard",
  "moon-jar-room",
  "full-moon-feast"
]);

export const KOREAN_HARVEST_SHELVES = Object.freeze(
  KOREAN_HARVEST_SHELF_NAMES.map((name, index) => Object.freeze({
    id: `shelf-korean-harvest-${index + 1}`,
    titleKey: `shelves.koreanHarvest.${name}`,
    teaserKey: `shelves.koreanHarvest.${name}Teaser`,
    puzzleIds: Object.freeze(KOREAN_HARVEST_PUZZLES.slice(index * 4, index * 4 + 4).map((puzzle) => puzzle.id)),
    unlockCost: 0,
    pantryRoomStepRequired: 0,
    stageBonus: 24 + index * 8,
    artPackId: "korean-harvest",
    eventTheme: "korean-harvest"
  }))
);

export const KOREAN_HARVEST_CONTENT = Object.freeze({
  id: "korean-harvest-2026",
  themeId: "korean-harvest",
  packId: "korean-harvest",
  status: CONTENT_STATUS.LIVE,
  availability: Object.freeze({
    publishDate: "2026-09-17",
    timezone: "America/New_York",
    requiresExplicitActivation: true,
    homeWindow: Object.freeze({
      start: "2026-08-30",
      end: "2026-10-04"
    })
  }),
  welcomeGift: Object.freeze({
    id: "korean-harvest-2026-welcome-gift",
    spoons: 50,
    localDateWindow: Object.freeze({
      start: "2026-09-17",
      end: "2026-10-04"
    })
  }),
  localization: Object.freeze({
    supported: Object.freeze(["en", "ko"]),
    eventTitle: Object.freeze({
      en: "Pip's Korean Harvest Moon Festival",
      ko: "핍의 추석 보름달 잔치"
    }),
    eventSubtitle: Object.freeze({
      en: "Gather warm pictures beneath the harvest moon.",
      ko: "보름달 아래에서 따뜻한 그림을 모아 보세요."
    })
  }),
  puzzles: KOREAN_HARVEST_PUZZLES,
  shelves: KOREAN_HARVEST_SHELVES,
  rewards: KOREAN_HARVEST_REWARDS,
  mailboxLetter: Object.freeze({
    id: "developer-korean-harvest-2026",
    kind: "letter",
    artStatus: "approved",
    unlockRule: "theme-live",
    title: Object.freeze({ en: "A Harvest Moon Letter", ko: "보름달 아래에서 온 편지" }),
    preview: Object.freeze({
      en: "Pip has been preparing a warm Chuseok table for you.",
      ko: "핍이 여러분을 위해 따뜻한 추석상을 준비하고 있어요."
    }),
    body: Object.freeze({
      en: "Thank you for spending quiet puzzle moments with Pip. We made this Korean harvest celebration with great care, and we will keep filling the Pantry with new pictures, stories, and small surprises. We hope the full moon brings warmth to your day.",
      ko: "핍과 함께 조용한 퍼즐 시간을 보내 주셔서 고맙습니다. 이번 추석 잔치도 정성을 다해 준비했어요. 앞으로도 팬트리에 새로운 그림과 이야기, 작은 놀라움을 차곡차곡 채워 나가겠습니다. 보름달처럼 따뜻한 하루 보내세요."
    })
  })
});

export function isKoreanHarvestContentRuntimeReady(content = KOREAN_HARVEST_CONTENT) {
  const theme = getSeasonalTheme(content?.themeId);
  if (!content || content.status !== CONTENT_STATUS.LIVE) return false;
  if (!theme || theme.status !== CONTENT_STATUS.LIVE) return false;
  if (content.availability?.requiresExplicitActivation !== true) return false;
  if (!content.puzzles?.length || !content.rewards?.length) return false;
  if (content.mailboxLetter?.artStatus !== "approved") return false;
  return content.rewards.every((reward) => reward.artStatus === "approved");
}

export function getKoreanHarvestRewardForProgress(completedCount) {
  const count = Math.max(0, Number(completedCount) || 0);
  return KOREAN_HARVEST_CONTENT.rewards.filter((reward) => reward.unlockAfter <= count).at(-1) || null;
}

export function getKoreanHarvestCompletedPuzzleCount(completedPuzzleIds = []) {
  const completed = completedPuzzleIds instanceof Set
    ? completedPuzzleIds
    : new Set(completedPuzzleIds || []);
  return KOREAN_HARVEST_CONTENT.puzzles.filter((puzzle) => completed.has(puzzle.id)).length;
}

export function isKoreanHarvestRewardUnlocked(rewardId, completedPuzzleIds = []) {
  const reward = KOREAN_HARVEST_CONTENT.rewards.find((candidate) => candidate.id === rewardId);
  return Boolean(reward) && getKoreanHarvestCompletedPuzzleCount(completedPuzzleIds) >= reward.unlockAfter;
}

export function isKoreanHarvestEventVisible(dateKey = getLocalDateKey()) {
  const start = KOREAN_HARVEST_CONTENT.availability.homeWindow.start;
  const end = KOREAN_HARVEST_CONTENT.availability.homeWindow.end;
  return isKoreanHarvestContentRuntimeReady()
    && dateKey >= start
    && dateKey <= end;
}

export function getKoreanHarvestLifecycle(dateKey = getLocalDateKey()) {
  if (!isKoreanHarvestContentRuntimeReady()) return "unavailable";
  const { start, end } = KOREAN_HARVEST_CONTENT.availability.homeWindow;
  if (dateKey < start) return "upcoming";
  if (dateKey <= end) return "live";
  return "archive";
}

export function isKoreanHarvestArchiveAvailable(dateKey = getLocalDateKey()) {
  return getKoreanHarvestLifecycle(dateKey) === "archive";
}

export function isKoreanHarvestContentAvailable(dateKey = getLocalDateKey()) {
  return ["live", "archive"].includes(getKoreanHarvestLifecycle(dateKey));
}

export function getKoreanHarvestPlayerState(completedPuzzleIds = []) {
  const completed = completedPuzzleIds instanceof Set ? completedPuzzleIds : new Set(completedPuzzleIds || []);
  const completedCount = KOREAN_HARVEST_CONTENT.puzzles.filter((puzzle) => completed.has(puzzle.id)).length;
  return Object.freeze({
    state: completedCount === 0
      ? "not-started"
      : completedCount >= KOREAN_HARVEST_CONTENT.puzzles.length
        ? "complete"
        : "in-progress",
    completedCount,
    total: KOREAN_HARVEST_CONTENT.puzzles.length,
    progressPreserved: true,
    replayAvailable: completedCount > 0
  });
}

function getLocalDateKey(now = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export { CONTENT_STATUS, KOREAN_HARVEST_REWARDS };
