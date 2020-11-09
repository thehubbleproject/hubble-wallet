import React from "react";

// hooks and services
import useWalletAccounts from "../../hooks/useWalletAccounts";
import { useStoreState } from "../../store/globalStore";

// components, styles and UI

// interfaces
export interface DropdownAccountsProps {}

const DropdownAccounts: React.FunctionComponent<DropdownAccountsProps> = () => {
  const walletAccounts = useStoreState((state) => state.walletAccounts);
  const currentAccount = useStoreState((state) => state.currentAccount);

  const { setCurrentAccountUser } = useWalletAccounts();
  return (
    <div className="ButtonContainer">
      <h4>change account</h4>
      <select
        name="accounts"
        id="accounts"
        className="select"
        onChange={(e) => setCurrentAccountUser(e.target.value)}
        value={currentAccount.combinedPublicKey}
      >
        {walletAccounts.map((account) => (
          <option
            key={account?.combinedPublicKey}
            value={account?.combinedPublicKey}
          >
            {account?.combinedPublicKey}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownAccounts;
