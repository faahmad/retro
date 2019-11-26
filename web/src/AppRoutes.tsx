import React from "react";
import { Switch, BrowserRouter, Route } from "react-router-dom";

import { LandingPage } from "./pages/LandingPage";

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route component={LandingPage} />
      </Switch>
    </BrowserRouter>
  );
};
