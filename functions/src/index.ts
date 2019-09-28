// Important! This needs to be at the top of the file.
import * as firebaseAdmin from "firebase-admin";
const serviceAccount = require("./config/serviceAccount.dev.json");
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
});
// ===================================================

import * as functions from "firebase-functions";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

import { validateFirebaseIdToken } from "./middlewares/validateFirebaseIdToken";
import { stripeAdminRouter } from "./routers/stripeAdminRouter";
import { workspaceRouter } from "./routers/workspaceRouter";

const routes = [stripeAdminRouter, workspaceRouter];

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: true }));
app.use(validateFirebaseIdToken);
app.use("/v1", routes);

export const api = functions.https.onRequest(app);
