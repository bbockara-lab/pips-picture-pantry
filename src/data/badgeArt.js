import pipsFirstShelfBadgeUrl from "../assets/badges/badge-pips-first-shelf-v1.webp";
import sunnySpoonSignBadgeUrl from "../assets/badges/badge-sunny-spoon-sign-v1.webp";
import apronDrawerBadgeUrl from "../assets/badges/badge-apron-drawer-v1.webp";
import pipBakeryDoorBadgeUrl from "../assets/badges/badge-pip-bakery-door-v1.webp";
import pipPastryMorningBadgeUrl from "../assets/badges/badge-pip-pastry-morning-v1.webp";
import pipTinCollectionBadgeUrl from "../assets/badges/badge-pip-tin-collection-v1.webp";
import pipVillagePathBadgeUrl from "../assets/badges/badge-pip-village-path-v1.webp";
import pipClockCornerBadgeUrl from "../assets/badges/badge-pip-clock-corner-v1.webp";
import pipFullPantryBadgeUrl from "../assets/badges/badge-pip-full-pantry-v1.webp";
import pipSunroomBotanicalsBadgeUrl from "../assets/badges/badge-pip-sunroom-botanicals-v1.webp";
import pipOrchardLanternBadgeUrl from "../assets/badges/badge-pip-orchard-lantern-v1.webp";
import pipHearthGalleryBadgeUrl from "../assets/badges/badge-pip-hearth-gallery-v1.webp";
import pipSummerMarketBadgeUrl from "../assets/badges/badge-pip-summer-market-v1.webp";
import pipPicnicLawnBadgeUrl from "../assets/badges/badge-pip-picnic-lawn-v1.webp";
import pipSunsetFeastBadgeUrl from "../assets/badges/badge-pip-sunset-feast-v1.webp";

const approvedBadgeArtUrls = Object.freeze({
  "badge-pips-first-shelf": pipsFirstShelfBadgeUrl,
  "badge-sunny-spoon-sign": sunnySpoonSignBadgeUrl,
  "badge-apron-drawer": apronDrawerBadgeUrl,
  "badge-pip-bakery-door": pipBakeryDoorBadgeUrl,
  "badge-pip-pastry-morning": pipPastryMorningBadgeUrl,
  "badge-pip-tin-collection": pipTinCollectionBadgeUrl,
  "badge-pip-village-path": pipVillagePathBadgeUrl,
  "badge-pip-clock-corner": pipClockCornerBadgeUrl,
  "badge-pip-full-pantry": pipFullPantryBadgeUrl,
  "badge-pip-sunroom-botanicals": pipSunroomBotanicalsBadgeUrl,
  "badge-pip-orchard-lantern": pipOrchardLanternBadgeUrl,
  "badge-pip-hearth-gallery": pipHearthGalleryBadgeUrl,
  "badge-pip-summer-market": pipSummerMarketBadgeUrl,
  "badge-pip-picnic-lawn": pipPicnicLawnBadgeUrl,
  "badge-pip-sunset-feast": pipSunsetFeastBadgeUrl
});

export function getBadgeArtUrl(badgeId) {
  return approvedBadgeArtUrls[badgeId] || null;
}

export function hasBadgeArt(badgeId) {
  return Boolean(approvedBadgeArtUrls[badgeId]);
}
