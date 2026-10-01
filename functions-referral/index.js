"use strict";

const { initializeApp } = require("firebase-admin/app");
const { FieldValue, getFirestore } = require("firebase-admin/firestore");
const { onRequest } = require("firebase-functions/v2/https");
const crypto = require("node:crypto");
const logger = require("firebase-functions/logger");

initializeApp();

const REFERRAL_REWARD = 50;

exports.referralApi = onRequest(
  { region: "us-central1", timeoutSeconds: 15, memory: "256MiB", cors: true },
  async (request, response) => {
    if (request.method === "OPTIONS") return response.status(204).send("");
    if (request.method !== "POST") return response.status(405).json({ error: "method-not-allowed" });
    try {
      const body = request.body || {};
      const action = String(body.action || "");
      const deviceId = normalizeDeviceToken(body.deviceId, 32);
      const deviceSecret = normalizeDeviceToken(body.deviceSecret, 64);
      if (!deviceId || !deviceSecret) return response.status(400).json({ error: "invalid-device" });
      const db = getFirestore();
      const deviceRef = db.doc(`referralDevices/${deviceId}`);
      const device = await registerReferralDevice(db, deviceRef, deviceId, deviceSecret);

      if (action === "register") return response.json({ referralCode: device.referralCode });
      if (action === "inbox") return response.json({ messages: normalizeReferralInbox(device.inbox) });
      if (action === "redeem") return response.json(await redeemReferral(db, deviceRef, device, body.referralCode));
      if (action === "claim") {
        return response.json(await claimReferralMessage(
          db,
          deviceRef,
          String(body.messageId || ""),
          String(body.claimNonce || ""),
        ));
      }
      return response.status(400).json({ error: "invalid-action" });
    } catch (error) {
      logger.error("Referral API failed", { detail: error instanceof Error ? error.message : String(error) });
      const status = error?.message === "unauthorized-device" ? 401 : 500;
      return response.status(status).json({ error: status === 401 ? "unauthorized-device" : "referral-service-error" });
    }
  },
);

async function registerReferralDevice(db, deviceRef, deviceId, deviceSecret) {
  const secretHash = hashReferralSecret(deviceSecret);
  const snapshot = await deviceRef.get();
  if (snapshot.exists) {
    const data = snapshot.data();
    if (data.secretHash !== secretHash) throw new Error("unauthorized-device");
    return data;
  }
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const referralCode = createReferralCode();
    const codeRef = db.doc(`referralCodes/${referralCode}`);
    try {
      const created = await db.runTransaction(async (transaction) => {
        const [freshDevice, code] = await Promise.all([transaction.get(deviceRef), transaction.get(codeRef)]);
        if (freshDevice.exists) return freshDevice.data();
        if (code.exists) throw new Error("code-collision");
        const data = { secretHash, referralCode, inbox: [], redeemedReferralCode: null };
        transaction.create(deviceRef, { ...data, createdAt: FieldValue.serverTimestamp() });
        transaction.create(codeRef, { deviceId, createdAt: FieldValue.serverTimestamp() });
        return data;
      });
      if (created) return created;
    } catch (error) {
      if (error?.message !== "code-collision") throw error;
    }
  }
  throw new Error("referral-code-exhausted");
}

async function redeemReferral(db, recipientRef, recipient, rawCode) {
  const referralCode = String(rawCode || "").trim().toUpperCase();
  if (!/^[A-Z2-9]{8}$/.test(referralCode)) return { accepted: false, reason: "invalid-code" };
  if (recipient.redeemedReferralCode) return { accepted: false, reason: "already-redeemed" };
  const codeRef = db.doc(`referralCodes/${referralCode}`);
  return db.runTransaction(async (transaction) => {
    const [freshRecipient, code] = await Promise.all([transaction.get(recipientRef), transaction.get(codeRef)]);
    if (!code.exists) return { accepted: false, reason: "invalid-code" };
    const inviterId = code.data().deviceId;
    if (inviterId === recipientRef.id) return { accepted: false, reason: "self-referral" };
    const recipientData = freshRecipient.data();
    if (recipientData.redeemedReferralCode) return { accepted: false, reason: "already-redeemed" };
    const inviterRef = db.doc(`referralDevices/${inviterId}`);
    const inviterSnapshot = await transaction.get(inviterRef);
    if (!inviterSnapshot.exists) return { accepted: false, reason: "invalid-code" };
    const exchangeId = crypto.createHash("sha256").update(`${recipientRef.id}:${referralCode}`).digest("hex").slice(0, 20);
    const createdAt = new Date().toISOString();
    transaction.update(recipientRef, {
      redeemedReferralCode: referralCode,
      inbox: appendReferralMessage(recipientData.inbox, createReferralMessage(`${exchangeId}-friend`, "friend", createdAt)),
    });
    transaction.update(inviterRef, {
      inbox: appendReferralMessage(inviterSnapshot.data().inbox, createReferralMessage(`${exchangeId}-inviter`, "inviter", createdAt)),
    });
    return { accepted: true };
  });
}

async function claimReferralMessage(db, deviceRef, messageId, claimNonce) {
  if (!/^[a-f0-9]{32}$/.test(claimNonce)) return { claimed: false, reason: "invalid-claim" };
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(deviceRef);
    const inbox = normalizeReferralInbox(snapshot.data().inbox);
    const index = inbox.findIndex((message) => message.id === messageId);
    if (index < 0) return { claimed: false, reason: "not-found" };
    if (inbox[index].claimed) {
      return inbox[index].claimNonce === claimNonce
        ? { claimed: true, replayed: true, spoons: REFERRAL_REWARD }
        : { claimed: false, reason: "already-claimed" };
    }
    inbox[index] = { ...inbox[index], claimed: true, claimNonce, claimedAt: new Date().toISOString() };
    transaction.update(deviceRef, { inbox });
    return { claimed: true, spoons: REFERRAL_REWARD };
  });
}

function createReferralMessage(id, role, createdAt) {
  return { id, role, spoons: REFERRAL_REWARD, claimed: false, createdAt };
}

function appendReferralMessage(inbox, message) {
  const normalized = normalizeReferralInbox(inbox);
  return [...normalized.filter((candidate) => candidate.id !== message.id), message].slice(-100);
}

function normalizeReferralInbox(inbox) {
  return Array.isArray(inbox) ? inbox.filter((message) => message?.id && Number(message?.spoons) > 0).slice(-100) : [];
}

function normalizeDeviceToken(value, length) {
  const token = String(value || "").toLowerCase();
  return new RegExp(`^[a-f0-9]{${length}}$`).test(token) ? token : null;
}

function hashReferralSecret(secret) {
  return crypto.createHash("sha256").update(secret).digest("hex");
}

function createReferralCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(8);
  return Array.from(bytes, (value) => alphabet[value % alphabet.length]).join("");
}
