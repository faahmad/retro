import firebase from "../lib/firebase";
import analytics from "analytics.js";

export enum AnalyticsEvent {
  JOIN_WAITLIST_CLICKED = "Join Waitlist Link Clicked"
}

export function useAnalyticsEvent() {
  function handleAnalyticsEvent(eventName: AnalyticsEvent, eventProperties?: Object) {
    firebase.analytics().logEvent(eventName, eventProperties);
    analytics.track(eventName, eventProperties);
    return;
  }
  return handleAnalyticsEvent;
}
