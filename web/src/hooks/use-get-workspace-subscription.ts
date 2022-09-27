import * as React from "react";
import { getStripeSubscription } from "../services/stripe-service";
import * as Sentry from "@sentry/react";

export function useGetWorkspaceSubscription(
  workspaceId?: string,
  subscriptionId?: string
) {
  const [subscription, setSubscription] = React.useState<any | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    if (workspaceId) {
      setIsLoading(true);
      getStripeSubscription(workspaceId)
        .then(
          (response) => setSubscription(response.data),
          (error) => Sentry.captureException(error)
        )
        .then(() => setIsLoading(false));
    }
  }, [workspaceId, subscriptionId]);
  return { subscription, isLoading };
}
