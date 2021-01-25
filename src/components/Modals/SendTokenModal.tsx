import React, { useEffect, useState } from "react";
import QrReader from "react-qr-reader";
import { useStoreState } from "../../store/globalStore";

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
  const { combinePublicKeys } = useBls();
  const { getStateFromPubKey } = useCommander();

  // SCANNING STUFF
  const [scanSuccess, setScanSuccess] = useState<boolean>(false);
  const [scannedAddress, setScannedAddress] = useState<string>("");
  const [scannedAddressArray, setScannedAddressArray] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);

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

  const handleSubmit = () => {
    console.log(amount, token);
  };

  // RECEIVER STUFF
  const [receiverTokens, setReceiverTokens] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      const tokensArray = await getStateFromPubKey(JSON.parse(scannedAddress));
      setReceiverTokens(getTokenDropdown(tokensArray.states));
    };

    if (scannedAddress) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [scannedAddress]);

  const getTokenDropdown = (states: any) => {
    return states.map(({ token_id }: any) => ({
      key: token_id,
      value: token_id,
      text: token_id,
    }));
  };

  // SENDER STUFF
  const { currentAccount } = useStoreState((state) => state);
  const [availableTokensSender, setAvailableTokensSender] = useState<any>([]);

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
          {receiverTokens.length === 0 ? (
            <p>Fetching Tokens...</p>
          ) : (
            <>
              <Form.Field>
                <label>Token ID</label>
                <Dropdown
                  placeholder="Select Token to send"
                  fluid
                  selection
                  options={receiverTokens}
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
