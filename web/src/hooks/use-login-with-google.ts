import { gql } from "apollo-boost";
import analytics from "analytics.js";
import {
  authenticateWithGoogle,
  getIdTokenFromUserCredential,
  isNewUser
} from "../services/auth-service";
import { useMutation } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";

const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
      createdAt
    }
  }
`;

export function useLoginWithGoogle() {
  const [createUser] = useMutation(CREATE_USER_MUTATION);
  const history = useHistory();

  const handleLoginWithGoogle = async () => {
    const userCredential = await authenticateWithGoogle();
    const idToken = await getIdTokenFromUserCredential(userCredential);
    if (isNewUser(userCredential)) {
      handleNewUser(userCredential, idToken);
    }
    return;
  };

  const handleNewUser = async (userCredential: any, idToken: string) => {
    await createUser({
      context: { idToken },
      variables: {
        input: { id: userCredential.user.uid, email: userCredential.user.email }
      }
    });
    analytics.identify(userCredential?.user?.uid);
    analytics.track("User Signed Up", {
      type: "organic",
      provider: "google"
    });
    return history.push("/onboarding");
  };

  return handleLoginWithGoogle;
}
