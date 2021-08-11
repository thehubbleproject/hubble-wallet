import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
// import Web3 from "web3";
import { Dropdown, Loader } from "semantic-ui-react";
import useBls from "../../hooks/useBls";
import useCommander from "../../hooks/useCommander";
import { useStoreState } from "../../store/globalStore";
import { millify } from "millify";

// hooks and services

// components, styles and UI

// interfaces
export interface L2balanceProps {}
export interface Balance {
  symbol: string;
  balance: string;
}

const L2balance: React.FunctionComponent<L2balanceProps> = () => {
  const { currentAccount } = useStoreState((state) => state);
  const { hashPublicKeys } = useBls();
  const { getStatesFromPubKey } = useCommander();

  const [balances, setBalances] = useState<Balance[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const parseBalancesForDropdown = (balances: Balance[]) => {
    return balances.map((balance: Balance) => ({
      key: balance.symbol,
      text: balance.symbol,
      value: balance.symbol,
    }));
  };

  const calculateTokenBalancesAtL2 = (
    allTokens: {
      balance: string;
      nonce: number;
      stateId: number;
      tokenId: number;
    }[]
  ) => {
    const uniqueTokens = Array.from(
      new Set(allTokens.map((item) => item.tokenId))
    );

    let balances: Balance[] = [];

    uniqueTokens.forEach((uniqueToken) => {
      let balanceItems = allTokens.filter(
        (item) => item.tokenId === uniqueToken
      );

      let sum = ethers.BigNumber.from("0");
      balanceItems.forEach((item) => {
        sum = sum.add(ethers.BigNumber.from(item.balance));
      });

      balances.push({
        symbol: uniqueToken.toString(),
        balance: sum.toString(),
      });
    });

    setSelectedToken(balances[0].symbol);
    setBalances(balances);
  };

  const fetchSenderTokens = async () => {
    setIsFetching(true);
    try {
      const tokensArray = await getStatesFromPubKey(
        hashPublicKeys(currentAccount.publicKey)
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
        ) : balances.length === 0 ? (
          <div className="value">No records</div>
        ) : (
          <>
            <div className="value">
              {millify(
                parseFloat(
                  ethers.utils.formatUnits(
                    balances.filter(
                      (tokens) => tokens.symbol === selectedToken
                    )[0].balance,
                    9
                  )
                ),
                { precision: 4 }
              )}
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
