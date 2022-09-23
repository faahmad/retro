import firebase from "../lib/firebase";

export enum AnalyticsEvent {
  JOIN_WAITLIST_CLICKED = "Join Waitlist Link Clicked",
  SIGNUP_BUTTON_CLICKED = "Signup Button Clicked",
  LOGIN_BUTTON_CLICKED = "Login Button Clicked",
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
  RETRO_ITEM_EDITED = "Retro Item Edited",
  RETRO_ITEM_DELETED = "Retro Item Deleted",
  RETRO_ITEMS_SORTED = "Retro Items Sorted",
  RETRO_TIMER_TOGGLED = "Retro Timer Toggled",
  RETRO_TIMER_UPDATED = "Retro Timer Updated",
  RETRO_TIMER_STARTED = "Retro Timer Started",
  RETRO_TIMER_PAUSED = "Retro Timer Paused",
  RETRO_TIMER_RESET = "Retro Timer Reset",
  RETRO_TIMER_ADD_1 = "Retro Timer Add 1 Min",
  RETRO_STAGE_CHANGED = "Retro Stage Changed",
  INVITE_LINK_COPIED = "Invite Link Copied",
  SKIPPED_ONBOARDING_INVITES = "Skipped Onboarding Invites",
  ACTION_ITEM_CREATED = "Action Item Created"
}

export function useAnalyticsEvent() {
  function handleAnalyticsEvent(eventName: AnalyticsEvent, eventProperties?: Object) {
    firebase.analytics().logEvent(eventName, eventProperties);
    return;
  }
  return handleAnalyticsEvent;
}
