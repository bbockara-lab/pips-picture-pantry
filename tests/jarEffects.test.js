import { describe, expect, it } from "vitest";
import { applyJarCompletionEffect, getJarEffectProgress } from "../src/game/jarEffects.js";

function makeSave(overrides = {}) {
  return {
    pantrySpoons: 0,
    jarEffectProgress: {},
    jarEffectCompletionKeys: [],
    jarEffectDaily: { date: "2026-08-11", count: 0 },
    ...overrides
  };
}

const commonJar = { id: "common-a", rarity: "common" };
const rareJar = { id: "rare-a", rarity: "rare" };

describe("pantry jar completion effects", () => {
  it("awards one spoon on the eighth distinct completion for a common jar", () => {
    const save = makeSave();
    for (let index = 1; index <= 7; index += 1) {
      expect(applyJarCompletionEffect(save, commonJar, `normal:p${index}`, "2026-08-11").jarEffectReward).toBe(0);
    }
    const result = applyJarCompletionEffect(save, commonJar, "normal:p8", "2026-08-11");
    expect(result).toMatchObject({ jarEffectReward: 1, jarEffectAdvanced: true, jarEffectTriggered: true, jarEffectProgress: 0, jarEffectDailyCount: 1 });
    expect(save.pantrySpoons).toBe(1);
  });

  it("does not count the same completion key twice", () => {
    const save = makeSave();
    applyJarCompletionEffect(save, commonJar, "normal:p1", "2026-08-11");
    applyJarCompletionEffect(save, commonJar, "normal:p1", "2026-08-11");
    expect(getJarEffectProgress(save, commonJar, "2026-08-11").progress).toBe(1);
  });

  it("banks progress and consumes completion keys after the daily payout limit", () => {
    const save = makeSave({
      jarEffectProgress: { "common-a": 3 },
      jarEffectDaily: { date: "2026-08-11", count: 1 }
    });
    const result = applyJarCompletionEffect(save, commonJar, "normal:held", "2026-08-11");
    expect(save.jarEffectProgress["common-a"]).toBe(4);
    expect(save.jarEffectCompletionKeys).toContain("normal:held");
    expect(result).toMatchObject({
      jarEffectAdvanced: true,
      jarEffectTriggered: false,
      jarEffectReward: 0,
      jarEffectDailyCount: 1
    });
  });

  it("carries threshold overflow into the next eligible payout day", () => {
    const save = makeSave({
      jarEffectProgress: { "common-a": 7 },
      jarEffectDaily: { date: "2026-08-11", count: 1 }
    });

    applyJarCompletionEffect(save, commonJar, "normal:banked-1", "2026-08-11");
    applyJarCompletionEffect(save, commonJar, "normal:banked-2", "2026-08-11");
    expect(save.jarEffectProgress["common-a"]).toBe(9);
    expect(save.pantrySpoons).toBe(0);

    const nextDay = applyJarCompletionEffect(save, commonJar, "daily:2026-08-12", "2026-08-12");
    expect(nextDay).toMatchObject({ jarEffectTriggered: true, jarEffectReward: 1, jarEffectProgress: 2 });
    expect(save.jarEffectProgress["common-a"]).toBe(2);
    expect(save.pantrySpoons).toBe(1);
  });

  it("keeps progress independently for every jar", () => {
    const save = makeSave();
    applyJarCompletionEffect(save, commonJar, "normal:p1", "2026-08-11");
    applyJarCompletionEffect(save, rareJar, "daily:p2:2026-08-11", "2026-08-11");
    expect(save.jarEffectProgress).toEqual({ "common-a": 1, "rare-a": 1 });
  });

  it("does nothing for a starter jar without a rarity effect", () => {
    const save = makeSave();
    const result = applyJarCompletionEffect(save, { id: "starter" }, "normal:p1", "2026-08-11");
    expect(result.jarEffectReward).toBe(0);
    expect(save.jarEffectCompletionKeys).toEqual([]);
  });
});
