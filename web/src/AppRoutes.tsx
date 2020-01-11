import React from "react";
import { Switch, BrowserRouter, Route } from "react-router-dom";
import {
  OptimizelyProvider,
  createInstance,
  setLogger
} from "@optimizely/react-sdk";
import { useAuthContext } from "./contexts/AuthContext";
import { Navbar } from "./components/Navbar";
import { LandingPage } from "./pages/LandingPage";
import { CreateWorkspacePage } from "./pages/CreateWorkspacePage";
import { DashboardPage } from "./pages/DashboardPage";

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
      <div className="mt-8 w-4/5 max-w-6xl m-auto">
        <Navbar />
      </div>
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
      <Route exact path="/" component={DashboardPage} />
      <Route exact path="/workspace/create" component={CreateWorkspacePage} />
    </React.Fragment>
  );
};
