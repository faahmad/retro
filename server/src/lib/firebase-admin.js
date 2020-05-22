import * as admin from "firebase-admin";

const serviceAccountKey = JSON.parse(
    Buffer.from(process.env.B64_SERVICE_ACCOUNT_KEY, "base64").toString("utf-8")
);
admin.initializeApp({ credential: admin.credential.cert(serviceAccountKey) });

export default admin;