import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCursorTrailPreference, setCursorTrailPreference } from "../src/ui/preferences.js";

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
