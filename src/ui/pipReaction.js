import { puzzleText, t } from "../i18n/index.js";

export function getCompletionMessage(puzzle) {
  return t("completion.saved", {
    imageName: puzzleText(puzzle.id, "imageName").toLowerCase()
  });
}

export function renderCompletionBanner(puzzle) {
  const banner = document.createElement("div");
  banner.className = "completion-banner";
  banner.innerHTML = `
    <span class="spark">✓</span>
    <p>${getCompletionMessage(puzzle)}</p>
  `;
  return banner;
}