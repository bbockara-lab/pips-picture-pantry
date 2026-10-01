import songpyeonTrayUrl from "../assets/seasonal/korean-harvest/songpyeon-tray-v1.webp";
import bojagiGiftUrl from "../assets/seasonal/korean-harvest/bojagi-gift-v1.webp";
import moonJarUrl from "../assets/seasonal/korean-harvest/moon-jar-v1.webp";
import moonlitLanternUrl from "../assets/seasonal/korean-harvest/moonlit-lantern-v1.webp";

const KOREAN_HARVEST_REWARD_ART = Object.freeze({
  "korean-harvest-songpyeon-tray-v1": songpyeonTrayUrl,
  "korean-harvest-bojagi-gift-v1": bojagiGiftUrl,
  "korean-harvest-moon-jar-v1": moonJarUrl,
  "korean-harvest-moonlit-lantern-v1": moonlitLanternUrl
});

export function getKoreanHarvestRewardArtUrl(assetId) {
  return KOREAN_HARVEST_REWARD_ART[assetId] || null;
}

export { KOREAN_HARVEST_REWARD_ART };
