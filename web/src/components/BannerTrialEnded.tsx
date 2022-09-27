import * as React from "react";
import { PawIcon } from "../images/PawIcon";
import { Button } from "./Button";
import { useOpenBillingPortal } from "../hooks/use-open-billing-portal";

interface UpgradeToProBannerProps {
  workspaceId: string;
  isWorkspaceAdmin: boolean;
}

export function BannerTrialEnded(props: UpgradeToProBannerProps) {
  return props.isWorkspaceAdmin ? (
    <BannerTrialEndedAdmin workspaceId={props.workspaceId} />
  ) : (
    <BannerTrialEndedMember />
  );
}

const BannerTrialEndedAdmin = ({ workspaceId }: { workspaceId: string }) => {
  const { openBillingPortalFn, isOpeningPortal, error, isLoading } = useOpenBillingPortal(
    workspaceId
  );

  if (isLoading || error) {
    return null;
  }

  return (
    <div className="flex justify-between items-center text-blue my-2 p-4 bg-red text-white border shadow shadow-red flex-wrap">
      <div className="flex flex-wrap items-center">
        <PawIcon />
        <div className="pl-2">
          <p className="font-black">Your team's free trial has ended</p>
          <p className="text-sm mb-2 md:mb-0">
            You can still read all of your retros, but you'll have to sign up for an
            account to create new ones.
          </p>
        </div>
      </div>
      <Button
        className="text-white bg-blue shadow-blue"
        onClick={openBillingPortalFn}
        disabled={isOpeningPortal}
        style={{ maxWidth: "8rem" }}
      >
        {isOpeningPortal ? "Loading" : "Upgrade"}
      </Button>
    </div>
  );
};

const BannerTrialEndedMember = () => {
  return (
    <div className="flex justify-between items-center text-blue my-2 p-4 bg-red text-white border shadow shadow-red flex-wrap">
      <div className="flex flex-wrap items-center">
        <PawIcon />
        <div className="pl-2">
          <p className="font-black">Your team's free trial has ended</p>
          <p className="text-sm mb-2 md:mb-0">
            Please ask an account admin to upgrade your account
          </p>
        </div>
      </div>
    </div>
  );
};
