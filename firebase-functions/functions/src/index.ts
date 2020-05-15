import * as functions from "firebase-functions";
import { firebaseAdmin } from "./lib/firebase-admin";
import { handleCreateMailjetContact } from "./handlers/create-mailjet-contact";
import { handleCreateStripeCustomerSubscription } from "./handlers/create-stripe-customer-subscription";
import { handleCreateStripeCheckoutSession } from "./handlers/create-stripe-checkout-session";

export const createMailjetContact = functions.auth
  .user()
  .onCreate(handleCreateMailjetContact(firebaseAdmin));

export const createStripeCustomerSubscription = functions.firestore
  .document("workspaces/{workspaceId}")
  .onCreate(handleCreateStripeCustomerSubscription(firebaseAdmin));

export const createStripeCheckoutSession = functions.https.onRequest(
  handleCreateStripeCheckoutSession
);
