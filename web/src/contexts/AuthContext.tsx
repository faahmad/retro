import * as React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { LoadingPage } from '../pages/LoadingPage';

type AuthContextValue = firebase.User | null;

const AuthContext = React.createContext<AuthContextValue>(null);

class AuthProvider extends React.Component<
  {},
  {
    authAccount: AuthContextValue;
    isFetchingAuth: boolean;
  }
> {
  state = {
    authAccount: null,
    isFetchingAuth: true
  };
  componentDidMount() {
    firebase.auth().onAuthStateChanged(this.handleAuthStateChanged);
  }
  handleAuthStateChanged = async (authAccount: firebase.User | null) => {
    if (authAccount) {
      const idToken = await authAccount.getIdToken();
      localStorage.setItem('idToken', idToken);
      await this.setState({ authAccount });
    } else {
      localStorage.removeItem('idToken');
      this.setState({ authAccount: null });
    }
    this.setState({ isFetchingAuth: false });
  };
  render() {
    if (this.state.isFetchingAuth) {
      return <LoadingPage />;
    }

    return (
      <AuthContext.Provider value={this.state.authAccount}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

const useAuthContext = () => React.useContext(AuthContext);

const AuthConsumer = AuthContext.Consumer;
export { AuthProvider, AuthConsumer, AuthContext, useAuthContext };
