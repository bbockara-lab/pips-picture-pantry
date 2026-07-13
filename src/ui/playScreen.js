import { puzzleTitle, t } from "../i18n/index.js";
import { renderPuzzleView } from "./puzzleView.js";

export function renderPlayScreen(activePuzzle, options) {
  const {
    dailyPuzzle,
    dailyBonus = 0,
    controlMode,
    onClosePuzzle,
    onRequestSettings,
    onNextPuzzle,
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
    getTimeAttackHintCost,
    onPuzzleStateChange
  } = options;

  const screen = document.createElement("section");
  screen.className = isTimeAttack ? "play-screen play-screen--time-attack" : replayChallenge ? "play-screen play-screen--replay" : "play-screen";
  screen.setAttribute("aria-label", t("playScreen.aria"));

  const header = document.createElement("header");
  header.className = "play-screen__header";

  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.className = "play-screen__back";
  backButton.textContent = t("playScreen.back");
  backButton.addEventListener("click", onClosePuzzle);

  const title = document.createElement("div");
  title.className = "play-screen__title";
  title.innerHTML = "<p>" + (isTimeAttack ? t("timeAttack.round", { current: timeAttackRoundIndex + 1, total: timeAttackTotalRounds }) : replayChallenge ? t("replayPicks.challengeLabel") : t("sections.currentPicture")) + "</p><h1>" + puzzleTitle(activePuzzle) + "</h1>";
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
  size.textContent = `${activePuzzle.size}x${activePuzzle.size}`;

  const settingsButton = document.createElement("button");
  settingsButton.type = "button";
  settingsButton.className = "play-screen__settings icon-button";
  settingsButton.title = t("header.settings");
  settingsButton.setAttribute("aria-label", t("header.settings"));
  settingsButton.textContent = "\u2699";
  settingsButton.addEventListener("click", onRequestSettings);

  header.append(backButton, title, settingsButton, size);

  const body = document.createElement("div");
  body.className = "play-screen__body";
  body.appendChild(renderPuzzleView(activePuzzle, {
    dailyKey: !isTimeAttack && !replayChallenge && activePuzzle.id === dailyPuzzle.id ? getDailyKey() : null,
    dailyBonus: !isTimeAttack && !replayChallenge && activePuzzle.id === dailyPuzzle.id ? dailyBonus : 0,
    onNextPuzzle,
    controlMode,
    compactHeader: true,
    stageNavigation: isTimeAttack || replayChallenge ? null : getStageNavigation(activePuzzle, onPreviousStagePuzzle, onNextStagePuzzle, onShowPuzzlePicker),
    replayChallenge,
    replayPicked,
    isTimeAttack,
    getTimeAttackHintCost,
    onPuzzleStateChange,
    onViewAlbum: replayChallenge ? onClosePuzzle : undefined,
    onPuzzleComplete
  }));

  screen.append(header, body);
  return screen;
}

export function getTimeAttackElapsedSeconds(startedAt) {
  if (!startedAt) return 0;
  return Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
}

function getDailyKey() {
  return new Date().toISOString().slice(0, 10);
}

function formatElapsedSeconds(seconds) {
  const value = Math.max(0, Math.floor(Number(seconds) || 0));
  const minutes = Math.floor(value / 60);
  const remainder = String(value % 60).padStart(2, "0");
  return minutes + ":" + remainder;
}
