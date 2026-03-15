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
<img width="1893" height="843" alt="wallet-connected" src="https://github.com/user-attachments/assets/f74a0725-be5d-4ec3-953f-33f80c2417a5" />

### Auction Page
<img width="1888" height="865" alt="auction-page" src="https://github.com/user-attachments/assets/8731db28-469b-43ce-9eae-200a36de9972" />

### Bid History
<img width="1879" height="803" alt="bid-history" src="https://github.com/user-attachments/assets/6eaf4a05-bc48-4bd7-ba19-9f5bb72eae27" />

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

- [ ] Connect UI to a deployed Stellar smart contract
- [ ] Integrate Freighter wallet directly
- [ ] Add live blockchain event streaming
- [ ] Implement real XLM token transfers
- [ ] Add user authentication
- [ ] Deploy on Vercel or Netlify

---

## 👩‍💻 Author

Built as a learning project to explore decentralized application development using React and the Stellar blockchain.

---

## 📄 License

This project is open-source and available for educational purposes.
