import starterCounterClothUrl from "../assets/backgrounds/overlays/room-v2-counter-01.png";
import smallJamJarUrl from "../assets/backgrounds/overlays/room-v2-counter-02.png";
import ribbonRollingPinUrl from "../assets/backgrounds/overlays/room-v2-counter-03.png";
import soupPotUrl from "../assets/backgrounds/overlays/room-v2-counter-04.png";
import honeyCakeStandUrl from "../assets/backgrounds/overlays/room-v2-counter-05.png";
import goldenWafflePressUrl from "../assets/backgrounds/overlays/room-v2-counter-06.png";
import sunnyCurtainsUrl from "../assets/backgrounds/overlays/room-v2-window-01.png";
import herbPotUrl from "../assets/backgrounds/overlays/room-v2-window-02.png";
import flowerVaseUrl from "../assets/backgrounds/overlays/room-v2-window-03.png";
import laceLanternUrl from "../assets/backgrounds/overlays/room-v2-window-04.png";
import stainedGlassUrl from "../assets/backgrounds/overlays/room-v2-window-05.png";
import recipeCardsUrl from "../assets/backgrounds/overlays/room-v2-shelf-01.png";
import tinySucculentUrl from "../assets/backgrounds/overlays/room-v2-shelf-02.png";
import berryTeaTinsUrl from "../assets/backgrounds/overlays/room-v2-shelf-03.png";
import copperCookieTinUrl from "../assets/backgrounds/overlays/room-v2-shelf-04.png";
import spiceCarouselUrl from "../assets/backgrounds/overlays/room-v2-shelf-05.png";
import mintRugUrl from "../assets/backgrounds/overlays/room-v2-floor-01.png";
import wovenBasketUrl from "../assets/backgrounds/overlays/room-v2-floor-02.png";
import plushCushionUrl from "../assets/backgrounds/overlays/room-v2-floor-03.png";
import deliveryCartUrl from "../assets/backgrounds/overlays/room-v2-floor-04.png";
import corkBoardUrl from "../assets/backgrounds/overlays/room-v2-wall-01.png";
import spoonClockUrl from "../assets/backgrounds/overlays/room-v2-wall-02.png";
import goldenSignUrl from "../assets/backgrounds/overlays/room-v2-wall-03.png";
import framedRecipeUrl from "../assets/backgrounds/overlays/room-v2-wall-04.png";
import tapestryUrl from "../assets/backgrounds/overlays/room-v2-wall-05.png";

const OVERLAY_URLS = {
  "starter-counter-cloth-v2": starterCounterClothUrl,
  "small-jam-jar-v1": smallJamJarUrl,
  "ribbon-rolling-pin-v1": ribbonRollingPinUrl,
  "soup-pot-display-v2": soupPotUrl,
  "honey-cake-stand-v1": honeyCakeStandUrl,
  "golden-waffle-press-v1": goldenWafflePressUrl,
  "sunny-window-curtains-v2": sunnyCurtainsUrl,
  "herb-pot-v1": herbPotUrl,
  "flower-window-vase-v1": flowerVaseUrl,
  "lace-window-lantern-v1": laceLanternUrl,
  "stained-glass-suncatcher-v1": stainedGlassUrl,
  "recipe-card-shelf-v2": recipeCardsUrl,
  "tiny-succulent-v1": tinySucculentUrl,
  "berry-tea-tins-v1": berryTeaTinsUrl,
  "copper-cookie-tin-v1": copperCookieTinUrl,
  "porcelain-spice-carousel-v1": spiceCarouselUrl,
  "mint-check-rug-v2": mintRugUrl,
  "woven-pantry-basket-v1": wovenBasketUrl,
  "plush-floor-cushion-v1": plushCushionUrl,
  "pantry-delivery-cart-v1": deliveryCartUrl,
  "cork-board-v1": corkBoardUrl,
  "spoon-wall-clock-v1": spoonClockUrl,
  "golden-spoon-sign-v2": goldenSignUrl,
  "framed-recipe-glow-v1": framedRecipeUrl,
  "spoon-wall-tapestry-v1": tapestryUrl
};

export function getPantryOverlayUrl(assetId) {
  return OVERLAY_URLS[assetId] || "";
}
