import React from "react";

// hooks and services
import { useStoreState } from "../../store/globalStore";

// components, styles and UI
import { Icon } from "semantic-ui-react";
import BurnAccountModal from "../Modals/BurnAccountModal";
import NewAccountModal from "../Modals/NewAccountModal";
import QRCodeGenerator from "../QRCode/QRCodeGenerator";
import DropdownAccounts from "./DropdownAccounts";

// interfaces
export interface AccountActionsProps {}

const AccountActions: React.FunctionComponent<AccountActionsProps> = () => {
  const currentAccount = useStoreState((state) => state.currentAccount);

  return (
    <div className="main-card-left">
      <h3 className="app-title">
        <span>Hubble Wallet</span>
        <Icon name="binoculars" />
      </h3>

      <br />
      <DropdownAccounts />

      <QRCodeGenerator address={JSON.stringify(currentAccount.publicKey)} />

      <div className="button-group">
        <NewAccountModal />
        <BurnAccountModal />
      </div>
    </div>
  );
};

export default AccountActions;
