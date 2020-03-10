import * as mailjet from "node-mailjet";
import * as functions from "firebase-functions";

export const client = mailjet.connect(
  functions.config().mailjet.api_key,
  functions.config().mailjet.api_secret
);
