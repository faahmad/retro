import { createStripeCheckoutSession } from "../services/stripe-service";
import * as React from "react";
import { Button } from "./Button";
import { useAnalyticsEvent, AnalyticsEvent } from "../hooks/use-analytics-event";

export function ButtonCheckoutSession({ workspaceId }: { workspaceId: string }) {
  const track = useAnalyticsEvent();

  async function handleClick() {
    const response = await createStripeCheckoutSession({
      workspaceId,
      returnUrl: window.location.href,
      mode: "subscription"
    });

    const session = response.data;

    if (!session || !session.url) {
      // TODO: Throw an error.
      return;
    }

    track(AnalyticsEvent.CHECKOUT_SESSION_CLICKED, {
      workspaceId,
      subscriptionStatus: "canceled"
    });

    window.location.replace(session.url);
  }

  return (
    <Button
      onClick={handleClick}
      style={{ maxWidth: "8rem" }}
      className="flex-2 bg-blue text-white border-white shadow-blue"
    >
      Upgrade
    </Button>
  );
}
