import React, { useEffect, useState } from "react";
import { createStore, StoreProvider } from "easy-peasy";
import * as mcl from "react-hubble-bls/dist/mcl";
import { keccak256 } from "ethers/lib/utils";

// hooks and services

// components, styles and UI
import "./app.css";
import "semantic-ui-css/semantic.min.css";
import AccountActions from "./components/MainCard/AccountActions";
import AccountDetails from "./components/MainCard/AccountDetails";

// store
import globalStore, { IGlobalStore } from "./store/globalStore";
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
    <div>Initializing</div>
  ) : (
    <StoreProvider store={store}>
      <div className="App">
        <div className="MainCard">
          <AccountActions />
          <AccountDetails />
        </div>
      </div>
    </StoreProvider>
  );
};

export default App;
