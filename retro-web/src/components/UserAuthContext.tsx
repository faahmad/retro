import * as React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import axios from "axios";

interface UserAuthContextValues {
  userAuthAccount: firebase.User | unknown;
  isFetchingUserAuth: boolean;
}

const initialUserAuthContextValues = {
  userAuthAccount: null,
  isFetchingUserAuth: true
};

const UserAuthContext = React.createContext<UserAuthContextValues>(
  initialUserAuthContextValues
);

class UserAuthProvider extends React.Component<{}, UserAuthContextValues> {
  state = initialUserAuthContextValues;
  componentDidMount() {
    firebase.auth().onAuthStateChanged(this.handleAuthStateChanged);
  }
  handleAuthStateChanged = async (userAuthAccount: firebase.User | null) => {
    if (userAuthAccount) {
      const idToken = await userAuthAccount.getIdToken(true);
      axios.defaults.headers.common["Authorization"] = idToken;
      await this.setState({ userAuthAccount });
    } else {
      this.setState({ userAuthAccount: null });
    }
    this.setState({ isFetchingUserAuth: false });
  };
  render() {
    return (
      <UserAuthContext.Provider value={this.state}>
        {this.props.children}
      </UserAuthContext.Provider>
    );
  }
}

const UserAuthConsumer = UserAuthContext.Consumer;
export { UserAuthProvider, UserAuthConsumer, UserAuthContext };
