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
import { PodcastHomePage } from "./pages/PodcastHomePage";
import { PodcastEpisodePage } from "./pages/PodcastEpisodePage";
import { SubscriptionStatusProvider } from "./contexts/SubscriptionStatusContext";
import { PageContainer } from "./components/PageContainer";
import { Button } from "./components/Button";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { useCurrentUser } from "./hooks/use-current-user";
import { useScrollToTop } from "./hooks/use-scroll-to-top";

import { getWorkspaceFromCurrentUser } from "./utils/workspace-utils";
import { CurrentUserContextValues } from "./contexts/CurrentUserContext";
import { useAnalyticsPageView } from "./hooks/use-analytics-page-view";
import { WorkspaceStateProvider } from "./contexts/WorkspaceStateContext";
import { PainDreamFixLandingPage } from "./pages/PainDreamFixLandingPage";

// Comment these out before deploying to prod!
// import { LoginPage } from "./pages/LoginPage";
// import { SignupPage } from "./pages/SignupPage";
// import { FeatureFlags } from "./constants/feature-flags";
// import { ExperimentalRoute } from "./components/ExperimentalRoute";

const optimizely = createInstance({
  sdkKey: process.env.REACT_APP_OPTIMIZELY_SDK_KEY
});
if (process.env.NODE_ENV === "production") {
  setLogger(null);
}

export const AppRoutes: React.FC = () => {
  const currentUser = useCurrentUser();
  const { auth, isLoggedIn, state } = currentUser;

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
          <ScrollToTop />
          <div className="mt-8 w-4/5 max-w-6xl m-auto">
            <Navbar isLoggedIn={isLoggedIn} userState={state} />
          </div>
          <Switch>
            <Route exact path="/privacy" component={PrivacyPolicyPage} />
            <Route exact path="/terms" component={TermsOfServicePage} />
            <Route exact path="/faq" component={FAQPage} />
            <Route exact path="/design" component={DesignPage} />
            <Route path="/podcast/:episodeNumber" component={PodcastEpisodePage} />
            <Route path="/podcast" component={PodcastHomePage} />

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

function ScrollToTop() {
  useScrollToTop();
  return null;
}

const UnauthenticatedAppRoutes: React.FC = () => {
  useAnalyticsPageView();

  const isLandingPageXPEnabled = true;

  return (
    <React.Fragment>
      {/* <ExperimentalRoute
        featureKey={FeatureFlags.SIGN_UP}
        exact
        path="/login"
        component={LoginPage}
      />
      <ExperimentalRoute
        featureKey={FeatureFlags.SIGN_UP}
        exact
        path="/signup"
        component={SignupPage}
      /> */}
      <Route
        exact
        path="/"
        component={isLandingPageXPEnabled ? PainDreamFixLandingPage : LandingPage}
      />
    </React.Fragment>
  );
};

function AuthenticatedAppRoutes({
  currentUser
}: {
  currentUser: CurrentUserContextValues;
}) {
  useAnalyticsPageView();
  const history = useHistory();
  const workspace = getWorkspaceFromCurrentUser(currentUser);
  const workspaceId = workspace?.id;

  React.useEffect(() => {
    if (!currentUser.isLoggedIn) {
      return;
    }
    if (!workspaceId) {
      return history.push("/onboarding");
    }
    //eslint-disable-next-line
  }, [currentUser.isLoggedIn, workspaceId]);

  return (
    <WorkspaceStateProvider workspaceId={workspaceId}>
      <SubscriptionStatusProvider workspaceId={workspaceId}>
        <Route exact path="/onboarding" component={OnboardingPage} />
        <Route
          exact
          path="/workspaces/:workspaceId/retros/:retroId"
          component={RetroBoardPage}
        />
        <Route exact path="/workspaces/:workspaceId/settings" component={SettingsPage} />
        <Route exact path="/workspaces/:workspaceId" component={DashboardPage} />
      </SubscriptionStatusProvider>
    </WorkspaceStateProvider>
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
