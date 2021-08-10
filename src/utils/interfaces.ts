import { mclG1, solG1 } from "@thehubbleproject/bls/dist/mcl";
import { BigNumber } from "ethers";

export enum Status {
  // Transaction has been submitted to proposer
  Pending = "pending",
  // Transaction has been submitted as part of a batch to L1
  Submitted = "submitted",
  // Transaction was finalized on L1
  Finalized = "finalized",
  // Transaction failed for another reason
  Failed = "failed",
}

export interface SignatureInterface {
  mcl: mclG1;
  sol: solG1;
}

export interface CompressedTx {
  txType: string;
  fromIndex: BigNumber;
  serialize(): string;
  message(nonce: BigNumber): string;
  toString(): string;
}

export interface OffchainTx extends CompressedTx {
  toCompressed(): CompressedTx;
  message(): string;
  fee: BigNumber;
  nonce: BigNumber;
  signature?: SignatureInterface;
  hash(): string;
}

export type TransactionStatus = Readonly<{
  transaction: OffchainTx;
  status: Status;
  detail?: string;
  batchID?: number;
  l1TxnHash?: string;
  l1BlockIncluded?: number;
}>;

export interface State {
  stateId: number;
  balance: string;
  tokenId: number;
  nonce: number;
}

export interface StateRaw {
  pubkeyId: number;
  tokenId: number;
  balance: string;
  nonce: number;
}
