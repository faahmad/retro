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
  customerId: Stripe.Checkout.SessionCreateParams["customer"];
  returnUrl: Stripe.Checkout.SessionCreateParams["success_url"];
  mode: Stripe.Checkout.SessionCreateParams["mode"];
}

function createStripeCheckoutSession(params: CreateStripeCheckoutSessionParams) {
  let request: Stripe.Checkout.SessionCreateParams = {
    customer: params.customerId,
    payment_method_types: ["card"],
    mode: params.mode,
    success_url: `${params.returnUrl}?success=true`,
    cancel_url: `${params.returnUrl}?canceled=true`
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

      const { workspaceId, returnUrl, mode } = req.body;
      if (!workspaceId || !returnUrl || !mode) {
        throw new Error("Invalid Request Body");
      }

      const userId = await getUserIdFromIdToken(idToken);
      const workspace = await getWorkspace(workspaceId);
      const workspaceUser = await getWorkspaceUser(workspaceId, userId);

      if (workspaceUser?.userRole !== "owner") {
        throw new Error("Unauthorized");
      }

      if (!workspace?.customerId) {
        throw new Error("Invalid customerId");
      }

      const checkoutSession = await createStripeCheckoutSession({
        customerId: workspace.customerId,
        mode,
        returnUrl
      });

      return res.status(200).json(checkoutSession);
    } catch ({ message }) {
      logger.log(message);
      return res.status(500).json({ error: message });
    }
  });
});
