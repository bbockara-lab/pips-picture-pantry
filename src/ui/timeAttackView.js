import { t } from "../i18n/index.js";

export function renderTimeAttackView({ bestScores = {}, dailyCount = 0, dailyLimit = 3, lastResult = null, onStart } = {}) {
  const panel = document.createElement("section");
  panel.className = "time-attack-panel content-panel";

  const intro = document.createElement("div");
  intro.className = "time-attack-panel__intro";
  appendTextElement(intro, "h2", "", t("timeAttack.title"));

  const ladder = createTimeAttackLadder();

  const startButton = document.createElement("button");
  startButton.type = "button";
  startButton.className = "tool-button time-attack-panel__start";
  startButton.textContent = t("timeAttack.start");
  startButton.addEventListener("click", () => onStart?.());

  const status = document.createElement("p");
  status.className = "time-attack-status";
  status.textContent = getRewardStatusText(dailyCount, dailyLimit);

  const records = createRecordsPanel(bestScores);

  if (lastResult && records) {
    const result = createLastResultPanel(lastResult);
    panel.append(intro, ladder, startButton, status, result, records);
    return panel;
  }

  if (lastResult) {
    const result = createLastResultPanel(lastResult);
    panel.append(intro, ladder, startButton, status, result);
    return panel;
  }

  panel.append(intro, ladder, startButton, status);
  if (records) {
    panel.appendChild(records);
  }
  return panel;
}

function appendTextElement(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  element.textContent = text;
  parent.appendChild(element);
  return element;
}

function createTimeAttackLadder() {
  const ladder = document.createElement("ol");
  ladder.className = "time-attack-ladder";
  ladder.setAttribute("aria-label", t("timeAttack.ladderAria"));

  [
    ["ladderRound1", "ladderSize1"],
    ["ladderRound2", "ladderSize2"],
    ["ladderRound3", "ladderSize3"]
  ].forEach(([roundKey, sizeKey], index) => {
    const item = document.createElement("li");
    item.className = index === 2 ? "time-attack-ladder__step is-final" : "time-attack-ladder__step";

    const round = document.createElement("span");
    round.className = "time-attack-ladder__round";
    round.textContent = t(`timeAttack.${roundKey}`);

    const size = document.createElement("strong");
    size.className = "time-attack-ladder__size";
    size.textContent = t(`timeAttack.${sizeKey}`);

    item.append(round, size);
    ladder.appendChild(item);
  });

  return ladder;
}

function getRewardStatusText(dailyCount, dailyLimit) {
  const used = Math.min(Number(dailyCount) || 0, Number(dailyLimit) || 0);
  const limit = Number(dailyLimit) || 0;
  if (used >= limit) {
    return t("timeAttack.rewardUsed", { count: used, limit });
  }
  return t("timeAttack.rewardReady", { count: used, limit });
}

function createRecordsPanel(bestScores) {
  const entries = Object.values(bestScores).sort((a, b) => Number(a.size || 0) - Number(b.size || 0));
  if (!entries.length) {
    return null;
  }

  const records = document.createElement("div");
  records.className = "time-attack-records";
  const title = document.createElement("h3");
  title.textContent = t("timeAttack.records");
  const list = document.createElement("ul");
  entries.forEach((record) => {
    const item = document.createElement("li");
    item.textContent = t("timeAttack.recordLine", {
      size: record.size || "?",
      progress: getRecordProgress(record),
      time: formatElapsedSeconds(record.elapsedSeconds || 0)
    });
    list.appendChild(item);
  });
  records.append(title, list);
  return records;
}

function createLastResultPanel(lastResult) {
  const result = document.createElement("div");
  result.className = lastResult.outcome === "timeout"
    ? "time-attack-panel__result is-timeout"
    : lastResult.recordImproved ? "time-attack-panel__result is-record" : "time-attack-panel__result";

  const title = document.createElement("h3");
  title.textContent = lastResult.recordImproved ? t("timeAttack.newRecord") : t("timeAttack.lastRun");

  const reward = document.createElement("p");
  const rewardKey = lastResult.outcome === "timeout" && lastResult.reward > 0
    ? "timeAttack.timeoutReward"
    : lastResult.outcome === "timeout"
      ? "timeAttack.timeoutNoReward"
      : lastResult.reward > 0 ? "timeAttack.lastReward" : "timeAttack.lastNoReward";
  reward.textContent = t(rewardKey, {
    reward: lastResult.reward || 0
  });

  const score = document.createElement("p");
  score.className = "time-attack-panel__score";
  score.textContent = t("timeAttack.lastScore", {
    progress: getRecordProgress(lastResult),
    time: formatElapsedSeconds(lastResult.elapsedSeconds || 0)
  });

  result.append(title, score);
  const hintsUsed = getRecordHints(lastResult);
  if (hintsUsed > 0) {
    const meta = document.createElement("p");
    meta.className = "time-attack-panel__meta";
    meta.textContent = t("timeAttack.resultMeta", {
      hints: hintsUsed
    });
    result.appendChild(meta);
  }
  result.appendChild(reward);
  return result;
}

function getRecordHints(record) {
  return Math.max(0, Math.floor(Number(record?.hintsUsed || 0)));
}

function getRecordProgress(record) {
  const storedProgress = Number(record?.progressCells);
  if (Number.isFinite(storedProgress) && storedProgress > 0) {
    return Math.floor(storedProgress);
  }
  return Math.max(0, Math.floor(Number(record?.score || 0) / 1000));
}

function formatElapsedSeconds(seconds) {
  const value = Math.max(0, Math.floor(Number(seconds) || 0));
  const minutes = Math.floor(value / 60);
  const remainder = String(value % 60).padStart(2, "0");
  return minutes + ":" + remainder;
}
