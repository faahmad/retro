import * as React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { Firebase } from "../lib/Firebase";

interface UserContextValues {
  userAuthAccount: firebase.User | unknown;
  user: RetroUser | null;
  isFetchingUser: boolean;
}

const initialUserContextValues = {
  userAuthAccount: null,
  user: null,
  isFetchingUser: true
};

const UserContext = React.createContext<UserContextValues>(
  initialUserContextValues
);

class UserProvider extends React.Component<{}, UserContextValues> {
  state = initialUserContextValues;
  componentDidMount() {
    firebase.auth().onAuthStateChanged(this.handleAuthStateChanged);
  }
  handleAuthStateChanged = async (userAuthAccount: firebase.User | null) => {
    if (userAuthAccount) {
      await this.setState({ userAuthAccount });
      this.handleFetchUser(userAuthAccount.uid);
    } else {
      this.setState({ userAuthAccount: null });
    }
    this.setState({ isFetchingUser: false });
  };
  handleFetchUser = async (userId: firebase.User["uid"]) => {
    const user = await Firebase.fetchUserById(userId);
    if (user) {
      this.setState({ user });
    }
    return;
  };
  render() {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

const UserConsumer = UserContext.Consumer;
export { UserProvider, UserConsumer, UserContext };
