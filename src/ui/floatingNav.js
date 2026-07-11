import { t } from "../i18n/index.js";

const NAV_ITEMS = [
  ["puzzle", "views.puzzle", "views.puzzleHint"],
  ["album", "views.album", "views.albumHint"],
  ["pantry", "views.pantry", "views.pantryHint"],
  ["timeAttack", "views.timeAttack", "views.timeAttackHint"],
  ["map", "views.map", "views.mapHint"]
];

export function renderFloatingNav(activeView, onSelectView) {
  const nav = document.createElement("nav");
  nav.className = "floating-nav";
  nav.dataset.open = "false";
  nav.setAttribute("aria-label", t("views.navLabel"));

  const menu = document.createElement("div");
  menu.className = "floating-nav__menu";

  const activeItem = NAV_ITEMS.find(([view]) => view === activeView) ?? NAV_ITEMS[0];
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "floating-nav__trigger";
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-label", t("views.menu") + ": " + t(activeItem[1]));

  const triggerLabel = document.createElement("span");
  triggerLabel.className = "floating-nav__trigger-label";
  triggerLabel.textContent = t("views.menu");

  const triggerCurrent = document.createElement("strong");
  triggerCurrent.textContent = t(activeItem[1]);

  trigger.append(triggerLabel, triggerCurrent);

  function setOpen(open) {
    nav.dataset.open = String(open);
    trigger.setAttribute("aria-expanded", String(open));
  }

  trigger.addEventListener("click", () => {
    setOpen(nav.dataset.open !== "true");
  });

  NAV_ITEMS.forEach(([view, labelKey, hintKey]) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = activeView === view ? "floating-nav__item active" : "floating-nav__item";
    item.dataset.view = view;
    item.setAttribute("aria-current", activeView === view ? "page" : "false");

    const itemLabel = document.createElement("span");
    itemLabel.textContent = t(labelKey);

    const itemHint = document.createElement("small");
    itemHint.textContent = t(hintKey);

    item.append(itemLabel, itemHint);
    item.addEventListener("click", () => {
      setOpen(false);
      onSelectView(view);
    });
    menu.appendChild(item);
  });

  nav.append(menu, trigger);
  return nav;
}
