import { beforeEach, describe, expect, it } from "vitest";
import {
  getActivePlayerName,
  getCompletedPuzzleIds,
  getCompletionDates,
  getPlayerRecords,
  hasActivePlayer,
  getPantrySpoons,
  getUnlockedPackIds,
  loadSave,
  markPackCompletedIfFirst,
  saveGame,
  savePuzzleState,
  setActivePlayerName,
  unlockPack
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

describe("player save profiles", () => {
  beforeEach(() => {
    globalThis.localStorage = new LocalStorageMock();
  });

  it("creates an active player from a display name", () => {
    const player = setActivePlayerName("Jay");

    expect(player).toEqual({ id: "jay", name: "Jay" });
    expect(hasActivePlayer()).toBe(true);
    expect(getActivePlayerName()).toBe("Jay");
    expect(getPlayerRecords()).toHaveLength(1);
  });

  it("keeps progress separate by player name", () => {
    setActivePlayerName("Jay");
    saveGame({ puzzleStates: {}, completedPuzzleIds: ["pip-face-5"] });

    setActivePlayerName("Mina");
    expect(getCompletedPuzzleIds()).toEqual([]);
    saveGame({ puzzleStates: {}, completedPuzzleIds: ["soup-bowl-5"] });

    setActivePlayerName("Jay");
    expect(loadSave().completedPuzzleIds).toEqual(["pip-face-5"]);
  });

  it("migrates legacy progress into the first named profile", () => {
    localStorage.setItem("pips-picture-pantry:v0.1:save", JSON.stringify({
      puzzleStates: {},
      completedPuzzleIds: ["pip-face-5"]
    }));

    setActivePlayerName("Jay");

    expect(getCompletedPuzzleIds()).toEqual(["pip-face-5"]);
  });

  it("awards spoons once and unlocks progression stages", () => {
    setActivePlayerName("Jay");
    const completedState = {
      puzzleId: "pips-first-shelf-pip-face-1",
      size: 5,
      mode: "fill",
      completed: true,
      history: [],
      cells: Array.from({ length: 5 }, () => Array(5).fill("empty"))
    };

    savePuzzleState(completedState, { reward: 3 });
    expect(getPantrySpoons()).toBe(3);
    expect(loadSave().completedPuzzleIds).toEqual(["pips-first-shelf-pip-face-1"]);
    expect(getCompletionDates()["pips-first-shelf-pip-face-1"]).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    savePuzzleState(completedState, { reward: 3 });
    expect(getPantrySpoons()).toBe(3);

    saveGame({ ...loadSave(), pantrySpoons: 24 });
    expect(unlockPack({ id: "sunny-spoon-sign", access: "unlockable", unlockCost: 24 })).toBe(true);
    expect(getPantrySpoons()).toBe(0);
    expect(getUnlockedPackIds()).toContain("sunny-spoon-sign");
  });

  it("tracks stage completion celebrations once", () => {
    setActivePlayerName("Jay");

    expect(markPackCompletedIfFirst("pips-first-shelf")).toBe(true);
    expect(markPackCompletedIfFirst("pips-first-shelf")).toBe(false);
    expect(loadSave().completedPackIds).toEqual(["pips-first-shelf"]);
  });

});
