import React, { useEffect, useState } from "react";

// hooks and services
import { useStoreActions, useStoreState } from "../../store/globalStore";
import useContracts from "../../hooks/useContracts";
import tokenRepo from "../../utils/tokens";

// components, styles and UI
import DepositTokenForm from "../Forms/DepositTokenForm";
import { Dropdown, Loader } from "semantic-ui-react";

// interfaces
export interface L1balanceProps {}

const L1balance: React.FunctionComponent<L1balanceProps> = () => {
  const { checkAllowance, checkBalance } = useContracts();

  const { setShouldUpdate } = useStoreActions((action) => action);
  const { connected, shouldUpdate } = useStoreState((state) => state);

  const [selectedToken, setSelectedToken] = useState<string>(
    tokenRepo[0].address
  );
  const [balance, setBalance] = useState<number | string | null>(null);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);

  const parseBalancesForDropdown = (tokenRepo: any) => {
    return tokenRepo.map((token: any) => ({
      key: token.address,
      text: token.symbol,
      value: token.address,
    }));
  };

  useEffect(() => {
    const checkAllowanceAndBalance = async () => {
      if (connected) {
        let balance = await checkBalance();
        let allowance = await checkAllowance(selectedToken);

        setBalance(balance);
        setIsAllowed(allowance);
      }
    };

    checkAllowanceAndBalance();
    // eslint-disable-next-line
  }, [connected]);

  useEffect(() => {
    const checkAllowanceAndBalance = async () => {
      if (shouldUpdate) {
        let balance = await checkBalance();
        let allowance = await checkAllowance(selectedToken);

        setBalance(balance);
        setIsAllowed(allowance);
        setShouldUpdate(false);
      }
    };

    checkAllowanceAndBalance();
    // eslint-disable-next-line
  }, [shouldUpdate]);

  return !connected ? (
    <p>Connect wallet to see L1 balance and make deposits</p>
  ) : (
    <>
      <div className="amount">
        {balance === null ? (
          <Loader inline active />
        ) : (
          <>
            <div className="value">
              {parseFloat(balance.toString()).toFixed(2)}
            </div>
            <div className="dropdown-container">
              <label>Select Token</label>
              <Dropdown
                className="dropdown-box"
                search
                selection
                options={parseBalancesForDropdown(tokenRepo)}
                defaultValue={parseBalancesForDropdown(tokenRepo)[0].value}
                onChange={(e, d) => setSelectedToken(`${d.value}`)}
              />
            </div>
          </>
        )}
      </div>

      <DepositTokenForm
        isAllowed={isAllowed}
        symbol={
          tokenRepo.filter((token) => token.address === selectedToken)[0].symbol
        }
      />
    </>
  );
};

export default L1balance;
