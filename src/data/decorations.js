import { isRuntimePantryDecorationArtApproved } from "./runtimeArt.js";

export const pantrySlots = [
  { id: "back-wall", titleKey: "pantry.slots.backWall" },
  { id: "counter", titleKey: "pantry.slots.counter" },
  { id: "window", titleKey: "pantry.slots.window" },
  { id: "shelf", titleKey: "pantry.slots.shelf" },
  { id: "floor", titleKey: "pantry.slots.floor" }
];

export const pantryDecorations = [
  { id: "starter-counter-cloth", assetId: "starter-counter-cloth-v2", slot: "counter", cost: 0, titleKey: "pantry.items.starterCounter.title", descriptionKey: "pantry.items.starterCounter.description", rarity: "starter" },
  { id: "sunny-window-curtains", assetId: "sunny-window-curtains-v2", slot: "window", cost: 22, titleKey: "pantry.items.sunnyCurtains.title", descriptionKey: "pantry.items.sunnyCurtains.description", rarity: "common" },
  { id: "recipe-card-shelf", assetId: "recipe-card-shelf-v2", slot: "shelf", cost: 28, titleKey: "pantry.items.recipeShelf.title", descriptionKey: "pantry.items.recipeShelf.description", rarity: "common" },
  { id: "mint-check-rug", assetId: "mint-check-rug-v2", slot: "floor", cost: 35, titleKey: "pantry.items.mintRug.title", descriptionKey: "pantry.items.mintRug.description", rarity: "common" },
  { id: "small-jam-jar", assetId: "small-jam-jar-v1", slot: "counter", cost: 20, titleKey: "pantry.items.smallJamJar.title", descriptionKey: "pantry.items.smallJamJar.description", rarity: "common" },
  { id: "herb-pot", assetId: "herb-pot-v1", slot: "window", cost: 25, titleKey: "pantry.items.herbPot.title", descriptionKey: "pantry.items.herbPot.description", rarity: "common" },
  { id: "cork-board", assetId: "cork-board-v1", slot: "back-wall", cost: 32, titleKey: "pantry.items.corkBoard.title", descriptionKey: "pantry.items.corkBoard.description", rarity: "common" },
  { id: "tiny-succulent", assetId: "tiny-succulent-v1", slot: "shelf", cost: 26, titleKey: "pantry.items.tinySucculent.title", descriptionKey: "pantry.items.tinySucculent.description", rarity: "common" },
  { id: "spoon-wall-clock", assetId: "spoon-wall-clock-v1", slot: "back-wall", cost: 45, titleKey: "pantry.items.spoonWallClock.title", descriptionKey: "pantry.items.spoonWallClock.description", rarity: "common" },
  { id: "berry-tea-tins", assetId: "berry-tea-tins-v1", slot: "shelf", cost: 38, titleKey: "pantry.items.berryTeaTins.title", descriptionKey: "pantry.items.berryTeaTins.description", rarity: "common" },
  { id: "ribbon-rolling-pin", assetId: "ribbon-rolling-pin-v1", slot: "counter", cost: 42, titleKey: "pantry.items.ribbonRollingPin.title", descriptionKey: "pantry.items.ribbonRollingPin.description", rarity: "common" },
  { id: "flower-window-vase", assetId: "flower-window-vase-v1", slot: "window", cost: 48, titleKey: "pantry.items.flowerWindowVase.title", descriptionKey: "pantry.items.flowerWindowVase.description", rarity: "common" },
  { id: "woven-pantry-basket", assetId: "woven-pantry-basket-v1", slot: "floor", cost: 55, titleKey: "pantry.items.wovenPantryBasket.title", descriptionKey: "pantry.items.wovenPantryBasket.description", rarity: "common" },
  { id: "honey-cake-stand", assetId: "honey-cake-stand-v1", slot: "counter", cost: 145, titleKey: "pantry.items.honeyCakeStand.title", descriptionKey: "pantry.items.honeyCakeStand.description", rarity: "cozy" },
  { id: "lace-window-lantern", assetId: "lace-window-lantern-v1", slot: "window", cost: 110, titleKey: "pantry.items.laceWindowLantern.title", descriptionKey: "pantry.items.laceWindowLantern.description", rarity: "cozy" },
  { id: "copper-cookie-tin", assetId: "copper-cookie-tin-v1", slot: "shelf", cost: 105, titleKey: "pantry.items.copperCookieTin.title", descriptionKey: "pantry.items.copperCookieTin.description", rarity: "cozy" },
  { id: "plush-floor-cushion", assetId: "plush-floor-cushion-v1", slot: "floor", cost: 120, titleKey: "pantry.items.plushFloorCushion.title", descriptionKey: "pantry.items.plushFloorCushion.description", rarity: "cozy" },
  { id: "framed-recipe-glow", assetId: "framed-recipe-glow-v1", slot: "back-wall", cost: 135, titleKey: "pantry.items.framedRecipeGlow.title", descriptionKey: "pantry.items.framedRecipeGlow.description", rarity: "cozy" },
  { id: "golden-waffle-press", assetId: "golden-waffle-press-v1", slot: "counter", cost: 360, titleKey: "pantry.items.goldenWafflePress.title", descriptionKey: "pantry.items.goldenWafflePress.description", rarity: "rare" },
  { id: "stained-glass-suncatcher", assetId: "stained-glass-suncatcher-v1", slot: "window", cost: 280, titleKey: "pantry.items.stainedGlassSuncatcher.title", descriptionKey: "pantry.items.stainedGlassSuncatcher.description", rarity: "rare" },
  { id: "porcelain-spice-carousel", assetId: "porcelain-spice-carousel-v1", slot: "shelf", cost: 245, titleKey: "pantry.items.porcelainSpiceCarousel.title", descriptionKey: "pantry.items.porcelainSpiceCarousel.description", rarity: "rare" },
  { id: "pantry-delivery-cart", assetId: "pantry-delivery-cart-v1", slot: "floor", cost: 320, titleKey: "pantry.items.pantryDeliveryCart.title", descriptionKey: "pantry.items.pantryDeliveryCart.description", rarity: "rare" },
  { id: "spoon-wall-tapestry", assetId: "spoon-wall-tapestry-v1", slot: "back-wall", cost: 300, titleKey: "pantry.items.spoonWallTapestry.title", descriptionKey: "pantry.items.spoonWallTapestry.description", rarity: "rare" },
  { id: "soup-pot-display", assetId: "soup-pot-display-v2", slot: "counter", cost: 80, titleKey: "pantry.items.soupPot.title", descriptionKey: "pantry.items.soupPot.description", rarity: "cozy" },
  { id: "golden-spoon-sign", assetId: "golden-spoon-sign-v2", slot: "back-wall", cost: 90, titleKey: "pantry.items.goldenSign.title", descriptionKey: "pantry.items.goldenSign.description", rarity: "cozy" }
];

export function getDecorationById(id) {
  return pantryDecorations.find((item) => item.id === id) || null;
}

export function getDecorationsForSlot(slotId) {
  return pantryDecorations.filter((item) => item.slot === slotId);
}

export function isDecorationArtApproved(decoration) {
  return Boolean(decoration?.assetId && isRuntimePantryDecorationArtApproved(decoration.assetId));
}

export function getApprovedPantryDecorations() {
  return pantryDecorations.filter(isDecorationArtApproved);
}
