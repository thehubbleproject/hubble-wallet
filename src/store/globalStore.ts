import { Action, action, createTypedHooks } from "easy-peasy";
import * as mcl from "react-hubble-bls/dist/mcl";

export interface IWalletAccount {
  publicKey: mcl.PublicKey | null;
  combinedPublicKey: string | "";
  reducedSecretKey: string | "";
}

export interface IGlobalStore {
  web3: any;
  account: string;
  network: string;
  connected: boolean;
  walletAccounts: (IWalletAccount | null)[];
  currentAccount: IWalletAccount;

  // actions
  setWeb3: Action<IGlobalStore, any>;
  setAccount: Action<IGlobalStore, string>;
  setNetwork: Action<IGlobalStore, string>;
  setConnected: Action<IGlobalStore, boolean>;
  setWalletAccounts: Action<IGlobalStore, IWalletAccount[]>;
  setCurrentAccount: Action<IGlobalStore, object>;
}

const globalStore: IGlobalStore = {
  web3: null,
  account: "",
  network: "",
  connected: false,
  walletAccounts: [],
  currentAccount: {
    publicKey: null,
    combinedPublicKey: "",
    reducedSecretKey: "",
  },

  // actions
  setWeb3: action((state, payload: any) => {
    state.web3 = payload;
  }),

  setAccount: action((state, payload: string) => {
    state.account = payload;
  }),

  setNetwork: action((state, payload: string) => {
    state.network = payload;
  }),

  setConnected: action((state, payload: boolean) => {
    state.connected = payload;
  }),

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
