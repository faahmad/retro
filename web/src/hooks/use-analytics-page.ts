import * as React from "react";
import firebase from "../lib/firebase";
import analytics from "analytics.js";

export enum AnalyticsPage {
  LANDING = "Landing Page",
  LOGIN = "Login Page",
  SIGNUP = "Signup Page",
  NOT_FOUND = "Not Found 404",
  FAQ = "FAQ Page",
  DESIGN = "Design Page",
  ONBOARDING_PAGE = "Onboarding",
  DASHBOARD = "Dashboard",
  SETTINGS = "Settings Page",
  RETRO_BOARD = "Retro Board"
}

export function useAnalyticsPage(page: AnalyticsPage) {
  React.useEffect(() => {
    firebase.analytics().logEvent("page_view", {
      page_title: page
    });
    analytics.page(page);
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
