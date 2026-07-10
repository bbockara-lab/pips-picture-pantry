import { getBadgeArtUrl } from "../data/badgeArt.js";
import { getPackBadgeStatus, getNextBadgeProgress } from "../game/badges.js";
import { getCompletedPuzzleIds, getPackPantryRoomRequirement, isPackUnlocked } from "../game/save.js";
import { t } from "../i18n/index.js";

export function renderPantryMapView() {
  const completedIds = getCompletedPuzzleIds();
  const statuses = getPackBadgeStatus(completedIds);
  const earnedCount = statuses.filter((status) => status.earned).length;
  const next = getNextBadgeProgress(completedIds);
  const section = document.createElement("section");
  section.className = "map-panel badge-room content-panel";

  const header = document.createElement("div");
  header.className = "map-header";
  const title = document.createElement("div");
  title.innerHTML = '<p class="section-label">' + t("sections.pantryMap") + '</p><h2>' + t("badges.collectionCount", { earned: earnedCount, total: statuses.length }) + '</h2>';
  const note = document.createElement("p");
  note.className = "map-note";
  note.textContent = t("badges.collectionNote");
  header.append(title, note);
  section.appendChild(header);

  if (next) {
    section.appendChild(createNextBadgeCard(next));
  }

  const badgeGrid = document.createElement("div");
  badgeGrid.className = "badge-collection-grid";
  statuses.forEach((status) => badgeGrid.appendChild(createBadgeCollectionCard(status)));
  section.appendChild(badgeGrid);

  return section;
}

function createNextBadgeCard(status) {
  const card = document.createElement("div");
  card.className = "roadmap-badge next-stage-badge";

  const token = document.createElement("div");
  token.className = "roadmap-badge__token";
  token.setAttribute("aria-hidden", "true");
  token.appendChild(createBadgeImage(status.badge.id));

  const copy = document.createElement("div");
  const title = document.createElement("p");
  title.textContent = t("badges.nextPackBadge", { name: t(status.badge.titleKey) });
  const meta = document.createElement("small");
  meta.textContent = t("badges.packProgress", { completed: status.completed, total: status.total, name: t(status.badge.titleKey) });
  copy.append(title, meta);
  card.append(token, copy);
  return card;
}

function createBadgeCollectionCard(status) {
  const unlocked = isPackUnlocked(status.pack);
  const card = document.createElement("article");
  card.className = status.earned ? "badge-card earned" : unlocked ? "badge-card" : "badge-card locked";
  card.style.setProperty("--badge-progress", String(Math.round((status.completed / Math.max(status.total, 1)) * 100)) + "%");

  const art = document.createElement("div");
  art.className = "badge-card__art";
  art.setAttribute("aria-hidden", "true");
  art.appendChild(createBadgeArt(status));

  const copy = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = t(status.badge.titleKey);
  const desc = document.createElement("p");
  desc.textContent = t(status.badge.descriptionKey);
  const meta = document.createElement("small");
  meta.textContent = status.earned
    ? t("badges.earned")
    : unlocked
      ? t("badges.progress", { completed: status.completed, total: status.total })
      : getLockedBadgeRequirementText(status.pack);
  copy.append(title, desc, meta);

  card.append(art, copy);
  return card;
}

function getLockedBadgeRequirementText(pack) {
  const roomRequirement = getPackPantryRoomRequirement(pack);
  if (roomRequirement.required > 0 && !roomRequirement.met) {
    return t("map.lockedWithPantry", roomRequirement);
  }
  return t("map.locked");
}

function createBadgeArt(status) {
  const wrap = document.createElement("div");
  wrap.className = status.earned ? "badge-art-token earned" : "badge-art-token";
  wrap.style.setProperty("--badge-progress", String(Math.round((status.completed / Math.max(status.total || 1, 1)) * 100)) + "%");
  wrap.appendChild(createBadgeImage(status.badge.id));

  if (!status.earned) {
    const veil = document.createElement("span");
    veil.className = "badge-art-token__veil";
    veil.textContent = String(status.completed) + "/" + String(status.total || 20);
    wrap.appendChild(veil);
  }

  return wrap;
}

function createBadgeImage(badgeId) {
  const img = document.createElement("img");
  img.src = getBadgeArtUrl(badgeId);
  img.alt = "";
  return img;
}
