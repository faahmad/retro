import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

import { handleCreateStripeCheckoutSession } from "./handlers/create-stripe-checkout-session";

export * from "./handlers";

export const createStripeCheckoutSession = functions.https.onRequest(
  handleCreateStripeCheckoutSession
);
