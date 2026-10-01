"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  fingerprint,
  formatSnapshot,
  normalizeGoogleRelease,
  stableStringify,
} = require("../monitor-core");

test("stableStringify and fingerprint ignore object key order", () => {
  const left = { b: 2, a: { y: 2, x: 1 } };
  const right = { a: { x: 1, y: 2 }, b: 2 };
  assert.equal(stableStringify(left), stableStringify(right));
  assert.equal(fingerprint(left), fingerprint(right));
});

test("normalizeGoogleRelease uses the 2026 ReleaseSummary schema", () => {
  assert.deepEqual(normalizeGoogleRelease({
    releaseName: "1.2.3",
    track: "production",
    releaseLifecycleState: "RELEASE_LIFECYCLE_STATE_IN_REVIEW",
    activeArtifacts: [{ versionCode: 42 }, { versionCode: 40 }],
  }), {
    name: "1.2.3",
    track: "production",
    status: "RELEASE_LIFECYCLE_STATE_IN_REVIEW",
    versionCodes: ["40", "42"],
  });
});

test("formatSnapshot creates concise Korean Telegram summary", () => {
  const text = formatSnapshot({
    googlePlay: { releases: [{ status: "RELEASE_LIFECYCLE_STATE_IN_REVIEW", versionCodes: ["41"] }] },
    appStore: {
      versions: [{ versionString: "1.1", state: "WAITING_FOR_REVIEW" }],
      purchases: [{ name: "Small Spoon Jar", productId: "jar", state: "APPROVED" }],
    },
  });
  assert.match(text, /Android: 검토 중 \(RELEASE_LIFECYCLE_STATE_IN_REVIEW\) · v41/);
  assert.match(text, /Apple: 1.1 · 검토 대기 \(WAITING_FOR_REVIEW\)/);
  assert.match(text, /Small Spoon Jar: 승인됨 \(APPROVED\)/);
});
