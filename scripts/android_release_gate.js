import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const finalMode = process.argv.includes("--final");
const errors = [];
const warnings = [];

function readProjectFile(path) {
  return readFileSync(resolve(root, path), "utf8");
}

function matchNumber(source, pattern, label) {
  const match = source.match(pattern);
  if (!match) {
    errors.push("Missing " + label + ".");
    return null;
  }
  return Number(match[1]);
}

function matchString(source, pattern, label) {
  const match = source.match(pattern);
  if (!match) {
    errors.push("Missing " + label + ".");
    return null;
  }
  return match[1];
}

const buildGradle = readProjectFile("android/app/build.gradle");
const packageJson = JSON.parse(readProjectFile("package.json"));
const appVersionSource = readProjectFile("src/data/appVersion.js");
const releaseStatus = readProjectFile("docs/ANDROID_RELEASE_STATUS.md");

const versionCode = matchNumber(buildGradle, /versionCode\s+(\d+)/, "android versionCode");
const versionName = matchString(buildGradle, /versionName\s+["']([^"']+)["']/, "android versionName");
const appVersion = matchString(appVersionSource, /APP_VERSION\s*=\s*["']([^"']+)["']/, "APP_VERSION");
const lastUploadedCode = matchNumber(releaseStatus, /Last Play Console upload: versionCode \*\*(\d+)\*\*/, "last uploaded versionCode note");
const lastUploadedName = matchString(releaseStatus, /versionName \*\*["']([^"']+)["']\*\*/, "last uploaded versionName note");

if (appVersion && packageJson.version && appVersion !== "v" + packageJson.version) {
  errors.push("package.json version (" + packageJson.version + ") and APP_VERSION (" + appVersion + ") are out of sync.");
}

if (versionCode !== null && lastUploadedCode !== null && versionCode <= lastUploadedCode) {
  const message = "android/app/build.gradle versionCode " + versionCode + " is not above last Play upload " + lastUploadedCode + ".";
  if (finalMode) {
    errors.push(message + " Bump it before the release AAB.");
  } else {
    warnings.push(message + " This is acceptable only before the final upload build.");
  }
}

if (versionName && lastUploadedName && versionName === lastUploadedName) {
  const message = "android versionName still matches the last Play upload (" + versionName + ").";
  if (finalMode) {
    errors.push(message + " Choose the public launch label before the release AAB.");
  } else {
    warnings.push(message + " Keep this on the final-upload checklist.");
  }
}

if (!/Public Launch Checklist/.test(releaseStatus)) {
  errors.push("docs/ANDROID_RELEASE_STATUS.md is missing the Public Launch Checklist.");
}

if (!/Mode: live-candidate/.test(releaseStatus)) {
  warnings.push("ANDROID_RELEASE_STATUS.md does not currently say Mode: live-candidate.");
}

if (errors.length) {
  console.error("Android release gate failed:");
  for (const error of errors) {
    console.error("- " + error);
  }
  process.exit(1);
}

for (const warning of warnings) {
  console.warn("Warning: " + warning);
}

console.log("Android release gate passed.");
console.log("Current Android: versionCode " + versionCode + " / versionName " + versionName + ".");
console.log("Current app: package " + packageJson.version + " / UI " + appVersion + ".");
if (!finalMode) {
  console.log("Run npm run qa:release:final before building the signed Play upload AAB.");
}
