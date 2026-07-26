import puzzleUrl from "../assets/icons/workshop-nav-v2/workshop-nav-puzzle-v2.webp";
import albumUrl from "../assets/icons/workshop-nav-v2/workshop-nav-album-v2.webp";
import pantryUrl from "../assets/icons/workshop-nav-v2/workshop-nav-pantry-v2.webp";
import timeAttackUrl from "../assets/icons/workshop-nav-v2/workshop-nav-time-attack-v2.webp";
import mapUrl from "../assets/icons/workshop-nav-v2/workshop-nav-map-v2.webp";
import settingsUrl from "../assets/icons/workshop-nav-v2/workshop-nav-settings-v2.webp";
import { isRuntimeQuickTravelArtApproved } from "./runtimeArt.js";

const QUICK_TRAVEL_ART = {
  puzzle: { assetId: "workshop-nav-puzzle-v2", src: puzzleUrl },
  album: { assetId: "workshop-nav-album-v2", src: albumUrl },
  pantry: { assetId: "workshop-nav-pantry-v2", src: pantryUrl },
  timeAttack: { assetId: "workshop-nav-time-attack-v2", src: timeAttackUrl },
  map: { assetId: "workshop-nav-map-v2", src: mapUrl },
  settings: { assetId: "workshop-nav-settings-v2", src: settingsUrl }
};

export function getQuickTravelArt(view) {
  const art = QUICK_TRAVEL_ART[view];
  return art && isRuntimeQuickTravelArtApproved(art.assetId) ? art : null;
}
