import playNowUrl from "../assets/icons/workshop-nav-v3/workshop-play-now-v2.webp";
import { isRuntimeHomeActionArtApproved } from "./runtimeArt.js";

const HOME_ACTION_ART = {
  play: { assetId: "workshop-play-now-v2", src: playNowUrl }
};

export function getHomeActionArt(action) {
  const art = HOME_ACTION_ART[action];
  return art && isRuntimeHomeActionArtApproved(art.assetId) ? art : null;
}
