import { useStoreState } from "../store/globalStore";

const useTransactions = () => {
  const currentAccount = useStoreState((state) => state.currentAccount);

  const splitTransactions = (amount: number, states: any[]) => {
    let transactions = [];
    let remaininingAmount = amount;

    try {
      // 1. sort the state by ID
      let states_sorted = states.sort((a, b) => b.balance - a.balance);

      while (remaininingAmount > 0) {
        // 2. check if the amount can be reduced from first account
        let currentState = states_sorted[0];

        let amountPossible = 0;
        // 3.1 check if amount can be reduced
        if (currentState.balance > amount) {
          amountPossible = remaininingAmount;
        } else {
          amountPossible = Math.min(currentState.balance, remaininingAmount);
          // 3.2 calculate difference
        }

        let transaction_N = {
          amountPossible,
          state_id: currentState.state_id,
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

  const createTransaction = (hash: string) => {
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
    createTransaction,
    getTransactions,
    splitTransactions,
  };
};

export default useTransactions;
