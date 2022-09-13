import * as functions from "firebase-functions";
import { WorkspaceUser } from "../types/workspace-user";
import { logger } from "../lib/logger";
import { FirestoreCollections } from "../constants/firestore-collections";
import { addUserToContacts } from "../services/sendgrid";

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
    } catch (error: any) {
      logger.log("Error identifying workspace user", error.message);
    }

    return;
  });
