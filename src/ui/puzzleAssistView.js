import { useHint } from "../game/puzzleState.js";
import { t } from "../i18n/index.js";

export function renderHowToPlayCard() {
  const card = document.createElement("section");
  card.className = "how-to-play visual-guide";
  card.innerHTML = `
    <div class="guide-copy">
      <p class="section-label">${t("howToPlay.title")}</p>
      <p>${t("howToPlay.goal")}</p>
    </div>
    <div class="clue-guide" aria-hidden="true">
      <div class="clue-guide__row">
        <span class="clue-badge">3</span>
        <span class="mini-cell filled"></span>
        <span class="mini-cell filled"></span>
        <span class="mini-cell filled"></span>
        <span class="mini-cell"></span>
        <span class="mini-cell"></span>
        <span class="clue-caption">${t("howToPlay.clueTogether")}</span>
      </div>
      <div class="clue-guide__row">
        <span class="clue-badge wide">1 1 1</span>
        <span class="mini-cell filled"></span>
        <span class="mini-cell gap"></span>
        <span class="mini-cell filled"></span>
        <span class="mini-cell gap"></span>
        <span class="mini-cell filled"></span>
        <span class="clue-caption">${t("howToPlay.clueApart")}</span>
      </div>
    </div>
    <div class="guide-actions" aria-hidden="true">
      <span>${t("controls.fill")}</span>
      <span>${t("controls.mark")}</span>
      <span>${t("controls.undo")}</span>
    </div>
  `;
  return card;
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
  title.textContent = t("controls.hintRemaining", { count: remaining, limit: hintLimit });

  const body = document.createElement("p");
  body.className = "hint-panel__body";
  const hintCost = Math.max(0, Number(options.cost || 0));
  const balance = Math.max(0, Number(options.balance || 0));
  const revealCount = Math.max(1, Number(options.revealCount || 1));
  body.textContent = getHintBodyText({ remaining, hintCost, balance, revealCount });

  copy.append(title, body);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "hint-button";
  button.textContent = hintCost > 0 ? t("controls.hintWithCost", { cost: hintCost }) : t("controls.hint");
  button.disabled = remaining <= 0 || (hintCost > 0 && balance < hintCost);
  button.addEventListener("click", () => {
    if (remaining <= 0) {
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
    update(useHint(state, puzzle.solution, { revealCount }));
  });

  actions.append(cancel, spend);
  confirm.append(title, body, actions);
  panel.append(confirm);
}

function getHintBodyText({ remaining, hintCost, balance, revealCount }) {
  if (remaining <= 0) {
    return t("controls.hintEmpty");
  }
  if (hintCost <= 0) {
    return revealCount > 1 ? t("controls.hintIntroMulti", { count: revealCount }) : t("controls.hintIntro");
  }
  if (balance < hintCost) {
    return t("controls.timeAttackHintNeedMore", { cost: hintCost, balance });
  }
  return t("controls.timeAttackHintIntro", { cost: hintCost, balance });
}

export function renderMarkHint() {
  const hint = document.createElement("p");
  hint.className = "mode-hint";
  hint.textContent = t("controls.markHint");
  return hint;
}
