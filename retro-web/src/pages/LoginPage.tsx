import * as React from "react";
import { GoogleSignInWithPopupButton } from "../components/GoogleSignInWithPopupButton";

export class LoginPage extends React.Component {
  render() {
    return (
      <div className="login-page container">
        <h1>Login Page</h1>
        <GoogleSignInWithPopupButton />
      </div>
    );
  }
}
