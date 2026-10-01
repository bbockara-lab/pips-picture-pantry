import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { RELEASE_BUILD } from "../src/data/releaseBuild.js";

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");

describe("native release build metadata", () => {
  it("keeps the in-app update policy build in sync with Android", () => {
    const gradle = read("../android/app/build.gradle");
    const build = Number(gradle.match(/versionCode\s+(\d+)/)?.[1]);
    const version = gradle.match(/versionName\s+[\"']([^\"']+)[\"']/)?.[1];

    expect({ build, version }).toEqual(RELEASE_BUILD.android);
  });

  it("keeps the in-app update policy build in sync with iOS", () => {
    const project = read("../ios/App/App.xcodeproj/project.pbxproj");
    const builds = [...project.matchAll(/CURRENT_PROJECT_VERSION = (\d+);/g)].map((match) => Number(match[1]));
    const versions = [...project.matchAll(/MARKETING_VERSION = ([^;]+);/g)].map((match) => match[1]);

    expect(new Set(builds)).toEqual(new Set([RELEASE_BUILD.ios.build]));
    expect(new Set(versions)).toEqual(new Set([RELEASE_BUILD.ios.version]));
  });
});
