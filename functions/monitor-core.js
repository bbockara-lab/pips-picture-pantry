"use strict";

const crypto = require("node:crypto");

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function fingerprint(value) {
  return crypto.createHash("sha256").update(stableStringify(value)).digest("hex");
}

function base64Url(value) {
  return Buffer.from(value).toString("base64url");
}

function createAppleJwt({ issuerId, keyId, privateKey, nowSeconds = Math.floor(Date.now() / 1000) }) {
  const header = base64Url(JSON.stringify({ alg: "ES256", kid: keyId, typ: "JWT" }));
  const payload = base64Url(JSON.stringify({
    iss: issuerId,
    iat: nowSeconds,
    exp: nowSeconds + (18 * 60),
    aud: "appstoreconnect-v1",
  }));
  const signingInput = `${header}.${payload}`;
  const signature = crypto.sign("sha256", Buffer.from(signingInput), {
    key: privateKey.replace(/\\n/g, "\n"),
    dsaEncoding: "ieee-p1363",
  });
  return `${signingInput}.${signature.toString("base64url")}`;
}

function normalizeGoogleRelease(release) {
  return {
    name: release.releaseName || "",
    track: release.track || "production",
    status: release.releaseLifecycleState || "RELEASE_LIFECYCLE_STATE_UNSPECIFIED",
    versionCodes: [...(release.activeArtifacts || [])]
      .map((artifact) => String(artifact.versionCode))
      .sort((a, b) => Number(a) - Number(b)),
  };
}

function normalizeAppleVersion(version) {
  return {
    id: version.id,
    versionString: version.attributes?.versionString || "",
    state: version.attributes?.appStoreState || "UNKNOWN",
    createdDate: version.attributes?.createdDate || "",
  };
}

function normalizeApplePurchase(purchase) {
  return {
    id: purchase.id,
    name: purchase.attributes?.name || "",
    productId: purchase.attributes?.productId || "",
    type: purchase.attributes?.inAppPurchaseType || "",
    state: purchase.attributes?.state || "UNKNOWN",
  };
}

const STATUS_LABELS = {
  RELEASE_LIFECYCLE_STATE_DRAFT: "초안",
  RELEASE_LIFECYCLE_STATE_NOT_SENT_FOR_REVIEW: "검토 제출 필요",
  RELEASE_LIFECYCLE_STATE_IN_REVIEW: "검토 중",
  RELEASE_LIFECYCLE_STATE_APPROVED_NOT_PUBLISHED: "승인됨·게시 대기",
  RELEASE_LIFECYCLE_STATE_NOT_APPROVED: "승인되지 않음",
  RELEASE_LIFECYCLE_STATE_PUBLISHED: "출시됨",
  WAITING_FOR_REVIEW: "검토 대기",
  IN_REVIEW: "검토 중",
  PENDING_DEVELOPER_RELEASE: "개발자 출시 대기",
  PENDING_APPLE_RELEASE: "Apple 출시 대기",
  READY_FOR_SALE: "출시됨",
  READY_FOR_DISTRIBUTION: "배포 준비 완료",
  REJECTED: "거절됨",
  METADATA_REJECTED: "메타데이터 거절",
  DEVELOPER_ACTION_NEEDED: "개발자 조치 필요",
  PENDING_BINARY_APPROVAL: "앱 빌드 승인 대기",
  APPROVED: "승인됨",
  READY_TO_SUBMIT: "제출 준비 완료",
};

function formatState(state) {
  return STATUS_LABELS[state] ? `${STATUS_LABELS[state]} (${state})` : state;
}

function formatSnapshot(snapshot) {
  const google = snapshot.googlePlay?.releases?.length
    ? snapshot.googlePlay.releases.map((release) => `${formatState(release.status)} · v${release.versionCodes.join(",") || "-"}`).join(" / ")
    : "조회 결과 없음";
  const apple = snapshot.appStore?.versions?.length
    ? snapshot.appStore.versions.map((version) => `${version.versionString || "-"} · ${formatState(version.state)}`).join(" / ")
    : "조회 결과 없음";
  const purchases = snapshot.appStore?.purchases || [];
  const purchaseSummary = purchases.length
    ? purchases.map((purchase) => `${purchase.name || purchase.productId}: ${formatState(purchase.state)}`).join(" / ")
    : "없음";

  return [
    "🥄 Sunny Spoon 스토어 상태",
    `Android: ${google}`,
    `Apple: ${apple}`,
    `Apple IAP: ${purchaseSummary}`,
  ].join("\n");
}

module.exports = {
  createAppleJwt,
  fingerprint,
  formatState,
  formatSnapshot,
  normalizeApplePurchase,
  normalizeAppleVersion,
  normalizeGoogleRelease,
  stableStringify,
};
