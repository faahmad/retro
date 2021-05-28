import * as React from "react";
import { getStripeSubscription } from "../services/stripe-service";

export function useGetWorkspaceSubscription(workspaceId?: string) {
  const [subscription, setSubscription] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    if (workspaceId) {
      setIsLoading(true);
      getStripeSubscription(workspaceId)
        .then((response) => setSubscription(response.data))
        .then(() => setIsLoading(false));
    }
  }, [workspaceId]);
  return { subscription, isLoading };
}
