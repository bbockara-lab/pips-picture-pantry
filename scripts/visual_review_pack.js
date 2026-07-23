import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import http from "node:http";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";
import { APP_VERSION } from "../src/data/appVersion.js";

const isWindows = process.platform === "win32";
const requestedUrl = process.env.PPP_URL || "";
const explicitPort = process.env.PPP_QA_PORT ? Number(process.env.PPP_QA_PORT) : null;
let port = explicitPort || 5184;
let baseUrl = requestedUrl || "http://127.0.0.1:" + port + "/";
const outputRoot = resolve(process.cwd(), "qa-artifacts", "visual-review", APP_VERSION);
const shotsDir = resolve(outputRoot, "screenshots");
const reviewViewports = {
  mobile: { width: 390, height: 844 },
  widePreview: { width: 675, height: 900 }
};
const manifest = {
  version: APP_VERSION,
  generatedAt: new Date().toISOString(),
  baseUrl,
  viewport: reviewViewports.mobile,
  viewports: [
    { name: "mobile", ...reviewViewports.mobile },
    { name: "wide-preview", ...reviewViewports.widePreview }
  ],
  screenshots: [],
  layoutChecks: [],
  manualPlay: {
    command: "npm run review:play",
    url: "http://127.0.0.1:5173/"
  },
  checklist: [
    "Pip and Sunny Spoon Studios artwork must look consistent across opening, guide, Pantry, Billing, and Time Attack.",
    "Repeated control symbols should read as intentional tactile artwork, not placeholder glyphs.",
    "Korean and English copy must fit without one-character wrapping, overlap, or clipped buttons.",
    "Time Attack must be discoverable from both the opening/puzzle hub and the floating menu.",
    "Billing should feel optional and supportive, with Support Pack and Spoon Jar roles visually distinct.",
    "Pantry/shop cards should make the next action obvious: decorate, earn spoons, buy, equip, or open a stage."
  ],
  notes: [
    "Local visual review pack for launch art, UX, and Billing surface review.",
    "Use this with qa:mobile: qa:mobile catches regressions, this pack creates screenshots for human art direction.",
    "Screenshots are intentionally ignored by git under qa-artifacts/."
  ]
};

rmSync(outputRoot, { recursive: true, force: true });
mkdirSync(shotsDir, { recursive: true });

function commandFor(command) {
  return isWindows
    ? { file: "cmd.exe", args: ["/d", "/s", "/c", command] }
    : { file: "sh", args: ["-lc", command] };
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function probe(url) {
  return new Promise((resolve) => {
    const req = http.request(url, { method: "HEAD", timeout: 1200 }, (res) => {
      res.resume();
      resolve(res.statusCode || 0);
    });
    req.on("timeout", () => {
      req.destroy();
      resolve(0);
    });
    req.on("error", () => resolve(0));
    req.end();
  });
}

async function findAvailablePort(startPort) {
  for (let candidate = startPort; candidate < startPort + 12; candidate += 1) {
    const status = await probe("http://127.0.0.1:" + candidate + "/");
    if (!status) return candidate;
  }
  throw new Error("No available local visual review port found from " + startPort + " to " + (startPort + 11) + ".");
}

async function waitForServer(url) {
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const status = await probe(url);
    if (status >= 200 && status < 500) return status;
    await wait(500);
  }
  throw new Error("Dev server did not respond at " + url);
}

async function capture(page, name, selector, options = {}) {
  if (selector) {
    const target = page.locator(selector).first();
    await target.waitFor({ state: "visible", timeout: options.timeout || 6000 });
    await target.scrollIntoViewIfNeeded();
  }
  await page.waitForTimeout(options.settleMs || 220);
  const fileName = String(manifest.screenshots.length + 1).padStart(2, "0") + "-" + name + ".png";
  const filePath = resolve(shotsDir, fileName);
  await page.screenshot({ path: filePath, fullPage: Boolean(options.fullPage) });
  manifest.screenshots.push({
    name,
    fileName,
    relativePath: "screenshots/" + fileName,
    selector: selector || "viewport",
    fullPage: Boolean(options.fullPage),
    viewport: page.viewportSize() || manifest.viewport,
    viewportName: options.viewportName || "mobile",
    path: filePath
  });
}

function writeContactSheet() {
  const cards = manifest.screenshots.map((shot) => `
    <article class="shot-card">
      <h2>${escapeHtml(shot.fileName)}</h2>
      <p>${escapeHtml(shot.name)} &middot; ${escapeHtml(shot.viewportName)} ${escapeHtml(shot.viewport.width)}x${escapeHtml(shot.viewport.height)} &middot; ${escapeHtml(shot.selector)}</p>
      <a href="${escapeHtml(shot.relativePath)}"><img src="${escapeHtml(shot.relativePath)}" alt="${escapeHtml(shot.name)} screenshot"></a>
    </article>`).join("\n");
  const checklist = manifest.checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n");
  const viewportSummary = manifest.viewports.map((viewport) => `${viewport.name} ${viewport.width}x${viewport.height}`).join(", ");
  const html = `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pip's Picture Pantry Visual Review ${escapeHtml(manifest.version)}</title>
<style>
  body { margin: 0; background: #f7eedc; color: #3d2b2e; font-family: system-ui, sans-serif; }
  header { position: sticky; top: 0; z-index: 2; padding: 16px 20px; background: rgba(255, 250, 238, 0.94); border-bottom: 1px solid rgba(61, 43, 46, 0.16); }
  h1 { margin: 0 0 4px; font-size: 20px; }
  header p { margin: 0; color: #7b5741; }
  .review-brief { display: grid; grid-template-columns: minmax(0, 1fr) minmax(240px, 360px); gap: 16px; padding: 18px 20px 0; }
  .brief-card { background: #fff9ed; border: 1px solid rgba(61, 43, 46, 0.16); border-radius: 14px; box-shadow: 0 10px 22px rgba(61, 43, 46, 0.1); padding: 14px 16px; }
  .brief-card h2 { margin: 0 0 8px; font-size: 15px; }
  .brief-card p { margin: 0 0 10px; color: #7b5741; font-size: 13px; line-height: 1.45; }
  .brief-card code { display: inline-block; padding: 3px 6px; border-radius: 8px; background: rgba(252, 205, 92, 0.22); color: #68442d; font-size: 12px; }
  .brief-card ul { margin: 0; padding-left: 18px; color: #5c4139; font-size: 13px; line-height: 1.5; }
  .brief-card li + li { margin-top: 4px; }
  main { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 390px)); gap: 18px; padding: 20px; align-items: start; }
  .shot-card { background: #fff9ed; border: 1px solid rgba(61, 43, 46, 0.16); border-radius: 14px; box-shadow: 0 10px 22px rgba(61, 43, 46, 0.12); overflow: hidden; }
  .shot-card h2 { margin: 14px 14px 4px; font-size: 15px; }
  .shot-card p { margin: 0 14px 12px; color: #7b5741; font-size: 13px; }
  .shot-card img { display: block; width: 100%; height: auto; background: #fff; }
  @media (max-width: 760px) { .review-brief { grid-template-columns: 1fr; } }
</style>
<header>
  <h1>Pip's Picture Pantry Visual Review ${escapeHtml(manifest.version)}</h1>
  <p>${manifest.screenshots.length} screenshots &middot; ${escapeHtml(viewportSummary)} &middot; ${escapeHtml(manifest.generatedAt)}</p>
</header>
<section class="review-brief" aria-label="Visual review brief">
  <article class="brief-card">
    <h2>Manual Play</h2>
    <p>Use the screenshots for repeatable review, then run the app locally for hands-on checks in the Codex/browser preview.</p>
    <p><code>${escapeHtml(manifest.manualPlay.command)}</code> then open <code>${escapeHtml(manifest.manualPlay.url)}</code></p>
  </article>
  <article class="brief-card">
    <h2>Launch Art And UX Checklist</h2>
    <ul>
${checklist}
    </ul>
  </article>
</section>
<main>
${cards}
</main>
</html>
`;
  writeFileSync(resolve(outputRoot, "index.html"), html, "utf8");
}

async function dismissIntro(page) {
  if ((await page.locator(".brand-intro").count()) === 0) return;
  await page.locator(".brand-intro.game-stage").waitFor({ state: "visible", timeout: 6500 });
  await page.locator(".brand-intro__skip").first().click();
  const input = page.locator("#player-intro-name");
  try {
    await input.waitFor({ state: "visible", timeout: 900 });
    await input.fill("Jay");
    await page.locator(".player-intro-form .brand-intro__skip").click();
  } catch {
    // Existing visual-review player skips the name stage.
  }
  await page.locator(".brand-intro").waitFor({ state: "detached", timeout: 3500 });
}

async function dismissGuideIfPresent(page) {
  const overlay = page.locator(".guide-overlay");
  try {
    await overlay.first().waitFor({ state: "visible", timeout: 1200 });
    await page.locator(".guide-dialog__skip").first().click({ force: true });
    await overlay.first().waitFor({ state: "detached", timeout: 3000 });
  } catch {
    // Not every seeded route shows a guide.
  }
}

async function openFloatingView(page, view) {
  await dismissGuideIfPresent(page);
  if ((await page.locator(".floating-nav__trigger").count()) === 0 && (await page.locator(".play-screen__back").count()) > 0) {
    await page.locator(".play-screen__back").click();
  }
  await page.locator(".floating-nav__trigger").first().waitFor({ state: "visible", timeout: 5000 });
  await page.locator(".floating-nav__trigger").first().click();
  await page.locator(".floating-nav__item[data-view='" + view + "']").click();
  const selectors = { album: ".album-panel", map: ".map-panel", pantry: ".pantry-panel", puzzle: ".pack-block", timeAttack: ".time-attack-panel" };
  if (selectors[view]) await page.locator(selectors[view]).first().waitFor({ state: "visible", timeout: 6000 });
}

async function returnToPuzzleHub(page) {
  await dismissGuideIfPresent(page);
  if ((await page.locator(".floating-nav__trigger").count()) === 0 && (await page.locator(".play-screen__back").count()) > 0) {
    await page.locator(".play-screen__back").first().click();
  }
  await page.locator(".app-shell").first().waitFor({ state: "visible", timeout: 6000 });
  if ((await page.locator(".time-attack-teaser-card").count()) === 0 && (await page.locator(".floating-nav__trigger").count()) > 0) {
    await openFloatingView(page, "puzzle");
  }
  await page.locator(".time-attack-teaser-card, .pack-block").first().waitFor({ state: "visible", timeout: 6000 });
}

async function seedReturningPlayer(page) {
  await page.evaluate(() => {
    const player = { id: "jay", name: "Jay" };
    const saveKey = "pips-picture-pantry:v0.1:save:jay";
    localStorage.setItem("pips-picture-pantry:v0.1:active-player", JSON.stringify(player));
    localStorage.setItem("pips-picture-pantry:v0.1:players", JSON.stringify([player]));
    localStorage.setItem(saveKey, JSON.stringify({
      completedPuzzleIds: ["pips-first-shelf-pip-face-1"],
      rewardedPuzzleIds: ["pips-first-shelf-pip-face-1"],
      unlockedPackIds: ["pips-first-shelf", "bakery-window", "village-pantry"],
      pantrySpoons: 999,
      dailyRewardedDates: [],
      replayDailyCounts: [],
      timeAttackDailyCounts: [],
      pantryOwnedDecorationIds: ["starter-counter-cloth", "small-jam-jar", "linen-curtain"],
      pantryDisplayedDecorationIds: ["starter-counter-cloth"],
      pantryCompletedStoryGoalIds: [],
      seenGuideIds: ["firstPuzzle", "pantryFirstPurchase", "timeAttackIntro"]
    }));
  });
}

async function capturePantryNeighborReveal(page, options) {
  await dismissGuideIfPresent(page);
  await page.evaluate(({ completedStoryGoalIds, guideId, earlierGuideIds }) => {
    const saveKey = "pips-picture-pantry:v0.1:save:jay";
    const save = JSON.parse(localStorage.getItem(saveKey) || "{}");
    save.pantrySpoons = 999;
    save.ownedDecorationIds = (save.ownedDecorationIds || save.pantryOwnedDecorationIds || []).filter((id) => id !== "small-jam-jar");
    save.pantryOwnedDecorationIds = [...save.ownedDecorationIds];
    save.equippedDecorations = { ...(save.equippedDecorations || {}), counter: "starter-counter-cloth" };
    save.pantryCompletedStoryGoalIds = completedStoryGoalIds;
    save.pantryStoryGoalId = "small-jam-jar";
    const neighborGuideIds = ["pantryNeighborMrPark", "pantryNeighborLily", "pantryNeighborMateo"];
    save.seenGuideIds = Array.from(new Set([
      ...(save.seenGuideIds || []).filter((id) => !neighborGuideIds.includes(id)),
      "puzzle",
      "pantryFirstPurchase",
      "pantryRoomStory",
      ...earlierGuideIds
    ])).filter((id) => id !== guideId);
    localStorage.setItem(saveKey, JSON.stringify(save));
    localStorage.setItem("pip-picture-pantry-language", "ko");
  }, options);
  await page.reload({ waitUntil: "networkidle" });
  await dismissIntro(page);
  await dismissGuideIfPresent(page);
  await openFloatingView(page, "pantry");
  const jamCard = page.locator(".pantry-item-card", { hasText: /Small Jam Jar|작은 잼 병/ }).first();
  await jamCard.locator(".pantry-item-action").click();
  const guideDialog = page.locator(`.guide-dialog[data-guide-id="${options.guideId}"]`);
  await guideDialog.waitFor({ state: "visible", timeout: 3000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.complete ? Promise.resolve() : image.decode().catch(() => {})));
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  const layout = await guideDialog.evaluate((dialog) => {
    const rect = dialog.getBoundingClientRect();
    const bubble = dialog.querySelector(".guide-dialog__bubble");
    const line = dialog.querySelector(".guide-dialog__line");
    const buttons = [...dialog.querySelectorAll(".guide-dialog__actions button")];
    const boxFor = (element) => {
      const box = element?.getBoundingClientRect();
      return box ? { left: box.left, top: box.top, right: box.right, bottom: box.bottom, width: box.width, height: box.height } : null;
    };
    const elementFits = (element) => {
      if (!element) return false;
      const box = element.getBoundingClientRect();
      return box.left >= -1 && box.top >= -1 && box.right <= window.innerWidth + 1 && box.bottom <= window.innerHeight + 1
        && element.scrollWidth <= element.clientWidth + 1 && element.scrollHeight <= element.clientHeight + 1;
    };
    return {
      dialogFits: rect.left >= -1 && rect.top >= -1 && rect.right <= window.innerWidth + 1 && rect.bottom <= window.innerHeight + 1,
      lineFits: elementFits(line),
      buttonsFit: buttons.length === 2 && buttons.every(elementFits),
      rect: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom },
      bubbleRect: boxFor(bubble),
      lineRect: boxFor(line),
      buttonRects: buttons.map(boxFor),
      buttonText: buttons.map((button) => button.textContent.trim()),
      viewport: { width: window.innerWidth, height: window.innerHeight }
    };
  });
  manifest.layoutChecks.push({ name: options.captureName, ...layout });
  if (!layout.dialogFits || !layout.lineFits || !layout.buttonsFit) {
    throw new Error(`${options.guideId} visual layout escaped its viewport: ${JSON.stringify(layout)}`);
  }
  await capture(page, options.captureName, ".guide-dialog", { settleMs: 700 });
}

async function captureIsolatedPantryNeighborReveal(browser, options) {
  const page = await browser.newPage({ viewport: reviewViewports.mobile });
  try {
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await capturePantryNeighborReveal(page, options);
  } finally {
    await page.close();
  }
}

async function captureSettings(page, options = {}) {
  const namePrefix = options.namePrefix || "";
  const viewportName = options.viewportName || "mobile";
  await page.locator('button[aria-label="Settings"], button[aria-label="설정"]').first().click();
  await page.locator(".support-pack-card--support").first().scrollIntoViewIfNeeded();
  await capture(page, namePrefix + "settings-billing-store", ".modal-backdrop--settings", {
    settleMs: 320,
    viewportName
  });
  await page.locator(".settings-close").click();
}

async function captureLargeBoard(page) {
  await openFloatingView(page, "puzzle");
  const back = page.locator(".play-screen__back");
  if ((await back.count()) > 0) await back.first().click();
  await page.locator(".pack-block").first().waitFor({ state: "visible", timeout: 6000 });
  const target = page.locator(".puzzle-chip", { hasText: /Bakery Window Glow/ }).first();
  if ((await target.count()) === 0) return;
  await target.click();
  await capture(page, "large-board-cursor-controls", ".play-screen", { fullPage: true, settleMs: 400 });
}

async function captureFloatingNavMenu(page, options = {}) {
  const namePrefix = options.namePrefix || "";
  const viewportName = options.viewportName || "mobile";
  await returnToPuzzleHub(page);
  await page.locator(".floating-nav__trigger").first().waitFor({ state: "visible", timeout: 5000 });
  await page.locator(".floating-nav__trigger").first().click();
  await page.locator(".floating-nav[data-open='true'] .floating-nav__menu").waitFor({ state: "visible", timeout: 3000 });
  await capture(page, namePrefix + "main-menu-time-attack-entry", ".floating-nav", {
    settleMs: 260,
    viewportName
  });
  await page.locator(".floating-nav__trigger").first().click();
}

async function capturePuzzleHubTimeAttackTeaser(page, name = "puzzle-hub-time-attack-teaser", options = {}) {
  const viewportName = options.viewportName || "mobile";
  await returnToPuzzleHub(page);
  if ((await page.locator(".time-attack-teaser-card").count()) === 0) {
    await openFloatingView(page, "puzzle");
  }
  await capture(page, name, ".time-attack-teaser-card", { settleMs: 260, viewportName });
}

async function captureKoreanFirstRun(browser) {
  const page = await browser.newPage({ viewport: reviewViewports.mobile });
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem("pip-picture-pantry-language", "ko");
  });
  try {
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.locator(".brand-intro.game-stage").waitFor({ state: "visible", timeout: 6500 });
    await capture(page, "ko-opening-brand-intro", ".brand-intro.game-stage");
    await dismissIntro(page);
    await page.locator(".app-shell").waitFor({ state: "visible", timeout: 6000 });
    if ((await page.locator(".guide-overlay").count()) > 0) {
      await capture(page, "ko-pip-guide-dialog", ".guide-dialog");
      await dismissGuideIfPresent(page);
    }
    await capture(page, "ko-first-puzzle-board", ".play-screen", { fullPage: true });
    await capturePuzzleHubTimeAttackTeaser(page, "ko-puzzle-hub-time-attack-teaser");
    await captureFloatingNavMenu(page, { namePrefix: "ko-" });
  } finally {
    await page.close();
  }

  const returningPage = await browser.newPage({ viewport: reviewViewports.mobile });
  try {
    await returningPage.goto(baseUrl, { waitUntil: "networkidle" });
    await returningPage.evaluate(() => localStorage.setItem("pip-picture-pantry-language", "ko"));
    await seedReturningPlayer(returningPage);
    await returningPage.reload({ waitUntil: "networkidle" });
    await dismissIntro(returningPage);
    await dismissGuideIfPresent(returningPage);
    await captureSettings(returningPage, { namePrefix: "ko-" });
    await openFloatingView(returningPage, "album");
    await capture(returningPage, "ko-album-progress", ".album-panel", {
      settleMs: 320
    });
    await openFloatingView(returningPage, "pantry");
    await capture(returningPage, "ko-pantry-room-and-shop", ".pantry-panel", {
      fullPage: true,
      settleMs: 400
    });
  } finally {
    await returningPage.close();
  }
}

async function captureWidePreviewReview(browser) {
  const page = await browser.newPage({ viewport: reviewViewports.widePreview });
  const captureWide = (name, selector, options = {}) => capture(page, "wide-" + name, selector, {
    ...options,
    viewportName: "wide-preview"
  });
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem("pip-picture-pantry-language", "ko");
  });
  try {
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.locator(".brand-intro.game-stage").waitFor({ state: "visible", timeout: 6500 });
    await captureWide("opening-brand-intro", ".brand-intro.game-stage");
    await dismissIntro(page);
    await page.locator(".app-shell").waitFor({ state: "visible", timeout: 6000 });
    if ((await page.locator(".guide-overlay").count()) > 0) {
      await captureWide("pip-guide-dialog", ".guide-dialog");
      await dismissGuideIfPresent(page);
    }
    await captureWide("first-puzzle-board", ".play-screen", { fullPage: true });
    await capturePuzzleHubTimeAttackTeaser(page, "wide-puzzle-hub-time-attack-teaser", { viewportName: "wide-preview" });
    await captureFloatingNavMenu(page, { namePrefix: "wide-", viewportName: "wide-preview" });

    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await seedReturningPlayer(page);
    await page.reload({ waitUntil: "networkidle" });
    await dismissIntro(page);
    await dismissGuideIfPresent(page);
    await captureSettings(page, { namePrefix: "wide-", viewportName: "wide-preview" });

    await openFloatingView(page, "pantry");
    await captureWide("pantry-room-and-shop", ".pantry-panel", { fullPage: true });
    await openFloatingView(page, "timeAttack");
    await captureWide("time-attack-coach", ".time-attack-panel", { fullPage: true });
  } finally {
    await page.close();
  }
}

async function main() {
  let server = null;
  if (!requestedUrl) {
    const occupiedStatus = await probe(baseUrl);
    if (occupiedStatus) {
      if (explicitPort) throw new Error("Port " + port + " already responded with status " + occupiedStatus + ". Stop it or choose another PPP_QA_PORT.");
      port = await findAvailablePort(port + 1);
      baseUrl = "http://127.0.0.1:" + port + "/";
      manifest.baseUrl = baseUrl;
    }
    const serverCommand = commandFor("npm run dev -- --port " + port + " --strictPort");
    server = spawn(serverCommand.file, serverCommand.args, { stdio: ["ignore", "pipe", "pipe"], shell: false, windowsHide: true });
    server.stdout.on("data", (chunk) => process.stdout.write(chunk));
    server.stderr.on("data", (chunk) => process.stderr.write(chunk));
    await waitForServer(baseUrl);
  } else {
    await waitForServer(baseUrl);
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: reviewViewports.mobile });
  try {
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.locator(".brand-intro.game-stage").waitFor({ state: "visible", timeout: 6500 });
    await capture(page, "opening-brand-intro", ".brand-intro.game-stage");
    await dismissIntro(page);
    await page.locator(".app-shell").waitFor({ state: "visible", timeout: 6000 });
    if ((await page.locator(".guide-overlay").count()) > 0) {
      await capture(page, "pip-guide-dialog", ".guide-dialog");
      await dismissGuideIfPresent(page);
    }
    await capture(page, "first-puzzle-board", ".play-screen", { fullPage: true });
    await capturePuzzleHubTimeAttackTeaser(page);
    await captureFloatingNavMenu(page);
    await captureKoreanFirstRun(browser);
    await captureWidePreviewReview(browser);

    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await seedReturningPlayer(page);
    await page.reload({ waitUntil: "networkidle" });
    await dismissIntro(page);
    await captureSettings(page);

    await openFloatingView(page, "pantry");
    await capture(page, "pantry-room-and-shop", ".pantry-panel", { fullPage: true });
    await openFloatingView(page, "timeAttack");
    await capture(page, "time-attack-coach", ".time-attack-panel", { fullPage: true });
    await openFloatingView(page, "album");
    await capture(page, "album-progress", ".album-panel");
    await openFloatingView(page, "map");
    await capture(page, "map-badges", ".map-panel", { fullPage: true });
    await captureLargeBoard(page);
    const neighborRequestIds = [
      "sunny-window-curtains",
      "recipe-card-shelf",
      "mint-check-rug",
      "herb-pot",
      "cork-board",
      "tiny-succulent",
      "spoon-wall-clock",
      "berry-tea-tins",
      "ribbon-rolling-pin"
    ];
    await captureIsolatedPantryNeighborReveal(browser, {
      completedStoryGoalIds: neighborRequestIds.slice(0, 2),
      guideId: "pantryNeighborMrPark",
      earlierGuideIds: [],
      captureName: "pantry-neighbor-mr-park"
    });
    await captureIsolatedPantryNeighborReveal(browser, {
      completedStoryGoalIds: neighborRequestIds.slice(0, 5),
      guideId: "pantryNeighborLily",
      earlierGuideIds: ["pantryNeighborMrPark"],
      captureName: "pantry-neighbor-lily"
    });
    await captureIsolatedPantryNeighborReveal(browser, {
      completedStoryGoalIds: neighborRequestIds,
      guideId: "pantryNeighborMateo",
      earlierGuideIds: ["pantryNeighborMrPark", "pantryNeighborLily"],
      captureName: "pantry-neighbor-mateo"
    });
  } finally {
    await page.close();
    await browser.close();
    if (server) {
      if (isWindows && server.pid) spawnSync("taskkill", ["/pid", String(server.pid), "/t", "/f"], { stdio: "ignore" });
      else server.kill();
      await wait(300);
    }
  }

  writeFileSync(resolve(outputRoot, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
  writeContactSheet();
  console.log("Visual review pack wrote " + manifest.screenshots.length + " screenshots to " + shotsDir);
}

main().catch((error) => {
  console.error("Visual review pack failed:");
  console.error(error.stack || error.message);
  process.exit(1);
});
