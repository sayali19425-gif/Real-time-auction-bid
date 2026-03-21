
import { useState, useEffect, useCallback } from "react";
import { getAuctionState, placeBid } from "../contractService";

export function useAuction() {
  const [auctionData, setAuctionData] = useState({
    highestBid: 0,
    highestBidXLM: 0,
    highestBidder: null,
    endTime: 0,
    itemName: "",
    isActive: false,
  });

  const [loading, setLoading]   = useState(true);   // true on first load
  const [error, setError]       = useState(null);    // fetch error string
  const [bidding, setBidding]   = useState(false);   // true while tx is in-flight
  const [bidError, setBidError] = useState(null);    // bid-specific error
  const [bidSuccess, setBidSuccess] = useState(null); // tx hash on success

  // ── Fetch latest state from the contract ──────────────────────────────────
  const refresh = useCallback(async () => {
    try {
      const data = await getAuctionState();
      setAuctionData(data);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch auction data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Poll every 5 seconds ──────────────────────────────────────────────────
  useEffect(() => {
    refresh(); // immediate first fetch

    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval); // cleanup on unmount
  }, [refresh]);

  // ── Submit a bid ──────────────────────────────────────────────────────────
  /**
   * @param {string} walletAddress - User's Stellar public key (from Freighter)
   * @param {number} amountXLM    - Bid amount in XLM
   */
  const submitBid = useCallback(
    async (walletAddress, amountXLM) => {
      setBidding(true);
      setBidError(null);
      setBidSuccess(null);

      try {
        // Basic validation before hitting the blockchain
        if (!walletAddress) throw new Error("Wallet not connected");
        if (!amountXLM || amountXLM <= 0) throw new Error("Enter a valid bid amount");
        if (amountXLM <= auctionData.highestBidXLM)
          throw new Error(
            `Bid must be higher than current highest: ${auctionData.highestBidXLM} XLM`
          );
        if (!auctionData.isActive) throw new Error("Auction has ended");

        const txHash = await placeBid(walletAddress, amountXLM);
        setBidSuccess(txHash);

        // Immediately refresh to show updated bid
        await refresh();
      } catch (err) {
        setBidError(err.message);
      } finally {
        setBidding(false);
      }
    },
    [auctionData, refresh]
  );

  return {
    auctionData,   // { highestBid, highestBidXLM, highestBidder, endTime, itemName, isActive }
    loading,       // boolean — true on initial load
    error,         // string | null — fetch error
    refresh,       // function — manually trigger a refresh
    submitBid,     // function(walletAddress, amountXLM) — submit a bid
    bidding,       // boolean — true while tx is processing
    bidError,      // string | null — bid submission error
    bidSuccess,    // string | null — tx hash on success
  };
}