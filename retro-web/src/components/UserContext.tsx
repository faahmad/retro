import * as React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

interface UserContextValues {
  userAuthAccount: firebase.User | unknown;
  isFetchingUser: boolean;
}

const initialUserContextValues = {
  userAuthAccount: null,
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
    } else {
      this.setState({ userAuthAccount: null });
    }
    this.setState({ isFetchingUser: false });
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
