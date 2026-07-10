import starterCounterClothUrl from "../assets/decorations/starter-counter-cloth-v2.webp";
import sunnyWindowCurtainsUrl from "../assets/decorations/sunny-window-curtains-v2.webp";
import recipeCardShelfUrl from "../assets/decorations/recipe-card-shelf-v2.webp";
import mintCheckRugUrl from "../assets/decorations/mint-check-rug-v2.webp";
import soupPotDisplayUrl from "../assets/decorations/soup-pot-display-v2.webp";
import goldenSpoonSignUrl from "../assets/decorations/golden-spoon-sign-v2.webp";
import smallJamJarUrl from "../assets/decorations/small-jam-jar-v1.webp";
import herbPotUrl from "../assets/decorations/herb-pot-v1.webp";
import corkBoardUrl from "../assets/decorations/cork-board-v1.webp";
import tinySucculentUrl from "../assets/decorations/tiny-succulent-v1.webp";
import spoonWallClockUrl from "../assets/decorations/spoon-wall-clock-v1.webp";
import berryTeaTinsUrl from "../assets/decorations/berry-tea-tins-v1.webp";
import ribbonRollingPinUrl from "../assets/decorations/ribbon-rolling-pin-v1.webp";
import flowerWindowVaseUrl from "../assets/decorations/flower-window-vase-v1.webp";
import wovenPantryBasketUrl from "../assets/decorations/woven-pantry-basket-v1.webp";
import honeyCakeStandUrl from "../assets/decorations/honey-cake-stand-v1.webp";
import laceWindowLanternUrl from "../assets/decorations/lace-window-lantern-v1.webp";
import copperCookieTinUrl from "../assets/decorations/copper-cookie-tin-v1.webp";
import plushFloorCushionUrl from "../assets/decorations/plush-floor-cushion-v1.webp";
import framedRecipeGlowUrl from "../assets/decorations/framed-recipe-glow-v1.webp";
import goldenWafflePressUrl from "../assets/decorations/golden-waffle-press-v1.webp";
import stainedGlassSuncatcherUrl from "../assets/decorations/stained-glass-suncatcher-v1.webp";
import porcelainSpiceCarouselUrl from "../assets/decorations/porcelain-spice-carousel-v1.webp";
import pantryDeliveryCartUrl from "../assets/decorations/pantry-delivery-cart-v1.webp";
import spoonWallTapestryUrl from "../assets/decorations/spoon-wall-tapestry-v1.webp";

const DECORATION_ART_URLS = {
  "starter-counter-cloth-v2": starterCounterClothUrl,
  "sunny-window-curtains-v2": sunnyWindowCurtainsUrl,
  "recipe-card-shelf-v2": recipeCardShelfUrl,
  "mint-check-rug-v2": mintCheckRugUrl,
  "soup-pot-display-v2": soupPotDisplayUrl,
  "golden-spoon-sign-v2": goldenSpoonSignUrl,
  "small-jam-jar-v1": smallJamJarUrl,
  "herb-pot-v1": herbPotUrl,
  "cork-board-v1": corkBoardUrl,
  "tiny-succulent-v1": tinySucculentUrl,
  "spoon-wall-clock-v1": spoonWallClockUrl,
  "berry-tea-tins-v1": berryTeaTinsUrl,
  "ribbon-rolling-pin-v1": ribbonRollingPinUrl,
  "flower-window-vase-v1": flowerWindowVaseUrl,
  "woven-pantry-basket-v1": wovenPantryBasketUrl,
  "honey-cake-stand-v1": honeyCakeStandUrl,
  "lace-window-lantern-v1": laceWindowLanternUrl,
  "copper-cookie-tin-v1": copperCookieTinUrl,
  "plush-floor-cushion-v1": plushFloorCushionUrl,
  "framed-recipe-glow-v1": framedRecipeGlowUrl,
  "golden-waffle-press-v1": goldenWafflePressUrl,
  "stained-glass-suncatcher-v1": stainedGlassSuncatcherUrl,
  "porcelain-spice-carousel-v1": porcelainSpiceCarouselUrl,
  "pantry-delivery-cart-v1": pantryDeliveryCartUrl,
  "spoon-wall-tapestry-v1": spoonWallTapestryUrl
};

export function getDecorationArtUrl(assetId) {
  return DECORATION_ART_URLS[assetId] || "";
}
