import axios from "axios";
import { mclG1 } from "@thehubbleproject/bls/dist/mcl";
import useBls from "./useBls";

interface IStateInfoResponse {
  balance: string;
  account_id: number;
  state_id: number;
  token_id: number;
  nonce: number;
}
interface IAccountInfoResponse {
  account_id: number;
  pubkey: string;
}

interface ISendTxRequest {
  type: number;
  message: string;
  sig: mclG1;
}
interface ISendTxResponse {
  ID: string;
  to: number;
  from: number;
  data: string;
  sig: string;
  hash: string;
  status: number;
  type: number;
}

interface IGetTxStatusResponse {
  ID: string;
  to: number;
  from: number;
  data: string;
  sig: string;
  hash: string;
  status: number;
  type: number;
}

interface IPerfromTransferRequest {
  from: number;
  to: number;
  nonce: number;
  amount: any;
  fee: number;
}

/**
 * provides utilities to interact with the "Hubble commander" backend.
 */
const useCommander = () => {
  /**
   * The url of the commander APIs
   */
  const BASE_URL = "http://localhost:3000";

  /**
   * external hooks
   */
  const { signMessageString } = useBls();

  const getStateInfo = async (id: number): Promise<IStateInfoResponse> => {
    return await axios.get(BASE_URL + `/state/${id}`);
  };

  const getAccountInfo = async (id: number): Promise<IAccountInfoResponse> => {
    return await axios.get(BASE_URL + `/account/${id}`);
  };

  const getStateFromPubKey = async (pubkeyBytes: string): Promise<any> => {
    const res = await axios.get(BASE_URL + `/user/state/pubkey/${pubkeyBytes}`);
    return res.data;
  };

  // Transaction related

  /**
   * returns an integer for the type of Tx
   * 1 - transfer
   * 2 -
   * 3 -
   */
  const getTxTypeList = async () => {};

  /**
   * returns the latest nonce value for a particular state
   * IMPORTANT - the returned nonce value is already +1
   * so need not increment nonce again while sending the Tx
   * @param state_id stateId
   */
  const getNonce = async (state_id: number) => {
    const res = await axios.get(BASE_URL + `/estimateNonce/${state_id}`);
    return res.data.Nonce;
  };

  /**
   * returns the status code of the submitted transaction
   * - 100 - submitted
   * - 200 - accepted
   * - 300 - approved
   * - 400 - reverted
   *
   * @param hash hash of the transaction as returned while submitting Tx
   */
  const getTxStatus = async (hash: string): Promise<IGetTxStatusResponse> => {
    const res = await axios.get(BASE_URL + `/tx/${hash}`);
    return res.data;
  };

  /**
   * sends the signed message to the commander for submission
   * returns Tx hash once submitted
   * @param body
   */
  const sendTx = async (body: ISendTxRequest): Promise<ISendTxResponse> => {
    const res = await axios.post(BASE_URL + "/tx", body);
    return res.data;
  };

  /**
   * hits the api to perform "transfer" operation
   * - transfers amount from a stateId to another stateId
   * - Does not work if the receiver haven't deposited tokens to L2
   * - use create2Transfer for the 2nd point
   *
   * @param body
   */
  const performTransfer = async (body: IPerfromTransferRequest) => {
    const resTransfer = await axios.post(BASE_URL + "/transfer", body);
    const signature = await signMessageString(resTransfer.data.message);

    let txData = {
      type: resTransfer.data.tx_type,
      message: resTransfer.data.message,
      sig: signature.split("x")[1],
      encoded_tx: resTransfer.data.encoded_tx,
    };

    const resTx = await sendTx(txData);
    return resTx;
  };

  /**
   * hits the api to perform "transfer" operation when the receiver
   * has not deposited tokens to L2
   *
   * - creates an address for the receiver
   * - sends the tokens
   * - use performTransfer if receiver account already exists
   *
   * @param body
   */
  const performCreate2Transfer = async (body: IPerfromTransferRequest) => {
    const resTransfer = await axios.post(BASE_URL + "/transfer", body);
    const signature = await signMessageString(resTransfer.data.message);

    let txData = {
      type: resTransfer.data.tx_type,
      message: resTransfer.data.message,
      sig: signature.split("x")[1],
      encoded_tx: resTransfer.data.encoded_tx,
    };

    const resTx = await sendTx(txData);
    return resTx;
  };

  /**
   * used to migrate funds from L2 to L1
   */
  const performMassMigration = async () => {};

  return {
    getStateInfo,
    getAccountInfo,
    getTxTypeList,
    getStateFromPubKey,
    sendTx,
    getTxStatus,
    performTransfer,
    performCreate2Transfer,
    performMassMigration,
    getNonce,
  };
};

export default useCommander;
