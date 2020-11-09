import { useStoreActions } from "../store/globalStore";
import * as mcl from "react-hubble-bls/dist/mcl";

export interface IWalletAccount {
  publicKey: string;
  privateKey: string;
}

const useWalletAccounts = () => {
  const setCurrentAccountGlobal = useStoreActions(
    (actions) => actions.setCurrentAccount
  );
  const setWalletAccountsGlobal = useStoreActions(
    (actions) => actions.setWalletAccounts
  );

  /**
   * fetches a list of accounts from the localstorage
   */
  const getLocalAccounts = (): IWalletAccount[] => {
    const localAccounts = localStorage.getItem("walletAccounts");
    if (localAccounts) {
      return JSON.parse(localAccounts);
    } else {
      return [];
    }
  };

  /**
   * updates redux state for current and all accounts
   * @param walletAccounts
   */
  const updateGlobalState = (walletAccounts: IWalletAccount[]): void => {
    setWalletAccountsGlobal(walletAccounts);
    setCurrentAccountGlobal({
      privateKey: walletAccounts[walletAccounts.length - 1].privateKey,
      publicKey: walletAccounts[walletAccounts.length - 1].publicKey,
    });
  };

  const setCurrentAccountUser = (publicKey: string): void => {
    let localAccounts = getLocalAccounts();
    const newAccount = localAccounts.filter(
      (account) => account.publicKey === publicKey
    )[0];
    setCurrentAccountGlobal({
      privateKey: newAccount.privateKey,
      publicKey: newAccount.publicKey,
    });
  };

  /**
   * saves an array of walletAccounts to local storage
   * @param walletAccounts array of accounts
   */
  const setLocalAccounts = (walletAccounts: IWalletAccount[]): void => {
    localStorage.setItem("walletAccounts", JSON.stringify(walletAccounts));
    updateGlobalState(walletAccounts);
  };

  const getKeyPair = async (): Promise<any> => {
    await mcl.init();
    let keys = await mcl.newKeyPair();
    return keys;
  };

  /**
   * checks if an account exists locally
   */
  const checkExistingAccounts = (): void => {
    let walletAccounts = getLocalAccounts();
    if (walletAccounts.length === 0) {
      createFirstAccount();
    }
    updateGlobalState(walletAccounts);
  };

  /**
   * If no account is already present in the local storage
   * a new account is created for the user
   */
  const createFirstAccount = () => {
    getKeyPair().then((keys) => {
      let newAccount: IWalletAccount = {
        publicKey: JSON.stringify(keys.pubkey),
        privateKey: JSON.stringify(Object.values(keys.secret.a_)),
      };
      console.log(newAccount);
      let walletAccounts = Array<IWalletAccount>();
      walletAccounts.push(newAccount);
      setLocalAccounts(walletAccounts);
    });
  };

  /**
   * Explicitly creates a new account for the user on demand
   * @param walletAccount object with private and public key
   */
  const createNewAccount = (): void => {
    getKeyPair().then((keys) => {
      let newAccount: IWalletAccount = {
        publicKey: JSON.stringify(keys.pubkey),
        privateKey: JSON.stringify(Object.values(keys.secret.a_)),
      };
      let localAccounts = getLocalAccounts();
      localAccounts.push(newAccount);
      setLocalAccounts(localAccounts);
    });
  };

  /**
   * Removes a reference to the account from local storage
   * if the last remaining account is deleted
   * then a new account is created
   * @param publicKey of the account to be deleted
   */
  const burnAccount = (publicKey: string): void => {
    let localAccounts = getLocalAccounts();
    let updatedAccounts = localAccounts.filter(
      (account) => account.publicKey !== publicKey
    );
    if (updatedAccounts.length === 0) {
      createFirstAccount();
    } else {
      setLocalAccounts(updatedAccounts);
    }
  };

  return {
    checkExistingAccounts,
    createNewAccount,
    burnAccount,
    setCurrentAccountUser,
  };
};

export default useWalletAccounts;
