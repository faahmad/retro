import * as React from "react";
import firebase from "../lib/firebase";
import { User } from "../types/user";
import { userListener } from "../services/user-listener";
import {
  deleteIdToken,
  getIdTokenFromFirebaseUser,
  saveIdToken
} from "../services/auth-service";

export enum CurrentUserState {
  LOADING = "loading",
  LOGGED_IN = "logged in",
  LOGGED_OUT = "logged out",
  ERROR = "error"
}

enum CurrentUserActionTypes {
  AUTHENTICATED = "authenticated",
  USER_SNAPSHOT = "user_snapshot",
  LOGGED_OUT = "logged_out"
}

export type CurrentUserContextValues = {
  auth: firebase.User | null;
  data: User | null;
  state: CurrentUserState;
  isLoggedIn: boolean;
};

const initialValues = {
  auth: null,
  data: null,
  state: CurrentUserState.LOADING,
  isLoggedIn: false
};

export const CurrentUserContext = React.createContext<CurrentUserContextValues>(
  initialValues
);

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const [values, dispatch] = React.useReducer(currentUserReducer, initialValues);

  // Auth listener
  const handleAuthStateChanged = async (firebaseUser: firebase.User | null) => {
    return firebaseUser ? handleOnAuthenticated(firebaseUser) : handleOnLoggedOut();
  };
  const handleOnAuthenticated = async (firebaseUser: firebase.User) => {
    const idToken = await getIdTokenFromFirebaseUser(firebaseUser);
    saveIdToken(idToken);
    return dispatch({
      type: CurrentUserActionTypes.AUTHENTICATED,
      payload: firebaseUser
    });
  };
  const handleOnLoggedOut = () => {
    deleteIdToken();
    return dispatch({ type: CurrentUserActionTypes.LOGGED_OUT, payload: null });
  };
  React.useEffect(() => {
    return firebase.auth().onAuthStateChanged(handleAuthStateChanged);
    //eslint-disable-next-line
  }, []);

  // User listener
  const userId = values.auth?.uid;
  const handleUserSnapshot = (user: User) => {
    return dispatch({
      type: CurrentUserActionTypes.USER_SNAPSHOT,
      payload: user
    });
  };
  React.useEffect(() => {
    if (!userId) {
      return;
    }
    const userListenerUnsubscribeFn = userListener(userId, handleUserSnapshot);
    return () => userListenerUnsubscribeFn();
  }, [userId]);

  return (
    <CurrentUserContext.Provider value={values}>{children}</CurrentUserContext.Provider>
  );
}

function currentUserReducer(
  state: CurrentUserContextValues,
  action: { type: CurrentUserActionTypes; payload: any }
): CurrentUserContextValues {
  switch (action.type) {
    case CurrentUserActionTypes.AUTHENTICATED: {
      return reduceAuthenticated(state, action.payload);
    }
    case CurrentUserActionTypes.USER_SNAPSHOT: {
      return reduceUser(state, action.payload);
    }
    case CurrentUserActionTypes.LOGGED_OUT: {
      return reduceLoggedOut();
    }
    default: {
      return state;
    }
  }
}

function reduceAuthenticated(state: CurrentUserContextValues, auth: firebase.User) {
  return { ...state, auth };
}

function reduceUser(state: CurrentUserContextValues, data: any) {
  return { ...state, data, state: CurrentUserState.LOGGED_IN, isLoggedIn: true };
}

function reduceLoggedOut() {
  return {
    auth: null,
    data: null,
    state: CurrentUserState.LOGGED_OUT,
    isLoggedIn: false
  };
}
