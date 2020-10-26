import React, { useState } from "react";
import Balances from "./Balances";
import Transactions from "./Transactions";

export interface TabsProps {}

const Tabs: React.FunctionComponent<TabsProps> = () => {
  const [activeTab, setActiveTab] = useState<string>("blns");

  return (
    <>
      <div className="tabs">
        <div
          className={`tab ${activeTab === "blns" ? "active" : null}`}
          onClick={() => setActiveTab("blns")}
        >
          Balances
        </div>
        <div
          className={`tab ${activeTab === "txns" ? "active" : null}`}
          onClick={() => setActiveTab("txns")}
        >
          Transactions
        </div>
      </div>

      {activeTab === "blns" ? <Balances /> : <Transactions />}
    </>
  );
};

export default Tabs;
