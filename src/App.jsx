import { useState } from "react";
import TxAnatomyMap from "./components/TxAnatomyMap";
import TxBuilder    from "./components/TxBuilder";

const TABS = [
  { id: "tx-anatomy", label: "Transaction Anatomy", component: TxAnatomyMap },
  { id: "tx-builder", label: "Building a Transaction", component: TxBuilder },
];

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  const ActiveComponent = TABS.find(t => t.id === activeTab)?.component;

  return (
    <div className="app">

      <div className="tab-bar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn${activeTab === tab.id ? " active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {ActiveComponent && <ActiveComponent />}
      </div>

    </div>
  );
}
