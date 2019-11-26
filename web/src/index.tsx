import "./styles/index.css";
import React from "react";
import ReactDOM from "react-dom";
import { AppRoutes } from "./AppRoutes";
import * as serviceWorker from "./serviceWorker";
import { createInstance, OptimizelyProvider } from "@optimizely/react-sdk";

const optimizely = createInstance({
  sdkKey: process.env.REACT_APP_OPTIMIZELY_SDK_KEY
});

ReactDOM.render(
  <OptimizelyProvider
    optimizely={optimizely}
    user={{
      id: "test_user"
    }}
  >
    <AppRoutes />
  </OptimizelyProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
