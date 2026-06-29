import appIconUrl from "../assets/app-icons/app-icon-192.png";
import redesignedCastUrl from "../assets/characters/pip-cast-redesign-concept-v1-web.jpg";
import { hasActivePlayer, setActivePlayerName } from "../game/save.js";
import { t } from "../i18n/index.js";

const STUDIO_DURATION_MS = 900;
const INTRO_EXIT_MS = 260;

export function renderBrandIntro(root) {
  const intro = document.createElement("section");
  intro.className = "brand-intro studio-stage";
  intro.setAttribute("role", "status");
  intro.setAttribute("aria-label", t("brandIntro.ariaLabel"));

  intro.innerHTML = `
    <div class="brand-intro__grain" aria-hidden="true"></div>
    <div class="studio-bumper" aria-label="Sunny Spoon Studios">
      <div class="studio-bumper__mark" aria-hidden="true">
        <span>SUNNY</span>
        <span>SPOON</span>
        <span>STUDIOS</span>
      </div>
    </div>
    <div class="brand-intro__content" aria-hidden="true">
      <div class="brand-intro__seal" aria-hidden="true">
        <img src="${appIconUrl}" alt="" />
      </div>
      <p class="brand-intro__studio">${t("app.studioName")}</p>
      <h2>${t("app.title")}</h2>
      <img class="brand-intro__cast" src="${redesignedCastUrl}" alt="" />
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
    window.setTimeout(() => intro.remove(), INTRO_EXIT_MS);
  };

  const requestPlayerName = () => {
    const content = intro.querySelector(".brand-intro__content");
    content.classList.add("name-stage");
    content.innerHTML = `
      <div class="brand-intro__seal" aria-hidden="true">
        <img src="${appIconUrl}" alt="" />
      </div>
      <p class="brand-intro__studio">${t("app.studioName")}</p>
      <h2>${t("playerIntro.title")}</h2>
      <p class="player-intro-note">${t("playerIntro.note")}</p>
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
    window.setTimeout(() => input.focus(), 50);
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
    window.setTimeout(showGameIdentity, STUDIO_DURATION_MS);
  }

  root.appendChild(intro);
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
}
