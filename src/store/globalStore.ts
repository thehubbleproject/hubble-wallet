import { Action, action, createTypedHooks } from "easy-peasy";
import * as mcl from "react-hubble-bls/dist/mcl";

export interface IWalletAccount {
  publicKey: mcl.PublicKey | null;
  combinedPublicKey: string | "";
  reducedSecretKey: string | "";
}

export interface IGlobalStore {
  walletAccounts: (IWalletAccount | null)[];
  currentAccount: IWalletAccount;

  // actions
  setWalletAccounts: Action<IGlobalStore, IWalletAccount[]>;
  setCurrentAccount: Action<IGlobalStore, object>;
}

const globalStore: IGlobalStore = {
  walletAccounts: [],
  currentAccount: {
    publicKey: null,
    combinedPublicKey: "",
    reducedSecretKey: "",
  },

  // actions
  setWalletAccounts: action((state, payload: IWalletAccount[]) => {
    state.walletAccounts = payload;
  }),

  setCurrentAccount: action((state, payload: IWalletAccount) => {
    state.currentAccount.publicKey = payload.publicKey;
    state.currentAccount.combinedPublicKey = payload.combinedPublicKey;
    state.currentAccount.reducedSecretKey = payload.reducedSecretKey;
  }),
};

export default globalStore;

const { useStoreActions, useStoreState } = createTypedHooks<IGlobalStore>();
export { useStoreActions, useStoreState };
