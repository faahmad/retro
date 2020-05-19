import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { OptimizelyProvider, createInstance, setLogger } from "@optimizely/react-sdk";
import { useAuthContext } from "./contexts/AuthContext";
import { Navbar } from "./components/Navbar";
import { DesignPage } from "./pages/DesignPage";
import { FAQPage } from "./pages/FAQPage";
import { LandingPage } from "./pages/LandingPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { LoadingText } from "./components/LoadingText";
import { RetroBoardPage } from "./pages/RetroBoardPage";
import { SettingsPage } from "./pages/SettingsPage";

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
          <OptimizelyProvider optimizely={optimizely} user={{ id: authAccount.uid }}>
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
      <Route exact path="/faq" component={FAQPage} />
      <Route exact path="/design" component={DesignPage} />
    </React.Fragment>
  );
};

const USER_QUERY = gql`
  query Workspace {
    user {
      workspace {
        id
        url
      }
    }
  }
`;

const AuthenticatedAppRoutes: React.FC = () => {
  const { data, loading } = useQuery(USER_QUERY);

  if (loading) {
    return <LoadingText>Loading...</LoadingText>;
  }

  // Sometimes we have a race condition where the user isn't created
  // in the database before we hit this page. In that case, we simply
  // refresh the browswer and the user should be created by then.
  if (!data || !data.user) {
    window.location.replace("/");
  }

  const { workspace } = data.user;
  return (
    <React.Fragment>
      <Route exact path="/onboarding" component={OnboardingPage} />
      <Route
        exact
        path="/workspaces/:workspaceId/teams/:teamId/retros/:retroId"
        component={RetroBoardPage}
      />
      <Route exact path="/workspaces/:workspaceId/settings" component={SettingsPage} />
      <Route exact path="/workspaces/:workspaceId" component={DashboardPage} />

      {!workspace && <Redirect to="/onboarding" />}
      {/* {workspace && <Redirect to={`/workspaces/${data.user.workspace.id}`} />} */}
    </React.Fragment>
  );
};
