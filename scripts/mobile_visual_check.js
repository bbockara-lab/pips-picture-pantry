import { chromium } from "@playwright/test";

const qaPort = process.env.PPP_QA_PORT || "5173";
const TARGET_URL = process.env.PPP_URL || `http://127.0.0.1:${qaPort}/`;
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
  await expectVisible(page, ".brand-intro__version", viewport.name);
  await expectOpeningIntroPolish(page, viewport.name);
  await expectAbsent(page, ".brand-intro__cast", viewport.name);
  await dismissIntro(page, "Jay", viewport.name);

  await expectVisible(page, ".app-shell", viewport.name);
  await expectSafeAreaChromeGuard(page, viewport.name);
  await dismissGuideIfPresent(page, viewport.name);
  await expectSettingsDialogPolish(page, viewport.name);
  if ((await page.locator(".play-screen").count()) > 0) {
    await expectVisible(page, ".play-screen", viewport.name);
    await expectStageNavigationPolish(page, viewport.name);
    await page.locator(".play-screen__back").click();
  }
  await expectVisible(page, ".pip-strip__portrait", viewport.name);
  await expectVisible(page, ".currency-pill", viewport.name);
  await expectAppChromePolish(page, viewport.name);
  await expectDailyRewardPolish(page, viewport.name);
  await expectResetDialogPolish(page, viewport.name);
  await expectStageCompleteRewardPolish(page, viewport.name);
  await expectVisible(page, ".pack-block", viewport.name);
  await expectVisible(page, ".pack-block.locked", viewport.name);
  await expectLockedStageGate(page, viewport.name);
  await expectVisible(page, ".stage-preview", viewport.name);
  await expectStageArtPreviews(page, viewport.name);
  await expectPuzzleHubSelectionPolish(page, viewport.name);
  await expectSeasonUpdateTeaser(page, viewport.name);
  await expectNoHorizontalOverflow(page, viewport.name);
  await expectTapTargets(page, viewport.name);

  await seedCompletedStarter(page);
  await page.reload({ waitUntil: "networkidle" });
  await page.locator(".brand-intro.game-stage").waitFor({ state: "visible", timeout: 6000 });
  await page.waitForTimeout(800);
  await expectVisible(page, ".brand-intro.game-stage", viewport.name);
  await dismissIntro(page, "Jay", viewport.name);
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

async function expectPlayerIntroPolish(page, viewportName) {
  const metrics = await page.locator(".brand-intro__content.name-stage").first().evaluate((content) => {
    const note = content.querySelector(".player-intro-note");
    const pipCue = content.querySelector(".player-intro-pip");
    const pipCueImage = pipCue?.querySelector("img");
    const pipCueText = pipCue?.querySelector("span");
    const form = content.querySelector(".player-intro-form");
    const label = form?.querySelector("label");
    const input = form?.querySelector("input");
    const button = form?.querySelector("button");
    const formRect = form?.getBoundingClientRect();
    const pipCueRect = pipCue?.getBoundingClientRect();
    const pipCueImageRect = pipCueImage?.getBoundingClientRect();
    const inputRect = input?.getBoundingClientRect();
    const buttonRect = button?.getBoundingClientRect();
    const formStyle = form ? getComputedStyle(form) : null;
    const formBefore = form ? getComputedStyle(form, "::before") : null;
    const pipCueStyle = pipCue ? getComputedStyle(pipCue) : null;
    const pipCueAfter = pipCue ? getComputedStyle(pipCue, "::after") : null;
    const labelStyle = label ? getComputedStyle(label) : null;
    const inputStyle = input ? getComputedStyle(input) : null;
    const buttonStyle = button ? getComputedStyle(button) : null;
    return {
      noteText: note?.textContent?.trim() || "",
      noteWidth: note?.getBoundingClientRect().width || 0,
      formWidth: formRect?.width || 0,
      formRadius: formStyle ? parseFloat(formStyle.borderRadius) : 0,
      formBackground: formStyle?.backgroundImage || "",
      formShadow: formStyle?.boxShadow || "none",
      shineContent: formBefore?.content || "none",
      shineHeight: formBefore ? parseFloat(formBefore.height) : 0,
      shineBackground: formBefore?.backgroundImage || "",
      pipCueText: pipCueText?.textContent?.trim() || "",
      pipCueWidth: pipCueRect?.width || 0,
      pipCueImageWidth: pipCueImageRect?.width || 0,
      pipCueRadius: pipCueStyle ? parseFloat(pipCueStyle.borderRadius) : 0,
      pipCueBackground: pipCueStyle?.backgroundImage || "",
      pipCueShadow: pipCueStyle?.boxShadow || "none",
      pipCueTailContent: pipCueAfter?.content || "none",
      labelText: label?.textContent?.trim() || "",
      labelBackground: labelStyle?.backgroundImage || "",
      labelRadius: labelStyle ? parseFloat(labelStyle.borderRadius) : 0,
      inputHeight: inputRect?.height || 0,
      inputRadius: inputStyle ? parseFloat(inputStyle.borderRadius) : 0,
      inputBackground: inputStyle?.backgroundImage || "",
      inputShadow: inputStyle?.boxShadow || "none",
      buttonWidth: buttonRect?.width || 0,
      buttonHeight: buttonRect?.height || 0,
      buttonBackground: buttonStyle?.backgroundImage || "",
      buttonShadow: buttonStyle?.boxShadow || "none",
      overflows: form ? form.scrollWidth > Math.ceil(formRect.width) + 1 || form.scrollHeight > Math.ceil(formRect.height) + 1 : true
    };
  });
  if (
    !metrics.noteText ||
    metrics.noteWidth < 190 ||
    metrics.formWidth < 250 ||
    metrics.formRadius < 16 ||
    !metrics.formBackground.includes("linear-gradient") ||
    metrics.formShadow === "none" ||
    metrics.shineContent === "none" ||
    metrics.shineHeight < 10 ||
    !metrics.shineBackground.includes("linear-gradient") ||
    !metrics.pipCueText ||
    metrics.pipCueWidth < 240 ||
    metrics.pipCueImageWidth < 46 ||
    metrics.pipCueRadius < 16 ||
    !metrics.pipCueBackground.includes("linear-gradient") ||
    metrics.pipCueShadow === "none" ||
    metrics.pipCueTailContent === "none" ||
    !metrics.labelText ||
    !metrics.labelBackground.includes("linear-gradient") ||
    metrics.labelRadius < 14 ||
    metrics.inputHeight < 50 ||
    metrics.inputRadius < 12 ||
    !metrics.inputBackground.includes("linear-gradient") ||
    metrics.inputShadow === "none" ||
    metrics.buttonWidth < 240 ||
    metrics.buttonHeight < 54 ||
    !metrics.buttonBackground.includes("linear-gradient") ||
    metrics.buttonShadow === "none" ||
    metrics.overflows
  ) {
    failures.push("[" + viewportName + "] Player name intro lost polished invitation treatment: " + JSON.stringify(metrics));
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
  await page.locator(".guide-dialog__skip").first().click({ force: true });
  await overlay.first().waitFor({ state: "detached", timeout: 3000 });
}

async function expectGuideDialogChromeArt(page, viewportName) {
  const guideMetrics = await page.locator(".guide-dialog").first().evaluate((dialog) => {
    const overlay = document.querySelector(".guide-overlay");
    const rect = dialog.getBoundingClientRect();
    const art = dialog.querySelector(".guide-dialog__art");
    const image = dialog.querySelector(".guide-dialog__art img");
    const bubble = dialog.querySelector(".guide-dialog__bubble");
    const artRect = art?.getBoundingClientRect();
    const imageRect = image?.getBoundingClientRect();
    const bubbleRect = bubble?.getBoundingClientRect();
    const artStyle = art ? getComputedStyle(art) : null;
    const imageStyle = image ? getComputedStyle(image) : null;
    const bubbleStyle = bubble ? getComputedStyle(bubble) : null;
    const artBefore = art ? getComputedStyle(art, "::before") : null;
    const artAfter = art ? getComputedStyle(art, "::after") : null;
    const bubbleBefore = bubble ? getComputedStyle(bubble, "::before") : null;
    const bubbleAfter = bubble ? getComputedStyle(bubble, "::after") : null;
    const overlayStyle = overlay ? getComputedStyle(overlay) : null;
    const buttons = [...dialog.querySelectorAll(".guide-dialog__actions button")].map((button) => {
      const buttonRect = button.getBoundingClientRect();
      const buttonStyle = getComputedStyle(button);
      const buttonBefore = getComputedStyle(button, "::before");
      return {
        width: buttonRect.width,
        height: buttonRect.height,
        radius: parseFloat(buttonStyle.borderRadius),
        borderWidth: parseFloat(buttonStyle.borderTopWidth),
        background: buttonStyle.backgroundImage,
        shadow: buttonStyle.boxShadow,
        overflow: buttonStyle.overflow,
        shineContent: buttonBefore.content,
        shineHeight: parseFloat(buttonBefore.height)
      };
    });
    return {
      width: rect.width,
      height: rect.height,
      imageSrc: image?.getAttribute("src") || "",
      artWidth: artRect?.width || 0,
      artHeight: artRect?.height || 0,
      imageWidth: imageRect?.width || 0,
      imageHeight: imageRect?.height || 0,
      imageFit: imageStyle?.objectFit || "",
      artBackground: artStyle?.backgroundImage || "",
      artOverflow: artStyle?.overflow || "",
      artShineContent: artBefore?.content || "",
      artShineHeight: artBefore ? parseFloat(artBefore.height) : 0,
      artTokenContent: artAfter?.content || "",
      artTokenWidth: artAfter ? parseFloat(artAfter.width) : 0,
      bubbleWidth: bubbleRect?.width || 0,
      bubbleHeight: bubbleRect?.height || 0,
      bubbleBackground: bubbleStyle?.backgroundImage || "",
      bubbleRadius: bubbleStyle ? parseFloat(bubbleStyle.borderRadius) : 0,
      bubbleShadow: bubbleStyle?.boxShadow || "",
      bubbleOverflow: bubbleStyle?.overflow || "",
      bubbleTailContent: bubbleBefore?.content || "",
      bubbleTokenContent: bubbleAfter?.content || "",
      bubbleTokenWidth: bubbleAfter ? parseFloat(bubbleAfter.width) : 0,
      bubbleAccentBackground: bubbleAfter?.backgroundImage || "",
      overlayPaddingBottom: overlayStyle ? parseFloat(overlayStyle.paddingBottom) : 0,
      eyebrowText: dialog.querySelector(".guide-dialog__eyebrow")?.textContent.trim() || "",
      titleText: dialog.querySelector("#guide-dialog-title")?.textContent.trim() || "",
      bodyText: bubble?.querySelector("p:not(.guide-dialog__eyebrow)")?.textContent.trim() || "",
      buttons,
      overflows: dialog.scrollWidth > Math.ceil(rect.width) + 1 || dialog.scrollHeight > Math.ceil(rect.height) + 1
    };
  });
  if (
    !guideMetrics.imageSrc.includes("pip-chrome-v2") ||
    guideMetrics.artWidth < 90 ||
    guideMetrics.artHeight < 120 ||
    guideMetrics.imageWidth < 80 ||
    guideMetrics.imageHeight < 80 ||
    guideMetrics.imageFit !== "contain" ||
    !guideMetrics.artBackground.includes("gradient") ||
    guideMetrics.artOverflow !== "hidden" ||
    guideMetrics.artShineContent === "none" ||
    guideMetrics.artShineHeight < 10 ||
    guideMetrics.artTokenContent === "none" ||
    guideMetrics.artTokenWidth < 20 ||
    guideMetrics.bubbleWidth < 160 ||
    guideMetrics.bubbleHeight < 140 ||
    !guideMetrics.bubbleBackground.includes("gradient") ||
    guideMetrics.bubbleRadius < 16 ||
    guideMetrics.bubbleShadow === "none" ||
    guideMetrics.bubbleOverflow !== "hidden" ||
    guideMetrics.bubbleTailContent === "none" ||
    guideMetrics.bubbleTokenContent === "none" ||
    guideMetrics.bubbleTokenWidth < 16 ||
    !guideMetrics.eyebrowText ||
    !guideMetrics.titleText ||
    !guideMetrics.bodyText ||
    guideMetrics.buttons.length !== 2 ||
    guideMetrics.buttons.some((button) =>
      button.width < 110 ||
      button.height < 46 ||
      button.radius < 14 ||
      button.borderWidth < 3 ||
      !button.background.includes("gradient") ||
      button.shadow === "none" ||
      button.overflow !== "hidden" ||
      button.shineContent === "none" ||
      button.shineHeight < 8
    ) ||
    guideMetrics.overlayPaddingBottom < 18 ||
    guideMetrics.overflows
  ) {
    failures.push("[" + viewportName + "] Guide dialog lost current Pip chrome art treatment: " + JSON.stringify(guideMetrics));
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
  const sealSrc = await page.locator(".brand-intro__seal img").first().getAttribute("src");
  if (!String(sealSrc || "").includes("pip-chrome-v2")) {
    failures.push("[" + viewportName + "] Opening seal should use current Pip chrome art, saw " + sealSrc);
  }

  const versionText = await page.locator(".brand-intro__version").first().textContent();
  if (!String(versionText || "").includes("v0.1.")) {
    failures.push("[" + viewportName + "] Opening version chip is missing the visible app version: " + versionText);
  }

  const buttonMetrics = await page.locator(".brand-intro__skip").first().evaluate((button) => {
    const rect = button.getBoundingClientRect();
    const style = getComputedStyle(button);
    const shineStyle = getComputedStyle(button, "::before");
    const tokenStyle = getComputedStyle(button, "::after");
    return {
      width: rect.width,
      height: rect.height,
      borderWidth: parseFloat(style.borderTopWidth),
      borderRadius: parseFloat(style.borderRadius),
      backgroundImage: style.backgroundImage,
      boxShadow: style.boxShadow,
      overflow: style.overflow,
      shineContent: shineStyle.content,
      shineHeight: parseFloat(shineStyle.height),
      shineBackground: shineStyle.backgroundImage,
      tokenContent: tokenStyle.content,
      tokenWidth: parseFloat(tokenStyle.width),
      tokenHeight: parseFloat(tokenStyle.height),
      tokenBackground: tokenStyle.backgroundImage,
      tokenShadow: tokenStyle.boxShadow
    };
  });
  const hasStartShine = buttonMetrics.shineContent !== "none" && buttonMetrics.shineHeight >= 10 && buttonMetrics.shineBackground.includes("linear-gradient");
  const hasStartToken = buttonMetrics.tokenContent !== "none" && buttonMetrics.tokenWidth >= 20 && buttonMetrics.tokenHeight >= 20 && buttonMetrics.tokenBackground.includes("linear-gradient") && buttonMetrics.tokenShadow !== "none";
  if (buttonMetrics.width < 160 || buttonMetrics.height < 56 || buttonMetrics.borderWidth < 4 || buttonMetrics.borderRadius < 16 || !buttonMetrics.backgroundImage.includes("linear-gradient") || buttonMetrics.boxShadow === "none" || buttonMetrics.overflow !== "hidden" || !hasStartShine || !hasStartToken) {
    failures.push("[" + viewportName + "] Opening start button lost its polished game-button treatment: " + JSON.stringify(buttonMetrics));
  }
  const promiseMetrics = await page.locator(".brand-intro__promise-chip").evaluateAll((chips) => chips.map((chip) => {
    const rect = chip.getBoundingClientRect();
    const icon = chip.querySelector("i");
    const text = chip.querySelector("b");
    const style = getComputedStyle(chip);
    const shineStyle = getComputedStyle(chip, "::before");
    const tokenStyle = getComputedStyle(chip, "::after");
    const iconRect = icon?.getBoundingClientRect();
    return {
      text: (text?.textContent || "").trim(),
      width: rect.width,
      height: rect.height,
      borderWidth: parseFloat(style.borderTopWidth),
      borderRadius: parseFloat(style.borderRadius),
      backgroundImage: style.backgroundImage,
      boxShadow: style.boxShadow,
      overflow: style.overflow,
      shineContent: shineStyle.content,
      shineHeight: parseFloat(shineStyle.height),
      shineBackground: shineStyle.backgroundImage,
      tokenContent: tokenStyle.content,
      tokenWidth: parseFloat(tokenStyle.width),
      tokenHeight: parseFloat(tokenStyle.height),
      tokenBackground: tokenStyle.backgroundImage,
      iconWidth: iconRect?.width || 0,
      iconHeight: iconRect?.height || 0,
      overflows: chip.scrollWidth > Math.ceil(rect.width) + 1 || chip.scrollHeight > Math.ceil(rect.height) + 1
    };
  }));
  if (promiseMetrics.length !== 3) {
    failures.push("[" + viewportName + "] Opening promise strip should show 3 tactile chips, saw " + promiseMetrics.length);
  }
  promiseMetrics.forEach((metrics, index) => {
    const hasChipShine = metrics.shineContent !== "none" && metrics.shineHeight >= 7 && metrics.shineBackground.includes("linear-gradient");
    const hasCornerToken = metrics.tokenContent !== "none" && metrics.tokenWidth >= 8 && metrics.tokenHeight >= 8 && metrics.tokenBackground.includes("gradient");
    if (!metrics.text || metrics.width < 70 || metrics.height < 34 || metrics.borderWidth < 3 || metrics.borderRadius < 14 || !metrics.backgroundImage.includes("linear-gradient") || metrics.boxShadow === "none" || metrics.overflow !== "hidden" || !hasChipShine || !hasCornerToken || metrics.iconWidth < 14 || metrics.iconHeight < 14 || metrics.overflows) {
      failures.push("[" + viewportName + "] Opening promise chip " + (index + 1) + " lost readable tactile treatment: " + JSON.stringify(metrics));
    }
  });
}

async function expectSettingsDialogPolish(page, viewportName) {
  await page.locator('button[aria-label="Settings"], button[aria-label="\uC124\uC815"]').first().click();
  await expectVisible(page, ".settings-dialog", viewportName);
  const viewport = page.viewportSize() || { height: 844 };
  const metrics = await page.evaluate(() => {
    const backdrop = document.querySelector(".modal-backdrop");
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
      backdropPaddingBottom: backdrop ? parseFloat(getComputedStyle(backdrop).paddingBottom) : 0,
      overflowItems,
      settingsPolish: (() => {
        const active = document.querySelector(".settings-dialog .language-option.active");
        const playerForm = document.querySelector(".player-form");

        const input = document.querySelector(".settings-dialog input");
        const close = document.querySelector(".settings-close");
        const title = document.querySelector(".settings-dialog h2");
        const save = document.querySelector(".settings-choice--save");
        const languageChoices = [...document.querySelectorAll(".settings-choice--language")];
        const controlChoices = [...document.querySelectorAll(".settings-choice--control")];
        const audioChoices = [...document.querySelectorAll(".settings-choice--audio")];
        const activeStyle = active ? getComputedStyle(active) : null;
        const dialogStyle = dialog ? getComputedStyle(dialog) : null;
        const playerFormStyle = playerForm ? getComputedStyle(playerForm) : null;

        const playerFormBefore = playerForm ? getComputedStyle(playerForm, "::before") : null;

        const inputStyle = input ? getComputedStyle(input) : null;
        const closeStyle = close ? getComputedStyle(close) : null;
        const titleBefore = title ? getComputedStyle(title, "::before") : null;
        const activeAfter = active ? getComputedStyle(active, "::after") : null;
        const saveStyle = save ? getComputedStyle(save) : null;
        const supportCard = document.querySelector(".support-pack-card");
        const supportLabel = supportCard?.querySelector(".section-label");
        const supportBody = supportCard?.querySelector(".support-pack-card__body");
        const supportStatus = supportCard?.querySelector(".support-pack-card__status");
        const supportActions = [...(supportCard?.querySelectorAll("button") || [])];
        const supportStyle = supportCard ? getComputedStyle(supportCard) : null;
        const supportBefore = supportCard ? getComputedStyle(supportCard, "::before") : null;
        const supportAfter = supportCard ? getComputedStyle(supportCard, "::after") : null;
        return {
          dialogRadius: dialogStyle ? parseFloat(dialogStyle.borderRadius) : 0,
          dialogBackground: dialogStyle?.backgroundImage || "",
          titleBadgeWidth: titleBefore ? parseFloat(titleBefore.width) : 0,
          activeHeight: active?.getBoundingClientRect().height || 0,
          activeBackground: activeStyle?.backgroundImage || "",
          activeMarkerBackground: activeAfter?.backgroundImage || "",

          playerFormRadius: playerFormStyle ? parseFloat(playerFormStyle.borderRadius) : 0,

          playerFormBackground: playerFormStyle?.backgroundImage || "",

          playerFormShadow: playerFormStyle?.boxShadow || "none",

          playerFormBadgeWidth: playerFormBefore ? parseFloat(playerFormBefore.width) : 0,
          inputHeight: input?.getBoundingClientRect().height || 0,
          inputRadius: inputStyle ? parseFloat(inputStyle.borderRadius) : 0,
          saveHeight: save?.getBoundingClientRect().height || 0,
          saveBackground: saveStyle?.backgroundImage || "",
          closeHeight: close?.getBoundingClientRect().height || 0,
          closeBackground: closeStyle?.backgroundImage || "",
          languageChoiceCount: languageChoices.length,
          controlChoiceCount: controlChoices.length,
          audioChoiceCount: audioChoices.length,
          supportCard: {
            exists: Boolean(supportCard),
            labelText: supportLabel?.textContent?.trim() || "",
            bodyText: supportBody?.textContent?.trim() || "",
            statusText: supportStatus?.textContent?.trim() || "",
            height: supportCard?.getBoundingClientRect().height || 0,
            radius: supportStyle ? parseFloat(supportStyle.borderRadius) : 0,
            background: supportStyle?.backgroundImage || "",
            shadow: supportStyle?.boxShadow || "none",
            shineHeight: supportBefore ? parseFloat(supportBefore.height) : 0,
            shineBackground: supportBefore?.backgroundImage || "",
            tokenWidth: supportAfter ? parseFloat(supportAfter.width) : 0,
            tokenHeight: supportAfter ? parseFloat(supportAfter.height) : 0,
            tokenBackground: supportAfter?.backgroundImage || "",
            actionCount: supportActions.length,
            actionHeights: supportActions.map((button) => button.getBoundingClientRect().height),
            actionBackgrounds: supportActions.map((button) => getComputedStyle(button).backgroundImage || "")
          },
          choiceGroupCards: [
            document.querySelector(".settings-choice-grid--language"),
            document.querySelector(".settings-choice-grid--control"),
            document.querySelector(".audio-options")
          ].map((group) => {
            const rect = group?.getBoundingClientRect() || { height: 0 };
            const style = group ? getComputedStyle(group) : null;
            const shine = group ? getComputedStyle(group, "::before") : null;
            return {
              height: rect.height,
              radius: style ? parseFloat(style.borderRadius) : 0,
              background: style?.backgroundImage || "",
              shadow: style?.boxShadow || "none",
              shineBackground: shine?.backgroundImage || "",
              shineHeight: shine ? parseFloat(shine.height) : 0
            };
          }),
          choiceShines: [...languageChoices, ...controlChoices, ...audioChoices].map((choice) => {
            const shine = getComputedStyle(choice, "::before");
            const marker = getComputedStyle(choice, "::after");
            return {
              shineWidth: parseFloat(shine.width) || 0,
              shineHeight: parseFloat(shine.height) || 0,
              shineBackground: shine.backgroundImage || "",
              markerBackground: marker.backgroundImage || ""
            };
          })
        };
      })()
    };
  });
  if (
    metrics.height > viewport.height - 24 ||
    metrics.backdropPaddingBottom < 18 ||
    metrics.overflowItems.length ||
    metrics.settingsPolish.dialogRadius < 16 ||
    !metrics.settingsPolish.dialogBackground.includes("linear-gradient") ||
    metrics.settingsPolish.titleBadgeWidth < 18 ||
    metrics.settingsPolish.activeHeight < 48 ||
    !metrics.settingsPolish.activeBackground.includes("linear-gradient") ||
    !metrics.settingsPolish.activeMarkerBackground.includes("radial-gradient") ||

    metrics.settingsPolish.playerFormRadius < 16 ||

    !metrics.settingsPolish.playerFormBackground.includes("linear-gradient") ||

    metrics.settingsPolish.playerFormShadow === "none" ||

    metrics.settingsPolish.playerFormBadgeWidth < 20 ||
    metrics.settingsPolish.inputHeight < 42 ||
    metrics.settingsPolish.inputRadius < 8 ||
    metrics.settingsPolish.saveHeight < 48 ||
    !metrics.settingsPolish.saveBackground.includes("linear-gradient") ||
    metrics.settingsPolish.closeHeight < 50 ||
    !metrics.settingsPolish.closeBackground.includes("linear-gradient") ||
    metrics.settingsPolish.languageChoiceCount !== 3 ||
    metrics.settingsPolish.controlChoiceCount !== 3 ||
    metrics.settingsPolish.audioChoiceCount !== 2 ||
    !metrics.settingsPolish.supportCard.exists ||
    !metrics.settingsPolish.supportCard.labelText ||
    !metrics.settingsPolish.supportCard.bodyText ||
    !metrics.settingsPolish.supportCard.statusText ||
    metrics.settingsPolish.supportCard.height < 120 ||
    metrics.settingsPolish.supportCard.radius < 16 ||
    !metrics.settingsPolish.supportCard.background.includes("gradient") ||
    metrics.settingsPolish.supportCard.shadow === "none" ||
    !metrics.settingsPolish.supportCard.shineBackground.includes("gradient") ||
    metrics.settingsPolish.supportCard.shineHeight < 20 ||
    metrics.settingsPolish.supportCard.tokenWidth < 24 ||
    metrics.settingsPolish.supportCard.tokenHeight < 24 ||
    !metrics.settingsPolish.supportCard.tokenBackground.includes("gradient") ||
    metrics.settingsPolish.supportCard.actionCount !== 2 ||
    metrics.settingsPolish.supportCard.actionHeights.some((height) => height < 44) ||
    metrics.settingsPolish.supportCard.actionBackgrounds.some((background) => !background.includes("gradient")) ||
    metrics.settingsPolish.choiceGroupCards.length !== 3 ||
    metrics.settingsPolish.choiceGroupCards.some((card) => card.height < 64 || card.radius < 16 || !card.background.includes("gradient") || card.shadow === "none" || !card.shineBackground.includes("gradient") || card.shineHeight < 16) ||
    metrics.settingsPolish.choiceShines.length !== 8 ||
    metrics.settingsPolish.choiceShines.some((choice) => choice.shineWidth < 16 || choice.shineHeight < 6 || !choice.shineBackground.includes("gradient") || !choice.markerBackground.includes("gradient"))
  ) {
    failures.push("[" + viewportName + "] Settings dialog polish regression: " + JSON.stringify(metrics));
  }
  const firstAudio = page.locator(".settings-choice--audio").first();
  const beforePressed = await firstAudio.getAttribute("aria-pressed");
  await firstAudio.click();
  await page.waitForTimeout(120);
  const afterPressed = await page.locator(".settings-choice--audio").first().getAttribute("aria-pressed");
  if (beforePressed === afterPressed) {
    failures.push("[" + viewportName + "] Settings audio toggle did not update after click.");
  }
  await page.locator("#player-name-input").fill("Jay");
  await page.locator(".settings-choice--save").click();
  await page.locator(".settings-dialog").waitFor({ state: "detached", timeout: 2000 });
}

async function expectAppChromePolish(page, viewportName) {
  await expectVisible(page, ".top-bar", viewportName);
  await expectVisible(page, ".header-actions", viewportName);
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
      settingsGearWidth: parseFloat(settingsBefore?.width) || 0,
      settingsGearBorder: settingsBefore?.borderTopWidth || "",
      settingsHubWidth: parseFloat(settingsAfter?.width) || 0,
      resetRingWidth: parseFloat(resetBefore?.width) || 0,
      resetArrowBorder: resetAfter?.borderLeftWidth || ""
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
    !chromeMetrics.settingsBackground.includes("gradient") ||
    !chromeMetrics.resetBackground.includes("gradient") ||
    chromeMetrics.settingsGearWidth < 18 ||
    chromeMetrics.settingsGearBorder === "0px" ||
    chromeMetrics.settingsHubWidth < 5 ||
    chromeMetrics.resetRingWidth < 20 ||
    chromeMetrics.resetArrowBorder === "0px"
  ) {
    failures.push("[" + viewportName + "] App chrome lost polished HUD/icon treatment: " + JSON.stringify(chromeMetrics));
  }
  const trigger = page.locator(".floating-nav__trigger").first();
  await trigger.click();
  await page.locator(".floating-nav[data-open='true'] .floating-nav__menu").waitFor({ state: "visible", timeout: 3000 });
  const navMetrics = await page.evaluate(() => {
    const nav = document.querySelector(".floating-nav");
    const menu = document.querySelector(".floating-nav__menu");
    const triggerButton = document.querySelector(".floating-nav__trigger");
    const activeItem = document.querySelector(".floating-nav__item.active");
    const rect = menu?.getBoundingClientRect();
    const style = menu ? getComputedStyle(menu) : null;
    const triggerBefore = triggerButton ? getComputedStyle(triggerButton, "::before") : null;
    const triggerAfter = triggerButton ? getComputedStyle(triggerButton, "::after") : null;
    const activeBefore = activeItem ? getComputedStyle(activeItem, "::before") : null;
    const activeAfter = activeItem ? getComputedStyle(activeItem, "::after") : null;
    return {
      open: nav?.dataset.open || "",
      left: rect?.left || 0,
      right: rect?.right || 0,
      width: rect?.width || 0,
      viewportWidth: window.innerWidth,
      borderRadius: style ? parseFloat(style.borderRadius) : 0,
      backgroundImage: style?.backgroundImage || "",
      triggerShine: triggerBefore?.backgroundImage || "",
      triggerArrow: triggerAfter?.borderBottomWidth || "",
      triggerArrowTransform: triggerAfter?.transform || "",
      activeShine: activeBefore?.backgroundImage || "",
      activeToken: activeAfter?.backgroundImage || "",
      activeTokenWidth: parseFloat(activeAfter?.width) || 0,
      activePaddingLeft: activeItem ? parseFloat(getComputedStyle(activeItem).paddingLeft) || 0 : 0
    };
  });
  if (
    navMetrics.open !== "true" ||
    navMetrics.left < -1 ||
    navMetrics.right > navMetrics.viewportWidth + 1 ||
    navMetrics.borderRadius < 12 ||
    !navMetrics.backgroundImage.includes("linear-gradient") ||
    !navMetrics.triggerShine.includes("gradient") ||
    navMetrics.triggerArrow === "0px" ||
    navMetrics.triggerArrowTransform === "none" ||
    !navMetrics.activeShine.includes("gradient") ||
    !navMetrics.activeToken.includes("gradient") ||
    navMetrics.activeTokenWidth < 8 ||
    navMetrics.activePaddingLeft < 20
  ) {
    failures.push("[" + viewportName + "] Floating nav panel polish/layout regression: " + JSON.stringify(navMetrics));
  }
  await trigger.click();
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
        right: buttonRect.right,
        borderWidth: parseFloat(buttonStyle.borderTopWidth),
        radius: parseFloat(buttonStyle.borderRadius),
        background: buttonStyle.backgroundImage,
        boxShadow: buttonStyle.boxShadow,
        overflow: buttonStyle.overflow,
        iconContent: icon.content,
        iconWidth: parseFloat(icon.width),
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
      buttons
    };
  });

  const buttonVariants = ["previous", "list", "next"];
  if (
    metrics.left < -1 ||
    metrics.right > metrics.viewportWidth + 1 ||
    metrics.borderWidth < 3 ||
    metrics.radius < 16 ||
    !metrics.background.includes("gradient") ||
    metrics.boxShadow === "none" ||
    metrics.overflow !== "hidden" ||
    metrics.shineContent === "none" ||
    metrics.shineHeight < 10 ||
    metrics.copyWidth < 120 ||
    metrics.actionsWidth < 180 ||
    metrics.buttons.length !== 3 ||
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
      button.glintContent === "none" ||
      button.glintHeight < 8 ||
      !button.className.includes(buttonVariants[index])
    )
  ) {
    failures.push("[" + viewportName + "] Stage navigation lost tactile button polish: " + JSON.stringify(metrics));
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
    const albumState = document.querySelector(".album-card__state");

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
      albumState: readBox(albumState),

    };
  });
  const boxes = [metrics.album, metrics.albumCard, metrics.albumStamp, metrics.albumState];
  const outside = boxes.some((box) => box.left < -1 || box.right > metrics.viewportWidth + 1);
  if (
    outside ||
    metrics.album.radius < 14 ||
    metrics.albumCard.radius < 12 ||
    metrics.albumStamp.height < 64 ||
    metrics.albumState.height < 20 ||
    metrics.albumState.radius < 10 ||
    !metrics.album.background.includes("linear-gradient") ||
    !metrics.albumCard.background.includes("linear-gradient") ||
    !metrics.albumState.background.includes("linear-gradient")
  ) {
    failures.push("[" + viewportName + "] Album polish regression: " + JSON.stringify(metrics));
  }
}

async function expectMapPolish(page, viewportName) {
  const metrics = await page.evaluate(() => {
    const map = document.querySelector(".map-panel");
    const badgeCard = document.querySelector(".badge-card");
    const badgeToken = document.querySelector(".badge-art-token");
    const badgeState = document.querySelector(".badge-card__state");
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
      badgeState: readBox(badgeState)
    };
  });
  const boxes = [metrics.map, metrics.badgeCard, metrics.badgeToken, metrics.badgeState];
  const outside = boxes.some((box) => box.left < -1 || box.right > metrics.viewportWidth + 1);
  if (
    outside ||
    metrics.map.radius < 14 ||
    metrics.badgeCard.radius < 12 ||
    metrics.badgeToken.height < 80 ||
    metrics.badgeState.height < 20 ||
    metrics.badgeState.radius < 10 ||
    !metrics.map.background.includes("linear-gradient") ||
    !metrics.badgeCard.background.includes("linear-gradient") ||
    !metrics.badgeState.background.includes("linear-gradient")
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
    metrics.pipWidth < 60 ||
    metrics.pipHeight < 60 ||
    metrics.cardWidth < 180 ||
    metrics.cardHeight < metrics.revealHeight + 30 ||
    metrics.revealWidth < 150 ||
    Math.abs(metrics.revealWidth - metrics.revealHeight) > 2 ||
    metrics.stampWidth < 42 ||
    metrics.stampHeight < 22 ||
    metrics.eyebrowWidth < 56 ||
    metrics.actionsWidth < metrics.bannerWidth * 0.72 ||
    metrics.rewardFactRects.length !== 3 ||
    metrics.rewardFactRects.some((chip) => chip.width < 72 || chip.height < 26 || !chip.background.includes("linear-gradient") || !chip.text) ||
    metrics.bannerRadius < 14 ||
    metrics.cardRadius < 16 ||
    metrics.revealRadius < 10 ||
    !metrics.bannerBackground.includes("linear-gradient") ||
    !metrics.cardBackground.includes("linear-gradient") ||
    !metrics.revealBackground.includes("linear-gradient") ||
    !metrics.stampBackground.includes("linear-gradient") ||
    !metrics.stampText ||
    !metrics.eyebrowText
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
  const metrics = await page.evaluate(() => {
    const preview = document.querySelector(".stage-preview");
    const previewRect = preview?.getBoundingClientRect();
    const previewStyle = preview ? getComputedStyle(preview) : null;
    const previewBefore = preview ? getComputedStyle(preview, "::before") : null;
    const previewAfter = preview ? getComputedStyle(preview, "::after") : null;
    const chips = [...document.querySelectorAll(".puzzle-chip")].slice(0, 4).map((chip) => {
      const rect = chip.getBoundingClientRect();
      const style = getComputedStyle(chip);
      const shine = getComputedStyle(chip, "::before");
      const token = getComputedStyle(chip, "::after");
      return {
        text: chip.textContent.trim(),
        width: rect.width,
        height: rect.height,
        left: rect.left,
        right: rect.right,
        viewportWidth: window.innerWidth,
        borderWidth: parseFloat(style.borderTopWidth),
        radius: parseFloat(style.borderRadius),
        background: style.backgroundImage,
        shadow: style.boxShadow,
        overflow: style.overflow,
        shineContent: shine.content,
        shineHeight: parseFloat(shine.height),
        tokenContent: token.content,
        tokenWidth: parseFloat(token.width),
        overflows: chip.scrollWidth > Math.ceil(rect.width) + 1 || chip.scrollHeight > Math.ceil(rect.height) + 1
      };
    });
    return {
      previewWidth: previewRect?.width || 0,
      previewHeight: previewRect?.height || 0,
      previewRight: previewRect?.right || 0,
      viewportWidth: window.innerWidth,
      previewBorderWidth: previewStyle ? parseFloat(previewStyle.borderTopWidth) : 0,
      previewRadius: previewStyle ? parseFloat(previewStyle.borderRadius) : 0,
      previewBackground: previewStyle?.backgroundImage || "",
      previewShadow: previewStyle?.boxShadow || "",
      previewShineContent: previewBefore?.content || "",
      previewShineHeight: previewBefore ? parseFloat(previewBefore.height) : 0,
      previewTokenContent: previewAfter?.content || "",
      previewTokenWidth: previewAfter ? parseFloat(previewAfter.width) : 0,
      chips
    };
  });

  if (
    metrics.previewWidth < 240 ||
    metrics.previewHeight < 110 ||
    metrics.previewRight > metrics.viewportWidth + 1 ||
    metrics.previewBorderWidth < 3 ||
    metrics.previewRadius < 15 ||
    !metrics.previewBackground.includes("gradient") ||
    metrics.previewShadow === "none" ||
    metrics.previewShineContent === "none" ||
    metrics.previewShineHeight < 10 ||
    metrics.previewTokenContent === "none" ||
    metrics.previewTokenWidth < 16 ||
    metrics.chips.length < 3 ||
    metrics.chips.some((chip) =>
      chip.width < 140 ||
      chip.height < 54 ||
      chip.left < -1 ||
      chip.right > chip.viewportWidth + 1 ||
      chip.borderWidth < 3 ||
      chip.radius < 13 ||
      !chip.background.includes("gradient") ||
      chip.shadow === "none" ||
      chip.overflow !== "hidden" ||
      chip.shineContent === "none" ||
      chip.shineHeight < 8 ||
      chip.tokenContent === "none" ||
      chip.tokenWidth < 11 ||
      chip.overflows
    )
  ) {
    failures.push("[" + viewportName + "] Puzzle hub selection cards lost polished preview/chip treatment: " + JSON.stringify(metrics));
  }
}

async function expectDailyRewardPolish(page, viewportName) {
  await expectVisible(page, ".daily-card", viewportName);
  await expectVisible(page, ".daily-button", viewportName);
  const metrics = await page.evaluate(() => {
    const card = document.querySelector(".daily-card");
    const button = document.querySelector(".daily-button");
    const reward = document.querySelector(".daily-reward-amount");
    const note = document.querySelector(".daily-reward-note");
    const cardRect = card?.getBoundingClientRect();
    const buttonRect = button?.getBoundingClientRect();
    const rewardRect = reward?.getBoundingClientRect();
    const cardStyle = card ? getComputedStyle(card) : null;
    const cardBefore = card ? getComputedStyle(card, "::before") : null;
    const cardAfter = card ? getComputedStyle(card, "::after") : null;
    const buttonStyle = button ? getComputedStyle(button) : null;
    const buttonBefore = button ? getComputedStyle(button, "::before") : null;
    const rewardStyle = reward ? getComputedStyle(reward) : null;
    return {
      cardWidth: cardRect?.width || 0,
      cardHeight: cardRect?.height || 0,
      cardRight: cardRect?.right || 0,
      viewportWidth: window.innerWidth,
      cardBorderWidth: cardStyle ? parseFloat(cardStyle.borderTopWidth) : 0,
      cardRadius: cardStyle ? parseFloat(cardStyle.borderRadius) : 0,
      cardBackground: cardStyle?.backgroundImage || "",
      cardShadow: cardStyle?.boxShadow || "none",
      cardOverflow: cardStyle?.overflow || "",
      cardShineContent: cardBefore?.content || "none",
      cardShineHeight: cardBefore ? parseFloat(cardBefore.height) : 0,
      cardTokenContent: cardAfter?.content || "none",
      cardTokenWidth: cardAfter ? parseFloat(cardAfter.width) : 0,
      noteText: note?.textContent?.trim() || "",
      rewardWidth: rewardRect?.width || 0,
      rewardHeight: rewardRect?.height || 0,
      rewardRadius: rewardStyle ? parseFloat(rewardStyle.borderRadius) : 0,
      rewardBackground: rewardStyle?.backgroundImage || "",
      buttonWidth: buttonRect?.width || 0,
      buttonHeight: buttonRect?.height || 0,
      buttonRadius: buttonStyle ? parseFloat(buttonStyle.borderRadius) : 0,
      buttonBorderWidth: buttonStyle ? parseFloat(buttonStyle.borderTopWidth) : 0,
      buttonBackground: buttonStyle?.backgroundImage || "",
      buttonShadow: buttonStyle?.boxShadow || "none",
      buttonOverflow: buttonStyle?.overflow || "",
      buttonShineContent: buttonBefore?.content || "none",
      buttonShineHeight: buttonBefore ? parseFloat(buttonBefore.height) : 0
    };
  });

  if (
    metrics.cardWidth < 240 ||
    metrics.cardHeight < 88 ||
    metrics.cardRight > metrics.viewportWidth + 1 ||
    metrics.cardBorderWidth < 3 ||
    metrics.cardRadius < 17 ||
    !metrics.cardBackground.includes("radial-gradient") ||
    metrics.cardShadow === "none" ||
    metrics.cardOverflow !== "hidden" ||
    metrics.cardShineContent === "none" ||
    metrics.cardShineHeight < 10 ||
    metrics.cardTokenContent === "none" ||
    metrics.cardTokenWidth < 18 ||
    !metrics.noteText.includes("+") ||
    metrics.rewardWidth < 54 ||
    metrics.rewardHeight < 30 ||
    metrics.rewardRadius < 14 ||
    !metrics.rewardBackground.includes("gradient") ||
    metrics.buttonWidth < 104 ||
    metrics.buttonHeight < 50 ||
    metrics.buttonRadius < 15 ||
    metrics.buttonBorderWidth < 3 ||
    !metrics.buttonBackground.includes("gradient") ||
    metrics.buttonShadow === "none" ||
    metrics.buttonOverflow !== "hidden" ||
    metrics.buttonShineContent === "none" ||
    metrics.buttonShineHeight < 8
  ) {
    failures.push("[" + viewportName + "] Daily reward card lost polished economy treatment: " + JSON.stringify(metrics));
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
      const cardBefore = getComputedStyle(card, "::before");
      const cardAfter = getComputedStyle(card, "::after");
      const pip = card.querySelector(".time-attack-coach-card__pip");
      const pipRect = pip?.getBoundingClientRect() || { width: 0, height: 0 };
      const pipStyle = pip ? getComputedStyle(pip) : null;
      const chips = Array.from(card.querySelectorAll(".time-attack-coach-card__chips li")).map((chip) => {
        const chipRect = chip.getBoundingClientRect();
        const chipStyle = getComputedStyle(chip);
        const tokenStyle = getComputedStyle(chip, "::before");
        const shineStyle = getComputedStyle(chip, "::after");
        return {
          height: chipRect.height,
          background: chipStyle.backgroundImage,
          tokenContent: tokenStyle.content,
          tokenWidth: parseFloat(tokenStyle.width),
          tokenBackground: tokenStyle.backgroundImage,
          shineBackground: shineStyle.backgroundImage
        };
      });
      return {
        width: rect.width,
        height: rect.height,
        radius: parseFloat(style.borderRadius),
        background: style.backgroundImage,
        shadow: style.boxShadow,
        topShine: cardBefore.backgroundImage,
        backToken: cardAfter.backgroundImage,
        pipWidth: pipRect.width,
        pipHeight: pipRect.height,
        pipRadius: pipStyle ? parseFloat(pipStyle.borderRadius) : 0,
        pipBackground: pipStyle?.backgroundImage || "",
        pipShadow: pipStyle?.boxShadow || "none",
        chips
      };
    });
    if (
      coachMetrics.width <= 0 ||
      coachMetrics.height < 96 ||
      coachMetrics.radius < 12 ||
      !coachMetrics.background.includes("linear-gradient") ||
      coachMetrics.shadow === "none" ||
      !coachMetrics.topShine.includes("linear-gradient") ||
      !coachMetrics.backToken.includes("gradient") ||
      coachMetrics.pipWidth < 62 ||
      coachMetrics.pipHeight < 62 ||
      coachMetrics.pipRadius < 18 ||
      !coachMetrics.pipBackground.includes("gradient") ||
      coachMetrics.pipShadow === "none" ||
      coachMetrics.chips.length < 3 ||
      coachMetrics.chips.some((chip) => chip.height < 26 || !chip.background.includes("gradient") || chip.tokenContent === "none" || chip.tokenWidth < 8 || !chip.tokenBackground.includes("gradient") || !chip.shineBackground.includes("gradient"))
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
  await expectVisible(page, ".time-attack-summary", "Time Attack summary cards");
  await expectVisible(page, ".time-attack-records", "Time Attack records panel");

  const metrics = await page.locator(".time-attack-panel").first().evaluate((panel) => {
    const panelRect = panel.getBoundingClientRect();
    const intro = panel.querySelector(".time-attack-panel__intro");
    const start = panel.querySelector(".time-attack-panel__start");
    const summary = panel.querySelector(".time-attack-summary");
    const cards = Array.from(panel.querySelectorAll(".time-attack-summary__card")).map((card) => {
      const rect = card.getBoundingClientRect();
      const style = getComputedStyle(card);
      const cardBefore = getComputedStyle(card, "::before");
      const cardAfter = getComputedStyle(card, "::after");
      return {
        width: rect.width,
        height: rect.height,
        radius: parseFloat(style.borderRadius),
        background: style.backgroundImage,
        overflow: style.overflow,
        shadow: style.boxShadow,
        shineContent: cardBefore.content,
        shineBackground: cardBefore.backgroundImage || "",
        tokenContent: cardAfter.content,
        tokenWidth: parseFloat(cardAfter.width)
      };
    });
    const records = panel.querySelector(".time-attack-records");
    const recordItems = records ? Array.from(records.querySelectorAll("li")) : [];
    const introRect = intro?.getBoundingClientRect();
    const introStyle = intro ? getComputedStyle(intro) : null;
    const startRect = start?.getBoundingClientRect();
    const startStyle = start ? getComputedStyle(start) : null;
    const summaryStyle = summary ? getComputedStyle(summary) : null;
    const recordsRect = records?.getBoundingClientRect();
    const recordsStyle = records ? getComputedStyle(records) : null;
    const recordsBefore = records ? getComputedStyle(records, "::before") : null;
    const recordsAfter = records ? getComputedStyle(records, "::after") : null;
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
      summaryColumns: summaryStyle?.gridTemplateColumns || "",
      cards,
      records: recordsRect ? {
        width: recordsRect.width,
        height: recordsRect.height,
        radius: parseFloat(recordsStyle.borderRadius),
        background: recordsStyle.backgroundImage,
        overflow: recordsStyle.overflow,
        shadow: recordsStyle.boxShadow,
        shineContent: recordsBefore.content,
        shineBackground: recordsBefore.backgroundImage || "",
        tokenContent: recordsAfter.content,
        tokenWidth: parseFloat(recordsAfter.width),
        textLength: (records.textContent || "").trim().length,
        itemCount: recordItems.length,
        itemHeights: recordItems.slice(0, 3).map((item) => item.getBoundingClientRect().height)
      } : null
    };
  });

  const introLooksPolished = metrics.intro && metrics.intro.height >= 72 && metrics.intro.radius >= 14 && metrics.intro.background.includes("linear-gradient") && metrics.intro.shadow !== "none";
  const startLooksTactile = metrics.start && metrics.start.width >= 220 && metrics.start.height >= 52 && metrics.start.radius >= 16 && metrics.start.background.includes("linear-gradient") && metrics.start.shadow !== "none";
  const summaryLooksPolished = metrics.cards.length === 3 && metrics.cards.every((card) =>
    card.width > 0 &&
    card.height >= 70 &&
    card.radius >= 14 &&
    card.background.includes("linear-gradient") &&
    card.overflow === "hidden" &&
    card.shadow !== "none" &&
    card.shineContent !== "none" &&
    card.shineBackground.includes("gradient") &&
    card.tokenContent !== "none" &&
    card.tokenWidth >= 12
  );
  const recordsLooksPolished = metrics.records &&
    metrics.records.width > 0 &&
    metrics.records.radius >= 14 &&
    metrics.records.background.includes("linear-gradient") &&
    metrics.records.overflow === "hidden" &&
    metrics.records.shadow !== "none" &&
    metrics.records.shineContent !== "none" &&
    metrics.records.shineBackground.includes("gradient") &&
    metrics.records.tokenContent !== "none" &&
    metrics.records.tokenWidth >= 14 &&
    metrics.records.textLength > 0 &&
    metrics.records.itemHeights.every((height) => height >= 28);
  const staysInViewport = metrics.panelWidth > 0 && metrics.panelRight <= metrics.viewportWidth + 1;
  if (!introLooksPolished || !startLooksTactile || !summaryLooksPolished || !recordsLooksPolished || !staysInViewport) {
    failures.push("[" + viewportName + "] Time Attack start surface lost its polished intro/start/summary/records treatment: " + JSON.stringify(metrics));
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

  const bakerySummaryText = await page.locator('.pack-block[data-pack-id="bakery-window"] .pack-catalog-summary').first().innerText();
  const bakerySummaryLargeMatch = bakerySummaryText.match(/(\d+)\s+large/);
  const bakerySummaryLargeCount = bakerySummaryLargeMatch ? Number(bakerySummaryLargeMatch[1]) : 0;
  if (bakerySummaryLargeCount < 91 || !bakerySummaryText.includes("12x12")) {
    failures.push("[" + viewportName + "] Bakery Window catalog summary should expose at least 91 large boards and 12x12 max size, saw " + bakerySummaryText);
  }

  const villageSummaryText = await page.locator('.pack-block[data-pack-id="village-pantry"] .pack-catalog-summary').first().innerText();
  const villageSummaryLargeMatch = villageSummaryText.match(/(\d+)\s+large/);
  const villageSummaryLargeCount = villageSummaryLargeMatch ? Number(villageSummaryLargeMatch[1]) : 0;
  if (villageSummaryLargeCount < 98 || !villageSummaryText.includes("10x10")) {
    failures.push("[" + viewportName + "] Village Pantry catalog summary should expose at least 98 large boards and 10x10 max size, saw " + villageSummaryText);
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
    const status = panel.querySelector(".cursor-controls__status");
    const statusRect = status?.getBoundingClientRect();
    const statusStyle = status ? getComputedStyle(status) : null;
    const statusTokenStyle = status ? getComputedStyle(status, "::before") : null;
    const moves = [...panel.querySelectorAll(".cursor-move")].map((button) => {
      const buttonRect = button.getBoundingClientRect();
      const buttonStyle = getComputedStyle(button);
      const shineStyle = getComputedStyle(button, "::after");
      return {
        width: buttonRect.width,
        height: buttonRect.height,
        background: buttonStyle.backgroundImage,
        label: button.getAttribute("aria-label") || "",
        shineBackground: shineStyle.backgroundImage,
        shineHeight: parseFloat(shineStyle.height) || 0
      };
    });
    const actions = [...panel.querySelectorAll(".cursor-action-button")].map((button) => {
      const buttonRect = button.getBoundingClientRect();
      const buttonStyle = getComputedStyle(button);
      const iconStyle = getComputedStyle(button, "::before");
      const shineStyle = getComputedStyle(button, "::after");
      return {
        width: buttonRect.width,
        height: buttonRect.height,
        background: buttonStyle.backgroundImage,
        text: button.textContent.trim(),
        iconBackground: iconStyle.backgroundImage,
        iconRadius: parseFloat(iconStyle.borderRadius),
        iconShadow: iconStyle.boxShadow,
        shineDisplay: shineStyle.display
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
      dpadWidth: dpad?.getBoundingClientRect().width || 0,
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
    cursorPadMetrics.dpadWidth < 132 ||
    cursorPadMetrics.moves.length !== 4 ||
    cursorPadMetrics.moves.some((button) => button.width < 40 || button.height < 40 || !button.background.includes("gradient") || !button.label || !button.shineBackground.includes("gradient") || button.shineHeight < 10) ||
    cursorPadMetrics.actions.length !== 2 ||
    cursorPadMetrics.actions.some((button) => button.width < 120 || button.height < 44 || !button.background.includes("gradient") || !button.text || !button.iconBackground.includes("gradient") || button.iconRadius < 6 || button.iconShadow === "none") ||
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
      titleWidth: titleRect?.width || 0,
      titleOverflow: title ? title.scrollWidth > Math.ceil(titleRect?.width || 0) + 1 : true,
      controls
    };
  });
  if (
    playHeaderMetrics.left < -1 ||
    playHeaderMetrics.right > playHeaderMetrics.viewportWidth + 1 ||
    playHeaderMetrics.height < 64 ||
    playHeaderMetrics.radius < 14 ||
    !playHeaderMetrics.background.includes("gradient") ||
    playHeaderMetrics.titleWidth < 90 ||
    playHeaderMetrics.titleOverflow ||
    playHeaderMetrics.controls.some((control) => control.height < 30 || control.left < -1 || control.right > playHeaderMetrics.viewportWidth + 1)
  ) {
    failures.push("[" + viewportName + "] Play header lost compact HUD polish: " + JSON.stringify(playHeaderMetrics));
  }

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
    const firstAction = card.querySelector(".guide-actions span");
    const actionBefore = firstAction ? getComputedStyle(firstAction, "::before") : null;
    const clueRows = [...card.querySelectorAll(".clue-guide__row")].map((row) => {
      const rowRect = row.getBoundingClientRect();
      return { width: rowRect.width, height: rowRect.height };
    });
    const actions = [...card.querySelectorAll(".guide-actions span")].map((chip) => {
      const chipRect = chip.getBoundingClientRect();
      return { width: chipRect.width, height: chipRect.height, text: chip.textContent.trim() };
    });
    return {
      left: rect.left,
      right: rect.right,
      width: rect.width,
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
      bubbleTailBackground: bubbleBefore?.backgroundImage || "",
      bubbleWidth: bubbleRect?.width || 0,
      bubbleHeight: bubbleRect?.height || 0,
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
      actionAccentBackground: actionBefore?.backgroundImage || "",
      overflows: card.scrollWidth > Math.ceil(rect.width) + 1 || card.scrollHeight > Math.ceil(rect.height) + 1
    };
  });
  if (
    howToPlayMetrics.left < -1 ||
    howToPlayMetrics.right > howToPlayMetrics.viewportWidth + 1 ||
    howToPlayMetrics.width > 570 ||
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
    !howToPlayMetrics.bubbleTailBackground.includes("gradient") ||
    howToPlayMetrics.bubbleWidth < 120 ||
    howToPlayMetrics.bubbleHeight < 70 ||
    !howToPlayMetrics.bubbleBackground.includes("gradient") ||
    howToPlayMetrics.bubbleRadius < 12 ||
    howToPlayMetrics.bubbleShadow === "none" ||
    !howToPlayMetrics.bubbleAccentBackground.includes("gradient") ||
    howToPlayMetrics.sceneWidth < 180 ||
    howToPlayMetrics.clueRows.length !== 2 ||
    howToPlayMetrics.clueRows.some((row) => row.height < 28) ||
    howToPlayMetrics.actions.length !== 3 ||
    howToPlayMetrics.actions.some((chip) => chip.height < 22 || !chip.text) ||
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
  const hintButtonMetrics = await page.locator(".hint-button").first().evaluate((button) => {
    const rect = button.getBoundingClientRect();
    const meter = document.querySelector(".hint-panel__meter");
    const meterRect = meter?.getBoundingClientRect();
    const meterStyle = meter ? getComputedStyle(meter) : null;
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
    return {
      text: (label?.textContent || "").trim(),
      width: rect.width,
      height: rect.height,
      background: style.backgroundImage,
      cardBeforeBackground: typeof cardBefore !== "undefined" ? cardBefore.backgroundImage || "" : "",
      iconWidth: iconRect?.width || 0,
      iconHeight: iconRect?.height || 0,
      iconBackground: iconStyle?.backgroundImage || "",
      iconShadow: iconStyle?.boxShadow || "",
      symbolBackground: beforeStyle?.backgroundImage || beforeStyle?.backgroundColor || "",
      shineContent: afterStyle?.content || "",
      ariaLabel: button.getAttribute("aria-label") || "",
      overflows: button.scrollWidth > Math.ceil(rect.width) + 1 || button.scrollHeight > Math.ceil(rect.height) + 1
    };
  }));
  if (controlMetrics.length !== 3 || controlMetrics.some((metrics) => !metrics.text || metrics.height < 52 || !metrics.background.includes("gradient") || metrics.iconWidth < 20 || metrics.iconHeight < 20 || !metrics.iconBackground.includes("gradient") || metrics.iconShadow === "none" || !metrics.symbolBackground || metrics.shineContent === "none" || !metrics.ariaLabel || metrics.overflows)) {
    failures.push("[" + viewportName + "] Puzzle controls lost polished icon+tactile mobile treatment: " + JSON.stringify(controlMetrics));
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
  const shelfNodes = [toolShelfMetrics.controls, toolShelfMetrics.hint, toolShelfMetrics.progress];
  const controlsToHintGap = toolShelfMetrics.hint.top - toolShelfMetrics.controls.bottom;
  const progressAfterHint = toolShelfMetrics.progress.top > toolShelfMetrics.hint.bottom;
  if (
    shelfNodes.some((metrics) => !metrics || metrics.left < -1 || metrics.right > toolShelfMetrics.viewportWidth + 1 || metrics.width > 530) ||
    controlsToHintGap < 6 ||
    controlsToHintGap > 20 ||
    !progressAfterHint ||
    toolShelfMetrics.controls.radius < 16 ||
    toolShelfMetrics.hint.radius < 16 ||
    !toolShelfMetrics.controls.background.includes("gradient") ||
    !toolShelfMetrics.hint.background.includes("gradient")
  ) {
    failures.push("[" + viewportName + "] Puzzle tool shelf lost cohesive stacked treatment: " + JSON.stringify({ ...toolShelfMetrics, controlsToHintGap, progressAfterHint }));
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
    metrics.meta.radius < 16 ||
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
    const lockedLeakCount = document.querySelectorAll(".board-wrap.locked .line-complete, .board-wrap.locked .safe-suggestion, .board-wrap.locked .completed-row, .board-wrap.locked .completed-column").length;
    return {
      rowCompleteCount,
      autoMarkedBlanks,
      firstRowGlow,
      rowClueStyle: readStyle(rowClue),
      safeCellStyle: readStyle(safeCell),
      safeSuggestionStyle,
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
  const pantryRoomMetrics = await page.locator(".pantry-room").first().evaluate((el) => {
    const style = getComputedStyle(el);
    const before = getComputedStyle(el, "::before");
    const firstSlot = el.querySelector(".pantry-room-slot");
    const slotStyle = firstSlot ? getComputedStyle(firstSlot) : null;
    return {
      minHeight: parseFloat(style.minHeight),
      borderRadius: parseFloat(style.borderRadius),
      borderWidth: parseFloat(style.borderTopWidth),
      overflow: style.overflow,
      background: style.backgroundImage,
      roomDivider: before.content,
      slotCount: el.querySelectorAll(".pantry-room-slot").length,
      slotPosition: slotStyle ? slotStyle.position : "",
      slotRadius: slotStyle ? parseFloat(slotStyle.borderRadius) : 0,
      slotBorderWidth: slotStyle ? parseFloat(slotStyle.borderTopWidth) : 0
    };
  });
  if (pantryRoomMetrics.minHeight < 320 || pantryRoomMetrics.borderRadius < 20 || pantryRoomMetrics.borderWidth < 3 || pantryRoomMetrics.overflow !== "hidden" || !pantryRoomMetrics.background.includes("linear-gradient") || pantryRoomMetrics.roomDivider === "none") {
    failures.push("[" + viewportName + "] Pantry room frame lost cozy placement polish: " + JSON.stringify(pantryRoomMetrics));
  }
  if (pantryRoomMetrics.slotCount !== 5 || pantryRoomMetrics.slotPosition !== "absolute" || pantryRoomMetrics.slotRadius < 16 || pantryRoomMetrics.slotBorderWidth < 3) {
    failures.push("[" + viewportName + "] Pantry room slots lost tactile fixed-placement styling: " + JSON.stringify(pantryRoomMetrics));
  }
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
  await expectVisible(page, ".pantry-progress-mission", viewportName);
  await expectVisible(page, ".pantry-progress-mission__route span", viewportName);
  await expectVisible(page, ".pantry-progress-mission__meter", viewportName);
  await expectVisible(page, ".pantry-progress-mission__facts span", viewportName);
  await expectVisible(page, ".pantry-progress-mission__action", viewportName);
  await expectVisible(page, ".pantry-display-plan", viewportName);
  await expectVisible(page, ".pantry-slot-filters", viewportName);
  await expectVisible(page, ".pantry-rarity-filters", viewportName);
  await expectVisible(page, ".pantry-availability-filters", viewportName);
  await expectVisible(page, ".pantry-sort-bar", viewportName);
  await expectVisible(page, ".pantry-filter-summary", viewportName);
  const filterControlsMetrics = await page.locator(".pantry-filter-stack").first().evaluate((el) => {
    const style = getComputedStyle(el);
    const activeSlot = el.querySelector(".pantry-slot-filter.active");
    const activeSort = el.querySelector(".pantry-sort-option.active");
    const sortLabel = el.querySelector(".pantry-sort-label");
    const activeSlotStyle = activeSlot ? getComputedStyle(activeSlot) : null;
    const activeSortStyle = activeSort ? getComputedStyle(activeSort) : null;
    const sortLabelStyle = sortLabel ? getComputedStyle(sortLabel) : null;
    return {
      borderRadius: parseFloat(style.borderRadius) || 0,
      borderWidth: parseFloat(style.borderTopWidth) || 0,
      background: style.backgroundImage,
      boxShadow: style.boxShadow,
      activeSlotHeight: activeSlot ? activeSlot.getBoundingClientRect().height : 0,
      activeSlotBorderWidth: activeSlotStyle ? parseFloat(activeSlotStyle.borderTopWidth) || 0 : 0,
      activeSlotBackground: activeSlotStyle ? activeSlotStyle.backgroundImage : "",
      activeSortHeight: activeSort ? activeSort.getBoundingClientRect().height : 0,
      activeSortBorderWidth: activeSortStyle ? parseFloat(activeSortStyle.borderTopWidth) || 0 : 0,
      activeSortBackground: activeSortStyle ? activeSortStyle.backgroundImage : "",
      sortLabelHeight: sortLabel ? sortLabel.getBoundingClientRect().height : 0,
      sortLabelRadius: sortLabelStyle ? parseFloat(sortLabelStyle.borderRadius) || 0 : 0
    };
  });
  if (
    filterControlsMetrics.borderRadius < 16 ||
    filterControlsMetrics.borderWidth < 3 ||
    !filterControlsMetrics.background.includes("radial-gradient") ||
    !filterControlsMetrics.boxShadow.includes("rgba") ||
    filterControlsMetrics.activeSlotHeight < 40 ||
    filterControlsMetrics.activeSlotBorderWidth < 3 ||
    !filterControlsMetrics.activeSlotBackground.includes("radial-gradient") ||
    filterControlsMetrics.activeSortHeight < 40 ||
    filterControlsMetrics.activeSortBorderWidth < 3 ||
    !filterControlsMetrics.activeSortBackground.includes("radial-gradient") ||
    filterControlsMetrics.sortLabelHeight < 30 ||
    filterControlsMetrics.sortLabelRadius < 14
  ) {
    failures.push("[" + viewportName + "] Pantry filter controls lost polished chip treatment: " + JSON.stringify(filterControlsMetrics));
  }
  await expectVisible(page, ".pantry-item-card", viewportName);
  await expectVisible(page, ".pantry-item-status", viewportName);
  await expectVisible(page, ".pantry-item-savings", viewportName);
  await expectVisible(page, ".pantry-track-goal", viewportName);
  await expectVisible(page, ".pantry-slot-note", viewportName);
  await expectVisible(page, ".pantry-swap-note", viewportName);
  const itemSignalMetrics = await page.locator(".pantry-item-card").first().evaluate((card) => {
    const status = card.querySelector(".pantry-item-status");
    const slotNote = card.querySelector(".pantry-slot-note");
    const swapNote = card.querySelector(".pantry-swap-note");
    const statusStyle = status ? getComputedStyle(status) : null;
    const statusIcon = status ? getComputedStyle(status, "::before") : null;
    const slotStyle = slotNote ? getComputedStyle(slotNote) : null;
    const slotIcon = slotNote ? getComputedStyle(slotNote, "::before") : null;
    const swapStyle = swapNote ? getComputedStyle(swapNote) : null;
    const swapIcon = swapNote ? getComputedStyle(swapNote, "::before") : null;
    return {
      statusHeight: status ? status.getBoundingClientRect().height : 0,
      statusRadius: statusStyle ? parseFloat(statusStyle.borderRadius) || 0 : 0,
      statusBorderWidth: statusStyle ? parseFloat(statusStyle.borderTopWidth) || 0 : 0,
      statusOverflow: statusStyle ? statusStyle.overflow : "",
      statusBackground: statusStyle ? statusStyle.backgroundImage : "",
      statusIconContent: statusIcon ? statusIcon.content : "none",
      statusIconWidth: statusIcon ? parseFloat(statusIcon.width) || 0 : 0,
      slotHeight: slotNote ? slotNote.getBoundingClientRect().height : 0,
      slotRadius: slotStyle ? parseFloat(slotStyle.borderRadius) || 0 : 0,
      slotBorderWidth: slotStyle ? parseFloat(slotStyle.borderTopWidth) || 0 : 0,
      slotBackground: slotStyle ? slotStyle.backgroundImage : "",
      slotIconContent: slotIcon ? slotIcon.content : "none",
      slotIconWidth: slotIcon ? parseFloat(slotIcon.width) || 0 : 0,
      swapHeight: swapNote ? swapNote.getBoundingClientRect().height : 0,
      swapRadius: swapStyle ? parseFloat(swapStyle.borderRadius) || 0 : 0,
      swapBorderWidth: swapStyle ? parseFloat(swapStyle.borderTopWidth) || 0 : 0,
      swapBackground: swapStyle ? swapStyle.backgroundImage : "",
      swapIconContent: swapIcon ? swapIcon.content : "none",
      swapIconWidth: swapIcon ? parseFloat(swapIcon.width) || 0 : 0
    };
  });
  if (
    itemSignalMetrics.statusHeight < 30 ||
    itemSignalMetrics.statusRadius < 12 ||
    itemSignalMetrics.statusBorderWidth < 2 ||
    itemSignalMetrics.statusOverflow !== "hidden" ||
    !itemSignalMetrics.statusBackground.includes("radial-gradient") ||
    itemSignalMetrics.statusIconContent === "none" ||
    itemSignalMetrics.statusIconWidth < 9 ||
    itemSignalMetrics.slotHeight < 32 ||
    itemSignalMetrics.slotRadius < 12 ||
    itemSignalMetrics.slotBorderWidth < 2 ||
    !itemSignalMetrics.slotBackground.includes("radial-gradient") ||
    itemSignalMetrics.slotIconContent === "none" ||
    itemSignalMetrics.slotIconWidth < 9 ||
    itemSignalMetrics.swapHeight < 32 ||
    itemSignalMetrics.swapRadius < 12 ||
    itemSignalMetrics.swapBorderWidth < 2 ||
    !itemSignalMetrics.swapBackground.includes("radial-gradient") ||
    itemSignalMetrics.swapIconContent === "none" ||
    itemSignalMetrics.swapIconWidth < 9
  ) {
    failures.push("[" + viewportName + "] Pantry item signal chips lost polished status/note treatment: " + JSON.stringify(itemSignalMetrics));
  }

  if ((await page.locator(".pantry-display-plan").count()) === 0) {
    failures.push("[" + viewportName + "] Pantry panel did not open; skipping dependent pantry text checks");
    return;
  }

  const storyRequestMetrics = await page.locator(".pantry-story-request").first().evaluate((card) => {
    const rect = card.getBoundingClientRect();
    const pip = card.querySelector(".pantry-story-request__pip");
    const pipImage = pip?.querySelector("img");
    const pipRect = pip ? pip.getBoundingClientRect() : { width: 0, height: 0 };
    const shine = getComputedStyle(card, "::before");
    const pipStyle = pip ? getComputedStyle(pip) : null;
    const pipTail = pip ? getComputedStyle(pip, "::after") : null;
    const pipImageStyle = pipImage ? getComputedStyle(pipImage) : null;
    const target = card.querySelector(".pantry-story-request__target");
    const targetStyle = target ? getComputedStyle(target) : null;
    const targetIcon = target ? getComputedStyle(target, "::before") : null;
    const action = card.querySelector(".pantry-story-request__action");
    const actionStyle = action ? getComputedStyle(action) : null;
    const actionShine = action ? getComputedStyle(action, "::before") : null;
    return {
      width: rect.width,
      borderRadius: parseFloat(getComputedStyle(card).borderRadius) || 0,
      borderWidth: parseFloat(getComputedStyle(card).borderTopWidth) || 0,
      overflow: getComputedStyle(card).overflow,
      background: getComputedStyle(card).backgroundImage,
      boxShadow: getComputedStyle(card).boxShadow,
      shineContent: shine.content,
      shineHeight: parseFloat(shine.height) || 0,
      pipWidth: pipRect.width,
      pipHeight: pipRect.height,
      pipBorderWidth: pipStyle ? parseFloat(pipStyle.borderTopWidth) || 0 : 0,
      pipBoxShadow: pipStyle ? pipStyle.boxShadow : "",
      pipPointerEvents: pipStyle ? pipStyle.pointerEvents : "",
      pipTailContent: pipTail ? pipTail.content : "none",
      pipTailWidth: pipTail ? parseFloat(pipTail.width) || 0 : 0,
      pipImageDisplay: pipImageStyle ? pipImageStyle.display : "",
      pipImageZIndex: pipImageStyle ? pipImageStyle.zIndex : "",
      pipImageAlt: pipImage ? pipImage.getAttribute("alt") : null,
      targetHeight: target ? target.getBoundingClientRect().height : 0,
      targetBorderWidth: targetStyle ? parseFloat(targetStyle.borderTopWidth) || 0 : 0,
      targetBackground: targetStyle ? targetStyle.backgroundImage : "",
      targetIconContent: targetIcon ? targetIcon.content : "none",
      targetIconWidth: targetIcon ? parseFloat(targetIcon.width) || 0 : 0,
      actionHeight: action ? action.getBoundingClientRect().height : 0,
      actionBorderWidth: actionStyle ? parseFloat(actionStyle.borderTopWidth) || 0 : 0,
      actionRadius: actionStyle ? parseFloat(actionStyle.borderRadius) || 0 : 0,
      actionBackground: actionStyle ? actionStyle.backgroundImage : "",
      actionShineContent: actionShine ? actionShine.content : "none",
      actionShineHeight: actionShine ? parseFloat(actionShine.height) || 0 : 0
    };
  });
  if (
    storyRequestMetrics.width < 180
    || storyRequestMetrics.borderRadius < 14
    || storyRequestMetrics.borderWidth < 3
    || storyRequestMetrics.overflow !== "hidden"
    || !storyRequestMetrics.background.includes("radial-gradient")
    || !storyRequestMetrics.boxShadow.includes("rgba")
    || storyRequestMetrics.shineContent === "none"
    || storyRequestMetrics.shineHeight < 10
    || storyRequestMetrics.pipWidth < 40
    || storyRequestMetrics.pipHeight < 40
    || storyRequestMetrics.pipBorderWidth < 3
    || !storyRequestMetrics.pipBoxShadow.includes("rgba")
    || storyRequestMetrics.pipPointerEvents !== "none"
    || storyRequestMetrics.pipTailContent === "none"
    || storyRequestMetrics.pipTailWidth < 8
    || storyRequestMetrics.pipImageDisplay !== "block"
    || storyRequestMetrics.pipImageZIndex !== "1"
    || storyRequestMetrics.pipImageAlt !== ""
    || storyRequestMetrics.targetHeight < 30
    || storyRequestMetrics.targetBorderWidth < 2
    || !storyRequestMetrics.targetBackground.includes("radial-gradient")
    || storyRequestMetrics.targetIconContent === "none"
    || storyRequestMetrics.targetIconWidth < 10
    || storyRequestMetrics.actionHeight < 46
    || storyRequestMetrics.actionBorderWidth < 4
    || storyRequestMetrics.actionRadius < 14
    || !storyRequestMetrics.actionBackground.includes("radial-gradient")
    || storyRequestMetrics.actionShineContent === "none"
    || storyRequestMetrics.actionShineHeight < 8
  ) {
    failures.push("[" + viewportName + "] Pantry story request card lost Pip-led polished treatment: " + JSON.stringify(storyRequestMetrics));
  }

  const allDisplayPlanText = await page.locator(".pantry-display-plan").first().innerText();
  if (!allDisplayPlanText.includes("0/5") || !allDisplayPlanText.includes("Tap")) {
    failures.push("[" + viewportName + "] Pantry display plan should summarize the empty room before a slot is selected, saw " + allDisplayPlanText);
  }

  const progressText = await page.locator(".pantry-progress-board").first().innerText();
  if (!progressText.includes("0/25") || !progressText.includes("0/6")) {
    failures.push("[" + viewportName + "] Pantry progress board should show seeded 0/25 collection and counter 0/6 progress, saw " + progressText);
  }
  const progressBoardMetrics = await page.locator(".pantry-progress-board").first().evaluate((el) => {
    const style = getComputedStyle(el);
    const before = getComputedStyle(el, "::before");
    const after = getComputedStyle(el, "::after");
    const summary = el.querySelector(".pantry-progress-board__header > p");
    const summaryStyle = summary ? getComputedStyle(summary) : null;
    const slot = el.querySelector(".pantry-progress-slot");
    const slotStyle = slot ? getComputedStyle(slot) : null;
    const slotAfter = slot ? getComputedStyle(slot, "::after") : null;
    return {
      borderRadius: parseFloat(style.borderRadius) || 0,
      borderWidth: parseFloat(style.borderTopWidth) || 0,
      overflow: style.overflow,
      background: style.backgroundImage,
      shineContent: before.content,
      shineHeight: parseFloat(before.height) || 0,
      tokenContent: after.content,
      tokenWidth: parseFloat(after.width) || 0,
      summaryRadius: summaryStyle ? parseFloat(summaryStyle.borderRadius) || 0 : 0,
      summaryHeight: summary ? summary.getBoundingClientRect().height : 0,
      slotCount: el.querySelectorAll(".pantry-progress-slot").length,
      slotRadius: slotStyle ? parseFloat(slotStyle.borderRadius) || 0 : 0,
      slotBorderWidth: slotStyle ? parseFloat(slotStyle.borderTopWidth) || 0 : 0,
      slotHeight: slot ? slot.getBoundingClientRect().height : 0,
      slotTokenContent: slotAfter ? slotAfter.content : "none",
      slotTokenWidth: slotAfter ? parseFloat(slotAfter.width) || 0 : 0
    };
  });
  if (
    progressBoardMetrics.borderRadius < 16 ||
    progressBoardMetrics.borderWidth < 3 ||
    progressBoardMetrics.overflow !== "hidden" ||
    !progressBoardMetrics.background.includes("radial-gradient") ||
    progressBoardMetrics.shineContent === "none" ||
    progressBoardMetrics.shineHeight < 10 ||
    progressBoardMetrics.tokenContent === "none" ||
    progressBoardMetrics.tokenWidth < 24 ||
    progressBoardMetrics.summaryRadius < 14 ||
    progressBoardMetrics.summaryHeight < 30 ||
    progressBoardMetrics.slotCount !== 5 ||
    progressBoardMetrics.slotRadius < 12 ||
    progressBoardMetrics.slotBorderWidth < 2 ||
    progressBoardMetrics.slotHeight < 52 ||
    progressBoardMetrics.slotTokenContent === "none" ||
    progressBoardMetrics.slotTokenWidth < 14
  ) {
    failures.push("[" + viewportName + "] Pantry progress board lost its polished collection-card treatment: " + JSON.stringify(progressBoardMetrics));
  }

  const progressMissionText = await page.locator(".pantry-progress-mission").first().innerText();
  if (!progressMissionText.includes("0/3") || !progressMissionText.includes("Next:") || !progressMissionText.includes("Stage spoons") || !progressMissionText.includes("80")) {
    failures.push("[" + viewportName + "] Pantry progress mission should link seeded room requests to the next stage spoon gate, saw " + progressMissionText);
  }
  const progressMissionMetrics = await page.locator(".pantry-progress-mission").first().evaluate((card) => {
    const rect = card.getBoundingClientRect();
    const style = getComputedStyle(card);
    const before = getComputedStyle(card, "::before");
    const after = getComputedStyle(card, "::after");
    const meter = card.querySelector(".pantry-progress-mission__meter span");
    const meterTrack = card.querySelector(".pantry-progress-mission__meter");
    const meterTrackStyle = meterTrack ? getComputedStyle(meterTrack) : null;
    const route = [...card.querySelectorAll(".pantry-progress-mission__route span")].map((chip) => {
      const chipRect = chip.getBoundingClientRect();
      return { width: chipRect.width, height: chipRect.height, text: chip.textContent.trim() };
    });
    const facts = [...card.querySelectorAll(".pantry-progress-mission__facts span")].map((fact) => {
      const factRect = fact.getBoundingClientRect();
      return { width: factRect.width, height: factRect.height, text: fact.textContent.trim() };
    });
    return {
      width: rect.width,
      borderRadius: parseFloat(style.borderRadius),
      borderWidth: parseFloat(style.borderTopWidth),
      overflow: style.overflow,
      background: style.backgroundImage,
      shineContent: before.content,
      shineHeight: parseFloat(before.height),
      tokenContent: after.content,
      tokenWidth: parseFloat(after.width),
      meterWidth: meter ? meter.getBoundingClientRect().width : 0,
      meterHeight: meterTrack ? meterTrack.getBoundingClientRect().height : 0,
      meterShadow: meterTrackStyle ? meterTrackStyle.boxShadow : "",
      route,
      facts
    };
  });
  if (
    progressMissionMetrics.width < 180 ||
    progressMissionMetrics.borderRadius < 15 ||
    progressMissionMetrics.borderWidth < 3 ||
    progressMissionMetrics.overflow !== "hidden" ||
    !progressMissionMetrics.background.includes("radial-gradient") ||
    progressMissionMetrics.shineContent === "none" ||
    progressMissionMetrics.shineHeight < 10 ||
    progressMissionMetrics.tokenContent === "none" ||
    progressMissionMetrics.tokenWidth < 22 ||
    progressMissionMetrics.meterHeight < 11 ||
    !progressMissionMetrics.meterShadow.includes("inset") ||
    progressMissionMetrics.route.length !== 3 ||
    progressMissionMetrics.route.some((chip) => chip.width < 72 || chip.height < 24) ||
    progressMissionMetrics.facts.length !== 2 ||
    progressMissionMetrics.facts.some((fact) => fact.width < 120 || fact.height < 24)
  ) {
    failures.push("[" + viewportName + "] Pantry progress mission mobile layout regressed: " + JSON.stringify(progressMissionMetrics));
  }

  const missionActionText = await page.locator(".pantry-progress-mission__action").first().innerText();
  if (!/Plan next request|\uB2E4\uC74C \uBD80\uD0C1/.test(missionActionText)) {
    failures.push("[" + viewportName + "] Pantry progress mission should offer the next request action first, saw " + missionActionText);
  }

  const savingsGoalText = await page.locator(".pantry-savings-goal").first().innerText();
  if (!savingsGoalText.includes("17") && !savingsGoalText.includes("Need 17")) {
    failures.push("[" + viewportName + "] Pantry savings goal should show the next 17-spoon gap at seeded balance, saw " + savingsGoalText);
  }
  const savingsGoalVisualMetrics = await page.locator(".pantry-savings-goal").first().evaluate((el) => {
    const style = getComputedStyle(el);
    const before = getComputedStyle(el, "::before");
    const after = getComputedStyle(el, "::after");
    const meter = el.querySelector(".pantry-savings-meter");
    const fill = meter?.querySelector("span");
    const meterStyle = meter ? getComputedStyle(meter) : null;
    const fillStyle = fill ? getComputedStyle(fill) : null;
    return {
      borderRadius: parseFloat(style.borderRadius) || 0,
      borderWidth: parseFloat(style.borderTopWidth) || 0,
      overflow: style.overflow,
      paddingLeft: parseFloat(style.paddingLeft) || 0,
      background: style.backgroundImage,
      tokenContent: before.content,
      tokenWidth: parseFloat(before.width) || 0,
      shineContent: after.content,
      shineHeight: parseFloat(after.height) || 0,
      meterHeight: meter ? meter.getBoundingClientRect().height : 0,
      meterBorderWidth: meterStyle ? parseFloat(meterStyle.borderTopWidth) || 0 : 0,
      fillBackground: fillStyle ? fillStyle.backgroundImage : ""
    };
  });
  if (
    savingsGoalVisualMetrics.borderRadius < 16 ||
    savingsGoalVisualMetrics.borderWidth < 3 ||
    savingsGoalVisualMetrics.overflow !== "hidden" ||
    savingsGoalVisualMetrics.paddingLeft < 40 ||
    !savingsGoalVisualMetrics.background.includes("radial-gradient") ||
    savingsGoalVisualMetrics.tokenContent === "none" ||
    savingsGoalVisualMetrics.tokenWidth < 20 ||
    savingsGoalVisualMetrics.shineContent === "none" ||
    savingsGoalVisualMetrics.shineHeight < 10 ||
    savingsGoalVisualMetrics.meterHeight < 12 ||
    savingsGoalVisualMetrics.meterBorderWidth < 2 ||
    !savingsGoalVisualMetrics.fillBackground.includes("linear-gradient")
  ) {
    failures.push("[" + viewportName + "] Pantry savings goal lost its polished economy-card treatment: " + JSON.stringify(savingsGoalVisualMetrics));
  }

  const earningPlanText = await page.locator(".pantry-earning-plan").first().innerText();
  if (!earningPlanText.includes("17") || !earningPlanText.includes("6") || !earningPlanText.includes("2") || !earningPlanText.includes("Support Pack")) {
    failures.push("[" + viewportName + "] Pantry earning plan should translate the 17-spoon gap and expose support pack fallback, saw " + earningPlanText);
  }
  const earningPlanVisualMetrics = await page.locator(".pantry-earning-plan").first().evaluate((el) => {
    const style = getComputedStyle(el);
    const before = getComputedStyle(el, "::before");
    const after = getComputedStyle(el, "::after");
    const actions = Array.from(el.querySelectorAll(".pantry-earning-action"));
    const action = actions[0];
    const support = el.querySelector(".pantry-earning-support");
    const actionStyle = action ? getComputedStyle(action) : null;
    const actionBefore = action ? getComputedStyle(action, "::before") : null;
    const supportStyle = support ? getComputedStyle(support) : null;
    return {
      borderRadius: parseFloat(style.borderRadius) || 0,
      borderWidth: parseFloat(style.borderTopWidth) || 0,
      overflow: style.overflow,
      paddingLeft: parseFloat(style.paddingLeft) || 0,
      background: style.backgroundImage,
      tokenContent: before.content,
      tokenWidth: parseFloat(before.width) || 0,
      shineContent: after.content,
      shineHeight: parseFloat(after.height) || 0,
      actionCount: actions.length,
      actionHeight: action ? action.getBoundingClientRect().height : 0,
      actionRadius: actionStyle ? parseFloat(actionStyle.borderRadius) || 0 : 0,
      actionBorderWidth: actionStyle ? parseFloat(actionStyle.borderTopWidth) || 0 : 0,
      actionBackground: actionStyle ? actionStyle.backgroundImage : "",
      actionTokenContent: actionBefore ? actionBefore.content : "none",
      actionTokenWidth: actionBefore ? parseFloat(actionBefore.width) || 0 : 0,
      supportHeight: support ? support.getBoundingClientRect().height : 0,
      supportBackground: supportStyle ? supportStyle.backgroundImage : ""
    };
  });
  if (
    earningPlanVisualMetrics.borderRadius < 16 ||
    earningPlanVisualMetrics.borderWidth < 3 ||
    earningPlanVisualMetrics.overflow !== "hidden" ||
    earningPlanVisualMetrics.paddingLeft < 40 ||
    !earningPlanVisualMetrics.background.includes("radial-gradient") ||
    earningPlanVisualMetrics.tokenContent === "none" ||
    earningPlanVisualMetrics.tokenWidth < 20 ||
    earningPlanVisualMetrics.shineContent === "none" ||
    earningPlanVisualMetrics.shineHeight < 10 ||
    earningPlanVisualMetrics.actionCount !== 2 ||
    earningPlanVisualMetrics.actionHeight < 44 ||
    earningPlanVisualMetrics.actionRadius < 14 ||
    earningPlanVisualMetrics.actionBorderWidth < 3 ||
    !earningPlanVisualMetrics.actionBackground.includes("radial-gradient") ||
    earningPlanVisualMetrics.actionTokenContent === "none" ||
    earningPlanVisualMetrics.actionTokenWidth < 14 ||
    earningPlanVisualMetrics.supportHeight < 44 ||
    !earningPlanVisualMetrics.supportBackground.includes("linear-gradient")
  ) {
    failures.push("[" + viewportName + "] Pantry earning plan lost its polished spoon-plan card treatment: " + JSON.stringify(earningPlanVisualMetrics));
  }

  await page.locator(".pantry-earning-support").first().click();
  await page.waitForSelector(".support-pack-card", { timeout: 2500 });
  const supportCardText = await page.locator(".support-pack-card").first().innerText();
  if (!supportCardText.includes("Support") || !supportCardText.includes("spoons")) {
    failures.push("[" + viewportName + "] Pantry support action should open the support pack settings card, saw " + supportCardText);
  }
  await page.locator(".settings-close").first().click();
  await page.waitForSelector(".settings-dialog", { state: "detached", timeout: 2500 });

  const firstSavingsText = await page.locator(".pantry-item-savings").first().innerText();
  if (!firstSavingsText.includes("3/") || !firstSavingsText.includes("more")) {
    failures.push("[" + viewportName + "] Pantry item savings meter should show seeded spoon progress, saw " + firstSavingsText);
  }

  const savingsVisualMetrics = await page.locator(".pantry-item-savings").first().evaluate((el) => {
    const style = getComputedStyle(el);
    const before = getComputedStyle(el, "::before");
    const meter = el.querySelector(".pantry-item-savings-meter");
    const fill = meter?.querySelector("span");
    const meterStyle = meter ? getComputedStyle(meter) : null;
    const fillStyle = fill ? getComputedStyle(fill) : null;
    return {
      borderRadius: parseFloat(style.borderRadius),
      borderWidth: parseFloat(style.borderTopWidth),
      overflow: style.overflow,
      paddingLeft: parseFloat(style.paddingLeft),
      background: style.backgroundImage,
      tokenContent: before.content,
      tokenWidth: parseFloat(before.width),
      meterHeight: meter ? meter.getBoundingClientRect().height : 0,
      meterBorderWidth: meterStyle ? parseFloat(meterStyle.borderTopWidth) : 0,
      fillBackground: fillStyle ? fillStyle.backgroundImage : ""
    };
  });
  if (savingsVisualMetrics.borderRadius < 14 || savingsVisualMetrics.borderWidth < 2 || savingsVisualMetrics.overflow !== "hidden" || savingsVisualMetrics.paddingLeft < 36 || !savingsVisualMetrics.background.includes("radial-gradient")) {
    failures.push("[" + viewportName + "] Pantry item savings lost its polished economy card treatment: " + JSON.stringify(savingsVisualMetrics));
  }
  if (savingsVisualMetrics.tokenContent === "none" || savingsVisualMetrics.tokenWidth < 18 || savingsVisualMetrics.meterHeight < 10 || savingsVisualMetrics.meterBorderWidth < 2 || !savingsVisualMetrics.fillBackground.includes("linear-gradient")) {
    failures.push("[" + viewportName + "] Pantry item savings lost token or meter artwork: " + JSON.stringify(savingsVisualMetrics));
  }

  const shopCardMetrics = await page.locator(".pantry-item-card").first().evaluate((card) => {
    const rect = card.getBoundingClientRect();
    const art = card.querySelector(".pantry-item-art");
    const artRect = art ? art.getBoundingClientRect() : { width: 0, height: 0 };
    const image = card.querySelector(".pantry-item-art img");
    const imageRect = image ? image.getBoundingClientRect() : { width: 0, height: 0 };
    const action = card.querySelector(".pantry-item-action");
    const actionRect = action ? action.getBoundingClientRect() : { width: 0, height: 0 };
    const meta = [...card.querySelectorAll(".pantry-item-meta span")].map((chip) => {
      const chipRect = chip.getBoundingClientRect();
      return { width: chipRect.width, height: chipRect.height, text: chip.textContent.trim() };
    });
    const shine = getComputedStyle(card, "::before");
    return {
      width: rect.width,
      height: rect.height,
      columns: getComputedStyle(card).gridTemplateColumns,
      borderRadius: parseFloat(getComputedStyle(card).borderRadius) || 0,
      borderWidth: parseFloat(getComputedStyle(card).borderTopWidth) || 0,
      overflow: getComputedStyle(card).overflow,
      background: getComputedStyle(card).backgroundImage,
      shineContent: shine.content,
      shineHeight: parseFloat(shine.height) || 0,
      artWidth: artRect.width,
      artHeight: artRect.height,
      artRadius: art ? parseFloat(getComputedStyle(art).borderRadius) || 0 : 0,
      imageWidth: imageRect.width,
      imageHeight: imageRect.height,
      actionWidth: actionRect.width,
      actionHeight: actionRect.height,
      meta
    };
  });
  if (
    shopCardMetrics.width < 180
    || shopCardMetrics.height < 210
    || !shopCardMetrics.columns.includes("px")
    || shopCardMetrics.borderRadius < 16
    || shopCardMetrics.borderWidth < 3
    || shopCardMetrics.overflow !== "hidden"
    || !shopCardMetrics.background.includes("radial-gradient")
    || shopCardMetrics.shineContent === "none"
    || shopCardMetrics.shineHeight < 8
    || shopCardMetrics.artWidth < 80
    || shopCardMetrics.artHeight < 96
    || shopCardMetrics.artRadius < 14
    || shopCardMetrics.imageWidth < 58
    || shopCardMetrics.imageHeight < 48
    || shopCardMetrics.actionWidth < 150
    || shopCardMetrics.actionHeight < 44
    || shopCardMetrics.meta.length !== 2
  ) {
    failures.push("[" + viewportName + "] Pantry shop card lost polished delivery-card treatment: " + JSON.stringify(shopCardMetrics));
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

  const shopLimitMetrics = await page.locator(".pantry-shop-limit").first().evaluate((control) => {
    const rect = control.getBoundingClientRect();
    const meter = control.querySelector(".pantry-shop-limit__meter");
    const meterRect = meter ? meter.getBoundingClientRect() : { width: 0, height: 0 };
    const meterFill = control.querySelector(".pantry-shop-limit__meter span");
    const meterFillRect = meterFill ? meterFill.getBoundingClientRect() : { width: 0, height: 0 };
    const button = control.querySelector(".pantry-shop-limit__action");
    const buttonRect = button ? button.getBoundingClientRect() : { width: 0, height: 0 };
    const token = button ? getComputedStyle(button, "::before") : { content: "none", width: "0", height: "0" };
    const shine = getComputedStyle(control, "::before");
    return {
      width: rect.width,
      borderRadius: parseFloat(getComputedStyle(control).borderRadius) || 0,
      borderWidth: parseFloat(getComputedStyle(control).borderTopWidth) || 0,
      overflow: getComputedStyle(control).overflow,
      background: getComputedStyle(control).backgroundImage,
      shineContent: shine.content,
      shineHeight: parseFloat(shine.height) || 0,
      meterWidth: meterRect.width,
      meterHeight: meterRect.height,
      meterFillWidth: meterFillRect.width,
      buttonWidth: buttonRect.width,
      buttonHeight: buttonRect.height,
      tokenContent: token.content,
      tokenWidth: parseFloat(token.width) || 0,
      tokenHeight: parseFloat(token.height) || 0
    };
  });
  if (
    shopLimitMetrics.width < 180
    || shopLimitMetrics.borderRadius < 16
    || shopLimitMetrics.borderWidth < 3
    || shopLimitMetrics.overflow !== "hidden"
    || !shopLimitMetrics.background.includes("radial-gradient")
    || shopLimitMetrics.shineContent === "none"
    || shopLimitMetrics.shineHeight < 8
    || shopLimitMetrics.meterWidth < 150
    || shopLimitMetrics.meterHeight < 10
    || shopLimitMetrics.meterFillWidth <= 0
    || shopLimitMetrics.buttonWidth < 120
    || shopLimitMetrics.buttonHeight < 44
    || shopLimitMetrics.tokenContent === "none"
    || shopLimitMetrics.tokenWidth < 10
    || shopLimitMetrics.tokenHeight < 10
  ) {
    failures.push("[" + viewportName + "] Pantry show-more reveal control lost polished progress treatment: " + JSON.stringify(shopLimitMetrics));
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
  const trackGoalVisualMetrics = await page.locator(".pantry-track-goal.active").first().evaluate((el) => {
    const style = getComputedStyle(el);
    const before = getComputedStyle(el, "::before");
    return {
      height: el.getBoundingClientRect().height,
      borderRadius: parseFloat(style.borderRadius),
      borderWidth: parseFloat(style.borderTopWidth),
      overflow: style.overflow,
      background: style.backgroundImage,
      tokenContent: before.content,
      tokenWidth: parseFloat(before.width),
      boxShadow: style.boxShadow
    };
  });
  if (trackGoalVisualMetrics.height < 44 || trackGoalVisualMetrics.borderRadius < 14 || trackGoalVisualMetrics.borderWidth < 3 || trackGoalVisualMetrics.overflow !== "hidden" || !trackGoalVisualMetrics.background.includes("radial-gradient") || trackGoalVisualMetrics.tokenContent === "none" || trackGoalVisualMetrics.tokenWidth < 14 || !trackGoalVisualMetrics.boxShadow.includes("rgba")) {
    failures.push("[" + viewportName + "] Track-goal button lost polished active card treatment: " + JSON.stringify(trackGoalVisualMetrics));
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
  const placementAdvisorMetrics = await page.locator(".pantry-placement-advisor").first().evaluate((el) => {
    const style = getComputedStyle(el);
    const before = getComputedStyle(el, "::before");
    const after = getComputedStyle(el, "::after");
    return {
      borderRadius: parseFloat(style.borderRadius),
      borderWidth: parseFloat(style.borderTopWidth),
      overflow: style.overflow,
      paddingLeft: parseFloat(style.paddingLeft),
      background: style.backgroundImage,
      tokenContent: before.content,
      tokenWidth: parseFloat(before.width),
      shineContent: after.content,
      shineHeight: parseFloat(after.height)
    };
  });
  if (placementAdvisorMetrics.borderRadius < 16 || placementAdvisorMetrics.borderWidth < 3 || placementAdvisorMetrics.overflow !== "hidden" || placementAdvisorMetrics.paddingLeft < 44 || !placementAdvisorMetrics.background.includes("radial-gradient")) {
    failures.push("[" + viewportName + "] Pantry placement advisor lost its polished planning-card frame: " + JSON.stringify(placementAdvisorMetrics));
  }
  if (placementAdvisorMetrics.tokenContent === "none" || placementAdvisorMetrics.tokenWidth < 22 || placementAdvisorMetrics.shineContent === "none" || placementAdvisorMetrics.shineHeight < 8) {
    failures.push("[" + viewportName + "] Pantry placement advisor lost token or shine artwork: " + JSON.stringify(placementAdvisorMetrics));
  }
  const counterDisplayPlanText = await page.locator(".pantry-display-plan").innerText();
  if (!counterDisplayPlanText.includes("Counter") || !counterDisplayPlanText.includes("empty") || !counterDisplayPlanText.includes("Starter Counter Cloth")) {
    failures.push("[" + viewportName + "] Counter display plan should explain current empty spot and next upgrade, saw " + counterDisplayPlanText);
  }
  const displayPlanMetrics = await page.locator(".pantry-display-plan").first().evaluate((el) => {
    const style = getComputedStyle(el);
    const before = getComputedStyle(el, "::before");
    const after = getComputedStyle(el, "::after");
    const next = el.querySelector(".pantry-display-plan__next");
    const nextStyle = next ? getComputedStyle(next) : null;
    const nextStrong = next?.querySelector("strong");
    const nextStrongBefore = nextStrong ? getComputedStyle(nextStrong, "::before") : null;
    return {
      borderRadius: parseFloat(style.borderRadius),
      borderWidth: parseFloat(style.borderTopWidth),
      overflow: style.overflow,
      background: style.backgroundImage,
      shineContent: before.content,
      shineHeight: parseFloat(before.height),
      tokenContent: after.content,
      tokenWidth: parseFloat(after.width),
      nextRadius: nextStyle ? parseFloat(nextStyle.borderRadius) : 0,
      nextBorderWidth: nextStyle ? parseFloat(nextStyle.borderTopWidth) : 0,
      nextIconContent: nextStrongBefore ? nextStrongBefore.content : "none",
      nextIconWidth: nextStrongBefore ? parseFloat(nextStrongBefore.width) : 0
    };
  });
  if (displayPlanMetrics.borderRadius < 16 || displayPlanMetrics.borderWidth < 3 || displayPlanMetrics.overflow !== "hidden" || !displayPlanMetrics.background.includes("radial-gradient")) {
    failures.push("[" + viewportName + "] Pantry display plan lost its polished card frame: " + JSON.stringify(displayPlanMetrics));
  }
  if (displayPlanMetrics.shineContent === "none" || displayPlanMetrics.shineHeight < 8 || displayPlanMetrics.tokenContent === "none" || displayPlanMetrics.tokenWidth < 24) {
    failures.push("[" + viewportName + "] Pantry display plan lost shine or token artwork: " + JSON.stringify(displayPlanMetrics));
  }
  if (displayPlanMetrics.nextRadius < 12 || displayPlanMetrics.nextBorderWidth < 2 || displayPlanMetrics.nextIconContent === "none" || displayPlanMetrics.nextIconWidth < 12) {
    failures.push("[" + viewportName + "] Pantry display plan next-step chip lost its upgrade artwork: " + JSON.stringify(displayPlanMetrics));
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
  const filteredSummaryMetrics = await page.locator(".pantry-filter-summary").first().evaluate((el) => {
    const style = getComputedStyle(el);
    const clear = el.querySelector(".pantry-clear-filters");
    const clearStyle = clear ? getComputedStyle(clear) : null;
    return {
      height: el.getBoundingClientRect().height,
      borderRadius: parseFloat(style.borderRadius) || 0,
      borderWidth: parseFloat(style.borderTopWidth) || 0,
      overflow: style.overflow,
      background: style.backgroundImage,
      clearHeight: clear ? clear.getBoundingClientRect().height : 0,
      clearRadius: clearStyle ? parseFloat(clearStyle.borderRadius) || 0 : 0,
      clearBorderWidth: clearStyle ? parseFloat(clearStyle.borderTopWidth) || 0 : 0,
      clearBackground: clearStyle ? clearStyle.backgroundImage : ""
    };
  });
  if (
    filteredSummaryMetrics.height < 42 ||
    filteredSummaryMetrics.borderRadius < 14 ||
    filteredSummaryMetrics.borderWidth < 3 ||
    filteredSummaryMetrics.overflow !== "hidden" ||
    !filteredSummaryMetrics.background.includes("radial-gradient") ||
    filteredSummaryMetrics.clearHeight < 40 ||
    filteredSummaryMetrics.clearRadius < 14 ||
    filteredSummaryMetrics.clearBorderWidth < 3 ||
    !filteredSummaryMetrics.clearBackground.includes("radial-gradient")
  ) {
    failures.push("[" + viewportName + "] Pantry filtered summary lost polished reset treatment: " + JSON.stringify(filteredSummaryMetrics));
  }
  if (rareCardCount !== 5) {
    failures.push("[" + viewportName + "] Rare filter should show 5 decorations, saw " + rareCardCount);
  }

  await page.locator(".pantry-availability-filter", { hasText: /Can buy/ }).click();
  await page.waitForTimeout(120);
  await expectVisible(page, ".pantry-empty-state", viewportName);
  const resetFilterMetrics = await page.locator(".pantry-reset-filters").first().evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      height: el.getBoundingClientRect().height,
      borderRadius: parseFloat(style.borderRadius) || 0,
      borderWidth: parseFloat(style.borderTopWidth) || 0,
      overflow: style.overflow,
      background: style.backgroundImage,
      boxShadow: style.boxShadow
    };
  });
  if (resetFilterMetrics.height < 42 || resetFilterMetrics.borderRadius < 14 || resetFilterMetrics.borderWidth < 3 || resetFilterMetrics.overflow !== "hidden" || !resetFilterMetrics.background.includes("radial-gradient") || !resetFilterMetrics.boxShadow.includes("rgba")) {
    failures.push("[" + viewportName + "] Pantry reset-filters button lost tactile treatment: " + JSON.stringify(resetFilterMetrics));
  }
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
    await expectGuideDialogChromeArt(page, viewportName);
    await page.locator(".guide-dialog__skip").click();
    await page.locator(".guide-overlay").waitFor({ state: "detached", timeout: 2000 });
  }

  await expectVisible(page, ".pantry-action-feedback", viewportName);
  const feedbackText = await page.locator(".pantry-action-feedback").innerText();
  if (!feedbackText.includes("Starter Counter Cloth") || !feedbackText.includes("Pantry updated")) {
    failures.push("[" + viewportName + "] Pantry purchase feedback should celebrate the placed starter decoration, saw " + feedbackText);
  }

  const purchaseFeedbackMetrics = await page.locator(".pantry-action-feedback").first().evaluate((el) => {
    const style = getComputedStyle(el);
    const before = getComputedStyle(el, "::before");
    const after = getComputedStyle(el, "::after");
    const art = el.querySelector(".pantry-action-feedback__art");
    const artStyle = art ? getComputedStyle(art) : null;
    const img = el.querySelector(".pantry-action-feedback__art img");
    const imgRect = img ? img.getBoundingClientRect() : { width: 0, height: 0 };
    const pip = el.querySelector(".pantry-action-feedback__pip");
    const pipStyle = pip ? getComputedStyle(pip) : null;
    const pipAfter = pip ? getComputedStyle(pip, "::after") : null;
    const pipImg = el.querySelector(".pantry-action-feedback__pip img");
    const pipImgRect = pipImg ? pipImg.getBoundingClientRect() : { width: 0, height: 0 };
    const dismiss = el.querySelector(".pantry-action-feedback__dismiss");
    const dismissRect = dismiss ? dismiss.getBoundingClientRect() : { height: 0 };
    return {
      width: el.getBoundingClientRect().width,
      borderRadius: parseFloat(style.borderRadius),
      borderWidth: parseFloat(style.borderTopWidth),
      overflow: style.overflow,
      background: style.backgroundImage,
      shineContent: before.content,
      shineHeight: parseFloat(before.height),
      tokenContent: after.content,
      tokenWidth: parseFloat(after.width),
      artWidth: art ? art.getBoundingClientRect().width : 0,
      artRadius: artStyle ? parseFloat(artStyle.borderRadius) : 0,
      imageWidth: imgRect.width,
      imageHeight: imgRect.height,
      pipWidth: pip ? pip.getBoundingClientRect().width : 0,
      pipRadius: pipStyle ? parseFloat(pipStyle.borderRadius) : 0,
      pipBorderWidth: pipStyle ? parseFloat(pipStyle.borderTopWidth) : 0,
      pipBackground: pipStyle ? pipStyle.backgroundImage : "",
      pipTailContent: pipAfter ? pipAfter.content : "none",
      pipImageWidth: pipImgRect.width,
      pipImageHeight: pipImgRect.height,
      dismissHeight: dismissRect.height
    };
  });
  if (purchaseFeedbackMetrics.width < 300 || purchaseFeedbackMetrics.borderRadius < 16 || purchaseFeedbackMetrics.borderWidth < 3 || purchaseFeedbackMetrics.overflow !== "hidden" || !purchaseFeedbackMetrics.background.includes("radial-gradient")) {
    failures.push("[" + viewportName + "] Pantry purchase feedback card lost its polished reward frame: " + JSON.stringify(purchaseFeedbackMetrics));
  }
  if (purchaseFeedbackMetrics.shineContent === "none" || purchaseFeedbackMetrics.shineHeight < 10 || purchaseFeedbackMetrics.tokenContent === "none" || purchaseFeedbackMetrics.tokenWidth < 24) {
    failures.push("[" + viewportName + "] Pantry purchase feedback card lost shine/token artwork: " + JSON.stringify(purchaseFeedbackMetrics));
  }
  if (purchaseFeedbackMetrics.artWidth < 68 || purchaseFeedbackMetrics.artRadius < 14 || purchaseFeedbackMetrics.imageWidth < 44 || purchaseFeedbackMetrics.imageHeight < 44 || purchaseFeedbackMetrics.dismissHeight < 40) {
    failures.push("[" + viewportName + "] Pantry purchase feedback art or dismiss target regressed: " + JSON.stringify(purchaseFeedbackMetrics));
  }
  if (purchaseFeedbackMetrics.pipWidth < 42 || purchaseFeedbackMetrics.pipRadius < 14 || purchaseFeedbackMetrics.pipBorderWidth < 2 || !purchaseFeedbackMetrics.pipBackground.includes("radial-gradient") || purchaseFeedbackMetrics.pipTailContent === "none" || purchaseFeedbackMetrics.pipImageWidth < 34 || purchaseFeedbackMetrics.pipImageHeight < 34) {
    failures.push("[" + viewportName + "] Pantry purchase feedback lost Pip cameo artwork: " + JSON.stringify(purchaseFeedbackMetrics));
  }

  await expectVisible(page, ".pantry-progress-board", viewportName);
  const postPurchaseProgressText = await page.locator(".pantry-progress-board").innerText();
  if (!postPurchaseProgressText.includes("1/25") || !postPurchaseProgressText.includes("1/5")) {
    failures.push("[" + viewportName + "] First Pantry purchase did not update collection progress, saw " + postPurchaseProgressText);
  }
  const postPurchaseMissionText = await page.locator(".pantry-progress-mission").first().innerText();
  if (!postPurchaseMissionText.includes("0/3") || !postPurchaseMissionText.includes("Stage spoons")) {
    failures.push("[" + viewportName + "] First Pantry purchase should preserve the room-path mission until the story request is delivered, saw " + postPurchaseMissionText);
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
  const milestoneVisualMetrics = await page.locator(".pantry-story-milestone").first().evaluate((el) => {
    const style = getComputedStyle(el);
    const before = getComputedStyle(el, "::before");
    const after = getComputedStyle(el, "::after");
    const level = el.querySelector(".pantry-story-milestone__level");
    const item = el.querySelector(".pantry-story-milestone__item");
    const levelStyle = level ? getComputedStyle(level) : null;
    const itemStyle = item ? getComputedStyle(item) : null;
    return {
      borderRadius: parseFloat(style.borderRadius),
      borderWidth: parseFloat(style.borderTopWidth),
      overflow: style.overflow,
      background: style.backgroundImage,
      shineContent: before.content,
      tokenContent: after.content,
      tokenWidth: parseFloat(after.width),
      levelRadius: levelStyle ? parseFloat(levelStyle.borderRadius) : 0,
      itemRadius: itemStyle ? parseFloat(itemStyle.borderRadius) : 0,
      itemHeight: item ? item.getBoundingClientRect().height : 0,
      itemCount: el.querySelectorAll(".pantry-story-milestone__item").length
    };
  });
  if (milestoneVisualMetrics.borderRadius < 16 || milestoneVisualMetrics.borderWidth < 3 || milestoneVisualMetrics.overflow !== "hidden" || !milestoneVisualMetrics.background.includes("radial-gradient") || milestoneVisualMetrics.shineContent === "none" || milestoneVisualMetrics.tokenContent === "none" || milestoneVisualMetrics.tokenWidth < 24 || milestoneVisualMetrics.levelRadius < 14 || milestoneVisualMetrics.itemRadius < 12 || milestoneVisualMetrics.itemHeight < 48 || milestoneVisualMetrics.itemCount < 1) {
    failures.push("[" + viewportName + "] Pantry story milestone lost its polished reward-card treatment: " + JSON.stringify(milestoneVisualMetrics));
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

  const storyDeliveryMetrics = await page.locator(".pantry-story-delivery").first().evaluate((el) => {
    const style = getComputedStyle(el);
    const before = getComputedStyle(el, "::before");
    const after = getComputedStyle(el, "::after");
    const art = el.querySelector(".pantry-story-delivery__art");
    const pip = el.querySelector(".pantry-story-delivery__pip");
    const step = el.querySelector(".pantry-story-delivery__steps span");
    const action = el.querySelector(".pantry-story-delivery__action");
    const artStyle = art ? getComputedStyle(art) : null;
    const pipStyle = pip ? getComputedStyle(pip) : null;
    const pipAfter = pip ? getComputedStyle(pip, "::after") : null;
    const pipImage = pip ? pip.querySelector("img") : null;
    const pipImageRect = pipImage ? pipImage.getBoundingClientRect() : { width: 0, height: 0 };
    const stepStyle = step ? getComputedStyle(step) : null;
    const actionStyle = action ? getComputedStyle(action) : null;
    return {
      borderRadius: parseFloat(style.borderRadius),
      borderWidth: parseFloat(style.borderTopWidth),
      borderStyle: style.borderTopStyle,
      overflow: style.overflow,
      background: style.backgroundImage,
      shineContent: before.content,
      tokenContent: after.content,
      tokenWidth: parseFloat(after.width),
      artRadius: artStyle ? parseFloat(artStyle.borderRadius) : 0,
      pipWidth: pip ? pip.getBoundingClientRect().width : 0,
      pipRadius: pipStyle ? parseFloat(pipStyle.borderRadius) : 0,
      pipBorderWidth: pipStyle ? parseFloat(pipStyle.borderTopWidth) : 0,
      pipBackground: pipStyle ? pipStyle.backgroundImage : "",
      pipTailContent: pipAfter ? pipAfter.content : "none",
      pipImageWidth: pipImageRect.width,
      pipImageHeight: pipImageRect.height,
      stepRadius: stepStyle ? parseFloat(stepStyle.borderRadius) : 0,
      actionHeight: action ? action.getBoundingClientRect().height : 0,
      actionRadius: actionStyle ? parseFloat(actionStyle.borderRadius) : 0
    };
  });
  if (storyDeliveryMetrics.borderRadius < 16 || storyDeliveryMetrics.borderWidth < 3 || storyDeliveryMetrics.borderStyle !== "solid" || storyDeliveryMetrics.overflow !== "hidden" || !storyDeliveryMetrics.background.includes("radial-gradient") || storyDeliveryMetrics.shineContent === "none" || storyDeliveryMetrics.tokenContent === "none" || storyDeliveryMetrics.tokenWidth < 24 || storyDeliveryMetrics.artRadius < 14 || storyDeliveryMetrics.stepRadius < 20 || storyDeliveryMetrics.actionHeight < 44 || storyDeliveryMetrics.actionRadius < 14) {
    failures.push("[" + viewportName + "] Pantry story delivery lost its polished delivery-card treatment: " + JSON.stringify(storyDeliveryMetrics));
  }
  if (storyDeliveryMetrics.pipWidth < 42 || storyDeliveryMetrics.pipRadius < 14 || storyDeliveryMetrics.pipBorderWidth < 2 || !storyDeliveryMetrics.pipBackground.includes("radial-gradient") || storyDeliveryMetrics.pipTailContent === "none" || storyDeliveryMetrics.pipImageWidth < 34 || storyDeliveryMetrics.pipImageHeight < 34) {
    failures.push("[" + viewportName + "] Pantry story delivery lost Pip stamp artwork: " + JSON.stringify(storyDeliveryMetrics));
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
    await dismissIntro(page, "Jay", viewportName);
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
  const storyFeedbackMetrics = await page.locator(".pantry-action-feedback.story-complete").first().evaluate((el) => {
    const style = getComputedStyle(el);
    const before = getComputedStyle(el, "::before");
    const after = getComputedStyle(el, "::after");
    const art = el.querySelector(".pantry-action-feedback__art");
    const artStyle = art ? getComputedStyle(art) : null;
    const img = el.querySelector(".pantry-action-feedback__art img");
    const imgRect = img ? img.getBoundingClientRect() : { width: 0, height: 0 };
    const pip = el.querySelector(".pantry-action-feedback__pip");
    const pipStyle = pip ? getComputedStyle(pip) : null;
    const pipImg = el.querySelector(".pantry-action-feedback__pip img");
    const pipImgRect = pipImg ? pipImg.getBoundingClientRect() : { width: 0, height: 0 };
    return {
      borderRadius: parseFloat(style.borderRadius),
      borderWidth: parseFloat(style.borderTopWidth),
      background: style.backgroundImage,
      shineContent: before.content,
      tokenContent: after.content,
      tokenWidth: parseFloat(after.width),
      artWidth: art ? art.getBoundingClientRect().width : 0,
      artRadius: artStyle ? parseFloat(artStyle.borderRadius) : 0,
      imageWidth: imgRect.width,
      imageHeight: imgRect.height,
      pipWidth: pip ? pip.getBoundingClientRect().width : 0,
      pipRadius: pipStyle ? parseFloat(pipStyle.borderRadius) : 0,
      pipBackground: pipStyle ? pipStyle.backgroundImage : "",
      pipImageWidth: pipImgRect.width,
      pipImageHeight: pipImgRect.height
    };
  });
  if (storyFeedbackMetrics.borderRadius < 16 || storyFeedbackMetrics.borderWidth < 3 || !storyFeedbackMetrics.background.includes("radial-gradient") || storyFeedbackMetrics.shineContent === "none" || storyFeedbackMetrics.tokenContent === "none" || storyFeedbackMetrics.tokenWidth < 24) {
    failures.push("[" + viewportName + "] Story-complete feedback card lost reward polish: " + JSON.stringify(storyFeedbackMetrics));
  }
  if (storyFeedbackMetrics.artWidth < 68 || storyFeedbackMetrics.artRadius < 14 || storyFeedbackMetrics.imageWidth < 44 || storyFeedbackMetrics.imageHeight < 44) {
    failures.push("[" + viewportName + "] Story-complete feedback art regressed: " + JSON.stringify(storyFeedbackMetrics));
  }
  if (storyFeedbackMetrics.pipWidth < 42 || storyFeedbackMetrics.pipRadius < 14 || !storyFeedbackMetrics.pipBackground.includes("radial-gradient") || storyFeedbackMetrics.pipImageWidth < 34 || storyFeedbackMetrics.pipImageHeight < 34) {
    failures.push("[" + viewportName + "] Story-complete feedback lost Pip cameo artwork: " + JSON.stringify(storyFeedbackMetrics));
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
  const storyArchiveMetrics = await page.locator(".pantry-story-archive").first().evaluate((el) => {
    const style = getComputedStyle(el);
    const before = getComputedStyle(el, "::before");
    const after = getComputedStyle(el, "::after");
    const step = el.querySelector(".pantry-story-archive__step");
    const meter = el.querySelector(".pantry-story-archive__meter");
    const chapter = el.querySelector(".pantry-story-archive__chapter");
    const stageGoal = el.querySelector(".pantry-story-archive__stage-goal");
    const next = el.querySelector(".pantry-story-archive__next");
    const nextAction = el.querySelector(".pantry-story-archive__next-action");
    const item = el.querySelector(".pantry-story-archive__item");
    const stepStyle = step ? getComputedStyle(step) : null;
    const meterStyle = meter ? getComputedStyle(meter) : null;
    const chapterStyle = chapter ? getComputedStyle(chapter) : null;
    const stageGoalStyle = stageGoal ? getComputedStyle(stageGoal) : null;
    const nextStyle = next ? getComputedStyle(next) : null;
    const nextActionStyle = nextAction ? getComputedStyle(nextAction) : null;
    const itemStyle = item ? getComputedStyle(item) : null;
    return {
      borderRadius: parseFloat(style.borderRadius),
      borderWidth: parseFloat(style.borderTopWidth),
      overflow: style.overflow,
      background: style.backgroundImage,
      shineContent: before.content,
      tokenContent: after.content,
      tokenWidth: parseFloat(after.width),
      stepRadius: stepStyle ? parseFloat(stepStyle.borderRadius) : 0,
      meterHeight: meter ? meter.getBoundingClientRect().height : 0,
      meterOverflow: meterStyle ? meterStyle.overflow : "",
      chapterRadius: chapterStyle ? parseFloat(chapterStyle.borderRadius) : 0,
      stageGoalRadius: stageGoalStyle ? parseFloat(stageGoalStyle.borderRadius) : 0,
      nextRadius: nextStyle ? parseFloat(nextStyle.borderRadius) : 0,
      actionHeight: nextAction ? nextAction.getBoundingClientRect().height : 0,
      actionRadius: nextActionStyle ? parseFloat(nextActionStyle.borderRadius) : 0,
      itemRadius: itemStyle ? parseFloat(itemStyle.borderRadius) : 0,
      itemHeight: item ? item.getBoundingClientRect().height : 0
    };
  });
  if (storyArchiveMetrics.borderRadius < 16 || storyArchiveMetrics.borderWidth < 3 || storyArchiveMetrics.overflow !== "hidden" || !storyArchiveMetrics.background.includes("radial-gradient") || storyArchiveMetrics.shineContent === "none" || storyArchiveMetrics.tokenContent === "none" || storyArchiveMetrics.tokenWidth < 24 || storyArchiveMetrics.stepRadius < 14 || storyArchiveMetrics.meterHeight < 9 || storyArchiveMetrics.meterOverflow !== "hidden" || storyArchiveMetrics.chapterRadius < 14 || storyArchiveMetrics.stageGoalRadius < 14 || storyArchiveMetrics.nextRadius < 14 || storyArchiveMetrics.actionHeight < 44 || storyArchiveMetrics.actionRadius < 14 || storyArchiveMetrics.itemRadius < 14 || storyArchiveMetrics.itemHeight < 48) {
    failures.push("[" + viewportName + "] Pantry story archive lost its polished request-log treatment: " + JSON.stringify(storyArchiveMetrics));
  }
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
