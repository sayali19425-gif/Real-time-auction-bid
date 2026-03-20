// walletService.js
// frontend/src/walletService.js

import {
  isConnected,
  isAllowed,
  setAllowed,
  getPublicKey,
  requestAccess,
} from "@stellar/freighter-api";

export async function isFreighterInstalled() {
  try {
    const result = await isConnected();
    // Freighter v5+ returns an object { isConnected: bool }
    if (typeof result === "object") return result.isConnected;
    return result;
  } catch {
    return false;
  }
}

export async function connectWallet() {
  const installed = await isFreighterInstalled();
  if (!installed) {
    throw new Error(
      "Freighter wallet is not installed. Please install it from https://freighter.app"
    );
  }

  // FIX: use requestAccess() — this is the correct method in Freighter v5+
  // It both connects the site AND returns the public key in one call
  try {
    const result = await requestAccess();
    // v5 returns object { address } or plain string depending on version
    const publicKey = typeof result === "string" ? result : result.address;
    if (!publicKey) throw new Error("No public key returned");
    return publicKey;
  } catch (err) {
    // fallback to older setAllowed + getPublicKey flow
    try {
      await setAllowed();
      const key = await getPublicKey();
      const publicKeyStr = typeof key === "string" ? key : key.publicKey;
      if (!publicKeyStr) throw new Error("Could not get public key");
      return publicKeyStr;
    } catch {
      throw new Error("Could not connect to Freighter: " + err.message);
    }
  }
}

export async function getConnectedWallet() {
  try {
    const allowed = await isAllowed();
    const isAllowedBool = typeof allowed === "object" ? allowed.isAllowed : allowed;
    if (!isAllowedBool) return null;
    const key = await getPublicKey();
    return typeof key === "string" ? key : key?.publicKey ?? null;
  } catch {
    return null;
  }
}

export function shortenAddress(address) {
  if (!address || address.length < 10) return address;
  return address.slice(0, 6) + "..." + address.slice(-4);
}