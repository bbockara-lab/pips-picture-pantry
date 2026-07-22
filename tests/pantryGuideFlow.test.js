import { describe, expect, it } from "vitest";
import { getNextPantryGuideId } from "../src/ui/pantryGuideFlow.js";

function seenGuideLookup(...guideIds) {
  const seen = new Set(guideIds);
  return (guideId) => seen.has(guideId);
}

describe("pantry guide flow", () => {
  it("keeps the room story first when its request just completed", () => {
    expect(getNextPantryGuideId({
      completedRequestCount: 3,
      storyCompleted: true,
      hasSeen: seenGuideLookup()
    })).toBe("pantryRoomStory");
  });

  it("shows the first-purchase guide before an eligible neighbor", () => {
    expect(getNextPantryGuideId({
      completedRequestCount: 3,
      storyCompleted: false,
      hasSeen: seenGuideLookup("pantryRoomStory")
    })).toBe("pantryFirstPurchase");
  });

  it("reveals unseen neighbors in milestone order", () => {
    const baseSeen = ["pantryRoomStory", "pantryFirstPurchase"];
    expect(getNextPantryGuideId({
      completedRequestCount: 10,
      hasSeen: seenGuideLookup(...baseSeen)
    })).toBe("pantryNeighborMrPark");
    expect(getNextPantryGuideId({
      completedRequestCount: 10,
      hasSeen: seenGuideLookup(...baseSeen, "pantryNeighborMrPark")
    })).toBe("pantryNeighborLily");
    expect(getNextPantryGuideId({
      completedRequestCount: 10,
      hasSeen: seenGuideLookup(...baseSeen, "pantryNeighborMrPark", "pantryNeighborLily")
    })).toBe("pantryNeighborMateo");
  });

  it("returns null after every eligible guide has been seen", () => {
    expect(getNextPantryGuideId({
      completedRequestCount: 10,
      hasSeen: seenGuideLookup(
        "pantryRoomStory",
        "pantryFirstPurchase",
        "pantryNeighborMrPark",
        "pantryNeighborLily",
        "pantryNeighborMateo"
      )
    })).toBeNull();
  });
});
