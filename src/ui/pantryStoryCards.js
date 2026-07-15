import { puzzlePacks } from "../data/packs.js";
import { pantrySlots } from "../data/decorations.js";
import pipGuideSceneUrl from "../assets/characters/pip-chrome-v2.png";
import { getDecorationArtUrl } from "../data/decorationArt.js";
import { isRuntimeGuideArtApproved } from "../data/runtimeArt.js";
import { t } from "../i18n/index.js";

const roomStepTargets = [1, 3, 6, 10];
const GUIDE_ART_ASSET_ID = "pip-chrome-v2";

export function renderPantryStoryRequest(approvedDecorations, ownedIds, equippedDecorations, spoons, onStartRequest) {
  const starterRequest = approvedDecorations.find((decoration) => Number(decoration.cost || 0) === 0 && decoration.slot === "counter") || approvedDecorations[0];
  if (!starterRequest) {
    return null;
  }

  const owned = ownedIds.includes(starterRequest.id);
  const equipped = equippedDecorations[starterRequest.slot] === starterRequest.id;
  const complete = owned && equipped;
  const state = complete ? "complete" : owned ? "place" : "start";
  const slot = pantrySlots.find((candidate) => candidate.id === starterRequest.slot);
  const slotLabel = slot ? t(slot.titleKey) : starterRequest.slot;
  const request = document.createElement("aside");
  request.className = "pantry-story-request state-" + state;

  if (isRuntimeGuideArtApproved(GUIDE_ART_ASSET_ID)) {
    const pip = document.createElement("div");
    pip.className = "pantry-story-request__pip";
    pip.setAttribute("aria-hidden", "true");
    const pipImage = document.createElement("img");
    pipImage.src = pipGuideSceneUrl;
    pipImage.alt = "";
    pipImage.setAttribute("aria-hidden", "true");
    pip.appendChild(pipImage);
    request.appendChild(pip);
  }

  const art = document.createElement("div");
  art.className = "pantry-story-request__art";
  const image = document.createElement("img");
  image.src = getDecorationArtUrl(starterRequest.assetId);
  image.alt = t(starterRequest.titleKey);
  art.appendChild(image);

  const copy = document.createElement("div");
  copy.className = "pantry-story-request__copy";
  copy.innerHTML = ""
    + '<p class="section-label">' + t("pantry.storyEyebrow") + "</p>"
    + "<h3>" + t("pantry.story." + state + "Title", { item: t(starterRequest.titleKey), slot: slotLabel }) + "</h3>"
    + "<p>" + t("pantry.story." + state + "Body", { item: t(starterRequest.titleKey), slot: slotLabel, spoons }) + "</p>"
    + '<p class="pantry-story-request__target">' + t("pantry.storyTarget", { item: t(starterRequest.titleKey), slot: slotLabel }) + "</p>";

  const action = document.createElement("button");
  action.type = "button";
  action.className = complete ? "pantry-story-request__action complete" : "pantry-story-request__action";
  action.textContent = t("pantry.story." + state + "Action");
  action.disabled = complete;
  action.addEventListener("click", () => onStartRequest?.(starterRequest));

  request.append(art, copy, action);
  return request;
}

export function renderPantryStoryMilestone(approvedDecorations, ownedIds, equippedDecorations, onChooseNext) {
  const starterRequest = approvedDecorations.find((decoration) => Number(decoration.cost || 0) === 0 && decoration.slot === "counter") || approvedDecorations[0];
  if (!starterRequest || equippedDecorations[starterRequest.slot] !== starterRequest.id) {
    return null;
  }

  const nextDecorations = approvedDecorations
    .filter((decoration) => decoration.id !== starterRequest.id && !ownedIds.includes(decoration.id))
    .sort((left, right) => Number(left.cost || 0) - Number(right.cost || 0) || left.id.localeCompare(right.id))
    .slice(0, 3);

  const milestone = document.createElement("aside");
  milestone.className = "pantry-story-milestone";

  const copy = document.createElement("div");
  copy.className = "pantry-story-milestone__copy";
  copy.innerHTML = ""
    + '<p class="section-label">' + t("pantry.storyMilestoneEyebrow") + "</p>"
    + "<h3>" + t("pantry.storyMilestoneTitle") + "</h3>"
    + "<p>" + t("pantry.storyMilestoneBody") + "</p>";

  const level = document.createElement("div");
  level.className = "pantry-story-milestone__level";
  level.setAttribute("aria-label", t("pantry.storyMilestoneLevelAria"));
  level.innerHTML = '<span>' + t("pantry.storyMilestoneLevel") + '</span><strong>' + Math.max(1, Object.keys(equippedDecorations || {}).length) + "</strong>";

  milestone.append(copy, level);

  if (nextDecorations.length > 0) {
    const preview = document.createElement("div");
    preview.className = "pantry-story-milestone__preview";
    const label = document.createElement("p");
    label.className = "pantry-story-milestone__preview-label";
    label.textContent = t("pantry.storyNextArrival");
    preview.appendChild(label);

    const list = document.createElement("div");
    list.className = "pantry-story-milestone__items";
    nextDecorations.forEach((decoration) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "pantry-story-milestone__item";
      button.setAttribute("aria-label", t("pantry.storyNextArrivalAction", { item: t(decoration.titleKey) }));

      const image = document.createElement("img");
      image.src = getDecorationArtUrl(decoration.assetId);
      image.alt = "";
      image.setAttribute("aria-hidden", "true");

      const name = document.createElement("span");
      name.textContent = t(decoration.titleKey);
      button.append(image, name);
      button.addEventListener("click", () => onChooseNext?.(decoration));
      list.appendChild(button);
    });
    preview.appendChild(list);
    milestone.appendChild(preview);
  }

  return milestone;
}

export function renderPantryStoryDelivery(approvedDecorations, storyGoalId, ownedIds, spoons, onShowGoal, onPlayForSpoons) {
  const goal = approvedDecorations.find((decoration) => decoration.id === storyGoalId && !ownedIds.includes(decoration.id));
  if (!goal) {
    return null;
  }

  const slot = pantrySlots.find((candidate) => candidate.id === goal.slot);
  const slotLabel = slot ? t(slot.titleKey) : goal.slot;
  const cost = Number(goal.cost || 0);
  const needed = Math.max(0, cost - spoons);
  const card = document.createElement("aside");
  card.className = "pantry-story-delivery";

  const art = document.createElement("div");
  art.className = "pantry-story-delivery__art";
  const image = document.createElement("img");
  image.src = getDecorationArtUrl(goal.assetId);
  image.alt = t(goal.titleKey);
  art.appendChild(image);

  const copy = document.createElement("div");
  copy.className = "pantry-story-delivery__copy";
  copy.innerHTML = ""
    + '<p class="section-label">' + t("pantry.storyDeliveryEyebrow") + "</p>"
    + "<h3>" + t("pantry.storyDeliveryTitle", { item: t(goal.titleKey) }) + "</h3>"
    + "<p>" + t("pantry.storyDeliveryBody", { item: t(goal.titleKey), slot: slotLabel, needed }) + "</p>";

  const steps = document.createElement("div");
  steps.className = "pantry-story-delivery__steps";
  steps.innerHTML = ""
    + "<span>" + t("pantry.storyDeliveryStepSpoons", { needed }) + "</span>"
    + "<span>" + t("pantry.storyDeliveryStepSlot", { slot: slotLabel }) + "</span>";

  const actions = document.createElement("div");
  actions.className = "pantry-story-delivery__actions";

  const showGoal = document.createElement("button");
  showGoal.type = "button";
  showGoal.className = "pantry-story-delivery__action";
  showGoal.textContent = t("pantry.storyDeliveryShowGoal");
  showGoal.addEventListener("click", () => onShowGoal?.(goal));
  actions.appendChild(showGoal);

  if (needed > 0) {
    const earn = document.createElement("button");
    earn.type = "button";
    earn.className = "pantry-story-delivery__action secondary";
    earn.textContent = t("pantry.storyDeliveryEarn");
    earn.addEventListener("click", () => onPlayForSpoons?.());
    actions.appendChild(earn);
  }

  card.append(art, copy, steps, actions);
  return card;
}


function getNextPantryStageGoal(completedCount) {
  const nextPack = puzzlePacks
    .filter((pack) => pack.access !== "bonus-pack" && Number(pack.pantryRoomStepRequired || 0) > completedCount)
    .sort((left, right) => Number(left.pantryRoomStepRequired || 0) - Number(right.pantryRoomStepRequired || 0))
    [0];
  if (!nextPack) {
    return null;
  }

  const required = Number(nextPack.pantryRoomStepRequired || 0);
  return {
    pack: nextPack,
    required,
    remaining: Math.max(0, required - completedCount)
  };
}

export function renderPantryStoryArchive(approvedDecorations, completedGoalIds, ownedIds = [], onChooseNext, spoons = 0) {
  const completedSet = new Set(Array.isArray(completedGoalIds) ? completedGoalIds : []);
  const completedDecorations = approvedDecorations.filter((decoration) => completedSet.has(decoration.id));
  if (!completedDecorations.length) {
    return null;
  }

  const archive = document.createElement("aside");
  archive.className = "pantry-story-archive";
  const completedCount = completedDecorations.length;
  const nextTarget = roomStepTargets.find((target) => target > completedCount) || completedCount;
  const previousTarget = [...roomStepTargets].reverse().find((target) => target <= completedCount) || 0;
  const stepSpan = Math.max(1, nextTarget - previousTarget);
  const stepProgress = nextTarget === completedCount ? 100 : Math.round(((completedCount - previousTarget) / stepSpan) * 100);
  archive.style.setProperty("--story-step-progress", Math.max(0, Math.min(100, stepProgress)) + "%");

  const copy = document.createElement("div");
  copy.className = "pantry-story-archive__copy";
  copy.innerHTML = ""
    + '<p class="section-label">' + t("pantry.storyArchiveEyebrow") + "</p>"
    + "<h3>" + t("pantry.storyArchiveTitle", { count: completedDecorations.length }) + "</h3>"
    + "<p>" + t("pantry.storyArchiveBody", { count: completedDecorations.length }) + "</p>";

  const step = document.createElement("div");
  step.className = "pantry-story-archive__step";
  step.innerHTML = ""
    + "<span>" + t("pantry.storyArchiveStepLabel") + "</span>"
    + "<strong>" + t("pantry.storyArchiveStepProgress", { count: completedCount, target: nextTarget }) + "</strong>"
    + '<div class="pantry-story-archive__meter" aria-hidden="true"><span></span></div>';
  copy.appendChild(step);

  const chapterIndex = Math.max(1, roomStepTargets.filter((target) => completedCount >= target).length + 1);
  const chapter = document.createElement("div");
  chapter.className = "pantry-story-archive__chapter";
  chapter.innerHTML = ""
    + "<span>" + t("pantry.storyArchiveChapterLabel") + "</span>"
    + "<strong>" + t("pantry.storyArchiveChapterTitle", { chapter: chapterIndex }) + "</strong>"
    + "<p>" + t("pantry.storyArchiveChapterBody", { count: completedCount, target: nextTarget }) + "</p>";
  copy.appendChild(chapter);

  const nextStageGoal = getNextPantryStageGoal(completedCount);
  if (nextStageGoal) {
    const stageGoal = document.createElement("div");
    stageGoal.className = "pantry-story-archive__stage-goal";
    const stageCost = Math.max(0, Number(nextStageGoal.pack.unlockCost || 0));
    const stageSaved = Math.min(stageCost, Math.max(0, Number(spoons || 0)));
    const stageNeeded = Math.max(0, stageCost - stageSaved);
    stageGoal.innerHTML = ""
      + "<span>" + t("pantry.storyArchiveStageGoalLabel") + "</span>"
      + "<strong>" + t("pantry.storyArchiveStageGoal", {
        stage: t(nextStageGoal.pack.titleKey),
        remaining: nextStageGoal.remaining
      }) + "</strong>"
      + "<p>" + t("pantry.storyArchiveStageCost", {
        cost: stageCost,
        saved: stageSaved,
        needed: stageNeeded
      }) + "</p>";
    copy.appendChild(stageGoal);
  }

  const ownedSet = new Set(Array.isArray(ownedIds) ? ownedIds : []);
  const nextRequest = approvedDecorations
    .filter((decoration) => !completedSet.has(decoration.id) && !ownedSet.has(decoration.id))
    .sort((left, right) => Number(left.cost || 0) - Number(right.cost || 0) || left.id.localeCompare(right.id))[0];
  if (nextRequest) {
    const slot = pantrySlots.find((candidate) => candidate.id === nextRequest.slot);
    const slotLabel = slot ? t(slot.titleKey) : nextRequest.slot;
    const next = document.createElement("div");
    next.className = "pantry-story-archive__next";
    next.innerHTML = ""
      + "<div>"
      + "<span>" + t("pantry.storyArchiveNextLabel") + "</span>"
      + "<strong>" + t("pantry.storyArchiveNextTitle", { item: t(nextRequest.titleKey) }) + "</strong>"
      + "<p>" + t("pantry.storyArchiveNextBody", { slot: slotLabel, cost: Number(nextRequest.cost || 0) }) + "</p>"
      + "</div>";
    const action = document.createElement("button");
    action.type = "button";
    action.className = "pantry-story-archive__next-action";
    action.textContent = t("pantry.storyArchiveNextAction");
    action.addEventListener("click", () => onChooseNext?.(nextRequest));
    next.appendChild(action);
    copy.appendChild(next);
  }

  const list = document.createElement("div");
  list.className = "pantry-story-archive__items";
  completedDecorations.slice(-4).forEach((decoration) => {
    const item = document.createElement("span");
    item.className = "pantry-story-archive__item";

    const image = document.createElement("img");
    image.src = getDecorationArtUrl(decoration.assetId);
    image.alt = "";
    image.setAttribute("aria-hidden", "true");

    const label = document.createElement("strong");
    label.textContent = t(decoration.titleKey);
    item.append(image, label);
    list.appendChild(item);
  });

  archive.append(copy, list);
  return archive;
}
