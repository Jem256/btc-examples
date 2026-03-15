# btc-examples

Interactive Bitcoin educational visualizations built with React + Vite, based on *Mastering Bitcoin*.

## What's in here

Each tab is a self-contained interactive lesson:

| Tab | What it teaches |
| --- | --------------- |
| **Transaction Anatomy** | Visual mind map of Bitcoin transaction structure — inputs, outputs, miner fee, and the UTXO model. Click any node to expand its details. |
| **Building a Transaction** | Step-by-step walkthrough of constructing a raw Bitcoin transaction from scratch — prior unspent output, input serialization, output encoding, fee calculation, raw hex, and broadcast simulation. |

## Project structure

```text
src/
├── index.css                  # All styles (CSS custom properties + BEM classes)
├── main.jsx                   # Entry point
├── App.jsx                    # Tab bar shell + routing
└── components/
    ├── TxAnatomyMap.jsx       # Tab 1 — SVG mind map
    └── TxBuilder.jsx          # Tab 2 — step-by-step tx builder
```

## Running locally

```bash
npm install
npm run dev
```

## Stack

- React 19
- Vite
- Plain CSS (no framework)
