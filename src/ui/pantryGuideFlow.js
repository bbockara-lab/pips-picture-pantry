const PANTRY_NEIGHBOR_GUIDES = [
  { count: 3, guideId: "pantryNeighborMrPark" },
  { count: 6, guideId: "pantryNeighborLily" },
  { count: 10, guideId: "pantryNeighborMateo" }
];

export function getNextPantryGuideId({
  completedRequestCount = 0,
  storyCompleted = false,
  hasSeen = () => false
} = {}) {
  if (storyCompleted && !hasSeen("pantryRoomStory")) {
    return "pantryRoomStory";
  }
  if (!hasSeen("pantryFirstPurchase")) {
    return "pantryFirstPurchase";
  }
  return PANTRY_NEIGHBOR_GUIDES.find(({ count, guideId }) => (
    Number(completedRequestCount || 0) >= count && !hasSeen(guideId)
  ))?.guideId || null;
}
