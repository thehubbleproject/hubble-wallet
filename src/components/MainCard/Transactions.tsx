import React from "react";
import { Label } from "semantic-ui-react";

// hooks and services

// components, styles and UI

// interfaces
export interface TransactionsProps {}

const Transactions: React.FunctionComponent<TransactionsProps> = () => {
  return (
    <div className="transactions">
      <h5>TRANSACTIONS</h5>
      <div className="records">
        <div className="date">
          <strong>October 2, 2020</strong>
        </div>
        <div className="id">0xf8Ce662e52e8Ea6D7B17DFc2959C82D4f1144B69</div>
        <div className="id">100DAI</div>
        <div className="id">
          <Label
            style={{ width: "50px", textAlign: "center" }}
            color="green"
            size="tiny"
          >
            IN
          </Label>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
