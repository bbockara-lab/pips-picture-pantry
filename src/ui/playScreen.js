import { puzzleTitle, t } from "../i18n/index.js";
import { getDailyDateKey } from "../game/dailyPuzzle.js";
import { shouldShowCursorControls } from "./puzzleCursorControls.js";
import { renderPuzzleView } from "./puzzleView.js";

export function renderPlayScreen(activePuzzle, options) {
  const {
    dailyPuzzle,
    dailyBonus = 0,
    dailyChallenge = false,
    controlMode,
    onControlModeChange,
    onClosePuzzle,
    onViewAlbum,
    onNextPuzzle,
    onBackToSpoonRun,
    onPreviousStagePuzzle,
    onNextStagePuzzle,
    onShowPuzzlePicker,
    onPuzzleComplete,
    getStageNavigation,
    isTimeAttack = false,
    timeAttackRoundIndex = 0,
    timeAttackTotalRounds = 3,
    timeAttackElapsedSeconds = 0,
    timeAttackLimitSeconds = 0,
    replayChallenge = false,
    replayPicked = false,
    replayLastPick = false,
    getTimeAttackHintCost,
    puzzleState = null,
    onPuzzleStateChange
  } = options;

  const screen = document.createElement("section");
  screen.className = isTimeAttack ? "play-screen play-screen--time-attack" : replayChallenge ? "play-screen play-screen--replay" : "play-screen";
  screen.dataset.puzzleSize = String(activePuzzle.size);
  screen.setAttribute("aria-label", t("playScreen.aria"));

  const header = document.createElement("header");
  header.className = "play-screen__header";

  const title = document.createElement("div");
  title.className = "play-screen__title";
  const titleLabel = document.createElement("p");
  titleLabel.textContent = isTimeAttack
    ? t("timeAttack.round", { current: timeAttackRoundIndex + 1, total: timeAttackTotalRounds })
    : replayChallenge
      ? t("replayPicks.challengeLabel")
      : t("sections.currentPicture");
  const titleHeading = document.createElement("h1");
  titleHeading.textContent = puzzleTitle(activePuzzle);
  title.append(titleLabel, titleHeading);
  if (isTimeAttack) {
    const timer = document.createElement("p");
    timer.className = "play-screen__timer";
    const remainingSeconds = Math.max(0, Number(timeAttackLimitSeconds || 0) - Number(timeAttackElapsedSeconds || 0));
    timer.textContent = timeAttackLimitSeconds
      ? t("timeAttack.remaining", { time: formatElapsedSeconds(remainingSeconds) })
      : t("timeAttack.elapsed", { time: formatElapsedSeconds(timeAttackElapsedSeconds) });
    title.appendChild(timer);
  }

  const size = document.createElement("p");
  size.className = "difficulty";
  size.textContent = `${activePuzzle.size}×${activePuzzle.size}`;

  const usesCursorControls = shouldShowCursorControls(activePuzzle, controlMode);
  const quickControl = document.createElement("button");
  quickControl.type = "button";
  quickControl.className = "play-screen__control-toggle";
  quickControl.dataset.controlMode = usesCursorControls ? "cursor" : "direct";
  quickControl.setAttribute("aria-pressed", String(usesCursorControls));
  quickControl.setAttribute(
    "aria-label",
    usesCursorControls ? t("settings.switchToDirect") : t("settings.switchToCursor")
  );
  quickControl.title = usesCursorControls ? t("settings.switchToDirect") : t("settings.switchToCursor");

  const quickControlIcon = document.createElement("span");
  quickControlIcon.className = "play-screen__control-toggle-icon";
  quickControlIcon.setAttribute("aria-hidden", "true");
  quickControlIcon.textContent = usesCursorControls ? "✥" : "●";

  const quickControlLabel = document.createElement("span");
  quickControlLabel.className = "play-screen__control-toggle-label";
  quickControlLabel.textContent = usesCursorControls
    ? t("settings.controlsCursorShort")
    : t("settings.controlsDirectShort");
  quickControl.append(quickControlIcon, quickControlLabel);
  quickControl.addEventListener("click", () => {
    onControlModeChange?.(usesCursorControls ? "direct" : "cursor");
  });

  header.append(title, quickControl, size);

  const body = document.createElement("div");
  body.className = "play-screen__body";
  body.appendChild(renderPuzzleView(activePuzzle, {
    dailyKey: dailyChallenge && !isTimeAttack && !replayChallenge ? getDailyDateKey() : null,
    dailyBonus: dailyChallenge && !isTimeAttack && !replayChallenge ? dailyBonus : 0,
    onNextPuzzle,
    onBackToSpoonRun,
    controlMode,
    compactHeader: true,
    stageNavigation: isTimeAttack || replayChallenge ? null : getStageNavigation(activePuzzle, onPreviousStagePuzzle, onNextStagePuzzle, onShowPuzzlePicker),
    replayChallenge,
    replayPicked,
    replayLastPick,
    isTimeAttack,
    getTimeAttackHintCost,
    puzzleState,
    onPuzzleStateChange,
    onViewAlbum: replayChallenge ? onClosePuzzle : onViewAlbum,
    onPuzzleComplete
  }));

  screen.append(header, body);

  return screen;
}

export function getTimeAttackElapsedSeconds(startedAt) {
  if (!startedAt) return 0;
  return Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
}


function formatElapsedSeconds(seconds) {
  const value = Math.max(0, Math.floor(Number(seconds) || 0));
  const minutes = Math.floor(value / 60);
  const remainder = String(value % 60).padStart(2, "0");
  return minutes + ":" + remainder;
}
