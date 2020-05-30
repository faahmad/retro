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
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsOfServicePage } from "./pages/TermsOfServicePage";
import { SubscriptionStatusProvider } from "./contexts/SubscriptionStatusContext";
import { PageContainer } from "./components/PageContainer";
import { Button } from "./components/Button";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

const optimizely = createInstance({
  sdkKey: process.env.REACT_APP_OPTIMIZELY_SDK_KEY
});
if (process.env.NODE_ENV === "production") {
  setLogger(null);
}

export const AppRoutes: React.FC = () => {
  const authAccount = useAuthContext();

  return (
    <OptimizelyProvider
      optimizely={optimizely}
      /**
       * 🤔
       * (property) id: string
       * Type 'string | null' is not assignable to type 'string'.
       * Type 'null' is not assignable to type 'string'. ts(2322)
       */
      // @ts-ignore
      user={{ id: authAccount ? authAccount.uid : null }}
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <BrowserRouter>
          <div className="mt-8 w-4/5 max-w-6xl m-auto">
            <Navbar />
          </div>
          <Switch>
            <Route exact path="/privacy" component={PrivacyPolicyPage} />
            <Route exact path="/terms" component={TermsOfServicePage} />
            <Route exact path="/faq" component={FAQPage} />
            <Route exact path="/design" component={DesignPage} />
            {authAccount ? <AuthenticatedAppRoutes /> : <UnauthenticatedAppRoutes />}
          </Switch>
        </BrowserRouter>
      </ErrorBoundary>
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

  const { workspace } = data.user;
  return (
    <SubscriptionStatusProvider workspaceId={workspace?.id}>
      <Route exact path="/onboarding" component={OnboardingPage} />
      <Route
        exact
        path="/workspaces/:workspaceId/teams/:teamId/retros/:retroId"
        component={RetroBoardPage}
      />
      <Route exact path="/workspaces/:workspaceId/settings" component={SettingsPage} />
      <Route exact path="/workspaces/:workspaceId" component={DashboardPage} />

      {!workspace && <Redirect to="/onboarding" />}
      {workspace && <Redirect to={`/workspaces/${data.user.workspace.id}`} />}
    </SubscriptionStatusProvider>
  );
};

const ErrorFallback: React.FC<FallbackProps> = ({ resetErrorBoundary }) => {
  const handleOnClick = () => {
    resetErrorBoundary();
    window.location.reload();
    return;
  };

  return (
    <PageContainer>
      <div className="text-center text-red">
        <LoadingText>
          Oops, something went wrong. Please refresh your browser.
        </LoadingText>
        <Button className="shadow border" onClick={handleOnClick}>
          Refresh
        </Button>
      </div>
    </PageContainer>
  );
};
