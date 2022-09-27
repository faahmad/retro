import "./styles/index.css";
import React from "react";
import ReactDOM from "react-dom";
import { AppRoutes } from "./AppRoutes";
import * as serviceWorker from "./serviceWorker";
import { CurrentUserProvider } from "./contexts/CurrentUserContext";
import * as Sentry from "@sentry/react";
import * as FullStory from "@fullstory/browser";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN
});
FullStory.init({
  orgId: process.env.REACT_APP_FS_ORG_ID as string,
  devMode: process.env.NODE_ENV === "development"
});

ReactDOM.render(
  <CurrentUserProvider>
    <AppRoutes />
  </CurrentUserProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
