import React from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import { OptimizelyProvider, createInstance, setLogger } from "@optimizely/react-sdk";
import { Navbar } from "./components/Navbar";
import { DesignPage } from "./pages/DesignPage";
import { FAQPage } from "./pages/FAQPage";
import { LandingPage } from "./pages/LandingPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoadingText } from "./components/LoadingText";
import { RetroBoardPage } from "./pages/RetroBoardPage";
import { SettingsPage } from "./pages/SettingsPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsOfServicePage } from "./pages/TermsOfServicePage";
import { SubscriptionStatusProvider } from "./contexts/SubscriptionStatusContext";
import { PageContainer } from "./components/PageContainer";
import { Button } from "./components/Button";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { useCurrentUser } from "./hooks/use-current-user";

const optimizely = createInstance({
  sdkKey: process.env.REACT_APP_OPTIMIZELY_SDK_KEY
});
if (process.env.NODE_ENV === "production") {
  setLogger(null);
}

export const AppRoutes: React.FC = () => {
  const currentUser = useCurrentUser();
  const { auth, isLoggedIn } = currentUser;

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
      user={{ id: isLoggedIn ? auth.uid : null }}
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <BrowserRouter>
          <div className="mt-8 w-4/5 max-w-6xl m-auto">
            <Navbar isLoggedIn={isLoggedIn} />
          </div>
          <Switch>
            <Route exact path="/privacy" component={PrivacyPolicyPage} />
            <Route exact path="/terms" component={TermsOfServicePage} />
            <Route exact path="/faq" component={FAQPage} />
            <Route exact path="/design" component={DesignPage} />

            {isLoggedIn ? (
              <AuthenticatedAppRoutes currentUser={currentUser} />
            ) : (
              <UnauthenticatedAppRoutes />
            )}
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

function AuthenticatedAppRoutes({ currentUser }: any) {
  const history = useHistory();
  const workspace = currentUser.data?.user?.workspace;

  React.useEffect(() => {
    if (!currentUser.isLoggedIn) {
      return;
    }
    const redirectUrl = workspace ? `/workspaces/${workspace.id}` : "/onboarding";
    history.push(redirectUrl);
    //eslint-disable-next-line
  }, [currentUser.isLoggedIn]);

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
    </SubscriptionStatusProvider>
  );
}

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
