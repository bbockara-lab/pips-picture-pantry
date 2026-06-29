import pipCompleteStickerUrl from "../assets/characters/pip-complete-sticker-v1.png";
import { puzzlePacks } from "../data/packs.js";
import { puzzles } from "../data/puzzles.js";
import { getCompletedPuzzleIds, isPackUnlocked } from "../game/save.js";
import { t } from "../i18n/index.js";

export function renderPantryMapView() {
  const completedIds = new Set(getCompletedPuzzleIds());
  const section = document.createElement("section");
  section.className = "map-panel content-panel";
  const playablePacks = puzzlePacks.filter((pack) => puzzles.some((puzzle) => puzzle.packId === pack.id));
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

  const goal = document.createElement("div");
  goal.className = "roadmap-goal";
  goal.style.setProperty("--goal-progress", `${overallProgress}%`);
  goal.innerHTML = `
    <img class="roadmap-goal__ghost" src="${pipCompleteStickerUrl}" alt="" />
    <div class="roadmap-goal__reveal">
      <img src="${pipCompleteStickerUrl}" alt="" />
    </div>
  `;
  section.appendChild(goal);

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
        <div class="roadmap-piece__reveal">
          <img src="${pipCompleteStickerUrl}" alt="" />
        </div>
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
  return section;
}
