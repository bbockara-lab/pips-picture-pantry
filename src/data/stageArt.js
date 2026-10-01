import pipsFirstShelfRewardUrl from "../assets/stage-rewards/pips-first-shelf-reward-v1.webp";
import sunnySpoonSignRewardUrl from "../assets/stage-rewards/sunny-spoon-sign-reward-v1.webp";
import apronDrawerRewardUrl from "../assets/stage-rewards/apron-drawer-reward-v1.webp";
import bakeryWindowRewardUrl from "../assets/stage-rewards/bakery-window-reward-v1.webp";
import villagePantryRewardUrl from "../assets/stage-rewards/village-pantry-reward-v1.webp";
import cozyWorkshopMorningTableRewardUrl from "../assets/stage-rewards/cozy-workshop-morning-table-reward-v1.jpg";
import cozyWorkshopBakingBenchRewardUrl from "../assets/stage-rewards/cozy-workshop-baking-bench-reward-v1.jpg";
import cozyWorkshopGardenNookRewardUrl from "../assets/stage-rewards/cozy-workshop-garden-nook-reward-v1.jpg";
import cozyWorkshopVillageCartRewardUrl from "../assets/stage-rewards/cozy-workshop-village-cart-reward-v1.jpg";
import cozyWorkshopStarlightShelfRewardUrl from "../assets/stage-rewards/cozy-workshop-starlight-shelf-reward-v1.jpg";

const approvedStageArtUrls = Object.freeze({
  "pips-first-shelf": pipsFirstShelfRewardUrl,
  "sunny-spoon-sign": sunnySpoonSignRewardUrl,
  "apron-drawer": apronDrawerRewardUrl,
  "bakery-window": bakeryWindowRewardUrl,
  "village-pantry": villagePantryRewardUrl,
  "cozy-workshop-morning-table": cozyWorkshopMorningTableRewardUrl,
  "cozy-workshop-baking-bench": cozyWorkshopBakingBenchRewardUrl,
  "cozy-workshop-garden-nook": cozyWorkshopGardenNookRewardUrl,
  "cozy-workshop-village-cart": cozyWorkshopVillageCartRewardUrl,
  "cozy-workshop-starlight-shelf": cozyWorkshopStarlightShelfRewardUrl
});

export function getStageArtUrl(packId) {
  return approvedStageArtUrls[packId] || null;
}

export function hasApprovedStageArt(packId) {
  return Boolean(approvedStageArtUrls[packId]);
}
