import React, { useEffect, useState } from "react";
import { createStore, StoreProvider } from "easy-peasy";
import * as mcl from "react-hubble-bls/dist/mcl";
import { keccak256 } from "ethers/lib/utils";

// hooks and services

// components, styles and UI
import "./app.css";
import "semantic-ui-css/semantic.min.css";
import BLSAccountCard from "./components/MainCard/BLSAccountCard";
import EthereumAccountCard from "./components/MainCard/EthereumAccountCard";

// store
import globalStore, { IGlobalStore } from "./store/globalStore";
import Initializing from "./components/MainCard/Initializing";
const store = createStore<IGlobalStore>(globalStore);

const App: React.FunctionComponent = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeMcl = async () => {
      await mcl.init();
      const DOMAIN_HEX = keccak256("0x1234ABCD");
      mcl.setDomainHex(DOMAIN_HEX);
      setLoading(false);
    };

    initializeMcl();
  }, []);

  return loading ? (
    <Initializing />
  ) : (
    <StoreProvider store={store}>
      <div className="App">
        <div className="main-card">
          <BLSAccountCard />
          <EthereumAccountCard />
        </div>
      </div>
    </StoreProvider>
  );
};

export default App;
