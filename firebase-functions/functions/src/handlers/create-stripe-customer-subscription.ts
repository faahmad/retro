import * as functions from "firebase-functions";
import { createCustomer, subscribeCustomerToProPlan } from "../services/stripe";
import { updateWorkspace } from "../services/firebase-admin";

const logger = console;

export const handleCreateStripeCustomerSubscription = async (
  snapshot: functions.firestore.DocumentSnapshot
) => {
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
    await updateWorkspace(workspace.id, {
      customerId: customer.id,
      subscriptionId: subscription.id,
    });
    logger.log("Added stripe data to firestore.");
  } catch (error) {
    logger.log("Error creating stripe customer:", error.message);
  }
  return;
};
