import analytics from "analytics.js";

if (process.env.NODE_ENV !== "test") {
  analytics.initialize({
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
