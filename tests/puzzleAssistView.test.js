import { describe, expect, it } from "vitest";
import { t, setLanguagePreference } from "../src/i18n/index.js";
import { getHintMeterState, getHintTitleText } from "../src/ui/puzzleAssistView.js";

describe("puzzle assist hint copy", () => {
  it("maps remaining starter hints into one visible allowance meter", () => {
    expect(getHintMeterState({ remaining: 3, hintLimit: 4 })).toEqual(["available", "available", "available", "spent"]);
    expect(getHintMeterState({ remaining: 0, hintLimit: 3 })).toEqual(["spent", "spent", "spent"]);
    expect(getHintMeterState({ remaining: 5, hintLimit: 3 })).toEqual(["available", "available", "available"]);
  });

  it("keeps the visible hint title unified across starter and spoon hint states", () => {
    expect(getHintTitleText({ remaining: 1, hintLimit: 3, hintCost: 0 })).toBe("Hints 1/3");
    expect(getHintTitleText({ remaining: 0, hintLimit: 3, hintCost: 6 })).toBe("Hints 0/3");
    expect(getHintTitleText({ remaining: 0, hintLimit: 3, hintCost: 4, timeAttack: true })).toBe("Hints 0/3");
  });

  it("keeps spoon hint copy user-facing without paid or free labels", () => {
    setLanguagePreference("en");
    const englishCopy = [
      t("controls.hintMeterLabel", { count: 0, limit: 3 }),
      t("controls.timeAttackHintIntro", { cost: 4, balance: 12 }),
      t("controls.paidHintIntro", { cost: 9, balance: 12, count: 5 }),
      t("controls.hintConfirmTitle"),
      t("controls.hintConfirmBody", { cost: 9 }),
      t("controls.hintCostLabel", { cost: 9 })
    ].join(" ");
    expect(englishCopy.toLowerCase()).not.toContain("paid");
    expect(englishCopy.toLowerCase()).not.toContain("free");
    expect(englishCopy).toContain("spoons");
    expect(englishCopy).toContain("Starter hints");

    setLanguagePreference("ko");
    const koreanCopy = [
      t("controls.hintMeterLabel", { count: 0, limit: 3 }),
      t("controls.timeAttackHintIntro", { cost: 4, balance: 12 }),
      t("controls.paidHintIntro", { cost: 9, balance: 12, count: 5 }),
      t("controls.hintConfirmTitle"),
      t("controls.hintConfirmBody", { cost: 9 }),
      t("controls.hintCostLabel", { cost: 9 })
    ].join(" ");
    expect(koreanCopy).not.toContain("\uC720\uB8CC");
    expect(koreanCopy).not.toContain("\uBB34\uB8CC");
    expect(koreanCopy).toContain("\uC2A4\uD47C");
    expect(koreanCopy).toContain("\uAE30\uBCF8 \uD78C\uD2B8");
    setLanguagePreference("system");
  });
});
