import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { RetroBoardPage } from "./pages/RetroBoardPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <NavBar />
        <main className="app__main full-height">
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/login" component={LoginPage} />
            <Route exact path="/dashboard" component={DashboardPage} />
            <Route
              path="/dashboard/team/retro-boards/:retroBoardId"
              component={RetroBoardPage}
            />
          </Switch>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
