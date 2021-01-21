import React from "react";
import { Button, Modal } from "semantic-ui-react";
import SendTokenModal from "./SendTokenModal";

// hooks and services

// components, styles and UI

// interfaces
export interface PickModeOfSendingModalProps {}

const PickModeOfSendingModal: React.FunctionComponent<PickModeOfSendingModalProps> = () => {
  return (
    <Modal
      className="modal-max-width"
      size="tiny"
      trigger={
        <Button
          className="customButton"
          content="send tokens"
          icon="camera"
          fluid
          labelPosition="left"
          size="large"
        />
      }
    >
      <Modal.Content className="modal-content-center">
        <Modal.Description>
          <p>Select mode of transfer for the tokens</p>
        </Modal.Description>

        <br />

        <div className="ButtonContainer">
          <SendTokenModal via={"sequenceID"} />
          <br />
          <SendTokenModal via={"publicKey"} />
        </div>
      </Modal.Content>
    </Modal>
  );
};

export default PickModeOfSendingModal;
