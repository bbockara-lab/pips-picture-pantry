import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { RELEASE_BUILD } from "../src/data/releaseBuild.js";
import { evaluateUpdatePolicy, resolveUpdateDecision, validateUpdatePolicy } from "../src/game/updatePolicy.js";

const policy = {
  schemaVersion: 1,
  publishedAt: "2026-08-12T00:00:00Z",
  android: { latestBuild: 48, latestVersion: "1.1.20", minimumSupportedBuild: 46, storeUrl: "https://play.google.com/store/apps/details?id=test" },
  ios: { latestBuild: 2, latestVersion: "1.1.20", minimumSupportedBuild: 1, storeUrl: "https://apps.apple.com/app/id1" }
};

function memoryStorage(seed = {}) {
  const values = new Map(Object.entries(seed));
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}

describe("update policy", () => {
  it("ships a valid safe hosted policy matching both native build identities", () => {
    const hosted = validateUpdatePolicy(JSON.parse(fs.readFileSync("store-assets/app-update-policy.json", "utf8")));
    expect(hosted).not.toBeNull();
    expect(hosted.android.latestBuild).toBe(RELEASE_BUILD.android.build);
    expect(hosted.android.latestVersion).toBe(RELEASE_BUILD.android.version);
    expect(hosted.ios.latestBuild).toBe(RELEASE_BUILD.ios.build);
    expect(hosted.ios.latestVersion).toBe(RELEASE_BUILD.ios.version);
    expect(hosted.android.minimumSupportedBuild).toBeLessThan(RELEASE_BUILD.android.build);
    expect(hosted.ios.minimumSupportedBuild).toBeLessThan(RELEASE_BUILD.ios.build);
  });

  it("keeps post-live mandatory and rollback policies ready as separate operator actions", () => {
    const mandatory = validateUpdatePolicy(JSON.parse(fs.readFileSync("store-assets/app-update-policy-mandatory-after-both-live.json", "utf8")));
    const rollback = validateUpdatePolicy(JSON.parse(fs.readFileSync("store-assets/app-update-policy-rollback.json", "utf8")));
    expect(mandatory.android.minimumSupportedBuild).toBe(RELEASE_BUILD.android.build);
    expect(mandatory.ios.minimumSupportedBuild).toBe(RELEASE_BUILD.ios.build);
    expect(rollback.android.minimumSupportedBuild).toBeLessThan(RELEASE_BUILD.android.build);
    expect(rollback.ios.minimumSupportedBuild).toBeLessThan(RELEASE_BUILD.ios.build);
  });

  it("validates a strict HTTPS policy", () => {
    expect(validateUpdatePolicy(policy)?.android.latestBuild).toBe(48);
    expect(validateUpdatePolicy({ ...policy, android: { ...policy.android, storeUrl: "http://example.com" } })).toBeNull();
    expect(validateUpdatePolicy({ ...policy, android: { ...policy.android, minimumSupportedBuild: 99 } })).toBeNull();
  });

  it("distinguishes optional and mandatory updates", () => {
    expect(evaluateUpdatePolicy(policy, "android", 47).kind).toBe("optional");
    expect(evaluateUpdatePolicy(policy, "android", 45).kind).toBe("mandatory");
    expect(evaluateUpdatePolicy(policy, "android", 48).kind).toBe("none");
    expect(evaluateUpdatePolicy(policy, "android", 47, 48).kind).toBe("none");
  });

  it("fails open when the policy request fails without a cache", async () => {
    await expect(resolveUpdateDecision({
      platform: "android",
      storage: memoryStorage(),
      fetchPolicy: async () => { throw new Error("offline"); }
    })).resolves.toEqual({ kind: "none" });
  });

  it("uses a fresh cached mandatory policy but rejects it after 24 hours", async () => {
    const now = 1_800_000_000_000;
    // Keep this cache-behaviour test independent from the currently shipping
    // build. The cached policy must require one build newer than the app under
    // test; otherwise every version bump silently changes the expected result.
    const requiredBuild = RELEASE_BUILD.android.build + 1;
    const cachedPolicy = {
      ...policy,
      android: {
        ...policy.android,
        latestBuild: requiredBuild,
        latestVersion: "test-next-build",
        minimumSupportedBuild: requiredBuild
      }
    };
    const key = "pip-picture-pantry-update-policy-v1";
    const fresh = memoryStorage({ [key]: JSON.stringify({ savedAt: now - 1000, policy: cachedPolicy }) });
    const stale = memoryStorage({ [key]: JSON.stringify({ savedAt: now - (25 * 60 * 60 * 1000), policy: cachedPolicy }) });
    const offline = async () => { throw new Error("offline"); };
    await expect(resolveUpdateDecision({ platform: "android", storage: fresh, now, fetchPolicy: offline })).resolves.toMatchObject({ kind: "mandatory" });
    await expect(resolveUpdateDecision({ platform: "android", storage: stale, now, fetchPolicy: offline })).resolves.toEqual({ kind: "none" });
  });
});
