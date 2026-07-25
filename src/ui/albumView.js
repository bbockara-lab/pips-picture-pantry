import { puzzles } from "../data/puzzles.js";
import { getCompletedPuzzleIds, getCompletionDates } from "../game/save.js";
import { puzzleImageName, t } from "../i18n/index.js";
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

export function renderAlbumView(onPlay = () => {}) {
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

  puzzles.filter((puzzle) => completedIds.has(puzzle.id)).forEach((puzzle) => {
    const card = document.createElement("article");
    card.className = "album-card complete";
    card.appendChild(renderStamp(puzzle));

    const copy = document.createElement("div");
    appendTextElement(copy, "h3", "", puzzleImageName(puzzle));
    if (completionDates[puzzle.id]) {
      appendTextElement(copy, "small", "card-date", formatCardDate(completionDates[puzzle.id]));
    }
    card.appendChild(copy);
    grid.appendChild(card);
  });

  if (!grid.children.length) {
    const empty = document.createElement("div");
    empty.className = "album-empty";
    appendTextElement(empty, "p", "", t("album.emptyTitle"));
    const action = document.createElement("button");
    action.type = "button";
    action.className = "tool-button";
    action.textContent = t("album.emptyAction");
    action.addEventListener("click", onPlay);
    empty.appendChild(action);
    grid.appendChild(empty);
  }

  section.appendChild(grid);
  return section;
}

function renderStamp(puzzle) {
  return renderColoredPuzzleArt(puzzle, { className: "album-stamp picture" });
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
