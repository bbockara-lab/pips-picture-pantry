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
  const studioBumperArt = isRuntimeStudioBumperArtApproved(STUDIO_BUMPER_ASSET_ID)
    ? `<div class="studio-bumper__art" aria-hidden="true"><img src="${studioBumperUrl}" alt="" /></div>`
    : "";
  const intro = document.createElement("section");
  intro.className = "brand-intro studio-stage";
  intro.setAttribute("role", "status");
  intro.setAttribute("aria-label", t("brandIntro.ariaLabel"));

  intro.innerHTML = `
    <div class="brand-intro__grain" aria-hidden="true"></div>
    <div class="studio-bumper" aria-label="Sunny Spoon Studios">
      ${studioBumperArt}
      <p>Sunny Spoon Studios</p>
    </div>
    <div class="brand-intro__content" aria-hidden="true">
      <div class="brand-intro__key-visual" aria-hidden="true">
        <img src="${openingKeyVisualUrl}" alt="" />
      </div>
      <div class="brand-intro__seal" aria-hidden="true">
        <img src="${pipSealUrl}" alt="" />
      </div>
      <p class="brand-intro__studio">${t("app.studioName")}</p>
      <h2>${t("app.title")}</h2>
      <p class="brand-intro__version">${t("app.versionLabel", { version: APP_VERSION })}</p>
      <button class="brand-intro__skip" type="button">${t("brandIntro.skip")}</button>
    </div>
  `;

  const showGameIdentity = () => {
    if (intro.classList.contains("leaving")) {
      return;
    }
    intro.classList.remove("studio-stage");
    intro.classList.add("game-stage");
    intro.querySelector(".studio-bumper").setAttribute("aria-hidden", "true");
    intro.querySelector(".brand-intro__content").removeAttribute("aria-hidden");
  };

  const dismiss = () => {
    if (intro.classList.contains("leaving")) {
      return;
    }
    intro.classList.add("leaving");
    globalThis.setTimeout(() => intro.remove(), INTRO_EXIT_MS);
  };

  const requestPlayerName = () => {
    const content = intro.querySelector(".brand-intro__content");
    content.classList.add("name-stage");
    content.innerHTML = `
      <div class="brand-intro__key-visual small" aria-hidden="true">
        <img src="${openingKeyVisualUrl}" alt="" />
      </div>
      <div class="brand-intro__seal" aria-hidden="true">
        <img src="${pipSealUrl}" alt="" />
      </div>
      <p class="brand-intro__studio">${t("app.studioName")}</p>
      <h2>${t("playerIntro.title")}</h2>
      <p class="player-intro-note">${t("playerIntro.note")}</p>
      <p class="brand-intro__version">${t("app.versionLabel", { version: APP_VERSION })}</p>
      <form class="player-intro-form">
        <label for="player-intro-name">${t("playerIntro.label")}</label>
        <input id="player-intro-name" name="playerName" maxlength="18" autocomplete="nickname" placeholder="${t("playerIntro.placeholder")}" />
        <button class="brand-intro__skip" type="submit">${t("playerIntro.continue")}</button>
      </form>
    `;
    const form = content.querySelector("form");
    const input = content.querySelector("input");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      setActivePlayerName(new FormData(form).get("playerName"));
      window.dispatchEvent(new CustomEvent("ppp:player-changed"));
      dismiss();
    });
    globalThis.setTimeout(() => input.focus(), 50);
  };

  intro.querySelector("button").addEventListener("click", () => {
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

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
}
