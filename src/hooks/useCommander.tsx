import axios from "axios";
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
  sig: string;
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
  const BASE_URL = "http://135.181.199.78:3000";

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

  const getTxStatus = async (hash: string): Promise<IGetTxStatusResponse> => {
    return await axios.get(BASE_URL + `/status/tx/${hash}`);
  };

  const sendTx = async (body: ISendTxRequest): Promise<ISendTxResponse> => {
    return await axios.post(BASE_URL + "/tx", body);
  };

  const performTransfer = async (body: IPerfromTransferRequest) => {
    console.log(body);
    // return await axios.post(BASE_URL + "/sign", body);
    let response = {
      type: 1,
      message: "0xeewewdsds",
    };

    const signedMsg = signMessageString(response.message);
    let signature = signedMsg.signature.getStr();

    let txBody = {
      type: response.type,
      message: response.message,
      sig: signature,
    };

    console.log(txBody);

    return "ok";
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
  };
};

export default useCommander;
