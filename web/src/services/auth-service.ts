import firebase from 'firebase/app';
import 'firebase/auth';
import { apolloClient } from '../lib/apollo-client';

export class AuthService {
  static async authenticateWithGooglePopUp() {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    googleAuthProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    const userCredential = await firebase.auth().signInWithPopup(googleAuthProvider);
    return userCredential;
  }
  static async logOut() {
    await apolloClient.cache.reset();
    return firebase.auth().signOut();
  }
}
