import { useStoreActions } from "../store/globalStore";

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

  const randomString = (length: number): string => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const getKeyPair = (): IWalletAccount => {
    return {
      privateKey: "0x" + randomString(128),
      publicKey: "0x" + randomString(32),
    };
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
    const newAccount = getKeyPair();
    let walletAccounts = Array<IWalletAccount>();
    walletAccounts.push(newAccount);
    setLocalAccounts(walletAccounts);
  };

  /**
   * Explicitly creates a new account for the user on demand
   * @param walletAccount object with private and public key
   */
  const createNewAccount = (): void => {
    const newAccount = getKeyPair();
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
