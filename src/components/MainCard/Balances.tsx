import React, { useState } from "react";

// hooks and services
import { useStoreState } from "../../store/globalStore";

// components, styles and UI
import { Radio } from "semantic-ui-react";
import L1balance from "./L1balance";
import L2balance from "./L2balance";

// interfaces
export interface BalancesProps {}

const Balances: React.FunctionComponent<BalancesProps> = () => {
  const [isL1, setisL1] = useState<boolean>(true);
  const { connected } = useStoreState((state) => state);

  return (
    <div className="balance">
      {!connected ? (
        <div className="not-connected">
          Connect to ethereum wallet to use the app
        </div>
      ) : (
        <>
          <div className="balance-header">
            <span>BALANCE</span>
            <div className="balance-toggle">
              <span>L1</span>
              <Radio toggle onChange={() => setisL1(!isL1)} />
              <span>L2</span>
            </div>
          </div>

          {isL1 ? <L1balance /> : <L2balance />}
        </>
      )}
    </div>
  );
};

export default Balances;
