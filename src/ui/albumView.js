import { puzzles } from "../data/puzzles.js";
import { getCompletedPuzzleIds, getCompletionDates } from "../game/save.js";
import { puzzleAlbumText, puzzleImageName, t } from "../i18n/index.js";
import { renderColoredPuzzleArt } from "./coloredPuzzleArt.js";

function appendTextElement(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  element.textContent = text;
  parent.appendChild(element);
  return element;
}

export function renderAlbumView() {
  const completedIds = new Set(getCompletedPuzzleIds());
  const completionDates = getCompletionDates();
  const section = document.createElement("section");
  section.className = "album-panel content-panel";

  const completedCount = completedIds.size;
  const header = document.createElement("div");
  header.className = "album-header";
  const headerCopy = document.createElement("div");
  appendTextElement(headerCopy, "p", "section-label", t("sections.pantryAlbum"));
  appendTextElement(headerCopy, "h2", "", t("album.count", { completed: completedCount, total: puzzles.length }));
  appendTextElement(header, "p", "album-note", t("album.note"));
  header.prepend(headerCopy);
  section.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "album-grid";

  puzzles.forEach((puzzle) => {
    const isComplete = completedIds.has(puzzle.id);
    const card = document.createElement("article");
    card.className = isComplete ? "album-card complete" : "album-card locked";
    card.appendChild(renderStamp(puzzle, isComplete));

    const copy = document.createElement("div");
    appendTextElement(copy, "span", "album-card__state", isComplete ? t("completion.savedStamp") : t("album.hiddenTitle"));
    appendTextElement(copy, "h3", "", isComplete ? puzzleImageName(puzzle) : t("album.hiddenTitle"));
    appendTextElement(copy, "p", "", isComplete ? puzzleAlbumText(puzzle) : t("album.hiddenText"));
    if (isComplete && completionDates[puzzle.id]) {
      appendTextElement(copy, "small", "card-date", formatCardDate(completionDates[puzzle.id]));
    }
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

  return renderColoredPuzzleArt(puzzle, { className: stamp.className });

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
