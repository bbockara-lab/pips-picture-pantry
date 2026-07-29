import { beforeEach, describe, expect, it } from "vitest";
import { JAR_SHELVES, PANTRY_JARS, getStarterJarIds } from "../src/data/pantryJars.js";
import {
  buyJar,
  ensureStarterJars,
  getCompletedPantryStoryGoalIds,
  getEquippedJars,
  getOwnedJarIds,
  getPantrySpoons,
  loadSave,
  saveGame,
  setActivePlayerName,
  setEquippedJar
} from "../src/game/save.js";

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
  it("defines four shelves with six jars and one starter each", () => {
    expect(JAR_SHELVES).toHaveLength(4);
    expect(PANTRY_JARS).toHaveLength(24);
    JAR_SHELVES.forEach((shelf) => {
      const jars = PANTRY_JARS.filter((jar) => jar.shelfId === shelf.id);
      expect(jars).toHaveLength(6);
      expect(jars.filter((jar) => jar.rarity === "starter")).toHaveLength(1);
    });
  });

  it("grants and equips starters idempotently without stage progress", () => {
    ensureStarterJars();
    ensureStarterJars();
    expect(getOwnedJarIds().sort()).toEqual(getStarterJarIds().sort());
    expect(Object.keys(getEquippedJars()).sort()).toEqual(JAR_SHELVES.map((shelf) => shelf.id).sort());
    expect(getCompletedPantryStoryGoalIds()).toEqual([]);
  });

  it("buys a paid jar atomically and records one stage step", () => {
    ensureStarterJars();
    saveGame({ ...loadSave(), pantrySpoons: 20 });
    expect(buyJar("blueberry-jam")).toEqual(expect.objectContaining({ ok: true, balance: 8 }));
    expect(getPantrySpoons()).toBe(8);
    expect(getOwnedJarIds()).toContain("blueberry-jam");
    expect(getCompletedPantryStoryGoalIds()).toEqual(["blueberry-jam"]);
    expect(buyJar("blueberry-jam")).toEqual(expect.objectContaining({ ok: false, reason: "already-owned" }));
    expect(getPantrySpoons()).toBe(8);
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
