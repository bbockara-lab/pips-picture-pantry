import { getBadgeArtUrl } from "../data/badgeArt.js";
import { getPackBadgeStatus } from "../game/badges.js";
import { getCompletedPuzzleIds, getFeaturedBadgeId, setFeaturedBadge } from "../game/save.js";
import { t } from "../i18n/index.js";

const LAST_EARNED_BADGE_KEY = "pip-last-earned-badge";
const BADGE_GROUPS = [
  { id: "A", titleKey: "badges.groupA" },
  { id: "B", titleKey: "badges.groupB" },
  { id: "C", titleKey: "badges.groupC" }
];

export function renderPantryMapView() {
  const statuses = getPackBadgeStatus(getCompletedPuzzleIds());
  const earnedCount = statuses.filter((status) => status.earned).length;
  const justEarnedId = consumeJustEarnedBadgeId();
  let featuredBadgeId = getFeaturedBadgeId();
  const section = document.createElement("section");
  section.className = "map-panel badge-view content-panel";

  const header = document.createElement("div");
  header.className = "badge-view__header";
  const heading = document.createElement("h2");
  heading.textContent = t("sections.pantryMap");
  const count = document.createElement("p");
  count.className = "badge-view__count";
  count.textContent = t("badges.collectionCount", { earned: earnedCount, total: statuses.length });
  header.append(heading, count);
  section.appendChild(header);

  const shelves = document.createElement("div");
  shelves.className = "badge-shelves";
  BADGE_GROUPS.forEach((group) => {
    const shelf = document.createElement("section");
    shelf.className = "badge-shelf";
    shelf.dataset.group = group.id;

    const shelfTitle = document.createElement("h3");
    shelfTitle.className = "badge-shelf__title";
    shelfTitle.textContent = t(group.titleKey);

    const slots = document.createElement("div");
    slots.className = "badge-shelf__slots";
    statuses
      .filter((status) => status.badge.group === group.id)
      .forEach((status) => slots.appendChild(createBadgeSlot(status, justEarnedId)));

    const board = document.createElement("div");
    board.className = "badge-shelf__board";
    board.setAttribute("aria-hidden", "true");
    shelf.append(shelfTitle, slots, board);
    shelves.appendChild(shelf);
  });
  section.appendChild(shelves);

  const detail = document.createElement("aside");
  detail.className = "badge-detail";
  detail.setAttribute("aria-live", "polite");
  section.appendChild(detail);
  section.addEventListener("click", (event) => {
    const slot = event.target.closest(".badge-slot");
    if (!slot) return;
    const status = statuses.find((candidate) => candidate.badge.id === slot.dataset.badgeId);
    if (status) {
      showBadgeDetail(detail, status, {
        featured: featuredBadgeId === status.badge.id,
        onFeature: () => {
          setFeaturedBadge(status.badge.id);
          featuredBadgeId = status.badge.id;
          showBadgeDetail(detail, status, { featured: true });
        }
      });
    }
  });

  return section;
}

export function getBadgeSlotClassName(status, justEarnedId = "") {
  return [
    "badge-slot",
    status.earned ? "earned" : "locked",
    justEarnedId === status.badge.id ? "badge-slot--just-earned" : ""
  ].filter(Boolean).join(" ");
}

function createBadgeSlot(status, justEarnedId) {
  const slot = document.createElement("button");
  slot.type = "button";
  slot.dataset.badgeId = status.badge.id;
  slot.className = getBadgeSlotClassName(status, justEarnedId);
  slot.setAttribute("aria-label", status.earned
    ? t("badges.earnedAria", { title: t(status.badge.titleKey) })
    : t("badges.progressAria", {
      title: t(status.badge.titleKey),
      completed: status.completed,
      total: status.total
    }));

  const circle = document.createElement("span");
  circle.className = "badge-circle";
  const image = createBadgeImage(status.badge.id);
  circle.appendChild(image);
  if (!status.earned) {
    const lock = document.createElement("span");
    lock.className = "badge-slot__lock";
    lock.textContent = String(status.completed) + "/" + String(status.total);
    circle.appendChild(lock);
  }

  const title = document.createElement("strong");
  title.className = "badge-slot__name";
  title.textContent = t(status.badge.titleKey);
  const requirement = document.createElement("small");
  requirement.className = "badge-slot__requirement";
  requirement.textContent = status.earned
    ? t("badges.earned")
    : t("badges.stageRequirement", { stage: status.badge.stage });
  slot.append(circle, title, requirement);
  return slot;
}

function showBadgeDetail(detail, status, options = {}) {
  detail.replaceChildren();
  detail.classList.add("visible");
  const image = createBadgeImage(status.badge.id);
  const copy = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = t(status.badge.titleKey);
  const note = document.createElement("p");
  note.textContent = status.earned
    ? t("badges.detailEarned")
    : t("badges.detailLocked", {
      completed: status.completed,
      total: status.total,
      stage: status.badge.stage
    });
  copy.append(title, note);
  detail.append(image, copy);
  if (status.earned) {
    const action = document.createElement("button");
    action.type = "button";
    action.className = "badge-detail__feature";
    action.disabled = Boolean(options.featured);
    action.textContent = options.featured
      ? t("badges.featuredOnHome")
      : t("badges.featureOnHome");
    if (!options.featured && options.onFeature) {
      action.addEventListener("click", options.onFeature);
    }
    detail.appendChild(action);
  }
}

export function renderBadgeEarnedToast(status) {
  if (!status?.badge) return null;
  rememberJustEarnedBadgeId(status.badge.id);
  const toast = document.createElement("aside");
  toast.className = "badge-earned-toast";
  toast.setAttribute("role", "status");
  toast.appendChild(createBadgeImage(status.badge.id));
  const copy = document.createElement("div");
  const label = document.createElement("small");
  label.textContent = t("badges.toastLabel");
  const title = document.createElement("strong");
  title.textContent = t(status.badge.titleKey);
  copy.append(label, title);
  toast.appendChild(copy);
  globalThis.setTimeout(() => toast.remove(), 3200);
  return toast;
}

export function rememberJustEarnedBadgeId(badgeId, storage = globalThis.sessionStorage) {
  try {
    storage?.setItem(LAST_EARNED_BADGE_KEY, String(badgeId || ""));
  } catch {
    // Badge feedback must never block completion.
  }
}

export function consumeJustEarnedBadgeId(storage = globalThis.sessionStorage) {
  try {
    const badgeId = storage?.getItem(LAST_EARNED_BADGE_KEY) || "";
    storage?.removeItem(LAST_EARNED_BADGE_KEY);
    return badgeId;
  } catch {
    return "";
  }
}

function createBadgeImage(badgeId) {
  const img = document.createElement("img");
  img.src = getBadgeArtUrl(badgeId);
  img.alt = "";
  return img;
}
