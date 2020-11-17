import React from "react";
import { Button, Input } from "semantic-ui-react";

// hooks and services

// components, styles and UI

// interfaces
export interface DepositTokenFormProps {}

const DepositTokenForm: React.FunctionComponent<DepositTokenFormProps> = () => {
  return (
    <div className="deposit-form">
      <h4>Deposit Tokens</h4>
      <Input fluid placeholder="Amount" />
      <br />
      <Button className="customButton form-button" fluid>
        approve
      </Button>
      <br />
      <Button className="customButton form-button" fluid>
        deposit
      </Button>
    </div>
  );
};

export default DepositTokenForm;
