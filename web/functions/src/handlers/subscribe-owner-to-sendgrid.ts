import * as functions from "firebase-functions";
import { WorkspaceUser } from "../types/workspace-user";
import { logger } from "../lib/logger";
import { FirestoreCollections } from "../constants/firestore-collections";
import * as sendgridClient from "@sendgrid/client";

sendgridClient.setApiKey(functions.config().sendgrid.api_key);

// Main
export const subscribeOwnerToSendgrid = functions.firestore
  .document(`${FirestoreCollections.WORKSPACE_USER}/{workspaceUserId}`)
  .onCreate(async (workspaceUserSnapshot) => {
    const workspaceUser = workspaceUserSnapshot.data() as WorkspaceUser;

    if (!workspaceUser) {
      logger.log("WorkspaceUser is undefined.");
      return;
    }

    if (workspaceUser.userRole !== "owner") {
      logger.log("Not an owner.");
      return;
    }

    try {
      addUserToContacts(workspaceUser.userEmail);
    } catch (error) {
      logger.log("Error adding owner to Sendgrid contacts", error.message);
    }

    return;
  });

// Helpers
function addUserToContacts(email: string) {
  const data = {
    contacts: [{ email }]
  };

  const request = {
    url: `/v3/marketing/contacts`,
    method: "PUT",
    body: data
  };

  // @ts-ignore
  return sendgridClient.request(request);
}
