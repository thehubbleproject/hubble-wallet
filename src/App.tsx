import React, { useEffect, useState } from "react";
import { createStore, StoreProvider } from "easy-peasy";
import * as mcl from "@thehubbleproject/bls/dist/mcl";
// hooks and services

// components, styles and UI
import "./App.css";
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
