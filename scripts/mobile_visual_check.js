import { chromium } from "@playwright/test";

const TARGET_URL = process.env.PPP_URL || "http://127.0.0.1:5173";
const viewports = [
  { width: 360, height: 740, name: "360x740" },
  { width: 390, height: 844, name: "390x844" },
  { width: 430, height: 932, name: "430x932" }
];

const browser = await chromium.launch({ headless: true });
const failures = [];

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  await page.goto(TARGET_URL, { waitUntil: "networkidle" });

  await expectVisible(page, ".brand-intro", viewport.name);
  await expectVisible(page, ".studio-bumper__art img", viewport.name);
  await page.locator(".brand-intro.game-stage").waitFor({ state: "visible", timeout: 6000 });
  await page.waitForTimeout(800);
  await expectVisible(page, ".brand-intro.game-stage", viewport.name);
  await expectVisible(page, ".brand-intro__seal", viewport.name);
  await expectOpeningIntroPolish(page, viewport.name);
  await expectAbsent(page, ".brand-intro__cast", viewport.name);
  await dismissIntro(page, "Jay");

  await expectVisible(page, ".app-shell", viewport.name);
  await expectSafeAreaChromeGuard(page, viewport.name);
  await expectSettingsDialogPolish(page, viewport.name);
  await dismissGuideIfPresent(page, viewport.name);
  if ((await page.locator(".play-screen").count()) > 0) {
    await expectVisible(page, ".play-screen", viewport.name);
      await page.locator(".play-screen__back").click();
  }
  await expectVisible(page, ".pip-strip__portrait", viewport.name);
  await expectVisible(page, ".currency-pill", viewport.name);
  await expectAppChromePolish(page, viewport.name);
  await expectStageCompleteRewardPolish(page, viewport.name);
  await expectVisible(page, ".pack-block", viewport.name);
  await expectVisible(page, ".pack-block.locked", viewport.name);
  await expectLockedStageGate(page, viewport.name);
  await expectVisible(page, ".stage-preview", viewport.name);
  await expectStageArtPreviews(page, viewport.name);
  await expectNoHorizontalOverflow(page, viewport.name);
  await expectTapTargets(page, viewport.name);

  await seedCompletedStarter(page);
  await page.reload({ waitUntil: "networkidle" });
  await page.locator(".brand-intro.game-stage").waitFor({ state: "visible", timeout: 6000 });
  await page.waitForTimeout(800);
  await expectVisible(page, ".brand-intro.game-stage", viewport.name);
  await dismissIntro(page, "Jay");
  await dismissGuideIfPresent(page, viewport.name);
  await expectVisible(page, ".completion-pip", viewport.name);
  await expectVisible(page, ".completion-reveal", viewport.name);
  await expectCompletionRewardPolish(page, viewport.name);
  if ((await page.locator(".play-screen__back").count()) > 0) {
    await page.locator(".play-screen__back").click();
  }
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
  await expectVisible(page, ".badge-card", viewport.name);
  await expectMapPolish(page, viewport.name);
  await expectLockedBadgeGate(page, viewport.name);
  await expectNoHorizontalOverflow(page, viewport.name);

  await openFloatingView(page, "pantry");
  await verifyPantryPlacement(page, viewport.name);

  await verifyLargeBoardCatalogPuzzle(page, viewport.name);

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
    const shellRect = shell?.getBoundingClientRect();
    const shellStyle = shell ? getComputedStyle(shell) : null;
    return {
      viewportMeta,
      shellTop: shellRect?.top || 0,
      paddingTop: shellStyle ? parseFloat(shellStyle.paddingTop) : 0,
      paddingLeft: shellStyle ? parseFloat(shellStyle.paddingLeft) : 0,
      paddingRight: shellStyle ? parseFloat(shellStyle.paddingRight) : 0
    };
  });
  if (
    !metrics.viewportMeta.includes("viewport-fit=cover") ||
    metrics.paddingTop < 16 ||
    metrics.paddingLeft < 16 ||
    metrics.paddingRight < 16
  ) {
    failures.push("[" + viewportName + "] Safe-area chrome guard regression: " + JSON.stringify(metrics));
  }
}

async function dismissIntro(page, playerName) {
  await page.locator(".brand-intro__skip").click();
  const nameInput = page.locator("#player-intro-name");
  try {
    await nameInput.waitFor({ state: "visible", timeout: 700 });
    await nameInput.fill(playerName);
    await page.locator(".player-intro-form button").click();
  } catch {
    // Returning players skip the name form and the intro can close immediately.
  }
  await page.locator(".brand-intro").waitFor({ state: "detached", timeout: 2000 });
}


async function dismissGuideIfPresent(page, viewportName) {
  if ((await page.locator(".guide-overlay").count()) === 0) {
    return;
  }
  await expectVisible(page, ".guide-dialog", viewportName);
  await expectVisible(page, ".guide-dialog__art img", viewportName);
  await page.locator(".guide-dialog__skip").click();
  await page.locator(".guide-overlay").waitFor({ state: "detached", timeout: 2000 });
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
  const sealSrc = await page.locator(".brand-intro__seal img").first().getAttribute("src");
  if (!String(sealSrc || "").includes("pip-chrome-v2")) {
    failures.push("[" + viewportName + "] Opening seal should use current Pip chrome art, saw " + sealSrc);
  }

  const buttonMetrics = await page.locator(".brand-intro__skip").first().evaluate((button) => {
    const rect = button.getBoundingClientRect();
    const style = getComputedStyle(button);
    return {
      width: rect.width,
      height: rect.height,
      borderRadius: parseFloat(style.borderRadius),
      backgroundImage: style.backgroundImage
    };
  });
  if (buttonMetrics.width < 120 || buttonMetrics.height < 48 || buttonMetrics.borderRadius < 10 || !buttonMetrics.backgroundImage.includes("linear-gradient")) {
    failures.push("[" + viewportName + "] Opening start button lost its polished game-button treatment: " + JSON.stringify(buttonMetrics));
  }
}

async function expectSettingsDialogPolish(page, viewportName) {
  await page.locator('button[aria-label="Settings"], button[aria-label="설정"]').first().click();
  await expectVisible(page, ".settings-dialog", viewportName);
  const viewport = page.viewportSize() || { height: 844 };
  const metrics = await page.evaluate(() => {
    const dialog = document.querySelector(".settings-dialog");
    const dialogRect = dialog?.getBoundingClientRect();
    const overflowItems = [...document.querySelectorAll(".settings-dialog button, .settings-dialog input")]
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        const parentRect = el.parentElement?.getBoundingClientRect();
        return parentRect && (rect.left < parentRect.left - 1 || rect.right > parentRect.right + 1);
      })
      .map((el) => el.textContent || el.getAttribute("aria-label") || el.className);
    return {
      height: dialogRect?.height || 0,
      overflowItems,
      settingsPolish: (() => {
        const active = document.querySelector(".settings-dialog .language-option.active");
        const input = document.querySelector(".settings-dialog input");
        const close = document.querySelector(".settings-close");
        const activeStyle = active ? getComputedStyle(active) : null;
        const dialogStyle = dialog ? getComputedStyle(dialog) : null;
        const inputStyle = input ? getComputedStyle(input) : null;
        const closeStyle = close ? getComputedStyle(close) : null;
        return {
          dialogRadius: dialogStyle ? parseFloat(dialogStyle.borderRadius) : 0,
          dialogBackground: dialogStyle?.backgroundImage || "",
          activeHeight: active?.getBoundingClientRect().height || 0,
          activeBackground: activeStyle?.backgroundImage || "",
          inputHeight: input?.getBoundingClientRect().height || 0,
          inputRadius: inputStyle ? parseFloat(inputStyle.borderRadius) : 0,
          closeHeight: close?.getBoundingClientRect().height || 0,
          closeBackground: closeStyle?.backgroundImage || ""
        };
      })()
    };
  });
  if (
    metrics.height > viewport.height - 24 ||
    metrics.overflowItems.length ||
    metrics.settingsPolish.dialogRadius < 16 ||
    !metrics.settingsPolish.dialogBackground.includes("linear-gradient") ||
    metrics.settingsPolish.activeHeight < 48 ||
    !metrics.settingsPolish.activeBackground.includes("linear-gradient") ||
    metrics.settingsPolish.inputHeight < 42 ||
    metrics.settingsPolish.inputRadius < 8 ||
    metrics.settingsPolish.closeHeight < 50 ||
    !metrics.settingsPolish.closeBackground.includes("linear-gradient")
  ) {
    failures.push("[" + viewportName + "] Settings dialog polish regression: " + JSON.stringify(metrics));
  }
  await page.locator(".settings-close").click();
  await page.locator(".settings-dialog").waitFor({ state: "detached", timeout: 2000 });
}

async function expectAppChromePolish(page, viewportName) {
  await expectVisible(page, ".top-bar", viewportName);
  await expectVisible(page, ".header-actions", viewportName);
  const chromeMetrics = await page.evaluate(() => {
    const topBar = document.querySelector(".top-bar");
    const currency = document.querySelector(".currency-pill");
    const topBarRect = topBar?.getBoundingClientRect();
    const currencyRect = currency?.getBoundingClientRect();
    const style = topBar ? getComputedStyle(topBar) : null;
    return {
      topBarHeight: topBarRect?.height || 0,
      currencyHeight: currencyRect?.height || 0,
      borderRadius: style ? parseFloat(style.borderRadius) : 0,
      backgroundImage: style?.backgroundImage || ""
    };
  });
  if (chromeMetrics.topBarHeight < 68 || chromeMetrics.currencyHeight < 36 || chromeMetrics.borderRadius < 12 || !chromeMetrics.backgroundImage.includes("linear-gradient")) {
    failures.push("[" + viewportName + "] App chrome lost polished HUD treatment: " + JSON.stringify(chromeMetrics));
  }

  const trigger = page.locator(".floating-nav__trigger").first();
  await trigger.click();
  await page.locator(".floating-nav[data-open='true'] .floating-nav__menu").waitFor({ state: "visible", timeout: 3000 });
  const navMetrics = await page.evaluate(() => {
    const menu = document.querySelector(".floating-nav__menu");
    const rect = menu?.getBoundingClientRect();
    const style = menu ? getComputedStyle(menu) : null;
    return {
      left: rect?.left || 0,
      right: rect?.right || 0,
      width: rect?.width || 0,
      viewportWidth: window.innerWidth,
      borderRadius: style ? parseFloat(style.borderRadius) : 0,
      backgroundImage: style?.backgroundImage || ""
    };
  });
  if (navMetrics.left < -1 || navMetrics.right > navMetrics.viewportWidth + 1 || navMetrics.borderRadius < 12 || !navMetrics.backgroundImage.includes("linear-gradient")) {
    failures.push("[" + viewportName + "] Floating nav panel polish/layout regression: " + JSON.stringify(navMetrics));
  }
  await trigger.click();
}




async function expectAlbumPolish(page, viewportName) {
  const metrics = await page.evaluate(() => {
    const album = document.querySelector(".album-panel");
    const albumCard = document.querySelector(".album-card");
    const albumStamp = document.querySelector(".album-stamp");

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

    };
  });
  const boxes = [metrics.album, metrics.albumCard, metrics.albumStamp];
  const outside = boxes.some((box) => box.left < -1 || box.right > metrics.viewportWidth + 1);
  if (
    outside ||
    metrics.album.radius < 14 ||
    metrics.albumCard.radius < 12 ||
    metrics.albumStamp.height < 64 ||
    !metrics.album.background.includes("linear-gradient") ||
    !metrics.albumCard.background.includes("linear-gradient")
  ) {
    failures.push("[" + viewportName + "] Album polish regression: " + JSON.stringify(metrics));
  }
}

async function expectMapPolish(page, viewportName) {
  const metrics = await page.evaluate(() => {
    const map = document.querySelector(".map-panel");
    const badgeCard = document.querySelector(".badge-card");
    const badgeToken = document.querySelector(".badge-art-token");
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
      badgeToken: readBox(badgeToken)
    };
  });
  const boxes = [metrics.map, metrics.badgeCard, metrics.badgeToken];
  const outside = boxes.some((box) => box.left < -1 || box.right > metrics.viewportWidth + 1);
  if (
    outside ||
    metrics.map.radius < 14 ||
    metrics.badgeCard.radius < 12 ||
    metrics.badgeToken.height < 80 ||
    !metrics.map.background.includes("linear-gradient") ||
    !metrics.badgeCard.background.includes("linear-gradient")
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
    const reveal = document.querySelector(".completion-reveal");
    const actions = document.querySelector(".completion-actions");
    const bannerRect = banner?.getBoundingClientRect();
    const pipRect = pip?.getBoundingClientRect();
    const revealRect = reveal?.getBoundingClientRect();
    const actionsRect = actions?.getBoundingClientRect();
    const bannerStyle = banner ? getComputedStyle(banner) : null;
    const revealStyle = reveal ? getComputedStyle(reveal) : null;
    return {
      bannerWidth: bannerRect?.width || 0,
      bannerLeft: bannerRect?.left || 0,
      bannerRight: bannerRect?.right || 0,
      viewportWidth: window.innerWidth,
      pipWidth: pipRect?.width || 0,
      pipHeight: pipRect?.height || 0,
      revealWidth: revealRect?.width || 0,
      revealHeight: revealRect?.height || 0,
      actionsWidth: actionsRect?.width || 0,
      bannerRadius: bannerStyle ? parseFloat(bannerStyle.borderRadius) : 0,
      bannerBackground: bannerStyle?.backgroundImage || "",
      revealRadius: revealStyle ? parseFloat(revealStyle.borderRadius) : 0,
      revealBackground: revealStyle?.backgroundImage || ""
    };
  });
  if (
    metrics.bannerLeft < -1 ||
    metrics.bannerRight > metrics.viewportWidth + 1 ||
    metrics.pipWidth < 60 ||
    metrics.pipHeight < 60 ||
    metrics.revealWidth < 150 ||
    Math.abs(metrics.revealWidth - metrics.revealHeight) > 2 ||
    metrics.actionsWidth < metrics.bannerWidth * 0.72 ||
    metrics.bannerRadius < 14 ||
    metrics.revealRadius < 10 ||
    !metrics.bannerBackground.includes("linear-gradient") ||
    !metrics.revealBackground.includes("linear-gradient")
  ) {
    failures.push("[" + viewportName + "] Completion reward polish regression: " + JSON.stringify(metrics));
  }
}

async function expectStageCompleteRewardPolish(page, viewportName) {
  const metrics = await page.evaluate(() => {
    const overlay = document.createElement("div");
    overlay.className = "stage-complete-overlay";
    overlay.innerHTML = '<section class="stage-complete-card"><div class="stage-complete-pip stage-complete-pending-art"><strong>ART</strong></div><div class="stage-complete-copy"><p class="stage-complete-eyebrow">Complete</p><h2>Starter Stage</h2><p>Reward copy</p><p class="stage-complete-bonus"><img alt=""> +5 spoons</p><button type="button" class="tool-button stage-complete-cta">OK</button></div></section>';
    document.body.appendChild(overlay);
    const card = overlay.querySelector(".stage-complete-card");
    const art = overlay.querySelector(".stage-complete-pip");
    const cta = overlay.querySelector(".stage-complete-cta");
    const cardRect = card?.getBoundingClientRect();
    const artRect = art?.getBoundingClientRect();
    const ctaRect = cta?.getBoundingClientRect();
    const cardStyle = card ? getComputedStyle(card) : null;
    const overlayStyle = getComputedStyle(overlay);
    const ctaStyle = cta ? getComputedStyle(cta) : null;
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
      overlayBackground: overlayStyle.backgroundImage || "",
      ctaBackground: ctaStyle?.backgroundImage || ""
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
    !metrics.cardBackground.includes("linear-gradient") ||
    !metrics.overlayBackground.includes("radial-gradient") ||
    !metrics.ctaBackground.includes("linear-gradient")
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

async function expectLockedBadgeGate(page, viewportName) {
  const lockedText = await page.locator(".badge-card.locked").first().innerText();
  if (!lockedText.includes("Pantry room step") || !lockedText.includes("0/3")) {
    failures.push("[" + viewportName + "] Locked badge should explain pantry room progress, saw " + lockedText);
  }
}

async function expectLockedStageGate(page, viewportName) {
  const lockedText = await page.locator(".pack-block.locked").first().innerText();
  if (!lockedText.includes("Pantry room step") || !lockedText.includes("0/3") || !lockedText.includes("Need pantry story") || !lockedText.includes("Go to Pantry")) {
    failures.push("[" + viewportName + "] Locked stage should explain pantry story progress, saw " + lockedText);
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
async function openFloatingView(page, view) {
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
}
async function verifyLargeBoardCatalogPuzzle(page, viewportName) {
  await seedLargeBoardCatalogAccess(page);
  await page.reload({ waitUntil: "networkidle" });
  if ((await page.locator(".brand-intro").count()) > 0) {
    await page.locator(".brand-intro.game-stage").waitFor({ state: "visible", timeout: 6000 });
    await page.waitForTimeout(400);
    await dismissIntro(page, "Jay");
  }
  await dismissGuideIfPresent(page, viewportName);
  if ((await page.locator(".play-screen__back").count()) > 0) {
    await page.locator(".play-screen__back").click();
  }

  await openFloatingView(page, "puzzle");
  const largeBoardChipCount = await page.locator('.puzzle-chip[data-size="12"]').count();
  if (largeBoardChipCount < 49) {
    failures.push("[" + viewportName + "] Bakery Window should expose at least 49 12x12 catalog chips, saw " + largeBoardChipCount);
  }

  const villageLargeBoardChipCount = await page.locator('.pack-block[data-pack-id="village-pantry"] .puzzle-chip[data-size="10"]').count();
  if (villageLargeBoardChipCount < 56) {
    failures.push("[" + viewportName + "] Village Pantry should expose at least 56 10x10 catalog chips, saw " + villageLargeBoardChipCount);
  }

  const target = page.locator(".puzzle-chip", { hasText: /Bakery Window Glow/ }).first();
  await target.waitFor({ state: "visible", timeout: 5000 });
  await target.click();
  await expectVisible(page, ".play-screen", viewportName);
  await expectVisible(page, ".puzzle-panel", viewportName);
  await expectVisible(page, ".hint-panel", viewportName);
  await expectVisible(page, ".cursor-controls", viewportName);

  const titleText = await page.locator(".play-screen__title").first().innerText();
  if (!titleText.includes("Bakery Window Glow")) {
    failures.push("[" + viewportName + "] 12x12 play screen title should show Bakery Window Glow, saw " + titleText);
  }

  const sizeText = await page.locator(".play-screen__header .difficulty").first().innerText();
  if (!sizeText.includes("12")) {
    failures.push("[" + viewportName + "] 12x12 puzzle meta should show 12x12, saw " + sizeText);
  }

  const cellCount = await page.locator(".puzzle-grid .puzzle-cell").count();
  if (cellCount !== 144) {
    failures.push("[" + viewportName + "] Bakery Window Glow should render 144 cells, saw " + cellCount);
  }

  const boardSize = await page.locator(".board-wrap").first().evaluate((board) => getComputedStyle(board).getPropertyValue("--board-size").trim());
  if (boardSize !== "12") {
    failures.push("[" + viewportName + "] 12x12 board CSS variable should be 12, saw " + boardSize);
  }

  const hintText = await page.locator(".hint-panel").first().innerText();
  if (!hintText.includes("4")) {
    failures.push("[" + viewportName + "] 12x12 puzzle should expose 4 hints, saw " + hintText);
  }

  await expectNoHorizontalOverflow(page, viewportName);
  await page.locator(".play-screen__back").click();
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
  await expectVisible(page, ".pantry-placement-note", viewportName);
  await expectVisible(page, ".pantry-story-request", viewportName);
  await expectVisible(page, ".pantry-story-request__target", viewportName);
  await expectVisible(page, ".pantry-planning-deck", viewportName);
  const planningDeckCardCount = await page.locator(".pantry-planning-deck > div").count();
  if (planningDeckCardCount !== 5) {
    failures.push("[" + viewportName + "] Pantry planning deck should group 5 support cards, saw " + planningDeckCardCount);
  }
  await expectVisible(page, ".pantry-placement-advisor", viewportName);
  await expectVisible(page, ".pantry-savings-goal", viewportName);
  await expectVisible(page, ".pantry-earning-plan", viewportName);
  await expectVisible(page, ".pantry-earning-action", viewportName);
  await expectVisible(page, ".pantry-progress-board", viewportName);
  await expectVisible(page, ".pantry-display-plan", viewportName);
  await expectVisible(page, ".pantry-slot-filters", viewportName);
  await expectVisible(page, ".pantry-rarity-filters", viewportName);
  await expectVisible(page, ".pantry-availability-filters", viewportName);
  await expectVisible(page, ".pantry-sort-bar", viewportName);
  await expectVisible(page, ".pantry-filter-summary", viewportName);
  await expectVisible(page, ".pantry-item-card", viewportName);
  await expectVisible(page, ".pantry-item-status", viewportName);
  await expectVisible(page, ".pantry-item-savings", viewportName);
  await expectVisible(page, ".pantry-track-goal", viewportName);
  await expectVisible(page, ".pantry-slot-note", viewportName);
  await expectVisible(page, ".pantry-swap-note", viewportName);

  if ((await page.locator(".pantry-display-plan").count()) === 0) {
    failures.push("[" + viewportName + "] Pantry panel did not open; skipping dependent pantry text checks");
    return;
  }

  const allDisplayPlanText = await page.locator(".pantry-display-plan").first().innerText();
  if (!allDisplayPlanText.includes("0/5") || !allDisplayPlanText.includes("Tap")) {
    failures.push("[" + viewportName + "] Pantry display plan should summarize the empty room before a slot is selected, saw " + allDisplayPlanText);
  }

  const progressText = await page.locator(".pantry-progress-board").first().innerText();
  if (!progressText.includes("0/25") || !progressText.includes("0/6")) {
    failures.push("[" + viewportName + "] Pantry progress board should show seeded 0/25 collection and counter 0/6 progress, saw " + progressText);
  }

  const savingsGoalText = await page.locator(".pantry-savings-goal").first().innerText();
  if (!savingsGoalText.includes("17") && !savingsGoalText.includes("Need 17")) {
    failures.push("[" + viewportName + "] Pantry savings goal should show the next 17-spoon gap at seeded balance, saw " + savingsGoalText);
  }

  const earningPlanText = await page.locator(".pantry-earning-plan").first().innerText();
  if (!earningPlanText.includes("17") || !earningPlanText.includes("6") || !earningPlanText.includes("2")) {
    failures.push("[" + viewportName + "] Pantry earning plan should translate the 17-spoon gap into starter and daily runs, saw " + earningPlanText);
  }

  const firstSavingsText = await page.locator(".pantry-item-savings").first().innerText();
  if (!firstSavingsText.includes("3/") || !firstSavingsText.includes("more")) {
    failures.push("[" + viewportName + "] Pantry item savings meter should show seeded spoon progress, saw " + firstSavingsText);
  }

  const totalPantryCardCount = 25;
  const allCardCount = await page.locator(".pantry-item-card").count();
  if (allCardCount !== 6) {
    failures.push("[" + viewportName + "] Pantry should initially reveal 6 prioritized decoration cards, saw " + allCardCount);
  }
  await expectVisible(page, ".pantry-shop-limit", viewportName);
  const shopLimitText = await page.locator(".pantry-shop-limit").first().innerText();
  if (!shopLimitText.includes("6/25") || !shopLimitText.includes("Show more")) {
    failures.push("[" + viewportName + "] Pantry show-more control should explain the 6/25 progressive reveal, saw " + shopLimitText);
  }
  await page.locator(".pantry-shop-limit__action").click();
  await page.waitForTimeout(120);
  const expandedCardCount = await page.locator(".pantry-item-card").count();
  if (expandedCardCount !== 12) {
    failures.push("[" + viewportName + "] Pantry show-more should reveal the next decoration batch, saw " + expandedCardCount);
  }

  await page.locator(".pantry-sort-option", { hasText: /High price/ }).click();
  await page.waitForTimeout(120);
  const highPriceFirstTitle = await page.locator(".pantry-item-card h4").first().innerText();
  if (!/Golden Waffle Press/.test(highPriceFirstTitle)) {
    failures.push("[" + viewportName + "] High-price sort should put Golden Waffle Press first, saw " + highPriceFirstTitle);
  }
  await page.locator(".pantry-item-card").first().locator(".pantry-track-goal").click();
  await page.waitForTimeout(120);
  const trackedGoalPlanText = await page.locator(".pantry-earning-plan").innerText();
  if (!trackedGoalPlanText.includes("Golden Waffle Press") || !trackedGoalPlanText.includes("357")) {
    failures.push("[" + viewportName + "] Track-goal should retarget the spoon plan to Golden Waffle Press, saw " + trackedGoalPlanText);
  }
  if ((await page.locator(".pantry-track-goal.active").count()) !== 1) {
    failures.push("[" + viewportName + "] Track-goal active state did not appear");
  }
  await page.locator(".pantry-slot-filter").first().click();
  await page.locator(".pantry-sort-option", { hasText: /Recommended/ }).click();
  await page.waitForTimeout(120);

  await page.locator(".pantry-room-slot.slot-counter").click();
  await page.waitForTimeout(120);
  const counterAdvisorText = await page.locator(".pantry-placement-advisor").innerText();
  if (!counterAdvisorText.includes("Counter") || !counterAdvisorText.includes("6")) {
    failures.push("[" + viewportName + "] Counter placement advisor should explain the selected slot choices, saw " + counterAdvisorText);
  }
  const counterDisplayPlanText = await page.locator(".pantry-display-plan").innerText();
  if (!counterDisplayPlanText.includes("Counter") || !counterDisplayPlanText.includes("empty") || !counterDisplayPlanText.includes("Starter Counter Cloth")) {
    failures.push("[" + viewportName + "] Counter display plan should explain current empty spot and next upgrade, saw " + counterDisplayPlanText);
  }

  const counterCardCount = await page.locator(".pantry-item-card").count();
  if (counterCardCount !== 6) {
    failures.push("[" + viewportName + "] Counter slot should filter to 6 decorations, saw " + counterCardCount);
  }
  if ((await page.locator(".pantry-room-slot.slot-counter.selected").count()) !== 1) {
    failures.push("[" + viewportName + "] Counter slot did not show selected state");
  }

  await page.locator(".pantry-slot-filter", { hasText: /Window/ }).click();
  await page.waitForTimeout(120);
  const windowCardCount = await page.locator(".pantry-item-card").count();
  if (windowCardCount !== 5) {
    failures.push("[" + viewportName + "] Window filter should show 5 decorations, saw " + windowCardCount);
  }

  await page.locator(".pantry-slot-filter").first().click();
  await page.waitForTimeout(120);
  const restoredCardCount = await page.locator(".pantry-item-card").count();
  if (restoredCardCount !== 6) {
    failures.push("[" + viewportName + "] All-spots filter did not restore the default 6-card reveal, saw " + restoredCardCount);
  }

  await page.locator(".pantry-rarity-filter", { hasText: /Rare/ }).click();
  await page.waitForTimeout(120);
  const rareCardCount = await page.locator(".pantry-item-card").count();
  const rareSummaryText = await page.locator(".pantry-filter-summary").innerText();
  if (!rareSummaryText.includes("5") || !rareSummaryText.includes(String(totalPantryCardCount))) {
    failures.push("[" + viewportName + "] Rare filter summary should show 5 of " + totalPantryCardCount + ", saw " + rareSummaryText);
  }
  if (rareCardCount !== 5) {
    failures.push("[" + viewportName + "] Rare filter should show 5 decorations, saw " + rareCardCount);
  }

  await page.locator(".pantry-availability-filter", { hasText: /Can buy/ }).click();
  await page.waitForTimeout(120);
  await expectVisible(page, ".pantry-empty-state", viewportName);
  if ((await page.locator(".pantry-item-card").count()) !== 0) {
    failures.push("[" + viewportName + "] Rare plus can-buy filters should show the empty state only");
  }

  await page.locator(".pantry-reset-filters").click();
  await page.waitForTimeout(120);
  const resetCardCount = await page.locator(".pantry-item-card").count();
  if (resetCardCount !== 6) {
    failures.push("[" + viewportName + "] Reset filters did not restore the default 6-card reveal, saw " + resetCardCount);
  }

  await page.locator(".pantry-availability-filter", { hasText: /Can buy/ }).click();
  await page.waitForTimeout(120);
  const canBuyCardCount = await page.locator(".pantry-item-card").count();
  if (canBuyCardCount !== 1) {
    failures.push("[" + viewportName + "] Can-buy filter should show only the free starter decoration at seeded balance, saw " + canBuyCardCount);
  }

  await page.locator(".pantry-availability-filter").first().click();
  await page.waitForTimeout(120);
  await page.locator(".pantry-room-slot.slot-counter").click();
  await page.waitForTimeout(120);

  const firstSwapNote = await page.locator(".pantry-swap-note").first().innerText();
  if (!/empty|place/i.test(firstSwapNote)) {
    failures.push("[" + viewportName + "] First pantry item should explain empty-slot placement, saw " + firstSwapNote);
  }

  await page.locator(".pantry-item-card").first().locator(".pantry-item-action").click();
  await page.waitForTimeout(120);
  if ((await page.locator(".guide-overlay").count()) === 0) {
    failures.push("[" + viewportName + "] First Pantry purchase did not open Pip guide");
  } else {
    await expectVisible(page, ".guide-dialog", viewportName);
    await page.locator(".guide-dialog__skip").click();
    await page.locator(".guide-overlay").waitFor({ state: "detached", timeout: 2000 });
  }

  await expectVisible(page, ".pantry-action-feedback", viewportName);
  const feedbackText = await page.locator(".pantry-action-feedback").innerText();
  if (!feedbackText.includes("Starter Counter Cloth") || !feedbackText.includes("Pantry updated")) {
    failures.push("[" + viewportName + "] Pantry purchase feedback should celebrate the placed starter decoration, saw " + feedbackText);
  }

  await expectVisible(page, ".pantry-progress-board", viewportName);
  const postPurchaseProgressText = await page.locator(".pantry-progress-board").innerText();
  if (!postPurchaseProgressText.includes("1/25") || !postPurchaseProgressText.includes("1/5")) {
    failures.push("[" + viewportName + "] First Pantry purchase did not update collection progress, saw " + postPurchaseProgressText);
  }
  if ((await page.locator(".pantry-room-slot.slot-counter.filled").count()) !== 1) {
    failures.push("[" + viewportName + "] First Pantry purchase did not fill the counter room slot");
  }
  if ((await page.locator(".pantry-room-slot.slot-counter.selected").count()) !== 1) {
    failures.push("[" + viewportName + "] Pantry did not preserve the selected counter slot after purchase refresh");
  }
  await expectVisible(page, ".pantry-story-milestone", viewportName);
  await expectVisible(page, ".pantry-story-milestone__items", viewportName);
  const storyMilestoneText = await page.locator(".pantry-story-milestone").first().innerText();
  if (!storyMilestoneText.includes("Pantry bond") || !storyMilestoneText.includes("Next arrivals")) {
    failures.push("[" + viewportName + "] First Pantry purchase did not reveal the story milestone, saw " + storyMilestoneText);
  }
  const postPurchasePlanText = await page.locator(".pantry-display-plan").innerText();
  if (!postPurchasePlanText.includes("Counter") || !postPurchasePlanText.includes("Starter Counter Cloth") || !postPurchasePlanText.includes("currently displayed")) {
    failures.push("[" + viewportName + "] Pantry display plan did not preserve the filled counter context after purchase, saw " + postPurchasePlanText);
  }
  await page.locator(".pantry-story-milestone__item").first().click();
  await page.waitForTimeout(120);
  await expectVisible(page, ".pantry-story-delivery", viewportName);
  const storyDeliveryText = await page.locator(".pantry-story-delivery").first().innerText();
  if (!storyDeliveryText.includes("Pip\'s delivery note") || !storyDeliveryText.includes("Show this goal")) {
    failures.push("[" + viewportName + "] Next arrival click did not pin a delivery note, saw " + storyDeliveryText);
  }

  await page.evaluate(() => {
    const saveKey = "pips-picture-pantry:v0.1:save:jay";
    const save = JSON.parse(localStorage.getItem(saveKey) || "{}");
    save.pantrySpoons = 25;
    localStorage.setItem(saveKey, JSON.stringify(save));
  });
  await openFloatingView(page, "puzzle");
  await openFloatingView(page, "pantry");
  await expectVisible(page, ".pantry-story-delivery", viewportName);
  await page.reload({ waitUntil: "domcontentloaded" });
  if ((await page.locator(".brand-intro").count()) > 0) {
    await page.locator(".brand-intro.game-stage").waitFor({ state: "visible", timeout: 6000 });
    await dismissIntro(page, "Jay");
    await dismissGuideIfPresent(page, viewportName);
  }
  await openFloatingView(page, "pantry");
  await expectVisible(page, ".pantry-story-delivery", viewportName);
  const persistedDeliveryText = await page.locator(".pantry-story-delivery").first().innerText();
  if (!persistedDeliveryText.includes("Small Jam Jar")) {
    failures.push("[" + viewportName + "] Delivery note did not survive a page reload, saw " + persistedDeliveryText);
  }
  await page.locator(".pantry-story-delivery__action", { hasText: /Show this goal/ }).click();
  await page.waitForTimeout(120);
  await page.locator(".pantry-item-card", { hasText: /Small Jam Jar/ }).first().locator(".pantry-item-action").click();
  await page.waitForTimeout(120);
  await expectVisible(page, ".pantry-action-feedback.story-complete", viewportName);
  const storyCompleteText = await page.locator(".pantry-action-feedback.story-complete").first().innerText();
  if (!storyCompleteText.includes("Delivery complete") || !storyCompleteText.includes("Small Jam Jar")) {
    failures.push("[" + viewportName + "] Delivery goal purchase should show story-complete feedback, saw " + storyCompleteText);
  }
  const completedStoryState = await page.evaluate(() => {
    const save = JSON.parse(localStorage.getItem("pips-picture-pantry:v0.1:save:jay") || "{}");
    return {
      activeGoal: save.pantryStoryGoalId || null,
      completedGoals: Array.isArray(save.pantryCompletedStoryGoalIds) ? save.pantryCompletedStoryGoalIds : []
    };
  });
  if (completedStoryState.activeGoal !== null || !completedStoryState.completedGoals.includes("small-jam-jar")) {
    failures.push("[" + viewportName + "] Delivery completion was not recorded in save state: " + JSON.stringify(completedStoryState));
  }
  await expectVisible(page, ".pantry-story-archive", viewportName);
  const storyArchiveText = await page.locator(".pantry-story-archive").first().innerText();
  const normalizedStoryArchiveText = storyArchiveText.toLowerCase();
  if (!storyArchiveText.includes("Pip's request log") || !storyArchiveText.includes("Small Jam Jar") || !storyArchiveText.includes("Next room step") || !storyArchiveText.includes("1/3") || !normalizedStoryArchiveText.includes("room chapter") || !storyArchiveText.includes("Chapter 2") || !storyArchiveText.includes("Next puzzle stage") || !storyArchiveText.includes("2 more requests") || !storyArchiveText.includes("Stage key") || !storyArchiveText.includes("/80 spoons") || !normalizedStoryArchiveText.includes("next pip request") || !storyArchiveText.includes("Plan request")) {
    failures.push("[" + viewportName + "] Delivery completion archive did not show request progress, saw " + storyArchiveText);
  }
  await expectVisible(page, ".pantry-story-archive__meter", viewportName);
  await expectVisible(page, ".pantry-story-archive__chapter", viewportName);
  await expectVisible(page, ".pantry-story-archive__stage-goal", viewportName);
  await expectVisible(page, ".pantry-story-archive__next", viewportName);
  await page.locator(".pantry-story-archive__next-action").click();
  await page.waitForTimeout(120);
  await expectVisible(page, ".pantry-story-delivery", viewportName);
  const chainedDeliveryText = await page.locator(".pantry-story-delivery").first().innerText();
  if (!chainedDeliveryText.includes("Pip's delivery note") || !chainedDeliveryText.includes("Show this goal")) {
    failures.push("[" + viewportName + "] Archive next request did not pin a new delivery note, saw " + chainedDeliveryText);
  }

  await expectNoHorizontalOverflow(page, viewportName);
  await expectTapTargets(page, viewportName);
}
