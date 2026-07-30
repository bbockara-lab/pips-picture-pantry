import { chromium } from "@playwright/test";

const qaPort = process.env.PPP_QA_PORT || "5173";
const TARGET_URL = process.env.PPP_URL || `http://127.0.0.1:${qaPort}/`;
const viewports = [
  { width: 360, height: 740, name: "360x740" },
  { width: 390, height: 844, name: "390x844" },
  { width: 430, height: 932, name: "430x932" },
  { width: 675, height: 900, name: "675x900" }
];

const browser = await chromium.launch({ headless: true });
const failures = [];
const BILLING_DEV_COPY_PATTERN = /(Android test build|Google Play app|Google Play price|Android \uD14C\uC2A4\uD2B8|Google Play \uC571|Google Play \uAC00\uACA9)/i;

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  page.on("pageerror", (error) => {
    console.error("[" + viewport.name + "] PAGE ERROR:", error?.stack || error?.message || String(error));
  });
  await page.goto(TARGET_URL, { waitUntil: "networkidle" });

  await expectVisible(page, ".brand-intro", viewport.name);
  await expectVisible(page, ".studio-bumper__art img", viewport.name);
  await page.locator(".brand-intro.game-stage").waitFor({ state: "visible", timeout: 6000 });
  await page.waitForTimeout(800);
  await expectVisible(page, ".brand-intro.game-stage", viewport.name);
  await expectAbsent(page, ".brand-intro__seal", viewport.name);
  await expectAbsent(page, ".brand-intro__version", viewport.name);
  await expectAbsent(page, ".brand-intro__promise-strip", viewport.name);
  await expectOpeningIntroPolish(page, viewport.name);
  await expectFloatingNavHiddenDuringBrandIntro(page, viewport.name);
  await expectAbsent(page, ".brand-intro__cast", viewport.name);
  await dismissIntro(page, "Jay", viewport.name);

  await expectVisible(page, ".app-shell", viewport.name);
  const isWorkshopHome = (await page.locator(".app-shell--workshop-home").count()) > 0;
  if (!isWorkshopHome) {
    await expectSafeAreaChromeGuard(page, viewport.name);
  }
  await expectFloatingNavHiddenDuringBlockingOverlay(page, viewport.name);
  await dismissGuideIfPresent(page, viewport.name);
  await expectSettingsDialogPolish(page, viewport.name);
  await expectSpoonBalanceChipSize(page, viewport.name, "Initial view");
  if ((await page.locator(".play-screen").count()) > 0) {
    await expectVisible(page, ".play-screen", viewport.name);
    await expectStarterBoardAlignment(page, viewport.name);
    await expectStageNavigationPolish(page, viewport.name);
    await expectPlayScreenNavClearance(page, viewport.name);
    await page.locator(".play-screen__back").click();
  }
  await expectAbsent(page, ".pip-strip", viewport.name);
  await expectSpoonBalanceChipSize(page, viewport.name, "Workshop");
  if (!isWorkshopHome) {
    await expectFloatingNavPolish(page, viewport.name);
  }
  await expectPuzzleHomePolish(page, viewport.name);
  const expectedRegularPlayLabel = await page.locator(".puzzle-home-scene__play").getAttribute("aria-label");
  await openFloatingView(page, "spoonRun", viewport.name);
  await expectVisible(page, ".spoon-run-view", viewport.name);
  await expectSpoonBalanceChipSize(page, viewport.name, "Spoon Run");
  await expectSpoonRunFirstVisitGuide(page, viewport.name);
  await expectDailyRewardPolish(page, viewport.name);
  await expectTimeAttackNavigationEntry(page, viewport.name);
  await expectResetDialogPolish(page, viewport.name);
  await expectStageCompleteRewardPolish(page, viewport.name);
  await expectAbsent(page, ".season-progress-card", viewport.name);
  await expectNoHorizontalOverflow(page, viewport.name);
  await expectTapTargets(page, viewport.name);
  await verifyEmptyAlbumPlayNowFlow(page, viewport.name);

  await seedCompletedStarter(page);
  await page.reload({ waitUntil: "networkidle" });
  await page.locator(".brand-intro.game-stage").waitFor({ state: "visible", timeout: 6000 });
  await page.waitForTimeout(800);
  await expectVisible(page, ".brand-intro.game-stage", viewport.name);
  await dismissIntro(page, "Jay", viewport.name);
  await dismissGuideIfPresent(page, viewport.name);
  await expectVisible(page, ".puzzle-home-scene", viewport.name);
  await openFloatingView(page, "spoonRun", viewport.name);
  await expectVisible(page, ".spoon-run-view", viewport.name);
  await expectSpoonBalanceChipSize(page, viewport.name, "Spoon Run replay");
  await expectReplayPicksPolish(page, viewport.name);
  await openFloatingView(page, "puzzle");
  await expectVisible(page, ".pack-block", viewport.name);
  await expectHiddenBonusPacks(page, viewport.name);
  await expectNoStageMosaic(page, viewport.name);
  await expectPuzzlePickerPolish(page, viewport.name);
  await expectSpoonBalanceChipSize(page, viewport.name, "Puzzle list");
  await expectNoHorizontalOverflow(page, viewport.name);
  await expectTapTargets(page, viewport.name);

  await openFloatingView(page, "album");
  await expectNoSharedScreenHeader(page, viewport.name);
  await expectVisible(page, ".album-panel", viewport.name);
  await expectVisible(page, ".album-stamp", viewport.name);
  await expectAlbumPolish(page, viewport.name);
  await expectSpoonBalanceChipSize(page, viewport.name, "Album");
  await expectNoHorizontalOverflow(page, viewport.name);

  await openFloatingView(page, "map");
  await expectMapFirstRunGuide(page, viewport.name);
  await expectNoSharedScreenHeader(page, viewport.name);
  await expectVisible(page, ".map-panel", viewport.name);
  await expectVisible(page, ".badge-shelf", viewport.name);
  await expectSpoonBalanceChipSize(page, viewport.name, "Badge");
  await expectMapPolish(page, viewport.name);
  await verifyFeaturedBadgeFlow(page, viewport.name);
  await expectNoHorizontalOverflow(page, viewport.name);

  await page.evaluate(() => {
    const player = JSON.parse(localStorage.getItem("pips-picture-pantry:v0.1:active-player") || "null");
    const saveKey = "pips-picture-pantry:v0.1:save:" + player.id;
    const save = JSON.parse(localStorage.getItem(saveKey) || "{}");
    save.pantrySpoons = 50;
    localStorage.setItem(saveKey, JSON.stringify(save));
  });
  await openFloatingView(page, "pantry");
  await expectNoSharedScreenHeader(page, viewport.name);
  await expectSpoonBalanceChipSize(page, viewport.name, "Pantry");
  await verifyPantryPlacement(page, viewport.name);

  await openFloatingView(page, "timeAttack", viewport.name);
  await expectSpoonBalanceChipSize(page, viewport.name, "Time Attack");
  await expectNoHorizontalOverflow(page, viewport.name);
  await verifyTimeAttackExitRestoresRegularPuzzle(page, viewport.name, expectedRegularPlayLabel);

  await verifyLargeBoardCatalogPuzzle(page, viewport.name);
  await expectHintConfirmationPolish(page, viewport.name);

  await page.close();
}

await browser.close();

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Mobile visual QA passed for ${viewports.map((viewport) => viewport.name).join(", ")}.`);


async function expectSafeAreaChromeGuard(page, viewportName) {
  const metrics = await page.evaluate(() => {
    const viewportMeta = document.querySelector('meta[name="viewport"]')?.getAttribute("content") || "";
    const shell = document.querySelector(".app-shell");
    const playHeader = document.querySelector(".app-shell--play .play-screen__header");
    const shellRect = shell?.getBoundingClientRect();
    const shellStyle = shell ? getComputedStyle(shell) : null;
    const playHeaderStyle = playHeader ? getComputedStyle(playHeader) : null;
    return {
      viewportMeta,
      shellTop: shellRect?.top || 0,
      paddingTop: shellStyle ? parseFloat(shellStyle.paddingTop) : 0,
      paddingLeft: shellStyle ? parseFloat(shellStyle.paddingLeft) : 0,
      paddingRight: shellStyle ? parseFloat(shellStyle.paddingRight) : 0,
      hasDedicatedPlayShell: Boolean(playHeader && shellRect?.width >= window.innerWidth - 1),
      playHeaderPaddingTop: playHeaderStyle ? parseFloat(playHeaderStyle.paddingTop) : 0,
      playHeaderPaddingLeft: playHeaderStyle ? parseFloat(playHeaderStyle.paddingLeft) : 0,
      playHeaderPaddingRight: playHeaderStyle ? parseFloat(playHeaderStyle.paddingRight) : 0
    };
  });
  if (
    !metrics.viewportMeta.includes("viewport-fit=cover") ||
    (!metrics.hasDedicatedPlayShell && (
      metrics.paddingTop < 16 ||
      metrics.paddingLeft < 16 ||
      metrics.paddingRight < 16
    )) ||
    (metrics.hasDedicatedPlayShell && (
      metrics.playHeaderPaddingTop < 10 ||
      metrics.playHeaderPaddingLeft < 10 ||
      metrics.playHeaderPaddingRight < 10
    ))
  ) {
    failures.push("[" + viewportName + "] Safe-area chrome guard regression: " + JSON.stringify(metrics));
  }
}

async function dismissIntro(page, playerName, viewportName) {
  await page.locator(".brand-intro__skip").click();
  const nameInput = page.locator("#player-intro-name");
  try {
    await nameInput.waitFor({ state: "visible", timeout: 700 });
    if (viewportName) {
      await expectPlayerIntroPolish(page, viewportName);
    }
    await nameInput.fill(playerName);
    await page.locator(".player-intro-form button").click();
  } catch {
    // Returning players skip the name form and the intro can close immediately.
  }
  await page.locator(".brand-intro").waitFor({ state: "detached", timeout: 2000 });
}

async function expectOpeningPromiseRoutes(browser, viewport) {
  const routes = [
    { view: "puzzle", label: "Puzzle", selector: ".pack-block, .play-screen" },
    { view: "pantry", label: "Pantry", selector: ".pantry-panel" },
    { view: "timeAttack", label: "Time Attack", selector: ".time-attack-panel" }
  ];

  for (const route of routes) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height }
    });
    const page = await context.newPage();
    try {
      await page.goto(TARGET_URL, { waitUntil: "networkidle" });
      await page.locator(".brand-intro.game-stage").waitFor({ state: "visible", timeout: 6000 });
      await page.waitForTimeout(300);
      const chip = page.locator(`.brand-intro__promise-chip[data-target-view="${route.view}"]`).first();
      await chip.waitFor({ state: "visible", timeout: 3000 });
      await chip.click();

      const nameInput = page.locator("#player-intro-name");
      try {
        await nameInput.waitFor({ state: "visible", timeout: 900 });
        await nameInput.fill("Route QA");
        await page.locator(".player-intro-form button").click();
      } catch {
        // Returning-player storage can route directly without the name stage.
      }

      await page.locator(".brand-intro").waitFor({ state: "detached", timeout: 2500 });
      const target = page.locator(route.selector).first();
      await target.waitFor({ state: "visible", timeout: 5000 });
      const metrics = await target.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return {
          width: rect.width,
          height: rect.height,
          display: style.display,
          visibility: style.visibility
        };
      });
      if (
        metrics.width < 24 ||
        metrics.height < 24 ||
        metrics.display === "none" ||
        metrics.visibility === "hidden"
      ) {
        failures.push(`[${viewport.name}] Opening promise ${route.label} route target is not visible enough: ${JSON.stringify(metrics)}`);
      }
    } catch (error) {
      failures.push(`[${viewport.name}] Opening promise ${route.label} route failed: ${error?.message || error}`);
    } finally {
      await context.close();
    }
  }
}

async function expectFloatingNavHiddenDuringBlockingOverlay(page, viewportName) {
  const metrics = await page.evaluate(() => ({
    guideOverlayCount: document.querySelectorAll(".guide-overlay").length,
    modalBackdropCount: document.querySelectorAll(".modal-backdrop").length,
    floatingNavCount: document.querySelectorAll(".floating-nav").length
  }));
  if ((metrics.guideOverlayCount > 0 || metrics.modalBackdropCount > 0) && metrics.floatingNavCount > 0) {
    failures.push(`[${viewportName}] Floating nav is visible during a blocking overlay: ${JSON.stringify(metrics)}`);
  }
}

async function expectFloatingNavHiddenDuringBrandIntro(page, viewportName) {
  const metrics = await page.evaluate(() => {
    const intro = document.querySelector(".brand-intro");
    const nav = document.querySelector(".floating-nav");
    const navStyle = nav ? getComputedStyle(nav) : null;
    return {
      introCount: intro ? 1 : 0,
      introOpenState: document.querySelector("#app")?.dataset.introOpen || "",
      navCount: nav ? 1 : 0,
      navVisibility: navStyle?.visibility || "absent",
      navPointerEvents: navStyle?.pointerEvents || "absent"
    };
  });
  if (
    metrics.introCount > 0 &&
    (metrics.introOpenState !== "true" ||
      (metrics.navCount > 0 && (metrics.navVisibility !== "hidden" || metrics.navPointerEvents !== "none")))
  ) {
    failures.push(`[${viewportName}] Floating navigation can cover the brand intro: ${JSON.stringify(metrics)}`);
  }
}

async function expectCompletionAlbumRoute(page, viewportName) {
  const menuButton = page.locator(".completion-actions .tool-button").first();
  if ((await menuButton.count()) === 0) {
    return;
  }
  await menuButton.click();
  try {
    await page.locator(".puzzle-home-scene").first().waitFor({ state: "visible", timeout: 3000 });
    await page.waitForTimeout(100);
    const routeMetrics = await page.evaluate(() => ({
      scrollY: window.scrollY,
      hubTop: document.querySelector(".puzzle-home-scene")?.getBoundingClientRect().top ?? -1
    }));
    if (routeMetrics.scrollY > 2 || routeMetrics.hubTop < 0) {
      failures.push(`[${viewportName}] Completed puzzle Menu route did not reset to a readable top position: ${JSON.stringify(routeMetrics)}`);
    }
  } catch {
    failures.push(`[${viewportName}] Completed puzzle Menu button did not return to the puzzle hub.`);
  }
}

async function expectPlayerIntroPolish(page, viewportName) {
  await expectAbsent(page, ".player-intro__note", viewportName);
  await expectAbsent(page, ".player-intro__pip-cue", viewportName);
  await expectAbsent(page, ".brand-intro__version", viewportName);
  const metrics = await page.locator(".player-intro-form").evaluate((form) => {
    const input = form.querySelector("input");
    const button = form.querySelector("button");
    return {
      width: form.getBoundingClientRect().width,
      overflows: form.scrollWidth > form.clientWidth + 1,
      inputHeight: input?.getBoundingClientRect().height || 0,
      buttonHeight: button?.getBoundingClientRect().height || 0,
      buttonBefore: button ? getComputedStyle(button, "::before").content : "",
      buttonAfter: button ? getComputedStyle(button, "::after").content : ""
    };
  });
  if (metrics.width < 250 || metrics.overflows || metrics.inputHeight < 50 || metrics.buttonHeight < 52 || metrics.buttonBefore !== "none" || metrics.buttonAfter !== "none") {
    failures.push("[" + viewportName + "] Clean player-name form regressed: " + JSON.stringify(metrics));
  }
}

async function expectSpoonRunFirstVisitGuide(page, viewportName) {
  const overlay = page.locator(".guide-overlay");
  const dialog = page.locator(".guide-dialog--spoonRunIntro");
  try {
    await dialog.waitFor({ state: "visible", timeout: 3000 });
  } catch {
    failures.push("[" + viewportName + "] Spoon Run first-visit guide did not open.");
    return;
  }

  await expectGuideDialogChromeArt(page, viewportName);
  const speaker = (await dialog.locator(".guide-dialog__name-tag").textContent() || "").trim();
  const dotCount = await dialog.locator(".guide-dialog__dots span").count();
  const firstLine = (await dialog.locator(".guide-dialog__line").textContent() || "").trim();
  if (speaker !== "Pip" || dotCount !== 2 || !/(today|daily|오늘|매일)/i.test(firstLine)) {
    failures.push("[" + viewportName + "] Spoon Run guide step 1 regressed: " + JSON.stringify({ speaker, dotCount, firstLine }));
  }

  await dialog.locator(".guide-dialog__next").click({ force: true });
  const secondLine = (await dialog.locator(".guide-dialog__line").textContent() || "").trim();
  if (!/(replay|again|다시)/i.test(secondLine) || !/3/.test(secondLine)) {
    failures.push("[" + viewportName + "] Spoon Run guide step 2 regressed: " + secondLine);
  }

  await dialog.locator(".guide-dialog__next").click({ force: true });
  await overlay.waitFor({ state: "detached", timeout: 3000 });
}
async function dismissGuideIfPresent(page, viewportName) {
  const overlay = page.locator(".guide-overlay");
  try {
    await overlay.first().waitFor({ state: "visible", timeout: 1200 });
  } catch {
    return;
  }
  await expectVisible(page, ".guide-dialog", viewportName);
  await expectVisible(page, ".guide-dialog__art img", viewportName);
  await expectGuideDialogChromeArt(page, viewportName);
  const navCount = await page.locator(".floating-nav").count();
  if (navCount > 0) {
    failures.push("[" + viewportName + "] Floating navigation should be hidden while the Pip guide overlay is open.");
  }
  for (let step = 0; step < 4 && await overlay.first().isVisible(); step += 1) {
    const practice = page.locator(".guide-practice");
    if (await practice.count()) {
      const cells = practice.locator(".guide-practice__cell");
      const stepNumber = Number(await page.locator(".guide-dialog").getAttribute("data-step"));
      const targets = stepNumber === 3 ? [0, 2, 4] : [0, 1, 2, 3, 4];
      for (const index of targets) await cells.nth(index).click({ force: true });
    }
    await page.locator(".guide-dialog__next").first().click({ force: true });
  }
  await overlay.first().waitFor({ state: "detached", timeout: 3000 });
}

async function expectGuideDialogChromeArt(page, viewportName, options = {}) {
  await page.waitForFunction(() => {
    const image = document.querySelector(".guide-dialog__art img");
    return image?.complete && image.naturalWidth > 0 && image.naturalHeight > 0;
  }, null, { timeout: 5000 });
  const metrics = await page.locator(".guide-dialog").first().evaluate((dialog, expectedNeighborClass) => {
    const overlay = document.querySelector(".guide-overlay");
    const art = dialog.querySelector(".guide-dialog__art");
    const image = art?.querySelector("img");
    const nameTag = art?.querySelector(".guide-dialog__name-tag");
    const bubble = dialog.querySelector(".guide-dialog__bubble");
    const line = dialog.querySelector(".guide-dialog__line");
    const overlayRect = overlay?.getBoundingClientRect();
    const rect = dialog.getBoundingClientRect();
    const imageRect = image?.getBoundingClientRect();
    const nameTagRect = nameTag?.getBoundingClientRect();
    const nameTagStyle = nameTag ? getComputedStyle(nameTag) : null;
    const nameTagCenterElement = nameTagRect
      ? document.elementFromPoint(nameTagRect.left + nameTagRect.width / 2, nameTagRect.top + nameTagRect.height / 2)
      : null;
    return {
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      overlayLeft: overlayRect?.left ?? Number.NaN,
      overlayTop: overlayRect?.top ?? Number.NaN,
      overlayRight: overlayRect?.right ?? Number.NaN,
      overlayBottom: overlayRect?.bottom ?? Number.NaN,
      overlayZIndex: overlay ? Number(getComputedStyle(overlay).zIndex) : Number.NaN,
      bodyOverflow: getComputedStyle(document.body).overflow,
      width: rect.width,
      height: rect.height,
      imageWidth: imageRect?.width || 0,
      imageHeight: imageRect?.height || 0,
      imageContained: Boolean(imageRect)
        && imageRect.left >= 0
        && imageRect.right <= window.innerWidth
        && imageRect.top >= 0
        && imageRect.bottom <= window.innerHeight,
      artOverflow: art ? getComputedStyle(art).overflow : "",
      hasNameTag: Boolean(nameTag),
      nameTagText: (nameTag?.textContent || "").trim(),
      nameTagWidth: nameTagRect?.width || 0,
      nameTagHeight: nameTagRect?.height || 0,
      nameTagVisible: Boolean(nameTagStyle)
        && nameTagStyle.display !== "none"
        && nameTagStyle.visibility !== "hidden"
        && Number(nameTagStyle.opacity) > 0
        && Boolean(nameTagRect)
        && nameTagRect.left >= 0
        && nameTagRect.right <= window.innerWidth
        && nameTagRect.top >= 0
        && nameTagRect.bottom <= window.innerHeight,
      nameTagOnTop: Boolean(nameTag) && (nameTagCenterElement === nameTag || nameTag.contains(nameTagCenterElement)),
      expectsNameTag: dialog.matches(".guide-dialog--puzzle, .guide-dialog--map, .guide-dialog--timeAttack, .guide-dialog--spoonRunIntro"),
      bodyText: (line?.textContent || "").trim(),
      buttonCount: dialog.querySelectorAll(".guide-dialog__actions button").length,
      hasLegacyLabels: Boolean(dialog.querySelector(".guide-dialog__eyebrow, .guide-dialog__speaker")),
      artBefore: art ? getComputedStyle(art, "::before").content : "",
      artAfter: art ? getComputedStyle(art, "::after").content : "",
      bubbleBefore: bubble ? getComputedStyle(bubble, "::before").content : "",
      bubbleAfter: bubble ? getComputedStyle(bubble, "::after").content : "",
      overflows: dialog.scrollWidth > dialog.clientWidth + 1 || dialog.scrollHeight > dialog.clientHeight + 1,
      overlayFixed: overlay ? getComputedStyle(overlay).position === "fixed" : false,
      neighborMatched: !expectedNeighborClass || art?.classList.contains(`guide-dialog__art--${expectedNeighborClass}`)
    };
  });
  const isContained = metrics.width >= Math.min(320, metrics.viewportWidth - 44) && metrics.width <= metrics.viewportWidth && metrics.height <= metrics.viewportHeight;
  const overlayCoversViewport = Math.abs(metrics.overlayLeft) <= 1
    && Math.abs(metrics.overlayTop) <= 1
    && Math.abs(metrics.overlayRight - metrics.viewportWidth) <= 1
    && Math.abs(metrics.overlayBottom - metrics.viewportHeight) <= 1;
  const minImageWidth = options.neighborClass ? 100 : 150;
  const nameTagRegressed = metrics.expectsNameTag
    && (!metrics.hasNameTag || metrics.nameTagText.length < 2 || metrics.nameTagWidth < 30 || metrics.nameTagHeight < 18 || !metrics.nameTagVisible || !metrics.nameTagOnTop || metrics.artOverflow !== "visible");
  if (!metrics.overlayFixed || !overlayCoversViewport || metrics.overlayZIndex <= 140 || metrics.bodyOverflow !== "hidden" || !isContained || !metrics.imageContained || metrics.imageWidth < minImageWidth || metrics.imageHeight < 150 || metrics.bodyText.length < 12 || metrics.buttonCount !== 1 || metrics.hasLegacyLabels || metrics.artBefore !== "none" || metrics.artAfter !== "none" || metrics.bubbleBefore !== "none" || metrics.bubbleAfter !== "none" || metrics.overflows || !metrics.neighborMatched || nameTagRegressed) {
    const guideLabel = options.neighborClass ? `${options.neighborClass} neighbor conversation` : "Clean Pip conversation";
    failures.push("[" + viewportName + "] " + guideLabel + " regressed: " + JSON.stringify(metrics));
  }
}

async function expectAbsent(page, selector, viewportName) {
  const count = await page.locator(selector).count();
  if (count > 0) {
    failures.push(`[${viewportName}] Unexpected ${selector}`);
  }
}

async function expectVisible(page, selector, viewportName) {
  const count = await page.locator(selector).count();
  if (count === 0) {
    failures.push(`[${viewportName}] Missing ${selector}`);
    return;
  }

  if (/\bimg$/.test(selector)) {
    try {
      await page.waitForFunction((target) => {
        const image = document.querySelector(target);
        if (!(image instanceof HTMLImageElement) || !image.complete || image.naturalWidth < 1 || image.naturalHeight < 1) return false;
        const rect = image.getBoundingClientRect();
        return rect.width >= 1 && rect.height >= 1;
      }, selector, { timeout: 3000 });
    } catch {
      // Keep the existing visible-size assertion below as the failure report.
    }
  }

  const box = await page.locator(selector).first().boundingBox();
  if (!box || box.width < 1 || box.height < 1) {
    failures.push(`[${viewportName}] ${selector} is not visibly sized`);
  }
}

async function expectOpeningIntroPolish(page, viewportName) {
  const metrics = await page.locator(".brand-intro__content").first().evaluate((content) => {
    const button = content.querySelector(".brand-intro__skip");
    const visual = content.querySelector(".brand-intro__key-visual img");
    const grain = document.querySelector(".brand-intro__grain");
    const buttonRect = button?.getBoundingClientRect();
    const visualRect = visual?.getBoundingClientRect();
    const before = button ? getComputedStyle(button, "::before") : null;
    const after = button ? getComputedStyle(button, "::after") : null;
    return {
      contentOverflow: content.scrollWidth > content.clientWidth + 1 || content.scrollHeight > content.clientHeight + 1,
      buttonWidth: buttonRect?.width || 0,
      buttonHeight: buttonRect?.height || 0,
      buttonBottom: buttonRect?.bottom || 0,
      visualWidth: visualRect?.width || 0,
      visualHeight: visualRect?.height || 0,
      beforeContent: before?.content || "",
      afterContent: after?.content || "",
      grainPointerEvents: grain ? getComputedStyle(grain).pointerEvents : "",
      viewportHeight: window.innerHeight
    };
  });
  if (metrics.contentOverflow || metrics.buttonWidth < 150 || metrics.buttonHeight < 52 || metrics.buttonBottom > metrics.viewportHeight || metrics.visualWidth < 190 || metrics.visualHeight < 240 || metrics.beforeContent !== "none" || metrics.afterContent !== "none" || metrics.grainPointerEvents !== "none") {
    failures.push("[" + viewportName + "] Clean opening layout regressed: " + JSON.stringify(metrics));
  }
}

async function expectSettingsDialogPolish(page, viewportName) {
  await openSettings(page);
  await expectVisible(page, ".settings-dialog", viewportName);
  await expectAbsent(page, ".settings-dialog .support-pack-card", viewportName);
  const metrics = await page.locator(".settings-dialog").evaluate((dialog) => ({
    overflowsX: dialog.scrollWidth > dialog.clientWidth + 1,
    width: dialog.getBoundingClientRect().width,
    viewportWidth: window.innerWidth,
    controlCount: dialog.querySelectorAll("button, input").length,
    purchaseCopy: /pip_cozy_support|pip_spoon_jar_small|Play Store|Google Play/.test(dialog.textContent || ""),
    languageChoices: [...dialog.querySelectorAll(".settings-choice--language")].map((button) => {
      const style = getComputedStyle(button);
      const marker = getComputedStyle(button, "::after");
      const paddingLeft = parseFloat(style.paddingLeft) || 0;
      const markerLeft = parseFloat(marker.left) || 0;
      const markerWidth = (parseFloat(marker.width) || 0)
        + (parseFloat(marker.borderLeftWidth) || 0)
        + (parseFloat(marker.borderRightWidth) || 0);
      return {
        overflow: button.scrollWidth > button.clientWidth + 1,
        whiteSpace: style.whiteSpace || "",
        paddingLeft,
        markerContent: marker.content || "none",
        markerDisplay: marker.display || "none",
        textMarkerGap: paddingLeft - markerLeft - markerWidth
      };
    })
  }));
  if (
    metrics.overflowsX ||
    metrics.width < 280 ||
    metrics.controlCount < 7 ||
    metrics.purchaseCopy ||
    metrics.languageChoices.length !== 3 ||
    (metrics.viewportWidth <= 430 && metrics.languageChoices.some((choice) => choice.overflow || choice.whiteSpace !== "nowrap" || choice.paddingLeft < 34 || choice.markerContent === "none" || choice.markerDisplay === "none" || choice.textMarkerGap < 4))
  ) {
    failures.push("[" + viewportName + "] Settings should contain preferences only: " + JSON.stringify(metrics));
  }
  await page.locator(".settings-close").click();
}

async function expectFloatingNavPolish(page, viewportName) {
  await expectAbsent(page, ".top-bar", viewportName);
  const trigger = page.locator(".floating-nav__trigger").first();
  if ((await trigger.count()) === 0) {
    return;
  }
  await trigger.click();
  await page.locator(".floating-nav[data-open='true'] .floating-nav__menu").waitFor({ state: "visible", timeout: 3000 });
  await page.waitForFunction(() => {
    const images = [...document.querySelectorAll(".floating-nav[data-open='true'] img")];
    return images.length >= 6 && images.every((image) => image.complete && image.naturalWidth === 256 && image.naturalHeight === 256);
  }, null, { timeout: 5000 });
  const navMetrics = await page.evaluate(() => {
    const nav = document.querySelector(".floating-nav");
    const menu = document.querySelector(".floating-nav__menu");
    const triggerButton = document.querySelector(".floating-nav__trigger");
    const triggerIcon = triggerButton?.querySelector(".floating-nav__trigger-icon");
    const triggerText = triggerButton?.querySelector(".floating-nav__trigger-text");
    const activeItem = document.querySelector(".floating-nav__item.active");
    const labels = [...document.querySelectorAll(".floating-nav__label")].map((label) => label.textContent || "");
    const icons = [...document.querySelectorAll(".floating-nav__item")].map((item) => {
      const icon = item.querySelector(".floating-nav__icon");
      const label = item.querySelector(".floating-nav__label");
      const image = icon?.querySelector("img");
      const iconStyle = icon ? getComputedStyle(icon) : null;
      const labelStyle = label ? getComputedStyle(label) : null;
      const itemStyle = getComputedStyle(item);
      const before = icon ? getComputedStyle(icon, "::before") : null;
      const after = icon ? getComputedStyle(icon, "::after") : null;
      const labelLineHeight = parseFloat(labelStyle?.lineHeight) || 0;
      return {
        view: item.dataset.view || "",
        labelText: (label?.textContent || "").trim(),
        ariaLabel: item.getAttribute("aria-label") || "",
        title: item.getAttribute("title") || "",
        itemHeight: item.getBoundingClientRect().height,
        itemLeft: item.getBoundingClientRect().left,
        itemWidth: item.getBoundingClientRect().width,
        columns: itemStyle.gridTemplateColumns || "",
        width: parseFloat(iconStyle?.width) || 0,
        height: parseFloat(iconStyle?.height) || 0,
        radius: parseFloat(iconStyle?.borderRadius) || 0,
        background: iconStyle?.backgroundImage || "",
        imageSrc: image?.getAttribute("src") || "",
        assetId: image?.dataset.assetId || "",
        imageNaturalWidth: image?.naturalWidth || 0,
        imageNaturalHeight: image?.naturalHeight || 0,
        beforeContent: before?.content || "",
        beforeBackground: before?.backgroundImage || before?.backgroundColor || "",
        afterContent: after?.content || "",
        afterBackground: after?.backgroundImage || after?.backgroundColor || "",
        gridRow: iconStyle?.gridRow || "",
        labelWhiteSpace: labelStyle?.whiteSpace || "",
        labelTextOverflow: labelStyle?.textOverflow || "",
        labelOverflowX: labelStyle?.overflowX || "",
        labelLineCount: labelLineHeight ? label.getBoundingClientRect().height / labelLineHeight : 1,
        labelOverflow: label ? Math.max(0, label.scrollWidth - label.clientWidth) : 999
      };
    });
    const rect = menu?.getBoundingClientRect();
    const navRect = nav?.getBoundingClientRect();
    const style = menu ? getComputedStyle(menu) : null;
    const navStyle = nav ? getComputedStyle(nav) : null;
    const triggerIconStyle = triggerIcon ? getComputedStyle(triggerIcon) : null;
    const triggerIconBefore = triggerIcon ? getComputedStyle(triggerIcon, "::before") : null;
    const triggerIconAfter = triggerIcon ? getComputedStyle(triggerIcon, "::after") : null;
    const triggerImage = triggerIcon?.querySelector("img");
    const triggerTextStyle = triggerText ? getComputedStyle(triggerText) : null;
    const triggerCurrent = triggerButton?.querySelector("strong");
    return {
      open: nav?.dataset.open || "",
      left: rect?.left || 0,
      right: rect?.right || 0,
      width: rect?.width || 0,
      viewportWidth: window.innerWidth,
      navPosition: navStyle?.position || "",
      navRightGap: navRect ? Math.round(window.innerWidth - navRect.right) : -999,
      navBottomGap: navRect ? Math.round(window.innerHeight - navRect.bottom) : -999,
      navTop: navRect ? Math.round(navRect.top) : -999,
      menuBottomGap: rect ? Math.round(window.innerHeight - rect.bottom) : -999,
      menuColumns: style?.gridTemplateColumns || "",
      menuCenter: rect ? rect.left + rect.width / 2 : 0,
      borderRadius: style ? parseFloat(style.borderRadius) : 0,
      backgroundImage: style?.backgroundImage || "",
      backgroundColor: style?.backgroundColor || "",
      triggerIcon: {
        view: triggerIcon?.dataset.view || "",
        width: parseFloat(triggerIconStyle?.width) || 0,
        height: parseFloat(triggerIconStyle?.height) || 0,
        radius: parseFloat(triggerIconStyle?.borderRadius) || 0,
        background: triggerIconStyle?.backgroundImage || "",
        imageSrc: triggerImage?.getAttribute("src") || "",
        assetId: triggerImage?.dataset.assetId || "",
        imageNaturalWidth: triggerImage?.naturalWidth || 0,
        imageNaturalHeight: triggerImage?.naturalHeight || 0,
        beforeContent: triggerIconBefore?.content || "",
        afterContent: triggerIconAfter?.content || ""
      },
      triggerHeight: triggerButton?.getBoundingClientRect().height || 0,
      triggerTextWidth: triggerText?.getBoundingClientRect().width || 0,
      triggerTextClipPath: triggerTextStyle?.clipPath || "",
      triggerCurrentText: (triggerCurrent?.textContent || "").trim(),
      triggerCurrentOverflow: triggerCurrent ? Math.max(0, triggerCurrent.scrollWidth - triggerCurrent.clientWidth) : 999,
      activeLabel: (activeItem?.querySelector(".floating-nav__label")?.textContent || "").trim(),
      labels,
      icons
    };
  });
  const hasExplicitTimeAttackEntry = navMetrics.labels.some((label) => /Time Attack|\uD0C0\uC784\uC5B4\uD0DD/.test(label));
  const expectedIconViews = ["puzzle", "album", "pantry", "timeAttack", "map"];
  const hasAllViewIcons = expectedIconViews.every((view) => navMetrics.icons.some((icon) => icon.view === view));
  const lastNavItem = navMetrics.icons.at(-1);
  const oddItemIsCentered = !lastNavItem || Math.abs((lastNavItem.itemLeft + lastNavItem.itemWidth / 2) - navMetrics.menuCenter) <= 2;
  if (
    navMetrics.open !== "true" ||
    navMetrics.navPosition !== "fixed" ||
    navMetrics.navRightGap < 0 ||
    navMetrics.navRightGap > 24 ||
    navMetrics.navBottomGap < 20 ||
    navMetrics.navBottomGap > 120 ||
    navMetrics.navTop < 0 ||
    navMetrics.menuBottomGap < 0 ||
    navMetrics.left < -1 ||
    navMetrics.right > navMetrics.viewportWidth + 1 ||
    navMetrics.borderRadius < 18 ||
    navMetrics.backgroundColor === "rgba(0, 0, 0, 0)" ||
    navMetrics.triggerHeight < 68 ||
    navMetrics.triggerIcon.width < 34 ||
    navMetrics.triggerIcon.height < 34 ||
    !navMetrics.triggerIcon.imageSrc.includes("quick-travel-") ||
    navMetrics.triggerIcon.assetId !== `quick-travel-${navMetrics.triggerIcon.view === "timeAttack" ? "time-attack" : navMetrics.triggerIcon.view}-v1` ||
    navMetrics.triggerIcon.imageNaturalWidth !== 256 ||
    navMetrics.triggerIcon.imageNaturalHeight !== 256 ||
    navMetrics.triggerIcon.beforeContent !== "none" ||
    navMetrics.triggerIcon.afterContent !== "none" ||
    navMetrics.triggerTextWidth > 2 ||
    !navMetrics.triggerTextClipPath.includes("inset") ||
    !navMetrics.triggerCurrentText ||
    !navMetrics.activeLabel ||
    !hasExplicitTimeAttackEntry ||
    !hasAllViewIcons ||
    !oddItemIsCentered ||
    navMetrics.icons.length < 5 ||
    navMetrics.icons.some((icon) =>
      icon.itemHeight < 48 ||
      icon.width < 34 ||
      icon.height < 34 ||
      !icon.imageSrc.includes("quick-travel-") ||
      icon.assetId !== (icon.view === "timeAttack" ? "quick-travel-time-attack-clock-v1" : `quick-travel-${icon.view}-v1`) ||
      icon.imageNaturalWidth !== 256 ||
      icon.imageNaturalHeight !== 256 ||
      icon.beforeContent !== "none" ||
      icon.afterContent !== "none" ||
      icon.labelWhiteSpace === "nowrap" ||
      icon.labelTextOverflow === "ellipsis" ||
      icon.labelOverflowX === "hidden" ||
      icon.labelLineCount > 2.4 ||
      icon.labelOverflow > 1
    )
  ) {
    failures.push("[" + viewportName + "] Floating nav panel polish/layout regression: " + JSON.stringify(navMetrics));
  }
  await trigger.click();
}

async function expectPlayScreenNavClearance(page, viewportName) {
  const metrics = await page.evaluate(() => {
    const shell = document.querySelector(".app-shell--play");
    const screen = document.querySelector(".play-screen");
    const header = document.querySelector(".play-screen__header");
    const shellRect = shell?.getBoundingClientRect();
    const screenRect = screen?.getBoundingClientRect();
    const headerRect = header?.getBoundingClientRect();
    const headerStyle = header ? getComputedStyle(header) : null;
    return {
      hasPlayShell: Boolean(shell),
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      navCount: document.querySelectorAll(".floating-nav").length,
      shellWidth: shellRect?.width || 0,
      shellMinHeight: parseFloat(shell ? getComputedStyle(shell).minHeight : "0") || 0,
      screenWidth: screenRect?.width || 0,
      screenHeight: screenRect?.height || 0,
      headerWidth: headerRect?.width || 0,
      headerPosition: headerStyle?.position || "",
      headerTop: headerRect?.top || 0,
      headerBackground: headerStyle?.backgroundImage || "",
      headerRadius: parseFloat(headerStyle?.borderBottomLeftRadius) || 0,
      flatStarter: screen?.dataset.puzzleSize === "5" && window.innerWidth <= 520
    };
  });
  if (
    !metrics.hasPlayShell ||
    metrics.navCount !== 0 ||
    (metrics.viewportWidth <= 520 && (
      metrics.shellWidth < metrics.viewportWidth ||
      metrics.screenWidth < metrics.viewportWidth ||
      metrics.screenHeight < metrics.viewportHeight ||
      metrics.headerWidth < metrics.viewportWidth ||
      metrics.headerPosition !== "static" ||
      Math.abs(metrics.headerTop) > 1 ||
      (metrics.flatStarter
        ? metrics.headerBackground !== "none" || metrics.headerRadius !== 0
        : !metrics.headerBackground.includes("gradient") || metrics.headerRadius < 18)
    ))
  ) {
    failures.push("[" + viewportName + "] Puzzle play should own a dedicated full-width screen without floating quick travel: " + JSON.stringify(metrics));
  }
}

async function expectStageNavigationPolish(page, viewportName) {
  await expectVisible(page, ".stage-navigation", viewportName);
  const metrics = await page.locator(".stage-navigation").first().evaluate((nav) => {
    const rect = nav.getBoundingClientRect();
    const style = getComputedStyle(nav);
    const shine = getComputedStyle(nav, "::before");
    const copy = nav.querySelector(".stage-navigation__copy");
    const copyRect = copy?.getBoundingClientRect();
    const actions = nav.querySelector(".stage-navigation__actions");
    const actionsRect = actions?.getBoundingClientRect();
    const buttons = [...nav.querySelectorAll(".stage-nav-button")].map((button) => {
      const buttonRect = button.getBoundingClientRect();
      const buttonStyle = getComputedStyle(button);
      const icon = getComputedStyle(button, "::after");
      const glint = getComputedStyle(button, "::before");
      return {
        text: (button.textContent || "").trim(),
        className: button.className,
        disabled: button.disabled,
        width: buttonRect.width,
        height: buttonRect.height,
        left: buttonRect.left,
        top: buttonRect.top,
        right: buttonRect.right,
        borderWidth: parseFloat(buttonStyle.borderTopWidth),
        radius: parseFloat(buttonStyle.borderRadius),
        background: buttonStyle.backgroundImage,
        boxShadow: buttonStyle.boxShadow,
        overflow: buttonStyle.overflow,
        iconContent: icon.content,
        iconWidth: parseFloat(icon.width),
        iconBackground: icon.backgroundImage,
        glintContent: glint.content,
        glintHeight: parseFloat(glint.height)
      };
    });

    return {
      left: rect.left,
      right: rect.right,
      width: rect.width,
      viewportWidth: window.innerWidth,
      borderWidth: parseFloat(style.borderTopWidth),
      radius: parseFloat(style.borderRadius),
      background: style.backgroundImage,
      boxShadow: style.boxShadow,
      overflow: style.overflow,
      shineContent: shine.content,
      shineHeight: parseFloat(shine.height),
      copyWidth: copyRect?.width || 0,
      actionsWidth: actionsRect?.width || 0,
      flatStarter: nav.closest(".play-screen")?.dataset.puzzleSize === "5" && window.innerWidth <= 520,
      buttons
    };
  });

  const buttonVariants = ["previous", "next"];
  const buttonTops = metrics.buttons.map((button) => button.top);
  const maxButtonTopDrift = buttonTops.length > 1 ? Math.max(...buttonTops) - Math.min(...buttonTops) : 0;
  const flatStarterFrameInvalid = metrics.flatStarter && (
    metrics.borderWidth < 1 ||
    metrics.radius < 12 ||
    metrics.background !== "none" ||
    metrics.boxShadow !== "none" ||
    metrics.shineContent !== "none" ||
    metrics.buttons.some((button) =>
      button.height < 42 ||
      button.width < 70 ||
      button.left < -1 ||
      button.right > metrics.viewportWidth + 1 ||
      button.background !== "none" ||
      button.boxShadow !== "none" ||
      button.iconContent !== "none" ||
      button.glintContent !== "none"
    )
  );
  const tactileFrameInvalid = !metrics.flatStarter && (
    metrics.borderWidth < 3 ||
    metrics.radius < 16 ||
    !metrics.background.includes("gradient") ||
    metrics.boxShadow === "none" ||
    metrics.shineContent === "none" ||
    metrics.shineHeight < 10 ||
    metrics.buttons.some((button, index) =>
      button.height < 42 ||
      button.width < 70 ||
      button.left < -1 ||
      button.right > metrics.viewportWidth + 1 ||
      button.borderWidth < 3 ||
      button.radius < 14 ||
      !button.background.includes("gradient") ||
      button.boxShadow === "none" ||
      button.overflow !== "hidden" ||
      button.iconContent === "none" ||
      button.iconWidth < 12 ||
      !button.iconBackground.includes("gradient") ||
      button.glintContent === "none" ||
      button.glintHeight < 8 ||
      !button.className.includes(buttonVariants[index])
    )
  );
  if (
    metrics.left < -1 ||
    metrics.right > metrics.viewportWidth + 1 ||
    metrics.overflow !== "hidden" ||
    metrics.copyWidth < 120 ||
    metrics.actionsWidth < 180 ||
    metrics.buttons.length !== 2 ||
    maxButtonTopDrift > 8 ||
    flatStarterFrameInvalid ||
    tactileFrameInvalid
  ) {
    failures.push("[" + viewportName + "] Stage navigation lost tactile button polish: " + JSON.stringify(metrics));
  }
}

async function expectStarterBoardAlignment(page, viewportName) {
  const boardMetrics = await page.locator(".board-wrap").first().evaluate((board) => {
    const cells = [...board.querySelectorAll(".puzzle-cell")];
    const columnClues = [...board.querySelectorAll(".column-clue")];
    const rowClues = [...board.querySelectorAll(".row-clue")];
    const centerOf = (rect, axis) => axis === "x"
      ? rect.left + rect.width / 2
      : rect.top + rect.height / 2;
    const columnDeltas = columnClues.map((clue, columnIndex) => {
      const clueRect = clue.getBoundingClientRect();
      const cellRect = cells[columnIndex]?.getBoundingClientRect();
      return cellRect ? centerOf(clueRect, "x") - centerOf(cellRect, "x") : 999;
    });
    const rowDeltas = rowClues.map((clue, rowIndex) => {
      const clueRect = clue.getBoundingClientRect();
      const cellRect = cells[rowIndex * columnClues.length]?.getBoundingClientRect();
      return cellRect ? centerOf(clueRect, "y") - centerOf(cellRect, "y") : 999;
    });
    return {
      boardSize: getComputedStyle(board).getPropertyValue("--board-size").trim(),
      columnDeltas,
      rowDeltas,
      maxColumnDelta: columnDeltas.reduce((max, delta) => Math.max(max, Math.abs(delta)), 0),
      maxRowDelta: rowDeltas.reduce((max, delta) => Math.max(max, Math.abs(delta)), 0)
    };
  });

  if (
    boardMetrics.boardSize !== "5" ||
    boardMetrics.maxColumnDelta > 1 ||
    boardMetrics.maxRowDelta > 1
  ) {
    failures.push("[" + viewportName + "] Starter 5x5 clues should align with puzzle cells: " + JSON.stringify(boardMetrics));
  }
}

async function expectResetDialogPolish(page, viewportName) {
  const headerResetCount = await page.locator('.top-bar button[aria-label="Reset progress"], .top-bar button[aria-label="\uC9C4\uD589 \uC0C1\uD0DC \uCD08\uAE30\uD654"]').count();
  if (headerResetCount !== 0) {
    failures.push("[" + viewportName + "] Reset must stay inside Settings, not the always-visible header.");
  }
  await openSettings(page);
  await expectVisible(page, ".settings-dialog", viewportName);
  await page.locator(".settings-reset").click();
  await expectVisible(page, ".modal-backdrop", viewportName);
  await expectVisible(page, ".reset-dialog", viewportName);
  const metrics = await page.locator(".reset-dialog").first().evaluate((dialog) => {
    const backdrop = dialog.closest(".modal-backdrop");
    const backdropStyle = backdrop ? getComputedStyle(backdrop) : null;
    const backdropRect = backdrop?.getBoundingClientRect();
    const rect = dialog.getBoundingClientRect();
    const style = getComputedStyle(dialog);
    const shine = getComputedStyle(dialog, "::before");
    const title = dialog.querySelector("h2");
    const titleBadge = title ? getComputedStyle(title, "::before") : null;
    const body = dialog.querySelector("p");
    const cancel = dialog.querySelector(".dialog-actions .tool-button:not(.danger)");
    const confirm = dialog.querySelector(".dialog-actions .tool-button.danger");
    const bodyRect = body?.getBoundingClientRect();
    const cancelRect = cancel?.getBoundingClientRect();
    const confirmRect = confirm?.getBoundingClientRect();
    const bodyStyle = body ? getComputedStyle(body) : null;
    const cancelStyle = cancel ? getComputedStyle(cancel) : null;
    const confirmStyle = confirm ? getComputedStyle(confirm) : null;
    return {
      backdropWidth: backdropRect?.width || 0,
      backdropHeight: backdropRect?.height || 0,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      backdropDisplay: backdropStyle?.display || "",
      backdropPaddingBottom: backdropStyle ? parseFloat(backdropStyle.paddingBottom) : 0,
      backdropBackground: backdropStyle?.backgroundColor || "",
      width: rect.width,
      height: rect.height,
      left: rect.left,
      right: rect.right,
      radius: parseFloat(style.borderRadius),
      borderWidth: parseFloat(style.borderTopWidth),
      background: style.backgroundImage,
      shadow: style.boxShadow,
      overflow: style.overflow,
      shineContent: shine.content,
      shineHeight: parseFloat(shine.height),
      shineBackground: shine.backgroundImage,
      titleText: title?.textContent?.trim() || "",
      titleBadgeWidth: parseFloat(titleBadge?.width) || 0,
      titleBadgeBackground: titleBadge?.backgroundImage || "",
      bodyText: body?.textContent?.trim() || "",
      bodyHeight: bodyRect?.height || 0,
      bodyRadius: bodyStyle ? parseFloat(bodyStyle.borderRadius) : 0,
      bodyBackground: bodyStyle?.backgroundImage || "",
      cancelText: cancel?.textContent?.trim() || "",
      cancelHeight: cancelRect?.height || 0,
      cancelWidth: cancelRect?.width || 0,
      cancelRadius: cancelStyle ? parseFloat(cancelStyle.borderRadius) : 0,
      cancelBackground: cancelStyle?.backgroundImage || "",
      confirmText: confirm?.textContent?.trim() || "",
      confirmHeight: confirmRect?.height || 0,
      confirmWidth: confirmRect?.width || 0,
      confirmRadius: confirmStyle ? parseFloat(confirmStyle.borderRadius) : 0,
      confirmBackground: confirmStyle?.backgroundImage || "",
      overflows: dialog.scrollWidth > Math.ceil(rect.width) + 1 || dialog.scrollHeight > Math.ceil(rect.height) + 1
    };
  });
  if (
    metrics.backdropWidth < metrics.viewportWidth ||
    metrics.backdropHeight < metrics.viewportHeight ||
    metrics.backdropDisplay !== "grid" ||
    metrics.backdropPaddingBottom < 18 ||
    !metrics.backdropBackground.includes("rgba") ||
    metrics.width < 280 ||
    metrics.left < -1 ||
    metrics.right > metrics.viewportWidth + 1 ||
    metrics.radius < 16 ||
    metrics.borderWidth < 3 ||
    !metrics.background.includes("gradient") ||
    metrics.shadow === "none" ||
    metrics.overflow !== "hidden" ||
    metrics.shineContent === "none" ||
    metrics.shineHeight < 10 ||
    !metrics.shineBackground.includes("gradient") ||
    !/Reset|progress|\uCD08\uAE30\uD654|\uC9C4\uD589/.test(metrics.titleText) ||
    metrics.titleBadgeWidth < 20 ||
    !metrics.titleBadgeBackground.includes("gradient") ||
    !/saved|picture|device|\uC800\uC7A5|\uC9C4\uD589|\uC9C0\uC6CC/.test(metrics.bodyText) ||
    metrics.bodyHeight < 42 ||
    metrics.bodyRadius < 12 ||
    !metrics.bodyBackground.includes("gradient") ||
    !/Cancel|Keep playing|\uCDE8\uC18C|\uACC4\uC18D/.test(metrics.cancelText) ||
    metrics.cancelWidth < 110 ||
    metrics.cancelHeight < 46 ||
    metrics.cancelRadius < 14 ||
    !metrics.cancelBackground.includes("gradient") ||
    !/Reset|\uCD08\uAE30\uD654/.test(metrics.confirmText) ||
    metrics.confirmWidth < 110 ||
    metrics.confirmHeight < 46 ||
    metrics.confirmRadius < 14 ||
    !metrics.confirmBackground.includes("gradient") ||
    metrics.overflows
  ) {
    failures.push("[" + viewportName + "] Reset dialog lost polished confirmation treatment: " + JSON.stringify(metrics));
  }
  await page.locator(".reset-dialog .dialog-actions .tool-button:not(.danger)").click();
  await page.locator(".reset-dialog").waitFor({ state: "detached", timeout: 2000 });
  await page.locator(".modal-backdrop").waitFor({ state: "detached", timeout: 2000 });
  await expectVisible(page, ".app-shell", viewportName);
}




async function expectAlbumPolish(page, viewportName) {
  const metrics = await page.evaluate(() => {
    const album = document.querySelector(".album-panel");
    const albumCard = document.querySelector(".album-card");
    const albumStamp = document.querySelector(".album-stamp");
    const albumStateCount = document.querySelectorAll(".album-card__state, .album-card.locked").length;
    const repeatedCopyCount = document.querySelectorAll(".album-card > div > p").length;

    const readBox = (el) => {
      const rect = el?.getBoundingClientRect();
      const style = el ? getComputedStyle(el) : null;
      return {
        left: rect?.left || 0,
        right: rect?.right || 0,
        width: rect?.width || 0,
        height: rect?.height || 0,
        radius: style ? parseFloat(style.borderRadius) : 0,
        background: style?.backgroundImage || ""
      };
    };
    return {
      viewportWidth: window.innerWidth,
      album: readBox(album),
      albumCard: readBox(albumCard),
      albumStamp: readBox(albumStamp),
      albumStateCount,
      repeatedCopyCount,

    };
  });
  const boxes = [metrics.album, metrics.albumCard, metrics.albumStamp];
  const outside = boxes.some((box) => box.left < -1 || box.right > metrics.viewportWidth + 1);
  if (
    outside ||
    metrics.album.radius < 14 ||
    metrics.albumCard.radius < 12 ||
    metrics.albumStamp.height < 64 ||
    metrics.albumStamp.width > 322 ||
    metrics.albumStateCount !== 0 ||
    metrics.repeatedCopyCount !== 0 ||
    !metrics.album.background.includes("linear-gradient") ||
    !metrics.albumCard.background.includes("linear-gradient")
  ) {
    failures.push("[" + viewportName + "] Album polish regression: " + JSON.stringify(metrics));
  }
}

async function verifyEmptyAlbumPlayNowFlow(page, viewportName) {
  await openFloatingView(page, "album", viewportName);
  await expectVisible(page, ".album-empty", viewportName);
  const emptyAction = page.locator(".album-empty button");
  if ((await emptyAction.count()) !== 1) {
    failures.push("[" + viewportName + "] Empty Album should expose exactly one Play Now action.");
    return;
  }
  await emptyAction.click();
  await expectVisible(page, ".play-screen", viewportName);
  await dismissGuideIfPresent(page, viewportName);
  await expectVisible(page, ".board-wrap", viewportName);
  await expectTouchPaintSurvivesSyntheticClick(page, viewportName);
  if ((await page.locator(".album-panel").count()) !== 0) {
    failures.push("[" + viewportName + "] Empty Album Play Now action left the Album mounted instead of opening a puzzle.");
  }
  await page.locator(".play-screen__back").click();
  await expectVisible(page, ".puzzle-home-scene", viewportName);
}

async function expectTouchPaintSurvivesSyntheticClick(page, viewportName) {
  const target = page.locator(".puzzle-grid .puzzle-cell").first();
  const box = await target.boundingBox();
  if (!box) {
    failures.push("[" + viewportName + "] Touch paint regression fixture could not locate its target cell.");
    return;
  }
  await target.dispatchEvent("pointerdown", {
    pointerId: 91,
    pointerType: "touch",
    isPrimary: true,
    button: 0,
    buttons: 1,
    clientX: box.x + box.width / 2,
    clientY: box.y + box.height / 2
  });
  await page.evaluate(() => {
    const event = typeof PointerEvent === "function"
      ? new PointerEvent("pointerup", { pointerId: 91, pointerType: "touch", isPrimary: true, bubbles: true })
      : new MouseEvent("pointerup", { bubbles: true });
    window.dispatchEvent(event);
  });
  await page.waitForTimeout(50);
  const afterPointerUp = await page.locator(".puzzle-grid .puzzle-cell").first().getAttribute("class");
  await page.locator(".puzzle-grid .puzzle-cell").first().dispatchEvent("click", { detail: 0 });
  await page.waitForTimeout(20);
  const afterSyntheticClick = await page.locator(".puzzle-grid .puzzle-cell").first().getAttribute("class");
  if (!afterPointerUp?.includes("filled") || !afterSyntheticClick?.includes("filled")) {
    failures.push("[" + viewportName + "] Android touch paint was toggled again by the delayed synthetic click: " + JSON.stringify({ afterPointerUp, afterSyntheticClick }));
  }
}

async function expectMapFirstRunGuide(page, viewportName) {
  const dialog = page.locator(".guide-dialog--map");
  if ((await dialog.count()) === 0) {
    failures.push("[" + viewportName + "] Unseen Badge/Map guide did not open after entering the map view.");
    return;
  }
  await expectGuideDialogChromeArt(page, viewportName);
  const speakerName = (await dialog.locator(".guide-dialog__name-tag").innerText()).trim();
  const dotCount = await dialog.locator(".guide-dialog__dots span").count();
  const guideSteps = [];
  for (let expectedStep = 1; expectedStep <= 3; expectedStep += 1) {
    const actualStep = Number(await dialog.getAttribute("data-step"));
    const line = (await dialog.locator(".guide-dialog__line").innerText()).trim();
    guideSteps.push({ actualStep, line });
    if (expectedStep < 3) await dialog.locator(".guide-dialog__next").click();
  }
  if (speakerName !== "Pip" || dotCount !== 3 || guideSteps.some((step, index) => step.actualStep !== index + 1 || !step.line) || !/badge|\uBC30\uC9C0/i.test(guideSteps[0].line)) {
    failures.push("[" + viewportName + "] Badge/Map first-run guide sequence regressed: " + JSON.stringify({ speakerName, dotCount, guideSteps }));
  }
  await dialog.locator(".guide-dialog__next").click();
  await page.locator(".guide-overlay--map").waitFor({ state: "detached", timeout: 3000 });
}

async function expectMapPolish(page, viewportName) {
  const metrics = await page.evaluate(() => {
    const map = document.querySelector(".map-panel");
    const shelves = [...document.querySelectorAll(".badge-shelf")];
    const slots = [...document.querySelectorAll(".badge-slot")];
    const circles = [...document.querySelectorAll(".badge-circle")];
    const mapRect = map?.getBoundingClientRect();
    const mapStyle = map ? getComputedStyle(map) : null;
    const boardStyle = shelves[0]?.querySelector(".badge-shelf__board")
      ? getComputedStyle(shelves[0].querySelector(".badge-shelf__board"))
      : null;
    return {
      viewportWidth: window.innerWidth,
      mapLeft: mapRect?.left || 0,
      mapRight: mapRect?.right || 0,
      mapRadius: mapStyle ? parseFloat(mapStyle.borderRadius) : 0,
      mapBackground: mapStyle?.backgroundImage || "",
      shelfCount: shelves.length,
      shelfSlotCounts: shelves.map((shelf) => shelf.querySelectorAll(".badge-slot").length),
      slotCount: slots.length,
      lockedSlotCount: slots.filter((slot) => slot.classList.contains("locked")).length,
      slotOutsideShelfCount: slots.filter((slot) => {
        const rect = slot.getBoundingClientRect();
        const shelfRect = slot.closest(".badge-shelf")?.getBoundingClientRect();
        return !shelfRect || rect.left < shelfRect.left - 1 || rect.right > shelfRect.right + 1;
      }).length,
      minCircleSize: Math.min(...circles.map((circle) => circle.getBoundingClientRect().width)),
      minCircleGap: Math.min(...shelves.flatMap((shelf) => {
        const shelfCircles = [...shelf.querySelectorAll(".badge-circle")].map((circle) => circle.getBoundingClientRect());
        return shelfCircles.slice(1).map((rect, index) => rect.left - shelfCircles[index].right);
      })),
      maxLockedImageOpacity: Math.max(...slots.filter((slot) => slot.classList.contains("locked")).map((slot) => Number(getComputedStyle(slot.querySelector(".badge-circle img")).opacity))),
      outsideCount: [...shelves, ...slots].filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.left < -1 || rect.right > window.innerWidth + 1;
      }).length,
      boardBackground: boardStyle?.backgroundImage || ""
    };
  });
  if (
    metrics.mapLeft < -1 ||
    metrics.mapRight > metrics.viewportWidth + 1 ||
    metrics.mapRadius < 14 ||
    !metrics.mapBackground.includes("linear-gradient") ||
    metrics.shelfCount !== 3 ||
    metrics.shelfSlotCounts.some((count) => count !== 3) ||
    metrics.slotCount !== 9 ||
    metrics.lockedSlotCount !== 9 ||
    metrics.slotOutsideShelfCount !== 0 ||
    metrics.minCircleSize < 60 ||
    metrics.minCircleGap < 8 ||
    metrics.maxLockedImageOpacity > 0.15 ||
    metrics.outsideCount !== 0 ||
    !metrics.boardBackground.includes("linear-gradient")
  ) {
    failures.push("[" + viewportName + "] Badge Shelf polish regression: " + JSON.stringify(metrics));
  }
}

async function expectReplayPicksPolish(page, viewportName) {
  const metrics = await page.evaluate(() => {
    const card = document.querySelector(".replay-picks-card");
    const pill = document.querySelector(".replay-picks-card__header > span");
    const buttons = [...document.querySelectorAll(".replay-pick-button")];
    const firstButton = buttons[0];
    const cardRect = card?.getBoundingClientRect();
    const cardStyle = card ? getComputedStyle(card) : null;
    const pillRect = pill?.getBoundingClientRect();
    const pillStyle = pill ? getComputedStyle(pill) : null;
    const firstButtonRect = firstButton?.getBoundingClientRect();
    const firstButtonStyle = firstButton ? getComputedStyle(firstButton) : null;
    const maxRight = Math.max(0, ...buttons.map((button) => button.getBoundingClientRect().right));
    const minLeft = Math.min(window.innerWidth, ...buttons.map((button) => button.getBoundingClientRect().left));
    return {
      cardLeft: cardRect?.left || 0,
      cardRight: cardRect?.right || 0,
      viewportWidth: window.innerWidth,
      cardRadius: cardStyle ? parseFloat(cardStyle.borderRadius) : 0,
      cardBackground: cardStyle?.backgroundImage || "",
      pillHeight: pillRect?.height || 0,
      pillBackground: pillStyle?.backgroundImage || "",
      buttonCount: buttons.length,
      buttonHeight: firstButtonRect?.height || 0,
      buttonRadius: firstButtonStyle ? parseFloat(firstButtonStyle.borderRadius) : 0,
      buttonBackground: firstButtonStyle?.backgroundImage || "",
      minLeft,
      maxRight
    };
  });
  if (
    metrics.cardLeft < -1 ||
    metrics.cardRight > metrics.viewportWidth + 1 ||
    metrics.cardRadius < 14 ||
    !metrics.cardBackground.includes("linear-gradient") ||
    metrics.pillHeight < 30 ||
    !metrics.pillBackground.includes("linear-gradient") ||
    metrics.buttonCount < 1 ||
    metrics.buttonHeight < 56 ||
    metrics.buttonRadius < 12 ||
    !metrics.buttonBackground.includes("linear-gradient") ||
    metrics.minLeft < -1 ||
    metrics.maxRight > metrics.viewportWidth + 1
  ) {
    failures.push("[" + viewportName + "] Replay picks polish regression: " + JSON.stringify(metrics));
  }
}

async function expectCompletionRewardPolish(page, viewportName) {
  const metrics = await page.evaluate(() => {
    const banner = document.querySelector(".completion-banner");
    const pip = document.querySelector(".completion-pip");
    const card = document.querySelector(".completion-reveal-card");
    const reveal = document.querySelector(".completion-reveal");
    const character = document.querySelector(".completion-reveal__character");
    const stamp = document.querySelector(".completion-reveal__stamp");
    const eyebrow = document.querySelector(".completion-reveal__eyebrow");
    const actions = document.querySelector(".completion-actions");
    const rewardFacts = [...document.querySelectorAll(".completion-reward-facts span")];
    const rewardFactRects = rewardFacts.map((chip) => {
      const rect = chip.getBoundingClientRect();
      const style = getComputedStyle(chip);
      return { width: rect.width, height: rect.height, background: style.backgroundImage, text: chip.textContent.trim() };
    });
    const bannerRect = banner?.getBoundingClientRect();
    const pipRect = pip?.getBoundingClientRect();
    const cardRect = card?.getBoundingClientRect();
    const revealRect = reveal?.getBoundingClientRect();
    const characterRect = character?.getBoundingClientRect();
    const stampRect = stamp?.getBoundingClientRect();
    const eyebrowRect = eyebrow?.getBoundingClientRect();
    const actionsRect = actions?.getBoundingClientRect();
    const actionButtons = [...(actions?.querySelectorAll("button") || [])];
    const bannerStyle = banner ? getComputedStyle(banner) : null;
    const cardStyle = card ? getComputedStyle(card) : null;
    const revealStyle = reveal ? getComputedStyle(reveal) : null;
    const stampStyle = stamp ? getComputedStyle(stamp) : null;
    return {
      bannerWidth: bannerRect?.width || 0,
      bannerLeft: bannerRect?.left || 0,
      bannerRight: bannerRect?.right || 0,
      viewportWidth: window.innerWidth,
      pipWidth: pipRect?.width || 0,
      pipHeight: pipRect?.height || 0,
      cardWidth: cardRect?.width || 0,
      cardHeight: cardRect?.height || 0,
      revealWidth: revealRect?.width || 0,
      revealHeight: revealRect?.height || 0,
      characterWidth: characterRect?.width || 0,
      characterHeight: characterRect?.height || 0,
      firstPipFace: card?.classList.contains("completion-reveal-card--pip-face") || false,
      stampWidth: stampRect?.width || 0,
      stampHeight: stampRect?.height || 0,
      eyebrowWidth: eyebrowRect?.width || 0,
      actionsWidth: actionsRect?.width || 0,
      actionsLeft: actionsRect?.left || 0,
      actionsRight: actionsRect?.right || 0,
      actionButtonCount: actionButtons.length,
      rewardFactRects,
      bannerRadius: bannerStyle ? parseFloat(bannerStyle.borderRadius) : 0,
      bannerBackground: bannerStyle?.backgroundImage || "",
      cardRadius: cardStyle ? parseFloat(cardStyle.borderRadius) : 0,
      cardBackground: cardStyle?.backgroundImage || "",
      revealRadius: revealStyle ? parseFloat(revealStyle.borderRadius) : 0,
      revealBackground: revealStyle?.backgroundImage || "",
      stampBackground: stampStyle?.backgroundImage || "",
      stampText: stamp?.textContent?.trim() || "",
      eyebrowText: eyebrow?.textContent?.trim() || ""
    };
  });
  if (
    metrics.bannerLeft < -1 ||
    metrics.bannerRight > metrics.viewportWidth + 1 ||
    (!metrics.firstPipFace && (metrics.pipWidth < 60 || metrics.pipHeight < 60)) ||
    metrics.cardWidth < 180 ||
    metrics.cardHeight < (metrics.firstPipFace ? metrics.revealHeight + 30 : Math.max(metrics.revealHeight, metrics.characterHeight) + 30) ||
    metrics.revealWidth < (metrics.firstPipFace ? 90 : 150) ||
    Math.abs(metrics.revealWidth - metrics.revealHeight) > 2 ||
    (metrics.firstPipFace && (metrics.characterWidth < 90 || metrics.characterHeight < 90)) ||
    (!metrics.firstPipFace && metrics.stampWidth < 42) ||
    (!metrics.firstPipFace && metrics.stampHeight < 22) ||
    (!metrics.firstPipFace && metrics.eyebrowWidth < 56) ||
    (metrics.firstPipFace && (metrics.stampWidth !== 0 || metrics.eyebrowWidth !== 0)) ||
    metrics.actionButtonCount !== 1 ||
    metrics.actionsWidth < Math.min(220, metrics.bannerWidth * 0.55) ||
    metrics.actionsWidth > 320.5 ||
    Math.abs(
      (metrics.actionsLeft + metrics.actionsRight) / 2 -
      (metrics.bannerLeft + metrics.bannerRight) / 2
    ) > 2 ||
    metrics.rewardFactRects.length !== 0 ||
    metrics.bannerRadius < 14 ||
    metrics.cardRadius < 16 ||
    metrics.revealRadius < 10 ||
    !metrics.bannerBackground.includes("linear-gradient") ||
    (!metrics.firstPipFace && !metrics.cardBackground.includes("linear-gradient")) ||
    !metrics.revealBackground.includes("linear-gradient") ||
    (!metrics.firstPipFace && !metrics.stampBackground.includes("linear-gradient")) ||
    (!metrics.firstPipFace && !metrics.stampText) ||
    (!metrics.firstPipFace && !metrics.eyebrowText)
  ) {
    failures.push("[" + viewportName + "] Completion reward polish regression: " + JSON.stringify(metrics));
  }
}

async function expectHintConfirmationPolish(page, viewportName) {
  const metrics = await page.evaluate(() => {
    const host = document.createElement("div");
    host.className = "hint-panel mobile-qa-hint-fixture";
    host.style.cssText = "position: fixed; left: 12px; right: 12px; bottom: 14px; z-index: 9999; display: grid; grid-template-columns: 1fr; max-width: 340px; margin: 0 auto;";
    const confirm = document.createElement("div");
    confirm.className = "hint-panel__confirm";
    confirm.dataset.cost = "4";
    confirm.setAttribute("role", "group");
    const title = document.createElement("p");
    title.className = "hint-panel__confirm-title";
    title.textContent = "Spend spoons for a hint?";
    const costChipNode = document.createElement("div");
    costChipNode.className = "hint-panel__cost-chip";
    costChipNode.setAttribute("aria-label", "4 spoons");
    const spoonMark = document.createElement("span");
    spoonMark.className = "hint-panel__spoon-mark";
    spoonMark.setAttribute("aria-hidden", "true");
    const costValue = document.createElement("strong");
    costValue.textContent = "4";
    costChipNode.append(spoonMark, costValue);
    const body = document.createElement("p");
    body.textContent = "This uses 4 spoons now. Undo can remove the hint move, but the spoons are not refunded.";
    const actions = document.createElement("div");
    actions.className = "hint-panel__confirm-actions";
    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "tool-button";
    cancelButton.textContent = "Not now";
    const useButton = document.createElement("button");
    useButton.type = "button";
    useButton.className = "tool-button complete";
    useButton.textContent = "Use 4";
    actions.append(cancelButton, useButton);
    confirm.append(title, costChipNode, body, actions);
    host.appendChild(confirm);
    document.body.appendChild(host);
    const panel = host.querySelector(".hint-panel__confirm");
    const buttons = [...host.querySelectorAll("button")];
    const rect = panel?.getBoundingClientRect();
    const style = panel ? getComputedStyle(panel) : null;
    const buttonMetrics = buttons.map((button) => {
      const buttonRect = button.getBoundingClientRect();
      const buttonStyle = getComputedStyle(button);
      return { width: buttonRect.width, height: buttonRect.height, background: buttonStyle.backgroundImage };
    });
    const costChip = host.querySelector(".hint-panel__cost-chip");
    const costChipRect = costChip?.getBoundingClientRect();
    const costChipStyle = costChip ? getComputedStyle(costChip) : null;
    const spoonMarkRect = host.querySelector(".hint-panel__spoon-mark")?.getBoundingClientRect();
    const result = {
      left: rect?.left || 0,
      right: rect?.right || 0,
      width: rect?.width || 0,
      height: rect?.height || 0,
      viewportWidth: window.innerWidth,
      radius: style ? parseFloat(style.borderRadius) : 0,
      background: style?.backgroundImage || "",
      boxShadow: style?.boxShadow || "",
      cost: panel?.getAttribute("data-cost") || "",
      costChipText: costChip?.textContent?.trim() || "",
      costChipLabel: costChip?.getAttribute("aria-label") || "",
      costChipWidth: costChipRect?.width || 0,
      costChipHeight: costChipRect?.height || 0,
      costChipBackground: costChipStyle?.backgroundImage || "",
      spoonMarkWidth: spoonMarkRect?.width || 0,
      spoonMarkHeight: spoonMarkRect?.height || 0,
      buttonMetrics
    };
    host.remove();
    return result;
  });

  const buttonsReady = metrics.buttonMetrics.length === 2 && metrics.buttonMetrics.every((button) => button.height >= 40 && button.width >= 100 && button.background.includes("linear-gradient"));
  if (
    metrics.left < -1 ||
    metrics.right > metrics.viewportWidth + 1 ||
    metrics.width < 280 ||
    metrics.height < 120 ||
    metrics.radius < 12 ||
    !metrics.background.includes("linear-gradient") ||
    metrics.boxShadow === "none" ||
    metrics.cost !== "4" ||
    metrics.costChipText !== "4" ||
    !metrics.costChipLabel.includes("4") ||
    metrics.costChipWidth < 48 ||
    metrics.costChipHeight < 32 ||
    !metrics.costChipBackground.includes("linear-gradient") ||
    metrics.spoonMarkWidth < 14 ||
    metrics.spoonMarkHeight < 14 ||
    !buttonsReady
  ) {
    failures.push("[" + viewportName + "] Hint confirmation polish regression: " + JSON.stringify(metrics));
  }
}

async function expectStageCompleteRewardPolish(page, viewportName) {
  const metrics = await page.evaluate(() => {
    const overlay = document.createElement("div");
    overlay.className = "stage-complete-overlay";
    const cardNode = document.createElement("section");
    cardNode.className = "stage-complete-card";
    const pipArt = document.createElement("img");
    pipArt.className = "stage-complete-pip stage-complete-pip--fallback";
    pipArt.alt = "";
    const copy = document.createElement("div");
    copy.className = "stage-complete-copy";
    const eyebrow = document.createElement("p");
    eyebrow.className = "stage-complete-eyebrow";
    eyebrow.textContent = "Complete";
    const title = document.createElement("h2");
    title.textContent = "Starter Stage";
    const body = document.createElement("p");
    body.textContent = "Reward copy";
    const bonus = document.createElement("p");
    bonus.className = "stage-complete-bonus";
    const bonusIcon = document.createElement("img");
    bonusIcon.alt = "";
    bonus.append(bonusIcon, document.createTextNode(" +5 spoons"));
    const ctaButton = document.createElement("button");
    ctaButton.type = "button";
    ctaButton.className = "tool-button stage-complete-cta";
    ctaButton.textContent = "OK";
    copy.append(eyebrow, title, body, bonus, ctaButton);
    cardNode.append(pipArt, copy);
    overlay.appendChild(cardNode);
    document.body.appendChild(overlay);
    const card = overlay.querySelector(".stage-complete-card");
    const art = overlay.querySelector(".stage-complete-pip");
    const cta = overlay.querySelector(".stage-complete-cta");
    const cardRect = card?.getBoundingClientRect();
    const artRect = art?.getBoundingClientRect();
    const ctaRect = cta?.getBoundingClientRect();
    const cardStyle = card ? getComputedStyle(card) : null;
    const cardBefore = card ? getComputedStyle(card, "::before") : null;
    const overlayStyle = getComputedStyle(overlay);
    const ctaStyle = cta ? getComputedStyle(cta) : null;
    const artStyle = art ? getComputedStyle(art) : null;
    const result = {
      cardWidth: cardRect?.width || 0,
      cardHeight: cardRect?.height || 0,
      cardLeft: cardRect?.left || 0,
      cardRight: cardRect?.right || 0,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      artHeight: artRect?.height || 0,
      ctaHeight: ctaRect?.height || 0,
      cardRadius: cardStyle ? parseFloat(cardStyle.borderRadius) : 0,
      cardBackground: cardStyle?.backgroundImage || "",
      cardBeforeHeight: cardBefore ? parseFloat(cardBefore.height) : 0,
      cardBeforeBackground: typeof cardBefore !== "undefined" ? cardBefore?.backgroundImage || "" : "",
      overlayBackground: overlayStyle.backgroundImage || "",
      overlayPaddingBottom: parseFloat(overlayStyle.paddingBottom) || 0,
      ctaBackground: ctaStyle?.backgroundImage || "",
      pendingArtCount: overlay.querySelectorAll(".stage-complete-pending-art").length,
      artBackground: artStyle?.backgroundImage || "",
      artObjectFit: artStyle?.objectFit || ""
    };
    overlay.remove();
    return result;
  });
  if (
    metrics.cardLeft < -1 ||
    metrics.cardRight > metrics.viewportWidth + 1 ||
    metrics.cardHeight > metrics.viewportHeight - 24 ||
    metrics.artHeight < 180 ||
    metrics.ctaHeight < 50 ||
    metrics.cardRadius < 16 ||
    metrics.cardBeforeHeight < 8 ||
    !metrics.cardBeforeBackground.includes("linear-gradient") ||
    !metrics.cardBackground.includes("linear-gradient") ||
    !metrics.overlayBackground.includes("radial-gradient") ||
    metrics.overlayPaddingBottom < 22 ||
    !metrics.ctaBackground.includes("linear-gradient") ||
    metrics.pendingArtCount !== 0 ||
    !metrics.artBackground.includes("radial-gradient") ||
    metrics.artObjectFit !== "contain"
  ) {
    failures.push("[" + viewportName + "] Stage-complete reward polish regression: " + JSON.stringify(metrics));
  }
}

async function expectNoHorizontalOverflow(page, viewportName) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 1) {
    failures.push(`[${viewportName}] Horizontal overflow detected: ${overflow}px`);
  }
}

async function expectHiddenBonusPacks(page, viewportName) {
  const leakCount = await page.locator('.bonus-pack-panel').count();
  if (leakCount > 0) {
    failures.push(`${viewportName}: hidden bonus pack preview leaked into the launch puzzle picker.`);
  }
}

async function expectLockedStageGate(page, viewportName) {
  const lockedStage = page.locator(".pack-block--locked").first();
  if (await lockedStage.count() === 0) {
    failures.push("[" + viewportName + "] Locked stage card is missing from the puzzle picker.");
    return;
  }
  const lockedText = await lockedStage.innerText();
  const duplicateReportCount = await lockedStage.locator(".unlock-panel__plan, .unlock-panel__gate").count();
  const geometry = await lockedStage.evaluate((card) => {
    const style = getComputedStyle(card);
    return {
      paddingTop: parseFloat(style.paddingTop),
      paddingRight: parseFloat(style.paddingRight),
      paddingBottom: parseFloat(style.paddingBottom),
      paddingLeft: parseFloat(style.paddingLeft),
      overflows: card.scrollWidth > card.clientWidth + 1
    };
  });
  if (!/\d+/.test(lockedText) || !/Pantry decor \d+\/\d+/.test(lockedText) || !lockedText.includes("Need pantry story") || !lockedText.includes("Go to Pantry") || lockedText.includes("Blocked by") || duplicateReportCount > 0 || geometry.paddingTop < 14 || geometry.paddingRight < 16 || geometry.paddingBottom < 14 || geometry.paddingLeft < 16 || geometry.overflows) {
    failures.push("[" + viewportName + "] Locked stage should show cost, Pantry progress, one route, 14x16px padding, and no overflow; saw " + lockedText + " / " + JSON.stringify(geometry));
  }
}

async function expectNoStageMosaic(page, viewportName) {
  const obsoleteCount = await page.locator(".stage-preview, .stage-tile-mosaic, .pip-tile-mosaic").count();
  if (obsoleteCount > 0) {
    failures.push("[" + viewportName + "] Puzzle picker should not render retired stage mosaics; saw " + obsoleteCount);
  }
}

async function expectPuzzlePickerPolish(page, viewportName) {
  const pickerMetrics = await page.locator(".puzzle-picker").first().evaluate((panel) => ({
    headingText: (panel.querySelector(".pack-header")?.textContent || "").trim(),
    overflows: panel.scrollWidth > panel.clientWidth + 1
  }));
  const metrics = await page.locator(".puzzle-chip").evaluateAll((chips) => chips.slice(0, 20).map((chip) => {
    const label = chip.querySelector(":scope > span");
    const meta = chip.querySelector(":scope > small");
    return {
      label: (label?.textContent || "").trim(),
      meta: (meta?.textContent || "").trim(),
      width: chip.getBoundingClientRect().width,
      height: chip.getBoundingClientRect().height,
      overflows: chip.scrollWidth > chip.clientWidth + 1 || chip.scrollHeight > chip.clientHeight + 1,
      hasRewardImage: Boolean(chip.querySelector("img")),
      hasRewardReport: /(?:\+\d|reward|\ubcf4\uc0c1)/i.test(meta?.textContent || ""),
      before: getComputedStyle(chip, "::before").content,
      after: getComputedStyle(chip, "::after").content
    };
  }));
  if (!pickerMetrics.headingText || pickerMetrics.overflows || !metrics.length || metrics.some((chip) => !chip.label || !chip.meta || chip.width < 120 || chip.height < 80 || chip.overflows || chip.hasRewardImage || chip.hasRewardReport || chip.before !== "none" || chip.after !== "none" || /5x5|8x8|10x10|12x12/.test(chip.label))) {
    failures.push("[" + viewportName + "] Compact puzzle choices regressed: " + JSON.stringify({ pickerMetrics, metrics }));
  }
}

async function expectPuzzleHomePolish(page, viewportName) {
  await expectVisible(page, ".puzzle-home-scene", viewportName);
  await expectVisible(page, ".puzzle-home-scene__play", viewportName);
  await expectVisible(page, ".puzzle-home-scene__settings", viewportName);
  await page.waitForFunction(() => {
    const images = [...document.querySelectorAll(".puzzle-home-destination img, .puzzle-home-scene__play img, .puzzle-home-scene__settings img")];
    return images.length >= 7 && images.every((image) => image.complete && image.naturalWidth >= 128 && image.naturalHeight >= 128);
  }, null, { timeout: 5000 });
  await expectAbsent(page, ".puzzle-home-scene__pip", viewportName);
  const metrics = await page.locator(".puzzle-home").first().evaluate((home) => {
    const destinations = [...home.querySelectorAll(".puzzle-home-destination")];
    const scene = home.querySelector(".puzzle-home-scene");
    const play = home.querySelector(".puzzle-home-scene__play");
    const settings = home.querySelector(".puzzle-home-scene__settings");
    const controls = home.querySelector(".puzzle-home-scene__controls");
    const greetingWrap = home.querySelector(".puzzle-home-scene__greeting-wrap");
    const greetingPip = home.querySelector(".puzzle-home-scene__greeting-pip");
    const greetingBubble = home.querySelector(".puzzle-home-scene__greeting");
    const shell = home.closest(".app-shell");
    const hubCards = shell?.querySelector(".puzzle-hub-cards");
    const hubCardsStyle = hubCards ? getComputedStyle(hubCards) : null;
    const sceneStyle = scene ? getComputedStyle(scene) : null;
    const boxOf = (element) => {
      const rect = element?.getBoundingClientRect();
      return rect ? { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom } : null;
    };
    const intersects = (left, right) => Boolean(left && right
      && left.left < right.right - 1
      && left.right > right.left + 1
      && left.top < right.bottom - 1
      && left.bottom > right.top + 1);
    const sceneBox = boxOf(scene);
    const hubCardsBox = boxOf(hubCards);
    const destinationBoxes = destinations.map(boxOf);
    const destinationArt = destinations.map((button) => {
      const image = button.querySelector("img");
      const rect = image?.getBoundingClientRect();
      const style = getComputedStyle(button);
      return {
        id: button.dataset.destination || "",
        assetId: image?.dataset.assetId || "",
        width: rect?.width || 0,
        height: rect?.height || 0,
        naturalWidth: image?.naturalWidth || 0,
        naturalHeight: image?.naturalHeight || 0,
        backgroundColor: style.backgroundColor,
        borderTopWidth: style.borderTopWidth,
        boxShadow: style.boxShadow
      };
    });
    const playBox = boxOf(play);
    const settingsBox = boxOf(settings);
    const controlsBox = boxOf(controls);
    const greetingWrapBox = boxOf(greetingWrap);
    const greetingPipBox = boxOf(greetingPip);
    const greetingBubbleBox = boxOf(greetingBubble);
    const greetingWrapStyle = greetingWrap ? getComputedStyle(greetingWrap) : null;
    const greetingBubbleStyle = greetingBubble ? getComputedStyle(greetingBubble) : null;
    const primaryDestinationBoxes = destinations
      .filter((button) => ["puzzle", "album", "spoonRun", "pantry"].includes(button.dataset.destination || ""))
      .map(boxOf);
    const settingsImage = settings?.querySelector("img");
    return {
      overflow: home.scrollWidth > home.clientWidth + 1,
      sceneOverflow: scene ? scene.scrollWidth > scene.clientWidth + 1 : true,
      backgroundImage: sceneStyle?.backgroundImage || "",
      destinationCount: destinations.length,
      destinationOverflow: destinations.some((button) => { const box = button.getBoundingClientRect(); return box.width < 48 || box.height < 48; }),
      destinationOutsideScene: destinationBoxes.some((box) => !box || !sceneBox
        || box.left < sceneBox.left - 1 || box.right > sceneBox.right + 1 || box.top < sceneBox.top - 1 || box.bottom > sceneBox.bottom + 1),
      destinationCollisions: destinationBoxes.some((box, index) => destinationBoxes
        .slice(index + 1)
        .some((other) => intersects(box, other))),
      destinationTargetsLargeEnough: destinationBoxes.every((box) => box
        && Math.min(box.right - box.left, box.bottom - box.top) >= 72),
      destinationArtLargeEnough: destinationArt.every((art) => art.width >= 72 && art.height >= 72
        && art.naturalWidth >= 128 && art.naturalHeight >= 128),
      destinationArt,
      playCollision: destinationBoxes.some((box) => intersects(box, playBox)),
      controlsCollision: destinationBoxes.some((box) => intersects(box, controlsBox)) || intersects(playBox, controlsBox),
      greetingGap: greetingPipBox && greetingBubbleBox ? Math.max(0, greetingBubbleBox.left - greetingPipBox.right) : 999,
      greetingFlexGap: greetingWrapStyle ? parseFloat(greetingWrapStyle.gap) || 0 : 999,
      greetingBubbleBorder: greetingBubbleStyle ? parseFloat(greetingBubbleStyle.borderTopWidth) || 0 : 0,
      greetingBubbleRadius: greetingBubbleStyle ? parseFloat(greetingBubbleStyle.borderTopLeftRadius) || 0 : 0,
      greetingBubbleShadow: greetingBubbleStyle?.boxShadow || "none",
      greetingBubbleBackground: greetingBubbleStyle?.backgroundColor || "",
      greetingOutsideScene: !greetingWrapBox || !sceneBox || greetingWrapBox.left < sceneBox.left - 1 || greetingWrapBox.right > sceneBox.right + 1 || greetingWrapBox.top < sceneBox.top - 1 || greetingWrapBox.bottom > sceneBox.bottom + 1,
      primaryDestinationsBelowGreeting: Boolean(greetingWrapBox && primaryDestinationBoxes.length === 4 && primaryDestinationBoxes.every((box) => box && box.top >= greetingWrapBox.bottom + 4)),
      settingsOutsideScene: !settingsBox || !sceneBox || settingsBox.left < sceneBox.left - 1 || settingsBox.right > sceneBox.right + 1 || settingsBox.top < sceneBox.top - 1 || settingsBox.bottom > sceneBox.bottom + 1,
      settingsTargetLargeEnough: Boolean(settingsBox && Math.min(settingsBox.right - settingsBox.left, settingsBox.bottom - settingsBox.top) >= 44),
      settingsAssetId: settingsImage?.dataset.assetId || "",
      playOutsideScene: !playBox || !sceneBox || playBox.left < sceneBox.left - 1 || playBox.right > sceneBox.right + 1 || playBox.top < sceneBox.top - 1 || playBox.bottom > sceneBox.bottom + 1,
      playLargeEnough: Boolean(playBox && Math.min(playBox.right - playBox.left, playBox.bottom - playBox.top) >= 96),
      workshopShell: Boolean(shell?.classList.contains("app-shell--workshop-home")),
      supportingCardClasses: hubCards ? [...hubCards.children].map((child) => child.className) : [],
      supportingCardsBelowScene: Boolean(sceneBox && hubCardsBox && hubCardsBox.top >= sceneBox.bottom - 1),
      supportingCardsWidthContained: Boolean(hubCardsBox && hubCardsBox.left >= -1 && hubCardsBox.right <= window.innerWidth + 1),
      supportingCardsPaddingBottom: hubCardsStyle ? parseFloat(hubCardsStyle.paddingBottom) || 0 : 0,
      hasRetiredHomeProps: Boolean(home.querySelector(".puzzle-home-furnishings, .puzzle-home-scene__keepsake")),
      hasHiddenDestinationLabel: destinations.some((button) => {
        const label = button.querySelector(".puzzle-home-destination__label");
        return !label || getComputedStyle(label).display === "none" || getComputedStyle(label).visibility === "hidden";
      }),
      ids: destinations.map((button) => button.dataset.destination || ""),
      playAssetId: play?.querySelector("img")?.dataset.assetId || ""
    };
  });
  const expected = ["puzzle", "album", "pantry", "spoonRun", "map"];
  const expectedAssets = { puzzle: "workshop-nav-puzzle-v3", album: "workshop-nav-album-v3", pantry: "workshop-nav-pantry-v3", spoonRun: "spoon-token-v2", map: "workshop-nav-map-v3" };
  const hasStaleDestinationTreatment = metrics.destinationArt.some((art) => art.assetId !== expectedAssets[art.id] || art.backgroundColor !== "rgba(0, 0, 0, 0)" || art.borderTopWidth !== "0px" || art.boxShadow !== "none");
  if (metrics.overflow || metrics.sceneOverflow || !metrics.backgroundImage.includes("pip-puzzle-workshop-v1") || metrics.destinationCount !== expected.length || metrics.destinationOverflow || metrics.destinationOutsideScene || metrics.destinationCollisions || !metrics.destinationTargetsLargeEnough || !metrics.destinationArtLargeEnough || metrics.playCollision || metrics.controlsCollision || metrics.greetingGap > 5 || metrics.greetingFlexGap > 4 || metrics.greetingBubbleBorder < 2 || metrics.greetingBubbleRadius < 16 || metrics.greetingBubbleShadow === "none" || metrics.greetingBubbleBackground === "rgb(255, 255, 255)" || metrics.greetingOutsideScene || !metrics.primaryDestinationsBelowGreeting || metrics.settingsOutsideScene || !metrics.settingsTargetLargeEnough || metrics.settingsAssetId !== "workshop-nav-settings-v3" || metrics.playOutsideScene || !metrics.playLargeEnough || !metrics.workshopShell || metrics.hasRetiredHomeProps || metrics.hasHiddenDestinationLabel || metrics.playAssetId !== "puzzle-control-fill-v1" || metrics.supportingCardClasses.length !== 0 || hasStaleDestinationTreatment || expected.some((id) => !metrics.ids.includes(id))) {
    failures.push("[" + viewportName + "] Puzzle workshop home/direct destinations regressed: " + JSON.stringify(metrics));
  }
}

async function expectDailyRewardPolish(page, viewportName) {
  await expectVisible(page, ".daily-card", viewportName);
  const metrics = await page.locator(".daily-card").evaluate((card) => ({
    text: (card.textContent || "").trim(),
    overflows: card.scrollWidth > card.clientWidth + 1 || card.scrollHeight > card.clientHeight + 1,
    hasRewardNote: Boolean(card.querySelector(".daily-reward-note")),
    before: getComputedStyle(card, "::before").content,
    after: getComputedStyle(card, "::after").content,
    buttonHeight: card.querySelector("button")?.getBoundingClientRect().height || 0
  }));
  if (metrics.overflows || metrics.hasRewardNote || metrics.before !== "none" || metrics.after !== "none" || metrics.buttonHeight < 44) {
    failures.push("[" + viewportName + "] Compact daily card regressed: " + JSON.stringify(metrics));
  }
}

async function expectTimeAttackNavigationEntry(page, viewportName) {
  await expectAbsent(page, ".time-attack-teaser-card", viewportName);
  const entries = page.locator(".floating-nav__item--timeAttack");
  const entryCount = await entries.count();
  const metrics = entryCount === 1
    ? await entries.first().evaluate((entry) => ({
      assetId: entry.querySelector("img")?.dataset.assetId || "",
      view: entry.dataset.view || entry.dataset.destination || "",
      label: entry.getAttribute("aria-label") || entry.title || ""
    }))
    : { assetId: "", view: "", label: "" };
  if (entryCount !== 1 || metrics.assetId !== "workshop-nav-time-attack-v3" || metrics.view !== "timeAttack" || !/Time Attack|\uD0C0\uC784\uC5B4\uD0DD/.test(metrics.label)) {
    failures.push("[" + viewportName + "] Time Attack navigation entry regressed: " + JSON.stringify({ entryCount, ...metrics }));
  }
}
async function expectTapTargets(page, viewportName) {
  const smallTargets = await page.evaluate(() => {
    return [...document.querySelectorAll("button")]
      .map((button) => {
        const rect = button.getBoundingClientRect();
        return { text: button.textContent.trim(), width: rect.width, height: rect.height };
      })
      .filter((target) => target.width < 40 || target.height < 40);
  });

  if (smallTargets.length) {
    failures.push(`[${viewportName}] Small tap targets: ${JSON.stringify(smallTargets)}`);
  }
}

async function openSettings(page) {
  const homeSettings = page.locator('button[data-destination="settings"]').first();
  const chromeSettings = page.locator('button[aria-label="Settings"], button[aria-label="\uC124\uC815"]').first();
  if (await homeSettings.count()) {
    await homeSettings.click();
    return;
  }
  const trigger = page.locator(".floating-nav__trigger").first();
  if (await trigger.count()) {
    await trigger.click();
  }
  await chromeSettings.click();
}

async function openFloatingView(page, view, viewportName = view) {
  await dismissGuideIfPresent(page, "floating-nav");
  if ((await page.locator(".floating-nav__trigger").count()) === 0) {
    const directButton = page.locator('button[data-destination="' + view + '"]').first();
    if (await directButton.count()) {
      await directButton.scrollIntoViewIfNeeded();
      await directButton.click();
      const directSelectors = {
        album: ".album-panel",
        map: ".map-panel",
        pantry: ".pantry-panel",
        puzzle: ".pack-block",
        timeAttack: ".time-attack-panel"
      };
      const directSelector = directSelectors[view];
      if (directSelector) {
        await page.locator(directSelector).first().waitFor({ state: "visible", timeout: 5000 });
      }
      return;
    }
  }
  if ((await page.locator(".floating-nav__trigger").count()) === 0 && (await page.locator(".play-screen__back").count()) > 0) {
    await page.locator(".play-screen__back").click();
  }
  const trigger = page.locator(".floating-nav__trigger").first();
  await trigger.waitFor({ state: "visible", timeout: 4000 });
  await trigger.click();
  await page.locator(".floating-nav[data-open='true']").waitFor({ state: "visible", timeout: 3000 });
  await page.locator(".floating-nav__item[data-view='" + view + "']").click();

  const viewSelectors = {
    album: ".album-panel",
    map: ".map-panel",
    pantry: ".pantry-panel",
    puzzle: ".pack-block",
    timeAttack: ".time-attack-panel"
  };
  if (view === "puzzle" && (await page.locator(".pack-block").count()) === 0) {
    await page.locator(".puzzle-home-destination--puzzle").click();
  }
  const selector = viewSelectors[view];
  if (selector) {
    await page.locator(selector).first().waitFor({ state: "visible", timeout: 5000 });
  }
  if (view === "timeAttack") {
    await expectTimeAttackGuideCopy(page, viewportName);
    await expectAbsent(page, ".time-attack-coach-card", "Time Attack coach card");
    await expectVisible(page, ".time-attack-ladder", "Time Attack ladder");
    const ladderMetrics = await page.locator(".time-attack-ladder").first().evaluate((ladder) => {
      const rect = ladder.getBoundingClientRect();
      const text = ladder.textContent || "";
      const steps = Array.from(ladder.querySelectorAll(".time-attack-ladder__step")).map((step) => {
        const box = step.getBoundingClientRect();
        const style = getComputedStyle(step);
        return { width: box.width, height: box.height, radius: parseFloat(style.borderRadius), background: style.backgroundImage };
      });
      return { width: rect.width, height: rect.height, text, steps };
    });
    const ladderHasRun = /5x5/.test(ladderMetrics.text) && /8x8/.test(ladderMetrics.text) && /10x10/.test(ladderMetrics.text);
    const ladderLooksPolished = ladderMetrics.steps.length === 3 && ladderMetrics.steps.every((step) => step.width > 0 && step.height >= 48 && step.radius >= 12 && step.background === "none");
    if (ladderMetrics.width <= 0 || ladderMetrics.height <= 0 || !ladderHasRun || !ladderLooksPolished) {
      failures.push("Time Attack ladder lost the 5x5/8x8/10x10 run preview: " + JSON.stringify(ladderMetrics));
    }
    await expectTimeAttackStartSurface(page, viewportName);
  }
}

async function expectTimeAttackStartSurface(page, viewportName) {
  await expectVisible(page, ".time-attack-panel__intro", "Time Attack intro");
  await expectVisible(page, ".time-attack-panel__start", "Time Attack start button");
  await expectVisible(page, ".time-attack-status", "Time Attack daily status");
  await page.waitForFunction(() => {
    const image = document.querySelector(".time-attack-panel__clock-grandpa img");
    return Boolean(image && image.complete && image.naturalWidth >= 200 && image.naturalHeight >= 200);
  }, null, { timeout: 5000 });

  const metrics = await page.locator(".time-attack-panel").first().evaluate((panel) => {
    const panelRect = panel.getBoundingClientRect();
    const intro = panel.querySelector(".time-attack-panel__intro");
    const start = panel.querySelector(".time-attack-panel__start");
    const status = panel.querySelector(".time-attack-status");
    const records = panel.querySelector(".time-attack-records");
    const grandpa = intro?.querySelector(".time-attack-panel__clock-grandpa");
    const grandpaImage = grandpa?.querySelector("img");
    const recordItems = records ? Array.from(records.querySelectorAll("li")) : [];
    const introRect = intro?.getBoundingClientRect();
    const introStyle = intro ? getComputedStyle(intro) : null;
    const startRect = start?.getBoundingClientRect();
    const startStyle = start ? getComputedStyle(start) : null;
    const statusRect = status?.getBoundingClientRect();
    const recordsRect = records?.getBoundingClientRect();
    const recordsStyle = records ? getComputedStyle(records) : null;
    return {
      panelWidth: panelRect.width,
      panelRight: panelRect.right,
      viewportWidth: window.innerWidth,
      intro: introRect ? {
        width: introRect.width,
        height: introRect.height,
        radius: parseFloat(introStyle.borderRadius),
        background: introStyle.backgroundImage,
        shadow: introStyle.boxShadow,
        sectionLabelCount: intro.querySelectorAll(".section-label").length,
        title: (intro.querySelector("h2")?.textContent || "").trim(),
        clockGrandpa: grandpa ? {
          width: grandpa.getBoundingClientRect().width,
          height: grandpa.getBoundingClientRect().height,
          naturalWidth: grandpaImage?.naturalWidth || 0,
          titleTextAlign: getComputedStyle(intro.querySelector("h2")).textAlign
        } : null
      } : null,
      start: startRect ? {
        width: startRect.width,
        height: startRect.height,
        radius: parseFloat(startStyle.borderRadius),
        background: startStyle.backgroundImage,
        shadow: startStyle.boxShadow
      } : null,
      status: statusRect ? {
        width: statusRect.width,
        height: statusRect.height
      } : null,
      records: recordsRect ? {
        width: recordsRect.width,
        height: recordsRect.height,
        radius: parseFloat(recordsStyle.borderRadius),
        background: recordsStyle.backgroundImage,
        overflow: recordsStyle.overflow,
        shadow: recordsStyle.boxShadow,
        textLength: (records.textContent || "").trim().length,
        itemCount: recordItems.length,
        itemHeights: recordItems.slice(0, 3).map((item) => item.getBoundingClientRect().height)
      } : null
    };
  });

  // v0.1.607: Clock Grandpa now uses one dedicated character asset rather than
  // a cropped sprite sheet. Empty records are intentional until a full run ends.
  const introLooksPolished = metrics.intro && metrics.intro.height >= 96 && metrics.intro.radius >= 14 && metrics.intro.background === "none" && metrics.intro.shadow === "none" && metrics.intro.sectionLabelCount === 0 && metrics.intro.title.length > 0 && metrics.intro.clockGrandpa && metrics.intro.clockGrandpa.width >= 100 && metrics.intro.clockGrandpa.height >= 170 && metrics.intro.clockGrandpa.naturalWidth >= 200 && metrics.intro.clockGrandpa.titleTextAlign === "center";
  const startLooksTactile = metrics.start && metrics.start.width >= 220 && metrics.start.height >= 52 && metrics.start.radius >= 16 && metrics.start.background === "none" && metrics.start.shadow !== "none";
  const statusFits = metrics.status && metrics.status.width > 0 && metrics.status.height >= 28;
  const recordsAreUseful = !metrics.records || (
    metrics.records.width > 0 &&
    metrics.records.radius >= 14 &&
    metrics.records.background === "none" &&
    metrics.records.overflow === "hidden" &&
    metrics.records.shadow === "none" &&
    metrics.records.textLength > 0 &&
    (metrics.records.itemCount === 0 || metrics.records.itemHeights.every((height) => height >= 28))
  );
  const staysInViewport = metrics.panelWidth > 0 && metrics.panelRight <= metrics.viewportWidth + 1;
  if (!introLooksPolished || !startLooksTactile || !statusFits || !recordsAreUseful || !staysInViewport) {
    failures.push("[" + viewportName + "] Time Attack start surface lost its compact start treatment: " + JSON.stringify(metrics));
  }
}

async function expectTimeAttackGuideCopy(page, viewportName) {
  const overlay = page.locator(".guide-overlay");
  if ((await overlay.count()) === 0) {
    failures.push("[" + viewportName + "] Time Attack first-run guide did not appear");
    return;
  }

  await expectVisible(page, ".guide-dialog", viewportName);
  await expectVisible(page, ".guide-dialog__art img", viewportName);
  await expectGuideDialogChromeArt(page, viewportName, { neighborClass: "mr-park" });

  const firstStepText = await page.locator(".guide-dialog__bubble").first().innerText();
  if (!/Grandpa Clock|\uC2DC\uACC4 \uD560\uC544\uBC84\uC9C0/i.test(firstStepText)) {
    failures.push("[" + viewportName + "] Time Attack guide first step should introduce its speaker, saw " + firstStepText);
  }

  await page.locator(".guide-dialog__next").click();
  const hintStepText = await page.locator(".guide-dialog__bubble").first().innerText();
  const mentionsHint = /hint|\uD78C\uD2B8/i.test(hintStepText);
  if (!mentionsHint) {
    failures.push("[" + viewportName + "] Time Attack guide should reserve hints for stuck moments, saw " + hintStepText);
  }

  await page.locator(".guide-dialog__next").click();
  const recordStepText = await page.locator(".guide-dialog__bubble").first().innerText();
  const mentionsRecord = /record|best|fast|\uAE30\uB85D|\uBE60\uB978/i.test(recordStepText);
  if (!mentionsRecord) {
    failures.push("[" + viewportName + "] Time Attack guide final step should invite a speed challenge, saw " + recordStepText);
  }
  await page.locator(".guide-dialog__next").click();
  await overlay.waitFor({ state: "detached", timeout: 2000 });
}
async function verifyTimeAttackExitRestoresRegularPuzzle(page, viewportName, expectedRegularPlayLabel) {
  await dismissGuideIfPresent(page, viewportName);
  const start = page.locator(".time-attack-panel__start").first();
  await start.click();
  await page.locator(".app-shell--play[data-view='timeAttack']").waitFor({ state: "visible", timeout: 5000 });

  const timeAttackCell = page.locator(".puzzle-grid .puzzle-cell").first();
  await timeAttackCell.click();
  await page.waitForTimeout(1200);
  const timeAttackCellAfterTimerDraw = await page.locator(".puzzle-grid .puzzle-cell").first().getAttribute("class");
  if (!timeAttackCellAfterTimerDraw?.includes("filled")) {
    failures.push("[" + viewportName + "] Time Attack paint was lost during the one-second timer redraw: " + timeAttackCellAfterTimerDraw);
  }

  const hintPanel = page.locator(".puzzle-panel--time-attack .hint-panel").first();
  await hintPanel.waitFor({ state: "visible", timeout: 3000 });
  const hintMetrics = await hintPanel.evaluate((panel) => {
    const board = panel.parentElement?.querySelector(".board-wrap");
    const button = panel.querySelector(".hint-button");
    return {
      beforeBoard: Boolean(board && (panel.compareDocumentPosition(board) & Node.DOCUMENT_POSITION_FOLLOWING)),
      buttonDisabled: Boolean(button?.disabled),
      buttonWidth: button?.getBoundingClientRect().width || 0,
      buttonHeight: button?.getBoundingClientRect().height || 0
    };
  });
  if (!hintMetrics.beforeBoard || hintMetrics.buttonDisabled || hintMetrics.buttonWidth < 44 || hintMetrics.buttonHeight < 44) {
    failures.push("[" + viewportName + "] Time Attack hint control is not visible before the board: " + JSON.stringify(hintMetrics));
  }
  const spoonsBeforeHint = await page.evaluate(() => {
    const player = JSON.parse(localStorage.getItem("pips-picture-pantry:v0.1:active-player") || "null");
    const save = player ? JSON.parse(localStorage.getItem("pips-picture-pantry:v0.1:save:" + player.id) || "{}") : {};
    return Number(save.pantrySpoons || 0);
  });
  await hintPanel.locator(".hint-button").click();
  const hintConfirm = hintPanel.locator('.hint-panel__confirm[data-cost="2"]');
  await hintConfirm.waitFor({ state: "visible", timeout: 2000 });
  await hintConfirm.locator(".tool-button.complete").click();
  const hintState = await page.evaluate(() => {
    const player = JSON.parse(localStorage.getItem("pips-picture-pantry:v0.1:active-player") || "null");
    const save = player ? JSON.parse(localStorage.getItem("pips-picture-pantry:v0.1:save:" + player.id) || "{}") : {};
    return {
      spoons: Number(save.pantrySpoons || 0),
      meter: document.querySelectorAll(".puzzle-panel--time-attack .hint-panel__meter-dot.spent").length
    };
  });
  if (hintState.spoons !== spoonsBeforeHint - 2 || hintState.meter !== 1) {
    failures.push("[" + viewportName + "] Time Attack first hint did not spend 2 spoons and record one use: " + JSON.stringify({ spoonsBeforeHint, ...hintState }));
  }

  await page.locator(".play-screen__back").click();
  await page.locator(".app-shell--workshop-home[data-view='puzzle']").waitFor({ state: "visible", timeout: 5000 });

  const restoredPlayLabel = await page.locator(".puzzle-home-scene__play").getAttribute("aria-label");
  if (!expectedRegularPlayLabel || restoredPlayLabel !== expectedRegularPlayLabel) {
    failures.push("[" + viewportName + "] Time Attack exit did not restore the regular puzzle: " + JSON.stringify({ expectedRegularPlayLabel, restoredPlayLabel }));
  }

  await page.locator(".puzzle-home-scene__play").click();
  await page.locator(".app-shell--play[data-view='puzzle']").waitFor({ state: "visible", timeout: 5000 });
  await dismissGuideIfPresent(page, viewportName);
  if ((await page.locator(".time-attack-progress, .time-attack-timer").count()) > 0) {
    failures.push("[" + viewportName + "] Time Attack state leaked into regular puzzle play.");
  }
  await page.locator(".play-screen__back").click();
  await page.locator(".app-shell--workshop-home[data-view='puzzle']").waitFor({ state: "visible", timeout: 5000 });
}

async function verifyLargeBoardCatalogPuzzle(page, viewportName) {
  await seedLargeBoardCatalogAccess(page);
  await page.reload({ waitUntil: "networkidle" });
  if ((await page.locator(".brand-intro").count()) > 0) {
    await page.locator(".brand-intro.game-stage").waitFor({ state: "visible", timeout: 6000 });
    await page.waitForTimeout(400);
    await dismissIntro(page, "Jay", viewportName);
  }
  await dismissGuideIfPresent(page, viewportName);
  if ((await page.locator(".play-screen__back").count()) > 0) {
    await page.locator(".play-screen__back").click();
  }

  await openFloatingView(page, "puzzle");
  const largeBoardChipCount = await page.locator('.puzzle-chip[data-size="12"]').count();
  if (largeBoardChipCount < 91) {
    failures.push("[" + viewportName + "] Bakery Window should expose at least 91 12x12 catalog chips, saw " + largeBoardChipCount);
  }

  const tenByTenChipCount = await page.locator('.puzzle-chip[data-size="10"]').count();
  if (tenByTenChipCount < 98) {
    failures.push("[" + viewportName + "] Season shelves should expose at least 98 10x10 puzzle chips, saw " + tenByTenChipCount);
  }

  if ((await page.locator(".pack-catalog-summary, .pack-note").count()) !== 0) {
    failures.push("[" + viewportName + "] Player-facing puzzle stages should not expose catalog-report summaries or descriptive filler.");
  }

  const target = page.locator(".puzzle-chip", { hasText: /Bakery Window Glow/ }).first();
  await target.waitFor({ state: "visible", timeout: 5000 });
  await target.click();
  await dismissGuideIfPresent(page, viewportName);
  await expectVisible(page, ".play-screen", viewportName);
  await expectVisible(page, ".puzzle-panel", viewportName);
  await expectVisible(page, ".hint-panel", viewportName);
  await expectVisible(page, ".cursor-controls", viewportName);
  await page.waitForFunction(() => {
    const images = [...document.querySelectorAll(".cursor-action-button__art")];
    return images.length === 2 && images.every((image) => image.complete && image.naturalWidth === 256 && image.naturalHeight === 256);
  }, null, { timeout: 5000 });
  const cursorPadMetrics = await page.locator(".cursor-controls").first().evaluate((panel) => {
    const rect = panel.getBoundingClientRect();
    const style = getComputedStyle(panel);
    const dpad = panel.querySelector(".cursor-dpad");
    const actionsArea = panel.querySelector(".cursor-actions");
    const nav = document.querySelector(".floating-nav");
    const dpadRect = dpad?.getBoundingClientRect();
    const actionsRect = actionsArea?.getBoundingClientRect();
    const navRect = nav?.getBoundingClientRect();
    const intersects = (first, second) =>
      Boolean(first && second && first.left < second.right && first.right > second.left && first.top < second.bottom && first.bottom > second.top);
    const moves = [...panel.querySelectorAll(".cursor-move")].map((button) => {
      const buttonRect = button.getBoundingClientRect();
      const buttonStyle = getComputedStyle(button);
      const arrowStyle = getComputedStyle(button, "::before");
      const shineStyle = getComputedStyle(button, "::after");
      return {
        width: buttonRect.width,
        height: buttonRect.height,
        background: buttonStyle.backgroundImage,
        label: button.getAttribute("aria-label") || "",
        visibleFontSize: parseFloat(buttonStyle.fontSize) || 0,
        arrowWidth: parseFloat(arrowStyle.width) || 0,
        arrowHeight: parseFloat(arrowStyle.height) || 0,
        arrowBackground: arrowStyle.backgroundImage || "",
        arrowClipPath: arrowStyle.clipPath || "",
        arrowFilter: arrowStyle.filter || "",
        arrowTransform: arrowStyle.transform || "",
        shineBackground: shineStyle.backgroundImage,
        shineHeight: parseFloat(shineStyle.height) || 0
      };
    });
    const actions = [...panel.querySelectorAll(".cursor-action-button")].map((button) => {
      const buttonRect = button.getBoundingClientRect();
      const buttonStyle = getComputedStyle(button);
      const beforeStyle = getComputedStyle(button, "::before");
      const afterStyle = getComputedStyle(button, "::after");
      const image = button.querySelector(".cursor-action-button__art");
      const imageRect = image?.getBoundingClientRect();
      return {
        width: buttonRect.width,
        height: buttonRect.height,
        background: buttonStyle.backgroundImage,
        text: button.textContent.trim(),
        assetId: image?.dataset.assetId || "",
        imageWidth: imageRect?.width || 0,
        imageHeight: imageRect?.height || 0,
        imageNaturalWidth: image?.naturalWidth || 0,
        imageNaturalHeight: image?.naturalHeight || 0,
        beforeContent: beforeStyle.content,
        afterContent: afterStyle.content
      };
    });
    return {
      width: rect.width,
      height: rect.height,
      viewportWidth: window.innerWidth,
      radius: parseFloat(style.borderRadius),
      background: style.backgroundImage,
      cardBeforeBackground: typeof cardBefore !== "undefined" ? cardBefore.backgroundImage || "" : "",
      dpadWidth: dpadRect?.width || 0,
      navVisible: Boolean(navRect && navRect.width > 0 && navRect.height > 0),
      navOverlapActions: intersects(navRect, actionsRect),
      navOverlapDpad: intersects(navRect, dpadRect),
      navTop: navRect?.top || 0,
      actionsBottom: actionsRect?.bottom || 0,
      dpadBottom: dpadRect?.bottom || 0,
      moves,
      actions,
      overflows: panel.scrollWidth > Math.ceil(rect.width) + 1 || panel.scrollHeight > Math.ceil(rect.height) + 1
    };
  });
  if (
    cursorPadMetrics.width > Math.min(cursorPadMetrics.viewportWidth, 530) ||
    cursorPadMetrics.radius < 16 ||
    !cursorPadMetrics.background.includes("gradient") ||
    cursorPadMetrics.dpadWidth < 124 ||
    cursorPadMetrics.navOverlapActions ||
    cursorPadMetrics.navOverlapDpad ||
    cursorPadMetrics.moves.length !== 4 ||
    cursorPadMetrics.moves.some((button) => button.width < 40 || button.height < 40 || !button.background.includes("gradient") || !button.label || button.visibleFontSize !== 0 || button.arrowWidth < 20 || button.arrowHeight < 16 || !button.arrowBackground.includes("gradient") || button.arrowClipPath === "none" || button.arrowFilter === "none" || button.arrowTransform === "none" || !button.shineBackground.includes("gradient") || button.shineHeight < 10) ||
    cursorPadMetrics.actions.length !== 2 ||
    cursorPadMetrics.actions.some((button, index) =>
      button.width < 120 ||
      button.height < 44 ||
      !button.background.includes("gradient") ||
      !button.text ||
      button.assetId !== (index === 0 ? "puzzle-control-fill-v1" : "puzzle-control-mark-v1") ||
      button.imageWidth < 30 ||
      button.imageHeight < 30 ||
      button.imageNaturalWidth !== 256 ||
      button.imageNaturalHeight !== 256 ||
      button.beforeContent !== "none" ||
      button.afterContent !== "none"
    ) ||
    cursorPadMetrics.overflows
  ) {
    failures.push("[" + viewportName + "] Cursor pad lost tactile large-board treatment: " + JSON.stringify(cursorPadMetrics));
  }

  const cursorHighlightMetrics = await page.locator(".board-wrap").first().evaluate((board) => {
    const selected = board.querySelector(".puzzle-cell.selected");
    const currentRow = board.querySelector(".puzzle-cell.current-row");
    const currentColumn = board.querySelector(".puzzle-cell.current-column");
    const activeRowClue = board.querySelector(".row-clue.active span");
    const activeColumnClue = board.querySelector(".column-clue.active span");
    const selectedStyle = selected ? getComputedStyle(selected) : null;
    const rowStyle = currentRow ? getComputedStyle(currentRow) : null;
    const columnStyle = currentColumn ? getComputedStyle(currentColumn) : null;
    const rowClueStyle = activeRowClue ? getComputedStyle(activeRowClue) : null;
    const columnClueStyle = activeColumnClue ? getComputedStyle(activeColumnClue) : null;
    const rowClueBefore = activeRowClue ? getComputedStyle(activeRowClue, "::before") : null;
    const columnClueBefore = activeColumnClue ? getComputedStyle(activeColumnClue, "::before") : null;
    return {
      selected: Boolean(selected),
      currentRow: Boolean(currentRow),
      currentColumn: Boolean(currentColumn),
      activeRowClue: Boolean(activeRowClue),
      activeColumnClue: Boolean(activeColumnClue),
      selectedOutline: selectedStyle?.outlineStyle || "",
      rowShadow: rowStyle?.boxShadow || "",
      columnShadow: columnStyle?.boxShadow || "",
      rowClueBackground: rowClueStyle?.backgroundImage || "",
      columnClueBackground: columnClueStyle?.backgroundImage || "",
      rowClueShadow: rowClueStyle?.boxShadow || "",
      columnClueShadow: columnClueStyle?.boxShadow || "",
      rowClueShine: rowClueBefore?.backgroundImage || "",
      columnClueShine: columnClueBefore?.backgroundImage || ""
    };
  });
  if (
    !cursorHighlightMetrics.selected ||
    !cursorHighlightMetrics.currentRow ||
    !cursorHighlightMetrics.currentColumn ||
    !cursorHighlightMetrics.activeRowClue ||
    !cursorHighlightMetrics.activeColumnClue ||
    cursorHighlightMetrics.selectedOutline === "none" ||
    cursorHighlightMetrics.rowShadow === "none" ||
    cursorHighlightMetrics.columnShadow === "none" ||
    !cursorHighlightMetrics.rowClueBackground.includes("gradient") ||
    !cursorHighlightMetrics.columnClueBackground.includes("gradient") ||
    cursorHighlightMetrics.rowClueShadow === "none" ||
    cursorHighlightMetrics.columnClueShadow === "none" ||
    !cursorHighlightMetrics.rowClueShine.includes("gradient") ||
    !cursorHighlightMetrics.columnClueShine.includes("gradient")
  ) {
    failures.push("[" + viewportName + "] Cursor focus rails should highlight the selected row, column, cell, and clues: " + JSON.stringify(cursorHighlightMetrics));
  }

  await page.locator(".cursor-action-button").first().click();
  const cursorActionAfterFill = await page.locator(".cursor-action-button").first().innerText();
  if (!/Clear|\uC9C0\uC6B0/.test(cursorActionAfterFill)) {
    failures.push("[" + viewportName + "] Cursor fill action should become a clear action after use: " + JSON.stringify({ cursorActionAfterFill }));
  }
  await page.locator(".cursor-action-button").first().click();

  const titleText = await page.locator(".play-screen__title").first().innerText();
  if (!titleText.includes("Bakery Window Glow")) {
    failures.push("[" + viewportName + "] 12x12 play screen title should show Bakery Window Glow, saw " + titleText);
  }

  const sizeText = await page.locator(".play-screen__header .difficulty").first().innerText();
  if (!sizeText.includes("12")) {
    failures.push("[" + viewportName + "] 12x12 puzzle meta should show 12x12, saw " + sizeText);
  }

  const playHeaderMetrics = await page.locator(".play-screen__header").first().evaluate((header) => {
    const rect = header.getBoundingClientRect();
    const style = getComputedStyle(header);
    const title = header.querySelector(".play-screen__title");
    const titleRect = title?.getBoundingClientRect();
    const controls = [...header.querySelectorAll("button, .difficulty")].map((node) => {
      const nodeRect = node.getBoundingClientRect();
      return {
        text: (node.textContent || "").trim(),
        width: nodeRect.width,
        height: nodeRect.height,
        left: nodeRect.left,
        right: nodeRect.right
      };
    });
    return {
      left: rect.left,
      right: rect.right,
      width: rect.width,
      height: rect.height,
      viewportWidth: window.innerWidth,
      background: style.backgroundImage,
      cardBeforeBackground: typeof cardBefore !== "undefined" ? cardBefore.backgroundImage || "" : "",
      radius: parseFloat(style.borderRadius),
      bottomRadius: parseFloat(style.borderBottomLeftRadius),
      titleLeft: titleRect?.left || 0,
      titleRight: titleRect?.right || 0,
      titleWidth: titleRect?.width || 0,
      titleOverflow: title ? title.scrollWidth > Math.ceil(titleRect?.width || 0) + 1 : true,
      controls
    };
  });
  if (
    playHeaderMetrics.left < -1 ||
    playHeaderMetrics.right > playHeaderMetrics.viewportWidth + 1 ||
    playHeaderMetrics.height < 64 ||
    Math.max(playHeaderMetrics.radius, playHeaderMetrics.bottomRadius) < 14 ||
    !playHeaderMetrics.background.includes("gradient") ||
    playHeaderMetrics.titleWidth < 90 ||
    playHeaderMetrics.titleOverflow ||
    playHeaderMetrics.controls.some((control) => control.height < 30 || control.left < -1 || control.right > playHeaderMetrics.viewportWidth + 1) ||
    playHeaderMetrics.controls.some((control) => /x/i.test(control.text) && control.left < playHeaderMetrics.titleRight + 8 && control.right > playHeaderMetrics.titleLeft - 8)
  ) {
    failures.push("[" + viewportName + "] Play header lost compact HUD polish: " + JSON.stringify(playHeaderMetrics));
  }

  const howToPlayCardCount = await page.locator(".how-to-play.visual-guide").count();
  if (howToPlayCardCount !== 0) {
    failures.push("[" + viewportName + "] Cursor-mode large boards should not repeat the Pip lesson card.");
  }
  if (howToPlayCardCount > 0) {
  const howToPlayMetrics = await page.locator(".how-to-play.visual-guide").first().evaluate((card) => {
    const rect = card.getBoundingClientRect();
    const style = getComputedStyle(card);
    const cardBefore = getComputedStyle(card, "::before");
    const pip = card.querySelector(".guide-pip-scene__pip");
    const bubble = card.querySelector(".guide-pip-scene__bubble");
    const scene = card.querySelector(".guide-pip-scene");
    const pipRect = pip?.getBoundingClientRect();
    const bubbleRect = bubble?.getBoundingClientRect();
    const sceneRect = scene?.getBoundingClientRect();
    const pipStyle = pip ? getComputedStyle(pip) : null;
    const sceneBefore = scene ? getComputedStyle(scene, "::before") : null;
    const bubbleBefore = bubble ? getComputedStyle(bubble, "::before") : null;
    const bubbleStyle = bubble ? getComputedStyle(bubble) : null;
    const bubbleAfter = bubble ? getComputedStyle(bubble, "::after") : null;
    const firstClueRow = card.querySelector(".clue-guide__row");
    const clueRowAfter = firstClueRow ? getComputedStyle(firstClueRow, "::after") : null;
    const firstAction = card.querySelector(".guide-action");
    const firstActionIcon = firstAction?.querySelector(".guide-action__icon");
    const actionBefore = firstActionIcon ? getComputedStyle(firstActionIcon, "::before") : null;
    const clueRows = [...card.querySelectorAll(".clue-guide__row")].map((row) => {
      const rowRect = row.getBoundingClientRect();
      return { width: rowRect.width, height: rowRect.height };
    });
    const actions = [...card.querySelectorAll(".guide-action")].map((chip) => {
      const chipRect = chip.getBoundingClientRect();
      const icon = chip.querySelector(".guide-action__icon");
      const iconRect = icon?.getBoundingClientRect();
      const iconStyle = icon ? getComputedStyle(icon) : null;
      const iconBefore = icon ? getComputedStyle(icon, "::before") : null;
      const iconAfter = icon ? getComputedStyle(icon, "::after") : null;
      return {
        width: chipRect.width,
        height: chipRect.height,
        text: chip.textContent.trim(),
        action: chip.getAttribute("data-action") || "",
        display: getComputedStyle(chip).display,
        gridColumns: getComputedStyle(chip).gridTemplateColumns,
        iconWidth: iconRect?.width || 0,
        iconHeight: iconRect?.height || 0,
        iconBackground: iconStyle?.backgroundImage || "",
        iconBorderRadius: parseFloat(iconStyle?.borderRadius) || 0,
        iconShadow: iconStyle?.boxShadow || "",
        iconBeforeContent: iconBefore?.content || "",
        iconBeforeBackground: iconBefore?.backgroundImage || iconBefore?.borderRightColor || "",
        iconAfterContent: iconAfter?.content || "",
        iconAfterBackground: iconAfter?.backgroundImage || iconAfter?.borderRightColor || ""
      };
    });
    return {
      left: rect.left,
      right: rect.right,
      width: rect.width,
      height: rect.height,
      bottom: rect.bottom,
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
      radius: parseFloat(style.borderRadius),
      background: style.backgroundImage,
      cardBeforeBackground: typeof cardBefore !== "undefined" ? cardBefore.backgroundImage || "" : "",
      pipSrc: pip?.getAttribute("src") || "",
      pipWidth: pipRect?.width || 0,
      pipHeight: pipRect?.height || 0,
      pipFit: pipStyle?.objectFit || "",
      pipBackground: pipStyle?.backgroundImage || "",
      pipShadow: pipStyle?.boxShadow || "",
      pipRadius: pipStyle ? parseFloat(pipStyle.borderRadius) : 0,
      sceneBadgeContent: sceneBefore?.content || "none",
      sceneBadgeWidth: parseFloat(sceneBefore?.width) || 0,
      sceneBadgeHeight: parseFloat(sceneBefore?.height) || 0,
      sceneBadgeBackground: sceneBefore?.backgroundImage || "",
      sceneBadgeShadow: sceneBefore?.boxShadow || "none",
      sceneGridColumns: scene ? getComputedStyle(scene).gridTemplateColumns : "",
      pipRight: pipRect?.right || 0,
      bubbleLeft: bubbleRect?.left || 0,
      bubbleTailBackground: bubbleBefore?.backgroundImage || "",
      bubbleWidth: bubbleRect?.width || 0,
      bubbleHeight: bubbleRect?.height || 0,
      bubbleAspect: bubbleRect?.width ? bubbleRect.height / bubbleRect.width : 99,
      bubbleBackground: bubbleStyle?.backgroundImage || "",
      bubbleRadius: bubbleStyle ? parseFloat(bubbleStyle.borderRadius) : 0,
      bubbleShadow: bubbleStyle?.boxShadow || "",
      bubbleAccentBackground: bubbleAfter?.backgroundImage || "",
      sceneWidth: sceneRect?.width || 0,
      clueRows,
      actions,
      miniCells: card.querySelectorAll(".mini-cell").length,
      autoMarkCells: card.querySelectorAll(".mini-cell.auto-mark").length,
      autoMarkStyles: [...card.querySelectorAll(".mini-cell.auto-mark")].map((cell) => {
        const cellStyle = getComputedStyle(cell);
        const markStyle = getComputedStyle(cell, "::after");
        return {
          outlineStyle: cellStyle.outlineStyle,
          outlineOffset: cellStyle.outlineOffset,
          background: cellStyle.backgroundImage || "",
          markContent: markStyle.content || "",
          markBackground: markStyle.backgroundImage || "",
          markWidth: parseFloat(markStyle.width) || 0,
          markHeight: parseFloat(markStyle.height) || 0
        };
      }),
      pipLine: card.querySelector(".how-to-play__pip-line")?.textContent.trim() || "",
      lineHint: card.querySelector(".how-to-play__line-hint")?.textContent.trim() || "",
      clueRowAccentBackground: clueRowAfter?.backgroundImage || "",
      actionAccentContent: actionBefore?.content || "",
      actionAccentBackground: actionBefore?.backgroundImage || actionBefore?.borderRightColor || "",
      overflows: card.scrollWidth > Math.ceil(rect.width) + 1 || card.scrollHeight > Math.ceil(rect.height) + 1
    };
  });
  const maxHowToPlayHeight = howToPlayMetrics.viewportWidth >= 600 ? 430 : 330;
  if (
    howToPlayMetrics.left < -1 ||
    howToPlayMetrics.right > howToPlayMetrics.viewportWidth + 1 ||
    howToPlayMetrics.width > 570 ||
    howToPlayMetrics.height > maxHowToPlayHeight ||
    howToPlayMetrics.bottom > howToPlayMetrics.viewportHeight + 8 ||
    howToPlayMetrics.radius < 16 ||
    !howToPlayMetrics.background.includes("gradient") ||
    !howToPlayMetrics.cardBeforeBackground.includes("gradient") ||
    !howToPlayMetrics.pipSrc.includes("pip-chrome-v2") ||
    howToPlayMetrics.pipWidth < 52 ||
    howToPlayMetrics.pipHeight < 52 ||
    howToPlayMetrics.pipFit !== "contain" ||
    !howToPlayMetrics.pipBackground.includes("gradient") ||
    howToPlayMetrics.pipShadow === "none" ||
    howToPlayMetrics.pipRadius < 16 ||
    howToPlayMetrics.sceneBadgeContent === "none" ||
    howToPlayMetrics.sceneBadgeWidth < 16 ||
    howToPlayMetrics.sceneBadgeHeight < 16 ||
    !howToPlayMetrics.sceneBadgeBackground.includes("gradient") ||
    howToPlayMetrics.sceneBadgeShadow === "none" ||
    !howToPlayMetrics.sceneGridColumns.includes(" ") ||
    howToPlayMetrics.bubbleLeft < howToPlayMetrics.pipRight - 1 ||
    !howToPlayMetrics.bubbleTailBackground.includes("gradient") ||
    howToPlayMetrics.bubbleWidth < 180 ||
    howToPlayMetrics.bubbleHeight < 70 ||
    howToPlayMetrics.bubbleAspect > 1.45 ||
    !howToPlayMetrics.bubbleBackground.includes("gradient") ||
    howToPlayMetrics.bubbleRadius < 12 ||
    howToPlayMetrics.bubbleShadow === "none" ||
    !howToPlayMetrics.bubbleAccentBackground.includes("gradient") ||
    howToPlayMetrics.sceneWidth < 180 ||
    howToPlayMetrics.clueRows.length !== 2 ||
    howToPlayMetrics.clueRows.some((row) => row.height < 28) ||
    howToPlayMetrics.actions.length !== 3 ||
    howToPlayMetrics.actions.map((chip) => chip.action).join("|") !== "fill|mark|undo" ||
    howToPlayMetrics.actions.some((chip) => chip.height < 26 || !chip.text || (chip.display !== "inline-grid" && chip.display !== "grid") || !chip.gridColumns.includes("20px") || chip.iconWidth < 20 || chip.iconHeight < 20 || chip.iconBorderRadius < 7 || !chip.iconBackground.includes("gradient") || chip.iconShadow === "none" || chip.iconBeforeContent === "none") ||
    howToPlayMetrics.actions.filter((chip) => chip.action !== "fill").some((chip) => chip.iconAfterContent === "none") ||
    !howToPlayMetrics.clueRowAccentBackground.includes("gradient") ||
    howToPlayMetrics.actionAccentContent === "none" ||
    !howToPlayMetrics.actionAccentBackground.includes("gradient") ||
    howToPlayMetrics.miniCells !== 10 ||
    howToPlayMetrics.autoMarkCells !== 4 ||
    howToPlayMetrics.autoMarkStyles.some((cell) => cell.outlineStyle !== "dashed" || !cell.background.includes("gradient") || cell.markContent === "none" || !cell.markBackground.includes("gradient") || cell.markWidth < 10 || cell.markHeight < 10) ||
    !howToPlayMetrics.pipLine ||
    !howToPlayMetrics.lineHint ||
    howToPlayMetrics.overflows
  ) {
    failures.push("[" + viewportName + "] How-to guide lost polished mobile treatment: " + JSON.stringify(howToPlayMetrics));
  }
  }

  const cellCount = await page.locator(".puzzle-grid .puzzle-cell").count();
  if (cellCount !== 144) {
    failures.push("[" + viewportName + "] Bakery Window Glow should render 144 cells, saw " + cellCount);
  }

  const boardSize = await page.locator(".board-wrap").first().evaluate((board) => getComputedStyle(board).getPropertyValue("--board-size").trim());
  if (boardSize !== "12") {
    failures.push("[" + viewportName + "] 12x12 board CSS variable should be 12, saw " + boardSize);
  }

  const guideBoundaryMetrics = await page.locator(".puzzle-grid").first().evaluate((grid) => {
    const cells = [...grid.querySelectorAll(".puzzle-cell")];
    const describe = (cell) => {
      const row = Number(cell.dataset.row);
      const column = Number(cell.dataset.column);
      const rect = cell.getBoundingClientRect();
      const above = cells.find((candidate) => Number(candidate.dataset.row) === row - 1 && Number(candidate.dataset.column) === column);
      const left = cells.find((candidate) => Number(candidate.dataset.row) === row && Number(candidate.dataset.column) === column - 1);
      return {
        row,
        column,
        borderTopWidth: parseFloat(getComputedStyle(cell).borderTopWidth),
        borderLeftWidth: parseFloat(getComputedStyle(cell).borderLeftWidth),
        gapAbove: above ? rect.top - above.getBoundingClientRect().bottom : null,
        gapLeft: left ? rect.left - left.getBoundingClientRect().right : null
      };
    };
    const top = cells.filter((cell) => cell.classList.contains("board-guide-top")).map(describe);
    const left = cells.filter((cell) => cell.classList.contains("board-guide-left")).map(describe);
    return { top, left };
  });
  const expectedGuideRows = "4,8";
  const expectedGuideColumns = "4,8";
  const guideRows = [...new Set(guideBoundaryMetrics.top.map((cell) => cell.row))].join(",");
  const guideColumns = [...new Set(guideBoundaryMetrics.left.map((cell) => cell.column))].join(",");
  if (
    guideBoundaryMetrics.top.length !== 24 ||
    guideBoundaryMetrics.left.length !== 24 ||
    guideRows !== expectedGuideRows ||
    guideColumns !== expectedGuideColumns ||
    guideBoundaryMetrics.top.some((cell) => cell.borderTopWidth < 4 || cell.gapAbove === null || cell.gapAbove < 1) ||
    guideBoundaryMetrics.left.some((cell) => cell.borderLeftWidth < 4 || cell.gapLeft === null || cell.gapLeft < 1)
  ) {
    failures.push("[" + viewportName + "] 12x12 board guide boundaries should align to rows and columns 4 and 8: " + JSON.stringify(guideBoundaryMetrics));
  }

  const boardFrameMetrics = await page.locator(".board-wrap").first().evaluate((board) => {
    const rect = board.getBoundingClientRect();
    const style = getComputedStyle(board);
    const grid = board.querySelector(".puzzle-grid");
    const gridStyle = grid ? getComputedStyle(grid) : null;
    const gridRect = grid?.getBoundingClientRect();
    const columnClues = [...board.querySelectorAll(".column-clue")];
    const rowClues = [...board.querySelectorAll(".row-clue")];
    const cells = [...board.querySelectorAll(".puzzle-cell")];
    const firstCell = cells[0];
    const lastColumnCell = cells[columnClues.length - 1];
    const lastCell = cells[cells.length - 1];
    const firstCellRect = firstCell?.getBoundingClientRect();
    const lastColumnCellRect = lastColumnCell?.getBoundingClientRect();
    const lastCellRect = lastCell?.getBoundingClientRect();
    const centerOf = (rect, axis) => axis === "x"
      ? rect.left + rect.width / 2
      : rect.top + rect.height / 2;
    const columnCenterDeltas = columnClues.map((clue, columnIndex) => {
      const clueRect = clue.getBoundingClientRect();
      const cellRect = cells[columnIndex]?.getBoundingClientRect();
      return cellRect ? centerOf(clueRect, "x") - centerOf(cellRect, "x") : 999;
    });
    const rowCenterDeltas = rowClues.map((clue, rowIndex) => {
      const clueRect = clue.getBoundingClientRect();
      const cellRect = cells[rowIndex * columnClues.length]?.getBoundingClientRect();
      return cellRect ? centerOf(clueRect, "y") - centerOf(cellRect, "y") : 999;
    });
    const maxColumnCenterDelta = columnCenterDeltas.reduce((max, delta) => Math.max(max, Math.abs(delta)), 0);
    const maxRowCenterDelta = rowCenterDeltas.reduce((max, delta) => Math.max(max, Math.abs(delta)), 0);
    const clueTokens = [...board.querySelectorAll(".column-clue span, .row-clue span")].map((token) => {
      const tokenRect = token.getBoundingClientRect();
      return { width: tokenRect.width, height: tokenRect.height, radius: parseFloat(getComputedStyle(token).borderRadius) };
    });
    const maxClueTokenAspectDelta = clueTokens.reduce((max, token) => Math.max(max, Math.abs(token.width - token.height)), 0);
    const minClueTokenSize = clueTokens.reduce((min, token) => Math.min(min, token.width, token.height), Infinity);
    const minClueTokenRadius = clueTokens.reduce((min, token) => Math.min(min, token.radius), Infinity);
    const widestRowClue = [...board.querySelectorAll(".row-clue")].reduce((widest, clue) => {
      const clueRect = clue.getBoundingClientRect();
      return !widest || clueRect.width > widest.width ? clueRect : widest;
    }, null);
    let rowClueTokenOverflowSample = null;
    const rowClueTokenOverflow = [...board.querySelectorAll(".row-clue")].some((clue) => {
      const clueRect = clue.getBoundingClientRect();
      return [...clue.querySelectorAll("span")].some((span) => {
        const tokenRect = span.getBoundingClientRect();
        const overflows = tokenRect.left < clueRect.left - 1 || tokenRect.right > clueRect.right + 1;
        if (overflows && !rowClueTokenOverflowSample) {
          rowClueTokenOverflowSample = {
            text: clue.textContent.trim(),
            clueLeft: clueRect.left,
            clueRight: clueRect.right,
            tokenLeft: tokenRect.left,
            tokenRight: tokenRect.right
          };
        }
        return overflows;
      });
    });
    return {
      left: rect.left,
      right: rect.right,
      width: rect.width,
      viewportWidth: window.innerWidth,
      isolation: style.isolation,
      overflowX: style.overflowX,
      overflowY: style.overflowY,
      gridPosition: gridStyle?.position || "",
      gridZIndex: gridStyle?.zIndex || "",
      gridLeft: gridRect?.left || 0,
      gridRight: gridRect?.right || 0,
      columnCenterDeltas,
      rowCenterDeltas,
      maxColumnCenterDelta,
      maxRowCenterDelta,
      maxClueTokenAspectDelta,
      minClueTokenSize,
      minClueTokenRadius,
      firstCellCenter: firstCellRect ? firstCellRect.left + firstCellRect.width / 2 : 0,
      lastColumnCellCenter: lastColumnCellRect ? lastColumnCellRect.left + lastColumnCellRect.width / 2 : 0,
      firstRowCellCenter: firstCellRect ? firstCellRect.top + firstCellRect.height / 2 : 0,
      lastCellRowCenter: lastCellRect ? lastCellRect.top + lastCellRect.height / 2 : 0,
      widestRowClueLeft: widestRowClue?.left || 0,
      widestRowClueRight: widestRowClue?.right || 0,
      rowClueTokenOverflow,
      rowClueTokenOverflowSample
    };
  });
  if (
    boardFrameMetrics.left < -1 ||
    boardFrameMetrics.right > boardFrameMetrics.viewportWidth + 1 ||
    boardFrameMetrics.isolation !== "isolate" ||
    boardFrameMetrics.overflowX === "visible" ||
    boardFrameMetrics.overflowY === "visible" ||
    boardFrameMetrics.gridPosition !== "relative" ||
    Number(boardFrameMetrics.gridZIndex) !== 2 ||
    boardFrameMetrics.widestRowClueLeft < boardFrameMetrics.left - 1 ||
    boardFrameMetrics.rowClueTokenOverflow ||
    boardFrameMetrics.maxClueTokenAspectDelta > 1 ||
    boardFrameMetrics.minClueTokenSize < 10.5 ||
    boardFrameMetrics.minClueTokenRadius < boardFrameMetrics.minClueTokenSize * 0.45 ||
    boardFrameMetrics.widestRowClueRight > boardFrameMetrics.gridLeft - 2 ||
    boardFrameMetrics.maxColumnCenterDelta > 2 ||
    boardFrameMetrics.maxRowCenterDelta > 2
  ) {
    failures.push("[" + viewportName + "] Puzzle board frame should stay clipped and aligned on mobile: " + JSON.stringify(boardFrameMetrics));
  }

  const hintText = await page.locator(".hint-panel").first().innerText();
  if (!hintText.includes("4")) {
    failures.push("[" + viewportName + "] 12x12 puzzle should expose 4 hints, saw " + hintText);
  }
  const hintButtonMetrics = await page.locator(".hint-button").first().evaluate((button) => {
    const rect = button.getBoundingClientRect();
    const meter = document.querySelector(".hint-panel__meter");
    const meterRect = meter?.getBoundingClientRect();
    const meterStyle = meter ? getComputedStyle(meter) : null;
    const image = button.querySelector(".hint-button__raster-art");
    const dots = [...document.querySelectorAll(".hint-panel__meter-dot")].map((dot) => {
      const dotRect = dot.getBoundingClientRect();
      const dotStyle = getComputedStyle(dot);
      const afterStyle = getComputedStyle(dot, "::after");
      return {
        width: dotRect.width,
        height: dotRect.height,
        background: dotStyle.backgroundImage || dotStyle.backgroundColor || "",
        shadow: dotStyle.boxShadow || "",
        handleContent: afterStyle.content || "",
        handleWidth: parseFloat(afterStyle.width) || 0,
        handleHeight: parseFloat(afterStyle.height) || 0,
        handleBackground: afterStyle.backgroundImage || afterStyle.backgroundColor || ""
      };
    });
    return {
      width: rect.width,
      height: rect.height,
      visibleText: button.textContent.trim(),
      ariaLabel: button.getAttribute("aria-label") || "",
      iconCount: button.querySelectorAll(".hint-button__icon").length,
      assetId: image?.dataset.assetId || "",
      imageNaturalWidth: image?.naturalWidth || 0,
      imageNaturalHeight: image?.naturalHeight || 0,
      meterWidth: meterRect?.width || 0,
      meterHeight: meterRect?.height || 0,
      meterBackground: meterStyle?.backgroundImage || "",
      meterShadow: meterStyle?.boxShadow || "",
      meterDots: dots.length,
      meterAvailable: document.querySelectorAll(".hint-panel__meter-dot.available").length,
      meterLabel: meter?.getAttribute("aria-label") || "",
      dots
    };
  });
  if (
    hintButtonMetrics.width < 48 ||
    hintButtonMetrics.height < 48 ||
    hintButtonMetrics.visibleText.length > 0 ||
    !hintButtonMetrics.ariaLabel ||
    hintButtonMetrics.iconCount !== 1 ||
    hintButtonMetrics.assetId !== "puzzle-control-hint-v1" ||
    hintButtonMetrics.imageNaturalWidth !== 256 ||
    hintButtonMetrics.imageNaturalHeight !== 256 ||
    hintButtonMetrics.meterHeight < 22 ||
    !hintButtonMetrics.meterBackground.includes("gradient") ||
    hintButtonMetrics.meterShadow === "none" ||
    hintButtonMetrics.meterDots !== 4 ||
    hintButtonMetrics.meterAvailable !== 4 ||
    !hintButtonMetrics.meterLabel ||
    hintButtonMetrics.dots.some((dot) => dot.width < 12 || dot.height < 12 || !dot.background.includes("gradient") || dot.shadow === "none" || dot.handleContent === "none" || dot.handleWidth < 4 || dot.handleHeight < 10 || !dot.handleBackground)
  ) {
    failures.push("[" + viewportName + "] Hint button should be an accessible icon-only control with spoon-token allowance art: " + JSON.stringify(hintButtonMetrics));
  }

  const controlMetrics = await page.locator(".controls .control-button").evaluateAll((buttons) => buttons.map((button) => {
    const rect = button.getBoundingClientRect();
    const style = getComputedStyle(button);
    const label = button.querySelector(".control-button__label");
    const icon = button.querySelector(".control-button__icon");
    const iconRect = icon?.getBoundingClientRect();
    const iconStyle = icon ? getComputedStyle(icon) : null;
    const beforeStyle = icon ? getComputedStyle(icon, "::before") : null;
    const afterStyle = icon ? getComputedStyle(icon, "::after") : null;
    const image = icon?.querySelector("img");
    return {
      text: (label?.textContent || "").trim(),
      className: icon?.className || "",
      width: rect.width,
      height: rect.height,
      background: style.backgroundImage,
      cardBeforeBackground: typeof cardBefore !== "undefined" ? cardBefore.backgroundImage || "" : "",
      iconWidth: iconRect?.width || 0,
      iconHeight: iconRect?.height || 0,
      iconBackground: iconStyle?.backgroundImage || "",
      iconShadow: iconStyle?.boxShadow || "",
      assetId: image?.dataset.assetId || "",
      imageSrc: image?.getAttribute("src") || "",
      imageNaturalWidth: image?.naturalWidth || 0,
      imageNaturalHeight: image?.naturalHeight || 0,
      beforeWidth: parseFloat(beforeStyle?.width) || 0,
      beforeHeight: parseFloat(beforeStyle?.height) || 0,
      beforeTransform: beforeStyle?.transform || "",
      beforeBoxShadow: beforeStyle?.boxShadow || "",
      afterWidth: parseFloat(afterStyle?.width) || 0,
      afterHeight: parseFloat(afterStyle?.height) || 0,
      afterTransform: afterStyle?.transform || "",
      symbolBackground: beforeStyle?.backgroundImage || beforeStyle?.backgroundColor || "",
      shineContent: afterStyle?.content || "",
      ariaLabel: button.getAttribute("aria-label") || "",
      overflows: button.scrollWidth > Math.ceil(rect.width) + 1 || button.scrollHeight > Math.ceil(rect.height) + 1
    };
  }));
  const fillToken = controlMetrics.find((metrics) => metrics.className.includes("control-button__icon--fill"));
  const markToken = controlMetrics.find((metrics) => metrics.className.includes("control-button__icon--mark"));
  const undoToken = controlMetrics.find((metrics) => metrics.className.includes("control-button__icon--undo"));
  const expectedControlAssets = new Map([
    [fillToken, "puzzle-control-fill-v1"],
    [markToken, "puzzle-control-mark-v1"],
    [undoToken, "puzzle-control-undo-v1"]
  ]);
  if (controlMetrics.length !== 0) {
    failures.push("[" + viewportName + "] Cursor-mode large boards should not repeat tap-mode puzzle controls: " + JSON.stringify(controlMetrics));
  }

  const progressMetrics = await page.locator(".progress-line").first().evaluate((line) => {
    const rect = line.getBoundingClientRect();
    const style = getComputedStyle(line);
    const mark = line.querySelector(".progress-line__mark");
    const text = line.querySelector(".progress-line__text");
    const badge = line.querySelector(".progress-line__badge");
    const markRect = mark?.getBoundingClientRect();
    const badgeRect = badge?.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      viewportWidth: window.innerWidth,
      background: style.backgroundImage,
      cardBeforeBackground: typeof cardBefore !== "undefined" ? cardBefore.backgroundImage || "" : "",
      borderRadius: parseFloat(style.borderRadius),
      markWidth: markRect?.width || 0,
      markHeight: markRect?.height || 0,
      text: (text?.textContent || "").trim(),
      badgeText: (badge?.textContent || "").trim(),
      badgeWidth: badgeRect?.width || 0,
      badgeHeight: badgeRect?.height || 0,
      progressRatio: style.getPropertyValue("--progress-ratio").trim(),
      overflow: style.overflow,
      overflows: line.scrollWidth > Math.ceil(rect.width) + 1 || line.scrollHeight > Math.ceil(rect.height) + 1
    };
  });
  if (progressMetrics.width > progressMetrics.viewportWidth || progressMetrics.height < 32 || progressMetrics.borderRadius < 16 || progressMetrics.markWidth !== 0 || progressMetrics.markHeight !== 0 || !/^\d+\s*\/\s*\d+$/.test(progressMetrics.text) || progressMetrics.badgeText || progressMetrics.overflows) {
    failures.push("[" + viewportName + "] Puzzle progress line lost compact chip treatment: " + JSON.stringify(progressMetrics));
  }

  const toolShelfMetrics = await page.evaluate(() => {
    const controls = document.querySelector(".puzzle-panel .controls");
    const hint = document.querySelector(".puzzle-panel .hint-panel");
    const progress = document.querySelector(".puzzle-panel .progress-line");
    const read = (node) => {
      if (!node) {
        return null;
      }
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return {
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        width: rect.width,
        height: rect.height,
        radius: parseFloat(style.borderRadius),
        bottomRadius: parseFloat(style.borderBottomLeftRadius),
        background: style.backgroundImage,
        cardBeforeBackground: typeof cardBefore !== "undefined" ? cardBefore.backgroundImage || "" : "",
        marginTop: parseFloat(style.marginTop) || 0
      };
    };
    return {
      viewportWidth: window.innerWidth,
      controls: read(controls),
      hint: read(hint),
      progress: read(progress)
    };
  });
  const shelfNodes = [toolShelfMetrics.hint, toolShelfMetrics.progress];
  const controlsAreAbsent = toolShelfMetrics.controls === null;
  const progressAfterHint = toolShelfMetrics.progress.top > toolShelfMetrics.hint.bottom;
  if (
    shelfNodes.some((metrics) => !metrics || metrics.left < -1 || metrics.right > toolShelfMetrics.viewportWidth + 1 || metrics.width > 530) ||
    !controlsAreAbsent ||
    !progressAfterHint ||
    toolShelfMetrics.hint.radius < 16 ||
    !toolShelfMetrics.hint.background.includes("gradient")
  ) {
    failures.push("[" + viewportName + "] Cursor-mode tool shelf should keep only hint and progress cards: " + JSON.stringify({ ...toolShelfMetrics, controlsAreAbsent, progressAfterHint }));
  }

  await expectPuzzleBoardFramePolish(page, viewportName);
  await expectCompletedLineGuidance(page, viewportName);
  await expectDragPreviewPolish(page, viewportName);
  await expectNoHorizontalOverflow(page, viewportName);
  await page.locator(".play-screen__back").click();
}

async function expectDragPreviewPolish(page, viewportName) {
  const cells = page.locator(".puzzle-grid .puzzle-cell");
  const firstBox = await cells.nth(2).boundingBox();
  const secondBox = await cells.nth(3).boundingBox();
  if (!firstBox || !secondBox) {
    failures.push("[" + viewportName + "] Could not locate board cells for drag preview QA");
    return;
  }

  const start = {
    x: firstBox.x + firstBox.width / 2,
    y: firstBox.y + firstBox.height / 2
  };
  const end = {
    x: secondBox.x + secondBox.width / 2,
    y: secondBox.y + secondBox.height / 2
  };
  await cells.nth(2).dispatchEvent("pointerdown", {
    pointerId: 77,
    pointerType: "touch",
    isPrimary: true,
    button: 0,
    buttons: 1,
    clientX: start.x,
    clientY: start.y
  });
  await page.locator(".puzzle-grid").first().dispatchEvent("pointermove", {
    pointerId: 77,
    pointerType: "touch",
    isPrimary: true,
    button: 0,
    buttons: 1,
    clientX: end.x,
    clientY: end.y
  });

  const metrics = await page.evaluate(() => ({
    previewCount: document.querySelectorAll(".puzzle-cell.drag-preview").length,
    selectedCount: document.querySelectorAll(".puzzle-cell.selected").length,
    filledCount: document.querySelectorAll(".puzzle-cell.filled").length,
    markedCount: document.querySelectorAll(".puzzle-cell.marked").length
  }));

  await page.evaluate(() => {
    const event = typeof PointerEvent === "function"
      ? new PointerEvent("pointerup", { pointerId: 77, pointerType: "touch", isPrimary: true, bubbles: true })
      : new MouseEvent("pointerup", { bubbles: true });
    window.dispatchEvent(event);
  });

  if (metrics.previewCount !== 0 || metrics.selectedCount !== 1 || metrics.filledCount !== 0 || metrics.markedCount !== 0) {
    failures.push("[" + viewportName + "] Cursor-mode board drag must only move the selection, never preview or change cells: " + JSON.stringify(metrics));
  }
}
async function expectPuzzleBoardFramePolish(page, viewportName) {
  const metrics = await page.evaluate(() => {
    const panel = document.querySelector(".puzzle-panel:not(.completed)");
    const meta = document.querySelector(".play-screen__header");
    const board = panel?.querySelector(".board-wrap:not(.locked)");
    const grid = panel?.querySelector(".puzzle-grid");
    const activeClue = panel?.querySelector(".row-clue.active, .column-clue.active");
    const read = (node) => {
      if (!node) {
        return null;
      }
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return {
        left: rect.left,
        right: rect.right,
        width: rect.width,
        height: rect.height,
        radius: parseFloat(style.borderRadius),
        background: style.backgroundImage,
      cardBeforeBackground: typeof cardBefore !== "undefined" ? cardBefore.backgroundImage || "" : "",
        shadow: style.boxShadow,
        borderWidth: parseFloat(style.borderTopWidth) || 0
      };
    };
    return {
      viewportWidth: window.innerWidth,
      panel: read(panel),
      meta: read(meta),
      board: read(board),
      grid: read(grid),
      activeClue: read(activeClue)
    };
  });
  if (
    !metrics.panel ||
    !metrics.meta ||
    !metrics.board ||
    !metrics.grid ||
    !metrics.activeClue ||
    metrics.panel.radius < 16 ||
    !metrics.panel.background.includes("gradient") ||
    metrics.panel.shadow === "none" ||
    metrics.meta.width > 530 ||
    metrics.meta.left < -1 ||
    metrics.meta.right > metrics.viewportWidth + 1 ||
    Math.max(metrics.meta.radius, metrics.meta.bottomRadius) < 16 ||
    !metrics.meta.background.includes("gradient") ||
    metrics.board.left < -1 ||
    metrics.board.right > metrics.viewportWidth + 1 ||
    metrics.board.radius < 16 ||
    !metrics.board.background.includes("gradient") ||
    metrics.board.shadow === "none" ||
    metrics.grid.borderWidth < 2 ||
    metrics.grid.radius < 12 ||
    !metrics.grid.background.includes("gradient") ||
    metrics.grid.right > metrics.viewportWidth + 1 ||
    !metrics.activeClue.background.includes("gradient")
  ) {
    failures.push("[" + viewportName + "] Puzzle board frame lost polished paper-tray treatment: " + JSON.stringify(metrics));
  }
}

async function expectCompletedLineGuidance(page, viewportName) {
  const before = await page.evaluate(() => ({
    filled: document.querySelectorAll(".puzzle-cell.filled").length,
    marked: document.querySelectorAll(".puzzle-cell.marked").length,
    selected: document.querySelectorAll(".puzzle-cell.selected").length
  }));
  await page.locator(".puzzle-grid .puzzle-cell").nth(6).click();
  const after = await page.evaluate(() => ({
    filled: document.querySelectorAll(".puzzle-cell.filled").length,
    marked: document.querySelectorAll(".puzzle-cell.marked").length,
    selected: document.querySelectorAll(".puzzle-cell.selected").length,
    lockedLeakCount: document.querySelectorAll(".board-wrap.locked .line-complete, .board-wrap.locked .safe-suggestion, .board-wrap.locked .completed-row, .board-wrap.locked .completed-column").length
  }));
  if (after.filled !== before.filled || after.marked !== before.marked || after.selected !== 1 || after.lockedLeakCount > 0) {
    failures.push("[" + viewportName + "] Cursor-mode board presses must only move one selection and never change puzzle state: " + JSON.stringify({ before, after }));
  }
}
async function seedLargeBoardCatalogAccess(page) {
  await page.evaluate(() => {
    const player = { id: "jay", name: "Jay" };
    localStorage.setItem("pips-picture-pantry:v0.1:active-player", JSON.stringify(player));
    localStorage.setItem("pips-picture-pantry:v0.1:players", JSON.stringify([player]));
    const saveKey = "pips-picture-pantry:v0.1:save:jay";
    const save = JSON.parse(localStorage.getItem(saveKey) || "{}");
    save.puzzleStates = save.puzzleStates || {};
    save.completedPuzzleIds = Array.isArray(save.completedPuzzleIds) ? save.completedPuzzleIds : [];
    save.rewardedPuzzleIds = Array.isArray(save.rewardedPuzzleIds) ? save.rewardedPuzzleIds : [];
    save.dailyRewardedDates = Array.isArray(save.dailyRewardedDates) ? save.dailyRewardedDates : [];
    save.unlockedPackIds = Array.from(new Set([...(Array.isArray(save.unlockedPackIds) ? save.unlockedPackIds : []), "pips-first-shelf", "bakery-window", "village-pantry"]));
    save.pantrySpoons = Math.max(500, Number(save.pantrySpoons || 0));
    save.pantryCompletedStoryGoalIds = Array.from(new Set([...(Array.isArray(save.pantryCompletedStoryGoalIds) ? save.pantryCompletedStoryGoalIds : []), "small-jam-jar", "sunny-window-curtains", "recipe-card-shelf", "mint-check-rug", "herb-pot", "cork-board", "tiny-succulent", "spoon-wall-clock", "berry-tea-tins", "ribbon-rolling-pin"]));
    localStorage.setItem(saveKey, JSON.stringify(save));
  });
}

async function verifyFeaturedBadgeFlow(page, viewportName) {
  await page.evaluate(async () => {
    const { seasonShelves } = await import("/src/data/seasonShelves.js");
    const player = JSON.parse(localStorage.getItem("pips-picture-pantry:v0.1:active-player") || "null");
    const saveKey = "pips-picture-pantry:v0.1:save:" + player.id;
    const save = JSON.parse(localStorage.getItem(saveKey) || "{}");
    save.completedPuzzleIds = [...seasonShelves[0].puzzleIds];
    save.ownedJarIds = ["strawberry-jam", "blueberry-jam", "cherry-jam", "orange-marmalade", "lemon-curd", "peach-preserve"];
    save.equippedJars = { jam: "strawberry-jam" };
    save.unlockedShelfIds = ["shelf-pips-first", "shelf-sunny-counter"];
    save.featuredBadgeId = null;
    localStorage.setItem(saveKey, JSON.stringify(save));
  });
  await page.reload({ waitUntil: "networkidle" });
  await page.locator(".brand-intro.game-stage").waitFor({ state: "visible", timeout: 6000 });
  await page.waitForTimeout(800);
  await dismissIntro(page, "Jay", viewportName);
  await dismissGuideIfPresent(page, viewportName);
  await openFloatingView(page, "map", viewportName);
  const lockedBadge = page.locator(".badge-slot.locked").first();
  await lockedBadge.click();
  await page.locator(".badge-detail.visible").waitFor({ state: "visible", timeout: 2000 });
  const lockedDetailMetrics = await page.evaluate(() => {
    const slotProgress = document.querySelector(".badge-slot.locked .badge-slot__lock")?.textContent?.trim() || "";
    const detail = document.querySelector(".badge-detail.visible");
    const circle = detail?.querySelector(":scope > .badge-circle.locked");
    const image = circle?.querySelector("img");
    const lock = circle?.querySelector(".badge-slot__lock");
    return {
      hasLockedCircle: Boolean(circle),
      slotProgress,
      detailProgress: lock?.textContent?.trim() || "",
      opacity: image ? Number.parseFloat(getComputedStyle(image).opacity) : 1,
      filter: image ? getComputedStyle(image).filter : "none",
      featureActionCount: detail?.querySelectorAll(".badge-detail__feature").length || 0
    };
  });
  if (!lockedDetailMetrics.hasLockedCircle
    || !lockedDetailMetrics.slotProgress
    || lockedDetailMetrics.detailProgress !== lockedDetailMetrics.slotProgress
    || lockedDetailMetrics.opacity > 0.3
    || !lockedDetailMetrics.filter.includes("grayscale")
    || lockedDetailMetrics.featureActionCount !== 0) {
    failures.push("[" + viewportName + "] Locked badge detail preview exposed full artwork or mismatched progress: " + JSON.stringify(lockedDetailMetrics));
  }
  const earnedBadge = page.locator(".badge-slot.earned").first();
  await earnedBadge.click();
  const featureButton = page.locator(".badge-detail__feature");
  await expectVisible(page, ".badge-detail__feature", viewportName);
  if (await featureButton.isDisabled()) {
    failures.push("[" + viewportName + "] Newly selected earned badge was already marked as featured.");
  }
  await featureButton.click();
  if (!(await featureButton.isDisabled())) {
    failures.push("[" + viewportName + "] Featured badge action did not switch to its disabled displayed state.");
  }
  await page.locator(".floating-nav__trigger").click();
  await page.locator(".floating-nav[data-open='true']").waitFor({ state: "visible", timeout: 3000 });
  await page.locator(".floating-nav__item[data-view='puzzle']").click();
  await page.locator(".puzzle-home-scene").waitFor({ state: "visible", timeout: 5000 });
  await page.locator(".puzzle-home-destination--puzzle").click();
  await page.locator(".puzzle-picker").waitFor({ state: "visible", timeout: 5000 });
  const nextStagePuzzle = page.locator("[data-shelf-id='shelf-sunny-counter'] .puzzle-chip").first();
  await nextStagePuzzle.click();
  await page.locator(".play-screen").waitFor({ state: "visible", timeout: 5000 });
  await dismissGuideIfPresent(page, viewportName);
  await page.locator(".play-screen__back").click();
  await page.locator(".puzzle-home-scene").waitFor({ state: "visible", timeout: 5000 });
  await expectVisible(page, ".puzzle-home-scene__featured-badge", viewportName);
  await expectVisible(page, ".puzzle-home-scene__featured-jar", viewportName);
  const keepsakeLayout = await page.evaluate(() => {
    const toRect = (element) => element?.getBoundingClientRect() || null;
    const overlaps = (a, b) => Boolean(a && b && !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom));
    const badge = toRect(document.querySelector(".puzzle-home-scene__featured-badge"));
    const jar = toRect(document.querySelector(".puzzle-home-scene__featured-jar"));
    const play = toRect(document.querySelector(".puzzle-home-scene__play"));
    const greeting = toRect(document.querySelector(".puzzle-home-scene__greeting"));
    const scene = toRect(document.querySelector(".puzzle-home-scene"));
    const destinationHits = [...document.querySelectorAll(".puzzle-home-destination")]
      .filter((element) => overlaps(jar, toRect(element)) || overlaps(badge, toRect(element)))
      .map((element) => element.getAttribute("data-view") || element.className);
    return {
      missing: !badge || !jar || !play || !scene,
      baselineDelta: badge && jar ? Math.abs(badge.bottom - jar.bottom) : 999,
      keepsakesOverlap: overlaps(badge, jar),
      playOverlap: overlaps(badge, play) || overlaps(jar, play),
      greetingOverlap: overlaps(badge, greeting) || overlaps(jar, greeting),
      destinationHits,
      outsideScene: Boolean(scene && [badge, jar].some((rect) => rect && (
        rect.left < scene.left || rect.right > scene.right || rect.top < scene.top || rect.bottom > scene.bottom
      ))),
      rects: Object.fromEntries(Object.entries({ badge, jar, play, greeting, scene }).map(([key, rect]) => [
        key,
        rect ? { left: Math.round(rect.left), top: Math.round(rect.top), right: Math.round(rect.right), bottom: Math.round(rect.bottom) } : null
      ]))
    };
  });
  if (keepsakeLayout.missing
    || keepsakeLayout.baselineDelta > 2
    || keepsakeLayout.keepsakesOverlap
    || keepsakeLayout.playOverlap
    || keepsakeLayout.greetingOverlap
    || keepsakeLayout.destinationHits.length
    || keepsakeLayout.outsideScene) {
    failures.push("[" + viewportName + "] Workshop keepsake row geometry failed: " + JSON.stringify(keepsakeLayout));
  }
  await page.locator(".puzzle-home-scene__featured-badge").click({ force: keepsakeLayout.playOverlap });
  await expectVisible(page, ".map-panel", viewportName);
  await page.locator(".floating-nav__trigger").click();
  await page.locator(".floating-nav[data-open='true']").waitFor({ state: "visible", timeout: 3000 });
  await page.locator(".floating-nav__item[data-view='puzzle']").click();
  await page.locator(".puzzle-home-destination--puzzle").click();
  const firstShelfToggle = page.locator(".shelf-collapse-toggle[data-shelf-toggle='shelf-pips-first']");
  if ((await firstShelfToggle.getAttribute("aria-expanded")) !== "true") {
    await firstShelfToggle.click();
  }
  await page.locator(".puzzle-chip[data-puzzle-id='pips-first-shelf-pip-face-1']").click();
  await page.locator(".play-screen").waitFor({ state: "visible", timeout: 5000 });
  await dismissGuideIfPresent(page, viewportName);
  await page.locator(".play-screen__back").click();
  await page.locator(".puzzle-home-scene").waitFor({ state: "visible", timeout: 5000 });
  await page.evaluate(() => {
    const player = JSON.parse(localStorage.getItem("pips-picture-pantry:v0.1:active-player") || "null");
    const saveKey = "pips-picture-pantry:v0.1:save:" + player.id;
    const save = JSON.parse(localStorage.getItem(saveKey) || "{}");
    save.completedPuzzleIds = ["pips-first-shelf-pip-face-1"];
    localStorage.setItem(saveKey, JSON.stringify(save));
  });
}

async function seedCompletedStarter(page) {
  await page.evaluate(() => {
    const player = { id: "jay", name: "Jay" };
    localStorage.setItem("pips-picture-pantry:v0.1:active-player", JSON.stringify(player));
    localStorage.setItem("pips-picture-pantry:v0.1:players", JSON.stringify([player]));
    const saveKey = "pips-picture-pantry:v0.1:save:jay";
    const cells = [
      ["empty", "filled", "filled", "filled", "empty"],
      ["filled", "filled", "filled", "filled", "filled"],
      ["filled", "empty", "filled", "empty", "filled"],
      ["filled", "filled", "filled", "filled", "filled"],
      ["empty", "filled", "filled", "filled", "empty"]
    ];
    const state = {
      puzzleId: "pips-first-shelf-pip-face-1",
      mode: "fill",
      cells,
      history: [],
      completed: true,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(saveKey, JSON.stringify({
      puzzleStates: { "pips-first-shelf-pip-face-1": JSON.stringify(state) },
      completedPuzzleIds: ["pips-first-shelf-pip-face-1"],
      rewardedPuzzleIds: ["pips-first-shelf-pip-face-1"],
      dailyRewardedDates: [],
      unlockedPackIds: ["pips-first-shelf"],
      pantrySpoons: 3
    }));
  });
}




async function verifyPantryPlacement(page, viewportName) {
  await expectVisible(page, ".pantry-jar-panel", viewportName);
  await expectVisible(page, ".pantry-jar-shelves", viewportName);
  await expectVisible(page, ".spoon-store", viewportName);
  await expectAbsent(page, ".pantry-room, .pantry-room-overlays, .pantry-shop, .pantry-item-card, .pantry-story-request, .pantry-story-milestone", viewportName);

  const metrics = await page.evaluate(() => {
    const panel = document.querySelector(".pantry-jar-panel");
    const shelves = [...document.querySelectorAll(".pantry-shelf")];
    const jars = [...document.querySelectorAll(".pantry-jar")];
    const store = document.querySelector(".spoon-store");
    return {
      panelOverflowsX: panel
        ? document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
        : true,
      shelfCount: shelves.length,
      shelfJarCounts: shelves.map((shelf) => shelf.querySelectorAll(".pantry-jar").length),
      jarCount: jars.length,
      starterCount: jars.filter((jar) => jar.classList.contains("rarity-starter")).length,
      ownedStarterCount: jars.filter((jar) => jar.classList.contains("rarity-starter") && jar.classList.contains("owned")).length,
      equippedStarterCount: jars.filter((jar) => jar.classList.contains("rarity-starter") && jar.classList.contains("equipped")).length,
      jarOverflowCount: jars.filter((jar) => jar.scrollWidth > jar.clientWidth + 1).length,
      storeProductCount: store?.querySelectorAll(".support-pack-card").length || 0,
      storeAfterShelves: Boolean(store && document.querySelector(".pantry-jar-shelves")?.compareDocumentPosition(store) & Node.DOCUMENT_POSITION_FOLLOWING),
      storeOverflowsX: store ? store.scrollWidth > store.clientWidth + 1 : true
    };
  });
  if (metrics.panelOverflowsX
    || metrics.shelfCount !== 8
    || metrics.shelfJarCounts.some((count) => count !== 6)
    || metrics.jarCount !== 48
    || metrics.starterCount !== 8
    || metrics.ownedStarterCount !== 8
    || metrics.equippedStarterCount !== 8
    || metrics.jarOverflowCount
    || metrics.storeProductCount !== 2
    || !metrics.storeAfterShelves
    || metrics.storeOverflowsX) {
    failures.push("[" + viewportName + "] Pantry jar shelf layout regressed: " + JSON.stringify(metrics));
  }

  const firstUnowned = page.locator(".pantry-jar.unowned").first();
  if (await firstUnowned.count()) {
    await firstUnowned.click();
    await page.locator(".pantry-jar-detail-backdrop.visible").waitFor({ state: "visible", timeout: 2000 });
    await page.waitForTimeout(300);
    const detailMetrics = await page.locator(".pantry-jar-detail").evaluate((detail) => {
      const rect = detail.getBoundingClientRect();
      return {
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      };
    });
    if (detailMetrics.left < -1
      || detailMetrics.right > detailMetrics.viewportWidth + 1
      || detailMetrics.bottom > detailMetrics.viewportHeight + 1) {
      failures.push("[" + viewportName + "] Pantry jar detail sheet escaped viewport: " + JSON.stringify(detailMetrics));
    }
    const buyButton = page.locator(".pantry-jar-detail__btn-buy");
    if (await buyButton.count() && await buyButton.isEnabled()) {
      const beforePurchase = await page.evaluate(() => {
        const player = JSON.parse(localStorage.getItem("pips-picture-pantry:v0.1:active-player") || "null");
        const save = player
          ? JSON.parse(localStorage.getItem("pips-picture-pantry:v0.1:save:" + player.id) || "{}")
          : {};
        return Number(save.pantrySpoons) || 0;
      });
      await buyButton.click();
      await page.locator(".pantry-jar-panel").waitFor({ state: "visible", timeout: 2000 });
      await page.waitForTimeout(150);
      const purchaseMetrics = await page.evaluate(() => {
        const player = JSON.parse(localStorage.getItem("pips-picture-pantry:v0.1:active-player") || "null");
        const save = player
          ? JSON.parse(localStorage.getItem("pips-picture-pantry:v0.1:save:" + player.id) || "{}")
          : {};
        const chip = document.querySelector(".spoon-balance-chip");
        return {
          afterPurchase: Number(save.pantrySpoons) || 0,
          chipCount: document.querySelectorAll(".spoon-balance-chip").length,
          localBalanceCount: document.querySelectorAll(".pantry-jar-balance, .puzzle-home-scene__currency, .currency-pill").length,
          chipText: chip?.textContent?.trim() || "",
          chipLabel: chip?.getAttribute("aria-label") || ""
        };
      });
      if (purchaseMetrics.afterPurchase >= beforePurchase
        || purchaseMetrics.chipCount !== 1
        || purchaseMetrics.localBalanceCount !== 0
        || !purchaseMetrics.chipText.includes(String(purchaseMetrics.afterPurchase))
        || !purchaseMetrics.chipLabel.includes(String(purchaseMetrics.afterPurchase))) {
        failures.push("[" + viewportName + "] Pantry purchase did not refresh shared spoon balance immediately: " + JSON.stringify({ beforePurchase, ...purchaseMetrics }));
      }
    } else {
      failures.push("[" + viewportName + "] Pantry purchase QA could not find an affordable unowned jar");
      await page.locator(".pantry-jar-detail__btn-close").click();
    }
  }
  await expectNoHorizontalOverflow(page, viewportName);
}

async function expectNoSharedScreenHeader(page, viewportName) {
  await expectAbsent(page, '.top-bar', viewportName);
}

async function expectSpoonBalanceChipSize(page, viewportName, viewName) {
  const metrics = await page.evaluate(() => {
    const chips = [...document.querySelectorAll(".spoon-balance-chip")];
    const chip = chips[0] || null;
    const icon = chip?.querySelector(".spoon-icon") || null;
    const chipRect = chip?.getBoundingClientRect() || null;
    const iconRect = icon?.getBoundingClientRect() || null;
    const shell = document.querySelector(".app-shell");
    const needsSettingsClearance = Boolean(shell?.classList.contains("app-shell--workshop-home") || shell?.classList.contains("app-shell--play"));
    const collisionSelectors = [
      ".puzzle-home-scene__settings",
      ".play-screen__settings",
      ".puzzle-home-scene__title",
      ".puzzle-picker h2",
      ".album-panel h2",
      ".map-panel h2",
      ".pantry-panel h2",
      ".time-attack-panel h2",
      ".spoon-run-view h2"
    ];
    const overlaps = chipRect
      ? collisionSelectors.flatMap((selector) => [...document.querySelectorAll(selector)]
        .filter((target) => {
          const style = getComputedStyle(target);
          const rect = target.getBoundingClientRect();
          return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
        })
        .filter((target) => {
          const rect = target.getBoundingClientRect();
          return chipRect.left < rect.right && chipRect.right > rect.left && chipRect.top < rect.bottom && chipRect.bottom > rect.top;
        })
        .map(() => selector))
      : [];
    const player = JSON.parse(localStorage.getItem("pips-picture-pantry:v0.1:active-player") || "null");
    const save = player
      ? JSON.parse(localStorage.getItem("pips-picture-pantry:v0.1:save:" + player.id) || "{}")
      : {};
    return {
      chipCount: chips.length,
      localBalanceCount: document.querySelectorAll(".pantry-jar-balance, .puzzle-home-scene__currency, .currency-pill").length,
      expectedSpoons: Number(save.pantrySpoons) || 0,
      text: chip?.textContent?.trim() || "",
      ariaLabel: chip?.getAttribute("aria-label") || "",
      chipHeight: chipRect?.height || 0,
      topGap: chipRect?.top ?? -1,
      rightGap: chipRect ? window.innerWidth - chipRect.right : -1,
      iconWidth: iconRect?.width || 0,
      iconHeight: iconRect?.height || 0,
      centerDelta: chipRect && iconRect ? Math.abs((iconRect.top + iconRect.height / 2) - (chipRect.top + chipRect.height / 2)) : 999,
      objectFit: icon ? getComputedStyle(icon).objectFit : "missing",
      assetId: icon?.dataset.assetId || "missing",
      naturalWidth: icon?.naturalWidth || 0,
      naturalHeight: icon?.naturalHeight || 0,
      minimumRightGap: needsSettingsClearance ? 68 : 16,
      overlaps
    };
  });
  if (metrics.chipCount !== 1
    || metrics.localBalanceCount !== 0
    || !metrics.text.includes(String(metrics.expectedSpoons))
    || !metrics.ariaLabel.includes(String(metrics.expectedSpoons))
    || Math.abs(metrics.iconWidth - 20) > 0.5
    || Math.abs(metrics.iconHeight - 20) > 0.5
    || metrics.chipHeight < 31
    || metrics.chipHeight > 36
    || metrics.centerDelta > 1
    || metrics.objectFit !== "contain"
    || metrics.assetId !== "spoon-token-v2"
    || metrics.naturalWidth !== 256
    || metrics.naturalHeight !== 256
    || metrics.topGap < 12
    || metrics.rightGap < metrics.minimumRightGap - 1
    || metrics.overlaps.length > 0) {
    failures.push("[" + viewportName + "] " + viewName + " shared spoon balance regressed: " + JSON.stringify(metrics));
  }
}
