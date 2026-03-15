import { useState } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const sat    = (btc) => Math.round(btc * 1e8);
const btcStr = (s)   => (s / 1e8).toFixed(8);
const fmtSat = (s)   => s.toLocaleString() + " sat";
const fmtBtc = (s)   => btcStr(s) + " BTC";

const toLE32 = (n) => n.toString(16).padStart(8, "0").match(/../g).reverse().join("");
const toLE64 = (n) => BigInt(n).toString(16).padStart(16, "0").match(/../g).reverse().join("");
const shortHash = (s) => s.slice(0, 8) + "…" + s.slice(-8);

// ─── Constants ────────────────────────────────────────────────────────────────
const PRIOR_TXID    = "4ac5418026798669135daf90472b7bab8892d0cac90d85f3a51a19278fe33aeb";
const PRIOR_TXID_LE = PRIOR_TXID.match(/../g).reverse().join("");

const STEP_META = [
  { label: "Scenario",       color: "#fbbf24" },
  { label: "Prior UTXO",    color: "#fb923c" },
  { label: "Build Input",   color: "#60a5fa" },
  { label: "Build Outputs", color: "#4ade80" },
  { label: "Fee",           color: "#c084fc" },
  { label: "Raw TX",        color: "#fbbf24" },
  { label: "Broadcast",     color: "#4ade80" },
];

// ─── Main component ───────────────────────────────────────────────────────────
export default function TxBuilder() {
  const [step, setStep] = useState(0);

  // Transaction values
  const utxoValue    = sat(0.5);
  const payAmount    = sat(0.2);
  const feeAmount    = sat(0.0002);
  const changeAmount = utxoValue - payAmount - feeAmount;

  // Raw transaction fields
  const version     = "01000000";
  const inputCount  = "01";
  const outpoint    = PRIOR_TXID_LE + toLE32(1);
  const scriptLen   = "00";
  const sequence    = "ffffffff";
  const outputCount = "02";
  const out1Amt     = toLE64(payAmount);
  const out1Script  = "1600147752c165ea7be772b2c0acb7f4d6047ae6f4768e";
  const out2Amt     = toLE64(changeAmount);
  const out2Script  = "160014a3f9bc2d1e7a0c918f9e2c3b4d5e6f7a8b9c0d1e";
  const locktime    = "00000000";
  const witness     = "0141cf5efe2d8ef13ed0af21d4f4cb82422d6252d70324f6f4576b727b7d918e521c00b51be739df2f899c49dc267c0ad280aca6dab0d2fa2b42a45182fc83e81713";
  const txid        = "466200308696215bbc949d5141a49a4138ecdfdfaa2a8029c1f9bcecd1f96177";

  const go    = (d) => setStep(s => Math.max(0, Math.min(STEP_META.length - 1, s + d)));
  const color = STEP_META[step].color;

  // Hex glow for box-shadow (append alpha)
  const glow  = color + "33";

  return (
    <div className="builder">

      <div className="builder__header">
        {/* <div className="builder__eyebrow">MASTERING BITCOIN</div> */}
        <h1 className="builder__title">Building a Bitcoin Transaction</h1>
        <p className="builder__subtitle">Alice pays Bob 0.2 BTC — step by step</p>
      </div>

      <div className="builder__step-nav">
        {STEP_META.map((s, i) => (
          <button
            key={i}
            className={`builder__step-btn${i === step ? " active" : ""}`}
            onClick={() => setStep(i)}
          >
            {i + 1}. {s.label}
          </button>
        ))}
      </div>

      <div className="builder__content">

        {step === 0 && (
          <Panel title="The Scenario" color={color} glow={glow}>
            <ScenarioCard
              utxoValue={utxoValue} payAmount={payAmount}
              feeAmount={feeAmount} changeAmount={changeAmount}
            />
          </Panel>
        )}

        {step === 1 && (
          <Panel title="Step 1 — The Prior UTXO" color={color} glow={glow}>
            <Explainer>
              Before Alice can send anything, there must be an <Em c={color}>existing unspent output</Em> locked
              to her key. This is called a <Em c={color}>UTXO</Em> — Unspent Transaction Output. It was created
              when someone previously paid Alice. Every input must reference one of these.
            </Explainer>
            <div className="field-grid">
              <Field label="Previous TXID"       color={color} value={shortHash(PRIOR_TXID)} full={PRIOR_TXID} note="The transaction that paid Alice" />
              <Field label="Output Index (vout)" color={color} value="1"                                       note="Alice's output was index 1 in that tx" />
              <Field label="Amount Locked"       color={color} value={fmtBtc(utxoValue)}                      note={fmtSat(utxoValue)} />
              <Field label="Locking Script"      color={color} value="P2WPKH"                                  note="Pay to Alice's public key hash" />
            </div>
            <ByteRow label="Outpoint (txid LE + vout)" bytes={outpoint} color={color} />
            <Note>
              The TXID is stored in <Em c={color}>little-endian byte order</Em> — the bytes are reversed
              from how you see them in a block explorer.
            </Note>
          </Panel>
        )}

        {step === 2 && (
          <Panel title="Step 2 — Building the Input" color={color} glow={glow}>
            <Explainer>
              An input has four parts: the <Em c={color}>outpoint</Em> (which UTXO to spend), an{" "}
              <Em c={color}>input script</Em> (empty for SegWit — signature goes in the witness), a{" "}
              <Em c={color}>sequence</Em> number, and later a <Em c={color}>witness</Em> containing Alice's signature.
            </Explainer>
            <div className="field-grid">
              <Field label="Outpoint: TXID"       color={color} value={shortHash(PRIOR_TXID)}  note="Which previous tx" />
              <Field label="Outpoint: vout"        color={color} value="1"                       note="Which output in that tx" />
              <Field label="Input Script Length"   color={color} value="0x00 (empty)"            note="SegWit: script is empty; signature is in witness" />
              <Field label="Sequence"              color={color} value="0xFFFFFFFF"               note="Final — no replacement, no timelock" />
              <Field label="Witness (signature)"   color={color} value={shortHash(witness)}      note="Alice's ECDSA/Schnorr signature + pubkey" />
            </div>
            <ByteRow label="Full input bytes" bytes={inputCount + outpoint + scriptLen + sequence} color={color} />
            <Note>
              The <Em c={color}>witness</Em> is serialized separately at the end of the transaction (SegWit format).
              It's what proves Alice owns the funds.
            </Note>
          </Panel>
        )}

        {step === 3 && (
          <Panel title="Step 3 — Building the Outputs" color={color} glow={glow}>
            <Explainer>
              This transaction has <Em c={color}>two outputs</Em>. Output 0 sends 0.2 BTC to Bob. Output 1
              returns the change to Alice. Each output has an <Em c={color}>amount</Em> (in satoshis, 8 bytes
              little-endian) and a <Em c={color}>locking script</Em>.
            </Explainer>

            <div className="output-section">
              <div className="output-section-label" style={{ color }}>OUTPUT 0 — BOB (recipient)</div>
              <div className="field-grid">
                <Field label="Amount"         color={color} value={fmtBtc(payAmount)} note={fmtSat(payAmount)} />
                <Field label="Locking Script" color={color} value="P2WPKH (Bob)"      note="Only Bob's key can unlock this" />
              </div>
              <ByteRow label="Output 0 bytes" bytes={out1Amt + out1Script} color={color} />
            </div>

            <div className="output-section">
              <div className="output-section-label" style={{ color: "#fbbf24" }}>OUTPUT 1 — ALICE (change)</div>
              <div className="field-grid">
                <Field label="Amount"         color="#fbbf24" value={fmtBtc(changeAmount)} note={fmtSat(changeAmount)} />
                <Field label="Locking Script" color="#fbbf24" value="P2WPKH (Alice)"       note="Alice's change address" />
              </div>
              <ByteRow label="Output 1 bytes" bytes={out2Amt + out2Script} color="#fbbf24" />
            </div>

            <Note>
              The amount is encoded as a <Em c={color}>64-bit little-endian signed integer</Em>.{" "}
              {fmtSat(payAmount)} = <code>{out1Amt}</code> in LE hex.
            </Note>
          </Panel>
        )}

        {step === 4 && (
          <Panel title="Step 4 — The Miner Fee" color={color} glow={glow}>
            <Explainer>
              There is <Em c={color}>no fee field</Em> in a Bitcoin transaction. The fee is implicit:
              it's whatever value is left after subtracting all outputs from all inputs.
              Miners who include this transaction in a block claim it.
            </Explainer>
            <FeeCalc
              utxoValue={utxoValue} payAmount={payAmount}
              feeAmount={feeAmount} changeAmount={changeAmount}
            />
            <Note>
              At ~10 sat/vbyte, this 569-weight transaction (~143 vbytes) costs ~1,430 sat in fees.
              Here we use 20,000 sat for clarity. Higher fee = higher priority.
            </Note>
          </Panel>
        )}

        {step === 5 && (
          <Panel title="Step 5 — Raw Serialized Transaction" color={color} glow={glow}>
            <Explainer>
              All fields concatenated produce the raw hex. This is what Alice signs and broadcasts.
              It's 569 weight units = ~143 vbytes.
            </Explainer>
            <RawTxView
              version={version}   inputCount={inputCount} outpoint={outpoint}
              scriptLen={scriptLen} sequence={sequence}    outputCount={outputCount}
              out1Amt={out1Amt}   out1Script={out1Script}
              out2Amt={out2Amt}   out2Script={out2Script}
              witness={witness}   locktime={locktime}
            />
          </Panel>
        )}

        {step === 6 && (
          <Panel title="Step 6 — Broadcast & Confirm" color={color} glow={glow}>
            <Explainer>
              Alice's wallet broadcasts the raw hex to Bitcoin's P2P network. Full nodes validate it,
              add it to their mempool, and relay it. A miner eventually includes it in a block.
            </Explainer>
            <BroadcastView
              txid={txid} utxoValue={utxoValue} payAmount={payAmount}
              feeAmount={feeAmount} changeAmount={changeAmount}
            />
          </Panel>
        )}

      </div>

      <div className="builder__nav">
        <NavBtn onClick={() => go(-1)} disabled={step === 0}                      label="← Previous" />
        <NavBtn onClick={() => go(1)}  disabled={step === STEP_META.length - 1}   label="Next →"     primary />
      </div>

    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Panel({ title, color, glow, children }) {
  return (
    <div className="panel" style={{ "--accent": color, "--glow": glow }}>
      <div className="panel__title">{title}</div>
      {children}
    </div>
  );
}

function Explainer({ children }) {
  return <p className="explainer">{children}</p>;
}

/** Inline emphasis with a dynamic color. */
function Em({ c, children }) {
  return <span style={{ color: c, fontWeight: 700 }}>{children}</span>;
}

function Note({ children }) {
  return <div className="note-box">{children}</div>;
}

function Field({ label, value, color, note, full }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="field" style={{ "--accent": color }}>
      <div className="field__label">{label}</div>
      <div
        className="field__value"
        onClick={() => full && setExpanded(e => !e)}
        style={{ cursor: full ? "pointer" : "default" }}
      >
        {expanded && full ? full : value}
        {full && (
          <span className="field__expand-hint">
            {expanded ? "[collapse]" : "[expand]"}
          </span>
        )}
      </div>
      {note && <div className="field__note">{note}</div>}
    </div>
  );
}

function ByteRow({ label, bytes, color }) {
  const chunks = bytes.match(/../g) || [];
  return (
    <div className="byte-row">
      <div className="byte-row__label">{label} ({bytes.length / 2} bytes)</div>
      <div className="byte-row__chunks">
        {chunks.map((b, i) => (
          <span key={i} className="byte-chunk" style={{ "--accent": color }}>{b}</span>
        ))}
      </div>
    </div>
  );
}

function NavBtn({ onClick, disabled, label, primary }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`nav-btn${primary ? " nav-btn--primary" : ""}`}
    >
      {label}
    </button>
  );
}

// ─── Step content components ──────────────────────────────────────────────────

function ScenarioCard({ utxoValue, payAmount, feeAmount, changeAmount }) {
  const people = [
    { who: "Alice", emoji: "👩", role: "Sender",        color: "#fb923c", note: `Has a UTXO worth ${fmtBtc(utxoValue)}` },
    { who: "Bob",   emoji: "👨", role: "Receiver",      color: "#4ade80", note: `Will receive ${fmtBtc(payAmount)}` },
    { who: "Miner", emoji: "⛏️", role: "Fee collector", color: "#c084fc", note: `Earns ${fmtBtc(feeAmount)} fee` },
  ];

  return (
    <div>
      <div className="scenario__cards">
        {people.map(p => (
          <div
            key={p.who}
            className="scenario__card"
            style={{ "--accent": p.color, "--accent-faint": p.color + "44" }}
          >
            <div className="scenario__card-emoji">{p.emoji}</div>
            <div className="scenario__card-name">{p.who}</div>
            <div className="scenario__card-role">{p.role}</div>
            <div className="scenario__card-note">{p.note}</div>
          </div>
        ))}
      </div>

      <div className="scenario__flow">
        <div className="scenario__flow-label">TRANSACTION FLOW</div>
        <div className="scenario__flow-pills">
          <Pill color="#fb923c">INPUT: {fmtBtc(utxoValue)}</Pill>
          <span className="flow-sep">→</span>
          <Pill color="#4ade80">Bob: {fmtBtc(payAmount)}</Pill>
          <span className="flow-sep">+</span>
          <Pill color="#fbbf24">Change: {fmtBtc(changeAmount)}</Pill>
          <span className="flow-sep">+</span>
          <Pill color="#c084fc">Fee: {fmtBtc(feeAmount)}</Pill>
        </div>
      </div>

      <Note>
        Bitcoin has no "send" command. A transaction{" "}
        <Em c="#fbbf24">consumes existing UTXOs</Em> and{" "}
        <Em c="#fbbf24">creates new ones</Em>. Alice's 0.5 BTC UTXO is destroyed; two new UTXOs are born.
      </Note>
    </div>
  );
}

function Pill({ color, children }) {
  return <span className="pill" style={{ "--accent": color }}>{children}</span>;
}

function FeeCalc({ utxoValue, payAmount, changeAmount, feeAmount }) {
  const rows = [
    { label: "Input value",   val: utxoValue,    color: "#fb923c", sign: "" },
    { label: "− To Bob",      val: payAmount,    color: "#4ade80", sign: "−" },
    { label: "− Change back", val: changeAmount, color: "#fbbf24", sign: "−" },
  ];

  return (
    <div className="fee-calc">
      {rows.map((r, i) => (
        <div key={i} className="fee-row">
          <span className="fee-row__label">{r.label}</span>
          <span className="fee-row__value" style={{ "--accent": r.color }}>
            {r.sign} {fmtSat(r.val)}
          </span>
        </div>
      ))}
      <div className="fee-total">
        <span className="fee-total__label">= MINER FEE (implicit)</span>
        <span className="fee-total__value">{fmtSat(feeAmount)}</span>
      </div>
    </div>
  );
}

function RawTxView({
  version, inputCount, outpoint, scriptLen, sequence,
  outputCount, out1Amt, out1Script, out2Amt, out2Script,
  witness, locktime,
}) {
  const segments = [
    { label: "Version",                   bytes: version,                 color: "#60a5fa" },
    { label: "Marker+Flag (SegWit)",      bytes: "0001",                  color: "#64748b" },
    { label: "Input count",               bytes: inputCount,              color: "#fb923c" },
    { label: "Outpoint (txid LE + vout)", bytes: outpoint,                color: "#fb923c" },
    { label: "Script length (empty)",     bytes: scriptLen,               color: "#fb923c" },
    { label: "Sequence",                  bytes: sequence,                color: "#fb923c" },
    { label: "Output count",              bytes: outputCount,             color: "#4ade80" },
    { label: "Output 0: amount",          bytes: out1Amt,                 color: "#4ade80" },
    { label: "Output 0: script",          bytes: out1Script,              color: "#4ade80" },
    { label: "Output 1: amount",          bytes: out2Amt,                 color: "#fbbf24" },
    { label: "Output 1: script",          bytes: out2Script,              color: "#fbbf24" },
    { label: "Witness (sig+pubkey)",      bytes: witness,                 color: "#60a5fa" },
    { label: "Locktime",                  bytes: locktime,                color: "#64748b" },
  ];

  return (
    <div className="raw-tx">
      <div className="raw-tx__bytes">
        {segments.map((s, si) =>
          (s.bytes.match(/../g) || []).map((b, bi) => (
            <span key={`${si}-${bi}`} className="byte-chunk" style={{ "--accent": s.color }}>{b}</span>
          ))
        )}
      </div>
      <div className="raw-tx__legend">
        {segments.map((s, i) => (
          <div key={i} className="raw-tx__legend-row">
            <span className="raw-tx__legend-size">{s.bytes.length / 2}B</span>
            <span className="raw-tx__legend-label" style={{ color: s.color }}>{s.label}</span>
            <span className="raw-tx__legend-bytes">{s.bytes}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BroadcastView({ txid, utxoValue, payAmount, feeAmount, changeAmount }) {
  const [confirmed,  setConfirmed]  = useState(false);
  const [confirming, setConfirming] = useState(false);

  const simulate = () => {
    setConfirming(true);
    setTimeout(() => { setConfirming(false); setConfirmed(true); }, 2000);
  };

  const btnClass = confirmed  ? "broadcast__btn broadcast__btn--confirmed"
                 : confirming ? "broadcast__btn broadcast__btn--confirming"
                 :              "broadcast__btn broadcast__btn--idle";

  return (
    <div className="broadcast">

      <div className="broadcast__txid">
        <div className="broadcast__txid-label">TRANSACTION ID (TXID)</div>
        <div className="broadcast__txid-value">{txid}</div>
        <div className="broadcast__txid-note">
          SHA256d of the raw transaction bytes, displayed in display byte order
        </div>
      </div>

      <div className="broadcast__section-label">NEW UTXOs CREATED ON-CHAIN</div>
      <div className="utxo-grid">
        <div className="utxo-card" style={{ "--accent": "#4ade80" }}>
          <div className="utxo-card__label">UTXO #0 — BOB</div>
          <div className="utxo-card__amount">{fmtBtc(payAmount)}</div>
          <div className="utxo-card__note">Locked to Bob's key</div>
          <div className="utxo-card__status">
            Status: {confirmed ? "✅ Confirmed (block 774,958)" : "⏳ Unconfirmed"}
          </div>
        </div>
        <div className="utxo-card" style={{ "--accent": "#fbbf24" }}>
          <div className="utxo-card__label">UTXO #1 — ALICE (change)</div>
          <div className="utxo-card__amount">{fmtBtc(changeAmount)}</div>
          <div className="utxo-card__note">Locked to Alice's change key</div>
          <div className="utxo-card__status">
            Status: {confirmed ? "✅ Confirmed (block 774,958)" : "⏳ Unconfirmed"}
          </div>
        </div>
      </div>

      <div className="utxo-lifecycle">
        <div className="utxo-lifecycle__label">UTXO LIFECYCLE</div>
        <div className="utxo-lifecycle__flow">
          <span style={{ color: "#fb923c" }}>Alice's old UTXO (0.5 BTC)</span>
          <span className="flow-sep">→</span>
          <span style={{ color: "#f87171", textDecoration: "line-through" }}>SPENT / DESTROYED</span>
          <span style={{ color: "#64748b", margin: "0 6px" }}>|</span>
          <span style={{ color: "#4ade80" }}>Bob UTXO (0.2 BTC)</span>
          <span className="flow-sep">+</span>
          <span style={{ color: "#fbbf24" }}>Alice UTXO ({fmtBtc(changeAmount)})</span>
          <span className="flow-sep">→</span>
          <span style={{ color: "#4ade80" }}>ADDED to UTXO set</span>
        </div>
      </div>

      <button className={btnClass} onClick={simulate} disabled={confirmed || confirming}>
        {confirmed  ? "✅ Transaction Confirmed in Block 774,958!"
         : confirming ? "⏳ Broadcasting… waiting for miner…"
         :              "🚀 Simulate Broadcast"}
      </button>

    </div>
  );
}
