import { puzzles } from "../data/puzzles.js";
import { getCompletedPuzzleIds, getCompletionDates } from "../game/save.js";
import { puzzleImageName, t } from "../i18n/index.js";
import { renderColoredPuzzleArt } from "./coloredPuzzleArt.js";
import { isKoreanHarvestArchiveAvailable } from "../data/koreanHarvestContent.js";
import { renderKoreanHarvestPuzzleCollection } from "./koreanHarvestEventView.js";
import { renderKoreanHarvestRewardShelf } from "./koreanHarvestRewardShelf.js";

function appendTextElement(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  element.textContent = text;
  parent.appendChild(element);
  return element;
}

export function renderAlbumView(options = {}) {
  const { onPlay = () => {}, onPlaySeasonal = () => {} } = typeof options === "function"
    ? { onPlay: options, onPlaySeasonal: options }
    : options;
  const completedIds = new Set(getCompletedPuzzleIds());
  const albumPuzzles = puzzles.filter((puzzle) => puzzle.packId !== "korean-harvest");
  const completionDates = getCompletionDates();
  const section = document.createElement("section");
  section.className = "album-panel content-panel";

  const completedCount = albumPuzzles.filter((puzzle) => completedIds.has(puzzle.id)).length;
  const header = document.createElement("div");
  header.className = "album-header";
  const headerCopy = document.createElement("div");
  appendTextElement(headerCopy, "p", "section-label", t("sections.pantryAlbum"));
  appendTextElement(headerCopy, "h2", "", t("album.completed", { completed: completedCount }));
  header.prepend(headerCopy);
  section.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "album-grid";

  albumPuzzles.filter((puzzle) => completedIds.has(puzzle.id)).forEach((puzzle) => {
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

  const archivePreview = import.meta.env.DEV
    && new URLSearchParams(globalThis.location?.search || "").get("seasonalArchive") === "1";
  if (isKoreanHarvestArchiveAvailable() || archivePreview) {
    const archive = document.createElement("section");
    archive.className = "album-seasonal-archive";
    archive.appendChild(renderKoreanHarvestPuzzleCollection({
      completedIds,
      onPlayPuzzle: onPlaySeasonal,
      archive: true
    }));
    const rewards = renderKoreanHarvestRewardShelf(completedIds);
    if (rewards) archive.appendChild(rewards);
    section.appendChild(archive);
  }
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
