import * as React from "react";
import moment from "moment";
import { PawIcon } from "../images/PawIcon";
import { useCreateCheckoutSession } from "../hooks/use-create-checkout-session";

interface UpgradeToProBannerProps {
  trialEnd: number | null;
  workspaceId: string;
  status: "trialing" | "canceled";
}

export const UpgradeToProBanner: React.FC<UpgradeToProBannerProps> = ({
  trialEnd,
  workspaceId,
  status
}) => {
  const returnUrl = `http://localhost:3000/workspaces/${workspaceId}`;

  const { createCheckoutSessionFn, error, isLoading } = useCreateCheckoutSession(
    workspaceId,
    returnUrl,
    returnUrl,
    status
  );

  if (!trialEnd || error || isLoading) {
    return null;
  }

  return (
    <div className="flex justify-between items-center text-blue my-2 p-4 bg-white border shadow flex-wrap">
      <div className="flex flex-wrap items-center">
        <PawIcon />
        <div className="pl-2">
          <p className="font-black">Upgrade to PRO</p>
          <p className="text-sm">
            Your free trial ends {moment.unix(trialEnd).fromNow()}. Upgrade to PRO to keep
            leveling up your team.
          </p>
        </div>
      </div>

      <button type="submit" onClick={createCheckoutSessionFn}>
        Upgrade
      </button>
    </div>
  );
};
