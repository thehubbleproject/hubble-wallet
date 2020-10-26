import React, { useState } from "react";
import { Button, Modal } from "semantic-ui-react";
import useWalletAccounts from "../../hooks/useWalletAccounts";

// hooks and services

// components, styles and UI

// interfaces
export interface NewAccountModalProps {}

const NewAccountModal: React.FunctionComponent<NewAccountModalProps> = () => {
  const { createNewAccount } = useWalletAccounts();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const createNewAccountForUser = (): void => {
    createNewAccount();
    setModalOpen(false);
  };

  return (
    <Modal
      size="tiny"
      open={modalOpen}
      trigger={
        <div className="ButtonContainer">
          <Button
            className="customButton"
            content="new account"
            icon="plus"
            labelPosition="left"
            size="large"
            fluid
            onClick={() => setModalOpen(true)}
          />
        </div>
      }
    >
      <Modal.Header>Confirmation</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>This will create a new account locally on your device</p>
          <strong>
            Please do not store high volume on this wallet as it is volatile and
            risky
          </strong>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content="Abort"
          color="black"
          onClick={() => setModalOpen(false)}
        />
        <Button
          content="Create new account"
          labelPosition="right"
          icon="address book"
          color="green"
          onClick={createNewAccountForUser}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default NewAccountModal;
