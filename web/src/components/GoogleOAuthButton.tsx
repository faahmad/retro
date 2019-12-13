import React from "react";
import { Button } from "./Button";
import googleLogo from "../assets/images/google-logo.svg";
import { AuthService } from "../services/auth-service";

export const GoogleOAuthButton: React.FC<{
  buttonClassName?: string;
  textClassName?: string;
}> = ({ buttonClassName = "", textClassName = "", children }) => {
  const handleClick = () => {
    return AuthService.authenticateWithGooglePopUp();
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
