import "./styles/index.css";
import React from "react";
import ReactDOM from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import {
  createInstance,
  OptimizelyProvider,
  setLogger
} from "@optimizely/react-sdk";
import { AppRoutes } from "./AppRoutes";
import * as serviceWorker from "./serviceWorker";

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI
});

const optimizely = createInstance({
  sdkKey: process.env.REACT_APP_OPTIMIZELY_SDK_KEY
});
if (process.env.NODE_ENV === "production") {
  setLogger(null);
}

ReactDOM.render(
  <OptimizelyProvider
    optimizely={optimizely}
    user={{
      id: "test_user"
    }}
  >
    <ApolloProvider client={client}>
      <AppRoutes />
    </ApolloProvider>
  </OptimizelyProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
