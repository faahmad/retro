import { StripeSubscriptionStatus } from "../types/stripe-subscription-status";
import { createStripeCheckoutSession } from "../services/stripe-service";
import * as React from "react";
import { Button } from "./Button";

export function ButtonCheckoutSession({
  workspaceId,
  subscriptionStatus
}: {
  workspaceId: string;
  subscriptionStatus: StripeSubscriptionStatus;
}) {
  const returnUrl = `http://localhost:3000/workspaces/${workspaceId}`;

  const statusToModeMap: {
    [key in StripeSubscriptionStatus]: "setup" | "subscription";
  } = {
    trialing: "setup",
    past_due: "setup",
    canceled: "subscription",
    active: "subscription"
  };

  async function handleClick() {
    const response = await createStripeCheckoutSession({
      workspaceId,
      returnUrl,
      mode: statusToModeMap[subscriptionStatus]
    });

    const session = response.data;

    if (!session || !session.url) {
      // TODO: Throw an error.
      return;
    }

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
