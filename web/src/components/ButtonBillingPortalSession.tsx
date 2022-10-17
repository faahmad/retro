import { createStripeBillingPortalSession } from "../services/stripe-service";
import * as React from "react";
import { Button } from "./Button";
import { useAnalyticsEvent, AnalyticsEvent } from "../hooks/use-analytics-event";

export function ButtonBillingPortalSession({ workspaceId }: { workspaceId: string }) {
  const [loading, setLoading] = React.useState(false);
  const track = useAnalyticsEvent();

  async function handleClick() {
    setLoading(true);
    const response = await createStripeBillingPortalSession({
      workspaceId,
      returnUrl: window.location.href
    });

    const session = response.data;

    if (!session || !session.url) {
      // TODO: Throw an error.
      return;
    }

    track(AnalyticsEvent.BILLING_PORTAL_CLICKED, { workspaceId });

    window.location.replace(session.url);
  }

  return (
    <Button
      onClick={handleClick}
      style={{ maxWidth: "8rem" }}
      className="flex-2 bg-white text-blue border-blue shadow-blue"
    >
      {!loading ? "Update" : "Loading..."}
    </Button>
  );
}
