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

  section.innerHTML = `
    <div class="map-header">
      <div>
        <p class="section-label">${t("sections.pantryMap")}</p>
        <h2>${t("map.count", { completed: completedCount, total: puzzles.length })}</h2>
      </div>
      <p class="map-note">${t("map.note")}</p>
    </div>
  `;

  section.appendChild(createRoadmapGoal(playablePacks, completedIds, overallProgress));
  section.appendChild(createRoadmapBadge(completedCount, roadmapTotal));

  const mural = document.createElement("div");
  mural.className = "pantry-roadmap";

  playablePacks.forEach((pack) => {
    const packPuzzles = puzzles.filter((puzzle) => puzzle.packId === pack.id);
    const completeCount = packPuzzles.filter((puzzle) => completedIds.has(puzzle.id)).length;
    const progress = Math.round((completeCount / Math.max(packPuzzles.length, 1)) * 100);
    const unlocked = isPackUnlocked(pack);
    const card = document.createElement("article");
    card.className = unlocked ? "roadmap-card" : "roadmap-card locked";
    card.dataset.part = pack.muralPart;
    card.style.setProperty("--roadmap-progress", `${progress}%`);
    card.innerHTML = `
      <div class="roadmap-piece" aria-hidden="true">
        <img class="roadmap-piece__ghost" src="${pipCompleteStickerUrl}" alt="" />
        <div class="roadmap-piece__meter"><span></span></div>
      </div>
      <div>
        <h3>${t(pack.titleKey)}</h3>
        <p>${t("packs.progress", { completed: completeCount, total: packPuzzles.length })}</p>
        <small>${completeCount >= packPuzzles.length && packPuzzles.length ? t("map.revealed") : unlocked ? t("map.inProgress") : t("map.locked")}</small>
      </div>
    `;
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
      item.innerHTML = `
        <div class="future-mural-card" aria-hidden="true"><span>${t(`map.sets.${pack.muralSet}`)}</span></div>
        <div>
          <h3>${t(pack.titleKey)}</h3>
          <p>${t(`map.sets.${pack.muralSet}`)}</p>
          <small>${t("packs.pricePreview")}</small>
        </div>
      `;
      future.appendChild(item);
    });
    section.appendChild(future);
  }

  return section;
}

function createRoadmapGoal(playablePacks, completedIds, overallProgress) {
  const goal = document.createElement("div");
  goal.className = "roadmap-goal stage-part-goal";
  goal.style.setProperty("--goal-progress", `${overallProgress}%`);
  goal.innerHTML = `<img class="roadmap-goal__ghost" src="${pipCompleteStickerUrl}" alt="" />`;

  playablePacks.forEach((pack) => {
    const packPuzzles = puzzles.filter((puzzle) => puzzle.packId === pack.id);
    const completeCount = packPuzzles.filter((puzzle) => completedIds.has(puzzle.id)).length;
    const packProgress = completeCount / Math.max(packPuzzles.length, 1);
    const layer = document.createElement("img");
    layer.className = `roadmap-goal__part roadmap-goal__part--${pack.muralPart}`;
    layer.src = pipCompleteStickerUrl;
    layer.alt = "";
    layer.style.setProperty("--part-opacity", String(Math.min(1, Math.max(0, packProgress))));
    goal.appendChild(layer);
  });

  const meter = document.createElement("div");
  meter.className = "roadmap-goal__meter";
  meter.setAttribute("aria-hidden", "true");
  meter.innerHTML = "<span></span>";
  goal.appendChild(meter);
  return goal;
}

function createRoadmapBadge(completed, total) {
  const completedIds = getCompletedPuzzleIds();
  const next = getNextBadgeProgress(completedIds);
  const earnedAll = total > 0 && completed >= total;
  const badge = document.createElement("div");
  badge.className = earnedAll ? "roadmap-badge earned" : "roadmap-badge";
  if (next) {
    badge.innerHTML = `
      <div class="roadmap-badge__token" aria-hidden="true">
        <img src="${pipCompleteStickerUrl}" alt="" />
      </div>
      <div>
        <p>${t("badges.nextPackBadge", { name: t(next.badge.titleKey) })}</p>
        <small>${t("badges.packProgress", { completed: next.completed, total: next.total, name: t(next.badge.titleKey) })}</small>
      </div>
    `;
    return badge;
  }
  badge.innerHTML = `
    <div class="roadmap-badge__token" aria-hidden="true">
      <img src="${pipCompleteStickerUrl}" alt="" />
    </div>
    <div>
      <p>${t("badges.pipPortrait")}</p>
      <small>${t("badges.earned")}</small>
    </div>
  `;
  return badge;
}
