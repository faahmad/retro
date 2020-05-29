import * as functions from "firebase-functions";
import { App } from "@slack/bolt";

const app = new App({
  token: functions.config().slack.token,
  signingSecret: functions.config().slack.signing_secret
});

export const slack = app.client;
