import { t } from "../i18n/index.js";

const NAV_ITEMS = [
  ["puzzle", "views.puzzle"],
  ["album", "views.album"],
  ["pantry", "views.pantry"],
  ["timeAttack", "views.timeAttack"],
  ["map", "views.map"]
];

export function renderFloatingNav(activeView, onSelectView) {
  const nav = document.createElement("nav");
  nav.className = "floating-nav";
  nav.dataset.open = "false";
  nav.setAttribute("aria-label", t("views.navLabel"));

  const menu = document.createElement("div");
  menu.className = "floating-nav__menu";

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "floating-nav__trigger";
  trigger.textContent = t("views.menu");
  trigger.setAttribute("aria-expanded", "false");

  function setOpen(open) {
    nav.dataset.open = String(open);
    trigger.setAttribute("aria-expanded", String(open));
  }

  trigger.addEventListener("click", () => {
    setOpen(nav.dataset.open !== "true");
  });

  NAV_ITEMS.forEach(([view, labelKey]) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = activeView === view ? "floating-nav__item active" : "floating-nav__item";
    item.dataset.view = view;
    item.textContent = t(labelKey);
    item.setAttribute("aria-current", activeView === view ? "page" : "false");
    item.addEventListener("click", () => {
      setOpen(false);
      onSelectView(view);
    });
    menu.appendChild(item);
  });

  nav.append(menu, trigger);
  return nav;
}
