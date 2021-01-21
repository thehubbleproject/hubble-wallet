import React from "react";

// hooks and services
import useWalletAccounts from "../../hooks/useWalletAccounts";
import { useStoreState } from "../../store/globalStore";
import { formatAccountString } from "../../utils/utils";
import KeysModal from "../Modals/KeysModal";

// components, styles and UI

// interfaces
export interface DropdownAccountsProps {}

const DropdownAccounts: React.FunctionComponent<DropdownAccountsProps> = () => {
  const walletAccounts = useStoreState((state) => state.walletAccounts);
  const currentAccount = useStoreState((state) => state.currentAccount);

  const { setCurrentAccountUser } = useWalletAccounts();
  return (
    <div className="dropdown-container">
      <div className="dropdown-container-title">
        <h4>
          L2 account {currentAccount.registered ? "(linked)" : "(not linked)"}
        </h4>
        <KeysModal />
      </div>
      <select
        name="accounts"
        id="accounts"
        className="select"
        onChange={(e) => setCurrentAccountUser(e.target.value)}
        value={currentAccount.hubbleAddress}
      >
        {walletAccounts.map((account) => (
          <option key={account?.hubbleAddress} value={account?.hubbleAddress}>
            {formatAccountString(account?.hubbleAddress)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownAccounts;
