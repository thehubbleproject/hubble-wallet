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
    <Modal closeIcon size="small" trigger={<Icon name="key" />}>
      <Modal.Header>Account Keys</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <div>
            <strong>Public Keys</strong>
            <br />
            <pre className="pre">
              [
              {currentAccount.publicKey?.map((key, index) => (
                <div key={index}> {key},</div>
              ))}
              ]
            </pre>
          </div>
          <div>
            <strong>Secret Key string</strong>
            <br />
            <pre className="pre">{currentAccount.reducedSecretKey}</pre>
          </div>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};

export default KeysModal;
