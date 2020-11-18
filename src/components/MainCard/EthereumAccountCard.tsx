import React, { useEffect } from "react";
import Web3Modal from "web3modal";
import Web3 from "web3";

// hooks and services
import { Button } from "semantic-ui-react";
import { formatAccountString } from "../../utils/utils";
import Balances from "./Balances";
import { useStoreActions, useStoreState } from "../../store/globalStore";
import useContracts from "../../hooks/useContracts";

// components, styles and UI

// interfaces
export interface EthereumAccountCardProps {}

const EthereumAccountCard: React.FunctionComponent<EthereumAccountCardProps> = () => {
  const { setAccount, setNetwork, setWeb3, setConnected } = useStoreActions(
    (actions) => actions
  );

  const { web3, account, network, connected, currentAccount } = useStoreState(
    (state) => state
  );

  const { createNewBLSAccountRegistry } = useContracts();

  const providerOptions = {};
  const web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions,
  });

  const resetApp = async () => {
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await web3Modal.clearCachedProvider();
    setAccount("");
    setWeb3(null);
    setNetwork("");
    setConnected(false);
  };

  const subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return;
    }
    provider.on("close", () => resetApp());
    provider.on("accountsChanged", async (accounts: string[]) => {
      await setAccount(accounts[0]);
    });
  };

  const onConnect = async () => {
    const provider = await web3Modal.connect();
    await subscribeProvider(provider);
    const web3: any = new Web3(provider);

    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];
    const network = await web3.eth.net.getNetworkType();

    await setWeb3(web3);
    await setAccount(address);
    await setNetwork(network);
    await setConnected(true);
  };

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      onConnect();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!currentAccount.registered && web3 && account) {
      let pkey = currentAccount.publicKey || ["", "", "", ""];
      createNewBLSAccountRegistry(pkey);
    }
    // eslint-disable-next-line
  }, [web3, connected, currentAccount]);

  return (
    <div className="main-card-right">
      <div className="header">
        <div className="account-details">
          <h4>Ethereum Account</h4>
          {connected ? (
            <p>
              ({network}) {formatAccountString(account)}
            </p>
          ) : (
            <p>Wallet not connected</p>
          )}
        </div>

        <Button
          onClick={connected ? resetApp : onConnect}
          className="customButton"
          content={connected ? "disconnect" : "connect wallet"}
          size="small"
          compact
        />
      </div>

      <Balances />
    </div>
  );
};

export default EthereumAccountCard;
