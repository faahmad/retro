import { StripeSubscriptionStatus } from "../types/stripe-subscription-status";
import { createStripeBillingPortalSession } from "../services/stripe-service";
import * as React from "react";
import { Button } from "./Button";
import { useAnalyticsEvent, AnalyticsEvent } from "../hooks/use-analytics-event";

export function ButtonBillingPortalSession({
  workspaceId
}: {
  workspaceId: string;
  subscriptionStatus: StripeSubscriptionStatus;
}) {
  const returnUrl = window.location.href;
  const track = useAnalyticsEvent();

  async function handleClick() {
    const response = await createStripeBillingPortalSession({
      workspaceId,
      returnUrl
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
      Update
    </Button>
  );
}
