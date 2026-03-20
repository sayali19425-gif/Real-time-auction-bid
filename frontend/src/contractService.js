import * as StellarSdk from "@stellar/stellar-sdk";
import { Server } from "@stellar/stellar-sdk/rpc";

const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID;
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
const RPC_URL = "https://soroban-testnet.stellar.org";
const server = new Server(RPC_URL);

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
  const amountStroops = Math.floor(amountXLM * 10_000_000);
  const account = await server.getAccount(bidderAddress);
  const contract = new StellarSdk.Contract(CONTRACT_ID);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: "1000000",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        "place_bid",
        StellarSdk.nativeToScVal(bidderAddress, { type: "address" }),
        StellarSdk.nativeToScVal(amountStroops, { type: "u64" })
      )
    )
    .setTimeout(30)
    .build();

  const simResult = await server.simulateTransaction(tx);
  if (!simResult.result) throw new Error("Simulation failed");

  const preparedTx = StellarSdk.rpc.assembleTransaction(tx, simResult).build();

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
    throw new Error("Transaction rejected: " + JSON.stringify(submitResult.errorResult));
  }

  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const getResult = await server.getTransaction(submitResult.hash);
    if (getResult.status === "SUCCESS") return submitResult.hash;
    if (getResult.status === "FAILED") throw new Error("Transaction failed on-chain");
  }

  throw new Error("Transaction timed out");
}