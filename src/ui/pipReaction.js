import pipCompleteStickerUrl from "../assets/characters/pip-completion-v2.png";
import { puzzleAlbumText, puzzleImageName, puzzleTitle, t } from "../i18n/index.js";

export function getCompletionMessage(puzzle) {
  return t("completion.saved", {
    imageName: puzzleImageName(puzzle)
  });
}

export function renderCompletionBanner(puzzle, { onViewAlbum, onNextPuzzle, replayChallenge = false, replayResult = null } = {}) {
  const banner = document.createElement("div");
  banner.className = "completion-banner";

  const reaction = document.createElement("img");
  reaction.className = "completion-pip";
  reaction.src = pipCompleteStickerUrl;
  reaction.alt = "";

  const copy = document.createElement("div");
  copy.className = "completion-copy";

  const title = document.createElement("p");
  title.className = "completion-title";
  title.textContent = t("progress.complete");

  const message = document.createElement("p");
  message.textContent = getCompletionBannerMessage(puzzle, { replayChallenge, replayResult });

  copy.append(title, message);

  const reveal = renderSolvedReveal(puzzle);

  const actions = document.createElement("div");
  actions.className = "completion-actions";

  const albumButton = document.createElement("button");
  albumButton.type = "button";
  albumButton.className = "tool-button";
  albumButton.textContent = replayChallenge ? t("playScreen.back") : t("completion.viewAlbum");
  albumButton.addEventListener("click", () => onViewAlbum?.());

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.className = "tool-button";
  nextButton.textContent = t("completion.nextPicture");
  nextButton.addEventListener("click", () => onNextPuzzle?.());

  actions.append(albumButton, nextButton);
  banner.append(reaction, copy, reveal, actions);
  return banner;
}

function getCompletionBannerMessage(puzzle, options = {}) {
  if (!options.replayChallenge) {
    return getCompletionMessage(puzzle);
  }
  if (options.replayResult?.rewardAllowed) {
    return t("completion.replayReward", { count: options.replayResult.reward || 0 });
  }
  return t("completion.replayNoReward");
}

function renderSolvedReveal(puzzle) {
  const card = document.createElement("div");
  card.className = "completion-reveal-card";

  const meta = document.createElement("div");
  meta.className = "completion-reveal__meta";

  const eyebrow = document.createElement("span");
  eyebrow.className = "completion-reveal__eyebrow";
  eyebrow.textContent = t("completion.albumCard");

  const stamp = document.createElement("span");
  stamp.className = "completion-reveal__stamp";
  stamp.textContent = t("completion.savedStamp");

  meta.append(eyebrow, stamp);

  const reveal = document.createElement("div");
  reveal.className = "completion-reveal";
  reveal.setAttribute("aria-label", puzzleImageName(puzzle));
  reveal.style.setProperty("--reveal-size", puzzle.size);

  puzzle.solution.forEach((row) => {
    [...row].forEach((cell) => {
      const tile = document.createElement("span");
      tile.className = cell === "1" ? "reveal-cell filled" : "reveal-cell";
      reveal.appendChild(tile);
    });
  });

  card.append(meta, reveal);
  return card;
}
