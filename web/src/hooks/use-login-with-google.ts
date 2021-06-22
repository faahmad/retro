import { authenticateWithGoogle, isNewUser } from "../services/auth-service";
import { useHistory, useLocation } from "react-router-dom";
import { AnalyticsEvent, useAnalyticsEvent } from "./use-analytics-event";
import { createUser } from "../services/create-user";

export function useLoginWithGoogle() {
  const history = useHistory();
  const location = useLocation();
  const trackEvent = useAnalyticsEvent();

  const handleLoginWithGoogle = async () => {
    const userCredential = await authenticateWithGoogle();
    if (isNewUser(userCredential)) {
      await createUser(userCredential);
      trackEvent(AnalyticsEvent.USER_CREATED, {
        location: location.pathname,
        method: "google"
      });
      return history.push("/onboarding");
    }
    return;
  };

  return handleLoginWithGoogle;
}
