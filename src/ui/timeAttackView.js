import pipCoachUrl from "../assets/characters/pip-chrome-v2.png";
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

  const coach = createTimeAttackCoachCard();
  const ladder = createTimeAttackLadder();

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
    panel.append(intro, coach, ladder, startButton, summary, result, records);
    return panel;
  }

  panel.append(intro, coach, ladder, startButton, summary, records);
  return panel;
}

function createTimeAttackCoachCard() {
  const card = document.createElement("article");
  card.className = "time-attack-coach-card";

  const portrait = document.createElement("img");
  portrait.className = "time-attack-coach-card__pip";
  portrait.src = pipCoachUrl;
  portrait.alt = "";
  portrait.setAttribute("aria-hidden", "true");

  const copy = document.createElement("div");
  copy.className = "time-attack-coach-card__copy";
  copy.innerHTML = `
    <p class="section-label">${t("timeAttack.coachEyebrow")}</p>
    <h3>${t("timeAttack.coachTitle")}</h3>
    <p>${t("timeAttack.coachBody")}</p>
  `;

  const chips = document.createElement("ul");
  chips.className = "time-attack-coach-card__chips";
  ["coachEarn", "coachSpend", "coachRecord"].forEach((key) => {
    const item = document.createElement("li");
    item.textContent = t(`timeAttack.${key}`);
    chips.appendChild(item);
  });

  copy.appendChild(chips);
  card.append(portrait, copy);
  return card;
}

function createTimeAttackLadder() {
  const ladder = document.createElement("ol");
  ladder.className = "time-attack-ladder";
  ladder.setAttribute("aria-label", t("timeAttack.ladderAria"));

  [
    ["ladderRound1", "ladderSize1", "ladderWarmup"],
    ["ladderRound2", "ladderSize2", "ladderTempo"],
    ["ladderRound3", "ladderSize3", "ladderFinal"]
  ].forEach(([roundKey, sizeKey, bodyKey], index) => {
    const item = document.createElement("li");
    item.className = index === 2 ? "time-attack-ladder__step is-final" : "time-attack-ladder__step";

    const round = document.createElement("span");
    round.className = "time-attack-ladder__round";
    round.textContent = t(`timeAttack.${roundKey}`);

    const size = document.createElement("strong");
    size.className = "time-attack-ladder__size";
    size.textContent = t(`timeAttack.${sizeKey}`);

    const body = document.createElement("span");
    body.className = "time-attack-ladder__body";
    body.textContent = t(`timeAttack.${bodyKey}`);

    item.append(round, size, body);
    ladder.appendChild(item);
  });

  return ladder;
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