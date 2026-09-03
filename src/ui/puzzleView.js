import { CELL, countMistakes, isSolved } from "../game/nonogram.js";
import { createReplayCleanStatus, isReplayClean, updateReplayCleanStatus } from "../game/replayChallenge.js";
import {
  applyCompletedLineMarks,
  createPuzzleState,
  paintCells,
  setCursor,
  setMode,
  toggleCell,
  undoLastMove
} from "../game/puzzleState.js";
import { getPuzzleExtraHintCost } from "../data/economyConfig.js";
import { getFeaturedJar, getPantrySpoons, loadPuzzleState, recordReplayReward, savePuzzleState, spendPantrySpoons } from "../game/save.js";
import { puzzleTitle, t } from "../i18n/index.js";
import { playComplete, playCue, playCursorAction, playCursorMove, playTap } from "./audio.js";
import { getHintLimit, getHintRevealCount, renderHintPanel, renderMarkHint } from "./puzzleAssistView.js";
import { applyCursorAction, createCursorControlSession, moveSelectedCell, renderCursorControls, shouldShowCursorControls } from "./puzzleCursorControls.js";
import { getLineGuidance, renderBoard } from "./boardView.js";
import { isReplayExhausted, renderCompletionBanner } from "./pipReaction.js";
import { createPuzzleControlArtImage } from "./puzzleControlArt.js";
import { getSeasonalThemeForPack, getSeasonalThemeLabel } from "../data/seasonalThemes.js";

export function renderPuzzleView(puzzle, options = {}) {
  const isReplayChallenge = Boolean(options.replayChallenge);
  const isTimeAttack = Boolean(options.isTimeAttack);
  const isDailyChallenge = Boolean(options.dailyKey);
  // Time Attack is a fresh three-round run. Reusing a normal puzzle save here
  // can make a round arrive already completed and skip straight out of the run.
  const usesTransientState = isReplayChallenge || isTimeAttack || isDailyChallenge;
  let state = isTimeAttack
    ? options.puzzleState || createPuzzleState(puzzle)
    : isReplayChallenge || isDailyChallenge
      ? createPuzzleState(puzzle)
      : loadPuzzleState(puzzle.id) || createPuzzleState(puzzle);
  let replayCleanStatus = createReplayCleanStatus();
  let replayResult = null;
  let dailyResult = null;
  let rewardResult = null;
  let stageBonus = 0;
  const controlMode = options.controlMode || "auto";
  const cursorControlsUnlocked = Boolean(options.cursorControlsUnlocked);
  const cursorControlSession = createCursorControlSession(state, options.cursorTrailEnabled !== false);
  const section = document.createElement("section");
  const puzzleTheme = getSeasonalThemeForPack(puzzle.packId);
  if (puzzleTheme) section.dataset.eventTheme = puzzleTheme.id;
  section.className = [
    "puzzle-panel",
    "content-panel",
    state.completed ? "completed" : "",
    isTimeAttack ? "puzzle-panel--time-attack" : ""
  ].filter(Boolean).join(" ");
  section.tabIndex = 0;
  section.addEventListener("keydown", handlePuzzleKeydown);

  function update(nextState, updateOptions = {}) {
    const wasCompleted = state.completed;
    const shouldAutoMark = !updateOptions.skipAutoLineMarks && nextState.cells !== state.cells && !nextState.completed;
    const resolvedState = shouldAutoMark ? applyCompletedLineMarks(nextState, puzzle.solution) : nextState;
    state = {
      ...resolvedState,
      completed: isSolved(resolvedState, puzzle.solution) || resolvedState.completed
    };
    replayCleanStatus = getReplayCleanStatusAfterState(isReplayChallenge, replayCleanStatus, state, puzzle.solution);
    if (!usesTransientState) {
      rewardResult = savePuzzleState(state, {
        reward: puzzle.reward || 0,
        dailyBonus: options.dailyBonus || 0,
        dailyKey: options.dailyKey || null
      });
    }
    options.onPuzzleStateChange?.(puzzle, state);
    if (!wasCompleted && state.completed) {
      if (isDailyChallenge) {
        dailyResult = savePuzzleState(state, {
          reward: puzzle.reward || 0,
          dailyBonus: options.dailyBonus || 0,
          dailyKey: options.dailyKey
        });
        rewardResult = dailyResult;
      }
      if (isReplayChallenge) {
        replayResult = recordReplayReward({
          puzzleId: puzzle.id,
          clean: isReplayClean(replayCleanStatus),
          picked: Boolean(options.replayPicked)
        });
      }
      playComplete();
      if (!isReplayChallenge) {
        stageBonus = Number(options.onPuzzleComplete?.(puzzle, state)?.bonus || 0);
      }
    }
    draw();
  }

  function handlePuzzleKeydown(event) {
    if (shouldIgnoreKeyboardEvent(event) || state.completed) {
      return;
    }

    const cursorControlsEnabled = shouldShowCursorControls(puzzle, controlMode, cursorControlsUnlocked, { isTimeAttack });
    if (!cursorControlsEnabled) {
      return;
    }

    const key = event.key;
    if (key === "ArrowUp") {
      event.preventDefault();
      moveSelectedCell(state, -1, 0, puzzle.size, update, cursorControlSession, { paintTrail: event.repeat });
    } else if (key === "ArrowDown") {
      event.preventDefault();
      moveSelectedCell(state, 1, 0, puzzle.size, update, cursorControlSession, { paintTrail: event.repeat });
    } else if (key === "ArrowLeft") {
      event.preventDefault();
      moveSelectedCell(state, 0, -1, puzzle.size, update, cursorControlSession, { paintTrail: event.repeat });
    } else if (key === "ArrowRight") {
      event.preventDefault();
      moveSelectedCell(state, 0, 1, puzzle.size, update, cursorControlSession, { paintTrail: event.repeat });
    } else if (key === " " || key === "Enter") {
      event.preventDefault();
      applyCursorAction(state, "fill", update, cursorControlSession);
    } else if (key.toLowerCase() === "x" || key === "Backspace" || key === "Delete") {
      event.preventDefault();
      applyCursorAction(state, "mark", update, cursorControlSession);
    } else if (key.toLowerCase() === "z" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      update(undoLastMove(state), { skipAutoLineMarks: true });
    }
  }

  function draw() {
    section.replaceChildren();
    section.className = [
    "puzzle-panel",
    "content-panel",
    state.completed ? "completed" : "",
    isTimeAttack ? "puzzle-panel--time-attack" : ""
  ].filter(Boolean).join(" ");
    section.classList.toggle("replay-challenge", isReplayChallenge);
    section.dataset.eventTheme = puzzleTheme?.id || "";

    const meta = document.createElement("div");
    meta.className = "puzzle-meta";
    const metaCopy = document.createElement("div");
    if (puzzleTheme) {
      const eventBadge = document.createElement("span");
      eventBadge.className = "puzzle-meta__event-badge";
      eventBadge.textContent = getSeasonalThemeLabel(puzzleTheme, t);
      metaCopy.appendChild(eventBadge);
    }
    const metaLabel = document.createElement("p");
    metaLabel.className = "section-label";
    metaLabel.textContent = isReplayChallenge ? t("replayPicks.challengeLabel") : getPuzzleLabel(puzzle);
    const metaTitle = document.createElement("h2");
    metaTitle.textContent = puzzleTitle(puzzle);
    metaCopy.append(metaLabel, metaTitle);
    const difficulty = document.createElement("p");
    difficulty.className = "difficulty";
    difficulty.textContent = `${puzzle.size}\u00d7${puzzle.size}`;
    meta.append(metaCopy, difficulty);
    if (!options.compactHeader) {
      section.appendChild(meta);
    }
    if (isReplayChallenge) {
      section.appendChild(createReplayChallengeNote(!isReplayClean(replayCleanStatus)));
    }
    if (state.completed) {
      section.appendChild(renderCompletionBanner(puzzle, {
        ...options,
        replayResult,
        replayExhausted: isReplayExhausted(isReplayChallenge, replayResult),
        isDailyPuzzle: isDailyChallenge,
        dailyResult,
        rewardResult,
        stageBonus,
        featuredJar: isTimeAttack
          ? null
          : getFeaturedJar()
      }));
      return;
    }
    const cursorControlsEnabled = shouldShowCursorControls(puzzle, controlMode, cursorControlsUnlocked, { isTimeAttack });
    const canSwitchControlMode = Number(puzzle.size) >= 8 || (cursorControlsUnlocked && !isTimeAttack);
    const controlModeToggle = canSwitchControlMode
      ? createControlModeToggle(cursorControlsEnabled, options.onControlModeChange)
      : null;
    if (isTimeAttack) {
      appendHintPanel(true);
    }

    section.appendChild(renderBoard(puzzle, state, (row, column, action = {}) => {
      const cursorState = setCursor(state, row, column, puzzle.size);
      if (cursorControlsEnabled) {
        playCursorMove();
        // In D-pad mode a board tap only repositions the cursor. Applying the
        // current paint action here made Blank feel broken because a tap could
        // colour a square before the player pressed either action.
        update(cursorState, { skipAutoLineMarks: true });
        return;
      }
      if (Array.isArray(action.paintCells) && action.paintValue) {
        playCue(action.paintValue === CELL.marked ? "sfx_drag_step_mark" : "sfx_drag_step_fill", { volume: 0.52 });
        update(paintCells(cursorState, action.paintCells, action.paintValue));
        return;
      }
      const currentValue = state.cells?.[row]?.[column];
      playCue(currentValue === CELL.empty
        ? (state.mode === "mark" ? "sfx_cell_mark_x" : "sfx_cell_fill")
        : "sfx_cell_clear", { volume: 0.58 });
      update(toggleCell(cursorState, row, column));
    }, {
      completed: state.completed,
      locked: state.completed,
      cursorEnabled: cursorControlsEnabled,
      cursorOnly: cursorControlsEnabled
    }));
    if (!cursorControlsEnabled) {
      section.appendChild(createControls(state, update, controlModeToggle));
    }
    if (!state.completed && cursorControlsEnabled) {
      section.appendChild(renderCursorControls(state, puzzle, update, {
        session: cursorControlSession,
        getState: () => state,
        redraw: draw,
        controlModeToggle
      }));
    }
    if (!isTimeAttack) {
      appendHintPanel(true);
    }
    section.appendChild(createProgressLine(state, puzzle));

    if (state.mode === "mark" && !state.completed) {
      section.appendChild(renderMarkHint());
    }

  }
  function appendHintPanel(compact = false) {
    const baseHintLimit = getHintLimit(puzzle);
    const hintLimit = isTimeAttack ? 3 : baseHintLimit;
    if (state.completed || hintLimit <= 0) {
      return;
    }
    const paidHintCount = Math.max(0, Number(state.paidHintsUsed || 0));
    const hintCost = getPuzzleHintCost({
      puzzleSize: puzzle.size,
      hintsUsed: state.hintsUsed,
      paidHintsUsed: paidHintCount,
      hintLimit,
      isTimeAttack,
      getTimeAttackHintCost: options.getTimeAttackHintCost
    });
    const revealCount = getHintRevealCount(puzzle, { isTimeAttack });
    section.appendChild(renderHintPanel(state, puzzle, update, hintLimit, {
      cost: hintCost,
      revealCount,
      balance: hintCost > 0 ? getPantrySpoons() : 0,
      paid: hintCost > 0,
      timeAttack: isTimeAttack,
      compact,
      onSpendHint: hintCost > 0
        ? (cost) => spendPantrySpoons(cost, isTimeAttack ? "time-attack-hint" : "puzzle-extra-hint").allowed
        : null
    }));
  }
  draw();
  options.onPuzzleStateChange?.(puzzle, state);
  return section;
}

export function getPuzzleHintCost({
  puzzleSize,
  hintsUsed = 0,
  paidHintsUsed = 0,
  hintLimit = 0,
  isTimeAttack = false,
  getTimeAttackHintCost
} = {}) {
  if (isTimeAttack) {
    return getTimeAttackHintCost?.(paidHintsUsed) || 0;
  }

  if (Number(hintsUsed || 0) < hintLimit) {
    return 0;
  }

  return getPuzzleExtraHintCost(puzzleSize, paidHintsUsed);
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

function createControls(state, update, controlModeToggle = null) {
  const controls = document.createElement("div");
  controls.className = "controls";

  const fillButton = createModeButton(t("controls.fill"), state.mode === "fill", () =>
    update(setMode(state, "fill")),
    "fill"
  );
  const markButton = createModeButton(t("controls.mark"), state.mode === "mark", () =>
    update(setMode(state, "mark")),
    "mark"
  );
  markButton.title = t("controls.markHint");
  markButton.setAttribute("aria-label", t("controls.markHint"));

  const undoButton = document.createElement("button");
  undoButton.type = "button";
  undoButton.className = "tool-button control-button control-button--undo";
  undoButton.setAttribute("aria-label", t("controls.undo"));
  undoButton.append(createControlIcon("undo"), createControlLabel(t("controls.undo")));
  undoButton.disabled = state.history.length === 0 || state.completed;
  undoButton.addEventListener("click", () => update(undoLastMove(state), { skipAutoLineMarks: true }));

  controls.append(fillButton, markButton, undoButton);
  if (controlModeToggle) controls.appendChild(controlModeToggle);
  return controls;
}

function createControlModeToggle(usesCursorControls, onControlModeChange) {
  const targetMode = usesCursorControls ? "direct" : "cursor";
  const button = document.createElement("button");
  button.type = "button";
  button.className = `control-mode-toggle control-mode-toggle--${targetMode}`;
  button.dataset.targetControlMode = targetMode;
  button.setAttribute("aria-label", t(usesCursorControls ? "settings.switchToDirect" : "settings.switchToCursor"));
  const icon = document.createElement("span");
  icon.className = "control-mode-toggle__icon";
  icon.setAttribute("aria-hidden", "true");
  const label = document.createElement("span");
  label.textContent = t(usesCursorControls ? "settings.controlsDirectShort" : "settings.controlsCursorShort");
  button.append(icon, label);
  button.addEventListener("click", () => onControlModeChange?.(targetMode));
  return button;
}

function createModeButton(label, active, onClick, iconName) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = active ? "mode-button control-button active" : "mode-button control-button";
  button.setAttribute("aria-label", label);
  button.append(createControlIcon(iconName), createControlLabel(label));
  button.addEventListener("click", onClick);
  return button;
}

function createControlIcon(name) {
  const icon = document.createElement("span");
  icon.className = `control-button__icon control-button__icon--raster control-button__icon--${name}`;
  icon.setAttribute("aria-hidden", "true");

  const image = createPuzzleControlArtImage(name);
  if (image) {
    icon.appendChild(image);
  }
  return icon;
}

function createControlLabel(label) {
  const text = document.createElement("span");
  text.className = "control-button__label";
  text.textContent = label;
  return text;
}

function countSolutionFilledCells(solution) {
  return solution.reduce((total, row) => {
    const cells = Array.isArray(row) ? row : String(row).split("");
    return total + cells.filter((cell) => cell === 1 || cell === "1" || cell === true).length;
  }, 0);
}

function countGuidedLines(state, puzzle) {
  const guidance = getLineGuidance(puzzle, state);
  return guidance.completedRows.size + guidance.completedColumns.size;
}

function createProgressLine(state, puzzle) {
  const line = document.createElement("p");
  line.className = "progress-line";
  const text = document.createElement("span");
  text.className = "progress-line__text";

  if (state.completed) {
    line.classList.add("complete");
    line.style.setProperty("--progress-ratio", "1");
    text.textContent = t("progress.complete");
    line.append(text);
    return line;
  }

  const filledCount = state.cells.flat().filter((cell) => cell === "filled").length;
  const targetCount = countSolutionFilledCells(puzzle.solution);
  const progressRatio = targetCount > 0 ? Math.min(1, filledCount / targetCount) : 0;
  line.style.setProperty("--progress-ratio", progressRatio.toFixed(3));
  const mistakes = countMistakes(state, puzzle.solution);
  line.classList.toggle("warning", mistakes > 0);
  text.textContent = mistakes > 0
    ? t("progress.revisitOf", { count: filledCount, target: targetCount, mistakes })
    : t("progress.filledOf", { count: filledCount, target: targetCount });

  const guidedLineCount = countGuidedLines(state, puzzle);
  if (guidedLineCount > 0) {
    const badge = document.createElement("span");
    badge.className = "progress-line__badge";
    const lineCopyKey = guidedLineCount === 1 ? "progress.lineGuided" : "progress.linesGuided";
    const lineAriaKey = guidedLineCount === 1 ? "progress.lineGuidedAria" : "progress.linesGuidedAria";
    badge.textContent = t(lineCopyKey, { count: guidedLineCount });
    badge.setAttribute("aria-label", t(lineAriaKey, { count: guidedLineCount }));
    line.append(text, badge);
    return line;
  }

  line.append(text);
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
    createStageNavButton(t("stageNav.previous"), !stageNavigation.hasPrevious, stageNavigation.onPrevious, "previous"),
    createStageNavButton(t("stageNav.next"), !stageNavigation.hasNext, stageNavigation.onNext, "next")
  );

  nav.append(copy, actions);
  return nav;
}

function createStageNavButton(label, disabled, onClick, variant) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `stage-nav-button stage-nav-button--${variant}`;
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
