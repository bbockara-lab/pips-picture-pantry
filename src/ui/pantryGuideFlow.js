export function getNextPantryGuideId({
  completedRequestCount = 0,
  hasSeen = () => false
} = {}) {
  if (Number(completedRequestCount || 0) > 0 && !hasSeen("pantryFirstPurchase")) {
    return "pantryFirstPurchase";
  }
  return null;
}
