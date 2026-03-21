# 🔨 Real-Time Auction Bid dApp

> A decentralized auction interface built with **React (Vite)** + **Rust/Soroban** smart contract on the Stellar blockchain.

## 📌 Overview

This project simulates a **real-time decentralized auction** where users can connect their Stellar wallet, place competing bids, and watch the highest bid update live. It demonstrates how a modern React frontend can interact with blockchain-style smart contract logic.

**Key highlights:**
- 🔐 Stellar wallet connection via public key
- ⏱️ Live countdown timer with a custom React hook
- ⚔️ Dual bidder panels with real-time bid comparison
- 📜 Full bid history tracking
- 📱 Responsive layout using CSS Grid

---

## 🚀 Live Demo link

https://real-time-auction-bid.vercel.app/

---

## 🚀 Demo Video link

🎬 **[Watch Demo Video](https://drive.google.com/file/d/1hJ3acMp2tpHzfvMNa1bsOy3nR1pjNUvq/view?usp=sharing)**

---

## 🖼️ Screenshots

### Wallet Connection
<img width="1893" height="843" alt="wallet-connected png" src="https://github.com/user-attachments/assets/bac74e94-a7d1-4f3b-9bb6-7960b916b82a" />

### Auction Page
<img width="1880" height="856" alt="Screenshot 2026-03-21 105233" src="https://github.com/user-attachments/assets/5e3462b5-e242-4ae5-8796-e9f8dd5f54a8" />

### Bid History
<img width="1908" height="860" alt="Screenshot 2026-03-21 105246" src="https://github.com/user-attachments/assets/8bdbaf79-2d58-444b-a45b-5c981f439faa" />

---

## 🚀 Smart Contract Deployment

- **Network:** Stellar Testnet  
- - **Contract ID:** CA72GKIPJOLFOBLQW7VBHMHCIBNVHF5GEH3CATAH5OCPSK2W3HI7ZMJ4

### 🔗 View on Explorer  
[Open Contract on Stellar Explorer]
(https://stellar.expert/explorer/testnet/contract/CA72GKIPJOLFOBLQW7VBHMHCIBNVHF5GEH3CATAH5OCPSK2W3HI7ZMJ4)

### 📸 Deployment Proof:
![Contract Deployment]<img width="1919" height="875" alt="contract-deployment png" src="https://github.com/user-attachments/assets/a0d11fad-6851-4d92-b206-b2c4e9b59585" />

<img width="1914" height="884" alt="Screenshot 2026-03-18 170631" src="https://github.com/user-attachments/assets/41ccf832-8124-4075-983c-b64fe96ad651" />

---

## 🔗 Smart Contract Integration

## 🔗 Smart Contract Integration
- Smart contract deployed on Stellar Testnet ✅
- Frontend reads live auction state from contract every 5 seconds ✅
- `contractService.js` — handles all contract reads and bid transactions ✅
- `walletService.js` — connects Freighter wallet (v5+ API) ✅
- Bids submitted as real Stellar transactions signed by Freighter ✅
- Highest bid and top bidder updated on-chain after each successful bid ✅
---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Smart Contract | Rust, Soroban (Stellar) |
| Dev Tools | VS Code, Git, GitHub |

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔑 Wallet Connection | Enter a Stellar public key to simulate wallet auth |
| 📊 Live Auction Data | Displays item, current highest bid, and top bidder |
| ⏳ Countdown Timer | Updates every second via a custom React hook |
| ⚔️ Dual Bid System | Two bidders can compete simultaneously |
| ✅ Bid Validation | Enforces bid amount > current bid, valid wallet address, and numeric XLM value |
| 🏆 Bid Comparison | Instantly shows which of two submitted bids is higher |
| 📜 Bid History | All successful bids are logged and displayed on a history page |
| 📱 Responsive UI | Adapts gracefully across screen sizes using CSS Grid |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js ≥ 18
- npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sayali19425-gif/Real-time-auction-bid.git
cd Real-time-auction-bid

# 2. Navigate to the frontend
cd frontend

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173/`

---

## 📁 Project Structure

```
auction-dapp/
│
├── contract/                  # Soroban smart contract (Rust)
│   ├── src/
│   │   └── lib.rs
│   ├── Cargo.toml
│   └── Cargo.lock
│
├── frontend/                  # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── contractService.js  
│   │   ├── walletService.js    
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
├── .gitignore
└── README.md
```

---

## 🔄 How It Works

```
User opens app
      ↓
Wallet connection screen appears
      ↓
User enters Stellar public key → Validated
      ↓
Auction interface loads (item + current highest bid)
      ↓
User submits a bid
      ↓
Bid validated (amount, address, XLM format)
      ↓
Highest bid updates in real-time
      ↓
Bid saved to history
      ↓
Countdown timer continues until auction ends
```

---

## 💡 Key Concepts Demonstrated

- React state management
- Custom React hooks (countdown timer)
- Form validation
- Conditional rendering
- Real-time UI updates
- Blockchain integration structure (Soroban/Stellar)

---

## 🔮 Future Improvements

## 🔮 Future Improvements
- [x] Implement full on-chain bidding using `place_bid` ✅
- [x] Fetch real-time contract state from blockchain ✅
- [x] Improve wallet integration with Freighter auto-connect ✅
- [ ] Add live transaction tracking via Stellar Explorer
- [ ] Support multiple auctions

---

## 👩‍💻 Author

Built as a learning project to explore decentralized application development using React and the Stellar blockchain.

---

## 📄 License

This project is open-source and available for educational purposes.
