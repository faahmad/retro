import * as functions from "firebase-functions";
import { getUserIdFromIdToken, getWorkspace } from "../services/firebase-admin";
import { getStripeSubscription as getSubscription } from "../services/stripe";
import { cors } from "../lib/cors";
import { logger } from "../lib/logger";
import { responses } from "../utils/responses";

export const getStripeSubscription = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    try {
      if (request.method !== "POST") {
        response.status(400).json(responses.invalidMethod(request.method));
        return;
      }

      const idToken = request.headers["x-retro-auth"];
      if (!idToken || typeof idToken !== "string") {
        throw new Error("Invalid Auth Header.");
      }

      const { workspaceId } = request.body;
      if (!workspaceId) {
        throw new Error("Invalid Request Body.");
      }

      const userId = await getUserIdFromIdToken(idToken);
      const workspace = await getWorkspace(workspaceId);

      if (!workspace) {
        throw new Error("Invalid workspace.");
      }

      if (userId !== workspace.ownerId) {
        throw new Error("Unauthorized.");
      }

      if (!workspace.subscriptionId) {
        throw new Error("Invalid workspace subscription.");
      }

      const subscription = await getSubscription(workspace.subscriptionId);

      return response.status(200).json(subscription);
    } catch (error) {
      logger.prettyPrint(error);
      return response.status(500).json(responses.serverError(error));
    }
  });
});
