import * as React from "react";
import { Button } from "./Button";
import { useAnalyticsEvent, AnalyticsEvent } from "../hooks/use-analytics-event";

// const WAITLIST_GOOGLE_FORM_URL = "https://forms.gle/F4cYbHjv1J9zGPhj8";
const WAITLIST_MAILCHIMP_FORM_URL =
  "https://app.us7.list-manage.com/subscribe?u=2cbb020900cd578c5d5e85b1e&id=128ed7e249";

export const JoinWaitlistButton = () => {
  const trackAnalyticsEvent = useAnalyticsEvent();

  const handleOnClick = () => {
    trackAnalyticsEvent(AnalyticsEvent.JOIN_WAITLIST_CLICKED);
    return window.open(WAITLIST_MAILCHIMP_FORM_URL, "_blank");
  };

  return (
    <Button className="bg-pink text-blue" onClick={handleOnClick}>
      Get 2 Months Free
    </Button>
  );
};
