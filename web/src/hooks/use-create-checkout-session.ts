import * as React from "react";
import { useRouteMatch } from "react-router-dom";
import { createStripeCheckoutSession } from "../services/stripe-service";

/**
 * React hook that creates a Stripe Billing Portal session.
 * The Billing Portal is used to manage a workspace's subscription and payment settings.
 */
export function useCreateCheckoutSession(
  workspaceId: string,
  successUrl: string,
  cancelUrl: string,
  status: "trialing" | "canceled"
) {
  const match = useRouteMatch();
  const [data, setData] = React.useState<any>(null);
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // As soon as this hook mounts, we create the billing portal session
  // so the user doesn't have to wait for it to load.
  React.useEffect(() => {
    setIsLoading(true);
    createStripeCheckoutSession({
      workspaceId,
      successUrl,
      cancelUrl,
      status
    })
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
        return;
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
        return;
      });
  }, [workspaceId, successUrl, cancelUrl, status, match.url]);

  const createCheckoutSessionFn = async () => {
    if (!data || !data.url) {
      return;
    }
    window.location.replace(data.url);
    return;
  };

  return {
    error,
    isLoading,
    createCheckoutSessionFn
  };
}
