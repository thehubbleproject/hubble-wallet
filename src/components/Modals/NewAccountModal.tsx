import React from "react";
import Swal from "sweetalert2";

// hooks and services
import useWalletAccounts from "../../hooks/useWalletAccounts";

// components, styles and UI
import { Button } from "semantic-ui-react";

const NewAccountModal: React.FunctionComponent = () => {
  const { createNewAccount } = useWalletAccounts();

  const handleNewAccountRequest = () => {
    Swal.fire({
      title: "Create new local account",
      text:
        "Do not store high volume on this wallet as it is volatile and risky",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, create it!",
      cancelButtonText: "Abort",
    }).then((result) => {
      if (result.value) {
        createNewAccount();
        Swal.fire("Success!", "Add funds to your new account", "success");
      }
    });
  };

  return (
    <Button
      className="custom-button new"
      content="new BLS account"
      icon="plus"
      fluid
      labelPosition="left"
      size="large"
      onClick={handleNewAccountRequest}
    />
  );
};

export default NewAccountModal;
