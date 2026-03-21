import { useState, useEffect, useCallback } from "react";
import "./App.css";
import { getAuctionState, placeBid as contractPlaceBid } from "./contractService";
import { connectWallet, getConnectedWallet } from "./walletService";

const short = (addr) => (!addr || addr.length < 10) ? addr : addr.slice(0, 6) + "..." + addr.slice(-4);
const history = [];

function useCountdown(endTime) {
  const calc = () => {
    const ms = endTime - Date.now();
    if (ms <= 0) return { h: "00", m: "00", s: "00" };
    return {
      h: String(Math.floor((ms / 3600000) % 24)).padStart(2, "0"),
      m: String(Math.floor((ms / 60000) % 60)).padStart(2, "0"),
      s: String(Math.floor((ms / 1000) % 60)).padStart(2, "0"),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, []);
  return t;
}

function Page1({ onConnected }) {
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    getConnectedWallet().then((key) => { if (key) onConnected(key); });
  }, []);

  async function handleConnect() {
    const key = address.trim();
    if (key) {
      if (!key.startsWith("G") || key.length < 56)
        return setStatus({ ok: false, msg: "Invalid Address. Must start with G and be 56 characters." });
      setStatus({ ok: true, msg: "✅ Wallet connected successfully!" });
      return setTimeout(() => onConnected(key), 1200);
    }
    try {
      const walletKey = await connectWallet();
      setStatus({ ok: true, msg: "✅ Wallet connected successfully!" });
      setTimeout(() => onConnected(walletKey), 1200);
    } catch (err) {
      setStatus({
        ok: false,
        msg: err.message.includes("not installed")
          ? "Freighter not found. Install it at freighter.app, or paste your G... address above."
          : "❌ " + err.message,
      });
    }
  }

  return (
    <div className="p1">
      <div className="p1-box">
        <div className="p1-logo"></div>
        <h1 className="p1-title">Real Time Auction Bid</h1>
        <p className="p1-sub">Bid on exclusive digital assets on the Stellar blockchain. Transparent, instant, and secure.</p>
        <div className="p1-form">
          <label className="lbl">your stellar wallet address</label>
          <input className="inp" type="text" placeholder="G... your public key (56 characters)"
            value={address} onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConnect()} />
          <button className="btn-blue" onClick={handleConnect}>Connect wallet</button>
          {status && <p className={status.ok ? "ok" : "err"}>{status.msg}</p>}
          <p className="hint">Open Freighter extension → copy your G... address → paste above</p>
        </div>
        <div className="p1-pills">
          <span className="pill">24h Auction</span>
          <span className="pill">XLM Currency</span>
          <span className="pill">Live Bidding</span>
        </div>
      </div>
    </div>
  );
}

function Page2({ wallet, onGoHistory }) {
  const [data, setData] = useState({
    item: "Loading...",
    currentBid: 0,
    topBidder: "no bid yet",
    endTime: Date.now() + 24 * 60 * 60 * 1000,
  });
  const [addr1, setAddr1] = useState(wallet || "");
  const [addr2, setAddr2] = useState("");
  const [bid1, setBid1] = useState("");
  const [bid2, setBid2] = useState("");
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const time = useCountdown(data.endTime);
  const refresh = useCallback(async () => {
  try {
    const s = await getAuctionState();
    console.log("Auction state:", s); // debug
    if (s.itemName) {
      setData({
        item: s.itemName,
        currentBid: s.highestBidXLM,
        topBidder: s.highestBidder ?? "no bid yet",
        endTime: s.endTime * 1000,
      });
    }
  } catch (err) {
    console.error("Refresh error:", err);
  }
}, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, [refresh]);

  async function placeBid(address, amount, label) {
    const val = parseFloat(amount);
    if (!address || address.trim().length < 10)
      return setStatus({ ok: false, msg: `${label}: enter a valid wallet address.` });
    if (!val || isNaN(val))
      return setStatus({ ok: false, msg: `${label}: enter a valid XLM amount.` });
    if (val <= data.currentBid)
      return setStatus({ ok: false, msg: `❌ ${label} failed - ${val} XLM is less than the current bid of ${data.currentBid} XLM.` });

    setBusy(true);
    setStatus(null);

    try {
      // Use the address from the input field directly
      await contractPlaceBid(address, val);
      await refresh();
      history.unshift({ id: Date.now(), address, amount: val, label, time: new Date().toLocaleTimeString() });
      setStatus({ ok: true, msg: `🎉 ${label} — Bid of ${val} XLM placed successfully!` });
    } catch (err) {
      setStatus({ ok: false, msg: `❌ ${label} failed - ${err.message}` });
    } finally {
      setBusy(false);
    }
  }

  const v1 = parseFloat(bid1) || 0;
  const v2 = parseFloat(bid2) || 0;
  const compareMsg = v1 > 0 && v2 > 0
    ? v1 > v2 ? `🏆 Bid 1 is higher — ${v1} XLM`
    : v2 > v1 ? `🏆 Bid 2 is higher — ${v2} XLM`
    : `🤝 Both bids are equal — ${v1} XLM`
    : null;

  return (
    <div className="p2">
      <div className="topbar">
        <span className="topbar-logo">◈ StellarBid</span>
        <div className="topbar-right">
          <span className="tag-blue">Testnet</span>
          <span className="tag-green">● {short(wallet)}</span>
          <button className="btn-outline sm" onClick={onGoHistory}>History →</button>
        </div>
      </div>
      <div className="p2-body">
        <div className="info-card">
          <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800" alt="Diamond Jewelry" className="info-img" />
          <div className="info-content">
            <div className="info-row">
              <div>
                <p className="lbl">Auction Item</p>
                <p className="info-title">{data.item}</p>
              </div>
              <span className="live-tag">🟢 Live</span>
            </div>
            <div className="info-stats">
              <div className="stat-box">
                <p className="lbl">Current Highest Bid</p>
                <p className="stat-big">{data.currentBid} <span>XLM</span></p>
              </div>
              <div className="stat-box">
                <p className="lbl">Top Bidder</p>
                <p className="stat-mono">{short(data.topBidder)}</p>
              </div>
              <div className="stat-box">
                <p className="lbl">Time Left</p>
                <p className="stat-timer">{time.h}:{time.m}:{time.s}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bids-row">
          <div className="bid-box bid-box-blue">
            <div className="bid-box-head"><span className="bid-box-label">BID 1</span></div>
            <div className="bid-box-body">
              <label className="lbl">Wallet Address</label>
              <input className="inp" type="text" placeholder="G... public key" value={addr1} onChange={(e) => setAddr1(e.target.value)} />
              <label className="lbl">Bid Amount (XLM)</label>
              <div className="inp-row">
                <input className="inp" type="number" placeholder={`More than ${data.currentBid}`} value={bid1} onChange={(e) => setBid1(e.target.value)} disabled={busy} />
                <span className="inp-suffix">XLM</span>
              </div>
              <button className="btn-blue" onClick={() => placeBid(addr1, bid1, "Bid 1")} disabled={busy}>
                {busy ? "Placing..." : "Place Bid 1"}
              </button>
            </div>
          </div>

          <div className="vs-badge">VS</div>

          <div className="bid-box bid-box-coral">
            <div className="bid-box-head"><span className="bid-box-label">BID 2</span></div>
            <div className="bid-box-body">
              <label className="lbl">Wallet Address</label>
              <input className="inp" type="text" placeholder="G... public key" value={addr2} onChange={(e) => setAddr2(e.target.value)} />
              <label className="lbl">Bid Amount (XLM)</label>
              <div className="inp-row">
                <input className="inp" type="number" placeholder={`More than ${data.currentBid}`} value={bid2} onChange={(e) => setBid2(e.target.value)} disabled={busy} />
                <span className="inp-suffix">XLM</span>
              </div>
              <button className="btn-coral" onClick={() => placeBid(addr2, bid2, "Bid 2")} disabled={busy}>
                {busy ? "Placing..." : "Place Bid 2"}
              </button>
            </div>
          </div>
        </div>

        {compareMsg && <div className="compare-bar">{compareMsg}</div>}
        {status && <div className={`status-bar ${status.ok ? "status-ok" : "status-err"}`}>{status.msg}</div>}
      </div>
    </div>
  );
}

function Page3({ onBack }) {
  return (
    <div className="p2">
      <div className="topbar">
        <span className="topbar-logo">◈ StellarBid</span>
        <div className="topbar-right">
          <button className="btn-outline sm" onClick={onBack}>← Back</button>
        </div>
      </div>
      <div className="p2-body">
        <h2 style={{ fontWeight: 800, fontSize: "1.2rem" }}>Bid History</h2>
        {history.length === 0 ? (
          <p className="hint" style={{ marginTop: "2rem" }}>No bids placed yet.</p>
        ) : (
          history.map((h) => (
            <div key={h.id} className="info-card" style={{ gridTemplateColumns: "1fr", padding: "1.25rem 1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <p className="lbl">{h.label} · {h.time}</p>
                  <p className="stat-mono" style={{ marginTop: "4px" }}>{h.address}</p>
                </div>
                <p className="stat-big">{h.amount} <span style={{ fontSize: "1rem" }}>XLM</span></p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState(1);
  const [wallet, setWallet] = useState(null);
  return (
    <>
      {page === 1 && <Page1 onConnected={(key) => { setWallet(key); setPage(2); }} />}
      {page === 2 && <Page2 wallet={wallet} onGoHistory={() => setPage(3)} />}
      {page === 3 && <Page3 onBack={() => setPage(2)} />}
    </>
  );
}
