import { describe, expect, it } from "vitest";
import {
  getLiveSeasonalTheme,
  getSeasonalTheme,
  getSeasonalThemeForPack,
  getSeasonalThemeLabel,
  isSeasonalThemeRuntimeReady,
  seasonalThemes,
  THEME_STATUS
} from "../src/data/seasonalThemes.js";

describe("seasonal theme registry", () => {
  it("keeps the shipped summer theme as the only live theme", () => {
    const liveTheme = getLiveSeasonalTheme();
    expect(seasonalThemes.filter((theme) => theme.status === THEME_STATUS.LIVE)).toHaveLength(1);
    expect(liveTheme?.id).toBe("summer");
    expect(isSeasonalThemeRuntimeReady(liveTheme)).toBe(true);
  });

  it("keeps Korean Harvest gated until its complete content slice is approved", () => {
    const harvest = getSeasonalTheme("korean-harvest");
    expect(harvest?.status).toBe(THEME_STATUS.CANDIDATE);
    expect(harvest?.pipPresence).toBe("baked-in");
    expect(isSeasonalThemeRuntimeReady(harvest)).toBe(false);
  });

  it("resolves presentation from pack ids without exposing candidates", () => {
    expect(getSeasonalThemeForPack("summer-pantry")?.id).toBe("summer");
    expect(getSeasonalThemeForPack("korean-harvest")).toBeNull();
    expect(getSeasonalThemeForPack("korean-harvest", { includeCandidates: true })?.id).toBe("korean-harvest");
    expect(getSeasonalThemeLabel(getLiveSeasonalTheme(), (key) => key)).toBe("☀ home.summerEventWeek");
  });

  it("rejects an incomplete live companion theme", () => {
    expect(isSeasonalThemeRuntimeReady({
      status: THEME_STATUS.LIVE,
      homeBackgroundAssetId: "background",
      homeCharacterAssetId: null,
      pipPresence: "companion",
      packId: "pack",
      eventLabelKey: "label"
    })).toBe(false);
  });
});
