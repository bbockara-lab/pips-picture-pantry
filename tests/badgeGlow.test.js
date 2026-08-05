import { describe, expect, it } from "vitest";
import {
  consumeJustEarnedBadgeId,
  getBadgeSlotClassName,
  rememberJustEarnedBadgeId
} from "../src/ui/mapView.js";

class SessionStorageMock {
  constructor() { this.store = new Map(); }
  getItem(key) { return this.store.has(key) ? this.store.get(key) : null; }
  setItem(key, value) { this.store.set(key, String(value)); }
  removeItem(key) { this.store.delete(key); }
}

describe("badge earned glow state", () => {
  it("consumes the newly earned badge id once", () => {
    const storage = new SessionStorageMock();
    rememberJustEarnedBadgeId("badge-pip-full-pantry", storage);
    expect(consumeJustEarnedBadgeId(storage)).toBe("badge-pip-full-pantry");
    expect(consumeJustEarnedBadgeId(storage)).toBe("");
  });

  it("adds the one-time glow class only to the matching earned slot", () => {
    const status = { earned: true, badge: { id: "badge-pip-full-pantry" } };
    expect(getBadgeSlotClassName(status, "badge-pip-full-pantry")).toBe("badge-slot earned badge-slot--just-earned");
    expect(getBadgeSlotClassName(status, "badge-other")).toBe("badge-slot earned");
    expect(getBadgeSlotClassName({ ...status, earned: false }, "badge-other")).toBe("badge-slot locked");
  });
});
