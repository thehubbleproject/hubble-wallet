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
import { TransferOffchainTx } from "../../utils/transfer";
import { ethers } from "ethers";

// interfaces
export interface SendTokenModalProps {}

const SendTokenModal: React.FunctionComponent<SendTokenModalProps> = () => {
  const { hashPublicKeys } = useBls();
  const { getStatesFromPubKey, performTransfer } = useCommander();

  // SCANNING STUFF
  const [scanSuccess, setScanSuccess] = useState<boolean>(false);
  const [scannedAddress, setScannedAddress] = useState<string>("");
  const [isCreate2Mode, setIsCreate2Mode] = useState<boolean>(false);
  // eslint-disable-next-line
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
        const tokensArray = await getStatesFromPubKey(scannedAddress);
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
        a.findIndex((t: any) => t.tokenId === v.tokenId) === i
    );

    return statesUniqueTokens.map(({ tokenId }: any) => ({
      key: tokenId,
      value: tokenId,
      text: tokenId,
    }));
  };

  // SENDER STUFF
  const { currentAccount } = useStoreState((state) => state);
  const [senderTokens, setSenderTokens] = useState<any>(null);

  const fetchSenderTokens = async () => {
    try {
      const tokensArray = await getStatesFromPubKey(
        hashPublicKeys(currentAccount.publicKey)
      );
      setSenderTokens(tokensArray.states);
    } catch (error) {
      console.log(error);
    }
  };

  // FINAL STUFF
  const [sendingTx, setSendingTx] = useState<boolean>(false);

  const { splitTransactions } = useTransactions();

  const handleSubmit = async () => {
    setSendingTx(true);
    if (amount !== "" && token !== "" && receiverAccStates !== null) {
      let amountInWei = amount * 10 ** 9;
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
        (receiverTokens: any) => receiverTokens.tokenId === token
      )[0].stateId;

      for (let index = 0; index < splitTx.length; index++) {
        const Tx = splitTx[index];

        const tx = new TransferOffchainTx(
          ethers.BigNumber.from(Tx.stateId),
          ethers.BigNumber.from(to),
          ethers.BigNumber.from(Tx.amountPossible),
          ethers.BigNumber.from(0),
          ethers.BigNumber.from(Tx.nonce)
        );

        try {
          await performTransfer(tx);
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
              <label>{scannedAddress || "scan in progress..."}</label>
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
