import React, { useEffect, useState } from "react";
import QrReader from "react-qr-reader";

// hooks and services
import useBls from "../../hooks/useBls";
import useCommander from "../../hooks/useCommander";

// components, styles and UI
import {
  Button,
  Dropdown,
  Form,
  Header,
  Icon,
  Input,
  Loader,
  Modal,
} from "semantic-ui-react";
import { useStoreState } from "../../store/globalStore";
import useTransactions from "../../hooks/useTransactions";

// interfaces
export interface SendTokenModalProps {}

const SendTokenModal: React.FunctionComponent<SendTokenModalProps> = () => {
  const { hashPublicKeysBytes, solG2ToBytes } = useBls();
  const { getStateFromPubKey, performTransfer } = useCommander();
  //   const { getStateFromPubKey, performTransfer, getNonce } = useCommander();

  // SCANNING STUFF
  const [scanSuccess, setScanSuccess] = useState<boolean>(false);
  const [scannedAddress, setScannedAddress] = useState<string>("");

  const [amount, setAmount] = useState<any>("");
  const [token, setToken] = useState<any>("");

  const handleScanSuccess = (data: string | null) => {
    if (data) {
      setScanSuccess(true);
      setScannedAddress(data);
    }
  };

  const resetScan = () => {
    setScanSuccess(false);
    setScannedAddress("");
  };

  // RECEIVER STUFF
  const [receiverTokens, setReceiverTokens] = useState<any>(null);
  const [receiverAccStates, setReceiverAccStates] = useState<any>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokensArray = await getStateFromPubKey(scannedAddress);
        setReceiverTokens(getTokenDropdown(tokensArray.states));
        setReceiverAccStates(tokensArray.states);
      } catch (error) {
        setReceiverTokens([]);
      }
    };

    if (scannedAddress) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [scannedAddress]);

  const getTokenDropdown = (states: any) => {
    let statesUniqueTokens = states.filter(
      (v: any, i: any, a: any) =>
        a.findIndex((t: any) => t.token_id === v.token_id) === i
    );

    return statesUniqueTokens.map(({ token_id }: any) => ({
      key: token_id,
      value: token_id,
      text: token_id,
    }));
  };

  // SENDER STUFF
  const { currentAccount } = useStoreState((state) => state);
  const [senderTokens, setSenderTokens] = useState<any>(null);

  const fetchSenderTokens = async () => {
    try {
      const tokensArray = await getStateFromPubKey(
        solG2ToBytes(currentAccount.publicKey || ["", "", "", ""])
      );
      setSenderTokens(tokensArray.states);
    } catch (error) {
      console.log(error);
    }
  };

  // FINAL STUFF
  const [sendingTx, setSendingTx] = useState<boolean>(false);

  const { createTransaction } = useTransactions();

  const handleSubmit = async () => {
    setSendingTx(true);
    if (amount !== "" && token !== "" && receiverAccStates !== null) {
      let nonce = senderTokens.filter(
        (Sendertoken: any) => Sendertoken.token_id === token
      )[0].nonce;
      //   let nonce = await getNonce(from);

      let from = senderTokens.filter(
        (Sendertoken: any) => Sendertoken.token_id === token
      )[0].state_id;

      let to = receiverAccStates.filter(
        (receiverTokens: any) => receiverTokens.token_id === token
      )[0].state_id;

      let finalBody = {
        from,
        to,
        nonce,
        amount: parseInt(amount),
        fee: 0,
      };

      console.log(finalBody);

      try {
        const data = await performTransfer(finalBody);
        createTransaction(data.hash);
      } catch (error) {
        console.log(error);
      }
    }
    setAmount("");
    setToken("");
    setSendingTx(false);
  };

  const showModalContent = (senderTokens: any) => {
    if (senderTokens === null) {
      return <Modal.Content>Preparing to send...</Modal.Content>;
    } else if (senderTokens.length === 0) {
      return <Modal.Content>Perform Deposit before sending...</Modal.Content>;
    } else {
      return (
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
                {scannedAddress
                  ? hashPublicKeysBytes(scannedAddress)
                  : "scan in progress..."}
              </label>
            </Form.Field>
            {/* <Form.Field>
              <label>{"Address"}</label>
              <Input
                fluid
                labelPosition="right"
                type="text"
                disabled
                placeholder="scan"
                value={
                    receiverAccStates === b receiverAccStates.filter(
                    (receiverTokens: any) => receiverTokens.token_id === token
                  )[0].state_id
                }
              />
            </Form.Field> */}
            {receiverTokens === null ? (
              <p>Fetching Tokens...</p>
            ) : receiverTokens.length === 0 ? (
              <p>Invalid Receiver</p>
            ) : (
              <>
                <Form.Field>
                  <label>Token ID</label>
                  <Dropdown
                    placeholder="Select Token to send"
                    fluid
                    selection
                    value={token}
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
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Form.Field>
                <div className="ButtonContainer">
                  <Button
                    disabled={sendingTx}
                    className="customButton"
                    content={
                      <>
                        send{" "}
                        {sendingTx ? (
                          <Loader active inline size="tiny" />
                        ) : null}
                      </>
                    }
                    icon="send"
                    labelPosition="left"
                    size="large"
                    fluid
                    onClick={handleSubmit}
                  ></Button>
                </div>
              </>
            )}
          </Form>
        </Modal.Content>
      );
    }
  };

  return (
    <Modal
      size="tiny"
      onOpen={() => fetchSenderTokens()}
      onClose={() => {
        setSenderTokens(null);
        setReceiverTokens(null);
      }}
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
      {showModalContent(senderTokens)}
    </Modal>
  );
};

export default SendTokenModal;
