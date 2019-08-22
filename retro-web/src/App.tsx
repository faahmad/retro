import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoute";
import { NavBar } from "./components/NavBar";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { RetroBoardPage } from "./pages/RetroBoardPage";
import { PublicOnlyRoute } from "./components/PublicOnlyRoute";
import { UserContext } from "./components/UserContext";
import { LoadingText } from "./components/LoadingText";
import { OnboardingPage } from "./pages/OnboardingPage";

class App extends React.Component {
  static contextType = UserContext;
  render() {
    return (
      <BrowserRouter>
        <div className="app">
          <NavBar />
          <main className="app__main full-height">
            {this.context.isFetchingUser ? (
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
                  path="/dashboard/team/retro-boards/:retroBoardId"
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
