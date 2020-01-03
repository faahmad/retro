import React from "react";
import { Button } from "./Button";
import googleLogo from "../assets/images/google-logo.svg";
import { AuthService } from "../services/auth-service";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import analytics from "analytics.js";

const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
      createdAt
    }
  }
`;

export const GoogleOAuthButton: React.FC<{
  buttonClassName?: string;
  textClassName?: string;
}> = ({ buttonClassName = "", textClassName = "", children }) => {
  const [idToken, setIdToken] = React.useState<any | null>(null);
  const [createUser] = useMutation(CREATE_USER_MUTATION, {
    context: { idToken }
  });

  const handleClick = async () => {
    const userCredential = await AuthService.authenticateWithGooglePopUp();
    if (
      userCredential &&
      userCredential.additionalUserInfo?.isNewUser &&
      userCredential.user
    ) {
      const {
        credential,
        user: { uid, email }
      } = userCredential;
      // The type definition for firebase.auth.UserCredential does not include "idToken",
      // which is incorrect. We are casting userCredential to any to avoid compile errors.
      const newIdToken = (credential as any)!.idToken || null;
      // Note: We have to await setting the idToken otherwise
      // the mutation will not have the correct context.
      await setIdToken(newIdToken);
      await createUser({
        variables: {
          input: { id: uid, email: email }
        }
      });
      analytics.identify(uid);
      analytics.track("User Signed Up", {
        type: "organic",
        provider: "google"
      });
    }
    return;
  };

  return (
    <Button className={buttonClassName} onClick={handleClick}>
      <div className={`flex items-center ${textClassName}`}>
        <span>{children}</span>
        <img alt="Google" className="h-10 pl-1 mt-1" src={googleLogo} />
      </div>
    </Button>
  );
};
