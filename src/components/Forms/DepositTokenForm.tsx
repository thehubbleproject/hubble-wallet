import React, { useState } from "react";
import { Button, Input } from "semantic-ui-react";
import useContracts from "../../hooks/useContracts";
import { useStoreState } from "../../store/globalStore";

// hooks and services

// components, styles and UI

// interfaces
export interface DepositTokenFormProps {
  isAllowed: boolean;
}

const DepositTokenForm: React.FunctionComponent<DepositTokenFormProps> = ({
  isAllowed,
}) => {
  const { currentAccount, account } = useStoreState((state) => state);

  const [amount, setAmount] = useState<string>("");

  const {
    approveToken,
    performDeposit,
    createNewBLSAccountRegistry,
  } = useContracts();

  const handleDeposit = async () => {
    if (amount) {
      // @ts-ignore
      await performDeposit(currentAccount.accountId || "", parseFloat(amount));
      setAmount("");
    }
  };

  const handleConnectL2 = async () => {
    if (!currentAccount.registered && account) {
      let pkey = currentAccount.publicKey || ["", "", "", ""];
      createNewBLSAccountRegistry(pkey);
    }
  };

  return (
    <div className="deposit-form">
      <h4>Deposit Tokens</h4>
      <Input
        fluid
        placeholder="Amount"
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        value={amount}
        disabled={!isAllowed}
      />
      {!currentAccount.registered && (
        <Button
          className="customButton form-button"
          fluid
          onClick={handleConnectL2}
        >
          Link L2 account
        </Button>
      )}
      {!isAllowed && (
        <Button
          className="customButton form-button"
          fluid
          onClick={approveToken}
        >
          approve
        </Button>
      )}
      <Button
        className="customButton form-button"
        fluid
        disabled={!isAllowed || !currentAccount.registered}
        onClick={handleDeposit}
      >
        deposit
      </Button>
    </div>
  );
};

export default DepositTokenForm;
