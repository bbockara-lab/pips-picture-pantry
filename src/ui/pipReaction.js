import pipCompleteStickerUrl from "../assets/characters/pip-completion-v2.png";
import { getCompletionPaletteId } from "../data/completionPalettes.js";
import { puzzleAlbumText, puzzleImageName, puzzleTitle, t } from "../i18n/index.js";

export const FIRST_PIP_FACE_PUZZLE_ID = "pips-first-shelf-pip-face-1";

export function isFirstPipFacePuzzle(puzzle) {
  return puzzle?.id === FIRST_PIP_FACE_PUZZLE_ID;
}

export function getCompletionMessage(puzzle) {
  return t("completion.saved", {
    imageName: puzzleImageName(puzzle)
  });
}

export function renderCompletionBanner(puzzle, {
  onNextPuzzle,
  onBackToSpoonRun,
  replayChallenge = false,
  replayResult = null,
  replayExhausted = false,
  dailyChallenge = false,
  dailyResult = null,
  rewardResult = null,
  stageBonus = 0
} = {}) {
  const banner = document.createElement("div");
  banner.className = "completion-banner";
  const isFirstPipFace = isFirstPipFacePuzzle(puzzle);
  if (isFirstPipFace) {
    banner.classList.add("completion-banner--first-pip-face");
  }

  const reaction = document.createElement("img");
  reaction.className = "completion-pip";
  reaction.src = pipCompleteStickerUrl;
  reaction.alt = "";

  const copy = document.createElement("div");
  copy.className = "completion-copy";

  const message = document.createElement("p");
  message.textContent = getCompletionBannerMessage(puzzle, {
    replayChallenge,
    replayResult,
    replayExhausted,
    dailyChallenge,
    dailyResult
  });

  copy.appendChild(message);
  const rewardRows = getCompletionRewardRows({
    puzzleReward: (dailyResult || rewardResult)?.puzzleReward,
    dailyBonus: dailyResult?.dailyBonus,
    stageBonus
  });
  if (rewardRows.length) {
    const rewardList = document.createElement("div");
    rewardList.className = "completion-reward-list";
    rewardRows.forEach((row) => {
      const line = document.createElement("p");
      line.className = "completion-reward-line";
      if (row.key === "completion.stageBonus") line.classList.add("completion-reward-line--stage");
      line.textContent = t(row.key, { count: row.count });
      rewardList.appendChild(line);
    });
    copy.appendChild(rewardList);
  }

  const reveal = renderSolvedReveal(puzzle);

  const actions = document.createElement("div");
  actions.className = "completion-actions";

  const actionButton = document.createElement("button");
  actionButton.type = "button";
  actionButton.className = "tool-button";
  actionButton.textContent = t(replayExhausted ? "completion.backToSpoonRun" : "completion.nextPicture");
  actionButton.addEventListener("click", () => {
    if (replayExhausted) {
      onBackToSpoonRun?.();
      return;
    }
    onNextPuzzle?.();
  });

  actions.append(actionButton);
  if (isFirstPipFace) {
    banner.append(copy, reveal, actions);
  } else {
    banner.append(reaction, copy, reveal, actions);
  }
  return banner;
}

export function isReplayExhausted(replayChallenge, replayResult) {
  return Boolean(replayChallenge && replayResult?.rewardAllowed && replayResult.remaining === 0);
}
export function getCompletionRewardRows({ puzzleReward = 0, dailyBonus = 0, stageBonus = 0 } = {}) {
  return [
    { key: "completion.puzzleReward", count: Math.max(0, Number(puzzleReward || 0)) },
    { key: "completion.dailyBonus", count: Math.max(0, Number(dailyBonus || 0)) },
    { key: "completion.stageBonus", count: Math.max(0, Number(stageBonus || 0)) }
  ].filter((row) => row.count > 0);
}
function getCompletionBannerMessage(puzzle, options = {}) {
  if (options.replayExhausted) {
    return t("completion.replayExhausted");
  }
  if (options.dailyChallenge) {
    return t("completion.dailyComplete");
  }
  if (!options.replayChallenge) {
    return getCompletionMessage(puzzle);
  }
  if (options.replayResult?.rewardAllowed) {
    return t("completion.replayReward", { count: options.replayResult.reward || 0, remaining: options.replayResult.remaining || 0 });
  }
  return t("completion.replayNoReward");
}

function renderSolvedReveal(puzzle) {
  const card = document.createElement("div");
  card.className = "completion-reveal-card";
  const isFirstPipFace = isFirstPipFacePuzzle(puzzle);
  if (isFirstPipFace) {
    card.classList.add("completion-reveal-card--pip-face");
  }

  const reveal = document.createElement("div");
  reveal.className = "completion-reveal";
  const paletteId = getCompletionPaletteId(puzzle);
  if (paletteId) {
    reveal.classList.add(`completion-reveal--${paletteId}`);
  }
  if (isFirstPipFace) {
    reveal.classList.add("completion-reveal--pip-face");
  }
  reveal.setAttribute("aria-label", puzzleImageName(puzzle));
  reveal.style.setProperty("--reveal-size", puzzle.size);

  puzzle.solution.forEach((row, rowIndex) => {
    [...row].forEach((cell, columnIndex) => {
      const tile = document.createElement("span");
      tile.className = cell === "1" ? "reveal-cell filled" : "reveal-cell";
      tile.dataset.row = String(rowIndex);
      tile.dataset.column = String(columnIndex);
      reveal.appendChild(tile);
    });
  });

  if (isFirstPipFace) {
    const character = document.createElement("img");
    character.className = "completion-reveal__character";
    character.src = pipCompleteStickerUrl;
    character.alt = puzzleImageName(puzzle);
    card.append(character, reveal);
  } else {
    card.appendChild(reveal);
  }
  return card;
}
