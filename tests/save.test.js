import { beforeEach, describe, expect, it } from "vitest";
import {
  buyDecoration,
  clearPantryStoryGoalId,
  equipDecoration,
  getActivePlayerName,
  getCompletedPuzzleIds,
  getCompletionDates,
  getCompletedPantryStoryGoalIds,
  grantCozySupportPack,
  getPackPantryRoomRequirement,
  getPlayerRecords,
  hasActivePlayer,
  hasCozySupportPack,
  hasSeenGuide,
  getPantrySpoons,
  getPantryStoryGoalId,
  getEquippedDecorations,
  getOwnedDecorationIds,
  getUnlockedPackIds,
  canUnlockPack,
  loadSave,
  markGuideSeen,
  markPackCompletedIfFirst,
  recordPantryStoryGoalComplete,
  recordReplayReward,
  recordTimeAttackResult,
  spendPantrySpoons,
  getTimeAttackBestScores,
  getTimeAttackDailyCount,
  getReplayDailyCount,
  getReplayRewardedPuzzleIds,
  saveGame,
  savePuzzleState,
  setPantryStoryGoalId,
  setActivePlayerName,
  unlockPack
} from "../src/game/save.js";
import { pantryDecorations } from "../src/data/decorations.js";
import { advanceTimeAttackSession, createTimeAttackSession, finishTimeAttackSession, getTimeAttackProgress, TIME_ATTACK_LIMIT_SECONDS } from "../src/ui/timeAttackFlow.js";

class LocalStorageMock {
  constructor() {
    this.store = new Map();
  }

  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }

  setItem(key, value) {
    this.store.set(key, String(value));
  }

  removeItem(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

describe("player save profiles", () => {
  beforeEach(() => {
    globalThis.localStorage = new LocalStorageMock();
  });

  it("creates an active player from a display name", () => {
    const player = setActivePlayerName("Jay");

    expect(player).toEqual({ id: "jay", name: "Jay" });
    expect(hasActivePlayer()).toBe(true);
    expect(getActivePlayerName()).toBe("Jay");
    expect(getPlayerRecords()).toHaveLength(1);
  });

  it("keeps progress separate by player name", () => {
    setActivePlayerName("Jay");
    saveGame({ puzzleStates: {}, completedPuzzleIds: ["pip-face-5"] });

    setActivePlayerName("Mina");
    expect(getCompletedPuzzleIds()).toEqual([]);
    saveGame({ puzzleStates: {}, completedPuzzleIds: ["soup-bowl-5"] });

    setActivePlayerName("Jay");
    expect(loadSave().completedPuzzleIds).toEqual(["pip-face-5"]);
  });

  it("migrates legacy progress into the first named profile", () => {
    localStorage.setItem("pips-picture-pantry:v0.1:save", JSON.stringify({
      puzzleStates: {},
      completedPuzzleIds: ["pip-face-5"]
    }));

    setActivePlayerName("Jay");

    expect(getCompletedPuzzleIds()).toEqual(["pip-face-5"]);
  });

  it("awards spoons once and unlocks progression stages", () => {
    setActivePlayerName("Jay");
    const completedState = {
      puzzleId: "pips-first-shelf-pip-face-1",
      size: 5,
      mode: "fill",
      completed: true,
      history: [],
      cells: Array.from({ length: 5 }, () => Array(5).fill("empty"))
    };

    savePuzzleState(completedState, { reward: 3 });
    expect(getPantrySpoons()).toBe(3);
    expect(loadSave().completedPuzzleIds).toEqual(["pips-first-shelf-pip-face-1"]);
    expect(getCompletionDates()["pips-first-shelf-pip-face-1"]).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    savePuzzleState(completedState, { reward: 3 });
    expect(getPantrySpoons()).toBe(3);

    saveGame({ ...loadSave(), pantrySpoons: 24 });
    expect(unlockPack({ id: "sunny-spoon-sign", access: "unlockable", unlockCost: 24 })).toBe(true);
    expect(getPantrySpoons()).toBe(0);
    expect(getUnlockedPackIds()).toContain("sunny-spoon-sign");
  });

  it("requires pantry room progress before opening gated stages", () => {
    setActivePlayerName("Jay");
    const gatedPack = { id: "sunny-spoon-sign", access: "unlockable", unlockCost: 24, pantryRoomStepRequired: 3 };
    saveGame({ ...loadSave(), pantrySpoons: 24 });

    expect(getPackPantryRoomRequirement(gatedPack)).toEqual({
      required: 3,
      completed: 0,
      remaining: 3,
      met: false
    });
    expect(canUnlockPack(gatedPack)).toBe(false);
    expect(unlockPack(gatedPack)).toBe(false);
    expect(getPantrySpoons()).toBe(24);

    recordPantryStoryGoalComplete("small-jam-jar");
    recordPantryStoryGoalComplete("herb-pot");
    recordPantryStoryGoalComplete("cork-board");

    expect(getPackPantryRoomRequirement(gatedPack)).toEqual({
      required: 3,
      completed: 3,
      remaining: 0,
      met: true
    });
    expect(canUnlockPack(gatedPack)).toBe(true);
    expect(unlockPack(gatedPack)).toBe(true);
    expect(getPantrySpoons()).toBe(0);
    expect(getUnlockedPackIds()).toContain("sunny-spoon-sign");
  });

  it("tracks stage completion celebrations once", () => {
    setActivePlayerName("Jay");

    expect(markPackCompletedIfFirst({ id: "pips-first-shelf", stageBonus: 40 })).toEqual({ completed: true, bonus: 40 });
    expect(getPantrySpoons()).toBe(40);
    expect(markPackCompletedIfFirst({ id: "pips-first-shelf", stageBonus: 40 })).toEqual({ completed: false, bonus: 0 });
    expect(loadSave().completedPackIds).toEqual(["pips-first-shelf"]);
  });

  it("tracks first-run guide acknowledgements", () => {
    setActivePlayerName("Jay");

    expect(hasSeenGuide("puzzle")).toBe(false);
    markGuideSeen("puzzle");
    expect(hasSeenGuide("puzzle")).toBe(true);
    expect(loadSave().seenGuideIds).toEqual(["puzzle"]);

    markGuideSeen("timeAttack");
    markGuideSeen("timeAttack");
    markGuideSeen("pantryFirstPurchase");
    expect(hasSeenGuide("pantryFirstPurchase")).toBe(true);
    expect(loadSave().seenGuideIds).toEqual(["puzzle", "timeAttack", "pantryFirstPurchase"]);
  });

  it("limits replay rewards to clean Pip picks", () => {
    setActivePlayerName("Jay");
    const firstDate = "2026-07-06";
    const completedIds = [
      "pips-first-shelf-pip-face-1",
      "pips-first-shelf-soup-2",
      "pips-first-shelf-spoon-3",
      "pips-first-shelf-apron-4"
    ];
    saveGame({ ...loadSave(), completedPuzzleIds: completedIds });

    expect(recordReplayReward({ puzzleId: completedIds[0], clean: false, picked: true, dateKey: firstDate })).toEqual({
      reward: 0, rewardAllowed: false, reason: "not-eligible", dailyCount: 0
    });
    expect(recordReplayReward({ puzzleId: completedIds[0], clean: true, picked: false, dateKey: firstDate })).toEqual({
      reward: 0, rewardAllowed: false, reason: "not-eligible", dailyCount: 0
    });

    expect(recordReplayReward({ puzzleId: completedIds[0], clean: true, picked: true, dateKey: firstDate }).reward).toBe(1);
    expect(recordReplayReward({ puzzleId: completedIds[0], clean: true, picked: true, dateKey: firstDate }).reason).toBe("already-claimed");
    expect(recordReplayReward({ puzzleId: completedIds[1], clean: true, picked: true, dateKey: firstDate }).reward).toBe(1);
    expect(recordReplayReward({ puzzleId: completedIds[2], clean: true, picked: true, dateKey: firstDate }).reward).toBe(1);
    expect(recordReplayReward({ puzzleId: completedIds[3], clean: true, picked: true, dateKey: firstDate }).reason).toBe("daily-limit");

    expect(getPantrySpoons()).toBe(3);
    expect(getReplayDailyCount(firstDate)).toBe(3);
    expect(getReplayRewardedPuzzleIds(firstDate)).toEqual(completedIds.slice(0, 3));
  });

  it("spends pantry spoons for optional time attack hints", () => {
    setActivePlayerName("Jay");
    saveGame({ ...loadSave(), pantrySpoons: 5 });

    expect(spendPantrySpoons(2, "time-attack-hint")).toEqual({ spent: 2, balance: 3, allowed: true, reason: "time-attack-hint" });
    expect(getPantrySpoons()).toBe(3);
    expect(spendPantrySpoons(4, "time-attack-hint")).toEqual({ spent: 0, balance: 3, allowed: false, reason: "not-enough-spoons" });
    expect(getPantrySpoons()).toBe(3);
  });

  it("measures time attack progress by completed boards plus current correct cells", () => {
    setActivePlayerName("Jay");
    const session = createTimeAttackSession({ now: 1000 });
    const partialState = {
      cells: session.run[1].solution.map((row, rowIndex) => [...row].map((cell, columnIndex) => {
        if (rowIndex === 0 || columnIndex === 0) {
          return cell === "1" ? "filled" : "marked";
        }
        return "empty";
      }))
    };

    const progress = getTimeAttackProgress({
      run: session.run,
      roundIndex: 1,
      puzzle: session.run[1],
      puzzleState: partialState
    });

    expect(progress.completedBefore).toBe(25);
    expect(progress.progressCells).toBeGreaterThan(25);
    expect(progress.progressCells).toBe(25 + progress.currentRoundCorrectCells);
    expect(progress.currentRoundTotalCells).toBe(64);
    expect(progress.currentRoundNumber).toBe(2);
  });

  it("records partial time attack timeout runs by cells reached", () => {
    setActivePlayerName("Jay");
    const session = createTimeAttackSession({ now: 1000 });
    const partialPuzzle = session.run[1];
    const partialState = {
      cells: partialPuzzle.solution.map((row, rowIndex) => [...row].map((cell, columnIndex) => {
        if (rowIndex === 0 || columnIndex === 0) {
          return cell === "1" ? "filled" : "marked";
        }
        return "empty";
      })),
      hintsUsed: 1
    };

    const result = finishTimeAttackSession({
      run: session.run,
      seed: session.seed,
      startedAt: Date.now() - TIME_ATTACK_LIMIT_SECONDS * 1000,
      roundIndex: 1,
      puzzle: partialPuzzle,
      puzzleState: partialState,
      previousHintsUsed: 1,
      completedRounds: 1,
      outcome: "timeout"
    });

    expect(result.status).toBe("timeout");
    expect(result.result.outcome).toBe("timeout");
    expect(result.result.progressCells).toBeGreaterThan(25);
    expect(result.result.hintsUsed).toBe(2);
    expect(getTimeAttackBestScores()["8"].outcome).toBe("timeout");
    expect(getTimeAttackBestScores()["10"]).toBeUndefined();
  });

  it("records mixed-size time attack runs against the largest reached board", () => {
    setActivePlayerName("Jay");
    const session = createTimeAttackSession({ now: 1000 });
    const finalPuzzle = session.run.at(-1);

    const result = advanceTimeAttackSession({
      run: session.run,
      seed: session.seed,
      startedAt: Date.now(),
      roundIndex: session.run.length - 1,
      puzzle: finalPuzzle,
      puzzleState: {
        cells: finalPuzzle.solution.map((row) => [...row].map((cell) => cell === "1" ? "filled" : "empty")),
        hintsUsed: 1
      },
      previousHintsUsed: 2
    });

    expect(session.run.map((puzzle) => puzzle.size)).toEqual([5, 8, 10]);
    expect(result.status).toBe("complete");
    expect(getTimeAttackBestScores()["10"].completedRounds).toBe(3);
    expect(getTimeAttackBestScores()["10"].progressCells).toBe(189);
    expect(getTimeAttackBestScores()["10"].currentRoundCorrectCells).toBe(100);
    expect(getTimeAttackBestScores()["10"].hintsUsed).toBe(3);
    expect(getTimeAttackBestScores()["5"]).toBeUndefined();
  });

  it("tracks time attack rewards and best scores", () => {
    setActivePlayerName("Jay");

    const first = recordTimeAttackResult({
      size: 5,
      score: 4004,
      seed: "seed-a",
      completedRounds: 2,
      progressCells: 4,
      currentRoundCorrectCells: 4,
      currentRoundTotalCells: 25,
      currentRoundNumber: 1,
      hintsUsed: 1
    });
    expect(first.reward).toBe(27);
    expect(first.recordImproved).toBe(true);
    expect(first.rewardAllowed).toBe(true);
    expect(getPantrySpoons()).toBe(27);
    expect(getTimeAttackDailyCount()).toBe(1);
    expect(getTimeAttackBestScores()["5"].score).toBe(4004);
    expect(getTimeAttackBestScores()["5"].progressCells).toBe(4);
    expect(getTimeAttackBestScores()["5"].currentRoundTotalCells).toBe(25);
    expect(getTimeAttackBestScores()["5"].currentRoundNumber).toBe(1);

    const second = recordTimeAttackResult({ size: 5, score: 3003, seed: "seed-b", completedRounds: 1, progressCells: 3 });
    expect(second.reward).toBe(15);
    expect(second.recordImproved).toBe(false);
    expect(getPantrySpoons()).toBe(42);
  });


  it("prunes stale time attack daily count entries", () => {
    setActivePlayerName("Jay");
    const today = new Date();
    const toKey = (daysAgo) => {
      const date = new Date(today);
      date.setDate(today.getDate() - daysAgo);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return year + "-" + month + "-" + day;
    };
    const todayKey = toKey(0);
    const recentKey = toKey(29);
    const staleKey = toKey(30);

    saveGame({
      ...loadSave(),
      timeAttackDailyCount: {
        [todayKey]: 2,
        [recentKey]: 1,
        [staleKey]: 3,
        "not-a-date": 7
      }
    });

    expect(loadSave().timeAttackDailyCount).toEqual({
      [todayKey]: 2,
      [recentKey]: 1
    });
  });

  it("persists and clears pantry story delivery goals", () => {
    setActivePlayerName("Jay");
    const smallJamJar = pantryDecorations.find((item) => item.id === "small-jam-jar");

    expect(getPantryStoryGoalId()).toBe(null);
    setPantryStoryGoalId(smallJamJar);
    expect(getPantryStoryGoalId()).toBe("small-jam-jar");
    expect(loadSave().pantryStoryGoalId).toBe("small-jam-jar");

    saveGame({ ...loadSave(), pantrySpoons: 25 });
    expect(buyDecoration(smallJamJar)).toBe(true);
    expect(getPantryStoryGoalId()).toBe(null);
    expect(getCompletedPantryStoryGoalIds()).toEqual(["small-jam-jar"]);

    expect(recordPantryStoryGoalComplete(smallJamJar)).toBe(true);
    expect(getCompletedPantryStoryGoalIds()).toEqual(["small-jam-jar"]);

    setPantryStoryGoalId("small-jam-jar");
    expect(getPantryStoryGoalId()).toBe("small-jam-jar");
    clearPantryStoryGoalId("other-decoration");
    expect(getPantryStoryGoalId()).toBe("small-jam-jar");
    clearPantryStoryGoalId("small-jam-jar");
    expect(getPantryStoryGoalId()).toBe(null);
    expect(getCompletedPantryStoryGoalIds()).toEqual(["small-jam-jar"]);
  });

  it("buys and equips approved pantry decorations", () => {
    setActivePlayerName("Jay");
    const starter = pantryDecorations.find((item) => item.id === "starter-counter-cloth");
    const sunnyCurtains = pantryDecorations.find((item) => item.id === "sunny-window-curtains");
    const goldenSign = pantryDecorations.find((item) => item.id === "golden-spoon-sign");

    expect(getOwnedDecorationIds()).toEqual([]);

    saveGame({ ...loadSave(), pantrySpoons: 44 });
    expect(buyDecoration(sunnyCurtains)).toBe(true);
    expect(getPantrySpoons()).toBe(22);
    expect(getOwnedDecorationIds()).toContain("sunny-window-curtains");
    expect(getEquippedDecorations().window).toBe("sunny-window-curtains");

    expect(buyDecoration(starter)).toBe(true);
    expect(getOwnedDecorationIds()).toContain("starter-counter-cloth");
    expect(getEquippedDecorations().counter).toBe("starter-counter-cloth");
    expect(equipDecoration(starter)).toBe(true);
    expect(buyDecoration(goldenSign)).toBe(false);
    expect(getPantrySpoons()).toBe(22);
  });

  it("grants the cozy support pack once", () => {
    setActivePlayerName("Jay");
    saveGame({ ...loadSave(), pantrySpoons: 12 });

    expect(hasCozySupportPack()).toBe(false);
    expect(grantCozySupportPack("purchase")).toEqual({
      granted: true,
      alreadyOwned: false,
      balance: 262,
      spoons: 250,
      source: "purchase"
    });
    expect(hasCozySupportPack()).toBe(true);
    expect(getPantrySpoons()).toBe(262);

    expect(grantCozySupportPack("restore")).toEqual({
      granted: false,
      alreadyOwned: true,
      balance: 262,
      spoons: 0,
      source: "restore"
    });
    expect(getPantrySpoons()).toBe(262);
  });


});
