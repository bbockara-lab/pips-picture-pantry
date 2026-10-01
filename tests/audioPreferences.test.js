import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getAudioPreferences,
  setMusicEnabled,
  setSfxEnabled
} from "../src/ui/audio.js";

function createStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: vi.fn((key) => values.has(key) ? values.get(key) : null),
    setItem: vi.fn((key, value) => values.set(key, String(value))),
    removeItem: vi.fn((key) => values.delete(key)),
    clear: vi.fn(() => values.clear())
  };
}

describe("audio preferences", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createStorage());
  });

  it("starts both sound effects and music enabled when no preference exists", () => {
    expect(getAudioPreferences()).toEqual({ sfx: true, music: true });
  });

  it("preserves explicit opt-out values across an update", () => {
    vi.stubGlobal("localStorage", createStorage({
      "pips-picture-pantry:v0.1:sfx": "false",
      "pips-picture-pantry:v0.1:music": "false"
    }));

    expect(getAudioPreferences()).toEqual({ sfx: false, music: false });
  });

  it("persists later user changes independently", () => {
    setSfxEnabled(false);
    setMusicEnabled(false);
    expect(getAudioPreferences()).toEqual({ sfx: false, music: false });

    setMusicEnabled(true);
    expect(getAudioPreferences()).toEqual({ sfx: false, music: true });
  });
});
