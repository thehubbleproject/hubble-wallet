import React, { useEffect, useState } from "react";
import QrReader from "react-qr-reader";

// hooks and services

// components, styles and UI
import {
  Button,
  Dropdown,
  Form,
  Header,
  Icon,
  Input,
  Modal,
} from "semantic-ui-react";
import useBls from "../../hooks/useBls";
import useCommander from "../../hooks/useCommander";

// interfaces
export interface SendTokenModalProps {}

const SendTokenModal: React.FunctionComponent<SendTokenModalProps> = () => {
  const [scanSuccess, setScanSuccess] = useState<boolean>(false);
  const [scannedAddress, setScannedAddress] = useState<string>("");
  const [scannedAddressArray, setScannedAddressArray] = useState<string[]>([]);
  const [availableTokens, setAvailableTokens] = useState<any>([]);

  const [amount, setAmount] = useState<any>("");
  const [token, setToken] = useState<any>("");

  const handleScanSuccess = (data: string | null) => {
    if (data) {
      setScanSuccess(true);
      setScannedAddress(data);
      setScannedAddressArray(JSON.parse(data));
    }
  };

  const resetScan = () => {
    setScanSuccess(false);
    setScannedAddress("");
    setScannedAddressArray([]);
  };

  const { combinePublicKeys } = useBls();

  const { getStateFromPubKey } = useCommander();

  const getTokenDropdown = (states: any) => {
    return states.map(({ token_id }: any) => ({
      key: token_id,
      value: token_id,
      text: token_id,
    }));
  };

  const handleSubmit = () => {
    console.log(amount, token);
  };

  useEffect(() => {
    const fetchData = () => {
      const tokensArray = getStateFromPubKey(scannedAddressArray);
      setAvailableTokens(getTokenDropdown(tokensArray));
    };

    if (scannedAddress) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [scannedAddress]);

  return (
    <Modal
      size="tiny"
      trigger={
        <Button
          onClick={resetScan}
          className="customButton"
          size="large"
          content={"send tokens"}
          fluid
          icon={"key"}
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
          <Form.Field>
            <label>Address Hash</label>
            <label>
              {scannedAddressArray.length
                ? combinePublicKeys(scannedAddressArray)
                : "scan in progress..."}
            </label>
          </Form.Field>
          <Form.Field>
            <label>{"Address"}</label>
            <Input
              fluid
              labelPosition="right"
              type="text"
              placeholder="scan"
              value={scannedAddress}
            />
          </Form.Field>
          {availableTokens.length === 0 ? (
            <p>Fetching Tokens...</p>
          ) : (
            <>
              <Form.Field>
                <label>Token ID</label>
                <Dropdown
                  placeholder="Select Token to send"
                  fluid
                  selection
                  options={availableTokens}
                  onChange={(e, data) => setToken(data.value)}
                />
              </Form.Field>
              <Form.Field>
                <label>Amount</label>
                <Input
                  labelPosition="right"
                  type="number"
                  placeholder="100.00"
                  fluid
                  onChange={(e) => setAmount(e.target.value)}
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
                  onClick={handleSubmit}
                />
              </div>
            </>
          )}
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default SendTokenModal;
