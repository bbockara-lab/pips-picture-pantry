import { puzzles } from "../data/puzzles.js";
import { getCompletedPuzzleIds } from "../game/save.js";
import { puzzleText, t } from "../i18n/index.js";

export function renderPantryMapView() {
  const completedIds = new Set(getCompletedPuzzleIds());
  const section = document.createElement("section");
  section.className = "map-panel content-panel";

  section.innerHTML = `
    <div class="map-header">
      <div>
        <p class="section-label">${t("sections.pantryMap")}</p>
        <h2>${t("map.count", { completed: completedIds.size, total: puzzles.length })}</h2>
      </div>
      <p class="map-note">${t("map.note")}</p>
    </div>
  `;

  const wall = document.createElement("div");
  wall.className = "pantry-map";
  wall.style.setProperty("--map-size", String(Math.ceil(Math.sqrt(puzzles.length))));

  puzzles.forEach((puzzle, index) => {
    const complete = completedIds.has(puzzle.id);
    const tile = document.createElement("article");
    tile.className = complete ? "map-tile complete" : "map-tile locked";
    tile.setAttribute("aria-label", complete
      ? t("map.completeTile", { title: puzzleText(puzzle.id, "title") })
      : t("map.lockedTile", { number: index + 1 }));

    const stamp = document.createElement("div");
    stamp.className = complete ? "map-stamp picture" : "map-stamp locked-stamp";
    stamp.setAttribute("aria-hidden", "true");

    if (complete) {
      stamp.style.setProperty("--stamp-size", puzzle.size);
      puzzle.solution.forEach((row) => {
        [...row].forEach((cell) => {
          const span = document.createElement("span");
          span.className = cell === "1" ? "stamp-cell filled" : "stamp-cell";
          stamp.appendChild(span);
        });
      });
    } else {
      stamp.textContent = String(index + 1);
    }

    const label = document.createElement("p");
    label.textContent = complete ? puzzleText(puzzle.id, "title") : t("map.emptySlot");

    tile.append(stamp, label);
    wall.appendChild(tile);
  });

  section.appendChild(wall);
  return section;
}
