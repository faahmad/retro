import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
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
import { WorkspaceListPage } from "./pages/WorkspaceListPage";

import { PainDreamFixLandingPage } from "./pages/PainDreamFixLandingPage";
import { MagicLinkPage } from "./pages/MagicLinkPage";
import { OnboardingInvitesPage } from "./pages/OnboardingInvitesPage";

import { LoginPage } from "./pages/LoginPage";
import { RetroListPage } from "./pages/RetroListPage";
import { SignupPage } from "./pages/SignupPage";

export const AppRoutes: React.FC = () => {
  const currentUser = useCurrentUser();
  const { isLoggedIn } = currentUser;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <ScrollToTop />
        <Switch>
          {/* These routes are public, accessible regardless if you are logged in or not. */}
          <Route path="/podcast" component={PodcastHomePage} />
          <Route path="/podcast/:episodeNumber" component={PodcastEpisodePage} />
          <Route exact path="/terms" component={TermsOfServicePage} />
          <Route exact path="/privacy" component={PrivacyPolicyPage} />
          <Route exact path="/faq" component={FAQPage} />
          <Route exact path="/design" component={DesignPage} />

          {isLoggedIn ? <AuthenticatedAppRoutes /> : <UnauthenticatedAppRoutes />}
        </Switch>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

function ScrollToTop() {
  useScrollToTop();
  return null;
}

/**
 * Routes that are only accessible if you are logged out.
 */
const UnauthenticatedAppRoutes: React.FC = () => {
  return (
    <React.Fragment>
      <Route exact path="/" component={PainDreamFixLandingPage} />
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/signup" component={SignupPage} />
      <Route exact path="/magic-link" component={MagicLinkPage} />
    </React.Fragment>
  );
};

/**
 * Routes that are only accesible if you are logged in.
 */
function AuthenticatedAppRoutes() {
  debugger;
  return (
    <React.Fragment>
      <Route exact path="/onboarding/invites" component={OnboardingInvitesPage} />
      <Route exact path="/onboarding" component={OnboardingPage} />
      <Route
        exact
        path="/workspaces/:workspaceId/retros/:retroId"
        component={RetroBoardPage}
      />
      <Route exact path="/workspaces/:workspaceId" component={DashboardPage} />
      <Route exact path="/workspaces/:workspaceId/retros" component={RetroListPage} />
      <Route exact path="/workspaces/:workspaceId/settings" component={SettingsPage} />
      <Route exact path="/workspaces" component={WorkspaceListPage} />
      <Route exact path="/" render={() => <Redirect to="/workspaces" />} />
    </React.Fragment>
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
