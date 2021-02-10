import React, { useEffect, useState } from "react";

// hooks and services
import { createStore, StoreProvider } from "easy-peasy";
import * as mcl from "@thehubbleproject/bls/dist/mcl";

// components, styles and UI
import Initializing from "./components/MainCard/Initializing";
import EthereumAccountCard from "./components/MainCard/EthereumAccountCard";
import BLSAccountCard from "./components/MainCard/BLSAccountCard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "semantic-ui-css/semantic.min.css";
import "./App.css";

// store
import globalStore, { IGlobalStore } from "./store/globalStore";
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
        <ToastContainer />
      </div>
    </StoreProvider>
  );
};

export default App;
