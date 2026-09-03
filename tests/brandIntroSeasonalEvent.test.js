import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { en } from "../src/i18n/en.js";
import { ko } from "../src/i18n/ko.js";

const introSource = readFileSync(new URL("../src/ui/brandIntro.js", import.meta.url), "utf8");

describe("Korean Harvest opening identity", () => {
  it("uses the approved seasonal opening artwork", () => {
    expect(introSource).toContain("opening-key-visual-korean-harvest-v4-cute-capybara.webp");
  });

  it("identifies the limited-time event before the player presses Start", () => {
    expect(introSource).toContain("buildSeasonalEventMarker");
    expect(en.brandIntro.eventTag).toContain("event");
    expect(en.brandIntro.eventTitle).toContain("Korean Harvest");
    expect(ko.brandIntro.eventTag).toBe("기간 한정 이벤트");
    expect(ko.brandIntro.eventTitle).toContain("추석");
  });
});
