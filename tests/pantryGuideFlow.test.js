import { describe, expect, it } from "vitest";
import { getNextPantryGuideId } from "../src/ui/pantryGuideFlow.js";

function seenGuideLookup(...guideIds) {
  const seen = new Set(guideIds);
  return (guideId) => seen.has(guideId);
}

describe("pantry guide flow", () => {
  it("shows the current home-display guide after the first paid collectible", () => {
    expect(getNextPantryGuideId({
      completedRequestCount: 1,
      hasSeen: seenGuideLookup()
    })).toBe("pantryFirstPurchase");
  });

  it("does not show a purchase guide before a paid collectible exists", () => {
    expect(getNextPantryGuideId({
      completedRequestCount: 0,
      hasSeen: seenGuideLookup()
    })).toBeNull();
  });

  it("does not revive retired room and neighbor popups at later collection counts", () => {
    expect(getNextPantryGuideId({
      completedRequestCount: 10,
      hasSeen: seenGuideLookup("pantryFirstPurchase")
    })).toBeNull();
  });
});
