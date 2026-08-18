import { describe, expect, it } from "vitest";
import { JAR_SHELVES, getJarsByShelf } from "../src/data/pantryJars.js";
import {
  applyPantryGrowthBonus,
  getPantryGrowthBonusChance,
  getPantryGrowthBonusStatus
} from "../src/game/jarEffects.js";

function ownedForShelves(count) {
  return JAR_SHELVES.slice(0, count).flatMap((shelf) =>
    getJarsByShelf(shelf.id).filter((jar) => jar.cost > 0).map((jar) => jar.id)
  );
}

function makeSave(overrides = {}) {
  return {
    pantrySpoons: 0,
    ownedJarIds: [],
    pantryBonusCompletionKeys: [],
    ...overrides
  };
}

describe("pantry growth spoon bonus", () => {
  it("front-loads the 24-shelf curve and caps at 26 percent", () => {
    expect(Array.from({ length: 15 }, (_, count) => getPantryGrowthBonusChance(count))).toEqual([
      0, 5, 7, 9, 10, 11, 12, 13, 13, 14, 14, 15, 15, 16, 16
    ]);
    expect(getPantryGrowthBonusChance(15)).toBe(17);
    expect(getPantryGrowthBonusChance(24)).toBe(26);
    expect(getPantryGrowthBonusChance(99)).toBe(26);
  });

  it("stays monotonic across every planned level and normalizes unusual input", () => {
    const planned = Array.from({ length: 25 }, (_, count) => getPantryGrowthBonusChance(count));
    planned.slice(1).forEach((chance, index) => {
      expect(chance).toBeGreaterThanOrEqual(planned[index]);
    });
    expect(getPantryGrowthBonusChance(-1)).toBe(0);
    expect(getPantryGrowthBonusChance(Number.NaN)).toBe(0);
    expect(getPantryGrowthBonusChance(Number.POSITIVE_INFINITY)).toBe(26);
  });

  it("counts only fully completed paid pantry shelves", () => {
    const firstShelf = JAR_SHELVES[0];
    const paidIds = getJarsByShelf(firstShelf.id).filter((jar) => jar.cost > 0).map((jar) => jar.id);
    const partial = makeSave({ ownedJarIds: paidIds.slice(0, -1) });
    const complete = makeSave({ ownedJarIds: paidIds });

    expect(getPantryGrowthBonusStatus(partial)).toMatchObject({ completedShelves: 0, chance: 0 });
    expect(getPantryGrowthBonusStatus(complete)).toMatchObject({
      completedShelves: 1,
      futureShelfCap: 24,
      chance: 5,
      reward: 1
    });
  });

  it("awards one spoon when an independent roll is below the current chance", () => {
    const save = makeSave({ ownedJarIds: ownedForShelves(1) });
    const result = applyPantryGrowthBonus(save, "normal:p1", 0.049);

    expect(result).toMatchObject({
      pantryBonusTriggered: true,
      pantryBonusReward: 1,
      pantryBonusChance: 5,
      completedPantryShelves: 1
    });
    expect(save.pantrySpoons).toBe(1);
    expect(save.pantryBonusCompletionKeys).toEqual(["normal:p1"]);
  });

  it("treats the chance boundary as a miss and never rerolls the same completion", () => {
    const save = makeSave({ ownedJarIds: ownedForShelves(1) });

    expect(applyPantryGrowthBonus(save, "normal:p1", 0.05).pantryBonusTriggered).toBe(false);
    expect(applyPantryGrowthBonus(save, "normal:p1", 0).pantryBonusTriggered).toBe(false);
    expect(save.pantrySpoons).toBe(0);
    expect(save.pantryBonusCompletionKeys).toEqual(["normal:p1"]);
  });

  it("uses the account-wide shelf rate regardless of which collectible is displayed", () => {
    const save = makeSave({ ownedJarIds: ownedForShelves(3), featuredJarId: "starter-jam-jar" });
    expect(getPantryGrowthBonusStatus(save)).toMatchObject({ completedShelves: 3, chance: 9 });

    save.featuredJarId = "blueberry-jam";
    expect(getPantryGrowthBonusStatus(save)).toMatchObject({ completedShelves: 3, chance: 9 });
  });
});
