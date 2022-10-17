import * as functions from "firebase-functions";
import Stripe from "stripe";
import { updateWorkspace, getWorkspaceIdByCustomerId } from "../services/firebase-admin";
import { responses } from "../utils/responses";
import { logger } from "../lib/logger";

export const stripeWebhook = functions.https.onRequest(async (request, response) => {
  try {
    if (request.method !== "POST") {
      response.status(400).json(responses.invalidMethod(request.method));
      return;
    }
    const { type, data } = request.body;

    switch (type) {
      // Subscriptions
      case "customer.subscription.created": {
        const subscription = data.object;
        await updateWorkspaceSubscription(subscription);
        break;
      }
      case "customer.subscription.updated": {
        const subscription = data.object;
        await updateWorkspaceSubscription(subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = data.object;
        await updateWorkspaceSubscription(subscription);
        break;
      }

      // Payment methods
      case "payment_method.attached": {
        const paymentMethod = data.object;
        await attachWorkspacePaymentMethod(paymentMethod);
        break;
      }
      case "payment_method.updated": {
        const paymentMethod = data.object;
        await attachWorkspacePaymentMethod(paymentMethod);
        break;
      }
    }

    response.status(200).json(responses.ok());
    return;
  } catch (error) {
    logger.log({ error: error.message });
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

async function attachWorkspacePaymentMethod(paymentMethod: Stripe.PaymentMethod) {
  const customerId = paymentMethod.customer as string;
  const workspaceId = await getWorkspaceIdByCustomerId(customerId);
  if (!workspaceId) {
    throw new Error(`Invalid customerId ${customerId}`);
  }
  return updateWorkspace(workspaceId, {
    paymentMethodId: paymentMethod.id
  });
}
