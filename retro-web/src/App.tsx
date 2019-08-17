import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RetroBoardPage } from "./pages/RetroBoardPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <main className="app__main full-height">
          <Switch>
            <Redirect exact path="/" to="/login" />
            <Route path="/login" component={LoginPage} />
            <Route
              exact
              path="/dashboard/team/retro-board"
              component={RetroBoardPage}
            />
          </Switch>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
