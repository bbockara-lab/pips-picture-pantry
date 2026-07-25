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
  await expectSafeAreaChromeGuard(page, viewport.name);
  await expectFloatingNavHiddenDuringBlockingOverlay(page, viewport.name);
  await dismissGuideIfPresent(page, viewport.name);
  await expectSettingsDialogPolish(page, viewport.name);
  if ((await page.locator(".play-screen").count()) > 0) {
    await expectVisible(page, ".play-screen", viewport.name);
    await expectStarterBoardAlignment(page, viewport.name);
    await expectStageNavigationPolish(page, viewport.name);
    await expectPlayScreenNavClearance(page, viewport.name);
    await page.locator(".play-screen__back").click();
  }
  await expectAbsent(page, ".pip-strip", viewport.name);
  await expectVisible(page, ".currency-pill", viewport.name);
  await expectAppChromePolish(page, viewport.name);
  await expectDailyRewardPolish(page, viewport.name);
  await expectTimeAttackHubEntry(page, viewport.name);
  await expectResetDialogPolish(page, viewport.name);
  await expectStageCompleteRewardPolish(page, viewport.name);
  await expectVisible(page, ".pack-block", viewport.name);
  await expectVisible(page, ".pack-block.locked", viewport.name);
  await expectHiddenBonusPacks(page, viewport.name);
  await expectLockedStageGate(page, viewport.name);
  await expectVisible(page, ".stage-preview", viewport.name);
  await expectStageArtPreviews(page, viewport.name);
  await expectPuzzleHubSelectionPolish(page, viewport.name);
  await expectAbsent(page, ".season-progress-card", viewport.name);
  await expectNoHorizontalOverflow(page, viewport.name);
  await expectTapTargets(page, viewport.name);

  await seedCompletedStarter(page);
  await page.reload({ waitUntil: "networkidle" });
  await page.locator(".brand-intro.game-stage").waitFor({ state: "visible", timeout: 6000 });
  await page.waitForTimeout(800);
  await expectVisible(page, ".brand-intro.game-stage", viewport.name);
  await dismissIntro(page, "Jay", viewport.name);
  await dismissGuideIfPresent(page, viewport.name);
  await expectVisible(page, ".completion-reveal__character", viewport.name);
  await expectVisible(page, ".completion-reveal", viewport.name);
  await expectCompletionRewardPolish(page, viewport.name);
  await expectCompletionAlbumRoute(page, viewport.name);
  await openFloatingView(page, "puzzle");
  await expectVisible(page, ".replay-picks-card", viewport.name);
  await expectVisible(page, ".replay-pick-button", viewport.name);
  await expectReplayPicksPolish(page, viewport.name);
  await page.locator(".replay-pick-button").first().click();
  await expectVisible(page, ".play-screen--replay", viewport.name);
  await expectVisible(page, ".replay-challenge-note", viewport.name);
  await page.locator(".play-screen__back").click();
  await expectNoHorizontalOverflow(page, viewport.name);
  await expectTapTargets(page, viewport.name);

  await openFloatingView(page, "album");
  await expectVisible(page, ".album-panel", viewport.name);
  await expectVisible(page, ".album-stamp", viewport.name);
  await expectAlbumPolish(page, viewport.name);
  await expectNoHorizontalOverflow(page, viewport.name);

  await openFloatingView(page, "map");
  await expectVisible(page, ".map-panel", viewport.name);
  await expectVisible(page, ".next-stage-badge", viewport.name);
  await expectMapPolish(page, viewport.name);
  await expectNoHorizontalOverflow(page, viewport.name);

  await openFloatingView(page, "pantry");
  await verifyPantryPlacement(page, viewport.name);

  await openFloatingView(page, "timeAttack", viewport.name);
  await expectNoHorizontalOverflow(page, viewport.name);

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
  const albumButton = page.locator(".completion-actions .tool-button").first();
  await albumButton.click();
  try {
    await page.locator(".album-panel").first().waitFor({ state: "visible", timeout: 3000 });
    await page.waitForTimeout(100);
    const routeMetrics = await page.evaluate(() => ({
      scrollY: window.scrollY,
      albumTop: document.querySelector(".album-panel")?.getBoundingClientRect().top ?? -1
    }));
    if (routeMetrics.scrollY > 2 || routeMetrics.albumTop < 0) {
      failures.push(`[${viewportName}] Completed puzzle Album route did not reset to a readable top position: ${JSON.stringify(routeMetrics)}`);
    }
  } catch {
    failures.push(`[${viewportName}] Completed puzzle Album button did not open the Album view.`);
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
  await page.locator(".guide-dialog__skip").first().click({ force: true });
  await overlay.first().waitFor({ state: "detached", timeout: 3000 });
}

async function expectGuideDialogChromeArt(page, viewportName) {
  const metrics = await page.locator(".guide-dialog").first().evaluate((dialog) => {
    const overlay = document.querySelector(".guide-overlay");
    const art = dialog.querySelector(".guide-dialog__art");
    const image = art?.querySelector("img");
    const bubble = dialog.querySelector(".guide-dialog__bubble");
    const line = dialog.querySelector(".guide-dialog__line");
    const rect = dialog.getBoundingClientRect();
    const imageRect = image?.getBoundingClientRect();
    return {
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      width: rect.width,
      height: rect.height,
      imageWidth: imageRect?.width || 0,
      imageHeight: imageRect?.height || 0,
      bodyText: (line?.textContent || "").trim(),
      buttonCount: dialog.querySelectorAll(".guide-dialog__actions button").length,
      hasLegacyLabels: Boolean(dialog.querySelector(".guide-dialog__eyebrow, .guide-dialog__speaker")),
      artBefore: art ? getComputedStyle(art, "::before").content : "",
      artAfter: art ? getComputedStyle(art, "::after").content : "",
      bubbleBefore: bubble ? getComputedStyle(bubble, "::before").content : "",
      bubbleAfter: bubble ? getComputedStyle(bubble, "::after").content : "",
      overflows: dialog.scrollWidth > dialog.clientWidth + 1 || dialog.scrollHeight > dialog.clientHeight + 1,
      overlayFixed: overlay ? getComputedStyle(overlay).position === "fixed" : false
    };
  });
  const mobileFullScreen = metrics.viewportWidth > 520 || (metrics.width >= metrics.viewportWidth - 1 && metrics.height >= metrics.viewportHeight - 1);
  if (!metrics.overlayFixed || !mobileFullScreen || metrics.imageWidth < 150 || metrics.imageHeight < 150 || metrics.bodyText.length < 12 || metrics.buttonCount !== 2 || metrics.hasLegacyLabels || metrics.artBefore !== "none" || metrics.artAfter !== "none" || metrics.bubbleBefore !== "none" || metrics.bubbleAfter !== "none" || metrics.overflows) {
    failures.push("[" + viewportName + "] Clean Pip conversation regressed: " + JSON.stringify(metrics));
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

  const box = await page.locator(selector).first().boundingBox();
  if (!box || box.width < 1 || box.height < 1) {
    failures.push(`[${viewportName}] ${selector} is not visibly sized`);
  }
}

async function expectOpeningIntroPolish(page, viewportName) {
  const metrics = await page.locator(".brand-intro__content").first().evaluate((content) => {
    const button = content.querySelector(".brand-intro__skip");
    const visual = content.querySelector(".brand-intro__key-visual img");
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
      viewportHeight: window.innerHeight
    };
  });
  if (metrics.contentOverflow || metrics.buttonWidth < 150 || metrics.buttonHeight < 52 || metrics.buttonBottom > metrics.viewportHeight || metrics.visualWidth < 190 || metrics.visualHeight < 240 || metrics.beforeContent !== "none" || metrics.afterContent !== "none") {
    failures.push("[" + viewportName + "] Clean opening layout regressed: " + JSON.stringify(metrics));
  }
}

async function expectSettingsDialogPolish(page, viewportName) {
  await page.locator('button[aria-label="Settings"], button[aria-label="\uC124\uC815"]').first().click();
  await expectVisible(page, ".settings-dialog", viewportName);
  await expectAbsent(page, ".settings-dialog .support-pack-card", viewportName);
  const metrics = await page.locator(".settings-dialog").evaluate((dialog) => ({
    overflowsX: dialog.scrollWidth > dialog.clientWidth + 1,
    width: dialog.getBoundingClientRect().width,
    controlCount: dialog.querySelectorAll("button, input").length,
    purchaseCopy: /pip_cozy_support|pip_spoon_jar_small|Play Store|Google Play/.test(dialog.textContent || "")
  }));
  if (metrics.overflowsX || metrics.width < 280 || metrics.controlCount < 7 || metrics.purchaseCopy) {
    failures.push("[" + viewportName + "] Settings should contain preferences only: " + JSON.stringify(metrics));
  }
  await page.locator(".settings-close").click();
}

async function expectAppChromePolish(page, viewportName) {
  await expectVisible(page, ".top-bar", viewportName);
  await expectVisible(page, ".header-actions", viewportName);
  await page.waitForFunction(() => [...document.querySelectorAll(".header-actions .icon-button__raster-art")]
    .every((image) => image.complete && image.naturalWidth === 256 && image.naturalHeight === 256));
  const chromeMetrics = await page.evaluate(() => {
    const topBar = document.querySelector(".top-bar");
    const currency = document.querySelector(".currency-pill");
    const settings = document.querySelector(".icon-button--settings");
    const reset = document.querySelector(".icon-button--reset");
    const topBarRect = topBar?.getBoundingClientRect();
    const currencyRect = currency?.getBoundingClientRect();
    const settingsRect = settings?.getBoundingClientRect();
    const resetRect = reset?.getBoundingClientRect();
    const style = topBar ? getComputedStyle(topBar) : null;
    const settingsStyle = settings ? getComputedStyle(settings) : null;
    const resetStyle = reset ? getComputedStyle(reset) : null;
    const settingsBefore = settings ? getComputedStyle(settings, "::before") : null;
    const settingsAfter = settings ? getComputedStyle(settings, "::after") : null;
    const resetBefore = reset ? getComputedStyle(reset, "::before") : null;
    const resetAfter = reset ? getComputedStyle(reset, "::after") : null;
    const settingsArt = settings?.querySelector(".icon-button__raster-art");
    const resetArt = reset?.querySelector(".icon-button__raster-art");
    return {
      topBarHeight: topBarRect?.height || 0,
      currencyHeight: currencyRect?.height || 0,
      borderRadius: style ? parseFloat(style.borderRadius) : 0,
      backgroundImage: style?.backgroundImage || "",
      settingsText: (settings?.textContent || "").trim(),
      resetText: (reset?.textContent || "").trim(),
      settingsWidth: settingsRect?.width || 0,
      settingsHeight: settingsRect?.height || 0,
      resetWidth: resetRect?.width || 0,
      resetHeight: resetRect?.height || 0,
      settingsBackground: settingsStyle?.backgroundImage || "",
      resetBackground: resetStyle?.backgroundImage || "",
      settingsBeforeContent: settingsBefore?.content || "",
      settingsAfterContent: settingsAfter?.content || "",
      settingsAssetId: settingsArt?.dataset.assetId || "",
      settingsImageNaturalWidth: settingsArt?.naturalWidth || 0,
      settingsImageNaturalHeight: settingsArt?.naturalHeight || 0,
      resetBeforeContent: resetBefore?.content || "",
      resetAfterContent: resetAfter?.content || "",
      resetAssetId: resetArt?.dataset.assetId || "",
      resetImageNaturalWidth: resetArt?.naturalWidth || 0,
      resetImageNaturalHeight: resetArt?.naturalHeight || 0
    };
  });
  if (
    chromeMetrics.topBarHeight < 68 ||
    chromeMetrics.currencyHeight < 36 ||
    chromeMetrics.borderRadius < 12 ||
    !chromeMetrics.backgroundImage.includes("linear-gradient") ||
    chromeMetrics.settingsText ||
    chromeMetrics.resetText ||
    chromeMetrics.settingsWidth < 44 ||
    chromeMetrics.settingsHeight < 44 ||
    chromeMetrics.resetWidth < 44 ||
    chromeMetrics.resetHeight < 44 ||
    chromeMetrics.settingsBeforeContent !== "none" ||
    chromeMetrics.settingsAfterContent !== "none" ||
    chromeMetrics.settingsAssetId !== "puzzle-control-settings-v1" ||
    chromeMetrics.settingsImageNaturalWidth !== 256 ||
    chromeMetrics.settingsImageNaturalHeight !== 256 ||
    chromeMetrics.resetBeforeContent !== "none" ||
    chromeMetrics.resetAfterContent !== "none" ||
    chromeMetrics.resetAssetId !== "puzzle-control-reset-v1" ||
    chromeMetrics.resetImageNaturalWidth !== 256 ||
    chromeMetrics.resetImageNaturalHeight !== 256
  ) {
    failures.push("[" + viewportName + "] App chrome lost polished HUD/icon treatment: " + JSON.stringify(chromeMetrics));
  }
  const trigger = page.locator(".floating-nav__trigger").first();
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
    const triggerLabel = triggerButton?.querySelector(".floating-nav__trigger-label");
    const triggerCue = triggerButton?.querySelector(".floating-nav__trigger-cue");
    const activeItem = document.querySelector(".floating-nav__item.active");
    const labels = [...document.querySelectorAll(".floating-nav__item span")].map((label) => label.textContent || "");
    const icons = [...document.querySelectorAll(".floating-nav__item")].map((item) => {
      const icon = item.querySelector(".floating-nav__icon");
      const copy = item.querySelector(".floating-nav__copy");
      const label = item.querySelector(".floating-nav__label");
      const hint = item.querySelector("small");
      const image = icon?.querySelector("img");
      const iconStyle = icon ? getComputedStyle(icon) : null;
      const copyStyle = copy ? getComputedStyle(copy) : null;
      const labelStyle = label ? getComputedStyle(label) : null;
      const hintStyle = hint ? getComputedStyle(hint) : null;
      const itemStyle = getComputedStyle(item);
      const before = icon ? getComputedStyle(icon, "::before") : null;
      const after = icon ? getComputedStyle(icon, "::after") : null;
      const labelLineHeight = parseFloat(labelStyle?.lineHeight) || 0;
      const hintLineHeight = parseFloat(hintStyle?.lineHeight) || 0;
      return {
        view: item.dataset.view || "",
        labelText: (label?.textContent || "").trim(),
        hintText: (hint?.textContent || "").trim(),
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
        copyDisplay: copyStyle?.display || "",
        copyWidth: copy?.getBoundingClientRect().width || 0,
        labelWhiteSpace: labelStyle?.whiteSpace || "",
        labelTextOverflow: labelStyle?.textOverflow || "",
        labelOverflowX: labelStyle?.overflowX || "",
        labelLineCount: labelLineHeight ? label.getBoundingClientRect().height / labelLineHeight : 1,
        labelOverflow: label ? Math.max(0, label.scrollWidth - label.clientWidth) : 999,
        hintWhiteSpace: hintStyle?.whiteSpace || "",
        hintTextOverflow: hintStyle?.textOverflow || "",
        hintOverflowX: hintStyle?.overflowX || "",
        hintLineCount: hintLineHeight ? hint.getBoundingClientRect().height / hintLineHeight : 1,
        hintOverflow: hint ? Math.max(0, hint.scrollWidth - hint.clientWidth) : 999
      };
    });
    const rect = menu?.getBoundingClientRect();
    const navRect = nav?.getBoundingClientRect();
    const style = menu ? getComputedStyle(menu) : null;
    const navStyle = nav ? getComputedStyle(nav) : null;
    const triggerBefore = triggerButton ? getComputedStyle(triggerButton, "::before") : null;
    const triggerAfter = triggerButton ? getComputedStyle(triggerButton, "::after") : null;
    const triggerIconStyle = triggerIcon ? getComputedStyle(triggerIcon) : null;
    const triggerIconBefore = triggerIcon ? getComputedStyle(triggerIcon, "::before") : null;
    const triggerIconAfter = triggerIcon ? getComputedStyle(triggerIcon, "::after") : null;
    const triggerImage = triggerIcon?.querySelector("img");
    const triggerTextStyle = triggerText ? getComputedStyle(triggerText) : null;
    const triggerCurrent = triggerButton?.querySelector("strong");
    const activeBefore = activeItem ? getComputedStyle(activeItem, "::before") : null;
    const activeAfter = activeItem ? getComputedStyle(activeItem, "::after") : null;
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
      triggerShine: triggerBefore?.backgroundImage || "",
      triggerArrow: triggerAfter?.borderBottomWidth || "",
      triggerArrowTransform: triggerAfter?.transform || "",
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
      triggerTextWidth: triggerText?.getBoundingClientRect().width || 0,
      triggerTextClipPath: triggerTextStyle?.clipPath || "",
      triggerLabelText: (triggerLabel?.textContent || "").trim(),
      triggerCueText: (triggerCue?.textContent || "").trim(),
      triggerCurrentText: (triggerCurrent?.textContent || "").trim(),
      triggerCurrentOverflow: triggerCurrent ? Math.max(0, triggerCurrent.scrollWidth - triggerCurrent.clientWidth) : 999,
      activeShine: activeBefore?.backgroundImage || "",
      activeToken: activeAfter?.backgroundImage || "",
      activeTokenWidth: parseFloat(activeAfter?.width) || 0,
      activePaddingLeft: activeItem ? parseFloat(getComputedStyle(activeItem).paddingLeft) || 0 : 0,
      labels,
      icons
    };
  });
  const hasExplicitTimeAttackEntry = navMetrics.labels.some((label) => /Time Attack|\uD0C0\uC784\uC5B4\uD0DD/.test(label));
  const expectedIconViews = ["puzzle", "album", "pantry", "timeAttack", "map"];
  const hasAllViewIcons = expectedIconViews.every((view) => navMetrics.icons.some((icon) => icon.view === view));
  const expectedHintsByView = {
    puzzle: ["Solve puzzles", "\uD37C\uC990 \uD480\uAE30"],
    album: ["Finished art", "\uC644\uC131 \uADF8\uB9BC"],
    pantry: ["Shop and decorate", "\uC0C1\uC810\uACFC \uAFB8\uBBF8\uAE30"],
    timeAttack: ["Spoon challenge", "\uC2A4\uD47C \uB3C4\uC804"],
    map: ["Next goals", "\uB2E4\uC74C \uBAA9\uD45C"]
  };
  const hasClearRouteHints = expectedIconViews.every((view) => {
    const icon = navMetrics.icons.find((item) => item.view === view);
    return Boolean(icon && expectedHintsByView[view].includes(icon.hintText));
  });
  const triggerExplainsSwitching = ["Switch screens", "\uD654\uBA74 \uC774\uB3D9"].includes(navMetrics.triggerCueText);
  const lastNavItem = navMetrics.icons.at(-1);
  const wideOddItemIsCentered = navMetrics.viewportWidth < 560 || !lastNavItem || Math.abs((lastNavItem.itemLeft + lastNavItem.itemWidth / 2) - navMetrics.menuCenter) <= 2;
  if (
    navMetrics.open !== "true" ||
    navMetrics.navPosition !== "fixed" ||
    navMetrics.navRightGap < 0 ||
    navMetrics.navRightGap > 24 ||
    navMetrics.navBottomGap < 0 ||
    navMetrics.navBottomGap > 120 ||
    navMetrics.navTop < 0 ||
    navMetrics.menuBottomGap < 0 ||
    navMetrics.left < -1 ||
    navMetrics.right > navMetrics.viewportWidth + 1 ||
    navMetrics.borderRadius < 20 ||
    !navMetrics.backgroundImage.includes("linear-gradient") ||
    !navMetrics.triggerShine.includes("gradient") ||
    navMetrics.triggerArrow === "0px" ||
    navMetrics.triggerArrowTransform === "none" ||
    navMetrics.triggerIcon.width < 34 ||
    navMetrics.triggerIcon.height < 34 ||
    !navMetrics.triggerIcon.imageSrc.includes("quick-travel-") ||
    navMetrics.triggerIcon.assetId !== `quick-travel-${navMetrics.triggerIcon.view === "timeAttack" ? "time-attack" : navMetrics.triggerIcon.view}-v1` ||
    navMetrics.triggerIcon.imageNaturalWidth !== 256 ||
    navMetrics.triggerIcon.imageNaturalHeight !== 256 ||
    navMetrics.triggerIcon.beforeContent !== "none" ||
    navMetrics.triggerIcon.afterContent !== "none" ||
    navMetrics.triggerTextWidth < 24 ||
    navMetrics.triggerTextClipPath.includes("inset") ||
    !navMetrics.triggerLabelText ||
    !navMetrics.triggerCueText ||
    !navMetrics.triggerCurrentText ||
    navMetrics.triggerCurrentOverflow > 1 ||
    !navMetrics.activeShine.includes("gradient") ||
    !navMetrics.activeToken.includes("gradient") ||
    navMetrics.activeTokenWidth < 8 ||
    navMetrics.activePaddingLeft < 8 ||
    !hasExplicitTimeAttackEntry ||
    !hasAllViewIcons ||
    !hasClearRouteHints ||
    !triggerExplainsSwitching ||
    !wideOddItemIsCentered ||
    navMetrics.icons.length < 5 ||
    navMetrics.icons.some((icon) =>
      icon.itemHeight < 58 ||
      icon.width < 38 ||
      icon.height < 38 ||
      !icon.imageSrc.includes("quick-travel-") ||
      icon.assetId !== `quick-travel-${icon.view === "timeAttack" ? "time-attack" : icon.view}-v1` ||
      icon.imageNaturalWidth !== 256 ||
      icon.imageNaturalHeight !== 256 ||
      icon.beforeContent !== "none" ||
      icon.afterContent !== "none" ||
      icon.copyDisplay !== "grid" ||
      icon.copyWidth < 80 ||
      icon.labelWhiteSpace === "nowrap" ||
      icon.labelTextOverflow === "ellipsis" ||
      icon.labelOverflowX === "hidden" ||
      icon.labelLineCount > 2.4 ||
      icon.labelOverflow > 1 ||
      icon.hintWhiteSpace === "nowrap" ||
      icon.hintTextOverflow === "ellipsis" ||
      icon.hintOverflowX === "hidden" ||
      icon.hintLineCount > 2.4 ||
      icon.hintOverflow > 1
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
  await page.locator('button[aria-label="Reset progress"], button[aria-label="\uC9C4\uD589 \uC0C1\uD0DC \uCD08\uAE30\uD654"]').first().click();
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

async function expectMapPolish(page, viewportName) {
  const metrics = await page.evaluate(() => {
    const map = document.querySelector(".map-panel");
    const badgeCard = document.querySelector(".next-stage-badge");
    const badgeToken = document.querySelector(".roadmap-badge__token");
    const lockedCardCount = document.querySelectorAll(".badge-card.locked").length;
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
      map: readBox(map),
      badgeCard: readBox(badgeCard),
      badgeToken: readBox(badgeToken),
      lockedCardCount
    };
  });
  const boxes = [metrics.map, metrics.badgeCard, metrics.badgeToken];
  const outside = boxes.some((box) => box.left < -1 || box.right > metrics.viewportWidth + 1);
  if (
    outside ||
    metrics.map.radius < 14 ||
    metrics.badgeCard.radius < 12 ||
    metrics.badgeToken.height < 40 ||
    metrics.lockedCardCount !== 0 ||
    !metrics.map.background.includes("linear-gradient")
  ) {
    failures.push("[" + viewportName + "] Map polish regression: " + JSON.stringify(metrics));
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
    metrics.actionsWidth < metrics.bannerWidth * 0.72 ||
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
    const facts = document.createElement("div");
    facts.className = "stage-complete-facts";
    facts.setAttribute("aria-label", "Stage rewards");
    const albumFact = document.createElement("span");
    albumFact.textContent = "Album filled";
    const roomFact = document.createElement("span");
    roomFact.textContent = "Room path grows";
    facts.append(albumFact, roomFact);
    const ctaButton = document.createElement("button");
    ctaButton.type = "button";
    ctaButton.className = "tool-button stage-complete-cta";
    ctaButton.textContent = "OK";
    copy.append(eyebrow, title, body, bonus, facts, ctaButton);
    cardNode.append(pipArt, copy);
    overlay.appendChild(cardNode);
    document.body.appendChild(overlay);
    const card = overlay.querySelector(".stage-complete-card");
    const art = overlay.querySelector(".stage-complete-pip");
    const cta = overlay.querySelector(".stage-complete-cta");
    const factChips = [...overlay.querySelectorAll(".stage-complete-facts span")];
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
      factCount: factChips.length,
      factChips: factChips.map((chip) => {
        const rect = chip.getBoundingClientRect();
        const style = getComputedStyle(chip);
        return {
          text: chip.textContent.trim(),
          width: rect.width,
          height: rect.height,
          radius: parseFloat(style.borderRadius),
          background: style.backgroundImage,
      cardBeforeBackground: typeof cardBefore !== "undefined" ? cardBefore.backgroundImage || "" : "",
          beforeBackground: getComputedStyle(chip, "::before").backgroundImage,
          beforeWidth: parseFloat(getComputedStyle(chip, "::before").width),
          overflows: chip.scrollWidth > Math.ceil(rect.width) + 1 || chip.scrollHeight > Math.ceil(rect.height) + 1
        };
      }),
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
    metrics.factCount !== 2 ||
    metrics.factChips.some((chip) => !chip.text || chip.width < 90 || chip.height < 32 || chip.radius < 12 || chip.beforeWidth < 10 || !chip.background.includes("linear-gradient") || !chip.beforeBackground.includes("linear-gradient") || chip.overflows) ||
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
  const leakCount = await page.locator('.pack-block[data-pack-id$="-plus"], .bonus-pack-panel').count();
  if (leakCount > 0) {
    failures.push(`${viewportName}: hidden bonus pack preview leaked into the launch puzzle picker.`);
  }
}

async function expectLockedStageGate(page, viewportName) {
  const lockedText = await page.locator(".pack-block.locked").first().innerText();
  if (!lockedText.includes("Pantry room step") || !lockedText.includes("0/3") || !lockedText.includes("Need pantry story") || !lockedText.includes("Go to Pantry") || !lockedText.includes("Blocked by") || !lockedText.includes("Pantry requests")) {
    failures.push("[" + viewportName + "] Locked stage should explain pantry story progress, saw " + lockedText);
  }
}

async function expectSeasonUpdateTeaser(page, viewportName) {
  await expectVisible(page, ".season-next-card", viewportName);
  await expectVisible(page, ".season-next-card__label", viewportName);
  await expectVisible(page, ".season-next-card__chips span", viewportName);
  const text = await page.locator(".season-next-card").first().innerText();
  const normalizedText = text.toLowerCase();
  if (!normalizedText.includes("update note") || !text.includes("333") || !text.includes("Puzzle drop") || !text.includes("Pip news")) {
    failures.push("[" + viewportName + "] Season update teaser should explain the post-launch drop plan, saw " + text);
  }

  const metrics = await page.locator(".season-next-card").first().evaluate((card) => {
    const rect = card.getBoundingClientRect();
    const style = getComputedStyle(card);
    const cardBefore = getComputedStyle(card, "::before");
    const label = card.querySelector(".season-next-card__label");
    const chips = [...card.querySelectorAll(".season-next-card__chips span")].map((chip) => {
      const chipRect = chip.getBoundingClientRect();
      return { width: chipRect.width, height: chipRect.height, text: chip.textContent.trim() };
    });
    return {
      width: rect.width,
      right: rect.right,
      viewportWidth: window.innerWidth,
      radius: parseFloat(style.borderRadius),
      background: style.backgroundImage,
      cardBeforeBackground: typeof cardBefore !== "undefined" ? cardBefore.backgroundImage || "" : "",
      labelText: label?.textContent?.trim() || "",
      chipCount: chips.length,
      chips
    };
  });
  if (
    metrics.width < 260 ||
    metrics.right > metrics.viewportWidth + 1 ||
    metrics.radius < 12 ||
    !metrics.background.includes("linear-gradient") ||
    metrics.labelText.length === 0 ||
    metrics.chipCount !== 3 ||
    metrics.chips.some((chip) => chip.height < 26 || chip.width < 58)
  ) {
    failures.push("[" + viewportName + "] Season update teaser mobile layout regressed: " + JSON.stringify(metrics));
  }
}

async function expectStageArtPreviews(page, viewportName) {
  const tileCount = await page.locator(".stage-tile-mosaic .pip-tile").count();
  if (tileCount === 0) {
    failures.push("[" + viewportName + "] Missing approved stage-art mosaic tiles");
    return;
  }

  const pendingCount = await page.locator(".stage-art-pending").count();
  if (pendingCount > 0) {
    failures.push("[" + viewportName + "] Stage previews should use approved artwork, saw " + pendingCount + " pending-art placeholders");
  }

  const tileIssues = await page.evaluate(() => {
    return [...document.querySelectorAll(".stage-tile-mosaic .pip-tile.revealed, .stage-tile-mosaic .pip-tile.peek")]
      .map((tile) => {
        const rect = tile.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          backgroundImage: tile.style.backgroundImage
        };
      })
      .filter((tile) => tile.width < 1 || tile.height < 1 || !tile.backgroundImage || tile.backgroundImage === "none");
  });
  if (tileIssues.length > 0) {
    failures.push("[" + viewportName + "] Stage artwork mosaic has invalid visible tiles: " + JSON.stringify(tileIssues.slice(0, 3)));
  }
}

async function expectPuzzleHubSelectionPolish(page, viewportName) {
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
      before: getComputedStyle(chip, "::before").content,
      after: getComputedStyle(chip, "::after").content
    };
  }));
  if (!metrics.length || metrics.some((chip) => !chip.label || !chip.meta || chip.width < 120 || chip.height < 80 || chip.overflows || chip.hasRewardImage || chip.before !== "none" || chip.after !== "none" || /5x5|8x8|10x10|12x12/.test(chip.label))) {
    failures.push("[" + viewportName + "] Compact puzzle choices regressed: " + JSON.stringify(metrics));
  }
}

async function expectDailyRewardPolish(page, viewportName) {
  await expectVisible(page, ".daily-card", viewportName);
  const metrics = await page.locator(".daily-card").evaluate((card) => ({
    text: (card.textContent || "").trim(),
    overflows: card.scrollWidth > card.clientWidth + 1 || card.scrollHeight > card.clientHeight + 1,
    hasRewardImage: Boolean(card.querySelector(".daily-reward-note img")),
    before: getComputedStyle(card, "::before").content,
    after: getComputedStyle(card, "::after").content,
    buttonHeight: card.querySelector("button")?.getBoundingClientRect().height || 0
  }));
  if (metrics.overflows || metrics.hasRewardImage || metrics.before !== "none" || metrics.after !== "none" || metrics.buttonHeight < 44 || !/spoon|\uC2A4\uD47C/i.test(metrics.text)) {
    failures.push("[" + viewportName + "] Compact daily card regressed: " + JSON.stringify(metrics));
  }
}

async function expectTimeAttackHubEntry(page, viewportName) {
  await expectVisible(page, ".time-attack-teaser-card", viewportName);
  const metrics = await page.locator(".time-attack-teaser-card").evaluate((card) => {
    const image = card.querySelector(".time-attack-teaser-card__badge img");
    const action = card.querySelector(".time-attack-teaser-card__action");
    return {
      text: (card.textContent || "").trim(),
      overflows: card.scrollWidth > card.clientWidth + 1 || card.scrollHeight > card.clientHeight + 1,
      assetId: image?.dataset.assetId || "",
      naturalWidth: image?.naturalWidth || 0,
      hasLegacyActionIcon: Boolean(card.querySelector(".time-attack-teaser-card__action-icon")),
      before: getComputedStyle(card, "::before").content,
      after: getComputedStyle(card, "::after").content,
      actionHeight: action?.getBoundingClientRect().height || 0
    };
  });
  if (metrics.overflows || metrics.assetId !== "quick-travel-time-attack-v1" || metrics.naturalWidth !== 256 || metrics.hasLegacyActionIcon || metrics.before !== "none" || metrics.after !== "none" || metrics.actionHeight < 44 || !/Time Attack|\uD0C0\uC784\uC5B4\uD0DD/.test(metrics.text)) {
    failures.push("[" + viewportName + "] Compact Time Attack entry regressed: " + JSON.stringify(metrics));
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
async function openFloatingView(page, view, viewportName = view) {
  await dismissGuideIfPresent(page, "floating-nav");
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
  const selector = viewSelectors[view];
  if (selector) {
    await page.locator(selector).first().waitFor({ state: "visible", timeout: 5000 });
  }
  if (view === "timeAttack") {
    await expectTimeAttackGuideCopy(page, viewportName);
    await expectVisible(page, ".time-attack-coach-card", "Time Attack coach card");
    const coachMetrics = await page.locator(".time-attack-coach-card").first().evaluate((card) => {
      const rect = card.getBoundingClientRect();
      const style = getComputedStyle(card);
      const pip = card.querySelector(".time-attack-coach-card__pip");
      const pipRect = pip?.getBoundingClientRect() || { width: 0, height: 0 };
      const pipStyle = pip ? getComputedStyle(pip) : null;
      return {
        width: rect.width,
        height: rect.height,
        radius: parseFloat(style.borderRadius),
        bottomRadius: parseFloat(style.borderBottomLeftRadius),
        background: style.backgroundImage,
        shadow: style.boxShadow,
        pipWidth: pipRect.width,
        pipHeight: pipRect.height,
        pipRadius: pipStyle ? parseFloat(pipStyle.borderRadius) : 0,
        pipBackground: pipStyle?.backgroundImage || "",
        pipShadow: pipStyle?.boxShadow || "none"
      };
    });
    if (
      coachMetrics.width <= 0 ||
      coachMetrics.height < 96 ||
      coachMetrics.radius < 12 ||
      !coachMetrics.background.includes("linear-gradient") ||
      coachMetrics.shadow === "none" ||
      coachMetrics.pipWidth < 62 ||
      coachMetrics.pipHeight < 62 ||
      coachMetrics.pipRadius < 18 ||
      !coachMetrics.pipBackground.includes("gradient") ||
      coachMetrics.pipShadow === "none"
    ) {
      failures.push("Time Attack coach card lost its Pip/economy guidance treatment: " + JSON.stringify(coachMetrics));
    }
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
    const ladderLooksPolished = ladderMetrics.steps.length === 3 && ladderMetrics.steps.every((step) => step.width > 0 && step.height >= 48 && step.radius >= 12 && step.background.includes("linear-gradient"));
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
  await expectVisible(page, ".time-attack-records", "Time Attack records panel");

  const metrics = await page.locator(".time-attack-panel").first().evaluate((panel) => {
    const panelRect = panel.getBoundingClientRect();
    const intro = panel.querySelector(".time-attack-panel__intro");
    const start = panel.querySelector(".time-attack-panel__start");
    const status = panel.querySelector(".time-attack-status");
    const records = panel.querySelector(".time-attack-records");
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
        shadow: introStyle.boxShadow
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

  const introLooksPolished = metrics.intro && metrics.intro.height >= 72 && metrics.intro.radius >= 14 && metrics.intro.background.includes("linear-gradient") && metrics.intro.shadow !== "none";
  const startLooksTactile = metrics.start && metrics.start.width >= 220 && metrics.start.height >= 52 && metrics.start.radius >= 16 && metrics.start.background.includes("linear-gradient") && metrics.start.shadow !== "none";
  const statusFits = metrics.status && metrics.status.width > 0 && metrics.status.height >= 28;
  const recordsLooksPolished = metrics.records &&
    metrics.records.width > 0 &&
    metrics.records.radius >= 14 &&
    metrics.records.background.includes("linear-gradient") &&
    metrics.records.overflow === "hidden" &&
    metrics.records.shadow !== "none" &&
    metrics.records.textLength > 0 &&
    metrics.records.itemHeights.every((height) => height >= 28);
  const staysInViewport = metrics.panelWidth > 0 && metrics.panelRight <= metrics.viewportWidth + 1;
  if (!introLooksPolished || !startLooksTactile || !statusFits || !recordsLooksPolished || !staysInViewport) {
    failures.push("[" + viewportName + "] Time Attack start surface lost its intro/start/status/records treatment: " + JSON.stringify(metrics));
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
  await expectGuideDialogChromeArt(page, viewportName);

  const firstStepText = await page.locator(".guide-dialog__bubble").first().innerText();
  if (!/Time Attack|\uD0C0\uC784\uC5B4\uD0DD|\uB3C4\uC804/i.test(firstStepText)) {
    failures.push("[" + viewportName + "] Time Attack guide first step should frame the mode, saw " + firstStepText);
  }

  await page.locator(".guide-dialog__next").click();
  const hintStepText = await page.locator(".guide-dialog__bubble").first().innerText();
  const mentionsHint = /hint|\uD78C\uD2B8/i.test(hintStepText);
  const mentionsSpoons = /spoon|\uC2A4\uD47C/i.test(hintStepText);
  if (!mentionsHint || !mentionsSpoons) {
    failures.push("[" + viewportName + "] Time Attack guide should explain limited hints and spoon continuation, saw " + hintStepText);
  }

  await page.locator(".guide-dialog__next").click();
  const recordStepText = await page.locator(".guide-dialog__bubble").first().innerText();
  const mentionsRecord = /record|best|\uAE30\uB85D/i.test(recordStepText);
  const mentionsChoice = /pantry|spoon|\uD32C\uD2B8\uB9AC|\uC2A4\uD47C/i.test(recordStepText);
  if (!mentionsRecord || !mentionsChoice) {
    failures.push("[" + viewportName + "] Time Attack guide final step should frame record chasing versus spoon saving, saw " + recordStepText);
  }
  await page.locator(".guide-dialog__skip").click();
  await overlay.waitFor({ state: "detached", timeout: 2000 });
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

  const villageLargeBoardChipCount = await page.locator('.pack-block[data-pack-id="village-pantry"] .puzzle-chip[data-size="10"]').count();
  if (villageLargeBoardChipCount < 98) {
    failures.push("[" + viewportName + "] Village Pantry should expose at least 98 10x10 catalog chips, saw " + villageLargeBoardChipCount);
  }

  if ((await page.locator(".pack-catalog-summary, .pack-note").count()) !== 0) {
    failures.push("[" + viewportName + "] Player-facing puzzle stages should not expose catalog-report summaries or descriptive filler.");
  }

  const target = page.locator(".puzzle-chip", { hasText: /Bakery Window Glow/ }).first();
  await target.waitFor({ state: "visible", timeout: 5000 });
  await target.click();
  await expectVisible(page, ".play-screen", viewportName);
  await expectVisible(page, ".puzzle-panel", viewportName);
  await expectVisible(page, ".hint-panel", viewportName);
  await expectVisible(page, ".cursor-controls", viewportName);
  const cursorPadMetrics = await page.locator(".cursor-controls").first().evaluate((panel) => {
    const rect = panel.getBoundingClientRect();
    const style = getComputedStyle(panel);
    const position = panel.querySelector(".cursor-controls__position");
    const dpad = panel.querySelector(".cursor-dpad");
    const actionsArea = panel.querySelector(".cursor-actions");
    const nav = document.querySelector(".floating-nav");
    const status = panel.querySelector(".cursor-controls__status");
    const dpadRect = dpad?.getBoundingClientRect();
    const actionsRect = actionsArea?.getBoundingClientRect();
    const navRect = nav?.getBoundingClientRect();
    const statusRect = status?.getBoundingClientRect();
    const statusStyle = status ? getComputedStyle(status) : null;
    const statusTokenStyle = status ? getComputedStyle(status, "::before") : null;
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
      positionText: position?.textContent.trim() || "",
      statusText: status?.textContent.trim() || "",
      statusWidth: statusRect?.width || 0,
      statusHeight: statusRect?.height || 0,
      statusBackground: statusStyle?.backgroundImage || "",
      statusTokenWidth: parseFloat(statusTokenStyle?.width) || 0,
      statusTokenHeight: parseFloat(statusTokenStyle?.height) || 0,
      statusTokenBackground: statusTokenStyle?.backgroundImage || "",
      statusTokenShadow: statusTokenStyle?.boxShadow || "",
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
    !cursorPadMetrics.positionText ||
    !cursorPadMetrics.statusText ||
    cursorPadMetrics.statusHeight < 24 ||
    cursorPadMetrics.statusWidth > cursorPadMetrics.width ||
    !cursorPadMetrics.statusBackground.includes("gradient") ||
    cursorPadMetrics.statusTokenWidth < 12 ||
    cursorPadMetrics.statusTokenHeight < 12 ||
    !cursorPadMetrics.statusTokenBackground.includes("gradient") ||
    cursorPadMetrics.statusTokenShadow === "none" ||
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
  const cursorStatusAfterFill = await page.locator(".cursor-controls__status").first().innerText();
  const cursorActionAfterFill = await page.locator(".cursor-action-button").first().innerText();
  if (!/Colored|\uCE60\uD568/.test(cursorStatusAfterFill) || !/Clear|\uC9C0\uC6B0/.test(cursorActionAfterFill)) {
    failures.push("[" + viewportName + "] Cursor action labels should explain clearing after coloring: " + JSON.stringify({ cursorStatusAfterFill, cursorActionAfterFill }));
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
  if (progressMetrics.width > progressMetrics.viewportWidth || progressMetrics.height < 32 || progressMetrics.borderRadius < 16 || !progressMetrics.background.includes("gradient") || progressMetrics.markWidth < 18 || progressMetrics.markHeight < 18 || !progressMetrics.text || !progressMetrics.text.includes("/") || progressMetrics.progressRatio === "" || progressMetrics.overflow !== "hidden" || progressMetrics.overflows) {
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

  const metrics = await page.evaluate(() => {
    const previews = [...document.querySelectorAll(".puzzle-cell.drag-preview")];
    const preview = previews[0];
    const style = preview ? getComputedStyle(preview) : null;
    const before = preview ? getComputedStyle(preview, "::before") : null;
    const after = preview ? getComputedStyle(preview, "::after") : null;
    return {
      count: previews.length,
      className: preview?.className || "",
      background: style?.backgroundImage || "",
      color: style?.color || "",
      outlineStyle: style?.outlineStyle || "",
      boxShadow: style?.boxShadow || "",
      beforeBackground: before?.backgroundImage || "",
      beforeShadow: before?.boxShadow || "",
      afterBackground: after?.backgroundImage || "",
      afterTransform: after?.transform || "",
      afterFilter: after?.filter || ""
    };
  });

  await page.evaluate(() => {
    const event = typeof PointerEvent === "function"
      ? new PointerEvent("pointerup", { pointerId: 77, pointerType: "touch", isPrimary: true, bubbles: true })
      : new MouseEvent("pointerup", { bubbles: true });
    window.dispatchEvent(event);
  });

  const previewIsMarked = String(metrics.className).includes("marked");
  if (
    metrics.count < 1 ||
    !metrics.background.includes("gradient") ||
    metrics.outlineStyle === "none" ||
    metrics.boxShadow === "none" ||
    !metrics.beforeBackground.includes("gradient") ||
    metrics.beforeShadow === "none" ||
    metrics.afterBackground === "none" ||
    (previewIsMarked && metrics.afterTransform === "none") ||
    metrics.afterFilter === "none"
  ) {
    failures.push("[" + viewportName + "] Drag preview lost handcrafted token treatment: " + JSON.stringify(metrics));
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
  const firstRowFilledCells = [3, 4, 5, 6, 7, 8];
  for (const cellIndex of firstRowFilledCells) {
    await page.locator(".puzzle-grid .puzzle-cell").nth(cellIndex).click();
  }

  const metrics = await page.evaluate(() => {
    const rowCompleteCount = document.querySelectorAll(".row-clue.line-complete").length;
    const autoMarkedBlanks = document.querySelectorAll(".puzzle-cell.completed-row.marked").length;
    const firstRowGlow = document.querySelectorAll(".puzzle-cell.completed-row").length;
    const rowClue = document.querySelector(".row-clue.line-complete span");
    const safeCell = document.querySelector(".puzzle-cell.completed-row.marked");
    const safeSuggestion = document.createElement("button");
    safeSuggestion.className = "puzzle-cell safe-suggestion";
    document.body.appendChild(safeSuggestion);
    const markedFixture = document.createElement("button");
    markedFixture.className = "puzzle-cell marked";
    document.body.appendChild(markedFixture);
    const glowCell = document.querySelector(".puzzle-cell.completed-row");
    const progressBadge = document.querySelector(".progress-line__badge");
    const progressBadgeStyle = progressBadge ? getComputedStyle(progressBadge) : null;
    const progressBadgeRect = progressBadge?.getBoundingClientRect();
    const readStyle = (el) => {
      const style = el ? getComputedStyle(el) : null;
      const before = el ? getComputedStyle(el, "::before") : null;
      const after = el ? getComputedStyle(el, "::after") : null;
      return {
        background: style?.backgroundImage || "",
        boxShadow: style?.boxShadow || "",
        borderStyle: style?.borderStyle || "",
        outlineStyle: style?.outlineStyle || "",
        color: style?.color || "",
        beforeBackground: before?.backgroundImage || "",
        beforeContent: before?.content || "",
        beforeBoxShadow: before?.boxShadow || "",
        afterBackground: after?.backgroundImage || "",
        afterFilter: after?.filter || "",
        afterTransform: after?.transform || "",
        afterWidth: parseFloat(after?.width) || 0,
        afterHeight: parseFloat(after?.height) || 0
      };
    };
    const safeSuggestionStyle = readStyle(safeSuggestion);
    safeSuggestion.remove();
    const markedFixtureStyle = readStyle(markedFixture);
    markedFixture.remove();
    const lockedLeakCount = document.querySelectorAll(".board-wrap.locked .line-complete, .board-wrap.locked .safe-suggestion, .board-wrap.locked .completed-row, .board-wrap.locked .completed-column").length;
    return {
      rowCompleteCount,
      autoMarkedBlanks,
      firstRowGlow,
      rowClueStyle: readStyle(rowClue),
      safeCellStyle: readStyle(safeCell),
      safeSuggestionStyle,
      markedFixtureStyle,
      glowCellStyle: readStyle(glowCell),
      progressBadgeText: (progressBadge?.textContent || "").trim(),
      progressBadgeWidth: progressBadgeRect?.width || 0,
      progressBadgeHeight: progressBadgeRect?.height || 0,
      progressBadgeBackground: progressBadgeStyle?.backgroundImage || "",
      lockedLeakCount
    };
  });

  if (metrics.rowCompleteCount < 1 || metrics.autoMarkedBlanks < 6 || metrics.firstRowGlow < 12) {
    failures.push("[" + viewportName + "] Completed-line guidance did not appear after finishing the first 12x12 row: " + JSON.stringify(metrics));
  }
  if (
    !metrics.rowClueStyle.background.includes("gradient") ||
    metrics.rowClueStyle.boxShadow === "none" ||
    metrics.rowClueStyle.beforeContent === "none" ||
    !metrics.rowClueStyle.beforeBackground.includes("gradient") ||
    metrics.glowCellStyle.boxShadow === "none" ||
    metrics.safeCellStyle.borderStyle !== "dashed" ||
    metrics.safeCellStyle.outlineStyle !== "dashed" ||
    metrics.safeSuggestionStyle.borderStyle !== "solid" ||
    metrics.safeSuggestionStyle.outlineStyle !== "dashed" ||
    metrics.safeSuggestionStyle.color !== "rgba(0, 0, 0, 0)" ||
    !metrics.safeSuggestionStyle.beforeBackground.includes("gradient") ||
    metrics.safeSuggestionStyle.beforeBoxShadow === "none" ||
    !metrics.safeSuggestionStyle.afterBackground.includes("linear-gradient") ||
    metrics.safeSuggestionStyle.afterFilter === "none" ||
    metrics.safeSuggestionStyle.afterTransform === "none" ||
    metrics.safeSuggestionStyle.afterWidth < 8 ||
    metrics.safeSuggestionStyle.afterHeight < 8 ||
    metrics.markedFixtureStyle.color !== "rgba(0, 0, 0, 0)" ||
    !metrics.markedFixtureStyle.beforeBackground.includes("gradient") ||
    metrics.markedFixtureStyle.beforeBoxShadow === "none" ||
    !metrics.markedFixtureStyle.afterBackground.includes("linear-gradient") ||
    metrics.markedFixtureStyle.afterFilter === "none" ||
    metrics.markedFixtureStyle.afterTransform === "none" ||
    metrics.markedFixtureStyle.afterWidth < 8 ||
    metrics.markedFixtureStyle.afterHeight < 8 ||
    !metrics.safeCellStyle.background.includes("gradient") ||
    metrics.safeCellStyle.color !== "rgba(0, 0, 0, 0)" ||
    !metrics.safeCellStyle.beforeBackground.includes("gradient") ||
    metrics.safeCellStyle.beforeBoxShadow === "none" ||
    !metrics.safeCellStyle.afterBackground.includes("radial-gradient") ||
    !metrics.safeCellStyle.afterBackground.includes("linear-gradient") ||
    metrics.safeCellStyle.afterFilter === "none" ||
    metrics.safeCellStyle.afterTransform === "none" ||
    metrics.safeCellStyle.afterWidth < 8 ||
    metrics.safeCellStyle.afterHeight < 8 ||
    !metrics.progressBadgeText ||
    metrics.progressBadgeWidth < 28 ||
    metrics.progressBadgeHeight < 18 ||
    !metrics.progressBadgeBackground.includes("gradient")
  ) {
    failures.push("[" + viewportName + "] Completed-line guidance lost polished glow/auto-X treatment: " + JSON.stringify(metrics));
  }
  if (metrics.lockedLeakCount > 0) {
    failures.push("[" + viewportName + "] Completed-line guidance leaked into a locked board: " + JSON.stringify(metrics));
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
  await expectVisible(page, ".pantry-panel", viewportName);
  await expectVisible(page, ".pantry-room", viewportName);
  await expectVisible(page, ".pantry-story-request", viewportName);
  await expectVisible(page, ".pantry-shop", viewportName);
  await expectVisible(page, ".spoon-store", viewportName);
  await expectAbsent(page, ".pantry-planning-deck", viewportName);
  await expectAbsent(page, ".pantry-placement-note", viewportName);
  await expectAbsent(page, ".pantry-item-status, .pantry-item-rarity, .pantry-slot-note, .pantry-swap-note, .pantry-track-goal, .pantry-item-savings", viewportName);

  const metrics = await page.evaluate(() => {
    const panel = document.querySelector(".pantry-panel");
    const room = document.querySelector(".pantry-room");
    const store = document.querySelector(".spoon-store");
    const shop = document.querySelector(".pantry-shop");
    const shopGrid = shop?.querySelector(".pantry-shop-grid");
    const cards = [...document.querySelectorAll(".pantry-item-card")];
    const billingStatuses = [...(store?.querySelectorAll(".support-pack-card__status") || [])];
    const billingToneVisibility = ["checking", "success", "warning"].every((tone) => billingStatuses.every((status) => {
      const previousClass = status.className;
      const previousText = status.textContent;
      status.className = `support-pack-card__status support-pack-card__status--${tone}`;
      status.textContent = tone;
      const visible = getComputedStyle(status).display !== "none";
      status.className = previousClass;
      status.textContent = previousText;
      return visible;
    }));
    return {
      panelOverflowsX: panel ? panel.scrollWidth > panel.clientWidth + 1 : true,
      roomSlotCount: room?.querySelectorAll(".pantry-room-slot").length || 0,
      filterGroupCount: document.querySelectorAll(".pantry-filter-row").length,
      cardCount: cards.length,
      cardOverflowCount: cards.filter((card) => card.scrollWidth > card.clientWidth + 1).length,
      storeProductCount: store?.querySelectorAll(".support-pack-card").length || 0,
      storeInsideShop: Boolean(shop && store && shop.contains(store)),
      storeAfterDecorations: Boolean(shopGrid && store && (shopGrid.compareDocumentPosition(store) & Node.DOCUMENT_POSITION_FOLLOWING)),
      billingToneVisibility,
      storeOverflowsX: store ? store.scrollWidth > store.clientWidth + 1 : true,
      storeGlareCount: store ? [...store.querySelectorAll("button, .support-pack-card, .support-pack-card__art")]
        .filter((item) => getComputedStyle(item, "::before").content !== "none" || getComputedStyle(item, "::after").content !== "none").length : 1
    };
  });
  if (metrics.panelOverflowsX || metrics.roomSlotCount !== 5 || metrics.filterGroupCount !== 1 || metrics.cardCount < 1 || metrics.cardCount > 6 || metrics.cardOverflowCount || metrics.storeProductCount !== 2 || !metrics.storeInsideShop || !metrics.storeAfterDecorations || !metrics.billingToneVisibility || metrics.storeOverflowsX || metrics.storeGlareCount) {
    failures.push("[" + viewportName + "] Simplified Pantry layout regressed: " + JSON.stringify(metrics));
  }

  const firstAction = page.locator(".pantry-item-card").first().locator(".pantry-item-action");
  if (await firstAction.isEnabled()) {
    await firstAction.click();
    await page.waitForTimeout(120);
    if ((await page.locator(".guide-overlay").count()) > 0) {
      await expectGuideDialogChromeArt(page, viewportName);
      await page.locator(".guide-dialog__skip").click({ force: true });
      await page.locator(".guide-overlay").waitFor({ state: "detached", timeout: 2000 });
    }
  }
  await expectNoHorizontalOverflow(page, viewportName);
}
