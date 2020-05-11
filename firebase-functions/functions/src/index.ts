import * as functions from "firebase-functions";
import { firebaseAdmin } from "./lib/firebase-admin";
import { handleAuthOnCreate } from "./handlers/auth-on-create";
import { handleCreateStripeCustomerSubscription } from "./handlers/create-stripe-customer-subscription";

export const authOnCreate = functions.auth
  .user()
  .onCreate(handleAuthOnCreate(firebaseAdmin));

export const createStripeCustomerSubscription = functions.firestore
  .document("workspaces/{workspaceId}")
  .onCreate(handleCreateStripeCustomerSubscription(firebaseAdmin));
