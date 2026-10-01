import { getJarArtUrl } from "../data/jarArt.js";
import { t } from "../i18n/index.js";

export function renderFeaturedJar(jar, { className = "", onSelect = null } = {}) {
  if (!jar) return null;
  const element = document.createElement(onSelect ? "button" : "div");
  if (onSelect) {
    element.type = "button";
    element.addEventListener("click", onSelect);
  }
  element.className = ["featured-pantry-jar", className].filter(Boolean).join(" ");
  element.dataset.jarId = jar.id;

  const image = document.createElement("img");
  image.className = "featured-pantry-jar__image";
  image.src = getJarArtUrl(jar.id);
  image.alt = "";
  image.dataset.assetId = `jar-${jar.id}-v1`;

  const copy = document.createElement("span");
  copy.className = "featured-pantry-jar__copy";
  const eyebrow = document.createElement("span");
  eyebrow.className = "featured-pantry-jar__eyebrow";
  eyebrow.textContent = t("pantry.jar.todaysPantry");
  const name = document.createElement("span");
  name.className = "featured-pantry-jar__name";
  name.textContent = t(jar.nameKey);
  copy.append(eyebrow, name);
  element.append(image, copy);
  if (onSelect) element.setAttribute("aria-label", `${t("pantry.jar.todaysPantry")}: ${t(jar.nameKey)}`);
  return element;
}