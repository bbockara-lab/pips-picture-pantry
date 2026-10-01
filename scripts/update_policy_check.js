import fs from "node:fs";
import { RELEASE_BUILD } from "../src/data/releaseBuild.js";
import { validateUpdatePolicy } from "../src/game/updatePolicy.js";

const policyPath = process.argv[2] || "store-assets/app-update-policy.json";
const mandatoryPath = "store-assets/app-update-policy-mandatory-after-both-live.json";
const rollbackPath = "store-assets/app-update-policy-rollback.json";

function loadPolicy(path) {
  const policy = validateUpdatePolicy(JSON.parse(fs.readFileSync(path, "utf8")));
  if (!policy) throw new Error(`Invalid update policy: ${path}`);
  return policy;
}

const policy = loadPolicy(policyPath);
const mandatoryPolicy = loadPolicy(mandatoryPath);
const rollbackPolicy = loadPolicy(rollbackPath);

for (const platform of ["android", "ios"]) {
  const release = RELEASE_BUILD[platform];
  const entry = policy[platform];
  if (entry.latestBuild !== release.build || entry.latestVersion !== release.version) {
    throw new Error(`${platform} policy latest ${entry.latestVersion} (${entry.latestBuild}) does not match app ${release.version} (${release.build})`);
  }
  if (!entry.storeUrl.startsWith(platform === "android" ? "https://play.google.com/" : "https://apps.apple.com/")) {
    throw new Error(`${platform} policy uses the wrong store URL`);
  }
  if (entry.minimumSupportedBuild >= release.build) {
    throw new Error(`${platform} pre-release policy must keep the current public build supported`);
  }
  if (mandatoryPolicy[platform].minimumSupportedBuild !== release.build) {
    throw new Error(`${platform} post-release mandatory policy must require build ${release.build}`);
  }
  if (rollbackPolicy[platform].minimumSupportedBuild >= release.build) {
    throw new Error(`${platform} rollback policy must restore the prior public build`);
  }
}

console.log(`Update policies verified: safe submission, post-live mandatory, and rollback`);
