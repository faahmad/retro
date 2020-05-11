import { app } from "firebase-admin";
import * as functions from "firebase-functions";
import { createCustomer, subscribeCustomerToProPlan } from "../lib/stripe";

const logger = console;

export const handleCreateStripeCustomerSubscription = (
  firebaseAdmin: app.App
) => async (snapshot: functions.firestore.DocumentSnapshot) => {
  const workspace = snapshot.data();
  if (!workspace) {
    logger.log("Workspace in undefined.");
    return;
  }
  try {
    const customer = await createCustomer(workspace.name, workspace.ownerEmail);
    logger.log("Created stripe customer.", customer.id);
    const subscription = await subscribeCustomerToProPlan(customer.id);
    logger.log("Subscribed customer to PRO plan.", subscription.id);
    await firebaseAdmin
      .firestore()
      .collection("workspaces")
      .doc(workspace.id)
      .set(
        { customerId: customer.id, subscriptionId: subscription.id },
        { merge: true }
      );
    logger.log("Added stripe data to firestore.");
  } catch (error) {
    logger.log("Error creating stripe customer:", error.message);
  }
  return;
};
