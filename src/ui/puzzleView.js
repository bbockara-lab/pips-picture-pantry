import { countMistakes, isSolved } from "../game/nonogram.js";
import { createReplayCleanStatus, isReplayClean, updateReplayCleanStatus } from "../game/replayChallenge.js";
import {
  createPuzzleState,
  paintCells,
  setCursor,
  setMode,
  toggleCell,
  undoLastMove
} from "../game/puzzleState.js";
import { getPuzzleExtraHintCost } from "../data/economyConfig.js";
import { getPantrySpoons, loadPuzzleState, recordReplayReward, savePuzzleState, spendPantrySpoons } from "../game/save.js";
import { puzzleTitle, t } from "../i18n/index.js";
import { playComplete, playCursorAction, playCursorMove, playTap } from "./audio.js";
import { getHintLimit, getHintRevealCount, renderHintPanel, renderHowToPlayCard, renderMarkHint } from "./puzzleAssistView.js";
import { moveSelectedCell, renderCursorControls, shouldShowCursorControls, toggleSelectedCell } from "./puzzleCursorControls.js";
import { renderBoard } from "./boardView.js";
import { renderCompletionBanner } from "./pipReaction.js";

export function renderPuzzleView(puzzle, options = {}) {
  const isReplayChallenge = Boolean(options.replayChallenge);
  const isTimeAttack = Boolean(options.isTimeAttack);
  let state = isReplayChallenge ? createPuzzleState(puzzle) : loadPuzzleState(puzzle.id) || createPuzzleState(puzzle);
  let replayCleanStatus = createReplayCleanStatus();
  let replayResult = null;
  const controlMode = options.controlMode || "auto";
  const section = document.createElement("section");
  section.className = state.completed ? "puzzle-panel content-panel completed" : "puzzle-panel content-panel";
  section.tabIndex = 0;
  section.addEventListener("keydown", handlePuzzleKeydown);

  function update(nextState) {
    const wasCompleted = state.completed;
    state = {
      ...nextState,
      completed: isSolved(nextState, puzzle.solution) || nextState.completed
    };
    replayCleanStatus = getReplayCleanStatusAfterState(isReplayChallenge, replayCleanStatus, state, puzzle.solution);
    if (!isReplayChallenge) {
      savePuzzleState(state, {
        reward: puzzle.reward || 0,
        dailyBonus: options.dailyBonus || 0,
        dailyKey: options.dailyKey || null
      });
    }
    options.onPuzzleStateChange?.(puzzle, state);
    if (!wasCompleted && state.completed) {
      if (isReplayChallenge) {
        replayResult = recordReplayReward({
          puzzleId: puzzle.id,
          clean: isReplayClean(replayCleanStatus),
          picked: Boolean(options.replayPicked)
        });
      }
      playComplete();
      if (!isReplayChallenge) {
        options.onPuzzleComplete?.(puzzle, state);
      }
    }
    draw();
  }

  function handlePuzzleKeydown(event) {
    if (shouldIgnoreKeyboardEvent(event) || state.completed) {
      return;
    }

    const cursorControlsEnabled = shouldShowCursorControls(puzzle, controlMode);
    if (!cursorControlsEnabled) {
      return;
    }

    const key = event.key;
    if (key === "ArrowUp") {
      event.preventDefault();
      moveSelectedCell(state, -1, 0, puzzle.size, update);
    } else if (key === "ArrowDown") {
      event.preventDefault();
      moveSelectedCell(state, 1, 0, puzzle.size, update);
    } else if (key === "ArrowLeft") {
      event.preventDefault();
      moveSelectedCell(state, 0, -1, puzzle.size, update);
    } else if (key === "ArrowRight") {
      event.preventDefault();
      moveSelectedCell(state, 0, 1, puzzle.size, update);
    } else if (key === " " || key === "Enter") {
      event.preventDefault();
      toggleSelectedCell(state, "fill", update);
    } else if (key.toLowerCase() === "x" || key === "Backspace" || key === "Delete") {
      event.preventDefault();
      toggleSelectedCell(state, "mark", update);
    } else if (key.toLowerCase() === "z" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      update(undoLastMove(state));
    }
  }

  function draw() {
    section.innerHTML = "";
    section.className = state.completed ? "puzzle-panel content-panel completed" : "puzzle-panel content-panel";
    section.classList.toggle("replay-challenge", isReplayChallenge);

    const meta = document.createElement("div");
    meta.className = "puzzle-meta";
    meta.innerHTML = `
      <div>
        <p class="section-label">${isReplayChallenge ? t("replayPicks.challengeLabel") : getPuzzleLabel(puzzle)}</p>
        <h2>${puzzleTitle(puzzle)}</h2>
      </div>
      <p class="difficulty">${puzzle.size}\u00d7${puzzle.size}</p>
    `;
    if (!options.compactHeader) {
      section.appendChild(meta);
    }
    if (isReplayChallenge) {
      section.appendChild(createReplayChallengeNote(!isReplayClean(replayCleanStatus)));
    }
    if (options.stageNavigation) {
      section.appendChild(createStageNavigation(options.stageNavigation));
    }

    if (!state.completed) {
      section.appendChild(renderHowToPlayCard());
    }

    const cursorControlsEnabled = shouldShowCursorControls(puzzle, controlMode);
    section.appendChild(renderBoard(puzzle, state, (row, column, action = {}) => {
      playTap();
      const cursorState = setCursor(state, row, column, puzzle.size);
      if (Array.isArray(action.paintCells) && action.paintValue) {
        update(paintCells(cursorState, action.paintCells, action.paintValue));
        return;
      }
      update(toggleCell(cursorState, row, column));
    }, {
      completed: state.completed,
      locked: state.completed,
      cursorEnabled: cursorControlsEnabled
    }));
    section.appendChild(createControls(state, update));
    const baseHintLimit = getHintLimit(puzzle);
    const hintLimit = isTimeAttack ? Math.min(baseHintLimit, 3) : baseHintLimit;
    if (!state.completed && hintLimit > 0) {
      const paidHintCount = Math.max(0, Number(state.paidHintsUsed || 0));
      const normalHintCost = !isTimeAttack && Number(state.hintsUsed || 0) >= hintLimit
        ? getPuzzleExtraHintCost(puzzle.size, paidHintCount)
        : 0;
      const timeAttackHintCost = isTimeAttack ? options.getTimeAttackHintCost?.(state.hintsUsed || 0) || 0 : 0;
      const hintCost = isTimeAttack ? timeAttackHintCost : normalHintCost;
      const revealCount = getHintRevealCount(puzzle, { isTimeAttack });
      section.appendChild(renderHintPanel(state, puzzle, update, hintLimit, {
        cost: hintCost,
        revealCount,
        balance: hintCost > 0 ? getPantrySpoons() : 0,
        paid: hintCost > 0,
        timeAttack: isTimeAttack,
        onSpendHint: hintCost > 0
          ? (cost) => spendPantrySpoons(cost, isTimeAttack ? "time-attack-hint" : "puzzle-extra-hint").allowed
          : null
      }));
    }
    if (!state.completed && cursorControlsEnabled) {
      section.appendChild(renderCursorControls(state, puzzle, update));
    }
    section.appendChild(createProgressLine(state, puzzle));

    if (state.mode === "mark" && !state.completed) {
      section.appendChild(renderMarkHint());
    }

    if (state.completed) {
      section.appendChild(renderCompletionBanner(puzzle, { ...options, replayResult }));
    }
  }

  draw();
  options.onPuzzleStateChange?.(puzzle, state);
  return section;
}

export function getReplayCleanStatusAfterState(isReplayChallenge, replayCleanStatus, state, solution) {
  if (!isReplayChallenge) {
    return replayCleanStatus;
  }

  return updateReplayCleanStatus(replayCleanStatus, state, solution);
}

function shouldIgnoreKeyboardEvent(event) {
  const target = event.target;
  if (!target || target === event.currentTarget) {
    return false;
  }

  const tagName = target.tagName;
  if (["BUTTON", "INPUT", "TEXTAREA", "SELECT", "A"].includes(tagName)) {
    return true;
  }

  return Boolean(target.isContentEditable);
}

function getPuzzleLabel(puzzle) {
  return puzzle.id === "pip-face-5" ? t("sections.startHere") : t("sections.currentPicture");
}

function createControls(state, update) {
  const controls = document.createElement("div");
  controls.className = "controls";

  const fillButton = createModeButton(t("controls.fill"), state.mode === "fill", () =>
    update(setMode(state, "fill"))
  );
  const markButton = createModeButton(t("controls.mark"), state.mode === "mark", () =>
    update(setMode(state, "mark"))
  );
  markButton.title = t("controls.markHint");
  markButton.setAttribute("aria-label", t("controls.markHint"));

  const undoButton = document.createElement("button");
  undoButton.type = "button";
  undoButton.className = "tool-button";
  undoButton.textContent = t("controls.undo");
  undoButton.disabled = state.history.length === 0 || state.completed;
  undoButton.addEventListener("click", () => update(undoLastMove(state)));

  controls.append(fillButton, markButton, undoButton);
  return controls;
}

function createModeButton(label, active, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = active ? "mode-button active" : "mode-button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function createProgressLine(state, puzzle) {
  const line = document.createElement("p");
  line.className = "progress-line";
  if (state.completed) {
    line.textContent = t("progress.complete");
    return line;
  }

  const filledCount = state.cells.flat().filter((cell) => cell === "filled").length;
  const mistakes = countMistakes(state, puzzle.solution);
  line.textContent = mistakes > 0
    ? t("progress.revisit", { count: filledCount, mistakes })
    : t("progress.filled", { count: filledCount });
  return line;
}

function createStageNavigation(stageNavigation) {
  const nav = document.createElement("nav");
  nav.className = "stage-navigation";
  nav.setAttribute("aria-label", stageNavigation.packTitle);

  const copy = document.createElement("div");
  copy.className = "stage-navigation__copy";

  const title = document.createElement("p");
  title.textContent = stageNavigation.packTitle;

  const position = document.createElement("small");
  position.textContent = t("stageNav.position", {
    current: stageNavigation.current,
    total: stageNavigation.total
  });

  copy.append(title, position);

  const actions = document.createElement("div");
  actions.className = "stage-navigation__actions";
  actions.append(
    createStageNavButton(t("stageNav.previous"), !stageNavigation.hasPrevious, stageNavigation.onPrevious),
    createStageNavButton(t("stageNav.list"), false, stageNavigation.onShowList),
    createStageNavButton(t("stageNav.next"), !stageNavigation.hasNext, stageNavigation.onNext)
  );

  nav.append(copy, actions);
  return nav;
}

function createStageNavButton(label, disabled, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "stage-nav-button";
  button.textContent = label;
  button.disabled = disabled;
  button.addEventListener("click", onClick);
  return button;
}

function createReplayChallengeNote(hadMistake) {
  const note = document.createElement("p");
  note.className = hadMistake ? "replay-challenge-note warning" : "replay-challenge-note";
  note.textContent = hadMistake ? t("replayPicks.cleanBroken") : t("replayPicks.cleanRule");
  return note;
}
