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
  it("keeps Korean Harvest as the only live theme for the seasonal release", () => {
    const liveTheme = getLiveSeasonalTheme(new Date(2026, 8, 20));
    expect(seasonalThemes.filter((theme) => theme.status === THEME_STATUS.LIVE)).toHaveLength(1);
    expect(liveTheme?.id).toBe("korean-harvest");
    expect(isSeasonalThemeRuntimeReady(liveTheme)).toBe(true);
    expect(getLiveSeasonalTheme(new Date(2026, 9, 4))?.id).toBe("korean-harvest");
    expect(getLiveSeasonalTheme(new Date(2026, 9, 5))).toBeNull();
  });

  it("publishes Korean Harvest with Pip beside the greeting in the approved home scene", () => {
    const harvest = getSeasonalTheme("korean-harvest");
    expect(harvest?.status).toBe(THEME_STATUS.LIVE);
    expect(harvest?.pipPresence).toBe("companion");
    expect(harvest?.homeCharacterAssetId).toBe("pip-korean-harvest-greeting-v3-capybara");
    expect(isSeasonalThemeRuntimeReady(harvest)).toBe(true);
  });

  it("resolves presentation from pack ids without reviving archived themes", () => {
    expect(getSeasonalThemeForPack("summer-pantry")).toBeNull();
    expect(getSeasonalThemeForPack("korean-harvest")?.id).toBe("korean-harvest");
    expect(getSeasonalThemeForPack("korean-harvest", { includeCandidates: true })?.id).toBe("korean-harvest");
    expect(getSeasonalThemeLabel(getLiveSeasonalTheme(new Date(2026, 8, 20)), (key) => key)).toBe("◐ home.koreanHarvestEvent");
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
