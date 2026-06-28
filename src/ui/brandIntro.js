import { t } from "../i18n/index.js";

const INTRO_DURATION_MS = 1400;
const INTRO_EXIT_MS = 260;

export function renderBrandIntro(root) {
  const intro = document.createElement("section");
  intro.className = "brand-intro";
  intro.setAttribute("role", "status");
  intro.setAttribute("aria-label", t("brandIntro.ariaLabel"));

  intro.innerHTML = `
    <div class="brand-intro__grain" aria-hidden="true"></div>
    <div class="brand-intro__content">
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

  const dismiss = () => {
    if (intro.classList.contains("leaving")) {
      return;
    }
    intro.classList.add("leaving");
    window.setTimeout(() => intro.remove(), INTRO_EXIT_MS);
  };

  intro.querySelector("button").addEventListener("click", dismiss);
  window.setTimeout(dismiss, prefersReducedMotion() ? 500 : INTRO_DURATION_MS);
  root.appendChild(intro);
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
}