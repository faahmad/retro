import * as React from "react";
import firebase from "../lib/firebase";

export enum AnalyticsPage {
  LANDING = "Landing Page",
  LOGIN = "Login Page",
  EARLY_ACCESS = "Early Access Auth",
  MAGIC_LINK = "Magic Link Page",
  JOIN_WORKSPACE = "Join Workspace",
  SIGNUP = "Signup Page",
  NOT_FOUND = "Not Found 404",
  FAQ = "FAQ Page",
  DESIGN = "Design Page",
  ONBOARDING_PAGE = "Onboarding",
  ONBOARDING_INVITES_PAGE = "Onboarding Invites",
  DASHBOARD = "Dashboard",
  RETRO_LIST = "Retro List",
  SETTINGS = "Settings Page",
  RETRO_BOARD = "Retro Board"
}

export function useAnalyticsPage(page: AnalyticsPage) {
  React.useEffect(() => {
    firebase.analytics().logEvent("page_view", {
      page_title: page
    });
    // @ts-ignore
    window.analytics.page(page);
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
