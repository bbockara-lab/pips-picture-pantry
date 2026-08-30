import { getSeasonShelfForPuzzle, getSeasonShelfPuzzles } from "../data/seasonShelves.js";
import { ECONOMY, getTimeAttackHintCost } from "../data/economyConfig.js";
import { puzzles } from "../data/puzzles.js";
import { getDailyDateKey, getDailyPuzzle } from "../game/dailyPuzzle.js";
import { getDailyReplayPicks, getNextDailyReplayPick } from "../game/replayPicks.js";
import {
  getCompletedPuzzleIds,
  getRewardedPuzzleIds,
  claimLoginBonus,
  getDailyCompletedDate,
  getReplayDailyCount,
  getReplayRewardedPuzzleIds,
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
import { getSpoonRunOpportunity } from "../game/spoonRunRewards.js";
import { claimKoreanHarvestWelcomeGift } from "../game/koreanHarvestGift.js";
import { getCozySupportProduct, getSpoonJarSmallProduct, purchaseCozySupportPack, purchaseSpoonJarSmall, restorePendingPurchases } from "../game/billing.js";
import { setLanguagePreference, t } from "../i18n/index.js";
import { renderAlbumView } from "./albumView.js";
import { renderResetDialog } from "./appChrome.js";
import { playCue, playStageComplete, playTimeAttackCountdown, setMusicEnabled, setMusicScene, setMusicSuppressed, setSfxEnabled, startMusic } from "./audio.js";
import { getBadgeForCompletedShelf } from "../game/badges.js";
import { renderBadgeEarnedToast, renderPantryMapView } from "./mapView.js";
import { renderPantryView } from "./pantryView.js";
import { getNextPantryGuideId } from "./pantryGuideFlow.js";
import { getControlModePreference, getCursorTrailPreference, setControlModePreference, setCursorTrailPreference } from "./preferences.js";
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
import { renderTimeAttackCountdown, renderTimeAttackView } from "./timeAttackView.js";
import { getLoginBonusMessage } from "./loginBonusMessage.js";
import { dismissOptionalUpdate, openUpdateStore, resolveUpdateDecision } from "../game/updatePolicy.js";
import { renderMandatoryUpdateView } from "./updateGateView.js";
import { getUnreadMailboxCount, renderMailboxView } from "./mailboxView.js";
import { renderSeasonalGiftView } from "./seasonalGiftView.js";

const DAILY_BONUS = ECONOMY.DAILY_BONUS;
let introOpenViewHandler = null;
let introDismissedHandler = null;
let renderGeneration = 0;

export function renderApp(root) {
  const generation = ++renderGeneration;
  const dailyPuzzle = getDailyPuzzle(getDailyPuzzleCandidates());
  const loginBonus = hasActivePlayer() ? claimLoginBonus() : null;
  const seasonalGift = hasActivePlayer() ? claimKoreanHarvestWelcomeGift() : null;
  let loginBonusVisible = Boolean(loginBonus);
  let seasonalGiftVisible = Boolean(seasonalGift);
  let seasonalGiftSoundPlayed = false;
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
  let timeAttackCountdownHandle = null;
  let timeAttackCountdownStep = null;
  let timeAttackRoundIndex = 0;
  let activeTimeAttackHintsUsed = 0;
  let activeTimeAttackPuzzleState = null;
  let timeAttackLastResult = null;
  let preTimeAttackPuzzle = null;
  let activeGuide = null;
  let pendingPantryJarDetailId = null;
  let allPuzzlesDonePromptOpen = false;
  let replayChallenge = false;
  let replayPicked = false;
  let dailyChallenge = false;
  let cozySupportState = createDefaultCozySupportState();
  let cozySupportRequestId = 0;
  let spoonJarState = createDefaultSpoonJarState();
  let spoonJarRequestId = 0;
  let updateDecision = { kind: "none" };

  void resolveUpdateDecision().then((decision) => {
    if (generation !== renderGeneration) return;
    updateDecision = decision;
    if (root.dataset.introOpen !== "true") draw();
  });

  function queueViewportTopReset() {
    pendingScrollTarget = "top";
  }

  function selectPuzzle(puzzleId, scrollTarget = "top", options = {}) {
    const nextPuzzle = puzzles.find((puzzle) => puzzle.id === puzzleId) || dailyPuzzle;
    if (!isShelfUnlocked(getSeasonShelfForPuzzle(nextPuzzle))) {
      playCue("sfx_ui_locked", { volume: 0.62 });
      return;
    }

    playCue(options.dailyChallenge
      ? "sfx_daily_picture_select"
      : options.replayChallenge
        ? "sfx_replay_pick_select"
        : "sfx_ui_card_select", { volume: 0.58 });

    activePuzzle = nextPuzzle;
    replayChallenge = Boolean(options.replayChallenge);
    replayPicked = Boolean(options.replayPicked);
    dailyChallenge = Boolean(options.dailyChallenge);
    activeView = "puzzle";
    playOpen = true;
    puzzleListOpen = false;
    resetOpen = false;
    settingsOpen = false;
    pendingScrollTarget = scrollTarget === "puzzle" ? "top" : scrollTarget;
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
    playCue("sfx_next_puzzle", { volume: 0.64 });
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
        selectPuzzle(nextReplayPick.id, "top", { replayChallenge: true, replayPicked: true });
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
    const decision = getPuzzleHubOpenDecision(
      activePuzzle,
      getCompletedPuzzleIds(),
      isShelfUnlocked,
      { resumeFromLastCompleted: false }
    );
    if (decision.type === "open" && decision.puzzle) {
      selectPuzzle(decision.puzzle.id);
      return;
    }
    if (decision.type === "unlock-guide") {
      allPuzzlesDonePromptOpen = true;
      draw();
      return;
    }
    showPuzzlePicker();
  }

  function clearTimeAttackCountdown() {
    if (timeAttackCountdownHandle) {
      globalThis.clearTimeout(timeAttackCountdownHandle);
      timeAttackCountdownHandle = null;
    }
    timeAttackCountdownStep = null;
  }

  function clearTimeAttackSession() {
    clearTimeAttackCountdown();
    setMusicSuppressed(false);
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

  function selectView(view, scrollTarget = "top") {
    if (view === "settings") {
      requestSettings();
      return;
    }
    const viewCue = {
      pantry: "sfx_pantry_open",
      spoonRun: "sfx_spoon_run_open",
      album: "sfx_album_page_open",
      mailbox: "sfx_mail_open",
      map: "sfx_ui_card_select"
    }[view];
    if (viewCue) playCue(viewCue, { volume: 0.58 });
    if (timeAttackCountdownStep !== null || activeTimeAttackRun || preTimeAttackPuzzle) {
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
    queueViewportTopReset();
    draw();
  }

  function closeGuide() {
    if (activeGuide) {
      markGuideSeen(activeGuide);
      activeGuide = null;
      draw();
    }
  }

  function requestPantryJarGuide(jar) {
    pendingPantryJarDetailId = jar?.id || null;
    activeGuide = "pantryJarIntro";
    draw();
  }

  function openFeaturedJarFromHome(jar) {
    pendingPantryJarDetailId = jar?.id || null;
    selectView("pantry");
  }

  function replayGuide(guideId = null) {
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
    queueViewportTopReset();
    draw();
  }

  function requestPantryFirstPurchaseGuide(_decoration, action = {}) {
    activeGuide = getNextPantryGuideId({
      completedRequestCount: action.completedRequestCount,
      hasSeen: hasSeenGuide
    });
  }

  function scheduleTimeAttackCountdown() {
    const delay = timeAttackCountdownStep === "go" ? 650 : 900;
    timeAttackCountdownHandle = globalThis.setTimeout(() => {
      timeAttackCountdownHandle = null;
      if (timeAttackCountdownStep === 3) {
        timeAttackCountdownStep = 2;
      } else if (timeAttackCountdownStep === 2) {
        timeAttackCountdownStep = 1;
      } else if (timeAttackCountdownStep === 1) {
        timeAttackCountdownStep = "go";
      } else {
        startTimeAttackRun();
        return;
      }
      playTimeAttackCountdown(timeAttackCountdownStep);
      draw();
      scheduleTimeAttackCountdown();
    }, delay);
  }

  function startTimeAttackCountdown() {
    if (timeAttackCountdownStep !== null || activeTimeAttackRun) {
      return;
    }
    timeAttackCountdownStep = 3;
    setMusicSuppressed(false);
    playTimeAttackCountdown(3);
    draw();
    scheduleTimeAttackCountdown();
  }

  function startTimeAttackRun() {
    clearTimeAttackCountdown();
    setMusicSuppressed(false);
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
    queueViewportTopReset();
    draw();
  }
  function closeTimeAttackRun() {
    replayChallenge = false;
    replayPicked = false;
    activeView = "puzzle";
    playOpen = false;
    puzzleListOpen = false;
    clearTimeAttackSession();
    queueViewportTopReset();
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
      playCue("sfx_time_round_complete", { volume: 0.72 });
      globalThis.setTimeout(() => playCue("stinger_time_attack_round", { volume: 0.78 }), 110);
      activeTimeAttackHintsUsed += Math.max(0, Number(puzzleState?.hintsUsed || 0));
      activeTimeAttackPuzzleState = null;
      timeAttackRoundIndex = result.roundIndex;
      activePuzzle = result.activePuzzle;
      queueViewportTopReset();
      draw();
      return;
    }

    timeAttackLastResult = result.result;
    playCue(result.result?.recordImproved ? "stinger_time_attack_best" : "stinger_time_attack_success", { volume: 0.84 });
    if (result.result?.reward > 0) {
      globalThis.setTimeout(() => playCue("sfx_spoon_gain_medium", { volume: 0.68 }), 220);
    }
    replayChallenge = false;
    replayPicked = false;
    activeView = "timeAttack";
    playOpen = false;
    clearTimeAttackSession();
    queueViewportTopReset();
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
    playCue("sfx_time_expired", { volume: 0.72 });
    globalThis.setTimeout(() => playCue("stinger_time_attack_fail", { volume: 0.72 }), 120);
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
    if (enabled) playCue("sfx_ui_toggle_on", { volume: 0.62 });
    draw();
  }

  function changeMusic(enabled) {
    setMusicEnabled(enabled);
    if (enabled) {
      startMusic();
      playCue("sfx_ui_toggle_on", { volume: 0.62 });
    } else {
      playCue("sfx_ui_toggle_off", { volume: 0.62 });
    }
    draw();
  }

  function toggleShelfCollapsed(shelfId, collapsed) {
    shelfCollapseOverrides.set(shelfId, Boolean(collapsed));
    draw();
  }

  function changeControlMode(mode) {
    controlMode = setControlModePreference(mode);
    playCue("sfx_control_mode_switch", { volume: 0.62 });
    draw();
  }

  function changeCursorTrail(enabled) {
    setCursorTrailPreference(enabled);
    draw();
  }

  function createDefaultCozySupportState(status = "idle") {
    return {
      available: false,
      loading: false,
      priceString: "",
      storeName: "Store",
      spoons: ECONOMY.COZY_PASS_SPOON_GRANT,
      status
    };
  }

  function createDefaultSpoonJarState(status = "idle") {
    return {
      available: false,
      loading: false,
      priceString: "",
      storeName: "Store",
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
      cursorControlsUnlocked: hasSeenGuide("cursorControlsIntro"),
      cursorTrailEnabled: getCursorTrailPreference(),
      onCursorTrailChange: changeCursorTrail,
      supportPack: cozySupportState,
      onSupportPurchase: buyCozySupportPack,
      spoonJar: spoonJarState,
      onSpoonJarPurchase: buySpoonJarSmall
    };
  }

  async function loadSpoonJarProduct() {
    const requestId = ++spoonJarRequestId;
    spoonJarState = { ...spoonJarState, loading: true, status: "purchasing" };
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
    playCue("sfx_store_window_open", { volume: 0.65 });
    draw();
    const result = await purchaseSpoonJarSmall();
    playPurchaseResult(result);
    spoonJarState = normalizeSpoonJarState({ ...spoonJarState, ...result }, result.status || "failed");
    draw();
  }

  async function loadCozySupportProduct() {
    const requestId = ++cozySupportRequestId;
    cozySupportState = { ...cozySupportState, loading: true, status: "purchasing" };
    draw();
    const result = await getCozySupportProduct();
    if (requestId !== cozySupportRequestId) return;
    cozySupportState = normalizeCozySupportState(result, result?.reason || "ready");
    draw();
  }

  async function buyCozySupportPack() {
    if (!canPurchaseSupportPack(cozySupportState)) return;
    cozySupportState = { ...cozySupportState, loading: true, status: "checking" };
    playCue("sfx_store_window_open", { volume: 0.65 });
    draw();
    const result = await purchaseCozySupportPack();
    playPurchaseResult(result);
    cozySupportState = normalizeCozySupportState({ ...cozySupportState, ...result }, result.status || "failed");
    draw();
  }

  function normalizeCozySupportState(result, status = "idle") {
    const product = result?.product || {};
    return {
      available: Boolean(result?.available),
      loading: false,
      priceString: product.priceString || cozySupportState.priceString || "",
      storeName: result?.storeName || cozySupportState.storeName || "Store",
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
      storeName: result?.storeName || spoonJarState.storeName || "Store",
      spoons: product.spoonGrant || ECONOMY.SPOON_JAR_SMALL_GRANT,
      status
    };
  }

  function playPurchaseResult(result) {
    if (result?.ok) {
      playCue("sfx_store_purchase_success", { volume: 0.76 });
      globalThis.setTimeout(() => playCue("sfx_spoon_gain_large", { volume: 0.72 }), 180);
      return;
    }
    playCue(result?.status === "cancelled" ? "sfx_store_purchase_cancel" : "sfx_store_purchase_fail", { volume: 0.64 });
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
    setMusicScene(getMusicScene({ activeView, playOpen, activeGuide, settingsOpen, resetOpen }));
    root.replaceChildren();
    if (updateDecision.kind === "mandatory") {
      document.body.classList.remove("guide-open");
      root.appendChild(renderMandatoryUpdateView(updateDecision, () => openUpdateStore(updateDecision.storeUrl)));
      return;
    }
    if (!activeGuide && activeView === "puzzle" && playOpen && !hasSeenGuide("puzzle")) {
      activeGuide = "puzzle";
    } else if (!activeGuide && (activeView === "puzzle" || activeView === "timeAttack") && playOpen && Number(activePuzzle?.size) === 8 && !hasSeenGuide("cursorControlsIntro")) {
      activeGuide = "cursorControlsIntro";
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
      onOpenFeaturedJar: openFeaturedJarFromHome,
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
      onStartTimeAttack: startTimeAttackCountdown,
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
      onCloseGuide: closeGuide,
      onReplayGuide: replayGuide,
      onPantryFirstPurchase: requestPantryFirstPurchaseGuide,
      onRequestPantryJarGuide: requestPantryJarGuide,
      pendingPantryJarDetailId,
      onPendingPantryJarDetailOpened: () => {
        pendingPantryJarDetailId = null;
      },
      settingsDialogProps: getSettingsDialogProps(),
      loginBonusMessage: loginBonusVisible ? getLoginBonusMessage(loginBonus) : null,
      updateNotice: !loginBonusVisible && updateDecision.kind === "optional" ? updateDecision : null,
      onUpdateNow: () => openUpdateStore(updateDecision.storeUrl),
      onUpdateLater: () => {
        dismissOptionalUpdate(updateDecision.platform, updateDecision.latestBuild);
        updateDecision = { kind: "none" };
        draw();
      },
      timeAttackLimitSeconds: TIME_ATTACK_LIMIT_SECONDS
    });
    root.appendChild(shell);
    if (seasonalGiftVisible && root.dataset.introOpen !== "true") {
      if (!seasonalGiftSoundPlayed) {
        seasonalGiftSoundPlayed = true;
        playCue("pip_greeting", { volume: 0.58 });
        globalThis.setTimeout(() => playCue("sfx_spoon_gain_large", { volume: 0.74 }), 180);
      }
      root.appendChild(renderSeasonalGiftView(seasonalGift, () => {
        seasonalGiftVisible = false;
        draw();
      }));
    }
    if (timeAttackCountdownStep !== null) {
      root.appendChild(renderTimeAttackCountdown(timeAttackCountdownStep));
    }
    scrollAfterDraw(root);
    if (!seasonalGiftVisible && loginBonusVisible && activeView === "puzzle" && !playOpen && !puzzleListOpen && !activeGuide) {
      scheduleLoginBonusPresentation();
    }
    // Replacing the settings DOM once per second cancels an in-progress iOS
    // pan gesture and resets the sheet to the top. Time still elapses from the
    // original timestamp; the next draw after closing handles timeout normally.
    if (activeView === "timeAttack" && playOpen && activeTimeAttackStartedAt && !settingsOpen) {
      timeAttackTimerHandle = globalThis.setTimeout(draw, 1000);
    }
  }

  function scheduleLoginBonusPresentation() {
    globalThis.setTimeout(() => {
      if (!loginBonusVisible || root.dataset.introOpen === "true" || loginBonusTimerHandle) {
        return;
      }
      loginBonusTimerHandle = globalThis.setTimeout(dismissLoginBonus, 3000);
    }, 0);
  }
  function dismissLoginBonus() {
    loginBonusVisible = false;
    if (loginBonusTimerHandle) {
      globalThis.clearTimeout(loginBonusTimerHandle);
      loginBonusTimerHandle = null;
    }
    draw();
  }

  function scrollAfterDraw(container) {
    if (!pendingScrollTarget) {
      return;
    }
    const target = pendingScrollTarget;
    pendingScrollTarget = null;
    if (target === "top" || target === "play" || target === "view") {
      const resetViewport = () => {
        const scrollRoot = document.scrollingElement || document.documentElement;
        if (scrollRoot) {
          scrollRoot.scrollTop = 0;
          scrollRoot.scrollLeft = 0;
        }
        document.body.scrollTop = 0;
        document.body.scrollLeft = 0;
        globalThis.scrollTo?.({ top: 0, left: 0, behavior: "auto" });
      };

      // WebKit can restore the previous page position after the replacement DOM
      // has painted. Reset immediately and once more on the next frame so every
      // normal, replay, and Time Attack board begins from its intended top edge.
      resetViewport();
      if (typeof globalThis.requestAnimationFrame === "function") {
        globalThis.requestAnimationFrame(resetViewport);
      } else {
        globalThis.setTimeout(resetViewport, 0);
      }
      return;
    }
    globalThis.setTimeout(() => {
      const selector = target === "picker"
        ? `[data-shelf-id="${getSeasonShelfForPuzzle(activePuzzle)?.id || ""}"]`
        : target === "replay"
          ? ".replay-picks-card"
          : target === "spoonStore"
            ? ".spoon-store"
            : ".puzzle-panel";
      container.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
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

function getMusicScene({ activeView, playOpen, activeGuide, settingsOpen, resetOpen }) {
  if (activeGuide || settingsOpen || resetOpen || activeView === "mailbox") return "dialogue";
  if (activeView === "timeAttack") return "timeAttack";
  if (activeView === "pantry") return "pantry";
  if (activeView === "spoonRun") return "spoonRun";
  if (activeView === "album" || activeView === "map") return "albumMap";
  if (activeView === "puzzle" && playOpen) return "puzzle";
  return "home";
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
  onOpenFeaturedJar,
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
  onCloseGuide,
  onReplayGuide,
  onPantryFirstPurchase,
  onRequestPantryJarGuide,
  pendingPantryJarDetailId,
  onPendingPantryJarDetailOpened,
  settingsDialogProps,
  loginBonusMessage,
  updateNotice,
  onUpdateNow,
  onUpdateLater
}) {
  const shell = document.createElement("main");
  shell.className = "app-shell";
  shell.dataset.view = activeView;
  const hasBlockingOverlay = Boolean(resetOpen || settingsOpen || activeGuide || allPuzzlesDonePromptOpen);
  const isWorkshopHome = activeView === "puzzle" && !playOpen && !puzzleListOpen;
  const today = getDailyDateKey();
  const completedDate = getDailyCompletedDate();
  const replayPicks = getDailyReplayPicks({
    allPuzzles: getDailyPuzzleCandidates(),
    completedPuzzleIds: getCompletedPuzzleIds()
  });
  const replayLastPick = Boolean(replayChallenge && !getNextDailyReplayPick(replayPicks, activePuzzle.id));
  const replayRewardedPuzzleIds = getReplayRewardedPuzzleIds(today);
  const replayDailyCount = getReplayDailyCount(today);
  const spoonRunOpportunity = getSpoonRunOpportunity({
    dailyPuzzle,
    dailyCompleted: completedDate === today,
    rewardedPuzzleIds: getRewardedPuzzleIds(),
    replayPicks,
    replayRewardedPuzzleIds,
    replayDailyCount,
    replayDailyLimit: ECONOMY.REPLAY_PICK_DAILY_LIMIT
  });
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
      cursorControlsUnlocked: hasSeenGuide("cursorControlsIntro"),
      cursorTrailEnabled: getCursorTrailPreference(),
      onControlModeChange,
      onClosePuzzle: activeView === "timeAttack" ? onCloseTimeAttack : onClosePuzzle,
      onRequestSettings,
      onViewAlbum: activeView === "timeAttack" ? onCloseTimeAttack : onClosePuzzle,
      onNextPuzzle,
      onBackToSpoonRun: () => onSelectView("spoonRun"),
      onPreviousStagePuzzle,
      onNextStagePuzzle,
      onShowPuzzlePicker,
      onSelectView,
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
      replayPicked,
      replayLastPick
    }));
    const playHeader = shell.querySelector(".play-screen__header");
    const spoonBalanceChip = shell.querySelector(":scope > .spoon-balance-chip");
    const settingsButton = playHeader?.querySelector(".play-screen__settings");
    if (playHeader && spoonBalanceChip && settingsButton) {
      playHeader.insertBefore(spoonBalanceChip, settingsButton);
    }
    if (!hasBlockingOverlay) {
      shell.appendChild(renderFloatingNav(activeView, onSelectView, getUnreadMailboxCount()));
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
    shell.appendChild(renderFloatingNav(activeView, onSelectView, getUnreadMailboxCount()));
  }
  if (activeView === "album") {
    shell.appendChild(renderAlbumView(onNextPuzzle));
  } else if (activeView === "mailbox") {
    shell.appendChild(renderMailboxView({
      onReplayGuide,
      onMailboxChange: () => {
        const currentNav = shell.querySelector(".floating-nav");
        if (currentNav) {
          currentNav.replaceWith(renderFloatingNav(activeView, onSelectView, getUnreadMailboxCount()));
        }
      }
    }));
  } else if (activeView === "map") {
    shell.appendChild(renderPantryMapView());
  } else if (activeView === "pantry") {
    const spoonStore = renderSpoonStore(settingsDialogProps);
    const pantryView = renderPantryView(
      () => onSelectView("pantry"),
      onPantryFirstPurchase,
      spoonStore,
      () => document.querySelector(".spoon-store")?.scrollIntoView({ behavior: "smooth", block: "center" }),
      {
        onRequestJarGuide: onRequestPantryJarGuide,
        initialJarDetailId: pendingPantryJarDetailId,
        onInitialJarDetailOpened: onPendingPantryJarDetailOpened
      }
    );
    shell.appendChild(pantryView);
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
      replayPicks,
      replayRewardedPuzzleIds,
      completedDate,
      today,
      dailyCount: replayDailyCount,
      dailyLimit: ECONOMY.REPLAY_PICK_DAILY_LIMIT,
      opportunity: spoonRunOpportunity,
      onSelectDaily: (puzzleId) => onSelectPuzzle(puzzleId, "puzzle", { dailyChallenge: true }),
      onSelectReplay: (puzzleId) => onSelectPuzzle(puzzleId, "puzzle", { replayChallenge: true, replayPicked: true })
    }));
  } else if (puzzleListOpen) {
    shell.appendChild(renderPuzzlePicker(activePuzzle.id, onSelectPuzzle, {
      shelfCollapseOverrides,
      onToggleShelfCollapsed,
      onOpenPantry: () => onSelectView("pantry")
    }));
  } else {
    shell.appendChild(renderPuzzleHub(activePuzzle, {
      onOpenPuzzle,
      onShowList: onShowPuzzlePicker,
      onSelectView,
      onOpenFeaturedJar,
      onOpenSettings: onRequestSettings,
      onOpenMailbox: () => onSelectView("mailbox"),
      unreadMailboxCount: getUnreadMailboxCount(),
      spoonRunOpportunity,
      greetingMessage: loginBonusMessage || (updateNotice ? t("updatePolicy.optionalMessage", { version: updateNotice.latestVersion }) : null),
      greetingAction: updateNotice ? {
        updateLabel: t("updatePolicy.updateNow"),
        laterLabel: t("updatePolicy.later"),
        onUpdate: onUpdateNow,
        onLater: onUpdateLater
      } : null
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
      onPantry: onAllPuzzlesDonePantry
    }));
  }

  return shell;
}
