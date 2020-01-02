import admin from "firebase-admin";
import serviceAccountKey from "../config/serviceAccountKey.dev.json";
import { AuthenticationError } from "apollo-server-express";

admin.initializeApp({ credential: admin.credential.cert(serviceAccountKey) });

export class AuthenticationService {
  static async getUserIdFromIdToken(idToken) {
    try {
      const decodedIdToken = await admin.auth().verifyIdToken(idToken);
      return decodedIdToken.uid;
    } catch (error) {
      throw new AuthenticationError("Invalid ID token.");
    }
  }
}
