import React from "react";

// hooks and services

// components, styles and UI

// interfaces
export interface BalancesProps {}

const Balances: React.FunctionComponent<BalancesProps> = () => {
  return (
    <div className="balance">
      <h5>BALANCE</h5>

      <div className="amount">
        <div className="name">DAI</div>
        <div className="value">20.00</div>
      </div>
      <div className="amount">
        <div className="name">ETH</div>
        <div className="value">0.05</div>
      </div>
    </div>
  );
};

export default Balances;
