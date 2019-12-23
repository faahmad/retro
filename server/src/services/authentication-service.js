import admin from "firebase-admin";
import serviceAccountKey from "../config/serviceAccountKey.dev.json";

admin.initializeApp({ credential: admin.credential.cert(serviceAccountKey) });

export class AuthenticationService {
  static async getUserIdFromIdToken(idToken) {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    return decodedIdToken.uid;
  }
}
