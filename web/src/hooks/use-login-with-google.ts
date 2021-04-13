import analytics from "analytics.js";
import { authenticateWithGoogle, isNewUser } from "../services/auth-service";
import { useHistory } from "react-router-dom";

export function useLoginWithGoogle() {
  const history = useHistory();

  const handleLoginWithGoogle = async () => {
    const userCredential = await authenticateWithGoogle();
    if (isNewUser(userCredential)) {
      analytics.track("User Signed Up", {
        type: "organic",
        provider: "google"
      });
      return history.push("/onboarding");
    }
    return;
  };

  return handleLoginWithGoogle;
}
