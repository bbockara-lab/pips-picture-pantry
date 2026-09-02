import openingKeyVisualUrl from "../assets/brand/opening-key-visual-v1.webp";
import koreanHarvestOpeningKeyVisualUrl from "../assets/brand/opening-key-visual-korean-harvest-v4-cute-capybara.webp";
import studioLogoUrl from "../assets/brand/sunny-spoon-studios-logo-v2.webp";
import gameLogoUrl from "../assets/brand/pips-picture-pantry-logo-v1.webp";
import { isRuntimeStudioBumperArtApproved } from "../data/runtimeArt.js";
import { hasActivePlayer, setActivePlayerName } from "../game/save.js";
import { t } from "../i18n/index.js";
import { isKoreanHarvestEventVisible } from "../data/koreanHarvestContent.js";

const STUDIO_DURATION_MS = 1300;
const INTRO_EXIT_MS = 260;
const STUDIO_BUMPER_ASSET_ID = "sunny-spoon-studios-logo-v2";

export function renderBrandIntro(root) {
  root.dataset.introOpen = "true";
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
    bumperImage.src = studioLogoUrl;
    bumperImage.alt = "";
    bumperArt.appendChild(bumperImage);
    studioBumper.appendChild(bumperArt);
  }
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
    // Remove the studio layer before the game identity is painted. Keeping the
    // fading layer composited underneath the next stage left a one-frame text
    // remnant on some Android WebViews.
    studioBumper.remove();
    intro.classList.remove("studio-stage");
    intro.classList.add("game-stage");
    content.removeAttribute("aria-hidden");
  };

  const dismiss = () => {
    if (intro.classList.contains("leaving")) {
      return;
    }
    intro.classList.add("leaving");
    globalThis.setTimeout(() => {
      intro.remove();
      delete root.dataset.introOpen;
      window.dispatchEvent(new CustomEvent("ppp:intro-dismissed"));
    }, INTRO_EXIT_MS);
  };

  const requestPlayerName = () => {
    content.classList.add("name-stage");
    replaceChildren(content, buildKeyVisual(true));
    appendTextElement(content, "h2", "", t("playerIntro.title"));

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

  if (prefersReducedMotion()) {
    showGameIdentity();
  } else {
    globalThis.setTimeout(showGameIdentity, STUDIO_DURATION_MS);
  }

  root.appendChild(intro);
}

function renderGameIdentity(content) {
  const koreanHarvestLive = isKoreanHarvestEventVisible();
  content.append(buildKeyVisual(false, koreanHarvestLive));
  if (koreanHarvestLive) content.append(buildSeasonalEventMarker());
  content.append(buildGameLogo());

  const button = document.createElement("button");
  button.className = "brand-intro__skip";
  button.type = "button";
  button.textContent = t("brandIntro.skip");
  content.appendChild(button);
}

function buildSeasonalEventMarker() {
  const marker = document.createElement("div");
  marker.className = "brand-intro__seasonal-event";
  marker.setAttribute("aria-label", `${t("brandIntro.eventTag")}: ${t("brandIntro.eventTitle")}, ${t("brandIntro.eventDates")}`);

  appendTextElement(marker, "span", "brand-intro__seasonal-event-tag", t("brandIntro.eventTag"));
  appendTextElement(marker, "strong", "brand-intro__seasonal-event-title", t("brandIntro.eventTitle"));
  appendTextElement(marker, "small", "brand-intro__seasonal-event-dates", t("brandIntro.eventDates"));
  return marker;
}

function buildGameLogo() {
  const logo = document.createElement("img");
  logo.className = "brand-intro__game-logo";
  logo.src = gameLogoUrl;
  logo.alt = t("app.title");
  return logo;
}

function buildKeyVisual(isSmall, koreanHarvestLive = isKoreanHarvestEventVisible()) {
  const visual = document.createElement("div");
  visual.className = isSmall ? "brand-intro__key-visual small" : "brand-intro__key-visual";
  visual.setAttribute("aria-hidden", "true");
  const image = document.createElement("img");
  image.src = koreanHarvestLive ? koreanHarvestOpeningKeyVisualUrl : openingKeyVisualUrl;
  image.alt = "";
  visual.appendChild(image);
  return visual;
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
