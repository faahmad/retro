import * as request from "request";

export const publishMessage = (message: string) => {
  return request.post(
    "https://discordapp.com/api/webhooks/941806106638954506/0Exv2DN8kbzmTwj1vMOMQ8jsuFBtAjzmv7GPwLgVnmOJA61nElBiH8iJUzJerSoARfGR",
    {
      json: {
        content: message
      }
    }
  );
};

export const testPublishMessage = (message: string) => {
  const formattedMessage = `DEV ${message}`;
  return request.post(
    "https://discordapp.com/api/webhooks/940746404366794782/6cc1whDk-RMckJEktfTSoOSAuXtCgHjOf26yY-zlYc3SPNjBFlISLatkp5iCtxNbvE1c",
    {
      json: {
        content: formattedMessage
      }
    }
  );
};
