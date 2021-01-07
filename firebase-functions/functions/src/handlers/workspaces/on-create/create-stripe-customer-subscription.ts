import * as functions from "firebase-functions";
import { createCustomer, subscribeCustomerToProPlan } from "../../../services/stripe";
import { updateWorkspace } from "../../../services/firebase-admin";
import { Workspace } from "../../../types/workspace";
import { logger } from "../../../lib/logger";
import { FirestoreCollections } from "../../../constants/firestore-collections";

/**
 * When a Workspace is created,
 * this function creates a Stripe Customer and Subscription.
 */
export const createStripeCustomerSubscription = functions.firestore
  .document(`${FirestoreCollections.WORKSPACE}/{workspaceId}`)
  .onCreate(async (workspaceSnapshot) => {
    const workspace = workspaceSnapshot.data() as Workspace;
    logger.prettyPrint({ workspace });
    if (!workspace) {
      logger.log("Workspace in undefined.");
      return;
    }
    try {
      const customer = await createCustomer(workspace.name, workspace.ownerEmail);
      const subscription = await subscribeCustomerToProPlan(customer.id);
      await updateWorkspace(workspaceSnapshot.id, {
        customerId: customer.id,
        subscriptionId: subscription.id,
        subscriptionTrialEnd: subscription.trial_end,
        subscriptionStatus: subscription.status
      });
    } catch (error) {
      logger.log("Error creating stripe customer:", error.message);
    }
    return;
  });
