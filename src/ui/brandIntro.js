import { t } from "../i18n/index.js";

const STUDIO_DURATION_MS = 900;
const GAME_DURATION_MS = 1700;
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
      <p>${t("brandIntro.studioTagline")}</p>
    </div>
    <div class="brand-intro__content" aria-hidden="true">
      <div class="brand-intro__seal" aria-hidden="true">
        <img src="/src/assets/app-icons/app-icon-192.png" alt="" />
      </div>
      <p class="brand-intro__studio">${t("app.studioName")}</p>
      <h2>${t("brandIntro.familyLine")}</h2>
      <p class="brand-intro__title">${t("app.title")}</p>
      <img class="brand-intro__cast" src="/src/assets/characters/opening-expression-sheet-v1-clean.png" alt="" />
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

  intro.querySelector("button").addEventListener("click", dismiss);

  if (prefersReducedMotion()) {
    showGameIdentity();
    window.setTimeout(dismiss, 800);
  } else {
    window.setTimeout(showGameIdentity, STUDIO_DURATION_MS);
    window.setTimeout(dismiss, STUDIO_DURATION_MS + GAME_DURATION_MS);
  }

  root.appendChild(intro);
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
}