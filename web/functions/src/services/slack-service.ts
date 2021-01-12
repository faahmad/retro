import * as request from "request";
import { isProd } from "../constants/is-prod";

export const publishMessage = (message: string) => {
  const formattedMessage = !isProd ? `DEV ${message}` : message;
  return request.post(
    "https://hooks.slack.com/services/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",
    {
      json: {
        text: formattedMessage
      }
    }
  );
};
