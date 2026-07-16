import { useHint } from "../game/puzzleState.js";
import pipGuideUrl from "../assets/characters/pip-chrome-v2.png";
import { t } from "../i18n/index.js";

export function renderHowToPlayCard() {
  const card = document.createElement("section");
  card.className = "how-to-play visual-guide";

  const scene = document.createElement("div");
  scene.className = "guide-pip-scene";
  const pip = document.createElement("img");
  pip.className = "guide-pip-scene__pip";
  pip.src = pipGuideUrl;
  pip.alt = "";
  pip.setAttribute("aria-hidden", "true");

  const bubble = document.createElement("div");
  bubble.className = "guide-copy guide-pip-scene__bubble";
  appendTextElement(bubble, "p", "section-label", t("howToPlay.title"));
  appendTextElement(bubble, "p", "", t("howToPlay.goal"));
  appendTextElement(bubble, "p", "how-to-play__line-hint", t("controls.lineCompleteHint"));
  scene.append(pip, bubble);

  const clueGuide = document.createElement("div");
  clueGuide.className = "clue-guide";
  clueGuide.setAttribute("aria-hidden", "true");
  clueGuide.append(
    buildClueGuideRow("3", ["filled", "filled", "filled", "auto-mark", "auto-mark"], t("howToPlay.clueTogether")),
    buildClueGuideRow("1 1 1", ["filled", "auto-mark gap", "filled", "auto-mark gap", "filled"], t("howToPlay.clueApart"), true)
  );

  const actions = document.createElement("div");
  actions.className = "guide-actions";
  actions.setAttribute("aria-hidden", "true");
  appendTextElement(actions, "span", "", t("controls.fill"));
  appendTextElement(actions, "span", "", t("controls.mark"));
  appendTextElement(actions, "span", "", t("controls.undo"));

  card.append(scene, clueGuide, actions);
  return card;
}

function buildClueGuideRow(label, cells, caption, wide = false) {
  const row = document.createElement("div");
  row.className = "clue-guide__row";
  appendTextElement(row, "span", wide ? "clue-badge wide" : "clue-badge", label);
  cells.forEach((cellClass) => appendTextElement(row, "span", `mini-cell ${cellClass}`, ""));
  appendTextElement(row, "span", "clue-caption", caption);
  return row;
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

export function getHintLimit(puzzle) {
  const size = Number(puzzle.size || 0);
  if (size >= 15) {
    return 5;
  }
  if (size >= 12) {
    return 4;
  }
  if (size >= 10) {
    return 3;
  }
  return 0;
}

export function getHintRevealCount(puzzle, options = {}) {
  if (options.isTimeAttack) {
    return 1;
  }

  const size = Number(puzzle.size || 0);
  if (size >= 18) {
    return 8;
  }
  if (size >= 15) {
    return 6;
  }
  if (size >= 12) {
    return 5;
  }
  if (size >= 10) {
    return 3;
  }
  return 1;
}

export function renderHintPanel(state, puzzle, update, hintLimit = getHintLimit(puzzle), options = {}) {
  const used = Math.max(0, Number(state.hintsUsed || 0));
  const remaining = Math.max(0, hintLimit - used);
  const panel = document.createElement("div");
  panel.className = "hint-panel";

  const copy = document.createElement("div");
  copy.className = "hint-panel__copy";

  const title = document.createElement("p");
  title.className = "hint-panel__title";
  const hintCost = Math.max(0, Number(options.cost || 0));
  title.textContent = getHintTitleText({
    remaining,
    hintLimit,
    hintCost,
    timeAttack: Boolean(options.timeAttack)
  });

  const body = document.createElement("p");
  body.className = "hint-panel__body";
  const balance = Math.max(0, Number(options.balance || 0));
  const revealCount = Math.max(1, Number(options.revealCount || 1));
  body.textContent = getHintBodyText({ remaining, hintCost, balance, revealCount, timeAttack: Boolean(options.timeAttack) });

  const meter = renderHintAllowanceMeter(remaining, hintLimit);
  copy.append(title);
  if (meter) {
    copy.append(meter);
  }
  copy.append(body);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "hint-button";
  button.setAttribute("aria-label", t("controls.hint"));
  button.title = t("controls.hint");
  button.appendChild(createHintIcon());
  const canUseHint = remaining > 0 || hintCost > 0;
  button.disabled = !canUseHint || (hintCost > 0 && balance < hintCost);
  button.addEventListener("click", () => {
    if (!canUseHint) {
      return;
    }
    if (hintCost > 0) {
      renderHintConfirm(panel, { state, puzzle, update, hintCost, options });
      return;
    }
    update(useHint(state, puzzle.solution, { revealCount }));
  });

  panel.append(copy, button);
  return panel;
}

function renderHintAllowanceMeter(remaining, hintLimit) {
  if (!hintLimit || hintLimit <= 0) {
    return null;
  }

  const meter = document.createElement("div");
  meter.className = "hint-panel__meter";
  meter.setAttribute("aria-label", t("controls.hintMeterLabel", { count: remaining, limit: hintLimit }));

  for (let index = 0; index < hintLimit; index += 1) {
    const dot = document.createElement("span");
    dot.className = index < remaining ? "hint-panel__meter-dot available" : "hint-panel__meter-dot spent";
    dot.setAttribute("aria-hidden", "true");
    meter.appendChild(dot);
  }

  return meter;
}

export function getHintMeterState({ remaining, hintLimit }) {
  const limit = Math.max(0, Number(hintLimit || 0));
  const count = Math.min(limit, Math.max(0, Number(remaining || 0)));
  return Array.from({ length: limit }, (_, index) => index < count ? "available" : "spent");
}

function createHintIcon() {
  const icon = document.createElement("span");
  icon.className = "hint-button__icon";
  icon.setAttribute("aria-hidden", "true");

  const bowl = document.createElement("span");
  bowl.className = "hint-button__bowl";

  const handle = document.createElement("span");
  handle.className = "hint-button__handle";

  const sparkle = document.createElement("span");
  sparkle.className = "hint-button__sparkle";

  icon.append(bowl, handle, sparkle);
  return icon;
}

function renderHintConfirm(panel, { state, puzzle, update, hintCost, options }) {
  const revealCount = Math.max(1, Number(options.revealCount || 1));
  panel.querySelector(".hint-panel__confirm")?.remove();

  const confirm = document.createElement("div");
  confirm.className = "hint-panel__confirm";
  confirm.setAttribute("role", "group");
  confirm.setAttribute("aria-label", t("controls.hintConfirmTitle"));
  confirm.dataset.cost = String(hintCost);

  const title = document.createElement("p");
  title.className = "hint-panel__confirm-title";
  title.textContent = t("controls.hintConfirmTitle");

  const costChip = document.createElement("div");
  costChip.className = "hint-panel__cost-chip";
  costChip.setAttribute("aria-label", t("controls.hintCostLabel", { cost: hintCost }));
  const spoonMark = document.createElement("span");
  spoonMark.className = "hint-panel__spoon-mark";
  spoonMark.setAttribute("aria-hidden", "true");
  const costValue = document.createElement("strong");
  costValue.textContent = String(hintCost);
  costChip.append(spoonMark, costValue);

  const body = document.createElement("p");
  body.textContent = t("controls.hintConfirmBody", { cost: hintCost });

  const actions = document.createElement("div");
  actions.className = "hint-panel__confirm-actions";

  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.className = "tool-button";
  cancel.textContent = t("controls.hintCancel");
  cancel.addEventListener("click", () => confirm.remove());

  const spend = document.createElement("button");
  spend.type = "button";
  spend.className = "tool-button complete";
  spend.textContent = t("controls.hintConfirmAction", { cost: hintCost });
  spend.addEventListener("click", () => {
    if (options.onSpendHint?.(hintCost) === false) {
      confirm.remove();
      return;
    }
    update(useHint(state, puzzle.solution, { revealCount, paid: Boolean(options.paid) }));
  });

  actions.append(cancel, spend);
  confirm.append(title, costChip, body, actions);
  panel.append(confirm);
}

function getHintBodyText({ remaining, hintCost, balance, revealCount, timeAttack = false }) {
  if (hintCost > 0) {
    if (balance < hintCost) {
      return timeAttack
        ? t("controls.timeAttackHintNeedMore", { cost: hintCost, balance })
        : t("controls.paidHintNeedMore", { cost: hintCost, balance });
    }
    return timeAttack
      ? t("controls.timeAttackHintIntro", { cost: hintCost, balance })
      : t("controls.paidHintIntro", { cost: hintCost, balance, count: revealCount });
  }
  if (remaining <= 0) {
    return t("controls.hintEmpty");
  }
  return revealCount > 1 ? t("controls.hintIntroMulti", { count: revealCount }) : t("controls.hintIntro");
}

export function getHintTitleText({ remaining, hintLimit }) {
  return t("controls.hintRemaining", { count: remaining, limit: hintLimit });
}

export function renderMarkHint() {
  const hint = document.createElement("p");
  hint.className = "mode-hint";
  hint.textContent = t("controls.markHint");
  return hint;
}
