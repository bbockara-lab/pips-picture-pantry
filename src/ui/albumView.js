import { puzzles } from "../data/puzzles.js";
import { getCompletedPuzzleIds, getCompletionDates } from "../game/save.js";
import { puzzleAlbumText, puzzleImageName, puzzleTitle, t } from "../i18n/index.js";

export function renderAlbumView() {
  const completedIds = new Set(getCompletedPuzzleIds());
  const completionDates = getCompletionDates();
  const section = document.createElement("section");
  section.className = "album-panel content-panel";

  const completedCount = completedIds.size;
  section.innerHTML = `
    <div class="album-header">
      <div>
        <p class="section-label">${t("sections.pantryAlbum")}</p>
        <h2>${t("album.count", { completed: completedCount, total: puzzles.length })}</h2>
      </div>
      <p class="album-note">${t("album.note")}</p>
    </div>
  `;

  const grid = document.createElement("div");
  grid.className = "album-grid";

  puzzles.forEach((puzzle) => {
    const isComplete = completedIds.has(puzzle.id);
    const card = document.createElement("article");
    card.className = isComplete ? "album-card complete" : "album-card locked";
    card.appendChild(renderStamp(puzzle, isComplete));

    const copy = document.createElement("div");
    copy.innerHTML = `
      <h3>${isComplete ? puzzleImageName(puzzle) : t("album.hiddenTitle")}</h3>
      <p>${isComplete ? puzzleAlbumText(puzzle) : t("album.hiddenText")}</p>
      ${isComplete && completionDates[puzzle.id] ? `<small class="card-date">${formatCardDate(completionDates[puzzle.id])}</small>` : ""}
    `;
    card.appendChild(copy);
    grid.appendChild(card);
  });

  section.appendChild(grid);
  return section;
}

function renderStamp(puzzle, isComplete) {
  const stamp = document.createElement("div");
  stamp.className = isComplete ? "album-stamp picture" : "album-stamp locked-stamp";
  stamp.setAttribute("aria-hidden", "true");

  if (!isComplete) {
    stamp.textContent = t("album.lockedSymbol");
    return stamp;
  }

  stamp.style.setProperty("--stamp-size", puzzle.size);
  puzzle.solution.forEach((row) => {
    [...row].forEach((cell) => {
      const tile = document.createElement("span");
      tile.className = cell === "1" ? "stamp-cell filled" : "stamp-cell";
      stamp.appendChild(tile);
    });
  });

  return stamp;
}
function formatCardDate(dateKey) {
  const [year, month, day] = String(dateKey).split("-");
  if (!year || !month || !day) {
    return "";
  }
  const locale = document.documentElement.lang || navigator.language || "en-US";
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" }).format(date);
}
