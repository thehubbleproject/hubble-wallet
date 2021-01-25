import React, { useEffect, useState } from "react";
import { createStore, StoreProvider } from "easy-peasy";
import * as mcl from "react-hubble-bls/dist/mcl";
import { keccak256 } from "ethers/lib/utils";
// import axios from "axios";

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
      const DOMAIN_HEX = keccak256("0x1234ABCD");
      mcl.setDomainHex(DOMAIN_HEX);
      setLoading(false);
    };

    initializeMcl();
  }, []);

  //   useEffect(() => {
  //     const test = async () => {
  //       const data = await axios.get("http://135.181.199.78:3000/user/state/1");
  //       console.log(data);
  //     };

  //     test();
  //   }, []);

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
      {/* <div>Test</div> */}
    </StoreProvider>
  );
};

export default App;
