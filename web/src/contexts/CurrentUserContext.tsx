import * as React from "react";
import firebase from "../lib/firebase";
import {
  saveIdToken,
  deleteIdToken,
  getIdTokenFromFirebaseUser
} from "../services/auth-service";
import { getUserById } from "../services/user-service";
import { User } from "../types/user";

export enum CurrentUserState {
  LOADING = "loading",
  LOGGED_IN = "logged in",
  LOGGED_OUT = "logged out",
  ERROR = "error"
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

  React.useEffect(() => {
    return firebase.auth().onAuthStateChanged(handleAuthStateChanged);
    //eslint-disable-next-line
  }, []);

  const handleAuthStateChanged = async (firebaseUser: firebase.User | null) => {
    return firebaseUser ? handleOnAuthenticated(firebaseUser) : handleOnLoggedOut();
  };

  const handleOnAuthenticated = async (firebaseUser: firebase.User) => {
    const idToken = await getIdTokenFromFirebaseUser(firebaseUser);
    saveIdToken(idToken);
    dispatch({ type: "authenticated", payload: firebaseUser });
    const user = await getUserById(firebaseUser.uid);
    dispatch({ type: "get_user_data_success", payload: user });
    return;
  };

  const handleOnLoggedOut = () => {
    dispatch({ type: "logged_out", payload: null });
    deleteIdToken();
    return;
  };

  return (
    <CurrentUserContext.Provider value={values}>{children}</CurrentUserContext.Provider>
  );
}

function currentUserReducer(
  state: CurrentUserContextValues,
  action: { type: string; payload: any }
): CurrentUserContextValues {
  switch (action.type) {
    case "authenticated": {
      return reduceAuthenticated(state, action.payload);
    }
    case "get_user_data_success": {
      return reduceGetUserDataSuccess(state, action.payload);
    }
    case "logged_out": {
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

function reduceGetUserDataSuccess(state: CurrentUserContextValues, data: any) {
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
