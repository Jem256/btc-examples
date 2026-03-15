import { useState } from "react";

const branches = [
  {
    id: "inputs",
    label: "INPUTS",
    emoji: "📥",
    tagline: "Where money comes FROM",
    color: "#fb923c",
    glow: "rgba(251,146,60,0.35)",
    sub: [
      { label: "Outpoint", desc: "A pointer to a previous tx output (txid + output index). This is the 'coin' you're spending." },
      { label: "Witness / Script", desc: "Your cryptographic signature — proves you own the private key that controls these funds." },
      { label: "Sequence", desc: "Controls timing rules and whether the tx can be replaced before confirmation." },
      { label: "UTXO Reference", desc: "Inputs don't hold value — they reference an unspent output from a past transaction." },
    ],
  },
  {
    id: "outputs",
    label: "OUTPUTS",
    emoji: "📤",
    tagline: "Where money goes TO",
    color: "#4ade80",
    glow: "rgba(74,222,128,0.35)",
    sub: [
      { label: "Amount (satoshis)", desc: "The exact number of satoshis locked into this output." },
      { label: "Locking Script", desc: "Condition that must be met to spend this output later — usually 'provide a signature for this address'." },
      { label: "Recipient Output", desc: "Funds going to the person you're paying." },
      { label: "Change Output", desc: "Funds returned to yourself — like getting change from a $20 bill." },
    ],
  },
  {
    id: "fee",
    label: "MINER FEE",
    emoji: "⛏️",
    tagline: "Inputs − Outputs = Fee",
    color: "#c084fc",
    glow: "rgba(192,132,252,0.35)",
    sub: [
      { label: "Implicit, not stated", desc: "There's no 'fee field' — the fee is simply whatever value isn't assigned to an output." },
      { label: "Incentivizes miners", desc: "Miners collect all fees from every transaction in their block." },
      { label: "Controls priority", desc: "Higher fee per vbyte = more likely to be included in the next block." },
    ],
  },
  {
    id: "utxo",
    label: "UTXO MODEL",
    emoji: "🪙",
    tagline: "Think: physical cash, not bank balance",
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.35)",
    sub: [
      { label: "All-or-Nothing", desc: "You must spend the WHOLE input. Unspent value becomes change back to you." },
      { label: "Chained outputs", desc: "Every output is a potential future input. The chain of txs forms the blockchain history." },
      { label: "UTXO Set", desc: "Every full node maintains a database of all unspent outputs. Your 'balance' is the sum of your UTXOs." },
      { label: "No accounts", desc: "Bitcoin has no account balance — just locked coins waiting to be claimed." },
    ],
  },
];

const CARD_X = [220, 680, 220, 680];
const CARD_Y = [60, 60, 390, 390];
const CENTER = { x: 450, y: 260 };

export default function TxAnatomyMap() {
  const [activeId, setActiveId] = useState(null);
  const activeBranch = branches.find(b => b.id === activeId);

  const toggleBranch = (id) => setActiveId(prev => prev === id ? null : id);

  return (
    <div className="anatomy">

      <div className="anatomy__header">
        {/* <div className="anatomy__eyebrow">Mastering Bitcoin</div> */}
        <h1 className="anatomy__title">Bitcoin Transaction Anatomy</h1>
        <p className="anatomy__subtitle">Click any node to explore</p>
      </div>

      <div className="anatomy__main">

        {/* SVG Mind Map */}
        <div className={`anatomy__svg-wrap anatomy__svg-wrap--${activeBranch ? "split" : "full"}`}>
          <svg viewBox="0 0 900 520">
            <defs>
              {branches.map(b => (
                <radialGradient key={b.id} id={`glow-${b.id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor={b.color} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={b.color} stopOpacity="0" />
                </radialGradient>
              ))}
              <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
              <filter id="blur-sm">
                <feGaussianBlur stdDeviation="8" />
              </filter>
            </defs>

            {/* Connection lines */}
            {branches.map((b, i) => {
              const cx = CARD_X[i] + 90;
              const cy = CARD_Y[i] + 35;
              const isActive = activeId === b.id;
              return (
                <line
                  key={b.id}
                  x1={CENTER.x} y1={CENTER.y}
                  x2={cx}       y2={cy}
                  stroke={isActive ? b.color : "#1e293b"}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  strokeDasharray={isActive ? "none" : "6 4"}
                  style={{ transition: "all 0.3s" }}
                />
              );
            })}

            {/* Center glow */}
            <ellipse cx={CENTER.x} cy={CENTER.y} rx={80} ry={50}
              fill="url(#center-glow)" filter="url(#blur-sm)" />

            {/* Center node */}
            <rect x={CENTER.x - 80} y={CENTER.y - 38} width={160} height={76} rx={12}
              fill="#1e1b2e" stroke="#f59e0b" strokeWidth={2} />
            <text x={CENTER.x} y={CENTER.y - 10} textAnchor="middle" fontSize={9}  fill="#f59e0b" letterSpacing={3}>BITCOIN</text>
            <text x={CENTER.x} y={CENTER.y + 8}  textAnchor="middle" fontSize={14} fontWeight="bold" fill="#fef9c3">TRANSACTION</text>
            <text x={CENTER.x} y={CENTER.y + 26} textAnchor="middle" fontSize={8}  fill="#94a3b8">inputs → outputs</text>

            {/* Branch nodes */}
            {branches.map((b, i) => {
              const bx = CARD_X[i];
              const by = CARD_Y[i];
              const isActive = activeId === b.id;
              return (
                <g key={b.id} style={{ cursor: "pointer" }} onClick={() => toggleBranch(b.id)}>
                  {isActive && (
                    <ellipse cx={bx + 90} cy={by + 35} rx={110} ry={60}
                      fill={`url(#glow-${b.id})`} filter="url(#blur-sm)" />
                  )}
                  <rect x={bx} y={by} width={180} height={70} rx={10}
                    fill={isActive ? "#1a1a2e" : "#111827"}
                    stroke={b.color}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    style={{ transition: "all 0.3s" }}
                  />
                  <text x={bx + 14} y={by + 20} fontSize={16}>{b.emoji}</text>
                  <text x={bx + 38} y={by + 22} fontSize={13} fontWeight="bold" fill={b.color}>{b.label}</text>
                  <text x={bx + 14} y={by + 42} fontSize={9}  fill="#94a3b8">{b.tagline}</text>
                  <text x={bx + 155} y={by + 50} fontSize={14} fill={b.color} opacity={0.7}>
                    {isActive ? "−" : "+"}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail panel */}
        {activeBranch && (
          <div
            className="anatomy__detail"
            style={{ "--accent": activeBranch.color, "--glow": activeBranch.glow }}
          >
            <div className="anatomy__detail-eyebrow">
              {activeBranch.emoji} {activeBranch.label} — {activeBranch.tagline}
            </div>
            <div className="anatomy__detail-cards">
              {activeBranch.sub.map((s, i) => (
                <div key={i} className="anatomy__detail-card">
                  <div className="anatomy__detail-card-title">{s.label}</div>
                  <div className="anatomy__detail-card-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Summary bar */}
      <div className="anatomy__summary">
        <div className="anatomy__summary-eyebrow">Plain English Analogy</div>
        <div className="anatomy__summary-grid">
          <div><span style={{ color: "#fb923c" }}>Inputs</span> are like handing over a $20 bill — you consume the whole thing.</div>
          <div><span style={{ color: "#4ade80" }}>Outputs</span> are the $13 to the cashier + $7 change back to you.</div>
          <div><span style={{ color: "#c084fc" }}>Miner fee</span> is the tip — whatever is left unaccounted for.</div>
          <div><span style={{ color: "#60a5fa" }}>UTXOs</span> are the bills in your wallet — discrete, not a bank balance.</div>
        </div>
      </div>

    </div>
  );
}
