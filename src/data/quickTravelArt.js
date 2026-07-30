import puzzleUrl from "../assets/icons/workshop-nav-v3/workshop-nav-puzzle-v3.webp";
import albumUrl from "../assets/icons/workshop-nav-v3/workshop-nav-album-v3.webp";
import pantryUrl from "../assets/icons/workshop-nav-v3/workshop-nav-pantry-v3.webp";
import timeAttackUrl from "../assets/icons/workshop-nav-v3/workshop-nav-time-attack-v3.webp";
import mapUrl from "../assets/icons/workshop-nav-v3/workshop-nav-map-v3.webp";
import settingsUrl from "../assets/icons/workshop-nav-v3/workshop-nav-settings-v3.webp";
import spoonRunUrl from "../assets/icons/spoon-token-v2.png";
import { isRuntimeQuickTravelArtApproved } from "./runtimeArt.js";

const QUICK_TRAVEL_ART = {
  puzzle: { assetId: "workshop-nav-puzzle-v3", src: puzzleUrl },
  spoonRun: { assetId: "spoon-token-v2", src: spoonRunUrl },
  album: { assetId: "workshop-nav-album-v3", src: albumUrl },
  pantry: { assetId: "workshop-nav-pantry-v3", src: pantryUrl },
  timeAttack: { assetId: "workshop-nav-time-attack-v3", src: timeAttackUrl },
  map: { assetId: "workshop-nav-map-v3", src: mapUrl },
  settings: { assetId: "workshop-nav-settings-v3", src: settingsUrl }
};

export function getQuickTravelArt(view) {
  const art = QUICK_TRAVEL_ART[view];
  return art && isRuntimeQuickTravelArtApproved(art.assetId) ? art : null;
}
