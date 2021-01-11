import * as React from "react";
import firebase from "../lib/firebase";
import analytics from "analytics.js";
import { useHistory, useLocation } from "react-router-dom";

export function useAnalyticsPageView() {
  const history = useHistory();
  const location = useLocation();
  React.useEffect(() => {
    return history.listen(() => {
      firebase.analytics().logEvent("page_view", {
        page_path: location.pathname
      });
      analytics.page(location.pathname);
    });
    // eslint-disable-next-line
  }, [location.pathname]);
}
