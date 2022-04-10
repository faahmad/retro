import * as React from "react";
import { PawIcon } from "../images/PawIcon";
import { Button } from "./Button";
import { useOpenBillingPortal } from "../hooks/use-open-billing-portal";

interface UpgradeToProBannerProps {
  workspaceId: string;
}

export const BannerTrialEnded: React.FC<UpgradeToProBannerProps> = ({ workspaceId }) => {
  const { openBillingPortalFn, isOpeningPortal, error, isLoading } = useOpenBillingPortal(
    workspaceId
  );

  if (isLoading || error) {
    return null;
  }

  return (
    <div className="flex justify-between items-center text-blue my-2 p-4 bg-white border shadow flex-wrap">
      <div className="flex flex-wrap items-center">
        <PawIcon />
        <div className="pl-2">
          <p className="font-black">Your free trial has ended</p>
          <p className="text-sm">
            Please subscribe to a plan to continue having retrospectives.
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
