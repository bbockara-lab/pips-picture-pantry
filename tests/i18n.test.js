import { afterEach, describe, expect, it } from "vitest";
import {
  getActiveLocale,
  getLanguagePreference,
  puzzleText,
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
    expect(t("album.count", { completed: 1, total: 9 })).toBe("1/9 pictures");
  });

  it("resolves puzzle copy by id", () => {
    expect(puzzleText("pip-face-5", "title")).toBe("Pip Face");
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

    setLanguagePreference("en", "ko-KR");
    expect(getLanguagePreference()).toBe("en");
    expect(t("views.album")).toBe("Album");
  });
});