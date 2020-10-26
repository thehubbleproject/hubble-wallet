import { IWalletAccount } from "../hooks/useWalletAccounts";
import { Action, action, createTypedHooks } from "easy-peasy";

export interface IGlobalStore {
  walletAccounts: (IWalletAccount | null)[];
  currentAccount: IWalletAccount;

  // actions
  setWalletAccounts: Action<IGlobalStore, IWalletAccount[]>;
  setCurrentAccount: Action<IGlobalStore, object>;
}

const globalStore: IGlobalStore = {
  walletAccounts: [],
  currentAccount: { privateKey: "", publicKey: "" },

  // actions
  setWalletAccounts: action((state, payload: IWalletAccount[]) => {
    state.walletAccounts = payload;
  }),

  setCurrentAccount: action((state, payload: IWalletAccount) => {
    state.currentAccount.privateKey = payload.privateKey;
    state.currentAccount.publicKey = payload.publicKey;
  }),
};

export default globalStore;

const { useStoreActions, useStoreState } = createTypedHooks<IGlobalStore>();
export { useStoreActions, useStoreState };
