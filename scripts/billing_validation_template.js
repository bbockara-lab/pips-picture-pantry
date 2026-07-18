import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const releaseStatus = readFileSync(resolve(root, "docs/ANDROID_RELEASE_STATUS.md"), "utf8");
const buildGradle = readFileSync(resolve(root, "android/app/build.gradle"), "utf8");
const appVersionSource = readFileSync(resolve(root, "src/data/appVersion.js"), "utf8");

function match(source, pattern, fallback = "unknown") {
  const found = source.match(pattern);
  return found ? found[1] : fallback;
}

const versionCode = match(buildGradle, /versionCode\s+(\d+)/);
const versionName = match(buildGradle, /versionName\s+["']([^"']+)["']/);
const appVersion = match(appVersionSource, /APP_VERSION\s*=\s*["']([^"']+)["']/);

const supportPassed = /Billing \/ IAP Real-Device Validation[\s\S]*Status:\s*\*\*passed\*\*[\s\S]*pip_cozy_support[\s\S]*purchase[\s\S]*restore/i.test(releaseStatus);
const jarPassed = /Billing \/ IAP Real-Device Validation[\s\S]*Status:\s*\*\*passed\*\*[\s\S]*pip_spoon_jar_small[\s\S]*purchase[\s\S]*(repeat|second|another|again)/i.test(releaseStatus);

if (process.argv.includes("--check")) {
  const missing = [];
  if (!supportPassed) missing.push("pip_cozy_support purchase/restore passed record");
  if (!jarPassed) missing.push("pip_spoon_jar_small purchase/repeat passed record");

  if (missing.length) {
    console.error("Billing real-device evidence is incomplete:");
    for (const item of missing) console.error("- Missing " + item + ".");
    process.exit(1);
  }

  console.log("Billing real-device evidence is complete for both products.");
  process.exit(0);
}

console.log(`## Billing / IAP Real-Device Validation - YYYY-MM-DD

- Status: **pending**
- App build: ${appVersion} / Android versionCode ${versionCode} / versionName ${versionName}
- Track and tester:
- Device and Android version:
- Evidence files or screenshots:
- Product ID: \`pip_cozy_support\`
  - Product active in Play Console for the tester track:
  - Store sheet loads:
  - Purchase grants exactly 250 spoons once:
  - Cancel/close grants no spoons:
  - Already-owned/repeated tap does not duplicate spoons:
  - Restore preserves or brings back support state without duplicate spoons:
- Product ID: \`pip_spoon_jar_small\`
  - Product active in Play Console for the tester track:
  - Store sheet loads:
  - First purchase grants exactly 750 spoons:
  - Repeat purchase with another store token grants another 750 spoons:
  - Replaying the same purchase token does not duplicate spoons:
  - Cancel/close grants no spoons:
- Notes:

When every line above is confirmed on a Play-installed Android build, change
\`Status: **pending**\` to \`Status: **passed**\`. Keep the words purchase,
restore, and repeat in this section so \`npm run qa:release:final\` can verify
the release evidence.`);