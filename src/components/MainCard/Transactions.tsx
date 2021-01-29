import React from "react";
import useTransactions from "../../hooks/useTransactions";
import TransactionItem from "./TransactionItem";

// hooks and services

// components, styles and UI

// interfaces
export interface TransactionsProps {}

const Transactions: React.FunctionComponent<TransactionsProps> = () => {
  const { getTransactions } = useTransactions();

  return (
    <div className="transactions">
      <h5>TRANSACTIONS (Latest 100)</h5>

      {getTransactions()
        .reverse()
        .map((tx: any) => {
          return (
            <TransactionItem
              hash={tx.hash}
              timestamp={tx.timestamp}
              amount={1}
              key={tx.hash}
            />
          );
        })}
    </div>
  );
};

export default Transactions;
