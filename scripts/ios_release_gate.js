import fs from "node:fs";
import { RELEASE_BUILD } from "../src/data/releaseBuild.js";

const projectPath = new URL("../ios/App/App.xcodeproj/project.pbxproj", import.meta.url);
const project = fs.readFileSync(projectPath, "utf8");
const builds = [...project.matchAll(/CURRENT_PROJECT_VERSION = (\d+);/g)].map((match) => Number(match[1]));
const versions = [...project.matchAll(/MARKETING_VERSION = ([^;]+);/g)].map((match) => match[1].trim());

function unique(values) {
  return [...new Set(values)];
}

const actualBuilds = unique(builds);
const actualVersions = unique(versions);
const expected = RELEASE_BUILD.ios;

if (actualBuilds.length !== 1 || actualBuilds[0] !== expected.build) {
  throw new Error(`iOS build mismatch: project=${actualBuilds.join(",") || "missing"}, releaseBuild=${expected.build}`);
}
if (actualVersions.length !== 1 || actualVersions[0] !== expected.version) {
  throw new Error(`iOS version mismatch: project=${actualVersions.join(",") || "missing"}, releaseBuild=${expected.version}`);
}

console.log(`iOS release gate passed: build ${expected.build} / version ${expected.version}.`);
