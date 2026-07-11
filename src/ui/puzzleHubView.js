import spoonTokenUrl from "../assets/icons/spoon-token-v2.png";
import { puzzlePacks } from "../data/packs.js";
import { puzzles } from "../data/puzzles.js";
import { getStageArtUrl, hasApprovedStageArt } from "../data/stageArt.js";
import { ECONOMY } from "../data/economyConfig.js";
import { canUnlockPack, getCompletedPuzzleIds, getPackPantryRoomRequirement, getPantrySpoons, getReplayDailyCount, isPackUnlocked } from "../game/save.js";
import { puzzleTitle, t } from "../i18n/index.js";

export function renderPuzzleHub(activePuzzle, onOpenPuzzle) {
  const stack = document.createElement("div");
  stack.className = "puzzle-hub-stack";

  const panel = document.createElement("section");
  panel.className = "puzzle-hub-panel content-panel";

  const copy = document.createElement("div");
  copy.innerHTML = "<p class=\"section-label\">" + t("sections.currentPicture") + "</p><h2>" + puzzleTitle(activePuzzle) + "</h2><p>" + t("playScreen.hubNote") + "</p>";

  const action = document.createElement("button");
  action.type = "button";
  action.className = "tool-button";
  action.textContent = t("playScreen.open");
  action.addEventListener("click", onOpenPuzzle);

  panel.append(copy, action);
  stack.append(panel, createSeasonProgressCard());
  return stack;
}

function createSeasonProgressCard() {
  const progressionPacks = puzzlePacks.filter((pack) => pack.access !== "bonus-pack");
  const progressionPackIds = new Set(progressionPacks.map((pack) => pack.id));
  const seasonPuzzles = puzzles.filter((puzzle) => progressionPackIds.has(puzzle.packId));
  const completedSet = new Set(getCompletedPuzzleIds());
  const completed = seasonPuzzles.filter((puzzle) => completedSet.has(puzzle.id)).length;
  const total = seasonPuzzles.length || 1;
  const remaining = Math.max(0, total - completed);
  const unlockedCount = progressionPacks.filter((pack) => isPackUnlocked(pack)).length;
  const nextLockedPack = progressionPacks.find((pack) => !isPackUnlocked(pack));
  const percent = Math.min(100, Math.round((completed / total) * 100));

  const card = document.createElement("section");
  card.className = "season-progress-card content-panel";
  card.style.setProperty("--season-progress", percent + "%");

  const bodyKey = nextLockedPack
    ? "seasonProgress.bodyLocked"
    : remaining > 0
      ? "seasonProgress.bodyUnlocked"
      : "seasonProgress.bodyComplete";
  const bodyParams = nextLockedPack ? { pack: t(nextLockedPack.titleKey) } : {};

  const header = document.createElement("div");
  header.className = "season-progress-card__header";
  const copy = document.createElement("div");
  copy.innerHTML = [
    "<p class=\"section-label\">" + t("seasonProgress.eyebrow") + "</p>",
    "<h2>" + t("seasonProgress.title") + "</h2>",
    "<p>" + t(bodyKey, bodyParams) + "</p>"
  ].join("");
  const percentBadge = document.createElement("strong");
  percentBadge.className = "season-progress-card__percent";
  percentBadge.textContent = percent + "%";
  header.append(copy, percentBadge);

  const meter = document.createElement("div");
  meter.className = "season-progress-meter";
  meter.setAttribute("aria-hidden", "true");
  meter.innerHTML = "<span></span>";

  const stats = document.createElement("div");
  stats.className = "season-progress-stats";
  stats.append(
    createSeasonStat(t("seasonProgress.catalogStat", { completed, total })),
    createSeasonStat(t("seasonProgress.stageStat", { unlocked: unlockedCount, total: progressionPacks.length })),
    createSpoonSeasonStat(t("seasonProgress.spoonStat", { count: getPantrySpoons() }))
  );

  const goal = createSeasonGoalCard({ nextLockedPack, remaining, progressionPacks });

  const teaser = document.createElement("div");
  teaser.className = "season-next-card";
  teaser.innerHTML = "<strong>" + t("seasonProgress.nextSeasonTitle") + "</strong><p>" + t("seasonProgress.nextSeasonBody") + "</p>";

  card.append(header, meter, stats, goal, teaser);
  return card;
}

function createSeasonGoalCard({ nextLockedPack, remaining, progressionPacks }) {
  const goal = document.createElement("div");
  goal.className = "season-progress-goal";

  let title = "";
  let body = "";
  if (nextLockedPack) {
    const packName = t(nextLockedPack.titleKey);
    const roomRequirement = getPackPantryRoomRequirement(nextLockedPack);
    const spoonGap = Math.max(0, Number(nextLockedPack.unlockCost || 0) - getPantrySpoons());
    const ready = canUnlockPack(nextLockedPack);
    title = ready
      ? t("seasonProgress.goalReadyTitle", { pack: packName })
      : t("seasonProgress.goalLockedTitle", { pack: packName });
    body = ready
      ? t("seasonProgress.goalReadyBody")
      : getUnlockPlanText(nextLockedPack, roomRequirement, spoonGap);
  } else if (remaining > 0) {
    title = t("seasonProgress.goalUnlockedTitle");
    body = t("seasonProgress.goalUnlockedBody", { count: remaining });
  } else {
    title = t("seasonProgress.goalCompleteTitle");
    body = t("seasonProgress.goalCompleteBody", { count: progressionPacks.length });
  }

  goal.innerHTML = "<span>" + t("seasonProgress.goalEyebrow") + "</span><strong>" + title + "</strong><p>" + body + "</p>";
  return goal;
}

function createSeasonStat(text) {
  const stat = document.createElement("span");
  stat.textContent = text;
  return stat;
}

function createSpoonSeasonStat(text) {
  const stat = document.createElement("span");
  stat.className = "season-progress-stats__spoons";
  stat.append(createSpoonIcon("small"), document.createTextNode(text));
  return stat;
}


export function getStageNavigation(activePuzzle, onPrevious, onNext, onShowList) {
  const pack = puzzlePacks.find((candidate) => candidate.id === activePuzzle.packId);
  const packPuzzles = puzzles.filter((puzzle) => puzzle.packId === activePuzzle.packId);
  const currentIndex = packPuzzles.findIndex((puzzle) => puzzle.id === activePuzzle.id);
  return {
    packTitle: pack ? t(pack.titleKey) : t("sections.currentPicture"),
    current: Math.max(currentIndex + 1, 1),
    total: packPuzzles.length || 1,
    hasPrevious: currentIndex > 0,
    hasNext: currentIndex >= 0 && currentIndex < packPuzzles.length - 1,
    onPrevious,
    onNext,
    onShowList
  };
}

export function renderDailyCard(dailyPuzzle, activePuzzleId, onSelectPuzzle, dailyBonus) {
  const card = document.createElement("section");
  card.className = dailyPuzzle.id === activePuzzleId ? "daily-card active" : "daily-card";

  const text = document.createElement("div");
  text.innerHTML = `
    <p class="section-label">${t("daily.eyebrow")}</p>
    <h2>${puzzleTitle(dailyPuzzle)}</h2>
  `;

  const rewardNote = document.createElement("p");
  rewardNote.className = "daily-reward-note";
  const rewardAmount = document.createElement("span");
  rewardAmount.className = "daily-reward-amount";
  rewardAmount.append(createSpoonIcon("small"), document.createTextNode("+" + String(dailyBonus || 0)));
  rewardNote.append(
    document.createTextNode(t("daily.notePrefix")),
    document.createElement("br"),
    rewardAmount,
    document.createTextNode(t("daily.noteSuffix"))
  );
  text.appendChild(rewardNote);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "tool-button daily-button";
  button.textContent = dailyPuzzle.id === activePuzzleId ? t("daily.selected") : t("daily.play");
  button.disabled = dailyPuzzle.id === activePuzzleId;
  button.addEventListener("click", () => onSelectPuzzle(dailyPuzzle.id));

  card.append(text, button);
  return card;
}
export function renderReplayPicksCard(replayPicks, activePuzzleId, onSelectPuzzle, options = {}) {
  if (!Array.isArray(replayPicks) || replayPicks.length === 0) {
    return null;
  }

  const { dailyCount = getReplayDailyCount(), dailyLimit = ECONOMY.REPLAY_PICK_DAILY_LIMIT, onReplayPick = onSelectPuzzle } = options;
  const card = document.createElement("section");
  card.className = "replay-picks-card";

  const header = document.createElement("div");
  header.className = "replay-picks-card__header";
  header.innerHTML = `
    <div>
      <p class="section-label">${t("replayPicks.eyebrow")}</p>
      <h2>${t("replayPicks.title")}</h2>
    </div>
    <span>${t("replayPicks.count", { count: dailyCount, limit: dailyLimit })}</span>
  `;

  const body = document.createElement("p");
  body.className = "replay-picks-card__body";
  body.textContent = t("replayPicks.body");

  const list = document.createElement("div");
  list.className = "replay-picks-list";
  replayPicks.forEach((puzzle) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = puzzle.id === activePuzzleId ? "replay-pick-button active" : "replay-pick-button";
    button.dataset.puzzleId = puzzle.id;
    button.innerHTML = `<span>${puzzleTitle(puzzle)}</span><small>${t("replayPicks.challenge")}</small>`;
    button.addEventListener("click", () => onReplayPick(puzzle.id));
    list.appendChild(button);
  });

  card.append(header, body, list);
  return card;
}

export function renderPuzzlePicker(activePuzzleId, onSelectPuzzle, onUnlockPack, options = {}) {
  const {
    hideCompletedStages = false,
    onToggleHideCompletedStages = () => {},
    onOpenPantry = () => {}
  } = options;
  const completedPuzzleIds = getCompletedPuzzleIds();
  const completedPuzzleIdSet = new Set(completedPuzzleIds);
  const section = document.createElement("section");
  section.className = "puzzle-picker content-panel";
  const stageStats = puzzlePacks
    .filter((pack) => pack.access !== "bonus-pack")
    .map((pack) => {
      const packPuzzles = puzzles.filter((puzzle) => puzzle.packId === pack.id);
      const completeCount = packPuzzles.filter((puzzle) => completedPuzzleIdSet.has(puzzle.id)).length;
      return {
        pack,
        total: packPuzzles.length,
        completeCount,
        complete: packPuzzles.length > 0 && completeCount >= packPuzzles.length
      };
    });
  const hiddenStageCount = hideCompletedStages ? stageStats.filter((stat) => stat.complete).length : 0;
  section.appendChild(createStageFilterBar(hideCompletedStages, hiddenStageCount, onToggleHideCompletedStages));

  puzzlePacks.forEach((pack) => {
    if (pack.access === "bonus-pack") {
      return;
    }
    const packPuzzles = puzzles.filter((puzzle) => puzzle.packId === pack.id);
    const completeCount = packPuzzles.filter((puzzle) => completedPuzzleIdSet.has(puzzle.id)).length;
    const unlocked = isPackUnlocked(pack);
    const isBonusPreview = pack.access === "bonus-pack";
    const isStageComplete = !isBonusPreview && packPuzzles.length > 0 && completeCount >= packPuzzles.length;
    if (hideCompletedStages && isStageComplete) {
      return;
    }
    const packBlock = document.createElement("article");
    packBlock.className = unlocked ? "pack-block" : "pack-block locked";
    packBlock.dataset.packId = pack.id;
    if (packPuzzles.some((puzzle) => puzzle.id === activePuzzleId)) {
      packBlock.dataset.activeStage = "true";
    }

    const header = document.createElement("div");
    header.className = "pack-header";
    const headerCopy = document.createElement("div");
    headerCopy.innerHTML = `
      <p class="section-label">${t(pack.titleKey)}</p>
      <p class="pack-note">${t(pack.noteKey)}</p>
    `;
    header.append(headerCopy, createPackCatalogSummary(packPuzzles, completeCount, isBonusPreview));
    packBlock.appendChild(header);
    packBlock.appendChild(createStagePreview(pack, completeCount, packPuzzles.length));

    if (isBonusPreview) {
      packBlock.appendChild(createBonusPackPanel());
      section.appendChild(packBlock);
      return;
    }

    if (!unlocked) {
      packBlock.appendChild(createUnlockPanel(pack, onUnlockPack, onOpenPantry));
      section.appendChild(packBlock);
      return;
    }

    const list = document.createElement("div");
    list.className = "puzzle-list";

    packPuzzles.forEach((puzzle) => {
      const complete = completedPuzzleIdSet.has(puzzle.id);
      const button = document.createElement("button");
      button.type = "button";
      button.className = getPuzzleChipClass(puzzle, activePuzzleId, true, complete);
      button.dataset.size = String(puzzle.size);
      button.dataset.complete = String(complete);
      button.dataset.puzzleId = puzzle.id;

      const label = document.createElement("span");
      label.textContent = puzzleTitle(puzzle);
      button.appendChild(label);

      const meta = document.createElement("small");
      if (complete) {
        meta.textContent = t("puzzlePicker.sizeComplete", { size: puzzle.size });
      } else {
        meta.append(
          document.createTextNode(t("puzzlePicker.size", { size: puzzle.size }) + "  "),
          createSpoonIcon("small"),
          document.createTextNode("+" + String(puzzle.reward || 0))
        );
      }
      button.appendChild(meta);
      button.setAttribute("aria-label", `${puzzleTitle(puzzle)} - ${complete ? meta.textContent : t("puzzlePicker.rewardLabel", { size: puzzle.size, count: puzzle.reward || 0 })}`);
      button.addEventListener("click", () => onSelectPuzzle(puzzle.id));

      list.appendChild(button);
    });

    packBlock.appendChild(list);
    section.appendChild(packBlock);
  });

  return section;
}

function createPackCatalogSummary(packPuzzles, completeCount, isBonusPreview) {
  const summary = document.createElement("div");
  summary.className = "pack-catalog-summary";

  if (isBonusPreview) {
    const preview = document.createElement("span");
    preview.className = "pack-catalog-summary__progress";
    preview.textContent = t("packs.preview");
    summary.appendChild(preview);
    return summary;
  }

  const total = packPuzzles.length;
  const largeCount = packPuzzles.filter((puzzle) => Number(puzzle.size) >= 10).length;
  const largestSize = packPuzzles.reduce((largest, puzzle) => Math.max(largest, Number(puzzle.size) || 0), 0);

  const progress = document.createElement("span");
  progress.className = "pack-catalog-summary__progress";
  progress.textContent = t("packs.catalogProgress", { completed: completeCount, total });
  summary.appendChild(progress);

  const totalChip = document.createElement("span");
  totalChip.className = "pack-catalog-summary__total";
  totalChip.textContent = t("packs.catalogTotal", { count: total });
  summary.appendChild(totalChip);

  if (largeCount > 0) {
    const largeChip = document.createElement("span");
    largeChip.className = "pack-catalog-summary__large";
    largeChip.textContent = t("packs.catalogLarge", { count: largeCount });
    summary.appendChild(largeChip);
  }

  if (largestSize > 0) {
    const sizeChip = document.createElement("span");
    sizeChip.className = "pack-catalog-summary__largest";
    sizeChip.textContent = t("packs.catalogLargest", { size: largestSize });
    summary.appendChild(sizeChip);
  }

  summary.setAttribute("aria-label", t("packs.catalogSummary", {
    completed: completeCount,
    total,
    large: largeCount,
    size: largestSize
  }));
  return summary;
}

function createStageFilterBar(hideCompletedStages, hiddenStageCount, onToggleHideCompletedStages) {
  const bar = document.createElement("div");
  bar.className = "stage-filter-bar";

  const text = document.createElement("p");
  text.textContent = hideCompletedStages && hiddenStageCount > 0
    ? t("stageFilter.hiddenNotice", { count: hiddenStageCount })
    : t("stageFilter.note");

  const button = document.createElement("button");
  button.type = "button";
  button.className = hideCompletedStages ? "stage-filter-toggle active" : "stage-filter-toggle";
  button.setAttribute("aria-pressed", String(hideCompletedStages));
  button.textContent = hideCompletedStages ? t("stageFilter.showCompleted") : t("stageFilter.hideCompleted");
  button.addEventListener("click", onToggleHideCompletedStages);

  bar.append(text, button);
  return bar;
}

function createStagePreview(pack, completeCount, total) {
  const preview = document.createElement("div");
  const isBonusPreview = pack.access === "bonus-pack";
  preview.className = isBonusPreview ? "stage-preview paid-preview" : "stage-preview";
  preview.setAttribute("aria-hidden", "true");
  const stageProgressRatio = completeCount / Math.max(total || 20, 1);
  preview.style.setProperty("--stage-progress", `${Math.round(stageProgressRatio * 100)}%`);
  preview.style.setProperty("--stage-progress-ratio", String(Math.min(1, Math.max(0, stageProgressRatio))));
  if (isBonusPreview) {
    preview.innerHTML = `<div class="future-mural-card"><span>${t(`map.sets.${pack.muralSet}`)}</span></div>`;
    return preview;
  }
  const wrap = document.createElement("div");
  wrap.className = "stage-pip-preview tile-stage-preview";
  const previewTileTotal = 20;
  const previewCompleteCount = Math.round(stageProgressRatio * previewTileTotal);
  if (hasApprovedStageArt(pack.id)) {
    wrap.append(createStageTileMosaic(pack, previewCompleteCount, previewTileTotal), createStageProgressMeter());
  } else {
    wrap.append(createStageArtPending(completeCount, total || 20), createStageProgressMeter());
  }
  preview.appendChild(wrap);
  return preview;
}

function createStageTileMosaic(pack, completeCount, total) {
  const columns = 5;
  const rows = Math.ceil(total / columns);
  const mosaic = document.createElement("div");
  mosaic.className = "pip-tile-mosaic stage-tile-mosaic";
  const artUrl = getStageArtUrl(pack.id);
  if (!artUrl) {
    return createStageArtPending(completeCount, total);
  }
  const peekIndex = getPeekTileIndex(pack.id, total);
  for (let index = 0; index < total; index += 1) {
    const tile = document.createElement("span");
    const col = index % columns;
    const row = Math.floor(index / columns);
    const revealed = index < completeCount;
    const peek = !revealed && index === peekIndex;
    tile.className = revealed ? "pip-tile revealed" : peek ? "pip-tile peek" : "pip-tile";
    tile.style.backgroundImage = `url("${artUrl}")`;
    tile.style.backgroundSize = `${columns * 100}% ${rows * 100}%`;
    tile.style.backgroundPosition = `${columns === 1 ? 50 : (col / (columns - 1)) * 100}% ${rows === 1 ? 50 : (row / (rows - 1)) * 100}%`;
    mosaic.appendChild(tile);
  }
  return mosaic;
}

function createStageArtPending(completeCount, total) {
  const pending = document.createElement("div");
  pending.className = "stage-art-pending";
  const title = document.createElement("strong");
  title.textContent = t("badges.artPendingShort");
  const meta = document.createElement("small");
  meta.textContent = t("badges.artPendingProgress", { completed: completeCount, total });
  pending.append(title, meta);
  return pending;
}

function getPeekTileIndex(packId, total) {
  const preferred = {
    "starter-pantry": 7,
    "sunny-spoon-sign": 8,
    "apron-drawer": 12,
    "bakery-window": 13,
    "village-pantry": 16
  };
  return Math.min(Math.max(preferred[packId] ?? Math.floor(total / 2), 0), Math.max(total - 1, 0));
}

function createStageProgressMeter() {
  const meter = document.createElement("div");
  meter.className = "stage-progress-meter";
  meter.setAttribute("aria-hidden", "true");
  meter.innerHTML = "<span></span>";
  return meter;
}

function createBonusPackPanel() {
  const panel = document.createElement("div");
  panel.className = "unlock-panel bonus-pack-panel";
  panel.innerHTML = `
    <p>${t("packs.paidPackHint")}</p>
    <button type="button" class="tool-button" disabled>${t("packs.pricePreview")}</button>
  `;
  return panel;
}

function createUnlockPanel(pack, onUnlockPack, onOpenPantry) {
  const panel = document.createElement("div");
  panel.className = "unlock-panel";
  const canOpen = canUnlockPack(pack);
  const roomRequirement = getPackPantryRoomRequirement(pack);
  const spoonGap = Math.max(0, Number(pack.unlockCost || 0) - getPantrySpoons());
  const disabledText = roomRequirement.met
    ? t("packs.needMore", { count: spoonGap })
    : t("packs.needPantryRoom");
  const planText = getUnlockPlanText(canOpen, roomRequirement, spoonGap);
  panel.innerHTML = `
    <div class="unlock-panel__requirements">
      <p class="unlock-panel__cost"></p>
      ${roomRequirement.required > 0 ? `<p class="unlock-panel__room">${t("packs.roomRequirement", roomRequirement)}</p>` : ""}
      <p class="unlock-panel__plan">${planText}</p>
    </div>
    <div class="unlock-panel__actions">
      <button type="button" class="tool-button" ${canOpen ? "" : "disabled"}>${canOpen ? t("packs.openStage") : disabledText}</button>
      ${!roomRequirement.met ? `<button type="button" class="stage-gate-link">${t("packs.visitPantry")}</button>` : ""}
    </div>
  `;
  const copy = panel.querySelector(".unlock-panel__cost");
  copy.append(document.createTextNode(t("packs.unlockCostPrefix")), createSpoonIcon("small"), document.createTextNode(String(pack.unlockCost)));
  panel.querySelector(".tool-button").addEventListener("click", () => onUnlockPack(pack.id));
  panel.querySelector(".stage-gate-link")?.addEventListener("click", onOpenPantry);
  return panel;
}

function getUnlockPlanText(canOpen, roomRequirement, spoonGap) {
  if (canOpen) {
    return t("packs.unlockPlanReady");
  }
  if (!roomRequirement.met && spoonGap > 0) {
    return t("packs.unlockPlanNeedBoth", { count: spoonGap, completed: roomRequirement.completed, required: roomRequirement.required });
  }
  if (!roomRequirement.met) {
    return t("packs.unlockPlanNeedPantry", roomRequirement);
  }
  return t("packs.unlockPlanNeedSpoons", { count: spoonGap });
}

function createSpoonIcon(size = "") {
  const icon = document.createElement("img");
  icon.className = size ? `spoon-icon ${size}` : "spoon-icon";
  icon.src = spoonTokenUrl;
  icon.alt = "";
  icon.setAttribute("aria-hidden", "true");
  return icon;
}

function getPuzzleChipClass(puzzle, activePuzzleId, unlocked, complete) {
  const classes = ["puzzle-chip"];
  if (puzzle.id === activePuzzleId) {
    classes.push("active");
  }
  if (!unlocked) {
    classes.push("locked");
  }
  if (complete) {
    classes.push("complete");
  }
  return classes.join(" ");
}