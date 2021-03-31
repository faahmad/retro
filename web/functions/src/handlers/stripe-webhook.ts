import * as functions from "firebase-functions";
import Stripe from "stripe";
import { logger } from "../lib/logger";
import { updateWorkspace, getWorkspaceIdByCustomerId } from "../services/firebase-admin";
import { responses } from "../utils/responses";

export const stripeWebhook = functions.https.onRequest(async (request, response) => {
  try {
    if (request.method !== "POST") {
      response.status(400).json(responses.invalidMethod(request.method));
      return;
    }
    const { type, data } = request.body;
    switch (type) {
      case "customer.subscription.updated": {
        const subscription = data as Stripe.Subscription;
        await updateWorkspaceSubscription(subscription);
        break;
      }
      default: {
        unhandledEventType(type);
        break;
      }
    }
    response.status(200).json(responses.ok());
    return;
  } catch (error) {
    response.status(500).json(responses.serverError(error));
    return;
  }
});

async function updateWorkspaceSubscription(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const workspaceId = await getWorkspaceIdByCustomerId(customerId);
  if (!workspaceId) {
    throw new Error(`Invalid customerId ${customerId}`);
  }
  return updateWorkspace(workspaceId, {
    customerId,
    subscriptionId: subscription.id,
    subscriptionTrialEnd: subscription.trial_end,
    subscriptionStatus: subscription.status
  });
}

function unhandledEventType(type: string) {
  logger.log(`stripeWebhook unhandled event type ${type}`);
  return;
}
