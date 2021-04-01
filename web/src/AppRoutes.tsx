import React from "react";
import { BrowserRouter, Redirect, Route, Switch, useHistory } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { DesignPage } from "./pages/DesignPage";

import { FAQPage } from "./pages/FAQPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoadingText } from "./components/LoadingText";
import { RetroBoardPage } from "./pages/RetroBoardPage";
import { SettingsPage } from "./pages/SettingsPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsOfServicePage } from "./pages/TermsOfServicePage";
import { PodcastHomePage } from "./pages/PodcastHomePage";
import { PodcastEpisodePage } from "./pages/PodcastEpisodePage";
import { PageContainer } from "./components/PageContainer";
import { Button } from "./components/Button";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { useCurrentUser } from "./hooks/use-current-user";
import { useScrollToTop } from "./hooks/use-scroll-to-top";

import { getWorkspaceFromCurrentUser } from "./utils/workspace-utils";
import { CurrentUserContextValues } from "./contexts/CurrentUserContext";
import { WorkspaceStateProvider } from "./contexts/WorkspaceStateContext";
import { PainDreamFixLandingPage } from "./pages/PainDreamFixLandingPage";
import { EarlyAccessPage } from "./pages/EarlyAccessPage";
import { MagicLinkPage } from "./pages/MagicLinkPage";

// Comment these out before deploying to prod!
import { LoginPage } from "./pages/LoginPage";
// import { SignupPage } from "./pages/SignupPage";
// import { FeatureFlags } from "./constants/feature-flags";
// import { ExperimentalRoute } from "./components/ExperimentalRoute";

export const AppRoutes: React.FC = () => {
  const currentUser = useCurrentUser();
  const { isLoggedIn, state } = currentUser;

  return (
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
  );
};

function ScrollToTop() {
  useScrollToTop();
  return null;
}

const UnauthenticatedAppRoutes: React.FC = () => {
  return (
    <React.Fragment>
      <Route
        // featureKey={FeatureFlags.SIGN_UP}
        exact
        path="/login"
        component={LoginPage}
      />
      {/* <Route
        // featureKey={FeatureFlags.SIGN_UP}
        exact
        path="/signup"
        component={SignupPage}
      /> */}
      <Route exact path="/secret-auth/:code" component={EarlyAccessPage} />
      <Route exact path="/magic-link" component={MagicLinkPage} />
      <Route exact path="/" component={PainDreamFixLandingPage} />
    </React.Fragment>
  );
};

function AuthenticatedAppRoutes({
  currentUser
}: {
  currentUser: CurrentUserContextValues;
}) {
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
      <Route exact path="/onboarding" component={OnboardingPage} />
      <Route
        exact
        path="/workspaces/:workspaceId/retros/:retroId"
        component={RetroBoardPage}
      />
      <Route exact path="/workspaces/:workspaceId/settings" component={SettingsPage} />
      <Route exact path="/workspaces/:workspaceId" component={DashboardPage} />
      <Redirect to={`/workspaces/${workspaceId}`} />
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
