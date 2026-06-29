import { puzzlePacks } from "../data/packs.js";
import { puzzles } from "../data/puzzles.js";
import { getCompletedPuzzleIds, isPackUnlocked } from "../game/save.js";
import { t } from "../i18n/index.js";

export function renderPantryMapView() {
  const completedIds = new Set(getCompletedPuzzleIds());
  const section = document.createElement("section");
  section.className = "map-panel content-panel";
  const completedCount = completedIds.size;

  section.innerHTML = `
    <div class="map-header">
      <div>
        <p class="section-label">${t("sections.pantryMap")}</p>
        <h2>${t("map.count", { completed: completedCount, total: puzzles.length })}</h2>
      </div>
      <p class="map-note">${t("map.note")}</p>
    </div>
  `;

  const mural = document.createElement("div");
  mural.className = "pantry-roadmap";

  puzzlePacks.forEach((pack) => {
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
        <span></span><span></span><span></span>
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
