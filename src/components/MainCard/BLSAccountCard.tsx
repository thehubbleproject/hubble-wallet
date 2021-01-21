import React, { useEffect, useState } from "react";

// hooks and services
import { useStoreState } from "../../store/globalStore";

// components, styles and UI
import { Icon, Loader, Radio } from "semantic-ui-react";
import BurnAccountModal from "../Modals/BurnAccountModal";
import NewAccountModal from "../Modals/NewAccountModal";
import QRCodeGenerator from "../QRCode/QRCodeGenerator";
import DropdownAccounts from "./DropdownAccounts";
import useWalletAccounts from "../../hooks/useWalletAccounts";
import PickModeOfSendingModal from "../Modals/PickModeOfSendingModal";

// interfaces
export interface BLSAccountCardProps {}

const BLSAccountCard: React.FunctionComponent<BLSAccountCardProps> = () => {
  const currentAccount = useStoreState((state) => state.currentAccount);
  const { checkExistingAccounts } = useWalletAccounts();

  const [loading, setLoading] = useState<boolean>(true); //eslint-disable-line
  const [mode, setMode] = useState<string>("publicKey");

  const handleChangeMode = () => {
    if (mode === "publicKey") {
      setMode("sequenceId");
    } else {
      setMode("publicKey");
    }
  };

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
    <div className="main-card-left">
      <h3 className="app-title">
        <span>Hubble Wallet</span>
        <Icon name="binoculars" />
      </h3>

      {loading ? (
        <div className="loading-bls">
          <Loader active inline size="big" />
          <h4>Loading L2 Accounts...</h4>
        </div>
      ) : (
        <>
          <br />
          <DropdownAccounts />

          <div className="toggle-container">
            <Radio
              toggle
              label={`show ${
                mode === "publicKey" ? "Sequence ID" : "Public Key"
              }`}
              value={mode}
              className="toggle-mode"
              onChange={handleChangeMode}
            />
          </div>
          <QRCodeGenerator
            address={
              mode === "publicKey"
                ? JSON.stringify(currentAccount.publicKey)
                : "235"
            }
          />

          <PickModeOfSendingModal />
          <div className="button-group">
            <NewAccountModal />
            <BurnAccountModal />
          </div>
        </>
      )}
    </div>
  );
};

export default BLSAccountCard;
