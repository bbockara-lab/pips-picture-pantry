import { getPackById } from "../data/packs.js";
import { ECONOMY, getTimeAttackHintCost } from "../data/economyConfig.js";
import { puzzles } from "../data/puzzles.js";
import { getDailyPuzzle } from "../game/dailyPuzzle.js";
import { getDailyReplayPicks } from "../game/replayPicks.js";
import {
  getCompletedPuzzleIds,
  getTimeAttackBestScores,
  getTimeAttackDailyCount,
  getReplayDailyCount,
  hasSeenGuide,
  isPackUnlocked,
  markGuideSeen,
  markPackCompletedIfFirst,
  resetProgress,
  setActivePlayerName,
  unlockPack
} from "../game/save.js";
import { setLanguagePreference } from "../i18n/index.js";
import { renderAlbumView } from "./albumView.js";
import { renderBadgeShelf, renderFooter, renderHeader, renderPipStrip, renderResetDialog } from "./appChrome.js";
import { playStageComplete, setMusicEnabled, setSfxEnabled, startMusic } from "./audio.js";
import { renderPantryMapView } from "./mapView.js";
import { renderPantryView } from "./pantryView.js";
import { getControlModePreference, getHideCompletedStagesPreference, setControlModePreference, setHideCompletedStagesPreference } from "./preferences.js";
import { getStageNavigation, renderDailyCard, renderPuzzleHub, renderPuzzlePicker, renderReplayPicksCard } from "./puzzleHubView.js";
import { renderPlayScreen } from "./playScreen.js";
import { renderFloatingNav } from "./floatingNav.js";
import { renderGuideDialog } from "./guideDialog.js";
import { renderStageCompleteOverlay } from "./stageComplete.js";
import { renderSettingsDialog } from "./settingsView.js";
import { advanceTimeAttackSession, createTimeAttackSession, getTimeAttackElapsedSeconds, TIME_ATTACK_TRIAL_ROUNDS } from "./timeAttackFlow.js";
import { renderTimeAttackView } from "./timeAttackView.js";

export const APP_VERSION = "v0.1.228";
const DAILY_BONUS = ECONOMY.DAILY_BONUS;

export function renderApp(root) {
  const dailyPuzzle = getDailyPuzzle(getDailyPuzzleCandidates());
  let activePuzzle = getStartPuzzle();
  let activeView = "puzzle";
  let playOpen = true;
  let resetOpen = false;
  let settingsOpen = false;
  let hideCompletedStages = getHideCompletedStagesPreference();
  let controlMode = getControlModePreference();
  let pendingScrollTarget = null;
  let activeTimeAttackRun = null;
  let activeTimeAttackSeed = null;
  let activeTimeAttackStartedAt = null;
  let timeAttackTimerHandle = null;
  let timeAttackRoundIndex = 0;
  let timeAttackLastResult = null;
  let activeGuide = null;
  let replayChallenge = false;

  function selectPuzzle(puzzleId, scrollTarget = "puzzle", options = {}) {
    const nextPuzzle = puzzles.find((puzzle) => puzzle.id === puzzleId) || dailyPuzzle;
    if (!isPackUnlocked(getPackById(nextPuzzle.packId))) {
      return;
    }

    activePuzzle = nextPuzzle;
    replayChallenge = Boolean(options.replayChallenge);
    activeView = "puzzle";
    playOpen = true;
    resetOpen = false;
    settingsOpen = false;
    pendingScrollTarget = scrollTarget;
    draw();
  }

  function selectStagePuzzle(direction) {
    const packPuzzles = puzzles.filter((puzzle) => puzzle.packId === activePuzzle.packId);
    const currentIndex = packPuzzles.findIndex((puzzle) => puzzle.id === activePuzzle.id);
    const nextPuzzle = packPuzzles[currentIndex + direction];
    if (nextPuzzle) {
      selectPuzzle(nextPuzzle.id);
    }
  }

  function showPuzzlePicker() {
    replayChallenge = false;
    activeView = "puzzle";
    playOpen = false;
    resetOpen = false;
    settingsOpen = false;
    pendingScrollTarget = "picker";
    draw();
  }

  function selectNextPuzzle() {
    const completedPuzzleIds = getCompletedPuzzleIds();
    const unlockedPuzzles = puzzles.filter((puzzle) => isPackUnlocked(getPackById(puzzle.packId)));
    const nextUnfinished = unlockedPuzzles.find((puzzle) => !completedPuzzleIds.includes(puzzle.id));
    if (nextUnfinished) {
      selectPuzzle(nextUnfinished.id);
      return;
    }
    const currentIndex = unlockedPuzzles.findIndex((puzzle) => puzzle.id === activePuzzle.id);
    const nextPuzzle = unlockedPuzzles[(currentIndex + 1) % unlockedPuzzles.length] || dailyPuzzle;
    selectPuzzle(nextPuzzle.id);
  }

  function selectView(view) {
    replayChallenge = false;
    activeView = view;
    playOpen = false;
    resetOpen = false;
    settingsOpen = false;
    draw();
  }

  function closeGuide() {
    if (activeGuide) {
      markGuideSeen(activeGuide);
      activeGuide = null;
      draw();
    }
  }

  function requestPantryFirstPurchaseGuide() {
    if (!hasSeenGuide("pantryFirstPurchase")) {
      activeGuide = "pantryFirstPurchase";
    }
  }

  function startTimeAttackRun() {
    const session = createTimeAttackSession({ currentPuzzle: activePuzzle, rounds: TIME_ATTACK_TRIAL_ROUNDS });
    activeTimeAttackSeed = session.seed;
    activeTimeAttackRun = session.run;
    activeTimeAttackStartedAt = session.startedAt;
    timeAttackRoundIndex = session.roundIndex;
    activePuzzle = session.activePuzzle;
    replayChallenge = false;
    activeView = "timeAttack";
    playOpen = true;
    resetOpen = false;
    settingsOpen = false;
    timeAttackLastResult = session.lastResult;
    draw();
  }
  function closeTimeAttackRun() {
    replayChallenge = false;
    activeView = "timeAttack";
    playOpen = false;
    activeTimeAttackRun = null;
    activeTimeAttackStartedAt = null;
    timeAttackRoundIndex = 0;
    draw();
  }

  function completeTimeAttackPuzzle(puzzle) {
    const result = advanceTimeAttackSession({
      run: activeTimeAttackRun,
      seed: activeTimeAttackSeed,
      startedAt: activeTimeAttackStartedAt,
      roundIndex: timeAttackRoundIndex,
      puzzle
    });

    if (result.status === "closed") {
      closeTimeAttackRun();
      return;
    }

    if (result.status === "next-round") {
      timeAttackRoundIndex = result.roundIndex;
      activePuzzle = result.activePuzzle;
      draw();
      return;
    }

    timeAttackLastResult = result.result;
    replayChallenge = false;
    activeView = "timeAttack";
    playOpen = false;
    activeTimeAttackRun = null;
    timeAttackRoundIndex = 0;
    draw();
  }
  function requestReset() {
    resetOpen = true;
    settingsOpen = false;
    draw();
  }

  function cancelReset() {
    resetOpen = false;
    draw();
  }

  function confirmReset() {
    resetProgress();
    resetOpen = false;
    replayChallenge = false;
    activePuzzle = getStartPuzzle();
    draw();
  }

  function requestSettings() {
    settingsOpen = true;
    resetOpen = false;
    draw();
  }

  function closeSettings() {
    settingsOpen = false;
    draw();
  }

  function changeLanguage(preference) {
    setLanguagePreference(preference);
    draw();
  }

  function changePlayerName(name) {
    setActivePlayerName(name);
    settingsOpen = false;
    draw();
  }

  function changeSfx(enabled) {
    setSfxEnabled(enabled);
    draw();
  }

  function changeMusic(enabled) {
    setMusicEnabled(enabled);
    if (enabled) {
      startMusic();
    }
    draw();
  }

  function toggleHideCompletedStages() {
    hideCompletedStages = !hideCompletedStages;
    setHideCompletedStagesPreference(hideCompletedStages);
    draw();
  }

  function changeControlMode(mode) {
    controlMode = setControlModePreference(mode);
    draw();
  }

  function requestUnlockPack(packId) {
    unlockPack(getPackById(packId));
    draw();
  }

  function checkStageComplete(puzzle) {
    const pack = getPackById(puzzle.packId);
    if (!pack || pack.access === "bonus-pack") {
      return;
    }

    const completedPuzzleIds = new Set(getCompletedPuzzleIds());
    const packPuzzles = puzzles.filter((candidate) => candidate.packId === pack.id);
    if (!packPuzzles.length || !packPuzzles.every((candidate) => completedPuzzleIds.has(candidate.id))) {
      return;
    }

    const completionResult = markPackCompletedIfFirst(pack);
    if (!completionResult.completed) {
      return;
    }

    globalThis.setTimeout(() => {
      playStageComplete();
      document.body.appendChild(renderStageCompleteOverlay(pack, draw, completionResult));
    }, 700);
  }

  function draw() {
    if (timeAttackTimerHandle) {
      globalThis.clearTimeout(timeAttackTimerHandle);
      timeAttackTimerHandle = null;
    }
    root.innerHTML = "";
    if (!activeGuide && activeView === "puzzle" && playOpen && !hasSeenGuide("puzzle")) {
      activeGuide = "puzzle";
    } else if (!activeGuide && activeView === "timeAttack" && !playOpen && !hasSeenGuide("timeAttack")) {
      activeGuide = "timeAttack";
    }

    const shell = createShell({
      activePuzzle,
      activeView,
      playOpen,
      dailyPuzzle,
      resetOpen,
      settingsOpen,
      onSelectPuzzle: selectPuzzle,
      onSelectView: selectView,
      onOpenPuzzle: () => {
        playOpen = true;
        draw();
      },
      onClosePuzzle: showPuzzlePicker,
      onRequestReset: requestReset,
      onCancelReset: cancelReset,
      onConfirmReset: confirmReset,
      onRequestSettings: requestSettings,
      onCloseSettings: closeSettings,
      onLanguageChange: changeLanguage,
      onPlayerChange: changePlayerName,
      onSfxChange: changeSfx,
      onMusicChange: changeMusic,
      controlMode,
      onControlModeChange: changeControlMode,
      onUnlockPack: requestUnlockPack,
      hideCompletedStages,
      onToggleHideCompletedStages: toggleHideCompletedStages,
      onNextPuzzle: selectNextPuzzle,
      onPreviousStagePuzzle: () => selectStagePuzzle(-1),
      onNextStagePuzzle: () => selectStagePuzzle(1),
      onShowPuzzlePicker: showPuzzlePicker,
      replayChallenge,
      replayPicked: replayChallenge,
      onPuzzleComplete: checkStageComplete,
      onStartTimeAttack: startTimeAttackRun,
      onCloseTimeAttack: closeTimeAttackRun,
      onTimeAttackPuzzleComplete: completeTimeAttackPuzzle,
      timeAttackRun: activeTimeAttackRun,
      timeAttackStartedAt: activeTimeAttackStartedAt,
      timeAttackRoundIndex,
      timeAttackLastResult,
      activeGuide,
      onReplayPick: (puzzleId) => selectPuzzle(puzzleId, "puzzle", { replayChallenge: true }),
      onCloseGuide: closeGuide,
      onPantryFirstPurchase: requestPantryFirstPurchaseGuide
    });
    root.appendChild(shell);
    scrollAfterDraw(root);
    if (activeView === "timeAttack" && playOpen && activeTimeAttackStartedAt) {
      timeAttackTimerHandle = globalThis.setTimeout(draw, 1000);
    }
  }

  function scrollAfterDraw(container) {
    if (!pendingScrollTarget) {
      return;
    }
    const target = pendingScrollTarget;
    pendingScrollTarget = null;
    globalThis.setTimeout(() => {
      const selector = target === "picker"
        ? `[data-pack-id="${activePuzzle.packId}"]`
        : ".puzzle-panel";
      container.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  draw();
}

function getStartPuzzle() {
  return puzzles.find((puzzle) => puzzle.id === "pips-first-shelf-pip-face-1") || puzzles[0];
}

function getDailyPuzzleCandidates() {
  const unlocked = puzzles.filter((puzzle) => isPackUnlocked(getPackById(puzzle.packId)));
  return unlocked.length ? unlocked : puzzles;
}

function createShell({
  activePuzzle,
  activeView,
  playOpen,
  dailyPuzzle,
  resetOpen,
  settingsOpen,
  onSelectPuzzle,
  onSelectView,
  onOpenPuzzle,
  onClosePuzzle,
  onRequestReset,
  onCancelReset,
  onConfirmReset,
  onRequestSettings,
  onCloseSettings,
  onLanguageChange,
  onPlayerChange,
  onSfxChange,
  onMusicChange,
  controlMode,
  onControlModeChange,
  onUnlockPack,
  hideCompletedStages,
  onToggleHideCompletedStages,
  onNextPuzzle,
  onPreviousStagePuzzle,
  onNextStagePuzzle,
  onShowPuzzlePicker,
  onPuzzleComplete,
  onStartTimeAttack,
  onCloseTimeAttack,
  onTimeAttackPuzzleComplete,
  onReplayPick,
  replayChallenge,
  replayPicked,
  timeAttackRun,
  timeAttackStartedAt,
  timeAttackRoundIndex,
  timeAttackLastResult,
  activeGuide,
  onCloseGuide,
  onPantryFirstPurchase
}) {
  const shell = document.createElement("main");
  shell.className = "app-shell";

  if ((activeView === "puzzle" || activeView === "timeAttack") && playOpen) {
    shell.classList.add("app-shell--play");
    shell.appendChild(renderPlayScreen(activePuzzle, {
      dailyPuzzle,
      dailyBonus: DAILY_BONUS,
      controlMode,
      onClosePuzzle: activeView === "timeAttack" ? onCloseTimeAttack : onClosePuzzle,
      onRequestSettings,
      onViewAlbum: () => onSelectView("album"),
      onNextPuzzle,
      onPreviousStagePuzzle,
      onNextStagePuzzle,
      onShowPuzzlePicker,
      getStageNavigation,
      onPuzzleComplete: activeView === "timeAttack" ? onTimeAttackPuzzleComplete : onPuzzleComplete,
      isTimeAttack: activeView === "timeAttack",
      timeAttackRoundIndex,
      timeAttackTotalRounds: timeAttackRun?.length || TIME_ATTACK_TRIAL_ROUNDS,
      timeAttackElapsedSeconds: getTimeAttackElapsedSeconds(timeAttackStartedAt),
      getTimeAttackHintCost,
      replayChallenge,
      replayPicked
    }));
    if (settingsOpen) {
      shell.appendChild(renderSettingsDialog({ onClose: onCloseSettings, onLanguageChange, onPlayerChange, onSfxChange, onMusicChange, controlMode, onControlModeChange }));
    }
    if (activeGuide) {
      shell.appendChild(renderGuideDialog(activeGuide, onCloseGuide));
    }
    return shell;
  }

  shell.appendChild(renderHeader(onRequestSettings, onRequestReset));
  const earnedBadgeShelf = renderBadgeShelf();
  if (earnedBadgeShelf) {
    shell.appendChild(earnedBadgeShelf);
  }
  shell.appendChild(renderPipStrip(activePuzzle, activeView));

  if (activeView === "album") {
    shell.appendChild(renderAlbumView());
  } else if (activeView === "map") {
    shell.appendChild(renderPantryMapView());
  } else if (activeView === "pantry") {
    shell.appendChild(renderPantryView(() => onSelectView("pantry"), onPantryFirstPurchase, () => onSelectView("puzzle")));
  } else if (activeView === "timeAttack") {
    shell.appendChild(renderTimeAttackView({
      bestScores: getTimeAttackBestScores(),
      dailyCount: getTimeAttackDailyCount(),
      dailyLimit: ECONOMY.TIME_ATTACK_DAILY_LIMIT,
      lastResult: timeAttackLastResult,
      onStart: onStartTimeAttack
    }));
  } else {
    shell.appendChild(renderPuzzleHub(activePuzzle, onOpenPuzzle));
    shell.appendChild(renderDailyCard(dailyPuzzle, activePuzzle.id, onSelectPuzzle, DAILY_BONUS));
    const replayPicksCard = renderReplayPicksCard(
      getDailyReplayPicks({ allPuzzles: getDailyPuzzleCandidates(), completedPuzzleIds: getCompletedPuzzleIds() }),
      activePuzzle.id,
      onSelectPuzzle,
      { dailyCount: getReplayDailyCount(), dailyLimit: ECONOMY.REPLAY_PICK_DAILY_LIMIT, onReplayPick }
    );
    if (replayPicksCard) {
      shell.appendChild(replayPicksCard);
    }
    shell.appendChild(renderPuzzlePicker(activePuzzle.id, onSelectPuzzle, onUnlockPack, {
      hideCompletedStages,
      onToggleHideCompletedStages,
      onOpenPantry: () => onSelectView("pantry")
    }));
  }

  shell.appendChild(renderFooter(APP_VERSION));
  shell.appendChild(renderFloatingNav(activeView, onSelectView));

  if (resetOpen) {
    shell.appendChild(renderResetDialog(onCancelReset, onConfirmReset));
  }

  if (settingsOpen) {
    shell.appendChild(renderSettingsDialog({ onClose: onCloseSettings, onLanguageChange, onPlayerChange, onSfxChange, onMusicChange, controlMode, onControlModeChange }));
  }

  if (activeGuide) {
    shell.appendChild(renderGuideDialog(activeGuide, onCloseGuide));
  }

  return shell;
}


