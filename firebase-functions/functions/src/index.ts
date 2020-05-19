import * as functions from "firebase-functions";
import { handleCreateMailjetContact } from "./handlers/create-mailjet-contact";
import { handleCreateStripeCustomerSubscription } from "./handlers/create-stripe-customer-subscription";
import { handleCreateStripeBillingPortalSession } from "./handlers/create-stripe-billing-portal-session";

// Auth onCreate
export const createMailjetContact = functions.auth
  .user()
  .onCreate(handleCreateMailjetContact);

// Workspace onCreate
export const createStripeCustomerSubscription = functions.firestore
  .document("workspaces/{workspaceId}")
  .onCreate(handleCreateStripeCustomerSubscription);

// HTTPS Requests
export const createStripeBillingPortalSession = functions.https.onRequest(
  handleCreateStripeBillingPortalSession
);
