import { describe, expect, it } from "vitest";
import { COZY_SUPPORT_PRODUCT_ID, getBillingErrorStatus, isCozySupportEntitlement } from "../src/game/billing.js";
import { getSupportPackStatus, getSupportStatusTone } from "../src/ui/settingsView.js";

describe("billing support pack guards", () => {
  it("recognizes the support product across common store response shapes", () => {
    expect(isCozySupportEntitlement({ productIdentifier: COZY_SUPPORT_PRODUCT_ID })).toBe(true);
    expect(isCozySupportEntitlement({ productId: COZY_SUPPORT_PRODUCT_ID })).toBe(true);
    expect(isCozySupportEntitlement({ productID: COZY_SUPPORT_PRODUCT_ID })).toBe(true);
    expect(isCozySupportEntitlement({ identifier: COZY_SUPPORT_PRODUCT_ID })).toBe(true);
    expect(isCozySupportEntitlement({ products: [COZY_SUPPORT_PRODUCT_ID] })).toBe(true);
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
});
