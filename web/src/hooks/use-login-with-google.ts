import analytics from "analytics.js";
import {
  authenticateWithGoogle,
  getIdTokenFromUserCredential,
  isNewUser
} from "../services/auth-service";
import { useHistory } from "react-router-dom";

export function useLoginWithGoogle() {
  const history = useHistory();

  const handleLoginWithGoogle = async () => {
    const userCredential = await authenticateWithGoogle();
    if (isNewUser(userCredential)) {
      handleNewUser(userCredential);
    }
    return;
  };

  const handleNewUser = async (userCredential: any) => {
    analytics.identify(userCredential?.user?.uid);
    analytics.track("User Signed Up", {
      type: "organic",
      provider: "google"
    });
    return history.push("/onboarding");
  };

  return handleLoginWithGoogle;
}
