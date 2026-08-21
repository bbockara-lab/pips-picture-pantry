const THEME_STATUS = Object.freeze({
  LIVE: "live",
  CANDIDATE: "candidate",
  ARCHIVED: "archived"
});

export const seasonalThemes = Object.freeze([
  Object.freeze({
    id: "summer",
    status: THEME_STATUS.LIVE,
    homeBackgroundAssetId: "pip-puzzle-workshop-summer-v1",
    homeCharacterAssetId: "pip-home-summer-v1",
    pipPresence: "companion",
    packId: "summer-pantry",
    eventLabelKey: "home.summerEventWeek",
    badgeGlyph: "☀",
    palette: Object.freeze({
      anchor: "#6f7f3f",
      accent: "#e9b640",
      surface: "#fff5d5",
      structure: "#714522",
      metal: "#d79b22"
    })
  }),
  Object.freeze({
    id: "korean-harvest",
    status: THEME_STATUS.CANDIDATE,
    homeBackgroundAssetId: "pip-puzzle-workshop-korean-harvest-v2-cute-capybara",
    homeCharacterAssetId: null,
    pipPresence: "baked-in",
    packId: "korean-harvest",
    eventLabelKey: "home.koreanHarvestEvent",
    badgeGlyph: "◐",
    palette: Object.freeze({
      anchor: "#1f2f55",
      accent: "#b75f32",
      surface: "#f4ead5",
      structure: "#4a2d20",
      metal: "#b58a45",
      character: "#718c72"
    })
  })
]);

export function getSeasonalTheme(themeId) {
  return seasonalThemes.find((theme) => theme.id === themeId) || null;
}

export function getLiveSeasonalTheme() {
  return seasonalThemes.find((theme) => theme.status === THEME_STATUS.LIVE) || null;
}

export function getSeasonalThemeForPack(packId, { includeCandidates = false } = {}) {
  return seasonalThemes.find((theme) => (
    theme.packId === packId && (includeCandidates || theme.status === THEME_STATUS.LIVE)
  )) || null;
}

export function getSeasonalThemeLabel(theme, translate) {
  if (!theme?.eventLabelKey) return "";
  const label = typeof translate === "function" ? translate(theme.eventLabelKey) : theme.eventLabelKey;
  return [theme.badgeGlyph, label].filter(Boolean).join(" ");
}

export function isSeasonalThemeRuntimeReady(theme) {
  if (!theme || theme.status !== THEME_STATUS.LIVE) return false;
  if (!theme.homeBackgroundAssetId || !theme.packId || !theme.eventLabelKey) return false;
  if (theme.pipPresence === "baked-in") return !theme.homeCharacterAssetId;
  if (theme.pipPresence === "companion") return Boolean(theme.homeCharacterAssetId);
  return false;
}

export { THEME_STATUS };
