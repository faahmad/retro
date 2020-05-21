import * as functions from "firebase-functions";
import { handleCreateMailjetContact } from "./handlers/create-mailjet-contact";
import { handleCreateStripeCustomerSubscription } from "./handlers/create-stripe-customer-subscription";
import { handleCreateStripeCheckoutSession } from "./handlers/create-stripe-checkout-session";

export * from "./handlers";

export const createMailjetContact = functions.auth
  .user()
  .onCreate(handleCreateMailjetContact);

export const createStripeCustomerSubscription = functions.firestore
  .document("workspaces/{workspaceId}")
  .onCreate(handleCreateStripeCustomerSubscription);

export const createStripeCheckoutSession = functions.https.onRequest(
  handleCreateStripeCheckoutSession
);
