import { describe, expect, it } from "vitest";
import { COZY_SUPPORT_PRODUCT_ID, SPOON_JAR_SMALL_PRODUCT_ID, getBillingErrorStatus, getPurchaseKey, isCozySupportEntitlement, isSpoonJarSmallPurchase, restorePendingPurchaseRecords } from "../src/game/billing.js";
import { canPurchaseSpoonJar, canPurchaseSupportPack, getSpoonJarFacts, getSpoonJarStatus, getSpoonJarStatusTone, getSupportPackFacts, getSupportPackStatus, getSupportStatusTone } from "../src/ui/settingsView.js";

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
      spoons: 150
    };

    expect(getSupportPackStatus({ ...baseSupportPack, status: "network-error" })).toContain("network");
    expect(getSupportPackStatus({ ...baseSupportPack, status: "already-owned" })).toContain("Google Play");
    expect(getSupportPackStatus({ ...baseSupportPack, status: "already-owned" })).toContain("finishing");
    expect(getSupportPackStatus({ ...baseSupportPack, status: "failed" })).toContain("could not finish");
    expect(getSupportPackStatus({ ...baseSupportPack, status: "wrong-product" })).toContain("could not finish");
  });

  it("separates support pack status tones for player feedback", () => {
    const baseSupportPack = {
      available: true,
      owned: false,
      loading: false,
      priceString: "$0.99",
      spoons: 150
    };

    expect(getSupportStatusTone({ ...baseSupportPack, loading: true })).toBe("checking");
    expect(getSupportStatusTone({ ...baseSupportPack, status: "already-processed" })).toBe("success");
    expect(getSupportStatusTone({ ...baseSupportPack, status: "purchased" })).toBe("success");
    expect(getSupportStatusTone({ ...baseSupportPack, status: "network-error" })).toBe("warning");
    expect(getSupportStatusTone({ ...baseSupportPack, status: "failed" })).toBe("warning");
    expect(getSupportStatusTone({ ...baseSupportPack, status: "wrong-product" })).toBe("warning");
    expect(getSupportStatusTone({ ...baseSupportPack, status: "cancelled" })).toBe("warning");
    expect(getSupportStatusTone({ ...baseSupportPack, available: false })).toBe("warning");
  });

  it("keeps repeatable support available after a completed purchase", () => {
    const baseSupportPack = {
      available: true,
      loading: false,
      priceString: "$0.99",
      spoons: 150,
      status: "ready"
    };

    expect(getSupportPackFacts(baseSupportPack)).toEqual(["150 spoons", "Google Play", "Repeatable support"]);
    expect(getSupportPackFacts({ ...baseSupportPack, available: false })).toEqual(["150 spoons", "Store preparing", "Repeatable support"]);
    expect(canPurchaseSupportPack(baseSupportPack)).toBe(true);
    expect(canPurchaseSupportPack({ ...baseSupportPack, status: "already-processed" })).toBe(true);
    expect(canPurchaseSupportPack({ ...baseSupportPack, loading: true })).toBe(false);
    expect(canPurchaseSupportPack({ ...baseSupportPack, available: false })).toBe(false);
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
    expect(getPurchaseKey({ productIdentifier: COZY_SUPPORT_PRODUCT_ID, purchaseToken: "support-token" }, COZY_SUPPORT_PRODUCT_ID)).toBe(COZY_SUPPORT_PRODUCT_ID + ":support-token");
    expect(getPurchaseKey({ productIdentifier: SPOON_JAR_SMALL_PRODUCT_ID })).toBe("");
  });

  it("keeps spoon jar copy and controls distinct from support restore", () => {
    const baseSpoonJar = {
      available: true,
      loading: false,
      priceString: "$2.99",
      spoons: 500,
      status: "ready"
    };

    expect(getSpoonJarFacts(baseSpoonJar)).toEqual(["500 spoons", "Google Play", "Repeatable top-up"]);
    expect(getSpoonJarStatus({ ...baseSpoonJar, status: "purchased" })).toContain("Spoons arrive");
    expect(getSpoonJarStatus({ ...baseSpoonJar, status: "missing-purchase-key" })).toContain("jar could not be filled");
    expect(getSpoonJarStatusTone({ ...baseSpoonJar, loading: true })).toBe("checking");
    expect(getSpoonJarStatusTone({ ...baseSpoonJar, status: "purchased" })).toBe("success");
    expect(getSpoonJarStatusTone({ ...baseSpoonJar, available: false })).toBe("warning");
    expect(canPurchaseSpoonJar(baseSpoonJar)).toBe(true);
    expect(canPurchaseSpoonJar({ ...baseSpoonJar, loading: true })).toBe(false);
    expect(canPurchaseSpoonJar({ ...baseSpoonJar, available: false })).toBe(false);
  });

  it("restores and consumes unfinished repeatable purchases without duplicate grants", async () => {
    globalThis.localStorage = new LocalStorageMock();
    const consumedTokens = [];
    const purchases = [
      { productIdentifier: COZY_SUPPORT_PRODUCT_ID, purchaseToken: "support-pending", purchaseState: "1" },
      { productIdentifier: SPOON_JAR_SMALL_PRODUCT_ID, purchaseToken: "jar-pending", purchaseState: "1" },
      { productIdentifier: COZY_SUPPORT_PRODUCT_ID, purchaseToken: "still-pending", purchaseState: "0" },
      { productIdentifier: "unrelated-product", purchaseToken: "other", purchaseState: "1" }
    ];

    const first = await restorePendingPurchaseRecords(purchases, {
      consumePurchase: async (purchaseToken) => consumedTokens.push(purchaseToken)
    });
    const second = await restorePendingPurchaseRecords(purchases, {
      consumePurchase: async (purchaseToken) => consumedTokens.push(purchaseToken)
    });

    expect(first).toEqual({
      restored: [COZY_SUPPORT_PRODUCT_ID, SPOON_JAR_SMALL_PRODUCT_ID],
      consumed: [COZY_SUPPORT_PRODUCT_ID, SPOON_JAR_SMALL_PRODUCT_ID],
      failed: []
    });
    expect(second.restored).toEqual([COZY_SUPPORT_PRODUCT_ID, SPOON_JAR_SMALL_PRODUCT_ID]);
    expect(consumedTokens).toEqual(["support-pending", "jar-pending", "support-pending", "jar-pending"]);
  });
});
