import * as request from "request";

const DISCORD_APP_URL = 'https://discordapp.com/api/webhooks';
const DISCORD_NOTIFICATIONS_CHANNEL = '941806106638954506/0Exv2DN8kbzmTwj1vMOMQ8jsuFBtAjzmv7GPwLgVnmOJA61nElBiH8iJUzJerSoARfGR';
const DISCORD_TEST_NOTIFICATIONS_CHANNEL = '940746404366794782/6cc1whDk-RMckJEktfTSoOSAuXtCgHjOf26yY-zlYc3SPNjBFlISLatkp5iCtxNbvE1c'

export const publishMessage = (message: string) => {
  return request.post(
    `${DISCORD_APP_URL}/${DISCORD_NOTIFICATIONS_CHANNEL}`,
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
    `${DISCORD_APP_URL}/${DISCORD_TEST_NOTIFICATIONS_CHANNEL}`,
    {
      json: {
        content: formattedMessage
      }
    }
  );
};
