import React, { useState } from "react";
import QrReader from "react-qr-reader";

// hooks and services

// components, styles and UI
import { Button, Form, Header, Icon, Input, Modal } from "semantic-ui-react";
import useBls from "../../hooks/useBls";

// interfaces
export interface SendTokenModalProps {
  via: string;
}

const SendTokenModal: React.FunctionComponent<SendTokenModalProps> = ({
  via,
}) => {
  const [scanSuccess, setScanSuccess] = useState<boolean>(false);
  const [scannedAddress, setScannedAddress] = useState<string | null>(null);
  const [scannedAddressArray, setScannedAddressArray] = useState<string[]>([]);

  const handleScanSuccess = (data: string | null) => {
    if (data) {
      setScanSuccess(true);
      setScannedAddress(data);
      setScannedAddressArray(JSON.parse(data));
    }
  };

  const resetScan = () => {
    setScanSuccess(false);
    setScannedAddress(null);
    setScannedAddressArray([]);
  };

  const { combinePublicKeys } = useBls();

  return (
    <Modal
      size="tiny"
      trigger={
        <Button
          onClick={resetScan}
          className="customButton"
          content={`via ${via}`}
          size="large"
          fluid
          icon={via === "publicKey" ? "key" : "send"}
          labelPosition="left"
        />
      }
    >
      <Modal.Content>
        {scanSuccess ? (
          <>
            <Header color="green">
              <Icon name="check" size="tiny" />
              Scan Success
            </Header>
          </>
        ) : (
          <QrReader
            style={{ maxHeight: "40rem", maxWidth: "40rem" }}
            delay={1000}
            onError={() => {
              console.log("error");
            }}
            onScan={handleScanSuccess}
          />
        )}

        <br />

        <Form>
          {via === "publicKey" ? (
            <Form.Field>
              <label>Address Hash</label>
              <label>
                {scannedAddressArray.length
                  ? combinePublicKeys(scannedAddressArray)
                  : "scan in progress..."}
              </label>
            </Form.Field>
          ) : null}
          <Form.Field>
            <label>{via === "publicKey" ? "Address" : "SequenceID"}</label>
            <Input
              fluid
              labelPosition="right"
              type="text"
              placeholder="(scan or enter)"
              value={scannedAddress}
            />
          </Form.Field>
          <Form.Field>
            <label>Amount</label>
            <Input
              labelPosition="right"
              type="number"
              placeholder="100.00"
              fluid
            />
          </Form.Field>

          <div className="ButtonContainer">
            <Button
              className="customButton"
              content="send"
              icon="send"
              labelPosition="left"
              size="large"
              fluid
            />
          </div>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default SendTokenModal;
