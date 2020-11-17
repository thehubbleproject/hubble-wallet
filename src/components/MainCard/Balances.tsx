import React from "react";
import DepositTokenForm from "../Forms/DepositTokenForm";

// hooks and services

// components, styles and UI

// interfaces
export interface BalancesProps {}

const Balances: React.FunctionComponent<BalancesProps> = () => {
  return (
    <div className="balance">
      <h5>BALANCE</h5>

      <div className="amount">
        <div className="value">20.00</div>
        <div className="name">TEST_HUBBLE</div>
      </div>

      <DepositTokenForm />
    </div>
  );
};

export default Balances;
