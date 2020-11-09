import React from "react";

// hooks and services
import { useStoreState } from "../../store/globalStore";

// components, styles and UI
import { Icon } from "semantic-ui-react";
import BurnAccountModal from "../Modals/BurnAccountModal";
import NewAccountModal from "../Modals/NewAccountModal";
import SendTokenModal from "../Modals/SendTokenModal";
import QRCodeGenerator from "../QRCode/QRCodeGenerator";
import DropdownAccounts from "./DropdownAccounts";
import SignWordsModal from "../Modals/SignWordsModal";

// interfaces
export interface AccountActionsProps {}

const AccountActions: React.FunctionComponent<AccountActionsProps> = () => {
  const currentAccount = useStoreState((state) => state.currentAccount);

  return (
    <div className="MainCardLeft">
      <h3>
        <Icon name="binoculars" />
        Hubble Wallet
      </h3>

      <br />
      <DropdownAccounts />

      <QRCodeGenerator address={JSON.stringify(currentAccount.publicKey)} />

      <SendTokenModal />
      <SignWordsModal />
      <NewAccountModal />
      <BurnAccountModal />
    </div>
  );
};

export default AccountActions;
