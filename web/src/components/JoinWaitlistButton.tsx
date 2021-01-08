import * as React from "react";
import { Button } from "./Button";
import { useAnalyticsEvent, AnalyticsEvent } from "../hooks/use-analytics-event";

const WAITLIST_FORM_URL = "https://forms.gle/F4cYbHjv1J9zGPhj8";

export const JoinWaitlistButton = () => {
  const trackAnalyticsEvent = useAnalyticsEvent();

  const handleOnClick = () => {
    trackAnalyticsEvent(AnalyticsEvent.JOIN_WAITLIST_CLICKED);
    return window.open(WAITLIST_FORM_URL, "_blank");
  };

  return (
    <Button className="bg-pink text-blue" onClick={handleOnClick}>
      Get 2 Months Free
    </Button>
  );
};
