import React, { useEffect, useState } from "react";
import { Label } from "semantic-ui-react";
import useCommander from "../../hooks/useCommander";
import { formatAccountString } from "../../utils/utils";

// hooks and services

// components, styles and UI

// interfaces
export interface TransactionItemProps {
  hash: string;
  timestamp: number;
  amount: number;
}

const TransactionItem: React.FunctionComponent<TransactionItemProps> = ({
  hash,
  timestamp,
  amount,
}) => {
  const [status, setStatus] = useState<string>("pending");
  const [shouldFetch, setShouldFetch] = useState<boolean>(true);

  const { getTxStatus } = useCommander();

  const getStatusString = (statusCode: number) => {
    if (statusCode === 100) {
      return "pending";
    } else if (statusCode === 200) {
      return "pending";
    } else if (statusCode === 300) {
      return "processed";
    } else if (statusCode === 400) {
      return "reverted";
    }
    return "pending";
  };

  const getStatusColor = (status: string) => {
    if (status === "pending") {
      return "orange";
    } else if (status === "processed") {
      return "green";
    } else if (status === "reverted") {
      return "red";
    }
    return "orange";
  };

  useEffect(() => {
    const fetchStatus = async () => {
      setShouldFetch(false);
      try {
        const status = await getTxStatus(hash);
        setStatus(getStatusString(status.status));
      } catch (error) {}
    };

    if (shouldFetch && status !== "processed") {
      fetchStatus();
    }

    // eslint-disable-next-line
  }, [shouldFetch]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setShouldFetch(true);
    }, 5000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, []);

  const formatDate = (timestamp: number) => {
    var dt = new Date(timestamp);

    return `${(dt.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${dt
      .getDate()
      .toString()
      .padStart(2, "0")}/${dt
      .getFullYear()
      .toString()
      .padStart(4, "0")} ${dt
      .getHours()
      .toString()
      .padStart(2, "0")}:${dt
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${dt.getSeconds().toString().padStart(2, "0")}`;
  };

  return (
    <div className="records">
      <div className="hash">
        <strong>{formatAccountString(hash)}</strong>
      </div>
      <div className="date">{formatDate(timestamp)}</div>
      <div className="amount">{amount}</div>
      <div className="id">
        <Label
          style={{ width: "5rem", textAlign: "center", opacity: "0.7" }}
          color={getStatusColor(status)}
          size="tiny"
        >
          {status.toUpperCase()}
        </Label>
      </div>
    </div>
  );
};

export default TransactionItem;
