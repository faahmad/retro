import * as sendgridClient from "@sendgrid/client";
import * as functions from "firebase-functions";

sendgridClient.setApiKey(functions.config().sendgrid.api_key);

export function addUserToContacts(email: string) {
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
