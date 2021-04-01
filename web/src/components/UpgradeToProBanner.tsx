import * as React from "react";
import moment from "moment";
import { PawIcon } from "../images/PawIcon";
import { Button } from "./Button";
import { useOpenBillingPortal } from "../hooks/use-open-billing-portal";

interface UpgradeToProBannerProps {
  trialEnd: number | null;
  workspaceId: string;
}

export const UpgradeToProBanner: React.FC<UpgradeToProBannerProps> = ({
  trialEnd,
  workspaceId
}) => {
  const { openBillingPortalFn, isOpeningPortal, error, isLoading } = useOpenBillingPortal(
    workspaceId
  );

  if (!trialEnd || isLoading || error) {
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
      <Button
        className="text-red"
        onClick={openBillingPortalFn}
        disabled={isOpeningPortal}
        style={{ maxWidth: "8rem" }}
      >
        {isOpeningPortal ? "Loading" : "Upgrade"}
      </Button>
    </div>
  );
};
