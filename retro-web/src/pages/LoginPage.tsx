import * as React from "react";
import { Link } from "react-router-dom";
import Octicon, { LogoGithub } from "@primer/octicons-react";

export const LoginPage: React.FC = () => {
  return (
    <div className="login-page container">
      <h1>Login Page</h1>
      <Link className="btn btn-dark font-weight-bold" to="/dashboard">
        Login with <Octicon icon={LogoGithub} />
      </Link>
    </div>
  );
};
