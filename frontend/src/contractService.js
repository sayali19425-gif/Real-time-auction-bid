import * as StellarSdk from "@stellar/stellar-sdk";
import { Server } from "@stellar/stellar-sdk/rpc";

const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID;
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
const RPC_URL = "https://soroban-testnet.stellar.org";
const server = new Server(RPC_URL);

// ─── get connected Freighter wallet address ───────────────────────────────────
async function getFreighterAddress() {
  const freighter = await import("@stellar/freighter-api");
  // Freighter v5+ uses requestAccess() to get address
  try {
    const result = await freighter.requestAccess();
    return typeof result === "string" ? result : result.address;
  } catch {
    // fallback for older versions
    const key = await freighter.getPublicKey();
    return typeof key === "string" ? key : key.publicKey;
  }
}

// ─── read-only simulation ─────────────────────────────────────────────────────
async function simulateContractCall(functionName, args = []) {
  const account = await server.getAccount(
    "GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN"
  );
  const contract = new StellarSdk.Contract(CONTRACT_ID);
  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(functionName, ...args))
    .setTimeout(30)
    .build();
  const simResult = await server.simulateTransaction(tx);
  if (!simResult.result) throw new Error(`No result for ${functionName}`);
  return simResult.result.retval;
}

// ─── READ FUNCTIONS ───────────────────────────────────────────────────────────
export async function getHighestBid() {
  try {
    const r = await simulateContractCall("get_highest_bid");
    return Number(StellarSdk.scValToNative(r));
  } catch { return 0; }
}

export async function getHighestBidder() {
  try {
    const r = await simulateContractCall("get_highest_bidder");
    return StellarSdk.scValToNative(r) ?? null;
  } catch { return null; }
}

export async function getAuctionEndTime() {
  try {
    const r = await simulateContractCall("get_end_time");
    return Number(StellarSdk.scValToNative(r));
  } catch { return 0; }
}

export async function getItemName() {
  try {
    const r = await simulateContractCall("get_item_name");
    return StellarSdk.scValToNative(r);
  } catch { return "Stellar Genesis NFT #001"; }
}

export async function isAuctionActive() {
  try {
    const r = await simulateContractCall("is_active");
    return StellarSdk.scValToNative(r);
  } catch { return false; }
}

export async function getAuctionState() {
  const [highestBid, highestBidder, endTime, itemName, active] = await Promise.all([
    getHighestBid(),
    getHighestBidder(),
    getAuctionEndTime(),
    getItemName(),
    isAuctionActive(),
  ]);
  return {
    highestBid,
    highestBidXLM: highestBid / 10_000_000,
    highestBidder,
    endTime,
    itemName,
    isActive: active,
  };
}


export async function placeBid(bidderAddress, amountXLM) {
  const amountStroops = BigInt(Math.floor(amountXLM * 10_000_000));

  // Always use connected Freighter wallet as the transaction fee payer
  const signerAddress = await getFreighterAddress();

  // Load the SIGNER's account (not the bidder's) for the transaction
  const account = await server.getAccount(signerAddress);
  const contract = new StellarSdk.Contract(CONTRACT_ID);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: "1000000",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        "place_bid",
        // bidder can be any address — contract no longer requires their auth
        StellarSdk.nativeToScVal(bidderAddress, { type: "address" }),
        StellarSdk.nativeToScVal(amountStroops, { type: "u64" })
      )
    )
    .setTimeout(30)
    .build();

  const simResult = await server.simulateTransaction(tx);

  if (StellarSdk.rpc.Api.isSimulationError(simResult)) {
    throw new Error("Contract rejected bid: " + simResult.error);
  }

  if (!simResult.result) {
    throw new Error("Simulation returned no result");
  }

  const preparedTx = StellarSdk.rpc.assembleTransaction(tx, simResult).build();

  // Sign with Freighter (signer's wallet)
  const { signTransaction } = await import("@stellar/freighter-api");
  const result = await signTransaction(preparedTx.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
    network: "TESTNET",
  });

  const signedXdr = typeof result === "string" ? result : result.signedTxXdr;
  if (!signedXdr) throw new Error("Freighter did not return signed transaction");

  const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
  const submitResult = await server.sendTransaction(signedTx);

  if (submitResult.status === "ERROR") {
    throw new Error("Network rejected transaction: " + JSON.stringify(submitResult.errorResult));
  }

  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const getResult = await server.getTransaction(submitResult.hash);
    if (getResult.status === "SUCCESS") return submitResult.hash;
    if (getResult.status === "FAILED") throw new Error("Transaction failed on-chain");
  }

  throw new Error("Transaction timed out");
}