import { beforeEach, describe, expect, it } from "vitest";
import { JAR_SHELVES, PANTRY_JARS, getStarterJarIds } from "../src/data/pantryJars.js";
import {
  buyJar,
  ensureStarterJars,
  getCompletedPantryJarShelfCount,
  getCompletedPantryStoryGoalIds,
  getEquippedJars,
  getOwnedJarIds,
  getPantrySpoons,
  loadSave,
  saveGame,
  setActivePlayerName,
  setEquippedJar
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

  it("buys paid jars atomically but advances a stage step only when the shelf is complete", () => {
    ensureStarterJars();
    saveGame({ ...loadSave(), pantrySpoons: 500 });
    const before = getOwnedJarIds();

    expect(buyJar("blueberry-jam")).toEqual(expect.objectContaining({ ok: true, balance: 488 }));
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
