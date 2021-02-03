import React, { useEffect, useState } from "react";
import Web3 from "web3";

// hooks and services
import useContracts from "../../hooks/useContracts";
import { useStoreActions, useStoreState } from "../../store/globalStore";

// components, styles and UI
import DepositTokenForm from "../Forms/DepositTokenForm";
import { Radio } from "semantic-ui-react";
import useCommander from "../../hooks/useCommander";
import useBls from "../../hooks/useBls";
import tokenRepo from "../../utils/tokens";

// interfaces
export interface BalancesProps {}

const Balances: React.FunctionComponent<BalancesProps> = () => {
  const { connected, shouldUpdate, currentAccount } = useStoreState(
    (state) => state
  );
  const { setShouldUpdate } = useStoreActions((action) => action);

  const { checkAllowance, checkBalance } = useContracts();
  const { solG2ToBytes } = useBls();
  const { getStateFromPubKey } = useCommander();

  const [balance, setBalance] = useState<number | string>(0);
  const [l2balances, setL2Balances] = useState<any[]>([]);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);

  const [isL1, setisL1] = useState<boolean>(true);
  const [selectedToken, setSelectedToken] = useState<string>(
    tokenRepo[0].address
  );
  const [selectedL2Token, setSelectedL2Token] = useState<string>("0");

  const calculateTokenBalancesAtL2 = (
    allTokens: {
      balance: number;
      nonce: number;
      state_id: number;
      token_id: number;
    }[]
  ) => {
    const uniqueTokens = Array.from(
      new Set(allTokens.map((item) => item.token_id))
    );

    let balances: { symbol: string; balance: string }[] = [];

    uniqueTokens.forEach((uniqueToken) => {
      let balanceItems = allTokens.filter(
        (item) => item.token_id === uniqueToken
      );

      let sum = balanceItems.reduce((a: any, b: any) => a.balance + b.balance);
      balances.push({
        symbol: uniqueToken.toString(),
        balance: Web3.utils.fromWei(sum.toString()),
      });
    });

    setL2Balances(balances);
  };

  const fetchSenderTokens = async () => {
    try {
      const tokensArray = await getStateFromPubKey(
        solG2ToBytes(currentAccount.publicKey || ["", "", "", ""])
      );
      calculateTokenBalancesAtL2(tokensArray.states);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isL1 === false) {
      fetchSenderTokens();
    }
    // eslint-disable-next-line
  }, [isL1]);

  useEffect(() => {
    const checkStuff = async () => {
      if (connected) {
        let balance = await checkBalance();
        let allowance = await checkAllowance(selectedToken);

        setBalance(balance);
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
        let allowance = await checkAllowance(selectedToken);

        setBalance(balance);
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
          <div className="balance-header">
            <h5>BALANCE</h5>
            <div className="balance-toggle">
              <span>L1</span>
              <Radio toggle onChange={() => setisL1(!isL1)} />
              <span>L2</span>
            </div>
          </div>

          {isL1 ? (
            <>
              <div className="amount">
                <div className="value">
                  {parseFloat(balance.toString()).toFixed(2)}
                </div>
                <div className="">
                  <select
                    name="accounts"
                    id="accounts"
                    className="select"
                    value={selectedToken}
                    onChange={(e) => {
                      setSelectedToken(e.target.value);
                      setShouldUpdate(true);
                    }}
                  >
                    {tokenRepo.map((token) => (
                      <option key={token?.address} value={token?.address}>
                        {token.symbol}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : (
            <div className="amount">
              <div className="value">{selectedL2Token}</div>
              <div className="">
                <select
                  name="accounts"
                  id="accounts"
                  className="select"
                  value={selectedToken}
                  onChange={(e) => {
                    console.log(e.target.value);
                  }}
                >
                  {l2balances.map((token) => (
                    <option key={token?.symbol} value={token?.symbol}>
                      {token.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <DepositTokenForm
            isAllowed={isAllowed}
            symbol={
              tokenRepo.filter((token) => token.address === selectedToken)[0]
                .symbol
            }
          />
        </>
      )}
    </div>
  );
};

export default Balances;
