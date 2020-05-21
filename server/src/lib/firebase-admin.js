import admin from "firebase-admin";

const B64_DEV_SERVICE_ACCOUNT_KEY = process.env.B64_DEV_SERVICE_ACCOUNT_KEY
const devServiceAccountKey = Buffer.from(B64_DEV_SERVICE_ACCOUNT_KEY, 'base64').toString('utf-8');
const devSAK = JSON.parse(devServiceAccountKey)

const B64_PROD_SERVICE_ACCOUNT_KEY = process.env.B64_PROD_SERVICE_ACCOUNT_KEY
const prodServiceAccountKey = Buffer.from(B64_PROD_SERVICE_ACCOUNT_KEY, 'base64').toString('utf-8');
const prodSAK = JSON.parse(prodServiceAccountKey)

function getServiceAccountKey(env) {
    switch (env) {
        case "production":
            return prodSAK;
        case "development":
            return devSAK;
        case "test":
            return devSAK;
    }
}

const serviceAccountKey = getServiceAccountKey(process.env.NODE_ENV);

admin.initializeApp({ credential: admin.credential.cert(serviceAccountKey) });

export default admin;