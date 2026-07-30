import { beforeEach, describe, expect, it } from "vitest";
import { PANTRY_JARS } from "../src/data/pantryJars.js";
import { getSeasonShelfPuzzles, seasonShelves } from "../src/data/seasonShelves.js";
import { loadSave, saveGame, setActivePlayerName } from "../src/game/save.js";
import { getShelfLockConditions } from "../src/ui/puzzleHubView.js";

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
}

describe("stage lock condition guidance", () => {
  beforeEach(() => {
    globalThis.localStorage = new LocalStorageMock();
    setActivePlayerName("Stage Guide Tester");
  });

  it("reports previous-puzzle and paid-Pantry-jar gaps independently", () => {
    const nextShelf = seasonShelves[1];
    const previousPuzzleIds = getSeasonShelfPuzzles(seasonShelves[0]).map((puzzle) => puzzle.id);

    expect(getShelfLockConditions(nextShelf, [])).toEqual(expect.objectContaining({
      puzzle: { met: false, remaining: previousPuzzleIds.length },
      pantry: { met: false, remaining: 5 }
    }));

    const paidJarIds = PANTRY_JARS.filter((jar) => jar.cost > 0).slice(0, 5).map((jar) => jar.id);
    saveGame({ ...loadSave(), ownedJarIds: paidJarIds });

    expect(getShelfLockConditions(nextShelf, previousPuzzleIds)).toEqual(expect.objectContaining({
      puzzle: { met: true, remaining: 0 },
      pantry: { met: true, remaining: 0 }
    }));
  });
});