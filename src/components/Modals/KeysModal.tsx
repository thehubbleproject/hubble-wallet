import React from "react";
import { Icon, Modal } from "semantic-ui-react";

// hooks and services
import { useStoreState } from "../../store/globalStore";
import ImportSecretKeyModal from "./ImportSecretKeyModal";

// components, styles and UI

// interfaces
export interface KeysModalProps {}

const KeysModal: React.FunctionComponent<KeysModalProps> = () => {
  const currentAccount = useStoreState((state) => state.currentAccount);

  return (
    <Modal
      closeIcon
      size="small"
      trigger={
        <span className="show-keys">
          <Icon name="key" />
          show keys
        </span>
      }
    >
      <Modal.Header>
        <div className="account-import">
          <div>Account Keys </div>
          <ImportSecretKeyModal />
        </div>
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <div>
            <strong>Public Keys</strong>
            <br />
            <pre className="pre">
              [
              {currentAccount.publicKey?.map((key: any, index: number) => (
                <div key={index}> {key},</div>
              ))}
              ]
            </pre>
          </div>
          <div>
            <strong>Public Key Hashed</strong>
            <br />
            <pre className="pre">{currentAccount.hubbleAddress}</pre>
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
