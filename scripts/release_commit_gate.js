import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = path.resolve(import.meta.dirname, "..");

function git(args) {
  return execFileSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function fail(message, details = []) {
  console.error(`Release commit gate failed: ${message}`);
  for (const detail of details) {
    console.error(`  ${detail}`);
  }
  process.exit(1);
}

function readHeadFile(filePath) {
  try {
    return git(["show", `HEAD:${filePath.replaceAll("\\", "/")}`]);
  } catch {
    fail(`required release file is not committed at HEAD: ${filePath}`);
  }
}

let head;
try {
  head = git(["rev-parse", "HEAD"]);
} catch {
  fail("this workspace is not on a valid Git commit");
}

const dirtyLines = execFileSync(
  "git",
  ["status", "--porcelain=v1", "--untracked-files=all"],
  { cwd: repoRoot, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
)
  .split(/\r?\n/)
  .filter(Boolean);
const releaseIgnoredPaths = new Set([
  ".claude/",
  "docs/CLAUDE_REVIEW_LOG.md",
  "docs/CODEX_BRIEF.md",
  "icon_pip_cozy_support.png",
  "icon_pip_spoon_jar_small.png",
  "scripts/__pycache__/",
]);
const blockingDirtyLines = dirtyLines.filter((line) => {
  const filePath = line.slice(3).replaceAll("\\", "/");
  return ![...releaseIgnoredPaths].some((ignoredPath) =>
    ignoredPath.endsWith("/") ? filePath.startsWith(ignoredPath) : filePath === ignoredPath
  );
});
if (blockingDirtyLines.length > 0) {
  fail(
    "release-critical files are not clean. Commit every intended release file before building an AAB.",
    blockingDirtyLines,
  );
}

const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
const packageVersion = String(packageJson.version || "").trim();
if (!/^\d+\.\d+\.\d+$/.test(packageVersion)) {
  fail(`package.json has an invalid release version: ${packageVersion || "(empty)"}`);
}

const visibleVersionSource = fs.readFileSync(
  path.join(repoRoot, "src", "data", "appVersion.js"),
  "utf8",
);
const visibleVersion = visibleVersionSource.match(/APP_VERSION\s*=\s*"v([^"]+)"/)?.[1];
if (visibleVersion !== packageVersion) {
  fail(`visible version v${visibleVersion || "(missing)"} does not match package version ${packageVersion}`);
}

const headPackageVersion = JSON.parse(readHeadFile("package.json")).version;
const headVisibleVersion = readHeadFile("src/data/appVersion.js")
  .match(/APP_VERSION\s*=\s*"v([^"]+)"/)?.[1];
if (headPackageVersion !== packageVersion || headVisibleVersion !== packageVersion) {
  fail(
    `release version ${packageVersion} is not fully committed at HEAD`,
    [
      `HEAD package version: ${headPackageVersion || "(missing)"}`,
      `HEAD visible version: v${headVisibleVersion || "(missing)"}`,
    ],
  );
}

const contextAtHead = readHeadFile("docs/CONTEXT.md");
if (!contextAtHead.includes(`## v${packageVersion}`)) {
  fail(`docs/CONTEXT.md at HEAD does not contain a v${packageVersion} release entry`);
}

const commitSubject = git(["log", "-1", "--format=%s"]);
if (!commitSubject.includes(`v${packageVersion}`)) {
  fail(
    `HEAD commit subject does not identify v${packageVersion}`,
    [`HEAD ${head.slice(0, 12)}: ${commitSubject}`],
  );
}

const androidGradleAtHead = readHeadFile("android/app/build.gradle");
const versionCode = androidGradleAtHead.match(/versionCode\s+(\d+)/)?.[1];
const versionName = androidGradleAtHead.match(/versionName\s+"([^"]+)"/)?.[1];
if (!versionCode || !versionName) {
  fail("Android versionCode/versionName is missing from the committed build.gradle");
}

console.log("Release commit gate passed.");
console.log(`HEAD: ${head}`);
console.log(`App: v${packageVersion}`);
console.log(`Android: versionCode ${versionCode} / versionName ${versionName}`);
