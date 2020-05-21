import * as functions from "firebase-functions";
import { getUserIdFromIdToken, getWorkspace } from "../../../services/firebase-admin";
import { createCheckoutSession } from "../../../services/stripe";
import { cors } from "../../../lib/cors";
import { logger } from "../../../lib/logger";

/**
 * This function creates a Stripe Checkout Session
 * when invoked via a POST request.
 */
export const createStripeCheckoutSession = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const idToken = req.headers["x-retro-auth"];
      if (!idToken || typeof idToken !== "string") {
        throw new Error("Invalid Auth Header.");
      }

      const { workspaceId, successUrl, cancelUrl } = req.body;
      if (!workspaceId || !successUrl || !cancelUrl) {
        throw new Error("Invalid Request Body.");
      }

      const userId = await getUserIdFromIdToken(idToken);
      const workspace = await getWorkspace(workspaceId);
      if (userId !== workspace?.ownerId) {
        throw new Error("Unauthorized.");
      }

      const checkoutSession = await createCheckoutSession({
        customerId: workspace.customerId,
        subscriptionId: workspace.subscriptionId,
        successUrl,
        cancelUrl
      });

      return res.status(200).json(checkoutSession);
    } catch ({ message }) {
      logger.log(message);
      return res.status(500).json({ error: message });
    }
  });
});
