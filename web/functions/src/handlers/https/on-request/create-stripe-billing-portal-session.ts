import * as functions from "firebase-functions";
import {
  getUserIdFromIdToken,
  getWorkspace,
  getWorkspaceUser
} from "../../../services/firebase-admin";
import { createBillingPortalSession } from "../../../services/stripe";
import { cors } from "../../../lib/cors";
import { logger } from "../../../lib/logger";

export const createStripeBillingPortalSession = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const idToken = req.headers["x-retro-auth"];
      if (!idToken || typeof idToken !== "string") {
        throw new Error("Invalid Auth Header.");
      }

      const { workspaceId, returnUrl } = req.body;
      if (!workspaceId || !returnUrl) {
        throw new Error("Invalid Request Body.");
      }

      const userId = await getUserIdFromIdToken(idToken);
      const workspace = await getWorkspace(workspaceId);
      const workspaceUser = await getWorkspaceUser(workspaceId, userId);

      logger.log("createStripeBillingPortal", workspaceUser);

      if (workspaceUser?.userRole !== "owner") {
        throw new Error("Unauthorized.");
      }

      if (!workspace?.customerId) {
        throw new Error("Invalid customerId.");
      }

      const billingPortalSession = await createBillingPortalSession({
        customerId: workspace.customerId,
        returnUrl
      });

      return res.status(200).json(billingPortalSession);
    } catch ({ message }) {
      logger.log(message);
      return res.status(500).json({ error: message });
    }
  });
});
