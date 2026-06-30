import appIconUrl from "../assets/app-icons/app-icon-512.png";
import pipCastUrl from "../assets/characters/pip-cast-redesign-concept-v1-web.jpg";
import pipCompleteStickerUrl from "../assets/characters/pip-complete-sticker-v1.png";
import pipStripStickerUrl from "../assets/characters/pip-strip-sticker-v1.png";
import sunnyCastUrl from "../assets/characters/sunny-spoon-cast-concept-v1.png";

const stageArtUrls = {
  "pips-first-shelf": pipCompleteStickerUrl,
  "sunny-spoon-sign": appIconUrl,
  "apron-drawer": pipStripStickerUrl,
  "bakery-window": pipCastUrl,
  "village-pantry": sunnyCastUrl
};

export function getStageArtUrl(packId) {
  return stageArtUrls[packId] || pipCompleteStickerUrl;
}
