import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

interface UserContextValues {
  userAuthAccount: firebase.User | null;
  user: RetroUser | null;
  isFetchingUser: boolean;
}

const initialUserContextValues: UserContextValues = {
  userAuthAccount: null,
  user: null,
  isFetchingUser: true
};

const UserContext = React.createContext<UserContextValues>(
  initialUserContextValues
);

const UserProvider: React.FC = ({ children }) => {
  const [userAuthAccount, setUserAuthAccount] = React.useState<
    UserContextValues["userAuthAccount"]
  >(initialUserContextValues.userAuthAccount);

  const [isFetchingUser, setIsFetchingUser] = React.useState<
    UserContextValues["isFetchingUser"]
  >(initialUserContextValues.isFetchingUser);

  const handleAuthStateChanged = (userAuthAccount: firebase.User | null) => {
    if (userAuthAccount) {
      setUserAuthAccount(userAuthAccount);
    } else {
      setUserAuthAccount(null);
    }
    setIsFetchingUser(false);
  };

  React.useEffect(() => {
    return firebase.auth().onAuthStateChanged(handleAuthStateChanged);
  }, []);

  const [user, setUser] = React.useState<UserContextValues["user"]>(
    initialUserContextValues.user
  );

  return (
    <UserContext.Provider value={{ userAuthAccount, user, isFetchingUser }}>
      {children}
    </UserContext.Provider>
  );
};

const UserConsumer = UserContext.Consumer;
export { UserProvider, UserConsumer, UserContext };
