import { beforeEach, describe, expect, it } from "vitest";
import {
  getActivePlayerName,
  getCompletedPuzzleIds,
  getPlayerRecords,
  hasActivePlayer,
  loadSave,
  saveGame,
  setActivePlayerName
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
});
