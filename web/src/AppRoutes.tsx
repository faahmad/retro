import React from "react";
import { Switch, BrowserRouter, Route } from "react-router-dom";

import { LandingPage } from "./pages/LandingPage";

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={LandingPage} />
      </Switch>
    </BrowserRouter>
  );
};
