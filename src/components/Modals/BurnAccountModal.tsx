import React from "react";
import Swal from "sweetalert2";

// hooks and services
import { useStoreState } from "../../store/globalStore";
import useWalletAccounts from "../../hooks/useWalletAccounts";

// components, styles and UI
import { Button } from "semantic-ui-react";

const BurnAccountModal: React.FunctionComponent = () => {
  const { burnAccount } = useWalletAccounts();
  const currentAccount = useStoreState((state) => state.currentAccount);

  const handleCloseAccountRequest = () => {
    Swal.fire({
      title: "Close local account",
      text:
        "You won't be able to recover the account or funds unless you copy the secret key",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, close it!",
      cancelButtonText: "Abort",
    }).then((result) => {
      if (result.value) {
        burnAccount(currentAccount.hubbleAddress);
        Swal.fire("Account Deleted", "", "success");
      }
    });
  };

  return (
    <Button
      className="custom-button burn"
      content="delete account"
      icon="close"
      labelPosition="left"
      fluid
      size="large"
      onClick={handleCloseAccountRequest}
    />
  );
};

export default BurnAccountModal;
