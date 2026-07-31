import { getSeasonShelfForPuzzle, getSeasonShelfPuzzles } from "../data/seasonShelves.js";
import { ECONOMY, getTimeAttackHintCost } from "../data/economyConfig.js";
import { puzzles } from "../data/puzzles.js";
import { getDailyDateKey, getDailyPuzzle } from "../game/dailyPuzzle.js";
import { getDailyReplayPicks, getNextDailyReplayPick } from "../game/replayPicks.js";
import {
  getCompletedPuzzleIds,
  claimLoginBonus,
  getDailyCompletedDate,
  getReplayDailyCount,
  getPantrySpoons,
  getTimeAttackBestScores,
  getTimeAttackDailyCount,
  hasSeenGuide,
  hasActivePlayer,
  isShelfUnlocked,
  markGuideSeen,
  markShelfCompletedIfFirst,
  recordDailyComplete,
  resetProgress,
  setActivePlayerName
} from "../game/save.js";
import { getCozySupportProduct, getSpoonJarSmallProduct, purchaseCozySupportPack, purchaseSpoonJarSmall, restorePendingPurchases } from "../game/billing.js";
import { setLanguagePreference } from "../i18n/index.js";
import { renderAlbumView } from "./albumView.js";
import { renderResetDialog } from "./appChrome.js";
import { playStageComplete, setMusicEnabled, setSfxEnabled, startMusic } from "./audio.js";
import { getBadgeForCompletedShelf } from "../game/badges.js";
import { renderBadgeEarnedToast, renderPantryMapView } from "./mapView.js";
import { renderPantryView } from "./pantryView.js";
import { getNextPantryGuideId } from "./pantryGuideFlow.js";
import { getControlModePreference, setControlModePreference } from "./preferences.js";
import {
  getStageNavigation,
  getPuzzleHubOpenDecision,
  renderPuzzleHub,
  renderPuzzlePicker,
  renderSpoonRunView
} from "./puzzleHubView.js";
import { renderPlayScreen } from "./playScreen.js";
import { renderFloatingNav } from "./floatingNav.js";
import { renderAllPuzzlesDoneDialog, renderGuideDialog } from "./guideDialog.js";
import { renderSpoonBalanceChip } from "./spoonIcon.js";
import { renderStageCompleteOverlay } from "./stageComplete.js";
import { canPurchaseSpoonJar, canPurchaseSupportPack, renderSettingsDialog, renderSpoonStore } from "./settingsView.js";
import { advanceTimeAttackSession, createTimeAttackSession, finishTimeAttackSession, getTimeAttackElapsedSeconds, TIME_ATTACK_LIMIT_SECONDS, TIME_ATTACK_TRIAL_ROUNDS } from "./timeAttackFlow.js";
import { renderTimeAttackView } from "./timeAttackView.js";
import { renderLoginBonusPopover } from "./loginBonusPopover.js";

const DAILY_BONUS = ECONOMY.DAILY_BONUS;
let introOpenViewHandler = null;
let introDismissedHandler = null;

export function renderApp(root) {
  const dailyPuzzle = getDailyPuzzle(getDailyPuzzleCandidates());
  const loginBonus = hasActivePlayer() ? claimLoginBonus() : null;
  let loginBonusVisible = Boolean(loginBonus);
  let loginBonusTimerHandle = null;
  let activePuzzle = getStartPuzzle();
  let activeView = "puzzle";
  let playOpen = false;
  let puzzleListOpen = false;
  let resetOpen = false;
  let settingsOpen = false;
  const shelfCollapseOverrides = new Map();
  let controlMode = getControlModePreference();
  let pendingScrollTarget = null;
  let activeTimeAttackRun = null;
  let activeTimeAttackSeed = null;
  let activeTimeAttackStartedAt = null;
  let timeAttackTimerHandle = null;
  let timeAttackRoundIndex = 0;
  let activeTimeAttackHintsUsed = 0;
  let activeTimeAttackPuzzleState = null;
  let timeAttackLastResult = null;
  let preTimeAttackPuzzle = null;
  let activeGuide = null;
  let allPuzzlesDonePromptOpen = false;
  let replayChallenge = false;
  let replayPicked = false;
  let dailyChallenge = false;
  let cozySupportState = createDefaultCozySupportState();
  let cozySupportRequestId = 0;
  let spoonJarState = createDefaultSpoonJarState();
  let spoonJarRequestId = 0;

  function selectPuzzle(puzzleId, scrollTarget = "puzzle", options = {}) {
    const nextPuzzle = puzzles.find((puzzle) => puzzle.id === puzzleId) || dailyPuzzle;
    if (!isShelfUnlocked(getSeasonShelfForPuzzle(nextPuzzle))) {
      return;
    }

    activePuzzle = nextPuzzle;
    replayChallenge = Boolean(options.replayChallenge);
    replayPicked = Boolean(options.replayPicked);
    dailyChallenge = Boolean(options.dailyChallenge);
    activeView = "puzzle";
    playOpen = true;
    puzzleListOpen = false;
    resetOpen = false;
    settingsOpen = false;
    pendingScrollTarget = scrollTarget;
    draw();
  }

  function selectStagePuzzle(direction) {
    const shelfPuzzles = getSeasonShelfPuzzles(getSeasonShelfForPuzzle(activePuzzle));
    const currentIndex = shelfPuzzles.findIndex((puzzle) => puzzle.id === activePuzzle.id);
    const nextPuzzle = shelfPuzzles[currentIndex + direction];
    if (nextPuzzle) {
      selectPuzzle(nextPuzzle.id);
    }
  }

  function showPuzzlePicker() {
    replayChallenge = false;
    replayPicked = false;
    dailyChallenge = false;
    activeView = "puzzle";
    playOpen = false;
    puzzleListOpen = true;
    resetOpen = false;
    settingsOpen = false;
    pendingScrollTarget = "picker";
    draw();
  }

  function selectNextPuzzle() {
    if (dailyChallenge) {
      dailyChallenge = false;
      activeView = "spoonRun";
      playOpen = false;
      puzzleListOpen = false;
      pendingScrollTarget = "replay";
      draw();
      return;
    }
    if (replayChallenge) {
      const replayPicks = getDailyReplayPicks({
        allPuzzles: getDailyPuzzleCandidates(),
        completedPuzzleIds: getCompletedPuzzleIds()
      });
      const nextReplayPick = getNextDailyReplayPick(replayPicks, activePuzzle.id);
      if (nextReplayPick) {
        selectPuzzle(nextReplayPick.id, "puzzle", { replayChallenge: true, replayPicked: true });
        return;
      }
      replayChallenge = false;
      replayPicked = false;
      activeView = "spoonRun";
      playOpen = false;
      puzzleListOpen = false;
      pendingScrollTarget = "replay";
      draw();
      return;
    }
    const completedPuzzleIds = getCompletedPuzzleIds();
    const unlockedPuzzles = puzzles.filter((puzzle) => isShelfUnlocked(getSeasonShelfForPuzzle(puzzle)));
    const nextUnfinished = unlockedPuzzles.find((puzzle) => !completedPuzzleIds.includes(puzzle.id));
    if (nextUnfinished) {
      selectPuzzle(nextUnfinished.id);
      return;
    }
    const currentIndex = unlockedPuzzles.findIndex((puzzle) => puzzle.id === activePuzzle.id);
    const nextPuzzle = unlockedPuzzles[(currentIndex + 1) % unlockedPuzzles.length] || dailyPuzzle;
    selectPuzzle(nextPuzzle.id);
  }

  function clearTimeAttackSession() {
    activeTimeAttackRun = null;
    activeTimeAttackSeed = null;
    activeTimeAttackStartedAt = null;
    timeAttackRoundIndex = 0;
    activeTimeAttackHintsUsed = 0;
    activeTimeAttackPuzzleState = null;
    if (preTimeAttackPuzzle) {
      activePuzzle = preTimeAttackPuzzle;
      preTimeAttackPuzzle = null;
    }
  }

  function selectView(view, scrollTarget = "view") {
    if (view === "settings") {
      requestSettings();
      return;
    }
    if (activeTimeAttackRun || preTimeAttackPuzzle) {
      clearTimeAttackSession();
    }
    replayChallenge = false;
    replayPicked = false;
    dailyChallenge = false;
    activeView = view;
    playOpen = false;
    puzzleListOpen = false;
    resetOpen = false;
    settingsOpen = false;
    allPuzzlesDonePromptOpen = false;
    pendingScrollTarget = scrollTarget;
    if (view === "pantry") {
      // Retrieve current Play prices on the actual Pantry store surface.
      loadCozySupportProduct();
      loadSpoonJarProduct();
    }
    draw();
  }

  function openPuzzleFromHub() {
    const decision = getPuzzleHubOpenDecision(activePuzzle, getCompletedPuzzleIds(), isShelfUnlocked);
    if (decision.type === "unlock-guide") {
      allPuzzlesDonePromptOpen = true;
      draw();
      return;
    }
    activePuzzle = decision.puzzle || activePuzzle;
    playOpen = true;
    draw();
  }

  function closeGuide() {
    if (activeGuide) {
      markGuideSeen(activeGuide);
      activeGuide = null;
      draw();
    }
  }

  function replayGuideFromSettings(guideId = null) {
    settingsOpen = false;
    resetOpen = false;
    activeGuide = guideId || (activeView === "timeAttack" ? "timeAttack" : "puzzle");
    draw();
  }

  function showPuzzleHub() {
    replayChallenge = false;
    replayPicked = false;
    dailyChallenge = false;
    activeView = "puzzle";
    playOpen = false;
    puzzleListOpen = false;
    resetOpen = false;
    settingsOpen = false;
    pendingScrollTarget = "view";
    draw();
  }

  function requestPantryFirstPurchaseGuide(_decoration, action = {}) {
    activeGuide = getNextPantryGuideId({
      completedRequestCount: action.completedRequestCount,
      storyCompleted: action.storyCompleted,
      hasSeen: hasSeenGuide
    });
  }

  function startTimeAttackRun() {
    preTimeAttackPuzzle = activePuzzle;
    const session = createTimeAttackSession({ currentPuzzle: activePuzzle, rounds: TIME_ATTACK_TRIAL_ROUNDS });
    activeTimeAttackSeed = session.seed;
    activeTimeAttackRun = session.run;
    activeTimeAttackStartedAt = session.startedAt;
    timeAttackRoundIndex = session.roundIndex;
    activeTimeAttackHintsUsed = 0;
    activeTimeAttackPuzzleState = null;
    activePuzzle = session.activePuzzle;
    replayChallenge = false;
    replayPicked = false;
    dailyChallenge = false;
    activeView = "timeAttack";
    playOpen = true;
    resetOpen = false;
    settingsOpen = false;
    timeAttackLastResult = session.lastResult;
    draw();
  }
  function closeTimeAttackRun() {
    replayChallenge = false;
    replayPicked = false;
    activeView = "puzzle";
    playOpen = false;
    puzzleListOpen = false;
    clearTimeAttackSession();
    draw();
  }

  function completeTimeAttackPuzzle(puzzle, puzzleState) {
    const result = advanceTimeAttackSession({
      run: activeTimeAttackRun,
      seed: activeTimeAttackSeed,
      startedAt: activeTimeAttackStartedAt,
      roundIndex: timeAttackRoundIndex,
      puzzle,
      puzzleState,
      previousHintsUsed: activeTimeAttackHintsUsed
    });

    if (result.status === "closed") {
      closeTimeAttackRun();
      return;
    }

    if (result.status === "next-round") {
      activeTimeAttackHintsUsed += Math.max(0, Number(puzzleState?.hintsUsed || 0));
      activeTimeAttackPuzzleState = null;
      timeAttackRoundIndex = result.roundIndex;
      activePuzzle = result.activePuzzle;
      draw();
      return;
    }

    timeAttackLastResult = result.result;
    replayChallenge = false;
    replayPicked = false;
    activeView = "timeAttack";
    playOpen = false;
    clearTimeAttackSession();
    draw();
  }

  function finishTimeAttackByTimeout() {
    const result = finishTimeAttackSession({
      run: activeTimeAttackRun,
      seed: activeTimeAttackSeed,
      startedAt: activeTimeAttackStartedAt,
      roundIndex: timeAttackRoundIndex,
      puzzle: activePuzzle,
      puzzleState: activeTimeAttackPuzzleState,
      previousHintsUsed: activeTimeAttackHintsUsed,
      completedRounds: timeAttackRoundIndex,
      outcome: "timeout"
    });
    timeAttackLastResult = result.result;
    replayChallenge = false;
    replayPicked = false;
    activeView = "timeAttack";
    playOpen = false;
    clearTimeAttackSession();
    draw();
  }

  function updateTimeAttackPuzzleState(puzzle, puzzleState) {
    if (activeView === "timeAttack" && playOpen && puzzle?.id === activePuzzle?.id) {
      activeTimeAttackPuzzleState = puzzleState;
    }
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
    window.location.reload();
  }

  function requestSettings() {
    settingsOpen = true;
    resetOpen = false;
    loadCozySupportProduct();
    loadSpoonJarProduct();
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

  function toggleShelfCollapsed(shelfId, collapsed) {
    shelfCollapseOverrides.set(shelfId, Boolean(collapsed));
    draw();
  }

  function changeControlMode(mode) {
    controlMode = setControlModePreference(mode);
    draw();
  }

  function createDefaultCozySupportState(status = "idle") {
    return {
      available: false,
      loading: false,
      priceString: "",
      spoons: ECONOMY.COZY_PASS_SPOON_GRANT,
      status
    };
  }

  function createDefaultSpoonJarState(status = "idle") {
    return {
      available: false,
      loading: false,
      priceString: "",
      spoons: ECONOMY.SPOON_JAR_SMALL_GRANT,
      status
    };
  }

  function getSettingsDialogProps() {
    return {
      onClose: closeSettings,
      onLanguageChange: changeLanguage,
      onPlayerChange: changePlayerName,
      onResetRequest: requestReset,
      onSfxChange: changeSfx,
      onMusicChange: changeMusic,
      onControlModeChange: changeControlMode,
      controlMode,
      onReplayGuide: replayGuideFromSettings,
      supportPack: cozySupportState,
      onSupportPurchase: buyCozySupportPack,
      spoonJar: spoonJarState,
      onSpoonJarPurchase: buySpoonJarSmall
    };
  }

  async function loadSpoonJarProduct() {
    const requestId = ++spoonJarRequestId;
    spoonJarState = { ...spoonJarState, loading: true, status: "checking" };
    draw();
    const result = await getSpoonJarSmallProduct();
    if (requestId !== spoonJarRequestId) return;
    spoonJarState = normalizeSpoonJarState(result, result?.reason || "ready");
    draw();
  }

  function selectIntroView(view) {
    if (!["puzzle", "pantry", "timeAttack"].includes(view)) {
      return;
    }
    selectView(view);
  }

  async function buySpoonJarSmall() {
    if (!canPurchaseSpoonJar(spoonJarState)) return;
    spoonJarState = { ...spoonJarState, loading: true, status: "checking" };
    draw();
    const result = await purchaseSpoonJarSmall();
    spoonJarState = normalizeSpoonJarState({ ...spoonJarState, ...result }, result.status || "failed");
    draw();
  }

  async function loadCozySupportProduct() {
    const requestId = ++cozySupportRequestId;
    cozySupportState = { ...cozySupportState, loading: true, status: "checking" };
    draw();
    const result = await getCozySupportProduct();
    if (requestId !== cozySupportRequestId) return;
    cozySupportState = normalizeCozySupportState(result, result?.reason || "ready");
    draw();
  }

  async function buyCozySupportPack() {
    if (!canPurchaseSupportPack(cozySupportState)) return;
    cozySupportState = { ...cozySupportState, loading: true, status: "checking" };
    draw();
    const result = await purchaseCozySupportPack();
    cozySupportState = normalizeCozySupportState({ ...cozySupportState, ...result }, result.status || "failed");
    if (result.ok) {
      await loadCozySupportProduct();
      return;
    }
    draw();
  }

  function normalizeCozySupportState(result, status = "idle") {
    const product = result?.product || {};
    return {
      available: Boolean(result?.available),
      loading: false,
      priceString: product.priceString || cozySupportState.priceString || "",
      spoons: product.spoonGrant || ECONOMY.COZY_PASS_SPOON_GRANT,
      status
    };
  }

  function normalizeSpoonJarState(result, status = "idle") {
    const product = result?.product || {};
    return {
      available: Boolean(result?.available),
      loading: false,
      priceString: product.priceString || spoonJarState.priceString || "",
      spoons: product.spoonGrant || ECONOMY.SPOON_JAR_SMALL_GRANT,
      status
    };
  }


  function checkStageComplete(puzzle) {
    if (dailyChallenge && puzzle.id === dailyPuzzle.id) {
      recordDailyComplete(getDailyDateKey());
    }
    const shelf = getSeasonShelfForPuzzle(puzzle);
    if (!shelf) {
      return;
    }

    const completedPuzzleIds = new Set(getCompletedPuzzleIds());
    const shelfPuzzles = getSeasonShelfPuzzles(shelf);
    if (!shelfPuzzles.length || !shelfPuzzles.every((candidate) => completedPuzzleIds.has(candidate.id))) {
      return;
    }

    const completionResult = markShelfCompletedIfFirst(shelf);
    if (!completionResult.completed) {
      return;
    }
    const earnedBadge = getBadgeForCompletedShelf(shelf.id, getCompletedPuzzleIds());

    globalThis.setTimeout(() => {
      playStageComplete();
      document.body.appendChild(renderStageCompleteOverlay(
        shelf,
        () => selectView(shelf.isFinal ? "pantry" : "puzzle"),
        completionResult
      ));
      const badgeToast = renderBadgeEarnedToast(earnedBadge);
      if (badgeToast) document.body.appendChild(badgeToast);
    }, 700);
    return completionResult;
  }

  function draw() {
    if (timeAttackTimerHandle) {
      globalThis.clearTimeout(timeAttackTimerHandle);
      timeAttackTimerHandle = null;
    }
    if (activeView === "timeAttack" && playOpen && activeTimeAttackStartedAt && getTimeAttackElapsedSeconds(activeTimeAttackStartedAt) >= TIME_ATTACK_LIMIT_SECONDS) {
      finishTimeAttackByTimeout();
      return;
    }
    root.replaceChildren();
    if (!activeGuide && activeView === "puzzle" && playOpen && !hasSeenGuide("puzzle")) {
      activeGuide = "puzzle";
    } else if (!activeGuide && activeView === "timeAttack" && !playOpen && !hasSeenGuide("timeAttack")) {
      activeGuide = "timeAttack";
    } else if (!activeGuide && activeView === "map" && !hasSeenGuide("map")) {
      activeGuide = "map";
    } else if (!activeGuide && activeView === "spoonRun" && !hasSeenGuide("spoonRunIntro")) {
      activeGuide = "spoonRunIntro";
    }
    document.body.classList.toggle("guide-open", Boolean(activeGuide || allPuzzlesDonePromptOpen));
    const shell = createShell({
      activePuzzle,
      activeView,
      playOpen,
      puzzleListOpen,
      dailyPuzzle,
      resetOpen,
      settingsOpen,
      onSelectPuzzle: selectPuzzle,
      onSelectView: selectView,
      onOpenSpoonStore: () => selectView("pantry", "spoonStore"),
      onOpenPuzzle: openPuzzleFromHub,
      onClosePuzzle: showPuzzleHub,
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
      shelfCollapseOverrides,
      onToggleShelfCollapsed: toggleShelfCollapsed,
      onNextPuzzle: selectNextPuzzle,
      onPreviousStagePuzzle: () => selectStagePuzzle(-1),
      onNextStagePuzzle: () => selectStagePuzzle(1),
      onShowPuzzlePicker: showPuzzlePicker,
      replayChallenge,
      dailyChallenge,
      replayPicked,
      onPuzzleComplete: checkStageComplete,
      onStartTimeAttack: startTimeAttackRun,
      onCloseTimeAttack: closeTimeAttackRun,
      onTimeAttackPuzzleComplete: completeTimeAttackPuzzle,
      onTimeAttackPuzzleStateChange: updateTimeAttackPuzzleState,
      timeAttackRun: activeTimeAttackRun,
      timeAttackStartedAt: activeTimeAttackStartedAt,
      timeAttackRoundIndex,
      timeAttackPuzzleState: activeTimeAttackPuzzleState,
      timeAttackLastResult,
      activeGuide,
      allPuzzlesDonePromptOpen,
      onAllPuzzlesDonePantry: () => selectView("pantry"),
      onAllPuzzlesDoneSpoonRun: () => selectView("spoonRun"),
      onCloseGuide: closeGuide,
      onPantryFirstPurchase: requestPantryFirstPurchaseGuide,
      settingsDialogProps: getSettingsDialogProps(),
      timeAttackLimitSeconds: TIME_ATTACK_LIMIT_SECONDS
    });
    root.appendChild(shell);
    scrollAfterDraw(root);
    if (loginBonusVisible && activeView === "puzzle" && !playOpen && !puzzleListOpen && !activeGuide) {
      scheduleLoginBonusPresentation();
    }
    if (activeView === "timeAttack" && playOpen && activeTimeAttackStartedAt) {
      timeAttackTimerHandle = globalThis.setTimeout(draw, 1000);
    }
  }

  function scheduleLoginBonusPresentation() {
    globalThis.setTimeout(() => {
      if (!loginBonusVisible || root.dataset.introOpen === "true" || root.querySelector(".login-bonus-popover")) {
        return;
      }
      root.appendChild(renderLoginBonusPopover(loginBonus, dismissLoginBonus));
      if (!loginBonusTimerHandle) {
        loginBonusTimerHandle = globalThis.setTimeout(dismissLoginBonus, 3000);
      }
    }, 0);
  }
  function dismissLoginBonus() {
    loginBonusVisible = false;
    if (loginBonusTimerHandle) {
      globalThis.clearTimeout(loginBonusTimerHandle);
      loginBonusTimerHandle = null;
    }
    root.querySelector(".login-bonus-popover")?.remove();
  }

  function scrollAfterDraw(container) {
    if (!pendingScrollTarget) {
      return;
    }
    const target = pendingScrollTarget;
    pendingScrollTarget = null;
    globalThis.setTimeout(() => {
      const selector = target === "picker"
        ? `[data-shelf-id="${getSeasonShelfForPuzzle(activePuzzle)?.id || ""}"]`
        : target === "replay"
          ? ".replay-picks-card"
          : target === "spoonStore"
            ? ".spoon-store"
            : target === "view"
            ? ".app-shell"
            : ".puzzle-panel";
      container.querySelector(selector)?.scrollIntoView({ behavior: target === "view" ? "auto" : "smooth", block: "start" });
    }, 0);
  }

  if (introOpenViewHandler) {
    window.removeEventListener("ppp:intro-open-view", introOpenViewHandler);
  }
  if (introDismissedHandler) {
    window.removeEventListener("ppp:intro-dismissed", introDismissedHandler);
  }
  introDismissedHandler = draw;
  window.addEventListener("ppp:intro-dismissed", introDismissedHandler);
  introOpenViewHandler = (event) => selectIntroView(event.detail?.view);
  window.addEventListener("ppp:intro-open-view", introOpenViewHandler);
  draw();
  void restorePendingPurchases().then(({ restored }) => {
    if (restored.length > 0) draw();
  });
}

function getStartPuzzle() {
  return puzzles.find((puzzle) => puzzle.id === "pips-first-shelf-pip-face-1") || puzzles[0];
}

function getDailyPuzzleCandidates() {
  const unlocked = puzzles.filter((puzzle) => isShelfUnlocked(getSeasonShelfForPuzzle(puzzle)));
  return unlocked.length ? unlocked : puzzles;
}

function createShell({
  activePuzzle,
  activeView,
  playOpen,
  puzzleListOpen,
  dailyPuzzle,
  resetOpen,
  settingsOpen,
  onSelectPuzzle,
  onSelectView,
  onOpenSpoonStore,
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
  shelfCollapseOverrides,
  onToggleShelfCollapsed,
  onNextPuzzle,
  onPreviousStagePuzzle,
  onNextStagePuzzle,
  onShowPuzzlePicker,
  onPuzzleComplete,
  onStartTimeAttack,
  onCloseTimeAttack,
  onTimeAttackPuzzleComplete,
  onTimeAttackPuzzleStateChange,
  replayChallenge,
  dailyChallenge,
  replayPicked,
  timeAttackRun,
  timeAttackStartedAt,
  timeAttackLimitSeconds,
  timeAttackRoundIndex,
  timeAttackPuzzleState,
  timeAttackLastResult,
  activeGuide,
  allPuzzlesDonePromptOpen,
  onAllPuzzlesDonePantry,
  onAllPuzzlesDoneSpoonRun,
  onCloseGuide,
  onPantryFirstPurchase,
  settingsDialogProps
}) {
  const shell = document.createElement("main");
  shell.className = "app-shell";
  shell.dataset.view = activeView;
  const hasBlockingOverlay = Boolean(resetOpen || settingsOpen || activeGuide || allPuzzlesDonePromptOpen);
  const isWorkshopHome = activeView === "puzzle" && !playOpen && !puzzleListOpen;
  if (isWorkshopHome) {
    shell.classList.add("app-shell--workshop-home");
  }
  if (settingsOpen) {
    shell.classList.add("app-shell--settings-open");
  }
  const focusedPlayOpen = (activeView === "puzzle" || activeView === "timeAttack") && playOpen;
  shell.appendChild(renderSpoonBalanceChip(
    getPantrySpoons(),
    focusedPlayOpen ? null : onOpenSpoonStore
  ));

  if ((activeView === "puzzle" || activeView === "timeAttack") && playOpen) {
    shell.classList.add("app-shell--play");
    shell.appendChild(renderPlayScreen(activePuzzle, {
      dailyPuzzle,
      dailyBonus: DAILY_BONUS,
      dailyChallenge,
      controlMode,
      onClosePuzzle: activeView === "timeAttack" ? onCloseTimeAttack : onClosePuzzle,
      onRequestSettings,
      onViewAlbum: activeView === "timeAttack" ? onCloseTimeAttack : onClosePuzzle,
      onNextPuzzle,
      onBackToSpoonRun: () => onSelectView("spoonRun"),
      onPreviousStagePuzzle,
      onNextStagePuzzle,
      onShowPuzzlePicker,
      getStageNavigation,
      onPuzzleComplete: activeView === "timeAttack" ? onTimeAttackPuzzleComplete : onPuzzleComplete,
      isTimeAttack: activeView === "timeAttack",
      timeAttackRoundIndex,
      timeAttackTotalRounds: timeAttackRun?.length || TIME_ATTACK_TRIAL_ROUNDS,
      timeAttackElapsedSeconds: getTimeAttackElapsedSeconds(timeAttackStartedAt),
      timeAttackLimitSeconds,
      getTimeAttackHintCost,
      puzzleState: activeView === "timeAttack" ? timeAttackPuzzleState : null,
      onPuzzleStateChange: activeView === "timeAttack" ? onTimeAttackPuzzleStateChange : null,
      replayChallenge,
      replayPicked
    }));
    const playHeader = shell.querySelector(".play-screen__header");
    const spoonBalanceChip = shell.querySelector(":scope > .spoon-balance-chip");
    const settingsButton = playHeader?.querySelector(".play-screen__settings");
    if (playHeader && spoonBalanceChip && settingsButton) {
      playHeader.insertBefore(spoonBalanceChip, settingsButton);
    }
    if (settingsOpen) {
      shell.appendChild(renderSettingsDialog(settingsDialogProps));
    }
    if (activeGuide) {
      shell.appendChild(renderGuideDialog(activeGuide, onCloseGuide));
    }
    return shell;
  }


  if (!hasBlockingOverlay && (activeView !== "puzzle" || puzzleListOpen)) {
    shell.appendChild(renderFloatingNav(activeView, onSelectView));
  }
  if (activeView === "album") {
    shell.appendChild(renderAlbumView(onNextPuzzle));
  } else if (activeView === "map") {
    shell.appendChild(renderPantryMapView());
  } else if (activeView === "pantry") {
    const spoonStore = renderSpoonStore(settingsDialogProps);
    shell.appendChild(renderPantryView(
      () => onSelectView("pantry"),
      onPantryFirstPurchase,
      spoonStore,
      () => document.querySelector(".spoon-store")?.scrollIntoView({ behavior: "smooth", block: "center" })
    ));
  } else if (activeView === "timeAttack") {
    shell.appendChild(renderTimeAttackView({
      bestScores: getTimeAttackBestScores(),
      dailyCount: getTimeAttackDailyCount(),
      dailyLimit: ECONOMY.TIME_ATTACK_DAILY_LIMIT,
      lastResult: timeAttackLastResult,
      onStart: onStartTimeAttack
    }));
  } else if (activeView === "spoonRun") {
    shell.appendChild(renderSpoonRunView({
      dailyPuzzle,
      activePuzzleId: activePuzzle.id,
      replayPicks: getDailyReplayPicks({
        allPuzzles: getDailyPuzzleCandidates(),
        completedPuzzleIds: getCompletedPuzzleIds()
      }),
      completedDate: getDailyCompletedDate(),
      today: getDailyDateKey(),
      dailyCount: getReplayDailyCount(),
      dailyLimit: ECONOMY.REPLAY_PICK_DAILY_LIMIT,
      onSelectDaily: (puzzleId) => onSelectPuzzle(puzzleId, "puzzle", { dailyChallenge: true }),
      onSelectReplay: (puzzleId) => onSelectPuzzle(puzzleId, "puzzle", { replayChallenge: true, replayPicked: true })
    }));
  } else if (puzzleListOpen) {
    shell.appendChild(renderPuzzlePicker(activePuzzle.id, onSelectPuzzle, {
      shelfCollapseOverrides,
      onToggleShelfCollapsed,
      onOpenPantry: () => onSelectView("pantry"),
      onGoHome: onClosePuzzle
    }));
  } else {
    shell.appendChild(renderPuzzleHub(activePuzzle, {
      onOpenPuzzle,
      onShowList: onShowPuzzlePicker,
      onSelectView,
      onOpenSettings: onRequestSettings
    }));

  }

  if (resetOpen) {
    shell.appendChild(renderResetDialog(onCancelReset, onConfirmReset));
  }

  if (settingsOpen) {
    shell.appendChild(renderSettingsDialog(settingsDialogProps));
  }

  if (activeGuide) {
    shell.appendChild(renderGuideDialog(activeGuide, onCloseGuide));
  }
  if (allPuzzlesDonePromptOpen) {
    shell.appendChild(renderAllPuzzlesDoneDialog({
      onPantry: onAllPuzzlesDonePantry,
      onSpoonRun: onAllPuzzlesDoneSpoonRun
    }));
  }

  return shell;
}
