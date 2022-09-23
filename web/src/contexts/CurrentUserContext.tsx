import * as React from "react";
import firebase from "../lib/firebase";
import { User } from "../types/user";
import { userListener } from "../services/user-listener";
import {
  deleteIdToken,
  getIdTokenFromFirebaseUser,
  saveIdToken
} from "../services/auth-service";
import { AnalyticsEvent, useAnalyticsEvent } from "../hooks/use-analytics-event";
import * as FullStory from "@fullstory/browser";

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

type Callback = (input?: any) => void;

export type CurrentUserContextValues = {
  auth: firebase.User | null;
  data: User | null;
  state: CurrentUserState;
  isLoggedIn: boolean;
  handleEnqueueCallback: (callback: Callback) => void;
};

const initialValues = {
  auth: null,
  data: null,
  state: CurrentUserState.LOADING,
  isLoggedIn: false,
  handleEnqueueCallback: () => {}
};

export const CurrentUserContext = React.createContext<CurrentUserContextValues>(
  initialValues
);

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const [values, dispatch] = React.useReducer(currentUserReducer, initialValues);
  const trackEvent = useAnalyticsEvent();

  // Initialize the callback queue.
  let [callbackQueue, setCallbackQueue] = React.useState<Callback[]>([]);
  const handleEnqueueCallback = (callback: Callback) => {
    setCallbackQueue([callback, ...callbackQueue]);
    return;
  };

  React.useEffect(() => {
    values.handleEnqueueCallback = handleEnqueueCallback;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isAuthenticated = values.auth !== null;
  React.useEffect(() => {
    const handleInvokeCallbacks = async (firebaseUser: firebase.User) => {
      await callbackQueue.reverse().map(async (callback) => await callback(firebaseUser));
      setCallbackQueue([]);
      return;
    };
    if (isAuthenticated) {
      handleInvokeCallbacks(values.auth!);
    }
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleAnalytics = (firebaseUser: firebase.User) => {
    const userProps = {
      email: firebaseUser.email,
      emailVerified: firebaseUser.emailVerified,
      name: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      phoneNumber: firebaseUser.phoneNumber,
      creationTime: firebaseUser.metadata.creationTime,
      lastSignInTime: firebaseUser.metadata.lastSignInTime,
      providers: firebaseUser.providerData.map((data) => data?.providerId)
    };
    trackEvent(AnalyticsEvent.USER_SIGNED_IN, userProps);
    return;
  };

  // Auth listener
  const handleAuthStateChanged = async (firebaseUser: firebase.User | null) => {
    return firebaseUser ? handleOnAuthenticated(firebaseUser) : handleOnLoggedOut();
  };
  const handleOnAuthenticated = async (firebaseUser: firebase.User) => {
    const idToken = await getIdTokenFromFirebaseUser(firebaseUser);
    saveIdToken(idToken);

    FullStory.identify(firebaseUser.uid, {
      email: firebaseUser.email || undefined,
      displayName: firebaseUser.displayName || undefined,
      photoURL: firebaseUser.photoURL,
      providerID: firebaseUser.providerId,
      isAnonymous: firebaseUser.isAnonymous
    });
    handleAnalytics(firebaseUser);
    dispatch({
      type: CurrentUserActionTypes.AUTHENTICATED,
      payload: firebaseUser
    });
    return;
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
  return { ...initialValues, state: CurrentUserState.LOGGED_OUT };
}
