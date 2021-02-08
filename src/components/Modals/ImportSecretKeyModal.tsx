import React, { useState } from "react";

// hooks and services

// components, styles and UI
import { Button, Form, Input, Loader, Modal } from "semantic-ui-react";
import useWalletAccounts from "../../hooks/useWalletAccounts";
import { useStoreState } from "../../store/globalStore";

// interfaces
export interface ImportSecretKeyModalProps {}

const ImportSecretKeyModal: React.FunctionComponent<ImportSecretKeyModalProps> = () => {
  const { createNewAccountFromSecret } = useWalletAccounts();
  const { walletAccounts } = useStoreState((state) => state);

  const [key, setKey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (key.length === 66) {
      console.log(key);

      // check if account already present in local
      let accounts = walletAccounts.filter(
        (account) => account?.reducedSecretKey === key
      );

      if (accounts.length === 0) {
        setLoading(true);
        await createNewAccountFromSecret(key);
        window.location.reload();
      }
    }
  };

  return (
    <Modal
      size="tiny"
      trigger={
        <Button
          className="customButton"
          size="large"
          content={"import secret key"}
          icon={"key"}
          labelPosition="left"
        />
      }
    >
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Secret Key</label>
            <Input
              labelPosition="right"
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </Form.Field>
          <div className="ButtonContainer">
            <Button
              className="customButton"
              content={
                <>
                  import account{" "}
                  {loading ? <Loader active inline size="tiny" /> : null}
                </>
              }
              icon="send"
              labelPosition="left"
              size="large"
              fluid
              onClick={handleSubmit}
            ></Button>
          </div>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default ImportSecretKeyModal;
