import { describe, expect, it } from "vitest";
import { COZY_SUPPORT_PRODUCT_ID, SPOON_JAR_SMALL_PRODUCT_ID, getBillingErrorStatus, getPurchaseKey, isCozySupportEntitlement, isSpoonJarSmallPurchase, syncCozySupportEntitlement } from "../src/game/billing.js";
import { canPurchaseSpoonJar, canPurchaseSupportPack, canRestoreSupportPack, getSpoonJarFacts, getSpoonJarStatus, getSpoonJarStatusTone, getSupportPackFacts, getSupportPackStatus, getSupportStatusTone } from "../src/ui/settingsView.js";

class LocalStorageMock {
  constructor() {
    this.store = new Map();
  }

  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }

  setItem(key, value) {
    this.store.set(key, String(value));
  }

  removeItem(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

describe("billing support pack guards", () => {
  it("recognizes the support product across common store response shapes", () => {
    expect(isCozySupportEntitlement({ productIdentifier: COZY_SUPPORT_PRODUCT_ID })).toBe(true);
    expect(isCozySupportEntitlement({ productId: COZY_SUPPORT_PRODUCT_ID })).toBe(true);
    expect(isCozySupportEntitlement({ productID: COZY_SUPPORT_PRODUCT_ID })).toBe(true);
    expect(isCozySupportEntitlement({ identifier: COZY_SUPPORT_PRODUCT_ID })).toBe(true);
    expect(isCozySupportEntitlement({ products: [COZY_SUPPORT_PRODUCT_ID] })).toBe(true);
    expect(isCozySupportEntitlement({ products: [{ productIdentifier: COZY_SUPPORT_PRODUCT_ID }] })).toBe(true);
    expect(isCozySupportEntitlement({ products: [{ productId: COZY_SUPPORT_PRODUCT_ID }] })).toBe(true);
    expect(isCozySupportEntitlement({ transaction: { productIdentifier: COZY_SUPPORT_PRODUCT_ID } })).toBe(true);
    expect(isCozySupportEntitlement({ purchase: { productId: COZY_SUPPORT_PRODUCT_ID } })).toBe(true);
    expect(isCozySupportEntitlement({ purchases: [{ productIdentifier: "other" }, { productIdentifier: COZY_SUPPORT_PRODUCT_ID }] })).toBe(true);
    expect(isCozySupportEntitlement({ result: { productIdentifier: COZY_SUPPORT_PRODUCT_ID } })).toBe(true);
  });

  it("rejects unrelated or empty purchase payloads", () => {
    expect(isCozySupportEntitlement(null)).toBe(false);
    expect(isCozySupportEntitlement({})).toBe(false);
    expect(isCozySupportEntitlement({ productIdentifier: "other-product" })).toBe(false);
    expect(isCozySupportEntitlement([{ productIdentifier: "other-product" }])).toBe(false);
    expect(isCozySupportEntitlement({ products: [{ productIdentifier: "other-product" }] })).toBe(false);
  });

  it("maps billing failures to player-safe statuses", () => {
    expect(getBillingErrorStatus(new Error("User canceled the purchase"))).toBe("cancelled");
    expect(getBillingErrorStatus(new Error("Item already owned"))).toBe("already-owned");
    expect(getBillingErrorStatus(new Error("ITEM_ALREADY_OWNED"))).toBe("already-owned");
    expect(getBillingErrorStatus(new Error("Network unavailable"))).toBe("network-error");
    expect(getBillingErrorStatus(new Error("Something else"))).toBe("failed");
  });

  it("keeps failed store requests out of the ready status copy", () => {
    const baseSupportPack = {
      available: true,
      owned: false,
      loading: false,
      priceString: "$0.99",
      spoons: 250
    };

    expect(getSupportPackStatus({ ...baseSupportPack, status: "network-error" })).toContain("network");
    expect(getSupportPackStatus({ ...baseSupportPack, status: "already-owned" })).toContain("Google Play");
    expect(getSupportPackStatus({ ...baseSupportPack, status: "already-owned" })).toContain("Restore");
    expect(getSupportPackStatus({ ...baseSupportPack, status: "failed" })).toContain("could not finish");
    expect(getSupportPackStatus({ ...baseSupportPack, status: "wrong-product" })).toContain("could not finish");
  });

  it("separates support pack status tones for player feedback", () => {
    const baseSupportPack = {
      available: true,
      owned: false,
      loading: false,
      priceString: "$0.99",
      spoons: 250
    };

    expect(getSupportStatusTone({ ...baseSupportPack, loading: true })).toBe("checking");
    expect(getSupportStatusTone({ ...baseSupportPack, owned: true })).toBe("success");
    expect(getSupportStatusTone({ ...baseSupportPack, status: "purchased" })).toBe("success");
    expect(getSupportStatusTone({ ...baseSupportPack, status: "restored" })).toBe("success");
    expect(getSupportStatusTone({ ...baseSupportPack, status: "network-error" })).toBe("warning");
    expect(getSupportStatusTone({ ...baseSupportPack, status: "already-owned" })).toBe("warning");
    expect(getSupportStatusTone({ ...baseSupportPack, status: "failed" })).toBe("warning");
    expect(getSupportStatusTone({ ...baseSupportPack, status: "wrong-product" })).toBe("warning");
    expect(getSupportStatusTone({ ...baseSupportPack, status: "cancelled" })).toBe("warning");
    expect(getSupportStatusTone({ ...baseSupportPack, available: false })).toBe("warning");
  });

  it("summarizes support pack value and restore safety as quick facts", () => {
    const baseSupportPack = {
      available: true,
      owned: false,
      loading: false,
      priceString: "$0.99",
      spoons: 250
    };

    expect(getSupportPackFacts(baseSupportPack)).toEqual(["250 spoons", "Google Play", "Restore-ready"]);
    expect(getSupportPackFacts({ ...baseSupportPack, available: false })).toEqual(["250 spoons", "Android test build", "Restore-ready"]);
  });

  it("short-circuits startup entitlement sync when local support ownership already exists", async () => {
    globalThis.localStorage = new LocalStorageMock();
    localStorage.setItem("pips-picture-pantry:v0.1:save", JSON.stringify({ cozyPassPurchased: true }));

    await expect(syncCozySupportEntitlement()).resolves.toEqual({
      ok: true,
      status: "already-owned",
      grant: null
    });
  });

  it("keeps restore available when catalog lookup fails but a restore may recover ownership", () => {
    const baseSupportPack = {
      available: false,
      owned: false,
      loading: false,
      priceString: "$0.99",
      spoons: 250
    };

    expect(canPurchaseSupportPack({ ...baseSupportPack, available: true })).toBe(true);
    expect(canPurchaseSupportPack({ ...baseSupportPack, status: "product-unavailable" })).toBe(false);
    expect(canRestoreSupportPack({ ...baseSupportPack, status: "product-unavailable" })).toBe(true);
    expect(canRestoreSupportPack({ ...baseSupportPack, status: "already-owned" })).toBe(true);
    expect(canRestoreSupportPack({ ...baseSupportPack, status: "native-store-required" })).toBe(false);
    expect(canRestoreSupportPack({ ...baseSupportPack, owned: true, status: "already-owned" })).toBe(false);
  });

  it("recognizes spoon jar purchases and extracts a duplicate-safe purchase key", () => {
    const payload = {
      result: {
        productIdentifier: SPOON_JAR_SMALL_PRODUCT_ID,
        purchaseToken: "token-123"
      }
    };

    expect(isSpoonJarSmallPurchase(payload)).toBe(true);
    expect(isSpoonJarSmallPurchase({ products: [{ productId: SPOON_JAR_SMALL_PRODUCT_ID }] })).toBe(true);
    expect(isSpoonJarSmallPurchase({ productIdentifier: COZY_SUPPORT_PRODUCT_ID })).toBe(false);
    expect(getPurchaseKey(payload)).toBe(SPOON_JAR_SMALL_PRODUCT_ID + ":token-123");
    expect(getPurchaseKey({ productIdentifier: SPOON_JAR_SMALL_PRODUCT_ID })).toBe("");
  });

  it("keeps spoon jar copy and controls distinct from support restore", () => {
    const baseSpoonJar = {
      available: true,
      loading: false,
      priceString: "$2.99",
      spoons: 750,
      status: "ready"
    };

    expect(getSpoonJarFacts(baseSpoonJar)).toEqual(["750 spoons", "Google Play", "Repeatable top-up"]);
    expect(getSpoonJarStatus({ ...baseSpoonJar, status: "purchased" })).toContain("Spoons arrive");
    expect(getSpoonJarStatus({ ...baseSpoonJar, status: "missing-purchase-key" })).toContain("jar could not be filled");
    expect(getSpoonJarStatusTone({ ...baseSpoonJar, loading: true })).toBe("checking");
    expect(getSpoonJarStatusTone({ ...baseSpoonJar, status: "purchased" })).toBe("success");
    expect(getSpoonJarStatusTone({ ...baseSpoonJar, available: false })).toBe("warning");
    expect(canPurchaseSpoonJar(baseSpoonJar)).toBe(true);
    expect(canPurchaseSpoonJar({ ...baseSpoonJar, loading: true })).toBe(false);
    expect(canPurchaseSpoonJar({ ...baseSpoonJar, available: false })).toBe(false);
  });
});
