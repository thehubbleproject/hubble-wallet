import React from "react";
import { createStore, StoreProvider } from "easy-peasy";

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
  return (
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
