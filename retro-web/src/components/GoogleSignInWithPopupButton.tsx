import * as React from "react";
import { Button } from "reactstrap";
import { Firebase } from "../lib/Firebase";

export class GoogleSignInWithPopupButton extends React.Component {
  handleSignInWithGoogle = async () => {
    await Firebase.signInWithGoogleAuthPopup();
  };
  render() {
    return (
      <Button outline color="danger" onClick={this.handleSignInWithGoogle}>
        Continue with Google
      </Button>
    );
  }
}
