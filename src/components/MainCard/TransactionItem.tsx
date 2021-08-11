import React, { useEffect, useState } from "react";
import { Label } from "semantic-ui-react";
import useCommander from "../../hooks/useCommander";
import { Status } from "../../utils/interfaces";
import { formatAccountString } from "../../utils/utils";

// hooks and services

// components, styles and UI

// interfaces
export interface TransactionItemProps {
  hash: string;
  message: string;
  timestamp: number;
  amount: number;
}

const TransactionItem: React.FunctionComponent<TransactionItemProps> = ({
  hash,
  message,
  timestamp,
  amount,
}) => {
  const [status, setStatus] = useState<string>("pending");
  const [shouldFetch, setShouldFetch] = useState<boolean>(true);

  const { getTxStatus } = useCommander();

  const getStatusString = (statusCode: Status) => {
    if (statusCode === Status.Pending) {
      return "pending";
    } else if (statusCode === Status.Submitted) {
      return "submitted";
    } else if (statusCode === Status.Finalized) {
      return "processed";
    } else if (statusCode === Status.Failed) {
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
        const status = await getTxStatus(message);
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

    return `${(dt.getMonth() + 1).toString().padStart(2, "0")}/${dt
      .getDate()
      .toString()
      .padStart(2, "0")}/${dt.getFullYear().toString().padStart(4, "0")} ${dt
      .getHours()
      .toString()
      .padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}:${dt
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="records">
      <div className="hash">
        <strong>{formatAccountString(hash)}</strong>
      </div>
      <div className="date">{formatDate(timestamp)}</div>
      <div className="amount"></div>
      <div className="id">
        <Label
          style={{ width: "5.5rem", textAlign: "center", opacity: "0.7" }}
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
