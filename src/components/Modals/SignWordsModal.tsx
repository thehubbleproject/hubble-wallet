import React, { useState } from "react";
// hooks and services

// components, styles and UI
import { Button, Form, Input, Modal } from "semantic-ui-react";
import useBls from "../../hooks/useBls";

// interfaces
export interface SignWordsModalProps {}

const SignWordsModal: React.FunctionComponent<SignWordsModalProps> = () => {
  const { signMessageString } = useBls();

  const [message, setMessage] = useState<string>("");

  const handleSign = () => {
    if (message) {
      const signature = signMessageString(message);
      setMessage("");
      console.log(signature);
    }
  };

  return (
    <Modal
      size="tiny"
      trigger={
        <div className="ButtonContainer">
          <Button
            className="custom-button"
            content="sign"
            icon="pencil"
            labelPosition="left"
            size="large"
            fluid
          />
        </div>
      }
    >
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Write</label>
            <Input
              fluid
              labelPosition="right"
              type="text"
              placeholder="enter"
              onChange={(e) => setMessage(e.target.value)}
            />
          </Form.Field>

          <div className="ButtonContainer">
            <Button
              className="custom-button"
              content="sign"
              icon="pencil"
              labelPosition="left"
              size="large"
              onClick={handleSign}
              fluid
            />
          </div>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default SignWordsModal;
