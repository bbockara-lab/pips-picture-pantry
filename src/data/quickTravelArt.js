import puzzleUrl from "../assets/icons/quick-travel-v1/quick-travel-puzzle-v1.png";
import albumUrl from "../assets/icons/quick-travel-v1/quick-travel-album-v1.png";
import pantryUrl from "../assets/icons/quick-travel-v1/quick-travel-pantry-v1.png";
import timeAttackUrl from "../assets/icons/quick-travel-v1/quick-travel-time-attack-v1.png";
import mapUrl from "../assets/icons/quick-travel-v1/quick-travel-map-v1.png";
import { isRuntimeQuickTravelArtApproved } from "./runtimeArt.js";

const QUICK_TRAVEL_ART = {
  puzzle: { assetId: "quick-travel-puzzle-v1", src: puzzleUrl },
  album: { assetId: "quick-travel-album-v1", src: albumUrl },
  pantry: { assetId: "quick-travel-pantry-v1", src: pantryUrl },
  timeAttack: { assetId: "quick-travel-time-attack-v1", src: timeAttackUrl },
  map: { assetId: "quick-travel-map-v1", src: mapUrl }
};

export function getQuickTravelArt(view) {
  const art = QUICK_TRAVEL_ART[view];
  return art && isRuntimeQuickTravelArtApproved(art.assetId) ? art : null;
}
