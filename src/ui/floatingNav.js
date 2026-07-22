import { t } from "../i18n/index.js";
import { getQuickTravelArt } from "../data/quickTravelArt.js";

const NAV_ITEMS = [
  ["puzzle", "views.puzzle", "views.puzzleHint"],
  ["album", "views.album", "views.albumHint"],
  ["pantry", "views.pantry", "views.pantryHint"],
  ["timeAttack", "views.timeAttack", "views.timeAttackHint"],
  ["map", "views.map", "views.mapHint"]
];

function createQuickTravelIcon(view, extraClass = "") {
  const icon = document.createElement("span");
  icon.className = `floating-nav__icon floating-nav__icon--raster floating-nav__icon--${view}${extraClass ? ` ${extraClass}` : ""}`;
  icon.dataset.view = view;
  icon.setAttribute("aria-hidden", "true");

  const art = getQuickTravelArt(view);
  if (art) {
    const image = document.createElement("img");
    image.src = art.src;
    image.alt = "";
    image.dataset.assetId = art.assetId;
    icon.appendChild(image);
  }
  return icon;
}

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
  trigger.dataset.view = activeItem[0];
  trigger.setAttribute("aria-expanded", "false");
  const triggerLabelText = t("views.menu") + ": " + t(activeItem[1]) + " - " + t("views.quickJump");
  trigger.setAttribute("aria-label", triggerLabelText);
  trigger.title = triggerLabelText;

  const triggerIcon = createQuickTravelIcon(activeItem[0], "floating-nav__trigger-icon");

  const triggerText = document.createElement("span");
  triggerText.className = "floating-nav__trigger-text";

  const triggerLabel = document.createElement("span");
  triggerLabel.className = "floating-nav__trigger-label";
  triggerLabel.textContent = t("views.menu");

  const triggerCurrent = document.createElement("strong");
  triggerCurrent.textContent = t(activeItem[1]);

  const triggerCue = document.createElement("span");
  triggerCue.className = "floating-nav__trigger-cue";
  triggerCue.textContent = t("views.quickJump");

  triggerText.append(triggerLabel, triggerCurrent, triggerCue);
  trigger.append(triggerIcon, triggerText);

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
    item.className = "floating-nav__item floating-nav__item--" + view + (activeView === view ? " active" : "");
    item.dataset.view = view;
    item.setAttribute("aria-current", activeView === view ? "page" : "false");
    const itemLabelText = t(labelKey) + " - " + t(hintKey);
    item.setAttribute("aria-label", itemLabelText);
    item.title = itemLabelText;

    const itemIcon = createQuickTravelIcon(view);

    const itemCopy = document.createElement("span");
    itemCopy.className = "floating-nav__copy";

    const itemLabel = document.createElement("span");
    itemLabel.className = "floating-nav__label";
    itemLabel.textContent = t(labelKey);

    const itemHint = document.createElement("small");
    itemHint.textContent = t(hintKey);

    itemCopy.append(itemLabel, itemHint);
    item.append(itemIcon, itemCopy);
    item.addEventListener("click", () => {
      setOpen(false);
      onSelectView(view);
    });
    menu.appendChild(item);
  });

  nav.append(menu, trigger);
  return nav;
}
