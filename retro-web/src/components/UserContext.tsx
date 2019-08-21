import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

interface UserContextValues {
  user: object | null;
  isFetchingUser: boolean;
}

const UserContext = React.createContext<UserContextValues>({
  user: null,
  isFetchingUser: true
});

const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<object | null>(null);
  const [isFetchingUser, setIsFetchingUser] = useState<boolean>(true);

  const handleAuthStateChanged = (user: firebase.User | null) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
    setIsFetchingUser(false);
  };

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(handleAuthStateChanged);
  }, []);

  return (
    <UserContext.Provider value={{ user, isFetchingUser }}>
      {children}
    </UserContext.Provider>
  );
};

const UserConsumer = UserContext.Consumer;
export { UserProvider, UserConsumer, UserContext };
