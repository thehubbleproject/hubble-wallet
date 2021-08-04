import React, { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import Authereum from "authereum";
import WalletConnectProvider from "@walletconnect/web3-provider";

// hooks and services
import { Button } from "semantic-ui-react";
import { formatAccountString } from "../../utils/utils";
import { useStoreActions, useStoreState } from "../../store/globalStore";
import Tabs from "./Tabs";
import { ethers } from "ethers";

// components, styles and UI

// interfaces
export interface EthereumAccountCardProps {}

const EthereumAccountCard: React.FunctionComponent<EthereumAccountCardProps> =
  () => {
    const { setAccount, setNetwork, setConnected } = useStoreActions(
      (actions) => actions
    );

    const { network, connected } = useStoreState((state) => state);

    const [address, setAddress] = useState<string>("");

    let provider;

    let providerOptions = {
      metamask: {
        id: "injected",
        name: "MetaMask",
        type: "injected",
        check: "isMetaMask",
        package: null,
      },
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "INFURA_ID",
          network: "rinkeby",
          qrcodeModalOptions: {
            mobileLinks: [
              "rainbow",
              "metamask",
              "argent",
              "trust",
              "imtoken",
              "pillar",
            ],
          },
        },
      },
      authereum: {
        package: Authereum,
      },
    };

    const web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions,
    });

    const resetApp = async () => {
      await web3Modal.clearCachedProvider();
      setAccount(new ethers.VoidSigner(""));
      setNetwork("");
      setConnected(false);
    };

    const subscribeProvider = async (provider: any) => {
      if (!provider.on) {
        return;
      }
      provider.on("close", () => resetApp());
      provider.on("accountsChanged", async (accounts: string[]) => {
        const web3provider = new ethers.providers.Web3Provider(provider);
        const account = await web3provider.getSigner();
        await setAccount(account);
        setAddress(await account.getAddress());
      });
    };

    const onConnect = async () => {
      provider = await web3Modal.connect();
      await subscribeProvider(provider);
      const web3provider = new ethers.providers.Web3Provider(provider);

      const account = await web3provider.getSigner();
      const network = await web3provider.getNetwork();

      await setAccount(account);
      setAddress(await account.getAddress());
      await setNetwork(network.name);
      await setConnected(true);
    };

    useEffect(() => {
      if (web3Modal.cachedProvider) {
        onConnect();
      }
      // eslint-disable-next-line
    }, []);

    return (
      <div className="main-card-right">
        <div className="header">
          <div className="account-details">
            <h4>Ethereum Account</h4>
            {connected ? (
              <p>
                ({network}) {formatAccountString(address)}
              </p>
            ) : (
              <p>Wallet not connected</p>
            )}
          </div>

          <Button
            onClick={connected ? resetApp : onConnect}
            className="custom-button"
            content={connected ? "Disconnect" : "connect wallet"}
            size="small"
            compact
          />
        </div>

        <Tabs />
      </div>
    );
  };

export default EthereumAccountCard;
