import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { en } from "../src/i18n/en.js";
import { ko } from "../src/i18n/ko.js";

describe("Korean Harvest welcome gift view", () => {
  it("identifies Chuseok, Pip, and the 50-spoon reward on the first card", () => {
    const source = fs.readFileSync("src/ui/seasonalGiftView.js", "utf8");
    expect(source).toContain('t("seasonalGift.eyebrow")');
    expect(source).toContain('t("seasonalGift.reward", { count: gift?.spoons || 0 })');
    expect(source).toContain("pip-chuseok-welcome-gift-v1.webp");
    expect(source).toContain('art.dataset.assetId = "pip-chuseok-welcome-gift-v1"');
    expect(source).toContain('button.addEventListener("click", onClose)');
    expect(ko.seasonalGift.eyebrow).toContain("한국 명절 추석");
    expect(ko.seasonalGift.reward).toContain("+{count}");
    expect(en.seasonalGift.eyebrow).toContain("Korean Chuseok");
  });
});
