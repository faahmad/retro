import firebase from "../lib/firebase";
import { apolloClient } from "../lib/apollo-client";
import { axios } from "../lib/axios";

export function authenticateWithGoogle() {
  const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
  googleAuthProvider.addScope("https://www.googleapis.com/auth/contacts.readonly");
  return firebase.auth().signInWithPopup(googleAuthProvider);
}

export async function logOut() {
  await apolloClient.cache.reset();
  return firebase.auth().signOut();
}

export function saveIdToken(idToken: string) {
  axios.defaults.headers.common["x-retro-auth"] = idToken;
  return;
}

export function deleteIdToken() {
  axios.defaults.headers.common["x-retro-auth"] = undefined;
  return;
}

export function isNewUser(userCredential: firebase.auth.UserCredential) {
  return userCredential.additionalUserInfo?.isNewUser;
}

export function getIdTokenFromUserCredential(
  userCredential: firebase.auth.UserCredential
) {
  return getIdTokenFromFirebaseUser(userCredential.user!);
}

export function getIdTokenFromFirebaseUser(firebaseUser: firebase.User) {
  return firebaseUser.getIdToken();
}
