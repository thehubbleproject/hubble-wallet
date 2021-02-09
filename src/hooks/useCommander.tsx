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

interface IStateInfoFromPubkey {
  balance: number;
  state_id: number;
  token_id: number;
  nonce: number;
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
interface IPerformTransferResponse {
  type: number;
  message: string;
}

const useCommander = () => {
  // Info Getters
  const BASE_URL = "http://135.181.199.78";

  const { signMessageString } = useBls();

  const getStateInfo = async (id: number): Promise<IStateInfoResponse> => {
    return await axios.get(BASE_URL + `/state/${id}`);
  };

  const getAccountInfo = async (id: number): Promise<IAccountInfoResponse> => {
    return await axios.get(BASE_URL + `/account/${id}`);
  };

  const getStateFromPubKey = async (pubkeyBytes: string): Promise<any> => {
    const res = await axios.get(BASE_URL + `/user/${pubkeyBytes}`);
    return res.data;
  };

  // Transaction related
  const getTxTypeList = async () => {};

  const getNonce = async (state_id: number) => {
    const res = await axios.get(BASE_URL + `/estimateNonce/${state_id}`);
    return res.data.Nonce;
  };

  const getTxStatus = async (hash: string): Promise<IGetTxStatusResponse> => {
    const res = await axios.get(BASE_URL + `/tx/${hash}`);
    return res.data;
  };

  const sendTx = async (body: ISendTxRequest): Promise<ISendTxResponse> => {
    const res = await axios.post(BASE_URL + "/tx", body);
    return res.data;
  };

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

  const performCreate2Transfer = async () => {};

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
