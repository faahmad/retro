import * as functions from "firebase-functions";
import { WorkspaceInvite, WorkspaceInviteStatus } from "../../../types/workspace-invite";

import { logger } from "../../../lib/logger";
import { FirestoreCollections } from "../../../constants/firestore-collections";
import { sendInvitationMailer } from "../../../services/sendgrid";

/**
 * When a user is invited to a workspace, send an invite email via mailjet.
 */
export const sendInvitationEmail = functions.firestore
  .document(`${FirestoreCollections.WORKSPACE_INVITE}/{workspaceId}`)
  .onCreate(async (workspaceInviteSnapshot) => {
    const workspaceInviteRef = workspaceInviteSnapshot.ref;
    try {
      const workspaceInvite = workspaceInviteSnapshot.data() as
        | WorkspaceInvite
        | undefined;

      if (!workspaceInvite) {
        await workspaceInviteRef.update({ status: WorkspaceInviteStatus.FAILED });
        logger.log("Failed to send invitation email, workspaceInvite is undefined.");
        return;
      }

      await sendInvitationMailer({
        toEmail: workspaceInvite.email,
        invitedByName: workspaceInvite.invitedByUserDisplayName
      });

      logger.log("Success!");
      await workspaceInviteRef.update({ status: WorkspaceInviteStatus.SENT });
    } catch (error) {
      await workspaceInviteRef.update({ status: WorkspaceInviteStatus.FAILED });
      logger.log("Caught in sendInvitationEmail");
      logger.prettyPrint(error);
      return;
    }
  });
