import * as functions from "firebase-functions";
import { WorkspaceInvite } from "../../../types/workspace-invite";
import { sendInvitationMailer } from "../../../services/mailjet-service";

/**
 * When a user is invited to a workspace,
 * send the invite email via mailjet.
 */
export const sendInvitationEmail = functions.firestore
  .document("workspaces/{workspaceId}/{workspaceInviteId}")
  .onCreate(async (snapshot) => {
    const workspaceInvite = snapshot.data() as WorkspaceInvite;
    const invitedByFirstName = workspaceInvite.invitedByName.split(" ")[0];
    return sendInvitationMailer(workspaceInvite.email, invitedByFirstName);
  });
