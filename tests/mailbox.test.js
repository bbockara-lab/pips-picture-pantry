import { beforeEach, describe, expect, it } from "vitest";
import { MAILBOX_MESSAGES, getUnlockedMailboxMessages } from "../src/data/mailboxMessages.js";
import { getReadMailboxMessageIds, markMailboxMessageRead, setActivePlayerName } from "../src/game/save.js";

class LocalStorageMock {
  constructor() { this.store = new Map(); }
  getItem(key) { return this.store.has(key) ? this.store.get(key) : null; }
  setItem(key, value) { this.store.set(key, String(value)); }
  removeItem(key) { this.store.delete(key); }
  clear() { this.store.clear(); }
}

describe("Pip's Mailbox", () => {
  beforeEach(() => { globalThis.localStorage = new LocalStorageMock(); });

  it("ships a developer letter and archives every existing guide story", () => {
    expect(MAILBOX_MESSAGES[0]).toMatchObject({ id: "developer-welcome-2026-08", kind: "letter" });
    expect(MAILBOX_MESSAGES.filter((message) => message.guideId)).toHaveLength(11);
  });

  it("archives story messages only after their in-game guide has been seen", () => {
    const seen = new Set(["puzzle", "pantryNeighborMrPark"]);
    const messages = getUnlockedMailboxMessages("all", (guideId) => seen.has(guideId));
    expect(messages.map((message) => message.id)).toEqual([
      "developer-welcome-2026-08",
      "guide-puzzle",
      "story-mr-park"
    ]);
    expect(messages.some((message) => message.id === "story-lily")).toBe(false);
    expect(messages.some((message) => message.id === "story-mateo")).toBe(false);
  });

  it("stores stable read message IDs in the active local save", () => {
    setActivePlayerName("Mailbox Tester");
    markMailboxMessageRead("developer-welcome-2026-08");
    markMailboxMessageRead("developer-welcome-2026-08");
    expect(getReadMailboxMessageIds()).toEqual(["developer-welcome-2026-08"]);
  });
});
