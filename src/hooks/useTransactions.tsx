import { useStoreState } from "../store/globalStore";

const useTransactions = () => {
  const currentAccount = useStoreState((state) => state.currentAccount);

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
  };
};

export default useTransactions;
