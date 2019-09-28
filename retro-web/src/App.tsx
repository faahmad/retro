import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
// Components
import { PrivateRoute } from "./components/PrivateRoute";
import { NavBar } from "./components/NavBar";
import { UserAuthContext } from "./components/UserAuthContext";
import { LoadingText } from "./components/LoadingText";
// Pages
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { RetroBoardPage } from "./pages/RetroBoardPage";
import { PublicOnlyRoute } from "./components/PublicOnlyRoute";
import { OnboardingPage } from "./pages/OnboardingPage";
import { WorkspaceMembersPage } from "./pages/WorkspaceMembersPage";
import { BillingPage } from "./pages/BillingPage";

class App extends React.Component {
  static contextType = UserAuthContext;
  render() {
    return (
      <BrowserRouter>
        <div className="app">
          <NavBar />
          <main className="app__main full-height">
            {this.context.isFetchingUserAuth ? (
              <LoadingText />
            ) : (
              <Switch>
                <PublicOnlyRoute exact path="/" component={LandingPage} />
                <PublicOnlyRoute path="/login" component={LoginPage} />
                <PrivateRoute
                  exact
                  path="/onboarding"
                  component={OnboardingPage}
                />
                <PrivateRoute
                  exact
                  path="/dashboard"
                  component={DashboardPage}
                />
                <PrivateRoute
                  path="/dashboard/:workspaceId/members"
                  component={WorkspaceMembersPage}
                />
                <PrivateRoute
                  exact
                  path={`/dashboard/:workspaceId/billing`}
                  component={BillingPage}
                />
                <PrivateRoute
                  path="/dashboard/:workspaceId/retro-boards/:retroBoardId"
                  component={RetroBoardPage}
                />
              </Switch>
            )}
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
