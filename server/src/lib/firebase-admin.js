import admin from "firebase-admin";
import devServiceAccountKey from "../config/service-account-key.dev.json";
import prodServiceAccountKey from "../config/service-account-key.prod.json";

function getServiceAccountKey(env) {
  switch (env) {
    case "production":
      return prodServiceAccountKey;
    case "development":
    case "test":
      return devServiceAccountKey;
  }
}

const serviceAccountKey = getServiceAccountKey(process.env.NODE_ENV);

admin.initializeApp({ credential: admin.credential.cert(serviceAccountKey) });

export default admin;
