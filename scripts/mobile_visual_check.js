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
  await expectVisible(page, ".studio-bumper__mark", viewport.name);
  await page.locator(".brand-intro.game-stage").waitFor({ state: "visible", timeout: 1400 });
  await expectVisible(page, ".brand-intro__seal", viewport.name);
  await page.getByRole("button", { name: /start|시작/i }).click();
  await page.locator(".brand-intro").waitFor({ state: "detached", timeout: 1500 });

  await expectVisible(page, ".app-shell", viewport.name);
  await expectVisible(page, ".how-to-play", viewport.name);
  await expectVisible(page, ".puzzle-grid", viewport.name);
  await expectVisible(page, ".column-clue", viewport.name);
  await expectNoHorizontalOverflow(page, viewport.name);
  await expectTapTargets(page, viewport.name);

  await page.getByRole("button", { name: /album/i }).click();
  await expectVisible(page, ".album-panel", viewport.name);
  await expectVisible(page, ".album-stamp", viewport.name);
  await expectNoHorizontalOverflow(page, viewport.name);

  await page.close();
}

await browser.close();

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Mobile visual QA passed for ${viewports.map((viewport) => viewport.name).join(", ")}.`);

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

async function expectNoHorizontalOverflow(page, viewportName) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 1) {
    failures.push(`[${viewportName}] Horizontal overflow detected: ${overflow}px`);
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