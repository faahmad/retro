import * as functions from "firebase-functions";
import { createCustomer, subscribeCustomerToProPlan } from "../../../services/stripe";
import { updateWorkspace } from "../../../services/firebase-admin";
import { Workspace } from "../../../types/workspace";
import { logger } from "../../../lib/logger";

/**
 * When a Workspace is created,
 * this function creates a Stripe Customer and Subscription.
 */
export const createStripeCustomerSubscription = functions.firestore
  .document("workspaces/{workspaceId}")
  .onCreate(async (snapshot) => {
    const workspace = snapshot.data() as Workspace;
    if (!workspace) {
      logger.log("Workspace in undefined.");
      return;
    }
    try {
      const customer = await createCustomer(workspace.name, workspace.owner.email);
      const subscription = await subscribeCustomerToProPlan(customer.id);
      await updateWorkspace(workspace.id, {
        customerId: customer.id,
        subscriptionId: subscription.id
      });
    } catch (error) {
      logger.log("Error creating stripe customer:", error.message);
    }
    return;
  });
