import appIconUrl from "../assets/app-icons/app-icon-512.png";
import pipCastUrl from "../assets/characters/pip-cast-redesign-concept-v1-web.jpg";
import pipCompleteStickerUrl from "../assets/characters/pip-complete-sticker-v1.png";
import pipStripStickerUrl from "../assets/characters/pip-strip-sticker-v1.png";
import storyFriendsUrl from "../assets/characters/story-friends-sheet-v1-clean.png";

const stageArtUrls = {
  "pips-first-shelf": pipCompleteStickerUrl,
  "sunny-spoon-sign": appIconUrl,
  "apron-drawer": pipStripStickerUrl,
  "bakery-window": pipCastUrl,
  "village-pantry": storyFriendsUrl
};

export function getStageArtUrl(packId) {
  return stageArtUrls[packId] || pipCompleteStickerUrl;
}
