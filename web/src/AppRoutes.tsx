import React from "react";
import { Switch, BrowserRouter, Route } from "react-router-dom";

import { LandingPage } from "./pages/LandingPage";
import { DevelopmentOnlyWorkspacesPage } from "./pages/DevelopmentOnlyWorkspacesPage";

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route
          exact
          path="/workspaces"
          component={DevelopmentOnlyWorkspacesPage}
        ></Route>
      </Switch>
    </BrowserRouter>
  );
};
