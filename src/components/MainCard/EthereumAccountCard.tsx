import React, { useEffect, useState } from "react";

// hooks and services
import { useStoreState } from "../../store/globalStore";
import useWalletAccounts from "../../hooks/useWalletAccounts";
import { Button } from "semantic-ui-react";
import { formatAccountString } from "../../utils/utils";
import Balances from "./Balances";

// components, styles and UI

// interfaces
export interface EthereumAccountCardProps {}

const EthereumAccountCard: React.FunctionComponent<EthereumAccountCardProps> = () => {
  const { checkExistingAccounts } = useWalletAccounts();
  const currentAccount = useStoreState((state) => state.currentAccount);

  const [loading, setLoading] = useState<boolean>(true); //eslint-disable-line

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await checkExistingAccounts();
      setLoading(false);
    };

    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="main-card-right">
      <div className="header">
        <div className="account-details">
          <h4>Ethereum Account</h4>
          <p>
            (ropsten) {formatAccountString(currentAccount.combinedPublicKey)}
          </p>
        </div>

        <Button
          className="customButton"
          content="connect wallet"
          size="small"
          compact
        />
      </div>

      <Balances />
    </div>
  );
};

export default EthereumAccountCard;
