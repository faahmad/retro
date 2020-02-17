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
import { OnboardingPage } from "./pages/OnboardingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ROUTES } from "./constants/routes";

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
      <Route
        exact
        path={ROUTES.UNAUTHENTICATED.LANDING_PAGE}
        component={LandingPage}
      />
    </React.Fragment>
  );
};

const AuthenticatedAppRoutes: React.FC = () => {
  return (
    <React.Fragment>
      <Route
        exact
        path={ROUTES.AUTHENTICATED.DASHBOARD_PAGE}
        component={DashboardPage}
      />
      <Route
        exact
        path={ROUTES.AUTHENTICATED.ONBOARDING_PAGE}
        component={OnboardingPage}
      />
    </React.Fragment>
  );
};
