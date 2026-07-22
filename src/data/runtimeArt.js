const APPROVED_GUIDE_ART_IDS = new Set(["pip-chrome-v2"]);
const APPROVED_STUDIO_BUMPER_ART_IDS = new Set(["sunny-spoon-studios-bumper-v1"]);
const APPROVED_QUICK_TRAVEL_ART_IDS = new Set([
  "quick-travel-puzzle-v1",
  "quick-travel-album-v1",
  "quick-travel-pantry-v1",
  "quick-travel-time-attack-v1",
  "quick-travel-map-v1"
]);

export function isRuntimeGuideArtApproved(assetId) {
  return APPROVED_GUIDE_ART_IDS.has(assetId);
}

export function isRuntimeStudioBumperArtApproved(assetId) {
  return APPROVED_STUDIO_BUMPER_ART_IDS.has(assetId);
}

export function isRuntimeQuickTravelArtApproved(assetId) {
  return APPROVED_QUICK_TRAVEL_ART_IDS.has(assetId);
}

const APPROVED_PANTRY_DECORATION_ASSET_IDS = new Set([
  "starter-counter-cloth-v2",
  "sunny-window-curtains-v2",
  "recipe-card-shelf-v2",
  "mint-check-rug-v2",
  "small-jam-jar-v1",
  "herb-pot-v1",
  "cork-board-v1",
  "tiny-succulent-v1",
  "spoon-wall-clock-v1",
  "berry-tea-tins-v1",
  "ribbon-rolling-pin-v1",
  "flower-window-vase-v1",
  "woven-pantry-basket-v1",
  "honey-cake-stand-v1",
  "lace-window-lantern-v1",
  "copper-cookie-tin-v1",
  "plush-floor-cushion-v1",
  "framed-recipe-glow-v1",
  "golden-waffle-press-v1",
  "stained-glass-suncatcher-v1",
  "porcelain-spice-carousel-v1",
  "pantry-delivery-cart-v1",
  "spoon-wall-tapestry-v1",
  "soup-pot-display-v2",
  "golden-spoon-sign-v2"
]);

export function isRuntimePantryDecorationArtApproved(assetId) {
  return APPROVED_PANTRY_DECORATION_ASSET_IDS.has(assetId);
}
