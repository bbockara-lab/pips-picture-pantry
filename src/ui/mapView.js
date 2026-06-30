import pipCompleteStickerUrl from "../assets/characters/pip-complete-sticker-v1.png";
import { puzzlePacks } from "../data/packs.js";
import { puzzles } from "../data/puzzles.js";
import { getCompletedPuzzleIds, isPackUnlocked } from "../game/save.js";
import { getNextBadgeProgress } from "../game/badges.js";
import { t } from "../i18n/index.js";

export function renderPantryMapView() {
  const completedIds = new Set(getCompletedPuzzleIds());
  const section = document.createElement("section");
  section.className = "map-panel content-panel";
  const playablePacks = puzzlePacks.filter((pack) => puzzles.some((puzzle) => puzzle.packId === pack.id));
  const futurePacks = puzzlePacks.filter((pack) => pack.access === "bonus-pack");
  const completedCount = completedIds.size;
  const roadmapTotal = playablePacks.reduce((sum, pack) => sum + puzzles.filter((puzzle) => puzzle.packId === pack.id).length, 0);
  const overallProgress = Math.round((completedCount / Math.max(roadmapTotal, 1)) * 100);

  const header = document.createElement("div");
  header.className = "map-header";
  const title = document.createElement("div");
  title.innerHTML = `<p class="section-label">${t("sections.pantryMap")}</p><h2>${t("map.count", { completed: completedCount, total: puzzles.length })}</h2>`;
  const note = document.createElement("p");
  note.className = "map-note";
  note.textContent = t("map.note");
  header.append(title, note);
  section.appendChild(header);

  section.appendChild(createRoadmapGoal(playablePacks, completedIds, overallProgress));
  section.appendChild(createRoadmapBadge(completedCount, roadmapTotal));

  const mural = document.createElement("div");
  mural.className = "pantry-roadmap";

  playablePacks.forEach((pack) => {
    const packPuzzles = puzzles.filter((puzzle) => puzzle.packId === pack.id);
    const completeCount = packPuzzles.filter((puzzle) => completedIds.has(puzzle.id)).length;
    const progressRatio = completeCount / Math.max(packPuzzles.length, 1);
    const progress = Math.round(progressRatio * 100);
    const unlocked = isPackUnlocked(pack);
    const card = document.createElement("article");
    card.className = unlocked ? "roadmap-card" : "roadmap-card locked";
    card.style.setProperty("--roadmap-progress", progress + "%");
    card.style.setProperty("--roadmap-progress-ratio", String(Math.min(1, Math.max(0, progressRatio))));

    const piece = document.createElement("div");
    piece.className = "roadmap-piece";
    piece.setAttribute("aria-hidden", "true");
    piece.appendChild(createTileMosaic(packPuzzles, completedIds, 5, "stage-tile-mosaic mini"));
    const meter = document.createElement("div");
    meter.className = "roadmap-piece__meter";
    meter.innerHTML = "<span></span>";
    piece.appendChild(meter);

    const copy = document.createElement("div");
    const heading = document.createElement("h3");
    heading.textContent = t(pack.titleKey);
    const progressText = document.createElement("p");
    progressText.textContent = t("packs.progress", { completed: completeCount, total: packPuzzles.length });
    const state = document.createElement("small");
    state.textContent = completeCount >= packPuzzles.length && packPuzzles.length ? t("map.revealed") : unlocked ? t("map.inProgress") : t("map.locked");
    copy.append(heading, progressText, state);
    card.append(piece, copy);
    mural.appendChild(card);
  });

  section.appendChild(mural);

  if (futurePacks.length) {
    const future = document.createElement("div");
    future.className = "future-roadmaps";
    future.innerHTML = `<p class="section-label">${t("map.nextSets")}</p>`;
    futurePacks.forEach((pack) => {
      const item = document.createElement("article");
      item.className = "future-roadmap-card";
      item.innerHTML = `<div class="future-mural-card" aria-hidden="true"><span>${t(`map.sets.${pack.muralSet}`)}</span></div><div><h3>${t(pack.titleKey)}</h3><p>${t(`map.sets.${pack.muralSet}`)}</p><small>${t("packs.pricePreview")}</small></div>`;
      future.appendChild(item);
    });
    section.appendChild(future);
  }

  return section;
}

function createRoadmapGoal(playablePacks, completedIds, overallProgress) {
  const orderedPuzzles = playablePacks.flatMap((pack) => puzzles.filter((puzzle) => puzzle.packId === pack.id));
  const goal = document.createElement("div");
  goal.className = "roadmap-goal tile-roadmap-goal";
  goal.style.setProperty("--goal-progress", overallProgress + "%");
  goal.innerHTML = `<img class="roadmap-goal__ghost" src="${pipCompleteStickerUrl}" alt="" /><div class="pip-tile-mosaic pip-tile-mosaic--large" aria-hidden="true"></div><div class="roadmap-goal__meter" aria-hidden="true"><span></span></div>`;
  goal.querySelector(".pip-tile-mosaic").append(...createTileCells(orderedPuzzles, completedIds, 10));
  return goal;
}

function createTileMosaic(stagePuzzles, completedIds, columns, className) {
  const mosaic = document.createElement("div");
  mosaic.className = `pip-tile-mosaic ${className}`;
  mosaic.append(...createTileCells(stagePuzzles, completedIds, columns));
  return mosaic;
}

function createTileCells(tilePuzzles, completedIds, columns) {
  const rows = Math.ceil(tilePuzzles.length / columns);
  return tilePuzzles.map((puzzle, index) => {
    const tile = document.createElement("span");
    const col = index % columns;
    const row = Math.floor(index / columns);
    tile.className = completedIds.has(puzzle.id) ? "pip-tile revealed" : "pip-tile";
    tile.style.backgroundImage = `url("${pipCompleteStickerUrl}")`;
    tile.style.backgroundSize = `${columns * 100}% ${rows * 100}%`;
    tile.style.backgroundPosition = `${columns === 1 ? 50 : (col / (columns - 1)) * 100}% ${rows === 1 ? 50 : (row / (rows - 1)) * 100}%`;
    return tile;
  });
}

function createRoadmapBadge(completed, total) {
  const completedIds = getCompletedPuzzleIds();
  const next = getNextBadgeProgress(completedIds);
  const earnedAll = total > 0 && completed >= total;
  const badge = document.createElement("div");
  badge.className = earnedAll ? "roadmap-badge earned" : "roadmap-badge";
  if (next) {
    badge.innerHTML = `<div class="roadmap-badge__token" aria-hidden="true"><img src="${pipCompleteStickerUrl}" alt="" /></div><div><p>${t("badges.nextPackBadge", { name: t(next.badge.titleKey) })}</p><small>${t("badges.packProgress", { completed: next.completed, total: next.total, name: t(next.badge.titleKey) })}</small></div>`;
    return badge;
  }
  badge.innerHTML = `<div class="roadmap-badge__token" aria-hidden="true"><img src="${pipCompleteStickerUrl}" alt="" /></div><div><p>${t("badges.pipPortrait")}</p><small>${t("badges.earned")}</small></div>`;
  return badge;
}
