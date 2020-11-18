import React from "react";
import { useStoreState } from "../../store/globalStore";
import DepositTokenForm from "../Forms/DepositTokenForm";

// hooks and services

// components, styles and UI

// interfaces
export interface BalancesProps {}

const Balances: React.FunctionComponent<BalancesProps> = () => {
  const { connected } = useStoreState((state) => state);

  return (
    <div className="balance">
      {!connected ? (
        <div className="not-connected">
          Connect to ethereum wallet to use the app
        </div>
      ) : (
        <>
          <h5>BALANCE</h5>

          <div className="amount">
            <div className="value">20.00</div>
            <div className="name">TEST_HUBBLE</div>
          </div>

          <DepositTokenForm />
        </>
      )}
    </div>
  );
};

export default Balances;
