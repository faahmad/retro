import admin from "firebase-admin";
import devServiceAccountKey from "../config/serviceAccountKey.dev.json";
import prodServiceAccountKey from "../config/serviceAccountKey.prod.json";

const serviceAccountKey =
  process.env.NODE_ENV === "production"
    ? prodServiceAccountKey
    : devServiceAccountKey;

admin.initializeApp({ credential: admin.credential.cert(serviceAccountKey) });

export default admin;
