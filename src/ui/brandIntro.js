import pipSealUrl from "../assets/characters/pip-chrome-v2.png";
import openingKeyVisualUrl from "../assets/brand/opening-key-visual-v1.webp";
import studioBumperUrl from "../assets/brand/sunny-spoon-studios-bumper-v1.webp";
import { APP_VERSION } from "../data/appVersion.js";
import { isRuntimeStudioBumperArtApproved } from "../data/runtimeArt.js";
import { hasActivePlayer, setActivePlayerName } from "../game/save.js";
import { t } from "../i18n/index.js";

const STUDIO_DURATION_MS = 900;
const INTRO_EXIT_MS = 260;
const STUDIO_BUMPER_ASSET_ID = "sunny-spoon-studios-bumper-v1";

export function renderBrandIntro(root) {
  const intro = document.createElement("section");
  intro.className = "brand-intro studio-stage";
  intro.setAttribute("role", "status");
  intro.setAttribute("aria-label", t("brandIntro.ariaLabel"));

  const grain = document.createElement("div");
  grain.className = "brand-intro__grain";
  grain.setAttribute("aria-hidden", "true");
  intro.appendChild(grain);

  const studioBumper = document.createElement("div");
  studioBumper.className = "studio-bumper";
  studioBumper.setAttribute("aria-label", "Sunny Spoon Studios");
  if (isRuntimeStudioBumperArtApproved(STUDIO_BUMPER_ASSET_ID)) {
    const bumperArt = document.createElement("div");
    bumperArt.className = "studio-bumper__art";
    bumperArt.setAttribute("aria-hidden", "true");
    const bumperImage = document.createElement("img");
    bumperImage.src = studioBumperUrl;
    bumperImage.alt = "";
    bumperArt.appendChild(bumperImage);
    studioBumper.appendChild(bumperArt);
  }
  appendTextElement(studioBumper, "p", "", "Sunny Spoon Studios");
  intro.appendChild(studioBumper);

  const content = document.createElement("div");
  content.className = "brand-intro__content";
  content.setAttribute("aria-hidden", "true");
  renderGameIdentity(content);
  intro.appendChild(content);

  const showGameIdentity = () => {
    if (intro.classList.contains("leaving")) {
      return;
    }
    intro.classList.remove("studio-stage");
    intro.classList.add("game-stage");
    studioBumper.setAttribute("aria-hidden", "true");
    content.removeAttribute("aria-hidden");
  };

  const dismiss = () => {
    if (intro.classList.contains("leaving")) {
      return;
    }
    intro.classList.add("leaving");
    globalThis.setTimeout(() => intro.remove(), INTRO_EXIT_MS);
  };

  const dispatchIntroOpenView = (view) => {
    if (view) {
      window.dispatchEvent(new CustomEvent("ppp:intro-open-view", { detail: { view } }));
    }
  };

  const requestPlayerName = (pendingView = null) => {
    content.classList.add("name-stage");
    replaceChildren(content, buildKeyVisual(true), buildSeal(), textElement("p", "brand-intro__studio", t("app.studioName")));
    appendTextElement(content, "h2", "", t("playerIntro.title"));
    appendTextElement(content, "p", "player-intro-note", t("playerIntro.note"));

    const pipCue = document.createElement("div");
    pipCue.className = "player-intro-pip";
    const pipImage = document.createElement("img");
    pipImage.src = pipSealUrl;
    pipImage.alt = "";
    pipImage.setAttribute("aria-hidden", "true");
    pipCue.appendChild(pipImage);
    appendTextElement(pipCue, "span", "", t("playerIntro.pipCue"));
    content.appendChild(pipCue);

    appendTextElement(content, "p", "brand-intro__version", t("app.versionLabel", { version: APP_VERSION }));

    const form = document.createElement("form");
    form.className = "player-intro-form";
    const label = document.createElement("label");
    label.htmlFor = "player-intro-name";
    label.textContent = t("playerIntro.label");
    const input = document.createElement("input");
    input.id = "player-intro-name";
    input.name = "playerName";
    input.maxLength = 18;
    input.autocomplete = "nickname";
    input.placeholder = t("playerIntro.placeholder");
    const submit = document.createElement("button");
    submit.className = "brand-intro__skip";
    submit.type = "submit";
    submit.textContent = t("playerIntro.continue");
    form.append(label, input, submit);
    content.appendChild(form);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      setActivePlayerName(new FormData(form).get("playerName"));
      window.dispatchEvent(new CustomEvent("ppp:player-changed"));
      dispatchIntroOpenView(pendingView);
      dismiss();
    });
    globalThis.setTimeout(() => input.focus(), 50);
  };

  content.querySelector(".brand-intro__skip").addEventListener("click", () => {
    if (hasActivePlayer()) {
      dismiss();
      return;
    }
    requestPlayerName();
  });
  content.querySelectorAll(".brand-intro__promise-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const targetView = chip.dataset.targetView;
      if (hasActivePlayer()) {
        dispatchIntroOpenView(targetView);
        dismiss();
        return;
      }
      requestPlayerName(targetView);
    });
  });

  if (prefersReducedMotion()) {
    showGameIdentity();
  } else {
    globalThis.setTimeout(showGameIdentity, STUDIO_DURATION_MS);
  }

  root.appendChild(intro);
}

function renderGameIdentity(content) {
  content.append(buildKeyVisual(false), buildSeal(), textElement("p", "brand-intro__studio", t("app.studioName")));
  appendTextElement(content, "h2", "", t("app.title"));
  appendTextElement(content, "p", "brand-intro__launch-note", t("brandIntro.launchNote"));

  const promiseStrip = document.createElement("div");
  promiseStrip.className = "brand-intro__promise-strip";
  promiseStrip.setAttribute("aria-label", t("brandIntro.promiseLabel"));
  promiseStrip.append(
    buildPromiseChip("brand-intro__promise-chip--puzzle", t("brandIntro.promisePuzzle"), "puzzle"),
    buildPromiseChip("brand-intro__promise-chip--pantry", t("brandIntro.promiseDecorate"), "pantry"),
    buildPromiseChip("brand-intro__promise-chip--time", t("brandIntro.promiseTimeAttack"), "timeAttack"),
  );
  content.appendChild(promiseStrip);
  appendTextElement(content, "p", "brand-intro__version", t("app.versionLabel", { version: APP_VERSION }));

  const button = document.createElement("button");
  button.className = "brand-intro__skip";
  button.type = "button";
  button.textContent = t("brandIntro.skip");
  content.appendChild(button);
}

function buildKeyVisual(isSmall) {
  const visual = document.createElement("div");
  visual.className = isSmall ? "brand-intro__key-visual small" : "brand-intro__key-visual";
  visual.setAttribute("aria-hidden", "true");
  const image = document.createElement("img");
  image.src = openingKeyVisualUrl;
  image.alt = "";
  visual.appendChild(image);
  return visual;
}

function buildSeal() {
  const seal = document.createElement("div");
  seal.className = "brand-intro__seal";
  seal.setAttribute("aria-hidden", "true");
  const image = document.createElement("img");
  image.src = pipSealUrl;
  image.alt = "";
  seal.appendChild(image);
  return seal;
}

function buildPromiseChip(modifierClass, label, targetView) {
  const chip = document.createElement("button");
  chip.className = `brand-intro__promise-chip ${modifierClass}`;
  chip.type = "button";
  chip.dataset.targetView = targetView;
  chip.setAttribute("aria-label", label);
  const icon = document.createElement("i");
  icon.setAttribute("aria-hidden", "true");
  chip.appendChild(icon);
  appendTextElement(chip, "b", "", label);
  return chip;
}

function appendTextElement(parent, tagName, className, text) {
  const element = textElement(tagName, className, text);
  parent.appendChild(element);
  return element;
}

function textElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  element.textContent = text;
  return element;
}

function replaceChildren(parent, ...children) {
  parent.replaceChildren(...children);
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
}
