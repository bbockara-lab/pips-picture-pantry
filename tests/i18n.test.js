import { afterEach, describe, expect, it } from "vitest";
import {
  getActiveLocale,
  getLanguagePreference,
  puzzleText,
  puzzleTitle,
  setActiveLocale,
  setLanguagePreference,
  t
} from "../src/i18n/index.js";

describe("i18n", () => {
  afterEach(() => {
    setActiveLocale("en");
  });

  it("detects supported launch locales", () => {
    expect(getActiveLocale("ko-KR")).toBe("ko");
    expect(getActiveLocale("en-US")).toBe("en");
    expect(getActiveLocale("es-ES")).toBe("en");
  });

  it("formats translated strings", () => {
    expect(t("progress.filled", { count: 3 })).toBe("3 filled");
    expect(t("controls.fill")).toBe("Color");
    expect(t("controls.mark")).toBe("Blank Check");
    expect(t("controls.undo")).toBe("Undo last move");
    expect(t("daily.eyebrow")).toBe("Today's pick");
    expect(t("views.map")).toBe("Badges");
    expect(t("pipStrip.puzzleLine", { player: "Jay" })).toBe("Jay, use the numbers to color the picture.");
    expect(t("puzzlePicker.sizeReward", { size: 5, count: 3 })).toBe("5x5 +3");
    expect(t("puzzlePicker.sizeComplete", { size: 5 })).toBe("5x5 - Complete");
    expect(t("album.count", { completed: 1, total: 100 })).toBe("1/100 pictures");
    expect(t("settings.playerName")).toBe("Player name");
    expect(t("currency.spoons", { count: 7 })).toBe("Spoons 7");
    expect(t("packs.preview")).toBe("Preview");
    expect(t("packs.pricePreview")).toBe("Optional add-on - 100 puzzles");
    expect(t("badges.progress", { completed: 3, total: 100 })).toBe("3/100 cards");
    expect(t("map.sets.cozy-cafe-room")).toBe("Cozy cafe room");
  });

  it("resolves explicit and data-backed puzzle copy", () => {
    expect(puzzleText("pips-first-shelf-pip-face-1", "title")).toBe("Pip Face");
    expect(puzzleTitle({ id: "custom-puzzle-1", title: "Custom Puzzle" })).toBe("Custom Puzzle");
  });

  it("uses a cached active locale", () => {
    setActiveLocale("ko");

    expect(t("views.puzzle")).toBe("\ud37c\uc990");

    setActiveLocale("unsupported");
    expect(t("views.puzzle")).toBe("Puzzle");
  });

  it("supports system language default and in-app overrides", () => {
    setLanguagePreference("system", "ko-KR");
    expect(getLanguagePreference()).toBe("system");
    expect(t("views.album")).toBe("\uc568\ubc94");
    expect(t("controls.fill")).toBe("\uce60\ud558\uae30");
    expect(t("controls.mark")).toBe("\ube48\uce78 \uccb4\ud06c");
    expect(t("views.map")).toBe("\ubc30\uc9c0");
    expect(t("puzzlePicker.sizeComplete", { size: 5 })).toBe("5x5 - \uc644\ub8cc");
    expect(t("packs.preview")).toBe("\uc608\uace0");
    expect(t("badges.pipPortrait")).toBe("Pip \ucd08\uc0c1\ud654");

    setLanguagePreference("en", "ko-KR");
    expect(getLanguagePreference()).toBe("en");
    expect(t("views.album")).toBe("Album");
  });
});
