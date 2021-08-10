import { useStoreState } from "../store/globalStore";
import { State } from "../utils/interfaces";

/**
 * provides utilities to create transaction objects to submit
 */
const useTransactions = () => {
  const currentAccount = useStoreState((state) => state.currentAccount);

  /**
   * splits the amount among different states and
   * returns a mapping state -> balance
   *
   * - case 1 - enough balance in single state:
   *
   * returns a single mapping of state and balance
   *
   * - case 2 - enough balance in multiple states:
   *
   * returns an array of mappings which includes how much
   * amount should be taken from which state
   *
   * - case 3 - amount exceeds the total balance of all the states combined:
   *
   * returns empty array
   *
   * @param amount amount to send
   * @param states array of states with respective balances
   */
  const splitTransactions = (amount: number, states: State[]) => {
    let transactions = [];
    let remaininingAmount = amount;

    try {
      // 1. sort the state by ID
      let states_sorted = states.sort(
        (a, b) => Number(b.balance) - Number(a.balance)
      );

      while (remaininingAmount > 0) {
        // 2. check if the amount can be reduced from first account
        let currentState = states_sorted[0];

        let amountPossible = 0;
        // 3.1 check if amount can be reduced
        if (Number(currentState.balance) > amount) {
          amountPossible = remaininingAmount;
        } else {
          amountPossible = Math.min(
            Number(currentState.balance),
            remaininingAmount
          );
          // 3.2 calculate difference
        }

        let transaction_N = {
          amountPossible,
          stateId: currentState.stateId,
          nonce: currentState.nonce,
        };

        transactions.push(transaction_N);
        remaininingAmount -= amountPossible;

        // 4. remove the current state from array
        states_sorted.shift();
      }
      // 5. return if amount is 0

      return transactions;
    } catch (error) {
      return [];
    }
  };

  /**
   * saves transaction hashes to localstorage
   * the list is then fetched to show the status of the tx
   *
   * saves a maximum of 100 latest transactions performed
   *
   * @param hash transaction hash from API
   */
  const saveTransactionToLocalStorage = (hash: string) => {
    const transactionHistoryJSON = localStorage.getItem(
      "transactionHistoryJSON"
    );

    let transactionHistory;
    if (transactionHistoryJSON === null) {
      localStorage.setItem("transactionHistoryJSON", JSON.stringify([]));
      transactionHistory = [];
    } else {
      transactionHistory = JSON.parse(transactionHistoryJSON);
    }

    if (transactionHistory.length > 100) {
      transactionHistory.shift();
    }

    transactionHistory.push({
      hash,
      publicKey: currentAccount.hubbleAddress,
      timestamp: +new Date(),
    });

    localStorage.setItem(
      "transactionHistoryJSON",
      JSON.stringify(transactionHistory)
    );
  };

  /**
   * fetches the list of transaction hashes saved in the localstorage
   */
  const getTransactions = () => {
    const transactionHistoryJSON = localStorage.getItem(
      "transactionHistoryJSON"
    );

    if (transactionHistoryJSON === null) {
      return [];
    } else {
      let transactionHistory = JSON.parse(transactionHistoryJSON);
      return transactionHistory.filter(
        (history: any) => history.publicKey === currentAccount.hubbleAddress
      );
    }
  };

  return {
    saveTransactionToLocalStorage,
    getTransactions,
    splitTransactions,
  };
};

export default useTransactions;
