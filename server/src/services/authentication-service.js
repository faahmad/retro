import firebaseAdmin from "../lib/firebase-admin";
import { AuthenticationError } from "apollo-server-express";

export class AuthenticationService {
  static async getUserIdFromIdToken(idToken) {
    try {
      const decodedIdToken = await firebaseAdmin.auth().verifyIdToken(idToken);
      return decodedIdToken.uid;
    } catch (error) {
      throw new AuthenticationError("Invalid ID token.");
    }
  }
}
