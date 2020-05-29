import * as functions from "firebase-functions";
import { slack } from "../lib/slack";
import { logger } from "../lib/logger";
import { slackChannelIds } from "../constants/slack";

export const publishMessage = (message: string) => {
  return slack.chat
    .postMessage({
      token: functions.config().slack.token,
      channel: slackChannelIds.RETRO_ALERTS,
      text: message
    })
    .catch((error) => logger.prettyPrint(error));
};
