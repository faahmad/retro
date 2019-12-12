import React from "react";
import { Switch, BrowserRouter, Route } from "react-router-dom";

import { LandingPage } from "./pages/LandingPage";
import {
  OptimizelyProvider,
  createInstance,
  setLogger
} from "@optimizely/react-sdk";
import { useAuthContext } from "./contexts/AuthContext";

const optimizely = createInstance({
  sdkKey: process.env.REACT_APP_OPTIMIZELY_SDK_KEY
});
if (process.env.NODE_ENV === "production") {
  setLogger(null);
}

export const AppRoutes: React.FC = () => {
  const authAccount = useAuthContext();

  return (
    <OptimizelyProvider optimizely={optimizely}>
      <BrowserRouter>
        <Switch>
          {authAccount ? (
            <AuthenticatedAppRoutes />
          ) : (
            <UnauthenticatedAppRoutes />
          )}
        </Switch>
      </BrowserRouter>
    </OptimizelyProvider>
  );
};

const UnauthenticatedAppRoutes: React.FC = () => {
  return (
    <React.Fragment>
      <Route exact path="/" component={LandingPage} />
    </React.Fragment>
  );
};

const AuthenticatedAppRoutes: React.FC = () => {
  return (
    <React.Fragment>
      <Route exact path="/" render={() => <div>You're logged in!</div>} />
    </React.Fragment>
  );
};
