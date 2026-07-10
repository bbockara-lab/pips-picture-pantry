import pipsFirstShelfRewardUrl from "../assets/stage-rewards/pips-first-shelf-reward-v1.webp";
import sunnySpoonSignRewardUrl from "../assets/stage-rewards/sunny-spoon-sign-reward-v1.webp";
import apronDrawerRewardUrl from "../assets/stage-rewards/apron-drawer-reward-v1.webp";
import bakeryWindowRewardUrl from "../assets/stage-rewards/bakery-window-reward-v1.webp";
import villagePantryRewardUrl from "../assets/stage-rewards/village-pantry-reward-v1.webp";

const approvedStageArtUrls = Object.freeze({
  "pips-first-shelf": pipsFirstShelfRewardUrl,
  "sunny-spoon-sign": sunnySpoonSignRewardUrl,
  "apron-drawer": apronDrawerRewardUrl,
  "bakery-window": bakeryWindowRewardUrl,
  "village-pantry": villagePantryRewardUrl
});

export function getStageArtUrl(packId) {
  return approvedStageArtUrls[packId] || null;
}

export function hasApprovedStageArt(packId) {
  return Boolean(approvedStageArtUrls[packId]);
}
