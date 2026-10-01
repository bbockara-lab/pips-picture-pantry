import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getControlModePreference,
  getCursorTrailPreference,
  setControlModePreference,
  setCursorTrailPreference
} from "../src/ui/preferences.js";

function createStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: vi.fn((key) => values.has(key) ? values.get(key) : null),
    setItem: vi.fn((key, value) => values.set(key, String(value)))
  };
}

describe("Trail Paint preference", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createStorage());
  });

  it("defaults to enabled", () => {
    expect(getCursorTrailPreference()).toBe(true);
  });

  it("persists an explicit opt-out and can be enabled again", () => {
    setCursorTrailPreference(false);
    expect(getCursorTrailPreference()).toBe(false);
    setCursorTrailPreference(true);
    expect(getCursorTrailPreference()).toBe(true);
  });
});

describe("puzzle control preference", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createStorage());
  });

  it("starts a new player with direct cell taps", () => {
    expect(getControlModePreference()).toBe("direct");
  });

  it("keeps a returning player's explicit choice", () => {
    setControlModePreference("cursor");
    expect(getControlModePreference()).toBe("cursor");
  });

  it("falls back to direct taps for an invalid stored choice", () => {
    setControlModePreference("invalid");
    expect(getControlModePreference()).toBe("direct");
  });
});
