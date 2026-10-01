import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseReferralCode, rememberReferralUrl, syncReferralMailbox } from "../src/game/referrals.js";
import { claimReferralMailboxReward, getPantrySpoons, getReferralMailboxMessages, mergeReferralMailboxMessages, prepareReferralClaimNonce, setActivePlayerName } from "../src/game/save.js";

class StorageMock {
  constructor() { this.store = new Map(); }
  getItem(key) { return this.store.get(key) ?? null; }
  setItem(key, value) { this.store.set(key, String(value)); }
  removeItem(key) { this.store.delete(key); }
}

describe("friend referral rewards", () => {
  beforeEach(() => {
    globalThis.localStorage = new StorageMock();
    setActivePlayerName("Pip");
  });

  it("accepts only the invite deep-link formats and normalized code", () => {
    expect(parseReferralCode("pipspicturepantry://invite?ref=ABCD2345")).toBe("ABCD2345");
    expect(parseReferralCode("https://sunny-spoon-pantry.web.app/invite/?ref=abcd2345")).toBe("ABCD2345");
    expect(parseReferralCode("https://example.com/?ref=ABCD2345")).toBeNull();
  });

  it("redeems a remembered code and stores server-issued reward mail", async () => {
    rememberReferralUrl("pipspicturepantry://invite?ref=ABCD2345");
    const replies = [
      { referralCode: "WXYZ6789" },
      { accepted: true },
      { messages: [{ id: "reward-friend", role: "friend", spoons: 50, claimed: false }] }
    ];
    const fetchImpl = vi.fn(async () => ({ ok: true, json: async () => replies.shift() }));
    const result = await syncReferralMailbox({ fetchImpl });
    expect(result.newCount).toBe(1);
    expect(getReferralMailboxMessages()).toMatchObject([{ id: "reward-friend", spoons: 50, claimed: false }]);
  });

  it("adds a reward to the spoon balance exactly once", () => {
    mergeReferralMailboxMessages([{ id: "reward", role: "friend", spoons: 50, claimed: false }]);
    const nonce = prepareReferralClaimNonce("reward");
    expect(nonce).toMatch(/^[a-f0-9]{32}$/);
    expect(prepareReferralClaimNonce("reward")).toBe(nonce);
    expect(claimReferralMailboxReward("reward")).toMatchObject({ claimed: true, spoons: 50, balance: 50 });
    expect(claimReferralMailboxReward("reward")).toMatchObject({ claimed: false, spoons: 0, balance: 50 });
    expect(getPantrySpoons()).toBe(50);
  });
});
