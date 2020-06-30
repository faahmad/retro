import React from "react";
import { Button } from "./Button";
import googleLogo from "../assets/images/google-logo.svg";

export const GoogleOAuthButton: React.FC<{
  buttonClassName?: string;
  textClassName?: string;
  useGoogleIcon?: boolean;
  onClick: any;
}> = ({
  buttonClassName = "",
  textClassName = "",
  useGoogleIcon = true,
  children,
  onClick
}) => {
  return (
    <Button className={buttonClassName} onClick={onClick}>
      <div className={`flex items-center ${textClassName}`}>
        <span>{children}</span>
        {useGoogleIcon ? (
          <img alt="Google" className="h-10 pl-1 mt-1" src={googleLogo} />
        ) : null}
      </div>
    </Button>
  );
};
