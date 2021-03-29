import * as sendgridMailer from "@sendgrid/mail";
import * as functions from "firebase-functions";

sendgridMailer.setApiKey(functions.config().sendgrid.api_key);

const VERIFIED_SENDER_EMAIL = "faraz@retro.app";

const templates = {
  workspaceInvite: "d-d02ac173de684a8084a07a094b6bbe58"
};

interface SendInvitationMailerInput {
  toEmail: string;
  invitedByName: string;
}

export function sendInvitationMailer(input: SendInvitationMailerInput) {
  const message: sendgridMailer.MailDataRequired = {
    to: input.toEmail,
    from: VERIFIED_SENDER_EMAIL,
    templateId: templates.workspaceInvite
  };

  return sendgridMailer.send(message);
}
