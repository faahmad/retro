import * as functions from "firebase-functions";
import { firebaseAdmin } from "./lib/firebase-admin";
import { handleAuthOnCreate } from "./handlers/auth-on-create";

export const authOnCreate = functions.auth
  .user()
  .onCreate(handleAuthOnCreate(firebaseAdmin));
