import firebase from "../lib/firebase";
import analytics from "analytics.js";

export enum AnalyticsEvent {
  JOIN_WAITLIST_CLICKED = "Join Waitlist Link Clicked",
  JOINED_NEWSLETTER = "Joined Newsletter",
  MAGIC_LINK_SENT = "Magic Link Sent",
  USER_CREATED = "User Created",
  USER_INVITED = "User Invited",
  USER_SIGNED_IN = "User Signed In",
  WORKSPACE_CREATED = "Workspace Created",
  WORKSPACE_JOINED = "Workspace Joined",
  RETRO_OPENED = "Retro Opened",
  RETRO_CREATED = "Retro Created",
  RETRO_UPDATED = "Retro Updated",
  RETRO_ITEM_MODAL_OPENED = "Retro Item Modal Opened",
  RETRO_ITEM_MODAL_CLOSED = "Retro Item Modal Closed",
  RETRO_ITEM_CREATED = "Retro Item Created",
  RETRO_ITEM_MOVED = "Retro Item Moved",
  RETRO_ITEM_LIKED = "Retro Item Liked",
  RETRO_ITEM_EDITED = "Retro Item Edited"
}

export function useAnalyticsEvent() {
  function handleAnalyticsEvent(eventName: AnalyticsEvent, eventProperties?: Object) {
    firebase.analytics().logEvent(eventName, eventProperties);
    analytics.track(eventName, eventProperties);
    return;
  }
  return handleAnalyticsEvent;
}
