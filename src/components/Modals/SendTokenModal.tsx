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
import Swal from "sweetalert2";

// interfaces
export interface SendTokenModalProps {}

const SendTokenModal: React.FunctionComponent<SendTokenModalProps> = () => {
  const { hashPublicKeysBytes, solG2ToBytes } = useBls();
  const {
    getStateFromPubKey,
    performTransfer,
    performCreate2Transfer,
    getNonce,
  } = useCommander();

  // SCANNING STUFF
  const [scanSuccess, setScanSuccess] = useState<boolean>(false);
  const [scannedAddress, setScannedAddress] = useState<string>("");
  const [isCreate2Mode, setIsCreate2Mode] = useState<boolean>(false);
  const [create2Address, setCreate2Address] = useState("");

  const [amount, setAmount] = useState<any>("");
  const [token, setToken] = useState<any>("");

  const handleScanSuccess = (data: string | null) => {
    if (data) {
      setScanSuccess(true);
      setScannedAddress(data);
      console.log(data);
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
        if (error.response.data.error === "Could not get account by pubkey") {
          setIsCreate2Mode(true);
          setCreate2Address(scannedAddress);
        }
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

  const {
    saveTransactionToLocalStorage,
    splitTransactions,
  } = useTransactions();

  const handleSubmit = async () => {
    setSendingTx(true);
    if (amount !== "" && token !== "" && receiverAccStates !== null) {
      let amountInWei = amount * 10 ** 18;
      let splitTx = splitTransactions(amountInWei, senderTokens);

      if (splitTx.length === 0) {
        Swal.fire(
          "Insufficient Funds",
          "Please add more balance in your wallet",
          "error"
        );
        return;
      }

      let to = receiverAccStates.filter(
        (receiverTokens: any) => receiverTokens.token_id === token
      )[0].state_id;

      for (let index = 0; index < splitTx.length; index++) {
        const Tx = splitTx[index];

        let from = Tx.state_id;
        let amountPossible = Tx.amountPossible;

        let nonce = await getNonce(from);

        let finalBody = {
          from,
          to,
          nonce,
          amount: amountPossible,
          fee: 0,
        };

        console.log(finalBody);

        try {
          const data = await performTransfer(finalBody);
          saveTransactionToLocalStorage(data.hash);
        } catch (error) {
          console.log(error);
        }
      }

      Swal.fire(
        `Amount sent in ${splitTx.length} Txs`,
        "check status in Transactions tab",
        "success"
      );
    }
    setAmount("");
    setToken("");
    setSendingTx(false);
  };

  const handleSubmitCreate2 = async () => {
    setSendingTx(true);
    if (amount !== "" && token !== "" && receiverAccStates !== null) {
      let amountInWei = amount * 10 ** 18;
      let splitTx = splitTransactions(amountInWei, senderTokens);

      if (splitTx.length === 0) {
        Swal.fire(
          "Insufficient Funds",
          "Please add more balance in your wallet",
          "error"
        );
        return;
      }

      let to = receiverAccStates.filter(
        (receiverTokens: any) => receiverTokens.token_id === token
      )[0].state_id;

      for (let index = 0; index < splitTx.length; index++) {
        const Tx = splitTx[index];

        let from = Tx.state_id;
        let amountPossible = Tx.amountPossible;

        let nonce = await getNonce(from);

        let finalBody = {
          from,
          to,
          nonce,
          amount: amountPossible,
          fee: 0,
        };

        console.log(finalBody);

        // try {
        //   const data = await performTransfer(finalBody);
        //   saveTransactionToLocalStorage(data.hash);
        // } catch (error) {
        //   console.log(error);
        // }
      }

      //   Swal.fire(
      //     `Amount sent in ${splitTx.length} Txs`,
      //     "check status in Transactions tab",
      //     "success"
      //   );
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

            {receiverTokens === null ? (
              <p>Fetching Tokens...</p>
            ) : receiverTokens.length === 0 && isCreate2Mode === false ? (
              <p>Invalid Receiver</p>
            ) : isCreate2Mode === false ? (
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
                    className="custom-button"
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
            ) : (
              <>
                <p>
                  No Accounts found linked to this public key but sending a
                  transaction will create an account for this public key.
                  Proceed with caution and make sure to send the tokens to this
                  address only if you think this address exists
                </p>
                <Form.Field>
                  <Form.Field>
                    <label>Token ID</label>
                    <Dropdown
                      placeholder="Select Token to send"
                      fluid
                      selection
                      value={token}
                      options={getTokenDropdown(senderTokens)}
                      onChange={(e, data) => setToken(data.value)}
                    />
                  </Form.Field>
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
                    className="custom-button"
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
                    onClick={handleSubmitCreate2}
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
      onOpen={async () => fetchSenderTokens()}
      onClose={() => {
        setSenderTokens(null);
        setReceiverTokens(null);
      }}
      trigger={
        <Button
          onClick={resetScan}
          className="custom-button"
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
