import * as React from "react";
import { Button } from "./Button";
import analytics from "analytics.js";

const WAITLIST_FORM_URL = "https://forms.gle/F4cYbHjv1J9zGPhj8";

export const JoinWaitlistButton = () => {
  const handleOnClick = () => {
    analytics.track("Clicked Join Waitlist");
    return window.open(WAITLIST_FORM_URL, "_blank");
  };

  return (
    <Button className="bg-pink text-blue" onClick={handleOnClick}>
      Get 2 Months Free
    </Button>
  );
};
