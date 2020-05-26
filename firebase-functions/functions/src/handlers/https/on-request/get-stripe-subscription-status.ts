import * as functions from "firebase-functions";
import {
  getUserIdFromIdToken,
  getWorkspaceUsers,
  getWorkspace
} from "../../../services/firebase-admin";
import { getStripeSubscription } from "../../../services/stripe";
import { cors } from "../../../lib/cors";
import { logger } from "../../../lib/logger";
import { has } from "lodash";

export const getStripeSubscriptionStatus = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const idToken = req.headers["x-retro-auth"];
      if (!idToken || typeof idToken !== "string") {
        throw new Error("Invalid Auth Header.");
      }

      const { workspaceId } = req.body;
      if (!workspaceId) {
        throw new Error("Invalid Request Body.");
      }

      const userId = await getUserIdFromIdToken(idToken);
      const workspaceUsers = await getWorkspaceUsers(workspaceId);
      if (!workspaceUsers || !has(workspaceUsers.users, userId)) {
        throw new Error("Unauthorized.");
      }

      const workspace = await getWorkspace(workspaceId);
      const subscription = await getStripeSubscription(workspace?.subscriptionId);

      return res.status(200).json({ status: subscription.status });
    } catch ({ message }) {
      logger.log(message);
      return res.status(500).json({ error: message });
    }
  });
});
