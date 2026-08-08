import { beforeEach, describe, expect, it } from "vitest";
import { JAR_SHELVES, PANTRY_JARS, getStarterJarIds } from "../src/data/pantryJars.js";
import {
  buyJar,
  ensureStarterJars,
  getCompletedPantryJarShelfCount,
  getCompletedPantryStoryGoalIds,
  getEquippedJars,
  getEquippedJarForCurrentStage,
  getFeaturedJarId,
  getOwnedJarIds,
  getPantrySpoons,
  loadSave,
  saveGame,
  setActivePlayerName,
  setEquippedJar,
  setFeaturedJar
} from "../src/game/save.js";
import { isShelfCompletionTransition } from "../src/ui/pantryView.js";

class LocalStorageMock {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

beforeEach(() => {
  globalThis.localStorage = new LocalStorageMock();
  setActivePlayerName("Jar Tester");
});

describe("Pantry jar collection", () => {
  it("defines eight shelves with six jars and one starter each", () => {
    expect(JAR_SHELVES).toHaveLength(8);
    expect(PANTRY_JARS).toHaveLength(48);
    expect(PANTRY_JARS.filter((jar) => jar.cost > 0)).toHaveLength(40);
    expect(PANTRY_JARS.reduce((total, jar) => total + jar.cost, 0)).toBe(3310);
    JAR_SHELVES.forEach((shelf) => {
      const jars = PANTRY_JARS.filter((jar) => jar.shelfId === shelf.id);
      expect(jars).toHaveLength(6);
      expect(jars.filter((jar) => jar.rarity === "starter")).toHaveLength(1);
    });
  });

  it("uses progressively stronger late-game shelf pricing", () => {
    const paidCosts = (shelfId) => PANTRY_JARS
      .filter((jar) => jar.shelfId === shelfId && jar.cost > 0)
      .map((jar) => jar.cost);
    const total = (shelfId) => paidCosts(shelfId).reduce((sum, cost) => sum + cost, 0);

    expect(paidCosts("pickle")).toEqual([25, 25, 65, 90, 135]);
    expect(paidCosts("fruit")).toEqual([65, 65, 100, 140, 200]);
    expect(paidCosts("oil")).toEqual([75, 75, 120, 170, 240]);
    expect(paidCosts("tea")).toEqual([90, 90, 140, 200, 300]);
    expect(["pickle", "fruit", "oil", "tea"].map(total)).toEqual([340, 570, 680, 820]);
  });

  it("grants and equips starters idempotently without stage progress", () => {
    ensureStarterJars();
    ensureStarterJars();
    expect(getOwnedJarIds().sort()).toEqual(getStarterJarIds().sort());
    expect(Object.keys(getEquippedJars()).sort()).toEqual(JAR_SHELVES.map((shelf) => shelf.id).sort());
    expect(getCompletedPantryStoryGoalIds()).toEqual([]);
  });

  it("resolves the selected jar for the active stage shelf and hides ungated stages", () => {
    ensureStarterJars();
    expect(getEquippedJarForCurrentStage({ pantryRoomStepRequired: 0 })).toBeNull();
    expect(getEquippedJarForCurrentStage({ pantryRoomStepRequired: 5 })).toEqual(
      expect.objectContaining({ id: "strawberry-jam", shelfId: "jam" })
    );
    expect(getEquippedJarForCurrentStage({ pantryRoomStepRequired: 10 })).toEqual(
      expect.objectContaining({ id: "acacia-honey", shelfId: "honey" })
    );
    saveGame({
      ...loadSave(),
      ownedJarIds: [...getOwnedJarIds(), "blueberry-jam"],
      equippedJars: { ...getEquippedJars(), jam: "blueberry-jam" }
    });
    expect(getEquippedJarForCurrentStage({ pantryRoomStepRequired: 5 })).toEqual(
      expect.objectContaining({ id: "blueberry-jam", shelfId: "jam" })
    );
  });
  it("persists a separately selected home display jar and rejects unowned jars", () => {
    ensureStarterJars();
    expect(getFeaturedJarId()).toBeNull();
    expect(setFeaturedJar("orange-marmalade")).toBe(false);
    expect(getFeaturedJarId()).toBeNull();
    expect(setFeaturedJar("strawberry-jam")).toBe(true);
    expect(getFeaturedJarId()).toBe("strawberry-jam");
    expect(getEquippedJars().jam).toBe("strawberry-jam");
  });

  it("buys paid jars atomically but advances a stage step only when the shelf is complete", () => {
    ensureStarterJars();
    saveGame({ ...loadSave(), pantrySpoons: 500 });
    const before = getOwnedJarIds();

    expect(buyJar("blueberry-jam")).toEqual(expect.objectContaining({ ok: true, balance: 485 }));
    expect(getCompletedPantryJarShelfCount()).toBe(0);
    expect(getCompletedPantryStoryGoalIds()).toEqual([]);

    ["cherry-jam", "orange-marmalade", "lemon-curd", "peach-preserve"].forEach((jarId) => {
      expect(buyJar(jarId)).toEqual(expect.objectContaining({ ok: true }));
    });
    const after = getOwnedJarIds();
    expect(getCompletedPantryJarShelfCount()).toBe(1);
    expect(isShelfCompletionTransition("jam", before, after)).toBe(true);
    expect(isShelfCompletionTransition("jam", after, after)).toBe(false);
    expect(buyJar("blueberry-jam")).toEqual(expect.objectContaining({ ok: false, reason: "already-owned" }));
  });

  it("does not mutate state when balance is insufficient and equips only owned jars", () => {
    ensureStarterJars();
    expect(buyJar("orange-marmalade")).toEqual(expect.objectContaining({ ok: false, reason: "insufficient" }));
    expect(getOwnedJarIds()).not.toContain("orange-marmalade");
    expect(setEquippedJar("jam", "orange-marmalade")).toBe(false);
    expect(setEquippedJar("honey", "strawberry-jam")).toBe(false);
    expect(setEquippedJar("jam", "strawberry-jam")).toBe(true);
  });
});
