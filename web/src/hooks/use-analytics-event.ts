import firebase from "../lib/firebase";
import analytics from "analytics.js";

export enum AnalyticsEvent {
  JOIN_WAITLIST_CLICKED = "Join Waitlist Link Clicked",
  JOINED_NEWSLETTER = "Joined Newsletter",
  USER_INVITED = "User Invited",
  WORKSPACE_CREATED = "Workspace Created",
  WORKSPACE_JOINED = "Workspace Joined"
}

export function useAnalyticsEvent() {
  function handleAnalyticsEvent(eventName: AnalyticsEvent, eventProperties?: Object) {
    firebase.analytics().logEvent(eventName, eventProperties);
    analytics.track(eventName, eventProperties);
    return;
  }
  return handleAnalyticsEvent;
}
