import firebase from "firebase/app";
import "firebase/auth";

export class AuthService {
  static async authenticateWithGooglePopUp() {
    try {
      const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
      googleAuthProvider.addScope(
        "https://www.googleapis.com/auth/contacts.readonly"
      );
      const userCredential = await firebase
        .auth()
        .signInWithPopup(googleAuthProvider);
      return userCredential;
    } catch (error) {
      console.log(error.message);
    }
  }
  static async logOut() {
    return firebase.auth().signOut();
  }
}
