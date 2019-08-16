import * as React from "react";
import { Link } from "react-router-dom";

export const LoginPage: React.FC = () => {
  return (
    <div className="login-page container">
      <h1>Login Page</h1>
      <Link to="/dashboard/team/retro-board">Login</Link>
    </div>
  );
};
