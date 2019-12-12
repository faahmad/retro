import "./styles/index.css";
import React from "react";
import ReactDOM from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import firebase from "firebase/app";
import { AppRoutes } from "./AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import * as serviceWorker from "./serviceWorker";

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
});

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI
});

ReactDOM.render(
  <AuthProvider>
    <ApolloProvider client={client}>
      <AppRoutes />
    </ApolloProvider>
  </AuthProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
