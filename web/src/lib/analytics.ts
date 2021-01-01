import analytics from "analytics.js";

if (process.env.NODE_ENV !== "test") {
  analytics.initialize({
    "Google Analytics": {
      trackingId: "G-1H9PFF6L2E",
      sendUserId: true
    },
    Amplitude: {
      apiKey: process.env.REACT_APP_AMPLITUDE_API_KEY,
      trackAllPages: true,
      trackReferrer: true
    },
    FullStory: {
      org: process.env.REACT_APP_FULLSTORY_ORG_ID
    }
  });
}
