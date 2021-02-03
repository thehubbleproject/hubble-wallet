import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { Dropdown, Loader } from "semantic-ui-react";
import useBls from "../../hooks/useBls";
import useCommander from "../../hooks/useCommander";
import { useStoreState } from "../../store/globalStore";

// hooks and services

// components, styles and UI

// interfaces
export interface L2balanceProps {}

const L2balance: React.FunctionComponent<L2balanceProps> = () => {
  const { currentAccount } = useStoreState((state) => state);
  const { solG2ToBytes } = useBls();
  const { getStateFromPubKey } = useCommander();

  const [balances, setBalances] = useState<any[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const parseBalancesForDropdown = (balances: any) => {
    return balances.map((balance: any) => ({
      key: balance.symbol,
      text: balance.symbol,
      value: balance.symbol,
    }));
  };

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

    setSelectedToken(balances[0].symbol);
    setBalances(balances);
  };

  const fetchSenderTokens = async () => {
    setIsFetching(true);
    try {
      const tokensArray = await getStateFromPubKey(
        solG2ToBytes(currentAccount.publicKey || ["", "", "", ""])
      );
      calculateTokenBalancesAtL2(tokensArray.states);
    } catch (error) {
      console.log(error);
    }
    setIsFetching(false);
  };

  useEffect(() => {
    fetchSenderTokens();
    // eslint-disable-next-line
  }, [currentAccount]);

  return (
    <>
      <div className="amount">
        {isFetching ? (
          <Loader inline active />
        ) : (
          <>
            <div className="value">
              {
                balances.filter((tokens) => tokens.symbol === selectedToken)[0]
                  .balance
              }
            </div>

            <div className="dropdown-container">
              <label>Select Token</label>
              <Dropdown
                className="dropdown-box"
                search
                selection
                options={parseBalancesForDropdown(balances)}
                defaultValue={parseBalancesForDropdown(balances)[0].value}
                onChange={(e, d) => setSelectedToken(`${d.value}`)}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default L2balance;
