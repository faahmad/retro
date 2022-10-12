import * as functions from "firebase-functions";
import { cors } from "../lib/cors";
import {
  getUserIdFromIdToken,
  getWorkspace,
  getWorkspaceUser
} from "../services/firebase-admin";
import { logger } from "../lib/logger";

import Stripe from "stripe";
import { stripe } from "../lib/stripe";
import { StripeSubscriptionPlans } from "../constants/stripe";

interface CreateStripeCheckoutSessionParams {
  customerId: Stripe.Customer["id"];
  successUrl: Stripe.Checkout.Session["success_url"];
  cancelUrl: Stripe.Checkout.Session["cancel_url"];
  status: "trialing" | "canceled";
}

function createStripeCheckoutSession(params: CreateStripeCheckoutSessionParams) {
  const statusMap = {
    trialing: "setup",
    canceled: "subscription"
  };

  let request: any = {
    customer: params.customerId,
    payment_method_types: ["card"],
    // @ts-ignore
    mode: statusMap[params.status],
    success_url: `${params.successUrl}?success=true`,
    cancel_url: `${params.cancelUrl}?canceled=true`
  };

  if (request.mode === "subscription") {
    request.line_items = [
      {
        price: StripeSubscriptionPlans.PRO_MONTHLY,
        quantity: 1
      }
    ];
  }

  return stripe.checkout.sessions.create(request);
}

export const createCheckoutSession = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const idToken = req.headers["x-retro-auth"];
      if (!idToken || typeof idToken !== "string") {
        throw new Error("Invalid Auth Header.");
      }

      const { workspaceId, successUrl, cancelUrl, status } = req.body;
      if (!workspaceId || !successUrl || !cancelUrl || !status) {
        throw new Error("Invalid Request Body");
      }

      const userId = await getUserIdFromIdToken(idToken);
      const workspace = await getWorkspace(workspaceId);
      const workspaceUser = await getWorkspaceUser(workspaceId, userId);

      logger.log("createCheckoutSession", workspaceUser);

      if (workspaceUser?.userRole !== "owner") {
        throw new Error("Unauthorized");
      }

      if (!workspace?.customerId) {
        throw new Error("Invalid customerId");
      }

      const checkoutSession = await createStripeCheckoutSession({
        customerId: workspace.customerId,
        successUrl,
        cancelUrl,
        status
      });

      return res.status(200).json(checkoutSession);
    } catch ({ message }) {
      logger.log(message);
      return res.status(500).json({ error: message });
    }
  });
});
