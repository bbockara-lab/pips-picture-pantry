import { puzzlePacks } from "../data/packs.js";
import { getStageArtUrl } from "../data/stageArt.js";
import { getPackBadgeStatus, getNextBadgeProgress } from "../game/badges.js";
import { getCompletedPuzzleIds, isPackUnlocked } from "../game/save.js";
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
  title.innerHTML = `<p class="section-label">${t("sections.pantryMap")}</p><h2>${t("badges.collectionCount", { earned: earnedCount, total: statuses.length })}</h2>`;
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

  const futurePacks = puzzlePacks.filter((pack) => pack.access === "bonus-pack");
  if (futurePacks.length) {
    const future = document.createElement("div");
    future.className = "future-roadmaps future-badges";
    future.innerHTML = `<p class="section-label">${t("map.nextSets")}</p>`;
    futurePacks.forEach((pack) => {
      const item = document.createElement("article");
      item.className = "future-roadmap-card";
      item.innerHTML = `<div class="future-mural-card" aria-hidden="true"><span>${t(`map.sets.${pack.muralSet}`)}</span></div><div><h3>${t(pack.titleKey)}</h3><p>${t(pack.noteKey)}</p><small>${t("packs.pricePreview")}</small></div>`;
      future.appendChild(item);
    });
    section.appendChild(future);
  }

  return section;
}

function createNextBadgeCard(status) {
  const card = document.createElement("div");
  card.className = "roadmap-badge next-stage-badge";
  card.innerHTML = `<div class="roadmap-badge__token" aria-hidden="true"><img src="${getStageArtUrl(status.pack.id)}" alt="" /></div><div><p>${t("badges.nextPackBadge", { name: t(status.badge.titleKey) })}</p><small>${t("badges.packProgress", { completed: status.completed, total: status.total, name: t(status.badge.titleKey) })}</small></div>`;
  return card;
}

function createBadgeCollectionCard(status) {
  const unlocked = isPackUnlocked(status.pack);
  const card = document.createElement("article");
  card.className = status.earned ? "badge-card earned" : unlocked ? "badge-card" : "badge-card locked";
  card.style.setProperty("--badge-progress", `${Math.round((status.completed / Math.max(status.total, 1)) * 100)}%`);

  const art = document.createElement("div");
  art.className = "badge-card__art";
  art.setAttribute("aria-hidden", "true");
  art.appendChild(createTileMosaic(status.pack.id, status.completed, status.total || 20));

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
      : t("map.locked");
  copy.append(title, desc, meta);

  card.append(art, copy);
  return card;
}

function createTileMosaic(packId, completeCount, total) {
  const columns = 5;
  const rows = Math.ceil(total / columns);
  const artUrl = getStageArtUrl(packId);
  const mosaic = document.createElement("div");
  mosaic.className = "pip-tile-mosaic badge-tile-mosaic";
  for (let index = 0; index < total; index += 1) {
    const tile = document.createElement("span");
    const col = index % columns;
    const row = Math.floor(index / columns);
    tile.className = index < completeCount ? "pip-tile revealed" : "pip-tile";
    tile.style.backgroundImage = `url("${artUrl}")`;
    tile.style.backgroundSize = `${columns * 100}% ${rows * 100}%`;
    tile.style.backgroundPosition = `${columns === 1 ? 50 : (col / (columns - 1)) * 100}% ${rows === 1 ? 50 : (row / (rows - 1)) * 100}%`;
    mosaic.appendChild(tile);
  }
  return mosaic;
}