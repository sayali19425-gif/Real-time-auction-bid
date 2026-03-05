1. Real-Time Auction Bid dApp

A simple decentralized auction interface built with React (Vite) and a Rust smart contract (Soroban).
This project simulates a real-time auction where users can connect their Stellar wallet, place bids, and see the highest bid update dynamically.

The goal of this project is to demonstrate how a frontend interface can interact with blockchain-style logic while providing a clean and responsive user experience.


2. Project Overview

This application allows users to participate in a digital auction for an NFT-like asset.

The application includes:
    - Wallet connection screen
    - Live auction display
    - Countdown timer
    - Two bid entry panels
    - Bid comparison logic
    - Bid history tracking

The system simulates a real-time bidding environment where the highest bid is updated and displayed immediately.


3. Features
Wallet Connection
   - Users enter their Stellar public key to simulate connecting a wallet.

Live Auction Data

The interface displays:
    - Auction item
    - Current highest bid
    - Highest bidder
    - Countdown timer

Real-Time Countdown
    -The countdown timer updates every second using a custom React hook.

Dual Bid System
    - Two bidders can place bids simultaneously and the system compares them.

Bid Validation
Bids must:
    - Be higher than the current bid
    - Contain a valid wallet address
    - Contain a numeric XLM value

Bid Comparison
- If two bids are entered, the interface displays which bid is higher.

Bid History
- All successful bids are stored and displayed in the history page.

Responsive UI
- The layout adapts to different screen sizes using CSS grid and responsive styles.

Tech Stack:

Frontend
- React
- Vite
- JavaScript
- CSS

Blockchain Layer
- Rust
- Soroban Smart Contract

Tools
- VS Code
- Git
- GitHub


4. Project Structure

auction-dapp
│
├── contract
│   ├── src
│   │   └── lib.rs
│   ├── Cargo.toml
│   └── Cargo.lock
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── eslint.config.js
│
├── .gitignore
└── README.md


5. How the Application Works

    (1) The user opens the application.
    (2) The wallet connection page appears.
    (3) The user enters a Stellar public key.
    (4) After validation, the auction interface loads.
    (5) The auction item and current highest bid are displayed.
    (6) Users can enter bids in the two bidding panels.
    (7) When a bid is submitted:
        - The system validates the bid.
        - The highest bid is updated.
        - The bid is saved in history.
    (8) The countdown timer continues until the auction ends.


6. Screenshots

Add screenshots of the application here.
Example:
- Wallet connection page
- Auction page
- Bid comparison
- Bid history


7. Example Bid Flow
User connects wallet
        ↓
Auction page loads
        ↓
User enters bid
        ↓
Bid validation occurs
        ↓
Highest bid updates
        ↓
Bid stored in history


8. Key Concepts Demonstrated

This project demonstrates:
- React state management
- Custom hooks
- Form validation
- Conditional rendering
- Real-time UI updates
- Basic blockchain integration structure


9. Future Improvements
- Connecting the UI to a real Stellar smart contract
- Integrating Freighter wallet directly
- Adding live blockchain event streaming
- Implementing real token transfers
- Adding user authentication
- Deploying the app on Vercel or Netlify


10. Author

Project developed as a learning project for building decentralized applications.

11. License

This project is open-source and available for educational purposes.