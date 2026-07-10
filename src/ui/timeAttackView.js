import { t } from "../i18n/index.js";

export function renderTimeAttackView({ bestScores = {}, dailyCount = 0, dailyLimit = 3, lastResult = null, onStart } = {}) {
  const panel = document.createElement("section");
  panel.className = "time-attack-panel content-panel";

  const intro = document.createElement("div");
  intro.className = "time-attack-panel__intro";
  intro.innerHTML = `
    <p class="section-label">${t("timeAttack.eyebrow")}</p>
    <h2>${t("timeAttack.title")}</h2>
    <p>${t("timeAttack.body")}</p>
  `;

  const startButton = document.createElement("button");
  startButton.type = "button";
  startButton.className = "tool-button time-attack-panel__start";
  startButton.textContent = t("timeAttack.start");
  startButton.addEventListener("click", () => onStart?.());

  const summary = document.createElement("div");
  summary.className = "time-attack-summary";
  summary.append(
    createSummaryCard(t("timeAttack.runPlanTitle"), t("timeAttack.runPlanBody")),
    createSummaryCard(t("timeAttack.rewardTitle"), getRewardStatusText(dailyCount, dailyLimit)),
    createSummaryCard(t("timeAttack.bestTitle"), getBestSummaryText(bestScores))
  );

  const records = createRecordsPanel(bestScores);

  if (lastResult) {
    const result = createLastResultPanel(lastResult);
    panel.append(intro, startButton, summary, result, records);
    return panel;
  }

  panel.append(intro, startButton, summary, records);
  return panel;
}

function createSummaryCard(titleText, bodyText) {
  const card = document.createElement("article");
  card.className = "time-attack-summary__card";
  const title = document.createElement("h3");
  title.textContent = titleText;
  const body = document.createElement("p");
  body.textContent = bodyText;
  card.append(title, body);
  return card;
}

function getRewardStatusText(dailyCount, dailyLimit) {
  const used = Math.min(Number(dailyCount) || 0, Number(dailyLimit) || 0);
  const limit = Number(dailyLimit) || 0;
  if (used >= limit) {
    return t("timeAttack.rewardUsed", { count: used, limit });
  }
  return t("timeAttack.rewardReady", { count: used, limit });
}

function getBestSummaryText(bestScores) {
  const best = getBestRecord(bestScores);
  if (!best) {
    return t("timeAttack.noRecord");
  }
  return t("timeAttack.bestSummary", {
    score: best.score || 0,
    time: formatElapsedSeconds(best.elapsedSeconds || 0)
  });
}

function createRecordsPanel(bestScores) {
  const records = document.createElement("div");
  records.className = "time-attack-records";
  const entries = Object.values(bestScores).sort((a, b) => Number(a.size || 0) - Number(b.size || 0));
  if (entries.length) {
    const title = document.createElement("h3");
    title.textContent = t("timeAttack.records");
    const list = document.createElement("ul");
    entries.forEach((record) => {
      const item = document.createElement("li");
      item.textContent = t("timeAttack.recordLine", {
        size: record.size || "?",
        score: record.score || 0,
        time: formatElapsedSeconds(record.elapsedSeconds || 0)
      });
      list.appendChild(item);
    });
    records.append(title, list);
  } else {
    records.textContent = t("timeAttack.noRecord");
  }
  return records;
}

function createLastResultPanel(lastResult) {
  const result = document.createElement("div");
  result.className = lastResult.recordImproved ? "time-attack-panel__result is-record" : "time-attack-panel__result";

  const title = document.createElement("h3");
  title.textContent = lastResult.recordImproved ? t("timeAttack.newRecord") : t("timeAttack.lastRun");

  const reward = document.createElement("p");
  reward.textContent = t(lastResult.reward > 0 ? "timeAttack.lastReward" : "timeAttack.lastNoReward", {
    reward: lastResult.reward || 0
  });

  const score = document.createElement("p");
  score.className = "time-attack-panel__score";
  score.textContent = t("timeAttack.lastScore", {
    score: lastResult.score || 0,
    time: formatElapsedSeconds(lastResult.elapsedSeconds || 0)
  });

  result.append(title, score, reward);
  return result;
}

function getBestRecord(bestScores) {
  return Object.values(bestScores).reduce((best, record) => {
    if (!best || Number(record.score || 0) > Number(best.score || 0)) {
      return record;
    }
    return best;
  }, null);
}

function formatElapsedSeconds(seconds) {
  const value = Math.max(0, Math.floor(Number(seconds) || 0));
  const minutes = Math.floor(value / 60);
  const remainder = String(value % 60).padStart(2, "0");
  return minutes + ":" + remainder;
}