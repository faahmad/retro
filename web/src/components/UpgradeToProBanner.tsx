import * as React from "react";
import moment from "moment";
import { PawIcon } from "../images/PawIcon";
import { Button } from "./Button";
import { createStripeCheckoutSession } from "../services/stripe";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || ""
);

interface UpgradeToProBannerProps {
  trialEnd: number;
  workspaceId: string;
}
export const UpgradeToProBanner: React.FC<UpgradeToProBannerProps> = ({
  trialEnd,
  workspaceId,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleOpenStripeCheckSession = async () => {
    setIsLoading(true);
    const { data } = await createStripeCheckoutSession({
      workspaceId,
      successUrl: `http://localhost:3000/workspaces/${workspaceId}`,
      cancelUrl: `http://localhost:3000/workspaces/${workspaceId}`,
    });
    debugger;
    const sessionId = data.id;
    const stripe = await stripePromise;
    const response = await stripe?.redirectToCheckout({
      sessionId,
    });
    console.log(response);
    setIsLoading(false);
    return;
  };

  return (
    <div className="flex justify-between items-center text-blue my-2 p-4 bg-white border shadow flex-wrap">
      <div className="flex flex-wrap items-center">
        <PawIcon />
        <div className="pl-2">
          <p className="font-black">Upgrade to PRO</p>
          <p className="text-sm">
            Your free trial ends {moment.unix(trialEnd).fromNow()}. Upgrade to
            PRO to keep leveling up your team.
          </p>
        </div>
      </div>
      <Button
        className="text-red"
        onClick={handleOpenStripeCheckSession}
        disabled={isLoading}
        style={{ maxWidth: "8rem" }}
      >
        {isLoading ? "Loading" : "Upgrade"}
      </Button>
    </div>
  );
};
