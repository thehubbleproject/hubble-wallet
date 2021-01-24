import axios from "axios";

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
  amount: number;
  fee: number;
}
interface IPerformTransferResponse {
  type: number;
  message: string;
}

const useCommander = () => {
  // Info Getters
  const BASE_URL = "https://something.com";

  const getStateInfo = async (id: number): Promise<IStateInfoResponse> => {
    return await axios.get(BASE_URL + `/state/${id}`);
  };

  const getAccountInfo = async (id: number): Promise<IAccountInfoResponse> => {
    return await axios.get(BASE_URL + `/account/${id}`);
  };

  const getStateFromPubKey = async () => {};

  // Transaction related
  const getTxTypeList = async () => {};

  const getTxStatus = async (hash: string): Promise<IGetTxStatusResponse> => {
    return await axios.get(BASE_URL + `/status/tx/${hash}`);
  };

  const performTransfer = async (
    body: IPerfromTransferRequest
  ): Promise<IPerformTransferResponse> => {
    return await axios.post(BASE_URL + "/sign", body);
  };

  const performCreate2Transfer = async () => {};

  const performMassMigration = async () => {};

  const sendTx = async (body: ISendTxRequest): Promise<ISendTxResponse> => {
    return await axios.post(BASE_URL + "/tx", body);
  };

  return {
    getStateInfo,
    getAccountInfo,
    getTxTypeList,
    sendTx,
    getTxStatus,
    performTransfer,
    performCreate2Transfer,
    performMassMigration,
  };
};

export default useCommander;
