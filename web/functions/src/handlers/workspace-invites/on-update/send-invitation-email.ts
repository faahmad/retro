import * as functions from "firebase-functions";
import { WorkspaceInvite } from "../../../types/workspace-invite";
import { sendInvitationMailer } from "../../../services/mailjet-service";
import { logger } from "../../../lib/logger";
import { FirestoreCollections } from "../../../constants/firestore-collections";

/**
 * When a user is invited to a workspace,
 * send the invite email via mailjet.
 */
export const sendInvitationEmail = functions.firestore
  .document(`${FirestoreCollections.WORKSPACE_INVITE}/{workspaceId}`)
  .onCreate((workspaceInviteSnapshot) => {
    const workspaceInvite = workspaceInviteSnapshot.data() as WorkspaceInvite | undefined;
    if (!workspaceInvite) {
      logger.log("Failed to send invitation email, workspaceInvite is undefined.");
      return;
    }
    return sendInvitationMailer(
      workspaceInvite.email,
      workspaceInvite.workspaceName
    ).then(
      (value) => logger.prettyPrint(value),
      (reason) => logger.prettyPrint(reason)
    );
  });
