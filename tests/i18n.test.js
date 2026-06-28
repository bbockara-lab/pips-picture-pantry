import { describe, expect, it } from "vitest";
import { getActiveLocale, puzzleText, t } from "../src/i18n/index.js";

describe("i18n", () => {
  it("detects supported launch locales", () => {
    expect(getActiveLocale("ko-KR")).toBe("ko");
    expect(getActiveLocale("en-US")).toBe("en");
    expect(getActiveLocale("es-ES")).toBe("en");
  });

  it("formats translated strings", () => {
    expect(t("progress.filled", { count: 3 })).toBe("3 filled");
    expect(t("album.count", { completed: 1, total: 7 })).toBe("1/7 pictures");
  });

  it("resolves puzzle copy by id", () => {
    expect(puzzleText("pip-face-5", "title")).toBe("Pip Face");
  });
});