import { useEffect } from "react";
import {
  IWalletAccount,
  useStoreActions,
  useStoreState,
} from "../store/globalStore";
import useBls from "./useBls";

const useWalletAccounts = () => {
  const setCurrentAccountGlobal = useStoreActions(
    (actions) => actions.setCurrentAccount
  );
  const setWalletAccountsGlobal = useStoreActions(
    (actions) => actions.setWalletAccounts
  );
  const { walletAccounts } = useStoreState((state) => state);

  const { getNewKeyPair } = useBls();

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
   * saves an array of walletAccounts to local storage
   * @param walletAccounts array of accounts
   */
  const setLocalAccounts = (walletAccounts: IWalletAccount[]): void => {
    localStorage.setItem("walletAccounts", JSON.stringify(walletAccounts));
    updateGlobalState(walletAccounts);
  };

  useEffect(() => {
    // @ts-ignore
    if (walletAccounts.length) {
      localStorage.setItem("walletAccounts", JSON.stringify(walletAccounts));
    }
  }, [walletAccounts]);

  /**
   * updates redux state for current and all accounts
   * @param walletAccounts
   */
  const updateGlobalState = (walletAccounts: IWalletAccount[]): void => {
    setWalletAccountsGlobal(walletAccounts);
    setCurrentAccountGlobal({
      publicKey: walletAccounts[walletAccounts.length - 1].publicKey,
      combinedPublicKey:
        walletAccounts[walletAccounts.length - 1].combinedPublicKey,
      reducedSecretKey:
        walletAccounts[walletAccounts.length - 1].reducedSecretKey,
      registered: walletAccounts[walletAccounts.length - 1].registered,
      accountAddress: walletAccounts[walletAccounts.length - 1].accountAddress,
    });
  };

  const setCurrentAccountUser = (combinedPublicKey: string): void => {
    let localAccounts = getLocalAccounts();
    const newAccount = localAccounts.filter(
      (account) => account.combinedPublicKey === combinedPublicKey
    )[0];
    setCurrentAccountGlobal({
      publicKey: newAccount.publicKey,
      combinedPublicKey: newAccount.combinedPublicKey,
      reducedSecretKey: newAccount.reducedSecretKey,
      registered: newAccount.registered,
      accountAddress: newAccount.accountAddress,
    });
  };

  /**
   * checks if an account exists locally
   */
  const checkExistingAccounts = (): void => {
    let walletAccounts = getLocalAccounts();
    if (walletAccounts.length === 0) {
      createFirstAccount();
    } else {
      updateGlobalState(walletAccounts);
    }
  };

  /**
   * If no account is already present in the local storage
   * a new account is created for the user
   */
  const createFirstAccount = () => {
    const newKeys = getNewKeyPair();
    let newAccount: IWalletAccount = {
      publicKey: newKeys.publicKey,
      combinedPublicKey: newKeys.combinedPublicKey,
      reducedSecretKey: newKeys.reducedSecretKey,
      registered: false,
      accountAddress: null,
    };
    let walletAccounts = Array<IWalletAccount>();
    walletAccounts.push(newAccount);
    setLocalAccounts(walletAccounts);
  };

  /**
   * Explicitly creates a new account for the user on demand
   * @param walletAccount object with private and public key
   */
  const createNewAccount = (): void => {
    const newKeys = getNewKeyPair();
    let newAccount: IWalletAccount = {
      publicKey: newKeys.publicKey,
      combinedPublicKey: newKeys.combinedPublicKey,
      reducedSecretKey: newKeys.reducedSecretKey,
      registered: false,
      accountAddress: null,
    };
    let localAccounts = getLocalAccounts();
    localAccounts.push(newAccount);
    setLocalAccounts(localAccounts);
  };

  /**
   * Removes a reference to the account from local storage
   * if the last remaining account is deleted
   * then a new account is created
   * @param publicKey of the account to be deleted
   */
  const burnAccount = (combinedPublicKey: string): void => {
    let localAccounts = getLocalAccounts();
    let updatedAccounts = localAccounts.filter(
      (account) => account.combinedPublicKey !== combinedPublicKey
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
