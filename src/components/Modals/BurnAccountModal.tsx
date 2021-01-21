import React, { useState } from "react";
import { Button, Modal } from "semantic-ui-react";
import useWalletAccounts from "../../hooks/useWalletAccounts";
import { useStoreState } from "../../store/globalStore";

// hooks and services

// components, styles and UI

// interfaces
export interface BurnAccountModalProps {}

const BurnAccountModal: React.FunctionComponent<BurnAccountModalProps> = () => {
  const { burnAccount } = useWalletAccounts();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const currentAccount = useStoreState((state) => state.currentAccount);

  const closeAccountForUser = (): void => {
    burnAccount(currentAccount.hubbleAddress);
    setModalOpen(false);
  };

  return (
    <Modal
      open={modalOpen}
      size="tiny"
      trigger={
        <Button
          className="customButton burn"
          content="delete"
          icon="close"
          labelPosition="right"
          size="large"
          floated="right"
          onClick={() => setModalOpen(true)}
        />
      }
    >
      <Modal.Header>Confirmation</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>Are you sure you want to close this account?</p>

          <strong>
            The remaining value in the account will NEVER be recovered
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
          content="Yes, Close it"
          labelPosition="right"
          icon="fire"
          color="red"
          onClick={closeAccountForUser}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default BurnAccountModal;
