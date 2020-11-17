import React, { useEffect, useState } from "react";

// hooks and services
import { useStoreState } from "../../store/globalStore";
import useWalletAccounts from "../../hooks/useWalletAccounts";

// components, styles and UI

// interfaces
export interface AccountDetailsProps {}

const AccountDetails: React.FunctionComponent<AccountDetailsProps> = () => {
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
    <div className="MainCardRight">
      <div className="title">
        <h2>Current Account</h2>
        <p>{currentAccount.combinedPublicKey}</p>
      </div>
    </div>
  );
};

export default AccountDetails;
