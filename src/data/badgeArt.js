import pipsFirstShelfBadgeUrl from "../assets/badges/badge-pips-first-shelf-v1.webp";
import sunnySpoonSignBadgeUrl from "../assets/badges/badge-sunny-spoon-sign-v1.webp";
import apronDrawerBadgeUrl from "../assets/badges/badge-apron-drawer-v1.webp";
import bakeryWindowBadgeUrl from "../assets/badges/badge-bakery-window-v1.webp";
import villagePantryBadgeUrl from "../assets/badges/badge-village-pantry-v1.webp";

const approvedBadgeArtUrls = Object.freeze({
  "badge-pips-first-shelf": pipsFirstShelfBadgeUrl,
  "badge-sunny-spoon-sign": sunnySpoonSignBadgeUrl,
  "badge-apron-drawer": apronDrawerBadgeUrl,
  "badge-bakery-window": bakeryWindowBadgeUrl,
  "badge-village-pantry": villagePantryBadgeUrl
});

export function getBadgeArtUrl(badgeId) {
  return approvedBadgeArtUrls[badgeId] || null;
}

export function hasBadgeArt(badgeId) {
  return Boolean(approvedBadgeArtUrls[badgeId]);
}
