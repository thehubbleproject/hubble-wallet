import axios from "axios";
import useBls from "./useBls";
import { TransferOffchainTx } from "../utils/transfer";
import { State, StateRaw, TransactionStatus } from "../utils/interfaces";
import useTransactions from "./useTransactions";
import config from "../config";

/**
 * provides utilities to interact with the "Hubble commander" backend.
 */
const useCommander = () => {
  /**
   * The url of the commander APIs
   */
  const BASE_URL = config.BASE_URL;

  const { saveTransactionToLocalStorage } = useTransactions();

  /**
   * external hooks
   */
  const { signMessageString } = useBls();

  const getStateInfo = async (id: number): Promise<StateRaw> => {
    return axios.get(BASE_URL + `/state/${id}`);
  };

  const getPubkeyHashFromId = async (id: number): Promise<{ hash: string }> => {
    return axios.get(BASE_URL + `/account/${id}`);
  };

  const getPubkeyIdFromHash = async (hash: string): Promise<{ id: number }> => {
    return axios.get(BASE_URL + `/account/${hash}`);
  };

  const getStatesFromPubKey = async (
    pubkeyHash: string
  ): Promise<{ states: State[] }> => {
    const res = await axios.get(BASE_URL + `/user/state/pubkey/${pubkeyHash}`);
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
   * returns the status code of the submitted transaction
   * - 100 - submitted
   * - 200 - accepted
   * - 300 - approved
   * - 400 - reverted
   *
   * @param hash hash of the transaction as returned while submitting Tx
   */
  const getTxStatus = async (hash: string): Promise<TransactionStatus> => {
    const res = await axios.get(BASE_URL + `/tx/${hash}`);
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
  const performTransfer = async (
    tx: TransferOffchainTx
  ): Promise<{ txHash: string }> => {
    console.log(tx.message());
    tx.signature = signMessageString(tx.message());
    const res = await axios.post(BASE_URL + "/tx", { bytes: tx.serialize() });
    saveTransactionToLocalStorage(res.data.txHash, tx.message());
    return res.data;
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
  const performCreate2Transfer = async (tx: TransferOffchainTx) => {};

  /**
   * used to migrate funds from L2 to L1
   */
  const performMassMigration = async () => {};

  return {
    getStateInfo,
    getPubkeyHashFromId,
    getPubkeyIdFromHash,
    getTxTypeList,
    getStatesFromPubKey,
    getTxStatus,
    performTransfer,
    performCreate2Transfer,
    performMassMigration,
  };
};

export default useCommander;
