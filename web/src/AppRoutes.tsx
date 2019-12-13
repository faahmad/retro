import React from "react";
import { Switch, BrowserRouter, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import {
  OptimizelyProvider,
  createInstance,
  setLogger
} from "@optimizely/react-sdk";
import { useAuthContext } from "./contexts/AuthContext";

// TODO: Remove these before merging.
import { Button } from "./components/Button";
import { AuthService } from "./services/auth-service";
const _DevelopmentOnlyLoggedInPage = () => {
  return (
    <div className="flex flex-col flex-1 h-screen items-center justify-center">
      <h1 className="mb-2">You're logged in!</h1>
      <Button className="text-red" onClick={() => AuthService.logOut()}>
        Log Out
      </Button>
    </div>
  );
};
//==================================

const optimizely = createInstance({
  sdkKey: process.env.REACT_APP_OPTIMIZELY_SDK_KEY
});
if (process.env.NODE_ENV === "production") {
  setLogger(null);
}

export const AppRoutes: React.FC = () => {
  const authAccount = useAuthContext();

  return (
    <BrowserRouter>
      <Switch>
        {authAccount ? (
          <OptimizelyProvider
            optimizely={optimizely}
            user={{ id: authAccount.uid }}
          >
            <AuthenticatedAppRoutes />
          </OptimizelyProvider>
        ) : (
          <UnauthenticatedAppRoutes />
        )}
      </Switch>
    </BrowserRouter>
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
      <Route exact path="/" component={_DevelopmentOnlyLoggedInPage} />
    </React.Fragment>
  );
};
