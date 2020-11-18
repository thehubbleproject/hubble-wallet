import React, { useEffect, useState } from "react";
import useContracts from "../../hooks/useContracts";
import { useStoreActions, useStoreState } from "../../store/globalStore";
import { cleanDecimal } from "../../utils/utils";
import DepositTokenForm from "../Forms/DepositTokenForm";

// hooks and services

// components, styles and UI

// interfaces
export interface BalancesProps {}

const Balances: React.FunctionComponent<BalancesProps> = () => {
  const { connected, shouldUpdate } = useStoreState((state) => state);
  const { setShouldUpdate } = useStoreActions((action) => action);

  const { checkAllowance, checkBalance } = useContracts();

  const [balance, setBalance] = useState<number>(0);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);

  useEffect(() => {
    const checkStuff = async () => {
      if (connected) {
        let balance = await checkBalance();
        let allowance = await checkAllowance();

        let bal = balance > 0 ? cleanDecimal(balance / 10 ** 10, 3) : 0;
        setBalance(bal);
        setIsAllowed(allowance);
      }
    };

    checkStuff();
    // eslint-disable-next-line
  }, [connected]);

  useEffect(() => {
    const checkStuff = async () => {
      if (shouldUpdate) {
        let balance = await checkBalance();
        let allowance = await checkAllowance();

        let bal = balance > 0 ? cleanDecimal(balance / 10 ** 10, 3) : 0;
        setBalance(bal);
        setIsAllowed(allowance);
        setShouldUpdate(false);
      }
    };

    checkStuff();
    // eslint-disable-next-line
  }, [shouldUpdate]);

  return (
    <div className="balance">
      {!connected ? (
        <div className="not-connected">
          Connect to ethereum wallet to use the app
        </div>
      ) : (
        <>
          <h5>BALANCE</h5>

          <div className="amount">
            <div className="value">{balance}</div>
            <div className="name">TEST_HUBBLE</div>
          </div>

          <DepositTokenForm isAllowed={isAllowed} />
        </>
      )}
    </div>
  );
};

export default Balances;
