import React from "react";
import { Button } from "./Button";
import googleLogo from "../assets/images/google-logo.svg";
import { AuthService } from "../services/auth-service";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

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
  const [createUser] = useMutation(CREATE_USER_MUTATION);

  const handleClick = async () => {
    const userCredential = await AuthService.authenticateWithGooglePopUp();
    if (
      userCredential &&
      userCredential.additionalUserInfo?.isNewUser &&
      userCredential.user
    ) {
      const variables = { input: { email: userCredential.user.email } };
      await createUser({
        variables
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
