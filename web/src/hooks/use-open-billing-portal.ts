import * as React from "react";
import { useRouteMatch } from "react-router-dom";
import { createStripeBillingPortalSession } from "../services/stripe-service";

/**
 * React hook that creates a Stripe Billing Portal session.
 * The Billing Portal is used to manage a workspace's subscription and payment settings.
 */
export function useOpenBillingPortal(workspaceId: string, returnUrl?: string) {
  const isOpeningPortalRef = React.useRef(false);
  const match = useRouteMatch();
  const [data, setData] = React.useState<any>(null);
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // As soon as this hook mounts, we create the billing portal session
  // so the user doesn't have to wait for it to load.
  React.useEffect(() => {
    setIsLoading(true);
    createStripeBillingPortalSession({
      workspaceId,
      returnUrl: `${process.env.REACT_APP_RETRO_BASE_URL}${returnUrl || match.url}`
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
  }, [workspaceId, returnUrl, match.url]);

  const openBillingPortalFn = async () => {
    isOpeningPortalRef.current = true;
    if (!data || !data.url) {
      return;
    }
    window.location.replace(data.url);
    return;
  };

  // FIXME: isOpeningPortal is never updating.
  return {
    error,
    isLoading,
    openBillingPortalFn,
    isOpeningPortal: isOpeningPortalRef.current
  };
}
