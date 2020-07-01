import * as React from "react";
import { useHistory } from "react-router-dom";

export function useScrollToTop() {
  const history = useHistory();
  React.useEffect(() => {
    console.log("useEffect useScrollToTop");
    const unregisterCallback = history.listen(() => window.scrollTo(0, 0));
    return () => unregisterCallback();
  }, [history]);
}
