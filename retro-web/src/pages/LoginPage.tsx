import * as React from "react";
import { Button } from "reactstrap";
import { Firebase } from "../lib/Firebase";

export class LoginPage extends React.Component {
  handleSignInWithGoogle = async () => {
    await Firebase.signInWithGoogleAuth();
  };
  render() {
    return (
      <div className="login-page container">
        <h1>Login Page</h1>
        <Button outline color="danger" onClick={this.handleSignInWithGoogle}>
          Continue with Google
        </Button>
      </div>
    );
  }
}
