import { BigNumber } from "ethers";
import React, { useState } from "react";
import { Button, Input } from "semantic-ui-react";
import useContracts from "../../hooks/useContracts";
import { useStoreActions, useStoreState } from "../../store/globalStore";

// hooks and services

// components, styles and UI

// interfaces
export interface DepositTokenFormProps {
  isAllowed: boolean;
}

const DepositTokenForm: React.FunctionComponent<DepositTokenFormProps> = ({
  isAllowed,
}) => {
  const { currentAccount } = useStoreState((state) => state);

  const [amount, setAmount] = useState<string>("");

  const { approveToken, performDeposit } = useContracts();

  const handleDeposit = async () => {
    if (amount) {
      // @ts-ignore
      await performDeposit(
        currentAccount.accountAddress || "",
        parseFloat(amount)
      );
      setAmount("");
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
      />
      <br />
      {!isAllowed && (
        <Button
          className="customButton form-button"
          fluid
          onClick={approveToken}
        >
          approve
        </Button>
      )}
      <br />
      <Button
        className="customButton form-button"
        fluid
        disabled={!isAllowed}
        onClick={handleDeposit}
      >
        deposit
      </Button>
    </div>
  );
};

export default DepositTokenForm;
