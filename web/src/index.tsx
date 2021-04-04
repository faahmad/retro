import "./styles/index.css";
import { apolloClient } from "./lib";
import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import { AppRoutes } from "./AppRoutes";
import * as serviceWorker from "./serviceWorker";
import { CurrentUserProvider } from "./contexts/CurrentUserContext";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN
});

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <CurrentUserProvider>
      <AppRoutes />
    </CurrentUserProvider>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
