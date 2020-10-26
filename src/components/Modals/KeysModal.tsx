import React from "react";
import { Icon, Modal } from "semantic-ui-react";

// hooks and services
import { useStoreState } from "../../store/globalStore";

// components, styles and UI

// interfaces
export interface KeysModalProps {}

const KeysModal: React.FunctionComponent<KeysModalProps> = () => {
  const currentAccount = useStoreState((state) => state.currentAccount);

  return (
    <Modal closeIcon size="tiny" trigger={<Icon name="key" />}>
      <Modal.Header>Account Keys</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>
            <strong>Public Key</strong>
            <br />
            {currentAccount.publicKey}
          </p>
          <p style={{ wordWrap: "break-word" }}>
            <strong>Private Key</strong>
            <br />
            {currentAccount.privateKey}
          </p>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};

export default KeysModal;
