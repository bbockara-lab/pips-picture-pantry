import { beforeEach, describe, expect, it } from "vitest";
import { getLanguagePreference, setLanguagePreference, t } from "../src/i18n/index.js";
import { loadPuzzleState, savePuzzleState, setActivePlayerName } from "../src/game/save.js";

class LocalStorageMock {
  constructor() {
    this.store = new Map();
  }

  getItem(key) {
    return this.store.get(key) || null;
  }

  setItem(key, value) {
    this.store.set(key, String(value));
  }
}

describe("language changes during a puzzle", () => {
  beforeEach(() => {
    globalThis.localStorage = new LocalStorageMock();
    setActivePlayerName("Friend");
    setLanguagePreference("en", "en-US");
  });

  it("keeps the active board and the selected in-app language independent", () => {
    const state = {
      puzzleId: "pips-first-shelf-pip-face-1",
      size: 5,
      mode: "fill",
      cursor: { row: 2, column: 3 },
      completed: false,
      history: [],
      cells: Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 5 }, (_, column) => row === 2 && column === 3 ? "filled" : "empty")
      )
    };
    savePuzzleState(state);

    setLanguagePreference("ko", "en-US");

    expect(getLanguagePreference()).toBe("ko");
    expect(t("controls.fill")).toBe("\uce60\ud558\uae30");
    expect(loadPuzzleState(state.puzzleId)).toMatchObject({
      mode: "fill",
      cursor: { row: 2, column: 3 },
      cells: expect.arrayContaining([expect.arrayContaining(["filled"])])
    });
  });
});
